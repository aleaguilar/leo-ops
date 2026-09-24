import type { Point, Series } from '../types'

export const CISTERN: Series = {
  id: 'gulliver-cistern-12h',
  title: 'Rainwater cistern — 12h monitor',
  xLabel: 'time since monitoring began (hours)',
  yLabel: 'volume (gallons)',
  tMax: 12,
  vMax: 80,
  points: [
    { t: 0, v: 20 },
    { t: 2, v: 50 },
    { t: 4, v: 80 },
    { t: 8, v: 80 },
    { t: 10, v: 60 },
    { t: 12, v: 40 },
  ],
}

export const CISTERN_META = {
  yIntercept: 20,
  domain: '[0, 12]',
  range: '[20, 80]',
  constant: '[4, 8]',
  decreasing: '[8, 12]',
  increasing: '[0, 4]',
  aroc04: 15,
  aroc812: -10,
  v10: 60,
}

export const HARD_CISTERN: Series = {
  id: 'hard-piecewise-cistern',
  title: 'Hard Mode cistern — piecewise',
  xLabel: 'time (hours)',
  yLabel: 'volume (gallons)',
  tMax: 12,
  vMax: 80,
  points: [
    { t: 0, v: 40 },
    { t: 2, v: 80 },
    { t: 5, v: 80 },
    { t: 7, v: 20 },
    { t: 9, v: 20 },
    { t: 12, v: 50 },
  ],
}

export type MeaningOpt = { id: string; label: string }

export type WarmupShot = {
  id: string
  prompt: string
  detail: string
  points?: Point[]
  xLabel?: string
  yLabel?: string
  tMax?: number
  vMax?: number
  answer: number
  units: string
  unitOptions: string[]
  meaningId: string
  meaningOptions: MeaningOpt[]
  reteach: string
}

export const WARMUP: WarmupShot[] = [
  {
    id: 'w1',
    prompt: 'f(2) = 10 and f(8) = 28. Average rate of change from 2 to 8?',
    detail: 'No units required — just the number and whether f is rising.',
    answer: 3,
    units: 'none',
    unitOptions: ['none', 'gal/hr', '°F/hr'],
    meaningId: 'inc',
    meaningOptions: [
      { id: 'inc', label: 'f is increasing on average' },
      { id: 'dec', label: 'f is decreasing on average' },
      { id: 'flat', label: 'f is constant' },
    ],
    reteach:
      '(28 − 10) / (8 − 2) = 18/6 = 3. Positive slope of the secant → increasing.',
  },
  {
    id: 'w2',
    prompt:
      'Tank: 40 gal at t = 1 hr, 16 gal at t = 5 hr. Average rate of change?',
    detail: 'Demand units. Sign is a story, not decoration.',
    answer: -6,
    units: 'gal/hr',
    unitOptions: ['gal/hr', 'gal', 'hr', 'none'],
    meaningId: 'drain',
    meaningOptions: [
      { id: 'fill', label: 'net fill — volume rising' },
      { id: 'drain', label: 'net drain — volume falling' },
      { id: 'hold', label: 'volume holding steady' },
    ],
    reteach:
      '(16 − 40) / (5 − 1) = −24/4 = −6 gal/hr. Negative means net drain.',
  },
  {
    id: 'w3',
    prompt: 'Read the graph. Average rate of change from t = 0 to t = 4?',
    detail: 'Same formula. Pull two points, then divide.',
    points: [
      { t: 0, v: 10 },
      { t: 2, v: 20 },
      { t: 4, v: 30 },
    ],
    xLabel: 't (hours)',
    yLabel: 'V (gallons)',
    tMax: 6,
    vMax: 40,
    answer: 5,
    units: 'gal/hr',
    unitOptions: ['gal/hr', 'gal', 'hr', 'none'],
    meaningId: 'fill',
    meaningOptions: [
      { id: 'fill', label: 'filling — positive rate' },
      { id: 'drain', label: 'draining — negative rate' },
      { id: 'hold', label: 'holding — zero rate' },
    ],
    reteach: '(30 − 10) / (4 − 0) = 20/4 = 5 gal/hr. The secant slopes up.',
  },
]

export const WARMUP_HARD: WarmupShot = {
  id: 'wh',
  prompt:
    'Hard: piecewise. AROC from t = 0 to t = 4 — not the steep piece alone.',
  detail: 'Average rate uses the endpoints of the window you were asked for.',
  points: [
    { t: 0, v: 0 },
    { t: 2, v: 8 },
    { t: 4, v: 8 },
  ],
  xLabel: 't',
  yLabel: 'f(t)',
  tMax: 5,
  vMax: 12,
  answer: 2,
  units: 'none',
  unitOptions: ['none', 'gal/hr'],
  meaningId: 'inc',
  meaningOptions: [
    { id: 'inc', label: 'net increase over [0, 4]' },
    { id: 'dec', label: 'net decrease over [0, 4]' },
    { id: 'flat', label: 'flat the whole way' },
  ],
  reteach:
    '(8 − 0) / (4 − 0) = 2. The second half is flat, so the average is smaller than the first steep piece.',
}

