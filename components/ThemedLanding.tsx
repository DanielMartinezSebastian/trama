"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { resetScroll } from "@/lib/scroll/store";
import { trackScroll } from "@/lib/scroll/track";
import { getTheme, type Theme } from "@/lib/themes/themes";

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Landing temática de 300vh (tres secciones de 100vh). El fondo (asciify-engine o
 * textmode.js) vive fuera de este componente y cambia de escena con el scroll.
 *
 *  - Las cards se revelan de tres formas (disolución ASCII, barrido, subida) y sus títulos
 *    se "descifran" con ScrambleText de GSAP.
 *  - Cada card tiene un fondo de texto de asciify-engine (`renderTextBackground`) con el
 *    efecto de hover del tema, y un número dibujado con su fuente bitmap (`asciifyText`).
 *  - El titular sigue levemente al puntero (paralaje por capas), las cards se inclinan hacia él,
 *    el botón final es magnético y un carácter temático persigue el cursor.
 *  - Al cruzar de sección se lanza una transición breve propia de cada tema.
 */
export default function ThemedLanding({ themeId, hud }: { themeId: string; hud: boolean }) {
  const theme = getTheme(themeId) as Theme;
  const root = useRef<HTMLDivElement>(null);

  // La clase "tl--js" oculta lo que se revelará, antes del primer pintado
  useLayoutEffect(() => {
    const el = root.current;
    el?.classList.add("tl--js");
    return () => el?.classList.remove("tl--js");
  }, [themeId]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    document.documentElement.classList.add("scrollable");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual"; // que el navegador no restaure el scroll
    window.scrollTo(0, 0);
    resetScroll();

    let disposed = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { ScrambleTextPlugin }, core] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/ScrambleTextPlugin"),
        import("asciify-engine/core"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
      const stop = await trackScroll(el);
      if (disposed) {
        stop();
        return;
      }
      cleanups.push(stop);

      const q = <T extends Element>(sel: string) => Array.from(el.querySelectorAll<T>(sel));
      const on = <K extends keyof HTMLElementEventMap>(t: HTMLElement | Window, ev: K | string, fn: (e: never) => void) => {
        t.addEventListener(ev, fn as EventListener);
        cleanups.push(() => t.removeEventListener(ev, fn as EventListener));
      };
      const scramble = (node: Element, text: string, duration = 1.1, delay = 0) =>
        gsap.to(node, {
          duration,
          delay,
          scrambleText: { text, chars: theme.chars, revealDelay: 0.15, speed: 0.6 },
          ease: "none",
        });

      const ctx = gsap.context(() => {
        // ---------- Entrada del héroe ----------
        const title = el.querySelector(".tl__title")!;
        title.textContent = " ";
        gsap.set([".tl__kicker", ".tl__sub", ".tl__hero .tl__cta", ".tl__brand", ".tl__cue"], { autoAlpha: 0, y: 18 });
        gsap
          .timeline({ delay: 0.15 })
          .to(".tl__kicker", { autoAlpha: 1, y: 0, duration: 0.6 })
          .add(scramble(title, theme.title, 1.5), "<0.1")
          .to(".tl__sub", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.7")
          .to([".tl__hero .tl__cta", ".tl__brand", ".tl__cue"], { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.4");

        // ---------- Transiciones de escena entre secciones ----------
        const flash = el.querySelector<HTMLElement>(".tl__flash")!;
        const label = el.querySelector<HTMLElement>(".tl__scene")!;
        let current = -1;
        const setScene = (i: number) => {
          if (i === current) return;
          const first = current === -1;
          current = i;
          label.textContent = `escena · ${theme.scenes[i]}`;
          if (first) return;
          const kind = theme.flash;
          if (kind === "sweep") gsap.fromTo(flash, { yPercent: 100, autoAlpha: 1 }, { yPercent: -110, duration: 1, ease: "power2.inOut", onComplete: () => void gsap.set(flash, { autoAlpha: 0 }) });
          else if (kind === "iris") gsap.fromTo(flash, { scale: 0, autoAlpha: 0.85 }, { scale: 3.2, autoAlpha: 0, duration: 1.1, ease: "power2.out" });
          else gsap.fromTo(flash, { xPercent: -100, autoAlpha: 1, skewX: -18 }, { xPercent: 100, duration: 0.55, ease: "power3.inOut", onComplete: () => void gsap.set(flash, { autoAlpha: 0 }) });
        };
        q<HTMLElement>(".tl__section").forEach((sec, i) => {
          ScrollTrigger.create({ trigger: sec, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && setScene(i) });
        });

        // ---------- Cards ----------
        const cards = q<HTMLElement>(".tcard");
        cards.forEach((card, idx) => {
          const c = theme.cards[idx];
          const bg = card.querySelector<HTMLCanvasElement>(".tcard__bg")!;
          const fx = card.querySelector<HTMLCanvasElement>(".tcard__fx")!;
          const h3 = card.querySelector<HTMLElement>("h3")!;
          const art = card.querySelector<HTMLElement>(".tcard__art")!;
          const meta = card.querySelector<HTMLElement>(".tcard__meta")!;
          const bctx = bg.getContext("2d")!;
          const fctx = fx.getContext("2d")!;

          // número en ASCII con la fuente bitmap de asciify-engine
          art.textContent = core.asciifyText(`0${idx + 1}`, { char: theme.glyph });

          // fondo de texto con hover de asciify-engine
          const pos = { x: 0.5, y: 0.5 };
          let intensity = 0;
          let target = 0;
          let raf = 0;
          const drawBg = () => {
            bctx.clearRect(0, 0, bg.width, bg.height);
            core.renderTextBackground(
              bctx,
              bg.width,
              bg.height,
              theme.tile,
              {
                fontSize: 11,
                color: theme.palette.muted,
                opacity: 60,
                hoverEffect: theme.hover,
                hoverStrength: 0.9,
                hoverRadius: 0.4,
                hoverColor: theme.palette.accent,
              },
              intensity > 0.02 ? { x: pos.x, y: pos.y, intensity } : null,
            );
          };
          const loop = () => {
            intensity += (target - intensity) * 0.18;
            drawBg();
            raf = intensity > 0.02 || target > 0 ? requestAnimationFrame(loop) : 0;
          };
          const kick = () => {
            if (!raf) raf = requestAnimationFrame(loop);
          };

          // disolución ASCII (revelado de tipo "dissolve")
          const seed = idx * 977;
          const drawDissolve = (k: number, time: number) => {
            fctx.clearRect(0, 0, fx.width, fx.height);
            const cell = 14;
            fctx.font = "11px monospace";
            fctx.textBaseline = "top";
            for (let cy = 0; cy * cell < fx.height; cy++) {
              for (let cx = 0; cx * cell < fx.width; cx++) {
                const hh = hash(seed + cx * 31 + cy * 17);
                if (k < hh) {
                  fctx.fillStyle = theme.palette.bg;
                  fctx.fillRect(cx * cell, cy * cell, cell, cell);
                  fctx.fillStyle = hash(seed + cx + cy * 7 + Math.floor(time * 12)) > 0.5 ? theme.palette.accent : theme.palette.accent2;
                  fctx.globalAlpha = 0.35 + 0.65 * (1 - hh + k * 0.5);
                  fctx.fillText(theme.chars[Math.floor(hash(cx * 3 + cy + time * 7) * theme.chars.length)], cx * cell + 3, cy * cell + 2);
                  fctx.globalAlpha = 1;
                } else if (k - hh < 0.07) {
                  fctx.fillStyle = theme.palette.accent;
                  fctx.globalAlpha = 0.5;
                  fctx.fillRect(cx * cell, cy * cell, cell, cell);
                  fctx.globalAlpha = 1;
                }
              }
            }
          };

          const size = () => {
            const w = card.clientWidth;
            const h = card.clientHeight;
            for (const cv of [bg, fx]) {
              cv.width = w;
              cv.height = h;
            }
            drawBg();
            if (theme.reveal === "dissolve" && fx.style.display !== "none") drawDissolve(k.v, 0);
          };
          const k = { v: 0 };
          const ro = new ResizeObserver(size);
          ro.observe(card);
          cleanups.push(() => ro.disconnect());
          cleanups.push(() => cancelAnimationFrame(raf));

          // estado inicial según el tipo de revelado
          if (theme.reveal === "wipe") gsap.set(card, { clipPath: "inset(0 100% 0 0)" });
          else if (theme.reveal === "rise") gsap.set(card, { autoAlpha: 0, y: 70 });
          else fx.style.display = "block";
          if (theme.reveal !== "dissolve") fx.style.display = "none";
          gsap.set([art, meta], { autoAlpha: 0 });
          h3.textContent = " ";

          gsap.set(card, { transformPerspective: 900 });
          ScrollTrigger.create({
            trigger: card,
            start: "top 85%",
            once: true,
            onEnter: () => {
              const delay = (idx % 3) * 0.12;
              if (theme.reveal === "wipe") gsap.to(card, { clipPath: "inset(0 0% 0 0)", duration: 0.9, delay, ease: "power3.inOut" });
              else if (theme.reveal === "rise") gsap.to(card, { autoAlpha: 1, y: 0, duration: 0.9, delay, ease: "power3.out" });
              else {
                const time = { t: 0 };
                gsap.to(k, {
                  v: 1,
                  duration: 1.4,
                  delay,
                  ease: "power1.inOut",
                  onUpdate: () => drawDissolve(k.v, (time.t += 0.03)),
                  onComplete: () => void (fx.style.display = "none"),
                });
              }
              scramble(h3, c.title, 1.1, delay + 0.25);
              gsap.to(art, { autoAlpha: 1, duration: 0.6, delay: delay + 0.4 });
              gsap.to(meta, { autoAlpha: 1, duration: 0.6, delay: delay + 0.7 });
            },
          });

          // ---------- ratón: inclinación, brillo y efecto ASCII ----------
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
          on(card, "pointermove", (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width;
            const ny = (e.clientY - r.top) / r.height;
            pos.x = nx;
            pos.y = ny;
            target = 1;
            kick();
            rx((0.5 - ny) * 10);
            ry((nx - 0.5) * 12);
            card.style.setProperty("--mx", `${nx * 100}%`);
            card.style.setProperty("--my", `${ny * 100}%`);
          });
          on(card, "pointerenter", () => scramble(h3, c.title, 0.7));
          on(card, "pointerleave", () => {
            target = 0;
            kick();
            rx(0);
            ry(0);
          });
        });

        // ---------- Héroe: paralaje por capas siguiendo al puntero ----------
        const layers = q<HTMLElement>("[data-depth]").map((node) => ({
          depth: parseFloat(node.dataset.depth || "0"),
          x: gsap.quickTo(node, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(node, "y", { duration: 0.9, ease: "power3.out" }),
        }));
        const cursor = el.querySelector<HTMLElement>(".tl__cursor")!;
        const cx = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3.out" });
        const cy = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3.out" });
        const magnets = q<HTMLElement>(".tl__final .tl__cta").map((btn) => ({
          btn,
          x: gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" }),
          y: gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" }),
        }));
        on(window, "pointermove", (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * 34 * l.depth);
            l.y(ny * 20 * l.depth);
          });
          cx(e.clientX + 14);
          cy(e.clientY + 14);
          // botón magnético: se acerca al puntero dentro de un radio
          magnets.forEach((m) => {
            const r = m.btn.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const d = Math.hypot(dx, dy);
            if (d < 160) {
              m.x(dx * 0.35);
              m.y(dy * 0.35);
            } else {
              m.x(0);
              m.y(0);
            }
          });
        });

        // ---------- Sección final ----------
        const finalTitle = el.querySelector(".tl__final h2");
        if (finalTitle) {
          finalTitle.textContent = " ";
          ScrollTrigger.create({ trigger: ".tl__final", start: "top 60%", once: true, onEnter: () => void scramble(finalTitle, theme.final.title, 1.3) });
        }
        const cardsTitle = el.querySelector(".tl__cards-sec h2");
        if (cardsTitle) {
          cardsTitle.textContent = " ";
          ScrollTrigger.create({ trigger: ".tl__cards-sec", start: "top 70%", once: true, onEnter: () => void scramble(cardsTitle, theme.cardsTitle, 1.2) });
        }
      }, el);
      cleanups.push(() => ctx.revert());
    })().catch((e) => console.error("[landing] error al iniciar", e));

    return () => {
      disposed = true;
      cleanups.reverse().forEach((fn) => {
        try {
          fn();
        } catch {
          /* ya liberado */
        }
      });
      document.documentElement.classList.remove("scrollable");
      window.scrollTo(0, 0);
      resetScroll();
    };
  }, [themeId, theme]);

  const p = theme.palette;
  const vars = {
    "--bg": p.bg,
    "--fg": p.fg,
    "--mut": p.muted,
    "--acc": p.accent,
    "--acc2": p.accent2,
    "--card": p.card,
    "--ln": p.line,
    "--r": `${theme.radius}px`,
    fontFamily: theme.font,
  } as React.CSSProperties;

  return (
    <div ref={root} className={`tl tl--${theme.cardStyle} ${hud ? "" : "tl--hidden"}`} style={vars} data-theme={theme.id}>
      <div className="tl__flash" data-flash={theme.flash} />
      <div className="tl__cursor" aria-hidden>
        {theme.cursor}
      </div>
      <div className="tl__scene" />

      <section className="tl__section tl__hero">
        <div className="tl__hero-inner">
          <p className="tl__kicker" data-depth="0.4">
            {theme.kicker}
          </p>
          <h1 className="tl__title" data-depth="1">
            {theme.title}
          </h1>
          <p className="tl__sub" data-depth="0.6">
            {theme.sub}
          </p>
          <a className="tl__cta" data-depth="0.8" href="#" onClick={(e) => e.preventDefault()}>
            {theme.cta}
          </a>
        </div>
        <span className="tl__brand">{theme.brand}</span>
        <span className="tl__cue">scroll ↓</span>
      </section>

      <section className="tl__section tl__cards-sec">
        <h2 className="tl__h2">{theme.cardsTitle}</h2>
        <div className="tl__grid">
          {theme.cards.map((c, i) => (
            <article key={c.title} className="tcard" data-corner={theme.glyph}>
              <canvas className="tcard__bg" />
              <canvas className="tcard__fx" />
              <div className="tcard__glow" />
              <div className="tcard__inner">
                <pre className="tcard__art" aria-hidden />
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <span className="tcard__meta">{c.meta}</span>
              </div>
              <span className="sr-only">{i + 1}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="tl__section tl__final">
        <div className="tl__final-inner">
          <h2>{theme.final.title}</h2>
          <p>{theme.final.text}</p>
          <a className="tl__cta" href="#" onClick={(e) => e.preventDefault()}>
            {theme.final.cta}
          </a>
        </div>
      </section>
    </div>
  );
}
