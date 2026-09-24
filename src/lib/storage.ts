import type { Lifetime, Session, Skills } from '../types'

const LIFE_KEY = 'leo-ops-rates-life-v0'
const SESSION_KEY = 'leo-ops-rates-session-v0'

export const EMPTY_SKILLS: Skills = {
  rateSense: 0,
  units: 0,
  signMeaning: 0,
  intervalNotation: 0,
}

export function defaultLifetime(): Lifetime {
  return {
    version: 1,
    sessionsCompleted: 0,
    bestAccuracy: 0,
    bestStreak: 0,
    skillXp: { ...EMPTY_SKILLS },
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
    if (parsed.version !== 1) return defaultLifetime()
    return {
      ...defaultLifetime(),
      ...parsed,
      skillXp: { ...EMPTY_SKILLS, ...parsed.skillXp },
    }
  } catch {
    return defaultLifetime()
  }
}

export function saveLifetime(life: Lifetime): void {
  localStorage.setItem(LIFE_KEY, JSON.stringify(life))
}

export function addXp(skills: Skills, delta: Partial<Skills>): Skills {
  const next = { ...skills }
  const keys: (keyof Skills)[] = [
    'rateSense',
    'units',
    'signMeaning',
    'intervalNotation',
  ]
  for (const key of keys) {
    const extra = delta[key] ?? 0
    next[key] = Math.max(0, Math.min(100, next[key] + extra))
  }
  return next
}

export function mergeLifetimeSkills(life: Skills, session: Skills): Skills {
  return {
    rateSense: Math.max(life.rateSense, session.rateSense),
    units: Math.max(life.units, session.units),
    signMeaning: Math.max(life.signMeaning, session.signMeaning),
    intervalNotation: Math.max(life.intervalNotation, session.intervalNotation),
  }
}

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!parsed?.stage || parsed.stage === 'debrief') return null
    return { ...parsed, glitch: 'none', glitchMsg: '' }
  } catch {
    return null
  }
}

export function saveSession(session: Session | null): void {
  if (!session || session.stage === 'debrief') {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function pickTip(opts: {
  accuracy: number
  unitsHits: number
  signHits: number
  intervalHits: number
  unitsTried: number
  signTried: number
  intervalTried: number
}): string {
  const unitRate = opts.unitsTried === 0 ? 1 : opts.unitsHits / opts.unitsTried
  const signRate = opts.signTried === 0 ? 1 : opts.signHits / opts.signTried
  const intRate =
    opts.intervalTried === 0 ? 1 : opts.intervalHits / opts.intervalTried
  if (unitRate < 0.75) {
    return 'Units ride with the fraction: gallons over hours → gal/hr.'
  }
  if (signRate < 0.75) {
    return 'Sign is the story. Negative average rate means net decrease over that window.'
  }
  if (intRate < 0.75) {
    return 'Domain = legal t. Range = legal V. Use [ ] when the graph includes the endpoint.'
  }
  if (opts.accuracy >= 0.92) {
    return 'Operational. Next pass: piecewise rates across a corner, same formula.'
  }
  return 'Read two points, subtract in the same order, then name units and sign.'
}
