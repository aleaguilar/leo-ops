import type { MeaningId, Point, WeatherSeg } from '../types'

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

export function nearly(actual: number, expected: number, tol = 0.51): boolean {
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
  if (s === 'none' || s === 'units' || s === '') return 'none'
  return s
}

export function formatRate(n: number): string {
  if (Math.abs(n) < 0.05) return '0'
  if (Number.isInteger(n)) return String(n)
  return n.toFixed(1).replace(/\.0$/, '')
}

export function meaningFor(rate: number): MeaningId {
  if (nearly(rate, 0, 0.25)) return 'hold'
  return rate > 0 ? 'fill' : 'drain'
}

export function inflowAt(weather: WeatherSeg[], t: number): number {
  for (const seg of weather) {
    if (t >= seg.t0 && t < seg.t1) return seg.inflow
  }
  const last = weather[weather.length - 1]
  return last?.inflow ?? 0
}

export function weatherLabel(inflow: number): string {
  if (inflow > 10) return 'HEAVY RAIN'
  if (inflow > 3) return 'RAIN'
  if (inflow < -6) return 'HARD DRAIN'
  if (inflow < -1) return 'DRAINING'
  return 'HOLDING'
}
