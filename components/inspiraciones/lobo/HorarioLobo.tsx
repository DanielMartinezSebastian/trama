"use client";

import { useState } from "react";
import ClassSchedule from "@/components/ui/ClassSchedule";
import { useMembership } from "@/lib/commerce/membership";
import { HORARIO } from "./data";
import { loboHref } from "./enlaces";

/** clave del socio de Lobo: la comparten el horario, las cuotas y mi cuenta */
export const SOCIO_LOBO = "trama:lobo:socio";

/**
 * El horario de la semana con reserva: sin cuota, una clase de prueba gratis; con la cuota de una disciplina, solo la suya
 * (más fitness y recuperación); con la de todas, cualquiera.
 */
export function HorarioLobo({ disciplina = "", layout = "week" }: { disciplina?: string; layout?: "week" | "list" }) {
  const socio = useMembership(SOCIO_LOBO);
  const [aviso, setAviso] = useState("");
  const prueba = !socio.plan && socio.bookings.length === 0;
  return (
    <>
      {layout === "week" && <p className="lb-pista">Pulsa una clase para reservar tu plaza; las completas te apuntan a la lista de espera.</p>}
      <ClassSchedule
        classes={HORARIO}
        layout={layout}
        filters="category"
        defaultCategory={disciplina}
        bookings={socio.bookings}
        onBook={(c, d, espera) => {
          if (!socio.plan && !prueba) return setAviso("Ya usaste tu clase de prueba: elige una cuota para seguir.");
          const libre = ["Fitness", "Recuperación"].includes(c.category ?? "");
          if (socio.plan?.id === "una" && !libre && socio.bookings.some((b) => HORARIO.find((h) => h.id === b.classId)?.category !== c.category && !["Fitness", "Recuperación"].includes(HORARIO.find((h) => h.id === b.classId)?.category ?? ""))) return setAviso("Tu cuota es de una disciplina: para mezclar, pásate a «Todas las disciplinas».");
          setAviso("");
          socio.book(c.id, d, espera);
        }}
        freePlaces={(c, d) => Math.max(0, (c.capacity ?? 16) - (c.booked ?? 0) - (Number(d.slice(-1)) % 2) - (socio.bookings.some((b) => b.classId === c.id && b.date === d && !b.waitlist) ? 1 : 0))}
        bookLabel="Reservar"
        waitlistLabel="Lista de espera"
        bookedHref={loboHref("mi-cuenta")}
        bookedCta="Mi cuenta"
        variant="minimal"
        className="lb-semana"
      />
      {aviso && (
        <p className="lb-aviso" role="alert">
          {aviso} <a href={loboHref("cuotas")}>Ver cuotas →</a>
        </p>
      )}
    </>
  );
}
