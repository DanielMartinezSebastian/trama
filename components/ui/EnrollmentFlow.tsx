"use client";

import { useEffect, useState } from "react";
import { cardError, type CardData } from "@/lib/commerce/card";
import { money } from "@/lib/commerce/money";
import Button from "./Button";
import Stepper from "./Stepper";
import TextField from "./TextField";
import { vcls, type Variant } from "./variants";

export type EnrollmentCohort = {
  /** «Octubre 2026», «Edición de primavera» */
  label: string;
  dates?: string;
  /** abierta, últimas plazas, próximamente (lista de espera) o cerrada (lista de espera) */
  status?: "open" | "few" | "soon" | "closed";
  /** plazas libres, si quieres decirlo */
  seats?: number;
};

export type Enrollment = { id: string; program: string; cohort: string; name: string; email: string; level?: string; waitlist: boolean; paid: number; at: string };

export type EnrollmentFlowProps = {
  /** nombre del curso, programa o viaje */
  program: string;
  cohorts: EnrollmentCohort[];
  /** precio total (se enseña en el resumen) */
  price?: number;
  /** señal para reservar la plaza: si hay, el último paso es pagarla (simulado) */
  deposit?: number;
  /** niveles para elegir (sin lista: no se pregunta) */
  levels?: string[];
  /** una pregunta abierta («¿Qué esperas del curso?»); vacía, no se hace */
  question?: string;
  /** clave de `localStorage` donde se guardan las solicitudes */
  storageKey?: string;
  /** convocatoria elegida al llegar */
  initialCohort?: string;
  /** aviso bajo el formulario */
  note?: string;
  onApply?: (e: Enrollment) => void;
  variant?: Variant;
  className?: string;
};

const ESTADO: Record<NonNullable<EnrollmentCohort["status"]>, string> = { open: "plazas abiertas", few: "últimas plazas", soon: "próximamente", closed: "completa" };

/**
 * Solicitud de plaza en un curso, programa o viaje por convocatorias: elegir convocatoria (las completas o próximas pasan
 * a lista de espera), los datos con nivel y una pregunta, y la señal para reservar la plaza (pago simulado con validación
 * de tarjeta). Confirma con un número de solicitud y la guarda en este navegador. Va con `CohortList`, que enseña las
 * convocatorias, en la ficha del programa.
 */
