import { fillProps, type CardFill, type CardPattern, type CardTone } from "./fill";
import { vcls, type Variant } from "./variants";

export type TestimonialProps = {
  quote?: string;
  author?: string;
  role?: string;
  /** 0 = sin estrellas */
  rating?: number;
  variant?: Variant;
  /** fondo de la tarjeta: surface · tint · gradient · accent (invertida) · pattern · image (ver fill.ts) */
  fill?: CardFill;
  pattern?: CardPattern;
  tone?: CardTone;
  /** con fill="image": URL/ruta o `gen:N` */
  image?: string;
  className?: string;
};

/** Testimonio con avatar de iniciales, valoración y cita. */
export default function Testimonial({ quote = "Levanté la tabla el primer día. El equipo es paciente y el mar, una maravilla.", author = "Lucía Pardo", role = "Alumna, curso de iniciación", rating = 5, variant = "glass", fill, pattern, tone, image, className = "" }: TestimonialProps) {
  const f = fillProps({ fill, pattern, tone, image });
  const initials = author.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <figure className={`ui-quote ui-surface ${f.className} ${vcls(variant)} ${className}`} style={{ margin: 0, ...f.style }}>
      {rating > 0 && (
        <div className="ui-quote__stars" aria-label={`${rating} de 5`}>
          {"★".repeat(Math.min(5, rating))}
          <span style={{ opacity: 0.25 }}>{"★".repeat(5 - Math.min(5, rating))}</span>
        </div>
      )}
      <blockquote>“{quote}”</blockquote>
      <figcaption className="ui-quote__by">
        <span className="ui-quote__avatar" aria-hidden>{initials}</span>
        <span>
          <strong>{author}</strong>
          <span>{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
