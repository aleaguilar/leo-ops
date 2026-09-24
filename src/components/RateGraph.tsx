import type { KeyboardEvent, MouseEvent } from 'react'
import type { Point } from '../types'
import { volumeAt } from '../lib/math'

type Props = {
  points: Point[]
  tMax: number
  vMax: number
  xLabel?: string
  yLabel?: string
  selected?: [number, number] | null
  pending?: number | null
  playhead?: number | null
  band?: [number, number] | null
  onPickTime?: (t: number) => void
  interactive?: boolean
}

export function RateGraph({
  points,
  tMax,
  vMax,
  xLabel = 'time (hours)',
  yLabel = 'mark (pts)',
  selected,
  pending,
  playhead,
  band,
  onPickTime,
  interactive = false,
}: Props) {
  const W = 640
  const H = 320
  const pad = { l: 48, r: 14, t: 16, b: 42 }
  const innerW = W - pad.l - pad.r
  const innerH = H - pad.t - pad.b

  const xOf = (t: number) => pad.l + (t / tMax) * innerW
  const yOf = (v: number) => pad.t + innerH - (v / vMax) * innerH

  const poly = points.map((p) => `${xOf(p.t)},${yOf(p.v)}`).join(' ')
  const ticksT = Array.from({ length: tMax + 1 }, (_, i) => i)
  const vStep = vMax <= 40 ? 10 : 20
  const ticksV = Array.from({ length: Math.floor(vMax / vStep) + 1 }, (_, i) => i * vStep)

  function handleClick(e: MouseEvent<SVGSVGElement>) {
    if (!interactive || !onPickTime) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const tRaw = ((x - pad.l) / innerW) * tMax
    const t = Math.round(Math.min(tMax, Math.max(0, tRaw)) * 2) / 2
    onPickTime(t)
  }

  function handleKey(e: KeyboardEvent<SVGSVGElement>) {
    if (!interactive || !onPickTime) return
    const current = pending ?? selected?.[1] ?? selected?.[0] ?? playhead ?? 0
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      onPickTime(Math.min(tMax, current + 0.5))
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      onPickTime(Math.max(0, current - 0.5))
    }
  }

  const windowPair = selected
  let riseRun: { x1: number; y1: number; x2: number; y2: number } | null = null
  if (windowPair && points.length > 0) {
    const [a, b] = windowPair[0] <= windowPair[1] ? windowPair : [windowPair[1], windowPair[0]]
    const va = volumeAt(points, a)
    const vb = volumeAt(points, b)
    riseRun = { x1: xOf(a), y1: yOf(va), x2: xOf(b), y2: yOf(vb) }
  }

  const bandLo = band ? Math.min(band[0], band[1]) : null
  const bandHi = band ? Math.max(band[0], band[1]) : null

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role={interactive ? 'application' : 'img'}
      aria-label={`${yLabel} versus ${xLabel}`}
      tabIndex={interactive ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKey}
      className={`w-full ${interactive ? 'cursor-crosshair' : ''}`}
    >
      <rect x="0" y="0" width={W} height={H} fill="#0c1118" rx="10" />
      {bandLo != null && bandHi != null && (
        <rect
          x={pad.l}
          y={yOf(bandHi)}
          width={innerW}
          height={Math.max(2, yOf(bandLo) - yOf(bandHi))}
          fill="rgba(94, 224, 160, 0.08)"
        />
      )}
      {ticksT.map((t) => (
        <line
          key={`vt-${t}`}
          x1={xOf(t)}
          x2={xOf(t)}
          y1={pad.t}
          y2={pad.t + innerH}
          stroke="#1a2534"
          strokeWidth="1"
        />
      ))}
      {ticksV.map((v) => (
        <line
          key={`ht-${v}`}
          x1={pad.l}
          x2={pad.l + innerW}
          y1={yOf(v)}
          y2={yOf(v)}
          stroke="#1a2534"
          strokeWidth="1"
        />
      ))}
      {bandLo != null && bandHi != null && (
        <>
          <line
            x1={pad.l}
            x2={pad.l + innerW}
            y1={yOf(bandLo)}
            y2={yOf(bandLo)}
            stroke="#5ee0a0"
            strokeOpacity="0.45"
            strokeDasharray="5 4"
          />
          <line
            x1={pad.l}
            x2={pad.l + innerW}
            y1={yOf(bandHi)}
            y2={yOf(bandHi)}
            stroke="#5ee0a0"
            strokeOpacity="0.45"
            strokeDasharray="5 4"
          />
        </>
      )}
      {windowPair && (
        <rect
          x={xOf(Math.min(windowPair[0], windowPair[1]))}
          y={pad.t}
          width={Math.max(
            2,
            xOf(Math.max(windowPair[0], windowPair[1])) -
              xOf(Math.min(windowPair[0], windowPair[1])),
          )}
          height={innerH}
          fill="rgba(62, 224, 197, 0.12)"
        />
      )}
      {poly.length > 0 && (
        <polyline
          fill="none"
          stroke="#3ee0c5"
          strokeWidth="2.5"
          points={poly}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
      {playhead != null && (
        <line
          x1={xOf(playhead)}
          x2={xOf(playhead)}
          y1={pad.t}
          y2={pad.t + innerH}
          stroke="#f0b429"
          strokeWidth="1.6"
        />
      )}
      {riseRun && (
        <>
          <line
            x1={riseRun.x1}
            y1={riseRun.y1}
            x2={riseRun.x2}
            y2={riseRun.y2}
            stroke="#f0b429"
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <circle cx={riseRun.x1} cy={riseRun.y1} r="5" fill="#f0b429" />
          <circle cx={riseRun.x2} cy={riseRun.y2} r="5" fill="#f0b429" />
        </>
      )}
      {pending != null && (
        <line
          x1={xOf(pending)}
          x2={xOf(pending)}
          y1={pad.t}
          y2={pad.t + innerH}
          stroke="#f0b429"
          strokeDasharray="4 3"
        />
      )}
      {ticksT.filter((t) => t % 2 === 0).map((t) => (
        <text
          key={`tl-${t}`}
          x={xOf(t)}
          y={H - 16}
          textAnchor="middle"
          fill="#8b9bb4"
          fontSize="11"
          fontFamily="IBM Plex Mono, monospace"
        >
          {t}
        </text>
      ))}
      {ticksV.map((v) => (
        <text
          key={`vl-${v}`}
          x={pad.l - 8}
          y={yOf(v) + 4}
          textAnchor="end"
          fill="#8b9bb4"
          fontSize="11"
          fontFamily="IBM Plex Mono, monospace"
        >
          {v}
        </text>
      ))}
      <text
        x={pad.l + innerW / 2}
        y={H - 3}
        textAnchor="middle"
        fill="#8b9bb4"
        fontSize="10"
        fontFamily="IBM Plex Sans, sans-serif"
      >
        {xLabel}
      </text>
      <text
        x="12"
        y={pad.t + innerH / 2}
        fill="#8b9bb4"
        fontSize="10"
        fontFamily="IBM Plex Sans, sans-serif"
        transform={`rotate(-90 12 ${pad.t + innerH / 2})`}
        textAnchor="middle"
      >
        {yLabel}
      </text>
    </svg>
  )
}

export function snapWindow(
  pending: number | null,
  t: number,
): { pending: number | null; selected: [number, number] | null } {
  if (pending == null) return { pending: t, selected: null }
  if (pending === t) return { pending, selected: null }
  const a = Math.min(pending, t)
  const b = Math.max(pending, t)
  return { pending: null, selected: [a, b] }
}
