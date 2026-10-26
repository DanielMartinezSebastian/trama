"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/*
 * Bodegón de muestra para `GravureCanvas` (catálogo y banco): un jarrón de revolución, una esfera, un nudo y un libro
 * sobre una mesa, girando despacio. Es la «variación fuera de la referencia» de docs/36 D1: el grabado de Chartogne en
 * una escena que no es un paisaje.
 */
export default function BodegonGrabado({ giro = 0.12 }: { giro?: number }) {
  const grupo = useRef<THREE.Group>(null);
  const jarron = useMemo(() => {
    const perfil = [
      [0, 0], [0.42, 0], [0.5, 0.12], [0.62, 0.55], [0.58, 0.95], [0.36, 1.3], [0.3, 1.62], [0.38, 1.8], [0.34, 1.82], [0, 1.82],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(new THREE.SplineCurve(perfil).getPoints(48), 64);
  }, []);
  useFrame((_, dt) => {
    if (grupo.current) grupo.current.rotation.y += dt * giro;
  });
  return (
    <group ref={grupo} position={[0, -0.9, 0]}>
      <mesh userData={{ lapiz: "suelo" }} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.2, 96]} />
      </mesh>
      <mesh geometry={jarron} position={[-0.55, 0, -0.2]} />
      <mesh position={[0.75, 0.42, 0.35]}>
        <sphereGeometry args={[0.42, 64, 32]} />
      </mesh>
      <mesh position={[0.55, 0.38, -0.85]} rotation={[0.4, 0.3, 0]}>
        <torusKnotGeometry args={[0.26, 0.09, 160, 20]} />
      </mesh>
      <mesh position={[-0.2, 0.11, 0.9]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[1.1, 0.22, 0.75]} />
      </mesh>
    </group>
  );
}
