import type { Textmodifier } from "textmode.js";
import { createPointer, gridOrigin, hash2, hsv, plot } from "@/lib/cells";
import { clamp, scrollState } from "@/lib/scroll/store";
import { textStore } from "@/lib/text/store";

type Line = { text: string; color: [number, number, number] };
const BAR: [number, number, number] = [28, 34, 56];
const BODY: [number, number, number] = [10, 13, 24];
const DOTS: [number, number, number][] = [
  [255, 95, 87],
  [255, 189, 46],
  [40, 200, 64],
];

/**
 * Terminal que se escribe sola al hacer scroll: cada línea aparece carácter a carácter
 * según el progreso. Usa tu texto como nombre del proyecto.
 */
export function scTerminal(t: Textmodifier) {
  const ptr = createPointer(t);

  t.draw(() => {
    ptr.update();
    const p = scrollState.p;
    const s = t.secs;
    const { cols, rows, x0, y0 } = gridOrigin(t);
    const name = textStore.text().toLowerCase().replace(/\s+/g, "-").slice(0, 24);

    const lines: Line[] = [
      { text: `$ npx create-landing ${name}`, color: [130, 230, 255] },
      { text: "[ok] plantilla descargada", color: [120, 255, 160] },
      { text: "[ok] textmode.js + asciify-engine instalados", color: [120, 255, 160] },
      { text: "[ok] gsap ScrollTrigger configurado", color: [120, 255, 160] },
      { text: `$ cd ${name} && npm run dev`, color: [130, 230, 255] },
      { text: "ready - http://localhost:3000", color: [255, 220, 120] },
      { text: "scroll para ver la magia_", color: [200, 200, 220] },
    ];
    const total = lines.reduce((n, l) => n + l.text.length + 4, 0);
    let typed = Math.floor(clamp(p * 1.1) * total);

    const boxW = Math.min(cols - 6, 78);
    const boxH = lines.length + 4;
    const bx = -Math.floor(boxW / 2);
    const by = -Math.floor(boxH / 2);

    t.background(4, 6, 12);
    // fondo tenue de puntos
    for (let n = 0; n < 60; n++) {
      const hx = hash2(n, Math.floor(s * 0.2));
      const hy = hash2(Math.floor(s * 0.2), n * 3);
      t.char(".");
      t.charColor(40, 55, 90);
      plot(t, x0 + Math.floor(hx * cols), y0 + Math.floor(hy * rows));
    }

    // ventana
    for (let j = 0; j < boxH; j++) {
      for (let i = 0; i < boxW; i++) {
        const edge = i === 0 || i === boxW - 1 || j === 0 || j === boxH - 1;
        const bar = j === 1;
        t.cellColor(...(bar ? BAR : BODY));
        t.charColor(90, 105, 150);
        t.char(edge ? (j === 0 || j === boxH - 1 ? (i === 0 || i === boxW - 1 ? "+" : "-") : "|") : " ");
        plot(t, bx + i, by + j);
      }
    }
    // botones de la barra de título
    DOTS.forEach((c, k) => {
      t.char("o");
      t.charColor(...c);
      t.cellColor(28, 34, 56);
      plot(t, bx + 2 + k * 2, by + 1);
    });

    // líneas escritas
    t.printAlign("left", "top");
    lines.forEach((l, k) => {
      const n = Math.max(0, Math.min(l.text.length, typed));
      typed -= l.text.length + 4;
      if (n <= 0) return;
      t.cellColor(10, 13, 24);
      t.charColor(...l.color);
      t.print(l.text.slice(0, n), bx + 2, by + 3 + k, { markup: false });
      // cursor parpadeante en la línea activa
      if (n < l.text.length || (typed < 0 && k === lines.length - 1)) {
        if (Math.floor(s * 2.5) % 2 === 0) {
          t.charColor(255, 255, 255);
          t.cellColor(220, 220, 240);
          t.char(" ");
          plot(t, bx + 2 + n, by + 3 + k);
        }
      }
    });
    void hsv;
  });
}
