import { type Variant } from "./variants.js";
/** Los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011, anexo II), con su abreviatura visible. */
export declare const ALLERGENS: readonly [{
    readonly id: "gluten";
    readonly label: "Gluten";
    readonly short: "Gl";
}, {
    readonly id: "crustaceos";
    readonly label: "Crustáceos";
    readonly short: "Cr";
}, {
    readonly id: "huevo";
    readonly label: "Huevo";
    readonly short: "Hu";
}, {
    readonly id: "pescado";
    readonly label: "Pescado";
    readonly short: "Pe";
}, {
    readonly id: "cacahuete";
    readonly label: "Cacahuete";
    readonly short: "Ca";
}, {
    readonly id: "soja";
    readonly label: "Soja";
    readonly short: "So";
}, {
    readonly id: "leche";
    readonly label: "Leche";
    readonly short: "Le";
}, {
    readonly id: "frutos-cascara";
    readonly label: "Frutos de cáscara";
    readonly short: "Fc";
}, {
    readonly id: "apio";
    readonly label: "Apio";
    readonly short: "Ap";
}, {
    readonly id: "mostaza";
    readonly label: "Mostaza";
    readonly short: "Mo";
}, {
    readonly id: "sesamo";
    readonly label: "Sésamo";
    readonly short: "Se";
}, {
    readonly id: "sulfitos";
    readonly label: "Sulfitos";
    readonly short: "Su";
}, {
    readonly id: "altramuces";
    readonly label: "Altramuces";
    readonly short: "Al";
}, {
    readonly id: "moluscos";
    readonly label: "Moluscos";
    readonly short: "Ml";
}];
export type AllergenId = (typeof ALLERGENS)[number]["id"];
export type MenuItem = {
    id?: string;
    name: string;
    description?: string;
    /** precio; 0 o sin precio = «consultar» */
    price?: number;
    /** precio anterior, segunda medida… se pinta tal cual: «1/2 ración 6 €», «porción» */
    priceNote?: string;
    allergens?: AllergenId[];
    /** etiquetas cortas: «nuevo», «vegano», «sin gluten», «de temporada» */
    tags?: string[];
    /** agotado hoy: se ve, pero no se puede añadir */
    soldOut?: boolean;
    image?: string;
};
export type MenuSection = {
    id?: string;
    title: string;
    note?: string;
    items: MenuItem[];
};
export type MenuListProps = {
    /**
     * La carta. Como texto: `#Sección|nota` abre una sección y cada línea siguiente es un plato,
     * `Nombre|descripción|precio|alérgenos separados por comas|etiquetas`. O como datos (`MenuSection[]`).
     */
    menu?: string | MenuSection[];
    /** list = nombre y precio unidos por puntos guía · columns = dos columnas · cards = tarjetas con foto */
    layout?: "list" | "columns" | "cards";
    /** barra de secciones para saltar (anclas) */
    nav?: boolean;
    /** filtro «Sin…»: oculta los platos que contienen los alérgenos marcados */
    filter?: boolean;
    /** leyenda de los 14 alérgenos al final */
    legend?: boolean;
    /** con `onAdd`, cada plato lleva un botón para añadirlo (pedido en mesa, para recoger) */
    onAdd?: (item: MenuItem, section: MenuSection) => void;
    addLabel?: string;
    currency?: string;
    locale?: string;
    /** nota legal o de servicio al pie («Precios con IVA. Pregunta por las trazas.») */
    footnote?: string;
    variant?: Variant;
    className?: string;
};
export declare function parseMenu(text: string): MenuSection[];
/**
 * Carta en HTML (no en PDF) con precios, etiquetas y los 14 alérgenos, filtro «Sin gluten / sin leche…» y botón de añadir
 * para el pedido en mesa o para recoger (R1 en docs/11). Cada alérgeno es una abreviatura con su nombre completo para el
 * lector de pantalla y en la leyenda: no depende de iconos ni de color. Lo que no puedes servir hoy se marca como agotado.
 */
export default function MenuList({ menu, layout, nav, filter, legend, onAdd, addLabel, currency, locale, footnote, variant, className, }: MenuListProps): import("react").JSX.Element;
