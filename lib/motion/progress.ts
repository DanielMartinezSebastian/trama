/**
 * Seguimiento del scroll de un elemento, sin GSAP y compatible con Lenis (que mueve el scroll real). Llama a `cb` en
 * cada fotograma mientras el elemento está cerca de la pantalla. Devuelve la función que lo detiene. Solo en el navegador.
 */
export function trackScroll(el: Element, cb: (rect: DOMRect, vh: number) => void, margin = "30% 0px"): () => void {
  let raf = 0;
  let near = true;
  const run = () => {
    raf = 0;
    cb(el.getBoundingClientRect(), window.innerHeight);
  };
  const on = () => {
    if (near && !raf) raf = requestAnimationFrame(run);
  };
  const io = new IntersectionObserver(
    ([e]) => {
      near = e.isIntersecting;
      if (near) on();
    },
    { rootMargin: margin },
  );
  io.observe(el);
  window.addEventListener("scroll", on, { passive: true });
  window.addEventListener("resize", on);
  run();
  return () => {
    io.disconnect();
    window.removeEventListener("scroll", on);
    window.removeEventListener("resize", on);
    cancelAnimationFrame(raf);
  };
}

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** progreso 0–1 de una sección más alta que la ventana que se queda fija mientras se recorre (`position: sticky`) */
export const pinProgress = (r: DOMRect, vh: number) => clamp01(-r.top / Math.max(1, r.height - vh));
