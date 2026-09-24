import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, hsv, plot } from "@/lib/cells";
import { getTextMask } from "@/lib/text/mask";
import { textStore } from "@/lib/text/store";

type Pt = { x: number; y: number; z: number };

/**
 * Texto extruido en 3D: la máscara del texto se convierte en una nube de puntos con
 * profundidad que gira. El puntero controla la inclinación; pulsar acelera el giro.
 */
export function tx3d(t: Textmodifier) {
  const ptr = createPointer(t);
  let pts: Pt[] = [];
  let key = "";
  let yaw = 0;

  t.draw(() => {
    ptr.update();
    const s = t.secs;
    const asp = aspect(t);
    const { cols, rows } = gridOrigin(t);
    const mask = getTextMask(textStore.text(), cols, rows, asp);
    if (mask.key !== key) {
      key = mask.key;
      pts = [];
      const depth = Math.max(4, Math.round(rows * 0.09));
      const x0 = -Math.floor((cols - 1) / 2);
      const y0 = -Math.floor(rows / 2);
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++)
          if (mask.data[j * cols + i] > 140) {
            for (const z of [-depth, 0, depth]) {
              pts.push({ x: x0 + i, y: y0 + j, z });
            }
          }
      if (pts.length > 9000) pts = pts.filter((_, k) => k % Math.ceil(pts.length / 9000) === 0);
    }

    // pulsar hace girar el texto; al soltar vuelve suavemente a la posición frontal
    yaw = ptr.pressed ? yaw + 0.07 : yaw * 0.96;
    const ay = yaw + Math.sin(s * 0.6) * 0.7 + (ptr.x / cols) * 1.0;
    const ax = (ptr.y / rows) * 0.6;
    const ca = Math.cos(ay),
      sa = Math.sin(ay),
      cx = Math.cos(ax),
      sx = Math.sin(ax);
    const focal = cols * 1.6;

    type Proj = { px: number; py: number; z: number; hue: number };
    const out: Proj[] = [];
    for (const q of pts) {
      // giro en Y y luego en X
      const x1 = q.x * ca + q.z * sa;
      const z1 = -q.x * sa + q.z * ca;
      const y2 = q.y * cx - z1 * sx;
      const z2 = q.y * sx + z1 * cx;
      const k = focal / (focal + z2);
      out.push({ px: x1 * k, py: (y2 * k) / 1, z: z2, hue: (q.x / cols + 0.5 + s * 0.05) % 1 });
    }
    out.sort((a, b) => b.z - a.z); // de atrás hacia delante

    t.background(4, 5, 12);
    const near = -focal * 0.05;
    for (const o of out) {
      const f = Math.max(0, Math.min(1, (near - o.z) / (cols * 0.35) + 0.5));
      t.char(f > 0.7 ? "#" : f > 0.4 ? "+" : ".");
      t.charColor(...hsv(o.hue, 0.6, 0.3 + 0.7 * f));
      t.cellColor(...hsv(o.hue, 0.8, 0.02 + 0.1 * f));
      plot(t, Math.round(o.px), Math.round(o.py));
    }
  });
}
