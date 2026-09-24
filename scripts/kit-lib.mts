/** Utilidades compartidas por kit-export y kit-pull: grafo de dependencias del kit y hashes de archivos. */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, posix, relative } from "node:path";

export const ROOT = process.cwd();
export const MANIFEST = ".kit.json";

export type Manifest = {
  /** commit de la librería desde el que se exportó */
  from: { repo: string; commit: string; date: string };
  /** carpeta base dentro del proyecto destino ("" o "src") */
  base: string;
  /** ruta relativa (igual en librería y proyecto, sin `base`) → sha1 del contenido exportado */
  files: Record<string, string>;
};

export const sha1 = (file: string) => createHash("sha1").update(readFileSync(file)).digest("hex");
export const toPosix = (p: string) => p.split("\\").join("/");

const EXTS = ["", ".ts", ".tsx", ".mts", "/index.ts", "/index.tsx"];
const resolveFile = (base: string) => EXTS.map((e) => base + e).find((f) => existsSync(f) && statSync(f).isFile());

/** Archivos del kit que se copian siempre: el CSS completo (kit.css importa los demás) y las fuentes. */
export const ALWAYS = ["components/ui/styles/kit.css", "components/ui/styles/ui-kit.css", "components/ui/styles/ui-carousel.css", "components/ui/styles/ui-video.css", "lib/ui/fonts.ts", "lib/ui/tokens.ts"];

/** Recursos de /public que necesitan ciertos componentes (se referencian por URL, no por import). */
export const PUBLIC_ASSETS: Record<string, string[]> = {
  "components/ui/PixelFrame.tsx": ["public/pixel/kenney-pixel-ui"],
  "components/ui/Sprite.tsx": ["public/pixel/kenney-pixel-ui"],
};

/** Imports internos (`@/…` y relativos) de un archivo, resueltos a rutas relativas a la raíz. */
function internalImports(file: string): string[] {
  const src = readFileSync(file, "utf8");
  const out: string[] = [];
  const re = /(?:from\s+|import\s*\(\s*|import\s+|@import\s+)["']([^"']+)["']/g;
  for (const m of src.matchAll(re)) {
    const spec = m[1];
    let base: string | null = null;
    if (spec.startsWith("@/")) base = join(ROOT, spec.slice(2));
    else if (spec.startsWith(".")) base = join(dirname(join(ROOT, file)), spec);
    if (!base) continue;
    const hit = resolveFile(base);
    if (hit) out.push(toPosix(relative(ROOT, hit)));
  }
  return out;
}

/** Paquetes npm importados por un archivo (nombre del paquete, sin subruta). */
export function packageImports(file: string): string[] {
  const src = readFileSync(file, "utf8");
  const out = new Set<string>();
  for (const m of src.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)["']([^"'.@/][^"']*|@[^/"']+\/[^"']+)["']/g)) {
    const spec = m[1];
    if (spec.startsWith("@/")) continue;
    const name = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    out.add(name);
  }
  return [...out];
}

/** Cierre transitivo de dependencias internas a partir de unos archivos de entrada. */
export function closure(entries: string[]): string[] {
  const seen = new Set<string>();
  const queue = [...entries];
  while (queue.length) {
    const f = queue.pop()!;
    if (seen.has(f) || !existsSync(f)) continue;
    seen.add(f);
    if (/\.(tsx?|mts|css)$/.test(f)) queue.push(...internalImports(f));
  }
  return [...seen].sort();
}

/** Todos los componentes del kit (`components/ui/*.tsx`). */
export const kitComponents = () =>
  readdirSync("components/ui")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => `components/ui/${f}`);

export const walk = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((n) => {
        const p = posix.join(toPosix(dir), n);
        return statSync(p).isDirectory() ? walk(p) : [p];
      })
    : [];
