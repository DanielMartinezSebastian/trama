import type Lenis from "lenis";

/** Instancia activa de Lenis (la crea `SmoothScroll`). Permite pausar el scroll desde un menú o un modal. */
let instance: Lenis | null = null;

export const getLenis = () => instance;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};

/**
 * Pausa el scroll de la página (menú a pantalla completa, carrito, paleta, preloader). Devuelve la función que lo reanuda.
 * Mantiene reservado el hueco de la barra de desplazamiento (`scrollbar-gutter: stable`): sin él, al quitar la barra la página
 * gana unos 15 px de ancho y todo lo que está fijo (cabeceras) y el contenido «salta» hacia un lado.
 */
export function lockScroll(): () => void {
  const root = document.documentElement;
  const prev = { overflow: root.style.overflow, gutter: root.style.scrollbarGutter };
  root.style.scrollbarGutter = "stable";
  root.style.overflow = "hidden";
  instance?.stop();
  return () => {
    root.style.overflow = prev.overflow;
    root.style.scrollbarGutter = prev.gutter;
    instance?.start();
  };
}
