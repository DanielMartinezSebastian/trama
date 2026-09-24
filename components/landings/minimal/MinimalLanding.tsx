"use client";

import { useEffect, useRef } from "react";
import AsciiBackground from "@/components/ui/AsciiBackground";
import { clamp, resetScroll, scrollState } from "@/lib/scroll/store";
import { Glitch, Rotator } from "./Glitch";
import "./minimal.css";

const WORDS = ["mar", "ola", "viento", "marea", "swell"];
const TICKER = ["REMO", "ESPUMA", "TABLA", "SAL", "MAREA", "ESPUMA", "OLA VERDE"];
const SCENES = ["amanecer", "mediodía", "atardecer", "noche"];

/** `hud`: dentro de la galería, deja libres las franjas superior e inferior de la interfaz del visor. */
export default function MinimalLanding({ hud = false }: { hud?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("scrollable");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    resetScroll();

    // Progreso de scroll suavizado → escena "wave" (amanecer → noche)
    let raf = 0;
    let last = -1;
    const tick = () => {
      const max = html.scrollHeight - innerHeight;
      const raw = max > 0 ? clamp(scrollY / max) : 0;
      scrollState.raw = raw;
      scrollState.p += (raw - scrollState.p) * 0.08;
      const p = scrollState.p;
      if (bar.current) bar.current.style.setProperty("--p", String(p));
      const s = Math.min(SCENES.length - 1, Math.floor(p * SCENES.length));
      if (s !== last && scene.current) {
        scene.current.textContent = SCENES[s];
        last = s;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Cada [data-reveal] entra y sale: al volver a verse se re-escribe
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute("data-in", e.isIntersecting)),
      { threshold: 0.35 },
    );
    root.current?.querySelectorAll("[data-reveal]").forEach((n) => io.observe(n));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      html.classList.remove("scrollable");
      resetScroll();
    };
  }, []);

  return (
    <div ref={root} className={`mn ${hud ? "mn--hud" : ""}`}>
      <div className="mn__bg">
        <AsciiBackground scene="wave" asciiStyle="dither" cellSize={4} bloom={0} palette="original" asciiHover="none" vignette={0} />
      </div>

      <header className="mn__top">
        <span className="mn-hl">MARÉ SURF CLUB</span>
        <span className="mn-hl mn-hl--alt">
          <span ref={scene}>amanecer</span>
        </span>
      </header>

      <div ref={bar} className="mn__bar" aria-hidden>
        <i />
      </div>

      <main className="mn__main">
        <section className="mn__sec mn__sec--hero" data-reveal>
          <p className="mn__kicker">
            <Glitch text="ESCUELA DE SURF · CANTABRIA" delay={200} />
          </p>
          <h1 className="mn__h1">
            <span className="mn-line">
              <Glitch text="Aprende a leer" className="mn-hl" delay={400} />
            </span>
            <span className="mn-line">
              <Glitch text="el " className="mn-hl" delay={900} />
              <Rotator words={WORDS} />
            </span>
          </h1>
          <a className="mn-btn" href="#final">
            <Glitch text="Reservar clase" delay={1300} />
          </a>
          <span className="mn__cue">▼ scroll</span>
        </section>

        <section className="mn__sec" data-reveal>
          <span className="mn__num">01</span>
          <h2 className="mn__h2">
            <span className="mn-line">
              <Glitch text="Del primer remo" className="mn-hl" />
            </span>
            <span className="mn-line">
              <Glitch text="a tu primera ola" className="mn-hl" delay={300} />
            </span>
          </h2>
          <p className="mn__p mn-hl">
            <Glitch text="Grupos de seis, espuma blanda y mucha paciencia." delay={700} />
          </p>
        </section>

        <section className="mn__sec" data-reveal>
          <span className="mn__num">02</span>
          <ul className="mn__list">
            {[
              ["Iniciación", "2 h · 35 €"],
              ["Privadas", "1,5 h · 70 €"],
              ["Surf trips", "3 días · 240 €"],
            ].map(([a, b], i) => (
              <li key={a}>
                <span className="mn__li-t mn-hl">
                  <Glitch text={a} delay={i * 350} />
                </span>
                <span className="mn__li-m">
                  <Glitch text={b} delay={i * 350 + 250} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="final" className="mn__sec mn__sec--end" data-reveal>
          <span className="mn__num">03</span>
          <h2 className="mn__h2">
            <span className="mn-line">
              <Glitch text="El swell llega" className="mn-hl" />
            </span>
            <span className="mn-line">
              <Glitch text="el sábado" className="mn-hl mn-hl--alt" delay={400} />
            </span>
          </h2>
          <a className="mn-btn" href="#final">
            <Glitch text="Apuntarme" delay={900} />
          </a>
        </section>
      </main>

      <div className="mn__ticker" aria-hidden>
        <div className="mn__ticker-in">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((w, i) => (
            <span key={i}>{w} ■</span>
          ))}
        </div>
      </div>
    </div>
  );
}
