import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { Group, Mesh, Quaternion, Vector3 } from 'three'
import { WebGlScene } from './WebGlScene'

export type Atom = {
  x: number
  y: number
  z: number
  color: string
  r: number
}

export type Bond = { a: number; b: number }

export type MoleculeSpec = {
  atoms: Atom[]
  bonds: Bond[]
}

function BondMesh({ start, end }: { start: Atom; end: Atom }) {
  const ref = useRef<Mesh>(null)
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const a = new Vector3(start.x, start.y, start.z)
    const b = new Vector3(end.x, end.y, end.z)
    mesh.position.copy(a).add(b).multiplyScalar(0.5)
    const dir = b.clone().sub(a)
    const len = dir.length()
    mesh.scale.set(1, len, 1)
    const q = new Quaternion()
    q.setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize())
    mesh.quaternion.copy(q)
  }, [start, end])
  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.07, 0.07, 1, 8]} />
      <meshStandardMaterial color="#9aa7b8" />
    </mesh>
  )
}

function Spin({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.4
  })
  return <group ref={ref}>{children}</group>
}

function MoleculeGroup({ spec }: { spec: MoleculeSpec }) {
  return (
    <Spin>
      {spec.atoms.map((atom, i) => (
        <mesh key={`a-${i}`} position={[atom.x, atom.y, atom.z]}>
          <sphereGeometry args={[atom.r, 16, 16]} />
          <meshStandardMaterial color={atom.color} roughness={0.35} metalness={0.1} />
        </mesh>
      ))}
      {spec.bonds.map((bond, i) => {
        const start = spec.atoms[bond.a]
        const end = spec.atoms[bond.b]
        if (!start || !end) return null
        return <BondMesh key={`b-${i}`} start={start} end={end} />
      })}
    </Spin>
  )
}

