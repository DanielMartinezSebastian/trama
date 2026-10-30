/** Materializa la demo con fuentes conservadas en examples/; nunca sobrescribe un proyecto existente. */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

const target = resolve(process.argv[2] ?? ".cache/demo-umbral");
const inside = relative(resolve(".cache"), target);
if (!inside || isAbsolute(inside) || inside.startsWith(`..${sep}`) || inside.includes(sep) || existsSync(target)) throw new Error("Elegir un nombre de destino nuevo, directo dentro de .cache/");
const tarball = resolve("dist-npm/trama-ui-0.13.0.tgz");
const sha256 = createHash("sha256").update(readFileSync(tarball)).digest("hex");
function copy(source: string, destination: string) {
  mkdirSync(destination, { recursive: true });
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const from = join(source, entry.name), to = join(destination, entry.name.replace(/\.txt$/, ""));
    if (entry.isDirectory()) copy(from, to);
    else writeFileSync(to, readFileSync(from));
  }
}
copy("examples/demo-umbral", target);
writeFileSync(join(target, "demo-source.json"), JSON.stringify({ template: "examples/demo-umbral", target: relative(process.cwd(), target).replace(/\\/g, "/"), tarball: "dist-npm/trama-ui-0.13.0.tgz", sha256, preparedAt: new Date().toISOString() }, null, 2) + "\n");
console.log(`Demo preparada en ${target}; instalar dependencias y skills dentro de ese proyecto.`);
