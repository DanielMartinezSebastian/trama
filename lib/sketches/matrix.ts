import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, plot } from "@/lib/cells";

const GLYPHS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]/\\|+=*:;#$%&@";

type Column = { head: number; speed: number; len: number; chars: string[] };

/** Lluvia digital. Las columnas cercanas al puntero se vuelven cian, aceleran y se descomponen. */
export function matrix(t: Textmodifier) {
  const ptr = createPointer(t);
  let columns: Column[] = [];
  let W = 0;
  let H = 0;

  const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

  const spawn = (initial: boolean): Column => {
    const len = 8 + Math.random() * 22;
    return {
      head: initial ? Math.random() * H * 1.4 - H * 0.2 : -len - Math.random() * H * 0.5,
      speed: 0.12 + Math.random() * 0.5,
      len,
      chars: Array.from({ length: H + 48 }, glyph),
    };
  };

  const rebuild = () => {
    W = t.grid!.cols;
    H = t.grid!.rows;
    columns = Array.from({ length: W }, () => spawn(true));
  };

  t.draw(() => {
    if (W !== t.grid!.cols || H !== t.grid!.rows) rebuild();
    ptr.update();
    const asp = aspect(t);
    const { x0, y0 } = gridOrigin(t);
    const R = 11 + (ptr.pressed ? 10 : 0);

    t.background(0, 6, 2);
    for (let i = 0; i < W; i++) {
      const c = columns[i];
      const x = x0 + i;
      const headY = y0 + c.head;
      const near = Math.hypot(x - ptr.x, (headY - ptr.y) * asp) < R;

      c.head += c.speed * (near ? 2.4 : 1);
      if (Math.random() < 0.06) c.chars[Math.floor(Math.random() * c.chars.length)] = glyph();
      if (c.head - c.len > H) columns[i] = spawn(false);

      for (let k = 0; k < c.len; k++) {
        const row = Math.floor(c.head) - k;
        if (row < 0 || row >= H) continue;
        const fade = 1 - k / c.len;
        const y = y0 + row;
        const hot = Math.hypot(x - ptr.x, (y - ptr.y) * asp) < R;

        t.char(hot && Math.random() < 0.4 ? glyph() : c.chars[row % c.chars.length]);
        if (k === 0) {
          t.charColor(hot ? 210 : 200, 255, hot ? 255 : 220);
        } else if (hot) {
          t.charColor(40 * fade, 220 * fade + 30, 255 * fade + 20);
        } else {
          t.charColor(0, 60 + 195 * fade * fade, 40 * fade);
        }
        t.cellColor(0, 8 + 14 * fade, 4);
        plot(t, x, y);
      }
    }
  });
}
