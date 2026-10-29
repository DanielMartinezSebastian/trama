/**
 * Coordinación entre `Preloader` y los componentes que esperan a que termine para animarse (`SplitText`…).
 * Solo en el navegador. Sin `Preloader` en la página, `whenIntroDone` ejecuta la función al momento.
 */
export declare const INTRO_EVENT = "trama:intro-done";
/** ¿hay un preloader en pantalla que aún no ha terminado? (el DOM ya existe desde el servidor, antes de hidratar) */
export declare function introPending(): boolean;
/** Ejecuta `cb` cuando no quede preloader en marcha. Devuelve la función que cancela la espera. */
export declare function whenIntroDone(cb: () => void): () => void;
/** Lo llama el preloader al terminar (o al saltarse). */
export declare function finishIntro(): void;
