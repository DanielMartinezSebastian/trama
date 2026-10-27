/**
 * Comparación de dos capturas (docs/26 §5): la referencia y su recreación en el banco, capturadas igual con `cine:capture`.
 *
 *   npm run cine:compare -- <captura-referencia> <captura-banco> [--out carpeta] [--emparejar posicion]
 *
 * Mide, por progreso normalizado del reloj (segundos o scroll de 0 a 1):
 *   - cámara: error de posición (en % del tamaño de la escena), de fov y de dirección; la forma del avance (easing);
 *   - planos: tramos, movimientos y curvas de cada uno;
 *   - render y posprocesado: renderer, tone mapping, exposición, pila de pases y sus parámetros;
 *   - luz: luces por tipo e intensidad, entorno; atmósfera: niebla;
 *   - imagen (si las dos están analizadas): luminancia, recorte, contraste, saturación, viñeteado y paleta (ΔE);
 *   - dinámica de una pieza (docs/29 §2, `--pieza nombre`): velocidad, guiñada, cabeceo y altura fotograma a fotograma,
 *     sin depender de dónde está (un coche con física, un objeto que se lanza); `--ventanas 5.9-6.75,11.9-13.7` la
 *     limita a esos segundos (fuera quedan sucesos que la recreación no tiene: una explosión, un choque con el decorado);
 *   - texto (docs/30 §1): el relato escrito de las dos (relato.json de cine:analyze) emparejado por texto: cuándo entra
 *     cada uno (píxeles de scroll sobre el recorrido de la referencia, o tiempo), cuánto tarda y si entra igual;
 *   - acabado (docs/29 §1): detalle fino, bordes, contraste local, brillos y grano en doce pares de fotogramas;
 *   - profundidad (docs/36 A8): atmósfera, desenfoque y planos por bloques en los mismos pares, y paralaje del flujo;
 *   - SSIM fotograma a fotograma con ffmpeg (solo tiene sentido si la escena es la misma: calibración);
 *   - coste: llamadas de dibujo, triángulos y pasadas.
 * Cada eje da un «alejamiento» de 0 (igual) a 1 (nada que ver), y el informe ordena los ejes de más a menos alejado: el
 * primero es lo siguiente que hay que depurar. Salida: comparacion.json, comparacion.md y lado.mp4 (lado a lado).
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { EJE_NOMBRE } from "../../lib/cine/rubric";
import type { Eje, Ficha, Pase } from "../../lib/cine/schema";
import { alabeo, centro, type Inventario, type Muestra, type Tramo } from "./lib.mts";
import { acabadoDe, compararAcabado, media, type Acabado } from "./acabado.mts";
import { compararProfundidad, mediaProfundidad, paralajeDe, profundidadDe, type Profundidad } from "./profundidad.mts";
import { readdirSync } from "node:fs";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const opt = (n: string, d: string) => {
  const i = process.argv.indexOf(n);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d;
};
if (args.length < 2) {
  console.log("Uso: npm run cine:compare -- <captura-referencia> <captura-banco> [--out carpeta]");
  process.exit(1);
}
const [REF, BAN] = args.map((a) => resolve(a));
const OUT = resolve(opt("--out", join(REF, "..", `comparacion-${basename(BAN)}`)));
mkdirSync(OUT, { recursive: true });

type Imagen = { luma: number; recorte: number; contraste: number; saturacion: number; vineta: number; paleta: { hex: string; peso: number }[] };
type Cap = { dir: string; meta: { drive: string; fps: number; size: number[]; imagenes: number; url: string }; ms: Muestra[]; ficha: Ficha; medidas: { tramos: Tramo[]; relojScroll?: string | null; imagen?: Imagen; reloj?: number[] }; inv: Inventario["inv"] };

function load(dir: string): Cap {
  const j = (f: string) => JSON.parse(readFileSync(join(dir, f), "utf8"));
  const fichaFile = existsSync(join(dir, "ficha.json")) ? "ficha.json" : "ficha.auto.json";
  const f = j(fichaFile);
  return {
    dir,
    meta: j("meta.json"),
    ms: readFileSync(join(dir, "timeline.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l)),
    ficha: f.ficha,
    medidas: f.medidas,
    inv: (j("inventario.json") as Inventario[]).find((x) => x.inv)?.inv ?? null,
  };
}
const ref = load(REF);
const ban = load(BAN);

/* ---------------------------------------------------------------- reloj normalizado y cámara interpolada */

const entrada = (c: Cap) => JSON.stringify(c.ms.map((m) => m.input));
const mismaEntrada = ref.meta.drive === ban.meta.drive && ref.ms.length === ban.ms.length && entrada(ref) === entrada(ban);

/**
 * Progreso 0–1 de cada muestra: el reloj que guardó la ficha (scroll con saturación y amortiguado, como lo mide el
 * análisis) o, en capturas antiguas, tiempo sobre la duración o scroll crudo.
 */
