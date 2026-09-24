type Props = {
  title: string
  onBack: () => void
}

export function ModeBar({ title, onBack }: Props) {
  return (
    <header className="border-b border-[#243044] bg-[#07090d]/95 px-4 py-2">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-[#243044] px-3 py-1.5 text-sm text-[#c9d4e5] hover:border-[#3ee0c5]"
        >
          Menu
        </button>
        <h1 className="text-sm font-semibold text-[#e8eef6]">{title}</h1>
      </div>
    </header>
  )
}
