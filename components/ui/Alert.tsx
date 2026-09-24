"use client";

import { useEffect, useState } from "react";
import { intentCls, toIntent, type Intent, type LegacyIntent } from "./intent";
import { vcls, type Variant } from "./variants";

export type AlertProps = {
  title?: string;
  message?: string;
  /** color semántico, el mismo vocabulario que Button, Badge, TextField y Toast (ver intent.ts) */
  intent?: Intent | LegacyIntent;
  /** @deprecated nombre antiguo de `intent` (aceptaba `error`); se mantiene por compatibilidad */
  kind?: Intent | LegacyIntent;
  variant?: Variant;
  dismissible?: boolean;
  className?: string;
};

const ICONS: Record<Intent, string> = { accent: "*", neutral: "·", info: "i", success: "ok", warning: "!", danger: "x" };

/** Aviso o toast con icono según el tipo. Se puede cerrar y vuelve a aparecer si cambian las props. */
export default function Alert({ title = "Cambios guardados", message = "Tu perfil se actualizó correctamente.", intent, kind, variant = "glass", dismissible = true, className = "" }: AlertProps) {
  const i = toIntent(intent ?? kind, "success");
  const [open, setOpen] = useState(true);
  useEffect(() => setOpen(true), [title, message, i, variant]);
  if (!open) return <button className="ui-hint" style={{ background: "none", border: 0, cursor: "pointer" }} onClick={() => setOpen(true)}>Mostrar de nuevo el aviso</button>;
  return (
    <div role={i === "danger" ? "alert" : "status"} className={`ui-alert ${intentCls(i)} ui-surface ${vcls(variant)} ${className}`}>
      <span className="ui-alert__icon" aria-hidden>{ICONS[i]}</span>
      <div className="ui-alert__body">
        {title && <strong>{title}</strong>}
        {message && <span>{message}</span>}
      </div>
      {dismissible && (
        <button className="ui-alert__close" aria-label="Cerrar" onClick={() => setOpen(false)}>
          ×
        </button>
      )}
    </div>
  );
}
