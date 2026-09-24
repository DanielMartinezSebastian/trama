import type { Textmodifier } from "textmode.js";
import { createPointer, gridOrigin, hsv } from "@/lib/cells";
import { textStore } from "@/lib/text/store";

/** Marquesinas con `t.print()`: cada fila corre a su velocidad y sentido. El puntero ilumina la fila que toca. */
export function txMarquee(t: Textmodifier) {
  const ptr = createPointer(t);

  t.draw(() => {
    ptr.update();
    const s = t.secs;
    const text = textStore.text();
    const unit = `${text}  //  `;
    const L = unit.length;
    const { cols, rows, x0, y0 } = gridOrigin(t);
    const str = unit.repeat(Math.ceil(cols / L) + 2);

    t.background(6, 8, 18);
    t.printAlign("left", "top");
    for (let j = 0; j < rows; j += 2) {
      const dir = (j / 2) % 2 ? 1 : -1;
      const speed = 5 + 4 * Math.abs(Math.sin(j * 0.7));
      const off = (s * speed) % L;
      const startX = dir < 0 ? x0 - off : x0 - L + off;
      const y = y0 + j;
      const hot = Math.abs(y - ptr.y) < 2.5;
      const hue = (j * 0.012 + s * 0.03 + 0.55) % 1;

      if (hot) {
        t.cellColor(...hsv(hue, 0.7, 0.28));
        t.charColor(255, 240, 200);
      } else {
        t.cellColor(6, 8, 18);
        t.charColor(...hsv(hue, 0.55, 0.42 + 0.25 * Math.abs(Math.sin(j))));
      }
      t.print(str, startX, y, { markup: false });
    }
  });
}
