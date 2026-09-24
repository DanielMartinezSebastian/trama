"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type { DemoMeta } from "@/lib/demos";
import { clamp, resetScroll, scrollState } from "@/lib/scroll/store";
import { DEFAULT_TEXT, textStore } from "@/lib/text/store";

/**
 * Da 300vh de recorrido a un demo y le pasa el progreso de scroll.
 * GSAP + ScrollTrigger miden el scroll (suavizado y velocidad) y animan la capa de
 * "landing" superpuesta: titulares con SplitText y secciones que entran y salen.
 * El canvas del demo queda fijo detrás; el scroll es el del propio documento.
 */
export default function ScrollStage({ demo, hud }: { demo: DemoMeta; hud: boolean }) {
  const spacer = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const state = useSyncExternalStore(textStore.subscribe, textStore.get, textStore.server);
  const landing = demo.landing;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("scrollable");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual"; // que el navegador no restaure el scroll
    window.scrollTo(0, 0);
    resetScroll();

    let disposed = false;
    let ctx: { revert: () => void } | undefined;
    let cancelTick: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { SplitText } = await import("gsap/SplitText");
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      ctx = gsap.context(() => {
        const sections = gsap.utils.toArray<HTMLElement>(".landing__section", overlay.current);
        const windows: [number, number][] = [
          [0, 0.3],
          [0.36, 0.64],
          [0.7, 1],
        ];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: spacer.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => {
              scrollState.raw = self.progress;
              gsap.to(scrollState, { p: self.progress, duration: 0.6, ease: "power2.out", overwrite: "auto" });
              if (bar.current) gsap.set(bar.current, { scaleY: self.progress });
            },
          },
        });

        sections.forEach((el, i) => {
          const [a, b] = windows[i] ?? [0, 1];
          const title = el.querySelector<HTMLElement>("[data-split]");
          if (title) {
            const split = SplitText.create(title, { type: "words" });
            if (i === 0) {
              // Entrada del titular al cargar (no ligada al scroll, para que se vea desde el principio)
              gsap.from(split.words, { yPercent: 60, autoAlpha: 0, stagger: 0.06, duration: 0.9, ease: "power3.out" });
            } else {
              tl.fromTo(
                split.words,
                { yPercent: 60, autoAlpha: 0 },
                { yPercent: 0, autoAlpha: 1, stagger: 0.008, duration: 0.05, ease: "power3.out" },
                a,
              );
            }
          }
          if (i === 0) gsap.set(el, { autoAlpha: 1 });
          else {
            gsap.set(el, { autoAlpha: 0, y: 40 });
            tl.to(el, { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" }, a);
          }
          if (i < sections.length - 1) tl.to(el, { autoAlpha: 0, y: -40, duration: 0.06, ease: "power2.in" }, b - 0.06);
        });
        tl.to(hint.current, { autoAlpha: 0, duration: 0.03 }, 0);
        tl.to({}, { duration: 0.0001 }, 1); // fija la duración total en 1

        const st = tl.scrollTrigger!;
        const tick = () => {
          const target = clamp(st.getVelocity() / 2200, -1, 1);
          scrollState.v += (target - scrollState.v) * 0.15;
          if (label.current && label.current.textContent !== scrollState.label) {
            label.current.textContent = scrollState.label;
          }
        };
        gsap.ticker.add(tick);
        cancelTick = () => gsap.ticker.remove(tick);
      });
    })().catch((e) => console.error("[scroll] error al iniciar", e));

    return () => {
      disposed = true;
      cancelTick?.();
      ctx?.revert();
      root.classList.remove("scrollable");
      window.scrollTo(0, 0);
      resetScroll();
    };
  }, [demo.slug]);

  // El título usa la instantánea de useSyncExternalStore para no romper la hidratación
  const title = demo.text ? state.text.trim() || DEFAULT_TEXT : (landing?.title ?? demo.title);

  return (
    <>
      <div ref={spacer} className="scroll-spacer" aria-hidden />
      <div ref={overlay} className={`landing ${hud ? "" : "landing--hidden"}`}>
        <section className="landing__section landing__section--hero">
          <p className="landing__kicker">{landing?.kicker}</p>
          {/* Con texto editable no se trocea: React y SplitText se pisarían el DOM */}
          <h1 data-split={demo.text ? undefined : ""}>{title}</h1>
          <p className="landing__sub">{landing?.sub}</p>
          <span className="landing__cta">{landing?.cta}</span>
        </section>
        <section className="landing__section landing__section--features">
          <ul>
            {landing?.features.map((f) => (
              <li key={f[0]}>
                <strong>{f[0]}</strong>
                <span>{f[1]}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="landing__section landing__section--final">
          <h2 data-split>{landing?.final}</h2>
          <span className="landing__cta">{landing?.cta}</span>
        </section>
      </div>
      <div ref={hint} className="scroll-hint">
        desplaza ↓
      </div>
      <div className="scroll-progress" aria-hidden>
        <div ref={bar} />
      </div>
      <div ref={label} className="scroll-label" aria-live="off" />
    </>
  );
}
