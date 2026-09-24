import { WAVES, waveFor } from '../data/waves'
import type {
  CallResult,
  CallSpec,
  GlitchKind,
  MeaningId,
  Point,
  PumpKind,
  PumpQuality,
  RunStats,
  Wave,
} from '../types'
import {
  aroc,
  formatRate,
  inflowAt,
  meaningFor,
  nearly,
  normalizeUnits,
  volumeAt,
} from './math'

export const FAST_MS = 8000
export const CALL_LIMIT_MS = 14000
export const HARD_CALL_LIMIT_MS = 9000
export const PUMP_HOURS = 2.6
export const DRAIN_ADD = -22
export const FILL_ADD = 18
export const WEAK = 0.34

export type ActiveCall = {
  spec: CallSpec
  openedAt: number
  window: [number, number]
}

export type OpsState = {
  hard: boolean
  waveIndex: number
  wave: Wave
  t: number
  v: number
  history: Point[]
  pump: PumpKind | null
  pumpUntil: number
  pumpAdd: number
  call: ActiveCall | null
  callIndex: number
  fastStreak: number
  stats: RunStats
  status: 'intro' | 'running' | 'calling' | 'waveClear' | 'lost' | 'won'
  failReason: 'overflow' | 'dry' | null
  glitch: GlitchKind
  glitchMsg: string
  lastCall: CallResult | null
  skipArmed: boolean
  rushed: boolean
}

export function emptyStats(): RunStats {
  return {
    correct: 0,
    total: 0,
    fastHits: 0,
    timeInBand: 0,
    timeTotal: 0,
    overflow: false,
    dry: false,
    skipped: false,
    waveNames: [],
  }
}

export function startRun(hard: boolean): OpsState {
  const wave = waveFor(0, hard)
  return bootWave(wave, 0, hard, emptyStats())
}

function bootWave(
  wave: Wave,
  waveIndex: number,
  hard: boolean,
  stats: RunStats,
): OpsState {
  return {
    hard,
    waveIndex,
    wave,
    t: 0,
    v: wave.v0,
    history: [{ t: 0, v: wave.v0 }],
    pump: null,
    pumpUntil: 0,
    pumpAdd: 0,
    call: null,
    callIndex: 0,
    fastStreak: 0,
    stats: {
      ...stats,
      waveNames: [...stats.waveNames, wave.name],
    },
    status: 'intro',
    failReason: null,
    glitch: 'none',
    glitchMsg: '',
    lastCall: null,
    skipArmed: false,
    rushed: false,
  }
}

export function beginWave(state: OpsState): OpsState {
  return { ...state, status: 'running' }
}

function pumpContribution(
  kind: PumpKind,
  inflow: number,
  quality: PumpQuality,
): number {
  if (quality === 'none') return 0
  let add = 0
  switch (kind) {
    case 'drain':
      add = DRAIN_ADD
      break
    case 'fill':
      add = FILL_ADD
      break
    case 'hold':
      add = -inflow
      break
    default: {
      const _never: never = kind
      return _never
    }
  }
  switch (quality) {
    case 'full':
      return add
    case 'weak':
      return add * WEAK
    case 'inverted':
      return -add
    default: {
      const _never: never = quality
      return _never
    }
  }
}

export function netRateAt(state: OpsState, t: number): number {
  const inflow = inflowAt(state.wave.weather, t)
  const pumpOn = state.pump != null && t < state.pumpUntil
  const add = pumpOn ? state.pumpAdd : 0
  return inflow + add
}

function inBand(v: number, wave: Wave): boolean {
  return v >= wave.band[0] && v <= wave.band[1]
}

