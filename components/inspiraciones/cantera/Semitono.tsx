"use client";

import { useEffect, useRef } from "react";

/*
 * Baldosa de semitono en lienzo: una trama de puntos cuyo tamaño sale de un campo de ondas lentas, y que se abulta alrededor
 * del puntero. Sustituye a la fotografía en las baldosas de Cantera; no hay imagen detrás.
 */
export default function Semitono({ semilla = 0, className = "" }: { semilla?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const c = cv?.getContext("2d");
    if (!cv || !c) return;
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paso = 7;
    let W = 0;
    let H = 0;
    let raf = 0;
    let visible = true;
    const puntero = { x: -999, y: -999 };
    const ajusta = () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = W;
      cv.height = H;
    };
    const mueve = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      puntero.x = e.clientX - r.left;
      puntero.y = e.clientY - r.top;
    };
    const dibuja = (ms: number) => {
      const t = semilla * 9 + (quieto ? 0 : ms / 5200);
      c.fillStyle = "#e0e0e0";
      c.fillRect(0, 0, W, H);
      c.fillStyle = "#232323";
      for (let y = paso / 2; y < H; y += paso) {
        for (let x = paso / 2; x < W; x += paso) {
          const a = Math.sin(x * 0.012 + t) + Math.sin(y * 0.016 - t * 0.7) + Math.sin((x + y) * 0.008 + t * 0.4);
          const d = Math.hypot(x - puntero.x, y - puntero.y);
          const r = Math.max(0, 1.5 + a * 0.85 + Math.max(0, 1 - d / 120) * 2.6);
          if (r < 0.2) continue;
          c.beginPath();
          c.arc(x, y, Math.min(3.4, r), 0, Math.PI * 2);
          c.fill();
        }
      }
      if (!quieto && visible) raf = requestAnimationFrame(dibuja);
    };
    ajusta();
    const ro = new ResizeObserver(() => {
      ajusta();
      raf = requestAnimationFrame(dibuja);
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) raf = requestAnimationFrame(dibuja);
    });
    io.observe(cv);
    cv.addEventListener("pointermove", mueve);
    cv.addEventListener("pointerleave", () => (puntero.x = -999));
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      cv.removeEventListener("pointermove", mueve);
    };
  }, [semilla]);
  return <canvas ref={ref} className={className} aria-hidden />;
}
