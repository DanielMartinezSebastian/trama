"use client";

import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";
import type { PoseEmblema } from "@/lib/emblem/scene";

// three y react-three-fiber solo se descargan cuando la pieza está cerca de la pantalla
const ThornEmblemScene = lazy(() => import("@/lib/emblem/scene"));

export type ThornEmblemProps = {
  /** contenido encima (titular, botones) */
  children?: ReactNode;
  /** alto en px (o cualquier medida CSS); el ancho es el del contenedor */
  height?: number | string;
  /** semilla: otra semilla, otras púas */
  seed?: number;
  /** spikes = alas de púas · mask = máscara tribal con el hueco de los ojos (la de meermohsin.me) */
  shape?: "spikes" | "mask";
  /** púas principales por ala */
  spikes?: number;
  /** púas secundarias en las largas (0–2) */
  barbs?: number;
  /** cuánto se curvan (0 = rectas, 1 = garras) */
  curl?: number;
  /** color del emblema; por defecto, el --acc del tema */
  color?: string;
  /** tamaño respecto al alto (1 = el emblema llena el alto) */
  scale?: number;
  /**
   * 0–1: coreografía de la referencia (meermohsin.me) para atarla al scroll. 0 = de frente; 1 = de canto y vertical,
   * más pequeño y apagado (como queda sobre el relato). Sin progress, se balancea solo
   */
  progress?: number;
  /** cámara (mira al origen; el emblema mide unas 2 unidades de ancho): por defecto a 4,2 con fov 35 */
  camera?: { position?: [number, number, number]; fov?: number };
  /** false = colores tal cual, sin tone mapping */
  toneMapped?: boolean;
  /** false = sin inclinarse hacia el puntero */
  interactive?: boolean;
  /** auto = 3D si el equipo puede y no pide reducir movimiento · static = solo la silueta plana */
  render?: "auto" | "static";
  className?: string;
};

const suave = (t: number) => t * t * (3 - 2 * t);

/**
 * Un emblema 3D de púas curvas, simétrico, como un tatuaje tribal o un logotipo de metal: alas de espinas con púas
 * secundarias y un núcleo vertical, en laca brillante que coge los reflejos del estudio y una luz de contra de su
 * color. Procedural (semilla, número de púas, curva), así cada marca tiene el suyo. Sin progress se balancea y se inclina
 * hacia el puntero; con progress (0–1) sigue la coreografía de meermohsin.me: de frente a de canto y vertical, para
 * atarlo al scroll. Medido en la portada y el relato de Meer Mohsin (docs/30, docs/36 B1). Para portadas oscuras,
 * música, moda, videojuegos o estudios con una estética agresiva. Sin WebGL, una silueta plana.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/ThornEmblem`.
 */
export default function ThornEmblem({ children, height = 480, seed = 7, shape = "spikes", spikes = 7, barbs = 1, curl = 0.55, color, scale = 1, progress, camera, toneMapped = true, interactive = true, render = "auto", className = "" }: ThornEmblemProps) {
  const root = useRef<HTMLDivElement>(null);
  const tokens = useTokens(root);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: render === "auto" && !reduced });
  const onReady = useCallback(() => setReady(true), []);
  const col = color || tokens?.["--acc"] || "#a8001c";
  const camara = useMemo(() => ({ posicion: camera?.position ?? ([0, 0, 4.2] as [number, number, number]), fov: camera?.fov ?? 35 }), [camera?.position, camera?.fov]);
  const forma = useMemo(() => ({ tipo: shape === "mask" ? ("mascara" as const) : ("puas" as const), semilla: seed, puas: spikes, ramas: barbs, curva: curl }), [shape, seed, spikes, barbs, curl]);

  // la pose se lee de refs: cambiar progress o el puntero no vuelve a montar la escena
  const estado = useRef({ progress, scale, puntero: [0, 0] as [number, number], suave: [0, 0] as [number, number] });
  estado.current.progress = progress;
  estado.current.scale = scale;
  useEffect(() => {
    const el = root.current;
    if (!el || !interactive) return;
    const mueve = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      estado.current.puntero = [((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1];
    };
    const sale = () => (estado.current.puntero = [0, 0]);
    el.addEventListener("pointermove", mueve);
    el.addEventListener("pointerleave", sale);
    return () => {
      el.removeEventListener("pointermove", mueve);
      el.removeEventListener("pointerleave", sale);
    };
  }, [interactive]);
  const pose = useCallback((t: number): PoseEmblema => {
    const e = estado.current;
    e.suave[0] += (e.puntero[0] - e.suave[0]) * 0.06;
    e.suave[1] += (e.puntero[1] - e.suave[1]) * 0.06;
    const inclina: [number, number] = [e.suave[1] * 0.25, e.suave[0] * 0.35];
    if (e.progress === undefined) {
      return { giro: [inclina[0] + Math.sin(t * 0.7) * 0.06, inclina[1] + Math.sin(t * 0.45) * 0.22, Math.sin(t * 0.33) * 0.03], escala: e.scale, brillo: 1 };
    }
    const p = suave(Math.min(1, Math.max(0, e.progress)));
    return { giro: [inclina[0], inclina[1] + p * Math.PI * 0.47, p * Math.PI * 0.5], escala: e.scale * (1 - 0.3 * p), brillo: 1 - 0.55 * p };
  }, []);

  return (
    <div ref={root} className={`ui-te ${className}`.trim()} style={{ height, "--te-color": col } as CSSProperties}>
      {!ready && <div className="ui-te__flat" aria-hidden />}
      {use3d && mounted && (
        <div className={`ui-te__gl ${ready ? "is-on" : ""}`} aria-hidden>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <ThornEmblemScene forma={forma} color={col} pose={pose} active={near} onReady={onReady} camara={camara} plano={!toneMapped} />
            </Suspense>
          </GLBoundary>
        </div>
      )}
      {children && <div className="ui-te__content">{children}</div>}
    </div>
  );
}
