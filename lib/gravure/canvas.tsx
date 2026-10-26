"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three/webgpu";
import { LAPIZ_ARBOL, LAPIZ_CASA, LAPIZ_TERRENO, materialLapiz, type OpcionesLapiz } from "./material";
import { Grabado } from "./scene";
import type { OpcionesGrabado } from "./post";

/*
 * Lienzo de `GravureCanvas` (docs/36 D1): el grabado a lápiz de `lib/gravure` para cualquier escena de R3F. Las mallas de
 * los hijos se pintan con el material de lápiz (no con el suyo): cada una toma el ajuste de `userData.lapiz` (nombre de
 * ajuste u opciones) o el ajuste por defecto del lienzo. La composición (papel, lápiz, contornos) es la de
 * `EngravedMap`.
 */

/*
 * Ajustes del lápiz. Los de Chartogne (terreno, casa, arbol) son para piezas de unos 20 px en pantalla. Los genéricos
 * (objeto, suelo, follaje) son para objetos grandes en pantalla:
 *   - rayado más denso (`subdivision`: trazos por unidad; súbelo si el objeto ocupa mucha pantalla);
 *   - un tono que va de líneas finas en la luz (ancho = 1 + (1 − luz · tono + desplazamiento) · multiplicador, con luz de 0 a 5,85) a tinta
 *     casi llena en la sombra, en vez de nada / todo.
 */
export const AJUSTES_LAPIZ = {
  /** objeto de 1–3 unidades visto a 3–8: planos diagonales del mundo, rayado que engorda con la sombra */
  objeto: { direccion: "diagonal", subdivision: 34, tono: 0.25, luzDesplazamiento: -1.1, luzMultiplicador: 1, umbral: 0.75, fundidoDesde: 0, fundidoEn: 0, alcance: 12 },
  /** suelo o fondo grande: los mismos planos, más claro */
  suelo: { direccion: "diagonal", subdivision: 30, tono: 0.25, luzDesplazamiento: -1.25, luzMultiplicador: 1, umbral: 0.6, fundidoDesde: 0, fundidoEn: 0, alcance: 12 },
  /** follaje: bandas horizontales */
  follaje: { direccion: "arriba", subdivision: 34, tono: 0.25, luzDesplazamiento: -1.1, luzMultiplicador: 1, umbral: 0.75, fundidoDesde: 0, fundidoEn: 0, alcance: 12 },
  /** los de la referencia (paisaje de 10 m) */
  terreno: LAPIZ_TERRENO,
  casa: LAPIZ_CASA,
  arbol: LAPIZ_ARBOL,
} satisfies Record<string, OpcionesLapiz>;
export type AjusteLapiz = keyof typeof AJUSTES_LAPIZ;

/** pone el material de lápiz a todas las mallas de la escena (y a las que lleguen después); devuelve los originales al salir */
function Lapiz({ ajuste }: { ajuste: AjusteLapiz | OpcionesLapiz }) {
  const { scene } = useThree();
  const cache = useRef(new Map<string, THREE.Material>());
  const originales = useRef(new Map<THREE.Mesh, THREE.Material | THREE.Material[]>());
  const material = (clave: AjusteLapiz | OpcionesLapiz) => {
    const k = typeof clave === "string" ? clave : JSON.stringify(clave);
    let m = cache.current.get(k);
    if (!m) {
      m = materialLapiz(typeof clave === "string" ? (AJUSTES_LAPIZ[clave] ?? AJUSTES_LAPIZ.objeto) : clave) as unknown as THREE.Material;
      cache.current.set(k, m);
    }
    return m;
  };
  useEffect(() => {
    const cacheActual = cache.current;
    const orig = originales.current;
    return () => {
      for (const [mesh, m] of orig) mesh.material = m;
      orig.clear();
      for (const m of cacheActual.values()) m.dispose();
      cacheActual.clear();
    };
  }, []);
  // recorrer la escena cada fotograma cuesta poco y recoge las mallas que montan los hijos más tarde (modelos cargados)
  useFrame(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || mesh.userData.sinLapiz) return;
      const pedido = (mesh.userData.lapiz as AjusteLapiz | OpcionesLapiz | undefined) ?? ajuste;
      const m = material(pedido);
      if (mesh.material === m) return;
      if (!originales.current.has(mesh)) originales.current.set(mesh, mesh.material);
      mesh.material = m;
    });
  }, -1);
  return null;
}

export type GravureCanvasSceneProps = {
  children?: ReactNode;
  grabado: OpcionesGrabado;
  ajuste: AjusteLapiz | OpcionesLapiz;
  camara: { posicion: [number, number, number]; fov: number };
  entrada: number;
  active: boolean;
  onReady: () => void;
};

function Listo({ onReady }: { onReady: () => void }) {
  const hecho = useRef(false);
  useFrame(() => {
    if (hecho.current) return;
    hecho.current = true;
    onReady();
  });
  return null;
}

export default function GravureCanvasScene({ children, grabado, ajuste, camara, entrada, active, onReady }: GravureCanvasSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      // a 2× como la referencia: el contorno y el grano se afinan al reducirse
      dpr={coarse ? 1.5 : 2}
      camera={{ fov: camara.fov, position: camara.posicion, near: 0.05, far: 200 }}
      gl={async (props) => {
        const renderer = new THREE.WebGPURenderer({ ...(props as object), antialias: false });
        await renderer.init();
        return renderer as unknown as THREE.WebGPURenderer & { render: () => void };
      }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.NoToneMapping;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        camera.lookAt(0, 0, 0);
      }}
    >
      {children}
      <Lapiz ajuste={ajuste} />
      <Grabado grabado={grabado} entrada={entrada} />
      <Listo onReady={onReady} />
    </Canvas>
  );
}
