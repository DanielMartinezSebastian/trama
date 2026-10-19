"use client";

import { Fragment, createElement, useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

export type ElasticTextProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  /** «pointer»: las letras cercanas al puntero se estiran · «scroll»: se estiran según la velocidad del scroll */
  mode?: "pointer" | "scroll";
  /** cuánto se estiran (0,6 por defecto) */
  stretch?: number;
  /** radio de influencia del puntero en px (modo pointer) */
  radius?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Tipografía elástica: cada letra se estira en vertical (y se aprieta en horizontal) cuando el puntero pasa cerca o cuando se
 * hace scroll rápido (Mat Voyce, Uncommon). Solo transforma (`scaleY`, `translateY`): no cambia el flujo ni el tamaño de la línea,
 * así el texto sigue legible. El texto completo va en un tramo solo para lectores; las letras sueltas se ocultan. Sin movimiento con
 * `prefers-reduced-motion`.
 */
export default function ElasticText({ children, as = "h2", mode = "pointer", stretch = 0.6, radius = 160, className = "", style }: ElasticTextProps) {
  const box = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = box.current;
    if (!el || reduced) return;
    const letters = [...el.querySelectorAll<HTMLElement>(".ui-elas__c")];
    let raf = 0;
    let px = -9999;
    let py = -9999;
    const k = letters.map(() => 0);
    let lastY = window.scrollY;
    let vel = 0;
    const measure = () => letters.map((l) => l.getBoundingClientRect());
    let rs = measure();
    const apply = (i: number, v: number) => {
      letters[i].style.transform = v < 0.005 ? "" : `translateY(${(-v * stretch * 0.18).toFixed(3)}em) scaleY(${(1 + v * stretch).toFixed(3)}) scaleX(${(1 - v * stretch * 0.16).toFixed(3)})`;
    };
    const tick = () => {
      let busy = false;
      if (mode === "scroll") {
        const dy = window.scrollY - lastY;
        lastY = window.scrollY;
        vel += (Math.min(Math.abs(dy) / 36, 1) - vel) * 0.18;
      }
      letters.forEach((_, i) => {
        let target = 0;
        if (mode === "pointer") {
          const r = rs[i];
          const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
          target = Math.max(0, 1 - d / radius);
        } else target = vel * (0.55 + 0.45 * Math.sin(i * 1.7));
        k[i] += (target - k[i]) * 0.16;
        if (k[i] > 0.004 || target > 0) busy = true;
        apply(i, k[i]);
      });
      raf = busy || mode === "scroll" ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      wake();
    };
    const leave = () => {
      px = -9999;
      py = -9999;
      wake();
    };
    const refresh = () => {
      rs = measure();
    };
    if (mode === "pointer") {
      window.addEventListener("pointermove", move, { passive: true });
      el.addEventListener("pointerleave", leave);
      window.addEventListener("scroll", refresh, { passive: true });
    } else wake();
    window.addEventListener("resize", refresh);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("resize", refresh);
      el.removeEventListener("pointerleave", leave);
    };
  }, [children, mode, stretch, radius, reduced]);

  const words = children.split(" ");
  return createElement(
    as,
    { ref: box, className: `ui-elas ${className}`.trim(), style },
    <span key="sr" className="ui-elas__sr">{children}</span>,
    words.map((w, wi) => (
      <Fragment key={wi}>
        <span className="ui-elas__w" aria-hidden>
          {[...w].map((c, ci) => <span key={ci} className="ui-elas__c">{c}</span>)}
        </span>
        {wi < words.length - 1 ? " " : ""}
      </Fragment>
    )),
  );
}
