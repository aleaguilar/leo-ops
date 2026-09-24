import type { KeyboardEvent, MouseEvent } from 'react'
import type { Series } from '../types'
import { volumeAt } from '../lib/math'

type Props = {
  series: Pick<Series, 'points' | 'xLabel' | 'yLabel' | 'tMax' | 'vMax'>
  selected?: [number, number] | null
  pending?: number | null
  onPickTime?: (t: number) => void
  interactive?: boolean
  compact?: boolean
  highlight?: [number, number] | null
}

export function RateGraph({
  series,
  selected,
  pending,
  onPickTime,
  interactive = false,
  compact = false,
  highlight,
}: Props) {
  const W = compact ? 320 : 640
  const H = compact ? 200 : 340
  const pad = compact
    ? { l: 40, r: 12, t: 16, b: 36 }
    : { l: 54, r: 16, t: 18, b: 46 }
  const innerW = W - pad.l - pad.r
  const innerH = H - pad.t - pad.b
  const { points, tMax, vMax } = series

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
    const t = Math.round(Math.min(tMax, Math.max(0, tRaw)))
    onPickTime(t)
  }

  function handleKey(e: KeyboardEvent<SVGSVGElement>) {
    if (!interactive || !onPickTime) return
    const current = pending ?? selected?.[1] ?? selected?.[0] ?? 0
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      onPickTime(Math.min(tMax, current + 1))
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      onPickTime(Math.max(0, current - 1))
    }
  }

  const windowPair = selected
  let riseRun: { x1: number; y1: number; x2: number; y2: number; va: number; vb: number } | null =
    null
  if (windowPair) {
    const [a, b] = windowPair[0] <= windowPair[1] ? windowPair : [windowPair[1], windowPair[0]]
    const va = volumeAt(points, a)
    const vb = volumeAt(points, b)
    riseRun = { x1: xOf(a), y1: yOf(va), x2: xOf(b), y2: yOf(vb), va, vb }
  }

  const hi = highlight
    ? highlight[0] <= highlight[1]
      ? highlight
      : [highlight[1], highlight[0]]
    : null

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role={interactive ? 'application' : 'img'}
      aria-label={`${series.yLabel} versus ${series.xLabel}`}
      tabIndex={interactive ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKey}
      className={`w-full ${interactive ? 'cursor-crosshair' : ''}`}
    >
      <rect x="0" y="0" width={W} height={H} fill="#0c1118" rx="10" />
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
      {hi && (
        <rect
          x={xOf(hi[0])}
          y={pad.t}
          width={Math.max(2, xOf(hi[1]) - xOf(hi[0]))}
          height={innerH}
          fill="rgba(240, 180, 41, 0.12)"
        />
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
          fill="rgba(62, 224, 197, 0.10)"
        />
      )}
      <polyline
        fill="none"
        stroke="#3ee0c5"
        strokeWidth={compact ? 2 : 2.6}
        points={poly}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((p) => (
        <circle key={`${p.t}-${p.v}`} cx={xOf(p.t)} cy={yOf(p.v)} r={compact ? 3 : 4} fill="#3ee0c5" />
      ))}
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
          <line
            x1={riseRun.x2}
            y1={riseRun.y1}
            x2={riseRun.x2}
            y2={riseRun.y2}
            stroke="#ff4d6d"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <line
            x1={riseRun.x1}
            y1={riseRun.y1}
            x2={riseRun.x2}
            y2={riseRun.y1}
            stroke="#8b9bb4"
            strokeWidth="1.5"
            strokeDasharray="3 3"
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
          y={H - 14}
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
        y={H - 2}
        textAnchor="middle"
        fill="#8b9bb4"
        fontSize="10"
        fontFamily="IBM Plex Sans, sans-serif"
      >
        {series.xLabel}
      </text>
      <text
        x="14"
        y={pad.t + innerH / 2}
        fill="#8b9bb4"
        fontSize="10"
        fontFamily="IBM Plex Sans, sans-serif"
        transform={`rotate(-90 14 ${pad.t + innerH / 2})`}
        textAnchor="middle"
      >
        {series.yLabel}
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
