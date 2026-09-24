import { intentCls, toIntent, type Intent, type LegacyIntent } from "./intent";
import { vcls, type Variant } from "./variants";

export type BadgeProps = {
  text: string;
  variant?: Variant;
  /** color semántico, el mismo vocabulario que Button, Alert, TextField y Toast (ver intent.ts) */
  intent?: Intent | LegacyIntent;
  /** @deprecated nombre antiguo de `intent` (aceptaba `warn`); se mantiene por compatibilidad */
  tone?: Intent | LegacyIntent;
  size?: "md" | "lg";
  dot?: boolean;
  className?: string;
};

/** Etiqueta de estado con color semántico (`intent`). */
export default function Badge({ text, variant = "glass", intent, tone, size = "md", dot = false, className = "" }: BadgeProps) {
  const i = toIntent(intent ?? tone, "accent");
  return (
    <span className={`ui-badge ${intentCls(i)} ${size === "lg" ? "ui-badge--lg" : ""} ${vcls(variant)} ${className}`}>
      {dot && <i className="ui-badge__dot" aria-hidden />}
      {text}
    </span>
  );
}
