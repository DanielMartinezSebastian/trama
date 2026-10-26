"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";

export type TornPaperProps = {
  children?: ReactNode;
  /** bordes rasgados: arriba, abajo o los dos */
  edges?: "both" | "top" | "bottom";
  /** semilla del rasgado */
  seed?: number;
  /** alto del rasgado en px (cuánto entra y sale el borde) */
  depth?: number;
  /** 1 = con el canto blanco del papel que asoma en el corte · 0 = sin canto */
  rim?: number;
  /** color del papel; por defecto, el --acc del tema */
  color?: string;
  /** color del canto; por defecto, el --fg del tema */
  rimColor?: string;
  className?: string;
  style?: CSSProperties;
};

function generador(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * el borde de un rasgado en un viewBox de 1000 × 100: tramos largos con dientes pequeños encima (el papel se rompe en
 * fibras), y el canto un poco más abajo, irregular, para que asome el blanco del corte por partes
 */
function rasgado(semilla: number) {
  const azar = generador(semilla);
  const borde: [number, number][] = [];
  const canto: [number, number][] = [];
  let y = 50, x = 0;
  while (x <= 1000) {
    // la deriva: tramos que suben y bajan despacio
    y = Math.min(80, Math.max(20, y + (azar() - 0.5) * 16));
    const diente = (azar() - 0.5) * 14 * (azar() < 0.3 ? 2 : 1);
    borde.push([x, y + diente]);
    canto.push([x, y + diente + 4 + azar() * 10 * (azar() < 0.45 ? 1 : 0.15)]);
    x += 4 + azar() * 9;
  }
  const pts = (a: [number, number][]) => a.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  return { borde: `0,100 ${pts(borde)} 1000,100`, canto: `0,100 ${pts(canto)} 1000,100` };
}

/**
 * Una franja de papel con los bordes rasgados: el corte irregular con fibras y el canto blanco del papel que asoma por
 * partes, como la sección «The fall was always part of the path» de meermohsin.me. Envuelve cualquier contenido (texto,
 * imagen, figura); el papel es del color del tema. Sin JavaScript en tiempo de ejecución: los bordes son dos SVG con la
 * misma semilla siempre (no saltan al hidratar).
 */
export default function TornPaper({ children, edges = "both", seed = 4, depth = 48, rim = 1, color, rimColor, className = "", style }: TornPaperProps) {
  const arriba = useMemo(() => rasgado(seed), [seed]);
  const abajo = useMemo(() => rasgado(seed + 101), [seed]);
  const borde = (r: { borde: string; canto: string }, lado: "top" | "bottom") => (
    <svg className={`ui-torn__edge ui-torn__edge--${lado}`} viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
      {rim > 0 && <polygon points={r.borde} className="ui-torn__rim" />}
      <polygon points={rim > 0 ? r.canto : r.borde} className="ui-torn__paper" />
    </svg>
  );
  return (
    <div className={`ui-torn ${className}`.trim()} style={{ ...style, "--torn-depth": `${depth}px`, "--torn-color": color || "var(--acc)", "--torn-rim": rimColor || "var(--fg)" } as CSSProperties}>
      {(edges === "both" || edges === "top") && borde(arriba, "top")}
      <div className="ui-torn__body">{children}</div>
      {(edges === "both" || edges === "bottom") && borde(abajo, "bottom")}
    </div>
  );
}
