"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { crearEmblema, type OpcionesEmblema } from "./geometry";
import { crearMascara } from "./mascara";
import { crearAlas } from "./alas";

/*
 * Lienzo de `ThornEmblem`. La pose la da quien lo usa (`pose()` cada fotograma: giro, escala, brillo, altura y aleteo),
 * así la misma escena sirve para la portada (balanceo y puntero) y para una coreografía de scroll. Dos iluminaciones:
 *   - estudio: laca brillante del color del emblema, entorno de estudio para los brillos y una luz de contra de su color;
 *   - roja: la de meermohsin.me (sonda, docs/41). Material blanco facetado (rugosidad 0,35, metal 0,25) que se ve rojo
 *     por tres luces puntuales rojas (#ff1f1f × 30 en (0, 2, 5), #ff1f1f × 60 en (3, 2, 4), #8b0000 × 40 en (−3, 1, 3)) y
 *     una ambiental #b90707 × 0,5.
 * Las alas (`tipo: "alas"`) son dos mallas que baten alrededor del puente (`aleteo`, en radianes).
 */

export type PoseEmblema = { giro: [number, number, number]; escala: number; brillo: number; y?: number; aleteo?: number };

export type ThornEmblemSceneProps = {
  forma: OpcionesEmblema & { tipo?: "puas" | "mascara" | "alas" };
  color: string;
  pose: (t: number) => PoseEmblema;
  active: boolean;
  onReady: () => void;
  camara?: { posicion: [number, number, number]; fov: number };
  /** sin tone mapping (como la referencia: los colores tal cual) */
  plano?: boolean;
  luz?: "estudio" | "roja";
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

function Emblema({ forma, color, pose, onReady, luz }: Omit<ThornEmblemSceneProps, "active">) {
  const grupo = useRef<THREE.Group>(null);
  const alaD = useRef<THREE.Mesh>(null);
  const alaI = useRef<THREE.Mesh>(null);
  const geos = useMemo(() => {
    if (forma.tipo === "alas") {
      const { derecha, izquierda } = crearAlas({ semilla: forma.semilla });
      return [derecha, izquierda];
    }
    return [forma.tipo === "mascara" ? crearMascara({ semilla: forma.semilla, rizo: forma.curva !== undefined ? forma.curva / 0.55 : 1 }) : crearEmblema(forma)];
  }, [JSON.stringify(forma)]); // eslint-disable-line react-hooks/exhaustive-deps
  const mat = useMemo(
    () =>
      luz === "roja"
        ? new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.35, metalness: 0.25, flatShading: true, transparent: true })
        : new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, metalness: 0.7, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.4, transparent: true }),
    [luz], // eslint-disable-line react-hooks/exhaustive-deps
  );
  useEffect(() => {
    if (luz !== "roja") (mat as THREE.MeshPhysicalMaterial).color.set(color);
  }, [mat, color, luz]);
  useEffect(
    () => () => {
      geos.forEach((g) => g.dispose());
      mat.dispose();
    },
    [geos, mat],
  );
  const listo = useRef(false);
  useFrame(({ clock }) => {
    const g = grupo.current;
    if (!g) return;
    const p = pose(clock.elapsedTime);
    g.rotation.set(p.giro[0], p.giro[1], p.giro[2]);
    g.scale.setScalar(p.escala);
    g.position.y = p.y ?? 0;
    // las alas baten alrededor del puente (eje y del grupo)
    const a = p.aleteo ?? 0;
    if (alaD.current) alaD.current.rotation.y = -a;
    if (alaI.current) alaI.current.rotation.y = a;
    if (luz === "roja") {
      // el brillo apaga la luz que devuelve el material (al alejarse, oscuro), como en la referencia
      (mat as THREE.MeshStandardMaterial).color.setScalar(Math.max(0.02, p.brillo));
    } else {
      const m = mat as THREE.MeshPhysicalMaterial;
      m.emissive.set(color).multiplyScalar(0.05 * p.brillo);
      m.envMapIntensity = 0.4 * p.brillo;
    }
    mat.opacity = Math.min(1, p.brillo * 1.5);
    if (!listo.current) {
      listo.current = true;
      onReady();
    }
  });
  return (
    <group ref={grupo}>
      {geos.length === 2 ? (
        <>
          <mesh ref={alaD} geometry={geos[0]} material={mat} />
          <mesh ref={alaI} geometry={geos[1]} material={mat} />
        </>
      ) : (
        <mesh geometry={geos[0]} material={mat} />
      )}
    </group>
  );
}

export default function ThornEmblemScene({ forma, color, pose, active, onReady, camara, plano = false, luz = "estudio" }: ThornEmblemSceneProps) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 2]} flat={plano} camera={{ fov: camara?.fov ?? 35, position: camara?.posicion ?? [0, 0, 4.2], near: 0.02 }} gl={{ alpha: true, antialias: true }}>
      {luz === "roja" ? (
        <>
          <pointLight position={[0, 2, 5]} color="#ff1f1f" intensity={30} />
          <pointLight position={[3, 2, 4]} color="#ff1f1f" intensity={60} />
          <pointLight position={[-3, 1, 3]} color="#8b0000" intensity={40} />
          <ambientLight color="#b90707" intensity={0.5} />
        </>
      ) : (
        <>
          <Entorno />
          <hemisphereLight args={["#ffffff", "#200004", 0.5]} />
          <directionalLight position={[-2, 3, 4]} intensity={0.45} />
          <directionalLight position={[2.5, -1, -3]} intensity={3} color={color} />
        </>
      )}
      <Emblema forma={forma} color={color} pose={pose} onReady={onReady} luz={luz} />
    </Canvas>
  );
}
