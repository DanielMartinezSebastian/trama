/**
 * Campos de caracteres procedurales para el fondo de `AsciiCard`: ligeros (un canvas 2D con ~1.000 celdas, sin
 * motor externo) para poder tener varias tarjetas animadas en la misma página. Cada campo es una función
 * `(u, v, t, seed) → 0..1` que se traduce a un carácter de una rampa y a una opacidad; unos pocos (laberinto,
 * rejilla, binario) eligen el carácter directamente.
 */

export const CARD_FIELDS = [
  "plasma",
  "waves",
  "rings",
  "noise",
  "rain",
  "stars",
  "dither",
  "topo",
  "maze",
  "grid",
  "halftone",
  "vortex",
  "tunnel",
  "binary",
  "scan",
] as const;
export type CardField = (typeof CARD_FIELDS)[number];

/** Rampas de claro a denso. `glyph` usa el carácter de la tarjeta con distinta opacidad. */
export const CARD_CHARSETS = {
  detailed: " .:-=+*#%@",
  standard: " .:-=+*#",
  blocks: " ░▒▓█",
  braille: " ⠁⠃⠇⡇⡏⡟⡿⣿",
  dots: " .·•●",
  lines: " -=≡",
  binary: " 01",
  glyph: "",
} as const;
export type CardCharset = keyof typeof CARD_CHARSETS;

/** mut: discreto · accent: el acento · gradient: de --acc a --acc2 en diagonal · value: --mut en lo bajo, --acc en lo alto */
export type CardFieldColor = "mut" | "accent" | "gradient" | "value";
/** reacción al puntero: glow ilumina con el acento · ripple lanza ondas · repel aparta el campo · reveal solo muestra lo cercano */
export type CardFieldHover = "none" | "glow" | "ripple" | "repel" | "reveal";

export type FieldOptions = {
  field: CardField;
  charset: CardCharset;
  color: CardFieldColor;
  hover: CardFieldHover;
  /** tamaño de celda (alto de la fuente) en px */
  size: number;
  /** 0..1 */
  opacity: number;
  seed: number;
  glyph: string;
  colors: { mut: string; acc: string; acc2: string };
};

const fract = (x: number) => x - Math.floor(x);
const hash = (x: number, y: number, s = 0) => fract(Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453);
const smooth = (k: number) => k * k * (3 - 2 * k);
function vnoise(x: number, y: number, s: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smooth(x - xi), yf = smooth(y - yi);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}
const fbm = (x: number, y: number, s: number) => vnoise(x, y, s) * 0.55 + vnoise(x * 2.1, y * 2.1, s + 3) * 0.3 + vnoise(x * 4.3, y * 4.3, s + 7) * 0.15;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((n) => (n + 0.5) / 16);

/** Valor 0..1 del campo en (u, v) normalizados, con columna/fila de celda para los que trabajan por celda. */
function sample(field: CardField, u: number, v: number, t: number, s: number, col: number, row: number, aspect: number): number {
  const x = u * aspect;
  switch (field) {
    case "plasma": {
      const d = Math.hypot(x - aspect / 2, v - 0.5);
      return 0.5 + 0.125 * (Math.sin(x * 6 + t + s) + Math.sin(v * 5 - t * 0.7) + Math.sin((x + v) * 4 + t * 0.5) + Math.sin(d * 9 - t));
    }
    case "waves":
      return 0.5 + 0.5 * Math.sin(v * 16 + Math.sin(x * 3.5 + t * 0.8 + s) * 1.8 - t * 1.2);
    case "rings": {
      const cx = 0.15 + hash(s, 1) * 0.7 * aspect, cy = 0.15 + hash(s, 2) * 0.7;
      return 0.5 + 0.5 * Math.sin(Math.hypot(x - cx, v - cy) * 30 - t * 2.2);
    }
    case "noise":
      return fbm(x * 3 + t * 0.15, v * 3 - t * 0.1, s);
    case "rain": {
      const speed = 0.25 + hash(col, 3, s) * 0.6;
      const head = fract(hash(col, 5, s) + t * speed * 0.35);
      const dist = fract(head - v);
      return dist < 0.35 ? Math.pow(1 - dist / 0.35, 2) : 0;
    }
    case "stars": {
      const h = hash(col, row, s);
      return h > 0.9 ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (1 + h * 4) + h * 40)) : 0;
    }
    case "dither": {
      const g = 0.5 + 0.35 * Math.sin(x * 2.2 + v * 1.4 + t * 0.4 + s) + 0.15 * Math.sin(v * 5 - t * 0.3);
      return g > BAYER[(row % 4) * 4 + (col % 4)] ? 1 : 0.08;
    }
    case "topo": {
      // curvas de nivel: el ruido a baja frecuencia, cortado en 6 cotas; la línea es la franja cercana a cada cota
      const n = vnoise(x * 1.3 + s, v * 1.3 + t * 0.04, s) * 0.7 + vnoise(x * 2.6, v * 2.6, s + 5) * 0.3;
      const f = fract(n * 6);
      const line = Math.min(f, 1 - f);
      return line < 0.14 ? 1 - line / 0.14 : 0.04;
    }
    case "halftone": {
      const d = Math.hypot(x - aspect * (0.5 + 0.3 * Math.sin(t * 0.3 + s)), v - 0.5);
      return Math.max(0, 1 - d * 1.4);
    }
    case "vortex": {
      const dx = x - aspect / 2, dy = v - 0.5;
      const a = Math.atan2(dy, dx), d = Math.hypot(dx, dy);
      return 0.5 + 0.5 * Math.sin(a * 3 + d * 18 - t * 1.6 + s);
    }
    case "tunnel": {
      const dx = x - aspect / 2, dy = v - 0.5;
      const a = Math.atan2(dy, dx) / Math.PI, d = 0.3 / (Math.hypot(dx, dy) + 0.05);
      const c = (Math.floor(a * 6 + t * 0.2) + Math.floor(d * 3 + t)) & 1;
      return c ? Math.min(1, 0.25 + Math.hypot(dx, dy) * 1.6) : 0.05;
    }
    case "scan": {
      // líneas de barrido alternas y una banda brillante que baja por la tarjeta
      const band = fract(v - t * 0.22 + s * 0.1);
      const glow = band > 0.78 ? Math.pow((band - 0.78) / 0.22, 1.5) : 0;
      return Math.max(row % 2 ? 0.3 : 0.1, glow);
    }
    case "binary":
    case "maze":
    case "grid":
      return fbm(x * 2 + t * 0.1, v * 2, s);
  }
}

