import { useState } from 'react'
import type { ModeId } from './catalog'
import { Menu } from './screens/Menu'
import { ClassicRates } from './modes/classic-rates/ClassicApp'
import { TradingDesk } from './modes/trading/TradingDesk'
import {
  ClaimClassic,
  ForgeClassic,
  GroupClassic,
  IdClassic,
  IslamClassic,
  PieceClassic,
  UrClassic,
  XformClassic,
} from './modes/Classics'
import { RouteEditor } from './modes/transforms/RouteEditor'
import { DistrictRules } from './modes/piecewise/DistrictRules'
import { TransferHearing } from './modes/history/TransferHearing'
import { UrMap } from './modes/history/UrMap'
import { ScoutReport } from './modes/history/ScoutReport'
import { ForgeBench } from './modes/biology/ForgeBench'
import { LootId } from './modes/biology/LootId'
import { ModDecoder } from './modes/biology/ModDecoder'

export default function App() {
  const [mode, setMode] = useState<ModeId | null>(null)
  const back = () => setMode(null)

  if (!mode) return <Menu onPlay={setMode} />

  switch (mode) {
    case 'rates-classic':
      return <ClassicRates onBack={back} />
    case 'rates-flood':
      return <TradingDesk onBack={back} />
    case 'xform-classic':
      return <XformClassic onBack={back} />
    case 'xform-forge':
      return <RouteEditor onBack={back} />
    case 'piece-classic':
      return <PieceClassic onBack={back} />
    case 'piece-path':
      return <DistrictRules onBack={back} />
    case 'hist-claim-classic':
      return <ClaimClassic onBack={back} />
    case 'hist-claim-play':
      return <TransferHearing onBack={back} />
    case 'hist-ur-classic':
      return <UrClassic onBack={back} />
    case 'hist-ur-play':
      return <UrMap onBack={back} />
    case 'hist-islam-classic':
      return <IslamClassic onBack={back} />
    case 'hist-islam-play':
      return <ScoutReport onBack={back} />
    case 'bio-forge-classic':
      return <ForgeClassic onBack={back} />
    case 'bio-forge-play':
      return <ForgeBench onBack={back} />
    case 'bio-id-classic':
      return <IdClassic onBack={back} />
    case 'bio-id-play':
      return <LootId onBack={back} />
    case 'bio-group-classic':
      return <GroupClassic onBack={back} />
    case 'bio-group-play':
      return <ModDecoder onBack={back} />
    default: {
      const _never: never = mode
      return _never
    }
  }
}
