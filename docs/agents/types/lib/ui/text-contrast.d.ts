import type { CSSProperties } from "react";
/** Ajusta lo mínimo hacia negro o blanco; comprueba el color sRGB redondeado que se va a emitir. */
export declare function textColorOn(color: string, background: string): string | null;
/** Alias de texto: no sustituye los tokens medidos ni interpreta var(), transparencias o imágenes. */
export declare function textContrastStyle(style: CSSProperties): CSSProperties;
