import SectionHeader from "./SectionHeader";
import StatCounter from "./StatCounter";
import type { Tone } from "./variants";

export type StatsSectionProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  /** una cifra por línea: «valor|sufijo|etiqueta» (sufijo puede ir vacío) */
  stats?: string;
  tone?: Tone;
  /** cambia el número para repetir la animación de conteo desde fuera */
  playKey?: number;
  className?: string;
};

// El sufijo se dibuja con la fuente bitmap 7×7 de asciify-engine (solo ASCII): símbolos como + o %
// funcionan bien, pero letras acentuadas o "★" no. Cualquier palabra va en la etiqueta (texto normal).
const DEFAULT_STATS = "500|+|Alumnos formados\n4.9||Valoración media\n12||Años de experiencia";

/** Fila de cifras animadas (`StatCounter`) con cabecera: la sección de "resultados" típica de una landing. */
export default function StatsSection({
  kicker = "En números",
  title = "Diez años enseñando a leer el mar",
  subtitle = "",
  stats = DEFAULT_STATS,
  tone = "acc",
  playKey = 0,
  className = "",
}: StatsSectionProps) {
  const rows = stats.split("\n").map((l) => l.split("|")).filter((r) => r[0]?.trim());
  return (
    <section className={`ui-stats ${className}`}>
      <SectionHeader kicker={kicker} title={title} subtitle={subtitle} align="center" variant="minimal" />
      <div className="ui-stats__row">
        {rows.map(([value, suffix, label], i) => (
          <StatCounter
            key={(label ?? value) + i}
            value={parseFloat(value) || 0}
            suffix={suffix || ""}
            label={label}
            tone={tone}
            format={value.includes(".") ? "decimal" : "int"}
            playKey={playKey}
          />
        ))}
      </div>
    </section>
  );
}
