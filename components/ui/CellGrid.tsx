import { Children, type CSSProperties, type ReactNode } from "react";

export type CellGridProps = {
  /** cada hijo directo es una celda */
  children: ReactNode;
  /** columnas en pantallas anchas (en estrechas colapsa a 2 y luego a 1) */
  columns?: 1 | 2 | 3 | 4 | 5;
  /** divisor: continuo o discontinuo */
  line?: "solid" | "dashed";
  /** relleno de cada celda (px) */
  padding?: number;
  className?: string;
};

/**
 * Rejilla de celdas separadas por divisores de línea fina (continuos o discontinuos), al estilo de los planos técnicos: sin
 * tarjetas ni sombras, solo estructura. CSS puro. Los divisores se dibujan con el hueco de la rejilla, así que funcionan con
 * cualquier número de celdas y en cualquier ancho sin dobles bordes.
 */
export default function CellGrid({ children, columns = 4, line = "solid", padding = 24, className = "" }: CellGridProps) {
  return (
    <div className={`ui-cells ui-cells--${line} ${className}`.trim()} style={{ "--cells": columns, "--cells-pad": `${padding}px` } as CSSProperties}>
      {Children.toArray(children).map((c, i) => (
        <div key={i} className="ui-cells__c">
          {c}
        </div>
      ))}
    </div>
  );
}
