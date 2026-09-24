import type { MeaningOpt } from '../data/mission'

type Props = {
  value: string
  onValue: (s: string) => void
  units: string | null
  onUnits: (u: string) => void
  unitOptions: string[]
  meaning: string | null
  onMeaning: (id: string) => void
  meaningOptions: MeaningOpt[]
  onSubmit: () => void
  submitLabel?: string
  disabled?: boolean
}

export function RateAnswer({
  value,
  onValue,
  units,
  onUnits,
  unitOptions,
  meaning,
  onMeaning,
  meaningOptions,
  onSubmit,
  submitLabel = 'Lock answer',
  disabled = false,
}: Props) {
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-[140px] flex-1 flex-col gap-1">
          <span className="mono text-[11px] uppercase tracking-wide text-[#8b9bb4]">
            Average rate
          </span>
          <input
            inputMode="decimal"
            value={value}
            onChange={(e) => onValue(e.target.value)}
            className="mono rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2 text-lg text-[#e8eef6]"
            placeholder="number"
            autoComplete="off"
            disabled={disabled}
          />
        </label>
        <div className="flex flex-col gap-1">
          <span className="mono text-[11px] uppercase tracking-wide text-[#8b9bb4]">Units</span>
          <div className="flex flex-wrap gap-1">
            {unitOptions.map((u) => (
              <button
                key={u}
                type="button"
                disabled={disabled}
                onClick={() => onUnits(u)}
                className={`mono rounded-md border px-2 py-2 text-xs ${
                  units === u
                    ? 'border-[#3ee0c5] bg-[#3ee0c5] text-[#07090d]'
                    : 'border-[#243044] text-[#e8eef6] hover:border-[#3ee0c5]'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <span className="mono text-[11px] uppercase tracking-wide text-[#8b9bb4]">
          Sign meaning
        </span>
        <div className="mt-1 flex flex-col gap-1">
          {meaningOptions.map((m) => (
            <button
              key={m.id}
              type="button"
              disabled={disabled}
              onClick={() => onMeaning(m.id)}
              className={`rounded-md border px-3 py-2 text-left text-sm ${
                meaning === m.id
                  ? 'border-[#3ee0c5] bg-[#3ee0c5]/15 text-[#e8eef6]'
                  : 'border-[#243044] text-[#c9d4e5] hover:border-[#3ee0c5]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="engage rounded-md bg-[#3ee0c5] px-4 py-2.5 text-sm font-semibold text-[#07090d] hover:brightness-110 disabled:opacity-40"
      >
        {submitLabel}
      </button>
    </form>
  )
}

type IntervalProps = {
  value: string
  onChange: (s: string) => void
  preset?: string[]
}

export function IntervalField({ value, onChange, preset = [] }: IntervalProps) {
  return (
    <div className="flex flex-col gap-1">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mono rounded-md border border-[#243044] bg-[#0c1118] px-3 py-2 text-[#e8eef6]"
        placeholder="[0, 12]"
        autoComplete="off"
        spellCheck={false}
      />
      {preset.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {preset.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className="mono rounded border border-[#243044] px-2 py-1 text-[11px] text-[#8b9bb4] hover:text-[#3ee0c5]"
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
