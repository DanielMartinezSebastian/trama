import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import { vcls, type Variant } from "./variants";

export type TooltipProps = {
  /** texto disparador cuando no hay `children` (se subraya con puntos, como una abreviatura) */
  label?: string;
  content?: string;
  side?: "top" | "right" | "bottom" | "left";
  variant?: Variant;
  /** el disparador real: un botón, un icono, un enlace… Si es un único elemento, recibe `aria-describedby` */
  children?: ReactNode;
  className?: string;
};

/**
 * Texto de ayuda al posar el ratón o el foco. Solo CSS (sin JS): aparece con `:hover` y con el foco dentro
 * (`:focus-within`), así funciona igual envolviendo un texto que un botón.
 *
 * Con `children`, el disparador es lo que envuelves y el foco lo pone ese elemento (no se añade una parada de
 * tabulador extra). Sin él, se pinta `label` como texto enfocable.
 */
export default function Tooltip({ label = "Pasa el ratón por aquí", content = "Esto es una pista contextual.", side = "top", variant = "glass", children, className = "" }: TooltipProps) {
  const id = useId();
  const wraps = children !== undefined && children !== null;
  const trigger = !wraps
    ? label
    : isValidElement(children)
      ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, { "aria-describedby": id })
      : children;
  return (
    <span className={`ui-tip ui-tip--${side} ${wraps ? "ui-tip--wrap" : ""} ${className}`} tabIndex={wraps ? undefined : 0} aria-describedby={wraps ? undefined : id}>
      {trigger}
      <span id={id} role="tooltip" className={`ui-tip__bubble ui-surface ${vcls(variant)}`}>
        {content}
      </span>
    </span>
  );
}
