import Button from "./Button";
import { vcls, type Variant } from "./variants";

export type CTASectionProps = {
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
  align?: "left" | "center";
  variant?: Variant;
  className?: string;
};

/** Banner de llamada a la acción final: titular corto, una frase y uno o dos botones sobre una superficie destacada. */
export default function CTASection({
  kicker = "",
  title = "El swell llega el sábado",
  subtitle = "Quedan doce plazas. Trae toalla, nosotros ponemos el resto.",
  primaryCta = "Apuntarme",
  primaryHref,
  secondaryHref,
  onPrimary,
  onSecondary,
  secondaryCta = "",
  align = "center",
  variant = "neon",
  className = "",
}: CTASectionProps) {
  return (
    <section className={`ui-cta ui-cta--${align} ui-surface ${vcls(variant)} ${className}`}>
      {kicker && <span className="ui-cta__kicker">{kicker}</span>}
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {(primaryCta || secondaryCta) && (
        <div className="ui-cta__actions">
          {primaryCta && <Button label={primaryCta} variant={variant} emphasis="primary" glyph="→" href={primaryHref} onClick={onPrimary} />}
          {secondaryCta && <Button label={secondaryCta} variant={variant} emphasis="ghost" href={secondaryHref} onClick={onSecondary} />}
        </div>
      )}
    </section>
  );
}
