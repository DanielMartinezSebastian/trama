/** Materializa un consumidor independiente; nunca borra ni reutiliza un directorio existente. */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { evaluationSuite } from "./agent-evaluation-suites.mts";

const root = process.cwd();
const suiteFlag = process.argv.indexOf("--suite");
const suite = evaluationSuite(suiteFlag >= 0 ? process.argv[suiteFlag + 1] : "salon");
const target = resolve(process.argv[2] ?? ".cache/agent-pilot");
const rel = relative(resolve(root, ".cache"), target);
if (!rel || rel.startsWith("..") || resolve(target) === root) throw new Error("El consumidor de prueba debe tener carpeta propia dentro de .cache/");
if (existsSync(target)) throw new Error(`No se sobrescribe un consumidor existente: ${target}; elige otro nombre para una instalación limpia`);
const tarball = resolve("dist-npm/trama-ui-" + JSON.parse(readFileSync("package.json", "utf8")).version + ".tgz");
if (!existsSync(tarball)) throw new Error("Falta el paquete: ejecuta npm run pkg:pack");
function copy(dir: string, destination: string) {
  mkdirSync(destination, { recursive: true });
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const from = join(dir, entry.name), to = join(destination, entry.name.replace(/\.txt$/, ""));
    if (entry.isDirectory()) copy(from, to);
    else writeFileSync(to, readFileSync(from));
  }
}
copy("examples/agent-pilot", target);
if (suite.id === "boutique") {
  const fixtures = "scripts/fixtures/evaluation-boutique";
  writeFileSync(join(target, "app/layout.tsx"), readFileSync(join(fixtures, "layout.tsx.txt")));
  writeFileSync(join(target, "app/page.tsx"), readFileSync(join(fixtures, "reference.tsx.txt")));
  writeFileSync(join(target, "app/boutique-host.css"), readFileSync(join(fixtures, "boutique-host.css.txt")));
  writeFileSync(join(target, "public/images/movimiento.svg"), readFileSync(join(fixtures, "movimiento.svg")));
}
const pkg = JSON.parse(readFileSync(join(target, "package.json"), "utf8"));
pkg.dependencies["trama-ui"] = "file:" + tarball.replace(/\\/g, "/");
writeFileSync(join(target, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
// npm-cli.js evita cmd.exe y permite rutas Windows con espacios sin interpolación de shell.
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("Ejecutar mediante npm run agents:pilot -- [destino]");
execFileSync(process.execPath, [npmCli, "install", "--no-audit", "--no-fund"], { cwd: target, stdio: "inherit" });
const installed = JSON.parse(readFileSync(join(target, "node_modules/trama-ui/package.json"), "utf8"));
const evidence = { target: relative(root, target).replace(/\\/g, "/"), tarball: relative(root, tarball).replace(/\\/g, "/"), sha256: createHash("sha256").update(readFileSync(tarball)).digest("hex"), version: installed.version, knowledge: existsSync(join(target, "node_modules/trama-ui/knowledge/index.json")), suite: suite.id, preparedAt: new Date().toISOString() };
writeFileSync(join(target, "pilot-install.json"), JSON.stringify(evidence, null, 2) + "\n");
console.log(JSON.stringify(evidence, null, 2));
