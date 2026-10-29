/** Verifica contra el paquete construido; no equivale a instalarlo o ejecutar un consumidor. */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import ts from "typescript";
import { resolvePublicExport } from "./package-surface.mts";

const root = resolve("dist-npm");
if (!existsSync(join(root, "package.json"))) throw new Error("Ejecuta npm run pkg:build antes de agents:check-package");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const index = JSON.parse(readFileSync("docs/agents/index.json", "utf8"));
if (pkg.name !== index.packageName || pkg.version !== index.packageVersion) throw new Error("Versión de referencias distinta del paquete construido");
const files = readdirSync("docs/agents/examples").filter((f) => f.endsWith(".tsx.txt")).sort();
const virtual = new Map(files.map((name) => [resolve(".cache/agent-fixtures", name.replace(/\.txt$/, "")), readFileSync(`docs/agents/examples/${name}`, "utf8")]));
const options: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX, strict: true, skipLibCheck: true, esModuleInterop: true, noEmit: true, types: [],
};
const host = ts.createCompilerHost(options);
const read = host.readFile.bind(host), exists = host.fileExists.bind(host);
host.readFile = (path) => virtual.get(resolve(path)) ?? read(path);
host.fileExists = (path) => virtual.has(resolve(path)) || exists(path);
host.resolveModuleNames = (names, containingFile) => names.map((name) => {
  if (name === "trama-ui" || name.startsWith("trama-ui/")) {
    const target = resolvePublicExport(name, pkg.exports);
    const file = resolve(root, target.types ?? target.default);
    if (!existsSync(file)) throw new Error(`Export sin archivo: ${name} → ${file}`);
    if (!target.types) {
      // El CSS se comprueba como recurso real, no se analiza como TypeScript.
      const declaration = `${file}.d.ts`;
      virtual.set(declaration, "export {};\n");
      return { resolvedFileName: declaration, extension: ts.Extension.Dts, isExternalLibraryImport: true };
    }
    return { resolvedFileName: file, extension: ts.Extension.Dts, isExternalLibraryImport: true };
  }
  return ts.resolveModuleName(name, containingFile, options, host).resolvedModule;
});
const program = ts.createProgram([...virtual.keys()], options, host);
const errors = ts.getPreEmitDiagnostics(program);
if (errors.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(errors, {
  getCurrentDirectory: () => process.cwd(), getCanonicalFileName: (f) => f, getNewLine: () => "\n",
}));
// Todas las piezas seleccionadas resuelven el import público y su declaración real.
for (const item of index.items.filter((x: { kind: string }) => x.kind === "component")) {
  const card = JSON.parse(readFileSync(`docs/agents/${item.file}`, "utf8"));
  const target = resolvePublicExport(card.api.module, pkg.exports);
  for (const file of [target.types, target.default]) if (!file || !existsSync(resolve(root, file))) throw new Error(`Destino ausente: ${card.api.module}`);
  const snapshot = readFileSync(`docs/agents/${card.api.declaration}`, "utf8");
  const actual = readFileSync(resolve(root, target.types!), "utf8");
  if (snapshot !== actual) throw new Error(`Declaración desactualizada respecto al paquete: ${card.api.module}`);
}
function checkTypes(dir: string, rel = "") {
  for (const entry of readdirSync(join(dir, rel), { withFileTypes: true })) {
    const path = join(rel, entry.name);
    if (entry.isDirectory()) checkTypes(dir, path);
    else {
      const actual = join(root, "dist", path);
      if (!existsSync(actual) || readFileSync(join(dir, path), "utf8") !== readFileSync(actual, "utf8")) throw new Error(`Cierre de declaraciones distinto del paquete: ${path}`);
    }
  }
}
checkTypes("docs/agents/types");
console.log(`✓ ${files.length} ejemplos compilados contra ${pkg.name}@${pkg.version}; imports y declaraciones públicos resueltos. Navegador/build Next pendientes.`);
