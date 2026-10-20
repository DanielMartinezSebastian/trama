"use client";

import { useMemo, useRef } from "react";
import { encodeQr, type QrEcc } from "@/lib/ui/qr";
import { hasDarkText } from "@/lib/ui/tokens";
import { useTokens } from "@/lib/ui/useTokens";
import { tcls, type Tone } from "./variants";

export type QRCodeProps = {
  /** texto o URL que codifica (UTF-8; hasta ~210 bytes con nivel M) */
  value: string;
  /** corrección de errores: L 7 % · M 15 % · Q 25 % · H 30 % (más corrección = más módulos) */
  ecc?: QrEcc;
  /** square = módulos cuadrados · dots = puntos (dot matrix) · rounded = módulos redondeados. Los tres buscadores de las esquinas son siempre cuadrados: redondeados o en círculo, muchos lectores no los encuentran */
  shape?: "square" | "dots" | "rounded";
  /** ancho en px (el SVG escala sin perder nitidez) */
  codeSize?: number;
  /** token del color de los módulos; el fondo es --bg */
  tone?: Tone;
  /**
   * auto = si el tema es oscuro (texto claro), invierte: módulos en --bg sobre un cuadro --fg, porque un QR claro sobre oscuro
   * no lo leen todos los lectores · theme = siempre los colores del tema (tone sobre --bg)
   */
  contrast?: "auto" | "theme";
  /** margen en módulos (la norma pide 4; menos solo si el fondo alrededor es liso y claro) */
  quiet?: number;
  /** texto debajo del código («Escanea para ver la carta»); vacío = sin texto */
  caption?: string;
  /** nombre accesible; por defecto «Código QR: <value>» */
  label?: string;
  className?: string;
};

/**
 * Código QR en SVG, generado en el propio componente (sin dependencias ni servicios externos): la carta de la mesa, el
 * enlace de reserva, una tarjeta de visita o la página de una pieza en el escaparate. Funciona en servidor y sin JS.
 * Para que se escanee bien: contraste alto entre --fg/--acc y --bg, al menos 2 cm impreso y el margen de 4 módulos.
 */
export default function QRCode({ value, ecc = "M", shape = "square", codeSize = 180, tone = "fg", contrast = "auto", quiet = 4, caption = "", label, className = "" }: QRCodeProps) {
  const root = useRef<HTMLElement>(null);
  const tokens = useTokens(root);
  const inv = contrast === "auto" && !!tokens && !hasDarkText({ fg: tokens["--fg"], bg: tokens["--bg"] });
  const qr = useMemo(() => {
    try {
      return encodeQr(value || " ", ecc);
    } catch {
      return null;
    }
  }, [value, ecc]);
  if (!qr) return <p className="ui-qr__err">El texto es demasiado largo para un código QR (máx. ~270 bytes).</p>;

  const n = qr.size;
  const full = n + quiet * 2;
  const finders = [[0, 0], [n - 7, 0], [0, n - 7]];
  const inFinder = (x: number, y: number) => finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  // un solo trazado para todos los módulos: menos nodos y bordes sin costuras
  let d = "";
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      if (!qr.get(x, y)) continue;
      const X = x + quiet;
      const Y = y + quiet;
      if (shape === "square" || inFinder(x, y)) d += `M${X} ${Y}h1v1h-1z`;
      else if (shape === "dots") d += `M${X + 0.5} ${Y + 0.03}a.47 .47 0 1 0 .001 0z`; // radio 0,47: con menos, por debajo de ~5 px por módulo algunos lectores fallan
      else d += `M${X + 0.3} ${Y + 0.02}h.4a.28 .28 0 0 1 .28 .28v.4a.28 .28 0 0 1-.28 .28h-.4a.28 .28 0 0 1-.28-.28v-.4a.28 .28 0 0 1 .28-.28z`;
    }
  return (
    <figure ref={root} className={`ui-qr ui-qr--${shape} ${tcls(tone)} ${inv ? "ui-qr--inv" : ""} ${className}`.replace(/\s+/g, " ").trim()} style={{ width: codeSize }}>
      <svg viewBox={`0 0 ${full} ${full}`} role="img" aria-label={label ?? `Código QR: ${value}`} shapeRendering={shape === "square" ? "crispEdges" : "geometricPrecision"}>
        <rect width={full} height={full} className="ui-qr__bg" />
        <path d={d} className="ui-qr__m" />
      </svg>
      {caption && <figcaption className="ui-qr__cap">{caption}</figcaption>}
    </figure>
  );
}
