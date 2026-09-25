"use client";

import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, type PointerEvent as ReactPointerEvent, type ReactElement, type ReactNode } from "react";
import { vcls, type Variant } from "./variants";

export type TooltipProps = {
  /** texto disparador cuando no hay `children` (se subraya con puntos, como una abreviatura) */
  label?: string;
  content?: string;
  /** dónde queda el tooltip: sobre el disparador, o —con `follow`— respecto al puntero */
  side?: "top" | "right" | "bottom" | "left";
  /**
   * El tooltip flota junto al ratón y lo sigue con un poco de inercia, en vez de quedarse fijo sobre el disparador. Con
   * teclado (foco) y en pantallas táctiles se coloca sobre el disparador, como siempre. `false` = siempre fijo.
   */
  follow?: boolean;
  /**
   * Con `follow`: cómo se alinea el tooltip en el eje contrario a `side`. Con side top/bottom, `start` lo deja a la derecha del
   * puntero (su borde izquierdo en el puntero), `end` a la izquierda y `center` centrado; con side left/right, `start` lo
   * deja debajo del puntero, `end` encima y `center` centrado. Junto con `side` da las 12 posiciones alrededor del ratón.
   */
  align?: "start" | "center" | "end";
  /** Con `follow`: distancia entre el puntero y el tooltip, en px. */
  gap?: number;
  /** Con `follow`: desplazamiento extra en horizontal (positivo = a la derecha), en px, sumado a la posición de `side`/`align`. */
  offsetX?: number;
  /** Con `follow`: desplazamiento extra en vertical (positivo = hacia abajo), en px. */
  offsetY?: number;
  /** Con `follow`: 0 = pegado al puntero · 0.95 = muy lento y flotante. Sin inercia con `prefers-reduced-motion`. */
  inertia?: number;
  variant?: Variant;
  /** el disparador real: un botón, un icono, un enlace… Si es un único elemento, recibe `aria-describedby` */
  children?: ReactNode;
  className?: string;
};

/** Margen mínimo con el borde de la ventana, en px. */
const EDGE = 6;

/**
 * Texto de ayuda al posar el ratón o el foco.
 *
 * Por defecto (`follow`) flota junto al puntero: se coloca respecto a él según `side` y `align` (12 posiciones) más
 * `gap`, `offsetX` y `offsetY`, se da la vuelta si no cabe en la ventana y lo sigue con la `inertia` indicada (ninguna con
 * `prefers-reduced-motion`). El movimiento no pasa por React:
 * se escribe directamente en el `transform` del globo, así que mover el ratón no re-renderiza nada. Con `follow={false}`
 * el tooltip queda fijo sobre el disparador y funciona solo con CSS.
 *
 * Con `children`, el disparador es lo que envuelves y el foco lo pone ese elemento (no se añade una parada de
 * tabulador extra). Sin él, se pinta `label` como texto enfocable.
 */
export default function Tooltip({ label = "Pasa el ratón por aquí", content = "Esto es una pista contextual.", side = "top", follow = true, align = "center", gap = 16, offsetX = 0, offsetY = 0, inertia = 0.72, variant = "glass", children, className = "" }: TooltipProps) {
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const reduced = useRef(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const on = () => (reduced.current = mq.matches);
    mq.addEventListener("change", on);
    return () => {
      mq.removeEventListener("change", on);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  /**
   * Posición del globo (en coordenadas de ventana) para un puntero dado: `side` decide en qué lado del puntero cae, `align`
   * hacia dónde se extiende en el otro eje, `offsetX/Y` lo desplazan y, si no cabe en la ventana, se da la vuelta o se recorta.
   */
  const place = useCallback(
    (px: number, py: number) => {
      const el = bubble.current;
      const w = el?.offsetWidth ?? 0;
      const h = el?.offsetHeight ?? 0;
      const vw = innerWidth;
      const vh = innerHeight;
      // `start` = el borde inicial (izquierdo/superior) en el puntero; `end` = el borde final en el puntero
      const alongX = align === "start" ? px : align === "end" ? px - w : px - w / 2;
      const alongY = align === "start" ? py : align === "end" ? py - h : py - h / 2;
      let x: number;
      let y: number;
      if (side === "left" || side === "right") {
        x = side === "right" ? px + gap : px - w - gap;
        if (side === "right" && x + w + offsetX > vw - EDGE) x = px - w - gap;
        if (side === "left" && x + offsetX < EDGE) x = px + gap;
        y = alongY;
      } else {
        x = alongX;
        y = side === "bottom" ? py + gap : py - h - gap;
        if (side === "top" && y + offsetY < EDGE) y = py + gap;
        if (side === "bottom" && y + h + offsetY > vh - EDGE) y = py - h - gap;
      }
      x += offsetX;
      y += offsetY;
      return { x: Math.min(Math.max(x, EDGE), Math.max(EDGE, vw - w - EDGE)), y: Math.min(Math.max(y, EDGE), Math.max(EDGE, vh - h - EDGE)) };
    },
    [side, align, gap, offsetX, offsetY],
  );

  /** Escribe la posición actual en el globo, que es `absolute` dentro del disparador: se pasa de ventana a disparador. */
  const paint = useCallback(() => {
    const r = root.current?.getBoundingClientRect();
    const b = bubble.current;
    if (r && b) b.style.transform = `translate3d(${cur.current.x - r.left}px, ${cur.current.y - r.top}px, 0)`;
  }, []);

  const tick = useCallback(() => {
    const t = place(target.current.x, target.current.y);
    const k = reduced.current ? 1 : 1 - Math.min(0.95, Math.max(0, inertia));
    cur.current.x += (t.x - cur.current.x) * k;
    cur.current.y += (t.y - cur.current.y) * k;
    paint();
    raf.current = requestAnimationFrame(tick);
  }, [place, paint, inertia]);

  const enter = (e: ReactPointerEvent<HTMLSpanElement>) => {
    // Solo el ratón lo sigue: con dedo o lápiz, y con teclado, queda fijo sobre el disparador
    if (!follow || e.pointerType !== "mouse") return;
    target.current = { x: e.clientX, y: e.clientY };
    const t = place(e.clientX, e.clientY);
    cur.current = { ...t }; // nace ya junto al puntero, sin cruzar la pantalla desde una esquina
    root.current?.classList.add("is-cursor");
    paint();
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  };
  const move = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (e.pointerType === "mouse") target.current = { x: e.clientX, y: e.clientY };
  };
  const leave = () => {
    cancelAnimationFrame(raf.current);
    root.current?.classList.remove("is-cursor");
    if (bubble.current) bubble.current.style.transform = ""; // vuelve a mandar la posición fija (foco) del CSS
  };

  const wraps = children !== undefined && children !== null;
  const trigger = !wraps
    ? label
    : isValidElement(children)
      ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, { "aria-describedby": id })
      : children;
  return (
    <span
      ref={root}
      className={`ui-tip ui-tip--${side} ${follow ? "ui-tip--follow" : ""} ${wraps ? "ui-tip--wrap" : ""} ${className}`}
      tabIndex={wraps ? undefined : 0}
      aria-describedby={wraps ? undefined : id}
      onPointerEnter={follow ? enter : undefined}
      onPointerMove={follow ? move : undefined}
      onPointerLeave={follow ? leave : undefined}
    >
      {trigger}
      <span ref={bubble} id={id} role="tooltip" className={`ui-tip__bubble ui-surface ${vcls(variant)}`}>
        {content}
      </span>
    </span>
  );
}
