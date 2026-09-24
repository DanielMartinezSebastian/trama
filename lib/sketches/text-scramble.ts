import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, hsv, plot } from "@/lib/cells";
import { getTextMask } from "@/lib/text/mask";
import { textStore } from "@/lib/text/store";

const GLYPHS = "!<>-_\\/[]{}=+*^?#0123456789ABCDEF";

/**
 * Decodificado: el texto se descifra de izquierda a derecha entre glifos aleatorios y
 * se repite. Bajo el puntero las letras se vuelven a mezclar. Efecto típico de titulares.
 */
export function txScramble(t: Textmodifier) {
  const ptr = createPointer(t);

  t.draw(() => {
    ptr.update();
    const s = t.secs;
    const asp = aspect(t);
    const { cols, rows, x0, y0 } = gridOrigin(t);
    const text = textStore.text();
    const mask = getTextMask(text, cols, rows, asp);

    // ciclo de 6 s: 3.2 s descifrando, resto en reposo
    const cycle = (s % 6) / 3.2;
    const frontier = Math.min(1.15, cycle) * cols;

    t.background(4, 5, 12);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const m = mask.data[j * cols + i] / 255;
        if (m < 0.3) continue;
        const x = x0 + i;
        const y = y0 + j;
        const dx = x - ptr.x;
        const dy = (y - ptr.y) * asp;
        const hot = Math.hypot(dx, dy) < (ptr.pressed ? 14 : 8);
        const decoded = i < frontier - 6 && !hot;
        const edge = !decoded && i < frontier + 6;

        if (decoded) {
          t.char(text[(i + j * 3) % text.length] || "#");
          t.charColor(...hsv(0.5 + i * 0.002, 0.45, 0.95));
          t.cellColor(...hsv(0.55, 0.7, 0.1 * m));
        } else {
          t.char(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
          const hue = hot ? 0.9 : 0.35;
          t.charColor(...hsv(hue, 0.7, edge || hot ? 1 : 0.35));
          t.cellColor(...hsv(hue, 0.8, edge || hot ? 0.15 : 0.03));
        }
        plot(t, x, y);
      }
    }
  });
}
