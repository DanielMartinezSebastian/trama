"use client";

import { useEffect, useMemo, useState } from "react";
import { vcls, type Variant } from "./variants";

export type TabsProps = {
  /** pestañas separadas por comas */
  items?: string;
  /** contenido de cada pestaña: una línea por pestaña */
  content?: string;
  defaultIndex?: number;
  /** al cambiar de pestaña, con su índice y su nombre */
  onChange?: (index: number, label: string) => void;
  variant?: Variant;
  className?: string;
};

/** Pestañas con teclado (←/→). El indicador de la activa cambia con la variante. */
export default function Tabs({
  items = "Resumen, Detalles, Reseñas",
  content = "Una vista general del producto.\nEspecificaciones técnicas y medidas.\nLo que dicen quienes ya lo usan.",
  defaultIndex = 0,
  onChange,
  variant = "glass",
  className = "",
}: TabsProps) {
  const tabs = useMemo(() => items.split(",").map((s) => s.trim()).filter(Boolean), [items]);
  const panels = useMemo(() => content.split("\n"), [content]);
  const [i, setI] = useState(defaultIndex);
  useEffect(() => setI(Math.min(defaultIndex, Math.max(0, tabs.length - 1))), [defaultIndex, tabs.length]);
  const cur = Math.min(i, Math.max(0, tabs.length - 1));
  const go = (k: number) => {
    setI(k);
    onChange?.(k, tabs[k]);
  };

  return (
    <div className={`ui-tabs ${vcls(variant)} ${className}`}>
      <div
        role="tablist"
        className="ui-tabs__list"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go((cur + 1) % tabs.length);
          if (e.key === "ArrowLeft") go((cur - 1 + tabs.length) % tabs.length);
        }}
      >
        {tabs.map((t, k) => (
          <button key={t + k} role="tab" aria-selected={k === cur} tabIndex={k === cur ? 0 : -1} className="ui-tabs__tab" onClick={() => go(k)}>
            {t}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="ui-tabs__panel">
        {panels[cur] ?? ""}
      </div>
    </div>
  );
}
