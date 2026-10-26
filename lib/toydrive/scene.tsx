"use client";

import { Canvas } from "@react-three/fiber";
import { type RefObject } from "react";
import { NeutralToneMapping, PCFSoftShadowMap } from "three";
import ToyDriveContent, { type ToyDriveColores } from "./content";

/*
 * Lienzo de `ToyDrive`: WebGL con sombras suaves y tone mapping Neutral (el kit usa los colores del tema, que con la luz
 * medida de la referencia, sin tone mapping, se quemarían), cámara isométrica medida y la escena de lib/toydrive.
 */

export type ToyDriveSceneProps = {
  palabra: string;
  colores: ToyDriveColores;
  fuente: string;
  objetivo: RefObject<HTMLElement | null>;
  interactivo: boolean;
  active: boolean;
  onReady: () => void;
  decorado?: boolean;
  intro?: boolean;
};

export default function ToyDriveScene({ palabra, colores, fuente, objetivo, interactivo, active, onReady, decorado = false, intro = false }: ToyDriveSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, coarse ? 1.5 : 2]}
      shadows={{ type: PCFSoftShadowMap }}
      camera={{ fov: 25, near: 0.1, far: 200 }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping;
        gl.toneMappingExposure = 0.9;
      }}
    >
      <color attach="background" args={[colores.suelo]} />
      <fog attach="fog" args={[colores.suelo, 40, 75]} />
      <ToyDriveContent palabra={palabra} colores={colores} fuente={fuente} objetivo={objetivo} interactivo={interactivo} puntero zoom={0.7} separacion={4.5} luzRelativa={[9, 24, 15]} inicio={{ pos: [0, 0.77, 2.5], rumbo: -2.356 }} decorado={decorado} intro={intro} onReady={onReady} />
    </Canvas>
  );
}