function progreso(c: Cap): number[] {
  // misma entrada en las dos capturas (mismo recorrido, mismos golpes de rueda o puntero): cada fotograma es el mismo
  // instante, y alinear por él no depende de lo bien que se estime el reloj de cada una
  if (mismaEntrada) return c.ms.map((_, i) => i / Math.max(1, c.ms.length - 1));
  const r = c.medidas.reloj;
  if (r && r.length === c.ms.length) {
    if (c.meta.drive === "scroll") return r;
    const t0 = r[0], t1 = r[r.length - 1];
    return r.map((x) => (x - t0) / Math.max(1e-6, t1 - t0));
  }
  if (c.meta.drive !== "scroll") {
    const t0 = c.ms[0].t, t1 = c.ms[c.ms.length - 1].t;
    return c.ms.map((m) => (m.t - t0) / Math.max(1e-6, t1 - t0));
  }
  if (c.medidas.relojScroll === "ventana") return c.ms.map((m) => (m.scroll.max > 0 ? m.scroll.y / m.scroll.max : 0));
  const tot = c.ms.reduce((a, m) => a + (m.input.wheel ?? 0), 0) || 1;
  let acc = 0;
  return c.ms.map((m) => ((acc += m.input.wheel ?? 0), acc / tot));
}
const N = 120;
function camaraEn(c: Cap) {
  const p = progreso(c);
  const cams = c.ms.map((m, i) => ({ p: p[i], cam: m.camera })).filter((x) => x.cam);
  return Array.from({ length: N + 1 }, (_, k) => {
    const q = k / N;
    // la última muestra con progreso ≤ q (el scroll puede quedarse quieto: se toma la más tardía)
    let lo = 0;
    for (let i = 0; i < cams.length; i++) if (cams[i].p <= q + 1e-9) lo = i;
    return cams[lo]?.cam ?? null;
  });
}
const sub = (a: number[], b: number[]) => a.map((x, i) => x - b[i]);
const len = (a: number[]) => Math.hypot(...a);
const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
const rms = (xs: number[]) => Math.sqrt(xs.reduce((a, x) => a + x * x, 0) / Math.max(1, xs.length));
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

const cr = camaraEn(ref);
const cb = camaraEn(ban);
const caja = ref.inv?.bounds;
const tam = caja ? Math.max(1e-3, len(sub(caja.max, caja.min))) : Math.max(1, len(centro(ref.inv)));
const pares = cr.map((a, k) => [a, cb[k]] as const).filter(([a, b]) => a && b);
const errPos = rms(pares.map(([a, b]) => len(sub(a!.pos, b!.pos)))) / tam;
const errFov = rms(pares.map(([a, b]) => a!.fov - b!.fov));
// alabeo: diferencia angular más corta (en grados) entre el giro sobre el eje de mirada de cada una
const dRoll = (a: number, b: number) => Math.abs(((((a - b) % 360) + 540) % 360) - 180);
const errRoll = rms(pares.map(([a, b]) => dRoll(alabeo(a!), alabeo(b!))));
const errDir = rms(pares.map(([a, b]) => (Math.acos(Math.max(-1, Math.min(1, dot(a!.dir, b!.dir)))) * 180) / Math.PI));
// forma del avance: recorrido acumulado normalizado de cada una, comparado punto a punto
const avance = (cs: typeof cr) => {
  const acc = [0];
  for (let k = 1; k < cs.length; k++) acc.push(acc[k - 1] + (cs[k] && cs[k - 1] ? len(sub(cs[k]!.pos, cs[k - 1]!.pos)) : 0));
  const tot = acc[acc.length - 1] || 1;
  return acc.map((x) => x / tot);
};
const errAvance = rms(avance(cr).map((x, k) => x - avance(cb)[k]));

/*
 * Piezas: la pose de cada malla con nombre en el mundo, comparada por nombre en los mismos instantes (solo con la misma
 * entrada: es lo que delata una flotación o una animación que falta). Posición: el centro de la caja de cada pieza (dónde
 * se ve; el origen depende de cómo se montó el modelo), en % del tamaño de la escena. Giro: cuánto ha girado desde el
 * primer fotograma, en grados (la orientación absoluta también depende de la jerarquía).
 */
const piezas = (() => {
  if (!mismaEntrada) return null;
  const errP: Record<string, number[]> = {}, errG: Record<string, number[]> = {};
  // giro relativo al primer fotograma: q · q0⁻¹ (el conjugado de un cuaternión unitario es su inverso)
  const mul = (a: number[], b: number[]) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
  const inv = (a: number[]) => [-a[0], -a[1], -a[2], a[3]];
  const q0r = new Map((ref.ms[0].piezas ?? []).map((p) => [p.n, p.q]));
  const q0b = new Map((ban.ms[0].piezas ?? []).map((p) => [p.n, p.q]));
  ref.ms.forEach((m, i) => {
    const b = ban.ms[i];
    for (const p of m.piezas ?? []) {
      const q = b?.piezas?.find((x) => x.n === p.n);
      if (!q || !q0r.has(p.n) || !q0b.has(p.n)) continue;
      (errP[p.n] ??= []).push(len(sub(p.c ?? p.p, q.c ?? q.p)) / tam);
      const dr = mul(p.q, inv(q0r.get(p.n)!)), db = mul(q.q, inv(q0b.get(p.n)!));
      const d = Math.min(1, Math.abs(dot(dr, db)));
      (errG[p.n] ??= []).push((2 * Math.acos(d) * 180) / Math.PI);
    }
  });
  const nombres = Object.keys(errP);
  if (!nombres.length) return null;
  const porPieza = nombres.map((n) => ({ pieza: n, posicionPct: +(rms(errP[n]) * 100).toFixed(2), giroGrados: +rms(errG[n]).toFixed(2) }));
  return { porPieza, posicionPct: +(rms(nombres.flatMap((n) => errP[n])) * 100).toFixed(2), giroGrados: +rms(nombres.flatMap((n) => errG[n])).toFixed(2) };
})();

/*
 * Dinámica de una pieza (por defecto, la que más se mueve en la referencia): series de velocidad horizontal, velocidad
 * de guiñada, cabeceo y altura sobre su arranque, comparadas fotograma a fotograma con la misma entrada. Mide la física
 * (aceleración, frenada, giro, suspensión, saltos) aunque la pieza acabe en otro sitio.
 */
