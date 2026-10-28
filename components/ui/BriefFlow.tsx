"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import Stepper from "./Stepper";
import TextField from "./TextField";
import { splitList } from "@/lib/ui/list";
import { vcls, type Variant } from "./variants";

export type BriefService = {
  /** «Formación a medida», «Web y tienda» */
  label: string;
  /** una línea bajo el nombre */
  hint?: string;
};

export type Brief = { id: string; title: string; services: string[]; budget?: string; timeline?: string; details: string; name: string; email: string; company?: string; phone?: string; at: string };

export type BriefFlowProps = {
  /** qué se pide: «Propuesta de formación», «Presupuesto de proyecto» */
  title?: string;
  /** lo que se puede pedir (se eligen uno o varios) */
  services: BriefService[];
  servicesLabel?: string;
  /** rangos de presupuesto, separados por comas («Menos de 10.000 €, 10.000–30.000 €»); vacío, no se pregunta */
  budgets?: string;
  budgetLabel?: string;
  /** plazos, separados por comas («Este trimestre, Antes de seis meses, Sin prisa»); vacío, no se pregunta */
  timelines?: string;
  timelineLabel?: string;
  /** la pregunta abierta sobre el proyecto */
  question?: string;
  /** campos extra de contacto, separados por comas: `company`, `phone` */
  fields?: string;
  /** servicios marcados al llegar (por su `label`) */
  initialServices?: string[];
  /** cuándo se responde («Te respondemos en 48 horas laborables.») */
  responseTime?: string;
  /** prefijo de la referencia («PRO» → PRO-1234) */
  prefix?: string;
  /** clave de `localStorage` donde se guardan las peticiones */
  storageKey?: string;
  /** aviso bajo el formulario */
  note?: string;
  onSend?: (b: Brief) => void;
  variant?: Variant;
  className?: string;
};

/**
 * Petición de propuesta o presupuesto en pasos: qué necesitas (uno o varios servicios, presupuesto y plazo), el proyecto
 * en una pregunta abierta y los datos de contacto (con empresa y teléfono si se piden). Confirma con una referencia, la
 * guarda en este navegador y deja pedir otra. El resumen acompaña al lado. Para agencias, estudios, formación a medida,
 * eventos y fabricantes.
 */
