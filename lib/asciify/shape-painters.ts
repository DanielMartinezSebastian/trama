/**
 * Sólidos geométricos básicos como nube de "píxeles" cuadrados que gira, con el mismo lenguaje
 * visual que el toro: fondo oscuro, color por posición sobre la superficie y rotación guiada por el
 * puntero. A diferencia del toro, cada punto lleva su normal: se descartan las caras traseras y se
 * sombrea con una luz fija, de modo que la forma se lee como un bloque duro y no como una nube.
 */
import type { Painter } from "./painters";

const TAU = Math.PI * 2;

type V3 = [number, number, number];
type Pt = { x: number; y: number; z: number; nx: number; ny: number; nz: number; u: number; r: number };
type Solid = { pts: Pt[]; /** separación media entre puntos, en unidades del modelo */ step: number; /** ordenar por profundidad (sólidos cóncavos) */ sort?: boolean };

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** Añade un punto; `u` (matiz) sale del ángulo alrededor del eje vertical. */
function push(out: Pt[], p: V3, n: V3) {
  const h = Math.sin(out.length * 127.1 + 311.7) * 43758.5453;
  out.push({ x: p[0], y: p[1], z: p[2], nx: n[0], ny: n[1], nz: n[2], u: Math.atan2(p[2], p[0]) + Math.PI, r: h - Math.floor(h) });
}

/** Normal de una cara, orientada hacia fuera (el origen queda dentro de todos los sólidos). */
function faceNormal(a: V3, b: V3, c: V3): V3 {
  let n = norm(cross(sub(b, a), sub(c, a)));
  const cx = (a[0] + b[0] + c[0]) / 3, cy = (a[1] + b[1] + c[1]) / 3, cz = (a[2] + b[2] + c[2]) / 3;
  if (n[0] * cx + n[1] * cy + n[2] * cz < 0) n = [-n[0], -n[1], -n[2]];
  return n;
}

function tri(out: Pt[], A: V3, B: V3, C: V3, n: number) {
  const nm = faceNormal(A, B, C);
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n - i; j++) {
      const a = i / n, b = j / n, c = 1 - a - b;
      push(out, [A[0] * c + B[0] * a + C[0] * b, A[1] * c + B[1] * a + C[1] * b, A[2] * c + B[2] * a + C[2] * b], nm);
    }
  }
}

function quad(out: Pt[], A: V3, B: V3, D: V3, n: number, m = n) {
  const nm = faceNormal(A, B, D);
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      const s = i / n, t = j / m;
      push(out, [A[0] + (B[0] - A[0]) * s + (D[0] - A[0]) * t, A[1] + (B[1] - A[1]) * s + (D[1] - A[1]) * t, A[2] + (B[2] - A[2]) * s + (D[2] - A[2]) * t], nm);
    }
  }
}

/** Disco relleno en el plano y = `y`, con anillos concéntricos de densidad constante. */
function disc(out: Pt[], y: number, r: number, ny: number, step: number) {
  push(out, [0, y, 0], [0, ny, 0]);
  for (let r0 = step; r0 <= r + 1e-6; r0 += step) {
    const m = Math.max(6, Math.round((TAU * r0) / step));
    for (let k = 0; k < m; k++) push(out, [Math.cos((k / m) * TAU) * r0, y, Math.sin((k / m) * TAU) * r0], [0, ny, 0]);
  }
}

const cube = (): Solid => {
  const s = 0.8, n = 22;
  const c = (x: number, y: number, z: number): V3 => [x * s, y * s, z * s];
  const pts: Pt[] = [];
  quad(pts, c(-1, -1, 1), c(1, -1, 1), c(-1, 1, 1), n); // frente
  quad(pts, c(-1, -1, -1), c(1, -1, -1), c(-1, 1, -1), n); // fondo
  quad(pts, c(-1, -1, -1), c(-1, -1, 1), c(-1, 1, -1), n); // izquierda
  quad(pts, c(1, -1, -1), c(1, -1, 1), c(1, 1, -1), n); // derecha
  quad(pts, c(-1, -1, -1), c(1, -1, -1), c(-1, -1, 1), n); // arriba
  quad(pts, c(-1, 1, -1), c(1, 1, -1), c(-1, 1, 1), n); // abajo
  return { pts, step: (2 * s) / n };
};

