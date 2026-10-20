import type { CSSProperties } from "react";
import { CONTOUR_VIEWBOX, contourPath } from "@/lib/ui/contours";

export type GridBackgroundProps = {
  /** grain = grano de papel (ruido fijo, sin canvas), para poner encima de todo con `position="fixed"` */
  kind?: "dots" | "lines" | "cross" | "diagonal" | "grain" | "contour";
  /** con `kind="contour"`: cambia el dibujo de las curvas de nivel (mismo número, mismo dibujo) */
  seed?: number;
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

/**
 * Fondo de rejilla en CSS puro (sin canvas): la opción más ligera para fondos discretos. Rellena su contenedor.
 * `contour` son curvas de nivel en SVG calculadas en el servidor (`lib/ui/contours.ts`); `cellSize` no les afecta.
 */
export default function GridBackground({ kind = "dots", cellSize, size: legacySize, opacity = 0.6, fade = true, drift = false, position = "absolute", seed = 7, className = "" }: GridBackgroundProps) {
  const size = cellSize ?? legacySize ?? 28;
  return (
    <div className={`ui-grid ui-grid--${kind} ${fade ? "ui-grid--fade" : ""} ${drift ? "ui-grid--drift" : ""} ${position === "fixed" ? "ui-grid--fixed" : ""} ${className}`} style={{ "--gs": `${size}px`, "--gop": opacity } as CSSProperties} aria-hidden>
      {kind === "contour" ? (
        <svg className="ui-grid__layer" viewBox={CONTOUR_VIEWBOX} preserveAspectRatio="xMidYMid slice">
          <path d={contourPath(seed)} fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
      ) : (
        <div className="ui-grid__layer" />
      )}
    </div>
  );
}
