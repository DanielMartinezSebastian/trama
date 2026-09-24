import type { AsciiOptions, HoverPreset } from "asciify-engine";
import type { StudioInput } from "asciify-engine/studio";
import type { ScrollState } from "@/lib/scroll/store";
import { smooth, span } from "@/lib/scroll/store";
import type { SourceKind } from "./painters";

const STYLES = ["ascii", "braille", "dots", "lines", "mosaic", "lego", "voxel", "disco", "dither"] as const;
const STYLE_CELL: Record<(typeof STYLES)[number], number> = {
  ascii: 8,
  braille: 6,
  dots: 9,
  lines: 10,
  mosaic: 14,
  lego: 16,
  voxel: 20,
  disco: 16,
  dither: 6,
};

/** Render con `asciify-engine/studio`: 15 estilos, hover de agua/vórtice… y acabado óptico. */
export type StudioDef = {
  engine: "studio";
  source: SourceKind;
  settings: StudioInput;
  /**
   * Demos con scroll: se llama en cada fotograma y devuelve el cambio de ajustes Studio
   * a aplicar (solo se aplica si cambia) y, opcionalmente, una etiqueta para la interfaz.
   */
  scroll?: (s: ScrollState) => { patch: StudioInput; label?: string };
};

/** Render con el motor clásico `asciify-engine/core` y sus efectos de hover. */
export type CoreDef = {
  engine: "core";
  source: SourceKind;
  fontSize: number;
  options: Partial<AsciiOptions>;
  preset: HoverPreset;
};

/** Cámara en directo convertida a ASCII (pide permiso al pulsar el botón). */
export type WebcamDef = {
  engine: "webcam";
  fontSize: number;
  options: Partial<AsciiOptions>;
};

/** Texto en mosaico con `renderTextBackground`: el efecto de hover se elige en la interfaz. */
export type TileDef = {
  engine: "tile";
  fontSize: number;
  color: string;
  hoverColor: string;
};

export type AsciifyDef = StudioDef | CoreDef | WebcamDef | TileDef;

const DETAILED = " .,:;i1tfLCG08@";