const pyramid = (): Solid => {
  const h = 0.9, b = 0.95, n = 26;
  const apex: V3 = [0, -h, 0];
  const c: V3[] = [[-b, h * 0.9, -b], [b, h * 0.9, -b], [b, h * 0.9, b], [-b, h * 0.9, b]];
  const pts: Pt[] = [];
  for (let i = 0; i < 4; i++) tri(pts, apex, c[i], c[(i + 1) % 4], n);
  quad(pts, c[0], c[1], c[3], n);
  return { pts, step: (2 * b) / n * 1.05 };
};

const octahedron = (): Solid => {
  const r = 1.15, n = 24;
  const v: V3[] = [[r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0], [0, 0, r], [0, 0, -r]];
  const pts: Pt[] = [];
  for (const sx of [0, 1]) for (const sy of [2, 3]) for (const sz of [4, 5]) tri(pts, v[sx], v[sy], v[sz], n);
  return { pts, step: (r * Math.SQRT2) / n };
};

const tetrahedron = (): Solid => {
  const k = 0.85, n = 32;
  const v: V3[] = [[k, k, k], [k, -k, -k], [-k, k, -k], [-k, -k, k]];
  const pts: Pt[] = [];
  tri(pts, v[0], v[1], v[2], n);
  tri(pts, v[0], v[1], v[3], n);
  tri(pts, v[0], v[2], v[3], n);
  tri(pts, v[1], v[2], v[3], n);
  return { pts, step: (k * 2 * Math.SQRT2) / n };
};

const sphere = (): Solid => {
  const N = 1700, R = 1.05, ga = Math.PI * (3 - Math.sqrt(5));
  const pts: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N;
    const rr = Math.sqrt(1 - y * y);
    const nrm: V3 = [Math.cos(ga * i) * rr, y, Math.sin(ga * i) * rr];
    push(pts, [nrm[0] * R, nrm[1] * R, nrm[2] * R], nrm);
  }
  return { pts, step: Math.sqrt((4 * Math.PI * R * R) / N) * 1.05 };
};

const cylinder = (): Solid => {
  const r = 0.75, half = 0.9, step = 0.075;
  const pts: Pt[] = [];
  const m = Math.round((TAU * r) / step);
  const rows = Math.round((2 * half) / step);
  for (let j = 0; j <= rows; j++) {
    for (let k = 0; k < m; k++) {
      const a = (k / m) * TAU;
      push(pts, [Math.cos(a) * r, -half + (j / rows) * 2 * half, Math.sin(a) * r], [Math.cos(a), 0, Math.sin(a)]);
    }
  }
  disc(pts, -half, r, -1, step);
  disc(pts, half, r, 1, step);
  return { pts, step };
};

const cone = (): Solid => {
  const R = 0.95, H = 1.9, step = 0.075;
  const pts: Pt[] = [];
  const slant = Math.hypot(R, H);
  const rows = Math.round(slant / step);
  for (let j = 0; j <= rows; j++) {
    const f = j / rows; // 0 = ápice, 1 = base
    const rr = R * f;
    const m = Math.max(1, Math.round((TAU * rr) / step));
    for (let k = 0; k < m; k++) {
      const a = (k / m) * TAU;
      push(pts, [Math.cos(a) * rr, -H / 2 + H * f, Math.sin(a) * rr], norm([Math.cos(a) * H, -R, Math.sin(a) * H]));
    }
  }
  disc(pts, H / 2, R, 1, step);
  return { pts, step };
};


const icosahedron = (): Solid => {
  const phi = (1 + Math.sqrt(5)) / 2, R = 1.1, n = 22;
  const raw: V3[] = [];
  for (const a of [-1, 1]) for (const b of [-phi, phi]) raw.push([0, a, b], [a, b, 0], [b, 0, a]);
  const len = Math.hypot(...raw[0]);
  const v = raw.map((p): V3 => [(p[0] / len) * R, (p[1] / len) * R, (p[2] / len) * R]);
  const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const edge = Math.min(...v.slice(1).map((p) => dist(v[0], p)));
  const adj = (a: V3, b: V3) => Math.abs(dist(a, b) - edge) < 1e-6;
  const pts: Pt[] = [];
  for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) for (let k = j + 1; k < v.length; k++) {
    if (adj(v[i], v[j]) && adj(v[j], v[k]) && adj(v[i], v[k])) tri(pts, v[i], v[j], v[k], n);
  }
  return { pts, step: (edge / n) * 1.05 };
};

