/**
 * Una vuelta del bucle de depuración con una orden (docs/33 §3): captura el banco de un estudio con su receta
 * (`scripts/cine/recetas.json`), lo analiza, lo compara con su referencia (y la dinámica del conjunto si la receta la
 * tiene), monta el par de fotogramas y compara cada eje con la vuelta anterior. Sustituye a las tres órdenes que se
 * lanzaban a mano 12–18 veces por estudio.
 *
 *   npm run cine:vuelta -- <estudio> [--nota "qué cambié"] [--sin-captura]
 *   npm run cine:vuelta -- <estudio> --referencia      vuelve a capturar la referencia con la receta (y su tramo)
 *   npm run cine:vuelta -- <estudio> --ruido           el ruido de cada eje: la referencia contra otra captura de sí misma
 *   npm run cine:vuelta -- --lista                     estudios con receta y su última vuelta
 *
 * Salida en `<carpeta>/vuelta-NN/`: banco/, cmp/ (comparacion.md, lado.mp4), par.png (referencia arriba, banco abajo, al
 * 10, 40, 70 y 100 % del recorrido) y tonos.json (reparto de claros, medios, oscuros y color de cada una). Cada vuelta
 * se apunta en `<carpeta>/historial.jsonl` con la nota, el commit y el alejamiento por eje.
 */
import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { textoVeredicto, veredictos, type Objetivos } from "../../lib/cine/objetivos";

type Receta = { url: string; captura: string; ref: string; referencia?: string; tramoReferencia?: [number, number]; comparar?: string; conjunto?: { ref: string; args: string }; flujo?: boolean; objetivos?: Objetivos; carpeta: string };
const RECETAS = JSON.parse(readFileSync(resolve("scripts/cine/recetas.json"), "utf8")) as Record<string, Receta>;

const argv = process.argv.slice(2);
const opt = (n: string, d: string) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

