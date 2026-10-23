/**
 * Comparación de dos capturas (docs/26 §5): la referencia y su recreación en el banco, capturadas igual con `cine:capture`.
 *
 *   npm run cine:compare -- <captura-referencia> <captura-banco> [--out carpeta]
 *
 * Mide, por progreso normalizado del reloj (segundos o scroll de 0 a 1):
 *   - cámara: error de posición (en % del tamaño de la escena), de fov y de dirección; la forma del avance (easing);
 *   - planos: tramos, movimientos y curvas de cada uno;
 *   - render y posprocesado: renderer, tone mapping, exposición, pila de pases y sus parámetros;
 *   - luz: luces por tipo e intensidad, entorno; atmósfera: niebla;
 *   - imagen (si las dos están analizadas): luminancia, recorte, contraste, saturación, viñeteado y paleta (ΔE);
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
import { centro, type Inventario, type Muestra, type Tramo } from "./lib.mts";

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
type Cap = { dir: string; meta: { drive: string; fps: number; size: number[]; imagenes: number; url: string }; ms: Muestra[]; ficha: Ficha; medidas: { tramos: Tramo[]; relojScroll?: string | null; imagen?: Imagen }; inv: Inventario["inv"] };

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

/** progreso 0–1 de cada muestra: tiempo sobre la duración, o scroll (ventana o rueda acumulada) */
function progreso(c: Cap): number[] {
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
const errDir = rms(pares.map(([a, b]) => (Math.acos(Math.max(-1, Math.min(1, dot(a!.dir, b!.dir)))) * 180) / Math.PI));
// forma del avance: recorrido acumulado normalizado de cada una, comparado punto a punto
const avance = (cs: typeof cr) => {
  const acc = [0];
  for (let k = 1; k < cs.length; k++) acc.push(acc[k - 1] + (cs[k] && cs[k - 1] ? len(sub(cs[k]!.pos, cs[k - 1]!.pos)) : 0));
  const tot = acc[acc.length - 1] || 1;
  return acc.map((x) => x / tot);
};
const errAvance = rms(avance(cr).map((x, k) => x - avance(cb)[k]));

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
const presupuesto = clamp01(0.5 * rel(pr.drawCalls ?? 0, pb.drawCalls ?? 0) + 0.3 * rel(pr.triangulos ?? 0, pb.triangulos ?? 0) + 0.2 * rel(pr.pasadasPorFotograma ?? 0, pb.pasadasPorFotograma ?? 0));

/* ---------------------------------------------------------------- alejamiento por eje y resumen */

// sin cámara en una de las dos (la escena no llegó a pintarse) no hay nada que comparar: alejamiento máximo
const sinCamara = pares.length < N / 2;
const alejamiento: Partial<Record<Eje | "imagen", number>> = {
  camara: sinCamara ? 1 : clamp01(errPos * 5 + errFov / 10 + errDir / 20 + errAvance * 2 + (planosIguales ? 0 : 0.2)),
  luz: clamp01(luz + render * 0.5),
  atmosfera: clamp01(atmosfera + (imagen ? Math.abs(imagen.dLuma) * 2 : 0)),
  post: clamp01(post + render * 0.5),
  presupuesto,
};
if (imagen) alejamiento.imagen = clamp01(Math.abs(imagen.dLuma) * 3 + Math.abs(imagen.dContraste) * 2 + imagen.deltaE / 40 + Math.abs(imagen.dRecorte) * 5);
const orden = Object.entries(alejamiento).sort((a, b) => b[1] - a[1]);
const nombre = (k: string) => (k === "imagen" ? "Imagen (tono y color)" : EJE_NOMBRE[k as Eje]);

const resultado = {
  referencia: { dir: REF, url: ref.meta.url },
  banco: { dir: BAN, url: ban.meta.url },
  camara: { errorPosicionPct: +(errPos * 100).toFixed(2), errorFovGrados: +errFov.toFixed(3), errorDireccionGrados: +errDir.toFixed(3), errorAvance: +errAvance.toFixed(4), planos: { referencia: tr, banco: tb, iguales: planosIguales } },
  imagen,
  ssim,
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
    : `- Error de posición: ${resultado.camara.errorPosicionPct} % del tamaño de la escena · fov: ${resultado.camara.errorFovGrados}° · dirección: ${resultado.camara.errorDireccionGrados}° · forma del avance: ${resultado.camara.errorAvance}`,
  `- Planos: ${planosIguales ? "los mismos movimientos" : "distintos"}`,
  ...tr.map((t, i) => `  - ${i + 1}. ref ${t.mov} (${t.curva}) · banco ${tb[i] ? `${tb[i].mov} (${tb[i].curva})` : "—"}`),
  ``,
  `## Diferencias`,
  ``,
  ...(difs.length ? difs.map((d) => `- ${d}`) : ["- ninguna en render, luz, atmósfera ni posprocesado"]),
  ``,
  imagen ? `## Imagen\n\n- Luminancia ${imagen.dLuma >= 0 ? "+" : ""}${imagen.dLuma.toFixed(3)} · recorte ${(imagen.dRecorte * 100).toFixed(2)} pt · contraste ${imagen.dContraste.toFixed(3)} · saturación ${imagen.dSaturacion.toFixed(3)} · viñeta ${imagen.dVineta.toFixed(3)} · ΔE de la paleta ${imagen.deltaE.toFixed(1)}\n` : `## Imagen\n\n- Sin datos: ejecuta \`cine:analyze\` en las dos capturas.\n`,
  `## SSIM`,
  ``,
  `- ${ssim === null ? "sin vídeo" : ssim.toFixed(4)} (solo significativo si la escena es la misma)`,
  ``,
  `Vídeo lado a lado: \`lado.mp4\`.`,
].join("\n");
writeFileSync(join(OUT, "comparacion.md"), md);
console.log(md);
console.log(`\n  ${OUT}`);
