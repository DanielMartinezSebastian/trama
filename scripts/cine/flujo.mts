/**
 * Movimiento de la imagen medido en el vídeo (docs/34 §3): para webs sin three (o con la cámara escondida), donde el
 * gancho no da cámara. Entre cada par de fotogramas busca cómo se ha movido cada bloque de una rejilla y ajusta una
 * semejanza: desplazamiento (en fracción del ancho), zoom (escala) y giro. De ahí salen la panorámica (desplazamiento),
 * el dolly o zoom (escala) y el alabeo (giro) aunque no se sepa nada de la escena.
 *
 *   npm run cine:flujo -- <captura> [--cada 2]
 *
 * Salida: flujo.json (por par: t, dx, dy, escala, giro, fiabilidad) y el resumen acumulado. cine:compare lo usa como eje
 * de «movimiento de imagen» cuando las dos capturas lo tienen.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const argv = process.argv.slice(2);
const dir = argv.find((a) => !a.startsWith("--"));
if (!dir) {
  console.log("Uso: npm run cine:flujo -- <captura> [--cada 2]");
  process.exit(1);
}
const i = argv.indexOf("--cada");
const CADA = i >= 0 ? Number(argv[i + 1]) : 2;
const OUT = resolve(dir);
const meta = JSON.parse(readFileSync(join(OUT, "meta.json"), "utf8")) as { fps: number };
const fotos = readdirSync(join(OUT, "frames")).filter((f) => f.endsWith(".png")).sort();

const W = 256;
const lee = async (f: string) => {
  const { data, info } = await sharp(join(OUT, "frames", f)).resize(W).grayscale().raw().toBuffer({ resolveWithObject: true });
  return { d: data, w: info.width, h: info.height };
};

/** desplazamiento de un bloque de a en b (suma de diferencias absolutas, búsqueda ±R) y su contraste */
function bloque(a: Buffer, b: Buffer, w: number, h: number, x0: number, y0: number, T: number, R: number) {
  let mejor = Infinity, segundo = Infinity, bx = 0, by = 0;
  let media = 0;
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) media += a[(y0 + y) * w + x0 + x];
  media /= T * T;
  let var_ = 0;
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) var_ += Math.abs(a[(y0 + y) * w + x0 + x] - media);
  for (let dy = -R; dy <= R; dy++)
    for (let dx = -R; dx <= R; dx++) {
      if (x0 + dx < 0 || y0 + dy < 0 || x0 + dx + T > w || y0 + dy + T > h) continue;
      let s = 0;
      // sin cortar la suma a medias: la segunda mejor coincidencia (la que dice si el bloque es único) la necesita entera
      for (let y = 0; y < T; y += 2) for (let x = 0; x < T; x += 2) s += Math.abs(a[(y0 + y) * w + x0 + x] - b[(y0 + dy + y) * w + x0 + dx + x]);
      if (s < mejor) (segundo = mejor), (mejor = s), (bx = dx), (by = dy);
      else if (s < segundo) segundo = s;
    }
  return { dx: bx, dy: by, textura: var_ / (T * T), unico: segundo > 0 ? 1 - mejor / segundo : 0 };
}

/** semejanza por mínimos cuadrados: p' = s·R(θ)·p + t, con p relativo al centro */
function semejanza(pts: { x: number; y: number; u: number; v: number }[]) {
  const n = pts.length;
  let mx = 0, my = 0, mu = 0, mv = 0;
  for (const p of pts) (mx += p.x), (my += p.y), (mu += p.x + p.u), (mv += p.y + p.v);
  (mx /= n), (my /= n), (mu /= n), (mv /= n);
  let sxx = 0, a = 0, b = 0;
  for (const p of pts) {
    const x = p.x - mx, y = p.y - my, X = p.x + p.u - mu, Y = p.y + p.v - mv;
    sxx += x * x + y * y;
    a += x * X + y * Y;
    b += x * Y - y * X;
  }
  const s = Math.hypot(a, b) / Math.max(1e-6, sxx);
  return { escala: s, giro: Math.atan2(b, a), dx: mu - mx, dy: mv - my, mx, my };
}

