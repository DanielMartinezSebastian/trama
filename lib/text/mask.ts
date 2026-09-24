/** Utilidades para convertir texto en formas: ajuste de líneas y máscara por celdas. */

/** Divide el texto en `n` líneas equilibradas por palabras. */
function splitLines(words: string[], n: number): string[] {
  const total = words.join(" ").length;
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && next.length > total / n + 1 && lines.length < n - 1) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

export const BOLD_FONT = (size: number) => `900 ${size}px "Arial Black", Impact, system-ui, sans-serif`;

/**
 * Elige el reparto en líneas que permite el mayor tamaño de fuente dentro de w×h
 * y devuelve las líneas con ese tamaño.
 */
export function fitLines(ctx: CanvasRenderingContext2D, text: string, w: number, h: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return { lines: [" "], size: h * 0.5 };
  ctx.font = BOLD_FONT(100);
  let best = { lines: [text], size: 1 };
  for (let n = 1; n <= Math.min(4, words.length); n++) {
    const lines = splitLines(words, n);
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width)) / 100;
    const size = Math.min((w * 0.92) / widest, (h * 0.8) / (lines.length * 1.08));
    if (size > best.size) best = { lines, size };
  }
  return best;
}

/** Dibuja el texto centrado; devuelve el tamaño de fuente usado. */
export function drawFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  w: number,
  h: number,
  yOffset = 0,
) {
  const { lines, size } = fitLines(ctx, text, w, h);
  ctx.font = BOLD_FONT(size);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lh = size * 1.08;
  const top = h / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, i) => ctx.fillText(l, w / 2, top + i * lh + size * 0.04 + yOffset));
  return size;
}

export type TextMask = { key: string; cols: number; rows: number; data: Uint8ClampedArray };

let cached: TextMask | null = null;
let big: HTMLCanvasElement | null = null;
let small: HTMLCanvasElement | null = null;

/**
 * Máscara de cobertura (0..255) del texto sobre una rejilla cols×rows. `asp` es la
 * relación alto/ancho de una celda, para que las letras no salgan deformadas.
 */
export function getTextMask(text: string, cols: number, rows: number, asp = 1): TextMask {
  const key = `${text}|${cols}|${rows}|${asp.toFixed(2)}`;
  if (cached && cached.key === key) return cached;

  const S = 6;
  big ??= document.createElement("canvas");
  small ??= document.createElement("canvas");
  big.width = cols * S;
  big.height = Math.max(2, Math.round(rows * S * asp));
  const bctx = big.getContext("2d")!;
  bctx.fillStyle = "#000";
  bctx.fillRect(0, 0, big.width, big.height);
  bctx.fillStyle = "#fff";
  drawFittedText(bctx, text, big.width, big.height);

  small.width = cols;
  small.height = rows;
  const sctx = small.getContext("2d", { willReadFrequently: true })!;
  sctx.imageSmoothingEnabled = true;
  sctx.drawImage(big, 0, 0, cols, rows);
  const px = sctx.getImageData(0, 0, cols, rows).data;
  const data = new Uint8ClampedArray(cols * rows);
  for (let i = 0; i < data.length; i++) data[i] = px[i * 4];
  cached = { key, cols, rows, data };
  return cached;
}

export type FineMask = {
  key: string;
  cols: number;
  rows: number;
  /** supermuestreo: celdas de máscara por celda de pantalla */
  ss: number;
  w: number;
  h: number;
  data: Uint8ClampedArray;
  /** punto interior de una letra cerca del centro (en celdas de máscara, no finas) */
  focus: { x: number; y: number };
};

let fineCached: FineMask | null = null;
let fineBig: HTMLCanvasElement | null = null;
let fineSmall: HTMLCanvasElement | null = null;

/** Máscara con supermuestreo, para hacer zoom sobre el texto sin que se vea a bloques. */
export function getFineMask(text: string, cols: number, rows: number, asp = 1, ss = 3): FineMask {
  const key = `${text}|${cols}|${rows}|${asp.toFixed(2)}|${ss}`;
  if (fineCached && fineCached.key === key) return fineCached;

  const w = cols * ss;
  const h = rows * ss;
  fineBig ??= document.createElement("canvas");
  fineSmall ??= document.createElement("canvas");
  fineBig.width = w;
  fineBig.height = Math.max(2, Math.round(h * asp));
  const bctx = fineBig.getContext("2d")!;
  bctx.fillStyle = "#000";
  bctx.fillRect(0, 0, fineBig.width, fineBig.height);
  bctx.fillStyle = "#fff";
  drawFittedText(bctx, text, fineBig.width, fineBig.height);

  fineSmall.width = w;
  fineSmall.height = h;
  const sctx = fineSmall.getContext("2d", { willReadFrequently: true })!;
  sctx.drawImage(fineBig, 0, 0, w, h);
  const px = sctx.getImageData(0, 0, w, h).data;
  const data = new Uint8ClampedArray(w * h);
  for (let i = 0; i < data.length; i++) data[i] = px[i * 4];

  // Busca, cerca del centro, el punto más "interior" de una letra (mayor distancia a un borde)
  const lit = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && data[y * w + x] > 200;
  const solidRadius = (x: number, y: number) => {
    let r = 0;
    for (; r < 14; r++) {
      const q = r + 1;
      if (![[q, 0], [-q, 0], [0, q], [0, -q], [q, q], [-q, q], [q, -q], [-q, -q]].every(([dx, dy]) => lit(x + dx, y + dy))) break;
    }
    return r;
  };
  let focus = { x: cols / 2, y: rows / 2 };
  let bestR = -1;
  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);
  search: for (let r = 0; r < Math.max(w, h) * 0.35; r += 3) {
    for (let a = 0; a < 360; a += 15) {
      const x = Math.round(cx + Math.cos((a * Math.PI) / 180) * r);
      const y = Math.round(cy + Math.sin((a * Math.PI) / 180) * r * 0.6);
      if (!lit(x, y)) continue;
      const rad = solidRadius(x, y);
      if (rad > bestR) {
        bestR = rad;
        focus = { x: x / ss, y: y / ss };
        if (rad >= 12) break search;
      }
    }
  }

  fineCached = { key, cols, rows, ss, w, h, data, focus };
  return fineCached;
}
