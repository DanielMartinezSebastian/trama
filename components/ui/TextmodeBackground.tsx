"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { sketches } from "@/lib/sketches/registry";
import type { Palette } from "./AsciiBackground";

/** Sketches generativos de textmode.js que no dependen del texto del usuario ni del scroll. */
export const TEXTMODE_SKETCHES = [
  { id: "plasma", label: "Plasma" },
  { id: "matrix", label: "Lluvia digital" },
  { id: "starfield", label: "Warp" },
  { id: "ripples", label: "Ondas de agua" },
  { id: "life", label: "Juego de la vida" },
  { id: "flow", label: "Campo de flujo" },
  { id: "fire", label: "Fuego" },
  { id: "ocean", label: "Atardecer en el mar" },
  { id: "tunnel", label: "Túnel" },
  { id: "aurora", label: "Aurora" },
] as const;

export type TextmodeBackgroundProps = {
  sketch?: (typeof TEXTMODE_SKETCHES)[number]["id"];
  /** tamaño de celda en px */
  fontSize?: number;
  /** cómo se reinterpretan los colores con los tokens del tema */
  palette?: Palette;
  /** 0–1: fuerza de la paleta */
  tintAmount?: number;
  frameRate?: number;
  opacity?: number;
  className?: string;
};

/**
 * Fondo generativo de textmode.js que rellena su contenedor (`position: relative` y con tamaño).
 * Cada celda es un carácter con color propio; el puntero interactúa con el sketch.
 * `palette` reinterpreta los colores con los tokens del tema (CSS), sin recrear el lienzo.
 * Al cambiar `sketch`, `fontSize` o `frameRate` se recrea.
 */
export default function TextmodeBackground({ sketch = "plasma", fontSize = 14, palette = "tint", tintAmount = 0.6, frameRate = 60, opacity = 1, className = "" }: TextmodeBackgroundProps) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    const def = sketches[sketch];
    if (!el || !def) return;
    let disposed = false;
    let instance: { destroy: () => void; resizeCanvas: (w: number, h: number) => void } | null = null;
    const canvas = document.createElement("canvas");
    canvas.className = "ui-fill-canvas";
    el.appendChild(canvas);

    const create = async (w: number, h: number) => {
      const { textmode } = await import("textmode.js");
      if (disposed) return;
      // Con un canvas propio, textmode.js toma el tamaño del elemento
      canvas.width = w;
      canvas.height = h;
      const t = textmode.create({
        canvas,
        width: w,
        height: h,
        fontSize,
        frameRate,
        pixelDensity: Math.min(window.devicePixelRatio || 1, 2),
      });
      instance = t;
      def.setup(t);
    };

    const handleSize = (w: number, h: number) => {
      if (w < 4 || h < 4) return;
      if (!instance) void create(w, h);
      else instance.resizeCanvas(w, h);
    };

    // Medimos ya mismo, sin esperar al primer aviso del ResizeObserver: si este componente se
    // monta dentro de un contenedor `position: fixed` (p. ej. un fondo que se intercambia al
    // hacer scroll), su primer disparo puede llegar con un tamaño todavía sin asentar y, como
    // luego el elemento no vuelve a cambiar de tamaño, el lienzo se queda para siempre en el
    // 300×150 por defecto de <canvas> — negro a efectos prácticos. Medir el rect real aquí
    // cubre ese caso sin afectar al camino normal (el ResizeObserver sigue llevando los cambios
    // posteriores).
    const initial = el.getBoundingClientRect();
    handleSize(Math.round(initial.width), Math.round(initial.height));

    const ro = new ResizeObserver(([entry]) => {
      handleSize(Math.round(entry.contentRect.width), Math.round(entry.contentRect.height));
    });
    ro.observe(el);

    return () => {
      disposed = true;
      ro.disconnect();
      instance?.destroy();
      canvas.remove();
    };
  }, [sketch, fontSize, frameRate]);

  return (
    <div className={`ui-fill ui-pal ui-pal--${palette} ${className}`} style={{ "--tint": tintAmount, "--op": opacity } as CSSProperties} aria-hidden>
      <div ref={host} className="ui-fill__media" />
      <i className="ui-pal__a" />
      <i className="ui-pal__b" />
    </div>
  );
}
