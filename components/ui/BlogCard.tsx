import { resolveImage } from "@/lib/ui/placeholder";
import { fillProps, type CardFill, type CardPattern, type CardTone } from "./fill";
import { vcls, type HeadingLevel, type Variant } from "./variants";

export type BlogCardProps = {
  category?: string;
  title?: string;
  /** nivel del título (h2–h6) para respetar el orden de la página; el aspecto no cambia */
  headingLevel?: HeadingLevel;
  excerpt?: string;
  date?: string;
  readTime?: string;
  /** autor; con él se pinta un avatar de iniciales en el pie */
  author?: string;
  /** imagen de portada: URL/ruta o `gen:N` (escena pixel art de ejemplo) */
  image?: string;
  /** qué va en la cabecera: la imagen, una trama de CSS, el patrón de caracteres o nada. Por defecto, la imagen si hay */
  media?: "image" | "pattern" | "glyph" | "none";
  /** trama de la cabecera con `media="pattern"` */
  pattern?: CardPattern;
  /** carácter del patrón con `media="glyph"` */
  glyph?: string;
  /**
   * stacked: cabecera arriba · horizontal: cabecera a la izquierda (se apila sola si no cabe) ·
   * overlay: la imagen ocupa toda la tarjeta y el texto va encima · minimal: sin cabecera, solo texto
   */
  layout?: "stacked" | "horizontal" | "overlay" | "minimal";
  /** fondo de la tarjeta (ver fill.ts); con `overlay` y una imagen, la imagen es el fondo */
  fill?: CardFill;
  tone?: CardTone;
  /** si se pasa, toda la tarjeta es un enlace */
  href?: string;
  variant?: Variant;
  className?: string;
};

/** Tarjeta de artículo: cabecera (imagen, trama o caracteres), categoría, titular, extracto, autor y meta. */
export default function BlogCard({
  category = "Técnica",
  title = "Cinco errores al remar que te frenan la primera ola",
  headingLevel = 3,
  excerpt = "El remo cuenta más que la fuerza: la postura y el timing son lo que de verdad te sube a la tabla.",
  date = "12 mar 2026",
  readTime = "4 min",
  author = "",
  image = "",
  media,
  pattern = "dots",
  glyph = "~",
  layout = "stacked",
  fill = "surface",
  tone = "acc",
  href,
  variant = "glass",
  className = "",
}: BlogCardProps) {
  const head = layout === "minimal" ? "none" : (media ?? (image ? "image" : "pattern"));
  const overlayImage = layout === "overlay" && head === "image" && image;
  const f = fillProps({ fill: overlayImage ? "image" : layout === "overlay" && fill === "surface" ? "gradient" : fill, pattern, tone, image });
  const Root = href ? "a" : "article";
  const Heading = `h${headingLevel}` as const;
  const initials = author.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  return (
    <Root
      href={href}
      className={`ui-blog ui-blog--${layout} ${href ? "ui-blog--link" : ""} ui-surface ${f.className} ${vcls(variant)} ${className}`}
      style={f.style}
    >
      {head !== "none" && layout !== "overlay" && (
        <div className={`ui-blog__media ui-blog__media--${head} ${head === "pattern" ? `ui-pat--${pattern}` : ""}`} aria-hidden>
          {head === "image" && image ? <img src={resolveImage(image)} alt="" loading="lazy" decoding="async" /> : head === "glyph" ? (glyph || "~")[0].repeat(220) : null}
        </div>
      )}
      <div className="ui-blog__body">
        {category && <span className="ui-blog__cat">{category}</span>}
        <Heading className="ui-blog__title">{title}</Heading>
        {excerpt && <p>{excerpt}</p>}
        <div className="ui-blog__meta">
          {author && (
            <span className="ui-blog__author">
              <span className="ui-blog__avatar" aria-hidden>{initials}</span>
              {author}
            </span>
          )}
          {date && <span>{date}</span>}
          {readTime && <span>{readTime} de lectura</span>}
          {href && <span className="ui-blog__more" aria-hidden>Leer →</span>}
        </div>
      </div>
    </Root>
  );
}