const dinamica = (() => {
  if (!mismaEntrada) return null;
  const nombres = new Set((ref.ms.find((m) => m.piezas?.length)?.piezas ?? []).map((p) => p.n));
  const recorrido = (c: Cap, n: string) => {
    const ps = c.ms.map((m) => m.piezas?.find((x) => x.n === n)).filter(Boolean) as { c?: number[]; p: number[] }[];
    return ps.length > 1 ? len(sub(ps[ps.length - 1].c ?? ps[ps.length - 1].p, ps[0].c ?? ps[0].p)) + ps.reduce((a, p, k) => (k ? a + len(sub(p.c ?? p.p, ps[k - 1].c ?? ps[k - 1].p)) : 0), 0) : 0;
  };
  const elegida = opt("--pieza", "") || [...nombres].filter((n) => ban.ms.some((m) => m.piezas?.some((x) => x.n === n))).sort((a, b) => recorrido(ref, b) - recorrido(ref, a))[0];
  if (!elegida) return null;
  const serie = (c: Cap) => {
    const pos: (number[] | null)[] = c.ms.map((m) => { const p = m.piezas?.find((x) => x.n === elegida); return p ? p.c ?? p.p : null; });
    const rot = c.ms.map((m) => m.piezas?.find((x) => x.n === elegida)?.q ?? null);
    const y0 = pos.find(Boolean)?.[1] ?? 0;
    const rumbo = (q: number[]) => Math.atan2(2 * (q[0] * q[2] - q[1] * q[3]), 1 - 2 * (q[1] * q[1] + q[2] * q[2]));
    const cabeceo = (q: number[]) => (Math.asin(Math.max(-1, Math.min(1, 2 * (q[0] * q[1] + q[2] * q[3])))) * 180) / Math.PI;
    return c.ms.map((m, i) => {
      const a = pos[i - 1], b = pos[i], qa = rot[i - 1], qb = rot[i];
      const dt = i ? m.t - c.ms[i - 1].t || 1 / 60 : 1 / 60;
      let dr = qa && qb ? rumbo(qb) - rumbo(qa) : 0;
      dr = Math.atan2(Math.sin(dr), Math.cos(dr));
      return { v: a && b ? Math.hypot(b[0] - a[0], b[2] - a[2]) / dt : 0, guinada: ((dr / dt) * 180) / Math.PI, cabeceo: qb ? cabeceo(qb) : 0, altura: b ? b[1] - y0 : 0 };
    });
  };
  const ventanas = opt("--ventanas", "")
    .split(",")
    .filter(Boolean)
    .map((v) => v.split("-").map(Number));
  const dentro = (i: number) => !ventanas.length || ventanas.some(([a0, a1]) => ref.ms[i].t >= a0 && ref.ms[i].t <= a1);
  const a = serie(ref).filter((_, i) => dentro(i)), b = serie(ban).filter((_, i) => dentro(i));
  // la altura, desde el primer fotograma de la comparación (la intro puede tener la pieza en otro sitio)
  for (const xs of [a, b]) { const y0 = xs[0]?.altura ?? 0; for (const x of xs) x.altura -= y0; }
  const n = Math.min(a.length, b.length);
  const err = (k: "v" | "guinada" | "cabeceo" | "altura", suelo: number) => {
    const xs = a.slice(0, n).map((x) => x[k]);
    const rango = Math.max(suelo, Math.max(...xs) - Math.min(...xs));
    return rms(xs.map((x, i) => x - b[i][k])) / rango;
  };
  const e = { velocidad: err("v", 1), guinada: err("guinada", 30), cabeceo: err("cabeceo", 5), altura: err("altura", 0.2) };
  const max = (s: typeof a, k: "v" | "guinada" | "cabeceo" | "altura") => Math.max(...s.slice(0, n).map((x) => Math.abs(x[k])));
  return { pieza: elegida, errores: Object.fromEntries(Object.entries(e).map(([k, v]) => [k, +v.toFixed(3)])), total: 0.4 * e.velocidad + 0.3 * e.guinada + 0.15 * e.cabeceo + 0.15 * e.altura, maximos: { velocidad: [max(a, "v"), max(b, "v")], guinada: [max(a, "guinada"), max(b, "guinada")], cabeceo: [max(a, "cabeceo"), max(b, "cabeceo")], altura: [max(a, "altura"), max(b, "altura")] } };
})();

/*
 * Texto: las apariciones de la referencia emparejadas con las del banco por su texto (sin mayúsculas ni espacios). El
 * momento se compara en fracción del recorrido (scroll máximo o duración), para que dos páginas de largo distinto se
 * puedan comparar; faltar un texto cuenta como error completo. Con `--emparejar posicion` (réplicas traducidas, docs/53
 * §3.2) cada aparición se empareja con la del banco más cercana en el recorrido y de cuerpo parecido, aunque diga otra
 * cosa: lo que se compara es cuándo y cómo entra cada texto, no qué dice.
 */
