/**
 * Corta una captura a un tramo de tiempo (docs/32 §2): webs con aviso de edad, título o intro de texto antes del 3D,
 * cuyo banco solo recrea lo de después. La salida es una captura normal (se analiza y se compara igual), con el tiempo
 * y los fotogramas desde 0.
 *
 *   npm run cine:tramo -- <captura> <desde-s> <hasta-s> <salida>
 *   npm run cine:tramo -- <captura> movimiento <hasta-s|quieto> <salida>
 *
 * `movimiento` empieza en el primer fotograma en que la cámara se mueve de verdad (más de 1 mm o 0,05°: los gestos
 * tienen fotogramas casi quietos antes del disparo y falsean la curva, docs/28 trampa 5); `quieto` acaba 1 s después
 * del último fotograma en que se mueve.
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import type { Inventario, Muestra } from "./lib.mts";

const [src, a, b, dst] = process.argv.slice(2);
if (!src || !a || !b || !dst || !existsSync(join(src, "timeline.jsonl"))) {
  console.log("Uso: npm run cine:tramo -- <captura> <desde-s> <hasta-s> <salida>");
  process.exit(1);
}
const SRC = resolve(src), DST = resolve(dst);
const todo = readFileSync(join(SRC, "timeline.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l) as Muestra);
/** ¿se mueve la cámara entre dos muestras? */
const mueve = (p: Muestra, q: Muestra) => {
  if (!p.camera || !q.camera) return false;
  const d = Math.hypot(...p.camera.pos.map((v, i) => v - q.camera!.pos[i]));
  const g = (Math.acos(Math.min(1, p.camera.dir.reduce((s, v, i) => s + v * q.camera!.dir[i], 0))) * 180) / Math.PI;
  return d > 0.001 || g > 0.05;
};
const primera = todo.findIndex((m, i) => i > 0 && mueve(todo[i - 1], m));
let ultima = -1;
for (let i = todo.length - 1; i > 0; i--) if (mueve(todo[i - 1], todo[i])) (ultima = i), (i = 0);
const desde = a === "movimiento" ? (primera > 0 ? todo[primera - 1].t : 0) : Number(a);
const hasta = b === "quieto" ? (ultima > 0 ? todo[ultima].t + 1 : todo[todo.length - 1].t) : Number(b);
if (a === "movimiento" || b === "quieto") console.log(`  la cámara se mueve de ${primera > 0 ? todo[primera].t : "—"} a ${ultima > 0 ? todo[ultima].t : "—"} s`);
mkdirSync(join(DST, "frames"), { recursive: true });

const dentro = todo.filter((m) => m.t >= desde && m.t <= hasta);
if (!dentro.length) {
  console.log(`  no hay fotogramas entre ${desde} y ${hasta} s`);
  process.exit(1);
}
const i0 = dentro[0].i;
let shot = 0;
const nueva = dentro.map((m) => {
  const n: Muestra = { ...m, i: m.i - i0 + 1, t: +(m.t - desde).toFixed(4), shot: null };
  if (m.shot) {
    shot++;
    copyFileSync(join(SRC, "frames", `${String(m.shot).padStart(5, "0")}.png`), join(DST, "frames", `${String(shot).padStart(5, "0")}.png`));
    n.shot = shot;
  }
  return n;
});
writeFileSync(join(DST, "timeline.jsonl"), nueva.map((m) => JSON.stringify(m)).join("\n") + "\n");

// el inventario: los momentos clave que caen en el tramo (y, si ninguno, el más cercano)
const inv = JSON.parse(readFileSync(join(SRC, "inventario.json"), "utf8")) as Inventario[];
let invT = inv.filter((x) => x.t >= desde && x.t <= hasta);
if (!invT.length) invT = [inv.reduce((p, x) => (Math.abs(x.t - desde) < Math.abs(p.t - desde) ? x : p))];
writeFileSync(join(DST, "inventario.json"), JSON.stringify(invT.map((x) => ({ ...x, t: Math.max(0, x.t - desde), frame: Math.max(1, x.frame - i0 + 1) })), null, 1));

for (const f of ["red.json", "ficha.auto.json"]) if (existsSync(join(SRC, f))) copyFileSync(join(SRC, f), join(DST, f));
if (existsSync(join(SRC, "shaders"))) cpSync(join(SRC, "shaders"), join(DST, "shaders"), { recursive: true });
const meta = JSON.parse(readFileSync(join(SRC, "meta.json"), "utf8"));
// un tramo se corta por tiempo: aunque la captura fuera de scroll, el reloj del tramo es el tiempo (si no, el comparador
// alinea por un scroll que dentro del tramo puede no moverse)
writeFileSync(join(DST, "meta.json"), JSON.stringify({ ...meta, drive: "time", driveOriginal: meta.drive, tramo: [desde, hasta], de: SRC, frames: nueva.length, imagenes: shot }, null, 1));

const fps = (meta.fps ?? 60) / Math.max(1, Math.round(nueva.length / Math.max(1, shot)));
execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-framerate", String(fps), "-i", join(DST, "frames", "%05d.png"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-preset", "slow", join(DST, "video.mp4")], { stdio: "inherit" });
console.log(`  ${nueva.length} fotogramas (${desde}–${hasta} s) → ${DST}`);
