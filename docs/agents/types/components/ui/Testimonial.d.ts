import { type CardFill, type CardPattern, type CardTone } from "./fill.js";
import { type Variant } from "./variants.js";
export type TestimonialProps = {
    quote?: string;
    author?: string;
    role?: string;
    /** 0 = sin estrellas */
    rating?: number;
    /** body = cita en la fuente del texto · display = en la de titulares (`--display`) */
    quoteFont?: "body" | "display";
    /** avatar con las iniciales del autor */
    avatar?: boolean;
    /** Foto de perfil; sin imagen o si falla la carga, se muestran iniciales. */
    avatarSrc?: string;
    /** Tamaño del retrato circular. */
    avatarSize?: "sm" | "md" | "lg";
    /** theme conserva el avatar de la variante; circle activa el retrato circular. */
    avatarShape?: "theme" | "circle";
    /** Tratamiento de la cita, independiente de la variante del tema. */
    presentation?: "card" | "soft" | "plain";
    variant?: Variant;
    /** fondo de la tarjeta: surface · tint · gradient · accent (invertida) · pattern · image (ver fill.ts) */
    fill?: CardFill;
    pattern?: CardPattern;
    tone?: CardTone;
    /** con fill="image": URL/ruta o `gen:N` */
    image?: string;
    className?: string;
};
/** Testimonio con retrato circular o iniciales, valoración y cita; tres tratamientos de superficie. */
export default function Testimonial({ quote, author, role, rating, quoteFont, avatar, avatarSrc, avatarSize, avatarShape, presentation, variant, fill, pattern, tone, image, className }: TestimonialProps): import("react").JSX.Element;
