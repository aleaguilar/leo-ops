import { useMemo, useState } from 'react'
import { ModeBar } from '../../components/ModeBar'
import { Reinforce, WhyGate } from '../../components/WhyGate'
import { saveBest, saveTip, type WhyChip, type WhyJudgment } from '../../lib/why'

type Shell = { onBack: () => void }

type Xform = { a: number; h: number; k: number; flipX: boolean; flipY: boolean }

type Mission = {
  id: string
  title: string
  brief: string
  target: Xform
}

const PARENT = (x: number) => 0.28 * x * x

const MISSIONS: Mission[] = [
  {
    id: 'drop-a',
    title: 'Mission 01 · Shift the drop',
    brief: 'Yellow is the package drop. Slide the cyan route onto it — right 2, up 1.',
    target: { a: 1, h: 2, k: 1, flipX: false, flipY: false },
  },
  {
    id: 'drop-b',
    title: 'Mission 02 · Flip the lane',
    brief: 'Mirror the path over the x-axis so the drop sits under the highway.',
    target: { a: 1, h: 0, k: 0, flipX: true, flipY: false },
  },
  {
    id: 'drop-c',
    title: 'Mission 03 · Stretch + left',
    brief: 'Vertical stretch ×2, then shift left 1. Match the GPS ghost.',
    target: { a: 2, h: -1, k: 0, flipX: false, flipY: false },
  },
]

const CHIPS: WhyChip[] = [
  { id: 'rule', label: 'I applied the transform rule until cyan sat on yellow', sound: true },
  { id: 'inside', label: 'Inside vs outside: h shifts x, k shifts y, minus flips', sound: true },
  { id: 'guess', label: 'Mashed buttons until it looked close', sound: false },
]

function apply(x: number, t: Xform): number {
  const u = t.flipY ? -x : x
  let y = PARENT(u - t.h)
  if (t.flipX) y = -y
  return t.a * y + t.k
}

function close(a: Xform, b: Xform): boolean {
  return (
    Math.abs(a.a - b.a) < 0.05 &&
    a.h === b.h &&
    a.k === b.k &&
    a.flipX === b.flipX &&
    a.flipY === b.flipY
  )
}

function PathGraph({ live, target }: { live: Xform; target: Xform }) {
  const W = 640
  const H = 300
  const pad = { l: 36, r: 12, t: 16, b: 28 }
  const xs = Array.from({ length: 41 }, (_, i) => -4 + i * 0.2)
  const xOf = (x: number) => pad.l + ((x + 4) / 8) * (W - pad.l - pad.r)
  const yOf = (y: number) => pad.t + (1 - (y + 6) / 12) * (H - pad.t - pad.b)
  const poly = (t: Xform) => xs.map((x) => `${xOf(x)},${yOf(apply(x, t))}`).join(' ')
  const gx = xOf(0)
  const gy = yOf(0)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Mission route graph">
      <rect width={W} height={H} fill="#0c1118" rx="10" />
      <line x1={pad.l} x2={W - pad.r} y1={gy} y2={gy} stroke="#243044" />
      <line x1={gx} x2={gx} y1={pad.t} y2={H - pad.b} stroke="#243044" />
      <polyline fill="none" stroke="#f0b429" strokeWidth="3" points={poly(target)} />
      <polyline fill="none" stroke="#3ee0c5" strokeWidth="2.5" points={poly(live)} />
      <circle cx={xOf(2)} cy={yOf(apply(2, target))} r="6" fill="#f0b429" />
      <text x={W / 2} y={H - 8} textAnchor="middle" fill="#8b9bb4" fontSize="11">
        yellow = drop GPS · cyan = your route
      </text>
    </svg>
  )
}

const ZERO: Xform = { a: 1, h: 0, k: 0, flipX: false, flipY: false }

