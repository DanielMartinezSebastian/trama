import type { Textmodifier } from "textmode.js";
import { aspect, clamp01, eachCell, hash2, mix, smoothstep } from "@/lib/cells";

/** Atardecer sobre el mar: cielo degradado, sol y reflejo que centellea entre las olas. */
export function ocean(t: Textmodifier) {
  t.draw(() => {
    const s = t.secs;
    const asp = aspect(t);
    const rows = t.grid!.rows;
    const horizon = Math.round(rows * 0.08); // fila (coordenada Y) del horizonte
    const top = -Math.floor(rows / 2);
    const bottom = top + rows;
    const sunR = Math.max(6, rows * 0.16);

    t.background(0);
    eachCell(t, (x, y) => {
      if (y < horizon) {
        // Cielo
        const k = (y - top) / (horizon - top);
        const dx = x;
        const dy = (y - (horizon - sunR * 0.55)) * asp;
        const d = Math.hypot(dx, dy);
        const glow = Math.exp(-d / (sunR * 2.2)) * 0.9;
        let r = mix(24, 255, k * k) + glow * 90;
        let g = mix(14, 120, k * k * k) + glow * 70;
        let b = mix(60, 110, k) + glow * 10;
        t.cellColor(r, g, b);

        if (d < sunR) {
          t.char(" ");
          t.cellColor(255, 220 - d * 4, 130 - d * 5);
          t.charColor(255, 240, 190);
        } else if (k < 0.5 && hash2(x, y) > 0.985) {
          t.char(Math.sin(s * 2 + hash2(y, x) * 40) > 0 ? "*" : ".");
          t.charColor(255, 255, 255, (1 - k * 2) * 255);
        } else {
          t.char(" ");
        }
        return;
      }

      // Agua
      const depth = clamp01((y - horizon) / (bottom - horizon));
      const k = 0.12 + 0.55 * (1 - depth);
      const wave =
        Math.sin(x * k + s * (1 + depth * 2.5) + Math.sin(y * 0.7 + s * 0.6) * 0.8) * 0.5 + 0.5;

      const sunSpread = 3 + depth * 26;
      const glitter = Math.exp(-(x * x) / (sunSpread * sunSpread)) * smoothstep(0.35, 0.9, wave);

      t.cellColor(mix(70, 6, depth) + glitter * 190, mix(30, 14, depth) + glitter * 130, mix(90, 40, depth) + glitter * 20);
      if (glitter > 0.25) {
        t.char("=");
        t.charColor(255, 235, 180);
      } else {
        t.char(wave > 0.8 ? "~" : wave > 0.5 ? "-" : " ");
        t.charColor(mix(190, 90, depth), mix(90, 110, depth), mix(150, 190, depth));
      }
    });
  });
}
