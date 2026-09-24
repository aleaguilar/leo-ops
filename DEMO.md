# DEMO — verify Flood Control

Open **https://leo-ops-rates-production.up.railway.app** (or `npm i && npm run dev` locally). The briefing must say **FLOOD CONTROL**, not the old quiz “LEO OPS / RATES” march. Play as Leo. No backend.

## 1. Briefing

Copy is one beat: storm inbound, you run the pumps, rates keep Pinecrest dry. **ENGAGE · Enter** starts Wave 1 immediately. There is no warm-up quiz, slope duel, or boss form.

## 2. Wave 1 — rate judgment moves the tank

1. Watch the graph grow and the tank rise (calm rain, +8 gal/hr from 42 gal).
2. At ~t = 2 h a **RATE CALL** locks window [0, 2]. ΔV readout should be about +16 gal over 2 h → **8 gal/hr**, units **gal/hr**, sign **+ filling**.
3. Tap **HOLD** (freeze) or **OPEN DRAIN**. Tank net rate in the HUD must change. HOLD keeps volume flat; DRAIN pulls it down.
4. Fail on purpose once: enter `8` with units **gal**, or pick **− draining**. Expect a glitch overlay (`UNITS OFFLINE` / `SIGN INVERSION`) and a weak or inverted pump — volume should move the wrong way or barely move, not a text essay.
5. Two correct calls under ~8s each skip remaining calls on that wave (`HOLD LOCKED` in the HUD).

Overflow (~80 gal) or dry (~0) fails the wave. **RETRY WAVE** or **AFTER ACTION**.

## 3. Wave 2 — spike

Hold weather, then +16 gal/hr rain. First call window is flat (AROC **0**, holding). Second call covers the spike (about **+16 gal/hr**, filling) — **OPEN DRAIN** or the tank climbs out of the 30–70 band.

## 4. Wave 3 — Part 6 crisis

Uncontrolled weather is the seeded cistern: start 20 gal, **+15 gal/hr** to t = 4, hold to t = 8, **−10 gal/hr** to t = 12. Win by surviving in band with correct AROC calls on those windows — not by filling a five-part worksheet.

- [0, 2] (or [0, 4]): **15 gal/hr** filling → HOLD or DRAIN so you never hit 80.
- [4, 6]: **0 gal/hr** holding.
- [8, 10]: **−10 gal/hr** draining → FILL BOOST if the tank is sliding toward empty.

After-action shows score (time-in-band + call accuracy) and one tip. Refresh: briefing again, best score remembered.
