"use client";

import { useId } from "react";

export type PickerOption = {
  value: string;
  label: string;
  /** color CSS del círculo (con `kind="swatch"`) */
  color?: string;
  /** agotada o no disponible: se ve tachada y no se elige */
  disabled?: boolean;
};

export type OptionPickerProps = {
  label: string;
  options: PickerOption[];
  value: string;
  onChange: (value: string) => void;
  /** swatch = círculos de color (con su nombre accesible) · chip = botones de texto (tallas, formatos) */
  kind?: "swatch" | "chip";
  /** texto que se muestra junto al nombre de la opción elegida (el color, la talla…) */
  showValue?: boolean;
  className?: string;
};

/**
 * Selector de una opción de producto (color, talla, formato). Son botones de radio nativos con apariencia propia: flechas
 * para moverse, la opción elegida se anuncia y las agotadas quedan deshabilitadas con un tachado visible (no solo color).
 */
export default function OptionPicker({ label, options, value, onChange, kind = "chip", showValue = true, className = "" }: OptionPickerProps) {
  const name = useId();
  const current = options.find((o) => o.value === value);
  return (
    <fieldset className={`ui-opt ${className}`.trim()}>
      <legend className="ui-opt__l">
        {label}
        {showValue && current && <span className="ui-opt__cur">{current.label}</span>}
      </legend>
      <div className="ui-opt__row">
        {options.map((o) => (
          <label key={o.value} className={`ui-opt__o ui-opt__o--${kind}`} data-off={o.disabled ? "" : undefined}>
            <input type="radio" name={name} value={o.value} checked={o.value === value} disabled={o.disabled} onChange={() => onChange(o.value)} />
            {kind === "swatch" ? <i className="ui-opt__sw" style={{ background: o.color }} aria-hidden /> : <span className="ui-opt__chip">{o.label}</span>}
            <span className="ui-sr">{kind === "swatch" ? o.label : ""}{o.disabled ? " (agotado)" : ""}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
