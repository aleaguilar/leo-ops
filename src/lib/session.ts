import type { GradePayload, Session, Stage } from '../types'
import { addXp, EMPTY_SKILLS } from './storage'

export const FAST_MS = 8000

export const STAGE_ORDER: Stage[] = [
  'briefing',
  'warmup',
  'cistern',
  'duel',
  'boss',
  'debrief',
]

export function nextStage(stage: Stage): Stage {
  switch (stage) {
    case 'briefing':
      return 'warmup'
    case 'warmup':
      return 'cistern'
    case 'cistern':
      return 'duel'
    case 'duel':
      return 'boss'
    case 'boss':
      return 'debrief'
    case 'debrief':
      return 'debrief'
    default: {
      const _never: never = stage
      return _never
    }
  }
}

export function freshSession(hardMode: boolean): Session {
  return {
    stage: 'warmup',
    hardMode,
    streak: 0,
    bestStreak: 0,
    correct: 0,
    total: 0,
    fastStreak: 0,
    skillXp: { ...EMPTY_SKILLS },
    glitch: 'none',
    glitchMsg: '',
    startedAt: Date.now(),
    warmupIndex: 0,
    cisternIndex: 0,
    duelIndex: 0,
    bossIndex: 0,
    skipAvailable: false,
  }
}

export function applyGrade(session: Session, payload: GradePayload): Session {
  const total = session.total + 1
  const correct = session.correct + (payload.correct ? 1 : 0)
  const streak = payload.correct ? session.streak + 1 : 0
  const bestStreak = Math.max(session.bestStreak, streak)
  const fastStreak =
    payload.correct && payload.fast ? session.fastStreak + 1 : 0
  const skipAvailable = fastStreak >= 3
  return {
    ...session,
    total,
    correct,
    streak,
    bestStreak,
    fastStreak,
    skipAvailable,
    skillXp: payload.correct
      ? addXp(session.skillXp, payload.skills ?? {})
      : session.skillXp,
    glitch: payload.correct ? 'none' : (payload.glitch ?? 'value'),
    glitchMsg: payload.correct ? '' : (payload.glitchMsg ?? 'Recalibrate.'),
  }
}

export function clearGlitch(session: Session): Session {
  return { ...session, glitch: 'none', glitchMsg: '' }
}

export function stageLabel(stage: Stage): string {
  switch (stage) {
    case 'briefing':
      return 'Briefing'
    case 'warmup':
      return 'Warm-up'
    case 'cistern':
      return 'Cistern Ops'
    case 'duel':
      return 'Slope Duel'
    case 'boss':
      return 'Boss Check'
    case 'debrief':
      return 'Debrief'
    default: {
      const _never: never = stage
      return _never
    }
  }
}
