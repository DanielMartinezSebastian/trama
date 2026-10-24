import type { Muestra } from "./lib.mts";

/**
 * Respuesta de la cámara al puntero (docs/28 §2): para cada eje (guiñada y cabeceo en grados, desplazamiento x e y en
 * unidades de escena) ajusta un seguimiento de primer orden, z[k+1] = z[k] + a·(base + ganancia·p[k] − z[k]), con p el
 * puntero normalizado (−1…1, y hacia arriba). `a` es la fracción por fotograma a 60 Hz (el lerp del código), `ganancia` lo
 * que se mueve el eje con el puntero en el borde y r² la calidad del ajuste (1 = es exactamente ese modelo).
 * Así salió la cabeza de Hublot: −8° de guiñada, −4,8° de cabeceo, 3,9 y 2,2 cm, todo con a = 0,03 (r² 1,000).
 */
export type EjePuntero = { eje: "guinada" | "cabeceo" | "x" | "y"; seguimiento: number; ganancia: number; base: number; r2: number };

export function respuestaPuntero(ms: Muestra[], size: [number, number]): EjePuntero[] {
  const cams = ms.filter((m) => m.camera);
  if (!cams.some((m) => m.input?.pointer)) return [];
  const [W, H] = size;
  let ultimo: [number, number] = [W / 2, H / 2];
  const px: number[] = [];
  const py: number[] = [];
  for (const m of cams) {
    if (m.input?.pointer) ultimo = m.input.pointer;
    px.push((ultimo[0] / W) * 2 - 1);
    py.push(-((ultimo[1] / H) * 2 - 1));
  }
  const dir = (m: Muestra) => m.camera!.dir;
  const series: Record<EjePuntero["eje"], { z: number[]; p: number[] }> = {
    guinada: { z: cams.map((m) => (Math.atan2(dir(m)[0], -dir(m)[2]) * 180) / Math.PI), p: px },
    cabeceo: { z: cams.map((m) => (Math.asin(Math.max(-1, Math.min(1, dir(m)[1]))) * 180) / Math.PI), p: py },
    x: { z: cams.map((m) => m.camera!.pos[0]), p: px },
    y: { z: cams.map((m) => m.camera!.pos[1]), p: py },
  };
  const out: EjePuntero[] = [];
  for (const [eje, { z, p }] of Object.entries(series) as [EjePuntero["eje"], { z: number[]; p: number[] }][]) {
    const n = z.length;
    const media = z.reduce((a, b) => a + b, 0) / n;
    const varianza = z.reduce((a, b) => a + (b - media) ** 2, 0);
    if (varianza < 1e-12) continue;
    let mejor: EjePuntero | null = null;
    let mejorE = Infinity;
    for (let a = 0.005; a <= 0.5; a += a < 0.1 ? 0.0025 : 0.01) {
      // el filtro aplicado al puntero y a una constante: z ≈ z0·(1 − F1) + ganancia·FP + base·F1 (lineal en ganancia y base)
      const FP: number[] = [];
      const F1: number[] = [];
      let s = 0;
      let s1 = 0;
      for (let k = 0; k < n; k++) {
        FP.push(s);
        F1.push(s1);
        s += a * (p[k] - s);
        s1 += a * (1 - s1);
      }
      const r = z.map((v, k) => v - z[0] * (1 - F1[k]));
      let sxx = 0, sxy = 0, s11 = 0, sx1 = 0, sy1 = 0;
      for (let k = 0; k < n; k++) {
        sxx += FP[k] * FP[k];
        sxy += FP[k] * r[k];
        s11 += F1[k] * F1[k];
        sx1 += FP[k] * F1[k];
        sy1 += F1[k] * r[k];
      }
      const det = sxx * s11 - sx1 * sx1;
      if (Math.abs(det) < 1e-12) continue;
      const g = (sxy * s11 - sx1 * sy1) / det;
      const b = (sxx * sy1 - sx1 * sxy) / det;
      let e = 0;
      for (let k = 0; k < n; k++) e += (z[0] * (1 - F1[k]) + g * FP[k] + b * F1[k] - z[k]) ** 2;
      if (e < mejorE) {
        mejorE = e;
        mejor = { eje, seguimiento: +a.toFixed(4), ganancia: +g.toFixed(eje === "x" || eje === "y" ? 5 : 3), base: +b.toFixed(4), r2: +(1 - e / varianza).toFixed(3) };
      }
    }
    if (mejor) out.push(mejor);
  }
  return out;
}