export default function BriefFlow({
  title = "Pide una propuesta",
  services,
  servicesLabel = "¿Qué necesitas?",
  budgets = "",
  budgetLabel = "Presupuesto orientativo",
  timelines = "",
  timelineLabel = "¿Para cuándo?",
  question = "Cuéntanos el proyecto: qué quieres conseguir, para quién y lo que ya tengas.",
  fields = "company",
  initialServices = [],
  responseTime = "Te respondemos en dos días laborables.",
  prefix = "PRO",
  storageKey = "trama:propuestas",
  note = "Petición de demostración: no se envía nada.",
  onSend,
  variant = "minimal",
  className = "",
}: BriefFlowProps) {
  const rangos = splitList(budgets);
  const plazos = splitList(timelines);
  const extra = splitList(fields);
  const [paso, setPaso] = useState(0);
  const [elegidos, setElegidos] = useState<string[]>(initialServices.filter((s) => services.some((x) => x.label === s)));
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [details, setDetails] = useState("");
  const [datos, setDatos] = useState({ name: "", email: "", company: "", phone: "" });
  const [error, setError] = useState("");
  const [hecho, setHecho] = useState<Brief | null>(null);
  const [previas, setPrevias] = useState<Brief[]>([]);
  useEffect(() => {
    try {
      const v: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(v)) setPrevias(v as Brief[]);
    } catch {
      /* sin almacenamiento: solo esta visita */
    }
  }, [storageKey]);

  const alternar = (s: string) => setElegidos(elegidos.includes(s) ? elegidos.filter((x) => x !== s) : [...elegidos, s]);
  const enviar = () => {
    const b: Brief = { id: `${prefix}-${String(1000 + ((Date.now() / 1000) % 9000) | 0)}`, title, services: elegidos, budget: budget || undefined, timeline: timeline || undefined, details: details.trim(), name: datos.name.trim(), email: datos.email.trim(), company: datos.company.trim() || undefined, phone: datos.phone.trim() || undefined, at: new Date().toISOString() };
    const todas = [...previas, b];
    try {
      localStorage.setItem(storageKey, JSON.stringify(todas));
    } catch {
      /* nada */
    }
    setPrevias(todas);
    setHecho(b);
    onSend?.(b);
  };
  const siguiente = () => {
    setError("");
    if (paso === 0) {
      if (!elegidos.length) return setError("Elige al menos una opción.");
      if (rangos.length && !budget) return setError(`Elige: ${budgetLabel.toLowerCase()}.`);
    }
    if (paso === 1 && details.trim().length < 10) return setError("Cuéntanos un poco más (al menos una frase).");
    if (paso === 2) {
      if (datos.name.trim().length < 2) return setError("Escribe tu nombre.");
      if (!/^\S+@\S+\.\S+$/.test(datos.email.trim())) return setError("Revisa el correo (por ejemplo, alex@ejemplo.com).");
      if (extra.includes("company") && datos.company.trim().length < 2) return setError("Escribe el nombre de la empresa.");
      if (datos.phone.trim() && datos.phone.replace(/\D/g, "").length < 9) return setError("Revisa el teléfono (nueve cifras como mínimo).");
      return enviar();
    }
    setPaso(paso + 1);
  };

  if (hecho)
    return (
      <section className={`ui-book ui-book--done ${className}`} aria-live="polite">
        <div className={`ui-book__main ui-surface ${vcls(variant)}`}>
          <p className="ui-book__ok" role="status">
            <span aria-hidden>✓</span> Petición enviada
          </p>
          <h2>{title}</h2>
          <p>
            Referencia {hecho.id} · {hecho.services.join(", ")}
          </p>
          <p className="ui-book__note">
            {responseTime} Te escribimos a {hecho.email}. (Demostración: no sale nada.)
          </p>
          <div className="ui-book__actions">
            <Button label="Pedir otra" onClick={() => { setHecho(null); setPaso(0); setDetails(""); }} variant={variant} emphasis="outline" />
          </div>
        </div>
      </section>
    );

  return (
    <section className={`ui-book ${className}`}>
      <div className={`ui-book__main ui-surface ${vcls(variant)}`}>
        <Stepper steps="Qué necesitas, El proyecto, Tus datos" current={paso} variant={variant} />
        {paso === 0 && (
          <div className="ui-book__step">
            <fieldset className="ui-book__group">
              <legend>{servicesLabel}</legend>
              <div className="ui-book__options">
                {services.map((s) => (
                  <button key={s.label} type="button" aria-pressed={elegidos.includes(s.label)} onClick={() => alternar(s.label)}>
                    <b>{s.label}</b>
                    {s.hint && <span>{s.hint}</span>}
                  </button>
                ))}
              </div>
            </fieldset>
            {rangos.length > 0 && (
              <fieldset className="ui-book__group">
                <legend>{budgetLabel}</legend>
                <div className="ui-book__choices">
                  {rangos.map((r) => (
                    <button key={r} type="button" aria-pressed={budget === r} onClick={() => setBudget(r)}>
                      <b>{r}</b>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {plazos.length > 0 && (
              <fieldset className="ui-book__group">
                <legend>{timelineLabel}</legend>
                <div className="ui-book__choices">
                  {plazos.map((r) => (
                    <button key={r} type="button" aria-pressed={timeline === r} onClick={() => setTimeline(timeline === r ? "" : r)}>
                      <b>{r}</b>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        )}
        {paso === 1 && (
          <div className="ui-book__step ui-book__form">
            <TextField label={question} multiline rows={6} value={details} onChange={setDetails} required variant={variant} />
          </div>
        )}
        {paso === 2 && (
          <div className="ui-book__step ui-book__form">
            <TextField label="Nombre y apellidos" value={datos.name} onChange={(v) => setDatos({ ...datos, name: v })} autoComplete="name" required variant={variant} />
            <TextField label="Correo" type="email" value={datos.email} onChange={(v) => setDatos({ ...datos, email: v })} autoComplete="email" required variant={variant} />
            {extra.includes("company") && <TextField label="Empresa" value={datos.company} onChange={(v) => setDatos({ ...datos, company: v })} autoComplete="organization" required variant={variant} />}
            {extra.includes("phone") && <TextField label="Teléfono (opcional)" type="tel" value={datos.phone} onChange={(v) => setDatos({ ...datos, phone: v })} autoComplete="tel" variant={variant} />}
            <p className="ui-book__note">{note}</p>
          </div>
        )}
        {error && (
          <p className="ui-book__error" role="alert">
            {error}
          </p>
        )}
        <div className="ui-book__actions">
          {paso > 0 && <Button label="Atrás" onClick={() => { setError(""); setPaso(paso - 1); }} emphasis="outline" variant={variant} />}
          <Button label={paso === 2 ? "Enviar petición" : "Continuar"} glyph="→" onClick={siguiente} variant={variant} />
        </div>
      </div>
      <aside className={`ui-book__summary ui-surface ${vcls(variant)}`} aria-label="Resumen de la petición">
        <p className="ui-book__kicker">Tu petición</p>
        <h3>{title}</h3>
        <p>{elegidos.length ? elegidos.join(" · ") : "Elige qué necesitas"}</p>
        {budget && <p>{budget}</p>}
        {timeline && <small>{timeline}</small>}
      </aside>
    </section>
  );
}
