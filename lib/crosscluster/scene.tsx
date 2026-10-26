"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, type RefObject } from "react";
import * as THREE from "three/webgpu";
import { pilaTSL } from "../postfx";
import CrossClusterContent, { type PiezaRacimo } from "./content";
import type { OpcionesRacimo } from "./sim";

/*
 * Lienzo de `CrossCluster`: WebGPURenderer (WebGPU o su reserva WebGL2) sin tone mapping (el material ya trae su curva
 * fílmica, como la referencia), el fondo del tema y la pila medida en Lusion: grano del ruido azul y SMAA (lib/postfx).
 */

export type CrossClusterSceneProps = {
  piezas: PiezaRacimo[];
  fondo: string;
  fondoCristal: string;
  fisica?: Omit<OpcionesRacimo, "n">;
  objetivo: RefObject<HTMLElement | null>;
  interactivo: boolean;
  /** false = fuera de pantalla: el lienzo no dibuja */
  active: boolean;
  onReady: () => void;
};

const PASES = [
  { tipo: "grano" as const, intensidad: 0.06 },
  { tipo: "aa" as const, metodo: "smaa" as const },
];

function Post() {
  const { gl, scene, camera } = useThree();
  const pipeline = useMemo(() => pilaTSL(gl as unknown as THREE.WebGPURenderer, scene, camera, PASES), [gl, scene, camera]);
  useEffect(() => () => pipeline.dispose(), [pipeline]);
  useFrame(() => pipeline.render(), 1);
  return null;
}

export default function CrossClusterScene({ piezas, fondo, fondoCristal, fisica, objetivo, interactivo, active, onReady }: CrossClusterSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      // cada píxel recorre las otras 23 cruces: la densidad de píxeles se limita más que en otras piezas
      dpr={[1, coarse ? 1 : 1.5]}
      camera={{ fov: 12, near: 1, far: 60, position: [0, 0, 17.5] }}
      gl={async (props) => {
        const renderer = new THREE.WebGPURenderer({ ...(props as object), antialias: false });
        await renderer.init();
        return renderer as unknown as THREE.WebGPURenderer & { render: () => void };
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <color attach="background" args={[fondo]} />
      <CrossClusterContent piezas={piezas} fondoCristal={fondoCristal} fisica={fisica} objetivo={objetivo} interactivo={interactivo} onReady={onReady} />
      <Post />
    </Canvas>
  );
}
