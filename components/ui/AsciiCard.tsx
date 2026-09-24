"use client";

import { useEffect, useRef } from "react";
import type { SourceKind } from "@/lib/asciify/painters";
import { ANIMATED_FIELDS, drawCardField, type CardCharset, type CardField, type CardFieldColor, type CardFieldHover } from "@/lib/ui/card-fields";
import { token } from "@/lib/ui/tokens";
import { useTokens } from "@/lib/ui/useTokens";
import AsciiBackground, { type ASCII_STYLES } from "./AsciiBackground";
import { fillProps, type CardFill, type CardPattern, type CardTone } from "./fill";
import { vcls, type Variant } from "./variants";

export type HoverFx = "spotlight" | "magnify" | "repel" | "glow" | "colorShift" | "attract" | "shatter" | "trail" | "glitchText";

export type AsciiCardProps = {
  title: string;
  text: string;
  meta?: string;
  /** número que se dibuja en ASCII (01, 02…) */
  index?: number;
  showNumeral?: boolean;
  /** carácter con el que se dibuja el número y las esquinas */
  glyph?: string;
  /**
   * capa ASCII del fondo:
   * - `field`: campo de caracteres procedural (`field`, `charset`, `fieldColor`, `fieldHover`), ligero y animado
   * - `text`: el texto `tile` repetido, con hover de asciify-engine (`hover`)
   * - `scene`: una escena de `AsciiBackground` (`scene`, `sceneStyle`); la más vistosa y la más pesada
   * - `none`: sin capa (solo el `fill`)
   */
  background?: "field" | "text" | "scene" | "none";
  field?: CardField;
  charset?: CardCharset;
  fieldColor?: CardFieldColor;
  fieldHover?: CardFieldHover;
  /** anima el campo (se pausa fuera de pantalla y con movimiento reducido) */
  animate?: boolean;
  /** velocidad de la animación del campo */
  speed?: number;
  scene?: SourceKind;
  sceneStyle?: (typeof ASCII_STYLES)[number];
  /** patrón de texto que se repite como fondo con `background="text"` */
  tile?: string;
  /** tamaño de celda / fuente de la capa ASCII en px */
  tileSize?: number;
  /** opacidad de la capa ASCII (10–255) */
  tileOpacity?: number;
  /** efecto de hover de asciify-engine con background="text" */
  textHover?: HoverFx;
  /** @deprecated usa `textHover` */
  hover?: HoverFx;
  hoverStrength?: number;
  hoverRadius?: number;
  variant?: Variant;
  /** fondo de la tarjeta: surface · tint · gradient · accent (invertida) · pattern · image (ver fill.ts) */
  fill?: CardFill;
  pattern?: CardPattern;
  tone?: CardTone;
  /** con fill="image": URL/ruta o `gen:N` */
  image?: string;
  reveal?: "none" | "wipe" | "rise" | "dissolve";
  revealDuration?: number;
  /** tamaño de las celdas de la disolución en px */
  dissolveCell?: number;
  /** cuándo se revela: al montar o al entrar en pantalla */
  trigger?: "mount" | "inview";
  tilt?: boolean;
  /** inclinación máxima en grados */
  tiltMax?: number;
  scramble?: boolean;
  chars?: string;
  /** brillo que sigue al ratón */
  glow?: boolean;
  align?: "left" | "center";
  minHeight?: number;
  /** cambia el número para repetir el revelado desde fuera */
  playKey?: number;
  className?: string;
};

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Tarjeta con tres capas de ASCII: el número en fuente bitmap, un fondo ASCII (campo procedural, texto repetido o
 * escena de AsciiBackground, ver `background`) y un revelado por disolución. Además: inclinación hacia el puntero, brillo que
 * sigue al ratón y título que se descifra. Todo el color sale de los tokens `--bg --mut --acc --acc2`
 * y se actualiza al cambiar de tema sin repetir el revelado.
 */
