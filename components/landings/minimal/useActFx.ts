"use client";

import { useEffect, type RefObject } from "react";
import { resetScroll } from "@/lib/scroll/store";

const CHARS = "█▓▒░#%&@$+=";

/**
 * Aparición y salida de los elementos de una landing larga:
 *  - `[data-reveal]` (carteles a pantalla completa) y `[data-blk]` (bloques de componentes) reciben `data-in` al entrar
 *    en pantalla y lo pierden al salir, de modo que su efecto CSS (`data-fx` / `data-blk`) se repite al volver.
 *  - `[data-scramble]` dentro de un `[data-reveal]` se descifra con GSAP ScrambleText.
 *  - Cada `.mx__chap` (cartel) se desliza por pasos hacia su borde al salir, ligado al scroll (GSAP ScrollTrigger).
 */
export function useActFx(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("scrollable");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    resetScroll();

    let disposed = false;
    const ios: IntersectionObserver[] = [];
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { ScrambleTextPlugin }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/ScrambleTextPlugin")]);
      const el = root.current;
      if (disposed || !el) return;
      gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

      const scrambles = (n: Element) => Array.from(n.querySelectorAll<HTMLElement>("[data-scramble]"));
      const blank = (x: HTMLElement) => (x.textContent = " ".repeat(x.dataset.scramble!.length));

      const watch = (selector: string, threshold: number) => {
        const io = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              e.target.toggleAttribute("data-in", e.isIntersecting);
              scrambles(e.target).forEach((x, n) => {
                gsap.killTweensOf(x);
                blank(x);
                if (e.isIntersecting) gsap.to(x, { duration: 1.1, delay: n * 0.25, ease: "none", scrambleText: { text: x.dataset.scramble!, chars: CHARS, revealDelay: 0.15, speed: 0.6 } });
              });
            }),
          { threshold },
        );
        el.querySelectorAll(selector).forEach((n) => io.observe(n));
        ios.push(io);
      };
      watch("[data-reveal]", 0.35);
      watch("[data-blk]", 0.06);
      el.querySelectorAll<HTMLElement>("[data-scramble]").forEach(blank);

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".mx__chap", el).forEach((chap) => {
          const dir = chap.dataset.side === "l" ? -1 : 1;
          gsap.to(chap.querySelector(".mx__in"), {
            x: () => dir * innerWidth * 0.75,
            ease: "steps(14)",
            scrollTrigger: { trigger: chap, start: "bottom bottom", end: "bottom 20%", scrub: 0.3 },
          });
        });
      }, el);
    })();

    return () => {
      disposed = true;
      ios.forEach((io) => io.disconnect());
      ctx?.revert();
      html.classList.remove("scrollable");
      resetScroll();
    };
  }, [root]);
}
