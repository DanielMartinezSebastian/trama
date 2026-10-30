import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

const variantes = {
  fanzine: "Fanzine editorial",
  nocturno: "Club nocturno",
  cartel: "Cartel constructivista",
} as const;
type Variante = keyof typeof variantes;

const id = process.argv[2] as Variante | undefined;
if (!id || !(id in variantes)) throw new Error(`Variante requerida: ${Object.keys(variantes).join(" | ")}`);
const target = resolve(process.argv[3] ?? `.cache/umbral-${id}`);
const inside = relative(resolve(".cache"), target);
if (!inside || isAbsolute(inside) || inside.startsWith(`..${sep}`) || inside.includes(sep) || existsSync(target)) {
  throw new Error("Elegir un destino nuevo, directo dentro de .cache/; el preparador nunca sobrescribe proyectos.");
}

function copy(source: string, destination: string) {
  mkdirSync(destination, { recursive: true });
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const from = join(source, entry.name), to = join(destination, entry.name.replace(/\.txt$/, ""));
    if (entry.isDirectory()) copy(from, to);
    else writeFileSync(to, readFileSync(from));
  }
}

copy("examples/demo-umbral", target);
const layoutPath = join(target, "app/layout.tsx");
const layout = readFileSync(layoutPath, "utf8");
if (!layout.includes('import "./umbral.css";') || !layout.includes('className="umbral"')) {
  throw new Error("La plantilla cambió; no se pudo seleccionar la hoja y clase de variante con seguridad.");
}
const themedLayout = layout
  .replace('import "./umbral.css";', `import "./umbral.css";\nimport "./variantes/${id}.css";`)
  .replace('className="umbral"', `className="umbral umbral--${id}"`);
writeFileSync(layoutPath, themedLayout);

const tarball = resolve("dist-npm/trama-ui-0.13.0.tgz");
const sha256 = createHash("sha256").update(readFileSync(tarball)).digest("hex");
writeFileSync(join(target, "variante.json"), JSON.stringify({
  id,
  nombre: variantes[id],
  plantilla: "examples/demo-umbral/",
  assetsCompartidos: ["public/espacios/nave-08.webp", "public/espacios/nave-a.webp", "public/espacios/patio.webp", "app/ui/portal.tsx"],
  paquete: { archivo: "dist-npm/trama-ui-0.13.0.tgz", sha256 },
  preparado: new Date().toISOString(),
}, null, 2) + "\n");
console.log(`${variantes[id]} preparado en ${target}. Ejecuta npm install y luego npm run build.`);
