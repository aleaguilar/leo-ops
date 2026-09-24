import { useEffect, useRef, useState } from 'react'
import { RateAnswer } from '../components/RateAnswer'
import { RateGraph } from '../components/RateGraph'
import { SkipBanner } from '../components/SkipBanner'
import { WARMUP, WARMUP_HARD } from '../data/mission'
import { nearly, normalizeUnits, parseNumber } from '../lib/math'
import { FAST_MS } from '../lib/session'
import type { GradePayload, Session } from '../types'

type Props = {
  session: Session
  onGrade: (payload: GradePayload) => void
  onAdvanceIndex: () => void
  onSkip: () => void
  onHard: () => void
}

export function Warmup({ session, onGrade, onAdvanceIndex, onSkip, onHard }: Props) {
  const shots = session.hardMode ? [...WARMUP.slice(0, 2), WARMUP_HARD] : WARMUP
  const shot = shots[Math.min(session.warmupIndex, shots.length - 1)]
  const done = session.warmupIndex >= shots.length
  const [value, setValue] = useState('')
  const [units, setUnits] = useState<string | null>(null)
  const [meaning, setMeaning] = useState<string | null>(null)
  const [reteach, setReteach] = useState<string | null>(null)
  const started = useRef(Date.now())

  useEffect(() => {
    setValue('')
    setUnits(null)
    setMeaning(null)
    setReteach(null)
    started.current = Date.now()
  }, [shot.id, session.warmupIndex])

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="mono text-[#3ee0c5]">Warm-up clear.</p>
        <button
          type="button"
          className="mt-4 rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]"
          onClick={onSkip}
        >
          Deploy to Cistern Ops
        </button>
      </div>
    )
  }

  function submit() {
    const n = parseNumber(value)
    const fast = Date.now() - started.current < FAST_MS
    if (n == null || !nearly(n, shot.answer)) {
      setReteach(shot.reteach)
      onGrade({
        correct: false,
        fast: false,
        glitch: 'value',
        glitchMsg: shot.reteach,
      })
      return
    }
    if (normalizeUnits(units ?? '') !== shot.units) {
      setReteach('Units ride with the fraction. Pick the chip that matches the context.')
      onGrade({
        correct: false,
        fast: false,
        glitch: 'units',
        glitchMsg: 'Units missing or wrong.',
      })
      return
    }
    if (meaning !== shot.meaningId) {
      setReteach('Sign is the story of net change over the window — not a decoration.')
      onGrade({
        correct: false,
        fast: false,
        glitch: 'sign',
        glitchMsg: 'Wrong sign meaning.',
      })
      return
    }
    setReteach(null)
    onGrade({
      correct: true,
      fast,
      skills: { rateSense: 18, units: 12, signMeaning: 12 },
    })
    onAdvanceIndex()
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        {session.skipAvailable && (
          <SkipBanner
            onSkip={onSkip}
            onHard={onHard}
            hardMode={session.hardMode}
            nextLabel="Cistern"
          />
        )}
        <p className="mono text-xs tracking-widest text-[#f0b429]">
          WARM-UP  {session.warmupIndex + 1}/{shots.length}
        </p>
        <h2 className="mt-2 text-2xl font-semibold">{shot.prompt}</h2>
        <p className="mt-2 text-sm text-[#8b9bb4]">{shot.detail}</p>
        {shot.points && (
          <div className="mt-4">
            <RateGraph
              series={{
                points: shot.points,
                xLabel: shot.xLabel ?? 't',
                yLabel: shot.yLabel ?? 'f(t)',
                tMax: shot.tMax ?? 6,
                vMax: shot.vMax ?? 40,
              }}
            />
          </div>
        )}
        {reteach && (
          <p className="mt-4 rounded border border-[#ff4d6d]/40 bg-[#2a0d14] px-3 py-2 text-sm text-[#e8eef6]">
            {reteach}
          </p>
        )}
      </div>
      <div className="rounded-lg border border-[#243044] bg-[#101722] p-4">
        <RateAnswer
          value={value}
          onValue={setValue}
          units={units}
          onUnits={setUnits}
          unitOptions={shot.unitOptions}
          meaning={meaning}
          onMeaning={setMeaning}
          meaningOptions={shot.meaningOptions}
          onSubmit={submit}
        />
      </div>
    </div>
  )
}
