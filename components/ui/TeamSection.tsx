import Carousel from "./CarouselLazy";
import SectionHeader from "./SectionHeader";
import { splitEscaped } from "@/lib/ui/list";
import { vcls, type Variant } from "./variants";

export type TeamMember = {
  name: string;
  role?: string;
  /** foto (URL); sin ella, avatar de iniciales */
  photo?: string;
  /** dos o tres líneas sobre la persona */
  bio?: string;
  /** enlace propio: reservar con esa persona, su Instagram… */
  href?: string;
};

export type TeamSectionProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  /** una por línea: «nombre|rol|foto|bio|enlace» (solo el nombre es obligatorio) */
  people?: string;
  /** las mismas personas como datos; si se pasa, manda sobre `people` */
  members?: TeamMember[];
  /** grid = rejilla · carousel = carrusel de Swiper · rows = una fila por persona (nombre, bio y foto), como en los salones ·
   * wall = muro denso de retratos a sangre con el nombre y el rol encima, sin huecos (profesorado de una academia) */
  layout?: "grid" | "carousel" | "rows" | "wall";
  /** con layout="carousel": tarjetas visibles en pantallas anchas */
  perView?: number;
  /** con layout="carousel": segundos entre tarjetas (0 = manual) */
  autoplay?: number;
  /** marco de la foto: portrait (4:5) · square · circle · oval (4:5 con los extremos redondos) */
  shape?: "portrait" | "square" | "circle" | "oval";
  /** tratamiento de la foto: color · mono (blanco y negro) · mono-hover (blanco y negro que se colorea al pasar) */
  photoTone?: "color" | "mono" | "mono-hover";
  align?: "center" | "left";
  /** texto del enlace de cada persona («Reservar», «Instagram»); "" = sin enlaces */
  linkLabel?: string;
  /** con layout="rows": la fila entera es el enlace de la persona y su nombre se subraya al pasar (ALICE: toda la fila lleva
   * a reservar con esa estilista; docs/cuaderno/replica-nura.md) */
  rowLink?: boolean;
  /** tamaño del titular de la cabecera (`SectionHeader`) */
  titleSize?: "md" | "giant";
  /** palabra de fondo de la cabecera (`SectionHeader`); "" = sin ella */
  backdrop?: string;
  variant?: Variant;
  className?: string;
};

const DEFAULT_PEOPLE = "Marta Solé|Directora y monitora\nEnzo Rial|Monitor de iniciación\nCarla Duque|Monitora y fotógrafa";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/**
 * Cabecera de sección + perfiles del equipo. Con foto (marco y tratamiento a elegir) o, si falta, el avatar de iniciales;
 * biografía y un enlace por persona para reservar con ella. En rejilla, en carrusel, en filas o en muro.
 */
export default function TeamSection({ kicker = "El equipo", title = "Quién te va a enseñar", subtitle = "", people = DEFAULT_PEOPLE, members, layout = "grid", perView = 3, autoplay = 0, shape = "portrait", photoTone = "color", align = "center", linkLabel = "Reservar", rowLink = false, titleSize = "md", backdrop = "", variant = "glass", className = "" }: TeamSectionProps) {
  const list: TeamMember[] =
    members ??
    people
      .split("\n")
      .map((l) => splitEscaped(l, "|").map((x) => x.trim()))
      .filter((r) => r[0])
      .map(([name, role, photo, bio, href]) => ({ name, role, photo, bio, href }));
  const rows = layout === "rows";
  const cards = list.map(({ name, role, photo, bio, href }, i) => {
    if (layout === "wall") {
      const Tile = href ? "a" : "div";
      return (
        <Tile key={name + i} className="ui-team__tile" {...(href ? { href } : {})}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" loading="lazy" decoding="async" />
          ) : (
            <span className="ui-team__avatar" aria-hidden>{initials(name)}</span>
          )}
          <span className="ui-team__tile-txt">
            <strong>{name}</strong>
            {role && <span className="ui-team__role">{role}</span>}
          </span>
        </Tile>
      );
    }
    const media = photo ? (
      <span className={`ui-team__photo ui-team__photo--${shape}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" loading="lazy" decoding="async" />
      </span>
    ) : (
      <span className="ui-team__avatar" aria-hidden>
        {initials(name)}
      </span>
    );
    const link = href && linkLabel && (
      <a className="ui-team__link" href={href} aria-label={`${linkLabel}: ${name}`}>
        {linkLabel} <span aria-hidden>→</span>
      </a>
    );
    if (rows && rowLink && href) {
      // la fila entera es el enlace: dentro no puede haber otro, así que la etiqueta se pinta como texto
      return (
        <a key={name + i} className="ui-team__row ui-team__row--link" href={href}>
          <div className="ui-team__who">
            <strong>{name}</strong>
            {role && <span className="ui-team__role">{role}</span>}
          </div>
          <div className="ui-team__about">
            {bio && <p>{bio}</p>}
            {linkLabel && <span className="ui-team__link">{linkLabel} <span aria-hidden>→</span></span>}
          </div>
          {media}
        </a>
      );
    }
    return rows ? (
      <div key={name + i} className="ui-team__row">
        <div className="ui-team__who">
          <strong>{name}</strong>
          {role && <span className="ui-team__role">{role}</span>}
        </div>
        <div className="ui-team__about">
          {bio && <p>{bio}</p>}
          {link}
        </div>
        {media}
      </div>
    ) : (
      <div key={name + i} className={`ui-team__card ui-surface ${vcls(variant)} ${photo ? "has-photo" : ""}`}>
        {media}
        <strong>{name}</strong>
        {role && <span className="ui-team__role">{role}</span>}
        {bio && <p>{bio}</p>}
        {link}
      </div>
    );
  });
  return (
    <section className={`ui-team ui-team--${layout} ui-team--${align} ui-team--${photoTone} ${className}`}>
      <SectionHeader kicker={kicker} title={title} subtitle={subtitle} align={align} titleSize={titleSize} backdrop={backdrop} variant="minimal" />
      {layout === "carousel" ? (
        <Carousel perView={perView} autoplay={autoplay} variant={variant} label={title}>
          {cards}
        </Carousel>
      ) : (
        <div className={rows ? "ui-team__rows" : layout === "wall" ? "ui-team__wall" : "ui-team__grid"}>{cards}</div>
      )}
    </section>
  );
}
