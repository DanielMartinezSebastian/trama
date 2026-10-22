"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Mesh, Vector3, type Group, type Object3D } from "three";
import { useModelNavPointer } from "@/components/ui/ModelNav";
import { brilliantGeometry } from "@/lib/gems/brilliant";
import { createGemEnvironment } from "@/lib/gems/environment";
import { createGemMaterial } from "@/lib/gems/gemMaterial";
import { SHOW_DIAMOND_IOR } from "@/lib/gems/hdr";
import { bustEye } from "./bustEye";
import { EMERALD, JAW_SHUT, PIRATE_URL, buildPirate, useGemHdr } from "./skullScene";

/**
 * La calavera pirata con sombrero, en busto: la del navbar y la del laboratorio (es el mismo `Traveler`, docs/20 §2e).
 * Se inclina hacia el puntero (lo hace la escena del medallón) y además abre la boca cuando el puntero se acerca,
 * castañetea un poco y le brillan las runas. Con `gem`, el ojo es la gema del laboratorio (el material de trazado de rayos
 * del kit, con el HDR de taller y un destello interior a ratos).
 */
export default function NavSkull({ gem = false, trackEye = false }: { gem?: boolean; trackEye?: boolean }) {
  const { scene } = useGLTF(PIRATE_URL, false, false) as unknown as { scene: Object3D };
  const rig = useMemo(() => {
    const r = buildPirate(scene);
    r.hat.visible = true;
    r.hat.position.y = r.hatY;
    // encuadre con el sombrero: 1,5 de alto, un poco por encima del centro (el ala del sombrero asoma por arriba del medallón)
    r.holder.updateMatrixWorld(true);
    const b = new Box3().setFromObject(r.holder);
    const size = b.getSize(new Vector3()), c = b.getCenter(new Vector3());
    const k = 1.5 / size.y;
    r.holder.scale.multiplyScalar(k);
    r.holder.position.sub(c.multiplyScalar(k)).add(new Vector3(0, 0.12, 0));
    return r;
  }, [scene]);
  useEffect(() => () => { rig.skin.forEach((m) => m.dispose()); rig.eye.dispose(); }, [rig]);

  // la gema del ojo: se cuelga del propio busto, en el centro de la cuenca, con la mesa hacia fuera
  const gl = useThree((st) => st.gl);
  const hdr = useGemHdr(gl);
  const stone = useMemo(() => {
    const env = createGemEnvironment(gl);
    const R = rig.eyeSize * 2;
    const geo = brilliantGeometry(R);
    const mat = createGemMaterial(env.texture, geo, true);
    mat.uniforms.uIor.value.copy(SHOW_DIAMOND_IOR);
    mat.uniforms.uAbsorb.value.copy(EMERALD);
    mat.uniforms.uAbsorbK.value = 0.16 / R;
    mat.uniforms.uKeyI.value = 7;
    const mesh = new Mesh(geo, mat);
    mesh.position.copy(rig.eyeLocal);
    mesh.rotation.x = Math.PI / 2 - 0.2;
    return { env, geo, mat, mesh };
  }, [gl, rig]);
  useEffect(() => () => { stone.env.dispose(); stone.geo.dispose(); stone.mat.dispose(); }, [stone]);
  useEffect(() => {
    stone.mat.uniforms.uEnv.value = hdr ?? stone.env.texture;
  }, [stone, hdr]);
  useEffect(() => {
    if (!gem) return;
    rig.holder.add(stone.mesh);
    rig.eyeNode.visible = false;
    return () => {
      rig.holder.remove(stone.mesh);
      rig.eyeNode.visible = true;
    };
  }, [gem, rig, stone]);

  const pointer = useModelNavPointer();
  const g = useRef<Group>(null);
  const eye = useMemo(() => new Vector3(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime, near = pointer.current.near;
    // dónde cae la cuenca en el lienzo (para el hueco del ojo del laboratorio)
    if (trackEye) {
      eye.copy(rig.eyeLocal);
      rig.holder.localToWorld(eye).project(state.camera);
      bustEye.x = (eye.x + 1) / 2;
      bustEye.y = (1 - eye.y) / 2;
    }
    rig.pivot.rotation.x = JAW_SHUT + near * 0.35 + Math.max(0, Math.sin(t * 9)) * 0.08 * (0.3 + near);
    for (const m of rig.skin) m.emissiveIntensity = 0.2 + 0.8 * near;
    rig.eye.emissiveIntensity = 0.8 + 2 * near;
    if (gem) {
      const cyc = t % 6, flare = cyc < 0.35 ? cyc / 0.35 : Math.max(0, 1 - (cyc - 0.35) / 1.2);
      const u = stone.mat.uniforms;
      u.uEnvI.value = hdr ? 0.8 : 1.5;
      u.uKeyDir.value.set(Math.cos(t * 0.7) * 0.9, 0.55 + Math.sin(t * 0.5) * 0.35, 1).normalize();
      u.uGlow.value.setScalar(0.3 + 3.5 * flare * flare);
      stone.mesh.rotation.y = t * 0.35;
    }
  });
  return (
    <group ref={g} rotation={[0.1, 0, 0]}>
      <primitive object={rig.holder} />
      {/* luz de frente y de arriba: el sombrero es negro y, si no, se pierde contra la isla */}
      <pointLight position={[0.4, 1.2, 2]} intensity={6} distance={6} color="#ffd9b0" />
    </group>
  );
}
