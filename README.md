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

### On this project (dev)

Need Node.js 20+. In the project folder:

```bash
npm i && npm run dev
```

Chrome (or Chromebook) → the local URL Vite prints (this repo’s default is http://localhost:4721).

### Static files (no install after build)

```bash
npm i && npm run build
npm run preview
```

`dist/` is a static site. Copy that folder to Google Drive / a USB stick / any static host and open `index.html` from a local server (Chrome may block `file://` module loads — use `npm run preview` or any static server).

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

See `DEMO.md` for how to verify the three main stages.
