"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export type FitTextProps = {
  /** texto o varias piezas (p. ej. dos tipografías: `<b>OFFF</b><i>FORUM</i>`); siempre en una sola línea */
  children: ReactNode;
  /** tope de tamaño en px (por defecto sin tope: ocupa todo el ancho) */
  max?: number;
  min?: number;
  as?: "div" | "p" | "span" | "h1" | "h2" | "h3";
  className?: string;
  style?: CSSProperties;
};

/**
 * Texto que llena exactamente el ancho de su contenedor, en una sola línea (titulares gigantes de pie de página).
 * Mide una vez cargadas las fuentes y cada vez que cambia el ancho. En el servidor usa `12vw` para no saltar al hidratar.
 */
export default function FitText({ children, max, min = 12, as = "div", className = "", style }: FitTextProps) {
  const box = useRef<HTMLElement>(null);
  const txt = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = box.current;
    const t = txt.current;
    if (!el || !t) return;
    let raf = 0;
    const fit = () => {
      t.style.fontSize = "100px";
      const w = t.scrollWidth;
      const avail = el.clientWidth;
      if (!w || !avail) return;
      const size = Math.min(max ?? Infinity, Math.max(min, (100 * avail) / w));
      t.style.fontSize = `${size}px`;
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [children, max, min]);

  return createElement(as, { ref: box, className: `ui-fit ${className}`.trim(), style }, <span ref={txt} className="ui-fit__t" style={{ fontSize: "12vw" }}>{children}</span>);
}
