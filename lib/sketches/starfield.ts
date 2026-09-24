import type { Textmodifier } from "textmode.js";
import { aspect, clamp01, createPointer, hsv, plot } from "@/lib/cells";

type Star = { x: number; y: number; z: number; hue: number };

/** Viaje a velocidad de warp. El puntero orienta el punto de fuga; mantener pulsado activa el hiperespacio. */
export function starfield(t: Textmodifier) {
  const ptr = createPointer(t);
  const COUNT = 1100;
  const stars: Star[] = Array.from({ length: COUNT }, () => make(true));
  let boost = 0;
  let cx = 0;
  let cy = 0;

  function make(initial: boolean): Star {
    return {
      x: (Math.random() * 2 - 1) * 1.6,
      y: (Math.random() * 2 - 1) * 1.6,
      z: initial ? Math.random() : 1,
      hue: Math.random() < 0.7 ? 0.58 : 0.08,
    };
  }

  t.draw(() => {
    ptr.update();
    const asp = aspect(t);
    const cols = t.grid!.cols;
    const rows = t.grid!.rows;
    boost += ((ptr.pressed ? 1 : 0) - boost) * 0.06;
    cx += (ptr.x * 0.55 - cx) * 0.08;
    cy += (ptr.y * 0.55 - cy) * 0.08;

    const speed = 0.006 + boost * 0.05;
    const sx = cols * 0.22;
    const sy = (cols * 0.22) / asp;
    const project = (s: Star, z: number): [number, number] => [
      Math.round(cx + (s.x / z) * sx),
      Math.round(cy + (s.y / z) * sy),
    ];

    t.background(2, 3, 10);
    t.lineWeight(1);
    for (const s of stars) {
      s.z -= speed;
      const [px, py] = project(s, s.z);
      if (s.z <= 0.03 || Math.abs(px) > cols || Math.abs(py) > rows) {
        Object.assign(s, make(false));
        continue;
      }
      const [tx, ty] = project(s, s.z + speed * (2 + boost * 16));
      const near = 1 - s.z;
      t.char(near > 0.85 ? "@" : near > 0.65 ? "#" : near > 0.4 ? "*" : near > 0.2 ? "+" : ".");
      t.charColor(...hsv(s.hue, 0.5 - near * 0.4, clamp01(0.25 + near * 0.9)));
      t.cellColor(0, 0, 0, 0);
      // En reposo basta un punto; las estelas solo aparecen al acelerar
      if (boost < 0.12) plot(t, px, py);
      else t.line(tx, ty, px, py);
    }
  });
}