export default function AsciiCard({
  title,
  text,
  meta,
  index = 1,
  showNumeral = true,
  glyph = "#",
  background = "field",
  field = "plasma",
  charset = "detailed",
  fieldColor = "mut",
  fieldHover = "glow",
  animate = true,
  speed = 1,
  scene = "waves",
  sceneStyle = "braille",
  tile = "OLA · MAR · SAL · ",
  tileSize = 11,
  tileOpacity = 110,
  textHover, hover: legacyHover,
  hoverStrength = 0.9,
  hoverRadius = 0.4,
  variant = "glass",
  fill,
  pattern,
  tone,
  image,
  reveal = "rise",
  revealDuration = 0.9,
  dissolveCell = 14,
  trigger = "mount",
  tilt = true,
  tiltMax = 10,
  scramble = true,
  chars = "~-=^_",
  glow = true,
  align = "left",
  minHeight = 250,
  playKey = 0,
  className = "",
}: AsciiCardProps) {
  const hover = textHover ?? legacyHover ?? "trail";
  const card = useRef<HTMLElement>(null);
  const bg = useRef<HTMLCanvasElement>(null);
  const fx = useRef<HTMLCanvasElement>(null);
  const art = useRef<HTMLPreElement>(null);
  const h3 = useRef<HTMLHeadingElement>(null);
  const redraw = useRef<() => void>(() => {});
  const tokens = useTokens(card);

  // Al cambiar el tema (tokens) solo se repinta el fondo: no se repite el revelado
  useEffect(() => {
    redraw.current();
  }, [tokens]);

  useEffect(() => {
    const el = card.current;
    const bgc = bg.current;
    const fxc = fx.current;
    const artEl = art.current;
    const titleEl = h3.current;
    if (!el || !bgc || !fxc || !artEl || !titleEl) return;

    let disposed = false;
    const cleanups: Array<() => void> = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    (async () => {
      const [{ gsap }, { ScrambleTextPlugin }, core] = await Promise.all([
        import("gsap"),
        import("gsap/ScrambleTextPlugin"),
        import("asciify-engine/core"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrambleTextPlugin);

      const bctx = bgc.getContext("2d")!;
      const fctx = fxc.getContext("2d")!;
      artEl.textContent = showNumeral ? core.asciifyText(`0${index}`, { char: glyph }) : "";

      // ---------- fondo de texto con hover de asciify-engine ----------
      const pos = { x: 0.5, y: 0.5 };
      let intensity = 0;
      let target = 0;
      let raf = 0;
      const t0 = performance.now();
      const drawBg = () => {
        bctx.clearRect(0, 0, bgc.width, bgc.height);
        if (background === "field") {
          const t = reduce ? 0 : ((performance.now() - t0) / 1000) * speed;
          drawCardField(
            bctx,
            bgc.width,
            bgc.height,
            t,
            {
              field,
              charset,
              color: fieldColor,
              hover: fieldHover,
              size: tileSize,
              opacity: tileOpacity / 255,
              seed: index * 13.7,
              glyph,
              colors: { mut: token(el, "--mut", "#8899aa"), acc: token(el, "--acc", "#ffffff"), acc2: token(el, "--acc2", "#cccccc") },
            },
            { x: pos.x, y: pos.y, intensity },
          );
          return;
        }
        if (background !== "text") return;
        core.renderTextBackground(
          bctx,
          bgc.width,
          bgc.height,
          tile || " ",
          {
            fontSize: tileSize,
            color: token(el, "--mut", "#8899aa"),
            opacity: tileOpacity,
            hoverEffect: hover,
            hoverStrength,
            hoverRadius,
            hoverColor: token(el, "--acc", "#ffffff"),
          },
          intensity > 0.02 ? { x: pos.x, y: pos.y, intensity } : null,
        );
      };
      redraw.current = drawBg;
      // El campo animado corre a ~30 fps y solo mientras la tarjeta se ve; el resto solo mientras hay hover
      const fieldAnimated = background === "field" && animate && !reduce && ANIMATED_FIELDS.has(field);
      let visible = false;
      let last = 0;
      const loop = (now: number) => {
        intensity += (target - intensity) * 0.18;
        if (now - last > 33 || intensity > 0.02) {
          last = now;
          drawBg();
        }
        raf = (fieldAnimated && visible) || intensity > 0.02 || target > 0 ? requestAnimationFrame(loop) : 0;
      };
      if (fieldAnimated) {
        const vio = new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
          if (visible && !raf) raf = requestAnimationFrame(loop);
        });
        vio.observe(el);
        cleanups.push(() => vio.disconnect());
      }
      const kick = () => {
        if (!raf) raf = requestAnimationFrame(loop);
      };
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        redraw.current = () => {};
      });

      // ---------- disolución ASCII ----------
      const k = { v: reveal === "dissolve" && !reduce ? 0 : 1 };
      const seed = index * 977;
      const drawDissolve = (time: number) => {
        fctx.clearRect(0, 0, fxc.width, fxc.height);
        if (k.v >= 1) return;
        const cell = dissolveCell;
        fctx.font = `${Math.max(8, cell - 3)}px monospace`;
        fctx.textBaseline = "top";
        const bgCol = token(el, "--bg", "#000");
        const a1 = token(el, "--acc", "#fff");
        const a2 = token(el, "--acc2", "#ccc");
        for (let cy = 0; cy * cell < fxc.height; cy++) {
          for (let cx = 0; cx * cell < fxc.width; cx++) {
            const hh = hash(seed + cx * 31 + cy * 17);
            if (k.v < hh) {
              fctx.fillStyle = bgCol;
              fctx.fillRect(cx * cell, cy * cell, cell, cell);
              fctx.fillStyle = hash(seed + cx + cy * 7 + Math.floor(time * 12)) > 0.5 ? a1 : a2;
              fctx.globalAlpha = 0.35 + 0.65 * (1 - hh + k.v * 0.5);
              fctx.fillText(chars[Math.floor(hash(cx * 3 + cy + time * 7) * chars.length)] ?? "#", cx * cell + 3, cy * cell + 2);
              fctx.globalAlpha = 1;
            } else if (k.v - hh < 0.07) {
              fctx.fillStyle = a1;
              fctx.globalAlpha = 0.5;
              fctx.fillRect(cx * cell, cy * cell, cell, cell);
              fctx.globalAlpha = 1;
            }
          }
        }
      };

      const size = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        for (const c of [bgc, fxc]) {
          c.width = w;
          c.height = h;
        }
        drawBg();
        drawDissolve(0);
      };
      const ro = new ResizeObserver(size);
      ro.observe(el);
      cleanups.push(() => ro.disconnect());

      // ---------- estado inicial y revelado ----------
      gsap.set(el, { clearProps: "clipPath,opacity,visibility,transform" });
      const animated = !reduce && reveal !== "none";
      if (animated && reveal === "wipe") gsap.set(el, { clipPath: "inset(0 100% 0 0)" });
      if (animated && reveal === "rise") gsap.set(el, { autoAlpha: 0, y: 60 });
      if (animated) gsap.set([artEl], { autoAlpha: 0 });
      gsap.set(el, { transformPerspective: 900 });

      const play = () => {
        if (!animated) return;
        if (reveal === "wipe") gsap.to(el, { clipPath: "inset(0 0% 0 0)", duration: revealDuration, ease: "power3.inOut" });
        else if (reveal === "rise") gsap.to(el, { autoAlpha: 1, y: 0, duration: revealDuration, ease: "power3.out" });
        else {
          const t = { v: 0 };
          k.v = 0;
          gsap.to(k, { v: 1, duration: revealDuration * 1.5, ease: "power1.inOut", onUpdate: () => drawDissolve((t.v += 0.03)) });
        }
        gsap.to(artEl, { autoAlpha: 1, duration: 0.6, delay: 0.3 });
        if (scramble)
          gsap.fromTo(
            titleEl,
            { scrambleText: { text: " " } },
            { duration: 1.1, delay: 0.2, scrambleText: { text: title, chars, revealDelay: 0.15, speed: 0.6 }, ease: "none" },
          );
      };
      if (trigger === "inview" && animated) {
        const io = new IntersectionObserver(([e]) => e.isIntersecting && (play(), io.disconnect()), { threshold: 0.3 });
        io.observe(el);
        cleanups.push(() => io.disconnect());
      } else {
        play();
      }

      // ---------- ratón ----------
      if (!coarse) {
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width;
          const ny = (e.clientY - r.top) / r.height;
          pos.x = nx;
          pos.y = ny;
          target = 1;
          kick();
          if (tilt && !reduce) {
            rx((0.5 - ny) * tiltMax);
            ry((nx - 0.5) * tiltMax * 1.2);
          }
          el.style.setProperty("--mx", `${nx * 100}%`);
          el.style.setProperty("--my", `${ny * 100}%`);
        };
        const enter = () => {
          if (scramble && !reduce) gsap.to(titleEl, { duration: 0.7, scrambleText: { text: title, chars, speed: 0.6 }, ease: "none" });
        };
        const leave = () => {
          target = 0;
          kick();
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointerleave", leave);
        });
      }
      cleanups.push(() => {
        gsap.killTweensOf([el, artEl, titleEl, k]);
        gsap.set(el, { clearProps: "transform,opacity,visibility,clipPath" });
        titleEl.textContent = title;
      });
    })();

    return () => {
      disposed = true;
      cleanups.reverse().forEach((f) => f());
    };
  }, [title, index, showNumeral, glyph, background, field, charset, fieldColor, fieldHover, animate, speed, tile, tileSize, tileOpacity, hover, hoverStrength, hoverRadius, reveal, revealDuration, dissolveCell, trigger, tilt, tiltMax, scramble, chars, playKey]);

  const f = fillProps({ fill, pattern, tone, image });
  return (
    <article
      ref={card}
      className={`ui-card ui-surface ${f.className} ${vcls(variant)} ${glow ? "ui-card--glowon" : ""} ${align === "center" ? "ui-card--center" : ""} ${className}`}
      style={{ minHeight, ...f.style }}
      data-corner={glyph}
    >
      {background === "scene" && (
        <AsciiBackground scene={scene} asciiStyle={sceneStyle} cellSize={Math.max(4, Math.round(tileSize * 0.7))} palette="tint" tintAmount={0.7} asciiHover="none" bloom={0} vignette={0.4} fps={30} opacity={Math.max(0.1, tileOpacity / 255)} />
      )}
      <canvas ref={bg} className="ui-card__bg" aria-hidden />
      <canvas ref={fx} className="ui-card__fx" aria-hidden />
      <div className="ui-card__glow" aria-hidden />
      <div className="ui-card__inner">
        <pre ref={art} className="ui-card__art" aria-hidden />
        {/* key: al cambiar el título React crea un nodo nuevo y no pisa el que anima GSAP */}
        <h3 key={title} ref={h3}>
          {title}
        </h3>
        <p>{text}</p>
        {meta && <span className="ui-card__meta">{meta}</span>}
      </div>
    </article>
  );
}
