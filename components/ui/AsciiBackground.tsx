"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { painters, type Painter, type Progress, type SourceKind } from "@/lib/asciify/painters";
import { createPointerTracker } from "@/lib/asciify/pointer";
import type { StudioInput } from "asciify-engine/studio";

/** Escenas disponibles. `progress: true` = la escena cambia con la prop `progress`. */
export const ASCII_SCENES: { id: SourceKind; label: string; progress?: boolean }[] = [
  { id: "lava", label: "Lava" },
  { id: "waves", label: "Olas de color" },
  { id: "plasma", label: "Plasma" },
  { id: "synthwave", label: "Synthwave" },
  { id: "galaxy", label: "Galaxia" },
  { id: "rings", label: "Anillos" },
  { id: "kaleido", label: "Caleidoscopio" },
  { id: "torus", label: "Toro" },
  { id: "cube", label: "Cubo" },
  { id: "pyramid", label: "Pirámide" },
  { id: "sphere", label: "Esfera" },
  { id: "cylinder", label: "Cilindro" },
  { id: "cone", label: "Cono" },
  { id: "octahedron", label: "Octaedro" },
  { id: "tetrahedron", label: "Tetraedro" },
  { id: "icosahedron", label: "Icosaedro" },
  { id: "hexprism", label: "Prisma hexagonal" },
  { id: "diamond", label: "Diamante" },
  { id: "torusknot", label: "Nudo toroidal" },
  { id: "orbs", label: "Orbes" },
  { id: "tide", label: "Surf (amanecer→noche)", progress: true },
  { id: "wave", label: "Ola de surf (mar→serie grande)", progress: true },
  { id: "brew", label: "Café (grano→taza)", progress: true },
  { id: "bloom", label: "Plantas (brote→flor)", progress: true },
  { id: "arcade", label: "Arcade (bloques→coin)", progress: true },
];

export const ASCII_STYLES = ["ascii", "braille", "dots", "lines", "blocks", "cross", "diagonal", "diamond", "mixed", "pixel", "mosaic", "lego", "voxel", "disco", "dither"] as const;

export const ASCII_CHARSETS = {
  detailed: " .,:;i1tfLCG08@",
  standard: " .:-=+*#%@",
  blocks: " ░▒▓█",
  braille: " ⠁⠃⠇⡇⣇⣧⣷⣿",
  technical: " .:;>_/[{}]=+*#@$",
} as const;

/** original = colores de la escena · tint = tiñe con --acc · duotone = --bg/--acc · gradient = --bg/--acc→--acc2 */
export type Palette = "original" | "tint" | "duotone" | "gradient";

export type AsciiBackgroundProps = {
  scene?: SourceKind;
  /** estilo de render ASCII (no confundir con el `style` CSS de React) */
  asciiStyle?: (typeof ASCII_STYLES)[number];
  /** @deprecated usa `asciiStyle` */
  style?: (typeof ASCII_STYLES)[number];
  /** tamaño de celda en px (más pequeño = más detalle y más coste) */
  cellSize?: number;
  colorMode?: "source" | "accent" | "gray";
  charset?: keyof typeof ASCII_CHARSETS;
  /** cómo se reinterpretan los colores con los tokens del tema */
  palette?: Palette;
  /** 0–1: fuerza de la paleta */
  tintAmount?: number;
  /** efecto de hover del motor Studio (mismo nombre que en VideoPlayer) */
  asciiHover?: "none" | "trail" | "water" | "contour" | "dissolve" | "silk" | "vortex";
  /** @deprecated usa `asciiHover` */
  hover?: "none" | "trail" | "water" | "contour" | "dissolve" | "silk" | "vortex";
  hoverStrength?: number;
  hoverRadius?: number;
  bloom?: number;
  scanlines?: number;
  vignette?: number;
  grain?: number;
  glitch?: number;
  /** multiplicador de velocidad de la escena */
  speed?: number;
  /** máximo de fotogramas por segundo */
  fps?: number;
  opacity?: number;
  /** 0–1; solo lo usan las escenas con `progress: true` */
  progress?: number;
  className?: string;
};

type Live = Required<Omit<AsciiBackgroundProps, "asciiStyle" | "asciiHover" | "className" | "progress" | "scene" | "palette" | "tintAmount" | "speed" | "fps" | "opacity">>;

function toSettings(p: Live, accent: string): StudioInput {
  return {
    style: p.style,
    cellSize: p.cellSize,
    colorMode: p.colorMode,
    ink: accent,
    charset: ASCII_CHARSETS[p.charset],
    effects: { bloom: p.bloom, scanlines: p.scanlines, vignette: p.vignette, grain: p.grain, glitch: p.glitch },
    hover: { effect: p.hover, strength: p.hoverStrength, radius: p.hoverRadius },
  };
}

/**
 * Fondo de caracteres generado con asciify-engine Studio a partir de una escena procedural.
 * Rellena su contenedor (que debe tener `position: relative` y tamaño) y reacciona al puntero.
 * Los cambios de props se aplican en caliente, sin remontar. La prop `palette` reinterpreta los
 * colores con los tokens del tema (CSS), así que responde al cambio de tema sin coste.
 */
