import { type CardFill, type CardPattern, type CardTone } from "./fill.js";
import { type Variant } from "./variants.js";
export type PricingCardProps = {
    plan?: string;
    /** una línea bajo el nombre: para quién es el plan */
    description?: string;
    price?: string;
    /** precio anterior, tachado junto al actual (ofertas, descuento anual) */
    originalPrice?: string;
    period?: string;
    /** texto pequeño bajo el precio («facturado anualmente», «IVA incluido»…) */
    note?: string;
    /** Dato breve del servicio o frecuencia del plan, independiente del periodo de cobro. */
    meta?: string;
    /** una característica por línea; empezar la línea con «-» la marca como no incluida */
    features?: string;
    cta?: string;
    /** al pulsar el botón del plan */
    onSelect?: () => void;
    /** el botón como enlace (p. ej. "#contacto" o "/alta?plan=pro") */
    ctaHref?: string;
    highlighted?: boolean;
    /**
     * cómo se destaca: glow = borde y halo de acento · invert = fondo de acento (paleta invertida) · border = solo borde grueso ·
     * lift = superficie apenas más clara con una línea de acento arriba y luz cenital (webs de producto: Linear, Vercel)
     */
    highlight?: "glow" | "invert" | "border" | "lift";
    badge?: string;
    /** tab = insignia a caballo sobre el borde superior · inline = junto al nombre del plan */
    badgePlacement?: "tab" | "inline";
    /** upper = nombre en versalitas espaciadas · none = tal cual, en el color del texto */
    planCase?: "upper" | "none";
    /** marca de cada característica: «+» (plus) o una marca de verificación fina (check); las no incluidas, atenuadas sin tachar */
    marker?: "plus" | "check";
    /** classic: vertical · compact: sin lista (características en una línea) · horizontal: datos a la izquierda, precio y botón a la derecha */
    layout?: "classic" | "compact" | "horizontal";
    /** fondo de la tarjeta (ver fill.ts); `highlight="invert"` lo sustituye por el acento cuando está destacada */
    fill?: CardFill;
    pattern?: CardPattern;
    tone?: CardTone;
    variant?: Variant;
    className?: string;
};
/** Tarjeta de plan de precios. `highlighted` la destaca (con halo, invertida o con borde) y la marca con una insignia. */
export default function PricingCard({ plan, description, price, originalPrice, period, note, meta, features, cta, onSelect, ctaHref, highlighted, highlight, badge, badgePlacement, planCase, marker, layout, fill, pattern, tone, variant, className, }: PricingCardProps): import("react").JSX.Element;
