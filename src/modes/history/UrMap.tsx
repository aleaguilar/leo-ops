import { useState } from 'react'
import { ModeBar } from '../../components/ModeBar'
import { Reinforce, WhyGate } from '../../components/WhyGate'
import { saveBest, saveTip, type WhyChip, type WhyJudgment } from '../../lib/why'

type Shell = { onBack: () => void }

type Pin = {
  id: string
  name: string
  x: number
  y: number
  kind: 'one' | 'pantheon'
  blurb: string
}

const PINS: Pin[] = [
  { id: 'ur', name: 'Ur', x: 420, y: 168, kind: 'one', blurb: 'Southern Mesopotamia. One-God spark in this unit.' },
  { id: 'babylon', name: 'Babylon', x: 400, y: 128, kind: 'pantheon', blurb: 'Pantheon city up the same river world.' },
  { id: 'memphis', name: 'Memphis', x: 250, y: 190, kind: 'pantheon', blurb: 'Nile. Many gods, city temples — not Ur’s claim.' },
  { id: 'athens', name: 'Athens', x: 175, y: 118, kind: 'pantheon', blurb: 'Greek pantheon. Different map, same pattern: many gods.' },
]

const CHIPS: WhyChip[] = [
  { id: 'map', label: 'Ur is the one-God pin; the others are pantheon cities on this map', sound: true },
  { id: 'meso', label: 'Ur sits in Mesopotamia, not on the Nile or in Greece', sound: true },
  { id: 'pretty', label: 'Clicked the brightest icon', sound: false },
]

export function UrMap({ onBack }: Shell) {
  const [picked, setPicked] = useState<string | null>(null)
  const [classified, setClassified] = useState<'one' | 'pantheon' | null>(null)
  const [why, setWhy] = useState(false)
  const [judgment, setJudgment] = useState<WhyJudgment | null>(null)
  const [hits, setHits] = useState(0)
  const [n, setN] = useState(0)
  const [lastOk, setLastOk] = useState(false)
  const [done, setDone] = useState(false)
  const pin = PINS.find((p) => p.id === picked)

  if (done) {
    const score = Math.round((hits / PINS.length) * 100)
    saveBest('hist-ur-play', score)
    saveTip('hist-ur-play', 'Ur = one-God spark in Mesopotamia. Babylon, Memphis, Athens = pantheon cities.')
    return (
      <div className="min-h-svh">
        <ModeBar title="World Map: Ur" onBack={onBack} />
        <div className="mx-auto max-w-lg px-4 py-10">
          <h2 className="text-2xl font-semibold">Map filed</h2>
          <p className="mt-2 text-[#8b9bb4]">
            {hits}/{PINS.length} pins tagged · {score}
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
      <ModeBar title="World Map: Ur" onBack={onBack} />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <p className="text-[#c9d4e5]">
          Pause-map. Tag each pin: one-God spark or pantheon city. Not a satellite brief — a claim map.
        </p>
        <svg viewBox="0 0 640 320" className="mt-4 w-full" aria-label="Game-style world map">
          <rect width="640" height="320" fill="#101a14" rx="12" />
          <path d="M40 240 C 120 200, 200 260, 300 220 C 400 180, 500 210, 600 170" fill="none" stroke="#1e3a2f" strokeWidth="18" />
          <path d="M80 80 C 160 90, 200 40, 280 70 C 360 100, 420 40, 520 80" fill="none" stroke="#243044" strokeWidth="10" />
          <text x="24" y="28" fill="#3ee0c5" fontSize="12" fontFamily="IBM Plex Mono, monospace">
            WORLD MAP · LEGEND: cyan pin = selected
          </text>
          {PINS.map((p) => (
            <g key={p.id} onClick={() => setPicked(p.id)} className="cursor-pointer">
              <circle cx={p.x} cy={p.y} r={picked === p.id ? 11 : 8} fill={picked === p.id ? '#3ee0c5' : '#f0b429'} />
              <text x={p.x + 14} y={p.y + 4} fill="#e8eef6" fontSize="13">
                {p.name}
              </text>
            </g>
          ))}
        </svg>
        {pin && (
          <div className="mt-4 rounded-lg border border-[#243044] bg-[#101722] p-4">
            <p className="font-semibold">{pin.name}</p>
            <p className="mt-1 text-sm text-[#8b9bb4]">{pin.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setClassified('one')}
                className={`rounded-md border px-3 py-2 text-sm ${
                  classified === 'one' ? 'border-[#3ee0c5] bg-[#3ee0c5]/15' : 'border-[#243044]'
                }`}
              >
                One-God spark
              </button>
              <button
                type="button"
                onClick={() => setClassified('pantheon')}
                className={`rounded-md border px-3 py-2 text-sm ${
                  classified === 'pantheon' ? 'border-[#3ee0c5] bg-[#3ee0c5]/15' : 'border-[#243044]'
                }`}
              >
                Pantheon city
              </button>
            </div>
          </div>
        )}
        {judgment ? (
          <div className="mt-4">
            <Reinforce
              judgment={judgment}
              onContinue={() => {
                setJudgment(null)
                setWhy(false)
                setPicked(null)
                setClassified(null)
                const next = n + 1
                setN(next)
                if (next >= PINS.length) setDone(true)
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            disabled={!pin || !classified}
            className="engage mt-4 rounded-md bg-[#3ee0c5] px-5 py-2.5 text-sm font-semibold text-[#07090d] disabled:opacity-40"
            onClick={() => {
              const ok = Boolean(pin && classified === pin.kind)
              setLastOk(ok)
              if (ok) setHits((h) => h + 1)
              setWhy(true)
            }}
          >
            Drop tag
          </button>
        )}
      </div>
      {why && !judgment && pin && (
        <WhyGate
          actionLabel={`${pin.name} → ${classified}`}
          actionCorrect={lastOk}
          chips={CHIPS}
          keywords={['ur', 'mesopotamia', 'pantheon', 'one god', 'nile', 'athens']}
          strong="Ur is the one-God pin in this unit. Babylon, Memphis, Athens are pantheon cities — same kind of map, different claim."
          weak="You tagged a city. Anchor it: river world vs Nile vs Greece, and whether the claim is exclusive God or many gods."
          wrong="Wrong tag. Re-read the pin. Only Ur is the one-God spark on this map."
          onDone={setJudgment}
        />
      )}
    </div>
  )
}