export type CisternTask = {
  id: string
  title: string
  brief: string
  window: [number, number]
  windowHint: string
  answer: number
  units: string
  meaningId: string
  meaningOptions: MeaningOpt[]
  reteach: string
  allowAnyZero?: boolean
  allowAnyNegative2h?: boolean
}

export const CISTERN_TASKS: CisternTask[] = [
  {
    id: 'c1',
    title: 'Lock the fill window',
    brief: 'Select t = 0 to t = 4, then report ΔV/Δt.',
    window: [0, 4],
    windowHint: 'Need the window 0 → 4.',
    answer: 15,
    units: 'gal/hr',
    meaningId: 'fill',
    meaningOptions: [
      { id: 'fill', label: 'volume increasing — rain in' },
      { id: 'drain', label: 'volume decreasing — water out' },
      { id: 'hold', label: 'volume unchanged' },
    ],
    reteach: '(80 − 20) / (4 − 0) = 60/4 = 15 gal/hr. Positive = filling.',
  },
  {
    id: 'c2',
    title: 'Lock the drain window',
    brief: 'Select t = 8 to t = 12. Same formula, opposite story.',
    window: [8, 12],
    windowHint: 'Need the window 8 → 12.',
    answer: -10,
    units: 'gal/hr',
    meaningId: 'drain',
    meaningOptions: [
      { id: 'fill', label: 'volume increasing — rain in' },
      { id: 'drain', label: 'volume decreasing — water out' },
      { id: 'hold', label: 'volume unchanged' },
    ],
    reteach: '(40 − 80) / (12 − 8) = −40/4 = −10 gal/hr. Negative = draining.',
  },
  {
    id: 'c3',
    title: 'Find a hold',
    brief: 'Select any 2-hour window where average rate is 0 gal/hr.',
    window: [4, 6],
    windowHint: 'Need a 2-hour slice inside the flat top.',
    answer: 0,
    units: 'gal/hr',
    meaningId: 'hold',
    meaningOptions: [
      { id: 'fill', label: 'volume increasing — rain in' },
      { id: 'drain', label: 'volume decreasing — water out' },
      { id: 'hold', label: 'volume unchanged' },
    ],
    reteach: 'From t = 4 to t = 8 the graph is flat. ΔV = 0, so rate = 0 gal/hr.',
    allowAnyZero: true,
  },
]

export const CISTERN_HARD_TASK: CisternTask = {
  id: 'c4',
  title: 'Closed endpoints',
  brief:
    'Hard: constant interval is [4, 8], not (4, 8). Select 4 → 8 and confirm AROC = 0.',
  window: [4, 8],
  windowHint: 'Need the full constant interval 4 → 8.',
  answer: 0,
  units: 'gal/hr',
  meaningId: 'hold',
  meaningOptions: [
    { id: 'fill', label: 'volume increasing' },
    { id: 'drain', label: 'volume decreasing' },
    { id: 'hold', label: 'included endpoints, still zero rate' },
  ],
  reteach:
    'V(4) = V(8) = 80, and those times are on the graph, so the interval is closed: [4, 8].',
}

export type DuelRound = {
  id: string
  prompt: string
  mode: 'greater' | 'steeper' | 'drain-faster'
  left: { label: string; points: Point[]; interval: [number, number]; tMax: number; vMax: number }
  right: { label: string; points: Point[]; interval: [number, number]; tMax: number; vMax: number }
  correct: 'left' | 'right'
}

const C_POINTS = CISTERN.points

