import sharp from "sharp";

/**
 * Profundidad de la imagen (docs/36 A8): las señales con las que el ojo lee la distancia, que el tono y el acabado
 * globales no ven, medidas sin saber nada de la escena.
 *   - atmósfera: el reparto del contraste local por bloques. Con niebla o perspectiva aérea, lo lejano queda lavado y
 *     el contraste varía mucho entre bloques (rango p90/p10); una imagen plana lo tiene parejo;
 *   - desenfoque: el reparto de la nitidez (energía del laplaciano) entre bloques con contenido. Con profundidad de
 *     campo, unos bloques son nítidos y otros blandos;
 *   - planos: cuántos niveles de contraste distintos hay (histograma de bloques por octavas); más planos, más capas;
 *   - paralaje: del flujo del vídeo (cine:flujo), lo que el movimiento de los bloques se aparta de un movimiento rígido
 *     de la imagen. En un barrido plano todo se mueve igual; con profundidad, lo cercano más que lo lejano.
 * Se comparan referencia y demo: tienen que tener las mismas señales y en la misma medida.
 */
export type Profundidad = { atmosfera: number; desenfoque: number; planos: number };

const BLOQUE = 24;

export async function profundidadDe(png: string): Promise<Profundidad | null> {
  try {
    const { data, info } = await sharp(png).resize(480).grayscale().raw().toBuffer({ resolveWithObject: true });
    const W = info.width, H = info.height;
    const g = (x: number, y: number) => Math.pow(data[y * W + x] / 255, 2.2);
    const contrastes: number[] = [];
    const nitideces: number[] = [];
    for (let by = 0; by + BLOQUE <= H; by += BLOQUE)
      for (let bx = 0; bx + BLOQUE <= W; bx += BLOQUE) {
        let s = 0, s2 = 0, lap = 0, n = 0;
        for (let y = by + 1; y < by + BLOQUE - 1; y++)
          for (let x = bx + 1; x < bx + BLOQUE - 1; x++) {
            const c = g(x, y);
            s += c;
            s2 += c * c;
            lap += Math.abs(g(x - 1, y) + g(x + 1, y) + g(x, y - 1) + g(x, y + 1) - 4 * c);
            n++;
          }
        const m = s / n;
        const sd = Math.sqrt(Math.max(0, s2 / n - m * m));
        contrastes.push(sd);
        // la nitidez solo cuenta donde hay algo (un cielo liso no es «borroso»)
        if (sd > 0.01) nitideces.push(lap / n / (sd + 1e-4));
      }
    const pct = (xs: number[], p: number) => {
      const s = [...xs].sort((a, b) => a - b);
      return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0;
    };
    const rango = (xs: number[]) => Math.log2((pct(xs, 0.9) + 0.004) / (pct(xs, 0.1) + 0.004));
    // planos: octavas de contraste ocupadas por al menos el 5 % de los bloques
    const oct = new Map<number, number>();
    for (const c of contrastes) {
      const k = Math.round(Math.log2(c + 0.002));
      oct.set(k, (oct.get(k) ?? 0) + 1);
    }
    const planos = [...oct.values()].filter((v) => v >= contrastes.length * 0.05).length;
    return { atmosfera: rango(contrastes), desenfoque: nitideces.length > 8 ? rango(nitideces) : 0, planos };
  } catch {
    return null;
  }
}

export const mediaProfundidad = (xs: Profundidad[]): Profundidad => ({
  atmosfera: xs.reduce((s, x) => s + x.atmosfera, 0) / xs.length,
  desenfoque: xs.reduce((s, x) => s + x.desenfoque, 0) / xs.length,
  planos: xs.reduce((s, x) => s + x.planos, 0) / xs.length,
});

/** el paralaje de un flujo.json: residuo medio frente al movimiento medio, en los pares que se mueven */
export function paralajeDe(flujo: { pares: { dx: number; dy: number; escala: number; residuo?: number; movimiento?: number }[] } | null) {
  if (!flujo) return null;
  const ps = flujo.pares.filter((p) => (p.movimiento ?? 0) > 0.5 && p.residuo !== undefined);
  if (ps.length < 4) return null;
  return ps.reduce((s, p) => s + p.residuo! / p.movimiento!, 0) / ps.length;
}

/** referencia frente a demo: cada señal, su diferencia relativa y hacia dónde se va la demo */
export function compararProfundidad(r: Profundidad, b: Profundidad, parR: number | null, parB: number | null) {
  const filas: { senal: string; ref: number; banco: number; error: number; sentido: string }[] = [];
  const fila = (senal: string, x: number, y: number, escala: number, mas: string, menos: string) => {
    const error = Math.min(1, Math.abs(x - y) / Math.max(escala, Math.abs(x)));
    filas.push({ senal, ref: +x.toFixed(3), banco: +y.toFixed(3), error: +error.toFixed(3), sentido: error < 0.1 ? "igual" : y > x ? mas : menos });
  };
  fila("atmósfera (rango de contraste)", r.atmosfera, b.atmosfera, 1, "más contraste entre cerca y lejos", "más plana: falta perspectiva aérea o niebla");
  fila("desenfoque (rango de nitidez)", r.desenfoque, b.desenfoque, 1, "más desenfoque por profundidad", "todo igual de nítido: falta profundidad de campo");
  fila("planos (capas de contraste)", r.planos, b.planos, 2, "más capas", "menos capas");
  if (parR !== null && parB !== null) fila("paralaje (lo cercano se mueve más)", parR, parB, 0.2, "más paralaje", "más plana al moverse: faltan capas a distinta distancia");
  return { filas, total: filas.reduce((s, f) => s + f.error, 0) / filas.length };
}
