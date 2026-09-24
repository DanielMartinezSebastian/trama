"use client";

import { useEffect, useState } from "react";
import { vcls, type Variant } from "./variants";

export type SpinnerProps = {
  kind?: "ring" | "line" | "braille" | "dots" | "bar" | "blocks";
  label?: string;
  /** fotogramas por segundo de las variantes de texto */
  fps?: number;
  /** tamaño en px (el texto va al 70 %) */
  fontSize?: number;
  /** @deprecated usa `fontSize` */
  size?: number;
  variant?: Variant;
  className?: string;
};

const FRAMES = {
  line: ["|", "/", "-", "\\"],
  braille: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  dots: ["·  ", "·· ", "···", " ··", "  ·", "   "],
  bar: ["[=     ]", "[==    ]", "[===   ]", "[====  ]", "[ ==== ]", "[  ====]", "[   ===]", "[    ==]", "[     =]", "[      ]"],
  blocks: ["▖", "▘", "▝", "▗"],
} as const;

/** Indicador de carga: anillo CSS o animaciones de texto (línea, braille, puntos, barra, bloques). */
export default function Spinner({ kind = "braille", label = "Cargando…", fps = 12, fontSize, size: legacySize, variant = "terminal", className = "" }: SpinnerProps) {
  const size = fontSize ?? legacySize ?? 20;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (kind === "ring") return;
    const id = setInterval(() => setI((n) => n + 1), 1000 / Math.max(1, fps));
    return () => clearInterval(id);
  }, [kind, fps]);
  const frames = kind === "ring" ? null : FRAMES[kind];
  return (
    <div className={`ui-spin ${vcls(variant)} ${className}`} role="status" aria-label={label} style={{ fontSize: size }}>
      {frames ? <span className="ui-spin__frames">{frames[i % frames.length]}</span> : <span className="ui-spin__ring" />}
      {label && <span style={{ fontSize: Math.max(12, size * 0.7) }}>{label}</span>}
    </div>
  );
}
