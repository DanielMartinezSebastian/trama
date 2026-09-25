"use client";

import { useEffect, useRef, useState } from "react";
import AsciiBackground, { type ASCII_STYLES } from "@/components/ui/AsciiBackground";
import type { SourceKind } from "@/lib/asciify/painters";
import { resetShapeView, shapeView, type ShapeFx } from "@/lib/asciify/shape-painters";
import { clamp, resetScroll, smooth } from "@/lib/scroll/store";
import { Glitch, Rotator, Scramble } from "./Glitch";
import "./minimal.css";
import "./geometry.css";

type Style = (typeof ASCII_STYLES)[number];
type RGB = [number, number, number];

type Intro = "glitch" | "wipe" | "drop" | "slide" | "type" | "rise" | "scramble" | "zoom";
type Hover = "none" | "trail" | "water" | "contour" | "dissolve" | "silk" | "vortex";

/**
 * Cada capítulo ocupa 250dvh (8 × 250 = 2000dvh). Los números se interpolan con el scroll; escena, estilo y
 * hover saltan en la transición. `x/y/s` colocan la forma (fracción del lienzo; fuera de 0..1 = recortada por el borde)
 * y se interpolan, así que la figura se desliza de una posición a otra. `fx` es el hover propio de la figura y
 * `hover` el del motor de caracteres. `side` es el lado del texto (opuesto a la forma).
 */
type Chapter = {
  scene: SourceKind; style: Style; name: string; line: string;
  cell: number; bloom: number; grain: number; scan: number; vig: number; tint: number; acc: RGB;
  x: number; y: number; s: number; side: "l" | "r";
  fx: ShapeFx; hover: Hover;
  /** efecto de aparición de los carteles del capítulo */
  intro: Intro;
};

const CHAPTERS: Chapter[] = [
  { scene: "cube", style: "dither", name: "Cubo", line: "dither · celda de 3 px · el puntero lo repele", cell: 2, bloom: 0, grain: 0, scan: 0, vig: 0, tint: 0.9, acc: [255, 138, 92], x: 0.7, y: 0.5, s: 1.15, side: "l", fx: "repel", intro: "glitch", hover: "trail" },
  { scene: "pyramid", style: "mosaic", name: "Pirámide", line: "mosaico · celda de 5 px · lupa bajo el puntero", cell: 5, bloom: 0.2, grain: 0, scan: 0, vig: 0.25, tint: 0.75, acc: [63, 208, 201], x: 0.96, y: 0.52, s: 2.1, side: "l", fx: "magnify", intro: "wipe", hover: "water" },
  { scene: "sphere", style: "dots", name: "Esfera", line: "puntos · celda de 4 px · el puntero la retuerce", cell: 4, bloom: 0.45, grain: 0.1, scan: 0, vig: 0.35, tint: 0.85, acc: [255, 212, 59], x: 0.5, y: 1.12, s: 2.6, side: "l", fx: "twist", intro: "drop", hover: "vortex" },
  { scene: "octahedron", style: "lego", name: "Octaedro", line: "lego · celda de 8 px · estalla al pasar el puntero", cell: 8, bloom: 0.1, grain: 0, scan: 0.15, vig: 0.2, tint: 0.55, acc: [255, 79, 163], x: 0.03, y: 0.48, s: 2.1, side: "r", fx: "explode", intro: "slide", hover: "dissolve" },
  { scene: "icosahedron", style: "diamond", name: "Icosaedro", line: "rombos · celda de 4 px · ondas desde el puntero", cell: 4, bloom: 0.3, grain: 0, scan: 0, vig: 0.3, tint: 0.8, acc: [140, 130, 255], x: 0.62, y: 0.5, s: 1.3, side: "l", fx: "wave", intro: "type", hover: "silk" },
  { scene: "hexprism", style: "pixel", name: "Prisma hexagonal", line: "píxel · celda de 4 px · el puntero lo atrae", cell: 4, bloom: 0.15, grain: 0.05, scan: 0.1, vig: 0.25, tint: 0.85, acc: [255, 150, 60], x: 0.97, y: 0.04, s: 2.0, side: "l", fx: "magnet", intro: "rise", hover: "contour" },
  { scene: "torusknot", style: "lines", name: "Nudo toroidal", line: "líneas · celda de 5 px · se ajusta a una rejilla", cell: 5, bloom: 0.35, grain: 0, scan: 0, vig: 0.4, tint: 0.9, acc: [80, 220, 255], x: 0.28, y: 0.5, s: 1.5, side: "r", fx: "snap", intro: "scramble", hover: "trail" },
  { scene: "cone", style: "braille", name: "Cono", line: "braille · celda de 4 px · el puntero lo estira", cell: 4, bloom: 0.55, grain: 0.15, scan: 0.35, vig: 0.4, tint: 0.9, acc: [124, 242, 154], x: 0.06, y: 1.0, s: 2.2, side: "r", fx: "stretch", intro: "zoom", hover: "dissolve" },
];
const N = CHAPTERS.length;
/** Alto de cada capítulo, en alturas de ventana (debe coincidir con `.mx__chap` en geometry.css). */
const CH_H = 2.5;
/** El cambio ocurre cuando el siguiente texto entra en pantalla: media altura de ventana antes del borde del capítulo. */
const OFFSET = 0.5 / CH_H;
/** Pico de tamaño de celda durante la transición: la imagen se rompe en bloques justo al cambiar de forma. */
const CELL_PEAK = 34;
/** Anchura de la zona de transición, en fracción de capítulo a cada lado del cambio. */
const ZONE = 0.12;

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const q = (v: number, step: number) => Math.round(v / step) * step;

