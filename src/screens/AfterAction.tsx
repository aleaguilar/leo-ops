import { scoreOf, type OpsState } from '../lib/sim'

type Props = {
  state: OpsState
  tip: string
  bestScore: number
  onAgain: () => void
  onBack: () => void
}

export function AfterAction({ state, tip, bestScore, onAgain, onBack }: Props) {
  const { band, acc, score } = scoreOf(state.stats)
  const won = state.status === 'won'
  const title = won ? 'Book survived' : 'Session closed'

  return (
    <div className="hud-grid min-h-svh">
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-16">
        <div>
          <p className="mono text-xs tracking-[0.35em] text-[#f0b429]">TRADING DESK</p>
          <h1 className="mt-2 text-4xl font-bold text-[#e8eef6]">{title}</h1>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="SCORE" value={String(score)} />
          <Stat label="IN BAND" value={`${Math.round(band * 100)}%`} />
          <Stat label="CALLS" value={`${Math.round(acc * 100)}%`} />
        </div>
        <p className="mono text-xs text-[#8b9bb4]">best on this Chromebook {bestScore}</p>
        {state.stats.skipped && (
          <p className="text-sm text-[#3ee0c5]">Two fast locks — remaining calls on that wave skipped.</p>
        )}
        <div className="rounded-lg border border-[#243044] bg-[#101722] p-4">
          <p className="mono text-[11px] tracking-wide text-[#8b9bb4]">ONE TIP</p>
          <p className="mt-2 text-[#e8eef6]">{tip}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAgain}
            className="rounded-md bg-[#3ee0c5] px-5 py-2.5 text-sm font-semibold text-[#07090d]"
          >
            Run the tape again
          </button>
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-[#243044] px-5 py-2.5 text-sm text-[#c9d4e5]"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#243044] bg-[#0c1118] px-3 py-3">
      <div className="mono text-[10px] tracking-wide text-[#8b9bb4]">{label}</div>
      <div className="mono mt-1 text-2xl text-[#3ee0c5]">{value}</div>
    </div>
  )
}
