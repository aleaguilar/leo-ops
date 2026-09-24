import { inflowAt, weatherLabel } from '../lib/math'
import { netRateAt, type OpsState } from '../lib/sim'

type Props = {
  state: OpsState
}

export function Hud({ state }: Props) {
  const { wave, stats } = state
  const bandPct =
    stats.timeTotal <= 0 ? 0 : Math.round((stats.timeInBand / stats.timeTotal) * 100)
  const acc = stats.total === 0 ? '—' : `${Math.round((stats.correct / stats.total) * 100)}%`
  const inflow = inflowAt(wave.weather, state.t)
  const net = netRateAt(state, state.t)
  const wx = weatherLabel(inflow)

  return (
    <header className="border-b border-[#243044] bg-[#07090d]/90 px-4 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-baseline gap-2">
          <span className="mono text-sm font-semibold tracking-[0.18em] text-[#3ee0c5]">
            FLOOD CONTROL
          </span>
          <span className="mono text-xs text-[#8b9bb4]">// PINECREST</span>
        </div>
        <div className="mono flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded bg-[#3ee0c5] px-1.5 py-0.5 text-[#07090d]">
            {wave.code} {wave.name}
          </span>
          <span className="text-[#e8eef6]">T {state.t.toFixed(1)}h</span>
          <span className="text-[#8b9bb4]">/ {wave.tMax}h</span>
          <span className={inflow > 3 ? 'text-[#f0b429]' : 'text-[#8b9bb4]'}>{wx}</span>
          <span className="text-[#e8eef6]">
            NET {net >= 0 ? '+' : ''}
            {net.toFixed(1)} gal/hr
          </span>
          <span className="text-[#5ee0a0]">BAND {bandPct}%</span>
          <span className="text-[#e8eef6]">CALLS {acc}</span>
          {state.hard && (
            <span className="rounded border border-[#f0b429] px-1.5 py-0.5 text-[10px] text-[#f0b429]">
              HARD
            </span>
          )}
          {state.rushed && (
            <span className="text-[#f0b429]">SKIPPED — HOLD LOCKED</span>
          )}
        </div>
      </div>
      <p className="mx-auto mt-1 max-w-6xl mono text-[11px] text-[#8b9bb4]">
        AROC = (f(b) − f(a)) / (b − a) · safe band {wave.band[0]}–{wave.band[1]} gal
      </p>
    </header>
  )
}
