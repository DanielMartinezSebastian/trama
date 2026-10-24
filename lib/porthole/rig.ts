import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import type { PerspectiveCamera } from "three";

/*
 * Cámara de la ventanilla, medida en Hublot (docs/28):
 * - cabeza que se asoma: la cámara se desplaza hacia el puntero y gira en contra (guiñada −8°, cabeceo −4,8°, ±3,9 cm
 *   en x y ±2,2 cm en y para el puntero en los bordes), con un seguimiento de 0,03 por fotograma (r² 1,000); fuera de la
 *   ventanilla la cabeza no cuenta (la cámara ya no se asoma);
 * - arrastrar saca la cámara por la ventanilla (y otro arrastre la devuelve): se dispara al pasar de ~18 % del ancho o
 *   al soltar un arrastre corto, y llega en un acercamiento exponencial (0,088 por fotograma a la ida, 0,082 a la vuelta),
 *   no con una curva con aceleración.
 */

const DENTRO = { pos: [-1.369, 0.0003, -1.6686], guinada: -18, cabeceo: 0 };
const FUERA = { pos: [-1.465, 0.02, -1.995], guinada: 2.4, cabeceo: 3 };
const CABEZA = { guinada: -8, cabeceo: -4.76, x: 0.039, y: 0.0219, seguimiento: 0.03 };
const PASO = { ida: 0.088, vuelta: 0.082, umbral: 0.19 };

export type RigVentanilla = {
  /** 0 = dentro, 1 = fuera (el estado al que va); se puede escribir desde fuera */
  fuera: RefObject<number>;
};

/** elemento que recibe el puntero (por defecto, la ventana) y si responde */
export function useRigVentanilla({ objetivo, activo = true, onCambio }: { objetivo?: RefObject<HTMLElement | null>; activo?: boolean; onCambio?: (fuera: boolean) => void } = {}): RigVentanilla {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const fuera = useRef(0);
  const s = useRef(0);
  const puntero = useRef<[number, number]>([0, 0]);
  const cabeza = useRef({ g: 0, c: 0, x: 0, y: 0 });

  useEffect(() => {
    if (!activo) return;
    const el: HTMLElement | Window = objetivo?.current ?? window;
    let abajo: [number, number] | null = null;
    let tactil = false;
    let usado = false;
    const rect = () => (el instanceof Window ? { left: 0, top: 0, width: innerWidth, height: innerHeight } : el.getBoundingClientRect());
    const alternar = () => {
      fuera.current = fuera.current > 0.5 ? 0 : 1;
      onCambio?.(fuera.current > 0.5);
    };
    const mover = (e: PointerEvent) => {
      const r = rect();
      puntero.current = [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)];
      // en táctil cuenta solo lo horizontal: el arrastre vertical es el scroll de la página
      const dist = tactil ? Math.abs(e.clientX - abajo![0]) : abajo ? Math.hypot(e.clientX - abajo[0], e.clientY - abajo[1]) : 0;
      if (abajo && !usado && dist > PASO.umbral * r.width) {
        usado = true;
        alternar();
      }
    };
    const bajar = (e: PointerEvent) => {
      abajo = [e.clientX, e.clientY];
      tactil = e.pointerType === "touch";
      usado = false;
    };
    const subir = (e: PointerEvent) => {
      const dist = abajo ? (tactil ? Math.abs(e.clientX - abajo[0]) : Math.hypot(e.clientX - abajo[0], e.clientY - abajo[1])) : 0;
      if (abajo && !usado && dist > (tactil ? 40 : 8)) alternar();
      abajo = null;
    };
    el.addEventListener("pointermove", mover as EventListener);
    el.addEventListener("pointerdown", bajar as EventListener);
    window.addEventListener("pointerup", subir);
    return () => {
      el.removeEventListener("pointermove", mover as EventListener);
      el.removeEventListener("pointerdown", bajar as EventListener);
      window.removeEventListener("pointerup", subir);
    };
  }, [activo, objetivo, onCambio]);

  useFrame((_, delta) => {
    const dt = Math.min(3, delta * 60);
    // seguimiento por fotograma a 60 Hz, independiente de la frecuencia real
    const k = (a: number) => 1 - Math.pow(1 - a, dt);
    const ida = fuera.current > s.current;
    s.current += (fuera.current - s.current) * k(ida ? PASO.ida : PASO.vuelta);
    const [px, py] = puntero.current;
    const h = cabeza.current;
    const kc = k(CABEZA.seguimiento);
    h.g += (CABEZA.guinada * px - h.g) * kc;
    h.c += (CABEZA.cabeceo * py - h.c) * kc;
    h.x += (CABEZA.x * px - h.x) * kc;
    h.y += (CABEZA.y * py - h.y) * kc;
    const t = s.current;
    const mix = (a: number, b: number) => a + (b - a) * t;
    const dentro = 1 - t;
    camera.position.set(mix(DENTRO.pos[0], FUERA.pos[0]) + h.x * dentro, mix(DENTRO.pos[1], FUERA.pos[1]) + h.y * dentro, mix(DENTRO.pos[2], FUERA.pos[2]));
    const g = ((mix(DENTRO.guinada, FUERA.guinada) + h.g * dentro) * Math.PI) / 180;
    const c = ((mix(DENTRO.cabeceo, FUERA.cabeceo) + h.c * dentro) * Math.PI) / 180;
    // la cámara mira a −z; la guiñada medida es atan2(dir.x, −dir.z): rotation.y = −guiñada
    camera.rotation.set(c, -g, 0, "YXZ");
  });

  return { fuera };
}
