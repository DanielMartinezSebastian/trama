"use client";

import { Suspense, lazy, useRef, useState, type MutableRefObject, type PointerEvent as RPointerEvent } from "react";
import { useLight } from "@/components/ui/LightScroll";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { metalOf, stoneOf, type RingSel } from "./ring";
import type { RingLook, RingPose } from "./ringScene";

// three y react-three-fiber solo se descargan cuando el anillo está cerca de la pantalla
const RingScene = lazy(() => import("./ringScene"));

export type RingStageProps = {
  sel: RingSel;
  /** final · boceto (alambre) · cera (antes de fundir) · gema (solo la piedra, de cerca) · apagado (sin limpiar) */
  look?: RingLook;
  /** ring = el anillo entero · head = la piedra de cerca · engrave = dentro del aro, leyendo el grabado */
  framing?: "ring" | "head" | "engrave";
  /** pose dictada desde fuera (scroll de la portada): despiece, zoom a la piedra, grabado y giro */
  pose?: MutableRefObject<RingPose> | null;
  /** desenfoque de movimiento y tilt-shift en las transiciones de la pose */
  motionFx?: boolean;
  /** anillos que acompañan al principal cuando la pose pide trío (`trio`) */
  companions?: { sel: RingSel; side: -1 | 1 }[];
  turntable?: boolean;
  /** arrastrar para girar */
  draggable?: boolean;
  /** alto CSS */
  height?: string;
  /** descripción para lectores de pantalla */
  alt: string;
  className?: string;
};

/**
 * El anillo de Quilate (escena propia de esta web, no del kit: guía §12), con el patrón de CakeStage/ObjectStage: primero el
 * dibujo plano (SVG) y three solo si el equipo puede, no se pide reducir movimiento y está cerca de la pantalla. Se ilumina
 * con la toma de luz del `LightScroll` que lo contenga (`useLight`).
 */
export default function RingStage({ sel, look = "final", framing = "ring", pose = null, motionFx = false, companions, turntable = true, draggable = false, height = "60vh", alt, className = "" }: RingStageProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const lightState = useLight();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: !reduced, margin: "200px" });
  const drag = useRef(0);
  const start = useRef<{ x: number; d: number } | null>(null);
  const onDown = (e: RPointerEvent) => {
    if (!draggable) return;
    start.current = { x: e.clientX, d: drag.current };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: RPointerEvent) => {
    if (start.current) drag.current = start.current.d + (e.clientX - start.current.x) * 0.012;
  };
  const onUp = () => (start.current = null);

  return (
    <div
      ref={root}
      className={`ql-stage ${draggable ? "ql-stage--drag" : ""} ${className}`.trim()}
      style={{ height }}
      role="img"
      aria-label={alt}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {!ready && <RingFlat sel={sel} look={look} />}
      {use3d && mounted && (
        <div className={`ql-stage__gl ${ready ? "is-on" : ""}`}>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <RingScene sel={sel} look={look} light={lightState?.live ?? null} drag={drag} turntable={turntable} framing={framing} pose={pose} motionFx={motionFx} companions={companions} active={near} onReady={() => setReady(true)} />
            </Suspense>
          </GLBoundary>
        </div>
      )}
    </div>
  );
}

/** El mismo anillo en SVG, de tres cuartos: respaldo sin WebGL, con movimiento reducido y miniatura de la cita. */
export function RingFlat({ sel, look = "final", className = "" }: { sel: RingSel; look?: RingLook; className?: string }) {
  const metal = look === "cera" ? "#3d7a66" : metalOf(sel.metal).color;
  const stone = look === "cera" ? "#3d7a66" : stoneOf(sel.stone).color;
  const w = 6 + sel.width * 3;
  const sketch = look === "boceto";
  const solitaire = sel.kind === "solitario";
  // redondeado: servidor y navegador no siempre dan el mismo último decimal en la raíz cúbica (aviso de hidratación)
  const r = Math.round((10 + Math.cbrt(sel.carat) * 14) * 100) / 100;
  const dull = look === "apagado" ? 0.55 : 1;
  return (
    <svg className={`ql-flat ${className}`.trim()} viewBox="0 0 240 240" aria-hidden>
      <defs>
        <linearGradient id="ql-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.7 * dull} />
          <stop offset="0.35" stopColor={metal} />
          <stop offset="0.7" stopColor={metal} stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity={0.45 * dull} />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="150" rx="78" ry="54" fill="none" stroke={sketch ? "currentColor" : "url(#ql-metal)"} strokeWidth={sketch ? 1.2 : w} strokeDasharray={sketch ? "4 3" : undefined} />
      {solitaire && look !== "gema" && (
        <g>
          <path d={`M${120 - r * 0.5} 104 L120 ${104 - r * 0.2} L${120 + r * 0.5} 104`} fill="none" stroke={sketch ? "currentColor" : metal} strokeWidth="3" />
          <polygon points={`${120 - r},${92 - r * 0.2} ${120 + r},${92 - r * 0.2} ${120 + r * 0.55},${92 - r * 0.62} ${120 - r * 0.55},${92 - r * 0.62}`} fill={sketch ? "none" : stone} stroke="currentColor" strokeOpacity="0.35" opacity={dull} />
          <polygon points={`${120 - r},${92 - r * 0.2} ${120 + r},${92 - r * 0.2} 120,${92 + r * 0.7}`} fill={sketch ? "none" : stone} stroke="currentColor" strokeOpacity="0.35" opacity={0.85 * dull} />
        </g>
      )}
      {solitaire && look === "gema" && (
        <g transform="translate(120 120) scale(2.4)">
          <polygon points="-22,-4 22,-4 12,-16 -12,-16" fill={stone} stroke="currentColor" strokeOpacity="0.35" />
          <polygon points="-22,-4 22,-4 0,22" fill={stone} stroke="currentColor" strokeOpacity="0.35" opacity="0.85" />
        </g>
      )}
    </svg>
  );
}
