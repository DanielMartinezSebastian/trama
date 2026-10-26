"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color, Group, PMREMGenerator, MathUtils } from "three";
import type { TokenSnapshot } from "@/lib/ui/useTokens";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Props = { plates: number; exploded: boolean; paused: boolean; phase?: number; active: boolean; colors: TokenSnapshot; onReady: () => void };
function Environment() {
  const { gl,scene } = useThree();
  useEffect(() => { const pmrem = new PMREMGenerator(gl); const room = new RoomEnvironment(); const rt = pmrem.fromScene(room,.04); scene.environment = rt.texture; return () => { scene.environment = null; rt.dispose(); room.dispose(); pmrem.dispose(); }; },[gl,scene]);
  return null;
}
function Barbell({ plates,exploded,onReady,colors,phase=0 }: Pick<Props,"plates"|"exploded"|"onReady"|"colors"|"phase">) {
  const bar=useRef<Group>(null);
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  useEffect(onReady,[onReady]);
  useFrame((_,dt) => { for (const [ref,side] of [[left,-1],[right,1]] as const) if(ref.current) ref.current.position.x = MathUtils.damp(ref.current.position.x,side * (exploded ? .75 : 0),6,dt); if(bar.current) bar.current.rotation.z=MathUtils.damp(bar.current.rotation.z,[-.1,.08,-.2][phase],5,dt); });
  return <group ref={bar} rotation={[.12,0,-.14]}>
    <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.055,.055,6.5,32]}/><meshStandardMaterial color={colors["--fg"]} metalness={1} roughness={.22}/></mesh>
    {[-1,1].map(side => <group key={side}>
      <mesh position={[side * 2.5,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.105,.105,1.25,32]}/><meshStandardMaterial color={colors["--mut"]} metalness={1} roughness={.18}/></mesh>
      <mesh position={[side * 1.79,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.17,.17,.07,40]}/><meshStandardMaterial color={colors["--fg"]} metalness={1} roughness={.25}/></mesh>
      <group ref={side === -1 ? left : right}>{Array.from({length:plates},(_,i) => <group key={i} position={[side*(1.98+i*.23),0,0]}>
        <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.86,.86,.2,64]}/><meshStandardMaterial color={colors["--acc"]} metalness={.35} roughness={.43}/></mesh>
        <mesh position={[side*.108,0,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.71,.018,8,64]}/><meshStandardMaterial color={new Color(colors["--acc"]).multiplyScalar(.6)} roughness={.55}/></mesh>
        <mesh position={[side*.115,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.2,.2,.025,32]}/><meshStandardMaterial color={colors["--fg"]} metalness={1} roughness={.2}/></mesh>
      </group>)}</group>
    </group>)}
    {[-.72,-.38,.38,.72].map(x => <mesh key={x} position={[x,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.057,.057,.29,32]}/><meshStandardMaterial color={colors["--mut"]} metalness={.9} roughness={.62}/></mesh>)}
  </group>;
}

/** Fully procedural: no remote GLB, texture, decoder, or Wasm dependency. */
export default function Scene(props: Props) {
  return <Canvas camera={{ position:[4.6,3.2,6.3], fov:42 }} dpr={[1,1.6]} frameloop={props.active ? "always" : "never"} gl={{ antialias:true, alpha:true, powerPreference:"low-power" }}><Environment/><ambientLight intensity={.65}/><directionalLight position={[2,5,3]} intensity={3}/><pointLight color={props.colors["--acc"]} position={[-3,2,-2]} intensity={35}/><pointLight color={props.colors["--acc2"]} position={[3,-2,3]} intensity={12}/><Barbell {...props}/><OrbitControls makeDefault enableZoom={false} enablePan={false} autoRotate={!props.paused && props.active} autoRotateSpeed={.65} minPolarAngle={.65} maxPolarAngle={2.1} /></Canvas>;
}
