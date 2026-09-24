import { useEffect, useState } from 'react'
import type { Lifetime } from '../types'

type Props = {
  life: Lifetime
  onStart: (hard: boolean) => void
}

export function Briefing({ life, onStart }: Props) {
  const [hard, setHard] = useState(life.hardModeUnlocked && life.wins > 0)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter') onStart(hard)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hard, onStart])

  return (
    <div className="hud-grid min-h-svh">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-16">
        <div>
          <p className="mono text-xs tracking-[0.35em] text-[#f0b429]">
            PINECREST · CISTERN 04 · LIVE
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight text-[#e8eef6] md:text-6xl">
            FLOOD CONTROL
          </h1>
          <p className="mono mt-2 text-lg text-[#3ee0c5]">LEO OPS // rates as the weapon</p>
        </div>

        <div className="rounded-lg border border-[#243044] bg-[#101722]/90 p-5">
          <p className="text-[17px] leading-relaxed text-[#c9d4e5]">
            Storm inbound. You run the pumps. Average rate of change keeps this
            neighborhood from flooding.
          </p>
          <p className="mono mt-4 text-sm text-[#3ee0c5]">(f(b) − f(a)) / (b − a)</p>
          <p className="mt-3 text-sm text-[#8b9bb4]">
            Scrub a window. Call the rate — number, gal/hr, sign. Then drain, hold, or
            fill. Miss the read and the pump hits wrong. Overflow or dry = fail.
          </p>
        </div>

        {life.runs > 0 && (
          <p className="mono text-xs text-[#8b9bb4]">
            Best {life.bestScore} · band {Math.round(life.bestBand * 100)}% · wins {life.wins}/
            {life.runs}
            {life.lastTip ? ` · ${life.lastTip}` : ''}
          </p>
        )}

        {life.hardModeUnlocked && (
          <label className="flex items-center gap-2 text-sm text-[#c9d4e5]">
            <input
              type="checkbox"
              checked={hard}
              onChange={(e) => setHard(e.target.checked)}
              className="accent-[#f0b429]"
            />
            Hard Mode — piecewise corners, tighter calls
          </label>
        )}

        <div>
          <button
            type="button"
            onClick={() => onStart(hard)}
            className="engage rounded-md bg-[#3ee0c5] px-6 py-3 text-sm font-semibold tracking-wide text-[#07090d]"
          >
            ENGAGE · Enter
          </button>
        </div>
      </div>
    </div>
  )
}
