"use client";

import { useEffect, useRef } from "react";
import { attachDragPan } from "@/lib/ui/dragPan";
import { prefersReducedMotion } from "@/lib/ui/useReducedMotion";

export type DragGridItem = {
  src: string;
  /** texto de la imagen y del enlace para el lector de pantalla */
  alt?: string;
  href?: string;
};

export type DragGridProps = {
  items: DragGridItem[];
  /** ancho de cada celda (px) */
  cellWidth?: number;
  /** relación «ancho / alto» de cada celda */
  ratio?: number;
  /** espacio entre celdas (px) */
  gap?: number;
  /** alto del visor (CSS: `70vh`, `560px`…) */
  height?: string;
  /** inercia al soltar: 0,8 = frena rápido · 0,97 = desliza mucho */
  inertia?: number;
  /** deriva lenta automática (px por segundo, 0 = quieta). Se detiene al tocar y con `prefers-reduced-motion` */
  drift?: number;
  /** la rueda del ratón también desplaza la rejilla (ojo: captura el scroll de la página mientras el puntero está encima) */
  wheel?: boolean;
  /** etiqueta accesible del visor */
  label?: string;
  className?: string;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;
// elige imagen para cada celda del mundo con un hash de sus coordenadas: reparto irregular, estable y sin estado
const pick = (cx: number, cy: number, n: number) => mod(Math.imul(cx, 73856093) ^ Math.imul(cy, 19349663), n);

/**
 * Rejilla infinita que se arrastra en cualquier dirección con inercia. No hay una lista de miles de nodos: un grupo
 * fijo de celdas se recoloca en cada fotograma envolviéndose por los bordes, y cada celda cambia de imagen según su
 * coordenada. Funciona con ratón, táctil y teclado (flechas). Un arrastre no dispara el clic del enlace de la celda.
 * El arrastre con inercia es el mismo que el de `ExplorableCanvas` (`lib/ui/dragPan.ts`).
 *
 * Accesibilidad: el visor es una región con etiqueta; las celdas son decorativas (`aria-hidden`) y, para el lector de
 * pantalla, hay una lista oculta con cada elemento una sola vez. En táctil captura el gesto dentro del visor
 * (`touch-action: none`): dale un alto razonable para que se pueda seguir desplazando la página.
 */
export default function DragGrid({ items, cellWidth = 260, ratio = 0.8, gap = 14, height = "70vh", inertia = 0.93, drift = 0, wheel = false, label = "Galería de imágenes: arrastra para explorar", className = "" }: DragGridProps) {
  const view = useRef<HTMLDivElement>(null);
  const pool = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = view.current;
    const host = pool.current;
    if (!el || !host || items.length === 0) return;
    const reduced = prefersReducedMotion();
    const cw = cellWidth + gap;
    const ch = cellWidth / ratio + gap;
    let cols = 0;
    let rows = 0;
    let tiles: { box: HTMLElement; img: HTMLImageElement; link: HTMLAnchorElement | null; idx: number }[] = [];

    const build = () => {
      host.textContent = "";
      cols = Math.ceil(el.clientWidth / cw) + 2;
      rows = Math.ceil(el.clientHeight / ch) + 2;
      tiles = Array.from({ length: cols * rows }, () => {
        const box = document.createElement("div");
        box.className = "ui-dgrid__cell";
        box.style.cssText = `width:${cellWidth}px;height:${cellWidth / ratio}px`;
        const a = document.createElement("a");
        a.className = "ui-dgrid__a";
        a.tabIndex = -1;
        a.setAttribute("aria-hidden", "true");
        a.draggable = false;
        const img = document.createElement("img");
        img.draggable = false;
        img.alt = "";
        img.decoding = "async";
        a.appendChild(img);
        box.appendChild(a);
        host.appendChild(box);
        return { box, img, link: a, idx: -1 };
      });
    };

    const render = (x: number, y: number) => {
      const W = cols * cw;
      const H = rows * ch;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const t = tiles[r * cols + c];
          const rx = c * cw + x;
          const ry = r * ch + y;
          const kx = Math.floor(rx / W);
          const ky = Math.floor(ry / H);
          const px = rx - kx * W - cw;
          const py = ry - ky * H - ch;
          t.box.style.transform = `translate3d(${px}px, ${py}px, 0)`;
          const idx = pick(c - kx * cols, r - ky * rows, items.length);
          if (idx !== t.idx) {
            t.idx = idx;
            const it = items[idx];
            t.img.src = it.src;
            if (it.href) t.link!.href = it.href;
            else t.link!.removeAttribute("href");
          }
        }
      }
    };

    build();
    // reduced: sin inercia ni deriva (lo resuelve attachDragPan)
    const pan = attachDragPan(el, { apply: render, inertia, drift, wheel, keyStep: 160, reduced });
    const ro = new ResizeObserver(() => {
      build();
      const p = pan.get();
      render(p.x, p.y);
    });
    ro.observe(el);
    return () => {
      pan.destroy();
      ro.disconnect();
    };
  }, [items, cellWidth, ratio, gap, inertia, drift, wheel]);

  return (
    <div ref={view} className={`ui-dgrid ${className}`.trim()} style={{ height }} role="region" aria-label={label} tabIndex={0}>
      <div ref={pool} className="ui-dgrid__pool" aria-hidden />
      <ul className="ui-sr">
        {items.map((it, i) => (
          <li key={i}>{it.href ? <a href={it.href}>{it.alt || it.href}</a> : it.alt}</li>
        ))}
      </ul>
    </div>
  );
}
