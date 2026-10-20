"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { pinProgress, trackScroll } from "@/lib/motion/progress";

export type PinnedSectionProps = {
  children: ReactNode;
  /** cuántas pantallas de scroll dura la sección fijada (1 = una altura de ventana extra) */
  length?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Sección que se queda fija mientras haces scroll y publica su progreso (0 → 1) en la variable CSS `--pin-p`, que tus
 * hijos usan en `calc()` o en `transform`/`opacity`/`clip-path`. Sin GSAP: `position: sticky` + un cálculo por fotograma.
 * El contenido va dentro de una pantalla completa (`100svh`). Con `prefers-reduced-motion` el progreso sigue
 * publicándose; decide en tu CSS si lo aplicas.
 *
 * Ejemplo: `.mi-titulo { transform: translateX(calc(var(--pin-p) * -40vw)); }`.
 */
export default function PinnedSection({ children, length = 2, className = "", style }: PinnedSectionProps) {
  const outer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    return trackScroll(el, (r, vh) => el.style.setProperty("--pin-p", pinProgress(r, vh).toFixed(4)));
  }, [length]);
  return (
    <div ref={outer} className={`ui-pin ${className}`.trim()} style={{ ...style, "--pin-len": length, "--pin-p": 0 } as CSSProperties}>
      <div className="ui-pin__in">{children}</div>
    </div>
  );
}
