import { vcls, type Variant } from "./variants";

export type StepperProps = {
  steps?: string;
  /** índice (0-based) del paso activo; los anteriores se marcan como hechos */
  current?: number;
  variant?: Variant;
  className?: string;
};

/** Indicador de progreso por pasos (alta, checkout, onboarding…). No gestiona el contenido de cada paso. */
export default function Stepper({ steps = "Datos, Envío, Pago, Confirmación", current = 1, variant = "glass", className = "" }: StepperProps) {
  const list = steps.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <ol className={`ui-steps ${vcls(variant)} ${className}`}>
      {list.map((s, i) => (
        <li key={s + i} className={`ui-steps__item ${i < current ? "is-done" : ""} ${i === current ? "is-current" : ""}`}>
          <span className="ui-steps__mark" aria-hidden>
            {i < current ? "✓" : i + 1}
          </span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}
