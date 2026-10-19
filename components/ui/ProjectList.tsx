"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

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

export const PROJECT_VIEWS = ["list", "grid", "index"] as const;
export type ProjectView = (typeof PROJECT_VIEWS)[number];

export type ProjectListProps = {
  items: ProjectListItem[];
  /** list = filas con título enorme · grid = cuadrícula de imágenes · index = índice de texto denso. Al cambiar, cada
   * elemento viaja a su nueva posición (GSAP Flip). El selector lo pone quien lo usa (p. ej. un `OptionPicker`) */
  view?: ProjectView;
  /** vista previa al pasar el puntero (en list e index): `follow` = imagen propia que sigue al puntero · `cursor` = la
   * pinta `CustomCursor` (debe estar en la página) · `none` = sin vista previa */
  preview?: "follow" | "cursor" | "none";
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
 * Colección de proyectos en tres vistas. En **list** (filas con título enorme) e **index** (texto denso), al pasar el puntero el
 * resto de filas se atenúa y aparece la imagen del proyecto: propia (`preview="follow"`, con inclinación según la velocidad)
 * o dentro del cursor de la página (`preview="cursor"`, compuesta con `CustomCursor`). En **grid** las imágenes se ven siempre.
 * Con teclado, la vista previa se coloca en la fila enfocada; en táctil no hay seguimiento y cada fila muestra su miniatura.
 * Cambiar `view` anima el paso con GSAP Flip, salvo con `prefers-reduced-motion`.
 */
export default function ProjectList({ items, view = "list", preview = "follow", numbered = true, follow = 0.14, tilt = 8, cursorLabel = "Ver", className = "" }: ProjectListProps) {
  const [hot, setHot] = useState<number | null>(null);
  const [shown, setShown] = useState<ProjectView>(view);
  const list = useRef<HTMLUListElement>(null);
  const peek = useRef<HTMLLIElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, vx: 0 });
  const raf = useRef(0);
  const flip = useRef<unknown>(null);
  const reduced = useReducedMotion();
  const peeking = shown !== "grid" && preview === "follow";

  // cambio de vista: se guarda dónde estaba cada pieza antes de pintar la nueva y luego viajan (Flip)
  useEffect(() => {
    if (view === shown) return;
    if (reduced || !list.current) return setShown(view);
    let live = true;
    Promise.all([import("gsap"), import("gsap/Flip")]).then(([{ gsap }, { Flip }]) => {
      if (!live || !list.current) return;
      gsap.registerPlugin(Flip);
      flip.current = Flip.getState(list.current.querySelectorAll("[data-flip]"));
      setHot(null);
      setShown(view);
    });
    return () => {
      live = false;
    };
  }, [view, shown, reduced]);

  useLayoutEffect(() => {
    const st = flip.current;
    if (!st) return;
    flip.current = null;
    import("gsap/Flip").then(({ Flip }) => {
      Flip.from(st as never, { duration: 0.7, ease: "power3.inOut", stagger: 0.02, nested: true, onEnter: (els) => els.forEach((e) => ((e as HTMLElement).style.opacity = "1")) });
    });
  }, [shown]);

  useEffect(() => {
    if (hot === null || !peek.current || reduced) return;
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
  }, [hot !== null, follow, tilt, reduced]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const dims = shown !== "grid" && preview !== "none";
  return (
    <ul
      ref={list}
      className={`ui-plist ui-plist--${shown} ${className}`.trim()}
      data-hot={dims && hot !== null ? "" : undefined}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") place(e.clientX, e.clientY, hot === null);
      }}
      onPointerLeave={() => setHot(null)}
    >
      {items.map((it, i) => {
        const Tag = it.href ? "a" : "div";
        const props = it.href ? { href: it.href } : { tabIndex: 0 };
        const img = preview === "cursor" && shown !== "grid" ? it.image : undefined;
        return (
          <li key={i} className="ui-plist__row" data-hot={dims && hot === i ? "" : undefined}>
            <Tag
              {...props}
              className="ui-plist__a"
              data-cursor={cursorLabel || undefined}
              data-cursor-img={img}
              onPointerEnter={(e: React.PointerEvent) => e.pointerType === "mouse" && setHot(i)}
              onFocus={(e: React.FocusEvent<HTMLElement>) => {
                const r = e.currentTarget.getBoundingClientRect();
                place(r.left + r.width * 0.7, r.top + r.height / 2, true);
                setHot(i);
              }}
              onBlur={() => setHot(null)}
            >
              {numbered ? <span data-flip={`n${i}`} className="ui-plist__n">{String(i + 1).padStart(2, "0")}</span> : <span />}
              <span data-flip={`t${i}`} className="ui-plist__t">{it.title}</span>
              <span data-flip={`m${i}`} className="ui-plist__m">{it.meta}</span>
              <span data-flip={`y${i}`} className="ui-plist__y">{it.year}</span>
              {it.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img data-flip={`i${i}`} className="ui-plist__thumb" src={it.image} alt={it.alt ?? ""} loading="lazy" />
              )}
            </Tag>
          </li>
        );
      })}
      {peeking && (
        <li ref={peek} className="ui-plist__peek" aria-hidden>
          {items.map((it, i) =>
            it.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} className="ui-plist__img" data-on={hot === i ? "" : undefined} src={it.image} alt="" />
            ) : null,
          )}
        </li>
      )}
    </ul>
  );
}
