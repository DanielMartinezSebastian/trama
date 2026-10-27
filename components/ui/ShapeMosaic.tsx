"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { splitEscaped } from "@/lib/ui/list";
import { trackScroll } from "@/lib/motion/progress";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

export type ShapeMosaicItem = {
  shape: "circle" | "square";
  /** 1 = el acento · 2 = el acento aclarado · 3 = el acento muy claro · 0 = hueco */
  tone?: 0 | 1 | 2 | 3;
  /** foto dentro de la forma (opcional) */
  src?: string;
  alt?: string;
};

export type ShapeMosaicProps = {
  /** las formas en orden de lectura, o una por línea: «circle|1|/img/foto.jpg|texto alternativo» */
  items?: ShapeMosaicItem[] | string;
  columns?: number;
  /** separación entre formas en cualquier unidad CSS */
  gap?: string;
  /** las fotos se funden en el color de su forma a medida que el mosaico sale por arriba */
  dissolve?: boolean;
  /** px que se desplazan las columnas, en sentidos alternos, mientras el mosaico cruza la pantalla (0 = quietas) */
  drift?: number;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_ITEMS =
  "square|2\ncircle|0|/img/hebra/trabajo-ondas.webp|Melena ondulada con reflejos\nsquare|3|/img/hebra/trabajo-balayage.webp|Balayage\ncircle|1\ncircle|3\nsquare|1|/img/hebra/trabajo-rizo.webp|Rizo definido\ncircle|2\nsquare|3|/img/hebra/trabajo-corte-corto.webp|Pixie con textura";

const parse = (s: string): ShapeMosaicItem[] =>
  s
    .split("\n")
    .map((l) => splitEscaped(l, "|").map((x) => x.trim()))
    .filter((r) => r[0])
    .map(([shape, tone, src, alt]) => ({ shape: shape === "square" ? "square" : "circle", tone: (Number(tone) || 0) as ShapeMosaicItem["tone"], src: src || undefined, alt: alt || "" }));

/**
 * Mosaico de formas (círculos y cuadrados) en tres tonos del acento, con foto dentro de algunas; al bajar, las columnas se
 * desplazan en sentidos alternos y las fotos se disuelven en el color de su forma hasta dejar pura geometría (Il Colorista,
 * docs/50 §3.1). Los tonos salen de `--acc` mezclado con `--bg`, así que cambian con el tema. Con movimiento reducido,
 * quieto y con las fotos.
 */
export default function ShapeMosaic({ items = DEFAULT_ITEMS, columns = 4, gap = "clamp(8px, 1.6vw, 20px)", dissolve = true, drift = 60, className = "", style }: ShapeMosaicProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const list = typeof items === "string" ? parse(items) : items;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || (!dissolve && !drift)) return;
    // p: 0 cuando el mosaico asoma por abajo, 1 cuando sale por arriba
    return trackScroll(el, (r, vh) => {
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      el.style.setProperty("--sm-p", p.toFixed(4));
    });
  }, [reduced, dissolve, drift]);

  return (
    <div
      ref={ref}
      className={`ui-shapes ${dissolve && !reduced ? "is-dissolving" : ""} ${className}`.trim()}
      style={{ ...style, "--sm-cols": columns, "--sm-gap": gap, "--sm-drift": `${reduced ? 0 : drift}px` } as CSSProperties}
    >
      {list.map((it, i) => (
        <span
          key={i}
          className={`ui-shapes__cell ui-shapes__cell--${it.shape} ui-shapes__cell--t${it.tone ?? 0}`}
          style={{ "--sm-dir": i % columns % 2 ? 1 : -1, "--sm-k": ((i * 7) % 5) / 5 } as CSSProperties}
        >
          {it.src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={it.src} alt={it.alt ?? ""} loading="lazy" decoding="async" />
          )}
        </span>
      ))}
    </div>
  );
}
