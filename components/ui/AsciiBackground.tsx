"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { painters, type Painter, type Progress, type SourceKind } from "@/lib/asciify/painters";
import { createPointerTracker } from "@/lib/asciify/pointer";
import { ENGINE_MAX_DIMENSION, planResolution, type ResolutionInfo, type ResolutionPlan } from "@/lib/asciify/resolution";
import { bridgePointer, type BackgroundInteraction, type BackgroundPosition } from "@/lib/ui/pointerBridge";
import type { StudioInput } from "asciify-engine/studio";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

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
  /**
   * Tamaño de celda en px CSS (más pequeño = más detalle y más coste). Admite decimales y valores por debajo del mínimo del
   * motor (3 px; 1 px con dither): el componente sobremuestrea para que la celda sea la pedida. El límite real lo pone el tope de
   * celdas del motor (160 000): la celda mínima posible es √(ancho·alto / 160 000) px — unos 3 px a pantalla completa, 1 px en
   * un elemento de 400×400. Por debajo de 0,1 se ignora.
   */
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
  /** fotogramas por segundo de la escena (1–60): con pocos se ve «a saltos» y cuesta menos; el hover del motor sigue a 60 */
  fps?: number;
  opacity?: number;
  /** 0–1; solo lo usan las escenas con `progress: true` */
  progress?: number;
  /**
   * absolute (por defecto) = rellena su contenedor, que debe tener `position: relative` y tamaño · fixed = cubre la ventana entera
   * y se queda quieto al hacer scroll: el fondo de una página larga. Con `fixed`, pon el contenido encima con
   * `position: relative` (y `z-index: 10` si hace falta) y sin fondo opaco.
   */
  position?: BackgroundPosition;
  /**
   * canvas = el lienzo recibe el puntero él mismo: solo reacciona si nada se le pone encima · window = escucha el puntero en
   * toda la ventana y se lo reenvía al lienzo, así reacciona aunque haya contenido encima y nunca bloquea clics ni hover del
   * contenido. Por defecto `window` con `position="fixed"` y `canvas` en el resto.
   */
  interaction?: BackgroundInteraction;
  /**
   * Máximo de celdas de la rejilla (el motor admite hasta 160 000). Por defecto se calcula solo: lo justo para que quepa la
   * celda pedida (12 000 como mínimo). Ponlo para acotar el coste.
   */
  maxCells?: number;
  /** El motor baja la resolución solo si los fotogramas tardan demasiado (por defecto sí). Solo se lee al montar. */
  adaptive?: boolean;
  /** Se llama con la celda pedida y la que se dibuja de verdad cada vez que cambia (útil para vistas previas y depuración). */
  onResolution?: (info: ResolutionInfo) => void;
  className?: string;
};

type Live = Required<Omit<AsciiBackgroundProps, "asciiStyle" | "asciiHover" | "className" | "position" | "interaction" | "maxCells" | "adaptive" | "onResolution" | "progress" | "scene" | "palette" | "tintAmount" | "speed" | "fps" | "opacity">>;

