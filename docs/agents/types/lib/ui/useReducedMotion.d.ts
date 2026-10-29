export declare const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
/**
 * `true` si el sistema pide reducir el movimiento (WCAG 2.3.3). Se actualiza si la preferencia cambia con la página abierta.
 * En el servidor devuelve `false`: los componentes deben arrancar igual y frenar al hidratar.
 */
export declare function useReducedMotion(): boolean;
/** Lectura puntual (dentro de un efecto o un manejador): `true` si el sistema pide reducir el movimiento. `false` en el servidor. */
export declare const prefersReducedMotion: () => boolean;
