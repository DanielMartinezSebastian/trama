"use client";

import { useEffect, useRef } from "react";
import { tcls, type Tone } from "./variants";

export type GlyphCursorProps = {
  /** glyph = un carácter; ring = anillo; dot = punto */
  mode?: "glyph" | "ring" | "dot";
  glyph?: string;
  /** tamaño del cursor en px */
  cursorSize?: number;
  /** @deprecated usa `cursorSize` */
  size?: number;
  /** retardo del seguimiento en segundos (mayor = más "flotante") */
  lag?: number;
  spin?: boolean;
  glow?: boolean;
  tone?: Tone;
  /** distancia al puntero en px */
  offset?: number;
};

/**
 * Elemento que persigue al puntero dentro de su contenedor padre (no de la ventana), así se puede
 * usar en cualquier panel. Colócalo como hijo del elemento donde debe actuar. Sin efecto en táctil.
 */
export default function GlyphCursor({ mode = "glyph", glyph = "*", cursorSize, size: legacySize, lag = 0.45, spin = true, glow = true, tone = "acc", offset = 14 }: GlyphCursorProps) {
  const size = cursorSize ?? legacySize ?? 22;
  const scope = useRef<HTMLDivElement>(null);
  const glyphEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = scope.current?.parentElement;
    const g = glyphEl.current;
    if (!host || !g || window.matchMedia("(pointer: coarse)").matches) return;
    let disposed = false;
    let off: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      if (disposed) return;
      gsap.set(g, { autoAlpha: 0 });
      const qx = gsap.quickTo(g, "x", { duration: lag, ease: "power3.out" });
      const qy = gsap.quickTo(g, "y", { duration: lag, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        const o = mode === "glyph" ? offset : 0;
        qx(e.clientX - r.left + o);
        qy(e.clientY - r.top + o);
        gsap.to(g, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
      };
      const leave = () => void gsap.to(g, { autoAlpha: 0, duration: 0.2 });
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", leave);
      off = () => {
        host.removeEventListener("pointermove", move);
        host.removeEventListener("pointerleave", leave);
        gsap.killTweensOf(g);
      };
    })();

    return () => {
      disposed = true;
      off?.();
    };
  }, [lag, mode, offset]);

  const dim = mode === "glyph" ? undefined : { width: size, height: size };
  return (
    <div ref={scope} className={`ui-cursor-scope ${tcls(tone)}`} aria-hidden>
      <span
        ref={glyphEl}
        className={`ui-cursor ui-cursor--${mode} ${spin && mode === "glyph" ? "ui-cursor--spin" : ""} ${glow ? "ui-cursor--glow" : ""}`}
        style={{ fontSize: size, ...dim, boxShadow: glow && mode !== "glyph" ? "0 0 12px var(--tone, var(--acc))" : undefined }}
      >
        {mode === "glyph" ? glyph : ""}
      </span>
    </div>
  );
}
