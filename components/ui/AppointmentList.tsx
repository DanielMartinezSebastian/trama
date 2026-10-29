"use client";

import { useState } from "react";
import { downloadCalendar, hoursUntil, prettyDate, useAppointments, type BookingPlace, type BookingService } from "@/lib/commerce/booking";
export type { Appointment, BookingPlace, BookingService } from "@/lib/commerce/booking";
import Button from "./Button";
import { vcls, type Variant } from "./variants";

export type AppointmentListProps = {
  /** los mismos servicios que la reserva, para nombre y duración */
  services: BookingService[];
  places?: BookingPlace[];
  /** clave de `localStorage` de las citas (la misma que en `BookingFlow`) */
  storageKey?: string;
  /** enlace de la reserva; «Cambiar» le añade `?editar=<id>` */
  bookHref: string;
  /** horas antes de la cita en que se cierran los cambios en línea */
  cutoffHours?: number;
  business?: string;
  location?: string;
  emptyTitle?: string;
  emptyText?: string;
  variant?: Variant;
  className?: string;
};

/**
 * «Mis citas»: las citas guardadas por `BookingFlow` en este navegador, por fecha, con añadir al calendario, cambiar de día
 * y cancelar (con confirmación). Dentro de `cutoffHours` los cambios se cierran, como en una agenda real. Con la lista
 * vacía, una invitación a reservar.
 */
export default function AppointmentList({
  services,
  places = [],
  storageKey = "trama:citas",
  bookHref,
  cutoffHours = 24,
  business = "Tu cita",
  location = "",
  emptyTitle = "Aún no tienes citas",
  emptyText = "Cuando reserves, la verás aquí y podrás cambiarla o anularla.",
  variant = "minimal",
  className = "",
}: AppointmentListProps) {
  const { list, cancel, ready, temporary } = useAppointments(storageKey);
  const [porAnular, setPorAnular] = useState("");
  const sep = bookHref.includes("?") ? "&" : "?";

  if (!ready) return <p role="status">Abriendo tu agenda…</p>;
  if (!list.length)
    return (
      <div className={`ui-appts ui-appts--empty ui-surface ${vcls(variant)} ${className}`}>
        <h3>{emptyTitle}</h3>
        <p>{emptyText}</p>
        <Button label="Reservar cita" href={bookHref} variant={variant} />
      </div>
    );

  return (
    <ul className={`ui-appts ${className}`}>
      {list.map((a) => {
        const s = services.find((x) => x.id === a.service);
        const lugar = places.find((p) => p.id === a.place);
        const abierta = hoursUntil(a) > cutoffHours;
        return (
          <li key={a.id} className={`ui-appts__item ui-surface ${vcls(variant)}`}>
            <p className="ui-appts__when">
              {prettyDate(a.date)} · {a.time}
            </p>
            <h3>{s?.name ?? a.service}</h3>
            <p>
              Con {a.staff}
              {lugar ? ` · ${lugar.name}` : ""}
              {s ? ` · ${s.minutes} min` : ""}
            </p>
            <div className="ui-appts__actions">
              <Button label="Añadir al calendario" onClick={() => downloadCalendar(`${business} · ${s?.name ?? ""}`, a.date, a.time, s?.minutes ?? 30, lugar?.address ?? location)} variant={variant} emphasis="outline" size="sm" />
              {abierta && <Button label="Cambiar" href={`${bookHref}${sep}editar=${a.id}`} variant={variant} emphasis="outline" size="sm" />}
              {abierta &&
                (porAnular === a.id ? (
                  <>
                    <Button label="Sí, anular" onClick={() => { cancel(a.id); setPorAnular(""); }} variant={variant} intent="danger" size="sm" />
                    <Button label="Conservarla" onClick={() => setPorAnular("")} variant={variant} emphasis="ghost" size="sm" />
                  </>
                ) : (
                  <Button label="Anular" onClick={() => setPorAnular(a.id)} variant={variant} emphasis="ghost" size="sm" />
                ))}
            </div>
            {!abierta && <small>Faltan menos de {cutoffHours} horas: para cambiarla, llámanos.</small>}
          </li>
        );
      })}
      {temporary && <li className="ui-appts__note">Sin almacenamiento en este navegador: las citas duran esta visita.</li>}
    </ul>
  );
}
