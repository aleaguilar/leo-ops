import type { Session, SkillKey, Stage } from '../types'
import { STAGE_ORDER, stageLabel } from '../lib/session'

const SKILLS: { key: SkillKey; label: string }[] = [
  { key: 'rateSense', label: 'Rate' },
  { key: 'units', label: 'Units' },
  { key: 'signMeaning', label: 'Sign' },
  { key: 'intervalNotation', label: 'Interval' },
]

function pips(xp: number): number {
  return Math.min(5, Math.floor(xp / 20))
}

type Props = {
  session: Session
}

export function Hud({ session }: Props) {
  const acc =
    session.total === 0 ? '—' : `${Math.round((session.correct / session.total) * 100)}%`

  return (
    <header className="border-b border-[#243044] bg-[#07090d]/90 px-4 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
        <div className="flex items-baseline gap-2">
          <span className="mono text-sm font-semibold tracking-[0.18em] text-[#3ee0c5]">
            LEO OPS
          </span>
          <span className="mono text-xs text-[#8b9bb4]">// RATES</span>
        </div>
        <nav className="flex flex-1 flex-wrap items-center gap-1 text-[11px] mono text-[#8b9bb4]">
          {STAGE_ORDER.filter((s) => s !== 'briefing').map((s: Stage) => {
            const active = s === session.stage
            const done =
              STAGE_ORDER.indexOf(s) < STAGE_ORDER.indexOf(session.stage)
            return (
              <span
                key={s}
                className={
                  active
                    ? 'rounded px-1.5 py-0.5 text-[#07090d] bg-[#3ee0c5]'
                    : done
                      ? 'px-1.5 text-[#3ee0c5]'
                      : 'px-1.5'
                }
              >
                {stageLabel(s)}
              </span>
            )
          })}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          {SKILLS.map((s) => (
            <div key={s.key} className="flex items-center gap-1" title={s.label}>
              <span className="mono text-[10px] uppercase tracking-wide text-[#8b9bb4]">
                {s.label}
              </span>
              <span className="flex gap-0.5" aria-label={`${s.label} ${pips(session.skillXp[s.key])} of 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-2.5 rounded-sm ${
                      i < pips(session.skillXp[s.key]) ? 'bg-[#3ee0c5]' : 'bg-[#243044]'
                    }`}
                  />
                ))}
              </span>
            </div>
          ))}
          <div className="mono text-xs text-[#f0b429]">
            STRK {session.streak}
          </div>
          <div className="mono text-xs text-[#e8eef6]">{acc}</div>
          {session.hardMode && (
            <span className="mono rounded border border-[#f0b429] px-1.5 py-0.5 text-[10px] text-[#f0b429]">
              HARD
            </span>
          )}
        </div>
      </div>
      <p className="mx-auto mt-1 max-w-6xl mono text-[11px] text-[#8b9bb4]">
        AROC = (f(b) − f(a)) / (b − a)
      </p>
    </header>
  )
}
