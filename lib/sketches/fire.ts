import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, mix, plot, type RGB } from "@/lib/cells";

/** Paleta negro → rojo → naranja → amarillo → blanco */
function fireColor(h: number): RGB {
  if (h < 0.35) {
    const k = h / 0.35;
    return [mix(10, 200, k), mix(0, 30, k), mix(0, 10, k)];
  }
  if (h < 0.7) {
    const k = (h - 0.35) / 0.35;
    return [mix(200, 255, k), mix(30, 170, k), mix(10, 20, k)];
  }
  const k = (h - 0.7) / 0.3;
  return [255, mix(170, 255, k), mix(20, 210, k)];
}

/** Fuego estilo Doom. El puntero es una antorcha; pulsar la convierte en un soplete. */
export function fire(t: Textmodifier) {
  const ramp = t.createGlyphRamp(" .:-=+*#%@");
  const ptr = createPointer(t);
  let W = 0;
  let H = 0;
  let heat = new Float32Array(0);

  const rebuild = () => {
    W = t.grid!.cols;
    H = t.grid!.rows;
    heat = new Float32Array(W * H);
  };

  t.draw(() => {
    if (W !== t.grid!.cols || H !== t.grid!.rows) rebuild();
    ptr.update();
    const { x0, y0 } = gridOrigin(t);

    if (t.frameCount % 2 === 0) {
      // Combustible con lenguas de distinta altura, moduladas por ruido
      for (let x = 0; x < W; x++) {
        const fuel = t.noise(x * 0.09, t.secs * 0.5);
        heat[(H - 1) * W + x] = Math.min(1, 0.35 + fuel * 1.1 + Math.random() * 0.1);
      }

      const r = ptr.pressed ? 9 : 4;
      const asp = aspect(t);
      const rx = Math.ceil(r * asp);
      const gx = Math.round(ptr.x - x0);
      const gy = Math.round(ptr.y - y0);
      if (ptr.hovering) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -rx; dx <= rx; dx++) {
            const x = gx + dx;
            const y = gy + dy;
            if (x < 0 || y < 0 || x >= W || y >= H) continue;
            if (Math.hypot(dx / asp, dy) <= r) heat[y * W + x] = 1;
          }
        }
      }

      const decay = 1.9 / H;
      const wind = Math.sin(t.secs * 0.4) * 0.6;
      for (let y = 0; y < H - 1; y++) {
        for (let x = 0; x < W; x++) {
          // Cada celda toma calor de la de abajo, ladeada al azar y por el viento
          const sx = Math.min(W - 1, Math.max(0, x + Math.round(Math.random() * 2 - 1 + wind)));
          const src = (heat[(y + 1) * W + sx] * 2 + heat[(y + 1) * W + x]) / 3;
          heat[y * W + x] = Math.max(0, src - decay * (0.5 + Math.random()));
        }
      }
    }

    t.background(8, 4, 8);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const h = heat[y * W + x];
        if (h < 0.03) continue;
        const [r, g, b] = fireColor(h);
        t.char(ramp.at(h));
        t.charColor(Math.min(255, r * 1.25), Math.min(255, g * 1.2 + 20), b);
        t.cellColor(r * 0.45, g * 0.4, b * 0.4);
        plot(t, x0 + x, y0 + y);
      }
    }
  });
}
