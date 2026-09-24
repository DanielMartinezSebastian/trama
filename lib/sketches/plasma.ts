import type { Textmodifier } from "textmode.js";
import { aspect, clamp01, createPointer, eachCell, hsv } from "@/lib/cells";

/** Plasma con rampa de glifos. El puntero deforma el campo; al pulsar la onda crece. */
export function plasma(t: Textmodifier) {
  const ramp = t.createGlyphRamp(" .:-=+*#%@");
  const ptr = createPointer(t);

  t.draw(() => {
    ptr.update();
    const s = t.secs;
    const asp = aspect(t);
    const radius = ptr.pressed ? 900 : 260;

    t.background(0);
    eachCell(t, (x, y) => {
      const yy = y * asp;
      let v =
        Math.sin(x * 0.09 + s) +
        Math.sin(yy * 0.13 - s * 1.3) +
        Math.sin((x + yy) * 0.06 + s * 0.7) +
        Math.sin(Math.hypot(x * 0.8, yy) * 0.08 - s * 1.1);

      const dx = x - ptr.x;
      const dy = (y - ptr.y) * asp;
      const d2 = dx * dx + dy * dy;
      v += 3 * Math.exp(-d2 / radius) * Math.sin(s * 4 - Math.sqrt(d2) * 0.5);

      const n = clamp01((v + 4) / 8);
      const hue = n * 0.55 + s * 0.02 + 0.55;
      t.char(ramp.at(n));
      t.charColor(...hsv(hue, 0.75, 0.3 + 0.7 * n));
      t.cellColor(...hsv(hue, 0.85, 0.05 + 0.13 * n));
    });
  });
}
