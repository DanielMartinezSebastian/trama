import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, hsv, plot } from "@/lib/cells";

/** Juego de la vida toroidal. Mover el puntero siembra células; pulsar siembra en grande. */
export function life(t: Textmodifier) {
  const ptr = createPointer(t);
  let W = 0;
  let H = 0;
  let alive = new Uint8Array(0);
  let scratch = new Uint8Array(0);
  let age = new Uint16Array(0);
  let ghost = new Float32Array(0);
  let steps = 0;

  const seed = (density: number, keep = false) => {
    for (let i = 0; i < W * H; i++) {
      if (keep && alive[i]) continue;
      if (Math.random() < density) alive[i] = 1;
    }
  };

  const rebuild = () => {
    W = t.grid!.cols;
    H = t.grid!.rows;
    alive = new Uint8Array(W * H);
    scratch = new Uint8Array(W * H);
    age = new Uint16Array(W * H);
    ghost = new Float32Array(W * H);
    seed(0.2);
  };

  const step = () => {
    let pop = 0;
    for (let y = 0; y < H; y++) {
      const ym = ((y + H - 1) % H) * W;
      const yp = ((y + 1) % H) * W;
      for (let x = 0; x < W; x++) {
        const xm = (x + W - 1) % W;
        const xp = (x + 1) % W;
        const n =
          alive[ym + xm] + alive[ym + x] + alive[ym + xp] +
          alive[y * W + xm] + alive[y * W + xp] +
          alive[yp + xm] + alive[yp + x] + alive[yp + xp];
        const i = y * W + x;
        const live = alive[i] ? n === 2 || n === 3 : n === 3;
        scratch[i] = live ? 1 : 0;
        if (live) {
          age[i] = alive[i] ? Math.min(age[i] + 1, 60) : 0;
          pop++;
        } else if (alive[i]) {
          ghost[i] = 1;
        }
      }
    }
    [alive, scratch] = [scratch, alive];
    steps++;
    if (pop < W * H * 0.012) seed(0.2);
    else if (steps % 500 === 0) seed(0.03, true);
  };

  t.draw(() => {
    if (W !== t.grid!.cols || H !== t.grid!.rows) rebuild();
    ptr.update();
    const { x0, y0 } = gridOrigin(t);

    if (ptr.raw) {
      const r = ptr.pressed ? 6 : 2;
      const p = ptr.pressed ? 0.6 : 0.3;
      const asp = aspect(t);
      const rx = Math.ceil(r * asp);
      const gx = Math.round(ptr.raw.x - x0);
      const gy = Math.round(ptr.raw.y - y0);
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -rx; dx <= rx; dx++) {
          if (Math.hypot(dx / asp, dy) > r) continue;
          const x = gx + dx;
          const y = gy + dy;
          if (x < 0 || y < 0 || x >= W || y >= H) continue;
          if (Math.random() < p) alive[y * W + x] = 1;
        }
      }
    }

    if (t.frameCount % 4 === 0) step();

    t.background(4, 5, 12);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (alive[i]) {
          const a = age[i];
          t.char(a < 2 ? "@" : a < 8 ? "O" : a < 24 ? "o" : "+");
          t.charColor(...hsv(0.5 + Math.min(a, 40) * 0.006, 0.55, a < 2 ? 1 : 0.85));
          t.cellColor(...hsv(0.55, 0.7, 0.14 + (a < 2 ? 0.14 : 0)));
          plot(t, x0 + x, y0 + y);
        } else if (ghost[i] > 0.05) {
          ghost[i] *= 0.9;
          t.char(".");
          t.charColor(...hsv(0.85, 0.6, ghost[i] * 0.9));
          t.cellColor(4, 5, 12);
          plot(t, x0 + x, y0 + y);
        }
      }
    }
  });
}
