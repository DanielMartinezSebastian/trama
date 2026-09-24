/**
 * Fuentes procedurales para asciify-engine.
 *
 * asciify-engine convierte imágenes, vídeo o canvas en arte de caracteres. Como el
 * proyecto no trae medios, cada demo dibuja su propia imagen animada en un canvas 2D
 * y el motor la convierte en cada fotograma.
 */

export type Pointer = {
  /** Posición normalizada 0..1 (suavizada). Sin puntero real, vaga sola. */
  x: number;
  y: number;
  down: boolean;
  /** true si hay un puntero real sobre el lienzo */
  active: boolean;
};

/** Progreso de scroll que leen las escenas "con progreso": `p` 0–1 y velocidad `v` -1..1. */
export type Progress = { p: number; v: number };

export type Painter = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  p: Pointer,
  /** progreso propio de quien pinta; sin él, las escenas leen el `scrollState` global de las demos */
  s?: Progress,
) => void;

export type SourceKind =
  | "lava"
  | "synthwave"
  | "galaxy"
  | "waves"
  | "rings"
  | "plasma"
  | "torus"
  | "text"
  | "kaleido"
  | "rain"
  | "orbs"
  | "bigtext"
  | "bigglow"
  | "figlet"
  | "elastic"
  | "tide"
  | "wave"
  | "cube"
  | "pyramid"
  | "sphere"
  | "cylinder"
  | "cone"
  | "octahedron"
  | "tetrahedron"
  | "icosahedron"
  | "hexprism"
  | "diamond"
  | "torusknot"
  | "brew"
  | "bloom"
  | "arcade";

import { BOLD_FONT, fitLines } from "@/lib/text/mask";
import { scrollState } from "@/lib/scroll/store";
import { themePainters } from "./theme-painters";
import { shapePainters } from "./shape-painters";
import { textStore } from "@/lib/text/store";

const TAU = Math.PI * 2;

function fillBg(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
}

