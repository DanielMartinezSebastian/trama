/**
 * Estado de scroll compartido entre GSAP (que lo mide) y los sketches (que lo leen
 * en cada fotograma). `p` es el progreso suavizado 0..1 dentro de la altura de 300vh;
 * `v` es la velocidad normalizada (-1..1) y decae sola al parar.
 */
export const scrollState = {
  /** progreso suavizado por GSAP */
  p: 0,
  /** progreso directo, sin suavizar */
  raw: 0,
  /** velocidad de scroll normalizada -1..1 */
  v: 0,
  /** texto que un demo puede publicar para mostrarlo en la interfaz */
  label: "",
};

export type ScrollState = typeof scrollState;

export function resetScroll() {
  scrollState.p = 0;
  scrollState.raw = 0;
  scrollState.v = 0;
  scrollState.label = "";
}

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
/** Progreso local: 0 antes de `a`, 1 después de `b`. */
export const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const smooth = (k: number) => k * k * (3 - 2 * k);

