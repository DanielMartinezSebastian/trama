"use client";

import { useState, type FormEvent } from "react";
import Button from "./Button";
import TextField from "./TextField";
import { vcls, type Variant } from "./variants";

export type ContactFormProps = {
  title?: string;
  subtitle?: string;
  /** qué campos mostrar, separados por comas: "name,email,message" (contacto) o "email" (boletín) */
  fields?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  successTitle?: string;
  successMessage?: string;
  /** stacked = formulario en columna; inline = campo(s) y botón en una fila (boletín) */
  layout?: "stacked" | "inline";
  variant?: Variant;
  /** se llama con los datos del formulario al enviarlo; la demo siempre muestra el estado de éxito */
  onSubmit?: (data: Record<string, string>) => void;
  className?: string;
};

/**
 * Formulario de contacto (o de boletín, con `fields="email"` y `layout="inline"`). Gestiona su propio
 * estado de envío: al enviarlo muestra un mensaje de éxito con opción de volver a escribir. El envío
 * real (llamada a la API, proveedor de email…) se conecta con `onSubmit`.
 */
export default function ContactForm({
  title = "Escríbenos",
  subtitle = "Te respondemos en menos de 24 horas.",
  fields = "name,email,message",
  namePlaceholder = "Tu nombre",
  emailPlaceholder = "tu@correo.com",
  messagePlaceholder = "Cuéntanos qué necesitas…",
  submitLabel = "Enviar mensaje",
  successTitle = "Mensaje enviado",
  successMessage = "Gracias, te contestaremos pronto.",
  layout = "stacked",
  variant = "glass",
  onSubmit,
  className = "",
}: ContactFormProps) {
  const list = fields.split(",").map((s) => s.trim());
  const has = (k: string) => list.includes(k);
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    onSubmit?.(data);
    setSent(true);
  };

  if (sent) {
    return (
      <div className={`ui-cform ui-cform--sent ui-surface ${vcls(variant)} ${className}`}>
        <strong>{successTitle}</strong>
        <p>{successMessage}</p>
        <button type="button" className="ui-cform__again" onClick={() => setSent(false)}>
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className={`ui-cform ui-cform--${layout} ui-surface ${vcls(variant)} ${className}`} onSubmit={submit}>
      {title && <h3>{title}</h3>}
      {subtitle && <p className="ui-cform__sub">{subtitle}</p>}
      <div className="ui-cform__row">
        {has("name") && <TextField label={layout === "inline" ? "" : "Nombre"} name="name" placeholder={namePlaceholder} variant={variant} required />}
        {has("email") && <TextField label={layout === "inline" ? "" : "Email"} name="email" type="email" placeholder={emailPlaceholder} variant={variant} required />}
        {has("message") && <TextField label="Mensaje" name="message" placeholder={messagePlaceholder} variant={variant} multiline rows={4} required />}
        <Button type="submit" label={submitLabel} variant={variant} emphasis="primary" fullWidth={layout === "stacked"} />
      </div>
    </form>
  );
}
