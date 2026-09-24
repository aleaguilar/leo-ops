# Leo Ops — Rates

A ~15 minute Algebra 2 Honors mission on **average rate of change**. Built for Leo (9th grade, Gulliver High School, Pinecrest, FL): sharp, easily bored, computer-led — not a worksheet.

No accounts. Everything runs in the browser. Progress (XP, streak, last tip, in-progress session) is stored in `localStorage` on this Chromebook.

## What a session teaches

Average rate of change is the slope of the secant through two times:

```
(f(b) − f(a)) / (b − a)
```

Every rate answer also demands **units** (usually `gal/hr`) and a **sign story** (+ filling, − draining, 0 holding). Interval notation shows up where it supports the cistern: domain, range, constant / decreasing windows.

The boss check is shaped like **Topic 1 Test Review, PART 6** (rainwater cistern): y-intercept meaning, domain/range, constant vs decreasing, AROC from t = 0 to 4 and t = 8 to 12, volume at t = 10.

Seeded cistern (piecewise linear, PDF-style axes 0–12 h, 0–80 gal):

| t (hr) | V (gal) |
|--------|---------|
| 0 | 20 |
| 2 | 50 |
| 4 | 80 |
| 8 | 80 |
| 10 | 60 |
| 12 | 40 |

AROC [0, 4] = **15 gal/hr** (filling). AROC [8, 12] = **−10 gal/hr** (draining). Constant on **[4, 8]**. V(10) = **60**.

## How Alejandro can open it for Leo

**Chromebook (no npm):** open

**https://leo-ops-rates-production.up.railway.app**

That is a public HTTPS page. Bookmark it. Progress stays in this Chromebook’s browser (`localStorage`).

### Redeploy later (after you change the mission)

The live site is a Railway Function that proxies the Vite `dist/` files from the `leo-ops-assets` bucket.

```bash
npm i && npm run build
LEO_OPS_UPLOAD_TOKEN='…' python3 scripts/push-railway-dist.py
```

`LEO_OPS_UPLOAD_TOKEN` is the `UPLOAD_TOKEN` variable on Railway service `leo-ops-rates` (copy it from the Variables tab — do not paste it into chat). Optional: `LEO_OPS_URL` defaults to the public URL above.

Health check: `https://leo-ops-rates-production.up.railway.app/__health` should report `"ok": true` and list `index.html`, the CSS, and the JS.

If you change `railway/index.tsx`, push that file as the Function source and redeploy, then run `push-railway-dist.py` again.

Cloudflare Pages would be simpler (`npx wrangler pages deploy dist`) but this environment has **no `CLOUDFLARE_API_TOKEN` / wrangler login**. Netlify Drop / CLI has **no `NETLIFY_AUTH_TOKEN`**. Do not send those into chat if a Railway upload still works.

### On this project (dev)

Need Node.js 20+. In the project folder:

```bash
npm i && npm run dev
```

Chrome (or Chromebook) → the local URL Vite prints (this repo’s default is http://localhost:4721).

### Static files (local preview)

```bash
npm i && npm run build
npm run preview
```

`dist/` is the same static site the Railway Function serves from the bucket.

### Session flow (~15 min)

1. **Briefing** — formula, no lecture
2. **Warm-up** — 3 AROC shots (wrong → one-sentence reteach, retry)
3. **Cistern Ops** — pick time windows, compute ΔV/Δt, units + sign. Wrong sign/units glitches the tank
4. **Slope Duel** — 12-second calls: greater vs steeper vs draining faster
5. **Boss check** — Part 6 cistern application
6. **Debrief** — Rate Sense / Units / Sign Meaning / Interval Notation XP, streak, one-line next-session tip

Three correct answers in a row, fast, unlocks **Hard Mode** (piecewise / closed endpoints) or skip remaining work in that stage.

Keyboard: Enter to engage, number keys on duel (1 / 2 or A / D), hour chips on the cistern, arrows when the graph is focused.

## Scripts

| command | what |
|---------|------|
| `npm i && npm run dev` | local play |
| `npm run build` | typecheck + static `dist/` |
| `npm run preview` | serve `dist/` |
| `python3 scripts/push-railway-dist.py` | PUT `dist/` to the live Function (`LEO_OPS_UPLOAD_TOKEN`) |
| `python3 scripts/pack-railway-assets.py` | gzip+base64 `dist/` into env chunks (legacy fallback) |

See `DEMO.md` for how to verify the three main stages.
