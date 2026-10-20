"use client";

import { Suspense, lazy, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { CAKE } from "@/lib/sites/almibar";
import { colorsOf, tiersOf, type CakeSel } from "./cake";

// three y react-three-fiber solo se descargan cuando la tarta está cerca de la pantalla
const CakeScene = lazy(() => import("./cakeScene"));

export type CakeStageProps = {
  sel: CakeSel;
  /** 0 = montada · 1 = despiece; con `explodeVar` se lee de una variable CSS del ancestro (p. ej. `--pin-p` de PinnedSection) */
  explode?: number;
  /** 0 = entera · 1 = la porción sacada hacia delante (se ve por dentro) */
  cut?: number;
  /** nombre de la variable CSS (0–1) que manda el despiece; se lee cada fotograma */
  explodeVar?: string;
  /** tramo de esa variable que hace el despiece completo: [inicio, fin] */
  explodeRange?: [number, number];
  /** curva aplicada al progreso ya recortado (p. ej. abrir y volver a montar); por defecto lineal */
  explodeCurve?: (t: number) => number;
  turntable?: boolean;
  /** arrastrar para girar (si no, la tarta no recibe eventos) */
  draggable?: boolean;
  /** alto CSS */
  height?: string;
  /** descripción para lectores de pantalla */
  alt: string;
  className?: string;
};

/**
 * La tarta de Almíbar Taller en 3D (escena propia de esta web, no del kit: guía §12). Mismo patrón que ObjectStage: primero
 * el dibujo plano (SVG), y three solo si el equipo puede, no se pide reducir movimiento y está cerca de la pantalla; fuera
 * de ella el lienzo deja de dibujar. Un solo lienzo por tarta.
 */
export default function CakeStage({ sel, explode = 0, cut = 0, explodeVar, explodeRange = [0, 1], explodeCurve, turntable = true, draggable = false, height = "60vh", alt, className = "" }: CakeStageProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: !reduced, margin: "200px" });
  const ex = useRef(explode);
  const cutRef = useRef(cut);
  useEffect(() => {
    cutRef.current = cut;
  }, [cut]);
  const drag = useRef(0);
  const [r0, r1] = explodeRange;

  useEffect(() => {
    if (!explodeVar) ex.current = explode;
  }, [explode, explodeVar]);

  // el despiece ligado al scroll: se lee la variable CSS sin re-renderizar React
  useEffect(() => {
    if (!explodeVar || !use3d) return;
    let raf = 0;
    const tick = () => {
      const el = root.current;
      if (el) {
        const v = parseFloat(getComputedStyle(el).getPropertyValue(explodeVar)) || 0;
        const [a, b] = [r0, r1];
        const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
        ex.current = explodeCurve ? explodeCurve(t) : t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [explodeVar, r0, r1, explodeCurve, use3d]);

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
      className={`tl-stage ${draggable ? "tl-stage--drag" : ""} ${className}`.trim()}
      style={{ height }}
      role="img"
      aria-label={alt}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {!ready && <CakeFlat sel={sel} />}
      {use3d && mounted && (
        <div className={`tl-stage__gl ${ready ? "is-on" : ""}`}>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <CakeScene sel={sel} explode={ex} cut={cutRef} drag={drag} turntable={turntable} active={near} onReady={() => setReady(true)} />
            </Suspense>
          </GLBoundary>
        </div>
      )}
      {/* en 3D el mensaje va escrito en la placa de chocolate; en el dibujo plano, encima */}
      {!ready && sel.toppings.includes("mensaje") && sel.message.trim() && <p className="tl-stage__msg" aria-hidden>«{sel.message.trim()}»</p>}
    </div>
  );
}

/** La misma tarta de frente en SVG: respaldo sin WebGL, con movimiento reducido y miniatura de la solicitud. */
export function CakeFlat({ sel, className = "" }: { sel: CakeSel; className?: string }) {
  const c = colorsOf(sel);
  const n = tiersOf(sel.size);
  const W = [180, 128, 84];
  const H = 64;
  const covered = sel.covering !== "desnuda";
  const cover = c.covering || c.sponge;
  let y = 196;
  const tiers = Array.from({ length: n }, (_, i) => {
    y -= H;
    return { x: 120 - W[i] / 2, y, w: W[i] };
  });
  const top = tiers[n - 1];
  return (
    <svg className={`tl-flat ${className}`.trim()} viewBox="0 0 240 220" aria-hidden>
      <ellipse cx="120" cy="204" rx="112" ry="9" fill="currentColor" opacity="0.08" />
      <rect x="10" y="196" width="220" height="8" rx="4" fill="#fbf8f4" stroke="currentColor" strokeOpacity="0.12" />
      {tiers.map((t, i) => (
        <g key={i}>
          {covered ? (
            <rect x={t.x} y={t.y} width={t.w} height={H} rx="6" fill={cover} />
          ) : (
            [0, 1, 2, 3, 4].map((l) => {
              const hs = [20, 6, 20, 6, 12];
              const yy = t.y + H - hs.slice(0, l + 1).reduce((a, b) => a + b, 0);
              return <rect key={l} x={t.x} y={yy} width={t.w} height={hs[l]} fill={l % 2 ? c.filling : c.sponge} />;
            })
          )}
          {sel.covering === "ganache" &&
            Array.from({ length: Math.round(t.w / 14) }, (_, d) => <rect key={d} x={t.x + 4 + d * 14} y={t.y} width="7" height={10 + ((d * 7) % 13)} rx="3.5" fill={cover} />)}
        </g>
      ))}
      {sel.toppings.includes("frutos-rojos") && [0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={top.x + 14 + k * ((top.w - 28) / 5)} cy={top.y - 5} r="6" fill={k % 3 === 2 ? "#2f3a6b" : "#b8213f"} />)}
      {sel.toppings.includes("flores") && [0, 1, 2].map((k) => <circle key={k} cx={top.x + top.w * (0.25 + k * 0.25)} cy={top.y - 4} r="7" fill="#f3b9c6" stroke="#f2c14e" strokeWidth="3" />)}
      {sel.toppings.includes("velas") &&
        [0, 1, 2].map((k) => (
          <g key={k}>
            <rect x={top.x + top.w * (0.3 + k * 0.2) - 2} y={top.y - 30} width="4" height="26" fill="#f6efe6" stroke="currentColor" strokeOpacity="0.15" />
            <ellipse cx={top.x + top.w * (0.3 + k * 0.2)} cy={top.y - 35} rx="3" ry="6" fill="#ffb347" />
          </g>
        ))}
      <title>{CAKE.sizes.find((s) => s.value === sel.size)?.label}</title>
    </svg>
  );
}
