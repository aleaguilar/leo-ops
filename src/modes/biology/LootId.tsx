import { useEffect, useState } from 'react'
import { ModeBar } from '../../components/ModeBar'
import { MOL, MoleculeView, type MoleculeSpec } from '../../components/MoleculeView'
import { Reinforce, WhyGate } from '../../components/WhyGate'
import { saveBest, saveTip, type WhyChip, type WhyJudgment } from '../../lib/why'

type Shell = { onBack: () => void }

type Kind = 'carb' | 'protein' | 'lipid' | 'nucleic'

type Drop = {
  id: string
  clue: string
  spec: MoleculeSpec
  kind: Kind
}

const DROPS: Drop[] = [
  { id: 'g', clue: 'Ring carbons, oxygens on the rim, C:H:O near 1:2:1.', spec: MOL.glucose, kind: 'carb' },
  { id: 'p', clue: 'N–C–C backbone, oxygen double-bond off a carbon.', spec: MOL.peptide, kind: 'protein' },
  { id: 'l', clue: 'Long C–H tail, almost no oxygen except a couple at the head.', spec: MOL.lipid, kind: 'lipid' },
  { id: 'n', clue: 'Phosphate blob + sugar + nitrogen base.', spec: MOL.nucleotide, kind: 'nucleic' },
]

const KINDS: { id: Kind; label: string }[] = [
  { id: 'carb', label: 'Carb' },
  { id: 'protein', label: 'Protein' },
  { id: 'lipid', label: 'Lipid' },
  { id: 'nucleic', label: 'Nucleic' },
]

const CHIPS: WhyChip[] = [
  { id: 'clue', label: 'I tagged from the clue (ratio, nitrogen, tails, phosphate)', sound: true },
  { id: 'shape', label: 'The 3D parts matched the macromolecule family', sound: true },
  { id: 'rng', label: 'First icon I saw', sound: false },
]

export function LootId({ onBack }: Shell) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<Kind | null>(null)
  const [left, setLeft] = useState(12)
  const [why, setWhy] = useState(false)
  const [judgment, setJudgment] = useState<WhyJudgment | null>(null)
  const [lastOk, setLastOk] = useState(false)
  const [hits, setHits] = useState(0)
  const [done, setDone] = useState(false)
  const drop = DROPS[i]
  const paused = why || judgment != null

  useEffect(() => {
    if (paused || done) return
    const id = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) return 0
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [paused, done, i])

  useEffect(() => {
    if (left === 0 && !why && !judgment && !done) {
      setLastOk(false)
      setWhy(true)
    }
  }, [left, why, judgment, done])

  if (done) {
    const score = Math.round((hits / DROPS.length) * 100)
    saveBest('bio-id-play', score)
    saveTip('bio-id-play', 'Carb 1:2:1 rings. Protein N-backbone. Lipid tails. Nucleic = phosphate + sugar + base.')
    return (
      <div className="min-h-svh">
        <ModeBar title="Loot ID" onBack={onBack} />
        <div className="mx-auto max-w-lg px-4 py-10">
          <h2 className="text-2xl font-semibold">Inventory tagged</h2>
          <p className="mt-2 text-[#8b9bb4]">
            {hits}/{DROPS.length} · {score}
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
      <ModeBar title="Loot ID" onBack={onBack} />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <p className="mono text-xs text-[#f0b429]">TIMER {left}s · unidentified drop</p>
        <p className="mt-2 text-[#c9d4e5]">{drop.clue}</p>
        <div className="mt-4">
          <MoleculeView spec={drop.spec} label={drop.clue} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setPicked(k.id)}
              className={`rounded-md border px-3 py-2 text-sm ${
                picked === k.id ? 'border-[#3ee0c5] bg-[#3ee0c5]/15' : 'border-[#243044]'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
        {judgment ? (
          <div className="mt-4">
            <Reinforce
              judgment={judgment}
              onContinue={() => {
                setJudgment(null)
                setWhy(false)
                setPicked(null)
                setLeft(12)
                if (i + 1 >= DROPS.length) setDone(true)
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
              const ok = picked === drop.kind
              setLastOk(ok)
              if (ok) setHits((h) => h + 1)
              setWhy(true)
            }}
          >
            Tag loot
          </button>
        )}
      </div>
      {why && !judgment && (
        <WhyGate
          actionLabel={picked ? `${picked} tag` : 'Timer ran out'}
          actionCorrect={lastOk}
          chips={CHIPS}
          keywords={['carb', 'protein', 'lipid', 'nucleic', 'phosphate', 'nitrogen', 'ratio', 'tail']}
          strong="ID rule: carbs look like hydrated rings, proteins wear nitrogen in the backbone, lipids are greasy tails, nucleic acids carry phosphate + base."
          weak="You tagged it. Point at the clue: ratio, N-backbone, hydrophobic tail, or phosphate."
          wrong="Mis-tag. Re-read the drop. The 3D is a hint, the clue is the lock."
          onDone={setJudgment}
        />
      )}
    </div>
  )
}
