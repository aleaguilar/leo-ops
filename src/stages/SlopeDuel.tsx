import { useEffect, useRef, useState } from 'react'
import { RateGraph } from '../components/RateGraph'
import { SkipBanner } from '../components/SkipBanner'
import { DUEL_HARD, DUEL_ROUNDS } from '../data/mission'
import { aroc, formatRate } from '../lib/math'
import type { GradePayload, Session } from '../types'

type Props = {
  session: Session
  onGrade: (payload: GradePayload) => void
  onAdvanceIndex: () => void
  onSkip: () => void
  onHard: () => void
}

const LIMIT = 12
const HARD_LIMIT = 8

export function SlopeDuel({
  session,
  onGrade,
  onAdvanceIndex,
  onSkip,
  onHard,
}: Props) {
  const rounds = session.hardMode ? [...DUEL_ROUNDS.slice(0, 3), ...DUEL_HARD] : DUEL_ROUNDS
  const round = rounds[Math.min(session.duelIndex, rounds.length - 1)]
  const done = session.duelIndex >= rounds.length
  const limit = session.hardMode ? HARD_LIMIT : LIMIT
  const [leftSec, setLeftSec] = useState(limit)
  const [locked, setLocked] = useState(false)
  const answered = useRef(false)
  const pickReadyAt = useRef(0)
  const pickRef = useRef<(side: 'left' | 'right') => void>(() => undefined)

  useEffect(() => {
    if (done) return
    answered.current = false
    setLocked(false)
    setLeftSec(limit)
    pickReadyAt.current = Date.now() + 400
    const started = Date.now()
    const id = window.setInterval(() => {
      const remain = Math.max(0, limit - Math.floor((Date.now() - started) / 1000))
      setLeftSec(remain)
      if (remain > 0) return
      window.clearInterval(id)
      if (answered.current) return
      answered.current = true
      setLocked(true)
      onGrade({
        correct: false,
        fast: false,
        glitch: 'value',
        glitchMsg: 'Time. Compute (y₂−y₁)/(x₂−x₁) — don’t vibe it.',
      })
      window.setTimeout(() => onAdvanceIndex(), 800)
    }, 200)
    return () => window.clearInterval(id)
  }, [round.id, session.duelIndex, limit, done, onAdvanceIndex, onGrade])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.repeat) return
      if (e.key === '1' || e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        pickRef.current('left')
      } else if (e.key === '2' || e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        pickRef.current('right')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function pick(side: 'left' | 'right') {
    if (done || locked || answered.current) return
    if (Date.now() < pickReadyAt.current) return
    answered.current = true
    setLocked(true)
    const ok = side === round.correct
    onGrade({
      correct: ok,
      fast: leftSec >= limit - 5,
      skills: ok ? { rateSense: 20 } : undefined,
      glitch: ok ? undefined : 'value',
      glitchMsg: ok ? undefined : failCopy(round.mode),
    })
    window.setTimeout(() => onAdvanceIndex(), 700)
  }
  pickRef.current = pick

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="mono text-[#3ee0c5]">Duel complete.</p>
        <button
          type="button"
          className="mt-4 rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]"
          onClick={onSkip}
        >
          Boss check
        </button>
      </div>
    )
  }

  const lRate = aroc(round.left.points, round.left.interval[0], round.left.interval[1])
  const rRate = aroc(round.right.points, round.right.interval[0], round.right.interval[1])

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      {session.skipAvailable && (
        <SkipBanner
          onSkip={onSkip}
          onHard={onHard}
          hardMode={session.hardMode}
          nextLabel="Boss"
        />
      )}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mono text-xs tracking-widest text-[#f0b429]">
            SLOPE DUEL  {session.duelIndex + 1}/{rounds.length}
          </p>
          <h2 className="text-2xl font-semibold">{round.prompt}</h2>
          <p className="text-sm text-[#8b9bb4]">Keys: 1 / 2 · A / D · arrows</p>
        </div>
        <div
          className={`mono rounded-md border px-4 py-2 text-2xl ${
            leftSec <= 3
              ? 'border-[#ff4d6d] text-[#ff4d6d]'
              : 'border-[#243044] text-[#f0b429]'
          }`}
        >
          {leftSec}s
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          disabled={locked}
          onClick={() => pick('left')}
          className="rounded-lg border border-[#243044] bg-[#101722] p-3 text-left hover:border-[#3ee0c5] disabled:opacity-60"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="mono text-sm text-[#3ee0c5]">1 · {round.left.label}</span>
            {locked && lRate != null && (
              <span className="mono text-xs text-[#8b9bb4]">{formatRate(lRate)} gal/hr</span>
            )}
          </div>
          <RateGraph
            compact
            highlight={round.left.interval}
            series={{
              points: round.left.points,
              xLabel: 't (hr)',
              yLabel: 'V (gal)',
              tMax: round.left.tMax,
              vMax: round.left.vMax,
            }}
          />
        </button>
        <button
          type="button"
          disabled={locked}
          onClick={() => pick('right')}
          className="rounded-lg border border-[#243044] bg-[#101722] p-3 text-left hover:border-[#3ee0c5] disabled:opacity-60"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="mono text-sm text-[#3ee0c5]">2 · {round.right.label}</span>
            {locked && rRate != null && (
              <span className="mono text-xs text-[#8b9bb4]">{formatRate(rRate)} gal/hr</span>
            )}
          </div>
          <RateGraph
            compact
            highlight={round.right.interval}
            series={{
              points: round.right.points,
              xLabel: 't (hr)',
              yLabel: 'V (gal)',
              tMax: round.right.tMax,
              vMax: round.right.vMax,
            }}
          />
        </button>
      </div>
    </div>
  )
}

function failCopy(mode: 'greater' | 'steeper' | 'drain-faster'): string {
  switch (mode) {
    case 'greater':
      return 'Greater means more positive, not steeper. −10 < 15.'
    case 'steeper':
      return 'Steeper uses absolute value |AROC|.'
    case 'drain-faster':
      return 'Draining faster = more negative rate.'
    default: {
      const _never: never = mode
      return _never
    }
  }
}
