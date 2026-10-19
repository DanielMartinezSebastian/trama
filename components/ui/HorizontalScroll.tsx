"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { clamp01, trackScroll } from "@/lib/motion/progress";

export type HorizontalScrollProps = {
  /** cada hijo directo es un panel del recorrido */
  children: ReactNode;
  /** texto que aparece fijo sobre el recorrido (opcional) */
  heading?: string;
  /** espacio entre paneles (px) */
  gap?: number;
  /** por debajo de este ancho (px) el recorrido es un carrusel horizontal nativo con imán, sin fijar la página */
  minWidth?: number;
  className?: string;
};

/**
 * El scroll vertical de la página desplaza una fila de paneles en horizontal. La altura de la sección se calcula
 * para que el recorrido dure exactamente lo que mide la fila. Sin GSAP: `position: sticky` + `translateX` por fotograma.
 * En pantallas estrechas y con `prefers-reduced-motion` se convierte en un carrusel horizontal nativo (con imán),
 * sin secuestrar el scroll. El progreso (0 → 1) también queda en `--hs-p` para decorar.
 */
export default function HorizontalScroll({ children, heading = "", gap = 24, minWidth = 860, className = "" }: HorizontalScrollProps) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = outer.current;
    const t = track.current;
    if (!o || !t) return;
    const mq = window.matchMedia(`(max-width: ${minWidth - 1}px), (prefers-reduced-motion: reduce)`);
    let off: (() => void) | undefined;
    let ro: ResizeObserver | undefined;
    const setup = () => {
      off?.();
      ro?.disconnect();
      o.style.height = "";
      t.style.transform = "";
      o.toggleAttribute("data-native", mq.matches);
      // carrusel nativo: la región con scroll tiene que poder enfocarse y moverse con el teclado
      if (mq.matches) { t.tabIndex = 0; t.setAttribute("role", "group"); t.setAttribute("aria-label", heading || "Carrusel horizontal"); }
      else { t.removeAttribute("tabindex"); t.removeAttribute("role"); t.removeAttribute("aria-label"); }
      if (mq.matches) return;
      let dist = 0;
      const measure = () => {
        dist = Math.max(0, t.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(t).paddingInlineStart) * 2);
        o.style.height = `${dist + window.innerHeight}px`;
      };
      measure();
      ro = new ResizeObserver(measure);
      ro.observe(t);
      document.fonts?.ready.then(measure);
      off = trackScroll(o, (r, vh) => {
        const p = clamp01(-r.top / Math.max(1, r.height - vh));
        t.style.transform = `translate3d(${-p * dist}px, 0, 0)`;
        o.style.setProperty("--hs-p", p.toFixed(4));
      });
    };
    setup();
    mq.addEventListener("change", setup);
    return () => {
      mq.removeEventListener("change", setup);
      off?.();
      ro?.disconnect();
    };
  }, [minWidth, heading]);

  return (
    <div ref={outer} className={`ui-hs ${className}`.trim()} style={{ "--hs-gap": `${gap}px`, "--hs-p": 0 } as CSSProperties}>
      <div className="ui-hs__in">
        {heading && <p className="ui-hs__head">{heading}</p>}
        <div ref={track} className="ui-hs__track">
          {children}
        </div>
      </div>
    </div>
  );
}
