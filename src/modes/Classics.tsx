import { ClassicDrill, type DrillItem } from '../components/ClassicDrill'
import type { ModeId } from '../catalog'
import {
  CLAIM_DRILLS,
  FORGE_DRILLS,
  GROUP_DRILLS,
  ID_DRILLS,
  ISLAM_DRILLS,
  PIECE_DRILLS,
  UR_DRILLS,
  XFORM_DRILLS,
} from '../data/drills'

type Shell = { onBack: () => void }

function wrap(
  modeId: ModeId,
  title: string,
  intro: string,
  items: DrillItem[],
  onBack: () => void,
) {
  return <ClassicDrill modeId={modeId} title={title} intro={intro} items={items} onBack={onBack} />
}

export function XformClassic({ onBack }: Shell) {
  return wrap(
    'xform-classic',
    'Classic Transforms',
    'Name the move. No mission chrome — just the rule.',
    XFORM_DRILLS,
    onBack,
  )
}

export function PieceClassic({ onBack }: Shell) {
  return wrap(
    'piece-classic',
    'Classic Piecewise',
    'Pick the piece from the interval, then evaluate. One soccer split-speed check.',
    PIECE_DRILLS,
    onBack,
  )
}

export function ClaimClassic({ onBack }: Shell) {
  return wrap(
    'hist-claim-classic',
    'Vocab docket',
    'Abraham, covenant, Torah, Jesus, Testaments — short checks.',
    CLAIM_DRILLS,
    onBack,
  )
}

export function UrClassic({ onBack }: Shell) {
  return wrap(
    'hist-ur-classic',
    'Reading checks',
    'Why one God at Ur was a shock next to pantheon cities.',
    UR_DRILLS,
    onBack,
  )
}

export function IslamClassic({ onBack }: Shell) {
  return wrap(
    'hist-islam-classic',
    'Venn + claim',
    'What the third tradition shares with the first two, and what it changes.',
    ISLAM_DRILLS,
    onBack,
  )
}

export function ForgeClassic({ onBack }: Shell) {
  return wrap(
    'bio-forge-classic',
    'Monomer drills',
    'Match monomer ↔ polymer and dehydration vs hydrolysis.',
    FORGE_DRILLS,
    onBack,
  )
}

export function IdClassic({ onBack }: Shell) {
  return wrap(
    'bio-id-classic',
    'Flash ID',
    'Carb, protein, lipid, or nucleic — and the clue that tags it.',
    ID_DRILLS,
    onBack,
  )
}

export function GroupClassic({ onBack }: Shell) {
  return wrap(
    'bio-group-classic',
    'Group ↔ property',
    'Hydroxyl, carboxyl, amino, phosphate — what each mod does.',
    GROUP_DRILLS,
    onBack,
  )
}
