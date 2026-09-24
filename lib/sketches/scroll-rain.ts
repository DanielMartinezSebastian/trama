import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, plot } from "@/lib/cells";
import { smooth, scrollState, span } from "@/lib/scroll/store";
import { getTextMask } from "@/lib/text/mask";
import { textStore } from "@/lib/text/store";

const GLYPHS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]/\\|+=*:;#$%&@";

/**
 * Lluvia sensible al scroll: cae más rápido cuanto más rápido desplazas y, pasada la
 * mitad del recorrido, se va solidificando en tu texto.
 */
export function scRain(t: Textmodifier) {
  const ptr = createPointer(t);
  let W = 0;
  let H = 0;
  let glow = new Float32Array(0);
  let heads: { y: number; v: number }[] = [];

  const rebuild = () => {
    W = t.grid!.cols;
    H = t.grid!.rows;
    glow = new Float32Array(W * H);
    heads = Array.from({ length: W }, () => ({ y: Math.random() * H, v: 0.2 + Math.random() * 0.6 }));
  };

  t.draw(() => {
    if (W !== t.grid!.cols || H !== t.grid!.rows) rebuild();
    ptr.update();
    const p = scrollState.p;
    const boost = 1 + Math.abs(scrollState.v) * 5;
    const text = textStore.text();
    const asp = aspect(t);
    const { x0, y0 } = gridOrigin(t);
    const mask = getTextMask(text, W, H, asp);
    const reveal = smooth(span(p, 0.45, 0.85));

    for (let i = 0; i < W; i++) {
      const h = heads[i];
      h.y += h.v * boost * (scrollState.v < 0 ? -1 : 1);
      if (h.y >= H + 4 || h.y < -H * 0.6) {
        h.y = scrollState.v < 0 ? H + 2 : -Math.random() * H * 0.5;
        h.v = 0.2 + Math.random() * 0.6;
      }
      const row = Math.floor(h.y);
      if (row >= 0 && row < H) glow[row * W + i] = 1;
    }
    if (ptr.raw) {
      const gx = Math.round(ptr.raw.x - x0);
      const gy = Math.round(ptr.raw.y - y0);
      for (let dy = -3; dy <= 3; dy++)
        for (let dx = -6; dx <= 6; dx++) {
          const x = gx + dx;
          const y = gy + dy;
          if (x >= 0 && y >= 0 && x < W && y < H && Math.hypot(dx / 2, dy) <= 3) glow[y * W + x] = 1;
        }
    }

    // El verde matrix vira a cian y luego a ámbar al avanzar
    const cr = 0 + p * 60;
    const cg = 255 - p * 60;
    const cb = 90 + p * 130;

    t.background(0, 3, 4);
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
        const idx = j * W + i;
        const g = glow[idx];
        glow[idx] = g * 0.93;
        const m = (mask.data[idx] / 255) * reveal;
        const b = Math.max(g, m);
        if (b < 0.05) continue;
        const lit = m > 0.4;
        t.char(
          lit
            ? text[(i + j * 7) % text.length] || "#"
            : GLYPHS[(i * 31 + j * 17 + (g > 0.9 ? t.frameCount : 0)) % GLYPHS.length],
        );
        if (lit) t.charColor(140 + 115 * g, 255, 170 + 85 * g);
        else t.charColor(cr * b, cg * b * 0.9, cb * b * 0.5);
        t.cellColor(0, lit ? 20 + 30 * b : 4 + 10 * b, lit ? 12 : 3);
        plot(t, x0 + i, y0 + j);
      }
    }
  });
}
