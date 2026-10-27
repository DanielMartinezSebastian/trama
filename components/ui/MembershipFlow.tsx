"use client";

import { useState } from "react";
import { cardError, type CardData } from "@/lib/commerce/card";
import { money } from "@/lib/commerce/money";
import { useMembership } from "@/lib/commerce/membership";
import Button from "./Button";
import QRCode from "./QRCode";
import Stepper from "./Stepper";
import TextField from "./TextField";
import { vcls, type Variant } from "./variants";

export type MembershipPlanOption = { id: string; name: string; price: number; period?: string; features?: string[]; highlight?: boolean };

export type MembershipFlowProps = {
  plans: MembershipPlanOption[];
  /** plan elegido al llegar (`?plan=` desde la tabla de precios) */
  initialPlan?: string;
  /** matrícula (0 = sin matrícula) */
  signupFee?: number;
  /** clave de `localStorage` del socio (la misma que `MemberArea` y la reserva de clases) */
  storageKey?: string;
  /** nombre del club, para el pase */
  club?: string;
  /** enlaces de la confirmación */
  scheduleHref?: string;
  accountHref?: string;
  note?: string;
  variant?: Variant;
  className?: string;
};

/**
 * Alta en un plan de gimnasio, estudio o club, en pasos: plan, datos (con fecha de nacimiento para la edad mínima) y pago
 * del primer mes (simulado, con validación de tarjeta). Confirma con el pase de socio (QR) y guarda el plan con
 * `useMembership`. Si ya hay un plan, lo dice y deja cambiarlo.
 */
