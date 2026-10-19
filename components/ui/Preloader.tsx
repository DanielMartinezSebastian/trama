"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { finishIntro } from "@/lib/motion/intro";
import { lockScroll } from "@/lib/motion/lenis";

export type PreloaderProps = {
  /** counter = contador 0–100 · words = palabras que se suceden · bar = solo barra y marca · fill = la marca, gigante y en contorno, se rellena con el progreso */
  variant?: "counter" | "words" | "bar" | "fill";
  /** marca (esquina superior izquierda) */
  brand?: string;
  /** texto de la esquina superior derecha (p. ej. ciudad o año) */
  meta?: string;
  /** variant words: una palabra cada `duration / n` segundos */
  words?: string[];
  /** segundos que dura la carga visible (mínimo; espera además a las fuentes y a `load`, con tope de 4 s extra) */
  duration?: number;
  /** salida: la cortina sube (`curtain`) o se desvanece (`fade`) */
  exit?: "curtain" | "fade";
  /** `session`: solo la primera visita de la pestaña · `always`: en cada carga */
  once?: "session" | "always";
  /** texto que anuncia el lector de pantalla */
  label?: string;
  /** al terminar (o al saltarse) */
  onDone?: () => void;
  /** cambia para volver a mostrarlo (solo catálogo/pruebas) */
  playKey?: number;
};

const KEY = "trama:preloader";

/**
 * Pantalla de entrada: contador o palabras, barra de progreso y salida en cortina. Bloquea el scroll mientras dura,
 * se salta con un clic o con `Esc`, y avisa a `SplitText` (y a quien use `whenIntroDone`) para que sus animaciones
 * empiecen justo al abrirse. El HTML del servidor ya la incluye (tapa la página desde el primer píxel). Con
 * `prefers-reduced-motion` dura una fracción de segundo y no cuenta.
 */
export default function Preloader({
  variant = "counter",
  brand = "",
  meta = "",
  words = ["Hola", "Hello", "Hallo", "Ciao"],
  duration = 2,
  exit = "curtain",
  once = "session",
  label = "Cargando",
  onDone,
  playKey = 0,
}: PreloaderProps) {
  const [gone, setGone] = useState(false);
  const [out, setOut] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const doneRef = useRef<() => void>(null);
  const wordsKey = words.join("|");

  useEffect(() => {
    setGone(false);
    setOut(false);
    const el = root.current;
    if (!el) return;
    let seen = false;
    try {
      seen = once === "session" && sessionStorage.getItem(KEY) === "1";
    } catch {
      /* sin almacenamiento: se muestra siempre */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.setAttribute("data-preloader", "");
    let finished = false;
    let raf = 0;
    const timers: number[] = [];
    const unlock = lockScroll();
    const root_ = document.documentElement;
    root_.classList.add("ui-intro-lock");

    const done = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* nada */
      }
      setOut(true);
      root_.classList.remove("ui-intro-lock");
      unlock();
      // los textos de la página empiezan cuando la cortina ya se está abriendo
      timers.push(window.setTimeout(finishIntro, reduced ? 0 : 350));
      timers.push(window.setTimeout(() => { setGone(true); onDoneRef.current?.(); }, reduced ? 50 : 1000));
    };

    doneRef.current = done;
    if (seen || reduced) {
      done();
      return () => {
        timers.forEach(clearTimeout);
        root_.classList.remove("ui-intro-lock");
        unlock();
      };
    }

    // espera a las fuentes y a la carga de la ventana, con un tope para que una imagen lenta no deje la página tapada
    const ready = new Promise<void>((res) => {
      const cap = window.setTimeout(res, duration * 1000 + 4000);
      timers.push(cap);
      const w = new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true })));
      Promise.all([document.fonts?.ready ?? Promise.resolve(), w]).then(() => res());
    });
    let loaded = false;
    ready.then(() => (loaded = true));

    const t0 = performance.now();
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    const tick = (now: number) => {
      const lin = Math.min(1, (now - t0) / (duration * 1000));
      // no pasa del 99 % hasta que todo ha cargado
      const p = loaded ? lin : Math.min(lin, 0.99);
      const v = ease(p);
      el.style.setProperty("--p", String(v));
      if (num.current) num.current.textContent = variant === "words" ? words[Math.min(words.length - 1, Math.floor(p * words.length))] : String(Math.round(v * 100));
      if (p >= 1 && loaded) done();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const key = (e: KeyboardEvent) => e.key === "Escape" && done();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      root_.classList.remove("ui-intro-lock");
      unlock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, duration, once, playKey, wordsKey]);

  if (gone) return null;
  return (
    <div
      ref={root}
      className={`ui-pre ui-pre--${exit}`}
      data-preloader=""
      data-out={out ? "" : undefined}
      role="status"
      aria-live="polite"
      aria-label={label}
      onClick={() => doneRef.current?.()}
      style={{ "--p": 0 } as CSSProperties}
    >
      <div className="ui-pre__in">
        <div className="ui-pre__top">
          <span>{brand}</span>
          <span>{meta}</span>
        </div>
        <div className="ui-pre__mid" aria-hidden>
          {variant === "bar" ? null : variant === "fill" ? (
            <span className="ui-pre__fill" data-text={brand}>{brand}</span>
          ) : variant === "words" ? (
            <span className="ui-pre__word" ref={num}>{words[0]}</span>
          ) : (
            <span className="ui-pre__count"><span ref={num}>0</span></span>
          )}
        </div>
        <div className="ui-pre__bot" aria-hidden>
          <div className="ui-pre__bar" style={{ flex: 1 }}><span /></div>
        </div>
      </div>
    </div>
  );
}
