"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

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
  /** Abre cada panel al recorrer el conjunto en móvil (hasta 720px). */
  mobileScroll?: boolean;
  /** Mostrar el subtítulo siempre o solo en el panel abierto. */
  metaVisibility?: "always" | "active";
  /** Tamaño máximo del título (CSS); se adapta al ancho y admite varias líneas. */
  titleMaxSize?: string;
  /** Ancho mínimo de los paneles en escritorio (CSS). */
  minPanelWidth?: string;
  className?: string;
};

/**
 * Columnas verticales que se reparten el ancho y, al pasar el puntero o enfocar con el teclado, una se expande y las demás se
 * estrechan (categorías de proyectos, servicios, colecciones). Cada panel es un enlace real (o un elemento enfocable); el título
 * se lee siempre. En pantallas estrechas se apilan como filas y el activo se despliega en vertical. Con `prefers-reduced-motion`
 * el cambio es instantáneo. `mobileScroll` abre los paneles al recorrer el grupo; `metaVisibility="active"` oculta los subtítulos cerrados.
 */
export default function ExpandingPanels({ panels, height = "70vh", grow = 4, mobileScroll = false, metaVisibility = "always", titleMaxSize = "28px", minPanelWidth = "120px", className = "" }: ExpandingPanelsProps) {
  const [on, setOn] = useState(0);
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!mobileScroll || !panels.length) return;
    const root = ref.current;
    if (!root) return;
    const media = window.matchMedia("(max-width: 720px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!media.matches || root.contains(document.activeElement)) return;
      const rect = root.getBoundingClientRect();
      const focusLine = document.documentElement.clientHeight * 0.55;
      if (rect.bottom <= 0 || rect.top >= document.documentElement.clientHeight) return;
      // Equal slots across the whole group keep activation independent of the
      // changing height of each individual panel during its expansion.
      const progress = (focusLine - rect.top) / rect.height;
      setOn(Math.max(0, Math.min(panels.length - 1, Math.floor(progress * panels.length))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, [mobileScroll, panels.length]);

  return (
    <ul ref={ref} className={`ui-xpan ${className}`.trim()} data-meta={metaVisibility} data-scroll={mobileScroll ? "" : undefined} style={{ height, "--xp-grow": grow, "--xp-count": panels.length, "--xp-title-max": titleMaxSize, "--xp-min-width": minPanelWidth } as CSSProperties} onPointerLeave={(e) => { if (e.pointerType === "mouse" && !e.currentTarget.contains(document.activeElement)) setOn(0); }}>
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
