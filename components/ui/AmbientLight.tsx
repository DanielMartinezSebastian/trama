"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/*
 * Luz ambiental: el color de un vídeo (o imagen, o lienzo) de la página, muy desenfocado, detrás de todo. Es el fondo
 * de muchas webs de cine y de productoras (docs/14): el ambiente cambia con lo que se reproduce.
 *
 * No decodifica el vídeo otra vez: copia cada fotograma del elemento indicado (`target`) a un lienzo de 32×18 píxeles,
 * que el CSS estira y desenfoca. Coste: un `drawImage` diminuto unas 12 veces por segundo. Funciona con medios del mismo
 * origen (un vídeo de otro dominio sin CORS «ensucia» el lienzo y no se puede leer, pero dibujar sí: se ve igual).
 */

export type AmbientLightProps = {
  /** selector CSS del <video>, <img> o <canvas> del que sale la luz; se vuelve a buscar si cambia (rutas, viajeros) */
  target: string;
  /** desenfoque en px */
  blur?: number;
  /** opacidad de la luz (0–1) */
  opacity?: number;
  /** muestras por segundo (con «reducir movimiento», una cada dos segundos) */
  fps?: number;
  /** `fixed`: detrás de toda la ventana; `absolute`: detrás de su contenedor (que debe tener `position`) */
  position?: "fixed" | "absolute";
  /** fundido entre muestras (0–1): más alto, cambios de color más suaves */
  smoothing?: number;
  className?: string;
};

export default function AmbientLight({ target, blur = 90, opacity = 0.6, fps = 12, position = "fixed", smoothing = 0.25, className = "" }: AmbientLightProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const every = reduced ? 2000 : 1000 / Math.max(1, fps);
    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < every) return;
      last = t;
      const el = document.querySelector(target) as HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | null;
      if (!el) return;
      if (el instanceof HTMLVideoElement && el.readyState < 2) return;
      if (el instanceof HTMLImageElement && !el.complete) return;
      // cada muestra se mezcla con la anterior: el color cambia suave aunque el vídeo corte de plano
      ctx.globalAlpha = 1 - smoothing;
      try {
        ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
      } catch {
        /* medio aún sin datos */
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [target, fps, smoothing]);
  return (
    <canvas
      ref={ref}
      width={32}
      height={18}
      aria-hidden
      className={`ui-ambient ui-ambient--${position} ${className}`.trim()}
      style={{ "--ui-ambient-blur": `${blur}px`, "--ui-ambient-op": opacity } as CSSProperties}
    />
  );
}