const hexprism = (): Solid => {
  const r = 0.9, half = 0.8, n = 22;
  const top = (i: number): V3 => [Math.cos((i / 6) * TAU) * r, -half, Math.sin((i / 6) * TAU) * r];
  const bot = (i: number): V3 => [Math.cos((i / 6) * TAU) * r, half, Math.sin((i / 6) * TAU) * r];
  const pts: Pt[] = [];
  for (let i = 0; i < 6; i++) quad(pts, top(i), top(i + 1), bot(i), Math.round(n * 0.6), Math.round(n * 1.1));
  for (let i = 0; i < 6; i++) {
    tri(pts, [0, -half, 0], top(i), top(i + 1), 12);
    tri(pts, [0, half, 0], bot(i), bot(i + 1), 12);
  }
  return { pts, step: r / 13 };
};

const diamond = (): Solid => {
  const H = 1.25, r = 0.85, n = 22;
  const e = (i: number): V3 => [Math.cos((i / 6) * TAU) * r, 0, Math.sin((i / 6) * TAU) * r];
  const pts: Pt[] = [];
  for (let i = 0; i < 6; i++) {
    tri(pts, [0, -H, 0], e(i), e(i + 1), n);
    tri(pts, [0, H, 0], e(i), e(i + 1), n);
  }
  return { pts, step: (Math.hypot(r, H) / n) * 1.05 };
};

/** Nudo toroidal (2,3): tubo alrededor de una curva cerrada. Es cóncavo, así que se ordena por profundidad. */
const torusknot = (): Solid => {
  const M = 380, K = 12, tube = 0.17, sc = 0.31;
  const C = (t: number): V3 => [(2 + Math.cos(3 * t)) * Math.cos(2 * t) * sc, (2 + Math.cos(3 * t)) * Math.sin(2 * t) * sc, Math.sin(3 * t) * sc * 1.15];
  const pts: Pt[] = [];
  const d = 1e-3;
  for (let i = 0; i < M; i++) {
    const t = (i / M) * TAU;
    const p = C(t), a = C(t - d), b = C(t + d);
    const T = norm(sub(b, a));
    const acc: V3 = [b[0] + a[0] - 2 * p[0], b[1] + a[1] - 2 * p[1], b[2] + a[2] - 2 * p[2]];
    const dot = acc[0] * T[0] + acc[1] * T[1] + acc[2] * T[2];
    const N = norm([acc[0] - T[0] * dot, acc[1] - T[1] * dot, acc[2] - T[2] * dot]);
    const B = cross(T, N);
    for (let k = 0; k < K; k++) {
      const a2 = (k / K) * TAU;
      const nrm: V3 = [Math.cos(a2) * N[0] + Math.sin(a2) * B[0], Math.cos(a2) * N[1] + Math.sin(a2) * B[1], Math.cos(a2) * N[2] + Math.sin(a2) * B[2]];
      push(pts, [p[0] + nrm[0] * tube, p[1] + nrm[1] * tube, p[2] + nrm[2] * tube], nrm);
    }
  }
  return { pts, step: 0.1, sort: true };
};

const LIGHT = norm([-0.5, -0.7, 0.6]);

/** Efectos de hover propios de cada forma (se aplican a los puntos proyectados, alrededor del puntero). */
export type ShapeFx = "none" | "repel" | "magnify" | "twist" | "explode" | "wave" | "magnet" | "snap" | "stretch";

/**
 * Puesta en escena compartida por todos los sólidos: posición (fracción del lienzo, puede estar fuera de
 * 0..1 para recortar la forma contra el borde), escala y efecto de hover. Un consumidor (p. ej. una landing)
 * la modifica cada fotograma; el valor por defecto es "centrada, sin efecto", así que el resto de usos no cambian.
 */
export const shapeView = { x: 0.5, y: 0.5, s: 1, fx: "none" as ShapeFx };
export const resetShapeView = () => Object.assign(shapeView, { x: 0.5, y: 0.5, s: 1, fx: "none" as ShapeFx });

