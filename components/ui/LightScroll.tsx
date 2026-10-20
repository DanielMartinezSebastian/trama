"use client";

import { createContext, createElement, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type MutableRefObject, type ReactNode } from "react";
import { cueSettled, kelvinToRgb, lerpCue, light, type LightCue, type LightPresetName } from "@/lib/ui/light";

export type LightScrollProps = {
  /** tomas de luz por nombre (un preset de `LIGHT_PRESETS` o una toma completa); cada sección hija elige la suya con `data-light="nombre"` */
  cues: Record<string, LightCue | LightPresetName>;
  /** la de partida (por defecto, la primera de `cues`) */
  initial?: string;
  /** fuerza una toma e ignora el scroll (p. ej. el paso de un configurador o un conmutador «luz de día / cálida») */
  cue?: string;
  /** segundos aproximados que tarda la luz en pasar de una toma a otra */
  duration?: number;
  /** fixed = la luz es de la ventana (detrás de toda la página) · absolute = solo detrás de este contenedor */
  position?: "fixed" | "absolute";
  as?: "div" | "main" | "section" | "article";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export type LightState = {
  /** la toma tal como está en este fotograma (interpolada); léela en un bucle de render, no en el árbol de React */
  live: MutableRefObject<LightCue>;
  /** nombre de la toma activa (cambia cuando cambia la sección o `cue`) */
  name: string;
  /** la toma a la que va la luz */
  target: LightCue;
};

const LightCtx = createContext<LightState | null>(null);

/** La luz del `LightScroll` más cercano (para sincronizar una escena 3D o un rótulo «luz de día · 6500 K»). Null fuera de uno. */
export const useLight = () => useContext(LightCtx);

const GLINTS = 7;

/**
 * Contenedor con una luz que cambia según la **finalidad** de la sección que cruza el centro de la ventana: foco con destellos
 * para emocionar, luz de día difusa para comparar con honestidad, rasante para leer un grabado, lámpara cálida para una
 * conversación (docs/18). Pinta la luz detrás del contenido con degradados CSS (sin lienzo) y publica la toma interpolada en
 * variables (`--light-rgb`, `--light-x`, `--light-y`, `--light-i`, `--light-amb`…) y en `useLight()`, para que una escena 3D o
 * una foto se iluminen igual. Con «reducir movimiento», la luz cambia sin fundido, no sigue al puntero y no hay destellos.
 * El contenido no depende de la luz: el texto mantiene su contraste en todas las tomas (la luz va detrás y es tenue).
 */
export default function LightScroll({ cues, initial, cue, duration = 0.9, position = "fixed", as = "div", className = "", style, children }: LightScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const names = Object.keys(cues);
  const first = initial ?? names[0];
  const [scrolled, setScrolled] = useState(first);
  const name = cue && cues[cue] ? cue : scrolled;
  const resolve = (n: string) => light(cues[n] ?? cues[first] ?? "vitrina");
  const target = useMemo(() => resolve(name), [name, cues]); // eslint-disable-line react-hooks/exhaustive-deps
  const live = useRef<LightCue>(target);
  const goal = useRef(target);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const kick = useRef<() => void>(() => {});

  // la sección que cruza la línea media manda (como ThemeScroll)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sections = Array.from(el.querySelectorAll<HTMLElement>("[data-light]"));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setScrolled(e.target.getAttribute("data-light") || first);
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [first, children]);

  // bucle de la luz: interpola hacia la toma activa y escribe las variables; se duerme cuando llega y no sigue al puntero
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;
    let raf = 0;
    let last = 0;
    const write = (c: LightCue) => {
      const [r, g, b] = kelvinToRgb(c.kelvin);
      const s = el.style;
      s.setProperty("--light-rgb", `${r} ${g} ${b}`);
      s.setProperty("--light-k", `${Math.round(c.kelvin)}`);
      s.setProperty("--light-i", c.intensity.toFixed(3));
      s.setProperty("--light-x", `${c.x.toFixed(2)}%`);
      s.setProperty("--light-y", `${c.y.toFixed(2)}%`);
      s.setProperty("--light-r", `${c.radius.toFixed(2)}vmax`);
      s.setProperty("--light-soft", c.softness.toFixed(3));
      s.setProperty("--light-amb", c.ambient.toFixed(3));
      s.setProperty("--light-angle", `${c.angle.toFixed(2)}deg`);
      s.setProperty("--light-sparkle", (reduced ? 0 : c.sparkle).toFixed(3));
      el.dataset.lightKind = c.kind;
    };
    const step = (t: number) => {
      const dt = last ? Math.min(0.1, (t - last) / 1000) : 1 / 60;
      last = t;
      const g = goal.current;
      const follow = g.follow === "pointer" && fine && !reduced && pointer.current;
      const to = follow ? { ...g, x: pointer.current!.x, y: pointer.current!.y } : g;
      const k = reduced ? 1 : 1 - Math.exp((-dt * 4) / Math.max(0.05, duration));
      live.current = lerpCue(live.current, to, k);
      write(live.current);
      if (follow || !cueSettled(live.current, to)) raf = requestAnimationFrame(step);
      else {
        raf = 0;
        last = 0;
      }
    };
    kick.current = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / innerWidth) * 100, y: (e.clientY / innerHeight) * 100 };
      if (goal.current.follow === "pointer") kick.current();
    };
    write(live.current);
    addEventListener("pointermove", onMove, { passive: true });
    kick.current();
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      removeEventListener("pointermove", onMove);
    };
  }, [duration]);

  useEffect(() => {
    goal.current = target;
    kick.current();
  }, [target]);

  const value = useMemo(() => ({ live, name, target }), [name, target]);
  const [r, g, b] = kelvinToRgb(target.kelvin);
  return createElement(
    as,
    {
      ref,
      className: `ui-light ui-light--${position} ${className}`.trim(),
      "data-light-active": name,
      "data-light-kind": target.kind,
      // la primera toma ya viene en el HTML del servidor: sin parpadeo antes de hidratar
      style: {
        "--light-rgb": `${r} ${g} ${b}`,
        "--light-k": target.kelvin,
        "--light-i": target.intensity,
        "--light-x": `${target.x}%`,
        "--light-y": `${target.y}%`,
        "--light-r": `${target.radius}vmax`,
        "--light-soft": target.softness,
        "--light-amb": target.ambient,
        "--light-angle": `${target.angle}deg`,
        "--light-sparkle": 0,
        ...style,
      } as CSSProperties,
    },
    <div className="ui-light__layer" aria-hidden>
      <span className="ui-light__glints">
        {Array.from({ length: GLINTS }, (_, i) => (
          <i key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </span>
    </div>,
    <LightCtx.Provider value={value}>
      <div className="ui-light__content">{children}</div>
    </LightCtx.Provider>,
  );
}
