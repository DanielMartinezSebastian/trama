/**
 * Las ocho variantes de estilo del sistema (ver `docs/02-guia-de-componentes.md` §5).
 * Cada una fija las variables `--s-*` en `components/ui/styles/ui-kit.css`; los componentes solo eligen la variante.
 */
export const VARIANTS = ["glass", "solid", "outline", "neon", "retro", "terminal", "minimal", "dotmatrix"] as const;
export type Variant = (typeof VARIANTS)[number];

/** Clases del contenedor raíz de un componente con variante. */
export const vcls = (variant: Variant) => `ui-s ui-s--${variant}`;

/** Colores de un componente: cuál de los tokens usa como color principal. */
/** Nivel de título que un componente con encabezado propio puede pintar (h1 queda para la página). */
export type HeadingLevel = 2 | 3 | 4 | 5 | 6;

export const TONES = ["fg", "acc", "acc2", "mut"] as const;
export type Tone = (typeof TONES)[number];
export const tcls = (tone: Tone) => `ui-tone--${tone}`;
