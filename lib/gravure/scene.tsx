"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, type RefObject } from "react";
import * as THREE from "three/webgpu";
import EngravedMapContent from "./content";
import type { OpcionesPaisaje } from "./landscape";
import { FONDO_GRABADO, pilaGrabado, type OpcionesGrabado } from "./post";

/*
 * Lienzo de `EngravedMap`: WebGPURenderer (WebGPU o su reserva WebGL2) que pinta la escena con el material de lápiz en
 * un búfer limpio con el fondo neutro del grabado y la compone en papel y lápiz (`pilaGrabado`). La aparición por
 * baldosas sigue al vuelo de entrada.
 */

export type EngravedMapSceneProps = {
  grabado: OpcionesGrabado;
  paisaje?: OpcionesPaisaje;
  entrada: number;
  objetivo: RefObject<HTMLElement | null> | null;
  /** false = fuera de pantalla: el lienzo no dibuja */
  active: boolean;
  onReady: () => void;
};

/** la composición del grabado sobre la escena del lienzo (también la usa el banco); limpia con el fondo neutro */
export function Grabado({ grabado, entrada }: { grabado: OpcionesGrabado; entrada: number }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const antes = scene.background;
    scene.background = FONDO_GRABADO;
    return () => {
      scene.background = antes;
    };
  }, [scene]);
  const pila = useMemo(() => pilaGrabado(gl as unknown as THREE.WebGPURenderer, scene, camera, grabado), [gl, scene, camera]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => pila.dispose(), [pila]);
  useEffect(() => pila.colores(grabado.papel ?? "#fff5dd", grabado.lapiz ?? "#8c887d"), [pila, grabado.papel, grabado.lapiz]);
  useFrame(({ clock }) => {
    // las baldosas entran en el primer 60 % del vuelo
    pila.progreso.value = entrada > 0 ? Math.min(1, clock.elapsedTime / (entrada * 0.6)) : 1;
    pila.render();
  }, 1);
  return null;
}

export default function EngravedMapScene({ grabado, paisaje, entrada, objetivo, active, onReady }: EngravedMapSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      // la referencia pinta siempre a 2×, también en pantallas de 1×: el contorno (diferencias entre píxeles vecinos) y
      // el grano se afinan al reducirse
      dpr={coarse ? 1.5 : 2}
      camera={{ fov: 65, near: 0.0025, far: 40 }}
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
      <EngravedMapContent paisaje={paisaje} entrada={entrada} objetivo={objetivo} onReady={onReady} />
      <Grabado grabado={grabado} entrada={entrada} />
    </Canvas>
  );
}
