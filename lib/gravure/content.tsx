"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { LAPIZ_ARBOL, LAPIZ_CASA, LAPIZ_TERRENO, materialLapiz } from "./material";
import { crearPaisaje, type OpcionesPaisaje } from "./landscape";
import { crearBandada, geometriaPajaro, materialPajaro } from "./birds";

export type EngravedMapContentProps = {
  paisaje?: OpcionesPaisaje;
  /** vuelo de entrada (s); 0 = empieza en el plano final */
  entrada?: number;
  /** elemento que recibe el puntero para el leve paralaje (por defecto, el lienzo); null = sin paralaje */
  objetivo?: RefObject<HTMLElement | null> | null;
  /** avisa del avance de la entrada (0–1), para la aparición por baldosas de la composición */
  onAvance?: (t: number) => void;
  onReady?: () => void;
};

/*
 * Cámara medida en chartogne-taillet.com (docs/32 §3): fov 65; el vuelo de entrada va en 3 s de (1,01, 0,50, 7,94)
 * mirando a −z hasta (1,70, 0,84, 2,20) mirando a (−0,725, −0,454, −0,518): la posición frena (cuadrática) y la
 * dirección sigue la curva medida (`GIRO`).
 */
export const CAMARA_CHARTOGNE = {
  fov: 65,
  desde: { pos: new THREE.Vector3(1.0078, 0.5042, 7.9357), dir: new THREE.Vector3(0, 0, -1) },
  hasta: { pos: new THREE.Vector3(1.7, 0.8353, 2.2002), dir: new THREE.Vector3(-0.7247, -0.454, -0.5184).normalize() },
};

/** el avance: cuadrática que frena (medida: 0,161 a 1/12 del vuelo, como power2.out) */
const frena = (t: number) => 1 - (1 - t) * (1 - t);
/**
 * el giro de la mirada, medido en la referencia cada 0,25 s (fracción del camino entre las dos direcciones, una vez
 * deshecha la normalización): no es ninguna curva con nombre; empieza tarde y llega antes de que pare el avance
 */
const GIRO = [0, 0.019, 0.071, 0.15, 0.253, 0.376, 0.519, 0.658, 0.775, 0.871, 0.941, 0.986, 1];
const giro = (t: number) => {
  const x = Math.min(1, Math.max(0, t)) * (GIRO.length - 1);
  const k = Math.min(GIRO.length - 2, Math.floor(x));
  return GIRO[k] + (GIRO[k + 1] - GIRO[k]) * (x - k);
};

/**
 * El paisaje grabado sin lienzo (para `EngravedMapScene` o el banco): terreno con parcelas de viña, pueblo y árboles con
 * el material de lápiz, y la cámara con su vuelo de entrada. La composición (papel, lápiz y contornos) la pone
 * `pilaGrabado` en el lienzo. Requiere un WebGPURenderer.
 */
