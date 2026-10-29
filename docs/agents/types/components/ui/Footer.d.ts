import { type Variant } from "./variants.js";
export type FooterProps = {
    brand?: string;
    tagline?: string;
    /** columnas separadas por «;», cada una «Título: enlace1, enlace2=/ruta, enlace3=https://…» (`=` convierte el texto en enlace) */
    columns?: string;
    /** iniciales o siglas de redes, separadas por comas; vacío = ninguna. Cada una puede ser un icono pixel art: `icon:github` (ver Icon) */
    social?: string;
    copyright?: string;
    variant?: Variant;
    className?: string;
};
/** Pie de página: marca, columnas de enlaces, redes y línea de copyright. Cierre habitual de cualquier landing. */
export default function Footer({ brand, tagline, columns, social, copyright, variant, className, }: FooterProps): import("react").JSX.Element;
