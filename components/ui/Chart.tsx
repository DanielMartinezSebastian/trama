"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { tcls, type Tone } from "./variants";

export type ChartSeries = {
  name: string;
  data: number[];
  /** token del color de la serie */
  tone?: Tone;
};

export type ChartProps = {
  /** line · area · bar */
  kind?: "line" | "area" | "bar";
  /** una etiqueta por punto del eje X */
  labels: string[];
  /** máximo recomendable: 4 series; con más, pierde legibilidad */
  series: ChartSeries[];
  height?: number;
  /** unidad que se añade a los valores («€», «%») */
  unit?: string;
  /** descripción corta del gráfico para el lector de pantalla */
  label?: string;
  /** nombre de la columna de etiquetas en la tabla para lectores de pantalla («Mes», «Periodo») */
  xLabel?: string;
  /** leyenda arriba */
  legend?: boolean;
  className?: string;
};

const TONES: Tone[] = ["acc", "acc2", "fg", "mut"];
const M = { l: 44, r: 12, t: 10, b: 26 };

/** Escala «bonita»: pasos de 1, 2, 2,5 o 5 × 10ⁿ */
function niceScale(max: number, ticks = 4) {
  if (max <= 0) return { max: 1, step: 0.25 };
  const raw = max / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / mag;
  const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
  return { max: Math.ceil(max / step) * step, step };
}

const fmt = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

/**
 * Gráfico de líneas, áreas o barras en SVG, sin librerías. Mide su contenedor y se redibuja (los textos no se deforman),
 * con rejilla de escala «bonita», animación de trazo al entrar, y una guía con valores al pasar el puntero o con las
 * flechas del teclado.
 *
 * Accesibilidad: el gráfico es una imagen con descripción; los datos completos van en una tabla oculta para lectores de
 * pantalla (no solo color: leyenda con nombre y valores en el aviso). Con `prefers-reduced-motion` no hay animación de trazo.
 */
export default function Chart({ kind = "line", labels, series, height = 240, unit = "", label = "Gráfico", xLabel = "Periodo", legend = true, className = "" }: ChartProps) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const n = labels.length;
  const innerW = Math.max(10, w - M.l - M.r);
  const innerH = height - M.t - M.b;
  const dataMax = Math.max(0, ...series.flatMap((s) => s.data));
  const { max, step } = niceScale(dataMax);
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  const bar = kind === "bar";
  const x = (i: number) => (bar ? M.l + ((i + 0.5) / n) * innerW : M.l + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW));
  const y = (v: number) => M.t + innerH - (v / max) * innerH;
  const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(innerW / 64))));

  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const i = bar ? Math.floor(((px - M.l) / innerW) * n) : Math.round(((px - M.l) / innerW) * (n - 1));
    setHover(i >= 0 && i < n ? i : null);
  };
  const keys = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setHover((h) => Math.min(n - 1, (h ?? -1) + 1));
    else if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? n) - 1));
    else if (e.key === "Escape") setHover(null);
    else return;
    e.preventDefault();
  };

  const bw = Math.min(40, (innerW / n / (series.length + 0.6)) * 0.9);
  const tipLeft = hover === null ? 0 : x(hover);
  return (
    <div className={`ui-gchart ${className}`.trim()}>
      {legend && (
        <ul className="ui-gchart__legend">
          {series.map((s, i) => (
            <li key={s.name} className={tcls(s.tone ?? TONES[i % TONES.length])}>
              <i aria-hidden />
              {s.name}
            </li>
          ))}
        </ul>
      )}
      <div ref={box} className="ui-gchart__box" style={{ height }} role="group" aria-label={label} tabIndex={0} onKeyDown={keys} onBlur={() => setHover(null)}>
        {w > 0 && (
          <svg width={w} height={height} aria-hidden onPointerMove={move} onPointerLeave={() => setHover(null)}>
            <defs>
              {series.map((s, i) => (
                <linearGradient key={s.name} id={`${uid}-g${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={`var(--${s.tone ?? TONES[i % TONES.length]})`} stopOpacity="0.32" />
                  <stop offset="1" stopColor={`var(--${s.tone ?? TONES[i % TONES.length]})`} stopOpacity="0" />
                </linearGradient>
              ))}
            </defs>
            {ticks.map((t) => (
              <g key={t}>
                <line className="ui-gchart__grid" x1={M.l} x2={w - M.r} y1={y(t)} y2={y(t)} />
                <text className="ui-gchart__tick" x={M.l - 8} y={y(t)} textAnchor="end" dominantBaseline="middle">
                  {fmt(t)}
                  {unit}
                </text>
              </g>
            ))}
            {labels.map((l, i) =>
              i % every === 0 ? (
                <text key={i} className="ui-gchart__tick" x={x(i)} y={height - 8} textAnchor="middle">
                  {l}
                </text>
              ) : null,
            )}
            {series.map((s, si) => {
              const col = `var(--${s.tone ?? TONES[si % TONES.length]})`;
              if (bar) {
                return s.data.map((v, i) => (
                  <rect key={`${s.name}${i}`} className="ui-gchart__bar" x={x(i) - (series.length * bw) / 2 + si * bw} y={y(v)} width={Math.max(2, bw - 2)} height={Math.max(0, M.t + innerH - y(v))} rx={2} fill={col} opacity={hover === null || hover === i ? 1 : 0.45} style={{ "--i": i } as CSSProperties} />
                ));
              }
              const d = s.data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
              return (
                <g key={s.name}>
                  {kind === "area" && <path d={`${d} L${x(n - 1).toFixed(1)} ${M.t + innerH} L${x(0).toFixed(1)} ${M.t + innerH} Z`} fill={`url(#${uid}-g${si})`} className="ui-gchart__area" />}
                  <path className="ui-gchart__line" d={d} pathLength={1} fill="none" stroke={col} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  {hover !== null && <circle cx={x(hover)} cy={y(s.data[hover] ?? 0)} r={4} fill="var(--bg)" stroke={col} strokeWidth={2} />}
                </g>
              );
            })}
            {hover !== null && !bar && <line className="ui-gchart__cross" x1={x(hover)} x2={x(hover)} y1={M.t} y2={M.t + innerH} />}
          </svg>
        )}
        {hover !== null && w > 0 && (
          <div className="ui-gchart__tip" role="status" style={{ left: Math.min(Math.max(tipLeft, 70), w - 70), top: M.t }}>
            <b>{labels[hover]}</b>
            {series.map((s, i) => (
              <span key={s.name} className={tcls(s.tone ?? TONES[i % TONES.length])}>
                <i aria-hidden />
                {s.name}: {fmt(s.data[hover] ?? 0)}
                {unit}
              </span>
            ))}
          </div>
        )}
      </div>
      <table className="ui-sr">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{xLabel}</th>
            {series.map((s) => (
              <th key={s.name} scope="col">
                {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((l, i) => (
            <tr key={i}>
              <th scope="row">{l}</th>
              {series.map((s) => (
                <td key={s.name}>
                  {fmt(s.data[i] ?? 0)}
                  {unit}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
