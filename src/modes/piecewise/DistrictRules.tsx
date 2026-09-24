import { useState } from 'react'
import { ModeBar } from '../../components/ModeBar'
import { Reinforce, WhyGate } from '../../components/WhyGate'
import { saveBest, saveTip, type WhyChip, type WhyJudgment } from '../../lib/why'

type Shell = { onBack: () => void }

type District = {
  id: string
  name: string
  interval: string
  rule: string
  applies: (x: number) => boolean
  f: (x: number) => number
}

const DISTRICTS: District[] = [
  {
    id: 'pitch',
    name: 'Pitch',
    interval: '[0, 3]',
    rule: 'y = 2x  (cover ground)',
    applies: (x) => x >= 0 && x <= 3,
    f: (x) => 2 * x,
  },
  {
    id: 'mid',
    name: 'Midtown',
    interval: '(3, 6]',
    rule: 'y = 12 − x  (coast)',
    applies: (x) => x > 3 && x <= 6,
    f: (x) => 12 - x,
  },
  {
    id: 'docks',
    name: 'Docks',
    interval: '(6, 9]',
    rule: 'y = 3  (limit)',
    applies: (x) => x > 6 && x <= 9,
    f: () => 3,
  },
]

const RUNS = [
  { x: 2, prompt: 'Van at x = 2. Which district rule, and what is y?' },
  { x: 3, prompt: 'Checkpoint x = 3 (closed Pitch). Rule and y?' },
  { x: 5, prompt: 'Midtown run, x = 5. Rule and y?' },
  { x: 6, prompt: 'Border x = 6. Which piece owns it, and y?' },
  { x: 8, prompt: 'Docks delivery x = 8. Rule and y?' },
]

const CHIPS: WhyChip[] = [
  { id: 'interval', label: 'I picked the interval that actually contains x, then evaluated that rule', sound: true },
  { id: 'closed', label: 'Filled vs hollow: closed endpoint belongs to that piece', sound: true },
  { id: 'guess', label: 'Looked at the map art and guessed', sound: false },
]

function Stars({ n }: { n: number }) {
  return (
    <p className="mono text-sm text-[#f0b429]" aria-label={`${n} wanted stars`}>
      {Array.from({ length: 5 }, (_, i) => (i < n ? '★' : '☆')).join(' ')}
      <span className="ml-2 text-[#8b9bb4]">{n === 0 ? 'clean run' : 'delivery flagged'}</span>
    </p>
  )
}

export function DistrictRules({ onBack }: Shell) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [value, setValue] = useState('')
  const [why, setWhy] = useState(false)
  const [judgment, setJudgment] = useState<WhyJudgment | null>(null)
  const [lastOk, setLastOk] = useState(false)
  const [hits, setHits] = useState(0)
  const [stars, setStars] = useState(0)
  const [done, setDone] = useState(false)
  const run = RUNS[i]
  const truth = DISTRICTS.find((d) => d.applies(run.x))

  if (done) {
    const score = Math.round((hits / RUNS.length) * 100)
    saveBest('piece-path', score)
    saveTip('piece-path', 'Closed endpoint stays with that piece. Evaluate only the rule that owns x.')
    return (
      <div className="min-h-svh">
        <ModeBar title="District Rules" onBack={onBack} />
        <div className="mx-auto max-w-lg px-4 py-10">
          <h2 className="text-2xl font-semibold">Route filed</h2>
          <p className="mt-2 text-[#8b9bb4]">
            {hits}/{RUNS.length} · {score} · wanted {stars}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]"
          >
            Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      <ModeBar title="District Rules" onBack={onBack} />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Stars n={stars} />
        <svg viewBox="0 0 640 160" className="mt-3 w-full" aria-label="Open-world district map">
          <rect width="640" height="160" fill="#0c1118" rx="10" />
          <rect x="16" y="24" width="196" height="112" fill="#14301f" stroke="#3ee0c5" />
          <text x="114" y="70" textAnchor="middle" fill="#e8eef6" fontSize="14">
            PITCH
          </text>
          <text x="114" y="92" textAnchor="middle" fill="#8b9bb4" fontSize="11">
            [0, 3] · y=2x
          </text>
          <rect x="222" y="24" width="196" height="112" fill="#1a2433" stroke="#f0b429" />
          <text x="320" y="70" textAnchor="middle" fill="#e8eef6" fontSize="14">
            MIDTOWN
          </text>
          <text x="320" y="92" textAnchor="middle" fill="#8b9bb4" fontSize="11">
            (3, 6] · y=12−x
          </text>
          <rect x="428" y="24" width="196" height="112" fill="#241a12" stroke="#8b9bb4" />
          <text x="526" y="70" textAnchor="middle" fill="#e8eef6" fontSize="14">
            DOCKS
          </text>
          <text x="526" y="92" textAnchor="middle" fill="#8b9bb4" fontSize="11">
            (6, 9] · y=3
          </text>
          <circle cx={16 + (run.x / 9) * 608} cy="136" r="7" fill="#3ee0c5" />
        </svg>
        <p className="mt-4 text-lg font-semibold">{run.prompt}</p>
        <div className="mt-3 flex flex-col gap-2">
          {DISTRICTS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setPicked(d.id)}
              className={`rounded-md border px-3 py-2 text-left text-sm ${
                picked === d.id
                  ? 'border-[#3ee0c5] bg-[#3ee0c5]/15'
                  : 'border-[#243044] hover:border-[#3ee0c5]'
              }`}
            >
              {d.name} {d.interval} — {d.rule}
            </button>
          ))}
        </div>
        <label className="mt-3 block text-sm text-[#8b9bb4]">
          y at this x
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="decimal"
            className="mt-1 w-full rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2 text-[#e8eef6]"
          />
        </label>
        {judgment ? (
          <div className="mt-4">
            <Reinforce
              judgment={judgment}
              onContinue={() => {
                setJudgment(null)
                setWhy(false)
                setPicked(null)
                setValue('')
                if (i + 1 >= RUNS.length) setDone(true)
                else setI(i + 1)
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            disabled={!picked || value.trim() === ''}
            className="engage mt-4 rounded-md bg-[#3ee0c5] px-5 py-2.5 text-sm font-semibold text-[#07090d] disabled:opacity-40"
            onClick={() => {
              const d = DISTRICTS.find((z) => z.id === picked)
              const n = Number(value)
              const ok = Boolean(d && truth && d.id === truth.id && n === truth.f(run.x))
              setLastOk(ok)
              if (ok) setHits((h) => h + 1)
              else setStars((s) => Math.min(5, s + 1))
              setWhy(true)
            }}
          >
            Commit route
          </button>
        )}
      </div>
      {why && !judgment && (
        <WhyGate
          actionLabel={`x = ${run.x} · ${picked ?? '?'} · y = ${value}`}
          actionCorrect={lastOk}
          chips={CHIPS}
          keywords={['interval', 'piece', 'endpoint', 'closed', 'open', 'rule']}
          strong="Zone first, then the formula. Closed endpoints stay with that district. Wrong piece is a flagged delivery — not a street war."
          weak="You picked a zone. Say why: which inequality contains x, then plug into that rule only."
          wrong="Wrong district = wanted stars and a failed drop. Re-read the brackets. [ ] includes the end; ( ) does not."
          onDone={setJudgment}
        />
      )}
    </div>
  )
}
