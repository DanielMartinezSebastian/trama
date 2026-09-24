"use client";

import { useEffect, useMemo, useState } from "react";
import { vcls, type Variant } from "./variants";

export type TypewriterProps = {
  /** frases, una por línea */
  phrases?: string;
  /** texto fijo delante de la frase que cambia */
  prefix?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  /** pausa con la frase completa, en segundos */
  pause?: number;
  cursor?: "bar" | "block" | "underscore" | "none";
  /** tamaño de letra en px */
  fontSize?: number;
  /** @deprecated usa `fontSize` */
  size?: number;
  variant?: Variant;
  className?: string;
};

/** Frase que se escribe y se borra en bucle, típica de un titular de héroe. Sin movimiento muestra la primera. */
export default function Typewriter({ phrases = "surf en Cantabria\nolas para todos\nel mar te espera", prefix = "Aprende ", typeSpeed = 14, deleteSpeed = 30, pause = 1.4, cursor = "bar", fontSize, size: legacySize, variant = "minimal", className = "" }: TypewriterProps) {
  const size = fontSize ?? legacySize ?? 40;
  const list = useMemo(() => phrases.split("\n").filter(Boolean), [phrases]);
  const [text, setText] = useState(list[0] ?? "");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !list.length) {
      setText(list[0] ?? "");
      return;
    }
    let live = true;
    let idx = 0;
    let n = 0;
    let dir = 1;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (!live) return;
      const full = list[idx % list.length];
      n += dir;
      setText(full.slice(0, n));
      if (dir === 1 && n >= full.length) {
        dir = -1;
        timer = setTimeout(step, pause * 1000);
      } else if (dir === -1 && n <= 0) {
        dir = 1;
        idx++;
        timer = setTimeout(step, 250);
      } else timer = setTimeout(step, 1000 / (dir === 1 ? typeSpeed : deleteSpeed));
    };
    n = 0;
    step();
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [list, typeSpeed, deleteSpeed, pause]);

  return (
    <p className={`ui-type ${vcls(variant)} ${className}`} style={{ fontSize: size, margin: 0 }} aria-label={`${prefix}${list[0] ?? ""}`}>
      {prefix}
      <span style={{ color: "var(--acc)" }}>{text}</span>
      {cursor !== "none" && <i className={`ui-type__cursor ui-type__cursor--${cursor}`} aria-hidden />}
    </p>
  );
}
