import { vcls, type Variant } from "./variants";

export type SectionHeaderProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  align?: "left" | "center";
  rule?: "none" | "line" | "ascii" | "dots";
  /** md = titular de sección · giant = titular a lo ancho, apretado (los «Locations» o «Services» de salones y gimnasios) */
  titleSize?: "md" | "giant";
  /** palabra enorme y tenue detrás de la cabecera, cortada por los bordes («blog», «tienda»); "" = sin ella */
  backdrop?: string;
  variant?: Variant;
  className?: string;
};

/** Cabecera de sección: sobretítulo, titular, subtítulo y regla decorativa; titular gigante y palabra de fondo opcionales. */
export default function SectionHeader({ kicker = "Cómo funciona", title = "Tres pasos y estás en el agua", subtitle = "Reserva, elige tu horario y nosotros nos ocupamos del resto.", align = "left", rule = "line", titleSize = "md", backdrop = "", variant = "minimal", className = "" }: SectionHeaderProps) {
  return (
    <header className={`ui-sh ${align === "center" ? "ui-sh--center" : ""} ${titleSize === "giant" ? "ui-sh--giant" : ""} ${backdrop ? "ui-sh--backdrop" : ""} ${vcls(variant)} ${className}`}>
      {backdrop && (
        <span className="ui-sh__word" aria-hidden>
          {backdrop}
        </span>
      )}
      {kicker && <span className="ui-sh__kicker">{kicker}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {rule === "line" && <span className="ui-sh__line" />}
      {rule === "ascii" && <span className="ui-sh__rule" aria-hidden>{"=".repeat(60)}</span>}
      {rule === "dots" && <span className="ui-sh__rule" aria-hidden>{". ".repeat(30)}</span>}
    </header>
  );
}
