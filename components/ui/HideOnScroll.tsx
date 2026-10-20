"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/ui/useReducedMotion";

export type HideOnScrollProps = {
  children: ReactNode;
  /** px de scroll hacia abajo antes de empezar a esconderse (arriba del todo siempre se ve) */
  offset?: number;
  as?: "header" | "div" | "nav";
  className?: string;
};

/**
 * Envoltorio para cabeceras: se esconde al bajar y reaparece al subir (o al llegar arriba, o si algo dentro tiene el foco).
 * Por defecto va fijo arriba; la posición real la decide tu CSS. No oculta nada con `prefers-reduced-motion`
 * (se queda siempre visible) ni mientras un descendiente tiene el foco, para no esconder el elemento que usa el teclado.
 */
export default function HideOnScroll({ children, offset = 120, as = "header", className = "" }: HideOnScrollProps) {
  const [hidden, setHidden] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setHidden(y > last && y > offset && !ref.current?.contains(document.activeElement));
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [offset]);

  return createElement(as, { ref, className: `ui-hos ${className}`.trim(), "data-hidden": hidden ? "" : undefined }, children);
}
