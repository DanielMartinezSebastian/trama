import type { Textmodifier } from "textmode.js";

export type RGB = [number, number, number];

/** h, s, v en 0..1 → [r, g, b] en 0..255 */
export function hsv(h: number, s: number, v: number): RGB {
  h = ((h % 1) + 1) % 1;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const u = v * (1 - (1 - f) * s);
  const [r, g, b] =
    [
      [v, u, p],
      [q, v, p],
      [p, v, u],
      [p, q, v],
      [u, p, v],
      [v, p, q],
    ][i % 6];
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const smoothstep = (a: number, b: number, v: number) => {
  const k = clamp01((v - a) / (b - a));
  return k * k * (3 - 2 * k);
};

/** Hash determinista 0..1 para una posición de celda. */
export function hash2(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Relación alto/ancho de una celda (≈ 2). Sirve para corregir distancias. */
export const aspect = (t: Textmodifier) =>
  t.grid!.cellHeight / t.grid!.cellWidth;

/** Rango de coordenadas de celda (origen en el centro de la rejilla). */
export function gridOrigin(t: Textmodifier) {
  const cols = t.grid!.cols;
  const rows = t.grid!.rows;
  return {
    cols,
    rows,
    x0: -Math.floor((cols - 1) / 2),
    y0: -Math.floor(rows / 2),
  };
}

/**
 * Recorre todas las celdas de la rejilla. El callback puede devolver `false`
 * para no dibujar la celda. Cada celda se dibuja con `point()` usando el estado
 * (char, colores) que el callback haya fijado.
 */
export function eachCell(
  t: Textmodifier,
  fn: (x: number, y: number, i: number, j: number) => boolean | void,
) {
  const { cols, rows, x0, y0 } = gridOrigin(t);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = x0 + i;
      const y = y0 + j;
      t.push();
      t.translate(x, y);
      if (fn(x, y, i, j) !== false) t.point();
      t.pop();
    }
  }
}

/** Dibuja una sola celda en coordenadas de rejilla. */
export function plot(t: Textmodifier, x: number, y: number) {
  t.push();
  t.translate(x, y);
  t.point();
  t.pop();
}

/**
 * Puntero suavizado. Usa el ratón o el primer toque; si no hay ninguno sobre el
 * lienzo, vaga por la pantalla en piloto automático para que el fondo siga vivo.
 */
export function createPointer(t: Textmodifier) {
  const p = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    /** true si hay un puntero real sobre el lienzo */
    hovering: false,
    pressed: false,
    /** celda exacta bajo el puntero (sin suavizar) o null */
    raw: null as { x: number; y: number } | null,
    update() {
      let tx = NaN;
      let ty = NaN;
      const touch = t.touches?.[0];
      if (touch && Number.isFinite(touch.x)) {
        tx = touch.x;
        ty = touch.y;
      } else if (Number.isFinite(t.mouse.x)) {
        tx = t.mouse.x;
        ty = t.mouse.y;
      }
      p.hovering = Number.isFinite(tx);
      p.pressed = t.mouseIsPressed && p.hovering;
      p.raw = p.hovering ? { x: tx, y: ty } : null;

      if (!p.hovering) {
        const s = t.secs;
        tx = Math.sin(s * 0.37) * t.grid!.cols * 0.32;
        ty = Math.sin(s * 0.53 + 1.3) * t.grid!.rows * 0.3;
      }
      const k = p.hovering ? 0.35 : 0.04;
      const nx = p.x + (tx - p.x) * k;
      const ny = p.y + (ty - p.y) * k;
      p.vx = nx - p.x;
      p.vy = ny - p.y;
      p.x = nx;
      p.y = ny;
    },
  };
  return p;
}
export type Pointer = ReturnType<typeof createPointer>;
