"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

export type MapMarker = {
  id: string;
  /** posición en el mundo, en % (0–100) */
  x: number;
  y: number;
  title: string;
  meta?: string;
  text?: string;
  image?: string;
  alt?: string;
  href?: string;
  /** color del punto (CSS); por defecto el acento */
  color?: string;
};

export type ExplorableCanvasProps = {
  markers: MapMarker[];
  /** tamaño del mundo en px; más grande que la ventana para que haya algo que explorar */
  world?: { w: number; h: number };
  /** capa de fondo (SVG, imagen, WebGL…) que ocupa todo el mundo */
  background?: ReactNode;
  /** alto de la ventana (CSS) */
  height?: string;
  /** muestra los botones «Mapa / Lista» (la lista es la alternativa accesible) */
  listToggle?: boolean;
  /** textos */
  hint?: string;
  className?: string;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Lienzo explorable por arrastre (Overworld Audio): un mundo más grande que la ventana con puntos clicables. Se arrastra con
 * ratón o dedo (con inercia), con las flechas del teclado, y cada punto es un botón que centra la vista y abre su ficha. Incluye
 * **vista de lista** como alternativa (accesible, sin gestos) y el hint de uso. Sin inercia ni animaciones con
 * `prefers-reduced-motion`. En móvil el lienzo captura el gesto: la lista es la salida para quien prefiera hacer scroll.
 */
export default function ExplorableCanvas({ markers, world = { w: 2600, h: 1700 }, background, height = "78vh", listToggle = true, hint = "Arrastra para explorar · pulsa un punto", className = "" }: ExplorableCanvasProps) {
  const view = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const drag = useRef<{ id: number; sx: number; sy: number; px: number; py: number; moved: boolean; lx: number; ly: number } | null>(null);
  const raf = useRef(0);
  const [mode, setMode] = useState<"map" | "list">("map");
  const [open, setOpen] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const bounds = useCallback(() => {
    const v = view.current;
    return { minX: Math.min(0, (v?.clientWidth ?? 0) - world.w), minY: Math.min(0, (v?.clientHeight ?? 0) - world.h) };
  }, [world.w, world.h]);

  const paint = useCallback(() => {
    if (layer.current) layer.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
  }, []);

  const place = useCallback(
    (x: number, y: number) => {
      const b = bounds();
      pos.current.x = clamp(x, b.minX, 0);
      pos.current.y = clamp(y, b.minY, 0);
      paint();
    },
    [bounds, paint],
  );

  const glide = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const step = () => {
      const p = pos.current;
      p.vx *= 0.94;
      p.vy *= 0.94;
      place(p.x + p.vx, p.y + p.vy);
      if (Math.abs(p.vx) > 0.2 || Math.abs(p.vy) > 0.2) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [place]);

  /** centra un punto con una animación corta */
  const centerOn = useCallback(
    (m: MapMarker) => {
      const v = view.current;
      if (!v) return;
      const b = bounds();
      const tx = clamp(v.clientWidth / 2 - (m.x / 100) * world.w, b.minX, 0);
      const ty = clamp(v.clientHeight * 0.42 - (m.y / 100) * world.h, b.minY, 0);
      cancelAnimationFrame(raf.current);
      if (reduced) return place(tx, ty);
      const sx = pos.current.x;
      const sy = pos.current.y;
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 700);
        const e = 1 - Math.pow(1 - k, 3);
        place(sx + (tx - sx) * e, sy + (ty - sy) * e);
        if (k < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    },
    [bounds, place, reduced, world.w, world.h],
  );

  // empieza centrado y se recoloca al redimensionar
  useEffect(() => {
    if (mode !== "map") return;
    const v = view.current;
    if (!v) return;
    const b = bounds();
    place(b.minX / 2, b.minY / 2);
    const ro = new ResizeObserver(() => place(pos.current.x, pos.current.y));
    ro.observe(v);
    return () => ro.disconnect();
  }, [mode, bounds, place]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    cancelAnimationFrame(raf.current);
    drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, px: pos.current.x, py: pos.current.y, moved: false, lx: e.clientX, ly: e.clientY };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) > 5) {
      d.moved = true;
      view.current?.setPointerCapture(e.pointerId);
      view.current?.setAttribute("data-drag", "");
    }
    if (!d.moved) return;
    pos.current.vx = e.clientX - d.lx;
    pos.current.vy = e.clientY - d.ly;
    d.lx = e.clientX;
    d.ly = e.clientY;
    place(d.px + dx, d.py + dy);
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    view.current?.removeAttribute("data-drag");
    if (d.moved && !reduced) glide();
  };
  // un arrastre no debe contar como clic sobre un punto
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current?.moved) e.stopPropagation();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.target !== view.current) return;
    const s = e.shiftKey ? 240 : 80;
    const d: Record<string, [number, number]> = { ArrowLeft: [s, 0], ArrowRight: [-s, 0], ArrowUp: [0, s], ArrowDown: [0, -s] };
    const v = d[e.key];
    if (!v) return;
    e.preventDefault();
    place(pos.current.x + v[0], pos.current.y + v[1]);
  };

  const sel = markers.find((m) => m.id === open) ?? null;
  const pick = (m: MapMarker) => {
    setOpen(m.id);
    centerOn(m);
  };

  const card = sel && (
    <div className="ui-xcan__card" role="region" aria-label={`Ficha: ${sel.title}`}>
      {sel.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={sel.image} alt={sel.alt ?? ""} />
      )}
      <div>
        {sel.meta && <small>{sel.meta}</small>}
        <b>{sel.title}</b>
        {sel.text && <p>{sel.text}</p>}
        {sel.href && <a href={sel.href}>Ver proyecto →</a>}
      </div>
      <button type="button" className="ui-xcan__x" aria-label="Cerrar ficha" onClick={() => setOpen(null)}>×</button>
    </div>
  );

  return (
    <div className={`ui-xcan ${className}`.trim()} style={{ "--xc-h": height } as CSSProperties}>
      {listToggle && (
        <div className="ui-xcan__tog" role="group" aria-label="Forma de ver los proyectos">
          <button type="button" aria-pressed={mode === "map"} onClick={() => setMode("map")}>Mapa</button>
          <button type="button" aria-pressed={mode === "list"} onClick={() => setMode("list")}>Lista</button>
        </div>
      )}
      {mode === "map" ? (
        <div
          ref={view}
          className="ui-xcan__view"
          tabIndex={0}
          role="group"
          aria-roledescription="mapa explorable"
          aria-label="Mapa de proyectos. Usa las flechas para desplazarlo y el tabulador para recorrer los puntos"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onClickCapture={onClickCapture}
          onKeyDown={onKey}
        >
          <div ref={layer} className="ui-xcan__world" style={{ width: world.w, height: world.h }}>
            {background}
            {markers.map((m) => (
              <button
                key={m.id}
                type="button"
                className="ui-xcan__pt"
                data-on={m.id === open ? "" : undefined}
                aria-expanded={m.id === open}
                style={{ left: `${m.x}%`, top: `${m.y}%`, "--pt": m.color } as CSSProperties}
                onClick={() => pick(m)}
              >
                <i aria-hidden />
                <span>{m.title}</span>
              </button>
            ))}
          </div>
          <p className="ui-xcan__hint" aria-hidden>{hint}</p>
          {card}
        </div>
      ) : (
        <ul className="ui-xcan__list">
          {markers.map((m) => (
            <li key={m.id}>
              <a href={m.href ?? "#"}>
                <b>{m.title}</b>
                {m.meta && <small>{m.meta}</small>}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
