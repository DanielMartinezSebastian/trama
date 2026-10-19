import type { CSSProperties } from "react";
import { vcls, type Variant } from "./variants";

export type KpiCardProps = {
  label: string;
  /** el valor ya formateado: «12.480 €», «3,2 %» */
  value: string;
  /** variación con su signo: «+8,4 %» */
  delta?: string;
  /** sentido de la variación: up (sube) · down (baja) · flat (sin cambio) */
  trend?: "up" | "down" | "flat";
  /** true si que baje es bueno (bajas, tiempo de respuesta): invierte los colores */
  lowerIsBetter?: boolean;
  /** serie para la mini gráfica (sparkline) */
  spark?: number[];
  /** texto bajo la variación («vs. mes anterior») */
  note?: string;
  variant?: Variant;
  className?: string;
};

function sparkPath(data: number[], w: number, h: number) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  return data
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / Math.max(1, data.length - 1)) * w).toFixed(1)} ${(h - 2 - ((v - min) / span) * (h - 4)).toFixed(1)}`)
    .join(" ");
}

/** Tarjeta de indicador: etiqueta, cifra, variación con color semántico y mini gráfica. El color nunca es la única señal: la variación lleva signo y flecha. */
export default function KpiCard({ label, value, delta = "", trend = "flat", lowerIsBetter = false, spark, note = "", variant = "editorial", className = "" }: KpiCardProps) {
  const good = trend === "flat" ? null : (trend === "up") !== lowerIsBetter;
  const tone = good === null ? "flat" : good ? "good" : "bad";
  const arrow = trend === "up" ? "▲" : trend === "down" ? "▼" : "■";
  return (
    <div className={`ui-kpi ui-surface ${vcls(variant)} ${className}`.trim()}>
      <span className="ui-kpi__l">{label}</span>
      <b className="ui-kpi__v">{value}</b>
      <div className="ui-kpi__f">
        {delta && (
          <span className={`ui-kpi__d ui-kpi__d--${tone}`}>
            <span aria-hidden>{arrow}</span> {delta}
          </span>
        )}
        {note && <span className="ui-kpi__n">{note}</span>}
      </div>
      {spark && spark.length > 1 && (
        <svg className={`ui-kpi__s ui-kpi__s--${tone}`} viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden style={{ "--len": 1 } as CSSProperties}>
          <path d={sparkPath(spark, 120, 36)} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </div>
  );
}
