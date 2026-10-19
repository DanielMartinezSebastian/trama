"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

export type WorkItem = {
  title: string;
  /** categoría o servicio */
  meta?: string;
  year?: string;
  image?: string;
  alt?: string;
  href?: string;
};

export type WorkView = "list" | "grid" | "index";

export type WorkViewsProps = {
  items: WorkItem[];
  /** vistas disponibles, en este orden (la primera es la inicial) */
  views?: WorkView[];
  /** nombre del grupo de botones (accesible) */
  label?: string;
  /** texto sobre los botones de vista */
  switchLabel?: string;
  className?: string;
};

const NAMES: Record<WorkView, string> = { list: "Lista", grid: "Cuadrícula", index: "Índice" };

/**
 * Colección de trabajos con **cambio de vista animado** («Layout ① ②», 'kin): lista con miniatura, cuadrícula de imágenes o
 * índice solo de texto. Al cambiar, cada elemento viaja a su nueva posición (GSAP Flip) en lugar de aparecer de golpe. Los
 * botones son un grupo de radios con nombre; sin movimiento con `prefers-reduced-motion`. Todos los elementos son enlaces
 * reales cuando llevan `href`.
 */
export default function WorkViews({ items, views = ["list", "grid", "index"], label = "Cambiar vista", switchLabel = "Vista", className = "" }: WorkViewsProps) {
  const [view, setView] = useState<WorkView>(views[0]);
  const root = useRef<HTMLUListElement>(null);
  const pending = useRef<unknown>(null);
  const reduced = useReducedMotion();

  const change = async (v: WorkView) => {
    if (v === view) return;
    if (!reduced && root.current) {
      const [{ gsap }, { Flip }] = await Promise.all([import("gsap"), import("gsap/Flip")]);
      gsap.registerPlugin(Flip);
      pending.current = Flip.getState(root.current.querySelectorAll("[data-flip]"));
    }
    setView(v);
  };

  useLayoutEffect(() => {
    const st = pending.current;
    if (!st || !root.current) return;
    pending.current = null;
    import("gsap/Flip").then(({ Flip }) => {
      Flip.from(st as never, { duration: 0.7, ease: "power3.inOut", stagger: 0.025, absolute: false, nested: true, onEnter: (els) => els.forEach((e) => ((e as HTMLElement).style.opacity = "1")) });
    });
  }, [view]);

  // un sitio puede cambiar las vistas disponibles
  useEffect(() => {
    if (!views.includes(view)) setView(views[0]);
  }, [views, view]);

  return (
    <div className={`ui-wv ${className}`.trim()}>
      <div className="ui-wv__bar">
        <span className="ui-wv__lab" id="ui-wv-l">{switchLabel}</span>
        <div className="ui-wv__sw" role="radiogroup" aria-label={label}>
          {views.map((v, i) => (
            <button key={v} type="button" role="radio" aria-checked={v === view} aria-label={NAMES[v]} className="ui-wv__b" onClick={() => change(v)}>
              {i + 1}
            </button>
          ))}
        </div>
        <span className="ui-wv__n" aria-live="polite">{NAMES[view]} · {items.length}</span>
      </div>
      <ul ref={root} className={`ui-wv__ul ui-wv__ul--${view}`}>
        {items.map((it, i) => {
          const inner = (
            <>
              {it.image && view !== "index" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img data-flip={`i${i}`} className="ui-wv__img" src={it.image} alt={it.alt ?? ""} loading="lazy" />
              )}
              <span data-flip={`t${i}`} className="ui-wv__tx">
                <b className="ui-wv__t">{it.title}</b>
                {it.meta && <small className="ui-wv__m">{it.meta}</small>}
              </span>
              {it.year && <span data-flip={`y${i}`} className="ui-wv__y">{it.year}</span>}
            </>
          );
          return (
            <li key={it.title + i} className="ui-wv__li" style={{ "--wv-i": i } as CSSProperties}>
              {it.href ? <a className="ui-wv__a" href={it.href}>{inner}</a> : <div className="ui-wv__a">{inner}</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
