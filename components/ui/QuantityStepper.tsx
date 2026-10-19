"use client";

import { useId } from "react";

export type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** nombre del producto, para el texto accesible de los botones */
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

/** Selector de cantidad con − y +. Los botones nombran el producto («Quitar una unidad de Taza»); el valor se anuncia al cambiar. */
export default function QuantityStepper({ value, onChange, min = 1, max = 99, label = "producto", size = "md", className = "" }: QuantityStepperProps) {
  const id = useId();
  const set = (n: number) => onChange(Math.min(max, Math.max(min, n)));
  return (
    <span className={`ui-qty ui-qty--${size} ${className}`.trim()} role="group" aria-label={`Cantidad de ${label}`}>
      <button type="button" className="ui-qty__b" onClick={() => set(value - 1)} disabled={value <= min} aria-label={`Quitar una unidad de ${label}`}>
        <span aria-hidden>−</span>
      </button>
      <output id={id} className="ui-qty__v" aria-live="polite">{value}</output>
      <button type="button" className="ui-qty__b" onClick={() => set(value + 1)} disabled={value >= max} aria-label={`Añadir una unidad de ${label}`}>
        <span aria-hidden>+</span>
      </button>
    </span>
  );
}
