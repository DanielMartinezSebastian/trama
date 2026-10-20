"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { vcls, type Variant } from "./variants";

export type BeforeAfterProps = {
  /** lo de antes: una imagen (`<img>`), un vídeo o cualquier contenido; ocupa toda la caja */
  before: ReactNode;
  /** lo de después, encima; el deslizador lo recorta */
  after: ReactNode;
  /** rótulos de cada lado ("" para ocultarlos) */
  beforeLabel?: string;
  afterLabel?: string;
  /** posición inicial del corte, 0–100 (% de lo de después que se ve desde la izquierda o desde arriba) */
  initial?: number;
  /** horizontal = el corte es vertical y se mueve a izquierda y derecha · vertical = se mueve arriba y abajo */
  orientation?: "horizontal" | "vertical";
  /** slider = arrastrar el corte · toggle = un botón alterna entre los dos (día/noche, apagado/encendido) */
  mode?: "slider" | "toggle";
  /** proporción de la caja (ancho / alto) */
  ratio?: number;
  /** nombre accesible del control ("Comparar antes y después") */
  label?: string;
  variant?: Variant;
  className?: string;
};

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/**
 * Antes / después con control del usuario (docs/11 §5, docs/15 §3): un corte que se arrastra (`role="slider"`, teclado con
 * flechas, Inicio y Fin) o un botón que alterna. Para limpiezas, reformas, tratamientos, día/noche. Regla de honestidad
 * (docs/18 §5): las dos imágenes con la misma luz y el mismo encuadre; el componente no añade filtros a ninguna.
 */
export default function BeforeAfter({ before, after, beforeLabel = "Antes", afterLabel = "Después", initial = 50, orientation = "horizontal", mode = "slider", ratio = 4 / 3, label = "Comparar antes y después", variant = "minimal", className = "" }: BeforeAfterProps) {
  const [pos, setPos] = useState(clamp(initial));
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const horiz = orientation === "horizontal";

  const fromPointer = (e: RPointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(clamp(horiz ? ((e.clientX - r.left) / r.width) * 100 : ((e.clientY - r.top) / r.height) * 100));
  };
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5;
    const map: Record<string, number> = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step, PageDown: -20, PageUp: 20 };
    if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else if (e.key in map) setPos((p) => clamp(p + map[e.key]));
    else return;
    e.preventDefault();
  };

  const shown = mode === "toggle" ? (pos >= 50 ? 100 : 0) : pos;
  return (
    <div className={`ui-ba ui-ba--${orientation} ui-ba--${mode} ${vcls(variant)} ${className}`.trim()} style={{ "--ba-p": `${shown}%`, "--ba-ratio": ratio } as CSSProperties}>
      <div
        ref={box}
        className="ui-ba__box"
        onPointerDown={(e) => {
          if (mode !== "slider") return;
          drag.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => drag.current && fromPointer(e)}
        onPointerUp={() => (drag.current = false)}
        onPointerCancel={() => (drag.current = false)}
      >
        <div className="ui-ba__pane ui-ba__pane--before">{before}</div>
        <div className="ui-ba__pane ui-ba__pane--after" aria-hidden={shown === 0 || undefined}>{after}</div>
        {beforeLabel && <span className="ui-ba__tag ui-ba__tag--before">{beforeLabel}</span>}
        {afterLabel && <span className="ui-ba__tag ui-ba__tag--after">{afterLabel}</span>}
        {mode === "slider" && (
          <div
            className="ui-ba__handle"
            role="slider"
            tabIndex={0}
            aria-label={label}
            aria-orientation={horiz ? "horizontal" : "vertical"}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={`${Math.round(pos)} % ${afterLabel || "después"}`}
            onKeyDown={onKey}
          >
            <span aria-hidden />
          </div>
        )}
      </div>
      {mode === "toggle" && (
        <button type="button" className="ui-ba__toggle" aria-pressed={pos >= 50} onClick={() => setPos((p) => (p >= 50 ? 0 : 100))}>
          {pos >= 50 ? `Ver ${beforeLabel.toLowerCase() || "antes"}` : `Ver ${afterLabel.toLowerCase() || "después"}`}
        </button>
      )}
    </div>
  );
}
