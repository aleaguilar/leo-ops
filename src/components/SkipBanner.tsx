type Props = {
  onSkip: () => void
  onHard: () => void
  hardMode: boolean
  nextLabel: string
}

export function SkipBanner({ onSkip, onHard, hardMode, nextLabel }: Props) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#f0b429]/50 bg-[#f0b429]/10 px-3 py-2">
      <p className="text-sm text-[#e8eef6]">
        Locked in — three fast hits. Skip remaining, or arm Hard Mode.
      </p>
      <div className="flex gap-2">
        {!hardMode && (
          <button
            type="button"
            onClick={onHard}
            className="mono rounded border border-[#f0b429] px-3 py-1.5 text-xs text-[#f0b429]"
          >
            ARM HARD MODE
          </button>
        )}
        <button
          type="button"
          onClick={onSkip}
          className="mono rounded bg-[#f0b429] px-3 py-1.5 text-xs text-[#07090d]"
        >
          SKIP → {nextLabel}
        </button>
      </div>
    </div>
  )
}
