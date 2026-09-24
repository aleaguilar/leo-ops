export type SubjectId = 'math' | 'history' | 'biology'

export type ModeId =
  | 'rates-classic'
  | 'rates-flood'
  | 'xform-classic'
  | 'xform-forge'
  | 'piece-classic'
  | 'piece-path'
  | 'hist-claim-classic'
  | 'hist-claim-play'
  | 'hist-ur-classic'
  | 'hist-ur-play'
  | 'hist-islam-classic'
  | 'hist-islam-play'
  | 'bio-forge-classic'
  | 'bio-forge-play'
  | 'bio-id-classic'
  | 'bio-id-play'
  | 'bio-group-classic'
  | 'bio-group-play'

export type ModeKind = 'classic' | 'interactive'

export type ModeCard = {
  id: ModeId
  kind: ModeKind
  title: string
  blurb: string
  depth: 'full' | 'mvp'
}

export type Mission = {
  name: string
  modes: ModeCard[]
}

export type Subject = {
  id: SubjectId
  title: string
  tag: string
  missions: Mission[]
}

export const SUBJECTS: Subject[] = [
  {
    id: 'math',
    title: 'Math',
    tag: 'Algebra 2',
    missions: [
      {
        name: 'Rates',
        modes: [
          {
            id: 'rates-classic',
            kind: 'classic',
            title: 'Classic Rates',
            blurb: 'Warm-up shots, cistern, slope duel, Part 6 boss.',
            depth: 'full',
          },
          {
            id: 'rates-flood',
            kind: 'interactive',
            title: 'Trading Desk',
            blurb: 'Fake-money tape. AROC is momentum. Hold / scale-in / cut. Risk band 30–70.',
            depth: 'full',
          },
        ],
      },
      {
        name: 'Transformations',
        modes: [
          {
            id: 'xform-classic',
            kind: 'classic',
            title: 'Classic Transforms',
            blurb: 'Name the move: reflect, stretch, shift.',
            depth: 'full',
          },
          {
            id: 'xform-forge',
            kind: 'interactive',
            title: 'Route Editor',
            blurb: 'GTA-style mission path. Shift/stretch/reflect until it matches the drop.',
            depth: 'full',
          },
        ],
      },
      {
        name: 'Piecewise',
        modes: [
          {
            id: 'piece-classic',
            kind: 'classic',
            title: 'Classic Piecewise',
            blurb: 'Read pieces, endpoints, and evaluate.',
            depth: 'full',
          },
          {
            id: 'piece-path',
            kind: 'interactive',
            title: 'District Rules',
            blurb: 'Open-world zones: each interval has a different driving rule.',
            depth: 'full',
          },
        ],
      },
    ],
  },
  {
    id: 'history',
    title: 'History',
    tag: 'Abrahamic traditions',
    missions: [
      {
        name: 'Claim Court',
        modes: [
          {
            id: 'hist-claim-classic',
            kind: 'classic',
            title: 'Vocab docket',
            blurb: 'Abraham, covenant, Torah / Jesus, Testaments.',
            depth: 'mvp',
          },
          {
            id: 'hist-claim-play',
            kind: 'interactive',
            title: 'Transfer Hearing',
            blurb: 'Negotiate a claim with evidence. Opposing counsel talks. No violence — just receipts.',
            depth: 'full',
          },
        ],
      },
      {
        name: 'Ur vs the Pantheon',
        modes: [
          {
            id: 'hist-ur-classic',
            kind: 'classic',
            title: 'Reading checks',
            blurb: 'Why one God at Ur was a shock.',
            depth: 'mvp',
          },
          {
            id: 'hist-ur-play',
            kind: 'interactive',
            title: 'World Map: Ur',
            blurb: 'Game-map: drop pantheon cities vs the one-God spark at Ur.',
            depth: 'mvp',
          },
        ],
      },
      {
        name: 'Third Tradition',
        modes: [
          {
            id: 'hist-islam-classic',
            kind: 'classic',
            title: 'Venn + claim',
            blurb: 'What Islam shares and what it changes.',
            depth: 'mvp',
          },
          {
            id: 'hist-islam-play',
            kind: 'interactive',
            title: 'Scout Report',
            blurb: 'Predict what the third tradition shares and changes.',
            depth: 'mvp',
          },
        ],
      },
    ],
  },
  {
    id: 'biology',
    title: 'Biology',
    tag: 'Chemistry of life',
    missions: [
      {
        name: 'Molecule Forge',
        modes: [
          {
            id: 'bio-forge-classic',
            kind: 'classic',
            title: 'Monomer drills',
            blurb: 'Match monomer ↔ polymer and the reaction.',
            depth: 'mvp',
          },
          {
            id: 'bio-forge-play',
            kind: 'interactive',
            title: 'Forge Bench',
            blurb: '3D craft: dehydrate to build a polymer, hydrolyze to salvage.',
            depth: 'full',
          },
        ],
      },
      {
        name: 'Mystery Molecule',
        modes: [
          {
            id: 'bio-id-classic',
            kind: 'classic',
            title: 'Flash ID',
            blurb: 'Carb, protein, lipid, or nucleic — and why.',
            depth: 'mvp',
          },
          {
            id: 'bio-id-play',
            kind: 'interactive',
            title: 'Loot ID',
            blurb: 'Timed tag: carb / protein / lipid / nucleic from clues.',
            depth: 'mvp',
          },
        ],
      },
      {
        name: 'Functional Groups',
        modes: [
          {
            id: 'bio-group-classic',
            kind: 'classic',
            title: 'Group ↔ property',
            blurb: 'OH, carboxyl, amino, phosphate.',
            depth: 'mvp',
          },
          {
            id: 'bio-group-play',
            kind: 'interactive',
            title: 'Mod Decoder',
            blurb: '3D: slap functional-group mods on a carbon; predict water.',
            depth: 'full',
          },
        ],
      },
    ],
  },
]
