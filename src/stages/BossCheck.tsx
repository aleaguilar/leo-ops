import { useState } from 'react'
import { IntervalField } from '../components/RateAnswer'
import { RateGraph } from '../components/RateGraph'
import {
  AROC_MEANINGS_NEG,
  AROC_MEANINGS_POS,
  BOSS_ITEMS,
  CISTERN,
  CISTERN_META,
  YINT_MEANINGS,
} from '../data/mission'
import { intervalsMatch, nearly, normalizeUnits, parseNumber } from '../lib/math'
import type { GradePayload, Session } from '../types'

type Props = {
  session: Session
  onGrade: (payload: GradePayload) => void
  onAdvanceIndex: () => void
  onFinish: () => void
}

export function BossCheck({ session, onGrade, onAdvanceIndex, onFinish }: Props) {
  const item = BOSS_ITEMS[Math.min(session.bossIndex, BOSS_ITEMS.length - 1)]
  const done = session.bossIndex >= BOSS_ITEMS.length
  const [note, setNote] = useState<string | null>(null)

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="mono text-[#3ee0c5]">Boss check filed.</p>
        <button
          type="button"
          className="mt-4 rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]"
          onClick={onFinish}
        >
          Open debrief
        </button>
      </div>
    )
  }

  function pass(skills: GradePayload['skills']) {
    setNote(null)
    onGrade({ correct: true, fast: false, skills })
    onAdvanceIndex()
  }

  function fail(msg: string, glitch: GradePayload['glitch'] = 'value') {
    setNote(msg)
    onGrade({ correct: false, fast: false, glitch, glitchMsg: msg })
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="mono text-xs tracking-widest text-[#f0b429]">
          BOSS  {session.bossIndex + 1}/{BOSS_ITEMS.length} · TOPIC 1 PART 6
        </p>
        <h2 className="mt-1 text-2xl font-semibold">{item.title}</h2>
        <p className="mt-1 text-sm text-[#8b9bb4]">{item.prompt}</p>
        <div className="mt-4">
          <RateGraph series={CISTERN} />
        </div>
      </div>
      <div className="rounded-lg border border-[#243044] bg-[#101722] p-4">
        <BossForm
          kind={item.kind}
          onPass={pass}
          onFail={fail}
        />
        {note && (
          <p className="mt-3 rounded border border-[#ff4d6d]/40 bg-[#2a0d14] px-3 py-2 text-sm">
            {note}
          </p>
        )}
      </div>
    </div>
  )
}