/** Metaballs de lava: gradientes radiales sumados. El puntero arrastra una gota grande. */
const lava = (): Painter => {
  const balls = Array.from({ length: 9 }, (_, i) => ({
    fx: 0.25 + i * 0.09,
    fy: 0.2 + ((i * 37) % 9) * 0.05,
    ph: i * 1.7,
    r: 0.12 + (((i * 53) % 7) / 7) * 0.09,
  }));
  return (ctx, w, h, t, p) => {
    fillBg(ctx, w, h, "#12061f");
    ctx.globalCompositeOperation = "lighter";
    const R = Math.min(w, h);
    const blob = (x: number, y: number, r: number, hue: number, a: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `hsla(${hue},100%,60%,${a})`);
      g.addColorStop(0.55, `hsla(${hue + 20},100%,45%,${a * 0.55})`);
      g.addColorStop(1, `hsla(${hue + 40},100%,35%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    };
    balls.forEach((b, i) => {
      const x = w * (0.5 + 0.42 * Math.sin(t * b.fx + b.ph));
      const y = h * (0.5 + 0.4 * Math.cos(t * b.fy * 1.3 + b.ph * 1.3));
      blob(x, y, R * b.r * 1.7, (t * 14 + i * 32) % 360, 0.9);
    });
    blob(p.x * w, p.y * h, R * (p.down ? 0.34 : 0.24), 45, 1);
  };
};

/** Atardecer synthwave: sol a franjas, montañas y rejilla en perspectiva. */
const synthwave = (): Painter => (ctx, w, h, t, p) => {
  const hz = h * 0.56;
  const sky = ctx.createLinearGradient(0, 0, 0, hz);
  sky.addColorStop(0, "#07011c");
  sky.addColorStop(0.55, "#4b0f6b");
  sky.addColorStop(1, "#ff3d81");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, hz);

  // Sol
  const sx = w * (0.5 + (p.x - 0.5) * 0.12);
  const sr = h * 0.27;
  const sun = ctx.createLinearGradient(0, hz - sr * 1.9, 0, hz);
  sun.addColorStop(0, "#fff36b");
  sun.addColorStop(1, "#ff2d95");
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(sx, hz - sr * 0.9, sr, 0, TAU);
  ctx.fill();
  // Franjas que se ensanchan hacia abajo y se desplazan
  ctx.fillStyle = "#4b0f6b";
  for (let i = 0; i < 7; i++) {
    const k = ((i + (t * 0.25) % 1) / 7) ** 1.6;
    const y = hz - sr * 1.9 + sr * 1.9 * (0.35 + 0.65 * k);
    ctx.fillRect(sx - sr, y, sr * 2, 2 + k * sr * 0.16);
  }

  // Montañas
  ctx.fillStyle = "#16042e";
  ctx.beginPath();
  ctx.moveTo(0, hz);
  for (let x = 0; x <= w; x += 6) {
    const m = Math.abs(Math.sin(x * 0.012 + 1) * 0.6 + Math.sin(x * 0.031) * 0.4);
    ctx.lineTo(x, hz - m * h * 0.11);
  }
  ctx.lineTo(w, hz);
  ctx.fill();

  // Suelo y rejilla
  ctx.fillStyle = "#0d0224";
  ctx.fillRect(0, hz, w, h - hz);
  ctx.strokeStyle = "#ff2bd6";
  ctx.lineWidth = Math.max(1, h * 0.006);
  ctx.beginPath();
  const N = 14;
  for (let i = 0; i < N; i++) {
    const k = ((i + ((t * 0.5) % 1)) / N) ** 2.2;
    const y = hz + (h - hz) * k;
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  for (let k = -16; k <= 16; k++) {
    ctx.moveTo(w / 2 + k * w * 0.012, hz);
    ctx.lineTo(w / 2 + k * w * 0.17, h);
  }
  ctx.stroke();
  const glow = ctx.createLinearGradient(0, hz - 4, 0, hz + h * 0.08);
  glow.addColorStop(0, "rgba(255,120,220,0.9)");
  glow.addColorStop(1, "rgba(255,120,220,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, hz - 4, w, h * 0.08);
};

/** Galaxia espiral con brazos y núcleo brillante. El puntero mueve el centro. */
const galaxy = (): Painter => {
  const stars = Array.from({ length: 3400 }, (_, i) => {
    const r = Math.random() ** 0.65;
    const arm = i % 3;
    const jitter = (Math.random() + Math.random() + Math.random() - 1.5) * 0.5;
    return {
      r,
      a: (arm * TAU) / 3 + r * 5.2 + jitter,
      hue: 200 + r * 120 + Math.random() * 30,
      sz: 2.2 + Math.random() * 3.2,
    };
  });
  return (ctx, w, h, t, p) => {
    fillBg(ctx, w, h, "#03030c");
    ctx.globalCompositeOperation = "lighter";
    const cx = w * (0.5 + (p.x - 0.5) * 0.3);
    const cy = h * (0.5 + (p.y - 0.5) * 0.3);
    const R = Math.max(w, h) * 0.52;
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.35);
    core.addColorStop(0, "rgba(255,240,200,0.95)");
    core.addColorStop(0.3, "rgba(255,150,90,0.4)");
    core.addColorStop(1, "rgba(80,40,160,0)");
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, w, h);
    for (const s of stars) {
      const ang = s.a + t * (0.05 + 0.5 / (s.r * 6 + 0.6));
      const x = cx + Math.cos(ang) * s.r * R;
      const y = cy + Math.sin(ang) * s.r * R * 0.58;
      ctx.fillStyle = `hsl(${s.hue},90%,${65 + (1 - s.r) * 25}%)`;
      ctx.fillRect(x, y, s.sz * (w / 640), s.sz * (w / 640));
    }
  };
};

/** Bandas de olas apiladas con degradados. El puntero levanta una cresta. */
const waves = (): Painter => (ctx, w, h, t, p) => {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0a0a2a");
  bg.addColorStop(1, "#1a0b30");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  const bands = 7;
  for (let i = 0; i < bands; i++) {
    const y0 = h * (0.22 + i * 0.1);
    const amp = h * (0.035 + i * 0.012);
    const hue = (t * 12 + i * 34) % 360;
    const g = ctx.createLinearGradient(0, y0 - amp, 0, h);
    g.addColorStop(0, `hsl(${hue},90%,${62 - i * 3}%)`);
    g.addColorStop(1, `hsl(${hue + 30},80%,${22 - i}%)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 6) {
      const nx = x / w;
      const bump = Math.exp(-(((nx - p.x) * 5) ** 2)) * h * (p.down ? 0.2 : 0.09) * Math.sin(t * 3 + i);
      const y =
        y0 +
        Math.sin(x * 0.013 * (1 + i * 0.12) + t * (0.6 + i * 0.13) + i) * amp +
        Math.sin(x * 0.035 - t * 0.9 + i * 2) * amp * 0.3 -
        bump;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }
};

/** Anillos concéntricos giratorios que crecen desde el puntero. */
const rings = (): Painter => (ctx, w, h, t, p) => {
  fillBg(ctx, w, h, "#050510");
  const cx = w * p.x;
  const cy = h * p.y;
  const R = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));
  const N = 22;
  ctx.lineCap = "round";
  for (let i = 0; i < N; i++) {
    const k = (i + ((t * 0.6) % 1)) / N;
    const r = k * R;
    const rot = t * (i % 2 ? 1 : -1) * 0.8 + i;
    ctx.strokeStyle = `hsla(${(i * 22 + t * 40) % 360},95%,60%,${1 - k * 0.7})`;
    ctx.lineWidth = 2 + k * Math.min(w, h) * 0.05 * (p.down ? 1.6 : 1);
    ctx.beginPath();
    ctx.arc(cx, cy, r, rot, rot + Math.PI * 1.35);
    ctx.stroke();
  }
};

