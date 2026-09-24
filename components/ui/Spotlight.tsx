"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { tcls, vcls, type Tone, type Variant } from "./variants";

export type SpotlightProps = {
  /** radio del foco en px */
  radius?: number;
  /** intensidad del brillo, 0–100 */
  intensity?: number;
  /** también ilumina el borde bajo el puntero */
  border?: boolean;
  tone?: Extract<Tone, "acc" | "acc2" | "fg">;
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

/** Superficie con un foco de luz que sigue al puntero (variables CSS, sin JS por fotograma en el árbol de React). */
export default function Spotlight({ radius = 220, intensity = 30, border = true, tone = "acc", variant = "glass", children, className = "" }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`ui-spot ui-surface ${border ? "ui-spot--border" : ""} ${tcls(tone)} ${vcls(variant)} ${className}`}
      style={{ "--spot-r": `${radius}px`, "--spot-i": `${intensity}%` } as CSSProperties}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
