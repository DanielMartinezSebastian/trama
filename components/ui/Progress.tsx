import type { CSSProperties } from "react";
import { vcls, type Variant } from "./variants";

export type ProgressProps = {
  value?: number;
  label?: string;
  showValue?: boolean;
  variant?: Variant;
  /** franjas animadas en la barra */
  striped?: boolean;
  /** dibuja la barra con caracteres: [#####-----] */
  ascii?: boolean;
  /** caracteres del modo ascii: lleno y vacío */
  fillChar?: string;
  emptyChar?: string;
  className?: string;
};

/** Barra de progreso. `ascii` la convierte en texto (por defecto ya lo es en retro y terminal cuando se activa). */
export default function Progress({ value = 62, label = "Subiendo", showValue = true, variant = "glass", striped = false, ascii = false, fillChar = "#", emptyChar = "-", className = "" }: ProgressProps) {
  const v = Math.max(0, Math.min(100, value));
  const cells = 24;
  const filled = Math.round((v / 100) * cells);
  return (
    <div className={`ui-progress ${striped ? "ui-progress--striped" : ""} ${vcls(variant)} ${className}`} style={{ "--v": `${v}%` } as CSSProperties}>
      <div className="ui-progress__head">
        <span>{label}</span>
        {showValue && <output>{Math.round(v)}%</output>}
      </div>
      {ascii ? (
        <pre className="ui-progress__ascii" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
          [{fillChar.repeat(filled)}
          {emptyChar.repeat(cells - filled)}]
        </pre>
      ) : (
        <div className="ui-progress__track" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
          <div className="ui-progress__fill" />
        </div>
      )}
    </div>
  );
}