export const DUEL_ROUNDS: DuelRound[] = [
  {
    id: 'd1',
    prompt: 'Greater average rate of change (signed — more positive wins).',
    mode: 'greater',
    left: {
      label: '[0, 4]',
      points: C_POINTS,
      interval: [0, 4],
      tMax: 12,
      vMax: 80,
    },
    right: {
      label: '[8, 12]',
      points: C_POINTS,
      interval: [8, 12],
      tMax: 12,
      vMax: 80,
    },
    correct: 'left',
  },
  {
    id: 'd2',
    prompt: 'Steeper average rate — larger |AROC|, ignore sign.',
    mode: 'steeper',
    left: {
      label: '[0, 4]',
      points: C_POINTS,
      interval: [0, 4],
      tMax: 12,
      vMax: 80,
    },
    right: {
      label: '[8, 12]',
      points: C_POINTS,
      interval: [8, 12],
      tMax: 12,
      vMax: 80,
    },
    correct: 'left',
  },
  {
    id: 'd3',
    prompt: 'Which window is draining faster (more negative AROC)?',
    mode: 'drain-faster',
    left: {
      label: 'A  [0, 4]',
      points: C_POINTS,
      interval: [0, 4],
      tMax: 12,
      vMax: 80,
    },
    right: {
      label: 'B  [8, 12]',
      points: C_POINTS,
      interval: [8, 12],
      tMax: 12,
      vMax: 80,
    },
    correct: 'right',
  },
  {
    id: 'd4',
    prompt: 'Greater AROC. Two different graphs, same window length.',
    mode: 'greater',
    left: {
      label: 'Graph A',
      points: [
        { t: 0, v: 10 },
        { t: 4, v: 18 },
      ],
      interval: [0, 4],
      tMax: 4,
      vMax: 40,
    },
    right: {
      label: 'Graph B',
      points: [
        { t: 0, v: 6 },
        { t: 4, v: 30 },
      ],
      interval: [0, 4],
      tMax: 4,
      vMax: 40,
    },
    correct: 'right',
  },
  {
    id: 'd5',
    prompt: 'Steeper |AROC|. Close call — compute, don’t eyeball.',
    mode: 'steeper',
    left: {
      label: 'A  [1, 5]',
      points: [
        { t: 1, v: 40 },
        { t: 5, v: 12 },
      ],
      interval: [1, 5],
      tMax: 6,
      vMax: 50,
    },
    right: {
      label: 'B  [2, 6]',
      points: [
        { t: 2, v: 8 },
        { t: 6, v: 32 },
      ],
      interval: [2, 6],
      tMax: 6,
      vMax: 50,
    },
    correct: 'left',
  },
]

export const DUEL_HARD: DuelRound[] = [
  {
    id: 'dh1',
    prompt: 'Hard · greater signed AROC. Piecewise — use endpoints only.',
    mode: 'greater',
    left: {
      label: 'A  [0, 2]',
      points: HARD_CISTERN.points,
      interval: [0, 2],
      tMax: 12,
      vMax: 80,
    },
    right: {
      label: 'B  [9, 12]',
      points: HARD_CISTERN.points,
      interval: [9, 12],
      tMax: 12,
      vMax: 80,
    },
    correct: 'left',
  },
  {
    id: 'dh2',
    prompt: 'Hard · steeper |AROC| on the piecewise tank.',
    mode: 'steeper',
    left: {
      label: 'A  [5, 7]',
      points: HARD_CISTERN.points,
      interval: [5, 7],
      tMax: 12,
      vMax: 80,
    },
    right: {
      label: 'B  [0, 2]',
      points: HARD_CISTERN.points,
      interval: [0, 2],
      tMax: 12,
      vMax: 80,
    },
    correct: 'left',
  },
]

export type BossKind =
  | 'yint'
  | 'domain-range'
  | 'features'
  | 'aroc-pair'
  | 'volume'

export type BossItem = {
  id: string
  kind: BossKind
  title: string
  prompt: string
}

export const BOSS_ITEMS: BossItem[] = [
  {
    id: 'b1',
    kind: 'yint',
    title: 'Y-intercept',
    prompt:
      'State the y-intercept and what it means for this cistern. Topic 1 Part 6(a).',
  },
  {
    id: 'b2',
    kind: 'domain-range',
    title: 'Domain & range',
    prompt: 'Give domain and range in interval notation. Part 6(b).',
  },
  {
    id: 'b3',
    kind: 'features',
    title: 'Constant / decreasing',
    prompt:
      'On what interval is volume constant? On what interval is it decreasing? Part 6(c).',
  },
  {
    id: 'b4',
    kind: 'aroc-pair',
    title: 'Two average rates',
    prompt:
      'AROC from t = 0 to 4, and from t = 8 to 12. Units + sign meaning. Part 6(d).',
  },
  {
    id: 'b5',
    kind: 'volume',
    title: 'Point read',
    prompt: 'Find the volume at t = 10. Part 6(e).',
  },
]

export const YINT_MEANINGS: MeaningOpt[] = [
  {
    id: 'ok',
    label: '20 gallons were already in the cistern when monitoring began',
  },
  {
    id: 'bad1',
    label: 'The cistern fills at 20 gallons per hour for 12 hours',
  },
  {
    id: 'bad2',
    label: 'The tank is empty at t = 0 and this is the maximum volume',
  },
  {
    id: 'bad3',
    label: 'After 20 hours the volume is 0 gallons',
  },
]

export const AROC_MEANINGS_POS: MeaningOpt[] = [
  { id: 'fill', label: 'Positive: volume increased on average (filling)' },
  { id: 'drain', label: 'Positive: volume decreased on average (draining)' },
  { id: 'hold', label: 'Positive: volume held constant' },
]

export const AROC_MEANINGS_NEG: MeaningOpt[] = [
  { id: 'drain', label: 'Negative: volume decreased on average (draining)' },
  { id: 'fill', label: 'Negative: volume increased on average (filling)' },
  { id: 'hold', label: 'Negative: volume held constant' },
]
