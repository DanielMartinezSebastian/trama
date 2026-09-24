"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { vcls, type Variant } from "./variants";

export type SelectProps = {
  label?: string;
  options?: string;
  defaultValue?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  variant?: Variant;
  className?: string;
};

/**
 * Desplegable con estilo propio, no un `<select>` nativo: un `<select>` real no se puede reskinar por
 * dentro (la lista abierta la pinta el sistema operativo), así que esto es un botón + una lista
 * absoluta, igual de accesible (`aria-haspopup`, `role="listbox"`) pero con los mismos 7 estilos que
 * el resto del kit, abierto o cerrado.
 */
export default function Select({
  label = "País",
  options = "España, Francia, Portugal, Italia, Alemania",
  defaultValue = "",
  placeholder = "Elige una opción",
  size = "md",
  variant = "glass",
  className = "",
}: SelectProps) {
  const list = useMemo(() => options.split(",").map((s) => s.trim()).filter(Boolean), [options]);
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => setValue(defaultValue), [defaultValue]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={root} className={`ui-select ui-select--${size} ${className}`}>
      {label && <span className="ui-select__label">{label}</span>}
      <button type="button" className={`ui-select__trigger ui-surface ${vcls(variant)}`} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className={value ? undefined : "ui-select__placeholder"}>{value || placeholder}</span>
        <span className="ui-select__mark" aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <ul className={`ui-select__list ui-surface ${vcls(variant)}`} role="listbox">
          {list.map((o) => (
            <li key={o}>
              <button
                type="button"
                role="option"
                aria-selected={o === value}
                className={`ui-select__opt ${o === value ? "is-selected" : ""}`}
                onClick={() => {
                  setValue(o);
                  setOpen(false);
                }}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
