"use client";

import { useRef, useState, type FormEvent } from "react";
import { splitList } from "@/lib/ui/list";
import Alert from "./Alert";
import Button from "./Button";
import TextField from "./TextField";
import { vcls, type Variant } from "./variants";

/** Resultado opcional de `onSubmit`: `{ ok: false, message }` muestra el error y conserva lo escrito. */
export type ContactFormResult = { ok: boolean; message?: string };

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
  /** título del aviso de error cuando `onSubmit` devuelve `{ ok: false }` o lanza */
  errorTitle?: string;
  /** texto del error si `onSubmit` falla sin dar un `message` propio */
  errorMessage?: string;
  /** stacked = formulario en columna; inline = campo(s) y botón en una fila (boletín) */
  layout?: "stacked" | "inline";
  variant?: Variant;
  /**
   * Se llama con los datos del formulario al enviarlo. Puede ser asíncrono: mientras la promesa está pendiente el
   * botón muestra la carga; si resuelve `{ ok: false, message }` o lanza, se muestra el error y se conserva lo escrito;
   * si resuelve `{ ok: true }` o nada, el estado de éxito. Sin `onSubmit` (o uno síncrono sin retorno), siempre éxito.
   * Cualquier objeto con `ok: false` cuenta como fallo: devolver directamente la `Response` de `fetch` también vale.
   */
  onSubmit?: ((data: Record<string, string>) => void) | ((data: Record<string, string>) => ContactFormResult | Promise<void | ContactFormResult>);
  className?: string;
};

/**
 * Formulario de contacto (o de boletín, con `fields="email"` y `layout="inline"`). Gestiona su propio
 * estado de envío: carga mientras `onSubmit` trabaja, aviso de error si falla (con lo escrito intacto) y
 * mensaje de éxito con opción de volver a escribir. El envío real (API, proveedor de email…) va en `onSubmit`.
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
  errorTitle = "No se pudo enviar",
  errorMessage = "Inténtalo de nuevo en unos minutos.",
  layout = "stacked",
  variant = "glass",
  onSubmit,
  className = "",
}: ContactFormProps) {
  const list = splitList(fields);
  const has = (k: string) => list.includes(k);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<{ message: string; n: number } | null>(null);
  const busy = useRef(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy.current) return;
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const fail = (message?: string) => {
      setError((prev) => ({ message: message || errorMessage, n: (prev?.n ?? 0) + 1 }));
      setStatus("idle");
    };
    let result: void | ContactFormResult;
    try {
      const r = onSubmit?.(data);
      if (r && typeof (r as Promise<unknown>).then === "function") {
        busy.current = true;
        setError(null);
        setStatus("sending");
        result = await r;
      } else result = r as void | ContactFormResult;
    } catch {
      // un error lanzado (red caída, 500…) no se enseña tal cual: sale `errorMessage`; para un texto propio, devolver { ok: false, message }
      busy.current = false;
      return fail();
    }
    busy.current = false;
    if (result && result.ok === false) return fail(result.message);
    setError(null);
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className={`ui-cform ui-cform--sent ui-surface ${vcls(variant)} ${className}`} role="status">
        <strong>{successTitle}</strong>
        <p>{successMessage}</p>
        <button type="button" className="ui-cform__again" onClick={() => setStatus("idle")}>
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className={`ui-cform ui-cform--${layout} ui-surface ${vcls(variant)} ${className}`} onSubmit={submit} aria-busy={status === "sending" || undefined}>
      {title && <h3>{title}</h3>}
      {subtitle && <p className="ui-cform__sub">{subtitle}</p>}
      <div className="ui-cform__row">
        {has("name") && <TextField label={layout === "inline" ? "" : "Nombre"} name="name" placeholder={namePlaceholder} variant={variant} required />}
        {has("email") && <TextField label={layout === "inline" ? "" : "Email"} name="email" type="email" placeholder={emailPlaceholder} variant={variant} required />}
        {has("message") && <TextField label="Mensaje" name="message" placeholder={messagePlaceholder} variant={variant} multiline rows={4} required />}
        <Button type="submit" label={submitLabel} variant={variant} emphasis="primary" fullWidth={layout === "stacked"} loading={status === "sending"} />
      </div>
      {/* key: cada fallo monta el aviso de nuevo para que role="alert" se anuncie aunque el texto se repita */}
      {error && <Alert key={error.n} className="ui-cform__error" intent="danger" title={errorTitle} message={error.message} variant={variant} dismissible={false} />}
    </form>
  );
}
