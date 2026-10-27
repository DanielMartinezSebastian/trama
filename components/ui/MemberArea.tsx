"use client";

import { useState } from "react";
import { money } from "@/lib/commerce/money";
import { useMembership } from "@/lib/commerce/membership";
import Button from "./Button";
import type { ScheduleClass } from "./ClassSchedule";
import QRCode from "./QRCode";
import { vcls, type Variant } from "./variants";

export type MemberAreaProps = {
  /** las mismas clases que el horario, para nombre, hora y coach */
  classes: ScheduleClass[];
  storageKey?: string;
  club?: string;
  /** enlaces a los planes (alta) y al horario */
  plansHref: string;
  scheduleHref: string;
  /** horas antes de la clase en que ya no se puede anular */
  cutoffHours?: number;
  variant?: Variant;
  className?: string;
};

const fecha = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

/**
 * «Mi cuenta» de un socio: el plan con su pase (QR) o una invitación a darse de alta, las plazas reservadas y las listas
 * de espera por fecha (anular hasta `cutoffHours` antes) y la baja del plan con confirmación. Lee `useMembership`.
 */
export default function MemberArea({ classes, storageKey = "trama:socio", club = "el club", plansHref, scheduleHref, cutoffHours = 2, variant = "minimal", className = "" }: MemberAreaProps) {
  const s = useMembership(storageKey);
  const [baja, setBaja] = useState(false);
  if (!s.ready) return <p role="status">Abriendo tu cuenta…</p>;
  const reservas = [...s.bookings].sort((a, b) => {
    const ca = classes.find((c) => c.id === a.classId);
    const cb = classes.find((c) => c.id === b.classId);
    return `${a.date}${ca?.time ?? ""}`.localeCompare(`${b.date}${cb?.time ?? ""}`);
  });
  return (
    <div className={`ui-member ${className}`}>
      <section className={`ui-appts__item ui-surface ${vcls(variant)}`}>
        <p className="ui-appts__when">Tu plan</p>
        {s.plan ? (
          <>
            <h3>{s.plan.name}</h3>
            <div className="ui-member__pase">
              <QRCode value={`${club}-${s.plan.code}`} codeSize={110} caption={s.plan.code} />
              <p>
                {money(s.plan.price, "EUR", "es-ES", true)} al {s.plan.period} desde el {fecha(s.plan.since)}. Enseña el pase en recepción.
              </p>
            </div>
            <div className="ui-appts__actions">
              <Button label="Cambiar de plan" href={plansHref} variant={variant} emphasis="outline" size="sm" />
              {baja ? (
                <>
                  <Button label="Sí, darme de baja" onClick={() => { s.leave(); setBaja(false); }} intent="danger" variant={variant} size="sm" />
                  <Button label="Me quedo" onClick={() => setBaja(false)} emphasis="ghost" variant={variant} size="sm" />
                </>
              ) : (
                <Button label="Darme de baja" onClick={() => setBaja(true)} emphasis="ghost" variant={variant} size="sm" />
              )}
            </div>
          </>
        ) : (
          <>
            <h3>Aún no eres socio</h3>
            <p>Puedes reservar una clase de prueba sin plan. Cuando te convenza, date de alta: sin permanencia.</p>
            <div className="ui-appts__actions">
              <Button label="Ver los planes" href={plansHref} variant={variant} size="sm" />
            </div>
          </>
        )}
      </section>
      <section className="ui-member__reservas">
        <h3>Tus clases</h3>
        {reservas.length ? (
          <ul className="ui-appts">
            {reservas.map((b) => {
              const c = classes.find((x) => x.id === b.classId);
              const horas = c ? (new Date(`${b.date}T${c.time}:00`).getTime() - Date.now()) / 3600000 : 99;
              return (
                <li key={`${b.classId}${b.date}`} className={`ui-appts__item ui-surface ${vcls(variant)}`}>
                  <p className="ui-appts__when">
                    {fecha(b.date)} · {c?.time}
                    {b.waitlist ? " · lista de espera" : ""}
                  </p>
                  <h3>{c?.name ?? b.classId}</h3>
                  <p>{[c?.coach, c?.room, c?.minutes ? `${c.minutes} min` : ""].filter(Boolean).join(" · ")}</p>
                  {horas > cutoffHours ? <div className="ui-appts__actions"><Button label={b.waitlist ? "Salir de la lista" : "Anular la plaza"} onClick={() => s.cancel(b.classId, b.date)} variant={variant} emphasis="ghost" size="sm" /></div> : <small>Ya no se puede anular: faltan menos de {cutoffHours} horas.</small>}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={`ui-appts--empty ui-surface ${vcls(variant)}`}>
            <p>No tienes clases reservadas.</p>
            <Button label="Ver el horario" href={scheduleHref} variant={variant} size="sm" />
          </div>
        )}
      </section>
    </div>
  );
}
