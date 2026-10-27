/**
 * Análisis de una captura de `cine:capture` (docs/26 §2).
 *
 *   npm run cine:analyze -- .refs3d/<slug>/<fecha>
 *
 * Con ffmpeg y sin dependencias nuevas:
 *   - cortes de plano del vídeo (`select=gt(scene,0.3)`);
 *   - imagen por fotograma: luminancia, altas luces recortadas, contraste (p90 − p10), saturación, viñeteado (borde frente
 *     a centro), energía de movimiento (diferencia entre fotogramas) y paleta dominante (k-medias sobre miniaturas);
 *   - vídeo anotado (anotado.mp4): código de tiempo, fotograma, plano, movimiento y curva de cada tramo;
 *   - informe.html: el visor (vídeo + gráficas sincronizadas + notas y rúbrica, que se exportan como notas.json);
 *   - ficha.json: la ficha medida, con las notas y la rúbrica de notas.json si existe, y las medidas de imagen.
 * Se puede repetir: vuelve a leer notas.json y rehace todo.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { ANCLAS, EJE_NOMBRE } from "../../lib/cine/rubric";
import { EJES, type Ficha, type Nota, type Rubrica } from "../../lib/cine/schema";
import { centro, fichaDesdeCaptura, type Inventario, type Muestra, type Tramo } from "./lib.mts";
import { respuestaPuntero } from "./puntero.mts";
import { relatoDom } from "./dom.mts";
import { leerPasadas } from "./pasadas.mts";

const dir = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!dir || !existsSync(join(dir, "timeline.jsonl"))) {
  console.log("Uso: npm run cine:analyze -- <carpeta de captura con timeline.jsonl>");
  process.exit(1);
}
const OUT = resolve(dir);
const read = <T,>(f: string): T => JSON.parse(readFileSync(join(OUT, f), "utf8"));
const meta = read<{ url: string; slug: string; fecha: string; drive: string; fps: number; size: number[]; frames: number; imagenes: number }>("meta.json");
const timeline: Muestra[] = readFileSync(join(OUT, "timeline.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const invs = read<Inventario[]>("inventario.json");
/*
 * La ficha medida se rehace con la versión actual de lib.mts a partir de lo guardado (timeline, inventario y shaders):
 * una mejora del análisis vale para capturas antiguas sin repetirlas. Las firmas del JavaScript publicado no se pueden
 * rehacer (el bundle no se guarda): se conservan las de la captura.
 */
const previa = read<{ medidas: Record<string, unknown> }>("ficha.auto.json");
const shaderIndex = existsSync(join(OUT, "shaders", "index.json")) ? read<{ id: string; lang: string; label?: string | null }[]>("shaders/index.json") : [];
const shaders = shaderIndex.map((s) => ({ lang: s.lang, label: s.label, code: readFileSync(join(OUT, "shaders", `${s.id}.${s.lang}`), "utf8") }));
const rehecha = fichaDesdeCaptura(meta, timeline, invs, shaders);
const auto = { ficha: rehecha.ficha, medidas: { ...rehecha.medidas, firmasCodigo: previa.medidas.firmasCodigo ?? {}, // la respuesta al puntero solo tiene sentido con el barrido del puntero (con arrastres, el puntero solo existe en ellos)
    puntero: meta.drive === "pointer" ? respuestaPuntero(timeline, meta.size as [number, number]) : [] } } as unknown as { ficha: Ficha; medidas: Record<string, unknown> & { tramos: Tramo[]; centroEscena: number[] } };
