"use client";

import { useEffect } from "react";
import { setLenis } from "@/lib/motion/lenis";
import { prefersReducedMotion } from "@/lib/ui/useReducedMotion";

export type SmoothScrollProps = {
  /** inercia: 0,05 = muy flotante · 0,2 = casi nativo */
  lerp?: number;
  /** multiplica la distancia de cada vuelta de la rueda */
  wheelMultiplier?: number;
  /** enlaces `#ancla` con desplazamiento suave */
  anchors?: boolean;
  /** sincroniza Lenis con el reloj de GSAP y avisa a ScrollTrigger (necesario si hay animaciones ligadas al scroll) */
  syncGsap?: boolean;
  /** apaga el scroll suave sin quitar el componente (p. ej. según el tamaño de pantalla) */
  enabled?: boolean;
};

/**
 * Scroll con inercia de toda la página (Lenis). No pinta nada: colócalo una vez, en el marco de la web.
 * Se apaga solo con `prefers-reduced-motion` y en pantallas táctiles (donde el scroll nativo ya es suave).
 * `useLenis`-style: la instancia activa está en `getLenis()` (`@/lib/motion/lenis`) y `lockScroll()` la pausa.
 */
export default function SmoothScroll({ lerp = 0.1, wheelMultiplier = 1, anchors = true, syncGsap = true, enabled = true }: SmoothScrollProps) {
  useEffect(() => {
    if (!enabled) return;
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;
    let disposed = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      const [{ default: Lenis }, gsapMods] = await Promise.all([
        import("lenis"),
        syncGsap ? Promise.all([import("gsap"), import("gsap/ScrollTrigger")]) : Promise.resolve(null),
      ]);
      if (disposed) return;
      const lenis = new Lenis({ lerp, wheelMultiplier, anchors, autoRaf: !gsapMods });
      setLenis(lenis);
      cleanups.push(() => {
        lenis.destroy();
        setLenis(null);
      });
      if (gsapMods) {
        const [{ gsap }, { ScrollTrigger }] = gsapMods;
        gsap.registerPlugin(ScrollTrigger);
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        cleanups.push(() => gsap.ticker.remove(tick));
      }
    })();

    return () => {
      disposed = true;
      cleanups.reverse().forEach((f) => f());
    };
  }, [lerp, wheelMultiplier, anchors, syncGsap, enabled]);

  return null;
}
