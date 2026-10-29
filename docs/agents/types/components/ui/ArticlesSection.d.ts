import { type BlogCardProps } from "./BlogCard.js";
import { type CardFill } from "./fill.js";
import type { Variant } from "./variants.js";
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
export declare const DEFAULT_ARTICLES: string;
/** Cabecera de sección + artículos (`BlogCard`) en rejilla, destacado, lista o carrusel: un blog listo para pegar. */
export default function ArticlesSection({ kicker, title, subtitle, articles, layout, cardLayout, fill, vary, perView, autoplay, variant, className, }: ArticlesSectionProps): import("react").JSX.Element;