export default function EnrollmentFlow({
  program,
  cohorts,
  price,
  deposit = 0,
  levels = [],
  question = "",
  storageKey = "trama:solicitudes",
  initialCohort,
  note = "Solicitud de demostración: no se envía ni se cobra nada. Para probar el pago: 4242 4242 4242 4242.",
  onApply,
  variant = "minimal",
  className = "",
}: EnrollmentFlowProps) {
  const [paso, setPaso] = useState(0);
  const [cohorte, setCohorte] = useState(initialCohort ?? cohorts.find((c) => c.status !== "closed" && c.status !== "soon")?.label ?? cohorts[0]?.label ?? "");
  const [datos, setDatos] = useState({ name: "", email: "", level: levels[0] ?? "", answer: "" });
  const [tarjeta, setTarjeta] = useState<CardData>({ holder: "", number: "", exp: "", cvc: "" });
  const [error, setError] = useState("");
  const [hecho, setHecho] = useState<Enrollment | null>(null);
  const [previas, setPrevias] = useState<Enrollment[]>([]);
  useEffect(() => {
    try {
      const v: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(v)) setPrevias(v as Enrollment[]);
    } catch {
      /* sin almacenamiento: solo esta visita */
    }
  }, [storageKey]);

  const c = cohorts.find((x) => x.label === cohorte);
  const espera = c?.status === "soon" || c?.status === "closed";
  const conPago = deposit > 0 && !espera;
  const pasos = ["Convocatoria", "Tus datos", ...(conPago ? ["Reserva de plaza"] : [])].join(", ");
  const ya = previas.find((p) => p.program === program && p.cohort === cohorte);

  const guardar = () => {
    const e: Enrollment = { id: `SOL-${String(1000 + ((Date.now() / 1000) % 9000) | 0)}`, program, cohort: cohorte, name: datos.name.trim(), email: datos.email.trim(), level: datos.level || undefined, waitlist: espera, paid: conPago ? deposit : 0, at: new Date().toISOString() };
    const todas = [...previas.filter((p) => !(p.program === program && p.cohort === cohorte)), e];
    try {
      localStorage.setItem(storageKey, JSON.stringify(todas));
    } catch {
      /* nada */
    }
    setPrevias(todas);
    setHecho(e);
    onApply?.(e);
  };
  const siguiente = () => {
    setError("");
    if (paso === 0 && !cohorte) return setError("Elige una convocatoria.");
    if (paso === 1) {
      if (datos.name.trim().length < 2) return setError("Escribe tu nombre.");
      if (!/^\S+@\S+\.\S+$/.test(datos.email.trim())) return setError("Revisa el correo (por ejemplo, alex@ejemplo.com).");
      if (!conPago) return guardar();
    }
    setPaso(paso + 1);
  };
  const pagar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = cardError(tarjeta);
    if (e) return setError(e);
    setError("");
    guardar();
  };

  if (hecho)
    return (
      <section className={`ui-book ui-book--done ${className}`} aria-live="polite">
        <div className={`ui-book__main ui-surface ${vcls(variant)}`}>
          <p className="ui-book__ok" role="status">
            <span aria-hidden>✓</span> {hecho.waitlist ? "Estás en la lista de espera" : "Plaza reservada"}
          </p>
          <h2>{program}</h2>
          <p>
            {hecho.cohort} · solicitud {hecho.id}
            {hecho.paid ? ` · señal de ${money(hecho.paid)} pagada` : ""}
          </p>
          <p className="ui-book__note">{hecho.waitlist ? `Te escribimos a ${hecho.email} en cuanto abramos plazas.` : `Te hemos enviado los detalles a ${hecho.email}.`} (Demostración: no sale nada.)</p>
          <div className="ui-book__actions">
            <Button label="Otra convocatoria" onClick={() => { setHecho(null); setPaso(0); }} variant={variant} emphasis="outline" />
          </div>
        </div>
      </section>
    );

  return (
    <section className={`ui-book ${className}`}>
      <div className={`ui-book__main ui-surface ${vcls(variant)}`}>
        <Stepper steps={pasos} current={paso} variant={variant} />
        {paso === 0 && (
          <fieldset className="ui-book__group ui-book__step">
            <legend>¿Qué convocatoria?</legend>
            <div className="ui-book__options">
              {cohorts.map((x) => (
                <button key={x.label} type="button" aria-pressed={cohorte === x.label} onClick={() => setCohorte(x.label)}>
                  <b>{x.label}</b>
                  <span>
                    {x.dates ? `${x.dates} · ` : ""}
                    {ESTADO[x.status ?? "open"]}
                    {x.seats && x.status !== "closed" && x.status !== "soon" ? ` · ${x.seats} plazas` : ""}
                  </span>
                </button>
              ))}
            </div>
            {ya && <p className="ui-book__note">Ya tienes una solicitud para esta convocatoria ({ya.id}). Si sigues, la sustituimos.</p>}
          </fieldset>
        )}
        {paso === 1 && (
          <div className="ui-book__step ui-book__form">
            <TextField label="Nombre y apellidos" value={datos.name} onChange={(v) => setDatos({ ...datos, name: v })} autoComplete="name" required variant={variant} />
            <TextField label="Correo" type="email" value={datos.email} onChange={(v) => setDatos({ ...datos, email: v })} autoComplete="email" required variant={variant} />
            {levels.length > 0 && (
              <fieldset className="ui-book__group">
                <legend>Tu nivel</legend>
                <div className="ui-book__choices">
                  {levels.map((l) => (
                    <button key={l} type="button" aria-pressed={datos.level === l} onClick={() => setDatos({ ...datos, level: l })}>
                      <b>{l}</b>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {question && <TextField label={question} multiline rows={3} value={datos.answer} onChange={(v) => setDatos({ ...datos, answer: v })} variant={variant} />}
          </div>
        )}
        {paso === 2 && conPago && (
          <form className="ui-book__step ui-book__form" onSubmit={pagar} noValidate>
            <p className="ui-book__note">Reserva tu plaza con una señal de {money(deposit)}{price ? `; el resto (${money(price - deposit)}) lo pagas al empezar` : ""}.</p>
            <TextField label="Titular" value={tarjeta.holder} onChange={(v) => setTarjeta({ ...tarjeta, holder: v })} autoComplete="cc-name" required variant={variant} />
            <TextField label="Número de tarjeta" value={tarjeta.number} onChange={(v) => setTarjeta({ ...tarjeta, number: v.replace(/[^\d ]/g, "").slice(0, 23) })} autoComplete="cc-number" placeholder="4242 4242 4242 4242" required variant={variant} />
            <div className="ui-checkout__fila">
              <TextField label="Caducidad" value={tarjeta.exp} onChange={(v) => setTarjeta({ ...tarjeta, exp: v.slice(0, 5) })} autoComplete="cc-exp" placeholder="MM/AA" required variant={variant} />
              <TextField label="CVC" value={tarjeta.cvc} onChange={(v) => setTarjeta({ ...tarjeta, cvc: v.replace(/\D/g, "").slice(0, 4) })} autoComplete="cc-csc" placeholder="123" required variant={variant} />
            </div>
            <p className="ui-book__note">{note}</p>
            {error && (
              <p className="ui-book__error" role="alert">
                {error}
              </p>
            )}
            <div className="ui-book__actions">
              <Button label="Atrás" onClick={() => { setError(""); setPaso(1); }} emphasis="outline" variant={variant} />
              <Button label={`Pagar ${money(deposit)} y reservar`} type="submit" variant={variant} />
            </div>
          </form>
        )}
        {paso < 2 && (
          <>
            {paso === 1 && <p className="ui-book__note">{note}</p>}
            {error && (
              <p className="ui-book__error" role="alert">
                {error}
              </p>
            )}
            <div className="ui-book__actions">
              {paso > 0 && <Button label="Atrás" onClick={() => { setError(""); setPaso(0); }} emphasis="outline" variant={variant} />}
              <Button label={paso === 1 && !conPago ? (espera ? "Apuntarme a la lista de espera" : "Enviar solicitud") : "Continuar"} glyph="→" onClick={siguiente} variant={variant} />
            </div>
          </>
        )}
      </div>
      <aside className={`ui-book__summary ui-surface ${vcls(variant)}`} aria-label="Resumen de la solicitud">
        <p className="ui-book__kicker">Tu solicitud</p>
        <h3>{program}</h3>
        <p>{cohorte || "Elige convocatoria"}{c?.dates ? ` · ${c.dates}` : ""}</p>
        {espera && <p>Lista de espera: te avisamos al abrir plazas.</p>}
        {price ? <p>Precio {money(price)}{conPago ? ` · señal ${money(deposit)}` : ""}</p> : null}
        {datos.level && <small>Nivel: {datos.level}</small>}
      </aside>
    </section>
  );
}
