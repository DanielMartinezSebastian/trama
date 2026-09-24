import { clamp, scrollState } from "./store";

/**
 * Mide el scroll del documento con GSAP ScrollTrigger y lo publica en `scrollState`
 * (progreso suavizado y velocidad). Devuelve la función que lo detiene.
 */
export async function trackScroll(trigger: HTMLElement): Promise<() => void> {
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  const st = ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      scrollState.raw = self.progress;
      gsap.to(scrollState, { p: self.progress, duration: 0.6, ease: "power2.out", overwrite: "auto" });
    },
  });
  const tick = () => {
    scrollState.v += (clamp(st.getVelocity() / 2200, -1, 1) - scrollState.v) * 0.15;
  };
  gsap.ticker.add(tick);
  return () => {
    st.kill();
    gsap.ticker.remove(tick);
  };
}
