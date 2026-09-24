import type { Wave } from '../types'

const BAND: [number, number] = [30, 70]

export const WAVES: Wave[] = [
  {
    id: 'calm',
    code: 'W1',
    name: 'OPEN TAPE',
    brief: 'Steady bid. Read the climb, then size the book.',
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
    name: 'VOLUME SPIKE',
    brief: 'Tape flat, then a dump of size. Catch the jump.',
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
    name: 'CRISIS TAPE',
    brief: 'Part 6 book: +15, flat, then −10. Stay inside the risk band.',
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
  name: 'OPEN · PIECEWISE',
  brief: 'Corner on the tape. Average uses the window endpoints, not the steep piece.',
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

export const UNIT_OPTIONS = ['pts/hr', 'pts', 'hr'] as const

export const MEANING_OPTIONS: { id: 'fill' | 'hold' | 'drain'; label: string }[] = [
  { id: 'fill', label: '+ momentum up' },
  { id: 'hold', label: '0 flat' },
  { id: 'drain', label: '− momentum down' },
]

export const PUMP_OPTIONS: {
  id: 'drain' | 'hold' | 'fill'
  label: string
  detail: string
}[] = [
  { id: 'drain', label: 'Cut', detail: 'Dump size — mark falls' },
  { id: 'hold', label: 'Hold', detail: 'Match the tape so the mark freezes' },
  { id: 'fill', label: 'Scale-in', detail: 'Add size — mark climbs' },
]
