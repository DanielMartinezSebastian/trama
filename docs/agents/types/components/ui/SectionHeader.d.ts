import { type Variant } from "./variants.js";
export type SectionHeaderProps = {
    kicker?: string;
    title?: string;
    subtitle?: string;
    align?: "left" | "center";
    rule?: "none" | "line" | "ascii" | "dots";
    /** md = titular de sección · giant = titular a lo ancho, apretado (los «Locations» o «Services» de salones y gimnasios) */
    titleSize?: "md" | "giant";
    /** palabra enorme y tenue en una franja recortada sobre el texto («blog», «tienda»); "" = sin ella */
    backdrop?: string;
    variant?: Variant;
    className?: string;
};
/** Cabecera de sección: sobretítulo, titular, subtítulo y regla decorativa; titular gigante y palabra de fondo opcionales. */
export default function SectionHeader({ kicker, title, subtitle, align, rule, titleSize, backdrop, variant, className }: SectionHeaderProps): import("react").JSX.Element;
