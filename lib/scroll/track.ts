import { pinProgress, trackScroll as medir } from "@/lib/motion/progress";
import { seguidorRaf } from "@/lib/motion/scroll-feel";
import { clamp, scrollState } from "./store";

/**
 * Mide el scroll de una sección (de su tope arriba a su base abajo) y lo publica en `scrollState`: progreso suavizado y
 * velocidad. Es la misma medida que el resto del kit (`trackScroll` de `lib/motion/progress`, compatible con Lenis), sin
 * GSAP (docs/42: un solo `trackScroll`). El progreso suavizado persigue al real en ~0,6 s, como el `power2.out` de 0,6 s
 * de la versión con GSAP; la velocidad (−1..1, 2200 px/s = 1) decae sola al parar. Devuelve la función que lo detiene
 * (asíncrona, como antes, para no cambiar a quien la usa).
 */
export async function trackScroll(trigger: HTMLElement): Promise<() => void> {
  const suave = seguidorRaf(5, (v) => (scrollState.p = v));
  let ultimoY = window.scrollY, ultimoT = performance.now(), raf = 0, objetivoV = 0;
  // la velocidad: medida en cada evento y suavizada en su propio bucle hasta que vuelve a 0
  const tick = () => {
    raf = 0;
    // sin eventos de scroll en 100 ms, el objetivo es 0
    if (performance.now() - ultimoT > 100) objetivoV = 0;
    scrollState.v += (objetivoV - scrollState.v) * 0.15;
    if (Math.abs(scrollState.v) > 1e-3 || objetivoV !== 0) raf = requestAnimationFrame(tick);
    else scrollState.v = 0;
  };
  const parar = medir(trigger, (r, vh) => {
    const p = pinProgress(r, vh);
    scrollState.raw = p;
    suave.set(p);
    const ahora = performance.now(), y = window.scrollY;
    const dt = Math.max(1, ahora - ultimoT);
    objetivoV = clamp((((y - ultimoY) / dt) * 1000) / 2200, -1, 1);
    ultimoY = y;
    ultimoT = ahora;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  return () => {
    parar();
    suave.stop();
    cancelAnimationFrame(raf);
  };
}