// el relato escrito (docs/30 §1): qué textos entran, cuándo, cómo y con qué curva, visto en los píxeles
const relato = relatoDom(OUT, timeline, meta.size as [number, number]);
if (relato.length) {
  (auto.medidas as Record<string, unknown>).relato = relato;
  writeFileSync(join(OUT, "relato.json"), JSON.stringify(relato, null, 1));
  console.log(`  relato: ${relato.length} apariciones de texto`);
} else if (existsSync(join(OUT, "relato.json"))) {
  // un relato de una captura anterior no puede quedarse: cine:compare lo leería como si fuera de esta
  rmSync(join(OUT, "relato.json"));
  console.log("  relato: ninguna aparición de texto (se borra el relato anterior)");
}
// la cadena de render leída de la API gráfica (docs/34 §2), en tres momentos: cambia cuando cambia la escena
const conGl = timeline.filter((m) => m.gl && m.gl.pasadas.length);
if (conGl.length) {
  const momentos = [0.2, 0.5, 0.85].map((k) => conGl[Math.min(conGl.length - 1, Math.floor(k * conGl.length))]);
  const cadena = momentos.map((m) => ({ t: m.t, calls: m.gl!.calls, pasadas: m.gl!.pasadas.length, tecnicas: leerPasadas(m.gl!) }));
  (auto.medidas as Record<string, unknown>).cadena = cadena;
  const md = [`# Cadena de render · ${meta.url}`, "", "Leída de la API gráfica (gancho gl.js), sin saber el motor (docs/34 §2).", ""];
  for (const c of cadena) md.push(`## ${c.t.toFixed(1)} s · ${c.pasadas} pasadas · ${c.calls} llamadas`, "", ...c.tecnicas.map((x) => `- ${x.texto}`), "");
  writeFileSync(join(OUT, "pasadas.md"), md.join("\n"));
  console.log(`  cadena de render: ${cadena[1].tecnicas.map((x) => x.tipo).join(", ")} (pasadas.md)`);
}
writeFileSync(join(OUT, "ficha.auto.json"), JSON.stringify(auto, null, 1));
const fps = meta.fps;
const VIDEO = join(OUT, "video.mp4");
if (!existsSync(VIDEO)) {
  console.log("Falta video.mp4 (la captura necesita al menos dos imágenes).");
  process.exit(1);
}

/* ---------------------------------------------------------------- ffmpeg: medidas por fotograma */

const ff = (args: string[], cwd = OUT) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { cwd, maxBuffer: 1 << 28 });

/** `metadata=print` → un valor por fotograma (en orden) para cada clave pedida */
function perFrame(filter: string, keys: string[]): Record<string, number[]> {
  const file = "_meta.txt";
  ff(["-i", "video.mp4", "-vf", `${filter},metadata=print:file=${file}`, "-f", "null", "-"]);
  const out: Record<string, number[]> = Object.fromEntries(keys.map((k) => [k, []]));
  for (const line of readFileSync(join(OUT, file), "utf8").split("\n")) {
    const m = /^lavfi\.([\w.]+)=(-?[\d.]+)/.exec(line.trim());
    if (m && out[m[1]]) out[m[1]].push(Number(m[2]));
  }
  return out;
}
// Y de 8 bits en rango de TV (16–235) → 0–1
const y01 = (y: number) => Math.min(1, Math.max(0, (y - 16) / 219));

const st = perFrame("signalstats", ["signalstats.YAVG", "signalstats.YLOW", "signalstats.YHIGH", "signalstats.SATAVG"]);
const clip = perFrame("lutyuv=y='if(gte(val\\,233)\\,255\\,0)',signalstats", ["signalstats.YAVG"])["signalstats.YAVG"].map((y) => y / 255);
const center = perFrame("crop=iw/2:ih/2,signalstats", ["signalstats.YAVG"])["signalstats.YAVG"];
const motion = perFrame("tblend=all_mode=difference,signalstats", ["signalstats.YAVG"])["signalstats.YAVG"].map((y) => y / 255);

// cortes de plano
ff(["-i", "video.mp4", "-vf", "select='gt(scene\\,0.3)',metadata=print:file=_cortes.txt", "-f", "null", "-"]);
const cortes = readFileSync(join(OUT, "_cortes.txt"), "utf8")
  .split("\n")
  .map((l) => /pts_time:([\d.]+)/.exec(l)?.[1])
  .filter(Boolean)
  .map(Number);

// paleta: miniaturas de 32×18 de 12 fotogramas repartidos, k-medias con k = 6
const n = meta.imagenes;
const every = Math.max(1, Math.floor(n / 12));
const raw = ff(["-i", "video.mp4", "-vf", `select='not(mod(n\\,${every}))',scale=32:18:flags=area`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]);
const px: number[][] = [];
for (let i = 0; i + 2 < raw.length; i += 3) px.push([raw[i], raw[i + 1], raw[i + 2]]);
function kmeans(points: number[][], k: number) {
  const sorted = [...points].sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
  let cs = Array.from({ length: k }, (_, i) => [...sorted[Math.floor(((i + 0.5) / k) * sorted.length)]]);
  let assign: number[] = [];
  for (let it = 0; it < 12; it++) {
    assign = points.map((p) => {
      let best = 0, bd = Infinity;
      cs.forEach((c, j) => {
        const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
        if (d < bd) (bd = d), (best = j);
      });
      return best;
    });
    cs = cs.map((c, j) => {
      const mine = points.filter((_, i) => assign[i] === j);
      return mine.length ? [0, 1, 2].map((ch) => mine.reduce((s, p) => s + p[ch], 0) / mine.length) : c;
    });
  }
  return cs
    .map((c, j) => ({ hex: "#" + c.map((x) => Math.round(x).toString(16).padStart(2, "0")).join(""), peso: assign.filter((a) => a === j).length / points.length }))
    .sort((a, b) => b.peso - a.peso);
}
const paleta = px.length ? kmeans(px, 6) : [];

