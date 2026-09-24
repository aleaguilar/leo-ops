export type Stage =
  | 'briefing'
  | 'warmup'
  | 'cistern'
  | 'duel'
  | 'boss'
  | 'debrief'

export type SkillKey = 'rateSense' | 'units' | 'signMeaning' | 'intervalNotation'

export type Skills = Record<SkillKey, number>

export type GlitchKind = 'none' | 'value' | 'units' | 'sign' | 'window'

export type Point = { t: number; v: number }

export type Series = {
  id: string
  title: string
  xLabel: string
  yLabel: string
  tMax: number
  vMax: number
  points: Point[]
}

export type Lifetime = {
  version: 1
  sessionsCompleted: number
  bestAccuracy: number
  bestStreak: number
  skillXp: Skills
  lastTip: string
  lastPlayed: string | null
  hardModeUnlocked: boolean
}

export type Session = {
  stage: Stage
  hardMode: boolean
  streak: number
  bestStreak: number
  correct: number
  total: number
  fastStreak: number
  skillXp: Skills
  glitch: GlitchKind
  glitchMsg: string
  startedAt: number
  warmupIndex: number
  cisternIndex: number
  duelIndex: number
  bossIndex: number
  skipAvailable: boolean
}

export type GradePayload = {
  correct: boolean
  fast: boolean
  skills?: Partial<Skills>
  glitch?: Exclude<GlitchKind, 'none'>
  glitchMsg?: string
}
