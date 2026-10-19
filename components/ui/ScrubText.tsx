"use client";

import { createElement, useEffect, useRef, type CSSProperties } from "react";
import { clamp01, trackScroll } from "@/lib/motion/progress";

export type ScrubTextProps = {
  children: string;
  /** opacidad de las palabras aún «apagadas» (efecto de progreso: con movimiento reducido o contraste alto se ve todo) */
  dim?: number;
  /** fracción de la altura de la ventana donde empieza (0 = arriba) y donde termina el recorrido */
  from?: number;
  to?: number;
  as?: "p" | "h2" | "h3" | "div";
  className?: string;
};

/**
 * Párrafo cuyas palabras se «encienden» una a una según haces scroll (de `dim` a opacidad plena). Sin GSAP: un cálculo
 * por fotograma que fija `--w` (0–1) en cada palabra. El texto es un `string` normal y el lector de pantalla lo lee entero.
 * Con `prefers-reduced-motion` se ve completo desde el principio.
 */
export default function ScrubText({ children: text, dim = 0.3, from = 0.85, to = 0.35, as = "p", className = "" }: ScrubTextProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ws = Array.from(el.querySelectorAll<HTMLElement>(".ui-scrub__w"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ws.forEach((w) => w.style.setProperty("--w", "1"));
      return;
    }
    return trackScroll(el, (r, vh) => {
      // progreso del párrafo: 0 cuando su tope está en `from`, 1 cuando su base llega a `to`
      const start = vh * from;
      const end = vh * to;
      const p = clamp01((start - r.top) / (start - end + r.height));
      ws.forEach((w, i) => w.style.setProperty("--w", clamp01(p * ws.length - i).toFixed(3)));
    });
  }, [from, to, text]);

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
