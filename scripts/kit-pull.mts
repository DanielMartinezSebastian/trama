/**
 * Trae de vuelta a la librería lo que hayas mejorado del kit dentro de un proyecto.
 *
 *   npm run kit:pull -- <ruta-proyecto>          → informe: qué cambió allí, qué es nuevo, qué choca
 *   npm run kit:pull -- <ruta-proyecto> --apply  → copia a la librería los cambios sin conflicto y los componentes nuevos
 *
 * Usa el `.kit.json` que dejó kit:export. Tres casos por archivo:
 *   - cambiado solo en el proyecto   → se trae (con --apply)
 *   - cambiado también en la librería → CONFLICTO: se deja una copia `<archivo>.from-<proyecto>` para fusionarla a mano
 *   - nuevo en components/ui/ del proyecto → se trae como componente nuevo (con --apply); después, regístralo
 *     en lib/catalog/entries/<categoría>.tsx y ejecuta `npm run catalog`.
 * Al terminar, revisa con `git diff` y haz commit: la librería es la fuente de verdad.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { MANIFEST, sha1, walk, type Manifest } from "./kit-lib.mts";

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith("--"));
const APPLY = args.includes("--apply");
if (!target) {
  console.error("Uso: npm run kit:pull -- <ruta-proyecto> [--apply]");
  process.exit(1);
}
const dest = resolve(target);
const manifestPath = join(dest, MANIFEST);
if (!existsSync(manifestPath)) {
  console.error(`✗ ${dest} no tiene ${MANIFEST}: exporta primero con npm run kit:export.`);
  process.exit(1);
}
const manifest: Manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const project = basename(dest);
const inProject = (f: string) => join(dest, f.startsWith("public/") ? "" : manifest.base, f);

const changed: string[] = [];
const conflicts: string[] = [];
const removed: string[] = [];
for (const [f, exported] of Object.entries(manifest.files)) {
  const there = inProject(f);
  if (!existsSync(there)) {
    removed.push(f);
    continue;
  }
  const theirs = sha1(there);
  if (theirs === exported) continue;
  const oursChanged = existsSync(f) && sha1(f) !== exported;
  if (existsSync(f) && sha1(f) === theirs) continue;
  (oursChanged ? conflicts : changed).push(f);
}

// Componentes y estilos nuevos creados en el proyecto dentro de la carpeta del kit
const uiDir = join(dest, manifest.base, "components/ui");
const added = walk(uiDir)
  .map((p) => p.slice(join(dest, manifest.base).replace(/\\/g, "/").length + 1))
  .filter((f) => !manifest.files[f] && !existsSync(f));

const list = (title: string, xs: string[]) => xs.length && console.log(`\n${title} (${xs.length}):\n  ${xs.join("\n  ")}`);
console.log(`Proyecto ${project} · exportado desde ${manifest.from.commit} el ${manifest.from.date.slice(0, 10)}`);
list("Cambiados en el proyecto", changed);
list("Nuevos en el proyecto", added);
list("CONFLICTO (cambiados en ambos lados)", conflicts);
list("Borrados en el proyecto (no se tocan en la librería)", removed);
if (!changed.length && !added.length && !conflicts.length) console.log("\nNada que traer: el proyecto usa el kit tal cual.");

if (APPLY) {
  for (const f of [...changed, ...added]) {
    mkdirSync(dirname(f), { recursive: true });
    copyFileSync(inProject(f), f);
    manifest.files[f] = sha1(f);
  }
  for (const f of conflicts) copyFileSync(inProject(f), `${f}.from-${project}`);
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\n✓ Traídos ${changed.length + added.length} archivo(s)${conflicts.length ? `; ${conflicts.length} conflicto(s) guardados como *.from-${project} para fusionar a mano` : ""}.`);
  console.log("Revisa con `git diff`, registra los componentes nuevos en lib/catalog/entries/, ejecuta `npm run catalog` y haz commit.");
} else if (changed.length || added.length || conflicts.length) {
  console.log("\nEjecuta con --apply para traerlos.");
}
