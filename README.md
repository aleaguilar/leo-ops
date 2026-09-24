# Leo Ops

Chromebook sessions for Leo (Gulliver, 9th). Three subjects — **Math · History · Biology** — each with **Classic** (short academic checks) and **Interactive** (live system + a WHY gate after you commit).

No accounts. Scores and tips stay in `localStorage` on this Chromebook.

**Live:** https://leo-ops-rates-production.up.railway.app

Interactive skins follow Leo’s worlds: soccer (pitch split-speed), **trading** (fake book, no deposits), **open-world / missions** (routes, districts, hearings, forge/loot). Classic stays cleaner and academic. No real gambling. No crime glorification — mission / map / vehicle-route language only.

## Menu map

### Math — Algebra 2

| Card | Kind | Skin / notes |
|------|------|----------------|
| Classic Rates | Classic | Academic: warmup, cistern, slope duel, Part 6 boss |
| **Trading Desk** | Interactive | **Trading desk.** Price/mark vs time. AROC = momentum. Cut / hold / scale-in. Risk band 30–70. Wrong AROC hurts simulated P&L. WHY → judge → reinforce |
| Classic Transforms | Classic | Name reflect / stretch / shift |
| **Route Editor** | Interactive | **GTA-style mission route.** Shift / stretch / reflect the path onto the yellow drop |
| Classic Piecewise | Classic | Pieces + endpoints; one pitch split-speed check |
| **District Rules** | Interactive | **Open-world zones** (Pitch / Midtown / Docks). Wrong piece = wanted stars / failed delivery |

### History — Abrahamic traditions

| Card | Kind | Skin / notes |
|------|------|----------------|
| Vocab docket | Classic | Abraham, covenant, Torah, Jesus, Testaments |
| **Transfer Hearing** | Interactive | **Transfer negotiation / hearing.** Evidence vs opposing counsel. Serious claims, no violence |
| Reading checks | Classic | Why one God at Ur was a shock |
| **World Map: Ur** | Interactive | **Game-map pins** (not NASA). Tag one-God spark vs pantheon cities |
| Venn + claim | Classic | What Islam shares / changes |
| **Scout Report** | Interactive | Predict the third tradition before the reveal |

### Biology — Chemistry of life

| Card | Kind | Skin / notes |
|------|------|----------------|
| Monomer drills | Classic | Monomer ↔ polymer, dehydration vs hydrolysis |
| **Forge Bench** | Interactive | **Craft / salvage.** three.js molecules. Dehydrate to build, hydrolyze to loot-break |
| Flash ID | Classic | Carb / protein / lipid / nucleic |
| **Loot ID** | Interactive | Timed tag from clues + 3D |
| Group ↔ property | Classic | OH, carboxyl, amino, phosphate |
| **Mod Decoder** | Interactive | **Slap mods on carbon**, predict water. three.js. 2D SVG if WebGL fails |

Every Interactive commit asks **Why did you choose that?** then a 1–3 sentence reinforce.

## Trading Desk (Math Interactive)

Simulated points only — no deposits, no payouts.

```
AROC = (f(b) − f(a)) / (b − a)
```

Units **pts/hr**, sign is the story, then **Cut / Hold / Scale-in**. Risk band **30–70**. Blow 80 or wipe 0 fails the wave. Crisis tape is the Part 6 cistern weather (+15, flat, −10) wearing a book instead of a tank.

Two fast correct calls skip the rest of that wave.

## How Alejandro opens it

Bookmark **https://leo-ops-rates-production.up.railway.app** — no npm on the Chromebook.

### Redeploy (after you change the mission)

```bash
npm i && npm run build
LEO_OPS_UPLOAD_TOKEN='…' python3 scripts/push-railway-dist.py
```

`LEO_OPS_UPLOAD_TOKEN` is `UPLOAD_TOKEN` on Railway service `leo-ops-rates`. Do not paste it into chat.

Health: `https://leo-ops-rates-production.up.railway.app/__health`

### Dev

Node 20+. Default Vite port **4721**.

```bash
npm i && npm run dev
```

```bash
npm run build && npm run preview
```

`dist/` is what the Railway Function serves from the bucket.

## Scripts

| command | what |
|---------|------|
| `npm i && npm run dev` | local play |
| `npm run build` | typecheck + static `dist/` |
| `npm run preview` | serve `dist/` |
| `python3 scripts/push-railway-dist.py` | PUT `dist/` to the live Function |

See `DEMO.md` for a smoke path through the start menu and Trading Desk.