const texto = (() => {
  type Ap = { texto: string; entra: number; scrollEntra: number | null; como: string[]; dura: number; curva: string | null; cuerpo?: number };
  const leer = (d: string): Ap[] => (existsSync(join(d, "relato.json")) ? JSON.parse(readFileSync(join(d, "relato.json"), "utf8")) : []);
  // --tramo-scroll a-b: solo las apariciones de la referencia que entran en ese tramo de scroll (la sección estudiada; el
  // resto de la página no está en el banco)
  const tramo = opt("--tramo-scroll", "").split("-").map(Number);
  const enTramo = (a: Ap) => tramo.length < 2 || isNaN(tramo[1]) || a.scrollEntra == null || (a.scrollEntra >= tramo[0] && a.scrollEntra <= tramo[1]);
  const ra = leer(REF).filter(enTramo), rb = leer(BAN);
  if (!ra.length) return null;
  const norm = (t: string) => t.toLowerCase().replace(/\s+/g, "");
  // el scroll en píxeles es comparable entre las dos con la misma ventana: se normaliza por el máximo de la referencia
  // para las dos (las páginas pueden tener largos distintos)
  const maxRef = Math.max(...ref.ms.map((m) => m.scroll?.max ?? 0));
  const frac = (c: Cap, a: Ap) => (maxRef > 0 && a.scrollEntra != null ? a.scrollEntra / maxRef : a.entra / Math.max(1e-6, c.ms[c.ms.length - 1]?.t ?? 1));
  const porPosicion = opt("--emparejar", "texto") === "posicion";
  const usadas = new Set<Ap>();
  // por posición: la aparición libre del banco que entra más cerca en el recorrido (≤ 12 %) con un cuerpo parecido (el
  // logaritmo de la razón de cuerpos pesa la mitad que la distancia; más de 1,6 veces de diferencia no empareja)
  const cercana = (a: Ap) => {
    let mejor: Ap | undefined, coste = Infinity;
    for (const x of rb) {
      if (usadas.has(x)) continue;
      const d = Math.abs(frac(ref, a) - frac(ban, x));
      const talla = Math.abs(Math.log((x.cuerpo || 16) / (a.cuerpo || 16)));
      // un titular no se empareja con un dato pequeño: como mucho 1,6 veces de diferencia de cuerpo
      if (d > 0.12 || talla > Math.log(1.6)) continue;
      const c = d + 0.5 * talla;
      if (c < coste) (coste = c), (mejor = x);
    }
    return mejor;
  };
  const filas = ra.map((a) => {
    const b = porPosicion ? cercana(a) : rb.find((x) => norm(x.texto) === norm(a.texto));
    if (!b) return { texto: a.texto, con: "", falta: true, dMomento: 1, dDura: 1, como: false };
    usadas.add(b);
    return { texto: a.texto, con: porPosicion ? b.texto : "", falta: false, dMomento: Math.abs(frac(ref, a) - frac(ban, b)), dDura: Math.abs(a.dura - b.dura) / Math.max(0.5, a.dura, b.dura), como: a.como.join("+") === b.como.join("+"), comoRef: a.como.join("+"), comoBan: b.como.join("+") };
  });
  const n = filas.length;
  const faltan = filas.filter((f) => f.falta).length;
  const momento = rms(filas.filter((f) => !f.falta).map((f) => f.dMomento));
  const dura = rms(filas.filter((f) => !f.falta).map((f) => f.dDura));
  const comoMal = filas.filter((f) => !f.falta && !f.como).length / Math.max(1, n - faltan);
  return { apariciones: n, faltan, errorMomento: +momento.toFixed(3), errorDuracion: +dura.toFixed(3), comoDistinto: +comoMal.toFixed(3), total: Math.min(1, faltan / n + momento * 4 + dura * 0.5 + comoMal * 0.3), filas };
})();

/* ---------------------------------------------------------------- planos */

const tramos = (c: Cap) => c.medidas.tramos.map((t) => ({ mov: t.movimientos.join("+"), curva: t.curvas[0]?.curva ?? "—", desde: t.desde, hasta: t.hasta }));
const tr = tramos(ref);
const tb = tramos(ban);
const planosIguales = tr.length === tb.length && tr.every((t, i) => t.mov === tb[i].mov);

/* ---------------------------------------------------------------- render, luz, atmósfera y posprocesado */

const fr = ref.ficha;
const fb = ban.ficha;
const difs: string[] = [];
const rel = (a: number, b: number) => (a === b ? 0 : Math.abs(a - b) / Math.max(1e-6, Math.abs(a), Math.abs(b)));

let render = 0;
if (fr.render.renderer !== fb.render.renderer) (render += 0.2), difs.push(`renderer: ${fr.render.renderer} → ${fb.render.renderer}`);
if (fr.render.toneMapping !== fb.render.toneMapping) (render += 0.5), difs.push(`tone mapping: ${fr.render.toneMapping} → ${fb.render.toneMapping}`);
if (rel(fr.render.exposicion, fb.render.exposicion) > 0.02) (render += 0.3 * rel(fr.render.exposicion, fb.render.exposicion)), difs.push(`exposición: ${fr.render.exposicion} → ${fb.render.exposicion}`);

const pasesNum = (p: Pase) => Object.entries(p).filter(([k, v]) => k !== "tipo" && typeof v === "number" && !Number.isNaN(v)) as [string, number][];
let post = 0;
const tiposR = fr.post.map((p) => p.tipo);
const tiposB = fb.post.map((p) => p.tipo);
for (const t of tiposR) if (!tiposB.includes(t)) (post += 0.4), difs.push(`falta el pase ${t}`);
for (const t of tiposB) if (!tiposR.includes(t)) (post += 0.25), difs.push(`sobra el pase ${t}`);
for (const p of fr.post) {
  const q = fb.post.find((x) => x.tipo === p.tipo);
  if (!q) continue;
  for (const [k, v] of pasesNum(p)) {
    const w = (q as Record<string, unknown>)[k];
    if (typeof w === "number" && !Number.isNaN(w) && rel(v, w) > 0.05) (post += 0.2 * rel(v, w)), difs.push(`${p.tipo}.${k}: ${v} → ${w}`);
  }
}