export function tick(state: OpsState, dtHours: number): OpsState {
  if (state.status !== 'running' && state.status !== 'calling') return state
  const wave = state.wave
  let t = state.t + dtHours
  let v = state.v
  let history = state.history
  let status = state.status
  let failReason = state.failReason
  let stats = state.stats
  let call = state.call
  let pump = state.pump
  let pumpUntil = state.pumpUntil
  let pumpAdd = state.pumpAdd

  if (pump != null && t >= pumpUntil) {
    pump = null
    pumpAdd = 0
  }

  const rate = netRateAt({ ...state, pump, pumpUntil, pumpAdd }, state.t)
  v = v + rate * dtHours
  if (v > wave.vMax) v = wave.vMax
  if (v < 0) v = 0

  const last = history[history.length - 1]
  if (history.length <= 1) {
    history = [history[0] ?? { t: 0, v }, { t, v }]
  } else if (t - last.t >= 0.08 || Math.abs(v - last.v) > 1.2) {
    history = [...history, { t, v }]
  } else {
    history = [...history.slice(0, -1), { t, v }]
  }

  stats = {
    ...stats,
    timeTotal: stats.timeTotal + dtHours,
    timeInBand: stats.timeInBand + (inBand(v, wave) ? dtHours : 0),
  }

  if (v <= wave.failLow) {
    return {
      ...state,
      t,
      v,
      history,
      stats: { ...stats, dry: true },
      status: 'lost',
      failReason: 'dry',
      pump,
      pumpUntil,
      pumpAdd,
      call: null,
    }
  }
  if (v >= wave.failHigh) {
    return {
      ...state,
      t,
      v,
      history,
      stats: { ...stats, overflow: true },
      status: 'lost',
      failReason: 'overflow',
      pump,
      pumpUntil,
      pumpAdd,
      call: null,
    }
  }

  if (status === 'calling' && call) {
    const limit = state.hard ? HARD_CALL_LIMIT_MS : CALL_LIMIT_MS
    if (Date.now() - call.openedAt > limit) {
      return submitCall(
        {
          ...state,
          t,
          v,
          history,
          stats,
          pump,
          pumpUntil,
          pumpAdd,
        },
        {
          rate: Number.NaN,
          units: '',
          meaning: 'hold',
          pump: 'hold',
          timedOut: true,
        },
      )
    }
  }

  if (status === 'running' && call == null && state.callIndex < wave.calls.length) {
    const spec = wave.calls[state.callIndex]
    if (t >= spec.at) {
      const hi = Math.min(spec.window[1], t)
      const lo = Math.min(spec.window[0], hi - 0.5)
      call = {
        spec,
        openedAt: Date.now(),
        window: [Math.max(0, lo), hi],
      }
      status = 'calling'
    }
  }

  if (t >= wave.tMax) {
    t = wave.tMax
    history = [...history.slice(0, -1), { t, v }]
    if (state.waveIndex >= WAVES.length - 1) {
      return {
        ...state,
        t,
        v,
        history,
        stats,
        status: 'won',
        failReason,
        pump,
        pumpUntil,
        pumpAdd,
        call: null,
      }
    }
    return {
      ...state,
      t,
      v,
      history,
      stats,
      status: 'waveClear',
      pump,
      pumpUntil,
      pumpAdd,
      call: null,
    }
  }

  return {
    ...state,
    t,
    v,
    history,
    stats,
    status,
    failReason,
    pump,
    pumpUntil,
    pumpAdd,
    call,
  }
}

export function setCallWindow(state: OpsState, a: number, b: number): OpsState {
  if (!state.call) return state
  if (a === b) return state
  const lo = Math.max(0, Math.min(a, b))
  const hi = Math.min(state.t, Math.max(a, b))
  if (hi - lo < 0.49) return state
  return { ...state, call: { ...state.call, window: [lo, hi] } }
}

type SubmitInput = {
  rate: number
  units: string
  meaning: MeaningId
  pump: PumpKind
  timedOut?: boolean
}