/** separa una línea de argumentos respetando las comillas */
const partir = (s: string) => (s.match(/"[^"]*"|\S+/g) ?? []).map((x) => x.replace(/^"|"$/g, ""));
const tsx = (script: string, args: string[], silencio = true) => {
  const out = execFileSync(process.execPath, [resolve("node_modules/tsx/dist/cli.mjs"), resolve("scripts/cine", script), ...args], { encoding: "utf8", maxBuffer: 1 << 26, stdio: silencio ? ["ignore", "pipe", "pipe"] : "inherit" });
  return out ?? "";
};
const historial = (c: string) => (existsSync(join(c, "historial.jsonl")) ? readFileSync(join(c, "historial.jsonl"), "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);

if (argv.includes("--lista")) {
  for (const [id, r] of Object.entries(RECETAS)) {
    if (id === "_") continue;
    const h = historial(r.carpeta);
    const u = h[h.length - 1];
    console.log(`${id.padEnd(14)} ${existsSync(r.ref) ? "ref ✓" : "ref ✗"}  ${u ? `vuelta ${u.n} (${u.fecha.slice(0, 10)}): ${Object.entries(u.alejamiento as Record<string, number>).map(([k, v]) => `${k} ${Math.round(v * 100)}%`).join(" · ")}` : "sin vueltas"}`);
  }
  process.exit(0);
}

const id = argv.find((a) => !a.startsWith("--") && RECETAS[a]);
if (!id) {
  console.log(`Uso: npm run cine:vuelta -- <estudio> [--nota "…"] [--sin-captura] [--referencia]\nEstudios: ${Object.keys(RECETAS).filter((k) => k !== "_").join(", ")}`);
  process.exit(1);
}
const r = RECETAS[id];
const CARPETA = resolve(r.carpeta);
mkdirSync(CARPETA, { recursive: true });

/** captura la referencia con su receta (y su tramo) en `salida` */
const capturarReferencia = (salida: string) => {
  if (!r.referencia) throw new Error(`la receta de ${id} no dice cómo capturar la referencia`);
  const [url, ...resto] = partir(r.referencia);
  const destino = r.tramoReferencia ? `${salida}-completa` : salida;
  console.log(`→ referencia de ${id}: ${url}`);
  tsx("capture.mts", [url, ...resto, "--out", destino], false);
  if (r.tramoReferencia) tsx("tramo.mts", [destino, String(r.tramoReferencia[0]), String(r.tramoReferencia[1]), salida], false);
  tsx("analyze.mts", [salida]);
  if (r.flujo) tsx("flujo.mts", [salida]);
};
if (argv.includes("--referencia")) {
  capturarReferencia(r.ref);
  console.log(`  ${resolve(r.ref)}`);
  process.exit(0);
}
/*
 * El ruido de cada eje (docs/34 §4): la referencia contra otra captura de sí misma con la misma receta. Una web viva
 * (sucesos al azar, física, partículas) nunca da 0 %: lo que una vuelta del banco mejore por debajo de este ruido no es
 * una mejora medible.
 */
if (argv.includes("--ruido")) {
  // dos capturas nuevas: comparar con una referencia de otra versión de la herramienta (sin gl.js, por ejemplo) mide la
  // diferencia de herramienta, no el ruido de la web
  const a1 = join(CARPETA, "ruido", "a"), a2 = join(CARPETA, "ruido", "b");
  capturarReferencia(a1);
  capturarReferencia(a2);
  tsx("compare.mts", [a1, a2, "--out", join(CARPETA, "ruido", "cmp"), ...partir(r.comparar ?? "")]);
  const c = JSON.parse(readFileSync(join(CARPETA, "ruido", "cmp", "comparacion.json"), "utf8")) as { alejamiento: Record<string, number> };
  writeFileSync(join(CARPETA, "ruido.json"), JSON.stringify({ fecha: new Date().toISOString(), alejamiento: c.alejamiento }, null, 1));
  console.log(`Ruido de ${id} (la referencia contra sí misma):\n${Object.entries(c.alejamiento).map(([k, v]) => `  ${k.padEnd(12)} ${Math.round(v * 100)} %`).join("\n")}`);
  process.exit(0);
}
if (!existsSync(join(r.ref, "timeline.jsonl"))) throw new Error(`falta la referencia ${r.ref}: npm run cine:vuelta -- ${id} --referencia`);

const previas = historial(CARPETA);
const sinCaptura = argv.includes("--sin-captura") && previas.length > 0;
const n = sinCaptura ? previas[previas.length - 1].n : (previas.length ? previas[previas.length - 1].n : 0) + 1;
const DIR = join(CARPETA, `vuelta-${String(n).padStart(2, "0")}`);
const BANCO = join(DIR, "banco"), CMP = join(DIR, "cmp");
mkdirSync(DIR, { recursive: true });
const t0 = Date.now();

if (!sinCaptura) {
  console.log(`→ vuelta ${n} de ${id}: captura del banco`);
  tsx("capture.mts", [r.url, ...partir(r.captura), "--out", BANCO]);
}
if (!existsSync(join(r.ref, "imagen.json")) && !existsSync(join(r.ref, "informe.html"))) tsx("analyze.mts", [r.ref]);
tsx("analyze.mts", [BANCO]);
// el movimiento de imagen (webs sin three o con la cámara escondida): el flujo de las dos
if (r.flujo) {
  if (!existsSync(join(r.ref, "flujo.json"))) tsx("flujo.mts", [r.ref]);
  tsx("flujo.mts", [BANCO]);
}
tsx("compare.mts", [r.ref, BANCO, "--out", CMP, ...partir(r.comparar ?? "")]);
const cmp = JSON.parse(readFileSync(join(CMP, "comparacion.json"), "utf8")) as { alejamiento: Record<string, number> };
const alejamiento: Record<string, number> = { ...cmp.alejamiento };

// la dinámica del conjunto (racimos, enjambres) si la receta la tiene
if (r.conjunto) {
  const sale = join(DIR, "conjunto.json");
  tsx("conjunto.mts", [r.url, ...partir(r.conjunto.args), "--out", sale]);
  const txt = tsx("conjunto.mts", ["--comparar", r.conjunto.ref, sale]);
  const m = txt.match(/Alejamiento del conjunto: ([\d.]+) %/);
  if (m) alejamiento.conjunto = Number(m[1]) / 100;
  writeFileSync(join(DIR, "conjunto.md"), txt);
}

// par de fotogramas: referencia arriba, banco abajo, al 10, 40, 70 y 100 % del recorrido
const fotos = (d: string) => readdirSync(join(d, "frames")).filter((f) => f.endsWith(".png")).sort();
const fr = fotos(r.ref), fb = fotos(BANCO);
const fr4 = [0.1, 0.4, 0.7, 1].map((k) => join(r.ref, "frames", fr[Math.min(fr.length - 1, Math.round(k * (fr.length - 1)))]));
const fb4 = [0.1, 0.4, 0.7, 1].map((k) => join(BANCO, "frames", fb[Math.min(fb.length - 1, Math.round(k * (fb.length - 1)))]));
const W = 480, meta = await sharp(fr4[0]).metadata(), H = Math.round((W * (meta.height ?? 9)) / (meta.width ?? 16));
const celdas = await Promise.all([...fr4, ...fb4].map((f) => sharp(f).resize(W, H, { fit: "fill" }).png().toBuffer()));
await sharp({ create: { width: W * 4, height: H * 2, channels: 3, background: "#000" } })
  .composite(celdas.map((b, i) => ({ input: b, left: (i % 4) * W, top: Math.floor(i / 4) * H })))
  .png()
  .toFile(join(DIR, "par.png"));

// reparto de tonos (docs/31 §4: lo que explicó la imagen de Lusion): claros, medios y oscuros poco saturados, y color
const tonos = async (fs: string[]) => {
  const acc = [0, 0, 0, 0];
  for (const f of fs) {
    const { data } = await sharp(f).resize(320).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let c = 0, m = 0, o = 0, col = 0;
    const px = data.length / 3;
    for (let i = 0; i < data.length; i += 3) {
      const R = data[i] / 255, G = data[i + 1] / 255, B = data[i + 2] / 255;
      const L = 0.2126 * R + 0.7152 * G + 0.0722 * B, sat = Math.max(R, G, B) - Math.min(R, G, B);
      // color = saturado; el resto (grises y tonos poco saturados como el papel) por luminancia
      if (sat > 0.25) col++;
      else if (L > 0.45) c++;
      else if (L > 0.2) m++;
      else o++;
    }
    [c, m, o, col].forEach((v, k) => (acc[k] += v / px / fs.length));
  }
  return { claro: +acc[0].toFixed(3), medio: +acc[1].toFixed(3), oscuro: +acc[2].toFixed(3), color: +acc[3].toFixed(3) };
};
const tr = await tonos(fr4), tb = await tonos(fb4);
writeFileSync(join(DIR, "tonos.json"), JSON.stringify({ referencia: tr, banco: tb }, null, 1));

// informe de la vuelta, contra la anterior
let commit = "";
try {
  commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
} catch {
  /* sin git */
}
const ant = previas.filter((p) => p.n !== n).pop();
const ruido = existsSync(join(CARPETA, "ruido.json")) ? (JSON.parse(readFileSync(join(CARPETA, "ruido.json"), "utf8")) as { alejamiento: Record<string, number> }).alejamiento : null;
const ver = veredictos(alejamiento, ruido, r.objetivos);
const lineas = [
  `# ${id} · vuelta ${n}${opt("--nota", "") ? ` · ${opt("--nota", "")}` : ""}`,
  "",
  `**Cumple ${ver.cumple} de ${ver.total} ejes**${ver.cumple === ver.total ? " · listo: todos en su objetivo" : ` · el que más falta: ${ver.ejes.filter((e) => e.cumple === false).sort((a, b) => b.falta - a.falta)[0]?.eje}`}`,
  "",
  `| Eje | Ahora | Antes | Cambio | Ruido | Objetivo | Veredicto |`,
  `|---|---|---|---|---|---|---|`,
];
for (const e of ver.ejes) {
  const a = ant?.alejamiento?.[e.eje];
  const d = a === undefined ? "" : Math.round((e.valor - a) * 100);
  lineas.push(`| ${e.eje} | ${Math.round(e.valor * 100)} % | ${a === undefined ? "—" : Math.round(a * 100) + " %"} | ${d === "" ? "" : d === 0 ? "=" : d < 0 ? `▼ ${-d}` : `▲ ${d}`} | ${e.ruido === undefined ? "—" : Math.round(e.ruido * 100) + " %"} | ${e.objetivo === null ? "—" : Math.round(e.objetivo * 100) + " %"} | ${textoVeredicto(e)} |`);
}
lineas.push("", `Tonos (claro · medio · oscuro · color): referencia ${Object.values(tr).join(" · ")} · banco ${Object.values(tb).join(" · ")}`, "", `Par de fotogramas: ${join(DIR, "par.png")} · lado a lado: ${join(CMP, "lado.mp4")} · comparación: ${join(CMP, "comparacion.md")}`);
writeFileSync(join(DIR, "vuelta.md"), lineas.join("\n") + "\n");
if (!sinCaptura) appendFileSync(join(CARPETA, "historial.jsonl"), JSON.stringify({ n, fecha: new Date().toISOString(), nota: opt("--nota", ""), commit, alejamiento, veredicto: { cumple: ver.cumple, total: ver.total, ejes: Object.fromEntries(ver.ejes.map((e) => [e.eje, e.cumple])) }, tonos: { referencia: tr, banco: tb } }) + "\n");
console.log(lineas.join("\n"));
console.log(`\n  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