type Look = { scene: SourceKind; style: Style; hover: Hover; cell: number; bloom: number; grain: number; scan: number; vig: number; glitch: number; tint: number };

/** Fondo dirigido por el scroll: calcula cada fotograma y solo re-renderiza cuando algún valor cuantizado cambia. */
function Stage() {
  const wrap = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState<Look>({ scene: CHAPTERS[0].scene, style: CHAPTERS[0].style, hover: CHAPTERS[0].hover, cell: CHAPTERS[0].cell, bloom: 0, grain: 0, scan: 0, vig: 0, glitch: 0.05, tint: 0.9 });

  useEffect(() => {
    const root = wrap.current?.parentElement as HTMLElement | null;
    let raf = 0;
    let cur = -1; // capítulo suavizado (flotante)
    let key = "";

    const tick = () => {
      const vh = innerHeight;
      // El cambio de capítulo ocurre cuando el siguiente texto entra en pantalla: media altura antes del borde
      const target = clamp(scrollY / (CH_H * vh) + OFFSET, 0, N - 0.0001);
      cur = cur < 0 ? target : cur + (target - cur) * 0.14;
      const i = Math.min(N - 1, Math.floor(cur));
      const f = cur - i;
      const j = Math.min(N - 1, i + 1);
      const A = CHAPTERS[i], B = CHAPTERS[j];
      const k = smooth(f);

      const dist = Math.min(i + 1 < N ? 1 - f : 9, i > 0 ? f : 9);
      const e = dist < ZONE ? smooth(1 - dist / ZONE) : 0;

      const base = lerp(A.cell, B.cell, k);
      const next: Look = {
        scene: A.scene,
        style: A.style,
        hover: A.hover,
        cell: Math.max(1, q(lerp(base, CELL_PEAK, e), 0.5)),
        bloom: q(lerp(A.bloom, B.bloom, k), 0.05),
        grain: q(lerp(A.grain, B.grain, k), 0.05),
        scan: q(lerp(A.scan, B.scan, k) + e * 0.25, 0.05),
        vig: q(lerp(A.vig, B.vig, k), 0.05),
        glitch: q(0.04 + e * 0.75, 0.05),
        tint: q(lerp(A.tint, B.tint, k), 0.05),
      };
      const nk = Object.values(next).join("|");
      if (nk !== key) {
        key = nk;
        setLook(next);
      }

      // Colocación y hover propio de la figura (los lee el painter en cada fotograma)
      shapeView.x = lerp(A.x, B.x, k);
      shapeView.y = lerp(A.y, B.y, k);
      shapeView.s = lerp(A.s, B.s, k);
      shapeView.fx = A.fx;

      // Acento continuo → colorea la tinta del fondo y los bloques de texto (la landing lee --acc)
      const c = [0, 1, 2].map((n) => Math.round(lerp(A.acc[n], B.acc[n], k)));
      root?.style.setProperty("--acc", `rgb(${c[0]} ${c[1]} ${c[2]})`);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      resetShapeView();
    };
  }, []);

  return (
    <>
      <div ref={wrap} className="mn__bg">
        <AsciiBackground
          scene={look.scene}
          asciiStyle={look.style}
          cellSize={look.cell}
          bloom={look.bloom}
          grain={look.grain}
          scanlines={look.scan}
          vignette={look.vig}
          glitch={look.glitch}
          palette="tint"
          tintAmount={look.tint}
          asciiHover={look.hover}
          hoverStrength={0.9}
          hoverRadius={0.3}
        />
      </div>
    </>
  );
}

/** Tipo de texto que anima cada efecto: los de "scramble" se descifran con GSAP; el resto son animaciones CSS por pasos. */
const CHARS = "█▓▒░#%&@$+=";