export function submitCall(state: OpsState, input: SubmitInput): OpsState {
  if (!state.call && !input.timedOut) return state
  const window = state.call?.window ?? ([0, state.t] as [number, number])
  const trueRate = aroc(state.history, window[0], window[1]) ?? 0
  const timedOut = Boolean(input.timedOut)
  const numberOk = !timedOut && Number.isFinite(input.rate) && nearly(input.rate, trueRate)
  const unitsOk = !timedOut && normalizeUnits(input.units) === 'rate/hr'
  const signOk = !timedOut && input.meaning === meaningFor(trueRate)
  const correct = numberOk && unitsOk && signOk
  const elapsed = state.call ? Date.now() - state.call.openedAt : CALL_LIMIT_MS
  const fast = correct && elapsed <= FAST_MS

  let quality: PumpQuality = 'none'
  let glitch: GlitchKind = 'none'
  let glitchMsg = ''
  if (timedOut) {
    quality = 'none'
    glitch = 'window'
    glitchMsg = 'No call. Tape keeps the book.'
  } else if (correct) {
    quality = 'full'
  } else if (!signOk && numberOk) {
    quality = 'inverted'
    glitch = 'sign'
    glitchMsg = `Sign is the story. True AROC ${formatRate(trueRate)} pts/hr — order inverted.`
  } else if (!unitsOk && numberOk) {
    quality = 'weak'
    glitch = 'units'
    glitchMsg = 'Units offline. Points over hours is pts/hr — size at 34%.'
  } else {
    quality = Math.sign(input.rate || 0) === Math.sign(trueRate) || trueRate === 0 ? 'weak' : 'inverted'
    glitch = 'value'
    glitchMsg = `Secant missed. (${formatRate(volumeAt(state.history, window[1]))} − ${formatRate(volumeAt(state.history, window[0]))}) / ${formatRate(window[1] - window[0])} = ${formatRate(trueRate)} pts/hr.`
  }

  const inflow = inflowAt(state.wave.weather, state.t)
  const pumpAdd = pumpContribution(input.pump, inflow, quality)
  const fastStreak = fast ? state.fastStreak + 1 : correct ? state.fastStreak : 0
  const skipArmed = fastStreak >= 2

  const result: CallResult = {
    trueRate,
    entered: input.rate,
    unitsOk,
    signOk,
    numberOk,
    correct,
    fast,
    pump: input.pump,
    quality,
  }

  let next: OpsState = {
    ...state,
    call: null,
    callIndex: state.callIndex + 1,
    fastStreak,
    skipArmed,
    pump: quality === 'none' ? null : input.pump,
    pumpUntil: quality === 'none' ? state.t : state.t + PUMP_HOURS,
    pumpAdd,
    status: 'running',
    glitch,
    glitchMsg,
    lastCall: result,
    stats: {
      ...state.stats,
      total: state.stats.total + 1,
      correct: state.stats.correct + (correct ? 1 : 0),
      fastHits: state.stats.fastHits + (fast ? 1 : 0),
    },
  }

  if (skipArmed && inBand(next.v, next.wave)) {
    next = applySkip(next)
  }
  return next
}

function applySkip(state: OpsState): OpsState {
  const inflow = inflowAt(state.wave.weather, state.t)
  return {
    ...state,
    skipArmed: false,
    rushed: true,
    stats: { ...state.stats, skipped: true },
    call: null,
    callIndex: state.wave.calls.length,
    pump: 'hold',
    pumpUntil: state.wave.tMax + 1,
    pumpAdd: pumpContribution('hold', inflow, 'full'),
    glitch: 'none',
    glitchMsg: '',
  }
}

export function advanceWave(state: OpsState): OpsState {
  const nextIndex = state.waveIndex + 1
  const wave = waveFor(nextIndex, state.hard)
  return bootWave(wave, nextIndex, state.hard, state.stats)
}

export function retryWave(state: OpsState): OpsState {
  const kept: RunStats = {
    ...state.stats,
    overflow: false,
    dry: false,
    waveNames: state.stats.waveNames.slice(0, -1),
  }
  return bootWave(state.wave, state.waveIndex, state.hard, kept)
}

export function clearGlitch(state: OpsState): OpsState {
  return { ...state, glitch: 'none', glitchMsg: '' }
}

export function scoreOf(stats: RunStats): { band: number; acc: number; score: number } {
  const band = stats.timeTotal <= 0 ? 0 : stats.timeInBand / stats.timeTotal
  const acc = stats.total === 0 ? 0 : stats.correct / stats.total
  const score = Math.round(100 * (0.62 * band + 0.38 * acc))
  return { band, acc, score }
}

export function pickTip(state: {
  failReason: 'overflow' | 'dry' | null
  lastGlitch: GlitchKind
  acc: number
  won: boolean
}): string {
  if (state.failReason === 'overflow') {
    return 'Positive AROC is upward momentum. Cut or hold before the mark slams the 80 rail.'
  }
  if (state.failReason === 'dry') {
    return 'Negative AROC is downward momentum. Scale-in or the book wipes at 0.'
  }
  if (state.lastGlitch === 'units') {
    return 'Units ride the fraction: points over hours → pts/hr, not pts.'
  }
  if (state.lastGlitch === 'sign') {
    return 'Sign is the story. Minus = net mark out over that window — cut vs scale-in flips.'
  }
  if (state.won && state.acc >= 0.8) {
    return 'Book survived. Hard Mode: piecewise corners — average uses endpoints, not the steep piece.'
  }
  if (state.acc < 0.5) {
    return 'Lock two times, subtract marks in that order, divide. Then name pts/hr and the sign.'
  }
  return 'The order only hits full size if the rate call matches the window you locked.'
}
