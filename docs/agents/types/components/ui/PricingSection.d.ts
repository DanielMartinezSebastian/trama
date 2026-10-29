import { type PricingCardProps } from "./PricingCard.js";
import type { CardFill } from "./fill.js";
import { type Variant } from "./variants.js";
import { type PricingPlan } from "../../lib/ui/pricing.js";
export type { PricingPlan } from "../../lib/ui/pricing.js";
export type PricingSectionProps = {
    kicker?: string;
    title?: string;
    subtitle?: string;
    /**
     * un plan por línea: «nombre|precio|periodo|destacado(si/no)|características separadas por ;|descripción|precio anual».
     * Las dos últimas son opcionales; una característica que empieza por «-» se muestra como no incluida. Si algún plan
     * trae precio anual, aparece el selector Mensual / Anual.
     */
    plans?: string | PricingPlan[];
    /**
     * grid = rejilla de tarjetas · joined = una sola pieza con los planes en columnas separadas por líneas finas (Linear,
     * Vercel; la insignia va junto al nombre) · list = una columna de tarjetas horizontales · carousel = carrusel de Swiper
     */
    layout?: "grid" | "joined" | "list" | "carousel" | "menu" | "comparison";
    /** En comparison, una fila por línea: «Característica|valor plan 1|valor plan 2|…». Sin ella se comparan features. */
    comparison?: string;
    /** Nombre accesible de la tabla, independiente del titular visual. */
    caption?: string;
    /** Condiciones comunes visibles bajo los precios. */
    footnote?: string;
    /** maquetación de cada tarjeta en `grid` y `carousel` */
    cardLayout?: "classic" | "compact";
    /** cómo se destaca el plan marcado (ver PricingCard) */
    highlight?: PricingCardProps["highlight"];
    /** texto de la insignia del plan destacado (vacío = sin insignia) */
    badge?: string;
    /** dónde va la insignia (con layout="joined", siempre junto al nombre) */
    badgePlacement?: PricingCardProps["badgePlacement"];
    planCase?: PricingCardProps["planCase"];
    marker?: PricingCardProps["marker"];
    /** selector Mensual / Anual: accent = la opción elegida en el acento · neutral = gris discreto, el acento solo en el ahorro */
    toggle?: "accent" | "neutral";
    /** fondo de las tarjetas no destacadas (ver fill.ts) */
    fill?: CardFill;
    /** texto del periodo cuando se elige facturación anual */
    yearlyPeriod?: string;
    /** etiqueta del ahorro junto a «Anual» (vacío = sin etiqueta) */
    yearlyNote?: string;
    /** texto del botón de cada plan */
    cta?: string;
    /** el botón de cada plan como enlace ("#contacto", "/alta"); se le añade `?plan=<nombre>&billing=monthly|yearly` si no lleva ya `?` ni `#` */
    ctaHref?: string;
    /** al elegir un plan: su nombre, el precio y el periodo mostrados y si la facturación es anual */
    onSelectPlan?: (plan: {
        name: string;
        price: string;
        period: string;
        yearly: boolean;
        id?: string;
    }) => void;
    /** con layout="carousel": tarjetas visibles en pantallas anchas */
    perView?: number;
    /** con layout="carousel": segundos entre tarjetas (0 = manual) */
    autoplay?: number;
    variant?: Variant;
    className?: string;
};
export declare const DEFAULT_PLANS: string;
/** Cabecera + planes (`PricingCard`), con selector mensual/anual opcional: la sección de precios lista para pegar. */
export default function PricingSection({ kicker, title, subtitle, plans, layout, comparison, caption, footnote, cardLayout, highlight, badge, badgePlacement, planCase, marker, toggle, fill, yearlyPeriod, yearlyNote, cta, ctaHref, onSelectPlan, perView, autoplay, variant, className, }: PricingSectionProps): import("react").JSX.Element;
