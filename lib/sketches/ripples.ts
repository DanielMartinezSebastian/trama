import type { Textmodifier } from "textmode.js";
import { aspect, clamp01, createPointer, gridOrigin, plot } from "@/lib/cells";

/** Agua. Cada movimiento del puntero lanza ondas; pulsar deja caer una gota grande. */
export function ripples(t: Textmodifier) {
  const ramp = t.createGlyphRamp(" .,:;+*#@");
  const ptr = createPointer(t);
  let W = 0;
  let H = 0;
  let cur = new Float32Array(0);
  let prev = new Float32Array(0);
  let next = new Float32Array(0);

  const rebuild = () => {
    W = t.grid!.cols;
    H = t.grid!.rows;
    cur = new Float32Array(W * H);
    prev = new Float32Array(W * H);
    next = new Float32Array(W * H);
  };

  const drop = (cx: number, cy: number, r: number, amp: number) => {
    const asp = aspect(t);
    const ry = Math.ceil(r);
    const rx = Math.ceil(r * asp);
    for (let dy = -ry; dy <= ry; dy++) {
      for (let dx = -rx; dx <= rx; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 1 || y < 1 || x >= W - 1 || y >= H - 1) continue;
        const f = Math.max(0, 1 - Math.hypot(dx, dy * asp) / (r * asp + 0.5));
        cur[y * W + x] += amp * f;
      }
    }
  };

  let wasPressed = false;

  t.draw(() => {
    if (W !== t.grid!.cols || H !== t.grid!.rows) rebuild();
    ptr.update();
    const { x0, y0 } = gridOrigin(t);

    // Entradas: puntero y lluvia ocasional
    if (ptr.raw) {
      const gx = ptr.raw.x - x0;
      const gy = ptr.raw.y - y0;
      if (ptr.pressed && !wasPressed) drop(gx, gy, 4, 6);
      else if (Math.abs(ptr.vx) + Math.abs(ptr.vy) > 0.15) drop(gx, gy, 1, 1.4);
    }
    wasPressed = ptr.pressed;
    if (t.frameCount % 45 === 0) {
      drop(2 + Math.floor(Math.random() * (W - 4)), 2 + Math.floor(Math.random() * (H - 4)), 2, 3);
    }

    // Ecuación de ondas anisótropa: las celdas son ~2 veces más altas que anchas
    const asp = aspect(t);
    const kx = 1;
    const ky = 1 / (asp * asp);
    const a = 0.92 / (kx + ky); // condición de estabilidad: a·(kx+ky) < 1
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        const u = cur[i];
        const lap = kx * (cur[i - 1] + cur[i + 1] - 2 * u) + ky * (cur[i - W] + cur[i + W] - 2 * u);
        next[i] = (2 * u - prev[i] + a * lap) * 0.99;
      }
    }
    [prev, cur, next] = [cur, next, prev];

    t.background(3, 10, 24);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const v = cur[y * W + x];
        const m = Math.abs(v);
        if (m < 0.04) continue;
        const n = clamp01(m * 0.9);
        t.char(ramp.at(n));
        if (v > 0) t.charColor(120 + 135 * n, 210 + 45 * n, 255);
        else t.charColor(20 + 40 * n, 90 + 90 * n, 200 + 50 * n);
        t.cellColor(4 + 20 * n, 16 + 60 * n, 40 + 90 * n);
        plot(t, x0 + x, y0 + y);
      }
    }
  });
}