export function RouteEditor({ onBack }: Shell) {
  const [i, setI] = useState(0)
  const [live, setLive] = useState<Xform>(ZERO)
  const [judgment, setJudgment] = useState<WhyJudgment | null>(null)
  const [why, setWhy] = useState(false)
  const [hits, setHits] = useState(0)
  const [done, setDone] = useState(false)
  const [lastOk, setLastOk] = useState(false)
  const mission = MISSIONS[i]
  const matched = useMemo(() => close(live, mission.target), [live, mission])

  if (done) {
    const score = Math.round((hits / MISSIONS.length) * 100)
    saveBest('xform-forge', score)
    saveTip('xform-forge', 'Inside changes x (h, flip y-axis). Outside changes y (k, stretch, flip x-axis).')
    return (
      <div className="min-h-svh">
        <ModeBar title="Route Editor" onBack={onBack} />
        <div className="mx-auto max-w-lg px-4 py-10">
          <h2 className="text-2xl font-semibold">Drops complete</h2>
          <p className="mt-2 text-[#8b9bb4]">
            {hits}/{MISSIONS.length} packages on GPS · {score}
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
      <ModeBar title="Route Editor" onBack={onBack} />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <p className="mono text-xs tracking-[0.2em] text-[#f0b429]">{mission.title}</p>
        <p className="mt-2 text-[#c9d4e5]">{mission.brief}</p>
        <div className="mt-4">
          <PathGraph live={live} target={mission.target} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Btn onClick={() => setLive((t) => ({ ...t, h: t.h + 1 }))}>Shift right</Btn>
          <Btn onClick={() => setLive((t) => ({ ...t, h: t.h - 1 }))}>Shift left</Btn>
          <Btn onClick={() => setLive((t) => ({ ...t, k: t.k + 1 }))}>Shift up</Btn>
          <Btn onClick={() => setLive((t) => ({ ...t, k: t.k - 1 }))}>Shift down</Btn>
          <Btn onClick={() => setLive((t) => ({ ...t, a: t.a === 0.5 ? 1 : t.a * 2 }))}>Stretch ×2</Btn>
          <Btn onClick={() => setLive((t) => ({ ...t, a: t.a === 2 ? 1 : 0.5 }))}>Compress ÷2</Btn>
          <Btn onClick={() => setLive((t) => ({ ...t, flipX: !t.flipX }))}>Flip over x</Btn>
          <Btn onClick={() => setLive((t) => ({ ...t, flipY: !t.flipY }))}>Flip over y</Btn>
          <Btn onClick={() => setLive(ZERO)}>Reset route</Btn>
        </div>
        <p className="mono mt-3 text-xs text-[#8b9bb4]">
          a={live.a} · h={live.h} · k={live.k}
          {live.flipX ? ' · −f' : ''}
          {live.flipY ? ' · f(−x)' : ''}
          {matched ? ' · GPS LOCK' : ''}
        </p>
        {judgment ? (
          <div className="mt-4">
            <Reinforce
              judgment={judgment}
              onContinue={() => {
                setJudgment(null)
                setWhy(false)
                if (i + 1 >= MISSIONS.length) setDone(true)
                else {
                  setI(i + 1)
                  setLive(ZERO)
                }
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            className="engage mt-4 rounded-md bg-[#3ee0c5] px-5 py-2.5 text-sm font-semibold text-[#07090d]"
            onClick={() => {
              const ok = matched
              setLastOk(ok)
              if (ok) setHits((h) => h + 1)
              setWhy(true)
            }}
          >
            Drop package
          </button>
        )}
      </div>
      {why && !judgment && (
        <WhyGate
          actionLabel={lastOk ? 'Package on the GPS ghost.' : 'Route missed the drop.'}
          actionCorrect={lastOk}
          chips={CHIPS}
          keywords={['shift', 'stretch', 'reflect', 'axis', 'inside', 'outside', 'h', 'k']}
          strong="That's the forge: outside changes y (k, stretch, −f). Inside changes x (h, f(−x)). You moved the path, not the camera."
          weak="You got it close. Name the move: f(x−h)+k, a·f, −f, f(−x) — then stop when cyan sits on yellow."
          wrong="Wrong transform leaves the package off the pin. Reset and change one move at a time until the graphs stack."
          onDone={setJudgment}
        />
      )}
    </div>
  )
}

function Btn({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-[#243044] px-3 py-2 text-sm text-[#e8eef6] hover:border-[#3ee0c5]"
    >
      {children}
    </button>
  )
}
