import type { Textmodifier } from "textmode.js";
import { createPointer, gridOrigin, hsv, plot } from "@/lib/cells";
import { smooth, scrollState, span } from "@/lib/scroll/store";
import { textStore } from "@/lib/text/store";

type BitmapFn = (text: string, o?: { char?: string; scale?: number }) => string;

const STATS = [
  { to: 12, suffix: "K", label: "USUARIOS", start: 0.08 },
  { to: 98, suffix: "%", label: "SATISFACCION", start: 0.28 },
  { to: 250, suffix: "+", label: "PROYECTOS", start: 0.48 },
];

/**
 * Combinación de ambas librerías: asciify-engine genera los números con su fuente
 * bitmap 7×7 (`asciifyText`) y textmode.js los dibuja celda a celda mientras cuentan
 * hacia arriba con el scroll. Ideal para una sección de cifras de una landing.
 */
export function scStats(t: Textmodifier) {
  const ptr = createPointer(t);
  let bitmap: BitmapFn | null = null;
  const cache = new Map<string, string[]>();
  import("asciify-engine/core").then((m) => (bitmap = m.asciifyText as BitmapFn));

  const art = (str: string) => {
    let a = cache.get(str);
    if (!a) {
      a = bitmap!(str, { char: "#" }).split("\n");
      cache.set(str, a);
    }
    return a;
  };

  t.draw(() => {
    ptr.update();
    const p = scrollState.p;
    const s = t.secs;
    const { cols, rows } = gridOrigin(t);

    t.background(5, 6, 16);
    // línea base decorativa
    for (let x = -Math.floor(cols / 2); x < cols / 2; x++) {
      t.char("-");
      t.charColor(40, 50, 90);
      plot(t, x, Math.floor(rows * 0.18));
    }
    t.printAlign("center", "middle");
    t.charColor(150, 170, 230);
    t.cellColor(5, 6, 16);
    t.print(`${textStore.text()}  ·  EN CIFRAS`, 0, -Math.floor(rows * 0.38), { markup: false });

    if (!bitmap) return;
    const colW = Math.floor(cols / 3);
    STATS.forEach((st, k) => {
      const k01 = smooth(span(p, st.start, st.start + 0.28));
      const value = Math.round(st.to * k01);
      const lines = art(`${value}${st.suffix}`);
      const w = Math.max(...lines.map((l) => l.length));
      const h = lines.length;
      const kx = Math.max(1, Math.min(3, Math.floor((colW * 0.9) / Math.max(1, w))));
      const cx = (k - 1) * colW;
      const ox = cx - Math.floor((w * kx) / 2);
      const oy = -Math.floor((h * kx) / 2) - 1;
      const visible = clamp01(span(p, st.start - 0.05, st.start + 0.05));
      if (visible <= 0) return;

      const hue = (0.55 + k * 0.17 + s * 0.02) % 1;
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < lines[j].length; i++) {
          if (lines[j][i] === " ") continue;
          for (let sy = 0; sy < kx; sy++) {
            for (let sx = 0; sx < kx; sx++) {
              t.char("#");
              t.charColor(...hsv(hue, 0.55, (0.55 + 0.45 * (1 - j / h)) * visible));
              t.cellColor(...hsv(hue, 0.85, 0.12 * visible));
              plot(t, ox + i * kx + sx, oy + j * kx + sy);
            }
          }
        }
      }
      t.printAlign("center", "middle");
      t.charColor(...hsv(hue, 0.3, 0.9 * visible));
      t.cellColor(5, 6, 16);
      t.print(st.label, cx, oy + h * kx + 3, { markup: false });
    });
  });
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
