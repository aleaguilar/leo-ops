import { useState } from 'react'
import { judgeWhy, type WhyChip, type WhyJudgment } from '../lib/why'

type Props = {
  actionLabel: string
  actionCorrect: boolean
  chips: WhyChip[]
  keywords: string[]
  strong: string
  weak: string
  wrong: string
  onDone: (judgment: WhyJudgment) => void
}

export function WhyGate({
  actionLabel,
  actionCorrect,
  chips,
  keywords,
  strong,
  weak,
  wrong,
  onDone,
}: Props) {
  const [chipId, setChipId] = useState<string | null>(chips[0]?.id ?? null)
  const [text, setText] = useState('')

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/55 p-4 sm:items-center">
      <form
        className="w-full max-w-lg rounded-xl border border-[#243044] bg-[#101722] p-5 shadow-2xl"
        onSubmit={(e) => {
          e.preventDefault()
          const chip = chips.find((c) => c.id === chipId)
          onDone(
            judgeWhy({
              actionCorrect,
              chip,
              text,
              keywords,
              strong,
              weak,
              wrong,
            }),
          )
        }}
      >
        <p className="text-xs uppercase tracking-wide text-[#8b9bb4]">Why did you choose that?</p>
        <p className="mt-1 text-sm text-[#e8eef6]">{actionLabel}</p>
        <div className="mt-3 flex flex-col gap-1">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChipId(c.id)}
              className={`rounded-md border px-3 py-2 text-left text-sm ${
                chipId === c.id
                  ? 'border-[#3ee0c5] bg-[#3ee0c5]/15 text-[#e8eef6]'
                  : 'border-[#243044] text-[#c9d4e5]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="text-xs text-[#8b9bb4]">Add a sentence (optional, but better)</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2 text-sm text-[#e8eef6]"
            placeholder="Because…"
          />
        </label>
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-[#3ee0c5] py-2.5 text-sm font-semibold text-[#07090d]"
        >
          Lock reason
        </button>
      </form>
    </div>
  )
}

export function Reinforce({
  judgment,
  onContinue,
}: {
  judgment: WhyJudgment
  onContinue: () => void
}) {
  const tone =
    judgment.verdict === 'strong'
      ? 'border-[#5ee0a0]/50 bg-[#5ee0a0]/10'
      : judgment.verdict === 'weak'
        ? 'border-[#f0b429]/50 bg-[#f0b429]/10'
        : 'border-[#ff4d6d]/40 bg-[#ff4d6d]/10'
  const label =
    judgment.verdict === 'strong'
      ? 'Locked in'
      : judgment.verdict === 'weak'
        ? 'Move worked — reason needs work'
        : 'The system paid for that'

  return (
    <div className={`rounded-lg border p-4 ${tone}`}>
      <p className="text-xs uppercase tracking-wide text-[#8b9bb4]">{label}</p>
      <p className="mt-2 text-[#e8eef6]">{judgment.summary}</p>
      <button
        type="button"
        onClick={onContinue}
        className="mt-3 rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]"
      >
        Continue
      </button>
    </div>
  )
}
