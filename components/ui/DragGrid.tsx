"use client";

import { useEffect, useRef } from "react";

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
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cw = cellWidth + gap;
    const ch = cellWidth / ratio + gap;
    let cols = 0;
    let rows = 0;
    let tiles: { box: HTMLElement; img: HTMLImageElement; link: HTMLAnchorElement | null; idx: number }[] = [];
    let x = 0, y = 0, vx = 0, vy = 0;
    let dragging = false, captured = false, pid = 0, moved = 0, lastX = 0, lastY = 0, raf = 0, last = 0, drifting = drift > 0 && !reduced;

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

    const render = () => {
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

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      if (!dragging) {
        x += vx;
        y += vy;
        const k = Math.pow(inertia, dt * 60);
        vx *= k;
        vy *= k;
        if (drifting) x -= drift * dt;
      }
      render();
      const alive = dragging || Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05 || drifting;
      raf = alive ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      drifting = false;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      vx = vy = 0;
      pid = e.pointerId;
      captured = false;
      kick();
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      // se captura el puntero solo al empezar a arrastrar: capturarlo antes desviaría el clic de los enlaces de las celdas
      if (!captured && moved > 4) {
        captured = true;
        el.setPointerCapture(pid);
        el.setAttribute("data-drag", "");
      }
      x += dx;
      y += dy;
      vx = dx;
      vy = dy;
    };
    const up = () => {
      dragging = false;
      el.removeAttribute("data-drag");
      kick();
    };
    const click = (e: MouseEvent) => {
      // un arrastre no es un clic
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const wheelH = (e: WheelEvent) => {
      e.preventDefault();
      drifting = false;
      vx -= e.deltaX * 0.08;
      vy -= e.deltaY * 0.08;
      kick();
    };
    const keys = (e: KeyboardEvent) => {
      const s = 28;
      const m: Record<string, [number, number]> = { ArrowLeft: [s, 0], ArrowRight: [-s, 0], ArrowUp: [0, s], ArrowDown: [0, -s] };
      const d = m[e.key];
      if (!d) return;
      e.preventDefault();
      drifting = false;
      vx += d[0];
      vy += d[1];
      kick();
    };

    build();
    render();
    if (drifting) kick();
    const ro = new ResizeObserver(() => {
      build();
      render();
    });
    ro.observe(el);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    el.addEventListener("keydown", keys);
    if (wheel) el.addEventListener("wheel", wheelH, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
      el.removeEventListener("keydown", keys);
      el.removeEventListener("wheel", wheelH);
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
