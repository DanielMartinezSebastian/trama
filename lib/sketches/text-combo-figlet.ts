import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, hsv, plot } from "@/lib/cells";
import { bannerLines } from "@/lib/text/banner";
import { textStore } from "@/lib/text/store";

/**
 * Combinación de ambas librerías: asciify-engine genera el arte de texto (FIGlet o
 * bitmap 7×7) y textmode.js lo dibuja carácter a carácter con onda y ondas de hover.
 */
export function txComboFiglet(t: Textmodifier) {
  const ptr = createPointer(t);
  let lines: string[] = [" "];
  let key = "";
  let pending = "";
  let timer: ReturnType<typeof setTimeout> | undefined;
  let ripple = -10;
  let wasPressed = false;

  const request = (text: string, font: string) => {
    const k = `${font}|${text}`;
    if (k === key || k === pending) return;
    pending = k;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      let out = await bannerLines(text, font);
      // Si no cabe a lo ancho, prueba con fuentes más compactas
      const cols = t.grid?.cols ?? 100;
      for (const alt of ["Small", "Mini", "Bitmap"]) {
        if (Math.max(...out.map((l) => l.length)) <= cols * 0.94) break;
        out = await bannerLines(text, alt);
      }
      if (pending === k) {
        lines = out;
        key = k;
      }
    }, 120);
  };

  t.draw(() => {
    ptr.update();
    const s = t.secs;
    const asp = aspect(t);
    const { cols, rows } = gridOrigin(t);
    request(textStore.text(), textStore.get().font);

    if (ptr.pressed && !wasPressed) ripple = s;
    wasPressed = ptr.pressed;

    const w = Math.max(...lines.map((l) => l.length));
    const h = lines.length;
    // Amplía el arte en bloques kx×ky mientras quepa en pantalla
    const kx = Math.max(1, Math.min(4, Math.floor((cols * 0.92) / w)));
    const ky = Math.max(1, Math.min(4, Math.floor((rows * 0.8) / h), Math.round(kx / asp)));
    const ox = -Math.floor((w * kx) / 2);
    const oy = -Math.floor((h * ky) / 2);
    const R = 12;

    t.background(6, 6, 16);
    for (let j = 0; j < h; j++) {
      const line = lines[j];
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === " ") continue;
        t.char(ch);
        for (let sy = 0; sy < ky; sy++) {
          for (let sx = 0; sx < kx; sx++) {
            const x = ox + i * kx + sx;
            const y = oy + j * ky + sy;
            let px = x;
            let py = y + Math.sin(x * 0.18 + s * 2.4) * 1.2;

            const dx = px - ptr.x;
            const dy = (py - ptr.y) * asp;
            const d = Math.hypot(dx, dy) + 0.001;
            if (d < R) {
              const k = ((R - d) / R) ** 2;
              px += (dx / d) * k * 5;
              py += ((dy / d) * k * 5) / asp;
            }
            const age = s - ripple;
            if (age < 2) {
              const wave = Math.sin(d * 0.9 - age * 9) * Math.exp(-age * 1.6) * Math.exp(-d * 0.04);
              py += wave * 2.5;
            }

            const hue = (x * 0.008 + s * 0.06 + 0.5) % 1;
            t.charColor(...hsv(hue, 0.6, 0.95));
            t.cellColor(...hsv(hue, 0.85, 0.12));
            if (Math.abs(px) <= cols && Math.abs(py) <= rows) plot(t, Math.round(px), Math.round(py));
          }
        }
      }
    }
  });
}
