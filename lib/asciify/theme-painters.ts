/**
 * Escenas temáticas para las landings. Cada una es una imagen procedural que cambia
 * con el progreso 0–1 que recibe como sexto argumento (`s.p`; si no se pasa, el global
 * `scrollState` de las demos): así la transición entre secciones es una metamorfosis de la
 * propia escena y no un simple fundido.
 */
import { clamp, scrollState, smooth, span } from "@/lib/scroll/store";
import type { Painter } from "./painters";

const TAU = Math.PI * 2;

type RGB = [number, number, number];
const mixc = (a: RGB, b: RGB, k: number): RGB => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const css = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

/** Interpola entre fotogramas clave repartidos uniformemente en 0..1. */
function keyed(frames: RGB[], p: number): RGB {
  const f = clamp(p) * (frames.length - 1);
  const i = Math.min(frames.length - 2, Math.floor(f));
  return mixc(frames[i], frames[i + 1], smooth(f - i));
}

/** Pseudo-aleatorio determinista 0..1. */
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Surf: del amanecer a la noche, con el sol (y luego la luna) cruzando sobre olas en capas. */
const tide = (): Painter => {
  const SKY_TOP: RGB[] = [[43, 27, 77], [47, 143, 216], [58, 28, 113], [5, 10, 37]];
  const SKY_LOW: RGB[] = [[255, 154, 107], [191, 232, 255], [255, 106, 77], [20, 41, 90]];
  return (ctx, w, h, t, ptr, sp = scrollState) => {
    const p = sp.p;
    const top = keyed(SKY_TOP, p);
    const low = keyed(SKY_LOW, p);
    const hz = h * 0.56;
    const sky = ctx.createLinearGradient(0, 0, 0, hz);
    sky.addColorStop(0, css(top));
    sky.addColorStop(1, css(low));
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // estrellas al caer la noche
    const night = smooth(span(p, 0.72, 0.95));
    if (night > 0.02) {
      for (let i = 0; i < 90; i++) {
        const tw = 0.5 + 0.5 * Math.sin(t * 2 + i);
        ctx.fillStyle = `rgba(255,255,255,${night * tw})`;
        ctx.fillRect(rnd(i) * w, rnd(i + 99) * hz * 0.9, 2, 2);
      }
    }

    // sol → luna, en arco
    const arcT = clamp(p * 1.05);
    const sx = w * (0.12 + 0.76 * arcT) + (ptr.x - 0.5) * w * 0.05;
    const sy = hz - Math.sin(arcT * Math.PI) * h * 0.42;
    const moon = smooth(span(p, 0.74, 0.9));
    const sunCol: RGB = mixc([255, 226, 140], [235, 240, 255], moon);
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, h * 0.35);
    glow.addColorStop(0, css(sunCol, 0.9));
    glow.addColorStop(0.25, css(sunCol, 0.35));
    glow.addColorStop(1, css(sunCol, 0));
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, hz + h * 0.1);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = css(sunCol);
    ctx.beginPath();
    ctx.arc(sx, sy, h * (0.06 - moon * 0.015), 0, TAU);
    ctx.fill();

    // olas en capas
    const deep: RGB = keyed([[16, 110, 130], [20, 130, 170], [70, 40, 110], [8, 24, 60]], p);
    for (let i = 0; i < 6; i++) {
      const y0 = hz + i * h * 0.075;
      const amp = h * (0.012 + i * 0.008);
      const col = mixc(mixc(low, deep, 0.5 + i * 0.1), [0, 8, 20], i * 0.12);
      ctx.fillStyle = css(col);
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 6) {
        const bump = Math.exp(-(((x / w - ptr.x) * 5) ** 2)) * h * 0.03 * Math.sin(t * 3 + i);
        ctx.lineTo(x, y0 + Math.sin(x * 0.02 * (1 + i * 0.1) + t * (0.7 + i * 0.2) + i) * amp - bump);
      }
      ctx.lineTo(w, h);
      ctx.fill();
    }
    // brillo del sol sobre el agua
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 18; i++) {
      const yy = hz + 6 + i * (h * 0.02);
      const half = (8 + i * 6) * (0.6 + 0.4 * Math.sin(t * 2 + i));
      ctx.fillStyle = css(sunCol, 0.35 * (1 - i / 18));
      ctx.fillRect(sx - half, yy, half * 2, 2);
    }
    ctx.globalCompositeOperation = "source-over";
  };
};

