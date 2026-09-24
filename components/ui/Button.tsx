"use client";

import { forwardRef, type AriaAttributes, type Ref } from "react";
import { renderGlyph } from "./Icon";
import { INTENTS, type Intent } from "./intent";
import { vcls, type Variant } from "./variants";

/** Color del botón: el vocabulario común de todo el kit (ver intent.ts). */
export const BUTTON_INTENTS = INTENTS;
export type ButtonIntent = Intent;
/** Énfasis: primary = relleno · secondary = superficie del estilo · outline = solo borde · ghost = solo texto · link = enlace */
export const BUTTON_EMPHASES = ["primary", "secondary", "outline", "ghost", "link"] as const;
export type ButtonEmphasis = (typeof BUTTON_EMPHASES)[number];
/** @deprecated usa `BUTTON_EMPHASES` / `ButtonEmphasis` */
export const BUTTON_TONES = BUTTON_EMPHASES;
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
} & AriaAttributes; // aria-* se reenvían al elemento (p. ej. aria-describedby de Tooltip, aria-expanded de un menú)

/**
 * Botón del sistema. La variante decide superficie, borde, radio, sombra y tipografía; `emphasis` el énfasis e `intent`
 * el color (el intent sustituye `--acc` solo dentro del botón, así que funciona igual en los 7 estilos).
 */
const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    label,
    variant = "solid",
    emphasis, tone: legacyTone,
    intent = "accent",
    size = "md",
    glyph = "",
    glyphPosition = "end",
    iconOnly = false,
    fullWidth = false,
    disabled = false,
    active,
    loading = false,
    href,
    type = "button",
    onClick,
    className = "",
    ...aria
  },
  ref,
) {
  const tone = emphasis ?? legacyTone ?? "primary"; // (la clase CSS sigue siendo ui-button--<énfasis>)
  const g = glyph ? <span className="ui-button__glyph" aria-hidden>{renderGlyph(glyph)}</span> : null;
  const blocked = disabled || loading;
  const cls = [
    "ui-button",
    `ui-button--${tone}`,
    `ui-button--${size}`,
    `ui-intent--${intent}`,
    fullWidth && "ui-button--full",
    iconOnly && "ui-button--icon",
    active && "is-active",
    loading && "is-loading",
    vcls(variant),
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {loading && <span className="ui-button__spin" aria-hidden />}
      {!iconOnly && glyphPosition === "start" && g}
      {iconOnly ? (g ?? <span aria-hidden>{label.slice(0, 1)}</span>) : <span className="ui-button__label">{label}</span>}
      {!iconOnly && glyphPosition === "end" && g}
    </>
  );
  const common = {
    ...aria,
    className: cls,
    "aria-label": iconOnly ? label : aria["aria-label"],
    "aria-pressed": active === undefined ? aria["aria-pressed"] : active,
    "aria-busy": loading || undefined,
  };

  if (href !== undefined) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        {...common}
        href={blocked ? undefined : href}
        aria-disabled={blocked || undefined}
        role={active === undefined ? undefined : "button"}
        onClick={blocked ? undefined : onClick}
      >
        {content}
      </a>
    );
  }
  return (
    <button ref={ref as Ref<HTMLButtonElement>} {...common} type={type} disabled={blocked} onClick={onClick}>
      {content}
    </button>
  );
});
export default Button;
