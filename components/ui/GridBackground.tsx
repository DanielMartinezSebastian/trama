import type { CSSProperties } from "react";

export type GridBackgroundProps = {
  kind?: "dots" | "lines" | "cross" | "diagonal";
  /** tamaño de la celda en px */
  cellSize?: number;
  /** @deprecated usa `cellSize` */
  size?: number;
  opacity?: number;
  /** difumina hacia los bordes */
  fade?: boolean;
  /** desplazamiento lento */
  drift?: boolean;
  /** absolute (por defecto) = rellena su contenedor · fixed = cubre la ventana y no se mueve con el scroll */
  position?: "absolute" | "fixed";
  className?: string;
};

/** Fondo de rejilla en CSS puro (sin canvas): la opción más ligera para fondos discretos. Rellena su contenedor. */
export default function GridBackground({ kind = "dots", cellSize, size: legacySize, opacity = 0.6, fade = true, drift = false, position = "absolute", className = "" }: GridBackgroundProps) {
  const size = cellSize ?? legacySize ?? 28;
  return (
    <div className={`ui-grid ui-grid--${kind} ${fade ? "ui-grid--fade" : ""} ${drift ? "ui-grid--drift" : ""} ${position === "fixed" ? "ui-grid--fixed" : ""} ${className}`} style={{ "--gs": `${size}px`, "--gop": opacity } as CSSProperties} aria-hidden>
      <div className="ui-grid__layer" />
    </div>
  );
}
