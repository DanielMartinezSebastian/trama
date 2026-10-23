/**
 * Curvas de movimiento de la ficha (`Curva` en lib/cine/schema.ts): de texto a función t ∈ [0, 1] → [0, 1].
 * Las usa el banco para mover la cámara y `cine:analyze` para reconocer con qué curva se mueve una referencia (`fitCurve`).
 *
 * Familias: `linear`, `power1`–`power4` (= quad, cubic, quart, quint), `sine`, `expo`, `circ` y `back`, con `.in`, `.out`
 * o `.inOut` como en GSAP; `cubic-bezier(x1, y1, x2, y2)` como en CSS; `spring(k, c)` = muelle con rigidez k y
 * amortiguación c por fotograma a 60 Hz (el que usan Ánima y LinkPeek: x'' = −k·x − c·x'), normalizado para acabar en 1.
 */

export type Ease = (t: number) => number;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

const IN: Record<string, Ease> = {
  linear: (t) => t,
  power1: (t) => t * t,
  power2: (t) => t * t * t,
  power3: (t) => t ** 4,
  power4: (t) => t ** 5,
  sine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  expo: (t) => (t === 0 ? 0 : 2 ** (10 * t - 10)),
  circ: (t) => 1 - Math.sqrt(1 - t * t),
  back: (t) => 2.70158 * t ** 3 - 1.70158 * t * t,
};
const ALIAS: Record<string, string> = { quad: "power1", cubic: "power2", quart: "power3", quint: "power4", none: "linear" };

/** cubic-bezier de CSS: resuelve x(s) = t por Newton y bisección, y devuelve y(s) */
export function bezier(x1: number, y1: number, x2: number, y2: number): Ease {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (s: number) => ((ax * s + bx) * s + cx) * s;
  const sy = (s: number) => ((ay * s + by) * s + cy) * s;
  const dx = (s: number) => (3 * ax * s + 2 * bx) * s + cx;
  return (t) => {
    t = clamp01(t);
    let s = t;
    for (let i = 0; i < 8; i++) {
      const e = sx(s) - t;
      if (Math.abs(e) < 1e-6) return sy(s);
      const d = dx(s);
      if (Math.abs(d) < 1e-6) break;
      s -= e / d;
    }
    let lo = 0, hi = 1;
    s = t;
    for (let i = 0; i < 30; i++) {
      const x = sx(s);
      if (Math.abs(x - t) < 1e-6) break;
      if (x < t) lo = s;
      else hi = s;
      s = (lo + hi) / 2;
    }
    return sy(s);
  };
}

/** muelle integrado a 60 Hz desde 0 hacia 1, muestreado y normalizado en el tiempo hasta que se asienta */
export function spring(k: number, c: number): Ease {
  const xs: number[] = [];
  let x = 0, v = 0;
  for (let i = 0; i < 600; i++) {
    v += (1 - x) * k - v * c;
    x += v;
    xs.push(x);
    if (i > 10 && Math.abs(1 - x) < 1e-3 && Math.abs(v) < 1e-4) break;
  }
  const n = xs.length;
  return (t) => {
    const f = clamp01(t) * (n - 1);
    const i = Math.floor(f);
    return i >= n - 1 ? 1 : xs[i] + (xs[i + 1] - xs[i]) * (f - i);
  };
}

/** texto de la ficha → función. Lo que no se reconoce es lineal (y se avisa en desarrollo). */
export function ease(curva: string): Ease {
  const s = curva.trim().toLowerCase().replace(/\s+/g, "");
  let m = /^cubic-bezier\(([-\d.]+),([-\d.]+),([-\d.]+),([-\d.]+)\)$/.exec(s);
  if (m) return bezier(+m[1], +m[2], +m[3], +m[4]);
  m = /^spring\(([-\d.]+),([-\d.]+)\)$/.exec(s);
  if (m) return spring(+m[1], +m[2]);
  const [fam0, dir = "out"] = s.split(".");
  const fam = ALIAS[fam0] ?? fam0;
  const f = IN[fam];
  if (!f) {
    if (process.env.NODE_ENV !== "production") console.warn(`[cine] curva desconocida: ${curva}`);
    return IN.linear;
  }
  if (fam === "linear" || dir === "in") return (t) => f(clamp01(t));
  if (dir === "out") return (t) => 1 - f(1 - clamp01(t));
  return (t) => {
    t = clamp01(t);
    return t < 0.5 ? f(2 * t) / 2 : 1 - f(2 - 2 * t) / 2;
  };
}

/** curvas candidatas para reconocer una referencia, de la más simple a la más marcada */
export const CANDIDATAS: string[] = [
  "linear",
  ...["power1", "power2", "power3", "power4", "sine", "expo", "circ"].flatMap((f) => [`${f}.in`, `${f}.out`, `${f}.inOut`]),
  "back.out",
  "back.inOut",
];

/**
 * Qué curva explica mejor una serie de muestras (progreso normalizado 0–1 frente a tiempo normalizado 0–1). Devuelve las
 * mejores con su error cuadrático medio; `extra` añade candidatas (p. ej. las de la guía de estilo, `GUIDE_EASES`).
 */
export function fitCurve(samples: { t: number; v: number }[], extra: string[] = []): { curva: string; rmse: number }[] {
  if (samples.length < 3) return [];
  return [...CANDIDATAS, ...extra]
    .map((curva) => {
      const f = ease(curva);
      const se = samples.reduce((acc, s) => acc + (f(s.t) - s.v) ** 2, 0);
      return { curva, rmse: Math.sqrt(se / samples.length) };
    })
    .sort((a, b) => a.rmse - b.rmse);
}

/** interpolación lineal de vectores */
export const lerp3 = (a: number[], b: number[], t: number) => a.map((x, i) => x + (b[i] - x) * t) as [number, number, number];