function BossForm({
  kind,
  onPass,
  onFail,
}: {
  kind: (typeof BOSS_ITEMS)[number]['kind']
  onPass: (skills: GradePayload['skills']) => void
  onFail: (msg: string, glitch?: GradePayload['glitch']) => void
}) {
  const [yint, setYint] = useState('')
  const [yMean, setYMean] = useState<string | null>(null)
  const [domain, setDomain] = useState('')
  const [range, setRange] = useState('')
  const [constant, setConstant] = useState('')
  const [decreasing, setDecreasing] = useState('')
  const [r1, setR1] = useState('')
  const [u1, setU1] = useState<string | null>(null)
  const [m1, setM1] = useState<string | null>(null)
  const [r2, setR2] = useState('')
  const [u2, setU2] = useState<string | null>(null)
  const [m2, setM2] = useState<string | null>(null)
  const [vol, setVol] = useState('')

  switch (kind) {
    case 'yint':
      return (
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            const n = parseNumber(yint)
            if (n == null || !nearly(n, CISTERN_META.yIntercept)) {
              onFail('Y-intercept is V(0). Read t = 0 on the graph.')
              return
            }
            if (yMean !== 'ok') {
              onFail('Meaning: gallons already in the tank when monitoring started.')
              return
            }
            onPass({ rateSense: 12 })
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            Y-intercept (gallons)
            <input
              value={yint}
              onChange={(e) => setYint(e.target.value)}
              inputMode="decimal"
              className="mono rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2"
            />
          </label>
          <div className="flex flex-col gap-1">
            {YINT_MEANINGS.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setYMean(m.id)}
                className={`rounded-md border px-3 py-2 text-left text-sm ${
                  yMean === m.id
                    ? 'border-[#3ee0c5] bg-[#3ee0c5]/15'
                    : 'border-[#243044]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button className="rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]">
            Lock
          </button>
        </form>
      )
    case 'domain-range':
      return (
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!intervalsMatch(domain, CISTERN_META.domain)) {
              onFail(
                'Domain is legal t-values: monitoring runs from 0 through 12 hours, inclusive → [0, 12].',
                'value',
              )
              return
            }
            if (!intervalsMatch(range, CISTERN_META.range)) {
              onFail('Range is legal volumes: lowest 20, highest 80 → [20, 80].')
              return
            }
            onPass({ intervalNotation: 24 })
          }}
        >
          <label className="text-sm">
            Domain
            <IntervalField
              value={domain}
              onChange={setDomain}
              preset={['[0, 12]', '(0, 12)', '[20, 80]']}
            />
          </label>
          <label className="text-sm">
            Range
            <IntervalField
              value={range}
              onChange={setRange}
              preset={['[20, 80]', '[0, 80]', '(20, 80)']}
            />
          </label>
          <button className="rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]">
            Lock
          </button>
        </form>
      )
    case 'features':
      return (
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!intervalsMatch(constant, CISTERN_META.constant)) {
              onFail('Flat top is closed: V = 80 from t = 4 through t = 8 → [4, 8].')
              return
            }
            if (!intervalsMatch(decreasing, CISTERN_META.decreasing)) {
              onFail('Decreasing after the hold: [8, 12].')
              return
            }
            onPass({ intervalNotation: 18, rateSense: 10 })
          }}
        >
          <label className="text-sm">
            Constant
            <IntervalField
              value={constant}
              onChange={setConstant}
              preset={['[4, 8]', '(4, 8)', '[8, 12]']}
            />
          </label>
          <label className="text-sm">
            Decreasing
            <IntervalField
              value={decreasing}
              onChange={setDecreasing}
              preset={['[8, 12]', '[0, 4]', '(8, 12)']}
            />
          </label>
          <button className="rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]">
            Lock
          </button>
        </form>
      )
    case 'aroc-pair':
      return (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            const a = parseNumber(r1)
            const b = parseNumber(r2)
            if (a == null || !nearly(a, CISTERN_META.aroc04)) {
              onFail('(80 − 20) / (4 − 0) = 15 gal/hr.')
              return
            }
            if (normalizeUnits(u1 ?? '') !== 'gal/hr') {
              onFail('First rate needs gal/hr.', 'units')
              return
            }
            if (m1 !== 'fill') {
              onFail('Positive rate → filling over that window.', 'sign')
              return
            }
            if (b == null || !nearly(b, CISTERN_META.aroc812)) {
              onFail('(40 − 80) / (12 − 8) = −10 gal/hr.')
              return
            }
            if (normalizeUnits(u2 ?? '') !== 'gal/hr') {
              onFail('Second rate needs gal/hr.', 'units')
              return
            }
            if (m2 !== 'drain') {
              onFail('Negative rate → draining over that window.', 'sign')
              return
            }
            onPass({ rateSense: 18, units: 16, signMeaning: 16 })
          }}
        >
          <fieldset>
            <legend className="mono text-xs text-[#8b9bb4]">t = 0 to t = 4</legend>
            <input
              value={r1}
              onChange={(e) => setR1(e.target.value)}
              inputMode="decimal"
              placeholder="rate"
              className="mt-1 w-full mono rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2"
            />
            <div className="mt-1 flex gap-1">
              {['gal/hr', 'gal', 'hr'].map((u) => (
                <Chip key={u} on={u1 === u} onClick={() => setU1(u)} label={u} />
              ))}
            </div>
            {AROC_MEANINGS_POS.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setM1(m.id)}
                className={`mt-1 w-full rounded border px-2 py-1.5 text-left text-xs ${
                  m1 === m.id ? 'border-[#3ee0c5]' : 'border-[#243044]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </fieldset>
          <fieldset>
            <legend className="mono text-xs text-[#8b9bb4]">t = 8 to t = 12</legend>
            <input
              value={r2}
              onChange={(e) => setR2(e.target.value)}
              inputMode="decimal"
              placeholder="rate"
              className="mt-1 w-full mono rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2"
            />
            <div className="mt-1 flex gap-1">
              {['gal/hr', 'gal', 'hr'].map((u) => (
                <Chip key={u} on={u2 === u} onClick={() => setU2(u)} label={u} />
              ))}
            </div>
            {AROC_MEANINGS_NEG.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setM2(m.id)}
                className={`mt-1 w-full rounded border px-2 py-1.5 text-left text-xs ${
                  m2 === m.id ? 'border-[#3ee0c5]' : 'border-[#243044]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </fieldset>
          <button className="rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]">
            Lock both
          </button>
        </form>
      )
    case 'volume':
      return (
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            const n = parseNumber(vol)
            if (n == null || !nearly(n, CISTERN_META.v10)) {
              onFail('Linear drain from 80 at t=8 to 40 at t=12. Midpoint t=10 is 60 gal.')
              return
            }
            onPass({ rateSense: 14 })
          }}
        >
          <label className="text-sm">
            V(10) in gallons
            <input
              value={vol}
              onChange={(e) => setVol(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full mono rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2"
            />
          </label>
          <button className="rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]">
            Lock
          </button>
        </form>
      )
    default: {
      const _never: never = kind
      return _never
    }
  }
}

function Chip({
  on,
  onClick,
  label,
}: {
  on: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mono rounded border px-2 py-1 text-xs ${
        on ? 'border-[#3ee0c5] bg-[#3ee0c5] text-[#07090d]' : 'border-[#243044]'
      }`}
    >
      {label}
    </button>
  )
}
