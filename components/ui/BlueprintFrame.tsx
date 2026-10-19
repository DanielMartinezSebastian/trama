import type { CSSProperties, ReactNode } from "react";

export type BlueprintFrameProps = {
  children: ReactNode;
  /** regla de marcas milimétricas en los bordes */
  ticks?: boolean;
  /** cruces «+» de registro en las esquinas */
  marks?: boolean;
  /** separación del marco al borde del contenedor (px) */
  inset?: number;
  /** relleno interior (px) */
  padding?: number;
  as?: "div" | "section" | "main";
  className?: string;
};

/**
 * Marco de plano técnico: borde de línea fina con regla de marcas y cruces de registro en las esquinas. Es la «piel» de las
 * webs de producto técnico (arquitectura, ingeniería, herramientas): el contenido vive dentro de un plano. Decorativo (las
 * marcas son `aria-hidden`); sin JS. Combínalo con `CellGrid` para rejillas de celdas con divisores finos.
 */
export default function BlueprintFrame({ children, ticks = true, marks = true, inset = 6, padding = 0, as: Tag = "div", className = "" }: BlueprintFrameProps) {
  return (
    <Tag className={`ui-bp ${ticks ? "ui-bp--ticks" : ""} ${className}`.trim()} style={{ "--bp-inset": `${inset}px`, "--bp-pad": `${padding}px` } as CSSProperties}>
      {marks && (
        <>
          <i className="ui-bp__x ui-bp__x--tl" aria-hidden>+</i>
          <i className="ui-bp__x ui-bp__x--tr" aria-hidden>+</i>
          <i className="ui-bp__x ui-bp__x--bl" aria-hidden>+</i>
          <i className="ui-bp__x ui-bp__x--br" aria-hidden>+</i>
        </>
      )}
      <div className="ui-bp__in">{children}</div>
    </Tag>
  );
}
