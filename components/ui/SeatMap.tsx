"use client";

import type { CSSProperties } from "react";
import { money } from "@/lib/commerce/money";
import { vcls, type Variant } from "./variants";

export type SeatZone = {
  id: string;
  /** «Primera fila», «Patio», «Altillo» */
  name: string;
  /** suplemento por persona de la zona (negativo = más barata); se enseña en la leyenda */
  price?: number;
  /** color de la zona; sin él, el acento */
  color?: string;
};

export type SeatTable = {
  id: string;
  /** lo que se lee en la mesa («4», «B2») */
  label?: string;
  zone: string;
  /** plazas */
  seats: number;
  /** centro de la mesa en % del plano (0–100) */
  x: number;
  y: number;
  shape?: "round" | "square" | "bar";
};

export type SeatMapProps = {
  tables: SeatTable[];
  zones: SeatZone[];
  /** mesas ocupadas (por id) */
  taken?: string[];
  /** mesa elegida */
  value?: string;
  /** sin él, el plano es de solo lectura (las mesas no son botones) */
  onChange?: (id: string) => void;
  /** comensales: las mesas con menos plazas no se pueden elegir */
  guests?: number;
  /** texto del escenario ("" = sin escenario) */
  stage?: string;
  /** dónde está el escenario */
  stagePosition?: "top" | "bottom";
  /** proporción del plano (ancho / alto) */
  ratio?: number;
  label?: string;
  variant?: Variant;
  className?: string;
};

/**
 * Plano de una sala para elegir mesa: el escenario, las mesas en su sitio con su zona (color y precio en la leyenda), las
 * ocupadas tachadas y las que no caben para los comensales apagadas. Cada mesa es un botón con nombre completo («Mesa 4,
 * primera fila, 4 plazas, libre»), así que se recorre con el teclado y el lector de pantalla. Para cenas con espectáculo,
 * teatros pequeños, salas de conciertos o terrazas. Va dentro de `ShowBookingFlow`, o suelto con `value` y `onChange`.
 */
export default function SeatMap({
  tables,
  zones,
  taken = [],
  value,
  onChange,
  guests = 1,
  stage = "Escenario",
  stagePosition = "top",
  ratio = 16 / 10,
  label = "Elige mesa",
  variant = "minimal",
  className = "",
}: SeatMapProps) {
  const zona = (id: string) => zones.find((z) => z.id === id);
  const ordenadas = [...tables].sort((a, b) => zones.findIndex((z) => z.id === a.zone) - zones.findIndex((z) => z.id === b.zone) || a.y - b.y || a.x - b.x);
  return (
    <div className={`ui-seat ${vcls(variant)} ${className}`} role="group" aria-label={label}>
      <div className="ui-seat__plano" style={{ aspectRatio: String(ratio) }}>
        {stage && <div className={`ui-seat__stage ui-seat__stage--${stagePosition}`}>{stage}</div>}
        {ordenadas.map((t) => {
          const z = zona(t.zone);
          const ocupada = taken.includes(t.id);
          const pequena = t.seats < guests;
          const elegida = value === t.id;
          const estado = ocupada ? "ocupada" : pequena ? `para ${t.seats}, no caben ${guests}` : elegida ? "elegida" : "libre";
          const comun = {
            className: `ui-seat__mesa ui-seat__mesa--${t.shape ?? "round"}`,
            style: { left: `${t.x}%`, top: `${t.y}%`, "--ui-seat-z": z?.color ?? "var(--acc)", "--ui-seat-n": Math.min(t.seats, 8) } as CSSProperties,
            "data-estado": ocupada ? "ocupada" : pequena ? "pequena" : elegida ? "elegida" : "libre",
          };
          if (!onChange)
            return (
              <span key={t.id} {...comun} role="img" aria-label={`Mesa ${t.label ?? t.id}, ${z?.name ?? t.zone}, ${t.seats} plazas, ${estado}`}>
                <span aria-hidden>{t.label ?? t.id}</span>
              </span>
            );
          return (
            <button
              key={t.id}
              type="button"
              {...comun}
              aria-pressed={elegida}
              aria-disabled={ocupada || pequena || undefined}
              aria-label={`Mesa ${t.label ?? t.id}, ${z?.name ?? t.zone}, ${t.seats} plazas, ${estado}`}
              onClick={() => !ocupada && !pequena && onChange(t.id)}
            >
              <span aria-hidden>{t.label ?? t.id}</span>
            </button>
          );
        })}
      </div>
      <ul className="ui-seat__leyenda">
        {zones.map((z) => (
          <li key={z.id} style={{ "--ui-seat-z": z.color ?? "var(--acc)" } as CSSProperties}>
            <i aria-hidden />
            {z.name}
            {z.price ? <small>{z.price > 0 ? "+" : "−"}{money(Math.abs(z.price))} / persona</small> : null}
          </li>
        ))}
        <li className="ui-seat__leyenda-ocupada">
          <i aria-hidden />
          Ocupada
        </li>
      </ul>
    </div>
  );
}