function toSettings(p: Live, accent: string, plan: ResolutionPlan): StudioInput {
  return {
    style: p.style,
    // Con dither manda `dither.scale` (entero) y cellSize no se lee; el plan da el valor válido para cada estilo
    cellSize: plan.unit,
    ...(p.style === "dither" ? { dither: { scale: plan.unit } } : {}),
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
  position = "absolute",
  interaction,
  maxCells,
  adaptive = true,
  onResolution,
  className = "",
}: AsciiBackgroundProps) {
  const passive = (interaction ?? (position === "fixed" ? "window" : "canvas")) === "window";
  const hover = asciiHover ?? legacyHover ?? "water";
  const style = asciiStyle ?? legacyStyle ?? "ascii";
  const host = useRef<HTMLDivElement>(null);
  const paint = useRef<Painter | null>(null);
  const latest = useRef<Live>({ style, cellSize, colorMode, charset, hover, hoverStrength, hoverRadius, bloom, scanlines, vignette, grain, glitch });
  latest.current = { style, cellSize, colorMode, charset, hover, hoverStrength, hoverRadius, bloom, scanlines, vignette, grain, glitch };
  type Player = { update: (p: StudioInput) => void; resize: (w: number, h: number, r?: number) => void; setBudget: (cells: number) => void };
  const player = useRef<Player | null>(null);
  const size = useRef({ w: 0, h: 0 });
  const maxCellsRef = useRef(maxCells);
  maxCellsRef.current = maxCells;
  const onResRef = useRef(onResolution);
  onResRef.current = onResolution;
  const engine = useRef<typeof import("asciify-engine/studio") | null>(null);
  const plan = useRef<ResolutionPlan | null>(null);
  const fitSrc = useRef<((srcWidth: number) => void) | null>(null);
  const dprOf = () => Math.min(window.devicePixelRatio || 1, 2);

  /** Recalcula el plan con el tamaño y los ajustes vigentes, y lo aplica al lienzo fuente. */
  const replan = () => {
    const { w, h } = size.current;
    const l = latest.current;
    const p = planResolution(w, h, l.cellSize, l.style, maxCellsRef.current);
    plan.current = p;
    fitSrc.current?.(p.srcWidth);
    return p;
  };

  /** Avisa a quien lo pida de la celda real: la rejilla que sale con estos límites, la misma cuenta que hace el motor. */
  const report = (p: ResolutionPlan, budget = p.maxCells, degraded = false) => {
    const cb = onResRef.current;
    const eng = engine.current;
    if (!cb || !eng) return;
    const dpr = dprOf();
    const accent = host.current ? getComputedStyle(host.current).getPropertyValue("--acc").trim() || "#7cc4ff" : "#7cc4ff";
    const st = eng.normalizeStudioSettings(toSettings(latest.current, accent, p));
    // El motor recorta el lienzo a maxDimension antes de calcular la rejilla
    const k = Math.min(1, ENGINE_MAX_DIMENSION / Math.max(p.width * dpr, p.height * dpr));
    const g = eng.studioGrid(Math.max(2, Math.round(p.width * dpr * k)), Math.max(2, Math.round(p.height * dpr * k)), st, budget, dpr);
    cb({ requested: p.requested, effective: g.cell / (dpr * p.s * k), columns: g.columns, rows: g.rows, limited: g.limited || k < 1, maxCells: budget, degraded });
  };
  // con «reducir movimiento» la escena sigue viva pero casi quieta: un quinto de velocidad y como mucho 12 fps
  const reduced = useReducedMotion();
  const speedRef = useRef(speed);
  speedRef.current = reduced ? speed * 0.2 : speed;
  const fpsRef = useRef(fps);
  fpsRef.current = reduced ? Math.min(fps, 12) : fps;

  // La escena se cambia sin remontar el motor
  useEffect(() => {
    paint.current = painters[scene]();
  }, [scene]);

  // Ajustes en caliente
  useEffect(() => {
    const pl = player.current;
    if (!pl || !size.current.w) return;
    const accent = host.current ? getComputedStyle(host.current).getPropertyValue("--acc").trim() || "#7cc4ff" : "#7cc4ff";
    const p = replan();
    pl.update(toSettings(latest.current, accent, p));
    pl.resize(p.width, p.height, dprOf());
    pl.setBudget(p.maxCells);
    report(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style, cellSize, maxCells, colorMode, charset, hover, hoverStrength, hoverRadius, bloom, scanlines, vignette, grain, glitch]);

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
    // Lienzo fuente en el que dibujan las escenas: más ancho cuanto más fina es la celda, para que el detalle llegue
    const fit = (srcWidth: number) => {
      const { w, h } = size.current;
      src.width = srcWidth;
      src.height = Math.max(2, Math.round((srcWidth * h) / Math.max(1, w)));
    };
    fitSrc.current = fit;
    cleanups.push(() => (fitSrc.current = null));

    const start = async (w: number, h: number) => {
      started = true;
      const eng = await import("asciify-engine/studio");
      const { mountStudioMedia, normalizeStudioSettings } = eng;
      if (disposed) return;
      engine.current = eng;
      size.current = { w, h };
      const first = replan();
      const media = {
        source: src,
        width: src.width,
        height: src.height,
        duration: 0,
        animated: true,
        seek: async () => {},
        frame: (time: number) => {
          // Límite de fps: si es pronto, se reutiliza el fotograma anterior
          if (fpsRef.current < 60 && time - lastFrame < 1 / Math.max(0.1, fpsRef.current)) return src;
          lastFrame = time;
          tracker.update(time);
          paint.current?.(sctx, src.width, src.height, time * speedRef.current, tracker.pointer, progressRef.current);
          return src;
        },
        destroy: () => {},
      };
      const accent = getComputedStyle(el).getPropertyValue("--acc").trim() || "#7cc4ff";
      const p = mountStudioMedia(canvas, media, {
        settings: normalizeStudioSettings(toSettings(latest.current, accent, first)),
        width: first.width,
        height: first.height,
        fps: 60,
        // Por defecto el motor recorta el lienzo a 960 px y la rejilla a 12 000 celdas, y agranda la celda sin avisar
        maxDimension: ENGINE_MAX_DIMENSION,
        maxCells: first.maxCells,
        adaptive,
        onQualityChange: (cells: number) => plan.current && report(plan.current, cells, true),
        onError: (e) => console.error("[AsciiBackground]", e),
      });
      p.resize(first.width, first.height, dprOf());
      report(first);
      player.current = p as unknown as Player;
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
        size.current = { w: Math.round(width), h: Math.round(height) };
        const p = replan();
        player.current.resize(p.width, p.height, dprOf());
        player.current.setBudget(p.maxCells);
        report(p);
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

  // Va DESPUÉS del montaje: el lienzo lo crea el efecto de montaje, y un efecto anterior no lo encontraría
  // Puntero desde la ventana: el motor y el rastreador de puntero escuchan su lienzo; se les reenvía lo que ocurre encima
  useEffect(() => {
    if (!passive) return;
    const canvas = host.current?.querySelector("canvas");
    return canvas ? bridgePointer(canvas) : undefined;
  }, [passive]);

  return (
    <div className={`ui-fill ui-pal ui-pal--${palette} ${position === "fixed" ? "ui-fill--fixed" : ""} ${passive ? "ui-fill--passive" : ""} ${className}`} style={{ "--tint": tintAmount, "--op": opacity } as CSSProperties} aria-hidden>
      <div ref={host} className="ui-fill__media" />
      <i className="ui-pal__a" />
      <i className="ui-pal__b" />
    </div>
  );
}
