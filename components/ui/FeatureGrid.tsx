import Carousel from "./Carousel";
import { renderGlyph } from "./Icon";
import SectionHeader from "./SectionHeader";
import { vcls, type Variant } from "./variants";

export type FeatureGridProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  /** una por línea: «glifo|título|texto». El glifo puede ser un icono pixel art: `icon:heart` (ver Icon) */
  items?: string;
  /** grid = rejilla · carousel = carrusel de Swiper */
  layout?: "grid" | "carousel";
  /** con layout="carousel": tarjetas visibles en pantallas anchas */
  perView?: number;
  /** con layout="carousel": segundos entre tarjetas (0 = manual) */
  autoplay?: number;
  variant?: Variant;
  className?: string;
};

const DEFAULT_ITEMS =
  "~|Monitores titulados|Todo el equipo tiene titulación oficial de escuela de surf y primeros auxilios.\n" +
  "#|Grupos reducidos|Máximo seis alumnos por clase para que cada uno reciba atención de verdad.\n" +
  "+|Material incluido|Neopreno, tabla y bolsa de deporte, sin coste extra ni sorpresas.";

/** Cabecera de sección + rejilla de "por qué elegirnos" (glifo + título + texto), la más pedida en cualquier landing. */
export default function FeatureGrid({ kicker = "Por qué nosotros", title = "Lo que nos hace distintos", subtitle = "", items = DEFAULT_ITEMS, layout = "grid", perView = 3, autoplay = 0, variant = "minimal", className = "" }: FeatureGridProps) {
  const rows = items.split("\n").map((l) => l.split("|")).filter((r) => r[0]?.trim());
  const cards = rows.map(([glyph, t, text], i) => (
    <div key={t + i} className={`ui-feats__item ui-surface ${vcls(variant)}`}>
      <span className="ui-feats__glyph" aria-hidden>
        {renderGlyph(glyph, 24)}
      </span>
      <strong>{t}</strong>
      <p>{text}</p>
    </div>
  ));
  return (
    <section className={`ui-feats ${className}`}>
      <SectionHeader kicker={kicker} title={title} subtitle={subtitle} align="center" variant="minimal" />
      {layout === "carousel" ? (
        <Carousel perView={perView} autoplay={autoplay} variant={variant} label={title}>
          {cards}
        </Carousel>
      ) : (
        <div className="ui-feats__grid">{cards}</div>
      )}
    </section>
  );
}
