"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "./Button";
import { splitEscaped } from "@/lib/ui/list";
import { vcls, type Variant } from "./variants";

export type ScheduleClass = {
  id: string;
  name: string;
  /** «07:30» */
  time: string;
  minutes?: number;
  /** disciplina («Fuerza», «Muay Thai»): da el filtro */
  category?: string;
  level?: string;
  coach?: string;
  room?: string;
  description?: string;
  capacity?: number;
  booked?: number;
  /** días de la semana en que se da (0 = domingo … 6 = sábado); sin él, todos */
  weekdays?: number[];
};

export type ScheduleBooking = { classId: string; date: string; waitlist?: boolean };

export type ClassScheduleProps = {
  /** las clases como datos o una por línea: «hora|nombre|minutos|disciplina|nivel|monitor|sala|plazas|ocupadas|días (1,3,5)» */
  classes?: ScheduleClass[] | string;
  /** días que se ofrecen a partir de hoy */
  daysAhead?: number;
  /** list = un día con sus clases en filas · week = la semana en columnas */
  layout?: "list" | "week";
  /** filtros de disciplina y de nivel */
  filters?: "both" | "category" | "none";
  /** reservas hechas (las guarda quien usa el componente) */
  bookings?: ScheduleBooking[];
  /** plazas libres de una clase un día; por defecto, plazas − ocupadas */
  freePlaces?: (c: ScheduleClass, date: string) => number;
  /** al pulsar reservar (o lista de espera si está completa) */
  onBook?: (c: ScheduleClass, date: string, waitlist: boolean) => void;
  bookLabel?: string;
  waitlistLabel?: string;
  /** con una reserva hecha */
  bookedLabel?: string;
  /** clase sin plazas */
  fullLabel?: string;
  /** sin clases para el día y los filtros */
  emptyText?: string;
  /** texto del filtro «todas» */
  allLabel?: string;
  /** idioma de los nombres de los días */
  locale?: string;
  variant?: Variant;
  className?: string;
};

const DEFAULT_CLASSES = "07:30|Fuerza base|50|Fuerza|Inicio|Inés|Sala 1|12|8|1,3,5\n09:00|Movilidad|45|Movilidad|Todos|Nico|Sala 2|10|5\n13:30|Engine|45|Cardio|Intermedio|Dani|Sala 1|12|12|1,2,3,4,5\n18:00|Fuerza en grupo|55|Fuerza|Intermedio|Inés|Sala 1|12|11|1,2,3,4\n19:00|Reset|40|Movilidad|Inicio|Nico|Sala 2|10|7";

const parse = (s: string): ScheduleClass[] =>
  s
    .split("\n")
    .map((l) => splitEscaped(l, "|").map((x) => x.trim()))
    .filter((r) => r[0] && r[1])
    .map(([time, name, minutes, category, level, coach, room, capacity, booked, days], i) => ({
      id: `c${i}`,
      time,
      name,
      minutes: Number(minutes) || undefined,
      category: category || undefined,
      level: level || undefined,
      coach: coach || undefined,
      room: room || undefined,
      capacity: capacity ? Number(capacity) : undefined,
      booked: booked ? Number(booked) : undefined,
      weekdays: days ? days.split(",").map(Number) : undefined,
    }));

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const onDay = (c: ScheduleClass, date: string) => !c.weekdays || c.weekdays.includes(new Date(`${date}T12:00:00`).getDay());
const byTime = (a: ScheduleClass, b: ScheduleClass) => a.time.localeCompare(b.time);

/**
 * Horario de clases de un gimnasio, estudio o academia: días a partir de hoy, filtro por disciplina y nivel, plazas
 * libres, lista de espera y reservas hechas. No guarda nada: las reservas entran por `bookings` y salen por `onBook`.
 * En lista (un día) o en semana (columnas). Los días se calculan en el cliente.
 */