/** Convierte un constructor de sólido en un Painter con la misma puesta en escena que el toro. */
const make = (build: () => Solid) => (): Painter => {
  const { pts, step, sort } = build();
  let ax = 0.5;
  let ay = 0;
  let hv = 0; // intensidad del hover, con inercia
  const vis: { px: number; py: number; z: number; s: number; col: string }[] = [];
  return (ctx, w, h, t, p) => {
    const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
    bg.addColorStop(0, "#150a2e");
    bg.addColorStop(1, "#03020a");
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ax += 0.006 + (p.y - 0.5) * 0.03;
    ay += 0.016 + (p.x - 0.5) * 0.04;
    const ca = Math.cos(ax), sa = Math.sin(ax), cb = Math.cos(ay), sb = Math.sin(ay);
    const S = Math.min(w, h) * 0.3 * shapeView.s * (p.down ? 1.25 : 1);
    const cx = w * shapeView.x, cy = h * shapeView.y;
    const hue0 = t * 30;

    const fx = shapeView.fx;
    hv += ((p.active && fx !== "none" ? 1 : 0) - hv) * 0.12;
    const hx = p.x * w, hy = p.y * h;
    const R = Math.min(w, h) * 0.36;
    let n = 0;

    for (const q of pts) {
      // rotación X, luego Y (posición y normal)
      const ny1 = q.ny * ca - q.nz * sa;
      const nz1 = q.ny * sa + q.nz * ca;
      const nz2 = -q.nx * sb + nz1 * cb;
      if (nz2 < -0.02) continue; // cara trasera
      const nx2 = q.nx * cb + nz1 * sb;

      const y1 = q.y * ca - q.z * sa;
      const z1 = q.y * sa + q.z * ca;
      const x2 = q.x * cb + z1 * sb;
      const z2 = -q.x * sb + z1 * cb;
      const persp = 3.2 / (3.2 - z2);

      let px = cx + x2 * S * persp;
      let py = cy + y1 * S * persp;
      let s = step * S * persp * 1.25 + 1;

      if (hv > 0.01) {
        const dx = px - hx, dy = py - hy;
        const d = Math.hypot(dx, dy) || 1;
        let f = hv * Math.max(0, 1 - d / R);
        f = f * f * (3 - 2 * f);
        if (f > 0.002) {
          const ux = dx / d, uy = dy / d;
          if (fx === "repel") {
            px += ux * f * R * 0.9;
            py += uy * f * R * 0.9;
          } else if (fx === "magnify") {
            const k = 1 + 1.8 * f;
            px = hx + dx * k;
            py = hy + dy * k;
            s *= k;
          } else if (fx === "twist") {
            const a = f * 3.4, c = Math.cos(a), sn = Math.sin(a);
            px = hx + dx * c - dy * sn;
            py = hy + dx * sn + dy * c;
          } else if (fx === "explode") {
            px += ux * f * R * 1.5 + (q.r - 0.5) * f * R * 0.8;
            py += uy * f * R * 1.5 + (((q.r * 7.13) % 1) - 0.5) * f * R * 0.8;
            s *= 1 - f * 0.55;
          } else if (fx === "wave") {
            const o = Math.sin(d * 0.11 - t * 11) * f * R * 0.3;
            px += ux * o;
            py += uy * o;
          } else if (fx === "magnet") {
            px -= dx * f * 0.88;
            py -= dy * f * 0.88;
            s *= 1 + f;
          } else if (fx === "snap") {
            const g = 3 + f * R * 0.24;
            const m = Math.min(1, f * 2.5);
            px += (Math.round(px / g) * g - px) * m;
            py += (Math.round(py / g) * g - py) * m;
            s = s * (1 - m) + g * 0.9 * m;
          } else if (fx === "stretch") {
            px = hx + dx * (1 + 2.6 * f);
            py = hy + dy * (1 - 0.35 * f);
          }
        }
      }

      const lam = Math.max(0, nx2 * LIGHT[0] + ny1 * LIGHT[1] + nz2 * LIGHT[2]);
      const col = `hsl(${(q.u * 57.3 + hue0) % 360},85%,${22 + lam * 48}%)`;
      if (sort) {
        const v = (vis[n] ??= { px: 0, py: 0, z: 0, s: 0, col: "" });
        v.px = px; v.py = py; v.z = z2; v.s = s; v.col = col;
        n++;
      } else {
        ctx.fillStyle = col;
        ctx.fillRect(px - s / 2, py - s / 2, s, s);
      }
    }
    if (sort) {
      const list = vis.slice(0, n).sort((a, b) => a.z - b.z);
      for (const v of list) {
        ctx.fillStyle = v.col;
        ctx.fillRect(v.px - v.s / 2, v.py - v.s / 2, v.s, v.s);
      }
    }
  };
};

export const shapePainters = {
  cube: make(cube),
  pyramid: make(pyramid),
  sphere: make(sphere),
  cylinder: make(cylinder),
  cone: make(cone),
  octahedron: make(octahedron),
  tetrahedron: make(tetrahedron),
  icosahedron: make(icosahedron),
  hexprism: make(hexprism),
  diamond: make(diamond),
  torusknot: make(torusknot),
};