/* ---------------------------------------------------------------- series sincronizadas con el vídeo */

const shots = timeline.filter((m) => m.shot);
const c0 = centro(invs.find((x) => x.inv)?.inv ?? null);
const scroll = meta.drive === "scroll";
// el reloj de la ficha en cada imagen (segundos, o progreso de scroll por la rueda o la ventana)
const totalWheel = timeline.reduce((a, m) => a + (m.input.wheel ?? 0), 0) || 1;
const relojDe = new Map<number, number>();
let acc = 0;
for (const m of timeline) {
  acc += m.input.wheel ?? 0;
  relojDe.set(m.i, !scroll ? m.t : auto.medidas.relojScroll === "ventana" ? (m.scroll.max > 0 ? m.scroll.y / m.scroll.max : 0) : acc / totalWheel);
}
const vt = (m: Muestra) => (m.shot! - 1) / fps;
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const series = {
  t: shots.map(vt),
  reloj: shots.map((m) => +(relojDe.get(m.i) ?? 0).toFixed(5)),
  x: shots.map((m) => m.camera?.pos[0] ?? null),
  y: shots.map((m) => m.camera?.pos[1] ?? null),
  z: shots.map((m) => m.camera?.pos[2] ?? null),
  dist: shots.map((m) => (m.camera ? +Math.hypot(...m.camera.pos.map((p, i) => p - c0[i])).toFixed(4) : null)),
  fov: shots.map((m) => m.camera?.fov ?? null),
  luma: st["signalstats.YAVG"].map((y) => +y01(y).toFixed(4)),
  clip10: clip.map((c) => +(c * 10).toFixed(4)),
  mov: [0, ...motion].slice(0, shots.length).map((x) => +x.toFixed(5)),
  calls: shots.map((m) => m.renderer?.calls ?? null),
};

const lumaAll = st["signalstats.YAVG"].map(y01);
const vineta = avg(lumaAll.map((full, i) => {
  const c = y01(center[i] ?? 0);
  const edge = (full * 4 - c) / 3;
  return c > 0.002 ? edge / c : 1;
}));
const imagen = {
  luma: avg(lumaAll),
  recorte: avg(clip),
  contraste: avg(st["signalstats.YHIGH"].map((h, i) => y01(h) - y01(st["signalstats.YLOW"][i]))),
  saturacion: avg(st["signalstats.SATAVG"]) / 128,
  vineta,
  movimiento: { media: avg(motion), pico: Math.max(0, ...motion) },
  paleta,
};

/* ---------------------------------------------------------------- tramos en tiempo de vídeo */

const shotOf = (i: number) => timeline.find((m) => m.i >= i && m.shot)?.shot ?? 1;
const tramos = auto.medidas.tramos.map((t, k) => ({
  id: `p${k + 1}`,
  v0: (shotOf(t.i0) - 1) / fps,
  v1: (shotOf(t.i1) - 1) / fps,
  reloj: scroll ? `scroll ${t.desde.toFixed(3)}–${t.hasta.toFixed(3)}` : `${t.desde.toFixed(2)}–${t.hasta.toFixed(2)} s`,
  movimientos: t.movimientos,
  curvas: t.curvas.slice(0, 2),
  meseta: t.meseta,
}));

/* ---------------------------------------------------------------- vídeo anotado */

