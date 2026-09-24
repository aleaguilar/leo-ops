import type { Lifetime } from '../types'

const LIFE_KEY = 'flood-control-life-v2'

export function defaultLifetime(): Lifetime {
  return {
    version: 2,
    runs: 0,
    wins: 0,
    bestScore: 0,
    bestBand: 0,
    lastTip: '',
    lastPlayed: null,
    hardModeUnlocked: false,
  }
}

export function loadLifetime(): Lifetime {
  try {
    const raw = localStorage.getItem(LIFE_KEY)
    if (!raw) return defaultLifetime()
    const parsed = JSON.parse(raw) as Partial<Lifetime>
    if (parsed.version !== 2) return defaultLifetime()
    return { ...defaultLifetime(), ...parsed, version: 2 }
  } catch {
    return defaultLifetime()
  }
}

export function saveLifetime(life: Lifetime): void {
  localStorage.setItem(LIFE_KEY, JSON.stringify(life))
}

export function recordRun(
  life: Lifetime,
  opts: { score: number; band: number; won: boolean; hard: boolean; tip: string },
): Lifetime {
  const next: Lifetime = {
    ...life,
    runs: life.runs + 1,
    wins: life.wins + (opts.won ? 1 : 0),
    bestScore: Math.max(life.bestScore, opts.score),
    bestBand: Math.max(life.bestBand, opts.band),
    lastTip: opts.tip,
    lastPlayed: new Date().toISOString(),
    hardModeUnlocked: life.hardModeUnlocked || opts.won || opts.hard,
  }
  saveLifetime(next)
  return next
}