export const asciifyDefs: Record<string, AsciifyDef> = {
  "as-lava": {
    engine: "studio",
    source: "lava",
    settings: {
      style: "ascii",
      charset: DETAILED,
      cellSize: 7,
      colorMode: "source",
      effects: { characterBloom: 0.35 },
      hover: { effect: "water", strength: 0.75, radius: 0.28 },
    },
  },
  "as-synthwave": {
    engine: "studio",
    source: "synthwave",
    settings: {
      style: "dots",
      cellSize: 8,
      colorMode: "source",
      effects: { bloom: 0.35, scanlines: 0.25, vignette: 0.3 },
      hover: { effect: "none" },
    },
  },
  "as-galaxy": {
    engine: "studio",
    source: "galaxy",
    settings: {
      style: "braille",
      cellSize: 6,
      colorMode: "source",
      effects: { bloom: 0.25 },
      hover: { effect: "vortex", strength: 0.8, radius: 0.3 },
    },
  },
  "as-bricks": {
    engine: "studio",
    source: "waves",
    settings: {
      style: "lego",
      cellSize: 16,
      colorMode: "source",
      hover: { effect: "dissolve", strength: 0.7, radius: 0.25 },
    },
  },
  "as-voxel": {
    engine: "studio",
    source: "plasma",
    settings: {
      style: "voxel",
      cellSize: 20,
      colorMode: "source",
      hover: { effect: "contour", strength: 0.7, radius: 0.28 },
    },
  },
  "as-disco": {
    engine: "studio",
    source: "kaleido",
    settings: {
      style: "disco",
      cellSize: 16,
      colorMode: "source",
      lights: [{ x: 0.35, y: 0.25, radius: 0.3, intensity: 0.45, color: "#fff2d4" }],
      hover: { effect: "silk", strength: 0.7, radius: 0.3 },
    },
  },
  "as-dither": {
    engine: "studio",
    source: "rings",
    settings: {
      style: "dither",
      dither: { algorithm: "bayer4", palette: "gameboy", scale: 3, motion: "drift", speed: 0.6 },
      hover: { effect: "none" },
    },
  },
  "as-crt": {
    engine: "studio",
    source: "text",
    settings: {
      style: "ascii",
      charset: " .:;>_/[{}]=+*#@$",
      cellSize: 8,
      colorMode: "accent",
      ink: "#4dff88",
      effects: { crt: 0.35, scanlines: 0.4, bloom: 0.45, glitch: 0.15, grain: 0.15, vignette: 0.4 },
      hover: { effect: "none" },
    },
  },
  "as-mosaic": {
    engine: "studio",
    source: "torus",
    settings: {
      style: "mosaic",
      cellSize: 14,
      colorMode: "source",
      hover: { effect: "water", strength: 0.7, radius: 0.28 },
    },
  },
  "as-lines": {
    engine: "studio",
    source: "orbs",
    settings: {
      style: "lines",
      cellSize: 10,
      colorMode: "source",
      hover: { effect: "contour", strength: 0.7, radius: 0.28 },
    },
  },
  "as-spotlight": {
    engine: "core",
    source: "lava",
    fontSize: 9,
    options: { colorMode: "fullcolor", charset: DETAILED, brightness: 0.2 },
    preset: "flashlight",
  },
  "as-neon": {
    engine: "core",
    source: "rain",
    fontSize: 10,
    options: { colorMode: "matrix", brightness: 0.25, contrast: 0.3 },
    preset: "neon",
  },
  "as-shatter": {
    engine: "core",
    source: "rings",
    fontSize: 9,
    options: { colorMode: "fullcolor", renderMode: "dots", brightness: 0.25 },
    preset: "shatter",
  },
  "as-gravity": {
    engine: "core",
    source: "galaxy",
    fontSize: 9,
    options: { colorMode: "fullcolor", charset: DETAILED, brightness: 0.15 },
    preset: "gravity",
  },
  "as-webcam": {
    engine: "webcam",
    fontSize: 9,
    options: { colorMode: "fullcolor", charset: DETAILED },
  },
  // ---------- texto ----------
  "tx-tile": { engine: "tile", fontSize: 13, color: "#7a8299", hoverColor: "#d4ff00" },
  "tx-figlet": {
    engine: "studio",
    source: "figlet",
    settings: {
      style: "ascii",
      charset: " .:;>_/[{}]=+*#@$",
      cellSize: 6,
      colorMode: "accent",
      ink: "#8be9fd",
      effects: { bloom: 0.3, scanlines: 0.15 },
      hover: { effect: "water", strength: 0.7, radius: 0.25 },
    },
  },
  "tx-bricks": {
    engine: "studio",
    source: "bigtext",
    settings: {
      style: "lego",
      cellSize: 12,
      colorMode: "source",
      hover: { effect: "dissolve", strength: 0.75, radius: 0.25 },
    },
  },
  "tx-dither": {
    engine: "studio",
    source: "bigglow",
    settings: {
      style: "dither",
      dither: { algorithm: "bayer8", palette: "amber", scale: 3, motion: "drift", speed: 0.5 },
      hover: { effect: "none" },
    },
  },
  "tx-braille": {
    engine: "studio",
    source: "bigglow",
    settings: {
      style: "braille",
      cellSize: 5,
      colorMode: "accent",
      ink: "#9fe8ff",
      effects: { bloom: 0.4, vignette: 0.3 },
      hover: { effect: "vortex", strength: 0.8, radius: 0.3 },
    },
  },
  "tx-neon": {
    engine: "studio",
    source: "bigglow",
    settings: {
      style: "ascii",
      charset: " .:-=+*#%@",
      cellSize: 6,
      colorMode: "accent",
      ink: "#ff5ad1",
      effects: { bloom: 0.55, glitch: 0.12, scanlines: 0.2, crt: 0.15, vignette: 0.45, grain: 0.1 },
      hover: { effect: "trail", strength: 0.7, radius: 0.25 },
    },
  },
  // ---------- scroll ----------
  "sc-resolution": {
    engine: "studio",
    source: "synthwave",
    settings: { style: "ascii", charset: DETAILED, cellSize: 44, colorMode: "source", hover: { effect: "none" } },
    // La imagen se afina al bajar: de bloques enormes a caracteres finos y, al final, imagen limpia detrás
    scroll: (s) => {
      const k = smooth(span(s.p, 0, 0.85));
      const cell = Math.max(5, Math.round((44 - 39 * k) / 2) * 2);
      const clean = smooth(span(s.p, 0.72, 1));
      return {
        patch: {
          cellSize: cell,
          backdrop: { mode: "source", opacity: Math.round(clean * 20) / 20 },
        },
        label: `celda ${cell}px`,
      };
    },
  },
  "sc-morph": {
    engine: "studio",
    source: "lava",
    settings: { style: "ascii", charset: DETAILED, cellSize: 8, colorMode: "source", hover: { effect: "water", strength: 0.6, radius: 0.25 } },
    // Cada tramo del scroll cambia de estilo de render
    scroll: (s) => {
      const idx = Math.min(STYLES.length - 1, Math.floor(s.p * STYLES.length));
      const style = STYLES[idx];
      return {
        patch: {
          style,
          cellSize: STYLE_CELL[style],
          dither: { algorithm: "bayer4", palette: "pico8", scale: 3, motion: "drift", speed: 0.5 },
        },
        label: `estilo · ${style}`,
      };
    },
  },
  "sc-elastic": {
    engine: "studio",
    source: "elastic",
    settings: {
      style: "ascii",
      charset: DETAILED,
      cellSize: 7,
      colorMode: "source",
      effects: { characterBloom: 0.3 },
      hover: { effect: "trail", strength: 0.6, radius: 0.22 },
    },
  },
  // ---------- landings temáticas (el fondo cambia de escena con el scroll) ----------
  "th-tide": {
    engine: "studio",
    source: "tide",
    settings: { style: "dots", cellSize: 9, colorMode: "source", effects: { bloom: 0.3, vignette: 0.35 }, hover: { effect: "water", strength: 0.7, radius: 0.25 } },
    scroll: (s) => {
      const i = s.p < 0.33 ? 0 : s.p < 0.66 ? 1 : 2;
      return { patch: { style: (["dots", "ascii", "braille"] as const)[i], cellSize: [9, 8, 6][i], charset: DETAILED } };
    },
  },
  "th-brew": {
    engine: "studio",
    source: "brew",
    settings: { style: "mosaic", cellSize: 12, colorMode: "source", effects: { vignette: 0.45, grain: 0.12 }, hover: { effect: "contour", strength: 0.6, radius: 0.25 } },
    scroll: (s) => {
      const i = s.p < 0.33 ? 0 : s.p < 0.66 ? 1 : 2;
      return { patch: { style: (["mosaic", "ascii", "dots"] as const)[i], cellSize: [12, 7, 8][i], charset: DETAILED } };
    },
  },
  "th-bloom": {
    engine: "studio",
    source: "bloom",
    settings: { style: "braille", cellSize: 5, colorMode: "source", effects: { bloom: 0.25, vignette: 0.4 }, hover: { effect: "silk", strength: 0.6, radius: 0.28 } },
    scroll: (s) => {
      const i = s.p < 0.33 ? 0 : s.p < 0.66 ? 1 : 2;
      return { patch: { style: (["braille", "ascii", "dots"] as const)[i], cellSize: [5, 7, 9][i], charset: DETAILED } };
    },
  },
  "th-arcade": {
    engine: "studio",
    source: "arcade",
    settings: { style: "pixel", cellSize: 12, colorMode: "source", effects: { scanlines: 0.3, crt: 0.2, vignette: 0.35 }, hover: { effect: "none" } },
    scroll: (s) => {
      const i = s.p < 0.33 ? 0 : s.p < 0.66 ? 1 : 2;
      return { patch: { style: (["pixel", "lego", "dither"] as const)[i], cellSize: [12, 14, 6][i], dither: { algorithm: "bayer4", palette: "gameboy", scale: 3, motion: "none", speed: 1 } } };
    },
  },
  // Capa inferior del héroe combinado: la imagen se afina y cambia de estilo con el scroll
  "sc-combo": {
    engine: "studio",
    source: "synthwave",
    settings: { style: "blocks", cellSize: 30, colorMode: "source", color: { brightness: -0.15 }, effects: { vignette: 0.4 }, hover: { effect: "none" } },
    scroll: (s) => {
      const k = smooth(span(s.p, 0, 0.8));
      const cell = Math.max(6, Math.round((30 - 24 * k) / 2) * 2);
      const style = s.p < 0.34 ? "blocks" : s.p < 0.67 ? "ascii" : "dots";
      return { patch: { style, cellSize: cell, charset: DETAILED }, label: `${style} · celda ${cell}px` };
    },
  },
  // Capa inferior del combo (la superior es un sketch de textmode.js)
  "tx-combo-layers": {
    engine: "studio",
    source: "waves",
    settings: {
      style: "dots",
      cellSize: 9,
      colorMode: "source",
      color: { brightness: -0.3 },
      effects: { bloom: 0.25, vignette: 0.45 },
      hover: { effect: "none" },
    },
  },
};
