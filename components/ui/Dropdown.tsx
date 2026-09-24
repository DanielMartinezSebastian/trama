"use client";

import { useEffect, useRef, useState } from "react";
import { vcls, type Variant } from "./variants";

export type DropdownProps = {
  label?: string;
  items?: string;
  align?: "left" | "right";
  variant?: Variant;
  className?: string;
};

/** Menú de acciones (⋮): un botón que abre una lista de comandos, no un formulario de selección (ver Select). */
export default function Dropdown({ label = "⋮", items = "Editar, Duplicar, Archivar, Eliminar", align = "right", variant = "glass", className = "" }: DropdownProps) {
  const list = items.split(",").map((s) => s.trim()).filter(Boolean);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={root} className={`ui-ddown ${className}`}>
      <button type="button" className={`ui-ddown__trigger ui-surface ${vcls(variant)}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {label}
      </button>
      {open && (
        <ul role="menu" className={`ui-ddown__menu ui-ddown__menu--${align} ui-surface ${vcls(variant)}`}>
          {list.map((o) => (
            <li key={o}>
              <button type="button" role="menuitem" className="ui-ddown__item" onClick={() => setOpen(false)}>
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
