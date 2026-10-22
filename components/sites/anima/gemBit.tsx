"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Mesh } from "three";
import { brilliantGeometry } from "@/lib/gems/brilliant";
import { createGemEnvironment } from "@/lib/gems/environment";
import { createGemMaterial } from "@/lib/gems/gemMaterial";
import { SHOW_DIAMOND_IOR } from "@/lib/gems/hdr";
import { EMERALD, useGemHdr } from "./skullScene";

/** La gema del laboratorio, suelta: una talla brillante esmeralda que gira y late (lib/gems), en su propio lienzo. */
function Stone() {
  const gl = useThree((s) => s.gl);
  const hdr = useGemHdr(gl);
  const g = useMemo(() => {
    const env = createGemEnvironment(gl);
    const geo = brilliantGeometry(1);
    const mat = createGemMaterial(env.texture, geo, true);
    mat.uniforms.uIor.value.copy(SHOW_DIAMOND_IOR);
    mat.uniforms.uAbsorb.value.copy(EMERALD);
    mat.uniforms.uAbsorbK.value = 0.16;
    mat.uniforms.uKeyI.value = 7;
    return { env, geo, mat };
  }, [gl]);
  useEffect(() => () => { g.env.dispose(); g.geo.dispose(); g.mat.dispose(); }, [g]);
  useEffect(() => {
    g.mat.uniforms.uEnv.value = hdr ?? g.env.texture;
  }, [g, hdr]);
  const m = useRef<Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (m.current) {
      m.current.rotation.y = t * 0.6;
      m.current.rotation.x = 0.55 + Math.sin(t * 0.7) * 0.15;
      m.current.position.y = Math.sin(t * 1.3) * 0.06;
    }
    const u = g.mat.uniforms;
    u.uEnvI.value = hdr ? 0.8 : 1.5;
    u.uKeyDir.value.set(Math.cos(t * 0.8) * 0.9, 0.6, 1).normalize();
    u.uGlow.value.setScalar(0.25 + 0.25 * Math.sin(t * 2.2) ** 2);
  });
  return <mesh ref={m} geometry={g.geo} material={g.mat} />;
}

export default function GemBit({ active }: { active: boolean }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: 30, position: [0, 0, 4.2] }} style={{ pointerEvents: "none" }}>
      <Stone />
    </Canvas>
  );
}
