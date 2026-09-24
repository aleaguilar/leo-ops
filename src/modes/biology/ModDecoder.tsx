import { useState } from 'react'
import { ModeBar } from '../../components/ModeBar'
import { MOL, MoleculeView, type MoleculeSpec } from '../../components/MoleculeView'
import { Reinforce, WhyGate } from '../../components/WhyGate'
import { saveBest, saveTip, type WhyChip, type WhyJudgment } from '../../lib/why'

type Shell = { onBack: () => void }

type Mod = {
  id: string
  name: string
  spec: MoleculeSpec
  water: 'mix' | 'oil'
  property: string
}

const MODS: Mod[] = [
  { id: 'oh', name: 'Hydroxyl —OH', spec: MOL.hydroxyl, water: 'mix', property: 'Polar. Pulls the chain toward water.' },
  { id: 'cooh', name: 'Carboxyl —COOH', spec: MOL.carboxyl, water: 'mix', property: 'Acid: can dump H⁺. Still water-friendly.' },
  { id: 'nh2', name: 'Amino —NH₂', spec: MOL.amino, water: 'mix', property: 'Base: can pick up H⁺. Polar.' },
  { id: 'po4', name: 'Phosphate —PO₄', spec: MOL.phosphate, water: 'mix', property: 'Charged. ATP / DNA backbone energy + info.' },
]

const CHIPS: WhyChip[] = [
  { id: 'polar', label: 'Polar or charged mods mix; naked C–H tails would oil out', sound: true },
  { id: 'job', label: 'I named what the group does (acid, base, energy) not just the letters', sound: true },
  { id: 'color', label: 'Picked from the ball colors', sound: false },
]

export function ModDecoder({ onBack }: Shell) {
  const [i, setI] = useState(0)
  const [water, setWater] = useState<'mix' | 'oil' | null>(null)
  const [why, setWhy] = useState(false)
  const [judgment, setJudgment] = useState<WhyJudgment | null>(null)
  const [lastOk, setLastOk] = useState(false)
  const [hits, setHits] = useState(0)
  const [done, setDone] = useState(false)
  const mod = MODS[i]

  if (done) {
    const score = Math.round((hits / MODS.length) * 100)
    saveBest('bio-group-play', score)
    saveTip('bio-group-play', 'OH / carboxyl / amino / phosphate are polar or charged — they mix. Hydrocarbon tails do not.')
    return (
      <div className="min-h-svh">
        <ModeBar title="Mod Decoder" onBack={onBack} />
        <div className="mx-auto max-w-lg px-4 py-10">
          <h2 className="text-2xl font-semibold">Mods decoded</h2>
          <p className="mt-2 text-[#8b9bb4]">
            {hits}/{MODS.length} · {score}
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
      <ModeBar title="Mod Decoder" onBack={onBack} />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <p className="mono text-xs tracking-[0.2em] text-[#f0b429]">SLAP A MOD · PREDICT WATER</p>
        <h2 className="mt-2 text-xl font-semibold">{mod.name}</h2>
        <p className="mt-1 text-sm text-[#8b9bb4]">{mod.property}</p>
        <div className="mt-4">
          <MoleculeView spec={mod.spec} label={mod.name} />
        </div>
        <p className="mt-4 text-sm text-[#c9d4e5]">Does this mod make the carbon more likely to mix with water, or behave like oil?</p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setWater('mix')}
            className={`rounded-md border px-4 py-2 text-sm ${
              water === 'mix' ? 'border-[#3ee0c5] bg-[#3ee0c5]/15' : 'border-[#243044]'
            }`}
          >
            Mixes
          </button>
          <button
            type="button"
            onClick={() => setWater('oil')}
            className={`rounded-md border px-4 py-2 text-sm ${
              water === 'oil' ? 'border-[#3ee0c5] bg-[#3ee0c5]/15' : 'border-[#243044]'
            }`}
          >
            Oils out
          </button>
        </div>
        {judgment ? (
          <div className="mt-4">
            <Reinforce
              judgment={judgment}
              onContinue={() => {
                setJudgment(null)
                setWhy(false)
                setWater(null)
                if (i + 1 >= MODS.length) setDone(true)
                else setI(i + 1)
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            disabled={!water}
            className="engage mt-4 rounded-md bg-[#3ee0c5] px-5 py-2.5 text-sm font-semibold text-[#07090d] disabled:opacity-40"
            onClick={() => {
              const ok = water === mod.water
              setLastOk(ok)
              if (ok) setHits((h) => h + 1)
              setWhy(true)
            }}
          >
            Decode mod
          </button>
        )}
      </div>
      {why && !judgment && (
        <WhyGate
          actionLabel={`${mod.name} → ${water}`}
          actionCorrect={lastOk}
          chips={CHIPS}
          keywords={['polar', 'water', 'acid', 'base', 'phosphate', 'hydroxyl', 'charge']}
          strong="These four mods are polar or charged. They pull a carbon chain toward water. Oil behavior is the naked hydrocarbon, not OH / COOH / NH₂ / PO₄."
          weak="You called mix vs oil. Name the job: hydroxyl polar, carboxyl acid, amino base, phosphate charged energy."
          wrong="That mod does not oil out. Re-read the group. Hydrocarbon tails hate water; these functional groups do not."
          onDone={setJudgment}
        />
      )}
    </div>
  )
}
