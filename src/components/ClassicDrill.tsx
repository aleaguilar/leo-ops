import { useEffect, useState } from 'react'
import { ModeBar } from './ModeBar'
import { saveBest, saveTip } from '../lib/why'

export type DrillItem = {
  id: string
  prompt: string
  options: { id: string; label: string }[]
  answer: string
  teach: string
}

type Props = {
  title: string
  intro: string
  items: DrillItem[]
  onBack: () => void
  modeId: Parameters<typeof saveTip>[0]
}

export function ClassicDrill({ title, intro, items, onBack, modeId }: Props) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const item = items[i]
  const locked = picked != null
  const ok = picked === item?.answer

  useEffect(() => {
    if (!done) return
    const score = Math.round((correct / items.length) * 100)
    saveBest(modeId, score)
    saveTip(modeId, items[items.length - 1]?.teach ?? '')
  }, [done, correct, items, modeId])

  if (done) {
    const score = Math.round((correct / items.length) * 100)
    return (
      <div className="min-h-svh">
        <ModeBar title={title} onBack={onBack} />
        <div className="mx-auto max-w-lg px-4 py-10">
          <h2 className="text-2xl font-semibold">Session filed</h2>
          <p className="mt-2 text-[#8b9bb4]">
            {correct}/{items.length} · {score}%
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]"
          >
            Back to menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      <ModeBar title={title} onBack={onBack} />
      <div className="mx-auto max-w-lg px-4 py-8">
        <p className="text-sm text-[#8b9bb4]">{intro}</p>
        <p className="mt-1 text-xs text-[#8b9bb4]">
          {i + 1} / {items.length}
        </p>
        <h2 className="mt-4 text-xl font-semibold">{item.prompt}</h2>
        <div className="mt-4 flex flex-col gap-2">
          {item.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={locked}
              onClick={() => {
                setPicked(opt.id)
                if (opt.id === item.answer) setCorrect((c) => c + 1)
              }}
              className={`rounded-md border px-3 py-2 text-left text-sm ${
                locked && opt.id === item.answer
                  ? 'border-[#5ee0a0] bg-[#5ee0a0]/15'
                  : locked && opt.id === picked
                    ? 'border-[#ff4d6d] bg-[#ff4d6d]/10'
                    : 'border-[#243044] hover:border-[#3ee0c5]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {locked && (
          <div className="mt-4">
            <p className="text-sm text-[#c9d4e5]">{ok ? 'Yes.' : 'Not that one.'} {item.teach}</p>
            <button
              type="button"
              className="mt-3 rounded-md bg-[#3ee0c5] px-4 py-2 text-sm font-semibold text-[#07090d]"
              onClick={() => {
                if (i + 1 >= items.length) setDone(true)
                else {
                  setI(i + 1)
                  setPicked(null)
                }
              }}
            >
              {i + 1 >= items.length ? 'Debrief' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
