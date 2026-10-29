/**
 * Seguimiento del scroll de un elemento, sin GSAP y compatible con Lenis (que mueve el scroll real). Llama a `cb` en
 * cada fotograma mientras el elemento está cerca de la pantalla. Devuelve la función que lo detiene. Solo en el navegador.
 */
export declare function trackScroll(el: Element, cb: (rect: DOMRect, vh: number) => void, margin?: string): () => void;
export declare const clamp01: (n: number) => number;
/** progreso 0–1 de una sección más alta que la ventana que se queda fija mientras se recorre (`position: sticky`) */
export declare const pinProgress: (r: DOMRect, vh: number) => number;