const ass = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${sec.toFixed(2).padStart(5, "0")}`;
};
const [W, H] = meta.size;
const subs = [
  "[Script Info]",
  "ScriptType: v4.00+",
  `PlayResX: ${W}`,
  `PlayResY: ${H}`,
  "",
  "[V4+ Styles]",
  "Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV",
  `Style: T, Consolas, ${Math.round(H / 34)}, &H00FFFFFF, &H00000000, &H90000000, 0, 3, 6, 0, 1, 24, 24, 24`,
  "",
  "[Events]",
  "Format: Layer, Start, End, Style, Text",
  ...tramos.map((t) => `Dialogue: 0, ${ass(t.v0)}, ${ass(t.v1 + 1 / fps)}, T, ${t.id} · ${t.movimientos.join(" + ")}${t.curvas[0] ? ` · ${t.curvas[0].curva}` : ""}${t.meseta ? ` · meseta ${Math.round(t.meseta * 100)} %` : ""}  (${t.reloj})`),
].join("\n");
writeFileSync(join(OUT, "anotado.ass"), subs);
const font = process.platform === "win32" ? "fontfile='C\\:/Windows/Fonts/consola.ttf':" : "";
ff(["-i", "video.mp4", "-vf", `subtitles=anotado.ass,drawtext=${font}text='%{pts\\:hms}  f%{frame_num}':x=w-tw-24:y=24:fontsize=${Math.round(H / 34)}:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=8`, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "anotado.mp4"]);

/* ---------------------------------------------------------------- notas, ficha.json e informe */

const notasFile = join(OUT, "notas.json");
const notas: { notas: (Nota & { v?: number })[]; rubrica: Rubrica } | null = existsSync(notasFile) ? JSON.parse(readFileSync(notasFile, "utf8")) : null;
const ficha: Ficha = {
  ...auto.ficha,
  notas: notas?.notas.map(({ t, eje, texto }) => ({ t, eje, texto })),
  rubrica: notas?.rubrica,
  origen: { ...auto.ficha.origen, ...(notas?.notas.length ? { notas: "video" as const } : {}), ...(notas?.rubrica && Object.keys(notas.rubrica).length ? { rubrica: "ojo" as const } : {}) },
};
writeFileSync(join(OUT, "ficha.json"), JSON.stringify({ ficha, medidas: { ...auto.medidas, imagen, cortes } }, null, 1));

// reloj de la ficha a partir del tiempo de vídeo, para las notas del visor
const relojFn = "const S = DATA.series; let k = 0; while (k < S.t.length - 1 && S.t[k + 1] <= vt) k++; return S.reloj[k];";
const data = {
  id: `${meta.slug}/${meta.fecha}`,
  titulo: auto.ficha.titulo,
  url: meta.url,
  meta,
  fps,
  series,
  cortes,
  tramos,
  imagen,
  ficha,
  medidas: auto.medidas,
  notas,
  relojFn,
  ejes: EJES.map((id) => ({ id, nombre: EJE_NOMBRE[id], anclas: ANCLAS[id] })),
};
const tpl = readFileSync(resolve("scripts/cine/informe.html"), "utf8");
// el JSON va dentro de un <script>: se escapa «</» para que ningún texto lo cierre
writeFileSync(join(OUT, "informe.html"), tpl.replace("/*DATA*/null", JSON.stringify(data).replace(/<\//g, "<\\/")));
for (const f of ["_meta.txt", "_cortes.txt"]) rmSync(join(OUT, f), { force: true });

console.log(`  ${tramos.length} tramos de cámara, ${cortes.length} cortes, luminancia ${imagen.luma.toFixed(3)}, recorte ${(imagen.recorte * 100).toFixed(2)} %, viñeta ${imagen.vineta.toFixed(3)}`);
console.log(`  paleta: ${paleta.map((p) => `${p.hex} ${Math.round(p.peso * 100)}%`).join(" · ")}`);
// deriva sospechosa: la imagen se apaga sola con la cámara quieta (exposición automática o lecturas asíncronas de la GPU
// que el reloj virtual no deja avanzar): mejor repetir con --real
{
  const n10 = Math.max(1, Math.floor(lumaAll.length / 10));
  const ini = avg(lumaAll.slice(0, n10)), fin = avg(lumaAll.slice(-n10));
  const quieta = auto.medidas.tramos.every((t) => t.movimientos[0] === "fijo");
  if (meta.drive === "time" && quieta && ini > 0.05 && fin < ini * 0.4) console.log(`  ⚠ la imagen se apaga sola (${ini.toFixed(3)} → ${fin.toFixed(3)}) con la cámara quieta: repite la captura con --real`);
}
console.log(`  ${join(OUT, "informe.html")}`);
