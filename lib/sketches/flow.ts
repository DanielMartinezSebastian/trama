import type { Textmodifier } from "textmode.js";
import { aspect, createPointer, gridOrigin, hsv, plot } from "@/lib/cells";

type Particle = { x: number; y: number; age: number; life: number; trail: number[] };

const TRAIL = 9;

/** Partículas sobre un campo de flujo de ruido. El puntero las atrae; pulsar las repele. */
export function flow(t: Textmodifier) {
  const ptr = createPointer(t);
  const ramp = t.createGlyphRamp(" .:-=+*#");
  const particles: Particle[] = [];

  const respawn = (p: Particle) => {
    const { cols, rows, x0, y0 } = gridOrigin(t);
    p.x = x0 + Math.random() * cols;
    p.y = y0 + Math.random() * rows;
    p.age = 0;
    p.life = 120 + Math.random() * 260;
    p.trail = [];
  };

  // La rejilla no existe hasta el primer fotograma, así que las partículas se crean allí
  const init = () => {
    for (let i = 0; i < 800; i++) {
      const p: Particle = { x: 0, y: 0, age: 0, life: 0, trail: [] };
      respawn(p);
      p.age = Math.random() * p.life;
      particles.push(p);
    }
  };

  t.draw(() => {
    if (particles.length === 0) init();
    ptr.update();
    const s = t.secs;
    const asp = aspect(t);
    const { cols, rows, x0, y0 } = gridOrigin(t);
    const sign = ptr.pressed ? -1 : 1;

    t.background(5, 6, 14);
    for (const p of particles) {
      const n = t.noise(p.x * 0.025, p.y * 0.025 * asp, s * 0.07);
      const ang = n * Math.PI * 4;
      let vx = Math.cos(ang) * 0.5;
      let vy = (Math.sin(ang) * 0.5) / asp;

      const dx = ptr.x - p.x;
      const dy = (ptr.y - p.y) * asp;
      const d = Math.hypot(dx, dy) + 0.001;
      if (d < 34) {
        const pull = ((34 - d) / 34) * 0.9 * sign;
        vx += (dx / d) * pull;
        vy += ((dy / d) * pull) / asp;
      }

      p.x += vx;
      p.y += vy;
      p.age++;
      if (p.age % 2 === 0) {
        p.trail.push(p.x, p.y);
        if (p.trail.length > TRAIL * 2) p.trail.splice(0, 2);
      }
      if (p.age > p.life || p.x < x0 - 2 || p.x > x0 + cols + 2 || p.y < y0 - 2 || p.y > y0 + rows + 2) {
        respawn(p);
        continue;
      }

      const hue = 0.52 + (ang / (Math.PI * 4)) * 0.4;
      const len = p.trail.length / 2;
      for (let k = 0; k < len; k++) {
        const f = (k + 1) / len;
        t.char(ramp.at(f));
        t.charColor(...hsv(hue, 0.65, 0.25 + 0.75 * f));
        t.cellColor(...hsv(hue, 0.8, 0.06 * f));
        plot(t, Math.round(p.trail[k * 2]), Math.round(p.trail[k * 2 + 1]));
      }
    }
  });
}
