import { useState } from 'react'
import { ModeBar } from '../../components/ModeBar'
import { Reinforce, WhyGate } from '../../components/WhyGate'
import { saveBest, saveTip, type WhyChip, type WhyJudgment } from '../../lib/why'

type Shell = { onBack: () => void }

type Trait = { id: string; label: string; bucket: 'share' | 'change' }

const TRAITS: Trait[] = [
  { id: 'one', label: 'One God (no pantheon)', bucket: 'share' },
  { id: 'ab', label: 'Abraham / Ibrahim as a founding figure', bucket: 'share' },
  { id: 'prop', label: 'Prophets and a revealed book', bucket: 'share' },
  { id: 'quran', label: 'Quran in Arabic as the final recitation', bucket: 'change' },
  { id: 'muh', label: 'Muhammad as the final prophet', bucket: 'change' },
  { id: 'jesus', label: 'Jesus honored as prophet, not as Son', bucket: 'change' },
]

const CHIPS: WhyChip[] = [
  { id: 'venn', label: 'Shared = already in the first two; change = Islam’s distinctive claim', sound: true },
  { id: 'jesus', label: 'Keeping Jesus in the line is not the same as the Christian Son claim', sound: true },
  { id: 'all', label: 'Marked everything shared because they are all “religions”', sound: false },
]

export function ScoutReport({ onBack }: Shell) {
  const [marks, setMarks] = useState<Record<string, 'share' | 'change' | null>>(
    Object.fromEntries(TRAITS.map((t) => [t.id, null])),
  )
  const [why, setWhy] = useState(false)
  const [judgment, setJudgment] = useState<WhyJudgment | null>(null)
  const [lastOk, setLastOk] = useState(false)
  const [done, setDone] = useState(false)
  const filled = TRAITS.every((t) => marks[t.id] != null)
  const hits = TRAITS.filter((t) => marks[t.id] === t.bucket).length

  if (done) {
    const score = Math.round((hits / TRAITS.length) * 100)
    saveBest('hist-islam-play', score)
    saveTip(
      'hist-islam-play',
      'Share: one God, Abraham, prophets. Change: Quran, Muhammad as seal, Jesus as prophet not Son.',
    )
    return (
      <div className="min-h-svh">
        <ModeBar title="Scout Report" onBack={onBack} />
        <div className="mx-auto max-w-lg px-4 py-10">
          <h2 className="text-2xl font-semibold">Report filed</h2>
          <p className="mt-2 text-[#8b9bb4]">
            {hits}/{TRAITS.length} calls · {score}
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
      <ModeBar title="Scout Report" onBack={onBack} />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <p className="text-[#c9d4e5]">
          You already have Judaism and Christianity on the board. Predict the third tradition:
          what it <em>shares</em> vs what it <em>changes</em>. Then lock the reason.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {TRAITS.map((t) => (
            <div key={t.id} className="rounded-lg border border-[#243044] bg-[#101722] p-3">
              <p className="text-sm">{t.label}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setMarks((m) => ({ ...m, [t.id]: 'share' }))}
                  className={`rounded-md border px-3 py-1.5 text-sm ${
                    marks[t.id] === 'share' ? 'border-[#3ee0c5] bg-[#3ee0c5]/15' : 'border-[#243044]'
                  }`}
                >
                  Shares
                </button>
                <button
                  type="button"
                  onClick={() => setMarks((m) => ({ ...m, [t.id]: 'change' }))}
                  className={`rounded-md border px-3 py-1.5 text-sm ${
                    marks[t.id] === 'change' ? 'border-[#3ee0c5] bg-[#3ee0c5]/15' : 'border-[#243044]'
                  }`}
                >
                  Changes
                </button>
              </div>
            </div>
          ))}
        </div>
        {judgment ? (
          <div className="mt-4">
            <Reinforce
              judgment={judgment}
              onContinue={() => {
                setJudgment(null)
                setWhy(false)
                setDone(true)
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            disabled={!filled}
            className="engage mt-4 rounded-md bg-[#3ee0c5] px-5 py-2.5 text-sm font-semibold text-[#07090d] disabled:opacity-40"
            onClick={() => {
              const ok = hits >= 5
              setLastOk(ok)
              setWhy(true)
            }}
          >
            File scout report
          </button>
        )}
      </div>
      {why && !judgment && (
        <WhyGate
          actionLabel={`${hits}/${TRAITS.length} traits in the right bucket`}
          actionCorrect={lastOk}
          chips={CHIPS}
          keywords={['share', 'change', 'quran', 'muhammad', 'abraham', 'jesus', 'monotheism', 'tawhid']}
          strong="Scout read: share the one God + Abraham + prophecy. Change the book (Quran), the seal (Muhammad), and Jesus’s status. That is the third tradition, not a copy-paste."
          weak="You filed a grid. Say the split out loud: what was already true for Jews and Christians vs what Islam adds or rejects."
          wrong="The report mixed the buckets. Shared is not “all religion.” Quran, Muhammad as final prophet, and Jesus-as-prophet are the change column."
          onDone={setJudgment}
        />
      )}
    </div>
  )
}
