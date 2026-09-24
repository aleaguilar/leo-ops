import type { Point } from '../types'

export function volumeAt(points: Point[], t: number): number {
  if (points.length === 0) return 0
  if (t <= points[0].t) return points[0].v
  const last = points[points.length - 1]
  if (t >= last.t) return last.v
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    if (t >= a.t && t <= b.t) {
      if (b.t === a.t) return b.v
      const u = (t - a.t) / (b.t - a.t)
      return a.v + u * (b.v - a.v)
    }
  }
  return last.v
}

export function aroc(points: Point[], a: number, b: number): number | null {
  if (a === b) return null
  return (volumeAt(points, b) - volumeAt(points, a)) / (b - a)
}

export function nearly(actual: number, expected: number, tol = 0.051): boolean {
  return Math.abs(actual - expected) <= tol
}

export function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/,/g, '').trim()
  if (cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.') {
    return null
  }
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

export function normalizeUnits(raw: string): string {
  const s = raw.trim().toLowerCase().replace(/\s+/g, '')
  if (
    s === 'gal/hr' ||
    s === 'gal/h' ||
    s === 'gph' ||
    s === 'gallons/hour' ||
    s === 'gallonsperhour' ||
    s === 'galperhr' ||
    s === 'galperhour'
  ) {
    return 'gal/hr'
  }
  if (s === '°f/hr' || s === 'f/hr' || s === 'degf/hr' || s === '°f/h') {
    return '°F/hr'
  }
  if (s === 'none' || s === 'units' || s === '') return 'none'
  return s
}

type ParsedInterval = {
  left: '(' | '['
  lo: number
  hi: number
  right: ')' | ']'
}

function parseOneInterval(raw: string): ParsedInterval | null {
  const s = raw.replace(/\s+/g, '').replace(/–/g, '-')
  if (s.length < 5) return null
  const leftChar = s[0]
  const rightChar = s[s.length - 1]
  if (leftChar !== '(' && leftChar !== '[') return null
  if (rightChar !== ')' && rightChar !== ']') return null
  const inner = s.slice(1, -1)
  const comma = inner.indexOf(',')
  if (comma < 1) return null
  const lo = Number(inner.slice(0, comma))
  const hi = Number(inner.slice(comma + 1))
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return null
  return {
    left: leftChar === '(' ? '(' : '[',
    lo,
    hi,
    right: rightChar === ')' ? ')' : ']',
  }
}

function parseUnion(raw: string): ParsedInterval[] | null {
  const s = raw
    .trim()
    .replace(/\s+/g, '')
    .replace(/∪/g, 'U')
    .replace(/union/gi, 'U')
  if (!s) return null
  const parts = s.split('U')
  const parsed: ParsedInterval[] = []
  for (const part of parts) {
    const one = parseOneInterval(part)
    if (!one) return null
    parsed.push(one)
  }
  return parsed
}

export function intervalsMatch(input: string, expected: string): boolean {
  const a = parseUnion(input)
  const b = parseUnion(expected)
  if (!a || !b || a.length !== b.length) return false
  const key = (p: ParsedInterval) => `${p.left}:${p.lo}:${p.hi}:${p.right}`
  const sa = [...a].map(key).sort()
  const sb = [...b].map(key).sort()
  return sa.every((k, i) => k === sb[i])
}

export function formatRate(n: number): string {
  if (Number.isInteger(n)) return String(n)
  return n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
}
