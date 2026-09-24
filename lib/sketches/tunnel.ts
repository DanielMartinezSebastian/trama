import type { Textmodifier } from "textmode.js";
import { aspect, clamp01, eachCell, hsv, smoothstep } from "@/lib/cells";

/** Túnel infinito de tablero de ajedrez con el centro en órbita lenta. */
export function tunnel(t: Textmodifier) {
  const ramp = t.createGlyphRamp(" .:-=+*#%@");

  t.draw(() => {
    const s = t.secs;
    const asp = aspect(t);
    const cx = Math.sin(s * 0.5) * t.grid!.cols * 0.06;
    const cy = Math.cos(s * 0.7) * t.grid!.rows * 0.06;
    const reach = t.grid!.cols * 0.28;

    t.background(0);
    eachCell(t, (x, y) => {
      const dx = x - cx;
      const dy = (y - cy) * asp;
      const r = Math.hypot(dx, dy) + 0.001;
      const a = Math.atan2(dy, dx);

      const u = 14 / r + s * 1.6;
      const v = (a / Math.PI) * 5 + s * 0.25;
      const check = (Math.floor(u) + Math.floor(v)) & 1;
      const fog = smoothstep(0, reach, r);

      // Paleta que oscila entre magenta y azul, con el brillo atenuado hacia el centro
      const hue = 0.72 + 0.16 * Math.sin(u * 0.15 + s * 0.4) + 0.05 * Math.sin(v);
      t.char(ramp.at(fog * (check ? 0.85 : 0.35)));
      t.charColor(...hsv(hue, 0.65, clamp01(fog * (check ? 0.95 : 0.5))));
      t.cellColor(...hsv(hue + 0.08, 0.85, fog * (check ? 0.05 : 0.2)));
    });
  });
}
