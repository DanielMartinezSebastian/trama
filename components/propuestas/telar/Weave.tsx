"use client";

import { useEffect, useRef } from "react";

/**
 * Tela que se teje: urdimbre vertical fija y pasadas de trama en tafetán (una por encima, una por debajo) que avanzan
 * con el scroll de la sección. Los hilos de urdimbre se apartan del puntero. Con movimiento reducido se pinta tejida y
 * quieta. Solo dibuja cuando cambia el scroll o el puntero.
 */
const WEFTS = ["#1c1915", "#1c1915", "#d2391b", "#1c1915", "#8a7f6e"];

export default function Weave({ step = 14, warp = "#c9bb9f", wefts = WEFTS, className = "" }: {
  step?: number;
  warp?: string;
  wefts?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    let px = -9999, py = -9999;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const progress = () => {
      if (still) return 1;
      const r = cv.getBoundingClientRect();
      // empieza tejida un tercio y termina cuando la sección ha subido media pantalla
      const p = 0.33 + (-r.top + window.innerHeight * 0.1) / (r.height * 0.7);
      return Math.max(0.33, Math.min(1, p));
    };

    const draw = () => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / step) + 1;
      const rows = Math.ceil(h / step) + 1;
      const woven = Math.floor(rows * progress());
      const tw = step * 0.62;
      const bend = (x: number, y: number) => {
        const dx = x - px, dy = y - py;
        const d2 = dx * dx + dy * dy;
        return d2 > 30000 ? 0 : (dx >= 0 ? 1 : -1) * 16 * Math.exp(-d2 / 6000);
      };
      // urdimbre: hilos verticales, curvados cerca del puntero
      ctx.strokeStyle = warp;
      ctx.lineWidth = tw * 0.5;
      for (let c = 0; c < cols; c++) {
        const x0 = c * step + step / 2;
        ctx.beginPath();
        for (let y = 0; y <= h; y += step) ctx[y === 0 ? "moveTo" : "lineTo"](x0 + bend(x0, y), y);
        ctx.stroke();
      }
      // trama: cada pasada cruza por encima en las columnas pares (alternando por fila)
      for (let r = 0; r < woven; r++) {
        const y = r * step + step / 2;
        ctx.fillStyle = wefts[Math.floor(r / 3) % wefts.length];
        for (let c = 0; c < cols; c++) {
          if ((r + c) % 2) continue;
          const x = c * step + bend(c * step + step / 2, y);
          ctx.fillRect(x, y - tw / 2, step, tw);
        }
        // la pasada que se está tejiendo lleva la lanzadera
        if (r === woven - 1 && woven < rows) {
          ctx.fillStyle = "#d2391b";
          ctx.fillRect(w - 64, y - 5, 48, 10);
        }
      }
    };

    const ask = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top;
      ask();
    };
    const onLeave = () => { px = py = -9999; ask(); };

    size(); draw();
    const ro = new ResizeObserver(() => { size(); ask(); });
    ro.observe(cv);
    window.addEventListener("scroll", ask, { passive: true });
    if (!still) {
      cv.parentElement?.addEventListener("pointermove", onMove);
      cv.parentElement?.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", ask);
      cv.parentElement?.removeEventListener("pointermove", onMove);
      cv.parentElement?.removeEventListener("pointerleave", onLeave);
    };
  }, [step, warp, wefts]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
