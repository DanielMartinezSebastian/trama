import PriceTag from "./PriceTag";
import { vcls, type Variant } from "./variants";

export type ProductCardProps = {
  title: string;
  price: number;
  compareAt?: number;
  /** imagen principal (URL o data URI) */
  image: string;
  /** segunda imagen que aparece al pasar el puntero (opcional) */
  hoverImage?: string;
  /** texto alternativo de la imagen (vacío = decorativa, cuando el título ya dice lo mismo) */
  alt?: string;
  /** etiqueta sobre la imagen: «Novedad», «Últimas unidades» */
  badge?: string;
  /** línea secundaria: material, colección */
  meta?: string;
  href?: string;
  soldOut?: boolean;
  /** relación de aspecto «ancho / alto» de la imagen */
  ratio?: string;
  variant?: Variant;
  className?: string;
};

/**
 * Tarjeta de producto: imagen (con segunda imagen al pasar el puntero), etiqueta, título, material y precio. Todo el cuadro es
 * un solo enlace con un nombre claro («Taza Arcilla, 24 €»). Sin JS ni hidratación: el cambio de imagen es CSS (y en táctil no
 * existe, se ve la principal).
 */
export default function ProductCard({ title, price, compareAt, image, hoverImage, alt = "", badge, meta, href = "#", soldOut = false, ratio = "4 / 5", variant = "editorial", className = "" }: ProductCardProps) {
  return (
    <article className={`ui-pcard ${vcls(variant)} ${soldOut ? "is-out" : ""} ${className}`.trim()}>
      <a className="ui-pcard__a" href={href}>
        <span className="ui-pcard__img" style={{ aspectRatio: ratio }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} loading="lazy" decoding="async" />
          {hoverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="ui-pcard__alt" src={hoverImage} alt="" loading="lazy" decoding="async" aria-hidden />
          )}
          {(badge || soldOut) && <span className="ui-pcard__badge">{soldOut ? "Agotado" : badge}</span>}
        </span>
        <span className="ui-pcard__body">
          <span className="ui-pcard__t">{title}</span>
          {meta && <span className="ui-pcard__m">{meta}</span>}
          <PriceTag price={price} compareAt={compareAt} size="sm" />
        </span>
      </a>
    </article>
  );
}
