import Carousel from "./Carousel";
import SectionHeader from "./SectionHeader";
import { vcls, type Variant } from "./variants";

export type TeamSectionProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  /** una por línea: «nombre|rol» */
  people?: string;
  /** grid = rejilla · carousel = carrusel de Swiper */
  layout?: "grid" | "carousel";
  /** con layout="carousel": tarjetas visibles en pantallas anchas */
  perView?: number;
  /** con layout="carousel": segundos entre tarjetas (0 = manual) */
  autoplay?: number;
  variant?: Variant;
  className?: string;
};

const DEFAULT_PEOPLE = "Marta Solé|Directora y monitora\nEnzo Rial|Monitor de iniciación\nCarla Duque|Monitora y fotógrafa";

/** Cabecera de sección + grid de perfiles. Sin fotos: usa el mismo avatar de iniciales que `Testimonial`. */
export default function TeamSection({ kicker = "El equipo", title = "Quién te va a enseñar", subtitle = "", people = DEFAULT_PEOPLE, layout = "grid", perView = 3, autoplay = 0, variant = "glass", className = "" }: TeamSectionProps) {
  const rows = people.split("\n").map((l) => l.split("|")).filter((r) => r[0]?.trim());
  const cards = rows.map(([name, role], i) => {
    const initials = (name ?? "")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return (
      <div key={name + i} className={`ui-team__card ui-surface ${vcls(variant)}`}>
        <span className="ui-team__avatar" aria-hidden>
          {initials}
        </span>
        <strong>{name}</strong>
        <span>{role}</span>
      </div>
    );
  });
  return (
    <section className={`ui-team ${className}`}>
      <SectionHeader kicker={kicker} title={title} subtitle={subtitle} align="center" variant="minimal" />
      {layout === "carousel" ? (
        <Carousel perView={perView} autoplay={autoplay} variant={variant} label={title}>
          {cards}
        </Carousel>
      ) : (
        <div className="ui-team__grid">{cards}</div>
      )}
    </section>
  );
}
