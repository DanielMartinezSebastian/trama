import { type ComponentType, type ReactElement, type ReactNode, type SVGProps } from "react";
import { type IconName } from "../../lib/ui/icons.js";
import { type Tone } from "./variants.js";
/** grosor visual del icono; cada familia lo traduce a lo suyo (Phosphor: pesos dibujados · Lucide: grosor de trazo · pixel: no aplica) */
export type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
export declare const ICON_WEIGHTS: IconWeight[];
type AnyIcon = ComponentType<any>;
/**
 * Familia de iconos: los nombres del set curado dibujados con otra librería. Cada familia vive en su propio módulo
 * (`@/lib/ui/icons-phosphor` → `phosphor`, `@/lib/ui/icons-lucide` → `lucide`) para que solo la descargue quien la usa.
 */
export type IconSetDef = {
    id: string;
    icons: Record<string, AnyIcon>;
    /** props propias de la librería para un peso (y un nombre, por si la familia mezcla fuentes) */
    props?: (weight: IconWeight, name: string) => Record<string, unknown>;
};
/**
 * Fija la familia y el peso de los iconos que hay dentro (los `<Icon name>` y los glifos `icon:…` de Button, NavBar,
 * FeatureGrid, Footer…): `<IconSet set={phosphor} weight="light">`. Sin `IconSet`, pixel art. Una web lo pone una vez
 * en su marco (`SiteFrame icons={{ set: phosphor, weight: "light" }}`).
 */
export declare function IconSet({ set, weight, children }: {
    set?: IconSetDef;
    weight?: IconWeight;
    children: ReactNode;
}): import("react").JSX.Element;
export type IconProps = {
    /** clave del set curado, p. ej. "heart" o "external-link" (agrupadas en `ICON_GROUPS`, `lib/ui/icons.ts`) */
    name?: IconName;
    /** alternativa a `name`: cualquier componente de icono (`pixelarticons/react/*`, Phosphor, Lucide…) sin pasar por el set */
    icon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
    /** familia para este icono (`phosphor`, `lucide` o "pixel"); por defecto la del `IconSet` que lo rodea, o pixel art */
    set?: IconSetDef | "pixel";
    /** peso: thin · light · regular · bold · fill · duotone; por defecto el del `IconSet` (o regular) */
    weight?: IconWeight;
    /** lado: px (número) o cualquier longitud CSS */
    iconSize?: number | string;
    /** @deprecated usa `iconSize` */
    size?: number | string;
    /** pixel art: variante de esquinas duras, cuando el icono la tiene (~1 de cada 2); si no, cae a la base */
    sharp?: boolean;
    /** token de color; sin él hereda el color del texto que lo rodea (`currentColor`) */
    tone?: Tone;
    /** nombre accesible; sin él el icono es decorativo y se oculta a los lectores de pantalla */
    label?: string;
    className?: string;
};
/**
 * Icono del set curado en tres familias con los mismos nombres: **pixel art** (Pixelarticons, MIT; por defecto),
 * **Phosphor** (MIT; seis pesos dibujados a mano, de fino a bitono: editorial, corporativo, lujo, producto) y **Lucide**
 * (ISC; trazo técnico de grosor ajustable). La familia y el peso salen de `set` / `weight` o del `IconSet` que lo rodea.
 * SVG con `currentColor`: se tiñe con el texto o con `tone`. Solo pixel art usa `shape-rendering: crispEdges`.
 */
export default function Icon({ name, icon, set, weight, iconSize, size: legacySize, sharp, tone, label, className }: IconProps): import("react").JSX.Element | null;
/** Reexportada por compatibilidad para componentes cliente; desde el servidor, importar de `./glyph`. */
export { renderGlyph } from "./glyph.js";
