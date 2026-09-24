import { useEffect, useState } from 'react'
import type { Lifetime, Session } from '../types'
import { stageLabel } from '../lib/session'

type Props = {
  life: Lifetime
  saved: Session | null
  onStart: (hardMode: boolean) => void
  onContinue: () => void
}

export function Briefing({ life, saved, onStart, onContinue }: Props) {
  const [hard, setHard] = useState(life.hardModeUnlocked)
  const returning = life.sessionsCompleted > 0

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        if (saved) onContinue()
        else onStart(hard)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hard, onStart, saved, onContinue])

  return (
    <div className="hud-grid min-h-[calc(100svh-88px)]">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
        <div>
          <p className="mono text-xs tracking-[0.35em] text-[#f0b429]">
            GULLIVER · ALG 2 HONORS · PINECREST
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight text-[#e8eef6] md:text-6xl">
            LEO OPS
          </h1>
          <p className="mono mt-2 text-xl text-[#3ee0c5]">RATES // average rate of change</p>
        </div>

        <div className="rounded-lg border border-[#243044] bg-[#101722]/90 p-5">
          <p className="text-[15px] leading-relaxed text-[#c9d4e5]">
            Callsign Leo. Fifteen minutes. One cistern. The graph is the field.
          </p>
          <p className="mt-4 mono text-sm text-[#3ee0c5]">
            (f(b) − f(a)) / (b − a)
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-[#c9d4e5]">
            Average rate is the slope of the <em>secant</em> through two times — not the whole
            graph. Units live on the answer. Sign is a story: + filling, − draining, 0 holding.
          </p>
          <ol className="mt-4 space-y-1 text-sm text-[#8b9bb4]">
            <li>01  Three warm-up shots</li>
            <li>02  Cistern Ops — lock windows, compute ΔV/Δt</li>
            <li>03  Slope Duel — 12-second calls</li>
            <li>04  Boss check shaped like Topic 1 Part 6</li>
          </ol>
        </div>

        {returning && (
          <div className="rounded-md border border-[#243044] bg-[#0c1118] px-4 py-3 text-sm text-[#8b9bb4]">
            Last run: {Math.round(life.bestAccuracy * 100)}% best accuracy · streak{' '}
            {life.bestStreak}
            {life.lastTip ? ` · ${life.lastTip}` : ''}
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-[#c9d4e5]">
          <input
            type="checkbox"
            checked={hard}
            onChange={(e) => setHard(e.target.checked)}
            className="accent-[#f0b429]"
          />
          Hard Mode — piecewise corners, closed endpoints
          {!life.hardModeUnlocked && (
            <span className="mono text-[11px] text-[#8b9bb4]">(unlock in-run with 3 fast hits)</span>
          )}
        </label>

        <div className="flex flex-wrap gap-3">
          {saved && (
            <button
              type="button"
              onClick={onContinue}
              className="engage rounded-md bg-[#3ee0c5] px-8 py-3 text-sm font-semibold tracking-wide text-[#07090d]"
            >
              CONTINUE {stageLabel(saved.stage).toUpperCase()}
            </button>
          )}
          <button
            type="button"
            onClick={() => onStart(hard)}
            className="rounded-md border border-[#3ee0c5] px-8 py-3 text-sm font-semibold tracking-wide text-[#3ee0c5]"
          >
            {saved ? 'NEW SESSION' : 'ENGAGE  ·  Enter'}
          </button>
        </div>
      </div>
    </div>
  )
}
