"use client";

import { useEffect, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/ui/useReducedMotion";

export type CrossfadeSlide = { src: string; alt?: string };

export type CrossfadeHeroProps = {
  slides: CrossfadeSlide[];
  /** titular (el `h1` de la página) */
  title: ReactNode;
  /** línea pequeña sobre el titular (fechas, ciudad) */
  kicker?: string;
  /** texto y enlace del botón-píldora */
  cta?: { label: string; href: string };
  /** segundos entre imágenes */
  interval?: number;
  /** alto del hero (CSS) */
  height?: string;
  /** oscurecimiento de las imágenes bajo el texto, 0–1 */
  shade?: number;
  /** zoom lento mientras cada imagen está visible */
  drift?: boolean;
  className?: string;
};

/**
 * Hero a sangre con fotografías que se funden entre sí, titular centrado y botón-píldora. Pensado para eventos, hostelería y
 * marcas con buena fotografía. Accesible: el cambio automático tiene un botón de pausa visible (WCAG 2.2.2), se detiene al
 * pasar el puntero o enfocar, con la pestaña oculta y con `prefers-reduced-motion` (queda la primera imagen). El texto va
 * sobre un velo, no sobre una sombra de texto.
 */
export default function CrossfadeHero({ slides, title, kicker = "", cta, interval = 6, height = "100svh", shade = 0.38, drift = true, className = "" }: CrossfadeHeroProps) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);
  useEffect(() => {
    if (paused || hold || reduced || slides.length < 2) return;
    const id = window.setInterval(() => !document.hidden && setI((n) => (n + 1) % slides.length), interval * 1000);
    return () => clearInterval(id);
  }, [paused, hold, reduced, slides.length, interval]);

  return (
    <section className={`ui-xfade ${drift && !reduced ? "ui-xfade--drift" : ""} ${className}`.trim()} style={{ height, ["--xf-shade" as string]: shade }} aria-roledescription="carrusel" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className="ui-xfade__imgs" aria-live="off">
        {slides.map((s, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s.src + k} className="ui-xfade__img" data-on={k === i ? "" : undefined} src={s.src} alt={k === i ? s.alt ?? "" : ""} aria-hidden={k !== i} loading={k === 0 ? "eager" : "lazy"} />
        ))}
      </div>
      <div className="ui-xfade__veil" aria-hidden />
      <div className="ui-xfade__body">
        {kicker && <p className="ui-xfade__k">{kicker}</p>}
        <h1 className="ui-xfade__t">{title}</h1>
        {cta && <a className="ui-xfade__cta" href={cta.href}>{cta.label}</a>}
      </div>
      {slides.length > 1 && (
        <div className="ui-xfade__ctl">
          <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? "Reanudar el cambio de imágenes" : "Pausar el cambio de imágenes"}>
            <span aria-hidden>{paused ? "▶" : "❚❚"}</span>
          </button>
          <span className="ui-xfade__n" aria-hidden>{String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
        </div>
      )}
    </section>
  );
}
