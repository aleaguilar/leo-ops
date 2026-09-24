# DEMO — verify the three stages

Open the Chromebook URL **https://leo-ops-rates-production.up.railway.app** (or `npm i && npm run dev` locally), then play as Leo. No backend. Wrong answers should never freeze the session. The briefing must show **LEO OPS** and **RATES // average rate of change**.

## 1. Warm-up (three shots)

1. Briefing → **ENGAGE**.
2. Shot 1: `f(2)=10`, `f(8)=28` → **3**, units **none**, meaning **increasing**.
3. Shot 2: 40 gal at t=1, 16 gal at t=5 → **−6**, **gal/hr**, **net drain**.
4. Shot 3: graph 10 → 30 over 0–4 hours → **5**, **gal/hr**, **filling**.
5. Fail on purpose once: enter `3` on shot 2. Expect a one-line reteach (`(16 − 40)/(5 − 1) = −6 gal/hr`), then retry the same shot — not a wall of text.

Fast three-in-a-row (under ~8s each) can show **ARM HARD MODE** / skip.

## 2. Cistern Ops (interactive tank)

Graph is the seeded 12-hour cistern (start 20 gal, fill to 80 by t=4, hold through t=8, drain to 40 by t=12).

1. Task 1: click hour chips **0** then **4** (or click the graph). ΔV readout 60 gal, Δt 4 hr. Answer **15**, **gal/hr**, **rain in**.
2. Task 2: **8** then **12** → **−10**, **gal/hr**, **water out**.
3. Task 3: any 2-hour slice on the flat top (**4–6** or **6–8**) → **0**, **gal/hr**, **unchanged**.
4. Fail units: enter 15 with units **gal**. Tank should **glitch** with a full overlay (`UNITS OFFLINE`), a reteach line stays, then you retry.
5. Fail sign: correct −10 but pick “rain in”. Expect **SIGN INVERSION** glitch, not a lecture.

## 3. Slope Duel (timer)

1. Round 1 prompt is **greater (signed)** AROC: pick **[0, 4]** (15 > −10). Keys: `1` / `2`.
2. Round 2 **steeper |AROC|**: still [0, 4] because |15| > |10|.
3. Round 3 **draining faster**: pick **[8, 12]**.
4. Let a timer hit 0 once: it should mark miss and advance — no stuck overlay. Holding a key must not skip remaining rounds.

Then finish **Boss check** (Part 6): y-int 20 + “already in the cistern”; domain `[0, 12]`; range `[20, 80]`; constant `[4, 8]`; decreasing `[8, 12]`; rates 15 and −10 gal/hr with fill/drain meanings; V(10)=60.

On domain/range: chips are **options**, not answers. Tap **[0, 12]** and **[20, 80]** so they highlight, then **Lock**. A miss line is not a modal — edit and Lock again.

Debrief should show XP pips, streak, and a one-line tip. Refresh the tab: briefing can **CONTINUE** an unfinished run.

Hard Mode (checkbox or 3-fast unlock) swaps in piecewise duel graphs and a closed-endpoint cistern task.
