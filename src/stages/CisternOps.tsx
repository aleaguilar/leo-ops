import { useEffect, useRef, useState } from 'react'
import { CisternTank } from '../components/CisternTank'
import { RateAnswer } from '../components/RateAnswer'
import { RateGraph, snapWindow } from '../components/RateGraph'
import { SkipBanner } from '../components/SkipBanner'
import { CISTERN, CISTERN_HARD_TASK, CISTERN_TASKS } from '../data/mission'
import { aroc, nearly, normalizeUnits, parseNumber, volumeAt } from '../lib/math'
import { FAST_MS } from '../lib/session'
import type { GradePayload, Session } from '../types'

type Props = {
  session: Session
  onGrade: (payload: GradePayload) => void
  onAdvanceIndex: () => void
  onSkip: () => void
  onHard: () => void
}

export function CisternOps({
  session,
  onGrade,
  onAdvanceIndex,
  onSkip,
  onHard,
}: Props) {
  const tasks = session.hardMode ? [...CISTERN_TASKS, CISTERN_HARD_TASK] : CISTERN_TASKS
  const task = tasks[Math.min(session.cisternIndex, tasks.length - 1)]
  const done = session.cisternIndex >= tasks.length
  const [pending, setPending] = useState<number | null>(null)
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [value, setValue] = useState('')
  const [units, setUnits] = useState<string | null>(null)
  const [meaning, setMeaning] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const started = useRef(Date.now())

  useEffect(() => {
    setPending(null)
    setSelected(null)
    setValue('')
    setUnits(null)
    setMeaning(null)
    setNote(null)
    started.current = Date.now()
  }, [task.id, session.cisternIndex])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '[' || e.key === ']' || e.key === 'Escape') {
        setPending(null)
        setSelected(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const liveT = selected ? selected[1] : (pending ?? 0)
  const liveV = volumeAt(CISTERN.points, liveT)
  const ghostV = selected ? volumeAt(CISTERN.points, selected[0]) : null

  function pick(t: number) {
    const next = snapWindow(pending, t)
    setPending(next.pending)
    if (next.selected) setSelected(next.selected)
  }

  function windowOk(sel: [number, number]): boolean {
    if (task.allowAnyZero) {
      const rate = aroc(CISTERN.points, sel[0], sel[1])
      return rate != null && nearly(rate, 0) && sel[1] - sel[0] === 2
    }
    return sel[0] === task.window[0] && sel[1] === task.window[1]
  }

  function submit() {
    if (!selected) {
      onGrade({
        correct: false,
        fast: false,
        glitch: 'window',
        glitchMsg: 'Click two times on the graph (or use arrows + click).',
      })
      return
    }
    if (!windowOk(selected)) {
      onGrade({
        correct: false,
        fast: false,
        glitch: 'window',
        glitchMsg: task.windowHint,
      })
      return
    }
    const n = parseNumber(value)
    const fast = Date.now() - started.current < FAST_MS
    const expected = task.allowAnyZero ? 0 : task.answer
    if (n == null || !nearly(n, expected)) {
      setNote(task.reteach)
      onGrade({
        correct: false,
        fast: false,
        glitch: 'value',
        glitchMsg: task.reteach,
      })
      return
    }
    if (normalizeUnits(units ?? '') !== task.units) {
      onGrade({
        correct: false,
        fast: false,
        glitch: 'units',
        glitchMsg: 'Need gal/hr — gallons over hours.',
      })
      return
    }
    if (meaning !== task.meaningId) {
      onGrade({
        correct: false,
        fast: false,
        glitch: 'sign',
        glitchMsg: 'Sign is fill / drain / hold. Match the window.',
      })
      return
    }
    setNote(null)
    onGrade({
      correct: true,
      fast,
      skills: { rateSense: 16, units: 14, signMeaning: 14 },
    })
    onAdvanceIndex()
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="mono text-[#3ee0c5]">Cistern window locked.</p>
        <button
          type="button"
          className="mt-4 rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]"
          onClick={onSkip}
        >
          Enter Slope Duel
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      {session.skipAvailable && (
        <SkipBanner
          onSkip={onSkip}
          onHard={onHard}
          hardMode={session.hardMode}
          nextLabel="Duel"
        />
      )}
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="mono text-xs tracking-widest text-[#f0b429]">
            CISTERN OPS  {session.cisternIndex + 1}/{tasks.length}
          </p>
          <h2 className="text-2xl font-semibold">{task.title}</h2>
          <p className="text-sm text-[#8b9bb4]">{task.brief}</p>
        </div>
        <p className="mono text-xs text-[#8b9bb4]">
          Click two hour-ticks · arrows while graph focused · [ / ] reset
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_200px]">
        <div>
          <RateGraph
            series={CISTERN}
            selected={selected}
            pending={pending}
            interactive
            onPickTime={pick}
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {Array.from({ length: 13 }, (_, t) => (
              <button
                key={t}
                type="button"
                onClick={() => pick(t)}
                className={`mono h-8 w-8 rounded border text-xs ${
                  selected?.includes(t) || pending === t
                    ? 'border-[#3ee0c5] bg-[#3ee0c5] text-[#07090d]'
                    : 'border-[#243044] text-[#c9d4e5] hover:border-[#3ee0c5]'
                }`}
              >
                {t}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPending(null)
                setSelected(null)
              }}
              className="mono rounded border border-[#243044] px-2 text-[11px] text-[#8b9bb4]"
            >
              reset
            </button>
          </div>
        </div>
        <CisternTank
          volume={liveV}
          ghost={ghostV}
          glitch={session.glitch}
          glitchMsg={session.glitchMsg}
        />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-lg border border-[#243044] bg-[#0c1118] p-3 mono text-sm text-[#c9d4e5]">
          <div>window: {selected ? `[${selected[0]}, ${selected[1]}]` : pending != null ? `t = ${pending} …` : '—'}</div>
          <div>
            Δt = {selected ? selected[1] - selected[0] : '—'} hr · ΔV ={' '}
            {selected
              ? volumeAt(CISTERN.points, selected[1]) - volumeAt(CISTERN.points, selected[0])
              : '—'}{' '}
            gal
          </div>
          <p className="mt-2 text-xs text-[#8b9bb4]">
            Rise/run is drawn. You still compute the quotient.
          </p>
          {note && <p className="mt-2 text-[#ff4d6d]">{note}</p>}
        </div>
        <div className="rounded-lg border border-[#243044] bg-[#101722] p-4">
          <RateAnswer
            value={value}
            onValue={setValue}
            units={units}
            onUnits={setUnits}
            unitOptions={['gal/hr', 'gal', 'hr', 'none']}
            meaning={meaning}
            onMeaning={setMeaning}
            meaningOptions={task.meaningOptions}
            onSubmit={submit}
          />
        </div>
      </div>
    </div>
  )
}
