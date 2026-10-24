import { spawnSync } from "node:child_process";

/**
 * Acabado de la imagen (docs/29 §1): lo que la luminancia, el contraste global y la paleta no ven y el ojo sí, medido
 * sobre la luminancia de un fotograma a resolución completa:
 * - detalle: energía media del laplaciano (textura y detalle fino; baja = imagen blanda o vacía);
 * - bordes: percentil 95 del gradiente (lo duros que son los contornos más marcados);
 * - contrasteLocal: desviación media en bloques de 16 px (modelado de las formas, sombras de contacto, relieve);
 * - brillos: fracción de píxeles casi blancos (especulares, emisivos, el bloom que los acompaña);
 * - grano: ruido residual (imagen menos su media 3 × 3) en las zonas planas (grano de película, dither, ruido de AO).
 * Se compara referencia y banco en pares de fotogramas y cada medida dice hacia dónde se va el banco.
 */
export type Acabado = { detalle: number; bordes: number; contrasteLocal: number; brillos: number; grano: number };

export function acabadoDe(png: string): Acabado | null {
  const r = spawnSync("ffmpeg", ["-loglevel", "error", "-i", png, "-f", "rawvideo", "-pix_fmt", "gray", "-"], { maxBuffer: 1 << 28 });
  const probe = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", png], { encoding: "utf8" });
  if (r.status !== 0 || !probe.stdout) return null;
  const [W, H] = probe.stdout.trim().split(",").map(Number);
  const g = new Float32Array(W * H);
  // a lineal aproximado (gamma 2,2): el detalle y el grano se miden en luz, no en valores de pantalla
  for (let i = 0; i < W * H; i++) g[i] = Math.pow(r.stdout[i] / 255, 2.2);
  const at = (x: number, y: number) => g[y * W + x];
  let lap = 0;
  let n = 0;
  const grads: number[] = [];
  const residuos: number[] = [];
  let brillos = 0;
  for (let y = 1; y < H - 1; y += 1)
    for (let x = 1; x < W - 1; x += 1) {
      const c = at(x, y);
      const l = at(x - 1, y) + at(x + 1, y) + at(x, y - 1) + at(x, y + 1) - 4 * c;
      lap += Math.abs(l);
      n++;
      const gx = at(x + 1, y) - at(x - 1, y);
      const gy = at(x, y + 1) - at(x, y - 1);
      const gm = Math.hypot(gx, gy);
      if ((x + y) % 3 === 0) grads.push(gm);
      if (c > 0.85) brillos++;
      // zonas planas: gradiente pequeño frente al nivel; el residuo frente a la media 3 × 3 es el grano
      if (gm < 0.01 + 0.05 * c && (x * 7 + y) % 5 === 0) {
        let m = 0;
        for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) m += at(x + i, y + j);
        residuos.push(Math.abs(c - m / 9));
      }
    }
  grads.sort((a, b) => a - b);
  residuos.sort((a, b) => a - b);
  let bloques = 0;
  let sumaDesv = 0;
  for (let by = 0; by + 16 <= H; by += 16)
    for (let bx = 0; bx + 16 <= W; bx += 16) {
      let s = 0;
      let s2 = 0;
      for (let y = by; y < by + 16; y++)
        for (let x = bx; x < bx + 16; x++) {
          const v = at(x, y);
          s += v;
          s2 += v * v;
        }
      const m = s / 256;
      sumaDesv += Math.sqrt(Math.max(0, s2 / 256 - m * m));
      bloques++;
    }
  return {
    detalle: lap / Math.max(1, n),
    bordes: grads[Math.floor(grads.length * 0.95)] ?? 0,
    contrasteLocal: sumaDesv / Math.max(1, bloques),
    brillos: brillos / Math.max(1, n),
    grano: residuos[residuos.length >> 1] ?? 0,
  };
}

/** media de varias medidas */
export function media(xs: Acabado[]): Acabado {
  const k = Math.max(1, xs.length);
  const s = (f: keyof Acabado) => xs.reduce((a, x) => a + x[f], 0) / k;
  return { detalle: s("detalle"), bordes: s("bordes"), contrasteLocal: s("contrasteLocal"), brillos: s("brillos"), grano: s("grano") };
}

const PALABRAS: Record<keyof Acabado, [string, string]> = {
  detalle: ["más blando (menos detalle fino)", "con más detalle fino o ruido"],
  bordes: ["contornos más suaves", "contornos más duros"],
  contrasteLocal: ["más plano (menos modelado y sombra)", "más contrastado de cerca"],
  brillos: ["menos brillos y especulares", "más brillos"],
  grano: ["más limpio (sin grano ni dither)", "con más grano"],
};

/**
 * Error relativo por medida (con suelo para valores casi nulos) y un 0–1 global ponderado. Los brillos se comparan en
 * escala logarítmica: pasar de 0,1 % a 1 % de la imagen es tanto como de 1 % a 10 %.
 */
export function compararAcabado(r: Acabado, b: Acabado) {
  const pesos: Record<keyof Acabado, number> = { detalle: 0.3, bordes: 0.15, contrasteLocal: 0.25, brillos: 0.15, grano: 0.15 };
  const suelo: Record<keyof Acabado, number> = { detalle: 2e-4, bordes: 2e-3, contrasteLocal: 1e-3, brillos: 1e-4, grano: 2e-5 };
  const filas = (Object.keys(pesos) as (keyof Acabado)[]).map((k) => {
    const a = r[k] + suelo[k];
    const c = b[k] + suelo[k];
    const error = k === "brillos" ? Math.min(1, Math.abs(Math.log10(c / a)) / 1.5) : Math.min(1, Math.abs(c - a) / Math.max(a, c));
    return { medida: k, ref: r[k], banco: b[k], error, sentido: Math.abs(c - a) / Math.max(a, c) < 0.08 ? "igual" : PALABRAS[k][c < a ? 0 : 1] };
  });
  const total = Math.min(1, filas.reduce((s, f) => s + f.error * pesos[f.medida], 0));
  return { total, filas };
}
