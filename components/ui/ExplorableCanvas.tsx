"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { attachDragPan, type DragPan } from "@/lib/ui/dragPan";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import OptionPicker from "./OptionPicker";

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
 *
 * Se compone de piezas del kit: el arrastre es el de `DragGrid` (`lib/ui/dragPan.ts`) y el cambio «Mapa / Lista» es un
 * `OptionPicker`.
 */
export default function ExplorableCanvas({ markers, world = { w: 2600, h: 1700 }, background, height = "78vh", listToggle = true, hint = "Arrastra para explorar · pulsa un punto", className = "" }: ExplorableCanvasProps) {
  const view = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const pan = useRef<DragPan | null>(null);
  const [mode, setMode] = useState<"map" | "list">("map");
  const [open, setOpen] = useState<string | null>(null);
  const reduced = useReducedMotion();

  // el mundo nunca deja ver su borde: la vista se recorta a [ventana − mundo, 0]
  const limits = useCallback(() => {
    const v = view.current;
    return { minX: Math.min(0, (v?.clientWidth ?? 0) - world.w), minY: Math.min(0, (v?.clientHeight ?? 0) - world.h) };
  }, [world.w, world.h]);

  useEffect(() => {
    const v = view.current;
    if (mode !== "map" || !v) return;
    const b = limits();
    const p = attachDragPan(v, {
      apply: (x, y) => {
        if (layer.current) layer.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      },
      clamp: (x, y) => {
        const l = limits();
        return [clamp(x, l.minX, 0), clamp(y, l.minY, 0)];
      },
      inertia: 0.94,
      keyStep: 120,
      reduced,
      start: [b.minX / 2, b.minY / 2],
    });
    pan.current = p;
    const ro = new ResizeObserver(() => {
      const c = p.get();
      p.set(c.x, c.y);
    });
    ro.observe(v);
    return () => {
      ro.disconnect();
      p.destroy();
      pan.current = null;
    };
  }, [mode, limits, reduced]);

  const sel = markers.find((m) => m.id === open) ?? null;
  // centra el punto (un poco por encima del centro, para dejar sitio a la ficha)
  const pick = (m: MapMarker) => {
    setOpen(m.id);
    const v = view.current;
    if (v) pan.current?.to(v.clientWidth / 2 - (m.x / 100) * world.w, v.clientHeight * 0.42 - (m.y / 100) * world.h);
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
        <OptionPicker
          className="ui-xcan__tog"
          label="Forma de ver los proyectos"
          hideLabel
          showValue={false}
          options={[{ value: "map", label: "Mapa" }, { value: "list", label: "Lista" }]}
          value={mode}
          onChange={(v) => setMode(v as "map" | "list")}
        />
      )}
      {mode === "map" ? (
        <div
          ref={view}
          className="ui-xcan__view"
          tabIndex={0}
          role="group"
          aria-roledescription="mapa explorable"
          aria-label="Mapa de proyectos. Usa las flechas para desplazarlo y el tabulador para recorrer los puntos"
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