// residuo y movimiento (px a 256 de ancho): lo que los bloques se apartan del movimiento rígido es el paralaje (docs/36 A8)
const pares: { t: number; dx: number; dy: number; escala: number; giro: number; fiabilidad: number; residuo?: number; movimiento?: number }[] = [];
let prev = await lee(fotos[0]);
for (let k = CADA; k < fotos.length; k += CADA) {
  const cur = await lee(fotos[k]);
  const { w, h } = cur;
  const T = 16, R = 8, pts: { x: number; y: number; u: number; v: number }[] = [];
  for (let y0 = R; y0 + T + R < h; y0 += 18)
    for (let x0 = R; x0 + T + R < w; x0 += 18) {
      const r = bloque(prev.d, cur.d, w, h, x0, y0, T, R);
      // solo bloques con textura y una respuesta única (las zonas lisas y los patrones repetidos engañan)
      if (r.textura > 4 && r.unico > 0.15) pts.push({ x: x0 + T / 2, y: y0 + T / 2, u: r.dx, v: r.dy });
    }
  const t = (k / fotos.length) * (fotos.length / meta.fps);
  if (pts.length >= 6) {
    // dos vueltas: la segunda sin los bloques que se alejan del ajuste (lo que se mueve por su cuenta)
    let m = semejanza(pts);
    const err = (p: (typeof pts)[0]) => {
      const x = p.x - m.mx, y = p.y - m.my;
      const c = Math.cos(m.giro) * m.escala, s = Math.sin(m.giro) * m.escala;
      return Math.hypot(c * x - s * y + m.dx - x - p.u, s * x + c * y + m.dy - y - p.v);
    };
    const buenos = pts.filter((p) => err(p) < 2.5);
    if (buenos.length >= 6) m = semejanza(buenos);
    const residuo = pts.reduce((s, p) => s + Math.min(8, err(p)), 0) / pts.length;
    const movimiento = pts.reduce((s, p) => s + Math.hypot(p.u, p.v), 0) / pts.length;
    pares.push({ t: +t.toFixed(3), dx: +(m.dx / w).toFixed(5), dy: +(m.dy / w).toFixed(5), escala: +m.escala.toFixed(5), giro: +((m.giro * 180) / Math.PI).toFixed(3), fiabilidad: +(buenos.length / pts.length).toFixed(2), residuo: +residuo.toFixed(3), movimiento: +movimiento.toFixed(3) });
  } else pares.push({ t: +t.toFixed(3), dx: 0, dy: 0, escala: 1, giro: 0, fiabilidad: 0 });
  prev = cur;
}

// acumulado: cuánto se ha desplazado, acercado y girado la imagen desde el principio
let X = 0, Y = 0, S = 1, G = 0;
const acumulado = pares.map((p) => ((X += p.dx), (Y += p.dy), (S *= p.escala), (G += p.giro), { t: p.t, x: +X.toFixed(4), y: +Y.toFixed(4), escala: +S.toFixed(4), giro: +G.toFixed(2) }));
writeFileSync(join(OUT, "flujo.json"), JSON.stringify({ cada: CADA, pares, acumulado }, null, 1));
const u = acumulado[acumulado.length - 1];
const fiab = pares.reduce((s, p) => s + p.fiabilidad, 0) / Math.max(1, pares.length);
console.log(`  ${pares.length} pares · desplazamiento total ${(u.x * 100).toFixed(1)} % × ${(u.y * 100).toFixed(1)} % del ancho · escala ${u.escala} · giro ${u.giro}° · fiabilidad media ${fiab.toFixed(2)}`);
console.log(`  ${join(OUT, "flujo.json")}`);
