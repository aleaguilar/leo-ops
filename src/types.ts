export type Stage = 'briefing' | 'ops' | 'afteraction'

export type PumpKind = 'drain' | 'hold' | 'fill'

export type MeaningId = 'fill' | 'hold' | 'drain'

export type GlitchKind = 'none' | 'value' | 'units' | 'sign' | 'window'

export type Point = { t: number; v: number }

export type WeatherSeg = { t0: number; t1: number; inflow: number }

export type CallSpec = {
  at: number
  window: [number, number]
}

export type WaveId = 'calm' | 'spike' | 'crisis'

export type Wave = {
  id: WaveId
  code: string
  name: string
  brief: string
  tMax: number
  vMax: number
  v0: number
  hoursPerSecond: number
  weather: WeatherSeg[]
  calls: CallSpec[]
  band: [number, number]
  failLow: number
  failHigh: number
}

export type PumpQuality = 'full' | 'weak' | 'inverted' | 'none'

export type CallResult = {
  trueRate: number
  entered: number
  unitsOk: boolean
  signOk: boolean
  numberOk: boolean
  correct: boolean
  fast: boolean
  pump: PumpKind
  quality: PumpQuality
}

export type Lifetime = {
  version: 2
  runs: number
  wins: number
  bestScore: number
  bestBand: number
  lastTip: string
  lastPlayed: string | null
  hardModeUnlocked: boolean
}

export type RunStats = {
  correct: number
  total: number
  fastHits: number
  timeInBand: number
  timeTotal: number
  overflow: boolean
  dry: boolean
  skipped: boolean
  waveNames: string[]
}
