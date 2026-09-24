"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { tcls, type Tone } from "./variants";

export type HoverEffectKind = "none" | "lift" | "scale" | "tilt" | "glow" | "shine" | "scanline" | "jitter" | "brackets" | "underline";

export const HOVERFX_EFFECTS: { id: HoverEffectKind; label: string }[] = [
  { id: "lift", label: "Elevación" },
  { id: "scale", label: "Escala" },
  { id: "tilt", label: "Inclinación 3D" },
  { id: "glow", label: "Brillo que sigue al puntero" },
  { id: "shine", label: "Destello diagonal" },
  { id: "scanline", label: "Barrido de escaneo" },
  { id: "jitter", label: "Micro-glitch" },
  { id: "brackets", label: "Corchetes de objetivo" },
  { id: "underline", label: "Subrayado animado" },
  { id: "none", label: "Ninguno" },
];

export type HoverFXProps = {
  effect?: HoverEffectKind;
  /** 0–1: fuerza del desplazamiento, la escala, el glifo o el brillo */
  strength?: number;
  tone?: Tone;
  /** radio del brillo, en px (solo "glow") */
  radius?: number;
  /** inclinación máxima en grados (solo "tilt") */
  tiltMax?: number;
  /** ocupa el 100% del contenedor en vez de ajustarse al contenido (para usarlo sobre fondos) */
  fill?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Envoltorio de efectos de hover reutilizable en cualquier contenido: elevación, escala,
 * inclinación 3D, brillo que sigue al puntero, destello diagonal, barrido de escaneo,
 * micro-glitch, corchetes de objetivo o subrayado. La mayoría son CSS puro; "tilt" y "glow"
 * siguen la posición del puntero con GSAP. Sin efecto en táctil ni con movimiento reducido.
 */
export default function HoverFX({
  effect = "lift",
  strength = 0.6,
  tone = "acc",
  radius = 220,
  tiltMax = 10,
  fill = false,
  disabled = false,
  children,
  className = "",
}: HoverFXProps) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const fx = disabled ? "none" : effect;

  useEffect(() => {
    const el = root.current;
    const box = inner.current;
    if (!el || !box || disabled) return;
    if (fx !== "tilt" && fx !== "glow") return;
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    let off: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      if (disposed) return;
      const rx = fx === "tilt" ? gsap.quickTo(box, "rotationX", { duration: 0.5, ease: "power3.out" }) : null;
      const ry = fx === "tilt" ? gsap.quickTo(box, "rotationY", { duration: 0.5, ease: "power3.out" }) : null;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width;
        const ny = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", `${nx * 100}%`);
        el.style.setProperty("--my", `${ny * 100}%`);
        if (fx === "tilt") {
          rx?.((0.5 - ny) * tiltMax);
          ry?.((nx - 0.5) * tiltMax * 1.2);
        }
      };
      const leave = () => {
        if (fx === "tilt") {
          rx?.(0);
          ry?.(0);
        }
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      off = () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        gsap.killTweensOf(box);
      };
    })();

    return () => {
      disposed = true;
      off?.();
    };
  }, [fx, tiltMax, disabled]);

  return (
    <div
      ref={root}
      className={`ui-hoverfx ui-hoverfx--${fx} ${fill ? "ui-hoverfx--fill" : ""} ${tcls(tone)} ${className}`}
      style={{ "--hf-radius": `${radius}px`, "--hf-strength": strength } as CSSProperties}
    >
      <div ref={inner} className="ui-hoverfx__inner">
        {children}
      </div>
      {fx === "shine" && <span className="ui-hoverfx__shine" aria-hidden />}
      {fx === "scanline" && <span className="ui-hoverfx__scan" aria-hidden />}
      {fx === "glow" && <span className="ui-hoverfx__glow" aria-hidden />}
      {fx === "brackets" && (
        <>
          <i className="ui-hoverfx__bracket ui-hoverfx__bracket--tl" aria-hidden />
          <i className="ui-hoverfx__bracket ui-hoverfx__bracket--tr" aria-hidden />
          <i className="ui-hoverfx__bracket ui-hoverfx__bracket--bl" aria-hidden />
          <i className="ui-hoverfx__bracket ui-hoverfx__bracket--br" aria-hidden />
        </>
      )}
    </div>
  );
}
