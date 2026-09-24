/**
 * Copia el kit (o parte) a otro proyecto Next.js, con las mismas rutas para que los imports `@/…` sigan valiendo.
 *
 *   npm run kit:export -- <ruta-proyecto>                         → kit completo
 *   npm run kit:export -- <ruta-proyecto> --only Hero,PricingSection  → solo esos y lo que necesiten
 *   npm run kit:export -- <ruta-proyecto> --dry                    → enseña qué haría, sin escribir
 *   npm run kit:export -- <ruta-proyecto> --force                  → sobrescribe archivos modificados en el proyecto
 *
 * Deja en el proyecto un `.kit.json` con el commit de origen y el hash de cada archivo copiado: con él,
 * `npm run kit:pull -- <ruta-proyecto>` sabe qué has cambiado allí para traerlo de vuelta a la librería.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { ALWAYS, MANIFEST, PUBLIC_ASSETS, closure, kitComponents, packageImports, sha1, walk, type Manifest } from "./kit-lib.mts";

const args = process.argv.slice(2);
const target = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--only");
const only = (() => {
  const i = args.indexOf("--only");
  return i >= 0 ? args[i + 1].split(",").map((s) => s.trim()) : null;
})();
const DRY = args.includes("--dry");
const FORCE = args.includes("--force");

if (!target) {
  console.error("Uso: npm run kit:export -- <ruta-proyecto> [--only A,B] [--dry] [--force]");
  process.exit(1);
}
const dest = resolve(target);
if (!existsSync(join(dest, "package.json"))) {
  console.error(`✗ ${dest} no parece un proyecto (no tiene package.json).`);
  process.exit(1);
}

// Proyecto con src/ o sin él: se deduce de su alias @/* en tsconfig.json
let base = "";
try {
  const ts = readFileSync(join(dest, "tsconfig.json"), "utf8");
  if (/"@\/\*"\s*:\s*\[\s*"\.\/src\/\*"/.test(ts)) base = "src";
} catch {}

// Qué exportar
const entries = only
  ? only.map((name) => {
      const f = `components/ui/${name}.tsx`;
      if (!existsSync(f)) {
        console.error(`✗ No existe ${f}. Nombres válidos: los de docs/CATALOG.md (p. ej. Hero, PricingSection).`);
        process.exit(1);
      }
      return f;
    })
  : kitComponents().concat("components/ui/variants.ts");
const code = closure([...entries, ...ALWAYS]);
const assets = [...new Set(code.flatMap((f) => PUBLIC_ASSETS[f] ?? []))].flatMap(walk);
const files = [...code, ...assets];

// Manifiesto anterior (re-exportación): no pisar lo que el proyecto haya cambiado
const manifestPath = join(dest, MANIFEST);
const prev: Manifest | null = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : null;

const commit = (() => {
  try {
    const dirty = execSync("git status --porcelain", { encoding: "utf8" }).trim() ? "+cambios-sin-commit" : "";
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim() + dirty;
  } catch {
    return "sin-git";
  }
})();

const manifest: Manifest = { from: { repo: process.cwd(), commit, date: new Date().toISOString() }, base, files: { ...(prev?.files ?? {}) } };
const skipped: string[] = [];
let copied = 0;
for (const f of files) {
  const out = join(dest, f.startsWith("public/") ? "" : base, f);
  const localEdit = existsSync(out) && prev?.files[f] && sha1(out) !== prev.files[f];
  const unknown = existsSync(out) && !prev?.files[f] && sha1(out) !== sha1(f);
  if ((localEdit || unknown) && !FORCE) {
    skipped.push(f);
    continue;
  }
  if (!DRY) {
    mkdirSync(dirname(out), { recursive: true });
    cpSync(f, out);
  }
  manifest.files[f] = sha1(f);
  copied++;
}
if (!DRY) writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

// Dependencias npm que necesita lo copiado
const libPkg = JSON.parse(readFileSync("package.json", "utf8"));
const destPkg = JSON.parse(readFileSync(join(dest, "package.json"), "utf8"));
const have = { ...destPkg.dependencies, ...destPkg.devDependencies };
const needed = [...new Set(code.filter((f) => /\.(tsx?|mts)$/.test(f)).flatMap(packageImports))]
  .filter((p) => libPkg.dependencies?.[p] && !["react", "react-dom", "next"].includes(p))
  .sort();
const missing = needed.filter((p) => !have[p]).map((p) => `${p}@${libPkg.dependencies[p]}`);

console.log(`${DRY ? "[simulación] " : ""}✓ ${copied} archivos → ${dest}${base ? ` (bajo ${base}/)` : ""}  ·  origen ${commit}`);
if (skipped.length) console.log(`\n⚠ ${skipped.length} archivo(s) modificados en el proyecto, no sobrescritos (tráelos con kit:pull o usa --force):\n  ${skipped.join("\n  ")}`);
console.log(`\nDependencias: ${needed.join(", ") || "ninguna"}`);
if (missing.length) console.log(`  Falta instalar:  npm i ${missing.join(" ")}`);
console.log(`
Siguiente paso en app/layout.tsx del proyecto:
  import "@/components/ui/styles/kit.css";
  import { fontVariables } from "@/lib/ui/fonts";
  <html className={fontVariables}> …
Tema: define --bg --fg --mut --acc --acc2 --card --ln --r en :root o en cualquier contenedor.
Referencia de props: docs/CATALOG.md de la librería.`);
