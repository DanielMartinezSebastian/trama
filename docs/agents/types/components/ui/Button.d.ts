import { type AriaAttributes } from "react";
import { type Intent } from "./intent.js";
import { type Variant } from "./variants.js";
/** Color del botón: el vocabulario común de todo el kit (ver intent.ts). */
export declare const BUTTON_INTENTS: readonly ["accent", "neutral", "success", "info", "warning", "danger"];
export type ButtonIntent = Intent;
/** Énfasis: primary = relleno · secondary = superficie del estilo · outline = solo borde · ghost = solo texto · link = enlace */
export declare const BUTTON_EMPHASES: readonly ["primary", "secondary", "outline", "ghost", "link"];
export type ButtonEmphasis = (typeof BUTTON_EMPHASES)[number];
/** @deprecated usa `BUTTON_EMPHASES` / `ButtonEmphasis` */
export declare const BUTTON_TONES: readonly ["primary", "secondary", "outline", "ghost", "link"];
/** @deprecated usa `ButtonEmphasis` */
export type ButtonTone = ButtonEmphasis;
export type ButtonProps = {
    /** texto del botón; con `iconOnly` es la etiqueta accesible (aria-label) y no se pinta */
    label: string;
    variant?: Variant;
    /** énfasis: primary = relleno · secondary = superficie · outline = borde · ghost = texto · link = enlace */
    emphasis?: ButtonEmphasis;
    /** @deprecated usa `emphasis` */
    tone?: ButtonEmphasis;
    intent?: ButtonIntent;
    size?: "sm" | "md" | "lg";
    /** carácter decorativo junto al texto (→, +, >…), o un icono pixel art con `icon:heart` (ver Icon) */
    glyph?: string;
    glyphPosition?: "start" | "end";
    /** botón cuadrado solo con `glyph`; `label` pasa a ser su aria-label */
    iconOnly?: boolean;
    fullWidth?: boolean;
    disabled?: boolean;
    /** estado pulsado (botones conmutables, filtros, barra de herramientas): pinta el estado y pone aria-pressed */
    active?: boolean;
    /** muestra un indicador de carga, pone aria-busy y bloquea el clic */
    loading?: boolean;
    /** si se pasa, se pinta como enlace `<a>` con el aspecto del botón */
    href?: string;
    /** "submit" para enviar el `<form>` que lo contiene (ver `ContactForm`) */
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
} & AriaAttributes;
/**
 * Botón del sistema. La variante decide superficie, borde, radio, sombra y tipografía; `emphasis` el énfasis e `intent`
 * el color (el intent sustituye `--acc` solo dentro del botón, así que funciona igual en los 7 estilos).
 */
declare const Button: import("react").ForwardRefExoticComponent<{
    /** texto del botón; con `iconOnly` es la etiqueta accesible (aria-label) y no se pinta */
    label: string;
    variant?: Variant;
    /** énfasis: primary = relleno · secondary = superficie · outline = borde · ghost = texto · link = enlace */
    emphasis?: ButtonEmphasis;
    /** @deprecated usa `emphasis` */
    tone?: ButtonEmphasis;
    intent?: ButtonIntent;
    size?: "sm" | "md" | "lg";
    /** carácter decorativo junto al texto (→, +, >…), o un icono pixel art con `icon:heart` (ver Icon) */
    glyph?: string;
    glyphPosition?: "start" | "end";
    /** botón cuadrado solo con `glyph`; `label` pasa a ser su aria-label */
    iconOnly?: boolean;
    fullWidth?: boolean;
    disabled?: boolean;
    /** estado pulsado (botones conmutables, filtros, barra de herramientas): pinta el estado y pone aria-pressed */
    active?: boolean;
    /** muestra un indicador de carga, pone aria-busy y bloquea el clic */
    loading?: boolean;
    /** si se pasa, se pinta como enlace `<a>` con el aspecto del botón */
    href?: string;
    /** "submit" para enviar el `<form>` que lo contiene (ver `ContactForm`) */
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
} & AriaAttributes & import("react").RefAttributes<HTMLElement>>;
export default Button;
