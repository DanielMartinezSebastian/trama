"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { tcls, vcls, type Tone, type Variant } from "./variants";

export type ScrollProgressProps = {
  /** borde o esquina donde se ancla · inline = dentro del flujo, donde lo pongas (cabecera, tarjeta, lateral de un artículo) */
  placement?: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "inline";
  /** fixed (por defecto) = anclado a la ventana · absolute = a su contenedor con `position: relative` (no aplica a inline) */
  position?: "fixed" | "absolute";
  /** qué scroll mide: window = la página · parent = el ancestro con scroll más cercano · o un selector CSS ("#articulo") */
  target?: string;
  /** bar = barra continua · segments = por tramos · dots = puntos · ascii = caracteres [####----] · ring = anillo */
  kind?: "bar" | "segments" | "dots" | "ascii" | "ring";
  variant?: Variant;
  /** qué token de color usa el relleno */
  tone?: Tone;
  /** grosor de la barra (o tamaño del anillo) */
  size?: "sm" | "md" | "lg";
  /** número de tramos (segments, dots) o de caracteres (ascii) */
  steps?: number;
  /** caracteres del modo ascii: lleno y vacío ("" = los de la variante) */
  chars?: string;
  /** muestra el porcentaje */
  showValue?: boolean;
  /** suaviza el avance (se desactiva con prefers-reduced-motion) */
  smooth?: boolean;
  /** nombre para lectores de pantalla */
  label?: string;
  className?: string;
};

/** caracteres ascii por variante cuando `chars` está vacío: [lleno, vacío] */
const ASCII_CHARS: Partial<Record<Variant, string>> = { terminal: "#-", retro: "█░", dotmatrix: "●·", neon: "▰▱", minimal: "━─" };

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** El contenedor con scroll más cercano (o la página si no hay ninguno). */
function scrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let a = el?.parentElement; a; a = a.parentElement) {
    const o = getComputedStyle(a).overflowY;
    if ((o === "auto" || o === "scroll" || o === "overlay") && a.scrollHeight > a.clientHeight) return a;
  }
  return null;
}

/**
 * Barra de progreso del scroll: cuánto se ha leído de la página o de cualquier contenedor con scroll. Se ancla a un borde o
 * esquina de la ventana (o de su contenedor) o va en el flujo (`inline`), en cinco formas. Todo el aspecto sale de la
 * variante (--s-*) y de los tokens del tema. El avance se escribe como `--p` (0–1) en un rAF, sin re-renderizar React.
 */
export default function ScrollProgress({
  placement = "top",
  position = "fixed",
  target = "window",
  kind = "bar",
  variant = "minimal",
  tone = "acc",
  size = "md",
  steps = 24,
  chars = "",
  showValue = false,
  smooth = true,
  label = "Progreso de lectura",
  className = "",
}: ScrollProgressProps) {
  const root = useRef<HTMLDivElement>(null);
  const asciiRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  const n = Math.max(2, Math.round(steps));
  const [on, off] = Array.from(chars.length >= 2 ? chars : (ASCII_CHARS[variant] ?? "#-"));

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const src: HTMLElement | Window | null =
      target === "window" ? window : target === "parent" ? (scrollParent(el) ?? window) : (document.querySelector<HTMLElement>(target) ?? null);
    if (!src) return;

    const read = () => {
      if (src === window) {
        const d = document.documentElement;
        const max = d.scrollHeight - innerHeight;
        return max > 0 ? scrollY / max : 0;
      }
      const s = src as HTMLElement;
      const max = s.scrollHeight - s.clientHeight;
      return max > 0 ? s.scrollTop / max : 0;
    };

    let shown = read();
    let raf = 0;
    let lastPct = -1;
    const paint = (p: number) => {
      // segments y dots avanzan tramo a tramo; el resto, continuo
      const q = kind === "segments" || kind === "dots" ? Math.floor(p * n + 1e-6) / n : p;
      el.style.setProperty("--p", q.toFixed(4));
      const pct = Math.round(p * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        el.setAttribute("aria-valuenow", String(pct));
        if (valueRef.current) valueRef.current.textContent = `${pct}%`;
        if (asciiRef.current) {
          const k = Math.round(p * n);
          asciiRef.current.textContent = on.repeat(k) + off.repeat(n - k);
        }
      }
    };
    const tick = () => {
      const goal = clamp01(read());
      shown = smooth && !reduced ? shown + (goal - shown) * 0.22 : goal;
      if (Math.abs(goal - shown) < 0.0005) shown = goal;
      paint(shown);
      raf = shown === goal ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      // sin suavizado (o con la página oculta, donde no hay fotogramas) no hay nada que animar: se pinta en el mismo evento
      if (!smooth || reduced || document.hidden) {
        shown = clamp01(read());
        paint(shown);
      } else if (!raf) raf = requestAnimationFrame(tick);
    };

    paint(clamp01(shown));
    src.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    // el contenido puede crecer después (imágenes, secciones que se cargan): se recalcula
    const ro = new ResizeObserver(wake);
    ro.observe(src === window ? document.body : (src as HTMLElement));
    return () => {
      cancelAnimationFrame(raf);
      src.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      ro.disconnect();
    };
  }, [target, kind, n, on, off, smooth]);

  const vertical = placement === "left" || placement === "right";
  const cls = [
    "ui-sprog",
    `ui-sprog--${kind}`,
    `ui-sprog--${placement}`,
    `ui-sprog--${size}`,
    placement !== "inline" && `ui-sprog--${position}`,
    vertical && "ui-sprog--vertical",
    vcls(variant),
    tcls(tone),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={root}
      className={cls}
      style={{ "--p": 0, "--steps": n } as CSSProperties}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      {kind === "ring" ? (
        <svg className="ui-sprog__ring" viewBox="0 0 36 36" aria-hidden>
          <circle className="ui-sprog__ring-track" cx="18" cy="18" r="15.5" pathLength={100} />
          <circle className="ui-sprog__ring-fill" cx="18" cy="18" r="15.5" pathLength={100} />
        </svg>
      ) : kind === "ascii" ? (
        <span className="ui-sprog__ascii" aria-hidden>
          <span ref={asciiRef}>{off.repeat(n)}</span>
        </span>
      ) : (
        <span className="ui-sprog__track" aria-hidden>
          <span className="ui-sprog__fill" />
        </span>
      )}
      {showValue && (
        <span ref={valueRef} className="ui-sprog__value" aria-hidden>
          0%
        </span>
      )}
    </div>
  );
}
