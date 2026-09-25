"use client";

import { useEffect, useMemo, useState } from "react";
import { vcls, type Variant } from "./variants";

export type RadioGroupProps = {
  label?: string;
  options?: string;
  defaultValue?: string;
  /** al elegir una opción */
  onChange?: (value: string) => void;
  variant?: Variant;
  className?: string;
};

/** Selección única entre varias opciones. Retro y terminal las muestran como texto `(•)`/`( )`. */
export default function RadioGroup({ label = "Plan", options = "Mensual, Anual", defaultValue = "Mensual", onChange, variant = "glass", className = "" }: RadioGroupProps) {
  const list = useMemo(() => options.split(",").map((s) => s.trim()).filter(Boolean), [options]);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => setValue(defaultValue), [defaultValue]);

  return (
    <fieldset className={`ui-rgroup ${vcls(variant)} ${className}`}>
      {label && <legend>{label}</legend>}
      {list.map((o) => (
        <label key={o} className="ui-rgroup__item">
          <button type="button" role="radio" aria-checked={o === value} className={`ui-rgroup__dot ${o === value ? "is-on" : ""}`} onClick={() => {
              setValue(o);
              onChange?.(o);
            }}
          />
          {o}
        </label>
      ))}
    </fieldset>
  );
}
