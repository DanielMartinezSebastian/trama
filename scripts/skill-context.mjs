#!/usr/bin/env node
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";

const args = process.argv.slice(2);
const at = args.indexOf("--cwd");
if (at >= 0 && !args[at + 1]) throw new Error("Falta directorio de --cwd");
const cwd = resolve(at >= 0 ? args[at + 1] : process.cwd());
try {
  const require = createRequire(join(cwd, "package.json"));
  const manifest = require.resolve("trama-ui/package.json");
  const root = dirname(manifest);
  const pkg = JSON.parse(readFileSync(manifest, "utf8"));
  const index = join(root, "knowledge/index.json");
  const knowledge = existsSync(index) ? JSON.parse(readFileSync(index, "utf8")) : null;
  if (knowledge && knowledge.packageVersion !== pkg.version) throw new Error("Conocimiento incompatible con la versión instalada");
  console.log(JSON.stringify({ cwd, package: pkg.name, version: pkg.version, packageRoot: root,
    knowledge: knowledge ? index : null, scope: knowledge?.scope ?? "legacy-catalog-only",
    catalog: join(root, "CATALOG.md"), exports: pkg.exports,
    next: { fonts: "trama-ui/fonts", config: { transpilePackages: ["trama-ui"] }, validation: "Verificar build y carga efectiva; no basta typecheck" },
    copiedKit: existsSync(join(cwd, ".kit.json")) ? join(cwd, ".kit.json") : null,
  }, null, 2));
} catch (error) {
  console.error(`No se pudo resolver trama-ui desde ${cwd}: ${error.message}. Revisa dependencia instalada o manifiesto .kit.json de código copiado.`);
  process.exitCode = 1;
}
