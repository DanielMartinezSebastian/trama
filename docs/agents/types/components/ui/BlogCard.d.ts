import { type CardFill, type CardPattern, type CardTone } from "./fill.js";
import { type HeadingLevel, type Variant } from "./variants.js";
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
export default function BlogCard({ category, title, headingLevel, excerpt, date, readTime, author, image, media, pattern, glyph, layout, fill, tone, href, variant, className, }: BlogCardProps): import("react").JSX.Element;