let luz = 0;
const porTipo = (f: Ficha) => f.luz.luces.reduce<Record<string, number>>((a, l) => ((a[l.tipo] = (a[l.tipo] ?? 0) + l.intensidad), a), {});
const lr = porTipo(fr), lb = porTipo(fb);
for (const t of new Set([...Object.keys(lr), ...Object.keys(lb)])) {
  const d = rel(lr[t] ?? 0, lb[t] ?? 0);
  if (d > 0.05) (luz += 0.3 * d), difs.push(`luz ${t}: ${lr[t] ?? 0} → ${lb[t] ?? 0}`);
}
if (fr.luz.entorno.tipo !== fb.luz.entorno.tipo) (luz += 0.4), difs.push(`entorno: ${fr.luz.entorno.tipo} → ${fb.luz.entorno.tipo}`);
if ((fr.render.sombras ?? "ninguna") !== (fb.render.sombras ?? "ninguna")) (luz += 0.3), difs.push(`sombras: ${fr.render.sombras ?? "ninguna"} → ${fb.render.sombras ?? "ninguna"}`);
// materiales por nombre: color (ΔE), rugosidad, metálico, reflejo del entorno, transmisión, emisión
const NUM_MAT = ["rugosidad", "metalico", "intensidadEntorno", "transmision", "intensidadEmisiva", "barniz", "opacidad"] as const;
for (const m of fr.materiales) {
  const q = fb.materiales.find((x) => x.id === m.id);
  if (!q) continue;
  for (const k of NUM_MAT) {
    const a = m[k], b = q[k];
    if (typeof a === "number" && typeof b === "number" && Math.abs(a - b) > 0.05) (luz += 0.15 * Math.min(1, Math.abs(a - b))), difs.push(`material ${m.id}.${k}: ${a} → ${b}`);
  }
  if (m.color && q.color) {
    const de = len(sub(hex2lab(m.color), hex2lab(q.color)));
    if (de > 3) (luz += Math.min(0.3, de / 100)), difs.push(`material ${m.id}.color: ${m.color} → ${q.color} (ΔE ${de.toFixed(1)})`);
  }
}

let atmosfera = 0;
if (!!fr.atmosfera.niebla !== !!fb.atmosfera.niebla || fr.atmosfera.niebla?.tipo !== fb.atmosfera.niebla?.tipo) (atmosfera += 0.5), difs.push(`niebla: ${fr.atmosfera.niebla?.tipo ?? "no"} → ${fb.atmosfera.niebla?.tipo ?? "no"}`);
const efR = (fr.atmosfera.efectos ?? []).map((e) => e.tipo), efB = (fb.atmosfera.efectos ?? []).map((e) => e.tipo);
for (const e of efR) if (!efB.includes(e)) (atmosfera += 0.4), difs.push(`falta el efecto ${e}`);

/* ---------------------------------------------------------------- imagen */

function hex2lab(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92));
  const [x, y, z] = [(r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047, r * 0.2126 + g * 0.7152 + b * 0.0722, (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883].map((t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116));
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
const ir = ref.medidas.imagen, ib = ban.medidas.imagen;
let imagen: null | { dLuma: number; dRecorte: number; dContraste: number; dSaturacion: number; dVineta: number; deltaE: number } = null;
if (ir && ib) {
  // ΔE de la paleta: cada color de la referencia contra el más parecido del banco, ponderado por su peso
  const deltaE = ir.paleta.reduce((acc, c) => {
    const L = hex2lab(c.hex);
    const best = Math.min(...ib.paleta.map((d) => len(sub(L, hex2lab(d.hex)))));
    return acc + best * c.peso;
  }, 0);
  imagen = { dLuma: ib.luma - ir.luma, dRecorte: ib.recorte - ir.recorte, dContraste: ib.contraste - ir.contraste, dSaturacion: ib.saturacion - ir.saturacion, dVineta: ib.vineta - ir.vineta, deltaE };
}

/* ---------------------------------------------------------------- SSIM y vídeo lado a lado */

let ssim: number | null = null;
const vr = join(REF, "video.mp4"), vb = join(BAN, "video.mp4");
if (existsSync(vr) && existsSync(vb)) {
  const [w, h] = ref.meta.size;
  // ffmpeg imprime «SSIM … All:0.99» en stderr; spawnSync lo devuelve aunque el proceso acabe bien
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", vr, "-i", vb, "-lavfi", `[1:v]scale=${w}:${h}[b];[0:v][b]ssim`, "-f", "null", "-"], { encoding: "utf8" });
  const m = /All:([\d.]+)/.exec(r.stderr ?? "");
  ssim = m ? Number(m[1]) : null;
  const font = process.platform === "win32" ? "fontfile='C\\:/Windows/Fonts/consola.ttf':" : "";
  const label = (t: string) => `drawtext=${font}text='${t}':x=16:y=16:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=6`;
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", vr, "-i", vb, "-filter_complex", `[0:v]scale=-2:540,${label("referencia")}[a];[1:v]scale=-2:540,${label("banco")}[b];[a][b]hstack=shortest=1`, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", join(OUT, "lado.mp4")]);
}

/* ---------------------------------------------------------------- coste */

const pr = fr.presupuesto ?? {}, pb = fb.presupuesto ?? {};
// con las dos medidas desde la API gráfica (docs/34 §1) entra también el coste de relleno (píxeles por fotograma)
const conRelleno = !!(pr.pixelesPorFotograma && pb.pixelesPorFotograma);
// unilateral (docs/34 §3): solo cuenta lo que el banco gasta DE MÁS; ser más barato no es un defecto (si falta contenido,
// lo dicen los ejes de imagen y acabado). Lo que sale más barato se apunta aparte
const exceso = (a: number, b: number) => (b > a ? (b - a) / Math.max(1e-6, b) : 0);
const COSTES: [keyof typeof pr, string, number, number][] = [
  ["drawCalls", "llamadas", conRelleno ? 0.35 : 0.5, 0],
  ["triangulos", "triángulos", conRelleno ? 0.25 : 0.3, 0],
  ["pasadasPorFotograma", "pasadas", conRelleno ? 0.15 : 0.2, 0],
  ["pixelesPorFotograma", "píxeles por fotograma", conRelleno ? 0.25 : 0, 0],
];
const presupuesto = clamp01(COSTES.reduce((s, [k, , w]) => s + w * exceso(Number(pr[k] ?? 0), Number(pb[k] ?? 0)), 0));
const masBarato = COSTES.filter(([k]) => Number(pb[k] ?? 0) < Number(pr[k] ?? 0)).map(([k, n]) => `${n} ${pb[k]} frente a ${pr[k]}`);

