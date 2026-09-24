import type { Lifetime, Session } from '../types'

const SKILL_META = [
  { key: 'rateSense' as const, label: 'Rate Sense', tip: 'Secant slope from two times.' },
  { key: 'units' as const, label: 'Units', tip: 'Gallons over hours → gal/hr.' },
  { key: 'signMeaning' as const, label: 'Sign Meaning', tip: '+ fill · − drain · 0 hold.' },
  { key: 'intervalNotation' as const, label: 'Interval Notation', tip: '[ ] includes the endpoint.' },
]

type Props = {
  session: Session
  life: Lifetime
  tip: string
  onAgain: () => void
}

export function Debrief({ session, life, tip, onAgain }: Props) {
  const acc = session.total === 0 ? 0 : session.correct / session.total
  const minutes = Math.max(1, Math.round((Date.now() - session.startedAt) / 60000))

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="mono text-xs tracking-[0.3em] text-[#f0b429]">DEBRIEF</p>
      <h2 className="mt-2 text-3xl font-semibold">Session filed.</h2>
      <p className="mt-2 text-[#8b9bb4]">
        {session.correct}/{session.total} locked · {Math.round(acc * 100)}% · streak {session.bestStreak} · ~
        {minutes} min
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {SKILL_META.map((s) => {
          const xp = Math.max(session.skillXp[s.key], life.skillXp[s.key])
          const filled = Math.min(5, Math.floor(xp / 20))
          return (
            <div key={s.key} className="rounded-lg border border-[#243044] bg-[#101722] p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{s.label}</h3>
                <span className="mono text-xs text-[#3ee0c5]">{xp} XP</span>
              </div>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`h-2 flex-1 rounded-sm ${
                      i < filled ? 'bg-[#3ee0c5]' : 'bg-[#243044]'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-[#8b9bb4]">{s.tip}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-md border border-[#3ee0c5]/40 bg-[#3ee0c5]/10 px-4 py-3">
        <p className="mono text-[11px] tracking-widest text-[#3ee0c5]">NEXT SESSION</p>
        <p className="mt-1 text-[#e8eef6]">{tip}</p>
      </div>

      <p className="mt-6 text-sm text-[#8b9bb4]">
        Progress is on this Chromebook (localStorage). No account. Same formula next time — new
        windows if you arm Hard Mode.
      </p>

      <button
        type="button"
        onClick={onAgain}
        className="mt-8 rounded-md bg-[#3ee0c5] px-6 py-3 text-sm font-semibold text-[#07090d]"
      >
        Run it again
      </button>
    </div>
  )
}
