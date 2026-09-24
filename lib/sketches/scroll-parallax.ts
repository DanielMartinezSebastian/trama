import type { Textmodifier } from "textmode.js";
import { createPointer, eachCell, hash2, hsv, mix } from "@/lib/cells";
import { clamp, scrollState } from "@/lib/scroll/store";

/**
 * Ascenso con paralaje: al bajar la cámara sube desde un valle al atardecer hasta el
 * espacio. Cada capa de montañas se mueve a distinta velocidad y el cielo cambia de color.
 */
export function scParallax(t: Textmodifier) {
  const ptr = createPointer(t);
  const ramp = t.createGlyphRamp(" .:-=+*#%@");

  t.draw(() => {
    ptr.update();
    const p = scrollState.p;
    const s = t.secs;
    const { cols, rows } = t.grid!;
    const worldH = rows * 3.2;
    const cam = p * worldH;
    const px = (ptr.x / cols) * 6; // leve paralaje horizontal con el puntero

    // altura de cada capa de montañas por columna (una sola evaluación de ruido por columna)
    const layers = [
      { f: 0.35, base: rows * 0.55, amp: rows * 0.16, seed: 3, hue: 0.62, v: 0.32 },
      { f: 0.6, base: rows * 0.42, amp: rows * 0.13, seed: 11, hue: 0.72, v: 0.2 },
      { f: 1.0, base: rows * 0.3, amp: rows * 0.11, seed: 23, hue: 0.8, v: 0.1 },
    ];
    const tops = layers.map((L) => {
      const arr = new Float32Array(cols);
      for (let i = 0; i < cols; i++) {
        const x = i + px * L.f * 4;
        arr[i] = L.base + (t.noise(x * 0.03 + L.seed, L.seed) - 0.5) * 2 * L.amp + t.noise(x * 0.11, L.seed) * 3;
      }
      return arr;
    });

    t.background(0);
    eachCell(t, (x, _y, i, j) => {
      const sy = rows - 1 - j; // altura en pantalla (0 = abajo)
      const wy = sy + cam; // altura en el mundo
      const alt = clamp(wy / (worldH + rows));

      // capas de montaña de cerca a lejos
      for (let k = layers.length - 1; k >= 0; k--) {
        const L = layers[k];
        const top = tops[k][i] - cam * L.f;
        if (sy < top) {
          const edge = top - sy < 1.2;
          t.char(edge ? "^" : ramp.at(0.2 + 0.1 * (top - sy > 6 ? 0 : 1)));
          t.charColor(...hsv(L.hue, 0.4, L.v + (edge ? 0.25 : 0)));
          t.cellColor(...hsv(L.hue, 0.6, L.v * 0.35));
          return;
        }
      }

      // cielo: del atardecer (abajo) al espacio (arriba)
      const dusk = clamp(1 - alt * 2.2);
      const night = clamp(alt * 1.6);
      const r = mix(mix(15, 255, dusk * dusk), 0, night) * 0.9;
      const g = mix(mix(20, 110, dusk * dusk), 2, night) * 0.9;
      const b = mix(mix(70, 90, dusk), 10, night) * 0.9;
      t.cellColor(r, g, b);

      const star = hash2(x + Math.floor(cam * 0.05), Math.floor(wy * 0.5));
      if (star > 1 - 0.03 * clamp(alt * 3)) {
        const tw = Math.sin(s * 2 + star * 90) * 0.5 + 0.5;
        t.char(tw > 0.55 ? "*" : ".");
        t.charColor(255, 255, 255, 120 + 135 * tw);
        return;
      }
      // nubes en la franja media
      const cloudBand = Math.exp(-(((alt - 0.28) / 0.08) ** 2));
      if (cloudBand > 0.05) {
        const c = t.noise(x * 0.06 + s * 0.05, wy * 0.09) * cloudBand;
        if (c > 0.42) {
          t.char(ramp.at(c));
          t.charColor(255, 235, 230, 150);
          return;
        }
      }
      t.char(" ");
    });
  });
}
