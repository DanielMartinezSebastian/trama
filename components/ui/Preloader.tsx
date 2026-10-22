"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { finishIntro } from "@/lib/motion/intro";
import { lockScroll } from "@/lib/motion/lenis";
import { prefersReducedMotion } from "@/lib/ui/useReducedMotion";

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
  /** salida: la cortina sube (`curtain`), se desvanece (`fade`), se apaga en seco como un CRT (`cut`) o se cierra en círculo (`iris`) */
  exit?: "curtain" | "fade" | "cut" | "iris";
  /** `session`: solo la primera visita de la pestaña · `always`: en cada carga */
  once?: "session" | "always";
  /** texto que anuncia el lector de pantalla */
  label?: string;
  /** al terminar (o al saltarse) */
  onDone?: () => void;
  /** cambia para volver a mostrarlo (solo catálogo/pruebas) */
  playKey?: number;
  /**
   * carga REAL (webs con 3D): archivos que bajar antes de abrir (modelos GLB, HDR…). Se cuentan los bytes y quedan en la
   * caché del navegador, donde el cargador de three los encuentra después
   */
  assets?: string[];
  /** fragmentos de JS que cargar por adelantado, p. ej. `() => import("./scene")` (el mismo del `lazy` de la escena) */
  modules?: Array<() => Promise<unknown>>;
  /**
   * esperar a que el 3D pinte: todos los elementos `root` deben cumplir `ready` (p. ej. `{ root: ".ui-pcloud__gl", ready:
   * ".is-on" }`). Si no aparece ningún `root` (una ruta sin 3D), no se espera
   */
  waitFor?: { root: string; ready: string };
  /** tope en ms: pase lo que pase, se abre (por defecto `duration` + 4 s; con carga real, 12 s) */
  maxTime?: number;
  /** animación propia en el centro, en lugar de la de `variant` (lee `var(--p)` de 0 a 1 y `[data-out]` al irse) */
  art?: ReactNode;
  className?: string;
};

const KEY = "trama:preloader";
/** peso de cada parte en la carga real */
const WEIGHT = { assets: 0.72, modules: 0.12, fonts: 0.04, ready: 0.12 };

/** Baja un archivo contando bytes (si el servidor da `content-length`) y lo deja en la caché HTTP. */
async function fetchCounting(url: string, onBytes: (got: number, total: number) => void) {
  const res = await fetch(url, { credentials: "same-origin" });
  const total = Number(res.headers.get("content-length")) || 0;
  if (!res.body) {
    await res.arrayBuffer();
    return;
  }
  const reader = res.body.getReader();
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    got += value.byteLength;
    onBytes(got, total || got * 2);
  }
}

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
  assets,
  modules,
  waitFor,
  maxTime,
  art,
  className = "",
}: PreloaderProps) {
  const real = Boolean(assets?.length || modules?.length || waitFor);
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
    const reduced = prefersReducedMotion();
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
    const cap = maxTime ?? (real ? 12000 : duration * 1000 + 4000);
    const ready = new Promise<void>((res) => {
      timers.push(window.setTimeout(res, cap));
      const w = new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true })));
      Promise.all([document.fonts?.ready ?? Promise.resolve(), w]).then(() => res());
    });
    let loaded = false;
    ready.then(() => (loaded = true));

    // carga real: bytes de los archivos, fragmentos de JS y el 3D pintando, cada parte con su peso
    const part = { assets: assets?.length ? 0 : 1, modules: modules?.length ? 0 : 1, fonts: 0, ready: waitFor ? 0 : 1 };
    const t0 = performance.now();
    if (real) {
      const bytes = (assets ?? []).map(() => 0);
      (assets ?? []).forEach((url, i) =>
        fetchCounting(url, (got, total) => {
          bytes[i] = Math.min(1, got / total);
          part.assets = bytes.reduce((a, b) => a + b, 0) / bytes.length;
        })
          .catch(() => {})
          .finally(() => {
            bytes[i] = 1;
            part.assets = bytes.reduce((a, b) => a + b, 0) / bytes.length;
          }),
      );
      let mods = 0;
      (modules ?? []).forEach((m) =>
        m()
          .catch(() => {})
          .finally(() => (part.modules = ++mods / modules!.length)),
      );
      (document.fonts?.ready ?? Promise.resolve()).then(() => (part.fonts = 1));
    }
    const checkReady = () => {
      if (!waitFor || part.ready === 1) return;
      const els = [...document.querySelectorAll(waitFor.root)];
      if (!els.length) {
        // sin lienzo a la vista tras un margen: esta ruta no tiene 3D (o no llega a montarlo)
        if (performance.now() - t0 > 1500 && part.assets >= 1 && part.modules >= 1) part.ready = 1;
        return;
      }
      part.ready = els.filter((e) => e.matches(waitFor.ready)).length / els.length;
    };

    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    let shown = 0;
    const tick = (now: number) => {
      const lin = Math.min(1, (now - t0) / (duration * 1000));
      let p: number;
      if (real) {
        checkReady();
        const r = WEIGHT.assets * part.assets + WEIGHT.modules * part.modules + WEIGHT.fonts * part.fonts + WEIGHT.ready * part.ready;
        // persigue a la carga real sin retroceder; no llega al final antes de `duration`; el tope lo abre igualmente
        shown += (Math.min(r >= 0.999 ? 1 : r, lin < 1 ? 0.97 : 1) - shown) * 0.12;
        if (r >= 0.999 && lin >= 1 && shown > 0.985) shown = 1;
        if (now - t0 > cap) shown = 1;
        p = shown;
        if (p >= 1) loaded = true;
      } else {
        // no pasa del 99 % hasta que todo ha cargado
        p = loaded ? lin : Math.min(lin, 0.99);
      }
      const v = real ? p : ease(p);
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
      className={`ui-pre ui-pre--${exit} ${className}`.trim()}
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
          {art ? (
            <>
              <span className="ui-pre__art">{art}</span>
              <span className="ui-pre__count ui-pre__count--small"><span ref={num}>0</span></span>
            </>
          ) : variant === "bar" ? null : variant === "fill" ? (
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
