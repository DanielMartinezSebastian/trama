import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, plot } from "@/lib/cells";
import { getTextMask } from "@/lib/text/mask";
import { textStore } from "@/lib/text/store";

const GLYPHS = "01#%&@$/\\|<>";

/** Glitch: bandas desplazadas, separación cromática y ruido. El puntero corrompe lo que toca. */
export function txGlitch(t: Textmodifier) {
  const ptr = createPointer(t);
  let bands = new Float32Array(0);

  t.draw(() => {
    ptr.update();
    const asp = aspect(t);
    const { cols, rows, x0, y0 } = gridOrigin(t);
    const mask = getTextMask(textStore.text(), cols, rows, asp);
    if (bands.length !== rows) bands = new Float32Array(rows);

    for (let j = 0; j < rows; j++) bands[j] *= 0.82;
    if (Math.random() < (ptr.pressed ? 0.9 : 0.14)) {
      const j0 = Math.floor(Math.random() * rows);
      const len = 1 + Math.floor(Math.random() * 5);
      const off = (Math.random() - 0.5) * 22;
      for (let j = j0; j < Math.min(rows, j0 + len); j++) bands[j] = off;
    }

    const R = ptr.pressed ? 16 : 9;
    t.background(4, 4, 10);

    // Ruido de fondo
    for (let n = 0; n < 50; n++) {
      t.char(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
      t.charColor(30, 45, 70);
      plot(t, x0 + Math.floor(Math.random() * cols), y0 + Math.floor(Math.random() * rows));
    }

    for (let j = 0; j < rows; j++) {
      const dim = j % 3 === 0 ? 0.7 : 1; // líneas de barrido
      for (let i = 0; i < cols; i++) {
        if (mask.data[j * cols + i] < 90) continue;
        const x = x0 + i;
        const y = y0 + j;
        let ox = Math.round(bands[j]);
        const dx = x - ptr.x;
        const dy = (y - ptr.y) * asp;
        const hot = Math.hypot(dx, dy) < R;
        if (hot) ox += Math.round((Math.random() - 0.5) * 6);

        const ch = hot && Math.random() < 0.5 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : "#";
        t.char(ch);
        t.charColor(255 * dim, 40, 90 * dim);
        plot(t, x + ox - 1, y);
        t.charColor(30, 230 * dim, 255 * dim);
        plot(t, x + ox + 1, y);
        t.charColor(245 * dim, 245 * dim, 255 * dim);
        plot(t, x + ox, y);
      }
    }
  });
}
