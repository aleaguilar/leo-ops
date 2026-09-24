const port = Number(Bun.env.PORT ?? "3000");
const token = Bun.env.UPLOAD_TOKEN ?? "";

const s3 = new Bun.S3Client({
  accessKeyId: Bun.env.S3_ACCESS_KEY_ID,
  secretAccessKey: Bun.env.S3_SECRET_ACCESS_KEY,
  bucket: Bun.env.S3_BUCKET,
  endpoint: Bun.env.S3_ENDPOINT,
  region: Bun.env.S3_REGION ?? "auto",
});

function objectKey(pathname: string): string {
  if (pathname === "/" || pathname === "") {
    return "index.html";
  }
  return decodeURIComponent(pathname.replace(/^\//, ""));
}

function typeFor(key: string): string {
  if (key.endsWith(".html")) return "text/html; charset=utf-8";
  if (key.endsWith(".css")) return "text/css; charset=utf-8";
  if (key.endsWith(".js") || key.endsWith(".mjs")) {
    return "text/javascript; charset=utf-8";
  }
  if (key.endsWith(".svg")) return "image/svg+xml";
  if (key.endsWith(".json")) return "application/json; charset=utf-8";
  if (key.endsWith(".ico")) return "image/x-icon";
  if (key.endsWith(".woff2")) return "font/woff2";
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

function isSafeKey(key: string): boolean {
  if (!key || key.length > 200) return false;
  if (key.includes("..") || key.startsWith("/") || key.includes("\\")) {
    return false;
  }
  return /^[A-Za-z0-9._/\-]+$/.test(key);
}

function s3Ready(): { ok: true } | { ok: false; missing: string[] } {
  const missing: string[] = [];
  if (!Bun.env.S3_ACCESS_KEY_ID) missing.push("S3_ACCESS_KEY_ID");
  if (!Bun.env.S3_SECRET_ACCESS_KEY) missing.push("S3_SECRET_ACCESS_KEY");
  if (!Bun.env.S3_BUCKET) missing.push("S3_BUCKET");
  if (!Bun.env.S3_ENDPOINT) missing.push("S3_ENDPOINT");
  if (missing.length > 0) return { ok: false, missing };
  return { ok: true };
}

async function assetStat(key: string): Promise<{ key: string; exists: boolean; size: number }> {
  try {
    const file = s3.file(key);
    const exists = await file.exists();
    return { key, exists, size: exists ? file.size : 0 };
  } catch {
    return { key, exists: false, size: 0 };
  }
}

Bun.serve({
  port,
  hostname: "0.0.0.0",
  async fetch(req) {
    const pathname = new URL(req.url).pathname;

    if (pathname === "/__health") {
      const ready = s3Ready();
      if (!ready.ok) {
        return Response.json(
          {
            ok: false,
            mode: "s3",
            missing: ready.missing,
            hasUploadToken: token.length > 0,
          },
          { status: 503 },
        );
      }
      try {
        const listed = await s3.list({ prefix: "", maxKeys: 50 });
        const contents = listed.contents ?? [];
        const keys = contents.map((item) => item.key ?? "").filter(Boolean);
        const html = await assetStat("index.html");
        const svg = await assetStat("favicon.svg");
        return Response.json({
          ok: html.exists,
          mode: "s3",
          bucket: Bun.env.S3_BUCKET,
          region: Bun.env.S3_REGION ?? "auto",
          endpoint: Bun.env.S3_ENDPOINT,
          hasUploadToken: token.length > 0,
          html: html.size,
          svg: svg.size,
          objects: contents.map((item) => ({
            key: item.key,
            size: item.size,
          })),
          keys,
        });
      } catch (err) {
        return Response.json(
          {
            ok: false,
            mode: "s3",
            s3Error: err instanceof Error ? err.message : String(err),
            hasUploadToken: token.length > 0,
            bucket: Boolean(Bun.env.S3_BUCKET),
            endpoint: Bun.env.S3_ENDPOINT ?? null,
          },
          { status: 503 },
        );
      }
    }

    if (pathname.startsWith("/__upload/")) {
      if (req.method !== "PUT" && req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }
      const auth = req.headers.get("authorization") ?? "";
      if (!token || auth !== `Bearer ${token}`) {
        return new Response("Unauthorized", { status: 401 });
      }
      const ready = s3Ready();
      if (!ready.ok) {
        return Response.json({ ok: false, missing: ready.missing }, { status: 503 });
      }
      const key = decodeURIComponent(pathname.slice("/__upload/".length));
      if (!isSafeKey(key)) {
        return new Response("Bad key", { status: 400 });
      }
      const body = Buffer.from(await req.arrayBuffer());
      if (body.byteLength === 0) {
        return new Response("Empty body", { status: 400 });
      }
      await s3.write(key, body, { type: typeFor(key) });
      return Response.json({ ok: true, key, bytes: body.byteLength });
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const ready = s3Ready();
    if (!ready.ok) {
      return new Response("Leo Ops storage is not linked yet", { status: 503 });
    }

    let key = objectKey(pathname);
    if (!isSafeKey(key)) {
      return new Response("Not found", { status: 404 });
    }

    let file = s3.file(key);
    let exists = await file.exists();
    if (!exists && !key.includes(".")) {
      key = "index.html";
      file = s3.file(key);
      exists = await file.exists();
    }
    if (!exists) {
      return new Response("Not found", { status: 404 });
    }

    const immutable = key.startsWith("assets/");
    const bytes = await file.arrayBuffer();
    return new Response(bytes, {
      headers: {
        "content-type": typeFor(key),
        "cache-control": immutable
          ? "public, max-age=31536000, immutable"
          : "no-cache",
      },
    });
  },
});

console.log(`Leo Ops S3 static server listening on ${port}`);
