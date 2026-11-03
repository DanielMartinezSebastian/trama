"use client";

import { useEffect, useRef } from "react";
import { getLenis, setLenis } from "@/lib/motion/lenis";
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
  /**
   * al ir a otra ruta, la página nueva empieza arriba: corta la inercia que quedara y sube sin animar. Sin esto, si se
   * pulsa un enlace mientras la página aún se desliza, el router sube al principio pero Lenis la devuelve a la altura
   * que perseguía. Al volver atrás o adelante, la página recupera la altura en la que se dejó. No actúa con un `#ancla`
   * ni si solo cambia la consulta (`?filtro=`)
   */
  resetOnNavigate?: boolean;
};

const jump = (y: number) => {
  getLenis()?.scrollTo(y, { immediate: true, force: true });
  window.scrollTo({ top: y, left: 0, behavior: "instant" });
};

/**
 * Al cambiar de ruta con `history.pushState` (lo que hace el router al pintar la página nueva), sube al principio; al volver
 * atrás o adelante, devuelve cada dirección a la altura en la que se dejó. La restauración del navegador no sirve aquí:
 * llega antes de que el router pinte la página anterior, cuando aún está la que se deja, y se pierde.
 */
function installNavigateReset() {
  const key = () => location.pathname + location.search;
  const heights = new Map<string, number>();
  let current = key();
  let restoring = 0;
  const onScroll = () => heights.set(current, Math.round(window.scrollY));
  const push = history.pushState;
  const replace = history.replaceState;
  const patched: typeof history.pushState = function (this: History, ...args) {
    const before = location.pathname;
    heights.set(current, Math.round(window.scrollY));
    cancelAnimationFrame(restoring);
    push.apply(this, args);
    current = key();
    if (location.pathname === before || location.hash) return;
    jump(0);
  };
  const patchedReplace: typeof history.replaceState = function (this: History, ...args) {
    replace.apply(this, args);
    current = key();
  };
  // la página anterior tarda unos fotogramas en pintarse (y sus imágenes, en darle alto): se insiste hasta llegar a la
  // altura guardada o durante 1,5 s, y se suelta en cuanto el usuario se mueve
  const onPop = () => {
    current = key();
    const y = heights.get(current) ?? 0;
    cancelAnimationFrame(restoring);
    if (location.hash) return;
    // al menos 0,4 s: si la página que se deja ya tiene alto, la altura se alcanza antes de que llegue la otra
    const start = performance.now();
    let held = 0;
    const step = () => {
      jump(y);
      held = Math.abs(window.scrollY - y) < 2 ? held + 1 : 0;
      const t = performance.now() - start;
      if ((held < 6 || t < 400) && t < 1500) restoring = requestAnimationFrame(step);
    };
    restoring = requestAnimationFrame(step);
  };
  const stop = () => cancelAnimationFrame(restoring);
  const prevRestoration = history.scrollRestoration;
  history.scrollRestoration = "manual";
  history.pushState = patched;
  history.replaceState = patchedReplace;
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("popstate", onPop);
  for (const ev of ["wheel", "touchstart", "keydown"]) addEventListener(ev, stop, { passive: true });
  return () => {
    stop();
    history.scrollRestoration = prevRestoration;
    // solo si nadie los ha vuelto a envolver después
    if (history.pushState === patched) history.pushState = push;
    if (history.replaceState === patchedReplace) history.replaceState = replace;
    removeEventListener("scroll", onScroll);
    removeEventListener("popstate", onPop);
    for (const ev of ["wheel", "touchstart", "keydown"]) removeEventListener(ev, stop);
  };
}

/**
 * Scroll con inercia de toda la página (Lenis). No pinta nada: colócalo una vez, en el marco de la web.
 * Se apaga solo con `prefers-reduced-motion` y en pantallas táctiles (donde el scroll nativo ya es suave).
 * `useLenis`-style: la instancia activa está en `getLenis()` (`@/lib/motion/lenis`) y `lockScroll()` la pausa.
 */
export default function SmoothScroll({ feel, lerp: lerpProp, wheelMultiplier: wheelProp, anchors = true, syncGsap = true, enabled = true, resetOnNavigate = true }: SmoothScrollProps) {
  useEffect(() => (resetOnNavigate ? installNavigateReset() : undefined), [resetOnNavigate]);
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
