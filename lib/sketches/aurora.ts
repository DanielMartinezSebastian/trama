import type { Textmodifier } from "textmode.js";
import { clamp01, eachCell, hash2, hsv } from "@/lib/cells";

/** Aurora boreal: cortinas de ruido sobre un cielo estrellado y montañas. */
export function aurora(t: Textmodifier) {
  const ramp = t.createGlyphRamp(" .:;+*#%");

  t.draw(() => {
    const s = t.secs;
    const rows = t.grid!.rows;
    const top = -Math.floor(rows / 2);

    t.background(0);
    eachCell(t, (x, y) => {
      const yy = (y - top) / rows; // 0 arriba, 1 abajo
      const ridge = 0.8 + 0.1 * t.noise(x * 0.03, 9) + 0.06 * t.noise(x * 0.11, 3);

      if (yy > ridge) {
        t.char(" ");
        t.cellColor(3, 4, 8 + (yy - ridge) * 20);
        return;
      }

      t.cellColor(2, 5, 14 + yy * 26);
      // El pliegue de la cortina ondula en horizontal y se desplaza con el tiempo
      const center =
        0.2 + 0.3 * t.noise(x * 0.022, s * 0.06) + 0.07 * Math.sin(x * 0.035 + s * 0.45);
      const fall = Math.exp(-(((yy - center) / 0.17) ** 2));
      const rays = 0.45 + 0.75 * t.noise(x * 0.35, s * 0.3);
      const body = 0.6 + 0.6 * t.noise(x * 0.05, yy * 2.2, s * 0.15);
      const power = clamp01(fall * rays * body);

      if (power > 0.05) {
        const above = clamp01((center - yy) / 0.3);
        const hue = 0.34 + 0.44 * above;
        t.char(ramp.at(power));
        t.charColor(...hsv(hue, 0.6, 0.35 + 0.65 * power));
        t.cellColor(...hsv(hue, 0.9, 0.05 + 0.25 * power));
      } else if (hash2(x, y) > 0.988) {
        const tw = Math.sin(s * 2.2 + hash2(y, x) * 60) * 0.5 + 0.5;
        t.char(tw > 0.6 ? "*" : ".");
        t.charColor(255, 255, 255, 90 + 165 * tw);
      } else {
        t.char(" ");
      }
    });
  });
}
