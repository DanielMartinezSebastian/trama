/**
 * Las nueve variantes de estilo del sistema (ver `docs/02-guia-de-componentes.md` §5).
 * Cada una fija las variables `--s-*` en `components/ui/styles/ui-kit.css`; los componentes solo eligen la variante.
 */
export declare const VARIANTS: readonly ["glass", "solid", "outline", "neon", "retro", "terminal", "minimal", "dotmatrix", "editorial"];
export type Variant = (typeof VARIANTS)[number];
/** Clases del contenedor raíz de un componente con variante. */
export declare const vcls: (variant: Variant) => string;
/** Colores de un componente: cuál de los tokens usa como color principal. */
/** Nivel de título que un componente con encabezado propio puede pintar (h1 queda para la página). */
export type HeadingLevel = 2 | 3 | 4 | 5 | 6;
export declare const TONES: readonly ["fg", "acc", "acc2", "mut"];
export type Tone = (typeof TONES)[number];
export declare const tcls: (tone: Tone) => string;
