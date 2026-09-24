import type { CSSProperties } from "react";
import BlogCard, { type BlogCardProps } from "./BlogCard";
import Carousel from "./Carousel";
import { CARD_PATTERNS, pick, type CardFill } from "./fill";
import SectionHeader from "./SectionHeader";
import type { Variant } from "./variants";

export type ArticlesSectionProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  /** un artículo por línea: «categoría|título|extracto|fecha|min de lectura|imagen (opcional: URL o gen:N)|enlace (opcional)» */
  articles?: string;
  /**
   * grid: rejilla de tarjetas · featured: el primero grande (imagen de fondo) y el resto en columna ·
   * list: una columna de tarjetas horizontales · carousel: carrusel de Swiper
   */
  layout?: "grid" | "featured" | "list" | "carousel";
  /** maquetación de cada tarjeta en `grid` y `carousel` */
  cardLayout?: BlogCardProps["layout"];
  /** fondo de las tarjetas (ver fill.ts) */
  fill?: CardFill;
  /** varía trama y acento de tarjeta en tarjeta, para que una rejilla no sean tres copias */
  vary?: boolean;
  /** con layout="carousel": tarjetas visibles en pantallas anchas */
  perView?: number;
  /** con layout="carousel": segundos entre tarjetas (0 = manual) */
  autoplay?: number;
  variant?: Variant;
  className?: string;
};

export const DEFAULT_ARTICLES =
  "Técnica|Cinco errores al remar que te frenan la primera ola|El remo cuenta más que la fuerza: la postura y el timing son lo que de verdad te sube a la tabla.|12 mar 2026|4 min|gen:1\n" +
  "Equipo|Cómo elegir tu primera tabla de espuma|Volumen, largo y flotabilidad explicados sin tecnicismos, para acertar a la primera.|2 mar 2026|6 min|gen:4\n" +
  "Comunidad|Un fin de semana de surf trip por la costa norte|Crónica de nuestra última salida, con el mapa de las playas que visitamos.|21 feb 2026|5 min|gen:2";

/** Cabecera de sección + artículos (`BlogCard`) en rejilla, destacado, lista o carrusel: un blog listo para pegar. */
export default function ArticlesSection({
  kicker = "El blog",
  title = "Últimas entradas",
  subtitle = "",
  articles = DEFAULT_ARTICLES,
  layout = "grid",
  cardLayout = "stacked",
  fill = "surface",
  vary = true,
  perView = 3,
  autoplay = 0,
  variant = "glass",
  className = "",
}: ArticlesSectionProps) {
  const rows = articles.split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((r) => r[0] || r[1]);
  const cards = rows.map(([category, t, excerpt, date, readTime, image, href], i) => {
    const cardLayout_: BlogCardProps["layout"] =
      layout === "featured" ? (i === 0 ? "overlay" : "horizontal") : layout === "list" ? "horizontal" : cardLayout;
    return (
      <BlogCard
        key={t + i}
        category={category}
        title={t}
        excerpt={layout === "featured" && i > 0 ? "" : excerpt}
        date={date}
        readTime={readTime}
        image={image}
        href={href || undefined}
        layout={cardLayout_}
        fill={fill}
        pattern={vary ? pick(CARD_PATTERNS, i) : "dots"}
        tone={vary && i % 2 === 1 ? "acc2" : "acc"}
        variant={variant}
      />
    );
  });
  const featuredRows = Math.max(1, rows.length - 1);
  return (
    <section className={`ui-articles ${className}`}>
      <SectionHeader kicker={kicker} title={title} subtitle={subtitle} align="center" variant="minimal" />
      {layout === "carousel" ? (
        <Carousel perView={perView} autoplay={autoplay} variant={variant} label={title}>
          {cards}
        </Carousel>
      ) : (
        <div className={`ui-articles__grid ui-articles__grid--${layout}`} style={layout === "featured" ? ({ "--feat-rows": featuredRows } as CSSProperties) : undefined}>
          {cards}
        </div>
      )}
    </section>
  );
}
