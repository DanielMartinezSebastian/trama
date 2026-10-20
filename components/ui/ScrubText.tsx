"use client";

import { createElement, useEffect, useRef, type CSSProperties } from "react";
import { clamp01, pinProgress, trackScroll } from "@/lib/motion/progress";
import { prefersReducedMotion } from "@/lib/ui/useReducedMotion";

export type ScrubTextProps = {
  children: string;
  /** opacidad de las palabras aún «apagadas» (efecto de progreso: con movimiento reducido o contraste alto se ve todo) */
  dim?: number;
  /** fracción de la altura de la ventana donde empieza (0 = arriba) y donde termina el recorrido */
  from?: number;
  to?: number;
  /** selector de una sección fijada que lo contiene (p. ej. `.ui-pin`): el progreso sale de su recorrido y no de la posición
   * del párrafo, que dentro de una sección fijada no se mueve */
  scope?: string;
  /** con `scope`: tramo del recorrido de la sección (0–1) en el que se encienden las palabras */
  range?: [number, number];
  as?: "p" | "h2" | "h3" | "div";
  className?: string;
};

/**
 * Párrafo cuyas palabras se «encienden» una a una según haces scroll (de `dim` a opacidad plena). Sin GSAP: un cálculo
 * por fotograma que fija `--w` (0–1) en cada palabra. El texto es un `string` normal y el lector de pantalla lo lee entero.
 * Dentro de un `PinnedSection` usa `scope=".ui-pin"` y `range`: las palabras se encienden en ese tramo de la sección.
 * Con `prefers-reduced-motion` se ve completo desde el principio.
 */
export default function ScrubText({ children: text, dim = 0.3, from = 0.85, to = 0.35, scope, range = [0, 1], as = "p", className = "" }: ScrubTextProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ws = Array.from(el.querySelectorAll<HTMLElement>(".ui-scrub__w"));
    if (prefersReducedMotion()) {
      ws.forEach((w) => w.style.setProperty("--w", "1"));
      return;
    }
    const host = scope ? el.closest<HTMLElement>(scope) : null;
    const [r0, r1] = range;
    if (host)
      return trackScroll(host, (r, vh) => {
        const p = clamp01((pinProgress(r, vh) - r0) / Math.max(0.001, r1 - r0));
        ws.forEach((w, i) => w.style.setProperty("--w", clamp01(p * ws.length - i).toFixed(3)));
      });
    return trackScroll(el, (r, vh) => {
      // progreso del párrafo: 0 cuando su tope está en `from`, 1 cuando su base llega a `to`
      const start = vh * from;
      const end = vh * to;
      const p = clamp01((start - r.top) / (start - end + r.height));
      ws.forEach((w, i) => w.style.setProperty("--w", clamp01(p * ws.length - i).toFixed(3)));
    });
  }, [from, to, text, scope, range[0], range[1]]);

  return createElement(
    as,
    { ref, className: `ui-scrub ${className}`.trim(), style: { "--dim": dim } as CSSProperties },
    <span className="ui-sr">{text}</span>,
    ...words.map((w, i) => (
      <span key={i} className="ui-scrub__w" aria-hidden style={{ "--w": 0 } as CSSProperties}>
        {w}
        {i < words.length - 1 ? " " : ""}
      </span>
    )),
  );
}