/* ---------------------------------------------------------------- alejamiento por eje y resumen */

// sin cámara en una de las dos (la escena no llegó a pintarse) no hay nada que comparar: alejamiento máximo
const sinCamara = pares.length < N / 2;
const alejamiento: Partial<Record<Eje | "imagen" | "piezas" | "coreografia" | "acabado" | "dinamica" | "texto" | "movimiento" | "profundidad", number>> = {
  camara: sinCamara ? 1 : clamp01(errPos * 5 + errFov / 10 + errDir / 20 + errRoll / 30 + errAvance * 2 + (planosIguales ? 0 : 0.2)),
  luz: clamp01(luz + render * 0.5),
  atmosfera: clamp01(atmosfera + (imagen ? Math.abs(imagen.dLuma) * 2 : 0)),
  post: clamp01(post + render * 0.5),
  presupuesto,
};
/*
 * Coreografía de las instancias (un campo de piezas que se levanta, se hunde o se dispersa): por fotograma, el
 * desplazamiento máximo, el desplazamiento medio por eje (ponderado por las copias movidas) y la fracción de copias
 * movidas. Solo con la misma entrada. Los errores van normalizados por el máximo de la referencia.
 */
const coreografia = (() => {
  if (!mismaEntrada) return null;
  const serie = (c: Cap) =>
    c.ms.map((m) => {
      const xs = m.inst ?? [];
      const total = xs.reduce((a, x) => a + x.movidas, 0);
      const media = [0, 1, 2].map((k) => (total ? xs.reduce((a, x) => a + (x.dir?.[k] ?? 0) * x.movidas, 0) / total : 0));
      return { max: Math.max(0, ...xs.map((x) => x.max)), media, total };
    });
  const a = serie(ref), b = serie(ban);
  if (!a.some((x) => x.total) || !b.some((x) => x.total)) return null;
  const nA = Math.max(...a.map((x) => x.total)) || 1, nB = Math.max(...b.map((x) => x.total)) || 1;
  const escala = Math.max(1e-6, ...a.map((x) => x.max));
  const eMax = rms(a.map((x, i) => x.max - b[i].max)) / escala;
  const eMedia = rms(a.map((x, i) => len(sub(x.media, b[i].media)))) / escala;
  const eFrac = rms(a.map((x, i) => x.total / nA - b[i].total / nB));
  // dónde está el pico en cada una (fotograma) y cuánto sobrepasa el valor asentado del final de la meseta
  const pico = (s: typeof a) => s.reduce((best, x, i) => (x.max > s[best].max ? i : best), 0);
  return { errorMax: +eMax.toFixed(4), errorMedia: +eMedia.toFixed(4), errorFraccion: +eFrac.toFixed(4), picoRef: pico(a), picoBanco: pico(b), maxRef: +escala.toFixed(3), maxBanco: +Math.max(...b.map((x) => x.max)).toFixed(3) };
})();

// piezas: la pose medida contra la de la referencia, solo cuando las dos tienen piezas con nombre
if (coreografia) alejamiento.coreografia = clamp01(coreografia.errorMax * 2 + coreografia.errorMedia * 2 + coreografia.errorFraccion);
if (piezas) alejamiento.piezas = clamp01((piezas.posicionPct / 100) * 5 + piezas.giroGrados / 20);
/*
 * Acabado: doce pares de fotogramas repartidos por la captura (el mismo número con la misma entrada; si no, la misma
 * fracción del recorrido), medidos a resolución completa.
 */
const acabado = (() => {
  const lista = (dir: string) => (existsSync(join(dir, "frames")) ? readdirSync(join(dir, "frames")).filter((x) => x.endsWith(".png")).sort() : []);
  const fa = lista(REF), fbs = lista(BAN);
  if (fa.length < 4 || fbs.length < 4) return null;
  const K = 12;
  const ra: Acabado[] = [], rb: Acabado[] = [];
  for (let k = 0; k < K; k++) {
    const t = (k + 0.5) / K;
    const a = acabadoDe(join(REF, "frames", fa[Math.floor(t * fa.length)]));
    const b = acabadoDe(join(BAN, "frames", fbs[Math.floor(t * fbs.length)]));
    if (a && b) (ra.push(a), rb.push(b));
  }
  if (!ra.length) return null;
  return compararAcabado(media(ra), media(rb));
})();
if (acabado) alejamiento.acabado = clamp01(acabado.total);
if (dinamica) alejamiento.dinamica = clamp01(dinamica.total);
if (texto) alejamiento.texto = clamp01(texto.total);
if (imagen) alejamiento.imagen = clamp01(Math.abs(imagen.dLuma) * 3 + Math.abs(imagen.dContraste) * 2 + imagen.deltaE / 40 + Math.abs(imagen.dRecorte) * 5);
/*
 * Movimiento de imagen (docs/34 §3): el flujo del vídeo (cine:flujo) de las dos, por progreso normalizado. Desplazamiento
 * acumulado en x e y, escala en logaritmo y giro, cada uno normalizado por su recorrido en la referencia. Es la cámara de
 * las webs sin three: si a las dos les falta la cámara del gancho, este eje la sustituye.
 */
