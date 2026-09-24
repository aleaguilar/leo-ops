import type { ModeId } from '../catalog'

export type WhyChip = { id: string; label: string; sound: boolean }

export type WhyVerdict = 'strong' | 'weak' | 'wrong'

export type WhyJudgment = {
  verdict: WhyVerdict
  summary: string
}

export function judgeWhy(opts: {
  actionCorrect: boolean
  chip: WhyChip | undefined
  text: string
  keywords: string[]
  strong: string
  weak: string
  wrong: string
}): WhyJudgment {
  const text = opts.text.trim().toLowerCase()
  const hitKeyword = opts.keywords.some((k) => text.includes(k.toLowerCase()))
  const wroteSomething = text.length >= 12
  const chipSound = Boolean(opts.chip?.sound)

  if (!opts.actionCorrect) {
    return { verdict: 'wrong', summary: opts.wrong }
  }
  if (chipSound && (hitKeyword || wroteSomething || text.length === 0)) {
    return { verdict: 'strong', summary: opts.strong }
  }
  if (chipSound) {
    return { verdict: 'strong', summary: opts.strong }
  }
  return { verdict: 'weak', summary: opts.weak }
}

const TIP_KEY = 'leo-ops-tips-v3'
const SCORE_KEY = 'leo-ops-scores-v3'

export function loadTip(mode: ModeId): string {
  try {
    const raw = localStorage.getItem(TIP_KEY)
    if (!raw) return ''
    const parsed = JSON.parse(raw) as Record<string, string>
    return parsed[mode] ?? ''
  } catch {
    return ''
  }
}

export function saveTip(mode: ModeId, tip: string): void {
  try {
    const raw = localStorage.getItem(TIP_KEY)
    const parsed = raw ? (JSON.parse(raw) as Record<string, string>) : {}
    parsed[mode] = tip
    localStorage.setItem(TIP_KEY, JSON.stringify(parsed))
  } catch {
    /* ignore */
  }
}

export function loadBest(mode: ModeId): number {
  try {
    const raw = localStorage.getItem(SCORE_KEY)
    if (!raw) return 0
    const parsed = JSON.parse(raw) as Record<string, number>
    return parsed[mode] ?? 0
  } catch {
    return 0
  }
}

export function saveBest(mode: ModeId, score: number): void {
  try {
    const raw = localStorage.getItem(SCORE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {}
    parsed[mode] = Math.max(parsed[mode] ?? 0, score)
    localStorage.setItem(SCORE_KEY, JSON.stringify(parsed))
  } catch {
    /* ignore */
  }
}
