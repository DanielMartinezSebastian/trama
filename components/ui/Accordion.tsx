"use client";

import { useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";
import { splitEscaped } from "@/lib/ui/list";
import { vcls, type Variant } from "./variants";

export type AccordionProps = {
  /** una entrada por línea con el formato «Pregunta|Respuesta» */
  items?: string;
  /** permite tener varios paneles abiertos a la vez */
  multiple?: boolean;
  defaultOpen?: number;
  /** Tarjetas o filas separadas por líneas, independiente del tema. */
  presentation?: "cards" | "lines";
  /** Alineación de las respuestas, independiente de la cabecera de sección. */
  answerAlign?: "inherit" | "left" | "center";
  variant?: Variant;
  className?: string;
};

/** Acordeón (preguntas frecuentes). El panel se anima con `grid-template-rows`, sin medir alturas en JS. */
export default function Accordion({
  items = "¿Necesito experiencia?|Ninguna. Empezamos desde cero con material blando.\n¿Qué incluye el precio?|Neopreno, tabla, monitor titulado y seguro.\n¿Puedo cancelar?|Hasta 24 horas antes, sin coste.",
  multiple = false,
  defaultOpen = 0,
  presentation = "cards",
  answerAlign = "inherit",
  variant = "glass",
  className = "",
}: AccordionProps) {
  const uid = useId();
  const rows = useMemo(() => items.split("\n").map((l) => splitEscaped(l, "|")).filter((p) => p[0]?.trim()), [items]);
  const [open, setOpen] = useState<number[]>([defaultOpen]);
  useEffect(() => setOpen([defaultOpen]), [defaultOpen, multiple]);
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : multiple ? [...o, i] : [i]));
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const buttons = event.currentTarget.closest(".ui-acc")?.querySelectorAll<HTMLButtonElement>(".ui-acc__head");
    const next = event.key === "Home" ? 0 : event.key === "End" ? rows.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length;
    buttons?.[next]?.focus();
  };
  return (
    <div className={`ui-acc ui-acc--${presentation} ${vcls(variant)} ${className}`} data-answer-align={answerAlign}>
      {rows.map(([q, a], i) => (
        <div key={q + i} className={`ui-acc__item ${open.includes(i) ? "is-open" : ""}`}>
          <button type="button" id={`${uid}-question-${i}`} className="ui-acc__head" aria-controls={`${uid}-answer-${i}`} aria-expanded={open.includes(i)} onClick={() => toggle(i)} onKeyDown={(e) => navigate(e, i)}>
            <span>{q}</span>
            <span className="ui-acc__mark" aria-hidden>+</span>
          </button>
          <div id={`${uid}-answer-${i}`} className="ui-acc__panel" role="region" aria-labelledby={`${uid}-question-${i}`} aria-hidden={!open.includes(i)} inert={!open.includes(i)}>
            <div>
              <p>{a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
