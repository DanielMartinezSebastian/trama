import { vcls, type Variant } from "./variants";

export type SectionHeaderProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  align?: "left" | "center";
  rule?: "none" | "line" | "ascii" | "dots";
  variant?: Variant;
  className?: string;
};

/** Cabecera de sección: sobretítulo, titular, subtítulo y regla decorativa. */
export default function SectionHeader({ kicker = "Cómo funciona", title = "Tres pasos y estás en el agua", subtitle = "Reserva, elige tu horario y nosotros nos ocupamos del resto.", align = "left", rule = "line", variant = "minimal", className = "" }: SectionHeaderProps) {
  return (
    <header className={`ui-sh ${align === "center" ? "ui-sh--center" : ""} ${vcls(variant)} ${className}`}>
      {kicker && <span className="ui-sh__kicker">{kicker}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {rule === "line" && <span className="ui-sh__line" />}
      {rule === "ascii" && <span className="ui-sh__rule" aria-hidden>{"=".repeat(60)}</span>}
      {rule === "dots" && <span className="ui-sh__rule" aria-hidden>{". ".repeat(30)}</span>}
    </header>
  );
}
