import { useState } from 'react'
import { ModeBar } from '../../components/ModeBar'
import { Reinforce, WhyGate } from '../../components/WhyGate'
import { WebGlScene } from '../../components/WebGlScene'
import { saveBest, saveTip, type WhyChip, type WhyJudgment } from '../../lib/why'

type Shell = { onBack: () => void }

type Card = { id: string; label: string; good: boolean }

type Round = {
  claim: string
  counsel: string
  cards: Card[]
}

const ROUNDS: Round[] = [
  {
    claim:
      'Abraham is a shared founding figure — but Judaism, Christianity, and Islam do not tell the same story about him.',
    counsel:
      'Opposing: “If they share Abraham, the rest of the file is identical. Close the deal.”',
    cards: [
      { id: 'torah', label: 'Torah: covenant with Abraham — one God, a people, a land promise.', good: true },
      { id: 'nt', label: 'New Testament: Jesus placed in Abraham’s line; Hebrew Bible kept as Old Testament.', good: true },
      { id: 'const', label: 'Abraham drafted a medieval constitution in Latin. Same file everywhere.', good: false },
    ],
  },
  {
    claim: 'Christianity keeps Jewish scripture and adds a new claim about Jesus.',
    counsel: 'Opposing: “Christians tossed the Hebrew Bible. Fresh franchise.”',
    cards: [
      { id: 'keep', label: 'Christians read the Hebrew Bible as Old Testament and add gospels / letters.', good: true },
      { id: 'messiah', label: 'The added claim: Jesus is Messiah (and, in most churches, Son).', good: true },
      { id: 'toss', label: 'They deleted Moses and started with Caesar.', good: false },
    ],
  },
  {
    claim: 'A serious hearing names the library: Torah / Tanakh vs Old+New Testament — not “all holy books are one PDF.”',
    counsel: 'Opposing: “Testament is the Jewish word for their own Bible.”',
    cards: [
      { id: 'chr', label: '“Old/New Testament” is Christian library language.', good: true },
      { id: 'jew', label: 'Jewish communities say Tanakh / Hebrew Bible, not “old.”', good: true },
      { id: 'mix', label: 'The Talmud is a Quran chapter title.', good: false },
    ],
  },
]

const CHIPS: WhyChip[] = [
  { id: 'source', label: 'The card names a real source and what it actually claims', sound: true },
  { id: 'split', label: 'Shared figure ≠ identical story — I split what is shared from what is added', sound: true },
  { id: 'vibe', label: 'It sounded official', sound: false },
]

function Token() {
  return (
    <mesh rotation={[0.4, 0.6, 0]}>
      <cylinderGeometry args={[0.9, 0.9, 0.18, 24]} />
      <meshStandardMaterial color="#f0b429" metalness={0.4} roughness={0.3} />
    </mesh>
  )
}

export function TransferHearing({ onBack }: Shell) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [why, setWhy] = useState(false)
  const [judgment, setJudgment] = useState<WhyJudgment | null>(null)
  const [lastOk, setLastOk] = useState(false)
  const [hits, setHits] = useState(0)
  const [done, setDone] = useState(false)
  const round = ROUNDS[i]

  if (done) {
    const score = Math.round((hits / ROUNDS.length) * 100)
    saveBest('hist-claim-play', score)
    saveTip(
      'hist-claim-play',
      'Enter evidence that names a source. Shared Abraham is not a merger of the three files.',
    )
    return (
      <div className="min-h-svh">
        <ModeBar title="Transfer Hearing" onBack={onBack} />
        <div className="mx-auto max-w-lg px-4 py-10">
          <h2 className="text-2xl font-semibold">Hearing closed</h2>
          <p className="mt-2 text-[#8b9bb4]">
            {hits}/{ROUNDS.length} exhibits entered · {score}
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
      <ModeBar title="Transfer Hearing" onBack={onBack} />
      <div className="mx-auto grid max-w-4xl gap-4 px-4 py-6 md:grid-cols-[1fr_200px]">
        <div>
          <p className="mono text-xs tracking-[0.2em] text-[#f0b429]">TABLE · EXHIBIT {i + 1}/3</p>
          <h2 className="mt-2 text-xl font-semibold">{round.claim}</h2>
          <p className="mt-3 rounded-md border border-[#243044] bg-[#101722] p-3 text-sm text-[#c9d4e5]">
            {round.counsel}
          </p>
          <p className="mt-4 text-sm text-[#8b9bb4]">Enter one exhibit into the record.</p>
          <div className="mt-2 flex flex-col gap-2">
            {round.cards.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setPicked(c.id)}
                className={`rounded-md border px-3 py-2 text-left text-sm ${
                  picked === c.id
                    ? 'border-[#3ee0c5] bg-[#3ee0c5]/15'
                    : 'border-[#243044] hover:border-[#3ee0c5]'
                }`}
              >
                {c.label}
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
                  if (i + 1 >= ROUNDS.length) setDone(true)
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
                const card = round.cards.find((c) => c.id === picked)
                const ok = Boolean(card?.good)
                setLastOk(ok)
                if (ok) setHits((h) => h + 1)
                setWhy(true)
              }}
            >
              Enter exhibit
            </button>
          )}
        </div>
        <WebGlScene
          className="h-48 overflow-hidden rounded-lg border border-[#243044] bg-[#05070a]"
          fallback={
            <div className="flex h-48 items-center justify-center rounded-lg border border-[#243044] text-sm text-[#8b9bb4]">
              Hearing chip
            </div>
          }
        >
          <Token />
        </WebGlScene>
      </div>
      {why && !judgment && (
        <WhyGate
          actionLabel={round.cards.find((c) => c.id === picked)?.label ?? ''}
          actionCorrect={lastOk}
          chips={CHIPS}
          keywords={['covenant', 'torah', 'testament', 'abraham', 'source', 'jesus', 'hebrew']}
          strong="That’s a hearing, not a vibe: name the source and the claim. Shared Abraham is a transfer of a figure, not a merger of the three libraries."
          weak="You picked a card. Say why it counts: which book, which claim, and what it does not prove."
          wrong="Junk exhibit. Opposing counsel walks if the card invents a source. Bring Torah / Testament / Quran claims, not fanfic."
          onDone={setJudgment}
        />
      )}
    </div>
  )
}
