import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, hsv, plot } from "@/lib/cells";
import { getTextMask } from "@/lib/text/mask";
import { textStore } from "@/lib/text/store";

/** Texto grande que ondula. El puntero aparta las letras; al pulsar, con más fuerza. */
export function txWave(t: Textmodifier) {
  const ptr = createPointer(t);
  const ramp = t.createGlyphRamp(" .:-=+*#%@");
  const noise = "01#%&@$";

  t.draw(() => {
    ptr.update();
    const s = t.secs;
    const asp = aspect(t);
    const { cols, rows, x0, y0 } = gridOrigin(t);
    const mask = getTextMask(textStore.text(), cols, rows, asp);
    const R = ptr.pressed ? 18 : 11;

    t.background(5, 6, 16);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const v = mask.data[j * cols + i] / 255;
        if (v < 0.3) continue;
        const x = x0 + i;
        const y = y0 + j;
        let px = x;
        let py = y + Math.sin(x * 0.22 + s * 3) * 1.6;

        const dx = px - ptr.x;
        const dy = (py - ptr.y) * asp;
        const d = Math.hypot(dx, dy) + 0.001;
        const near = d < R;
        if (near) {
          const k = (R - d) / R;
          px += (dx / d) * k * R * 0.7;
          py += ((dy / d) * k * R * 0.7) / asp;
        }

        const hue = (x * 0.006 + s * 0.08 + 0.55) % 1;
        t.char(near && Math.random() < 0.25 ? noise[Math.floor(Math.random() * noise.length)] : ramp.at(v));
        t.charColor(...hsv(hue, 0.7, 0.5 + 0.5 * v));
        t.cellColor(...hsv(hue, 0.8, 0.1));
        plot(t, Math.round(px), Math.round(py));
      }
    }
  });
}
