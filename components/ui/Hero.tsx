import Badge from "./Badge";
import Button from "./Button";
import type { Variant } from "./variants";

export type HeroProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  /** enlaces de los botones (sin ellos, `onPrimary`/`onSecondary` o nada) */
  primaryHref?: string;
  secondaryHref?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  /** insignias de confianza separadas por comas; vacío = ninguna */
  badges?: string;
  align?: "left" | "center";
  /** patrón decorativo de fondo, solo CSS (sin canvas) */
  backdrop?: "none" | "grid" | "dots" | "glow";
  variant?: Variant;
  className?: string;
};

/**
 * Cabecera de landing: sobretítulo, titular grande, subtítulo, una o dos llamadas a la acción y una
 * fila de insignias de confianza. El fondo decorativo es CSS puro (sin motor de render); para una escena
 * ASCII de verdad, combínalo con un componente de "Fondos" por detrás (ver guía §7).
 */
export default function Hero({
  kicker = "ESCUELA DE SURF · CANTABRIA",
  title = "Aprende a leer el mar",
  subtitle = "Del primer remo a tu primera ola verde. Neopreno, tabla y monitores titulados incluidos.",
  primaryCta = "Reservar clase",
  primaryHref,
  secondaryHref,
  onPrimary,
  onSecondary,
  secondaryCta = "Ver horarios",
  badges = "+500 alumnos, 4.9 ★ valoración, Grupos de 6",
  align = "center",
  backdrop = "grid",
  variant = "minimal",
  className = "",
}: HeroProps) {
  const chips = badges.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <section className={`ui-hero ui-hero--${align} ui-hero--bd-${backdrop} ${className}`}>
      <div className="ui-hero__inner">
        {kicker && <span className="ui-hero__kicker">{kicker}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {(primaryCta || secondaryCta) && (
          <div className="ui-hero__cta">
            {primaryCta && <Button label={primaryCta} variant={variant} emphasis="primary" glyph="→" href={primaryHref} onClick={onPrimary} />}
            {secondaryCta && <Button label={secondaryCta} variant={variant} emphasis="secondary" href={secondaryHref} onClick={onSecondary} />}
          </div>
        )}
        {chips.length > 0 && (
          <div className="ui-hero__trust">
            {chips.map((c) => (
              <Badge key={c} text={c} variant={variant} intent="neutral" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
