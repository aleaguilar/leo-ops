# Flood Control (Leo Ops — Rates)

A ~5 minute **operator** session on **average rate of change**. Built for Leo (9th grade, Gulliver High School, Pinecrest, FL). Rates are the weapon that keeps a cistern in band — not a quiz march.

No accounts. Progress (best score, wins, Hard Mode) is stored in `localStorage` on this Chromebook.

## What it teaches

Average rate of change is the slope of the secant through two times:

```
(f(b) − f(a)) / (b − a)
```

Every rate call demands **units** (`gal/hr`) and a **sign story** (+ filling, − draining, 0 holding). A wrong read does not print a red essay — it fires a weak or inverted pump and the tank moves.

Crisis wave is the **Topic 1 Test Review, PART 6** cistern:

| t (hr) | weather (gal/hr) | V if you never pump |
|--------|------------------|---------------------|
| 0 | +15 | 20 |
| 4 | 0 (hold) | 80 |
| 8 | −10 | 80 |
| 12 | | 40 |

AROC [0, 4] = **15 gal/hr**. AROC [4, 8] = **0**. AROC [8, 12] = **−10 gal/hr**. Safe band **30–70 gal**. Overflow at 80 or dry at 0 fails the wave.

## How Alejandro can open it for Leo

**Chromebook (no npm):** open

**https://leo-ops-rates-production.up.railway.app**

Bookmark it. Best run stays on this Chromebook.

### How to play (dad card)

1. **ENGAGE.** Storm inbound. You run the pumps.
2. Watch volume vs time and the tank. Green band is 30–70 gal.
3. When **RATE CALL** hits, lock a time window (or keep the one highlighted). Compute ΔV/Δt.
4. Enter the number, tap **gal/hr**, tap the sign, then **OPEN DRAIN / HOLD / FILL BOOST**. Correct call = full pump. Wrong sign/units/number = weak or inverted pump — the tank shows it.
5. Three waves: calm fill, spike rain, Part 6 crisis. Two fast correct calls skip the rest of that wave. Score = time-in-band + accuracy.

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

### Session flow (~5 min)

1. **Briefing** — one line, ENGAGE
2. **Wave 1 CALM FILL** — steady rain, read the rise
3. **Wave 2 SPIKE RAIN** — hold, then a dump
4. **Wave 3 CRISIS** — Part 6 cistern weather
5. **After-action** — score, time-in-band, one tip

Keyboard: Enter to engage. On a call, tap the graph to set the window, then the pump buttons.

Hard Mode (unlocked after a win): piecewise rain on wave 1, tighter call clock, no ΔV readout — read endpoints off the graph.

## Scripts

| command | what |
|---------|------|
| `npm i && npm run dev` | local play |
| `npm run build` | typecheck + static `dist/` |
| `npm run preview` | serve `dist/` |
| `python3 scripts/push-railway-dist.py` | PUT `dist/` to the live Function (`LEO_OPS_UPLOAD_TOKEN`) |
| `python3 scripts/pack-railway-assets.py` | gzip+base64 `dist/` into env chunks (legacy fallback) |

See `DEMO.md` for how to verify the operator loop.
