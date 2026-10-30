import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

const sync = process.argv[2] === "--sync";
const target = resolve(sync ? process.argv[3] ?? ".cache/demo-ines-review" : process.argv[2] ?? ".cache/demo-ines-review");
const inside = relative(resolve(".cache"), target);
if (!inside || isAbsolute(inside) || inside.startsWith(`..${sep}`) || inside.includes(sep) || (existsSync(target) && !sync) || (sync && target !== resolve(".cache/demo-ines-review"))) {
  throw new Error("Elige un destino nuevo dentro de .cache/; la sincronización solo se permite sobre .cache/demo-ines-review.");
}

function copySource(source: string, destination: string) {
  mkdirSync(destination, { recursive: true });
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const from = join(source, entry.name);
    const to = join(destination, entry.name.replace(/\.txt$/, ""));
    if (entry.isDirectory()) copySource(from, to);
    else writeFileSync(to, readFileSync(from));
  }
}

copySource("examples/demo-ines", target);
const dependencySource = resolve(".cache/demo-rizo/node_modules");
if (!sync) {
  if (!existsSync(dependencySource)) throw new Error(`No existe el consumidor local de dependencias: ${dependencySource}`);
  cpSync(dependencySource, join(target, "node_modules"), { recursive: true, dereference: true });
}
mkdirSync(join(target, "public", "images"), { recursive: true });
cpSync("examples/demo-ines/public/images/ines-bruma-sheet.png", join(target, "public", "images", "ines-bruma-sheet.png"));
writeFileSync(join(target, "next-env.d.ts"), '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n// NOTE: This file should not be edited\n// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.\n');
console.log(`Demo Inés Bruma ${sync ? "sincronizada" : "preparada"} en ${target}. URL: http://localhost:3451.`);