export default function MembershipFlow({
  plans,
  initialPlan,
  signupFee = 0,
  storageKey = "trama:socio",
  club = "el club",
  scheduleHref,
  accountHref,
  note = "Alta de demostración: no se cobra ni se envía nada. Para probar el pago: 4242 4242 4242 4242.",
  variant = "minimal",
  className = "",
}: MembershipFlowProps) {
  const socio = useMembership(storageKey);
  const [paso, setPaso] = useState(0);
  const [planId, setPlanId] = useState(initialPlan ?? plans.find((p) => p.highlight)?.id ?? plans[0]?.id);
  const [datos, setDatos] = useState({ name: "", email: "", birth: "" });
  const [tarjeta, setTarjeta] = useState<CardData>({ holder: "", number: "", exp: "", cvc: "" });
  const [error, setError] = useState("");
  const [hecho, setHecho] = useState(false);
  const plan = plans.find((p) => p.id === planId) ?? plans[0];
  const hoy = plan.price + signupFee;

  const siguiente = () => {
    setError("");
    if (paso === 1) {
      if (datos.name.trim().length < 2) return setError("Escribe tu nombre.");
      if (!/^\S+@\S+\.\S+$/.test(datos.email.trim())) return setError("Revisa el correo.");
      const n = new Date(datos.birth);
      if (!datos.birth || Number.isNaN(n.getTime())) return setError("Escribe tu fecha de nacimiento.");
      if ((Date.now() - n.getTime()) / 31557600000 < 16) return setError("Para darte de alta necesitas tener 16 años o más.");
    }
    setPaso(paso + 1);
  };
  const pagar = (e: React.FormEvent) => {
    e.preventDefault();
    const err = cardError(tarjeta);
    if (err) return setError(err);
    socio.join({ id: plan.id, name: plan.name, price: plan.price, period: plan.period ?? "mes", name_on: datos.name.trim() });
    setHecho(true);
  };

  if (hecho && socio.plan)
    return (
      <section className={`ui-book ui-book--done ${className}`} aria-live="polite">
        <div className={`ui-book__main ui-surface ui-member ${vcls(variant)}`}>
          <p className="ui-book__ok" role="status">
            <span aria-hidden>✓</span> Ya eres socio de {club}
          </p>
          <h2>Plan {socio.plan.name}</h2>
          <div className="ui-member__pase">
            <QRCode value={`${club}-${socio.plan.code}`} codeSize={120} caption={socio.plan.code} />
            <p>
              Enseña este pase en recepción. {money(plan.price, "EUR", "es-ES", true)} al {plan.period ?? "mes"}, sin permanencia.
            </p>
          </div>
          <div className="ui-book__actions">
            {scheduleHref && <Button label="Reservar mi primera clase" href={scheduleHref} variant={variant} />}
            {accountHref && <Button label="Mi cuenta" href={accountHref} variant={variant} emphasis="outline" />}
          </div>
        </div>
      </section>
    );

  return (
    <section className={`ui-book ${className}`}>
      <div className={`ui-book__main ui-surface ${vcls(variant)}`}>
        <Stepper steps="Plan, Tus datos, Pago" current={paso} variant={variant} />
        {socio.ready && socio.plan && paso === 0 && <p className="ui-book__note">Ya tienes el plan {socio.plan.name}. Si eliges otro, lo cambiamos desde el próximo mes.</p>}
        {paso === 0 && (
          <fieldset className="ui-book__group ui-book__step">
            <legend>Elige tu plan</legend>
            <div className="ui-book__options">
              {plans.map((p) => (
                <button key={p.id} type="button" aria-pressed={planId === p.id} onClick={() => setPlanId(p.id)}>
                  <b>
                    {p.name}
                    {p.highlight ? " ★" : ""}
                  </b>
                  <span>
                    {money(p.price, "EUR", "es-ES", true)} / {p.period ?? "mes"}
                  </span>
                  {p.features?.length ? <span>{p.features.join(" · ")}</span> : null}
                </button>
              ))}
            </div>
          </fieldset>
        )}
        {paso === 1 && (
          <div className="ui-book__step ui-book__form">
            <TextField label="Nombre y apellidos" value={datos.name} onChange={(v) => setDatos({ ...datos, name: v })} autoComplete="name" required variant={variant} />
            <TextField label="Correo" type="email" value={datos.email} onChange={(v) => setDatos({ ...datos, email: v })} autoComplete="email" required variant={variant} />
            <label className="ui-member__fecha">
              Fecha de nacimiento
              <input type="date" value={datos.birth} onChange={(e) => setDatos({ ...datos, birth: e.target.value })} autoComplete="bday" required />
            </label>
          </div>
        )}
        {paso === 2 && (
          <form className="ui-book__step ui-book__form" onSubmit={pagar} noValidate>
            <p className="ui-book__note">
              Hoy pagas {money(hoy)}: el primer {plan.period ?? "mes"}
              {signupFee ? ` y ${money(signupFee)} de matrícula` : ", sin matrícula"}.
            </p>
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
              <Button label={`Pagar ${money(hoy)} y darme de alta`} type="submit" variant={variant} />
            </div>
          </form>
        )}
        {paso < 2 && (
          <>
            {error && (
              <p className="ui-book__error" role="alert">
                {error}
              </p>
            )}
            <div className="ui-book__actions">
              {paso > 0 && <Button label="Atrás" onClick={() => { setError(""); setPaso(0); }} emphasis="outline" variant={variant} />}
              <Button label="Continuar" glyph="→" onClick={siguiente} variant={variant} />
            </div>
          </>
        )}
      </div>
      <aside className={`ui-book__summary ui-surface ${vcls(variant)}`} aria-label="Resumen del alta">
        <p className="ui-book__kicker">Tu alta</p>
        <h3>Plan {plan.name}</h3>
        <p>
          {money(plan.price, "EUR", "es-ES", true)} / {plan.period ?? "mes"} · sin permanencia
        </p>
        <p>{signupFee ? `Matrícula ${money(signupFee, "EUR", "es-ES", true)}` : "Sin matrícula"}</p>
        {plan.features?.length ? <small>{plan.features.join(" · ")}</small> : null}
      </aside>
    </section>
  );
}
