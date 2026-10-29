import { createElement, type ReactNode } from "react";
import { ICONS, type IconName } from "@/lib/ui/icons";
import Icon from "./Icon";

const GLYPH_ICON = /^icon:([a-z0-9-]+)(:sharp)?$/;

/**
 * Para los componentes del kit que reciben un "glifo" como texto (`glyph="→"`, los `items` de FeatureGrid…):
 * `"icon:heart"` (o `"icon:heart:sharp"`) se dibuja como el icono de ese nombre en la familia del `IconSet` que lo rodea
 * (pixel art si no hay); cualquier otra cadena pasa tal cual, así que lo existente no cambia. Un nombre que no está en
 * el set se devuelve como texto — el error de tecleo se ve en pantalla en vez de desaparecer.
 *
 * Vive fuera de `Icon.tsx` («use client») para que Button, Footer, Timeline… puedan llamarla desde un Server Component.
 */
export function renderGlyph(glyph: string, size: number | string = "1.25em"): ReactNode {
  const m = GLYPH_ICON.exec(glyph);
  if (!m || !(m[1] in ICONS)) return glyph;
  return createElement(Icon, { name: m[1] as IconName, iconSize: size, sharp: Boolean(m[2]) });
}
