import { SUBJECTS, type ModeId } from '../catalog'
import { loadBest, loadTip } from '../lib/why'

type Props = {
  onPlay: (id: ModeId) => void
}

export function Menu({ onPlay }: Props) {
  return (
    <div className="min-h-svh px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.28em] text-[#f0b429]">Gulliver · 9th · Chromebook</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">Leo Ops</h1>
        <p className="mt-2 max-w-2xl text-[#8b9bb4]">
          Math · History · Biology. Classic stays academic. Interactive wears Leo’s worlds —
          trading desk, mission routes, district maps, transfer hearing, forge / loot. After every
          interactive commit: <em>why</em>, then a short reinforce.
        </p>

        <div className="mt-8 space-y-10">
          {SUBJECTS.map((sub) => (
            <section key={sub.id}>
              <div className="mb-3 flex items-baseline gap-3">
                <h2 className="text-2xl font-semibold">{sub.title}</h2>
                <span className="text-xs uppercase tracking-wide text-[#8b9bb4]">{sub.tag}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {sub.missions.map((mission) => (
                  <article
                    key={mission.name}
                    className="rounded-xl border border-[#243044] bg-[#101722] p-4"
                  >
                    <h3 className="text-lg font-semibold">{mission.name}</h3>
                    <div className="mt-3 flex flex-col gap-2">
                      {mission.modes.map((mode) => {
                        const best = loadBest(mode.id)
                        const tip = loadTip(mode.id)
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => onPlay(mode.id)}
                            className="rounded-lg border border-[#243044] bg-[#0c1118] p-3 text-left hover:border-[#3ee0c5]"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-[#e8eef6]">{mode.title}</span>
                              <span className="text-[10px] uppercase tracking-wide text-[#8b9bb4]">
                                {mode.kind}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-[#8b9bb4]">{mode.blurb}</p>
                            {best > 0 && (
                              <p className="mt-1 text-[11px] text-[#3ee0c5]">best {best}</p>
                            )}
                            {tip && (
                              <p className="mt-1 line-clamp-2 text-[11px] text-[#8b9bb4]">{tip}</p>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
