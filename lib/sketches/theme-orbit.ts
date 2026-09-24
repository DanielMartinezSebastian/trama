import type { Textmodifier } from "textmode.js";
import { createPointer, eachCell, hash2, mix } from "@/lib/cells";
import { clamp, scrollState, smooth, span } from "@/lib/scroll/store";

type RGB = [number, number, number];

/**
 * Órbita: del pie de la rampa de lanzamiento al espacio. El cielo se oscurece, el cohete
 * asciende dejando estela de fuego, aparece el limbo del planeta y, al final, la luna.
 */
export function thOrbit(t: Textmodifier) {
  const ptr = createPointer(t);

  t.draw(() => {
    ptr.update();
    const p = scrollState.p;
    const s = t.secs;
    const { cols, rows } = t.grid!;

    const ground = smooth(span(p, 0, 0.3)); // la rampa se aleja hacia abajo
    const space = smooth(span(p, 0.08, 0.55));
    const planetUp = smooth(span(p, 0.3, 0.75));
    const moon = smooth(span(p, 0.8, 1));

    const groundH = Math.max(0, rows * 0.22 - ground * rows * 0.5); // altura del suelo (celdas)
    const lift = smooth(span(p, 0.03, 0.5)) * rows * 1.5;
    const baseAlt = groundH + 1 + lift; // altura de la base del cohete

    const R = cols * 1.4; // radio del planeta en celdas
    const topRow = rows * mix(1.25, 0.6, planetUp); // fila (desde arriba) donde asoma el limbo
    const pcy = topRow + R;
    const skyTop: RGB = [mix(25, 2, space), mix(70, 3, space), mix(160, 14, space)];
    const skyLow: RGB = [mix(120, 4, space), mix(180, 6, space), mix(235, 24, space)];

    t.background(0);
    eachCell(t, (x, _y, _i, j) => {
      const alt = rows - 1 - j; // altura sobre el borde inferior

      // rampa de lanzamiento
      if (alt < groundH) {
        const tower = Math.abs(x + cols * 0.16) <= 1 && alt < groundH + rows * 0.3;
        t.char(tower ? (alt % 3 === 0 ? "=" : "|") : "#");
        t.charColor(70, 80, 100);
        t.cellColor(14, 16, 26);
        return;
      }
      if (ground < 0.9 && Math.abs(x + cols * 0.16) <= 1 && alt < groundH + rows * 0.34) {
        t.char(alt % 3 === 0 ? "=" : "|");
        t.charColor(90, 100, 125);
        t.cellColor(...(skyLowAt(alt / rows)));
        return;
      }

      // cohete
      const rb = alt - baseAlt;
      if (rb >= 0 && rb < 10 && Math.abs(x) <= (rb < 3 ? 2 : 1)) {
        const fin = rb < 3 && Math.abs(x) === 2;
        t.char(rb === 9 ? "^" : fin ? (x < 0 ? "/" : "\\") : rb === 5 ? "o" : "H");
        t.charColor(...(fin ? ([255, 90, 80] as RGB) : ([245, 245, 255] as RGB)));
        t.cellColor(50, 54, 70);
        return;
      }
      // llama y estela
      if (lift > 0.5 || p < 0.02) {
        const fd = baseAlt - alt; // profundidad bajo el cohete
        if (fd > 0 && fd < rows * 0.35 && Math.abs(x) <= Math.max(0, 2.2 - fd * 0.06)) {
          const f = hash2(x, Math.floor(s * 14 + alt));
          if (f > fd / (rows * 0.35)) {
            t.char(f > 0.8 ? "*" : "^");
            t.charColor(255, 170 + f * 80, 60 + (fd / rows) * 200);
            t.cellColor(70 * (1 - fd / (rows * 0.35)), 25, 0);
            return;
          }
        }
      }

      // planeta
      const dPlanet = Math.hypot(x + (ptr.x / cols) * 6, j - pcy);
      if (planetUp > 0.01 && dPlanet < R) {
        const n = t.noise(x * 0.05 + s * 0.02, j * 0.12) * 0.95;
        const rim = 1 - dPlanet / R;
        const cloud = n > 0.58;
        const land = n > 0.4;
        t.char(cloud ? "%" : land ? "+" : ".");
        t.charColor(...(cloud ? ([235, 245, 255] as RGB) : land ? ([70, 170, 110] as RGB) : ([40, 110, 210] as RGB)));
        t.cellColor(6, 20 + rim * 60, 50 + rim * 110);
        return;
      }
      const halo = Math.exp(-(((dPlanet - R) / (rows * 0.05)) ** 2)) * planetUp;
      if (halo > 0.1) {
        t.char("~");
        t.charColor(120, 200, 255, 200 * halo);
        t.cellColor(10, 30 * halo, 80 * halo);
        return;
      }

      // luna con cráteres
      if (moon > 0.01) {
        const d = Math.hypot(x - cols * 0.22, (j - rows * 0.26) * 1);
        if (d < rows * 0.2 * moon) {
          const crater = hash2(Math.floor(x / 2), Math.floor(j / 2)) > 0.84;
          t.char(crater ? "o" : ".");
          t.charColor(215, 217, 226);
          t.cellColor(72, 74, 86);
          return;
        }
      }

      // cielo
      const k = clamp(alt / rows);
      t.cellColor(mix(skyLow[0], skyTop[0], k), mix(skyLow[1], skyTop[1], k), mix(skyLow[2], skyTop[2], k));
      if (hash2(x, j) > 1 - 0.04 * space) {
        const tw = Math.sin(s * 2 + hash2(j, x) * 60) * 0.5 + 0.5;
        t.char(tw > 0.5 ? "*" : ".");
        t.charColor(255, 255, 255, 80 + 175 * tw);
        return;
      }
      // nubes de día
      if (space < 0.4) {
        const c = t.noise(x * 0.05 + s * 0.03, alt * 0.09) * (1 - space / 0.4);
        if (c > 0.55 && k > 0.15 && k < 0.7) {
          t.char(c > 0.66 ? "%" : "~");
          t.charColor(255, 255, 255, 190);
          return;
        }
      }
      t.char(" ");
    });

    function skyLowAt(k: number): RGB {
      return [mix(skyLow[0], skyTop[0], k), mix(skyLow[1], skyTop[1], k), mix(skyLow[2], skyTop[2], k)];
    }
  });
}
