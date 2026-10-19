"use client";

import { useState, type CSSProperties } from "react";

export type ExpandingPanel = {
  title: string;
  /** línea pequeña (categoría, cifra) */
  meta?: string;
  /** imagen de fondo (URL o data URI) */
  image?: string;
  /** color de relleno cuando no hay imagen (CSS) */
  color?: string;
  href?: string;
  alt?: string;
};

export type ExpandingPanelsProps = {
  panels: ExpandingPanel[];
  /** alto del conjunto (CSS) */
  height?: string;
  /** cuánto crece el panel activo respecto a los demás */
  grow?: number;
  className?: string;
};

/**
 * Columnas verticales que se reparten el ancho y, al pasar el puntero o enfocar con el teclado, una se expande y las demás se
 * estrechan (categorías de proyectos, servicios, colecciones). Cada panel es un enlace real (o un elemento enfocable); el título
 * se lee siempre. En pantallas estrechas se apilan como filas y el activo se despliega en vertical. Con `prefers-reduced-motion`
 * el cambio es instantáneo.
 */
export default function ExpandingPanels({ panels, height = "70vh", grow = 4, className = "" }: ExpandingPanelsProps) {
  const [on, setOn] = useState(0);
  return (
    <ul className={`ui-xpan ${className}`.trim()} style={{ height, "--xp-grow": grow } as CSSProperties} onPointerLeave={() => setOn(0)}>
      {panels.map((p, i) => {
        const Tag = p.href ? "a" : "div";
        const props = p.href ? { href: p.href } : { tabIndex: 0 };
        return (
          <li key={p.title + i} className="ui-xpan__li" data-on={i === on ? "" : undefined}>
            <Tag {...props} className="ui-xpan__p" style={{ background: p.color } as CSSProperties} onPointerEnter={(e: React.PointerEvent) => e.pointerType === "mouse" && setOn(i)} onFocus={() => setOn(i)}>
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="ui-xpan__img" src={p.image} alt={p.alt ?? ""} loading="lazy" />
              )}
              <span className="ui-xpan__txt">
                {p.meta && <small>{p.meta}</small>}
                <b>{p.title}</b>
              </span>
            </Tag>
          </li>
        );
      })}
    </ul>
  );
}
