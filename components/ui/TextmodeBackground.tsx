"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { sketches } from "@/lib/sketches/registry";
import { bridgePointer, type BackgroundInteraction, type BackgroundPosition } from "@/lib/ui/pointerBridge";
import type { Palette } from "./AsciiBackground";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

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
  /**
   * Tamaño de celda en px (alto de la fuente; la celda es unos 0,6× más ancha que alta). Admite decimales y baja hasta 1: más
   * pequeño = más detalle y más coste, así que con `maxCells` se agranda solo si la rejilla saldría demasiado grande.
   */
  fontSize?: number;
  /** Máximo de celdas de la rejilla (por defecto 250 000): protege de rejillas que congelarían la página en pantallas grandes. */
  maxCells?: number;
  /** cómo se reinterpretan los colores con los tokens del tema */
  palette?: Palette;
  /** 0–1: fuerza de la paleta */
  tintAmount?: number;
  /** fotogramas por segundo (1–60); cambiarlo recrea el lienzo */
  frameRate?: number;
  opacity?: number;
  /**
   * absolute (por defecto) = rellena su contenedor, que debe tener `position: relative` y tamaño · fixed = cubre la ventana entera
   * y se queda quieto al hacer scroll: el fondo de una página larga. Con `fixed`, pon el contenido encima con
   * `position: relative` (y `z-index: 10` si hace falta) y sin fondo opaco.
   */
  position?: BackgroundPosition;
  /**
   * canvas = el lienzo recibe el puntero él mismo: solo reacciona si nada se le pone encima · window = escucha el puntero en
   * toda la ventana y se lo reenvía al lienzo, así reacciona aunque haya contenido encima y nunca bloquea clics ni hover del
   * contenido. Por defecto `window` con `position="fixed"` y `canvas` en el resto.
   */
  interaction?: BackgroundInteraction;
  className?: string;
};

/**
 * Fondo generativo de textmode.js que rellena su contenedor (`position: relative` y con tamaño) o, con `position="fixed"`,
 * toda la ventana. Con `interaction="window"` (por defecto si es fixed) reacciona al puntero aunque haya contenido encima.
 * Cada celda es un carácter con color propio; el puntero interactúa con el sketch.
 * `palette` reinterpreta los colores con los tokens del tema (CSS), sin recrear el lienzo.
 * Al cambiar `sketch`, `fontSize` o `frameRate` se recrea.
 */
export default function TextmodeBackground({ sketch = "plasma", fontSize = 14, maxCells = 250000, palette = "tint", tintAmount = 0.6, frameRate: frameRateProp = 60, opacity = 1, position = "absolute", interaction, className = "" }: TextmodeBackgroundProps) {
  // con «reducir movimiento» el sketch sigue, pero a como mucho 8 fotogramas por segundo
  const reduced = useReducedMotion();
  const frameRate = reduced ? Math.min(frameRateProp, 8) : frameRateProp;
  const passive = (interaction ?? (position === "fixed" ? "window" : "canvas")) === "window";
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
    // textmode.js escucha el puntero en su lienzo: con `window` se le reenvía desde la ventana
    const unbridge = passive ? bridgePointer(canvas) : undefined;

    const create = async (w: number, h: number) => {
      const { textmode } = await import("textmode.js");
      if (disposed) return;
      // Con un canvas propio, textmode.js toma el tamaño del elemento
      canvas.width = w;
      canvas.height = h;
      // La celda pedida, salvo que la rejilla pase de `maxCells` (celda ≈ 0,6·fs de ancho × ~1,2·fs de alto)
      const fs = Math.max(1, fontSize, Math.sqrt((w * h) / (0.72 * Math.max(1000, maxCells))));
      const t = textmode.create({
        canvas,
        width: w,
        height: h,
        fontSize: fs,
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
      unbridge?.();
      instance?.destroy();
      canvas.remove();
    };
  }, [sketch, fontSize, frameRate, maxCells, passive]);

  return (
    <div className={`ui-fill ui-pal ui-pal--${palette} ${position === "fixed" ? "ui-fill--fixed" : ""} ${passive ? "ui-fill--passive" : ""} ${className}`} style={{ "--tint": tintAmount, "--op": opacity } as CSSProperties} aria-hidden>
      <div ref={host} className="ui-fill__media" />
      <i className="ui-pal__a" />
      <i className="ui-pal__b" />
    </div>
  );
}
