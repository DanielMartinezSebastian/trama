#!/usr/bin/env node
/**
 * CLI de Trama (se publica como `bin/trama-ui.mjs`).
 *
 *   npx trama-ui assets [carpeta-public]   copia los recursos pixel art (PixelFrame, Sprite) a public/pixel/…
 *   npx trama-ui catalog                   imprime la ruta de CATALOG.md (referencia de props para agentes)
 */
import { cpSync, existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync, lstatSync } from "node:fs";
import { dirname, join, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const [cmd, arg] = process.argv.slice(2);
const args = process.argv.slice(2);
const option = (key, fallback) => {
  const index = args.indexOf(key);
  if (index < 0) return fallback;
  if (!args[index + 1] || args[index + 1].startsWith("--")) throw new Error(`Falta valor de ${key}`);
  return args[index + 1];
};
const tree = (root, folder = "") => readdirSync(join(root, folder), { withFileTypes: true }).flatMap((e) => e.isDirectory() ? tree(root, join(folder, e.name)) : [join(folder, e.name)]);
const linked = (path) => { try { return lstatSync(path).isSymbolicLink(); } catch (error) { if (error.code === "ENOENT") return false; throw error; } };

if (cmd === "assets") {
  const pub = resolve(arg ?? "public");
  const from = join(pkgRoot, "assets/pixel/kenney-pixel-ui");
  const to = join(pub, "pixel/kenney-pixel-ui");
  cpSync(from, to, { recursive: true });
  console.log(`✓ recursos pixel art copiados a ${to} (los usan PixelFrame y Sprite; licencia CC0)`);
} else if (cmd === "catalog") {
  const p = join(pkgRoot, "CATALOG.md");
  console.log(existsSync(p) ? p : "CATALOG.md no encontrado en el paquete");
} else if (cmd === "knowledge") {
  const file = join(pkgRoot, "knowledge/index.json");
  if (!existsSync(file)) throw new Error("Este paquete no contiene conocimiento selectivo; consulta su CATALOG.md");
  console.log(file);
} else if (cmd === "skills" && arg === "install") {
  const client = option("--client", "codex");
  if (!["codex", "claude"].includes(client)) throw new Error("Cliente admitido: codex o claude (otros no ensayados)");
  const project = resolve(option("--project", process.cwd()));
  if (!existsSync(join(project, "package.json"))) throw new Error("El destino debe ser un proyecto con package.json");
  const installedManifest = createRequire(join(project, "package.json")).resolve("trama-ui/package.json");
  const installed = JSON.parse(readFileSync(installedManifest, "utf8"));
  const own = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));
  if (installed.version !== own.version) throw new Error(`CLI ${own.version} incompatible con destino ${installed.version}; usa su binario local`);
  const from = join(pkgRoot, "skills");
  const target = join(project, client === "codex" ? ".agents" : ".claude", "skills");
  const plans = tree(from).map((file) => {
    const to = resolve(target, file);
    const rel = relative(target, to);
    if (!rel || rel.startsWith(`..${sep}`) || rel === "..") throw new Error("Destino de skill fuera del proyecto");
    return { to, content: readFileSync(join(from, file)) };
  });
  for (const item of plans) {
    let ancestor = dirname(item.to);
    while (ancestor !== project) {
      if (linked(ancestor)) throw new Error(`Destino enlazado fuera del control del instalador: ${ancestor}; usa una carpeta real del proyecto`);
      const parent = dirname(ancestor);
      if (parent === ancestor) throw new Error("Destino fuera del proyecto");
      ancestor = parent;
    }
    if (linked(item.to)) throw new Error(`Archivo de skill enlazado: ${item.to}`);
  }
  // Preflight de todo el lote: jamás sobrescribir instrucciones o modificaciones locales.
  for (const item of plans) if (existsSync(item.to) && !readFileSync(item.to).equals(item.content)) throw new Error(`Conflicto de skill: ${item.to}. Conserva la adaptación; revisa la actualización explícitamente.`);
  for (const item of plans) {
    mkdirSync(dirname(item.to), { recursive: true });
    if (!existsSync(item.to)) writeFileSync(item.to, item.content);
  }
  console.log(JSON.stringify({ client, project, skills: readdirSync(from), files: plans.length, status: "installed-or-identical" }, null, 2));
} else {
  console.log("Uso:\n  trama-ui assets [carpeta-public]\n  trama-ui catalog\n  trama-ui knowledge\n  trama-ui skills install --client codex|claude [--project ruta]\nUsa el binario local de la versión instalada; no consultes latest para otro paquete.");
  process.exit(cmd ? 1 : 0);
}
