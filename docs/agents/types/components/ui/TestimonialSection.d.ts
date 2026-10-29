import type { Variant } from "./variants.js";
export type TestimonialSectionProps = {
    kicker?: string;
    title?: string;
    subtitle?: string;
    /** un testimonio por línea: «cita|autor|rol|valoración (0-5)|URL de avatar opcional» */
    items?: string;
    /** grid = rejilla · carousel = carrusel de Swiper */
    layout?: "grid" | "carousel";
    /** center = cabecera y tarjetas centradas (landing) · left = alineado a la izquierda, a todo el ancho del contenedor (webs editoriales) */
    align?: "center" | "left";
    /** con layout="carousel": tarjetas visibles en pantallas anchas */
    perView?: number;
    /** con layout="carousel": segundos entre tarjetas (0 = manual) */
    autoplay?: number;
    /** con layout="carousel": slide = desplazamiento · fade = una cita que se funde con la siguiente · cards = baraja */
    effect?: "slide" | "fade" | "cards";
    /** nota media del resumen (0 = sin resumen). Con decimales: 4.8 */
    rating?: number;
    /** número total de reseñas («642 reseñas»): la prueba social se cree con número y fuente, no solo con estrellas */
    count?: number;
    /** de dónde salen («Google», «Tripadvisor»…) */
    source?: string;
    /** enlace a todas las reseñas en la fuente (se abre en otra pestaña) */
    sourceHref?: string;
    /** reparto por estrellas, «5:540, 4:72, 3:18, 2:7, 1:5»: barras que además filtran las citas por valoración */
    distribution?: string;
    /** citas visibles al principio en la rejilla (0 = todas); el resto, con «Ver más» */
    pageSize?: number;
    /** body = cita en la fuente del texto · display = en la de titulares (`--display`), como una cita de revista */
    quoteFont?: "body" | "display";
    /** avatar con iniciales en cada cita */
    avatars?: boolean;
    /** Tratamiento visual de las citas, independiente del tema. */
    presentation?: "card" | "soft" | "plain";
    /** Tamaño de los retratos circulares. */
    avatarSize?: "sm" | "md" | "lg";
    /** theme mantiene la forma anterior; circle usa retratos circulares. */
    avatarShape?: "theme" | "circle";
    variant?: Variant;
    className?: string;
};
/**
 * Prueba social lista para pegar: cabecera, resumen de valoraciones (media, número, fuente y reparto por estrellas) y las
 * citas (`Testimonial`) en rejilla o carrusel. El reparto filtra las citas por estrellas y la rejilla puede empezar con
 * unas pocas y «Ver más». Con `align="left"` y `quoteFont="display"` encaja en webs editoriales (ver /sitios/almibar).
 */
export default function TestimonialSection({ kicker, title, subtitle, items, layout, align, perView, autoplay, effect, rating, count, source, sourceHref, distribution, pageSize, quoteFont, avatars, presentation, avatarSize, avatarShape, variant, className, }: TestimonialSectionProps): import("react").JSX.Element;
