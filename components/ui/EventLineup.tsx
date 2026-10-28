"use client";

import { useMemo, useState } from "react";
import { money } from "@/lib/commerce/money";
import { vcls, type Variant } from "./variants";

export type LineupEvent = {
  id: string;
  title: string;
  /** día en ISO: «2026-11-14» */
  date: string;
  /** «21:30» */
  time?: string;
  /** género o tipo: «Flamenco», «Copla» (sirve de filtro) */
  genre?: string;
  /** una línea bajo el título */
  blurb?: string;
  image?: string;
  /** precio desde (por persona) */
  price?: number;
  status?: "open" | "few" | "soldout" | "cancelled";
  /** plazas libres, si quieres decirlo */
  left?: number;
  href?: string;
};

export type EventLineupProps = {
  events: LineupEvent[];
  /** agrupar por mes (con su encabezado) o lista corrida */
  groupBy?: "month" | "none";
  /** chips de género para filtrar */
  filters?: boolean;
  /** filas con la fecha grande (cartelera) o tarjetas con imagen */
  layout?: "rows" | "cards";
  cta?: string;
  /** cuántas enseñar (el resto, ocultas); 0 = todas */
  limit?: number;
  statusLabels?: Partial<Record<NonNullable<LineupEvent["status"]>, string>>;
  emptyLabel?: string;
  variant?: Variant;
  className?: string;
};

const ESTADO = { open: "Entradas a la venta", few: "Últimas mesas", soldout: "Agotado", cancelled: "Cancelado" };
const dia = (iso: string) => new Date(`${iso}T12:00:00`);

/**
 * Cartelera de funciones, conciertos o eventos por fecha: agrupada por mes, con la fecha grande, el género, la hora, el
 * precio desde y el estado (últimas mesas, agotado, cancelado), y chips para filtrar por género. Cada función enlaza a su
 * ficha o a la reserva. Pensada para restaurantes con espectáculo, salas y teatros pequeños (La Tramoya, docs/57); con
 * `ShowBookingFlow` se reserva mesa para la función.
 */
export default function EventLineup({
  events,
  groupBy = "month",
  filters = true,
  layout = "rows",
  cta = "Reservar",
  limit = 0,
  statusLabels = {},
  emptyLabel = "No hay funciones con ese filtro.",
  variant = "minimal",
  className = "",
}: EventLineupProps) {
  const generos = useMemo(() => [...new Set(events.map((e) => e.genre).filter(Boolean))] as string[], [events]);
  const [genero, setGenero] = useState("");
  const etiquetas = { ...ESTADO, ...statusLabels };
  const lista = [...events].sort((a, b) => (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? ""))).filter((e) => !genero || e.genre === genero);
  const vistas = limit ? lista.slice(0, limit) : lista;
  const grupos = groupBy === "month" ? Object.entries(Object.groupBy(vistas, (e) => e.date.slice(0, 7))) : [["", vistas] as const];
  return (
    <div className={`ui-lineup ui-lineup--${layout} ${vcls(variant)} ${className}`}>
      {filters && generos.length > 1 && (
        <div className="ui-lineup__filtros" role="group" aria-label="Filtrar por género">
          {["", ...generos].map((g) => (
            <button key={g || "todo"} type="button" aria-pressed={genero === g} onClick={() => setGenero(g)}>
              {g || "Todo"}
            </button>
          ))}
        </div>
      )}
      {!vistas.length && <p className="ui-lineup__vacio">{emptyLabel}</p>}
      {grupos.map(([mes, evs]) => (
        <section key={mes || "todas"} className="ui-lineup__mes" aria-label={mes ? dia(`${mes}-01`).toLocaleDateString("es-ES", { month: "long", year: "numeric" }) : "Funciones"}>
          {mes && <h3 className="ui-lineup__mes-t">{dia(`${mes}-01`).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</h3>}
          <ul>
            {(evs ?? []).map((e) => {
              const d = dia(e.date);
              const cerrada = e.status === "soldout" || e.status === "cancelled";
              const Tag = e.href && !cerrada ? "a" : "div";
              return (
                <li key={e.id} data-estado={e.status ?? "open"}>
                  <Tag className="ui-lineup__item" {...(Tag === "a" ? { href: e.href } : {})}>
                    {layout === "cards" && e.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.image} alt="" loading="lazy" className="ui-lineup__img" />
                    )}
                    <span className="ui-lineup__fecha">
                      <small>{d.toLocaleDateString("es-ES", { weekday: "short" })}</small>
                      <b>{d.getDate()}</b>
                      <small>{d.toLocaleDateString("es-ES", { month: "short" })}</small>
                    </span>
                    <span className="ui-lineup__info">
                      {e.genre && <small className="ui-lineup__genero">{e.genre}</small>}
                      <strong>{e.title}</strong>
                      {e.blurb && <span>{e.blurb}</span>}
                    </span>
                    <span className="ui-lineup__meta">
                      {e.time && <span>{e.time}</span>}
                      {e.price != null && !cerrada && <span>desde {money(e.price)}</span>}
                      <span className="ui-lineup__estado">
                        {etiquetas[e.status ?? "open"]}
                        {e.status === "few" && e.left ? ` · ${e.left}` : ""}
                      </span>
                    </span>
                    {Tag === "a" && <span className="ui-lineup__cta">{cta} →</span>}
                  </Tag>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
