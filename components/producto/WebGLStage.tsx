"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Speaker({ chapter = 0, ritual = false }: { chapter?: number; ritual?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const cloth = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext("2d")!; ctx.fillStyle = "#24473b"; ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 128; i += 4) { ctx.fillStyle = i % 8 === 0 ? "#517263" : "#132c24"; ctx.fillRect(i, 0, 1, 128); ctx.fillRect(0, i, 128, 1); }
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(3, 2); return texture;
  }, []);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (ritual ? pointer.x * .62 : .12) + t * (ritual ? .06 : .1), .035);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, ritual ? -pointer.y * .22 : Math.sin(t * .35) * .04, .03);
    group.current.position.y = Math.sin(t * (ritual ? .75 : .45)) * .07;
    if (ring.current) { const pulse = ritual ? 1 + Math.sin(t * (chapter + 2) * 1.5) * .07 : 1; ring.current.scale.setScalar(pulse); }
  });
  return <group ref={group} rotation={[.06, -.32, -.06]}>
    <mesh castShadow receiveShadow><cylinderGeometry args={[.68, .68, 1.65, 96, 1, true]} /><meshPhysicalMaterial map={cloth} roughness={.92} metalness={.02} /></mesh>
    <mesh position={[0, .83, 0]} castShadow><cylinderGeometry args={[.68, .68, .12, 96]} /><meshStandardMaterial color="#9d9b8b" metalness={.84} roughness={.26} /></mesh>
    <mesh position={[0, -.83, 0]} castShadow><cylinderGeometry args={[.68, .68, .12, 96]} /><meshStandardMaterial color="#7e8077" metalness={.7} roughness={.35} /></mesh>
    <mesh ref={ring} position={[0, .74, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.38, .018, 12, 80]} /><meshBasicMaterial color={ritual ? "#ffb36b" : "#c9a270"} toneMapped={false} /></mesh>
    <mesh position={[0, -.91, 0]}><cylinderGeometry args={[.24, .24, .03, 48]} /><meshStandardMaterial color="#1c211e" roughness={.5} /></mesh>
  </group>;
}

function MaterialScene() {
  return <>
    <color attach="background" args={["#d7d7c9"]} /><fog attach="fog" args={["#d7d7c9", 7, 15]} />
    <ambientLight intensity={1.5} /><directionalLight position={[3, 6, 5]} intensity={3.2} castShadow /><pointLight position={[-3, 1, 1]} intensity={2} color="#cdb887" />
    <Float speed={.8} rotationIntensity={.12} floatIntensity={.32}><Speaker /></Float>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.12, 0]} receiveShadow><planeGeometry args={[14, 14]} /><meshStandardMaterial color="#b8b8a8" roughness={.88} /></mesh>
    <OrbitControls enablePan={false} minDistance={3.5} maxDistance={6} minPolarAngle={.8} maxPolarAngle={2.15} />
  </>;
}

function RitualScene({ chapter }: { chapter: number }) {
  const halo = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (halo.current) halo.current.rotation.z = clock.elapsedTime * (chapter === 1 ? -.12 : .08); });
  return <>
    <color attach="background" args={["#11110f"]} /><fog attach="fog" args={["#11110f", 8, 18]} />
    <ambientLight intensity={.35} /><pointLight position={[0, 1.4, 2]} intensity={34} distance={8} color="#ffac65" /><pointLight position={[-4, -1, 2]} intensity={26} distance={11} color="#ca594a" /><spotLight position={[3, 6, 4]} intensity={45} angle={.5} penumbra={.8} color="#fff0cd" />
    <group ref={halo}>{[1.45, 2.05, 2.68].map((r, i) => <mesh key={r} rotation={[Math.PI / 2.5 + i * .09, 0, i * .3]}><torusGeometry args={[r, .006 + i * .002, 6, 140]} /><meshBasicMaterial color={i === chapter ? "#ffba7b" : "#845548"} transparent opacity={i === chapter ? .7 : .24} /></mesh>)}</group>
    <Float speed={1.3} rotationIntensity={.2} floatIntensity={.45}><Speaker chapter={chapter} ritual /></Float>
    <Sparkles count={chapter === 2 ? 110 : 60} scale={[7, 5, 4]} size={2.4} speed={.22} color="#ffc17f" />
  </>;
}

export default function WebGLStage({ scene, chapter = 0 }: { scene: "matter" | "ritual"; chapter?: number }) {
  return <Canvas dpr={[1, 1.5]} camera={{ position: scene === "matter" ? [3.4, 1.2, 4.5] : [0, .2, 5.8], fov: 36 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = scene === "matter" ? 1.05 : 1.2; }}>
    {scene === "matter" ? <MaterialScene /> : <RitualScene chapter={chapter} />}
  </Canvas>;
}