type Flujo = { acumulado: { t: number; x: number; y: number; escala: number; giro: number }[] };
const flujoDe = (d: string) => (existsSync(join(d, "flujo.json")) ? (JSON.parse(readFileSync(join(d, "flujo.json"), "utf8")) as Flujo) : null);
const fa = flujoDe(REF), fbj = flujoDe(BAN);
const movimiento = (() => {
  if (!fa || !fbj || fa.acumulado.length < 4 || fbj.acumulado.length < 4) return null;
  const en = (f: Flujo, u: number) => f.acumulado[Math.min(f.acumulado.length - 1, Math.round(u * (f.acumulado.length - 1)))];
  const comps = [(p: Flujo["acumulado"][0]) => p.x, (p: Flujo["acumulado"][0]) => p.y, (p: Flujo["acumulado"][0]) => Math.log(p.escala), (p: Flujo["acumulado"][0]) => p.giro];
  const nombres = ["desplazamiento x", "desplazamiento y", "escala", "giro"];
  const filas = comps.map((c, k) => {
    const ra = fa.acumulado.map(c);
    const rango = Math.max(...ra) - Math.min(...ra);
    let e = 0;
    for (let i = 0; i <= 40; i++) e += Math.abs(c(en(fa, i / 40)) - c(en(fbj, i / 40)));
    e /= 41;
    // un componente que la referencia casi no tiene pesa poco: su error se mide contra un suelo (5 % del ancho, 10 % de
    // zoom, 5° de giro), no contra su rango. Un giro de la cámara deja en el flujo un poco de escala y de giro en el
    // plano por la perspectiva (docs/34 §3): por debajo del suelo no es un zoom ni un alabeo de verdad
    const suelo = [0.05, 0.05, 0.1, 5][k];
    return { componente: nombres[k], error: +Math.min(1, e / Math.max(rango, suelo)).toFixed(4), recorridoRef: +rango.toFixed(4), peso: Math.min(1, rango / suelo) };
  });
  const peso = filas.reduce((s, f) => s + f.peso, 0) || 1;
  return { filas, total: filas.reduce((s, f) => s + f.error * f.peso, 0) / peso };
})();
if (movimiento) {
  alejamiento.movimiento = clamp01(movimiento.total);
  if (sinCamara) delete alejamiento.camara;
}
/*
 * Profundidad (docs/36 A8): atmósfera, desenfoque y planos en los mismos doce pares que el acabado, y el paralaje del
 * flujo si las dos lo tienen. Es la «sensación de profundidad» que el tono y el acabado globales no ven.
 */
const profundidad = await (async () => {
  const lista = (dir: string) => (existsSync(join(dir, "frames")) ? readdirSync(join(dir, "frames")).filter((x) => x.endsWith(".png")).sort() : []);
  const la = lista(REF), lb = lista(BAN);
  if (la.length < 4 || lb.length < 4) return null;
  const K = 12;
  const ra: Profundidad[] = [], rb: Profundidad[] = [];
  for (let k = 0; k < K; k++) {
    const t = (k + 0.5) / K;
    const [a, b] = await Promise.all([profundidadDe(join(REF, "frames", la[Math.floor(t * la.length)])), profundidadDe(join(BAN, "frames", lb[Math.floor(t * lb.length)]))]);
    if (a && b) (ra.push(a), rb.push(b));
  }
  if (!ra.length) return null;
  type ConPares = Parameters<typeof paralajeDe>[0];
  return compararProfundidad(mediaProfundidad(ra), mediaProfundidad(rb), paralajeDe(fa as unknown as ConPares), paralajeDe(fbj as unknown as ConPares));
})();
if (profundidad) alejamiento.profundidad = clamp01(profundidad.total);
const orden = Object.entries(alejamiento).sort((a, b) => b[1] - a[1]);
const nombre = (k: string) => (k === "profundidad" ? "Profundidad (atmósfera, desenfoque, planos, paralaje)" : k === "movimiento" ? "Movimiento de imagen (flujo del vídeo)" : k === "imagen" ? "Imagen (tono y color)" : k === "acabado" ? "Acabado (detalle, brillos, grano)" : k === "dinamica" ? "Dinámica (física de una pieza)" : k === "texto" ? "Texto (relato escrito)" : k === "piezas" ? "Piezas (posición y giro)" : k === "coreografia" ? "Coreografía de instancias" : EJE_NOMBRE[k as Eje]);

const resultado = {
  referencia: { dir: REF, url: ref.meta.url },
  banco: { dir: BAN, url: ban.meta.url },
  camara: { errorPosicionPct: +(errPos * 100).toFixed(2), errorFovGrados: +errFov.toFixed(3), errorDireccionGrados: +errDir.toFixed(3), errorAlabeoGrados: +errRoll.toFixed(3), errorAvance: +errAvance.toFixed(4), planos: { referencia: tr, banco: tb, iguales: planosIguales } },
  imagen,
  acabado,
  dinamica,
  texto,
  piezas,
  coreografia,
  ssim,
  movimiento,
  profundidad,
  presupuesto: { referencia: pr, banco: pb },
  diferencias: difs,
  alejamiento,
  depurarPrimero: orden[0]?.[1] > 0.02 ? nombre(orden[0][0]) : null,
};
writeFileSync(join(OUT, "comparacion.json"), JSON.stringify(resultado, null, 1));

