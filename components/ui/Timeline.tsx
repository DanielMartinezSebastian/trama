import { renderGlyph } from "./Icon";
import { vcls, type Variant } from "./variants";

export type TimelineProps = {
  /** un paso por línea con el formato «Título|Descripción» */
  steps?: string;
  /** contenido del marcador: número, letra o carácter fijo */
  marker?: "number" | "dot" | "glyph";
  /** con marker="glyph": un carácter, o un icono pixel art con `icon:star` (ver Icon) */
  glyph?: string;
  variant?: Variant;
  className?: string;
};

/** Línea de pasos vertical: proceso, hoja de ruta o historial. */
export default function Timeline({ steps = "Reserva|Eliges día y nivel en menos de un minuto.\nLlegada|Recibes neopreno y tabla en la playa.\nClase|Dos horas con monitor titulado.\nRepite|Bono de cinco clases con descuento.", marker = "number", glyph = "*", variant = "minimal", className = "" }: TimelineProps) {
  const rows = steps.split("\n").map((l) => l.split("|")).filter((p) => p[0]?.trim());
  return (
    <ol className={`ui-tl ${vcls(variant)} ${className}`}>
      {rows.map(([t, d], i) => (
        <li key={t + i}>
          <span className="ui-tl__dot" aria-hidden>{marker === "number" ? i + 1 : marker === "glyph" ? renderGlyph(glyph, 14) : ""}</span>
          <strong>{t}</strong>
          {d && <span>{d}</span>}
        </li>
      ))}
    </ol>
  );
}
