"use client";

import { useEffect, useRef, useState } from "react";

export type ProjectListItem = {
  title: string;
  /** categoría o servicio */
  meta?: string;
  year?: string;
  href?: string;
  /** imagen de la vista previa (URL o data URI) */
  image?: string;
  /** texto alternativo de la imagen (vacío = decorativa) */
  alt?: string;
};

export type ProjectListProps = {
  items: ProjectListItem[];
  /** muestra la numeración «01», «02»… */
  numbered?: boolean;
  /** suavizado del seguimiento de la vista previa: 1 = pegada al puntero */
  follow?: number;
  /** inclina la vista previa según la velocidad del puntero (grados máximos) */
  tilt?: number;
  /** etiqueta `data-cursor` que muestra `CustomCursor` sobre las filas (vacío = ninguna) */
  cursorLabel?: string;
  className?: string;
};

/**
 * Lista de proyectos en filas con título enorme. Al pasar el puntero, el resto de filas se atenúa y una imagen
 * sigue al cursor (con ligera inclinación según la velocidad). Con teclado, la vista previa se coloca en la fila
 * enfocada; en táctil no hay seguimiento y cada fila muestra su miniatura debajo del título.
 */
export default function ProjectList({ items, numbered = true, follow = 0.14, tilt = 8, cursorLabel = "Ver", className = "" }: ProjectListProps) {
  const [hot, setHot] = useState<number | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const peek = useRef<HTMLLIElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, vx: 0 });
  const raf = useRef(0);

  useEffect(() => {
    if (hot === null || !peek.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const p = pos.current;
    const el = peek.current;
    const loop = () => {
      const nx = p.x + (p.tx - p.x) * follow;
      const ny = p.y + (p.ty - p.y) * follow;
      p.vx += ((nx - p.x) - p.vx) * 0.2;
      p.x = nx;
      p.y = ny;
      const rot = Math.max(-tilt, Math.min(tilt, p.vx * 0.5));
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${rot}deg)`;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [hot !== null, follow, tilt]); // eslint-disable-line react-hooks/exhaustive-deps

  const place = (clientX: number, clientY: number, snap = false) => {
    const r = list.current?.getBoundingClientRect();
    if (!r) return;
    const p = pos.current;
    p.tx = clientX - r.left;
    p.ty = clientY - r.top;
    if (snap) {
      p.x = p.tx;
      p.y = p.ty;
    }
  };

  return (
    <ul
      ref={list}
      className={`ui-plist ${className}`.trim()}
      data-hot={hot !== null ? "" : undefined}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") place(e.clientX, e.clientY, hot === null);
      }}
      onPointerLeave={() => setHot(null)}
    >
      {items.map((it, i) => {
        const Tag = it.href ? "a" : "div";
        const props = it.href ? { href: it.href } : { tabIndex: 0 };
        return (
          <li key={i} className="ui-plist__row" data-hot={hot === i ? "" : undefined}>
            <Tag
              {...props}
              className="ui-plist__a"
              data-cursor={cursorLabel || undefined}
              onPointerEnter={(e: React.PointerEvent) => e.pointerType === "mouse" && setHot(i)}
              onFocus={(e: React.FocusEvent<HTMLElement>) => {
                const r = e.currentTarget.getBoundingClientRect();
                place(r.left + r.width * 0.7, r.top + r.height / 2, true);
                setHot(i);
              }}
              onBlur={() => setHot(null)}
            >
              {numbered ? <span className="ui-plist__n">{String(i + 1).padStart(2, "0")}</span> : <span />}
              <span className="ui-plist__t">{it.title}</span>
              <span className="ui-plist__m">{it.meta}</span>
              <span className="ui-plist__y">{it.year}</span>
              {it.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="ui-plist__thumb" src={it.image} alt={it.alt ?? ""} loading="lazy" />
              )}
            </Tag>
          </li>
        );
      })}
      <li ref={peek} className="ui-plist__peek" aria-hidden>
        {items.map((it, i) =>
          it.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} className="ui-plist__img" data-on={hot === i ? "" : undefined} src={it.image} alt="" />
          ) : null,
        )}
      </li>
    </ul>
  );
}
