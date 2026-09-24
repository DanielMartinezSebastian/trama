"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { CHARSETS, drawAsciiCover, drawCorruption, drawRedact, drawStatic, hash, type AsciiPattern, type CharsetId } from "@/lib/ui/fx";

export type PresenceEffect =
  | "ascii-random"
  | "ascii-sweep"
  | "ascii-rain"
  | "ascii-radial"
  | "ascii-rows"
  | "glitch"
  | "slices"
  | "shatter"
  | "crt"
  | "flicker"
  | "static"
  | "redact"
  | "boot";

export const PRESENCE_EFFECTS: { id: PresenceEffect; label: string }[] = [
  { id: "ascii-rain", label: "Lluvia de glifos" },
  { id: "ascii-random", label: "Descifrado aleatorio" },
  { id: "ascii-sweep", label: "Barrido binario" },
  { id: "ascii-radial", label: "Onda radial" },
  { id: "ascii-rows", label: "Filas de datos" },
  { id: "glitch", label: "Glitch profundo" },
  { id: "slices", label: "Datamosh (bandas)" },
  { id: "shatter", label: "Fragmentos" },
  { id: "crt", label: "Encendido CRT" },
  { id: "flicker", label: "Parpadeo de neón" },
  { id: "static", label: "Estática de TV" },
  { id: "redact", label: "Censura" },
  { id: "boot", label: "Arranque de sistema" },
];

export type PresenceProps = {
  effect?: PresenceEffect;
  /** visible o no: al cambiarlo se reproduce la aparición o la desaparición */
  show?: boolean;
  duration?: number;
  /** 0–1: fuerza del glitch, la estática y el desgarro */
  intensity?: number;
  /** glifos de las capas ASCII */
  chars?: CharsetId;
  /** tamaño de celda de las capas ASCII, en px */
  cell?: number;
  /** rastro tenue tras el borde de descubrimiento */
  edge?: boolean;
  tone?: "acc" | "acc2" | "fg";
  /** columnas de fragmentos (shatter) */
  tiles?: number;
  /** bandas horizontales (slices) */
  bands?: number;
  /** altura de cada barra de censura en px */
  rowHeight?: number;
  redactLabel?: string;
  /** líneas del arranque; separa las de entrada y las de salida con una línea «---» */
  bootLines?: string;
  /** alterna aparición y desaparición sin parar */
  loop?: boolean;
  /** pausa entre cambios en modo bucle, en segundos */
  hold?: number;
  /** reproduce la aparición inicial al montar (si es false, el contenido arranca ya visible) */
  autoplay?: boolean;
  /** ocupa el 100% del contenedor en vez de ajustarse al contenido (para envolver fondos o secciones) */
  fill?: boolean;
  playKey?: number;
  children: ReactNode;
  className?: string;
};

const DEFAULT_BOOT =
  "[ OK ] montando sistema de archivos\n[ OK ] iniciando servicios\n[ .. ] descifrando interfaz\n[ OK ] acceso concedido\n---\n[ .. ] cerrando sesión\n[ OK ] volcando memoria\n[ OK ] apagado";

/**
 * Envoltorio de aparición y desaparición cinematográficas, con estética hacker/glitch: capas de
 * glifos que se descifran, glitch con separación RGB y corrupción, datamosh, fragmentos, encendido
 * CRT, estática, censura o arranque de sistema. Todos usan --bg --fg --acc --acc2 del tema.
 *
 * El contenido está siempre en el DOM (y accesible); con movimiento reducido se muestra o se oculta
 * sin animar. Ocupa el ancho de su contenido (`display: inline-block`); se puede cambiar con `className`.
 */
