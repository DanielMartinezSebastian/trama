"use client";

import { useEffect, useMemo, useState } from "react";
import { vcls, type Variant } from "./variants";

export type CheckboxGroupProps = {
  label?: string;
  options?: string;
  /** valores marcados al inicio, separados por comas */
  defaultValue?: string;
  /** al marcar o desmarcar, con todos los valores marcados */
  onChange?: (values: string[]) => void;
  variant?: Variant;
  className?: string;
};

/** Lista de casillas independientes. Retro y terminal las muestran como texto `[x]`/`[ ]` (ver CSS `--s-ff`). */
export default function CheckboxGroup({
  label = "Notificaciones",
  options = "Email, SMS, Push, Newsletter",
  defaultValue = "Email, Push",
  onChange,
  variant = "glass",
  className = "",
}: CheckboxGroupProps) {
  const list = useMemo(() => options.split(",").map((s) => s.trim()).filter(Boolean), [options]);
  const initial = useMemo(() => new Set(defaultValue.split(",").map((s) => s.trim()).filter(Boolean)), [defaultValue]);
  const [checked, setChecked] = useState(initial);
  useEffect(() => setChecked(initial), [initial]);

  const toggle = (o: string) => {
    const next = new Set(checked);
    if (next.has(o)) next.delete(o);
    else next.add(o);
    setChecked(next);
    onChange?.(list.filter((x) => next.has(x)));
  };

  return (
    <fieldset className={`ui-cgroup ${vcls(variant)} ${className}`}>
      {label && <legend>{label}</legend>}
      {list.map((o) => (
        <label key={o} className="ui-cgroup__item">
          <button type="button" role="checkbox" aria-checked={checked.has(o)} className={`ui-cgroup__box ${checked.has(o) ? "is-on" : ""}`} onClick={() => toggle(o)}>
            <span aria-hidden>✓</span>
          </button>
          {o}
        </label>
      ))}
    </fieldset>
  );
}
