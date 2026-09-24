"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { tcls, type Tone } from "./variants";

export type StatCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  char?: string;
  scale?: number;
  duration?: number;
  /** int = entero; decimal = con decimales; compact = 1,2K / 3,4M */
  format?: "int" | "decimal" | "compact";
  decimals?: number;
  /** cuándo cuenta: al montar, al entrar en pantalla o al pasar el ratón */
  trigger?: "mount" | "inview" | "hover";
  tone?: Tone;
  align?: "left" | "center" | "right";
  playKey?: number;
  className?: string;
};

type Bitmap = (text: string, o?: { char?: string; scale?: number }) => string;

const fmt = (n: number, format: StatCounterProps["format"], decimals: number) => {
  if (format === "decimal") return n.toFixed(decimals);
  if (format === "compact") return n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : `${Math.round(n)}`;
  return `${Math.round(n)}`;
};

/**
 * Cifra grande en ASCII (fuente bitmap 7×7 de asciify-engine) que cuenta hacia arriba con GSAP.
 * Pensada para secciones de "resultados" de una landing.
 */
export default function StatCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  char = "#",
  scale = 1,
  duration = 1.6,
  format = "int",
  decimals = 1,
  trigger = "mount",
  tone = "acc",
  align = "center",
  playKey = 0,
  className = "",
}: StatCounterProps) {
  const root = useRef<HTMLDivElement>(null);
  const [bitmap, setBitmap] = useState<Bitmap | null>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let live = true;
    import("asciify-engine/core").then((m) => live && setBitmap(() => m.asciifyText as Bitmap));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let disposed = false;
    const cleanups: Array<() => void> = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      const { gsap } = await import("gsap");
      if (disposed) return;
      const obj = { v: 0 };
      const run = () => {
        gsap.killTweensOf(obj);
        obj.v = 0;
        gsap.to(obj, { v: value, duration, ease: "power2.out", onUpdate: () => setShown(obj.v) });
      };
      if (reduce) {
        setShown(value);
      } else if (trigger === "hover") {
        setShown(value);
        el.addEventListener("mouseenter", run);
        cleanups.push(() => el.removeEventListener("mouseenter", run));
      } else if (trigger === "inview") {
        const io = new IntersectionObserver(([e]) => e.isIntersecting && run(), { threshold: 0.4 });
        io.observe(el);
        cleanups.push(() => io.disconnect());
      } else {
        run();
      }
      cleanups.push(() => gsap.killTweensOf(obj));
    })();

    return () => {
      disposed = true;
      cleanups.reverse().forEach((f) => f());
    };
  }, [value, duration, trigger, playKey]);

  const text = `${prefix}${fmt(shown, format, decimals)}${suffix}`;
  const art = useMemo(() => (bitmap ? bitmap(text, { char, scale }) : text), [bitmap, text, char, scale]);

  return (
    <div ref={root} className={`ui-stat ui-stat--${align} ${tcls(tone)} ${className}`}>
      <pre className="ui-stat__art" role="img" aria-label={`${prefix}${fmt(value, format, decimals)}${suffix} ${label ?? ""}`}>
        {art}
      </pre>
      {label && <span className="ui-stat__label">{label}</span>}
    </div>
  );
}
