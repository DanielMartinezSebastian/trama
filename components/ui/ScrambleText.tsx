"use client";

import { useEffect, useRef } from "react";
import { tcls, type Tone } from "./variants";

export type ScrambleTextProps = {
  text: string;
  /** caracteres que se ven mientras se descifra */
  chars?: string;
  duration?: number;
  /** velocidad de cambio de los glifos (0.2 lento – 2 rápido) */
  speed?: number;
  /** cuándo se lanza: al montar, al pasar el ratón o en bucle */
  trigger?: "mount" | "hover" | "loop";
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** tamaño de letra en px */
  fontSize?: number;
  /** @deprecated usa `fontSize` */
  size?: number;
  weight?: number;
  /** color: un token, o un degradado entre --acc y --acc2 */
  tone?: Tone | "gradient";
  align?: "left" | "center" | "right";
  uppercase?: boolean;
  /** espaciado entre letras en em (−0.05 – 0.3) */
  tracking?: number;
  /** cambia el número para repetir la animación desde fuera */
  playKey?: number;
  className?: string;
};

/**
 * Texto que se "descifra" con ScrambleText de GSAP. El texto real siempre está en el DOM
 * (legible sin JS); el efecto solo lo anima.
 */
export default function ScrambleText({
  text,
  chars = "!<>-_\\/[]{}=+*^?#",
  duration = 1.2,
  speed = 0.6,
  trigger = "mount",
  as: Tag = "h2",
  fontSize, size: legacySize,
  weight = 800,
  tone = "fg",
  align = "center",
  uppercase = false,
  tracking = -0.02,
  playKey = 0,
  className = "",
}: ScrambleTextProps) {
  const size = fontSize ?? legacySize ?? 40;
  const inner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    let disposed = false;
    const cleanups: Array<() => void> = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrambleTextPlugin } = await import("gsap/ScrambleTextPlugin");
      if (disposed) return;
      gsap.registerPlugin(ScrambleTextPlugin);
      const run = () =>
        gsap.to(el, { duration, scrambleText: { text, chars, revealDelay: 0.15, speed }, ease: "none", overwrite: true });

      if (!reduce) {
        if (trigger === "hover") {
          el.parentElement?.addEventListener("mouseenter", run);
          cleanups.push(() => el.parentElement?.removeEventListener("mouseenter", run));
        } else {
          el.textContent = " ";
          run();
          if (trigger === "loop") {
            const id = setInterval(run, (duration + 1.6) * 1000);
            cleanups.push(() => clearInterval(id));
          }
        }
      }
      cleanups.push(() => {
        gsap.killTweensOf(el);
        el.textContent = text;
      });
    })();

    return () => {
      disposed = true;
      cleanups.reverse().forEach((f) => f());
    };
  }, [text, chars, duration, speed, trigger, playKey]);

  return (
    <Tag
      className={`ui-scramble ${tone === "gradient" ? "ui-scramble--gradient" : tcls(tone)} ${uppercase ? "ui-scramble--upper" : ""} ${className}`}
      style={{ fontSize: size, fontWeight: weight, textAlign: align, letterSpacing: `${tracking}em` }}
    >
      {/* key: React crea un nodo nuevo al cambiar el texto, así no pisa el que anima GSAP */}
      <span key={text} ref={inner}>
        {text}
      </span>
    </Tag>
  );
}
