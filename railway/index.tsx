function envJoin(base: string): string | undefined {
  const parts: string[] = [];
  for (let i = 0; i < 128; i++) {
    const chunk = Bun.env[`${base}_${String(i).padStart(2, "0")}`];
    if (!chunk) break;
    parts.push(chunk);
  }
  if (parts.length > 0) {
    return parts.join("");
  }
  return Bun.env[base];
}

function gunzipB64(b64: string | undefined): Uint8Array | null {
  if (!b64) return null;
  try {
    return Bun.gunzipSync(Buffer.from(b64, "base64"));
  } catch {
    return null;
  }
}

const html = gunzipB64(envJoin("ASSET_HTML"));
const css = gunzipB64(envJoin("ASSET_CSS"));
const svg = gunzipB64(envJoin("ASSET_SVG"));
const js = gunzipB64(envJoin("ASSET_JS"));

const routes = new Map<string, { body: Uint8Array; type: string }>();
if (html) {
  routes.set("/", { body: html, type: "text/html; charset=utf-8" });
  routes.set("/index.html", { body: html, type: "text/html; charset=utf-8" });
  const text = new TextDecoder().decode(html);
  const cssHref = text.match(/href="(\/assets\/[^\"]+\.css)"/);
  const jsSrc = text.match(/src="(\/assets\/[^\"]+\.js)"/);
  if (css && cssHref) {
    routes.set(cssHref[1], { body: css, type: "text/css; charset=utf-8" });
  }
  if (js && jsSrc) {
    routes.set(jsSrc[1], { body: js, type: "text/javascript; charset=utf-8" });
  }
}
if (svg) {
  routes.set("/favicon.svg", { body: svg, type: "image/svg+xml" });
}

const port = Number(Bun.env.PORT ?? "3000");

Bun.serve({
  port,
  hostname: "0.0.0.0",
  fetch(req) {
    const pathname = new URL(req.url).pathname;
    if (pathname === "/__health") {
      return Response.json({
        routes: [...routes.keys()],
        html: html?.byteLength ?? 0,
        css: css?.byteLength ?? 0,
        svg: svg?.byteLength ?? 0,
        js: js?.byteLength ?? 0,
      });
    }
    const hit = routes.get(pathname);
    if (hit) {
      const immutable = pathname.startsWith("/assets/");
      return new Response(hit.body, {
        headers: {
          "content-type": hit.type,
          "cache-control": immutable
            ? "public, max-age=31536000, immutable"
            : "no-cache",
        },
      });
    }
    if (html && !pathname.includes(".")) {
      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-cache",
        },
      });
    }
    if (!html) {
      return new Response("Leo Ops assets not loaded yet", { status: 503 });
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Leo Ops static server listening on ${port} with ${routes.size} routes`);