/** Tostador: granos → vapor → latte art, con fundidos entre las tres escenas. */
const brew = (): Painter => (ctx, w, h, t, ptr, sp = scrollState) => {
  const p = sp.p;
  const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
  bg.addColorStop(0, "#3a2314");
  bg.addColorStop(1, "#120a06");
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // 1) granos en rejilla, que giran
  const beans = 1 - smooth(span(p, 0.25, 0.45));
  if (beans > 0.01) {
    ctx.globalAlpha = beans;
    const cw = w / 12;
    for (let j = -1; j < 8; j++) {
      for (let i = -1; i < 13; i++) {
        const x = (i + (j % 2 ? 0.5 : 0)) * cw;
        const y = j * cw * 0.85;
        const rot = Math.sin(t * 0.4 + i * 1.3 + j * 0.7) * 0.4 + i + j;
        const near = Math.exp(-((((x / w - ptr.x) ** 2 + ((y / h - ptr.y) * 0.6) ** 2)) * 14));
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = `rgb(${70 + near * 130},${40 + near * 70},${20 + near * 30})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, cw * 0.42, cw * 0.3, 0, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = `rgba(20,10,5,0.9)`;
        ctx.lineWidth = cw * 0.05;
        ctx.beginPath();
        ctx.moveTo(-cw * 0.38, 0);
        ctx.quadraticCurveTo(0, cw * 0.14, cw * 0.38, 0);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // 2) vapor que sube sobre una taza vista de perfil
  const steam = smooth(span(p, 0.3, 0.45)) * (1 - smooth(span(p, 0.62, 0.78)));
  if (steam > 0.01) {
    ctx.globalAlpha = steam;
    ctx.fillStyle = "#f2e2c8";
    ctx.beginPath();
    ctx.roundRect(w * 0.36, h * 0.62, w * 0.28, h * 0.26, [8, 8, h * 0.13, h * 0.13]);
    ctx.fill();
    ctx.lineWidth = w * 0.02;
    ctx.strokeStyle = "#f2e2c8";
    ctx.beginPath();
    ctx.arc(w * 0.66, h * 0.73, h * 0.08, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.lineCap = "round";
    for (let k = 0; k < 5; k++) {
      ctx.strokeStyle = `rgba(255,240,220,${0.35 - k * 0.04})`;
      ctx.lineWidth = w * (0.018 + k * 0.004);
      ctx.beginPath();
      for (let s = 0; s <= 30; s++) {
        const u = s / 30;
        const x = w * (0.42 + k * 0.04) + Math.sin(u * 7 - t * 1.4 + k) * w * 0.03 * (0.4 + u) + (ptr.x - 0.5) * w * 0.05 * u;
        const y = h * 0.6 - u * h * 0.5;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  // 3) latte art: anillos que se deforman en una hoja
  const art = smooth(span(p, 0.6, 0.8));
  if (art > 0.01) {
    ctx.globalAlpha = art;
    const cx = w / 2 + (ptr.x - 0.5) * w * 0.04;
    const cy = h / 2;
    const R = h * 0.42;
    ctx.fillStyle = "#5a3520";
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, TAU);
    ctx.fill();
    for (let i = 9; i >= 1; i--) {
      const r = (R * i) / 9;
      ctx.fillStyle = i % 2 ? "#f3e3c6" : "#8a5a37";
      ctx.beginPath();
      for (let a = 0; a <= 64; a++) {
        const th = (a / 64) * TAU;
        const wob = 1 + 0.16 * Math.sin(th * 6 + t * 0.6 + i * 0.5) * (1 - i / 10) - 0.22 * Math.max(0, Math.cos(th - Math.PI / 2)) * (i / 9);
        const x = cx + Math.cos(th) * r * wob;
        const y = cy + Math.sin(th) * r * wob * 0.92;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
};

/** Botánica: enredaderas que crecen con el scroll y acaban floreciendo. */
const bloom = (): Painter => {
  type Twig = { x: number; y: number; a: number; len: number; depth: number; id: number };
  return (ctx, w, h, t, ptr, sp = scrollState) => {
    const p = sp.p;
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#0a1f14");
    bg.addColorStop(1, "#04100a");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const growth = 0.4 + p * 0.95;
    const flowers = smooth(span(p, 0.55, 0.85));
    const sway = (ptr.x - 0.5) * 0.35;
    ctx.lineCap = "round";

    const grow = (tw: Twig, g: number) => {
      if (g <= 0 || tw.depth > 6) return;
      const len = tw.len * Math.min(1, g);
      const bend = Math.sin(t * 0.7 + tw.id) * 0.06 + sway * 0.15 * (tw.depth + 1) * 0.3;
      const a2 = tw.a + bend;
      const ex = tw.x + Math.cos(a2) * len;
      const ey = tw.y + Math.sin(a2) * len;
      const mx = tw.x + Math.cos(tw.a - 0.25) * len * 0.5;
      const my = tw.y + Math.sin(tw.a - 0.25) * len * 0.5;
      ctx.strokeStyle = `hsl(${120 + tw.depth * 8},${60 + tw.depth * 4}%,${34 + tw.depth * 6}%)`;
      ctx.lineWidth = Math.max(2, (9 - tw.depth) * (w / 560));
      ctx.beginPath();
      ctx.moveTo(tw.x, tw.y);
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.stroke();
      if (g < 1) return;
      // hoja
      if (tw.depth > 1) {
        ctx.fillStyle = `hsl(${105 + rnd(tw.id) * 40},65%,${34 + rnd(tw.id + 3) * 16}%)`;
        ctx.beginPath();
        ctx.ellipse(ex, ey, len * 0.28, len * 0.12, a2 + 1.2, 0, TAU);
        ctx.fill();
      }
      const g2 = g - 1;
      for (let k = 0; k < 2; k++) {
        const da = (k ? 1 : -1) * (0.45 + rnd(tw.id + k) * 0.4);
        grow({ x: ex, y: ey, a: a2 + da, len: tw.len * 0.74, depth: tw.depth + 1, id: tw.id * 2 + k + 1 }, g2);
      }
      // flor en las puntas
      if (tw.depth >= 5 && flowers > 0.02) {
        for (let pet = 0; pet < 6; pet++) {
          const pa = (pet / 6) * TAU + t * 0.3;
          ctx.fillStyle = `hsla(${330 + rnd(tw.id) * 40},85%,${62 + flowers * 10}%,${flowers})`;
          ctx.beginPath();
          ctx.ellipse(ex + Math.cos(pa) * 6 * flowers, ey + Math.sin(pa) * 6 * flowers, 5 * flowers, 3 * flowers, pa, 0, TAU);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(255,220,120,${flowers})`;
        ctx.beginPath();
        ctx.arc(ex, ey, 2.4 * flowers, 0, TAU);
        ctx.fill();
      }
    };

    const roots = [0.28, 0.5, 0.72];
    roots.forEach((rx, i) => grow({ x: w * rx, y: h + 4, a: -Math.PI / 2 + (i - 1) * 0.12, len: h * 0.24, depth: 0, id: i + 1 }, growth * 5.2));
  };
};

