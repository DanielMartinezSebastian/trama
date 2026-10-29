import { type Variant } from "./variants.js";
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
/**
 * Cabecera de sección + perfiles del equipo. Con foto (marco y tratamiento a elegir) o, si falta, el avatar de iniciales;
 * biografía y un enlace por persona para reservar con ella. En rejilla, en carrusel, en filas o en muro.
 */
export default function TeamSection({ kicker, title, subtitle, people, members, layout, perView, autoplay, shape, photoTone, align, linkLabel, rowLink, titleSize, backdrop, variant, className }: TeamSectionProps): import("react").JSX.Element;
