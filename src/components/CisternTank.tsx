import type { GlitchKind } from '../types'

type Props = {
  volume: number
  ghost?: number | null
  max?: number
  glitch: GlitchKind
  glitchMsg: string
}

const GLITCH_COPY: Record<Exclude<GlitchKind, 'none'>, string> = {
  value: 'SECANT MISALIGNED',
  units: 'UNITS OFFLINE',
  sign: 'SIGN INVERSION',
  window: 'WINDOW DESYNC',
}

export function CisternTank({
  volume,
  ghost = null,
  max = 80,
  glitch,
  glitchMsg,
}: Props) {
  const h = Math.max(0, Math.min(1, volume / max))
  const gh = ghost == null ? null : Math.max(0, Math.min(1, ghost / max))
  const waterTop = 24 + (1 - h) * 200
  const ghostTop = gh == null ? null : 24 + (1 - gh) * 200
  const isGlitch = glitch !== 'none'
  const banner = glitch === 'none' ? null : GLITCH_COPY[glitch]

  return (
    <div className={`relative ${isGlitch ? 'glitching' : ''}`}>
      <svg viewBox="0 0 160 280" className="w-full max-w-[180px] mx-auto">
        <defs>
          <linearGradient id="water" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3ee0c5" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1a8f7e" stopOpacity="0.95" />
          </linearGradient>
          <clipPath id="tank-clip">
            <rect x="36" y="24" width="88" height="200" rx="6" />
          </clipPath>
        </defs>
        <rect x="28" y="16" width="104" height="216" rx="10" fill="#0c1118" stroke="#243044" />
        {[0, 20, 40, 60, 80].map((tick) => {
          const y = 24 + (1 - tick / max) * 200
          return (
            <g key={tick}>
              <line x1="24" x2="36" y1={y} y2={y} stroke="#8b9bb4" />
              <text
                x="20"
                y={y + 4}
                textAnchor="end"
                fill="#8b9bb4"
                fontSize="9"
                fontFamily="IBM Plex Mono, monospace"
              >
                {tick}
              </text>
            </g>
          )
        })}
        {ghostTop != null && (
          <rect
            x="36"
            y={ghostTop}
            width="88"
            height={Math.max(0, 224 - ghostTop)}
            fill="rgba(240,180,41,0.18)"
            clipPath="url(#tank-clip)"
          />
        )}
        <g clipPath="url(#tank-clip)">
          <rect
            x="36"
            y={waterTop}
            width="88"
            height={Math.max(0, 224 - waterTop)}
            fill="url(#water)"
          />
          <ellipse
            className="water-wave"
            cx="80"
            cy={waterTop}
            rx="70"
            ry="6"
            fill="#7af0dc"
            opacity="0.7"
          />
        </g>
        <rect x="36" y="24" width="88" height="200" rx="6" fill="none" stroke="#3ee0c5" strokeOpacity="0.45" />
        <ellipse cx="80" cy="24" rx="44" ry="8" fill="#161f2c" stroke="#3ee0c5" strokeOpacity="0.5" />
        <text
          x="80"
          y="250"
          textAnchor="middle"
          fill="#e8eef6"
          fontSize="12"
          fontFamily="IBM Plex Mono, monospace"
        >
          {Math.round(volume)} gal
        </text>
        <text
          x="80"
          y="268"
          textAnchor="middle"
          fill="#8b9bb4"
          fontSize="9"
          fontFamily="IBM Plex Sans, sans-serif"
        >
          live level
        </text>
      </svg>
      {banner && (
        <div className="absolute inset-x-0 top-8 mx-2 rounded border border-[#ff4d6d] bg-[#2a0d14]/90 px-2 py-2 text-center">
          <div className="mono text-[11px] tracking-widest text-[#ff4d6d]">{banner}</div>
          <div className="mt-1 text-xs text-[#e8eef6]">{glitchMsg}</div>
        </div>
      )}
    </div>
  )
}