/** Arcade: bloques que caen → invasores → "INSERT COIN", en píxel grueso. */
const arcade = (): Painter => {
  const INV: string[] = ["00111100", "01111110", "11011011", "11111111", "00100100", "01011010"];
  return (ctx, w, h, t, ptr, sp = scrollState) => {
    const p = sp.p;
    const px = Math.max(4, Math.round(w / 80));
    const cols = Math.floor(w / px);
    const rows = Math.floor(h / px);
    const PAL = ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"];
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = PAL[0];
    ctx.fillRect(0, 0, w, h);
    const cell = (x: number, y: number, c: number) => {
      ctx.fillStyle = PAL[c];
      ctx.fillRect(x * px, y * px, px - 1, px - 1);
    };

    // rejilla tenue
    for (let y = 0; y < rows; y += 4) for (let x = 0; x < cols; x += 4) cell(x, y, 1);

    // 1) bloques que caen
    const blocks = 1 - smooth(span(p, 0.3, 0.42));
    if (blocks > 0.02) {
      for (let i = 0; i < 14; i++) {
        const col = Math.floor(rnd(i) * (cols - 4));
        const fall = (t * (3 + rnd(i + 9) * 4) + rnd(i + 3) * rows) % (rows + 6);
        const shape = [[0, 0], [1, 0], [2, 0], [1, 1]];
        const rot = Math.floor(rnd(i + 5) * 2);
        for (const [dx, dy] of shape) cell(col + (rot ? dy : dx), Math.floor(fall - 4 + (rot ? dx : dy)), 2 + (i % 2));
      }
    }

    // 2) invasores marchando y nave que sigue al puntero
    const inv = smooth(span(p, 0.28, 0.42)) * (1 - smooth(span(p, 0.68, 0.8)));
    if (inv > 0.02) {
      const step = Math.floor(t * 2);
      const ox = 6 + ((step % 10) - (step % 10 > 5 ? 2 * (step % 10 - 5) : 0)) * 2;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 6; c++) {
          const sx = ox + c * 11;
          const sy = 5 + r * 8 + Math.floor(inv * 0);
          INV.forEach((row, yy) => [...row].forEach((v, xx) => v === "1" && cell(sx + xx, sy + yy, 2 + (r % 2))));
        }
      }
      const shipX = Math.floor(ptr.x * (cols - 9));
      for (let xx = 0; xx < 9; xx++) cell(shipX + xx, rows - 4, 3);
      for (let xx = 3; xx < 6; xx++) cell(shipX + xx, rows - 5, 3);
      cell(shipX + 4, rows - 6, 3);
      const bulletY = rows - 8 - ((t * 20) % (rows - 10));
      cell(shipX + 4, Math.floor(bulletY), 3);
    }

    // 3) INSERT COIN
    const coin = smooth(span(p, 0.68, 0.82));
    if (coin > 0.02) {
      ctx.globalAlpha = coin;
      ctx.fillStyle = PAL[3];
      ctx.font = `bold ${px * 7}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText("INSERT", w / 2, h * 0.42);
      ctx.fillText("COIN", w / 2, h * 0.42 + px * 9);
      if (Math.floor(t * 2) % 2 === 0) {
        ctx.font = `bold ${px * 3}px monospace`;
        ctx.fillStyle = PAL[2];
        ctx.fillText("PRESS START", w / 2, h * 0.86);
      }
      ctx.globalAlpha = 1;
    }
  };
};


/**
 * Ola de surf en corte lateral: series de olas asimétricas (espalda suave, cara empinada) que avanzan
 * hacia la derecha, espuma en la cresta, gotas de rocío y un surfista bajando por la cara de la ola
 * delantera. Con `progress` el oleaje crece (mar plana → serie grande) y el cielo va del amanecer a la noche.
 */
const wave = (): Painter => {
  const SKY_TOP: RGB[] = [[43, 27, 77], [47, 143, 216], [58, 28, 113], [5, 10, 37]];
  const SKY_LOW: RGB[] = [[255, 154, 107], [191, 232, 255], [255, 106, 77], [20, 41, 90]];
  const SEA_TOP: RGB[] = [[90, 200, 190], [80, 210, 220], [120, 90, 160], [30, 80, 120]];
  const SEA_DEEP: RGB[] = [[6, 40, 70], [8, 60, 100], [20, 20, 60], [2, 10, 30]];

  /** Perfil de una ola: espalda que sube despacio y cara que cae en seco tras la cresta (u en 0..1). */
  const prof = (u: number) => {
    u -= Math.floor(u);
    return u < 0.8 ? Math.pow(u / 0.8, 2.2) : 1 - smooth((u - 0.8) / 0.2);
  };

  return (ctx, w, h, t, ptr, sp = scrollState) => {
    const p = sp.p;
    const size = 0.65 + 0.6 * smooth(span(p, 0.05, 0.75));
    const top = keyed(SKY_TOP, p);
    const low = keyed(SKY_LOW, p);
    const hz = h * 0.42;

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const sky = ctx.createLinearGradient(0, 0, 0, hz + h * 0.1);
    sky.addColorStop(0, css(top));
    sky.addColorStop(1, css(low));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // sol o luna
    const night = smooth(span(p, 0.72, 0.92));
    const arcT = clamp(p * 1.05);
    const sx = w * (0.15 + 0.7 * arcT);
    const sy = hz - Math.sin(arcT * Math.PI) * h * 0.3;
    const sunCol = mixc([255, 226, 140], [235, 240, 255], night);
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, h * 0.3);
    glow.addColorStop(0, css(sunCol, 0.8));
    glow.addColorStop(1, css(sunCol, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, hz + h * 0.1);
    ctx.fillStyle = css(sunCol);
    ctx.beginPath();
    ctx.arc(sx, sy, h * 0.05, 0, TAU);
    ctx.fill();

    const seaTop = keyed(SEA_TOP, p);
    const seaDeep = keyed(SEA_DEEP, p);
    const LAYERS = 5;
    const surface = (i: number, x: number) => {
      const k = i / (LAYERS - 1);
      const lambda = w * (0.42 + k * 0.5);
      const amp = h * (0.03 + k * k * 0.2) * size;
      const base = hz + h * (0.06 + k * 0.42);
      const speed = 0.06 + k * 0.05;
      return base - amp * prof(x / lambda - t * speed + i * 0.37) + Math.sin(x * 0.05 + t * 1.4 + i) * h * 0.004;
    };

    for (let i = 0; i < LAYERS; i++) {
      const k = i / (LAYERS - 1);
      const col = mixc(seaDeep, seaTop, 0.25 + k * 0.6);
      const yTop = hz + h * 0.02;
      const g = ctx.createLinearGradient(0, yTop, 0, h);
      g.addColorStop(0, css(mixc(col, seaTop, 0.5)));
      g.addColorStop(1, css(mixc(col, seaDeep, 0.6)));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w + 4; x += 4) ctx.lineTo(x, surface(i, x));
      ctx.lineTo(w, h);
      ctx.fill();

      // espuma: banda clara sobre la cresta y donde la cara cae en seco
      const foam = k > 0.2;
      if (foam) {
        ctx.fillStyle = css([240, 250, 255], 0.55 + k * 0.4);
        for (let x = 0; x <= w; x += 4) {
          const y = surface(i, x);
          const slope = y - surface(i, x + 6);
          if (slope > h * 0.006 * (1.4 - k)) ctx.fillRect(x, y - 1, 5, h * 0.012 + slope * 0.6);
        }
        // rocío que sale de las crestas
        ctx.fillStyle = css([255, 255, 255], 0.8);
        for (let n = 0; n < 26; n++) {
          const x = rnd(n * 7 + i * 131) * w;
          const life = (t * 0.7 + rnd(n + i * 17)) % 1;
          const y = surface(i, x) - life * h * 0.09 * size + life * life * h * 0.06;
          const slope = y - surface(i, x + 6);
          if (slope > -h) ctx.fillRect(x, y - h * 0.01, 3, 3);
        }
      }
    }

    // surfista en la cara de la ola delantera
    const last = LAYERS - 1;
    const rx = w * (0.4 + (ptr.x - 0.5) * 0.2);
    const ry = surface(last, rx);
    const ang = Math.atan2(surface(last, rx + 12) - surface(last, rx - 12), 24);
    const s = h * 0.05;
    ctx.save();
    ctx.translate(rx, ry - s * 0.15);
    ctx.rotate(ang * 0.8);
    ctx.fillStyle = css([12, 16, 24]);
    ctx.beginPath(); // tabla
    ctx.ellipse(0, 0, s * 1.5, s * 0.16, 0, 0, TAU);
    ctx.fill();
    ctx.fillRect(-s * 0.2, -s * 1.15, s * 0.42, s * 0.75); // torso
    ctx.fillRect(-s * 0.55, -s * 0.4, s * 0.32, s * 0.4); // pierna trasera
    ctx.fillRect(s * 0.2, -s * 0.4, s * 0.32, s * 0.4); // pierna delantera
    ctx.beginPath(); // cabeza
    ctx.arc(0, -s * 1.4, s * 0.2, 0, TAU);
    ctx.fill();
    ctx.fillRect(-s * 0.9, -s * 1.05, s * 0.7, s * 0.14); // brazos abiertos
    ctx.fillRect(s * 0.2, -s * 1.05, s * 0.7, s * 0.14);
    ctx.restore();
  };
};
export const themePainters = { tide, wave, brew, bloom, arcade };
