import type { CSSProperties } from "react";
import { resolveImage } from "@/lib/ui/placeholder";

/**
 * Fondos de tarjeta compartidos por todas las tarjetas del kit (Panel, PricingCard, BlogCard, Testimonial, AsciiCard…).
 * La variante (`glass`, `solid`…) decide borde, radio, sombra y tipografía; el `fill` decide QUÉ hay detrás del
 * contenido. Son capas independientes: cualquier fill con cualquier variante. Todo sale de los tokens.
 *
 * - `surface`  el fondo propio de la variante (lo de siempre)
 * - `tint`     el acento mezclado con el fondo del tema
 * - `gradient` degradado suave de `--acc` a `--acc2`
 * - `accent`   invertida: fondo de acento y texto con el color de fondo (los hijos heredan la paleta invertida)
 * - `pattern`  trama de CSS (`pattern`: puntos, rejilla, diagonales, ondas, damero, rayos) sobre un tinte muy leve
 * - `image`    imagen de fondo (`image`: URL o `gen:N`) con un velo del color de fondo para que el texto se lea
 */
export const CARD_FILLS = ["surface", "tint", "gradient", "accent", "pattern", "image"] as const;
export type CardFill = (typeof CARD_FILLS)[number];
export const CARD_PATTERNS = ["dots", "grid", "diagonal", "waves", "checker", "rays"] as const;
export type CardPattern = (typeof CARD_PATTERNS)[number];
/** qué acento usa la tarjeta: el principal o el secundario (alternarlos da variedad en una rejilla) */
export type CardTone = "acc" | "acc2";

export type FillOptions = { fill?: CardFill; pattern?: CardPattern; tone?: CardTone; image?: string };

/** Clases y estilo inline de un fondo de tarjeta. Se aplican al raíz (el mismo que lleva `ui-surface`). */
export function fillProps({ fill = "surface", pattern = "dots", tone = "acc", image }: FillOptions): { className: string; style?: CSSProperties } {
  const cls = ["ui-cfill", `ui-cfill--${fill}`];
  if (fill === "pattern") cls.push(`ui-pat--${pattern}`);
  if (tone === "acc2") cls.push("ui-tone--acc2");
  const style = fill === "image" && image ? ({ "--fill-img": `url("${resolveImage(image)}")` } as CSSProperties) : undefined;
  return { className: cls.join(" "), style };
}

/** Elige un valor de una lista a partir de un índice: para que cada tarjeta de una rejilla sea distinta sin configurarla. */
export const pick = <T,>(list: readonly T[], i: number): T => list[((i % list.length) + list.length) % list.length];
