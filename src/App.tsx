import { useCallback, useEffect, useMemo, useState } from 'react'
import { Hud } from './components/Hud'
import {
  defaultLifetime,
  loadLifetime,
  loadSession,
  mergeLifetimeSkills,
  pickTip,
  saveLifetime,
  saveSession,
} from './lib/storage'
import {
  applyGrade,
  clearGlitch,
  freshSession,
  nextStage,
  stageLabel,
} from './lib/session'
import { Briefing } from './stages/Briefing'
import { BossCheck } from './stages/BossCheck'
import { CisternOps } from './stages/CisternOps'
import { Debrief } from './stages/Debrief'
import { SlopeDuel } from './stages/SlopeDuel'
import { Warmup } from './stages/Warmup'
import type { GradePayload, Lifetime, Session, Stage } from './types'

function App() {
  const [life, setLife] = useState<Lifetime>(() =>
    typeof localStorage === 'undefined' ? defaultLifetime() : loadLifetime(),
  )
  const [session, setSession] = useState<Session | null>(null)
  const [saved, setSaved] = useState<Session | null>(() =>
    typeof localStorage === 'undefined' ? null : loadSession(),
  )
  const [tip, setTip] = useState(life.lastTip)

  useEffect(() => {
    saveSession(session)
  }, [session])

  useEffect(() => {
    const t = window.setTimeout(() => {
      setSession((s) => (s && s.glitch !== 'none' ? clearGlitch(s) : s))
    }, 900)
    return () => window.clearTimeout(t)
  }, [session?.glitch, session?.total])

  const start = useCallback((hardMode: boolean) => {
    setSession(freshSession(hardMode))
  }, [])

  const grade = useCallback((payload: GradePayload) => {
    setSession((s) => (s ? applyGrade(s, payload) : s))
  }, [])

  const goto = useCallback((stage: Stage) => {
    setSession((s) =>
      s
        ? {
            ...s,
            stage,
            skipAvailable: false,
            fastStreak: 0,
            glitch: 'none',
            glitchMsg: '',
          }
        : s,
    )
  }, [])

  const armHard = useCallback(() => {
    setSession((s) => (s ? { ...s, hardMode: true, skipAvailable: false } : s))
    setLife((l) => {
      const next = { ...l, hardModeUnlocked: true }
      saveLifetime(next)
      return next
    })
  }, [])

  const finish = useCallback(() => {
    setSession((s) => {
      if (!s) return s
      const accuracy = s.total === 0 ? 0 : s.correct / s.total
      const nextTip = pickTip({
        accuracy,
        unitsHits: Math.round(s.skillXp.units / 14),
        signHits: Math.round(s.skillXp.signMeaning / 14),
        intervalHits: Math.round(s.skillXp.intervalNotation / 20),
        unitsTried: Math.max(1, Math.round(s.skillXp.units / 14) + (accuracy < 1 ? 1 : 0)),
        signTried: Math.max(1, Math.round(s.skillXp.signMeaning / 14) + (accuracy < 1 ? 1 : 0)),
        intervalTried: Math.max(
          1,
          Math.round(s.skillXp.intervalNotation / 20) + (accuracy < 1 ? 1 : 0),
        ),
      })
      setTip(nextTip)
      setLife((l) => {
        const next: Lifetime = {
          ...l,
          sessionsCompleted: l.sessionsCompleted + 1,
          bestAccuracy: Math.max(l.bestAccuracy, accuracy),
          bestStreak: Math.max(l.bestStreak, s.bestStreak),
          skillXp: mergeLifetimeSkills(l.skillXp, s.skillXp),
          lastTip: nextTip,
          lastPlayed: new Date().toISOString(),
          hardModeUnlocked: l.hardModeUnlocked || s.hardMode,
        }
        saveLifetime(next)
        return next
      })
      saveSession(null)
      return { ...s, stage: 'debrief' }
    })
  }, [])

  const body = useMemo(() => {
    if (!session || session.stage === 'briefing') {
      return (
        <Briefing
          life={life}
          saved={saved}
          onStart={start}
          onContinue={() => {
            if (saved) setSession(saved)
          }}
        />
      )
    }
    switch (session.stage) {
      case 'warmup':
        return (
          <Warmup
            session={session}
            onGrade={grade}
            onAdvanceIndex={() =>
              setSession((s) => (s ? { ...s, warmupIndex: s.warmupIndex + 1 } : s))
            }
            onSkip={() => goto('cistern')}
            onHard={armHard}
          />
        )
      case 'cistern':
        return (
          <CisternOps
            session={session}
            onGrade={grade}
            onAdvanceIndex={() =>
              setSession((s) => (s ? { ...s, cisternIndex: s.cisternIndex + 1 } : s))
            }
            onSkip={() => goto('duel')}
            onHard={armHard}
          />
        )
      case 'duel':
        return (
          <SlopeDuel
            session={session}
            onGrade={grade}
            onAdvanceIndex={() =>
              setSession((s) => (s ? { ...s, duelIndex: s.duelIndex + 1 } : s))
            }
            onSkip={() => goto('boss')}
            onHard={armHard}
          />
        )
      case 'boss':
        return (
          <BossCheck
            session={session}
            onGrade={grade}
            onAdvanceIndex={() =>
              setSession((s) => (s ? { ...s, bossIndex: s.bossIndex + 1 } : s))
            }
            onFinish={finish}
          />
        )
      case 'debrief':
        return (
          <Debrief
            session={session}
            life={life}
            tip={tip}
            onAgain={() => {
              saveSession(null)
              setSaved(null)
              setSession(null)
            }}
          />
        )
      default: {
        const _never: never = session.stage
        return _never
      }
    }
  }, [session, saved, life, start, grade, goto, armHard, finish, tip])

  return (
    <div className="min-h-svh">
      {session && session.stage !== 'briefing' ? <Hud session={session} /> : null}
      {body}
      {session && session.stage !== 'briefing' && session.stage !== 'debrief' && (
        <p className="sr-only">
          Current stage {stageLabel(session.stage)}. Next {stageLabel(nextStage(session.stage))}.
        </p>
      )}
    </div>
  )
}

export default App
