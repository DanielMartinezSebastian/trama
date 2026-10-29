/**
 * Imágenes de ejemplo para las galerías: escenas de mar en pixel art generadas como SVG, así el kit no depende de
 * ninguna imagen ni de la red. En cualquier prop de imágenes, `gen:N` (N = 0, 1, 2…) pide la escena N; cualquier otra
 * cosa se trata como una URL normal.
 */
/** Escena pixel art N (rejilla 40×30, 800×600). Determinista: la misma N da siempre la misma imagen. */
export declare function pixelScene(n: number): string;
/** Data URI de la escena N: se puede usar directamente en `<img src>`. */
export declare const pixelSceneUri: (n: number) => string;
/** `gen:N` → escena generada; cualquier otra cosa se devuelve tal cual (URL, ruta o data URI). */
export declare function resolveImage(src: string): string;
