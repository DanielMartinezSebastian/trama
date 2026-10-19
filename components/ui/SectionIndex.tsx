"use client";

import { useEffect, useState } from "react";

export type SectionIndexProps = {
  /** selector de las secciones a seguir; su nombre sale del atributo `data-section` */
  selector?: string;
  position?: "left" | "right";
  className?: string;
};

/**
 * Indicador fijo «02 / 05 · Servicios» que sigue a la sección que cruza la mitad de la pantalla. Marca tus secciones con
 * `data-section="Nombre"`. No aparece hasta que hay al menos dos. Oculto para el lector de pantalla (es decorativo; la
 * estructura real son tus encabezados).
 */
export default function SectionIndex({ selector = "[data-section]", position = "left", className = "" }: SectionIndexProps) {
  const [state, setState] = useState<{ i: number; names: string[] }>({ i: 0, names: [] });

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const names = els.map((e) => e.dataset.section ?? "");
    setState({ i: 0, names });
    if (els.length < 2) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setState({ i: els.indexOf(e.target as HTMLElement), names });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [selector]);

  if (state.names.length < 2) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className={`ui-sidx ui-sidx--${position} ${className}`.trim()} aria-hidden>
      <span>{pad(state.i + 1)} / {pad(state.names.length)}</span>
      <span>{state.names[state.i]}</span>
    </div>
  );
}
