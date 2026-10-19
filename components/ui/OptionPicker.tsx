"use client";

import { useId } from "react";

export type PickerOption = {
  value: string;
  label: string;
  /** color CSS del círculo (con `kind="swatch"`) */
  color?: string;
  /** agotada o no disponible: se ve tachada y no se elige */
  disabled?: boolean;
  /** texto corto que se ve en el chip («1», «S»); `label` pasa a ser solo el nombre accesible */
  short?: string;
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
  /** oculta el título a la vista (sigue siendo el nombre del grupo para el lector de pantalla) */
  hideLabel?: boolean;
  className?: string;
};

/**
 * Selección única con apariencia propia: variante de producto (color, talla, formato) o cualquier selector segmentado
 * (cambio de vista «① ② ③», «Mapa / Lista»). Son botones de radio nativos: flechas para moverse, la opción elegida se
 * anuncia y las agotadas quedan deshabilitadas con un tachado visible (no solo color).
 */
export default function OptionPicker({ label, options, value, onChange, kind = "chip", showValue = true, hideLabel = false, className = "" }: OptionPickerProps) {
  const name = useId();
  const current = options.find((o) => o.value === value);
  return (
    <fieldset className={`ui-opt ${className}`.trim()}>
      <legend className={hideLabel ? "ui-sr" : "ui-opt__l"}>
        {label}
        {showValue && current && <span className="ui-opt__cur">{current.label}</span>}
      </legend>
      <div className="ui-opt__row">
        {options.map((o) => (
          <label key={o.value} className={`ui-opt__o ui-opt__o--${kind}`} data-off={o.disabled ? "" : undefined}>
            <input type="radio" name={name} value={o.value} checked={o.value === value} disabled={o.disabled} onChange={() => onChange(o.value)} />
            {kind === "swatch" ? <i className="ui-opt__sw" style={{ background: o.color }} aria-hidden /> : <span className="ui-opt__chip" aria-hidden={o.short ? true : undefined}>{o.short ?? o.label}</span>}
            <span className="ui-sr">{kind === "swatch" || o.short ? o.label : ""}{o.disabled ? " (agotado)" : ""}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
