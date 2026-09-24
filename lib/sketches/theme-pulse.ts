import type { Textmodifier } from "textmode.js";
import { createPointer, eachCell, hash2, hsv, mix } from "@/lib/cells";
import { clamp, scrollState, smooth, span } from "@/lib/scroll/store";
import { getTextMask } from "@/lib/text/mask";

const BRAND = "PULSO";

/**
 * Pulso: ciudad nocturna con lluvia, tres capas de edificios con ventanas parpadeantes y
 * un cartel de neón. Al bajar, la cámara sube de la calle a las azoteas y el neón vira de
 * rosa a cian.
 */
export function thPulse(t: Textmodifier) {
  const ptr = createPointer(t);

  t.draw(() => {
    ptr.update();
    const p = scrollState.p;
    const s = t.secs;
    const { cols, rows } = t.grid!;
    const asp = t.grid!.cellHeight / t.grid!.cellWidth;
    const cam = p * rows * 0.55;
    const hueA = mix(0.88, 0.5, smooth(span(p, 0.35, 0.8))); // rosa → cian
    const signRows = Math.floor(rows * 0.5);
    const sign = getTextMask(BRAND, cols, signRows, asp); // el cartel ocupa la mitad superior

    // altura de edificios por columna y capa (bloques de ancho variable)
    const layers = [
      { f: 0.4, base: 0.42, amp: 0.3, w: 9, hue: 0.72, v: 0.18 },
      { f: 0.7, base: 0.34, amp: 0.34, w: 7, hue: 0.78, v: 0.13 },
      { f: 1.0, base: 0.22, amp: 0.36, w: 5, hue: 0.85, v: 0.08 },
    ];

    t.background(4, 2, 12);
    eachCell(t, (_x, _y, i, j) => {
      const sy = rows - 1 - j;
      // capas de cerca a lejos
      for (let k = layers.length - 1; k >= 0; k--) {
        const L = layers[k];
        const bi = Math.floor((i + 1000) / L.w);
        const h = rows * (L.base + hash2(bi, k * 7) * L.amp);
        const top = h - cam * L.f;
        if (sy < top) {
          // ventanas
          const inX = (i % L.w) % 2 === 1;
          const inY = Math.floor(sy + cam * L.f) % 3 === 1;
          const seed = hash2(bi * 13 + (i % L.w), Math.floor(sy + cam * L.f));
          const lit = inX && inY && seed > 0.45 && Math.sin(s * (0.8 + seed * 2) + seed * 40) > -0.4;
          if (lit) {
            t.char("#");
            t.charColor(...hsv(seed > 0.75 ? hueA : 0.12, 0.75, 0.95));
            t.cellColor(...hsv(L.hue, 0.7, L.v * 1.4));
          } else {
            t.char(sy > top - 1.2 ? "=" : " ");
            t.charColor(...hsv(L.hue, 0.5, L.v + 0.15));
            t.cellColor(...hsv(L.hue, 0.7, L.v * 0.55));
          }
          return;
        }
      }
      // cartel de neón en el cielo
      const m = j < signRows ? sign.data[j * cols + i] / 255 : 0;
      if (m > 0.4) {
        const flick = Math.sin(s * 30 + hash2(i, 3) * 6) > 0.92 ? 0.35 : 1;
        t.char("#");
        t.charColor(...hsv(hueA, 0.55, 0.85 * flick));
        t.cellColor(...hsv(hueA, 0.85, 0.25 * flick));
        return;
      }
      // cielo + lluvia
      const alt = clamp((sy + cam) / rows / 1.6);
      t.cellColor(...hsv(mix(0.8, 0.66, alt), 0.7, mix(0.16, 0.04, alt)));
      const rain = hash2(i, Math.floor(j + s * (9 + hash2(i, 1) * 8)));
      if (rain > 0.965) {
        t.char("|");
        t.charColor(110, 190, 255, 150);
        return;
      }
      const star = hash2(i + 7, j + Math.floor(cam)) > 0.993 - alt * 0.01;
      if (star && alt > 0.25) {
        t.char(".");
        t.charColor(255, 255, 255, 140);
        return;
      }
      t.char(" ");
    });
    void ptr;
  });
}
