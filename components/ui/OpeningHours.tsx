"use client";

import { useEffect, useMemo, useState } from "react";
import { DAY_NAMES, fmt, hoursStatus, nowIn, parseExceptions, parseHours, type HoursStatus } from "@/lib/ui/hours";
import { vcls, type Variant } from "./variants";

export { openingHoursSchema, parseHours, parseExceptions, hoursStatus, type DayHours, type HoursException } from "@/lib/ui/hours";

export type OpeningHoursProps = {
  /**
   * Horario semanal, una línea por grupo de días: `días|tramos`. Días con las iniciales españolas (`L M X J V S D`), en
   * rango (`L-V`) o lista (`L,X,V`); tramos `07:30-14:00 17:00-20:30` o `cerrado`. Un tramo que pasa de medianoche se
   * escribe `20:00-02:00`.
   */
  hours?: string;
  /** cierres y aperturas especiales, una por línea: `2026-12-25|Navidad` (cerrado) o `2026-12-24|Nochebuena|08:00-14:00` */
  exceptions?: string;
  /** zona horaria del negocio: el estado se calcula con la hora de allí, no con la del visitante */
  timeZone?: string;
  /** full = estado + semana con hoy resaltado · compact = estado + horario de hoy · badge = solo el estado */
  layout?: "full" | "compact" | "badge";
  /** minutos antes del cierre en que pasa a «Cierra pronto» */
  soonMinutes?: number;
  /** cuántos cierres o aperturas especiales próximos se enseñan (los pasados nunca) */
  maxExceptions?: number;
  /** título de la tabla (vacío = sin título) */
  title?: string;
  variant?: Variant;
  className?: string;
};

/**
 * Horario con estado «Abierto ahora · cierra a las 20:30» calculado en la zona horaria del negocio, festivos incluidos.
 * Responde la primera pregunta de restauración, comercio y clínicas (B3 en docs/11). La tabla se pinta en el servidor; el
 * estado, al montar (depende de la hora). `openingHoursSchema()` da el mismo horario en schema.org.
 */
export default function OpeningHours({
  hours = "L-V|07:30-14:00 17:00-20:30\nS|08:00-14:30\nD|cerrado",
  exceptions = "",
  timeZone = "Europe/Madrid",
  layout = "full",
  soonMinutes = 30,
  maxExceptions = 3,
  title = "Horario",
  variant = "minimal",
  className = "",
}: OpeningHoursProps) {
  const week = useMemo(() => parseHours(hours), [hours]);
  const ex = useMemo(() => parseExceptions(exceptions), [exceptions]);
  const [state, setState] = useState<{ status: HoursStatus; today: number; iso: string } | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = nowIn(timeZone);
      setState({ status: hoursStatus(week, ex, timeZone, soonMinutes), today: now.day, iso: now.iso });
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [week, ex, timeZone, soonMinutes]);

  const s = state?.status;
  // solo los próximos (sin los ya pasados) y como mucho `maxExceptions`; antes de montar no se sabe la fecha: ninguno
  const upcoming = state ? ex.filter((e) => e.date >= state.iso).slice(0, maxExceptions) : [];
  const tone = !s ? "" : s.open ? (s.soon ? "soon" : "open") : "closed";
  const badge = (
    <p className="ui-hours__status" data-state={tone || undefined} aria-live="polite">
      <i className="ui-hours__dot" aria-hidden />
      {s ? (
        <>
          <b>{s.text}</b>
          {s.detail && <span> · {s.detail}</span>}
        </>
      ) : (
        <span>Consultando el horario…</span>
      )}
    </p>
  );
  if (layout === "badge") return <div className={`ui-hours ui-hours--badge ${vcls(variant)} ${className}`.trim()}>{badge}</div>;

  const rows = layout === "compact" ? week.filter((w) => w.day === (state?.today ?? -1)) : week;
  return (
    <div className={`ui-hours ui-hours--${layout} ${vcls(variant)} ${className}`.trim()}>
      {title && <p className="ui-hours__title">{title}</p>}
      {badge}
      <dl className="ui-hours__week">
        {rows.map((w) => (
          <div key={w.day} className="ui-hours__row" data-today={state?.today === w.day ? "" : undefined}>
            <dt>
              {DAY_NAMES[w.day][0].toUpperCase() + DAY_NAMES[w.day].slice(1)}
              {state?.today === w.day && <span className="ui-sr"> (hoy)</span>}
            </dt>
            <dd>{w.ranges.length ? w.ranges.map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(" · ") : "Cerrado"}</dd>
          </div>
        ))}
      </dl>
      {layout === "full" && upcoming.length > 0 && (
        <ul className="ui-hours__ex" aria-label="Próximos cierres y horarios especiales">
          {upcoming.map((e) => (
            <li key={e.date}>
              <time dateTime={e.date}>{new Date(`${e.date}T12:00:00Z`).toLocaleDateString("es-ES", { day: "numeric", month: "long", ...(e.date.slice(0, 4) !== state?.iso.slice(0, 4) ? { year: "numeric" } : {}), timeZone: "UTC" })}</time>
              {e.label && ` · ${e.label}`}: {e.ranges?.length ? e.ranges.map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(" · ") : "cerrado"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
