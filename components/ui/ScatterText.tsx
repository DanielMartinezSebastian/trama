"use client";

import { createElement, useEffect, useRef, type CSSProperties } from "react";
import { clamp01, trackScroll } from "@/lib/motion/progress";

export type ScatterTextProps = {
  children: string;
  /** exit: se dispersa y se desvanece al salir de la pantalla por arriba · enter: se recompone al entrar por abajo */
  mode?: "exit" | "enter";
  /** cuánto se separan las letras del centro (px) */
  spread?: number;
  /** desplazamiento vertical de las letras (px, positivo = hacia arriba) */
  lift?: number;
  /** selector del ancestro cuyo scroll marca el progreso (para titulares dentro de una sección fijada con `position: sticky`, que no se mueven por sí solos) */
  scope?: string;
  as?: "h1" | "h2" | "div" | "p";
  className?: string;
};

/**
 * Titular de letras que se separan y se desvanecen con el scroll: la marca gigante de un hero que «se disuelve» al bajar
 * (o que se compone al llegar). Un cálculo por fotograma fija `--p` (0–1) en el contenedor y cada letra lo traduce con CSS.
 * El texto íntegro está en una copia para lectores de pantalla; con `prefers-reduced-motion` se ve siempre entero y quieto.
 */
export default function ScatterText({ children: text, mode = "exit", spread = 220, lift = 40, scope, as = "div", className = "" }: ScatterTextProps) {
  const ref = useRef<HTMLElement>(null);
  const chars = Array.from(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = scope ? el.closest<HTMLElement>(scope) : null;
    // con `scope`: progreso del recorrido de la sección contenedora (0 al entrar, 1 cuando termina de pasar)
    if (host) {
      return trackScroll(host, (r, vh) => el.style.setProperty("--p", clamp01(-r.top / Math.max(1, r.height - vh)).toFixed(4)));
    }
    return trackScroll(el, (r, vh) => {
      const p = mode === "exit" ? clamp01(-r.top / Math.max(1, r.height * 1.1)) : clamp01(1 - (vh - r.top) / Math.max(1, vh * 0.7));
      el.style.setProperty("--p", p.toFixed(4));
    });
  }, [mode, scope]);

  return createElement(
    as,
    { ref, className: `ui-scatter ${className}`.trim(), style: { "--spread": `${spread}px`, "--lift": `${lift}px`, "--n": chars.length, "--p": 0 } as CSSProperties },
    <span className="ui-sr">{text}</span>,
    <span aria-hidden className="ui-scatter__w">
      {chars.map((c, i) => (
        <span key={i} className="ui-scatter__c" style={{ "--i": i } as CSSProperties}>
          {c === " " ? " " : c}
        </span>
      ))}
    </span>,
  );
}
