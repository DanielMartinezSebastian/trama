"use client";

import { useEffect, useRef } from "react";

export type SceneFlashProps = {
  kind?: "sweep" | "iris" | "slices" | "blinds" | "pixels";
  duration?: number;
  /** lanza la transición en bucle cada pocos segundos */
  loop?: boolean;
  /** cambia el número para lanzarla desde fuera (p. ej. al cruzar de sección) */
  playKey?: number;
  className?: string;
};

const CELLS = { blinds: 10, pixels: 96 } as const;

/**
 * Transición breve para cambios de escena. Ocupa el padre (que debe tener `position: relative`) y
 * no bloquea el puntero. Usa `--acc` y `--acc2`. `blinds` (persianas) y `pixels` (mosaico) animan celdas escalonadas.
 */
export default function SceneFlash({ kind = "sweep", duration = 1, loop = false, playKey = 0, className = "" }: SceneFlashProps) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    let disposed = false;
    const cleanups: Array<() => void> = [];
    const cells = kind === "blinds" || kind === "pixels" ? Array.from(node.children) : [];

    (async () => {
      const { gsap } = await import("gsap");
      if (disposed) return;
      gsap.set(cells.length ? cells : node, { autoAlpha: 0 });
      if (!cells.length) gsap.set(node, { autoAlpha: 0 });
      const run = () => {
        gsap.killTweensOf(cells.length ? cells : node);
        if (kind === "sweep")
          gsap.fromTo(node, { yPercent: 100, autoAlpha: 1 }, { yPercent: -110, duration, ease: "power2.inOut", onComplete: () => void gsap.set(node, { autoAlpha: 0 }) });
        else if (kind === "iris")
          gsap.fromTo(node, { scale: 0, autoAlpha: 0.85 }, { scale: 3.2, autoAlpha: 0, duration: duration * 1.1, ease: "power2.out" });
        else if (kind === "slices")
          gsap.fromTo(node, { xPercent: -100, autoAlpha: 1, skewX: -18 }, { xPercent: 100, duration: duration * 0.55, ease: "power3.inOut", onComplete: () => void gsap.set(node, { autoAlpha: 0 }) });
        else
          gsap.fromTo(cells, { autoAlpha: 0 }, { autoAlpha: 1, duration: duration * 0.35, ease: "none", stagger: { each: (duration * 0.65) / cells.length, from: kind === "pixels" ? "random" : "start" }, yoyo: true, repeat: 1 });
      };
      if (playKey > 0) run();
      if (loop) {
        const id = setInterval(run, (duration + 1.4) * 1000);
        cleanups.push(() => clearInterval(id));
      }
      cleanups.push(() => gsap.killTweensOf(cells.length ? cells : node));
    })();

    return () => {
      disposed = true;
      cleanups.reverse().forEach((f) => f());
    };
  }, [kind, duration, loop, playKey]);

  const count = kind === "blinds" ? CELLS.blinds : kind === "pixels" ? CELLS.pixels : 0;
  return (
    <div ref={el} key={kind} className={`ui-flash ui-flash--${kind} ${className}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <i key={i} className="ui-flash__cell" />
      ))}
    </div>
  );
}
