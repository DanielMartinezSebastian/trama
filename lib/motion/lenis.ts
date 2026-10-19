import type Lenis from "lenis";

/** Instancia activa de Lenis (la crea `SmoothScroll`). Permite pausar el scroll desde un menú o un modal. */
let instance: Lenis | null = null;

export const getLenis = () => instance;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};

/** Pausa el scroll de la página (menú a pantalla completa, preloader). Devuelve la función que lo reanuda. */
export function lockScroll(): () => void {
  const root = document.documentElement;
  const prev = root.style.overflow;
  root.style.overflow = "hidden";
  instance?.stop();
  return () => {
    root.style.overflow = prev;
    instance?.start();
  };
}