export default function ClassSchedule({ classes = DEFAULT_CLASSES, daysAhead = 7, layout = "list", filters = "both", bookings = [], freePlaces, onBook, bookLabel = "Reservar", waitlistLabel = "Lista de espera", bookedLabel = "Reservada", fullLabel = "Completa", emptyText = "No hay clases con estos filtros este día.", allLabel = "Todas", locale = "es-ES", variant = "glass", className = "" }: ClassScheduleProps) {
  const list = useMemo(() => (typeof classes === "string" ? parse(classes) : classes), [classes]);
  const [days, setDays] = useState<string[]>([]);
  const [day, setDay] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  useEffect(() => {
    const t = new Date();
    const ds = Array.from({ length: Math.max(1, daysAhead) }, (_, i) => iso(new Date(t.getFullYear(), t.getMonth(), t.getDate() + i)));
    setDays(ds);
    setDay((d) => (ds.includes(d) ? d : ds[0]));
  }, [daysAhead]);

  const categories = [...new Set(list.map((c) => c.category).filter(Boolean))] as string[];
  const levels = [...new Set(list.map((c) => c.level).filter((l) => l && l !== "Todos"))] as string[];
  const pass = (c: ScheduleClass) => (!category || c.category === category) && (!level || !c.level || c.level === level || c.level === "Todos");
  const free = (c: ScheduleClass, date: string) => (freePlaces ? freePlaces(c, date) : Math.max(0, (c.capacity ?? Infinity) - (c.booked ?? 0)));
  const label = (date: string, o: Intl.DateTimeFormatOptions) => new Date(`${date}T12:00:00`).toLocaleDateString(locale, o);

  const action = (c: ScheduleClass, date: string) => {
    const b = bookings.find((x) => x.classId === c.id && x.date === date);
    const n = free(c, date);
    const state = b ? (b.waitlist ? waitlistLabel : bookedLabel) : !Number.isFinite(n) ? "" : n === 0 ? fullLabel : `${n} ${n === 1 ? "plaza" : "plazas"}`;
    return { b, n, state };
  };

  const filtros = filters !== "none" && (
    <div className="ui-sched__filters">
      {categories.length > 1 && (
        <div role="group" aria-label="Disciplina">
          {["", ...categories].map((c) => (
            <button key={c || "all"} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c || allLabel}
            </button>
          ))}
        </div>
      )}
      {filters === "both" && levels.length > 1 && (
        <label>
          Nivel
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">{allLabel}</option>
            {levels.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
      )}
    </div>
  );

  if (!days.length) return <div className={`ui-sched ${vcls(variant)} ${className}`} aria-busy="true" />;

  if (layout === "week")
    return (
      <div className={`ui-sched ui-sched--week ${vcls(variant)} ${className}`}>
        {filtros}
        <div className="ui-sched__week">
          {days.map((d) => (
            <section key={d} aria-label={label(d, { weekday: "long", day: "numeric" })}>
              <h3>
                <span>{label(d, { weekday: "short" })}</span>
                <b>{label(d, { day: "numeric" })}</b>
              </h3>
              {list
                .filter((c) => onDay(c, d) && pass(c))
                .sort(byTime)
                .map((c) => {
                  const { b, n, state } = action(c, d);
                  return (
                    <button key={c.id} type="button" className={`ui-sched__chip ui-surface ${b ? "is-booked" : n === 0 ? "is-full" : ""}`} onClick={() => !b && onBook?.(c, d, n === 0)} aria-label={`${c.name}, ${label(d, { weekday: "long" })} ${c.time}${state ? `, ${state}` : ""}`}>
                      <time>{c.time}</time>
                      <strong>{c.name}</strong>
                      {state && <small>{state}</small>}
                    </button>
                  );
                })}
            </section>
          ))}
        </div>
      </div>
    );

  const today = list.filter((c) => onDay(c, day) && pass(c)).sort(byTime);
  return (
    <div className={`ui-sched ui-sched--list ${vcls(variant)} ${className}`}>
      <div className="ui-sched__days" role="group" aria-label="Día">
        {days.map((d) => (
          <button key={d} type="button" aria-pressed={day === d} onClick={() => setDay(d)}>
            <span>{label(d, { weekday: "short" })}</span>
            <b>{label(d, { day: "numeric" })}</b>
          </button>
        ))}
      </div>
      {filtros}
      {today.length ? (
        <ol className="ui-sched__list">
          {today.map((c) => {
            const { b, n, state } = action(c, day);
            return (
              <li key={c.id} className={`ui-sched__row ${b ? "is-booked" : n === 0 ? "is-full" : ""}`}>
                <div className="ui-sched__time">
                  <strong>{c.time}</strong>
                  {c.minutes && <small>{c.minutes} min</small>}
                </div>
                <div className="ui-sched__info">
                  {(c.category || c.level) && <span className="ui-sched__tag">{[c.category, c.level].filter(Boolean).join(" · ")}</span>}
                  <h3>{c.name}</h3>
                  {c.description && <p>{c.description}</p>}
                  {(c.coach || c.room) && <small>{[c.coach, c.room].filter(Boolean).join(" · ")}</small>}
                </div>
                <div className="ui-sched__act">
                  {state && <span>{state}</span>}
                  {onBook && !b && <Button label={n === 0 ? waitlistLabel : bookLabel} onClick={() => onBook(c, day, n === 0)} emphasis={n === 0 ? "outline" : "primary"} size="sm" variant={variant} />}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="ui-sched__empty">{emptyText}</p>
      )}
    </div>
  );
}
