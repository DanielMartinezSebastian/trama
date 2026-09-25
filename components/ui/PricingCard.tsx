import Badge from "./Badge";
import Button from "./Button";
import { fillProps, type CardFill, type CardPattern, type CardTone } from "./fill";
import { vcls, type Variant } from "./variants";

export type PricingCardProps = {
  plan?: string;
  /** una línea bajo el nombre: para quién es el plan */
  description?: string;
  price?: string;
  /** precio anterior, tachado junto al actual (ofertas, descuento anual) */
  originalPrice?: string;
  period?: string;
  /** texto pequeño bajo el precio («facturado anualmente», «IVA incluido»…) */
  note?: string;
  /** una característica por línea; empezar la línea con «-» la marca como no incluida */
  features?: string;
  cta?: string;
  /** al pulsar el botón del plan */
  onSelect?: () => void;
  /** el botón como enlace (p. ej. "#contacto" o "/alta?plan=pro") */
  ctaHref?: string;
  highlighted?: boolean;
  /** cómo se destaca: glow = borde y halo de acento · invert = fondo de acento (paleta invertida) · border = solo borde grueso */
  highlight?: "glow" | "invert" | "border";
  badge?: string;
  /** classic: vertical · compact: sin lista (características en una línea) · horizontal: datos a la izquierda, precio y botón a la derecha */
  layout?: "classic" | "compact" | "horizontal";
  /** fondo de la tarjeta (ver fill.ts); `highlight="invert"` lo sustituye por el acento cuando está destacada */
  fill?: CardFill;
  pattern?: CardPattern;
  tone?: CardTone;
  variant?: Variant;
  className?: string;
};

/** Tarjeta de plan de precios. `highlighted` la destaca (con halo, invertida o con borde) y la marca con una insignia. */
export default function PricingCard({
  plan = "Pro",
  description = "",
  price = "29 €",
  originalPrice = "",
  period = "/ mes",
  note = "",
  features = "Proyectos ilimitados\nSoporte prioritario\nExportación a PNG y SVG",
  cta = "Empezar ahora",
  onSelect,
  ctaHref,
  highlighted = true,
  highlight = "glow",
  badge = "Más popular",
  layout = "classic",
  fill = "surface",
  pattern,
  tone,
  variant = "glass",
  className = "",
}: PricingCardProps) {
  const inverted = highlighted && highlight === "invert";
  const f = fillProps({ fill: inverted ? "accent" : fill, pattern, tone });
  const items = features
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => ({ text: l.replace(/^[-+]\s*/, ""), off: l.startsWith("-") }));
  const hl = highlighted ? `ui-price--hl ui-price--hl-${highlight}` : "";

  const head = (
    <div className="ui-price__head">
      <span className="ui-price__name">{plan.toUpperCase()}</span>
      {description && <p className="ui-price__desc">{description}</p>}
    </div>
  );
  const amount = (
    <div className="ui-price__cost">
      <div className="ui-price__amount">
        {originalPrice && <s className="ui-price__was">{originalPrice}</s>}
        {price}
        <small>{period}</small>
      </div>
      {note && <span className="ui-price__note">{note}</span>}
    </div>
  );
  const list =
    layout === "compact" ? (
      <p className="ui-price__inline">{items.filter((i) => !i.off).map((i) => i.text).join(" · ")}</p>
    ) : (
      <ul>
        {items.map((i) => (
          <li key={i.text} className={i.off ? "ui-price__off" : undefined}>
            {i.off && <span className="ui-sr">No incluido: </span>}
            {i.text}
          </li>
        ))}
      </ul>
    );
  const button = <Button label={cta} variant={variant} emphasis={highlighted ? "primary" : "secondary"} fullWidth href={ctaHref} onClick={onSelect} />;

  return (
    <article className={`ui-price ui-price--${layout} ${hl} ui-surface ${f.className} ${vcls(variant)} ${className}`} style={f.style}>
      {highlighted && badge && (
        <span className="ui-price__badge">
          <Badge text={badge} variant={variant} intent="accent" />
        </span>
      )}
      {layout === "horizontal" ? (
        <>
          <div className="ui-price__main">
            {head}
            {list}
          </div>
          <div className="ui-price__side">
            {amount}
            {button}
          </div>
        </>
      ) : (
        <>
          {head}
          {amount}
          {list}
          {button}
        </>
      )}
    </article>
  );
}
