"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { pinProgress, trackScroll } from "@/lib/motion/progress";
import { resolveFeel, seguidorRaf, tramo, type ScrollFeelName } from "@/lib/motion/scroll-feel";

export type PinnedSectionProps = {
  children: ReactNode;
  /** cuántas pantallas de scroll dura la sección fijada (1 = una altura de ventana extra) */
  length?: number;
  /**
   * pasos de la sección (2 o más): cada uno es una pose de reposo, con meseta y curva entre ellos (docs/42). Sin pasos,
   * todo el recorrido es un tramo
   */
  steps?: number;
  /** sensación (meseta, curva y amortiguado de `--pin-t`); por defecto, la de la página (`SmoothScroll feel`) */
  feel?: ScrollFeelName;
  className?: string;
  style?: CSSProperties;
};

/**
 * Sección que se queda fija mientras haces scroll y publica su progreso en variables CSS que tus hijos usan en `calc()` o
 * en `transform`/`opacity`/`clip-path`:
 *   - `--pin-t` (0 → 1): el recomendado. Con la sensación de la página (docs/42): mesetas en cada paso (`steps`), curva
 *     entre ellos y seguimiento amortiguado. Lo que se mueve llega, se queda quieto y no copia cada tirón de la rueda;
 *   - `--pin-step`: el paso más cercano (0, 1, 2…);
 *   - `--pin-p` (0 → 1): el progreso en bruto, 1:1 con el scroll.
 * Sin GSAP: `position: sticky` + un cálculo por fotograma.
 * El contenido va dentro de una pantalla completa (`100svh`). Con `prefers-reduced-motion` el progreso sigue
 * publicándose; decide en tu CSS si lo aplicas.
 *
 * Ejemplo: `.mi-titulo { transform: translateX(calc(var(--pin-p) * -40vw)); }`.
 */
export default function PinnedSection({ children, length = 2, steps, feel, className = "", style }: PinnedSectionProps) {
  const outer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const f = resolveFeel(feel);
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = Math.max(1, (steps ?? 2) - 1);
    const t = seguidorRaf(quieto ? Infinity : f.damp.pose, (v) => el.style.setProperty("--pin-t", v.toFixed(4)));
    const stop = trackScroll(el, (r, vh) => {
      const p = pinProgress(r, vh);
      el.style.setProperty("--pin-p", p.toFixed(4));
      // pasos: reposo en cada uno (meseta) y la curva entre ellos
      const x = p * n, j = Math.min(n - 1, Math.floor(x));
      t.set((j + tramo(x - j, f.plateau, f.curve)) / n);
      el.style.setProperty("--pin-step", String(Math.round(x)));
    });
    return () => {
      stop();
      t.stop();
    };
  }, [length, steps, feel]);
  return (
    <div ref={outer} className={`ui-pin ${className}`.trim()} style={{ ...style, "--pin-len": length, "--pin-p": 0, "--pin-t": 0, "--pin-step": 0 } as CSSProperties}>
      <div className="ui-pin__in">{children}</div>
    </div>
  );
}
