"use client";

import { createElement, Fragment, useEffect, useRef, type CSSProperties } from "react";
import { whenIntroDone } from "@/lib/motion/intro";

export const SPLIT_BY = ["lines", "words", "chars"] as const;
export type SplitBy = (typeof SPLIT_BY)[number];
export const SPLIT_EFFECTS = ["rise", "rotate", "blur", "fade"] as const;
export type SplitEffect = (typeof SPLIT_EFFECTS)[number];

export type SplitTextProps = {
  /** texto plano; se trocea al pintarlo, sin tocar el DOM después */
  children: string;
  /** unidad que se escalona: líneas (las que resulten del ancho), palabras o letras */
  by?: SplitBy;
  effect?: SplitEffect;
  /** recorta cada palabra para que el texto «salga» de una línea invisible (solo con rise y rotate) */
  mask?: boolean;
  /** `mount`: al montar · `inview`: al entrar en pantalla. En ambos casos espera al `Preloader`, si lo hay */
  trigger?: "mount" | "inview";
  /** segundos entre unidades (por defecto: 0,1 líneas · 0,06 palabras · 0,025 letras) */
  stagger?: number;
  duration?: number;
  delay?: number;
  /** con `inview`: solo la primera vez (true) o cada vez que entra (false) */
  once?: boolean;
  threshold?: number;
  /** cambia para volver a lanzar la animación desde fuera */
  playKey?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";
  className?: string;
  style?: CSSProperties;
};

const STEP: Record<SplitBy, number> = { lines: 0.1, words: 0.06, chars: 0.025 };

/**
 * Titulares y párrafos que entran por líneas, palabras o letras, con máscara de recorte. Es CSS (transiciones sobre
 * variables por unidad), sin GSAP; el estado oculto viene ya en el HTML del servidor, así que no hay parpadeo.
 *
 * Accesibilidad: el lector de pantalla lee una copia del texto íntegro (`.ui-sr`); las unidades van `aria-hidden`.
 * Con `prefers-reduced-motion` o sin JS el texto se ve tal cual. Para líneas, se mide cada palabra tras cargar las
 * fuentes y al cambiar el ancho; no trocea texto controlado por React (guía §10), por eso solo admite un `string`.
 */
export default function SplitText({
  children: text,
  by = "words",
  effect = "rise",
  mask = true,
  trigger = "inview",
  stagger,
  duration = 0.9,
  delay = 0,
  once = true,
  threshold = 0.3,
  playKey = 0,
  as = "div",
  className = "",
  style,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(/\s+/).filter(Boolean);
  const step = stagger ?? STEP[by];
  const masked = mask && (effect === "rise" || effect === "rotate");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let off: Array<() => void> = [];

    // Líneas: el índice de línea de cada palabra (por su posición vertical) pasa a ser su orden de aparición
    const measure = () => {
      if (by !== "lines") return;
      const ws = Array.from(el.querySelectorAll<HTMLElement>(":scope > .ui-split__w"));
      let line = -1;
      let top = Number.NEGATIVE_INFINITY;
      for (const w of ws) {
        const t = w.offsetTop;
        if (Math.abs(t - top) > 2) {
          line += 1;
          top = t;
        }
        w.style.setProperty("--i", String(line));
      }
    };
    measure();
    document.fonts?.ready.then(measure);
    if (by === "lines" && typeof ResizeObserver !== "undefined") {
      let w = el.clientWidth;
      let raf = 0;
      const ro = new ResizeObserver(() => {
        if (el.clientWidth === w) return;
        w = el.clientWidth;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(measure);
      });
      ro.observe(el);
      off.push(() => {
        ro.disconnect();
        cancelAnimationFrame(raf);
      });
    }

    // Reinicio (playKey): se quita el estado final y se fuerza un reflujo antes de volver a ponerlo
    el.removeAttribute("data-in");
    void el.offsetWidth;

    const show = () => el.setAttribute("data-in", "");
    const hide = () => el.removeAttribute("data-in");
    if (trigger === "mount") {
      off.push(whenIntroDone(() => requestAnimationFrame(show)));
    } else {
      let io: IntersectionObserver | undefined;
      const cancel = whenIntroDone(() => {
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                show();
                if (once) io?.disconnect();
              } else if (!once) hide();
            }
          },
          { threshold },
        );
        io.observe(el);
      });
      off.push(cancel, () => io?.disconnect());
    }
    return () => off.forEach((f) => f());
  }, [by, trigger, once, threshold, playKey, text]);

  let n = 0;
  const units = words.map((w, i) => {
    const inner =
      by === "chars"
        ? Array.from(w).map((c, j) => (
            <span key={j} className="ui-split__u" style={{ "--i": n++ } as CSSProperties}>
              {c}
            </span>
          ))
        : null;
    return (
      <Fragment key={i}>
        <span className="ui-split__w" aria-hidden style={{ "--i": by === "words" ? i : 0 } as CSSProperties}>
          {inner ?? <span className="ui-split__u">{w}</span>}
        </span>
        {i < words.length - 1 ? " " : null}
      </Fragment>
    );
  });

  return createElement(
    as,
    {
      ref,
      "data-armed": "",
      className: `ui-split ui-split--${effect} ${masked ? "ui-split--mask" : ""} ${className}`.trim(),
      style: { ...style, "--split-step": `${step}s`, "--split-delay": `${delay}s`, "--split-dur": `${duration}s` } as CSSProperties,
    },
    <span className="ui-sr">{text}</span>,
    ...units,
  );
}
