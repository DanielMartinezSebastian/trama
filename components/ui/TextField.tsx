"use client";

import { useState } from "react";
import { intentCls, toIntent, type Intent, type LegacyIntent } from "./intent";
import { vcls, type Variant } from "./variants";

export type TextFieldProps = {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
  /** estado de validación con el vocabulario común (ver intent.ts): `danger` marca el campo como inválido (aria-invalid) */
  intent?: Exclude<Intent, "accent" | "neutral"> | LegacyIntent;
  /** @deprecated nombre antiguo de `intent`: "default" | "error" | "success" */
  state?: "default" | "error" | "success";
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  /** carácter delante del texto (@, >, $…) */
  prefix?: string;
  type?: "text" | "email" | "password" | "search";
  /** nombre del campo, para leerlo con `FormData` (ver `ContactForm`) */
  name?: string;
  /** dibuja un `<textarea>` en vez de un `<input>` */
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  className?: string;
};

/** Campo de texto con etiqueta, ayuda y estados. El foco y los estados usan `--acc` / colores semánticos. */
export default function TextField({
  label = "Correo electrónico",
  placeholder = "tu@correo.com",
  defaultValue = "",
  hint = "",
  intent,
  state,
  variant = "glass",
  size = "md",
  prefix = "",
  type = "text",
  name,
  multiline = false,
  rows = 4,
  required = false,
  className = "",
}: TextFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const raw = intent ?? (state && state !== "default" ? state : undefined);
  const i = raw ? toIntent(raw, "info") : undefined;
  const invalid = i === "danger" || undefined;
  return (
    <label className={`ui-field ui-field--${size} ${i ? `ui-field--state ${intentCls(i)}` : ""} ${multiline ? "ui-field--multiline" : ""} ${className}`}>
      {label && <span className="ui-field__label">{label}</span>}
      <span className={`ui-field__box ui-surface ${vcls(variant)}`}>
        {prefix && <span className="ui-field__prefix" aria-hidden>{prefix}</span>}
        {multiline ? (
          <textarea key={defaultValue} aria-invalid={invalid} name={name} rows={rows} placeholder={placeholder} value={value} required={required} onChange={(e) => setValue(e.target.value)} />
        ) : (
          <input key={defaultValue} aria-invalid={invalid} type={type} name={name} placeholder={placeholder} value={value} required={required} onChange={(e) => setValue(e.target.value)} />
        )}
      </span>
      {hint && <span className="ui-field__hint">{hint}</span>}
    </label>
  );
}
