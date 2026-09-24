/**
 * Motor de dibujo de los efectos de aparición/desaparición en canvas. Son funciones puras de
 * (progreso, opciones): el componente decide cuándo llamarlas y en qué sentido animar el progreso.
 */

export const CHARSETS = {
  symbols: "!<>-_\\/[]{}=+*^?#",
  binary: "01",
  hex: "0123456789ABCDEF",
  code: "{}[]()<>;:=+-*/\\|&%$#@~^",
  blocks: "░▒▓█",
  dots: ".:;·+*",
} as const;
export type CharsetId = keyof typeof CHARSETS;

export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export type AsciiPattern = "random" | "sweep" | "rain" | "radial" | "rows";

/** Umbral de cobertura 0..1 de una celda según el patrón: la celda se descubre cuando k lo supera. */
function threshold(p: AsciiPattern, cx: number, cy: number, cols: number, rows: number, seed: number) {
  const j = hash(seed + cx * 31 + cy * 17);
  switch (p) {
    case "sweep":
      return (cx / Math.max(1, cols - 1)) * 0.8 + j * 0.2;
    case "rows":
      return (cy / Math.max(1, rows - 1)) * 0.8 + j * 0.2;
    case "radial": {
      const dx = (cx - cols / 2) / (cols / 2);
      const dy = (cy - rows / 2) / (rows / 2);
      return clamp01(Math.hypot(dx, dy) / 1.42) * 0.8 + j * 0.2;
    }
    case "rain": {
      // cada columna arranca en un momento distinto y se descubre de arriba abajo
      const delay = hash(seed + cx * 7.7) * 0.5;
      return delay + (cy / Math.max(1, rows - 1)) * 0.45 + j * 0.05;
    }
    default:
      return j;
  }
}

export type CoverOptions = {
  pattern: AsciiPattern;
  cell: number;
  chars: string;
  bg: string;
  c1: string;
  c2: string;
  time: number;
  seed: number;
  /** deja un rastro tenue tras el borde de descubrimiento */
  edge: boolean;
};

/** Capa de celdas opacas con glifos. `k` = 0 cubre todo; `k` = 1 lo descubre por completo. */
export function drawAsciiCover(ctx: CanvasRenderingContext2D, w: number, h: number, k: number, o: CoverOptions) {
  ctx.clearRect(0, 0, w, h);
  if (k >= 1) return;
  const cell = o.cell;
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  ctx.font = `${Math.max(8, cell - 3)}px monospace`;
  ctx.textBaseline = "top";
  const chars = o.chars || "#";
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const thr = threshold(o.pattern, cx, cy, cols, rows, o.seed) * 0.88 + 0.06;
      const x = cx * cell;
      const y = cy * cell;
      if (k < thr) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = o.bg;
        ctx.fillRect(x, y, cell, cell);
        const lead = thr - k < 0.07;
        ctx.fillStyle = lead ? o.c2 : o.c1;
        ctx.globalAlpha = lead ? 1 : 0.35 + 0.65 * hash(o.seed + cx * 3 + cy * 5 + Math.floor(o.time * 6));
        ctx.fillText(chars[Math.floor(hash(cx * 13 + cy * 7 + Math.floor(o.time * 14)) * chars.length)] ?? "#", x + 2, y + 1);
      } else if (o.edge && k - thr < 0.06) {
        ctx.globalAlpha = 0.5 * (1 - (k - thr) / 0.06);
        ctx.fillStyle = o.c2;
        ctx.fillText(chars[Math.floor(hash(cx * 5 + cy * 11) * chars.length)] ?? "#", x + 2, y + 1);
      }
    }
  }
  ctx.globalAlpha = 1;
}

let noiseCv: HTMLCanvasElement | null = null;

/** Ruido de televisión. `amount` 0..1 = opacidad de la capa; se dibuja a baja resolución y se amplía. */
export function drawStatic(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number, tint: string) {
  ctx.clearRect(0, 0, w, h);
  if (amount <= 0.01) return;
  const nw = Math.max(8, Math.ceil(w / 3));
  const nh = Math.max(8, Math.ceil(h / 3));
  noiseCv ??= document.createElement("canvas");
  noiseCv.width = nw;
  noiseCv.height = nh;
  const nctx = noiseCv.getContext("2d")!;
  const img = nctx.createImageData(nw, nh);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  nctx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = clamp01(amount);
  ctx.drawImage(noiseCv, 0, 0, w, h);
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

/** Barras de "documento censurado" que se retiran (o vuelven) fila a fila. `k` = 0 cubre todo. */
export function drawRedact(ctx: CanvasRenderingContext2D, w: number, h: number, k: number, o: { rowH: number; color: string; textColor: string; seed: number; label: string }) {
  ctx.clearRect(0, 0, w, h);
  if (k >= 1) return;
  const rows = Math.ceil(h / o.rowH);
  ctx.font = `700 ${Math.max(9, o.rowH * 0.5)}px monospace`;
  ctx.textBaseline = "middle";
  for (let r = 0; r < rows; r++) {
    const t = (r / rows) * 0.6 + hash(o.seed + r) * 0.35;
    const p = clamp01((k - t) / 0.25);
    const bw = w * (1 - p);
    if (bw < 1) continue;
    const y = r * o.rowH;
    ctx.fillStyle = o.color;
    ctx.fillRect(w - bw, y + 1, bw, o.rowH - 2);
    if (bw > 90 && o.label) {
      ctx.fillStyle = o.textColor;
      ctx.globalAlpha = 0.85;
      ctx.fillText(o.label, w - bw + 8, y + o.rowH / 2);
      ctx.globalAlpha = 1;
    }
  }
}

/** Bloques y desgarros de corrupción para el glitch profundo. `amp` 0..1; `step` cambia el patrón. */
export function drawCorruption(ctx: CanvasRenderingContext2D, w: number, h: number, amp: number, step: number, c1: string, c2: string) {
  ctx.clearRect(0, 0, w, h);
  if (amp < 0.03) return;
  const n = Math.floor(amp * 12) + 1;
  ctx.font = "10px monospace";
  ctx.textBaseline = "top";
  for (let i = 0; i < n; i++) {
    const s = step * 31 + i * 7;
    const x = hash(s) * w;
    const y = hash(s + 1) * h;
    const bw = w * (0.05 + hash(s + 2) * 0.5);
    const bh = 3 + hash(s + 3) * 22;
    ctx.globalAlpha = 0.18 + amp * 0.35;
    ctx.fillStyle = hash(s + 4) > 0.5 ? c1 : c2;
    ctx.fillRect(x - bw / 2, y, bw, bh);
    if (hash(s + 5) > 0.55) {
      ctx.globalAlpha = Math.min(1, amp + 0.2);
      ctx.fillStyle = hash(s + 6) > 0.5 ? c1 : c2;
      let line = "";
      for (let k = 0; k < 14; k++) line += CHARSETS.hex[Math.floor(hash(s + 10 + k) * 16)];
      ctx.fillText(line, x - bw / 2 + 2, y + 2);
    }
    // desgarro fino
    if (hash(s + 8) > 0.6) {
      ctx.globalAlpha = 0.5 * amp;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, hash(s + 9) * h, w, 1);
    }
  }
  ctx.globalAlpha = 1;
}
