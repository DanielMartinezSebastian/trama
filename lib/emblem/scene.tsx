"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { crearEmblema, type OpcionesEmblema } from "./geometry";
import { crearMascara } from "./mascara";

/*
 * Lienzo de `ThornEmblem`: el emblema de espinas con un material de laca brillante (el rojo de la referencia sobre
 * negro), entorno de estudio para los brillos y una luz de contra del color del emblema. La pose la da quien lo usa
 * (`pose()` cada fotograma: giro, escala y brillo), así la misma escena sirve para la portada (balanceo y puntero) y
 * para una coreografía de scroll.
 */

export type PoseEmblema = { giro: [number, number, number]; escala: number; brillo: number; y?: number };

export type ThornEmblemSceneProps = {
  forma: OpcionesEmblema & { tipo?: "puas" | "mascara" };
  color: string;
  pose: (t: number) => PoseEmblema;
  active: boolean;
  onReady: () => void;
  camara?: { posicion: [number, number, number]; fov: number };
  /** sin tone mapping (como la referencia: los colores tal cual) */
  plano?: boolean;
};

function Entorno() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Emblema({ forma, color, pose, onReady }: Omit<ThornEmblemSceneProps, "active">) {
  const malla = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => (forma.tipo === "mascara" ? crearMascara({ semilla: forma.semilla, rizo: forma.curva !== undefined ? forma.curva / 0.55 : 1 }) : crearEmblema(forma)), [JSON.stringify(forma)]); // eslint-disable-line react-hooks/exhaustive-deps
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, metalness: 0.7, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.4 }), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => void mat.color.set(color), [mat, color]);
  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
    },
    [geo, mat],
  );
  const listo = useRef(false);
  useFrame(({ clock }) => {
    const m = malla.current;
    if (!m) return;
    const p = pose(clock.elapsedTime);
    m.rotation.set(p.giro[0], p.giro[1], p.giro[2]);
    m.scale.setScalar(p.escala);
    m.position.y = p.y ?? 0;
    mat.emissive.set(color).multiplyScalar(0.05 * p.brillo);
    mat.envMapIntensity = 0.4 * p.brillo;
    mat.opacity = Math.min(1, p.brillo * 1.5);
    mat.transparent = mat.opacity < 1;
    if (!listo.current) {
      listo.current = true;
      onReady();
    }
  });
  return <mesh ref={malla} geometry={geo} material={mat} />;
}

export default function ThornEmblemScene({ forma, color, pose, active, onReady, camara, plano = false }: ThornEmblemSceneProps) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 2]} flat={plano} camera={{ fov: camara?.fov ?? 35, position: camara?.posicion ?? [0, 0, 4.2], near: 0.02 }} gl={{ alpha: true, antialias: true }}>
      <Entorno />
      <hemisphereLight args={["#ffffff", "#200004", 0.5]} />
      <directionalLight position={[-2, 3, 4]} intensity={0.45} />
      <directionalLight position={[2.5, -1, -3]} intensity={3} color={color} />
      <Emblema forma={forma} color={color} pose={pose} onReady={onReady} />
    </Canvas>
  );
}
