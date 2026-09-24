import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, plot } from "@/lib/cells";
import { getTextMask } from "@/lib/text/mask";
import { textStore } from "@/lib/text/store";

const GLYPHS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]/\\|+=*:;#$%&@";

/** Lluvia digital que se ilumina donde hay texto (con las letras de tu propio texto). El puntero deja rastro de luz. */
export function txRain(t: Textmodifier) {
  const ptr = createPointer(t);
  let W = 0;
  let H = 0;
  let glow = new Float32Array(0);
  let heads: { y: number; v: number }[] = [];

  const rebuild = () => {
    W = t.grid!.cols;
    H = t.grid!.rows;
    glow = new Float32Array(W * H);
    heads = Array.from({ length: W }, () => ({ y: Math.random() * H, v: 0.25 + Math.random() * 0.7 }));
  };

  t.draw(() => {
    if (W !== t.grid!.cols || H !== t.grid!.rows) rebuild();
    ptr.update();
    const text = textStore.text();
    const asp = aspect(t);
    const { x0, y0 } = gridOrigin(t);
    const mask = getTextMask(text, W, H, asp);

    for (let i = 0; i < W; i++) {
      const h = heads[i];
      h.y += h.v;
      if (h.y >= H + 4) {
        h.y = -Math.random() * H * 0.5;
        h.v = 0.25 + Math.random() * 0.7;
      }
      const row = Math.floor(h.y);
      if (row >= 0 && row < H) glow[row * W + i] = 1;
    }
    if (ptr.raw) {
      const gx = Math.round(ptr.raw.x - x0);
      const gy = Math.round(ptr.raw.y - y0);
      const r = ptr.pressed ? 7 : 3;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r * 2; dx <= r * 2; dx++) {
          const x = gx + dx;
          const y = gy + dy;
          if (x >= 0 && y >= 0 && x < W && y < H && Math.hypot(dx / 2, dy) <= r) glow[y * W + x] = 1;
        }
      }
    }

    t.background(0, 4, 2);
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
        const idx = j * W + i;
        const g = glow[idx];
        glow[idx] = g * 0.93;
        const m = mask.data[idx] / 255;
        const b = Math.max(g, m * 0.55);
        if (b < 0.05) continue;
        const lit = m > 0.4;
        t.char(
          lit
            ? text[(i + j * 7) % text.length] || "#"
            : GLYPHS[(i * 31 + j * 17 + (g > 0.9 ? t.frameCount : 0)) % GLYPHS.length],
        );
        if (lit) t.charColor(120 + 135 * g, 255, 150 + 90 * g);
        else t.charColor(0, 60 + 195 * b, 40 * b);
        t.cellColor(0, lit ? 22 + 30 * b : 6 + 12 * b, lit ? 10 : 3);
        plot(t, x0 + i, y0 + j);
      }
    }
  });
}
