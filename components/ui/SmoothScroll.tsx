"use client";

import { useEffect, useRef } from "react";
import { setLenis } from "@/lib/motion/lenis";
import { installAnchorScroll, type AnchorScrollOptions } from "@/lib/motion/anchors";
import { prefersReducedMotion } from "@/lib/ui/useReducedMotion";
import { SCROLL_FEELS, type ScrollFeelName } from "@/lib/motion/scroll-feel";

export type SmoothScrollProps = {
  /**
   * sensación del scroll de la página (docs/42): cinematic (la de Quilate: cola larga, mesetas), editorial o snappy. Fija
   * la inercia y la publica en `<html data-scroll-feel>` para que las piezas ligadas al scroll usen la misma meseta, curva
   * y amortiguado. `lerp` y `wheelMultiplier` la ajustan si se dan
   */
  feel?: ScrollFeelName;
  /** inercia: 0,05 = muy flotante · 0,2 = casi nativo (por defecto, la de `feel`; sin `feel`, 0,1) */
  lerp?: number;
  /** multiplica la distancia de cada vuelta de la rueda */
  wheelMultiplier?: number;
  /**
   * enlaces `#ancla` de la misma página con desplazamiento animado (expo.out, de 0,6 a 1,4 s según la distancia) que
   * descuenta la cabecera fija. Funciona también sin el scroll suave (pantallas táctiles, `enabled={false}`); con «reducir
   * movimiento» salta sin animar. Acepta `{ offset, duration, easing }` (`offset: "auto"` mide la cabecera; es el valor
   * por defecto) o `false` para no tocar los enlaces
   */
  anchors?: boolean | AnchorScrollOptions;
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
export default function SmoothScroll({ feel, lerp: lerpProp, wheelMultiplier: wheelProp, anchors = true, syncGsap = true, enabled = true }: SmoothScrollProps) {
  const lerp = lerpProp ?? (feel ? SCROLL_FEELS[feel].lerp : 0.1);
  const wheelMultiplier = wheelProp ?? (feel ? SCROLL_FEELS[feel].wheelMultiplier : 1);
  // la sensación se publica aunque el scroll suave no se active (táctil, movimiento reducido): las mesetas y las curvas
  // de las piezas siguen valiendo
  useEffect(() => {
    if (!feel) return;
    const html = document.documentElement;
    html.dataset.scrollFeel = feel;
    return () => {
      if (html.dataset.scrollFeel === feel) delete html.dataset.scrollFeel;
    };
  }, [feel]);
  // las anclas, con o sin Lenis: en el móvil el scroll suave no se activa, pero el salto a una sección sí se anima
  const anchorRef = useRef<AnchorScrollOptions>({});
  anchorRef.current = typeof anchors === "object" ? anchors : {};
  const anchorsOn = anchors !== false;
  useEffect(() => {
    if (!anchorsOn) return;
    // las opciones se leen en cada clic: cambiarlas no reinstala el escuchador
    const opts = new Proxy({} as AnchorScrollOptions, { get: (_, k) => anchorRef.current[k as keyof AnchorScrollOptions] });
    return installAnchorScroll(opts);
  }, [anchorsOn]);
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
      // las anclas las lleva installAnchorScroll (con la cabecera descontada), no Lenis
      const lenis = new Lenis({ lerp, wheelMultiplier, anchors: false, autoRaf: !gsapMods });
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
  }, [lerp, wheelMultiplier, syncGsap, enabled]);

  return null;
}
