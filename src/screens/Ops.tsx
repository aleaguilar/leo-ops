import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { CallConsole } from '../components/CallConsole'
import { CisternTank } from '../components/CisternTank'
import { Hud } from '../components/Hud'
import { RateGraph, snapWindow } from '../components/RateGraph'
import { formatRate, parseNumber } from '../lib/math'
import {
  advanceWave,
  beginWave,
  clearGlitch,
  retryWave,
  setCallWindow,
  submitCall,
  tick,
  type OpsState,
} from '../lib/sim'
import type { MeaningId, PumpKind } from '../types'

type Props = {
  initial: OpsState
  onFinished: (state: OpsState) => void
}

export function Ops({ initial, onFinished }: Props) {
  const [state, setState] = useReducer(
    (cur: OpsState, next: OpsState | ((s: OpsState) => OpsState)) =>
      typeof next === 'function' ? next(cur) : next,
    initial,
  )
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  const [pending, setPending] = useState<number | null>(null)
  const [rate, setRate] = useState('')
  const [units, setUnits] = useState<string | null>('gal/hr')
  const [meaning, setMeaning] = useState<MeaningId | null>(null)

  useEffect(() => {
    if (state.call) {
      setRate('')
      setUnits('gal/hr')
      setMeaning(null)
      setPending(null)
    }
  }, [state.call?.spec.at, state.waveIndex])

  useEffect(() => {
    if (state.glitch === 'none') return
    const id = window.setTimeout(() => {
      setState((s) => clearGlitch(s))
    }, 1600)
    return () => window.clearTimeout(id)
  }, [state.glitch, state.stats.total])

  useEffect(() => {
    const live = state.status === 'running' || state.status === 'calling'
    if (!live) return
    let last = performance.now()
    let raf = 0
    const loop = (now: number) => {
      const dtMs = Math.min(48, now - last)
      last = now
      setState((s) => {
        const scale = s.status === 'calling' ? 0.32 : s.rushed ? 3.2 : 1
        const dtH = (dtMs / 1000) * s.wave.hoursPerSecond * scale
        return tick(s, dtH)
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [state.status === 'running' || state.status === 'calling', state.waveIndex])

  useEffect(() => {
    if (state.status === 'won') {
      const id = window.setTimeout(() => onFinished(stateRef.current), 900)
      return () => window.clearTimeout(id)
    }
    return undefined
  }, [state.status, onFinished])

  useEffect(() => {
    if (state.status !== 'waveClear') return
    const id = window.setTimeout(() => {
      setState((s) => beginWave(advanceWave(s)))
    }, 1400)
    return () => window.clearTimeout(id)
  }, [state.status, state.waveIndex])

  const onPickTime = useCallback((t: number) => {
    setState((s) => {
      if (!s.call) return s
      const snapped = snapWindow(pending, t)
      if (snapped.selected) {
        setPending(null)
        return setCallWindow(s, snapped.selected[0], snapped.selected[1])
      }
      setPending(snapped.pending)
      return s
    })
  }, [pending])

  const onPump = useCallback((pump: PumpKind) => {
    const n = parseNumber(rate)
    if (n == null || units == null || meaning == null) return
    setState((s) => submitCall(s, { rate: n, units, meaning, pump }))
  }, [rate, units, meaning])

  const wave = state.wave
  const selected = state.call?.window ?? null
  const inBand = state.v >= wave.band[0] && state.v <= wave.band[1]

  return (
    <div className="min-h-svh">
      <Hud state={state} />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0">
          <RateGraph
            points={state.history}
            tMax={wave.tMax}
            vMax={wave.vMax}
            selected={selected}
            pending={pending}
            playhead={state.t}
            band={wave.band}
            interactive={state.status === 'calling'}
            onPickTime={onPickTime}
          />
        </div>
        <CisternTank
          volume={state.v}
          max={wave.vMax}
          band={wave.band}
          glitch={state.glitch}
          glitchMsg={state.glitchMsg}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-8">
        {state.status === 'intro' && (
          <div className="rounded-lg border border-[#243044] bg-[#101722] p-5">
            <p className="mono text-xs tracking-[0.25em] text-[#f0b429]">
              {wave.code} · {wave.name}
            </p>
            <p className="mt-2 text-[#e8eef6]">{wave.brief}</p>
            <button
              type="button"
              className="engage mt-4 rounded-md bg-[#3ee0c5] px-5 py-2.5 text-sm font-semibold text-[#07090d]"
              onClick={() => setState((s) => beginWave(s))}
            >
              OPEN CHANNEL
            </button>
          </div>
        )}

        {state.status === 'running' && !state.call && (
          <p className="mono text-sm text-[#8b9bb4]">
            Watching weather{state.rushed ? ' — hold locked, riding it out' : ''}. {wave.name}.
            Band is {inBand ? 'green' : 'off'} at {formatRate(state.v)} gal.
          </p>
        )}

        {state.status === 'calling' && state.call && (
          <CallConsole
            points={state.history}
            window={state.call.window}
            showDelta={!state.hard}
            rate={rate}
            onRate={setRate}
            units={units}
            onUnits={setUnits}
            meaning={meaning}
            onMeaning={setMeaning}
            onPump={onPump}
          />
        )}

        {state.status === 'waveClear' && (
          <div className="rounded-lg border border-[#3ee0c5]/40 bg-[#101722] p-5">
            <p className="mono text-xs text-[#3ee0c5]">WAVE CLEAR</p>
            <p className="mt-2 text-[#e8eef6]">Cistern held. Next cell is inbound.</p>
            <button
              type="button"
              className="engage mt-4 rounded-md bg-[#3ee0c5] px-5 py-2.5 text-sm font-semibold text-[#07090d]"
              onClick={() =>
                setState((s) =>
                  s.status === 'waveClear' ? beginWave(advanceWave(s)) : s,
                )
              }
            >
              NEXT WAVE
            </button>
          </div>
        )}

        {state.status === 'lost' && (
          <div className="rounded-lg border border-[#ff4d6d]/50 bg-[#2a0d14] p-5">
            <p className="mono tracking-widest text-[#ff4d6d]">
              {state.failReason === 'dry' ? 'CISTERN DRY' : 'OVERFLOW — FLOOD'}
            </p>
            <p className="mt-2 text-sm text-[#e8eef6]">
              {state.failReason === 'dry'
                ? 'Volume hit empty. Pinecrest loses pressure.'
                : 'Volume hit 80 gal. The neighborhood takes the water.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]"
                onClick={() => setState(() => beginWave(retryWave(state)))}
              >
                RETRY WAVE
              </button>
              <button
                type="button"
                className="rounded-md border border-[#243044] px-4 py-2 text-sm text-[#e8eef6]"
                onClick={() => onFinished(state)}
              >
                AFTER ACTION
              </button>
            </div>
          </div>
        )}

        {state.status === 'won' && (
          <p className="mono text-sm text-[#3ee0c5]">Crisis held. Filing after-action…</p>
        )}
      </div>
    </div>
  )
}
