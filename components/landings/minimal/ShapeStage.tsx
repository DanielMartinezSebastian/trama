"use client";

import { useEffect, useRef, useState } from "react";
import AsciiBackground, { type ASCII_STYLES } from "@/components/ui/AsciiBackground";
import type { SourceKind } from "@/lib/asciify/painters";
import { resetShapeView, shapeView, type ShapeFx } from "@/lib/asciify/shape-painters";
import { clamp, smooth } from "@/lib/scroll/store";

export type ShapeStyle = (typeof ASCII_STYLES)[number];
export type ShapeHover = "none" | "trail" | "water" | "contour" | "dissolve" | "silk" | "vortex";
type RGB = [number, number, number];

/** Aspecto del fondo en un "acto" de la página. Los números se interpolan con el scroll; escena, estilo y hover saltan en la transición. */
export type ShapeLook = {
  scene: SourceKind;
  style: ShapeStyle;
  cell: number;
  bloom: number;
  grain: number;
  scan: number;
  vig: number;
  tint: number;
  acc: RGB;
  /** posición (fracción del lienzo; fuera de 0..1 = recortada por el borde) y escala de la figura */
  x: number;
  y: number;
  s: number;
  /** hover propio de la figura y hover del motor de caracteres */
  fx: ShapeFx;
  hover: ShapeHover;
};

/** Pico de tamaño de celda en la transición: la imagen se rompe en bloques justo al cambiar de forma. */
const CELL_PEAK = 34;
/** Anchura de la zona de transición a cada lado del cambio, en alturas de ventana. */
const ZONE_VH = 0.35;

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const q = (v: number, step: number) => Math.round(v / step) * step;

type Live = { scene: SourceKind; style: ShapeStyle; hover: ShapeHover; cell: number; bloom: number; grain: number; scan: number; vig: number; glitch: number; tint: number };

/**
 * Fondo de formas dirigido por el scroll. Cada elemento `[data-act]` dentro del contenedor padre es un "acto" con su
 * `ShapeLook` (mismo orden). Los actos pueden medir lo que quieran: el fondo cambia de un look al siguiente cuando el
 * inicio del siguiente acto cruza la mitad de la ventana, y entre medias interpola por posición. Solo re-renderiza
 * cuando cambia algún valor cuantizado.
 */
export default function ShapeStage({ looks }: { looks: ShapeLook[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState<Live>(() => ({ ...looks[0], glitch: 0.05 }));

  useEffect(() => {
    const root = wrap.current?.parentElement as HTMLElement | null;
    if (!root) return;
    let raf = 0;
    let key = "";
    let starts: number[] = [];
    let cy = -1; // posición suavizada

    const measure = () => {
      const acts = Array.from(root.querySelectorAll<HTMLElement>("[data-act]")).slice(0, looks.length);
      starts = acts.map((a) => a.getBoundingClientRect().top + scrollY);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    addEventListener("load", measure);
    const late = setTimeout(measure, 800); // tras cargar fuentes/imágenes

    const tick = () => {
      const vh = innerHeight;
      const N = Math.min(starts.length, looks.length);
      if (N > 0) {
        // el cambio ocurre cuando el siguiente acto llega a media ventana
        const y = scrollY + vh * 0.5;
        cy = cy < 0 ? y : cy + (y - cy) * 0.14;

        let i = 0;
        while (i + 1 < N && cy >= starts[i + 1]) i++;
        const hasNext = i + 1 < N;
        const span = hasNext ? starts[i + 1] - starts[i] : 1;
        const f = hasNext ? clamp((cy - starts[i]) / span) : 0;
        const k = smooth(f);
        const A = looks[i], B = looks[hasNext ? i + 1 : i];

        const zone = ZONE_VH * vh;
        const dist = Math.min(hasNext ? starts[i + 1] - cy : 1e9, i > 0 ? cy - starts[i] : 1e9);
        const e = dist < zone ? smooth(1 - dist / zone) : 0;

        const base = lerp(A.cell, B.cell, k);
        const next: Live = {
          scene: A.scene,
          style: A.style,
          hover: A.hover,
          cell: Math.max(3, Math.round(lerp(base, CELL_PEAK, e))),
          bloom: q(lerp(A.bloom, B.bloom, k), 0.05),
          grain: q(lerp(A.grain, B.grain, k), 0.05),
          scan: q(lerp(A.scan, B.scan, k) + e * 0.25, 0.05),
          vig: q(lerp(A.vig, B.vig, k), 0.05),
          glitch: q(0.04 + e * 0.75, 0.05),
          tint: q(lerp(A.tint, B.tint, k), 0.05),
        };
        const nk = Object.values(next).join("|");
        if (nk !== key) {
          key = nk;
          setLive(next);
        }

        // Colocación y hover propio de la figura (los lee el painter en cada fotograma)
        shapeView.x = lerp(A.x, B.x, k);
        shapeView.y = lerp(A.y, B.y, k);
        shapeView.s = lerp(A.s, B.s, k);
        shapeView.fx = A.fx;

        // Acento continuo → colorea la tinta del fondo y todo lo que lea --acc (bloques de texto, componentes del kit)
        const c = [0, 1, 2].map((n) => Math.round(lerp(A.acc[n], B.acc[n], k)));
        root.style.setProperty("--acc", `rgb(${c[0]} ${c[1]} ${c[2]})`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(late);
      ro.disconnect();
      removeEventListener("load", measure);
      resetShapeView();
    };
  }, [looks]);

  return (
    <div ref={wrap} className="mn__bg">
      <AsciiBackground
        scene={live.scene}
        asciiStyle={live.style}
        cellSize={live.cell}
        bloom={live.bloom}
        grain={live.grain}
        scanlines={live.scan}
        vignette={live.vig}
        glitch={live.glitch}
        palette="tint"
        tintAmount={live.tint}
        asciiHover={live.hover}
        hoverStrength={0.9}
        hoverRadius={0.3}
      />
    </div>
  );
}