/** Carácter para los campos que no usan rampa. */
function directChar(field: CardField, col: number, row: number, t: number, s: number, value: number): string | null {
  if (field === "maze") return hash(col, row, s) > 0.5 ? "╱" : "╲";
  if (field === "grid") {
    const gx = col % 6 === 0, gy = row % 4 === 0;
    return gx && gy ? "┼" : gx ? "│" : gy ? "─" : value > 0.62 ? "·" : " ";
  }
  if (field === "binary") return hash(col, row + Math.floor(t * (0.5 + hash(col, 9, s) * 2)), s) > 0.5 ? "1" : "0";
  return null;
}

/** Color CSS → [r, g, b] usando el propio canvas para normalizar (acepta hex, rgb(), nombres…). */
function rgbOf(ctx: CanvasRenderingContext2D, color: string): [number, number, number] {
  ctx.fillStyle = "#000";
  ctx.fillStyle = color;
  const n = String(ctx.fillStyle);
  if (n.startsWith("#")) return [parseInt(n.slice(1, 3), 16), parseInt(n.slice(3, 5), 16), parseInt(n.slice(5, 7), 16)];
  const m = n.match(/[\d.]+/g) ?? ["0", "0", "0"];
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}
const mix = (a: [number, number, number], b: [number, number, number], k: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)})`;

/**
 * Pinta el campo en el canvas. `pointer` (0..1 del tamaño de la tarjeta) y `intensity` (0..1) controlan la reacción
 * al puntero; `t` en segundos.
 */
export function drawCardField(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, o: FieldOptions, pointer: { x: number; y: number; intensity: number }) {
  ctx.clearRect(0, 0, w, h);
  const ch = Math.max(6, o.size);
  const cw = ch * 0.62;
  const cols = Math.ceil(w / cw);
  const rows = Math.ceil(h / ch);
  const aspect = w / Math.max(1, h);
  const ramp = o.charset === "glyph" ? ` ${(o.glyph || "#")[0]}` : CARD_CHARSETS[o.charset];
  const hv = pointer.intensity;
  // degradado --acc → --acc2 en 8 pasos precalculados (un fillStyle por celda sería caro de parsear)
  const A = rgbOf(ctx, o.colors.acc), B = rgbOf(ctx, o.colors.acc2);
  const steps = Array.from({ length: 8 }, (_, i) => mix(A, B, i / 7));
  ctx.font = `${ch}px ui-monospace, Consolas, monospace`;
  ctx.textBaseline = "top";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let u = (c + 0.5) / cols;
      let v = (r + 0.5) / rows;
      // distancia al puntero en unidades de altura
      const dx = (u - pointer.x) * aspect, dy = v - pointer.y;
      const d = Math.hypot(dx, dy);
      const near = hv > 0 ? Math.max(0, 1 - d / 0.35) * hv : 0;
      if (o.hover === "repel" && near > 0) {
        u += (dx / (d + 1e-3)) * near * 0.08 / aspect;
        v += (dy / (d + 1e-3)) * near * 0.08;
      }
      let val = sample(o.field, u, v, t, o.seed, c, r, aspect);
      if (o.hover === "ripple" && hv > 0) val = Math.min(1, val + Math.max(0, Math.sin(d * 40 - t * 8)) * Math.max(0, 1 - d / 0.6) * hv * 0.8);
      if (o.hover === "glow") val = Math.min(1, val + near * 0.8);
      if (o.hover === "reveal") val *= Math.min(1, 0.08 + near * 1.4);
      if (val <= 0.02) continue;

      const direct = directChar(o.field, c, r, t, o.seed, val);
      const char = direct ?? ramp[Math.min(ramp.length - 1, Math.max(1, Math.round(val * (ramp.length - 1))))];
      if (!char || char === " ") continue;

      const color =
        near > 0.25 && o.hover !== "none" && o.hover !== "reveal"
          ? o.colors.acc
          : o.color === "accent"
            ? o.colors.acc
            : o.color === "gradient"
              ? steps[Math.min(7, Math.max(0, Math.round(((u + v) / 2) * 7)))]
              : o.color === "value"
                ? val > 0.6 ? o.colors.acc : o.colors.mut
                : o.colors.mut;
      ctx.fillStyle = color;
      ctx.globalAlpha = o.opacity * (direct ? 0.35 + 0.65 * val : 0.3 + 0.7 * val);
      ctx.fillText(char, c * cw, r * ch);
    }
  }
  ctx.globalAlpha = 1;
}

/** Campos que cambian con el tiempo (los demás solo se repintan al mover el puntero o al cambiar de tema). */
export const ANIMATED_FIELDS: ReadonlySet<CardField> = new Set(["plasma", "waves", "rings", "noise", "rain", "stars", "dither", "topo", "halftone", "vortex", "tunnel", "binary", "scan"]);
