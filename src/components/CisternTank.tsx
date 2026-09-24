import type { GlitchKind } from '../types'

type Props = {
  volume: number
  max?: number
  band?: [number, number]
  glitch: GlitchKind
  glitchMsg: string
}

const GLITCH_COPY: Record<Exclude<GlitchKind, 'none'>, string> = {
  value: 'SECANT MISALIGNED',
  units: 'UNITS OFFLINE',
  sign: 'SIGN INVERSION',
  window: 'NO CALL',
}

export function CisternTank({
  volume,
  max = 80,
  band = [30, 70],
  glitch,
  glitchMsg,
}: Props) {
  const h = Math.max(0, Math.min(1, volume / max))
  const waterTop = 24 + (1 - h) * 200
  const isGlitch = glitch !== 'none'
  const banner = glitch === 'none' ? null : GLITCH_COPY[glitch]
  const loY = 24 + (1 - band[0] / max) * 200
  const hiY = 24 + (1 - band[1] / max) * 200
  const out = volume < band[0] || volume > band[1]

  return (
    <div className={`relative ${isGlitch ? 'glitching' : ''}`}>
      <svg viewBox="0 0 160 280" className="mx-auto w-full max-w-[200px]">
        <defs>
          <linearGradient id="water" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={out ? '#ff4d6d' : '#3ee0c5'} stopOpacity="0.85" />
            <stop offset="100%" stopColor={out ? '#8f1a32' : '#1a8f7e'} stopOpacity="0.95" />
          </linearGradient>
          <clipPath id="tank-clip">
            <rect x="36" y="24" width="88" height="200" rx="6" />
          </clipPath>
        </defs>
        <rect x="28" y="16" width="104" height="216" rx="10" fill="#0c1118" stroke="#243044" />
        <rect
          x="36"
          y={hiY}
          width="88"
          height={Math.max(2, loY - hiY)}
          fill="rgba(94,224,160,0.12)"
          clipPath="url(#tank-clip)"
        />
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
        <line x1="36" x2="124" y1={loY} y2={loY} stroke="#5ee0a0" strokeDasharray="3 3" />
        <line x1="36" x2="124" y1={hiY} y2={hiY} stroke="#5ee0a0" strokeDasharray="3 3" />
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
            fill={out ? '#ff8aa0' : '#7af0dc'}
            opacity="0.7"
          />
        </g>
        <rect
          x="36"
          y="24"
          width="88"
          height="200"
          rx="6"
          fill="none"
          stroke="#3ee0c5"
          strokeOpacity="0.45"
        />
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
          fill={out ? '#f0b429' : '#8b9bb4'}
          fontSize="9"
          fontFamily="IBM Plex Sans, sans-serif"
        >
          {out ? 'OUT OF BAND' : 'SAFE BAND 30–70'}
        </text>
      </svg>
      {banner && (
        <div className="absolute inset-0 flex items-center justify-center rounded bg-[#2a0d14]/85 px-3">
          <div className="text-center">
            <div className="mono text-sm tracking-widest text-[#ff4d6d]">{banner}</div>
            <div className="mt-2 text-sm text-[#e8eef6]">{glitchMsg}</div>
          </div>
        </div>
      )}
    </div>
  )
}
