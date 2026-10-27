/**
 * El cuaderno del laboratorio (docs/53): revisa las fichas de `docs/cuaderno/` y escribe su índice con las relaciones
 * (`docs/cuaderno/README.md`): el vocabulario de cada etiqueta con las fichas que la llevan, las parejas de patrones
 * que se repiten, lo que reúne cada familia de estilo (colores, letras, tono, patrones) y las piezas más usadas.
 *
 *   npm run lab:cuaderno            → revisa y reescribe el índice
 *   npm run lab:cuaderno -- --check → falla si una ficha tiene problemas o el índice no está al día (lo usa `verify`)
 *   npm run lab:cuaderno -- --nueva <id> [--tipo réplica] → crea una ficha con la plantilla
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DIR, ETIQUETAS, NOMBRE_ETIQUETA, leerCuaderno, relaciones, revisar } from "../components/lab/cuaderno/datos.ts";

const argv = process.argv.slice(2);
const opt = (n: string, d: string) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

if (argv.includes("--nueva")) {
  const id = opt("--nueva", "");
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error("Uso: npm run lab:cuaderno -- --nueva <id-en-minúsculas>");
  const p = join(DIR, `${id}.md`);
  if (existsSync(p)) throw new Error(`${p} ya existe`);
  const hoy = new Date().toISOString().slice(0, 10);
  writeFileSync(p, `---
titulo:
fecha: ${hoy}
tipo: ${opt("--tipo", "réplica")}
estado: en curso
referencias: []
fichas: []
ruta:
codigo: []
colores: []
fuentes: []
sector: []
guia: []
tono: []
paleta: []
tipografia: []
patrones: []
movimiento: []
piezas: []
piezas-nuevas: []
relacionados: []
---

## Concepto

## Qué se midió

## Qué se hizo

## Diferencias con la referencia

## Aprendido

## Siguiente
`);
  console.log(`Creada ${p}`);
  process.exit(0);
}

const fichas = leerCuaderno();
let fallos = 0;
for (const f of fichas) {
  const ps = revisar(f, fichas);
  if (ps.length) {
    fallos += ps.length;
    console.log(`✗ ${f.archivo}\n${ps.map((x) => `    ${x}`).join("\n")}`);
  }
}

const r = relaciones(fichas);
const enlace = (id: string) => `[${id}](${id}.md)`;
const L: string[] = [];
L.push("# Cuaderno del laboratorio", "");
L.push("> Generado por `npm run lab:cuaderno` a partir de las fichas de esta carpeta; no se edita a mano. Método y plantilla", "> en [docs/53](../53-cuaderno-del-laboratorio.md). En local se lee en `/lab/cuaderno`.", "");
L.push(`${fichas.length} fichas.`, "");
L.push("## Fichas", "", "| Fecha | Ficha | Tipo | Estado | Sector | Familia de estilo | Dónde |", "|---|---|---|---|---|---|---|");
for (const f of fichas) L.push(`| ${f.fecha} | ${enlace(f.id)} · ${f.titulo} | ${f.tipo} | ${f.estado} | ${f.etiquetas.sector.join(", ")} | ${f.etiquetas.guia.join(", ")} | ${f.ruta ? `\`${f.ruta}\`` : ""} |`);
L.push("", "## Familias de estilo", "", "Lo que reúne cada familia: la semilla de su guía de estilo (docs/16).", "");
for (const fa of r.familias) {
  const top = (xs: [string, number][], n = 8) => xs.slice(0, n).map(([v, c]) => (c > 1 ? `${v} (${c})` : v)).join(", ");
  L.push(`### ${fa.guia}`, "", `- Fichas: ${fa.ids.map(enlace).join(", ")}`, `- Colores: ${fa.colores.map((c) => `\`${c}\``).join(" ")}`, `- Letras: ${fa.fuentes.join(", ")}`, `- Tipografía: ${top(fa.tipografia)}`, `- Paleta: ${top(fa.paleta)}`, `- Tono: ${top(fa.tono)}`, `- Patrones: ${top(fa.patrones, 12)}`, "");
}
L.push("## Patrones que van juntos", "", "Parejas de patrones que aparecen en dos fichas o más.", "", "| Patrón | Con | Fichas |", "|---|---|---|");
for (const p of r.parejas.slice(0, 40)) L.push(`| ${p.a} | ${p.b} | ${p.ids.map(enlace).join(", ")} |`);
L.push("", "## Vocabulario", "", "Las etiquetas usadas, por campo y por número de fichas. Antes de inventar una, reutiliza la que ya existe.", "");
for (const k of ETIQUETAS) {
  L.push(`### ${NOMBRE_ETIQUETA[k]} (\`${k}\`)`, "");
  L.push(r.vocabulario[k].map(([v, ids]) => `${v} (${ids.length})`).join(" · ") || "—", "");
}
L.push("## Fichas parecidas", "", "Con tres etiquetas o más en común (sin contar piezas).", "");
for (const f of fichas) if (r.vecinos[f.id].length) L.push(`- ${enlace(f.id)}: ${r.vecinos[f.id].map((v) => `${v.id} (${v.comunes})`).join(", ")}`);
const indice = L.join("\n") + "\n";

const destino = join(DIR, "README.md");
const actual = existsSync(destino) ? readFileSync(destino, "utf8") : "";
if (argv.includes("--check")) {
  if (actual.replace(/\r\n/g, "\n") !== indice) {
    fallos++;
    console.log("✗ docs/cuaderno/README.md no está al día: npm run lab:cuaderno");
  }
  console.log(fallos ? `${fallos} problema(s) en el cuaderno` : `Cuaderno al día (${fichas.length} fichas)`);
  process.exitCode = fallos ? 1 : 0;
} else {
  writeFileSync(destino, indice);
  const sueltas = ETIQUETAS.filter((k) => !k.startsWith("piezas")).flatMap((k) => r.vocabulario[k].filter(([, ids]) => ids.length === 1).map(([v]) => `${k}: ${v}`));
  console.log(`Índice escrito: ${destino} (${fichas.length} fichas, ${r.parejas.length} parejas de patrones)`);
  if (sueltas.length) console.log(`Etiquetas en una sola ficha (¿errata o nueva?): ${sueltas.length}`);
  if (fallos) (console.log(`${fallos} problema(s)`), (process.exitCode = 1));
}
