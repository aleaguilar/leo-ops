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
          key={item.id}
          kind={item.kind}
          onPass={pass}
          onFail={fail}
          onEdit={() => setNote(null)}
        />
        {note && (
          <div className="mt-3 rounded border border-[#ff4d6d]/40 bg-[#2a0d14] px-3 py-2 text-sm">
            <p>{note}</p>
            <p className="mt-1 mono text-[11px] text-[#8b9bb4]">
              Fields stay live — fix the answer and Lock again. This is not a dead end.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function BossForm({
  kind,
  onPass,
  onFail,
  onEdit,
}: {
  kind: (typeof BOSS_ITEMS)[number]['kind']
  onPass: (skills: GradePayload['skills']) => void
  onFail: (msg: string, glitch?: GradePayload['glitch']) => void
  onEdit: () => void
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
              onChange={(e) => {
                onEdit()
                setYint(e.target.value)
              }}
              inputMode="decimal"
              className="mono rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2"
            />
          </label>
          <div className="flex flex-col gap-1">
            {YINT_MEANINGS.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => {
                  onEdit()
                  setYMean(m.id)
                }}
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
          <button type="submit" className="rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]">
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
            if (!domain.trim()) {
              onFail('Domain is empty. Tap [0, 12] (time window of the graph), then Lock.')
              return
            }
            if (!intervalsMatch(domain, CISTERN_META.domain)) {
              onFail(
                'Domain is legal t-values: monitoring runs from 0 through 12 hours, inclusive → [0, 12].',
                'value',
              )
              return
            }
            if (!range.trim()) {
              onFail('Range is empty. Tap [20, 80] (lowest to highest volume), then Lock.')
              return
            }
            if (!intervalsMatch(range, CISTERN_META.range)) {
              onFail('Range is legal volumes: lowest 20, highest 80 → [20, 80].')
              return
            }
            onPass({ intervalNotation: 24 })
          }}
        >
          <IntervalField
            label="Domain"
            value={domain}
            onChange={(s) => {
              onEdit()
              setDomain(s)
            }}
            preset={['[0, 12]', '(0, 12)', '[20, 80]']}
          />
          <IntervalField
            label="Range"
            value={range}
            onChange={(s) => {
              onEdit()
              setRange(s)
            }}
            preset={['[20, 80]', '[0, 80]', '(20, 80)']}
          />
          <button type="submit" className="rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]">
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
            if (!constant.trim() || !intervalsMatch(constant, CISTERN_META.constant)) {
              onFail('Flat top is closed: V = 80 from t = 4 through t = 8 → [4, 8]. Tap the chip, then Lock.')
              return
            }
            if (!decreasing.trim() || !intervalsMatch(decreasing, CISTERN_META.decreasing)) {
              onFail('Decreasing after the hold: [8, 12]. Tap the chip, then Lock.')
              return
            }
            onPass({ intervalNotation: 18, rateSense: 10 })
          }}
        >
          <IntervalField
            label="Constant"
            value={constant}
            onChange={(s) => {
              onEdit()
              setConstant(s)
            }}
            preset={['[4, 8]', '(4, 8)', '[8, 12]']}
          />
          <IntervalField
            label="Decreasing"
            value={decreasing}
            onChange={(s) => {
              onEdit()
              setDecreasing(s)
            }}
            preset={['[8, 12]', '[0, 4]', '(8, 12)']}
          />
          <button type="submit" className="rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]">
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
              onChange={(e) => {
                onEdit()
                setR1(e.target.value)
              }}
              inputMode="decimal"
              placeholder="rate"
              className="mt-1 w-full mono rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2"
            />
            <div className="mt-1 flex gap-1">
              {['gal/hr', 'gal', 'hr'].map((u) => (
                <Chip key={u} on={u1 === u} onClick={() => { onEdit(); setU1(u) }} label={u} />
              ))}
            </div>
            {AROC_MEANINGS_POS.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => {
                  onEdit()
                  setM1(m.id)
                }}
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
              onChange={(e) => {
                onEdit()
                setR2(e.target.value)
              }}
              inputMode="decimal"
              placeholder="rate"
              className="mt-1 w-full mono rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2"
            />
            <div className="mt-1 flex gap-1">
              {['gal/hr', 'gal', 'hr'].map((u) => (
                <Chip key={u} on={u2 === u} onClick={() => { onEdit(); setU2(u) }} label={u} />
              ))}
            </div>
            {AROC_MEANINGS_NEG.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => {
                  onEdit()
                  setM2(m.id)
                }}
                className={`mt-1 w-full rounded border px-2 py-1.5 text-left text-xs ${
                  m2 === m.id ? 'border-[#3ee0c5]' : 'border-[#243044]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </fieldset>
          <button type="submit" className="rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]">
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
              onChange={(e) => {
                onEdit()
                setVol(e.target.value)
              }}
              inputMode="decimal"
              className="mt-1 w-full mono rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2"
            />
          </label>
          <button type="submit" className="rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]">
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
