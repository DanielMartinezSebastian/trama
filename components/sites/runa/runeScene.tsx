"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Color, type Mesh, type Texture } from "three";
import { brilliantGeometry } from "@/lib/gems/brilliant";
import { createGemEnvironment } from "@/lib/gems/environment";
import { createGemMaterial } from "@/lib/gems/gemMaterial";
import { SHOW_DIAMOND_IOR, loadGemHdr } from "@/lib/gems/hdr";

/** el color que deja pasar la piedra (como la esmeralda de Ánima, pero rosa de neón) */
const MAGENTA = new Color(1, 0.16, 0.6);

function Stone({ glow }: { glow: number }) {
  const gl = useThree((s) => s.gl);
  const [hdr, setHdr] = useState<Texture | null>(null);
  useEffect(() => loadGemHdr(gl, setHdr), [gl]);
  const g = useMemo(() => {
    const env = createGemEnvironment(gl);
    const geo = brilliantGeometry(1);
    const mat = createGemMaterial(env.texture, geo, true);
    mat.uniforms.uIor.value.copy(SHOW_DIAMOND_IOR);
    mat.uniforms.uAbsorb.value.copy(MAGENTA);
    mat.uniforms.uAbsorbK.value = 0.2;
    mat.uniforms.uKeyI.value = 7;
    return { env, geo, mat };
  }, [gl]);
  useEffect(() => () => {
    g.env.dispose();
    g.geo.dispose();
    g.mat.dispose();
  }, [g]);
  useEffect(() => {
    g.mat.uniforms.uEnv.value = hdr ?? g.env.texture;
  }, [g, hdr]);
  const m = useRef<Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (m.current) {
      m.current.rotation.y = t * 0.9;
      m.current.rotation.x = 0.5 + Math.sin(t * 0.7) * 0.2;
      m.current.position.y = Math.sin(t * 1.6) * 0.07;
    }
    const u = g.mat.uniforms;
    u.uEnvI.value = hdr ? 0.85 : 1.5;
    u.uKeyDir.value.set(Math.cos(t * 0.8) * 0.9, 0.6, 1).normalize();
    u.uGlow.value.setScalar(glow * (0.3 + 0.3 * Math.sin(t * 3) ** 2));
  });
  return <mesh ref={m} geometry={g.geo} material={g.mat} />;
}

/** La runa del botín: una talla brillante de `lib/gems` (trazado de rayos, la de Quilate) en magenta, que gira y late. */
export default function RuneScene({ active, glow = 1 }: { active: boolean; glow?: number }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: 30, position: [0, 0, 4.6] }} style={{ pointerEvents: "none" }}>
      <Stone glow={glow} />
    </Canvas>
  );
}
