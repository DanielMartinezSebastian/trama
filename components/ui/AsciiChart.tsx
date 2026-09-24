"use client";

import { useEffect, useMemo, useState } from "react";
import { vcls, type Variant } from "./variants";

export type AsciiChartProps = {
  /** valores separados por comas */
  data?: string;
  /** etiquetas separadas por comas (una por valor) */
  labels?: string;
  kind?: "bars" | "hbars" | "spark" | "area";
  /** filas de altura del gráfico vertical */
  height?: number;
  fillChar?: string;
  /** anima el crecimiento al montar y al cambiar `playKey` */
  animate?: boolean;
  playKey?: number;
  variant?: Variant;
  className?: string;
};

const SPARK = "▁▂▃▄▅▆▇█";

/** Gráfico dibujado con caracteres: barras verticales, horizontales, sparkline o área. */
export default function AsciiChart({ data = "12, 18, 9, 24, 31, 27, 40, 36", labels = "L,M,X,J,V,S,D,L", kind = "bars", height = 10, fillChar = "█", animate = true, playKey = 0, variant = "terminal", className = "" }: AsciiChartProps) {
  const values = useMemo(() => data.split(",").map((s) => parseFloat(s)).filter((n) => Number.isFinite(n)), [data]);
  const names = useMemo(() => labels.split(",").map((s) => s.trim()), [labels]);
  const [k, setK] = useState(animate ? 0 : 1);

  useEffect(() => {
    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setK(1);
      return;
    }
    setK(0);
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 900);
      setK(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, playKey, data, kind]);

  const max = Math.max(1, ...values);
  const fc = (fillChar || "#")[0];
  let art = "";
  let foot = "";

  if (kind === "bars" || kind === "area") {
    const H = Math.max(3, height);
    const cols = values.map((v) => Math.max(0, Math.round((v / max) * H * k)));
    for (let r = H; r >= 1; r--) art += cols.map((c) => (c >= r ? (kind === "area" ? `${fc}${fc}${fc}` : ` ${fc} `) : "   ")).join(kind === "area" ? "" : " ") + "\n";
    foot = names.map((n) => (n || " ").slice(0, 3).padStart(2).padEnd(3)).join(kind === "area" ? "" : " ");
  } else if (kind === "hbars") {
    const W = 28;
    art = values.map((v, i) => `${(names[i] || "").padEnd(4)}${fc.repeat(Math.max(0, Math.round((v / max) * W * k))).padEnd(W)} ${Math.round(v * k)}`).join("\n");
  } else {
    art = values.map((v) => SPARK[Math.max(0, Math.min(SPARK.length - 1, Math.floor((v / max) * (SPARK.length - 1) * k)))]).join("");
  }

  return (
    <div className={`ui-chart ui-surface ${vcls(variant)} ${className}`} style={{ padding: 16, width: "fit-content", maxWidth: "100%", overflow: "auto" }}>
      <pre role="img" aria-label={`Gráfico: ${data}`}>{art}</pre>
      {foot && <div className="ui-chart__labels">{foot}</div>}
    </div>
  );
}
