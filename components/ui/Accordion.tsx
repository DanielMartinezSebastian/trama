"use client";

import { useEffect, useMemo, useState } from "react";
import { vcls, type Variant } from "./variants";

export type AccordionProps = {
  /** una entrada por línea con el formato «Pregunta|Respuesta» */
  items?: string;
  /** permite tener varios paneles abiertos a la vez */
  multiple?: boolean;
  defaultOpen?: number;
  variant?: Variant;
  className?: string;
};

/** Acordeón (preguntas frecuentes). El panel se anima con `grid-template-rows`, sin medir alturas en JS. */
export default function Accordion({
  items = "¿Necesito experiencia?|Ninguna. Empezamos desde cero con material blando.\n¿Qué incluye el precio?|Neopreno, tabla, monitor titulado y seguro.\n¿Puedo cancelar?|Hasta 24 horas antes, sin coste.",
  multiple = false,
  defaultOpen = 0,
  variant = "glass",
  className = "",
}: AccordionProps) {
  const rows = useMemo(() => items.split("\n").map((l) => l.split("|")).filter((p) => p[0]?.trim()), [items]);
  const [open, setOpen] = useState<number[]>([defaultOpen]);
  useEffect(() => setOpen([defaultOpen]), [defaultOpen, multiple]);
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : multiple ? [...o, i] : [i]));
  return (
    <div className={`ui-acc ${vcls(variant)} ${className}`}>
      {rows.map(([q, a], i) => (
        <div key={q + i} className={`ui-acc__item ${open.includes(i) ? "is-open" : ""}`}>
          <button className="ui-acc__head" aria-expanded={open.includes(i)} onClick={() => toggle(i)}>
            {q}
            <span className="ui-acc__mark" aria-hidden>+</span>
          </button>
          <div className="ui-acc__panel">
            <div>
              <p>{a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
