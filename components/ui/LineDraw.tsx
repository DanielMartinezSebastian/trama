"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { whenIntroDone } from "@/lib/motion/intro";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

/** Trazos de mano alzada listos para usar: `d` + `viewBox`. Cada `M` es un tramo que se dibuja después del anterior. */
export const LINE_SHAPES = {
  signature: {
    viewBox: "0 0 240 120",
    d: "M10 92C40 60 70 20 92 18C112 16 96 70 78 96C70 108 66 88 86 70C110 48 128 40 134 58C138 72 120 86 126 70C132 54 150 46 156 62C160 74 146 84 156 72C170 56 186 50 190 64C192 74 180 80 196 70C212 60 226 52 232 48M30 104C90 90 160 82 236 76",
  },
  underline: { viewBox: "0 0 300 30", d: "M4 18C60 8 140 26 200 14S280 10 296 16" },
  circle: { viewBox: "0 0 300 120", d: "M150 10C60 8 8 34 10 62C12 96 90 112 160 110C240 108 292 86 290 56C288 26 220 8 130 14C100 16 80 22 70 28" },
  arrow: { viewBox: "0 0 200 100", d: "M10 80C50 20 120 10 180 40M160 22L182 41L156 52" },
} as const;
export type LineShape = keyof typeof LINE_SHAPES;

export type LineDrawProps = {
  /** trazo predefinido; `d` lo sustituye */
  shape?: LineShape;
  /** trazado SVG propio (con su `viewBox`) */
  d?: string;
  viewBox?: string;
  /** `inview`: se dibuja al entrar en pantalla · `scroll`: sigue al scroll (y se borra al subir) · `mount`: al montar */
  trigger?: "inview" | "mount" | "scroll";
  /** segundos que tarda todo el trazo (se reparte entre los tramos por longitud) */
  duration?: number;
  delay?: number;
  /** grosor en px de pantalla (no escala con el dibujo) */
  strokeWidth?: number;
  tone?: "acc" | "acc2" | "fg" | "mut";
  /** cambia para volver a dibujar */
  playKey?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Trazo SVG que se dibuja solo: firma, subrayado, círculo o flecha a mano alzada, o cualquier `d`. Decorativo (`aria-hidden`):
 * el texto que acompaña va aparte. Cada subtramo (`M…`) tiene `pathLength=1` y se dibuja con `stroke-dashoffset`; con
 * `trigger="scroll"` el avance es el del scroll entre el 90 % y el 35 % del alto de la ventana. Sin JS o con movimiento
 * reducido, el trazo se ve completo.
 */
export default function LineDraw({ shape = "signature", d, viewBox, trigger = "inview", duration = 1.6, delay = 0, strokeWidth = 3, tone = "acc", playKey = 0, className = "", style }: LineDrawProps) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  const def = LINE_SHAPES[shape] ?? LINE_SHAPES.signature;
  const path = d || def.d;
  const vb = d ? viewBox || "0 0 100 100" : def.viewBox;
  const parts = path.split(/(?=M)/).map((p) => p.trim()).filter(Boolean);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || reduced) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
    // reparto del tiempo por longitud real de cada tramo
    const lens = paths.map((p) => p.getTotalLength?.() || 1);
    const total = lens.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    const spans = lens.map((l) => {
      const start = acc / total;
      acc += l;
      return [start, acc / total] as const;
    });
    const setProgress = (t: number) =>
      paths.forEach((p, i) => {
        const [a, b] = spans[i];
        const local = Math.min(1, Math.max(0, (t - a) / (b - a || 1)));
        p.style.strokeDashoffset = String(1.01 * (1 - local)); // 1,01: sin el punto del remate redondo al principio
      });

    svg.removeAttribute("data-in");
    paths.forEach((p) => {
      p.style.transition = "none";
      p.style.strokeDashoffset = "1.01";
    });
    void svg.getBoundingClientRect();

    if (trigger === "scroll") {
      let raf = 0;
      const tick = () => {
        raf = 0;
        const r = svg.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        setProgress((vh * 0.9 - r.top) / (vh * 0.55));
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(tick);
      };
      tick();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    const play = () =>
      paths.forEach((p, i) => {
        const [a, b] = spans[i];
        p.style.transition = `stroke-dashoffset ${(b - a) * duration}s cubic-bezier(0.55, 0.1, 0.35, 1) ${delay + a * duration}s`;
        p.style.strokeDashoffset = "0";
      });
    if (trigger === "mount") return whenIntroDone(() => requestAnimationFrame(play));
    let io: IntersectionObserver | undefined;
    const cancel = whenIntroDone(() => {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            play();
            io?.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      io.observe(svg);
    });
    return () => {
      cancel();
      io?.disconnect();
    };
  }, [trigger, duration, delay, path, reduced, playKey]);

  return (
    <svg ref={ref} className={`ui-ldraw ${className}`.trim()} viewBox={vb} style={{ ...style, "--ld-c": `var(--${tone})`, "--ld-w": `${strokeWidth}px` } as CSSProperties} aria-hidden focusable="false">
      {parts.map((p, i) => (
        <path key={i} d={p} pathLength={1} />
      ))}
    </svg>
  );
}