const pct = (x: number) => `${Math.round(x * 100)} %`;
const md = [
  `# Comparación`,
  ``,
  `- Referencia: ${ref.meta.url} (\`${REF}\`)`,
  `- Banco: ${ban.meta.url} (\`${BAN}\`)`,
  ``,
  `## Alejamiento por eje (0 % = igual)`,
  ``,
  `| Eje | Alejamiento |`,
  `|---|---|`,
  ...orden.map(([k, v]) => `| ${nombre(k)} | ${pct(v)} |`),
  ``,
  resultado.depurarPrimero ? `**Depurar primero: ${resultado.depurarPrimero}.**` : `**Sin diferencias apreciables.**`,
  ``,
  `## Cámara`,
  ``,
  sinCamara
    ? `- **Sin cámara que comparar** (${pares.length} de ${N + 1} instantes): una de las dos capturas no llegó a pintar la escena; mira los errores de su meta.json.`
    : `- Error de posición: ${resultado.camara.errorPosicionPct} % del tamaño de la escena · fov: ${resultado.camara.errorFovGrados}° · dirección: ${resultado.camara.errorDireccionGrados}° · alabeo: ${resultado.camara.errorAlabeoGrados}° · forma del avance: ${resultado.camara.errorAvance}`,
  `- Alineación: ${mismaEntrada ? "fotograma a fotograma (las dos capturas tuvieron la misma entrada)" : "por el reloj estimado de cada captura (entradas distintas)"}`,
  `- Planos: ${planosIguales ? "los mismos movimientos" : "distintos"}`,
  ...tr.map((t, i) => `  - ${i + 1}. ref ${t.mov} (${t.curva}) · banco ${tb[i] ? `${tb[i].mov} (${tb[i].curva})` : "—"}`),
  ``,
  ...(coreografia ? [`## Coreografía de instancias`, ``, `- Desplazamiento máximo: ref ${coreografia.maxRef} · banco ${coreografia.maxBanco} · error ${Math.round(coreografia.errorMax * 100)} % · medio ${Math.round(coreografia.errorMedia * 100)} % · copias movidas ${Math.round(coreografia.errorFraccion * 100)} %`, `- Pico: fotograma ${coreografia.picoRef} en la referencia, ${coreografia.picoBanco} en el banco`, ``] : []),
  ...(piezas ? [`## Piezas`, ``, `- Posición: ${piezas.posicionPct} % del tamaño de la escena · giro: ${piezas.giroGrados}°`, ...piezas.porPieza.map((p) => `  - ${p.pieza}: ${p.posicionPct} % · ${p.giroGrados}°`), ``] : []),
  `## Diferencias`,
  ``,
  ...(difs.length ? difs.map((d) => `- ${d}`) : ["- ninguna en render, luz, atmósfera ni posprocesado"]),
  ``,
  imagen ? `## Imagen\n\n- Luminancia ${imagen.dLuma >= 0 ? "+" : ""}${imagen.dLuma.toFixed(3)} · recorte ${(imagen.dRecorte * 100).toFixed(2)} pt · contraste ${imagen.dContraste.toFixed(3)} · saturación ${imagen.dSaturacion.toFixed(3)} · viñeta ${imagen.dVineta.toFixed(3)} · ΔE de la paleta ${imagen.deltaE.toFixed(1)}\n` : `## Imagen\n\n- Sin datos: ejecuta \`cine:analyze\` en las dos capturas.\n`,
  texto
    ? `## Texto\n\n- ${texto.apariciones} apariciones en la referencia · faltan ${texto.faltan} · momento ${Math.round(texto.errorMomento * 100)} % del recorrido · duración ${Math.round(texto.errorDuracion * 100)} % · entran distinto ${Math.round(texto.comoDistinto * 100)} %\n\n| Texto | Momento | Duración | Cómo |\n|---|---|---|---|\n${texto.filas.map((f) => `| ${f.texto.slice(0, 36)}${f.con ? ` ↔ ${f.con.slice(0, 30)}` : ""} | ${f.falta ? "falta" : Math.round(f.dMomento * 100) + " %"} | ${f.falta ? "—" : Math.round(f.dDura * 100) + " %"} | ${f.falta ? "—" : f.como ? "igual" : `distinto (${"comoRef" in f ? f.comoRef : ""} → ${"comoBan" in f ? f.comoBan : ""})`} |`).join("\n")}\n`
    : "",
  dinamica
    ? `## Dinámica de ${dinamica.pieza}\n\n| Serie | Error | Máximo ref | Máximo banco |\n|---|---|---|---|\n${(["velocidad", "guinada", "cabeceo", "altura"] as const).map((k) => `| ${k} | ${Math.round((dinamica.errores as Record<string, number>)[k] * 100)} % | ${dinamica.maximos[k][0].toFixed(2)} | ${dinamica.maximos[k][1].toFixed(2)} |`).join("\n")}\n`
    : "",
  acabado
    ? `## Acabado\n\n| Medida | Referencia | Banco | Error | El banco va |\n|---|---|---|---|---|\n${acabado.filas.map((r) => `| ${r.medida} | ${r.ref.toExponential(2)} | ${r.banco.toExponential(2)} | ${Math.round(r.error * 100)} % | ${r.sentido} |`).join("\n")}\n`
    : "",
  movimiento ? `## Movimiento de imagen (flujo del vídeo)

| Componente | Error | Recorrido en la referencia |
|---|---|---|
${movimiento.filas.map((f) => `| ${f.componente} | ${Math.round(f.error * 100)} % | ${f.recorridoRef} |`).join("\n")}
` : "",
  profundidad
    ? `## Profundidad

| Señal | Referencia | Banco | Error | El banco va |
|---|---|---|---|---|
${profundidad.filas.map((f) => `| ${f.senal} | ${f.ref} | ${f.banco} | ${Math.round(f.error * 100)} % | ${f.sentido} |`).join("\n")}
`
    : "",
  `## Presupuesto (${pr.fuente === "gl" && pb.fuente === "gl" ? "API gráfica" : "renderer.info de three"})`,
  ``,
  `| Medida | Referencia | Banco |`,
  `|---|---|---|`,
  ...(["drawCalls", "triangulos", "instancias", "pasadasPorFotograma", "pixelesPorFotograma"] as const).map((k) => `| ${k} | ${pr[k] ?? "—"} | ${pb[k] ?? "—"} |`),
  ``,
  masBarato.length ? `El banco es más barato en: ${masBarato.join(" · ")} (no cuenta en el eje).` : "",
  ``,
  `## SSIM`,
  ``,
  `- ${ssim === null ? "sin vídeo" : ssim.toFixed(4)} (solo significativo si la escena es la misma)`,
  ``,
  `Vídeo lado a lado: \`lado.mp4\`.`,
].join("\n");
writeFileSync(join(OUT, "comparacion.md"), md);
console.log(md);
console.log(`\n  ${OUT}`);
