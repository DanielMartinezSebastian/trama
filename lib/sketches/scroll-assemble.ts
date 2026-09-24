import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, hsv, plot } from "@/lib/cells";
import { smooth, scrollState, span } from "@/lib/scroll/store";
import { getTextMask } from "@/lib/text/mask";
import { textStore } from "@/lib/text/store";

type P = { hx: number; hy: number; tx: number; ty: number; x: number; y: number; seed: number };

/**
 * Ensamblaje: las partículas empiezan dispersas, se agrupan formando tu texto a medida
 * que bajas y estallan hacia fuera al final del recorrido.
 */
export function scAssemble(t: Textmodifier, opts: { transparent?: boolean } = {}) {
  const ptr = createPointer(t);
  const particles: P[] = [];
  let key = "";

  const retarget = (data: Uint8ClampedArray, cols: number, rows: number, x0: number, y0: number) => {
    const cells: number[] = [];
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) if (data[j * cols + i] > 140) cells.push(x0 + i, y0 + j);
    const total = cells.length / 2;
    const count = Math.min(2800, total);
    const step = total / Math.max(1, count);
    while (particles.length < count) {
      const ang = Math.random() * Math.PI * 2;
      const r = (0.4 + Math.random() * 0.6) * Math.max(cols, rows) * 0.6;
      particles.push({
        hx: Math.cos(ang) * r,
        hy: Math.sin(ang) * r * 0.6,
        tx: 0,
        ty: 0,
        x: 0,
        y: 0,
        seed: Math.random(),
      });
    }
    particles.length = count;
    particles.forEach((p, k) => {
      const idx = Math.floor(k * step);
      p.tx = cells[idx * 2];
      p.ty = cells[idx * 2 + 1];
    });
  };

  t.draw(() => {
    ptr.update();
    const p = scrollState.p;
    const s = t.secs;
    const asp = aspect(t);
    const { cols, rows, x0, y0 } = gridOrigin(t);
    const mask = getTextMask(textStore.text(), cols, rows, asp);
    if (mask.key !== key) {
      key = mask.key;
      retarget(mask.data, cols, rows, x0, y0);
    }

    const assemble = smooth(span(p, 0.05, 0.5));
    const explode = smooth(span(p, 0.78, 1));
    const R = 9;

    if (opts.transparent) t.clear();
    else t.background(4, 5, 12);
    for (const q of particles) {
      // deriva orgánica mientras está lejos de su sitio
      const drift = (1 - assemble) * 1.6;
      let gx = q.hx + Math.sin(s * 0.7 + q.seed * 20) * drift * 3;
      let gy = q.hy + Math.cos(s * 0.6 + q.seed * 14) * drift * 2;
      gx = gx * (1 - assemble) + q.tx * assemble;
      gy = gy * (1 - assemble) + q.ty * assemble;
      const ang = Math.atan2(q.ty, q.tx || 0.001);
      gx += Math.cos(ang) * explode * 60 * (0.5 + q.seed);
      gy += Math.sin(ang) * explode * 40 * (0.5 + q.seed);

      // el puntero aparta las partículas ya ensambladas
      const dx = q.x - ptr.x;
      const dy = (q.y - ptr.y) * asp;
      const d = Math.hypot(dx, dy) + 0.001;
      if (d < R && assemble > 0.5) {
        const k = (R - d) / R;
        gx += (dx / d) * k * 5;
        gy += ((dy / d) * k * 5) / asp;
      }

      q.x += (gx - q.x) * 0.14;
      q.y += (gy - q.y) * 0.14;

      const settled = assemble * (1 - explode);
      t.char(settled > 0.85 ? "#" : settled > 0.4 ? "+" : "*");
      const hue = (q.tx * 0.006 + s * 0.04 + 0.5 + explode * 0.2) % 1;
      t.charColor(...hsv(hue, 0.7 - settled * 0.15, 0.35 + 0.65 * settled));
      if (!opts.transparent) t.cellColor(...hsv(hue, 0.8, 0.02 + 0.12 * settled));
      plot(t, Math.round(q.x), Math.round(q.y));
    }
  });
}
