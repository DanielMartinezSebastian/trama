import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, hsv, plot } from "@/lib/cells";
import { scrollState } from "@/lib/scroll/store";
import { getFineMask } from "@/lib/text/mask";
import { textStore } from "@/lib/text/store";

/**
 * Zoom tipográfico: al bajar te sumerges dentro de las letras (hasta 50×).
 * La cámara converge hacia un punto interior de una letra, así que al final
 * la pantalla queda llena de tu propio texto.
 */
export function scZoom(t: Textmodifier) {
  const ptr = createPointer(t);
  const ramp = t.createGlyphRamp(" .:-=+*#%@");

  t.draw(() => {
    ptr.update();
    const p = scrollState.p;
    const s = t.secs;
    const asp = aspect(t);
    const { cols, rows, x0, y0 } = gridOrigin(t);
    const text = textStore.text();
    const fm = getFineMask(text, cols, rows, asp, 3);
    const scale = Math.exp(p * Math.log(50));
    const a = 1 - 1 / scale;
    // punto de la máscara que cae bajo el centro de pantalla
    const cxm = cols / 2 + (fm.focus.x - cols / 2) * a;
    const cym = rows / 2 + (fm.focus.y - rows / 2) * a;

    t.background(4, 5, 14);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = x0 + i;
        const y = y0 + j;
        const mx = Math.floor((cxm + x / scale) * fm.ss);
        const my = Math.floor((cym + y / scale) * fm.ss);
        if (mx < 0 || my < 0 || mx >= fm.w || my >= fm.h) continue;
        const v = fm.data[my * fm.w + mx] / 255;
        if (v < 0.25) continue;

        const deep = scale > 6;
        t.char(deep ? text[(i * 3 + j * 5 + Math.floor(s * 3)) % text.length] : ramp.at(v));
        const hue = (0.55 + p * 1.1 + x * 0.002 + Math.sin(s * 0.4 + y * 0.05) * 0.03) % 1;
        const glow = 0.45 + 0.55 * v;
        t.charColor(...hsv(hue, 0.6, glow));
        t.cellColor(...hsv(hue, 0.85, 0.05 + 0.13 * v));
        plot(t, x, y);
      }
    }
    void ptr;
  });
}
