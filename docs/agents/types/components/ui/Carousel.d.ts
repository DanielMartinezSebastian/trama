import { type ReactNode } from "react";
import "./swiperCss.js";
import { type Variant } from "./variants.js";
export type CarouselProps = {
    /** cada hijo es una diapositiva */
    children: ReactNode;
    /** diapositivas visibles en pantallas anchas (en móvil baja sola a 1, en tablet a 2). Ignorado con `effect` ≠ slide */
    perView?: number;
    /** separación entre diapositivas, en px */
    gap?: number;
    loop?: boolean;
    /** segundos entre diapositivas; 0 = sin reproducción automática (siempre apagado con prefers-reduced-motion) */
    autoplay?: number;
    arrows?: boolean;
    dots?: "none" | "bullets" | "progress" | "fraction";
    /** slide = desplazamiento · fade = fundido · cards = baraja apilada */
    effect?: "slide" | "fade" | "cards";
    /** cinta continua sin paradas (marcas, logos): ignora flechas, puntos y `perView` */
    ticker?: boolean;
    variant?: Variant;
    /** nombre accesible del carrusel */
    label?: string;
    className?: string;
};
/**
 * Carrusel genérico sobre Swiper (https://swiperjs.com/) con el lenguaje del kit: flechas y puntos cuadrados que leen las
 * variables `--s-*` de la variante, y sin estilos propios de color (todo sale de los tokens). Sirve para cualquier lista de
 * tarjetas: los componentes de sección lo usan con su prop `layout="carousel"`.
 */
export default function Carousel({ children, perView, gap, loop, autoplay, arrows, dots, effect, ticker, variant, label, className }: CarouselProps): import("react").JSX.Element;