export default function EngravedMapContent({ paisaje, entrada = 3, objetivo, onAvance, onReady }: EngravedMapContentProps) {
  const { camera, gl } = useThree();
  const todo = useMemo(() => {
    const p = crearPaisaje(paisaje);
    const pueblo = { centro: p.casas.length ? (paisaje?.pueblo?.centro ?? [-0.7, 0.35]) : [0, 0], radio: (paisaje?.pueblo?.radio ?? 1.5) * 1.1 } as { centro: [number, number]; radio: number };
    const terreno = new THREE.Mesh(p.terreno, materialLapiz({ ...LAPIZ_TERRENO, sinSurcos: pueblo }) as unknown as THREE.Material);
    const casas = new THREE.InstancedMesh(p.casa, materialLapiz(LAPIZ_CASA) as unknown as THREE.Material, p.casas.length);
    p.casas.forEach((m, i) => casas.setMatrixAt(i, m));
    const arboles = new THREE.InstancedMesh(p.arbol, materialLapiz(LAPIZ_ARBOL) as unknown as THREE.Material, p.arboles.length);
    p.arboles.forEach((m, i) => arboles.setMatrixAt(i, m));
    for (const x of [casas, arboles]) {
      x.instanceMatrix.needsUpdate = true;
      x.computeBoundingSphere();
    }
    // la bandada: 100 pájaros, como la referencia (docs/33 §4)
    let semilla = (paisaje?.semilla ?? 3) * 7919;
    const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647);
    const pajaros = new THREE.InstancedMesh(geometriaPajaro(), materialPajaro() as unknown as THREE.Material, 100);
    pajaros.frustumCulled = false;
    const bandada = crearBandada(100, pueblo.centro, azar);
    return { p, bandada, pajaros, mallas: [terreno, casas, arboles, pajaros] };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(paisaje)]);
  useEffect(
    () => () => {
      for (const m of todo.mallas) {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      }
    },
    [todo],
  );

  // paralaje: el puntero inclina un poco la mirada (±1,5°); arrastrar gira la vista (guiñada) con inercia, medido en la
  // referencia con cine:capture: 128,9° por ancho de lienzo y un retraso de primer orden de 0,24 s (docs/33 §4)
  const puntero = useRef(new THREE.Vector2());
  const guinada = useRef({ meta: 0, ahora: 0, x: null as number | null });
  useEffect(() => {
    if (objetivo === null) return;
    const el: HTMLElement = objetivo?.current ?? gl.domElement;
    const mueve = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      puntero.current.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const sale = () => puntero.current.set(0, 0);
    const g = guinada.current;
    const abajo = (e: PointerEvent) => {
      g.x = e.clientX;
    };
    const arrastra = (e: PointerEvent) => {
      if (g.x === null) return;
      const r = el.getBoundingClientRect();
      g.meta = Math.max(-1.2, Math.min(1.2, g.meta + (((e.clientX - g.x) / r.width) * 128.9 * Math.PI) / 180));
      g.x = e.clientX;
    };
    const arriba = () => {
      g.x = null;
    };
    el.addEventListener("pointermove", mueve);
    el.addEventListener("pointerleave", sale);
    el.addEventListener("pointerdown", abajo);
    el.addEventListener("pointermove", arrastra);
    window.addEventListener("pointerup", arriba);
    return () => {
      el.removeEventListener("pointermove", mueve);
      el.removeEventListener("pointerleave", sale);
      el.removeEventListener("pointerdown", abajo);
      el.removeEventListener("pointermove", arrastra);
      window.removeEventListener("pointerup", arriba);
    };
  }, [objetivo, gl]);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = CAMARA_CHARTOGNE.fov;
    cam.near = 0.0025;
    cam.far = 40;
    cam.updateProjectionMatrix();
  }, [camera]);

  const t0 = useRef<number | null>(null);
  const suave = useRef(new THREE.Vector2());
  const listo = useRef(false);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const mira = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }, dt) => {
    if (t0.current === null) t0.current = clock.elapsedTime;
    const t = entrada > 0 ? Math.min(1, (clock.elapsedTime - t0.current) / entrada) : 1;
    const { desde, hasta } = CAMARA_CHARTOGNE;
    camera.position.lerpVectors(desde.pos, hasta.pos, frena(t));
    dir.copy(desde.dir).lerp(hasta.dir, giro(t)).normalize();
    // paralaje suavizado, solo cuando ya ha llegado
    suave.current.lerp(puntero.current, 1 - Math.exp(-dt * 3));
    const k = 0.026 * t;
    const g = guinada.current;
    g.ahora += (g.meta - g.ahora) * (1 - Math.exp(-dt / 0.24));
    // arrastrar a la derecha gira la mirada a la derecha (en la referencia, de −125,6° a −86,9° de rumbo con 0,3 anchos)
    dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), -suave.current.x * k + g.ahora).add(new THREE.Vector3(0, -suave.current.y * k, 0)).normalize();
    todo.bandada.mover(todo.pajaros, clock.elapsedTime);
    camera.lookAt(mira.copy(camera.position).add(dir));
    onAvance?.(t);
    if (!listo.current) {
      listo.current = true;
      onReady?.();
    }
  });

  return (
    <group>
      {todo.mallas.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </group>
  );
}
