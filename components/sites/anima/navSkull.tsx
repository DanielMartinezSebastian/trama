"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Group, type Object3D } from "three";
import { useModelNavPointer } from "@/components/ui/ModelNav";
import { JAW_SHUT, PIRATE_URL, buildPirate } from "./skullScene";

/**
 * La calavera pirata con sombrero, para el medallón del `ModelNav` de Ánima (páginas interiores). Se inclina hacia el
 * puntero (lo hace el medallón) y además abre la boca cuando el puntero se acerca, castañetea un poco y le brillan las runas.
 */
export default function NavSkull() {
  const { scene } = useGLTF(PIRATE_URL, "/draco/") as unknown as { scene: Object3D };
  const rig = useMemo(() => {
    const r = buildPirate(scene);
    r.hat.visible = true;
    // aquí el ojo es el del modelo (en el medallón es pequeño: no hace falta la gema)
    r.eyeNode.visible = true;
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
  const pointer = useModelNavPointer();
  const g = useRef<Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime, near = pointer.current.near;
    rig.pivot.rotation.x = JAW_SHUT + near * 0.35 + Math.max(0, Math.sin(t * 9)) * 0.08 * (0.3 + near);
    for (const m of rig.skin) m.emissiveIntensity = 0.2 + 0.8 * near;
    rig.eye.emissiveIntensity = 0.8 + 2 * near;
  });
  return (
    <group ref={g} rotation={[0.1, 0, 0]}>
      <primitive object={rig.holder} />
      {/* luz de frente y de arriba: el sombrero es negro y, si no, se pierde contra la isla */}
      <pointLight position={[0.4, 1.2, 2]} intensity={6} distance={6} color="#ffd9b0" />
    </group>
  );
}
