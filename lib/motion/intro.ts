/**
 * Coordinación entre `Preloader` y los componentes que esperan a que termine para animarse (`SplitText`…).
 * Solo en el navegador. Sin `Preloader` en la página, `whenIntroDone` ejecuta la función al momento.
 */
export const INTRO_EVENT = "trama:intro-done";

/** ¿hay un preloader en pantalla que aún no ha terminado? (el DOM ya existe desde el servidor, antes de hidratar) */
export function introPending(): boolean {
  return Boolean(document.querySelector('[data-preloader]:not([data-preloader="done"])'));
}

/** Ejecuta `cb` cuando no quede preloader en marcha. Devuelve la función que cancela la espera. */
export function whenIntroDone(cb: () => void): () => void {
  if (!introPending()) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, cb, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, cb);
}

/** Lo llama el preloader al terminar (o al saltarse). */
export function finishIntro() {
  document.querySelectorAll("[data-preloader]").forEach((el) => el.setAttribute("data-preloader", "done"));
  window.dispatchEvent(new Event(INTRO_EVENT));
}
