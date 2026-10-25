/**
 * Reestudio (docs/35 §5): vuelve a pasar los estudios con el inspector de hoy, para saber si lo aprendido después cambia
 * el veredicto. Por estudio, en orden:
 *   1. guarda la referencia que había (`<ref>-antes-<fecha>`) y la vuelve a capturar con su receta (`--referencia`): la
 *      web puede haber cambiado y la captura de entonces no tenía los ganchos de ahora (gl.js, orden en la meta);
 *   2. mide el ruido de cada eje (dos capturas nuevas de la referencia);
 *   3. hace una vuelta del banco contra la referencia nueva.
 * Termina con un resumen: cada eje del estudio frente a su ruido y frente al cierre de la ronda.
 *
 *   npm run cine:reestudio -- [--estudios hublot,bruno] [--sin-referencia] [--sin-ruido]
 *
 * Salida: `.refs3d/reestudio/<fecha>/resumen.md` y `resumen.json` (el panel /lab/cine enseña el último).
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { textoVeredicto, veredictos, type Objetivos } from "../../lib/cine/objetivos";

type Receta = { url: string; ref: string; carpeta: string; referencia?: string; objetivos?: Objetivos };
const RECETAS = JSON.parse(readFileSync(resolve("scripts/cine/recetas.json"), "utf8")) as Record<string, Receta>;
const argv = process.argv.slice(2);
const opt = (n: string) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : undefined;
};
const pedidos = opt("--estudios")?.split(",");
const ids = Object.keys(RECETAS).filter((k) => k !== "_" && RECETAS[k].url && (!pedidos || pedidos.includes(k)));
const fecha = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
const OUT = resolve(".refs3d", "reestudio", fecha);
mkdirSync(OUT, { recursive: true });

const vuelta = (args: string[]) => execFileSync(process.execPath, [resolve("node_modules/tsx/dist/cli.mjs"), resolve("scripts/cine/vuelta.mts"), ...args], { encoding: "utf8", maxBuffer: 1 << 26, stdio: ["ignore", "pipe", "pipe"] });
const ultima = (carpeta: string) => {
  const p = join(carpeta, "historial.jsonl");
  if (!existsSync(p)) return null;
  const l = readFileSync(p, "utf8").trim().split("\n").filter(Boolean);
  return l.length ? (JSON.parse(l[l.length - 1]) as { n: number; alejamiento: Record<string, number> }) : null;
};

type Fila = { id: string; ok: boolean; error?: string; minutos: number; alejamiento?: Record<string, number>; ruido?: Record<string, number> | null; antes?: Record<string, number> | null };
const filas: Fila[] = [];
for (const id of ids) {
  const r = RECETAS[id];
  const t0 = Date.now();
  console.log(`→ ${id}`);
  const antes = ultima(r.carpeta)?.alejamiento ?? null;
  try {
    if (!argv.includes("--sin-referencia") && r.referencia) {
      if (existsSync(r.ref)) cpSync(r.ref, `${r.ref}-antes-${fecha}`, { recursive: true });
      console.log("  referencia nueva");
      vuelta([id, "--referencia"]);
    }
    if (!argv.includes("--sin-ruido") && r.referencia) {
      console.log("  ruido");
      vuelta([id, "--ruido"]);
    }
    console.log("  vuelta del banco");
    vuelta([id, "--nota", `reestudio ${fecha}`]);
    const u = ultima(r.carpeta);
    const ruido = existsSync(join(r.carpeta, "ruido.json")) ? (JSON.parse(readFileSync(join(r.carpeta, "ruido.json"), "utf8")) as { alejamiento: Record<string, number> }).alejamiento : null;
    filas.push({ id, ok: true, minutos: +((Date.now() - t0) / 60000).toFixed(1), alejamiento: u?.alejamiento, ruido, antes });
  } catch (e) {
    const msg = String((e as { stderr?: string }).stderr || (e as Error).message).split("\n").filter((l) => /error|Error/.test(l)).slice(0, 3).join(" · ");
    console.log(`  falló: ${msg}`);
    filas.push({ id, ok: false, error: msg.slice(0, 400), minutos: +((Date.now() - t0) / 60000).toFixed(1), antes });
  }
  writeFileSync(join(OUT, "resumen.json"), JSON.stringify({ fecha, filas }, null, 1));
}

// el resumen: por estudio, cada eje con su ruido y con la vuelta anterior al reestudio
const pct = (x?: number) => (x === undefined ? "—" : `${Math.round(x * 100)} %`);
const md = [`# Reestudio ${fecha}`, "", "Cada estudio vuelto a pasar con el inspector de hoy: referencia nueva, ruido de cada eje y una vuelta del banco (docs/35 §5).", ""];
for (const f of filas) {
  md.push(`## ${f.id} · ${f.ok ? `${f.minutos} min` : "falló"}`, "");
  if (!f.ok) {
    md.push(`- ${f.error}`, "");
    continue;
  }
  const ver = veredictos(f.alejamiento ?? {}, f.ruido ?? null, RECETAS[f.id]?.objetivos);
  md.push(`**Cumple ${ver.cumple} de ${ver.total} ejes.**`, "", "| Eje | Ahora | Ruido | Objetivo | Veredicto | Antes del reestudio |", "|---|---|---|---|---|---|");
  for (const e of ver.ejes) md.push(`| ${e.eje} | ${pct(e.valor)} | ${pct(e.ruido)} | ${e.objetivo === null ? "—" : pct(e.objetivo)} | ${textoVeredicto(e)} | ${pct(f.antes?.[e.eje])} |`);
  md.push("");
}
writeFileSync(join(OUT, "resumen.md"), md.join("\n"));
console.log(`\n${join(OUT, "resumen.md")}`);
