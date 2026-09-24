"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { vcls, type Variant } from "./variants";

export type RangeSliderProps = {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  unit?: string;
  showValue?: boolean;
  variant?: Variant;
  className?: string;
};

/** Deslizador nativo con pista y pulgar adaptados a cada variante. */
export default function RangeSlider({ label = "Intensidad", min = 0, max = 100, step = 1, defaultValue = 40, unit = "%", showValue = true, variant = "glass", className = "" }: RangeSliderProps) {
  const [v, setV] = useState(defaultValue);
  useEffect(() => setV(defaultValue), [defaultValue]);
  const pct = ((v - min) / Math.max(1, max - min)) * 100;
  return (
    <div className={`ui-range ${vcls(variant)} ${className}`} style={{ "--pct": `${pct}%` } as CSSProperties}>
      <div className="ui-range__head">
        <span>{label}</span>
        {showValue && (
          <output>
            {v}
            {unit}
          </output>
        )}
      </div>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => setV(parseFloat(e.target.value))} aria-label={label} />
    </div>
  );
}