/** Plasma calculado por píxel a baja resolución. El puntero crea una onda. */
const plasma = (): Painter => {
  let buf: HTMLCanvasElement | null = null;
  return (ctx, w, h, t, p) => {
    const bw = 200;
    const bh = Math.max(2, Math.round((bw * h) / w));
    if (!buf || buf.width !== bw || buf.height !== bh) {
      buf = document.createElement("canvas");
      buf.width = bw;
      buf.height = bh;
    }
    const bctx = buf.getContext("2d")!;
    const img = bctx.createImageData(bw, bh);
    const d = img.data;
    const aspect = w / h;
    for (let y = 0; y < bh; y++) {
      for (let x = 0; x < bw; x++) {
        const u = x / bw;
        const v = y / bh;
        const dx = (u - p.x) * aspect;
        const dy = v - p.y;
        const dist = Math.hypot(dx, dy);
        const val =
          Math.sin(u * 9 * aspect * 0.5 + t) +
          Math.sin(v * 11 - t * 1.3) +
          Math.sin((u + v) * 8 + t * 0.7) +
          Math.sin(Math.hypot((u - 0.5) * aspect, v - 0.5) * 14 - t * 1.6) +
          Math.sin(dist * (p.down ? 26 : 16) - t * 4) * (p.active ? 1.2 : 0.5) * Math.exp(-dist * 2.4);
        const n = val * 0.2 + 0.5;
        const hue = (n * 300 + t * 20) % 360;
        // HSL simple → RGB
        const s = 0.85;
        const l = 0.28 + 0.4 * Math.max(0, Math.min(1, n));
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const hp = hue / 60;
        const xx = c * (1 - Math.abs((hp % 2) - 1));
        let r = 0,
          g = 0,
          b = 0;
        if (hp < 1) [r, g, b] = [c, xx, 0];
        else if (hp < 2) [r, g, b] = [xx, c, 0];
        else if (hp < 3) [r, g, b] = [0, c, xx];
        else if (hp < 4) [r, g, b] = [0, xx, c];
        else if (hp < 5) [r, g, b] = [xx, 0, c];
        else [r, g, b] = [c, 0, xx];
        const m = l - c / 2;
        const i = (y * bw + x) * 4;
        d[i] = (r + m) * 255;
        d[i + 1] = (g + m) * 255;
        d[i + 2] = (b + m) * 255;
        d[i + 3] = 255;
      }
    }
    bctx.putImageData(img, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(buf, 0, 0, w, h);
  };
};

/** Nube de puntos con forma de toro que gira. El puntero controla la rotación. */
const torus = (): Painter => {
  const pts: { x: number; y: number; z: number; u: number }[] = [];
  const A = 1;
  const B = 0.42;
  for (let i = 0; i < 70; i++) {
    for (let j = 0; j < 26; j++) {
      const u = (i / 70) * TAU;
      const v = (j / 26) * TAU;
      pts.push({
        x: (A + B * Math.cos(v)) * Math.cos(u),
        y: (A + B * Math.cos(v)) * Math.sin(u),
        z: B * Math.sin(v),
        u,
      });
    }
  }
  let ax = 0;
  let ay = 0;
  return (ctx, w, h, t, p) => {
    const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
    bg.addColorStop(0, "#150a2e");
    bg.addColorStop(1, "#03020a");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    ax += 0.012 + (p.y - 0.5) * 0.03;
    ay += 0.018 + (p.x - 0.5) * 0.04;
    const ca = Math.cos(ax),
      sa = Math.sin(ax),
      cb = Math.cos(ay),
      sb = Math.sin(ay);
    const S = Math.min(w, h) * 0.3 * (p.down ? 1.25 : 1);
    for (const q of pts) {
      // rotación X, luego Y
      const y1 = q.y * ca - q.z * sa;
      const z1 = q.y * sa + q.z * ca;
      const x2 = q.x * cb + z1 * sb;
      const z2 = -q.x * sb + z1 * cb;
      const persp = 3.2 / (3.2 - z2);
      const px = w / 2 + x2 * S * persp;
      const py = h / 2 + y1 * S * persp;
      const light = (z2 + 1.5) / 3;
      ctx.fillStyle = `hsla(${(q.u * 57.3 + t * 30) % 360},90%,${50 + light * 30}%,${0.55 + light * 0.45})`;
      const s = (3 + light * 5) * (w / 640) * persp;
      ctx.fillRect(px - s / 2, py - s / 2, s, s);
    }
  };
};

/** Palabras grandes deformadas por una onda vertical. */
const text = (): Painter => {
  const words = ["ASCII", "TEXTO", "ARTE", "RETRO"];
  return (ctx, w, h, t, p) => {
    fillBg(ctx, w, h, "#05060c");
    const period = 4;
    const idx = Math.floor(t / period) % words.length;
    const local = (t % period) / period;
    const fade = Math.min(1, local * 6, (1 - local) * 6);
    const word = words[idx];
    const size = Math.min(h * 0.62, (w * 0.92) / (word.length * 0.66));
    ctx.font = `900 ${size}px "Arial Black", Impact, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const g = ctx.createLinearGradient(0, h * 0.2, 0, h * 0.8);
    g.addColorStop(0, `hsl(${(t * 30) % 360},95%,65%)`);
    g.addColorStop(1, `hsl(${(t * 30 + 90) % 360},95%,55%)`);
    ctx.fillStyle = g;
    ctx.globalAlpha = fade;
    const amp = w * (0.02 + (p.active ? Math.abs(p.x - 0.5) * 0.12 : 0.01));
    const step = Math.max(2, Math.round(h / 90));
    for (let y = 0; y < h; y += step) {
      const off = Math.sin(y * 0.045 + t * 3) * amp;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, y, w, step);
      ctx.clip();
      ctx.fillText(word, w / 2 + off, h / 2 + size * 0.04);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  };
};

/** Caleidoscopio: doce sectores espejados con formas orbitando. */
const kaleido = (): Painter => (ctx, w, h, t, p) => {
  fillBg(ctx, w, h, "#07030f");
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.max(w, h) * 0.62;
  const N = 12;
  const spin = t * 0.15 + (p.x - 0.5) * 2;
  const reach = 0.8 + (p.y - 0.5) * 0.6;
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < N; i++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(spin + (i * TAU) / N);
    if (i % 2) ctx.scale(1, -1);
    for (let j = 0; j < 8; j++) {
      const r = R * (0.1 + 0.7 * Math.abs(Math.sin(t * 0.5 + j * 1.3)) * reach);
      const a = Math.sin(t * 0.7 + j * 2.1) * 0.25;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      const g = ctx.createRadialGradient(x, y, 0, x, y, R * 0.2);
      const hue = (j * 55 + t * 30) % 360;
      g.addColorStop(0, `hsla(${hue},100%,60%,0.95)`);
      g.addColorStop(1, `hsla(${hue},100%,50%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, R * 0.2, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.globalCompositeOperation = "source-over";
};

/** Lluvia de columnas luminosas tipo matriz. El puntero acelera las columnas cercanas. */
const rain = (): Painter => {
  let cols: { y: number; v: number; len: number }[] = [];
  let lastW = 0;
  return (ctx, w, h, _t, p) => {
    const cw = Math.max(6, Math.round(w / 64));
    const n = Math.ceil(w / cw);
    if (lastW !== w || cols.length !== n) {
      lastW = w;
      cols = Array.from({ length: n }, () => ({
        y: Math.random() * h * 1.5 - h * 0.5,
        v: 0.4 + Math.random() * 1.6,
        len: h * (0.15 + Math.random() * 0.4),
      }));
    }
    fillBg(ctx, w, h, "#000");
    for (let i = 0; i < n; i++) {
      const c = cols[i];
      const dx = (i * cw) / w - p.x;
      const near = Math.exp(-((dx * 7) ** 2)) * (p.down ? 2 : 1);
      c.y += c.v * (h / 160) * (1 + near * 2.5);
      if (c.y - c.len > h) {
        c.y = -Math.random() * h * 0.3;
        c.v = 0.4 + Math.random() * 1.6;
      }
      const g = ctx.createLinearGradient(0, c.y - c.len, 0, c.y);
      g.addColorStop(0, "rgba(0,255,120,0)");
      g.addColorStop(0.7, "rgba(0,255,120,0.9)");
      g.addColorStop(1, "rgba(220,255,240,1)");
      ctx.fillStyle = g;
      ctx.fillRect(i * cw, c.y - c.len, cw - 1, c.len);
    }
  };
};

/** Esferas luminosas con estela. El puntero las atrae. */
const orbs = (): Painter => {
  const balls = Array.from({ length: 22 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.004,
    vy: (Math.random() - 0.5) * 0.004,
    hue: i * 23,
    r: 0.055 + Math.random() * 0.06,
  }));
  let first = true;
  return (ctx, w, h, t, p) => {
    if (first) {
      fillBg(ctx, w, h, "#05050f");
      first = false;
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(5,5,15,0.16)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    for (const b of balls) {
      if (p.active) {
        const dx = p.x - b.x;
        const dy = p.y - b.y;
        const d = Math.hypot(dx, dy) + 0.001;
        const f = (p.down ? -1 : 1) * 0.00005 / d;
        b.vx += dx * f * 40;
        b.vy += dy * f * 40;
      }
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < 0 || b.x > 1) b.vx *= -1;
      if (b.y < 0 || b.y > 1) b.vy *= -1;
      b.x = Math.min(1, Math.max(0, b.x));
      b.y = Math.min(1, Math.max(0, b.y));
      const sp = Math.hypot(b.vx, b.vy);
      if (sp > 0.012) {
        b.vx *= 0.97;
        b.vy *= 0.97;
      }
      const r = b.r * Math.min(w, h);
      const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, r);
      const hue = (b.hue + t * 20) % 360;
      g.addColorStop(0, `hsla(${hue},100%,65%,1)`);
      g.addColorStop(1, `hsla(${hue},100%,50%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x * w, b.y * h, r, 0, TAU);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  };
};

/**
 * Texto del usuario en letras gigantes, deformado por una onda y por el puntero.
 * `glow` lo dibuja en blanco con halo (mejor para braille o dither).
 */
const bigtext = (glow: boolean): Painter => (ctx, w, h, t, p) => {
  fillBg(ctx, w, h, glow ? "#02030a" : "#0a0616");
  const { lines, size } = fitLines(ctx, textStore.text(), w, h);
  ctx.font = BOLD_FONT(size);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (glow) {
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#7fd6ff";
    ctx.shadowBlur = size * 0.1;
  } else {
    const g = ctx.createLinearGradient(0, h * 0.2, w, h * 0.8);
    g.addColorStop(0, `hsl(${(t * 30) % 360},95%,62%)`);
    g.addColorStop(0.5, `hsl(${(t * 30 + 120) % 360},95%,58%)`);
    g.addColorStop(1, `hsl(${(t * 30 + 240) % 360},95%,62%)`);
    ctx.fillStyle = g;
  }
  const lh = size * 1.08;
  const top = h / 2 - ((lines.length - 1) * lh) / 2;
  const step = Math.max(3, Math.round(h / 80));
  for (let y = 0; y < h; y += step) {
    const bump = Math.exp(-(((y / h - p.y) * 7) ** 2)) * w * (p.down ? 0.09 : 0.05) * Math.sin(t * 7);
    const off = Math.sin(y * 0.05 + t * 2.6) * w * 0.012 + bump;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y, w, step);
    ctx.clip();
    lines.forEach((l, i) => ctx.fillText(l, w / 2 + off, top + i * lh + size * 0.04));
    ctx.restore();
  }
  ctx.shadowBlur = 0;
};

/**
 * Arte de texto generado por asciify-engine (FIGlet de `createStudioText`, o la fuente
 * bitmap 7×7 de `renderTextToCanvas`) usado como imagen fuente para los estilos Studio.
 */
const figlet = (): Painter => {
  let art: HTMLCanvasElement | null = null;
  let key = "";
  let pending = "";
  let timer: ReturnType<typeof setTimeout> | undefined;

  const request = (text: string, font: string) => {
    const k = `${font}|${text}`;
    if (k === key || k === pending) return;
    pending = k;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      let canvas: HTMLCanvasElement;
      if (font === "Bitmap") {
        const core = await import("asciify-engine/core");
        canvas = document.createElement("canvas");
        core.renderTextToCanvas(canvas, text, { color: "#ffffff", bgColor: "#080808", scale: 1, fontSize: 10 });
      } else {
        const studio = await import("asciify-engine/studio");
        const r = await studio.createStudioText(text.slice(0, 60), font as Parameters<typeof studio.createStudioText>[1], "#ffffff");
        canvas = r.canvas;
      }
      if (pending === k) {
        // El fondo #080808 de la librería se convertiría en una rejilla de puntos: se lleva a negro puro
        const c2d = canvas.getContext("2d");
        if (c2d && canvas.width && canvas.height) {
          const img = c2d.getImageData(0, 0, canvas.width, canvas.height);
          const d = img.data;
          for (let i = 0; i < d.length; i += 4) {
            d[i] = Math.max(0, (d[i] - 14) * 1.06);
            d[i + 1] = Math.max(0, (d[i + 1] - 14) * 1.06);
            d[i + 2] = Math.max(0, (d[i + 2] - 14) * 1.06);
          }
          c2d.putImageData(img, 0, 0);
        }
        art = canvas;
        key = k;
      }
    }, 150);
  };

  return (ctx, w, h, t, p) => {
    fillBg(ctx, w, h, "#000");
    request(textStore.text(), textStore.get().font);
    if (!art || !art.width || !art.height) return;
    const s = Math.min((w * 0.94) / art.width, (h * 0.9) / art.height);
    const dw = art.width * s;
    const dh = art.height * s;
    ctx.imageSmoothingEnabled = false;
    const wob = Math.sin(t * 1.6) * h * 0.012 + (p.y - 0.5) * h * 0.04;
    ctx.drawImage(art, (w - dw) / 2 + (p.x - 0.5) * w * 0.04, (h - dh) / 2 + wob, dw, dh);
  };
};

/**
 * Texto que se estira con la velocidad del scroll: cuanto más rápido bajas, más se alarga
 * y más copias fantasma deja detrás. En reposo vuelve a su forma.
 */
const elastic = (): Painter => (ctx, w, h, _t, p, s = scrollState) => {
  fillBg(ctx, w, h, "#05060f");
  const { lines, size } = fitLines(ctx, textStore.text(), w, h * 0.8);
  const v = s.v;
  const stretch = 1 + Math.abs(v) * 0.9;
  ctx.font = BOLD_FONT(size);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lh = size * 1.08;
  const top = h / 2 - ((lines.length - 1) * lh) / 2;
  const ghosts = 7;
  for (let g = ghosts; g >= 0; g--) {
    const off = g * v * h * 0.035;
    const hue = (s.p * 300 + 200 + g * 8) % 360;
    ctx.save();
    ctx.translate(w / 2 + (p.x - 0.5) * w * 0.03, h / 2 + off);
    ctx.scale(1, stretch);
    ctx.translate(-w / 2, -h / 2);
    ctx.globalAlpha = g === 0 ? 1 : 0.16;
    ctx.fillStyle = `hsl(${hue},90%,${g === 0 ? 62 : 55}%)`;
    lines.forEach((l, i) => ctx.fillText(l, w / 2, top + i * lh + size * 0.04));
    ctx.restore();
  }
  ctx.globalAlpha = 1;
};

export const painters: Record<SourceKind, () => Painter> = {
  ...themePainters,
  ...shapePainters,
  elastic,
  bigtext: () => bigtext(false),
  bigglow: () => bigtext(true),
  figlet,
  lava,
  synthwave,
  galaxy,
  waves,
  rings,
  plasma,
  torus,
  text,
  kaleido,
  rain,
  orbs,
};
