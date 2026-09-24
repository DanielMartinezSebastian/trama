import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, hsv, plot } from "@/lib/cells";
import { getTextMask } from "@/lib/text/mask";
import { textStore } from "@/lib/text/store";

type P = { x: number; y: number; vx: number; vy: number; tx: number; ty: number };

/**
 * Partículas con muelle que forman el texto. El puntero las dispersa y pulsar las
 * hace explotar; al cambiar el texto se reasignan los destinos y vuelan a su sitio.
 * Con `transparent` no pinta fondo, para superponerlo a otra capa.
 */
export function txParticles(t: Textmodifier, opts: { transparent?: boolean } = {}) {
  const ptr = createPointer(t);
  const particles: P[] = [];
  let key = "";
  let wasPressed = false;

  const retarget = (data: Uint8ClampedArray, cols: number, rows: number, x0: number, y0: number) => {
    const cells: number[] = [];
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) if (data[j * cols + i] > 140) cells.push(x0 + i, y0 + j);
    const total = cells.length / 2;
    const count = Math.min(2600, total);
    const step = total / Math.max(1, count);
    const targets: [number, number][] = [];
    for (let k = 0; k < count; k++) {
      const idx = Math.floor(k * step);
      targets.push([cells[idx * 2], cells[idx * 2 + 1]]);
    }
    for (let k = targets.length - 1; k > 0; k--) {
      const r = Math.floor(Math.random() * (k + 1));
      [targets[k], targets[r]] = [targets[r], targets[k]];
    }
    while (particles.length < count) {
      particles.push({
        x: x0 + Math.random() * cols,
        y: y0 + Math.random() * rows,
        vx: 0,
        vy: 0,
        tx: 0,
        ty: 0,
      });
    }
    particles.length = count;
    targets.forEach(([tx, ty], k) => {
      particles[k].tx = tx;
      particles[k].ty = ty;
    });
  };

  t.draw(() => {
    ptr.update();
    const s = t.secs;
    const asp = aspect(t);
    const { cols, rows, x0, y0 } = gridOrigin(t);
    const mask = getTextMask(textStore.text(), cols, rows, asp);
    if (mask.key !== key) {
      key = mask.key;
      retarget(mask.data, cols, rows, x0, y0);
    }

    const burst = ptr.pressed && !wasPressed;
    wasPressed = ptr.pressed;
    const R = 12;

    if (opts.transparent) t.clear();
    else t.background(4, 5, 12);
    for (const p of particles) {
      p.vx = (p.vx + (p.tx - p.x) * 0.06) * 0.86;
      p.vy = (p.vy + (p.ty - p.y) * 0.06) * 0.86;

      const dx = p.x - ptr.x;
      const dy = (p.y - ptr.y) * asp;
      const d = Math.hypot(dx, dy) + 0.001;
      if (d < R) {
        const k = ((R - d) / R) * 1.8;
        p.vx += (dx / d) * k;
        p.vy += ((dy / d) * k) / asp;
      }
      if (burst && d < 40) {
        p.vx += (dx / d) * 6 * (1 + Math.random());
        p.vy += ((dy / d) * 6 * (1 + Math.random())) / asp;
      }
      p.x += p.vx;
      p.y += p.vy;

      const e = Math.hypot(p.vx, p.vy);
      t.char(e > 1.2 ? "*" : e > 0.35 ? "+" : "#");
      const hue = (p.tx * 0.007 + s * 0.05 + 0.5) % 1;
      t.charColor(...hsv(hue, 0.65 - Math.min(e, 1) * 0.3, 0.6 + Math.min(e, 1) * 0.4));
      if (!opts.transparent) t.cellColor(...hsv(hue, 0.8, 0.07 + Math.min(e, 1) * 0.12));
      plot(t, Math.round(p.x), Math.round(p.y));
    }
  });
}
