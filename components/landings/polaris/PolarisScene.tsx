"use client";

import { useMemo, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Props = { progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }>; reduced: boolean };
type Shard = { position: [number, number, number]; scale: [number, number, number]; rotation: [number, number, number]; phase: number };

function IceField({ progress, reduced }: Pick<Props, "progress" | "reduced">) {
  const shards = useMemo<Shard[]>(() => Array.from({ length: 96 }, (_, i) => {
    const ring = Math.floor(i / 24);
    const angle = (i % 24) / 24 * Math.PI * 2 + ring * 0.21;
    const radius = 1.05 + ring * 0.72 + Math.sin(i * 17.1) * 0.12;
    return {
      position: [Math.cos(angle) * radius, Math.sin(angle * 1.17) * (1.15 + ring * 0.42), Math.sin(angle) * radius - 0.8] as [number, number, number],
      scale: [0.16 + (i % 5) * 0.055, 0.35 + (i % 7) * 0.12, 0.12 + (i % 3) * 0.06] as [number, number, number],
      rotation: [angle * 0.4, angle, Math.sin(i * 3.7) * 0.36] as [number, number, number],
      phase: (i % 24) / 24,
    };
  }), []);
  const refs = useMemo(() => shards.map(() => new THREE.Object3D()), [shards]);
  const mesh = useMemo(() => ({ current: null as THREE.InstancedMesh | null }), []);

  useFrame((state) => {
    if (!mesh.current) return;
    const p = progress.current ?? 0;
    const open = THREE.MathUtils.smoothstep(p, 0.7, 2.2);
    const returnIn = THREE.MathUtils.smoothstep(p, 2.35, 3);
    const time = reduced ? 0 : state.clock.elapsedTime;
    shards.forEach((shard, i) => {
      const o = refs[i];
      const spread = 0.45 + open * (1.2 + shard.phase * 0.55) - returnIn * 0.24;
      const pulse = Math.sin(time * 0.38 + i * 1.7) * 0.06;
      o.position.set(shard.position[0] * spread, shard.position[1] * spread + pulse, shard.position[2] * spread);
      o.rotation.set(shard.rotation[0] + time * 0.012, shard.rotation[1] + time * 0.018, shard.rotation[2] + Math.sin(time * 0.2 + i) * 0.08);
      const scale = 0.68 + open * 0.4 + pulse;
      o.scale.set(shard.scale[0] * scale, shard.scale[1] * scale, shard.scale[2] * scale);
      o.updateMatrix();
      mesh.current!.setMatrixAt(i, o.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={(node) => { mesh.current = node; }} args={[undefined, undefined, shards.length]} frustumCulled={false}>
    <icosahedronGeometry args={[1, 0]} />
    <meshPhysicalMaterial color="#9ddce7" roughness={0.2} metalness={0.1} transmission={0.32} thickness={0.9} clearcoat={0.9} flatShading />
  </instancedMesh>;
}

function CurrentLines() {
  const points = useMemo(() => {
    const list: THREE.Vector3[] = [];
    for (let i = 0; i < 420; i++) {
      const t = i * 0.071;
      list.push(new THREE.Vector3(Math.sin(t * 0.4) * 5.4, Math.cos(t * 0.71) * 3.6, -2.2 - (i % 23) * 0.22));
    }
    return list;
  }, []);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return <points geometry={geometry}>
    <pointsMaterial color="#b4edf3" size={0.018} transparent opacity={0.66} sizeAttenuation />
  </points>;
}

function Core({ reduced }: Pick<Props, "reduced">) {
  const ref = useMemo(() => ({ current: null as THREE.Group | null }), []);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = reduced ? 0 : clock.elapsedTime * 0.07;
      ref.current.rotation.x = reduced ? 0 : Math.sin(clock.elapsedTime * 0.12) * 0.13;
    }
  });
  return <group ref={(node) => { ref.current = node; }}>
    <mesh>
      <icosahedronGeometry args={[0.83, 2]} />
      <meshPhysicalMaterial color="#f0fcff" emissive="#17445a" emissiveIntensity={0.42} roughness={0.12} metalness={0.22} transmission={0.38} thickness={1.3} clearcoat={1} />
    </mesh>
    <mesh scale={1.14}>
      <icosahedronGeometry args={[0.83, 1]} />
      <meshBasicMaterial color="#a1e9f4" wireframe transparent opacity={0.58} />
    </mesh>
    <mesh rotation={[Math.PI / 2.5, 0.2, 0]} scale={[1.95, 0.22, 1.95]}>
      <torusGeometry args={[1, 0.012, 6, 120]} />
      <meshBasicMaterial color="#ff8c65" transparent opacity={0.9} />
    </mesh>
  </group>;
}

export default function PolarisScene({ progress, pointer, reduced }: Props) {
  const { camera } = useThree();
  useFrame((state) => {
    const p = progress.current ?? 0;
    const ptr = pointer.current ?? { x: 0, y: 0 };
    const depth = THREE.MathUtils.smoothstep(p, 0.65, 2.35);
    const target = new THREE.Vector3(ptr.x * 0.42, ptr.y * 0.24, 8.2 - depth * 3.1 + Math.sin(p * 1.2) * 0.35);
    if (reduced) target.set(0, 0, 8.2);
    camera.position.lerp(target, 0.025);
    camera.lookAt(reduced ? 0 : ptr.x * 0.08, reduced ? 0 : -depth * 0.15, 0);
    state.scene.rotation.z = reduced ? 0 : Math.sin(p * Math.PI) * 0.08;
  });
  return <>
    <color attach="background" args={["#08131c"]} />
    <fog attach="fog" args={["#08131c", 8, 22]} />
    <ambientLight intensity={0.75} color="#bdebf2" />
    <pointLight position={[4, 5, 5]} intensity={34} color="#9ce8f0" distance={18} />
    <pointLight position={[-5, -2, 1]} intensity={22} color="#ff7856" distance={14} />
    <directionalLight position={[0, 5, 4]} intensity={2.2} color="#f4ffff" />
    <group position={[1.55, 0, 0]}>
      <Core reduced={reduced} />
      <IceField progress={progress} reduced={reduced} />
    </group>
    <CurrentLines />
  </>;
}
