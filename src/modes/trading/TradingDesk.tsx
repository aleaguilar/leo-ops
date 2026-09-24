import { useCallback, useState } from 'react'
import { AfterAction } from '../../screens/AfterAction'
import { Briefing } from '../../screens/Briefing'
import { Ops } from '../../screens/Ops'
import { beginWave, pickTip, scoreOf, startRun, type OpsState } from '../../lib/sim'
import { defaultLifetime, loadLifetime, recordRun } from '../../lib/storage'
import { saveBest, saveTip } from '../../lib/why'
import type { Lifetime, Stage } from '../../types'

type Props = { onBack: () => void }

function readLife(): Lifetime {
  return typeof localStorage === 'undefined' ? defaultLifetime() : loadLifetime()
}

export function TradingDesk({ onBack }: Props) {
  const [life, setLife] = useState<Lifetime>(readLife)
  const [stage, setStage] = useState<Stage>('briefing')
  const [ops, setOps] = useState<OpsState | null>(null)
  const [tip, setTip] = useState(life.lastTip)

  const start = useCallback((hard: boolean) => {
    setOps(beginWave(startRun(hard)))
    setStage('ops')
  }, [])

  const finish = useCallback((finalState: OpsState) => {
    const { band, acc, score } = scoreOf(finalState.stats)
    const won = finalState.status === 'won'
    const nextTip = pickTip({
      failReason: finalState.failReason,
      lastGlitch: finalState.lastCall
        ? finalState.lastCall.correct
          ? 'none'
          : !finalState.lastCall.unitsOk
            ? 'units'
            : !finalState.lastCall.signOk
              ? 'sign'
              : 'value'
        : finalState.glitch,
      acc,
      won,
    })
    setTip(nextTip)
    saveTip('rates-flood', nextTip)
    saveBest('rates-flood', score)
    setLife((l) =>
      recordRun(l, {
        score,
        band,
        won,
        hard: finalState.hard,
        tip: nextTip,
      }),
    )
    setOps(finalState)
    setStage('afteraction')
  }, [])

  switch (stage) {
    case 'briefing':
      return <Briefing life={life} onStart={start} onBack={onBack} />
    case 'ops':
      return ops ? (
        <Ops initial={ops} onFinished={finish} onBack={onBack} />
      ) : (
        <Briefing life={life} onStart={start} onBack={onBack} />
      )
    case 'afteraction':
      return ops ? (
        <AfterAction
          state={ops}
          tip={tip}
          bestScore={Math.max(life.bestScore, scoreOf(ops.stats).score)}
          onAgain={() => {
            setOps(null)
            setStage('briefing')
          }}
          onBack={onBack}
        />
      ) : (
        <Briefing life={life} onStart={start} onBack={onBack} />
      )
    default: {
      const _never: never = stage
      return _never
    }
  }
}