export default function AsciiBackground({
  scene = "lava",
  asciiStyle, style: legacyStyle,
  cellSize = 8,
  colorMode = "source",
  charset = "detailed",
  palette = "tint",
  tintAmount = 0.6,
  asciiHover, hover: legacyHover,
  hoverStrength = 0.7,
  hoverRadius = 0.28,
  bloom = 0.2,
  scanlines = 0,
  vignette = 0.3,
  grain = 0,
  glitch = 0,
  speed = 1,
  fps = 60,
  opacity = 1,
  progress,
  className = "",
}: AsciiBackgroundProps) {
  const hover = asciiHover ?? legacyHover ?? "water";
  const style = asciiStyle ?? legacyStyle ?? "ascii";
  const host = useRef<HTMLDivElement>(null);
  const paint = useRef<Painter | null>(null);
  const player = useRef<{ update: (p: StudioInput) => void } | null>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const latest = useRef<Live>({ style, cellSize, colorMode, charset, hover, hoverStrength, hoverRadius, bloom, scanlines, vignette, grain, glitch });
  latest.current = { style, cellSize, colorMode, charset, hover, hoverStrength, hoverRadius, bloom, scanlines, vignette, grain, glitch };
  const fpsRef = useRef(fps);
  fpsRef.current = fps;

  // La escena se cambia sin remontar el motor
  useEffect(() => {
    paint.current = painters[scene]();
  }, [scene]);

  // Ajustes en caliente
  useEffect(() => {
    const accent = host.current ? getComputedStyle(host.current).getPropertyValue("--acc").trim() || "#7cc4ff" : "#7cc4ff";
    player.current?.update(toSettings(latest.current, accent));
  }, [style, cellSize, colorMode, charset, hover, hoverStrength, hoverRadius, bloom, scanlines, vignette, grain, glitch]);

  // Progreso propio de esta instancia para las escenas temáticas: se pasa al painter en cada fotograma,
  // así dos fondos en la misma página no se pisan. Sin `progress`, la escena lee el `scrollState` global
  // (el de las demos de scroll), que es el comportamiento de siempre.
  const progressRef = useRef<Progress | undefined>(undefined);
  progressRef.current = progress === undefined ? undefined : { p: progress, v: 0 };

  // Montaje único
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    const cleanups: Array<() => void> = [];
    const canvas = document.createElement("canvas");
    canvas.className = "ui-fill-canvas";
    el.appendChild(canvas);
    cleanups.push(() => canvas.remove());

    const src = document.createElement("canvas");
    const sctx = src.getContext("2d")!;
    const tracker = createPointerTracker(canvas);
    cleanups.push(() => tracker.destroy());
    paint.current ??= painters[scene]();

    let started = false;
    let lastFrame = 0;
    const fit = (w: number, h: number) => {
      src.width = 480;
      src.height = Math.max(2, Math.round((480 * h) / w));
    };

    const start = async (w: number, h: number) => {
      started = true;
      const { mountStudioMedia, normalizeStudioSettings } = await import("asciify-engine/studio");
      if (disposed) return;
      fit(w, h);
      const media = {
        source: src,
        width: src.width,
        height: src.height,
        duration: 0,
        animated: true,
        seek: async () => {},
        frame: (time: number) => {
          // Límite de fps: si es pronto, se reutiliza el fotograma anterior
          if (fpsRef.current < 60 && time - lastFrame < 1 / fpsRef.current) return src;
          lastFrame = time;
          tracker.update(time);
          paint.current?.(sctx, src.width, src.height, time * speedRef.current, tracker.pointer, progressRef.current);
          return src;
        },
        destroy: () => {},
      };
      const accent = getComputedStyle(el).getPropertyValue("--acc").trim() || "#7cc4ff";
      const p = mountStudioMedia(canvas, media, {
        settings: normalizeStudioSettings(toSettings(latest.current, accent)),
        width: w,
        height: h,
        fps: 60,
        onError: (e) => console.error("[AsciiBackground]", e),
      });
      p.resize(w, h, Math.min(window.devicePixelRatio || 1, 2));
      player.current = p;
      cleanups.push(() => {
        player.current = null;
        p.destroy();
      });
    };

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width < 4 || height < 4) return;
      if (!started) void start(Math.round(width), Math.round(height));
      else if (player.current) {
        fit(width, height);
        (player.current as unknown as { resize: (w: number, h: number, r?: number) => void }).resize(
          Math.round(width),
          Math.round(height),
          Math.min(window.devicePixelRatio || 1, 2),
        );
      }
    });
    ro.observe(el);
    cleanups.push(() => ro.disconnect());

    return () => {
      disposed = true;
      cleanups.reverse().forEach((f) => {
        try {
          f();
        } catch {
          /* ya liberado */
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`ui-fill ui-pal ui-pal--${palette} ${className}`} style={{ "--tint": tintAmount, "--op": opacity } as CSSProperties} aria-hidden>
      <div ref={host} className="ui-fill__media" />
      <i className="ui-pal__a" />
      <i className="ui-pal__b" />
    </div>
  );
}