/** Cartel de un capítulo: mismo texto, distinto efecto de aparición según `intro`. */
function Poster({ c, index, children }: { c: Chapter; index: number; children?: React.ReactNode }) {
  const t = (text: string, delay = 0, className = "") => (c.intro === "scramble" ? <Scramble text={text} className={className} /> : <Glitch text={text} className={className} delay={delay} />);
  return (
    <section className="mx__chap" data-side={c.side}>
      <div className="mx__stick" data-reveal data-fx={c.intro} style={{ "--dir": c.side === "l" ? -1 : 1 } as React.CSSProperties}>
        <div className="mx__in">
          <span className="mn__num">
            {String(index + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </span>
          <h2 className="mn__h2">
            <span className="mn-line">{t(c.name, 0, "mn-hl")}</span>
          </h2>
          <p className="mn__p mn-hl">{t(c.line, 350)}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

/** Landing demo de 2000dvh: el scroll cambia el tamaño de celda y otros valores del fondo, y con una transición de bloques salta de una geometría a otra. */
export default function GeometryLanding({ hud = false }: { hud?: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("scrollable");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    resetScroll();

    let disposed = false;
    let io: IntersectionObserver | undefined;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { ScrambleTextPlugin }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/ScrambleTextPlugin")]);
      if (disposed || !root.current) return;
      gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
      const el = root.current;

      // Cada [data-reveal] entra y sale: al volver a verse se re-escribe. Los textos "scramble" se descifran con GSAP.
      const scrambles = (n: Element) => Array.from(n.querySelectorAll<HTMLElement>("[data-scramble]"));
      const blank = (x: HTMLElement) => (x.textContent = " ".repeat(x.dataset.scramble!.length));
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            e.target.toggleAttribute("data-in", e.isIntersecting);
            scrambles(e.target).forEach((x, n) => {
              gsap.killTweensOf(x);
              blank(x);
              if (e.isIntersecting) gsap.to(x, { duration: 1.1, delay: n * 0.25, ease: "none", scrambleText: { text: x.dataset.scramble!, chars: CHARS, revealDelay: 0.15, speed: 0.6 } });
            });
          }),
        { threshold: 0.35 },
      );
      el.querySelectorAll("[data-reveal]").forEach((n) => io!.observe(n));
      el.querySelectorAll<HTMLElement>("[data-scramble]").forEach(blank);

      // Salida: al terminar un capítulo, su cartel se desliza por pasos hacia su borde mientras sube. Ligado al scroll, no al tiempo.
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".mx__chap", el).forEach((chap, n, all) => {
          if (n === all.length - 1) return;
          const dir = chap.dataset.side === "l" ? -1 : 1;
          gsap.to(chap.querySelector(".mx__in"), {
            x: () => dir * innerWidth * 0.75,
            ease: "steps(14)",
            scrollTrigger: { trigger: chap, start: "bottom bottom", end: "bottom 20%", scrub: 0.3 },
          });
        });
      }, el);
    })();

    return () => {
      disposed = true;
      io?.disconnect();
      ctx?.revert();
      html.classList.remove("scrollable");
      resetScroll();
    };
  }, []);

  return (
    <div ref={root} className={`mn mx ${hud ? "mn--hud" : ""}`}>
      <Stage />

      <header className="mn__top">
        <span className="mn-hl">FORMAS · 2000DVH</span>
        <span className="mn-hl mn-hl--alt">scroll</span>
      </header>

      <main className="mn__main">
        <section className="mx__chap" data-side={CHAPTERS[0].side}>
          <div className="mx__stick" data-reveal data-fx="glitch" style={{ "--dir": -1 } as React.CSSProperties}>
            <div className="mx__in">
              <p className="mn__kicker">
                <Glitch text="DEMO DE SCROLL · 8 GEOMETRÍAS" delay={200} />
              </p>
              <h1 className="mn__h1">
                <span className="mn-line">
                  <Glitch text="Un fondo que" className="mn-hl" delay={400} />
                </span>
                <span className="mn-line">
                  <Glitch text="se " className="mn-hl" delay={900} />
                  <Rotator words={["pixela", "rompe", "muta", "gira"]} />
                </span>
              </h1>
              <p className="mn__p mn-hl">
                <Glitch text={CHAPTERS[0].line} delay={1200} />
              </p>
              <span className="mn__cue">▼ scroll</span>
            </div>
          </div>
        </section>

        {CHAPTERS.slice(1).map((c, n) => (
          <Poster key={c.name} c={c} index={n + 1}>
            {n === N - 2 && (
              <a
                className="mn-btn"
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Glitch text="Volver arriba" delay={800} />
              </a>
            )}
          </Poster>
        ))}
      </main>
    </div>
  );
}
