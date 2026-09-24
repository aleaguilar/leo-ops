import { useState } from 'react'
import { ModeBar } from '../../components/ModeBar'
import { MOL, MoleculeView } from '../../components/MoleculeView'
import { Reinforce, WhyGate } from '../../components/WhyGate'
import { saveBest, saveTip, type WhyChip, type WhyJudgment } from '../../lib/why'

type Shell = { onBack: () => void }

type Step = {
  id: string
  title: string
  brief: string
  spec: keyof typeof MOL
  craft: 'dehydrate' | 'hydrolyze'
  loot: string
}

const STEPS: Step[] = [
  {
    id: 'craft',
    title: 'Forge · dehydrate',
    brief: 'Two sugar monomers in inventory. Craft a polymer: pull water out.',
    spec: 'glucose',
    craft: 'dehydrate',
    loot: 'Polymer in the stash. Water is the byproduct — not the prize.',
  },
  {
    id: 'break',
    title: 'Salvage · hydrolyze',
    brief: 'Polymer on the bench. Break it for parts: add water, split the bond.',
    spec: 'polymer',
    craft: 'hydrolyze',
    loot: 'Monomers back in inventory. Hydrolysis is the loot-break.',
  },
  {
    id: 'pep',
    title: 'Forge · peptide',
    brief: 'Amino acids. Same dehydration craft — peptide bond, water out.',
    spec: 'peptide',
    craft: 'dehydrate',
    loot: 'Peptide is still dehydration. Different monomers, same water-out rule.',
  },
]

const CHIPS: WhyChip[] = [
  { id: 'water', label: 'Dehydrate = water out to join; hydrolyze = water in to split', sound: true },
  { id: 'bond', label: 'The bond is the craft — monomers don’t vanish, they link or salvage', sound: true },
  { id: 'cool', label: 'The 3D looked busy so I picked a button', sound: false },
]

export function ForgeBench({ onBack }: Shell) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<'dehydrate' | 'hydrolyze' | null>(null)
  const [why, setWhy] = useState(false)
  const [judgment, setJudgment] = useState<WhyJudgment | null>(null)
  const [lastOk, setLastOk] = useState(false)
  const [hits, setHits] = useState(0)
  const [done, setDone] = useState(false)
  const step = STEPS[i]

  if (done) {
    const score = Math.round((hits / STEPS.length) * 100)
    saveBest('bio-forge-play', score)
    saveTip('bio-forge-play', 'Craft = dehydration (water out). Salvage = hydrolysis (water in).')
    return (
      <div className="min-h-svh">
        <ModeBar title="Forge Bench" onBack={onBack} />
        <div className="mx-auto max-w-lg px-4 py-10">
          <h2 className="text-2xl font-semibold">Stash updated</h2>
          <p className="mt-2 text-[#8b9bb4]">
            {hits}/{STEPS.length} crafts · {score}
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

  const showSpec = judgment && lastOk ? (step.craft === 'dehydrate' ? MOL.polymer : MOL.water) : MOL[step.spec]

  return (
    <div className="min-h-svh">
      <ModeBar title="Forge Bench" onBack={onBack} />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <p className="mono text-xs tracking-[0.2em] text-[#f0b429]">{step.title}</p>
        <p className="mt-2 text-[#c9d4e5]">{step.brief}</p>
        <div className="mt-4">
          <MoleculeView spec={showSpec} label={step.title} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPicked('dehydrate')}
            className={`rounded-md border px-3 py-3 text-left ${
              picked === 'dehydrate' ? 'border-[#3ee0c5] bg-[#3ee0c5]/15' : 'border-[#243044]'
            }`}
          >
            <div className="font-semibold">Dehydrate</div>
            <div className="text-xs text-[#8b9bb4]">Craft · water out</div>
          </button>
          <button
            type="button"
            onClick={() => setPicked('hydrolyze')}
            className={`rounded-md border px-3 py-3 text-left ${
              picked === 'hydrolyze' ? 'border-[#3ee0c5] bg-[#3ee0c5]/15' : 'border-[#243044]'
            }`}
          >
            <div className="font-semibold">Hydrolyze</div>
            <div className="text-xs text-[#8b9bb4]">Salvage · water in</div>
          </button>
        </div>
        {judgment ? (
          <div className="mt-4">
            <p className="mb-2 text-sm text-[#8b9bb4]">{step.loot}</p>
            <Reinforce
              judgment={judgment}
              onContinue={() => {
                setJudgment(null)
                setWhy(false)
                setPicked(null)
                if (i + 1 >= STEPS.length) setDone(true)
                else setI(i + 1)
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            disabled={!picked}
            className="engage mt-4 rounded-md bg-[#3ee0c5] px-5 py-2.5 text-sm font-semibold text-[#07090d] disabled:opacity-40"
            onClick={() => {
              const ok = picked === step.craft
              setLastOk(ok)
              if (ok) setHits((h) => h + 1)
              setWhy(true)
            }}
          >
            Commit craft
          </button>
        )}
      </div>
      {why && !judgment && (
        <WhyGate
          actionLabel={`${picked} on ${step.title}`}
          actionCorrect={lastOk}
          chips={CHIPS}
          keywords={['dehydrat', 'hydroly', 'water', 'monomer', 'polymer', 'peptide']}
          strong="Forge rule: dehydration synthesis joins monomers and drops water. Hydrolysis adds water and breaks the loot apart. Same chem, game verbs."
          weak="You picked a craft. Name the water: out to build, in to salvage."
          wrong="Wrong bench move. If you are building, water leaves. If you are breaking, water enters."
          onDone={setJudgment}
        />
      )}
    </div>
  )
}
