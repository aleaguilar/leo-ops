import { Component, type ErrorInfo, type ReactNode, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'

export function webglOk(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

type BarrierState = { failed: boolean }

class WebGlBarrier extends Component<{ fallback: ReactNode; children: ReactNode }, BarrierState> {
  state: BarrierState = { failed: false }

  static getDerivedStateFromError(): BarrierState {
    return { failed: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    this.setState({ failed: true })
  }

  render(): ReactNode {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

type SceneProps = {
  fallback: ReactNode
  children: ReactNode
  className?: string
}

export function WebGlScene({ fallback, children, className }: SceneProps) {
  const ok = useMemo(() => webglOk(), [])
  if (!ok) return <>{fallback}</>
  return (
    <WebGlBarrier fallback={fallback}>
      <div className={className ?? 'h-64 w-full overflow-hidden rounded-lg border border-[#243044]'}>
        <Canvas
          camera={{ position: [0, 1.4, 6.5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: 'low-power' }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 3]} intensity={1.1} />
          {children}
        </Canvas>
      </div>
    </WebGlBarrier>
  )
}
