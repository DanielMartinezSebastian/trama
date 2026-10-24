"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, type RefObject } from "react";
import * as THREE from "three/webgpu";
import { pilaTSL } from "../postfx";
import PortholeContent from "./content";

/*
 * Lienzo de `Porthole`: WebGPURenderer (WebGPU o su reserva WebGL2) sin tone mapping, como Hublot, con la pila de
 * posprocesado medida (bloom corto y SMAA, lib/postfx) y la escena de la ventanilla (lib/porthole/content).
 */

export type PortholeSceneProps = {
  /** color de la librea (la punta del ala), un color CSS ya resuelto */
  librea: string;
  /** densidad de las ciudades del suelo, 0–1 */
  ciudades: number;
  /** elemento que recibe el puntero */
  objetivo: RefObject<HTMLElement | null>;
  interactivo: boolean;
  /** false = fuera de pantalla: el lienzo no dibuja */
  active: boolean;
  onCambio?: (fuera: boolean) => void;
  onReady: () => void;
};

const PASES = [
  { tipo: "bloom" as const, fuerza: 0.35, radio: 0.05, umbral: 0.85 },
  { tipo: "aa" as const, metodo: "smaa" as const },
];

function Post({ onReady }: { onReady: () => void }) {
  const { gl, scene, camera } = useThree();
  const pipeline = useMemo(() => pilaTSL(gl as unknown as THREE.WebGPURenderer, scene, camera, PASES), [gl, scene, camera]);
  useEffect(() => () => pipeline.dispose(), [pipeline]);
  useEffect(() => {
    const id = requestAnimationFrame(() => onReady());
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  useFrame(() => pipeline.render(), 1);
  return null;
}

export default function PortholeScene({ librea, ciudades, objetivo, interactivo, active, onCambio, onReady }: PortholeSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  const cielo = useMemo(() => ({ ciudades }), [ciudades]);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, coarse ? 1.25 : 1.5]}
      camera={{ fov: 54, near: 0.02, far: 200000, position: [-1.369, 0, -1.6686] }}
      gl={async (props) => {
        const renderer = new THREE.WebGPURenderer({ ...(props as object), antialias: false });
        await renderer.init();
        return renderer as unknown as THREE.WebGPURenderer & { render: () => void };
      }}
      // R3F pone ACES después de crear el renderer: sin tone mapping, como la referencia
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <PortholeContent cielo={cielo} objetivo={objetivo} interactivo={interactivo} onCambio={onCambio} librea={librea} />
      <Post onReady={onReady} />
    </Canvas>
  );
}
