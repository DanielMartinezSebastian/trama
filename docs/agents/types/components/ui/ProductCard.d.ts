import { type Variant } from "./variants.js";
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
export default function ProductCard({ title, price, compareAt, image, hoverImage, alt, badge, meta, href, soldOut, ratio, variant, className }: ProductCardProps): import("react").JSX.Element;
