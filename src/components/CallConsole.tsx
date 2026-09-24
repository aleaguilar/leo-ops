import { MEANING_OPTIONS, PUMP_OPTIONS, UNIT_OPTIONS } from '../data/waves'
import { aroc, formatRate, volumeAt } from '../lib/math'
import type { MeaningId, Point, PumpKind } from '../types'

type Props = {
  points: Point[]
  window: [number, number]
  showDelta: boolean
  rate: string
  onRate: (s: string) => void
  units: string | null
  onUnits: (u: string) => void
  meaning: MeaningId | null
  onMeaning: (id: MeaningId) => void
  onPump: (pump: PumpKind) => void
  disabled?: boolean
}

export function CallConsole({
  points,
  window,
  showDelta,
  rate,
  onRate,
  units,
  onUnits,
  meaning,
  onMeaning,
  onPump,
  disabled = false,
}: Props) {
  const [a, b] = window
  const va = volumeAt(points, a)
  const vb = volumeAt(points, b)
  const dv = vb - va
  const dt = b - a
  const live = aroc(points, a, b)
  const ready = rate.trim() !== '' && units != null && meaning != null && !disabled

  return (
    <div className="rounded-lg border border-[#3ee0c5]/40 bg-[#101722] p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-[#f0b429]">Your call</p>
        <p className="mono text-xs text-[#8b9bb4]">
          window [{formatRate(a)}, {formatRate(b)}]
        </p>
      </div>
      <p className="mt-2 text-sm text-[#c9d4e5]">
        Read the secant, then size the book. Wrong AROC → weak or inverted orders — P&amp;L pays.
      </p>
      {showDelta && (
        <p className="mono mt-2 text-sm text-[#3ee0c5]">
          M({formatRate(a)}) = {formatRate(va)} · M({formatRate(b)}) = {formatRate(vb)} · ΔM{' '}
          {dv >= 0 ? '+' : ''}
          {formatRate(dv)} pts · Δt {formatRate(dt)} hr
        </p>
      )}
      {!showDelta && (
        <p className="mono mt-2 text-xs text-[#8b9bb4]">
          Hard: read endpoints off the graph. Average ignores the steep piece if the window is longer.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="flex min-w-[140px] flex-1 flex-col gap-1">
          <span className="mono text-[11px] uppercase tracking-wide text-[#8b9bb4]">
            Average rate
          </span>
          <input
            inputMode="decimal"
            value={rate}
            onChange={(e) => onRate(e.target.value)}
            className="mono rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2 text-lg text-[#e8eef6]"
            placeholder="ΔV / Δt"
            autoComplete="off"
            disabled={disabled}
            aria-label="Average rate of change"
          />
        </label>
        <div className="flex flex-col gap-1">
          <span className="mono text-[11px] uppercase tracking-wide text-[#8b9bb4]">Units</span>
          <div className="flex flex-wrap gap-1">
            {UNIT_OPTIONS.map((u) => (
              <button
                key={u}
                type="button"
                disabled={disabled}
                onClick={() => onUnits(u)}
                className={`mono rounded-md border px-3 py-2 text-xs ${
                  units === u
                    ? 'border-[#3ee0c5] bg-[#3ee0c5] text-[#07090d]'
                    : 'border-[#243044] text-[#e8eef6] hover:border-[#3ee0c5]'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <span className="mono text-[11px] uppercase tracking-wide text-[#8b9bb4]">Sign</span>
        <div className="mt-1 flex flex-wrap gap-1">
          {MEANING_OPTIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              disabled={disabled}
              onClick={() => onMeaning(m.id)}
              className={`rounded-md border px-3 py-2 text-sm ${
                meaning === m.id
                  ? 'border-[#3ee0c5] bg-[#3ee0c5]/15 text-[#e8eef6]'
                  : 'border-[#243044] text-[#c9d4e5] hover:border-[#3ee0c5]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {PUMP_OPTIONS.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={!ready}
            onClick={() => onPump(p.id)}
            className="engage rounded-md border border-[#3ee0c5] bg-[#3ee0c5] px-3 py-3 text-left hover:brightness-110 disabled:opacity-40"
          >
            <div className="mono text-sm font-semibold text-[#07090d]">{p.label}</div>
            <div className="text-xs text-[#0c1118]/80">{p.detail}</div>
          </button>
        ))}
      </div>
      {live != null && showDelta && (
        <p className="sr-only">
          True average rate {formatRate(live)} points per hour
        </p>
      )}
    </div>
  )
}
