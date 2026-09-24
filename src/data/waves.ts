import type { Wave } from '../types'

const BAND: [number, number] = [30, 70]

export const WAVES: Wave[] = [
  {
    id: 'calm',
    code: 'W1',
    name: 'CALM FILL',
    brief: 'Steady rain. Read the rise, then decide.',
    tMax: 6,
    vMax: 80,
    v0: 42,
    hoursPerSecond: 0.11,
    weather: [{ t0: 0, t1: 6, inflow: 8 }],
    calls: [
      { at: 2, window: [0, 2] },
      { at: 4.2, window: [2, 4] },
    ],
    band: BAND,
    failLow: 0.5,
    failHigh: 79.5,
  },
  {
    id: 'spike',
    code: 'W2',
    name: 'SPIKE RAIN',
    brief: 'Hold, then a cell dumps on Pinecrest. Catch the jump.',
    tMax: 7,
    vMax: 80,
    v0: 50,
    hoursPerSecond: 0.1,
    weather: [
      { t0: 0, t1: 3, inflow: 0 },
      { t0: 3, t1: 7, inflow: 16 },
    ],
    calls: [
      { at: 2.4, window: [0, 2] },
      { at: 5, window: [3, 5] },
    ],
    band: BAND,
    failLow: 0.5,
    failHigh: 79.5,
  },
  {
    id: 'crisis',
    code: 'W3',
    name: 'CRISIS',
    brief: 'Part 6 cistern: fill 15, hold, then −10 drain. Stay in band.',
    tMax: 12,
    vMax: 80,
    v0: 20,
    hoursPerSecond: 0.12,
    weather: [
      { t0: 0, t1: 4, inflow: 15 },
      { t0: 4, t1: 8, inflow: 0 },
      { t0: 8, t1: 12, inflow: -10 },
    ],
    calls: [
      { at: 2, window: [0, 2] },
      { at: 6, window: [4, 6] },
      { at: 10, window: [8, 10] },
    ],
    band: BAND,
    failLow: 0.5,
    failHigh: 79.5,
  },
]

export const HARD_CALM: Wave = {
  ...WAVES[0],
  name: 'CALM · PIECEWISE',
  brief: 'Corner in the rain. Average uses the window endpoints, not the steep piece.',
  weather: [
    { t0: 0, t1: 2, inflow: 12 },
    { t0: 2, t1: 6, inflow: 2 },
  ],
  calls: [
    { at: 2, window: [0, 2] },
    { at: 4.2, window: [0, 4] },
  ],
}

export function waveFor(index: number, hard: boolean): Wave {
  const base = WAVES[index]
  if (hard && index === 0) return HARD_CALM
  return base
}

export const UNIT_OPTIONS = ['gal/hr', 'gal', 'hr'] as const

export const MEANING_OPTIONS: { id: 'fill' | 'hold' | 'drain'; label: string }[] = [
  { id: 'fill', label: '+ filling' },
  { id: 'hold', label: '0 holding' },
  { id: 'drain', label: '− draining' },
]

export const PUMP_OPTIONS: {
  id: 'drain' | 'hold' | 'fill'
  label: string
  detail: string
}[] = [
  { id: 'drain', label: 'OPEN DRAIN', detail: 'Push water out' },
  { id: 'hold', label: 'HOLD', detail: 'Match inflow — freeze V' },
  { id: 'fill', label: 'FILL BOOST', detail: 'Add volume' },
]
