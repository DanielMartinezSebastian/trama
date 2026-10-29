import "./swiperCss.js";
import { type Variant } from "./variants.js";
export declare const GALLERY_LAYOUTS: readonly ["thumbs", "coverflow", "cards", "fade", "cube", "creative", "filmstrip", "mosaic"];
export type GalleryLayout = (typeof GALLERY_LAYOUTS)[number];
export type ImageGalleryProps = {
    /** una por línea: «imagen|título|texto». La imagen es una URL/ruta, o `gen:N` para una escena de ejemplo generada (0, 1, 2…) */
    images?: string;
    /**
     * thumbs = imagen grande + tira de miniaturas · coverflow = carrusel 3D centrado · cards = baraja apilada ·
     * fade = fundido a pantalla completa · cube = cubo 3D · creative = diapositivas que entran girando ·
     * filmstrip = tira libre que se arrastra, de anchos distintos · mosaic = mosaico de dos filas
     */
    layout?: GalleryLayout;
    /** proporción de cada imagen (no afecta a filmstrip ni mosaic) */
    ratio?: "4/3" | "16/9" | "21/9" | "1/1" | "3/4";
    /** muestra título y texto sobre cada imagen */
    captions?: boolean;
    /** segundos entre imágenes; 0 = manual (siempre apagado con prefers-reduced-motion) */
    autoplay?: number;
    loop?: boolean;
    /** zoom con doble clic o pellizco (solo en thumbs y fade) */
    zoom?: boolean;
    variant?: Variant;
    className?: string;
};
/**
 * Galería de imágenes sobre Swiper (https://swiperjs.com/) con ocho maneras de presentar las mismas fotos. El estilo sale de
 * `variant` (borde, sombra y radio de cada imagen) y de los tokens, igual que el resto del kit; las flechas y los puntos
 * los define components/ui/styles/ui-carousel.css con las variables `--s-*`. Sin imágenes propias usa escenas pixel art generadas (`gen:N`).
 */
export default function ImageGallery({ images, layout, ratio, captions, autoplay, loop, zoom, variant, className }: ImageGalleryProps): import("react").JSX.Element;
