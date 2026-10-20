"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { TokenSet } from "@/lib/ui/tokens";

export type ThemeScrollTheme = Partial<Pick<TokenSet, "bg" | "fg" | "mut" | "acc" | "acc2" | "card" | "ln">>;

export type ThemeScrollProps = {
  /** temas por nombre; cada sección hija elige el suyo con `data-theme="nombre"` */
  themes: Record<string, ThemeScrollTheme>;
  /** el de partida (por defecto, el primero de `themes`) */
  initial?: string;
  /** segundos del fundido de fondo y texto */
  duration?: number;
  as?: "div" | "main" | "section" | "article";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

const VARS: Array<[keyof ThemeScrollTheme, string]> = [["bg", "--bg"], ["fg", "--fg"], ["mut", "--mut"], ["acc", "--acc"], ["acc2", "--acc2"], ["card", "--card"], ["ln", "--ln"]];
const styleOf = (t: ThemeScrollTheme | undefined): CSSProperties =>
  Object.fromEntries(VARS.filter(([k]) => t?.[k]).map(([k, v]) => [v, t![k]])) as CSSProperties;

/**
 * Contenedor cuyo tema cambia según la sección que cruza el centro de la ventana: verde oliva → hueso → negro en Lando Norris.
 * Las secciones son hijos (a cualquier profundidad) con `data-theme`. Cambian los tokens del contenedor, así que todo lo que
 * lee `var(--bg)`, `var(--fg)`… dentro (también una cabecera fija, si vive dentro) cambia con él; el fondo y el color del
 * propio contenedor se funden con una transición. El primer tema viene en el HTML del servidor. Con movimiento reducido el cambio
 * es inmediato. El contenido no depende del tema: elige colores que funcionen en todos (contraste ≥ 4,5:1 en cada uno).
 */
export default function ThemeScroll({ themes, initial, duration = 0.7, as = "div", className = "", style, children }: ThemeScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const first = initial ?? Object.keys(themes)[0];
  const [active, setActive] = useState(first);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sections = Array.from(el.querySelectorAll<HTMLElement>("[data-theme]"));
    if (!sections.length) return;
    // una línea horizontal a media altura: la sección que la cruza manda
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.getAttribute("data-theme") || first);
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [first, children]);

  return createElement(
    as,
    {
      ref,
      className: `ui-tscroll ${className}`.trim(),
      "data-theme-active": active,
      style: { ...styleOf(themes[first]), ...styleOf(themes[active]), "--ts-dur": `${duration}s`, ...style } as CSSProperties,
    },
    children,
  );
}