function SvgFallback({ spec, label }: { spec: MoleculeSpec; label: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-[#243044] bg-[#0c1118]">
      <svg viewBox="0 0 160 140" className="h-40 w-full" aria-label={label}>
        {spec.bonds.map((b, i) => {
          const a0 = spec.atoms[b.a]
          const a1 = spec.atoms[b.b]
          if (!a0 || !a1) return null
          return (
            <line
              key={i}
              x1={80 + a0.x * 22}
              y1={70 - a0.y * 22}
              x2={80 + a1.x * 22}
              y2={70 - a1.y * 22}
              stroke="#9aa7b8"
              strokeWidth="3"
            />
          )
        })}
        {spec.atoms.map((a, i) => (
          <circle key={i} cx={80 + a.x * 22} cy={70 - a.y * 22} r={a.r * 14} fill={a.color} />
        ))}
      </svg>
      <p className="mono text-[11px] text-[#8b9bb4]">2D fallback · {label}</p>
    </div>
  )
}

export function MoleculeView({ spec, label }: { spec: MoleculeSpec; label: string }) {
  const fallback = useMemo(() => <SvgFallback spec={spec} label={label} />, [spec, label])
  return (
    <WebGlScene fallback={fallback} className="h-64 w-full overflow-hidden rounded-lg border border-[#243044] bg-[#05070a]">
      <MoleculeGroup spec={spec} />
    </WebGlScene>
  )
}

const C = '#d9dde3'
const O = '#ff4d6d'
const H = '#8ec8ff'
const N = '#5b8cff'
const P = '#f0b429'

export const MOL: Record<string, MoleculeSpec> = {
  glucose: {
    atoms: [
      { x: -1.2, y: 0.4, z: 0, color: C, r: 0.32 },
      { x: -0.2, y: 1.1, z: 0.2, color: C, r: 0.32 },
      { x: 1.0, y: 0.6, z: 0, color: C, r: 0.32 },
      { x: 1.1, y: -0.7, z: -0.1, color: C, r: 0.32 },
      { x: -0.1, y: -1.2, z: 0.1, color: C, r: 0.32 },
      { x: -1.3, y: -0.7, z: 0, color: O, r: 0.28 },
      { x: 2.1, y: 1.2, z: 0.3, color: O, r: 0.26 },
      { x: 2.0, y: -1.3, z: 0, color: O, r: 0.26 },
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 3, b: 4 },
      { a: 4, b: 5 },
      { a: 5, b: 0 },
      { a: 2, b: 6 },
      { a: 3, b: 7 },
    ],
  },
  polymer: {
    atoms: [
      { x: -2.4, y: 0.3, z: 0, color: C, r: 0.3 },
      { x: -1.4, y: 1.0, z: 0, color: C, r: 0.3 },
      { x: -0.4, y: 0.3, z: 0, color: O, r: 0.26 },
      { x: 0.6, y: 1.0, z: 0, color: C, r: 0.3 },
      { x: 1.6, y: 0.3, z: 0, color: C, r: 0.3 },
      { x: 2.6, y: 1.0, z: 0, color: C, r: 0.3 },
      { x: -0.4, y: -1.0, z: 0.4, color: O, r: 0.22 },
      { x: 0.2, y: -1.6, z: 0.2, color: H, r: 0.16 },
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 3, b: 4 },
      { a: 4, b: 5 },
      { a: 2, b: 6 },
      { a: 6, b: 7 },
    ],
  },
  water: {
    atoms: [
      { x: 0, y: 0.2, z: 0, color: O, r: 0.34 },
      { x: -0.8, y: -0.5, z: 0.2, color: H, r: 0.2 },
      { x: 0.8, y: -0.5, z: -0.2, color: H, r: 0.2 },
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 0, b: 2 },
    ],
  },
  peptide: {
    atoms: [
      { x: -1.8, y: 0.4, z: 0, color: N, r: 0.28 },
      { x: -0.6, y: 0.2, z: 0, color: C, r: 0.3 },
      { x: 0.5, y: 0.9, z: 0.2, color: C, r: 0.28 },
      { x: 1.6, y: 0.4, z: 0, color: N, r: 0.28 },
      { x: 2.7, y: 0.8, z: 0, color: C, r: 0.3 },
      { x: 0.5, y: 2.0, z: 0.1, color: O, r: 0.26 },
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 3, b: 4 },
      { a: 2, b: 5 },
    ],
  },
  lipid: {
    atoms: [
      { x: -2.4, y: 0, z: 0, color: C, r: 0.28 },
      { x: -1.4, y: 0.15, z: 0.1, color: C, r: 0.28 },
      { x: -0.4, y: 0, z: 0, color: C, r: 0.28 },
      { x: 0.6, y: 0.15, z: -0.1, color: C, r: 0.28 },
      { x: 1.6, y: 0, z: 0, color: C, r: 0.28 },
      { x: 2.5, y: 0.5, z: 0.2, color: O, r: 0.26 },
      { x: 2.6, y: -0.6, z: -0.1, color: O, r: 0.24 },
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 3, b: 4 },
      { a: 4, b: 5 },
      { a: 4, b: 6 },
    ],
  },
  nucleotide: {
    atoms: [
      { x: -1.6, y: -0.6, z: 0, color: P, r: 0.32 },
      { x: -0.6, y: 0.2, z: 0, color: O, r: 0.24 },
      { x: 0.4, y: -0.4, z: 0.2, color: C, r: 0.28 },
      { x: 1.3, y: 0.4, z: 0, color: C, r: 0.28 },
      { x: 2.3, y: 1.1, z: 0.2, color: N, r: 0.28 },
      { x: 3.1, y: 0.4, z: 0, color: C, r: 0.26 },
      { x: 2.5, y: 2.1, z: 0, color: N, r: 0.26 },
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 3, b: 4 },
      { a: 4, b: 5 },
      { a: 4, b: 6 },
    ],
  },
  hydroxyl: {
    atoms: [
      { x: -0.8, y: 0, z: 0, color: C, r: 0.3 },
      { x: 0.4, y: 0.2, z: 0, color: O, r: 0.28 },
      { x: 1.2, y: -0.3, z: 0.2, color: H, r: 0.18 },
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
    ],
  },
  carboxyl: {
    atoms: [
      { x: -1.2, y: 0, z: 0, color: C, r: 0.3 },
      { x: 0.1, y: 0.2, z: 0, color: C, r: 0.3 },
      { x: 0.9, y: 1.1, z: 0, color: O, r: 0.26 },
      { x: 0.8, y: -0.9, z: 0, color: O, r: 0.26 },
      { x: 1.7, y: -1.2, z: 0.2, color: H, r: 0.16 },
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 3, b: 4 },
    ],
  },
  amino: {
    atoms: [
      { x: -1.0, y: 0, z: 0, color: C, r: 0.3 },
      { x: 0.3, y: 0.3, z: 0, color: N, r: 0.3 },
      { x: 1.0, y: 1.0, z: 0.3, color: H, r: 0.16 },
      { x: 0.9, y: -0.5, z: -0.2, color: H, r: 0.16 },
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
      { a: 1, b: 3 },
    ],
  },
  phosphate: {
    atoms: [
      { x: 0, y: 0.2, z: 0, color: P, r: 0.34 },
      { x: 0.9, y: 1.1, z: 0, color: O, r: 0.24 },
      { x: -0.9, y: 1.0, z: 0.2, color: O, r: 0.24 },
      { x: 0.8, y: -0.9, z: 0.2, color: O, r: 0.24 },
      { x: -0.7, y: -0.8, z: -0.2, color: O, r: 0.24 },
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 0, b: 2 },
      { a: 0, b: 3 },
      { a: 0, b: 4 },
    ],
  },
}