export default function Presence({
  effect = "ascii-rain",
  show = true,
  duration = 1.2,
  intensity = 0.7,
  chars = "symbols",
  cell = 14,
  edge = true,
  tone = "acc",
  tiles = 6,
  bands = 10,
  rowHeight = 22,
  redactLabel = "REDACTED",
  bootLines = DEFAULT_BOOT,
  loop = false,
  hold = 1.2,
  autoplay = true,
  fill = false,
  playKey = 0,
  children,
  className = "",
}: PresenceProps) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const boot = useRef<HTMLPreElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const [auto, setAuto] = useState(true);
  const [clone, setClone] = useState<null | "bands" | "tiles">(null);
  const visible = loop ? auto : show;

  useEffect(() => {
    if (!loop) return;
    setAuto(true);
    const id = setInterval(() => setAuto((v) => !v), (duration + hold) * 1000);
    return () => clearInterval(id);
  }, [loop, duration, hold]);

  useEffect(() => {
    const el = root.current;
    const c = content.current;
    const canvas = cv.current;
    const bootEl = boot.current;
    if (!el || !c || !canvas || !bootEl) return;
    let disposed = false;
    const cleanups: Array<() => void> = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skip = first.current && !autoplay;
    first.current = false;

    (async () => {
      const { gsap } = await import("gsap");
      if (disposed) return;
      const ctx = canvas.getContext("2d")!;
      const w = Math.max(2, el.clientWidth);
      const h = Math.max(2, el.clientHeight);
      canvas.width = w;
      canvas.height = h;
      const cs = getComputedStyle(el);
      const T = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
      const bg = T("--bg", "#000");
      const fg = T("--fg", "#fff");
      const acc = T("--acc", "#7cc4ff");
      const acc2 = T("--acc2", "#c084fc");
      const c1 = tone === "acc2" ? acc2 : tone === "fg" ? fg : acc;
      const c2 = tone === "acc" ? fg : acc;
      const dirIn = visible;

      const clear = () => ctx.clearRect(0, 0, w, h);
      const showC = () => void gsap.set(c, { autoAlpha: 1 });
      const hideC = () => void gsap.set(c, { autoAlpha: 0 });
      const reset = () => {
        gsap.killTweensOf([c, canvas, bootEl]);
        gsap.set(c, { clearProps: "transform,filter,clipPath,opacity,visibility" });
        gsap.set(canvas, { autoAlpha: 1 });
        gsap.set(bootEl, { autoAlpha: 0 });
        clear();
        if (layer.current) flushSync(() => setClone(null));
      };
      const finish = () => {
        reset();
        if (!dirIn) hideC();
      };
      cleanups.push(() => {
        gsap.killTweensOf([c, canvas, bootEl]);
        clear();
      });

      if (reduce || skip) {
        finish();
        return;
      }
      reset();

      // ------------------------------------------------ capas de glifos
      if (effect.startsWith("ascii-")) {
        const pattern = effect.slice(6) as AsciiPattern;
        const k = { v: dirIn ? 0 : 1 };
        let time = 0;
        const draw = () => drawAsciiCover(ctx, w, h, k.v, { pattern, cell, chars: CHARSETS[chars], bg, c1, c2, time: (time += 0.03), seed: 11, edge });
        showC();
        draw();
        gsap.to(k, {
          v: dirIn ? 1 : 0,
          duration,
          ease: "power1.inOut",
          onUpdate: draw,
          onComplete: () => {
            if (dirIn) clear();
            else {
              hideC();
              gsap.to(canvas, { autoAlpha: 0, duration: 0.3, onComplete: clear });
            }
          },
        });
        return;
      }

      switch (effect) {
        // ---------------------------------------------- glitch profundo
        case "glitch": {
          const steps = Math.max(6, Math.round(duration * 26));
          const p = { v: 0 };
          let last = -1;
          showC();
          gsap.to(p, {
            v: 1,
            duration,
            ease: "none",
            onUpdate: () => {
              const step = Math.floor(p.v * steps);
              if (step === last) return;
              last = step;
              const env = dirIn ? Math.pow(1 - p.v, 1.3) : Math.pow(p.v, 1.3);
              const a = env * intensity;
              const r = (n: number) => hash(step * 13.7 + n) * 2 - 1;
              const gone = dirIn ? hash(step * 3.1) < a * 0.6 : hash(step * 3.1) < a * 0.5 + p.v * 0.35;
              const band = hash(step * 5.3) < a ? `inset(${(hash(step * 2.2) * 80).toFixed(0)}% 0 ${(hash(step * 4.4) * 60).toFixed(0)}% 0)` : "none";
              c.style.opacity = gone ? (hash(step) > 0.5 ? "0" : "0.25") : "1";
              c.style.transform = `translate(${r(1) * a * 34}px, ${r(2) * a * 8}px) skewX(${r(3) * a * 28}deg) scale(${1 + r(4) * a * 0.05})`;
              c.style.clipPath = band;
              c.style.filter = `drop-shadow(${a * 16 * r(5)}px 0 0 ${acc}) drop-shadow(${-a * 16 * r(5)}px 0 0 ${acc2}) hue-rotate(${r(6) * a * 90}deg) contrast(${1 + a * 0.9})`;
              drawCorruption(ctx, w, h, a, step, acc, acc2);
            },
            onComplete: () => {
              if (dirIn) reset();
              else {
                reset();
                hideC();
              }
            },
          });
          break;
        }
        // ---------------------------------------------- datamosh y fragmentos (clones)
        case "slices":
        case "shatter": {
          flushSync(() => setClone(effect === "slices" ? "bands" : "tiles"));
          const els = Array.from(layer.current?.children ?? []) as HTMLElement[];
          hideC();
          if (effect === "slices") {
            const p = { v: 0 };
            let last = -1;
            const steps = Math.max(6, Math.round(duration * 22));
            gsap.to(p, {
              v: 1,
              duration,
              ease: "none",
              onUpdate: () => {
                const step = Math.floor(p.v * steps);
                if (step === last) return;
                last = step;
                const env = (dirIn ? Math.pow(1 - p.v, 1.2) : Math.pow(p.v, 1.2)) * intensity;
                els.forEach((b, i) => {
                  const r = hash(step * 7 + i * 3) * 2 - 1;
                  const miss = dirIn ? hash(step * 5 + i) < env * 0.55 : p.v > 0.93 || hash(step * 5 + i) < env * 0.6;
                  gsap.set(b, { x: r * env * 70, opacity: miss ? 0 : 1, filter: `drop-shadow(${r * env * 10}px 0 0 ${acc}) drop-shadow(${-r * env * 10}px 0 0 ${acc2})` });
                });
              },
              onComplete: () => {
                reset();
                if (!dirIn) hideC();
              },
            });
          } else {
            const cols = Math.max(2, Math.round(tiles));
            const rows = Math.max(2, Math.round(cols * 0.6));
            const scatter = (i: number) => ({
              x: (hash(i * 3.1) * 2 - 1) * 260 * (0.4 + intensity),
              y: (hash(i * 5.7) * 2 - 1) * 200 * (0.4 + intensity) + (dirIn ? 0 : 160),
              rotation: (hash(i * 7.3) * 2 - 1) * 70,
              scale: 0.4 + hash(i * 2.9) * 0.5,
            });
            const stagger = { amount: duration * 0.45, from: "center" as const, grid: [cols, rows] as [number, number] };
            if (dirIn) {
              els.forEach((b, i) => gsap.set(b, { ...scatter(i), opacity: 0 }));
              gsap.to(els, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: duration * 0.55, ease: "power3.out", stagger, onComplete: () => reset() });
            } else {
              gsap.to(els, { x: (i: number) => scatter(i).x, y: (i: number) => scatter(i).y, rotation: (i: number) => scatter(i).rotation, scale: (i: number) => scatter(i).scale, opacity: 0, duration: duration * 0.55, ease: "power2.in", stagger, onComplete: () => { reset(); hideC(); } });
            }
          }
          break;
        }
        // ---------------------------------------------- CRT
        case "crt": {
          showC();
          gsap.set(c, { transformOrigin: "50% 50%" });
          if (dirIn) {
            gsap.set(c, { scaleY: 0.004, filter: "brightness(8) saturate(0)" });
            gsap
              .timeline({ onComplete: () => reset() })
              .to(c, { scaleY: 1.05, filter: "brightness(2.2) saturate(1)", duration: duration * 0.55, ease: "power4.out" })
              .to(c, { scaleY: 1, filter: "brightness(1) saturate(1)", duration: duration * 0.45, ease: "elastic.out(1,0.6)" });
          } else {
            gsap
              .timeline({ onComplete: () => { reset(); hideC(); } })
              .to(c, { scaleY: 0.004, filter: "brightness(6) saturate(0)", duration: duration * 0.55, ease: "power4.in" })
              .to(c, { scaleX: 0, duration: duration * 0.3, ease: "power2.in" })
              .to(c, { autoAlpha: 0, duration: 0.05 });
          }
          break;
        }
        // ---------------------------------------------- neón que parpadea
        case "flicker": {
          const seq = dirIn ? [0, 1, 0, 0.3, 1, 0.15, 1, 0.6, 0.2, 1, 0.8, 1] : [1, 0.3, 1, 0, 0.7, 0, 0.35, 0.05, 0.4, 0];
          const tl = gsap.timeline({ onComplete: () => { reset(); if (!dirIn) hideC(); } });
          const dt = duration / seq.length;
          showC();
          seq.forEach((v, i) => tl.set(c, { opacity: v, filter: `brightness(${1 + v * 0.7 * intensity}) saturate(${1 + v * 0.4})` }, i * dt));
          tl.to({}, { duration: dt });
          break;
        }
        // ---------------------------------------------- estática de TV
        case "static": {
          const p = { v: 0 };
          showC();
          gsap.to(p, {
            v: 1,
            duration,
            ease: "none",
            onUpdate: () => {
              const env = dirIn ? 1 - p.v : p.v;
              drawStatic(ctx, w, h, env * intensity * 1.15, acc);
              const flick = hash(Math.floor(p.v * duration * 30)) < 0.5;
              c.style.opacity = String(dirIn ? (p.v > 0.7 ? 1 : flick ? p.v : 0) : p.v > 0.6 ? (flick ? 1 - p.v : 0) : 1);
            },
            onComplete: () => {
              reset();
              if (!dirIn) hideC();
            },
          });
          break;
        }
        // ---------------------------------------------- censura
        case "redact": {
          const k = { v: dirIn ? 0 : 1 };
          showC();
          const draw = () => drawRedact(ctx, w, h, k.v, { rowH: rowHeight, color: fg, textColor: bg, seed: 5, label: redactLabel });
          draw();
          gsap.to(k, {
            v: dirIn ? 1 : 0,
            duration,
            ease: "power1.inOut",
            onUpdate: draw,
            onComplete: () => {
              if (dirIn) clear();
              else {
                hideC();
                gsap.to(canvas, { autoAlpha: 0, duration: 0.3, onComplete: clear });
              }
            },
          });
          break;
        }
        // ---------------------------------------------- arranque de sistema
        case "boot": {
          const [inPart, outPart] = bootLines.split(/\n---\n/);
          const lines = (dirIn ? inPart : (outPart ?? "[ .. ] cerrando\n[ OK ] apagado")).split("\n").filter(Boolean);
          const total = lines.reduce((n, l) => n + l.length + 1, 0);
          const p = { v: 0 };
          showC();
          if (!dirIn) hideC();
          gsap.set(bootEl, { autoAlpha: 1 });
          bootEl.style.color = c1;
          gsap.to(p, {
            v: 1,
            duration: duration * 0.7,
            ease: "none",
            onUpdate: () => {
              let n = Math.floor(p.v * total);
              bootEl.textContent = lines
                .map((l) => {
                  const part = l.slice(0, Math.max(0, n));
                  n -= l.length + 1;
                  return part;
                })
                .join("\n");
            },
            onComplete: () => {
              gsap.to(bootEl, { autoAlpha: 0, duration: duration * 0.3, onComplete: () => { reset(); if (!dirIn) hideC(); } });
            },
          });
          break;
        }
      }
    })();

    return () => {
      disposed = true;
      cleanups.reverse().forEach((f) => f());
    };
  }, [visible, effect, duration, intensity, chars, cell, edge, tone, tiles, bands, rowHeight, redactLabel, bootLines, playKey, autoplay]);

  const cols = Math.max(2, Math.round(tiles));
  const rows = Math.max(2, Math.round(cols * 0.6));
  const n = Math.max(2, Math.round(bands));

  return (
    <div ref={root} className={`ui-tx ${fill ? "ui-tx--fill" : ""} ${className}`}>
      <div ref={content} className="ui-tx__content">
        {children}
      </div>
      {clone && (
        <div ref={layer} className="ui-tx__clones" aria-hidden>
          {clone === "bands"
            ? Array.from({ length: n }, (_, i) => (
                <div key={i} className="ui-tx__clone" style={{ clipPath: `inset(${((i / n) * 100).toFixed(2)}% 0 ${(100 - ((i + 1) / n) * 100).toFixed(2)}% 0)` }}>
                  {children}
                </div>
              ))
            : Array.from({ length: cols * rows }, (_, i) => {
                const cx = i % cols;
                const cy = Math.floor(i / cols);
                const inset = `inset(${((cy / rows) * 100).toFixed(2)}% ${(100 - ((cx + 1) / cols) * 100).toFixed(2)}% ${(100 - ((cy + 1) / rows) * 100).toFixed(2)}% ${((cx / cols) * 100).toFixed(2)}%)`;
                return (
                  <div key={i} className="ui-tx__clone" style={{ clipPath: inset }}>
                    {children}
                  </div>
                );
              })}
        </div>
      )}
      <canvas ref={cv} className="ui-tx__fx" aria-hidden />
      <pre ref={boot} className="ui-tx__boot" aria-hidden />
    </div>
  );
}
