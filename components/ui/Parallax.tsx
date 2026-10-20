"use client";

import { createElement, useEffect, useRef, type ReactNode } from "react";
import { trackScroll } from "@/lib/motion/progress";
import { prefersReducedMotion } from "@/lib/ui/useReducedMotion";

export type ParallaxProps = {
  children: ReactNode;
  /** desplazamiento relativo al scroll: 0 = nada · 0,2 = se mueve un 20 % más lento · −0,2 = más rápido */
  speed?: number;
  as?: "div" | "section" | "figure" | "span";
  className?: string;
};

/**
 * Mueve su contenido a distinto ritmo que el scroll (efecto de profundidad). Sin GSAP; se apaga con
 * `prefers-reduced-motion`. Pensado para imágenes: que el contenedor recorte (`overflow: clip`) y el hijo sea más alto
 * que él, o se verán los bordes al moverse.
 */
export default function Parallax({ children, speed = 0.15, as = "div", className = "" }: ParallaxProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    // el rectángulo medido ya incluye el desplazamiento aplicado: se resta para medir la posición «de reposo»
    // (si no, con velocidad negativa el cálculo se realimenta y el contenido sale disparado)
    let applied = 0;
    return trackScroll(el, (r, vh) => {
      const d = r.top - applied + r.height / 2 - vh / 2;
      applied = -d * speed;
      el.style.transform = `translate3d(0, ${applied.toFixed(1)}px, 0)`;
    });
  }, [speed]);
  return createElement(as, { ref, className: `ui-par ${className}`.trim() }, children);
}
