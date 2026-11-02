"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import type { Variant } from "@/components/ui/variants";
import { AVISO_RESERVA, localizador } from "./data";

/*
 * Lógica de reserva compartida: mismo recorrido y mismos estados (error, confirmación) en las tres versiones.
 * Cada versión decide dónde vive y cómo se ve mediante `variant`, tokens y su propio CSS.
 */
export function ReservaCampos({ resumen, plaza, variant, etiqueta = "Reservar plaza", className, onHecho }: {
  resumen: string; plaza: string; variant: Variant; etiqueta?: string; className?: string; onHecho?: () => void;
}) {
  const [error, setError] = useState("");
  const [hecho, setHecho] = useState("");

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const nombre = String(datos.get("nombre") ?? "").trim();
    const correo = String(datos.get("correo") ?? "").trim();
    if (!plaza) return setError("Falta elegir plaza.");
    if (!nombre) return setError("Falta el nombre de quien viaja.");
    if (!/^\S+@\S+\.\S+$/.test(correo)) return setError("Ese correo no parece válido.");
    setError("");
    setHecho(localizador(nombre, resumen));
    onHecho?.();
  }

  if (hecho) {
    return <div className={className} role="status">
      <p data-lucero="localizador">{hecho}</p>
      <p>Plaza apartada: {resumen}.</p>
      <p>{AVISO_RESERVA}</p>
      <Button label="Hacer otra reserva" variant={variant} emphasis="link" onClick={() => setHecho("")} />
    </div>;
  }

  return <form className={className} onSubmit={enviar} noValidate>
    <p>{plaza ? resumen : "Elige plaza para continuar."}</p>
    <TextField name="nombre" label="Nombre" placeholder="Nombre y apellido" hint="" prefix="" autoComplete="name" variant={variant} />
    <TextField name="correo" type="email" label="Correo" placeholder="nombre@correo.com" hint="" prefix="" autoComplete="email" variant={variant} intent={error ? "danger" : undefined} />
    {error ? <p role="alert">{error}</p> : null}
    <Button label={etiqueta} type="submit" variant={variant} fullWidth />
    <small>{AVISO_RESERVA}</small>
  </form>;
}
