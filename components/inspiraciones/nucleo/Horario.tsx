"use client";

import { useState } from "react";
import ClassSchedule from "@/components/ui/ClassSchedule";
import { useMembership } from "@/lib/commerce/membership";
import { CLASES } from "./data";
import { nucleoHref } from "./enlaces";

/** clave del socio de Núcleo: la comparten el horario, los bonos y mi cuenta */
export const SOCIO = "trama:nucleo:socio";

/**
 * El horario de Núcleo con reserva de plaza: sin bono, una clase de prueba gratis; con bono, todas las que quieras. Las
 * plazas guardadas se ven en Mi cuenta.
 */
export function Horario() {
  const socio = useMembership(SOCIO);
  const [aviso, setAviso] = useState(false);
  const plazas = socio.bookings.filter((b) => !b.waitlist).length;
  return (
    <>
      {!socio.plan && <p className="nc-nota">{plazas ? "Ya tienes tu clase de prueba reservada. Para más clases, elige un bono." : "Tu primera clase de prueba va por nuestra cuenta: reserva sin bono."}</p>}
      <ClassSchedule
        classes={CLASES}
        startOffset={1}
        bookings={socio.bookings}
        onBook={(c, date, waitlist) => {
          if (!socio.plan && !waitlist && plazas >= 1) return setAviso(true);
          socio.book(c.id, date, waitlist);
        }}
        freePlaces={(c, d) => Math.max(0, (c.capacity ?? 3) - (c.booked ?? 0) - (Number(d.slice(-2)) % 2) - (socio.bookings.some((b) => b.classId === c.id && b.date === d && !b.waitlist) ? 1 : 0))}
        filters="category"
        bookLabel="Reservar"
        waitlistLabel="En espera"
        fullLabel="Completa"
        bookedHref={nucleoHref("mi-cuenta")}
        bookedCta="Ver en mi cuenta"
        variant="minimal"
        className="nc-horario"
      />
      {aviso && (
        <p className="nc-aviso" role="alert">
          Tu clase de prueba ya está reservada. Para reservar más, <a href={nucleoHref("bonos")}>elige un bono</a>.
        </p>
      )}
    </>
  );
}
