/**
 * Construye el paquete npm de Trama en `dist-npm/` a partir del kit del repo (components/ui + lib/ui + motores), sin
 * tocar el sitio de demos. El repo sigue siendo la fuente de verdad; esto solo empaqueta.
 *
 *   npm run pkg:build   → dist-npm/ listo para `npm publish` (o `npm pack`)
 *   npm run pkg:pack    → además genera el .tgz para probarlo en otro proyecto (`npm i ../ruta/trama-ui-x.y.z.tgz`)
 *
 * Pasos: 1) copia el cierre de dependencias del kit a dist-npm/.src reescribiendo `@/…` a rutas relativas;
 * 2) genera el barrel (index.ts); 3) compila con tsc a ESM + .d.ts (tsc conserva "use client");
 * 4) copia CSS, recursos pixel, licencias, README, CATALOG.md y la CLI; 5) escribe package.json con `exports`.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative } from "node:path";
import { ALWAYS, closure, kitComponents, packageImports, toPosix } from "./kit-lib.mts";

const OUT = "dist-npm";
const SRC = join(OUT, ".src");
const root = JSON.parse(readFileSync("package.json", "utf8"));

// Se vacía el contenido en vez de borrar la carpeta: en Windows no se puede borrar una carpeta que es el directorio
// actual de otra terminal (p. ej. la que acaba de ejecutar `npm publish` dentro de dist-npm).
if (existsSync(OUT)) for (const e of readdirSync(OUT)) rmSync(join(OUT, e), { recursive: true, force: true });
mkdirSync(SRC, { recursive: true });

// ---------- 1. fuentes con imports relativos ----------
const entries = [...kitComponents(), "components/ui/variants.ts", "components/ui/fill.ts", "components/ui/intent.ts", ...ALWAYS];
const files = closure(entries).filter((f) => /\.(tsx?|css)$/.test(f));
for (const f of files) {
  let src = readFileSync(f, "utf8");
  if (/\.tsx?$/.test(f)) {
    src = src.replace(/(from\s+|import\s*\(\s*|import\s+)(["'])@\/([^"']+)\2/g, (_m, kw, q, target) => {
      let rel = toPosix(relative(dirname(f), target));
      if (!rel.startsWith(".")) rel = "./" + rel;
      return `${kw}${q}${rel}${q}`;
    });
  }
  const out = join(SRC, f);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, src);
}

// ---------- 2. barrel: todos los componentes por nombre + utilidades públicas ----------
// Componentes que necesitan dependencias opcionales (three, @react-three/fiber): fuera del barrel para que `import … from "trama-ui"`
// no obligue a instalarlas; se importan por subruta (`trama-ui/RetroCanvas`).
const OPTIONAL_PEER_COMPONENTS = new Set(["RetroCanvas", "RetroFX", "RetroShapes", "RetroModel"]);
const OPTIONAL_PEERS = { three: ">=0.170", "@react-three/fiber": ">=9" };
const components = kitComponents().map((f) => posix.basename(f, ".tsx")).filter((c) => !OPTIONAL_PEER_COMPONENTS.has(c)).sort();
const barrel = [
  "/** Punto de entrada de Trama: cada componente por su nombre. También `import X from \"trama-ui/X\"`. */",
  ...components.map((c) => `export { default as ${c} } from "./components/ui/${c}";`),
  `export * from "./components/ui/intent";`,
  `export * from "./components/ui/fill";`,
  `export * from "./components/ui/variants";`,
  `export { tokensToStyle, neutralTokens, dotmatrixTokens, FONT_PRESETS, type TokenSet } from "./lib/ui/tokens";`,
  "",
].join("\n");
writeFileSync(join(SRC, "index.ts"), barrel);

// ---------- 3. compilación ----------
writeFileSync(
  join(SRC, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["dom", "dom.iterable", "esnext"],
        module: "esnext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        declaration: true,
        outDir: "../dist",
        rootDir: ".",
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        isolatedModules: true,
        resolveJsonModule: true,
        types: [],
      },
      include: ["**/*.ts", "**/*.tsx"],
    },
    null,
    2,
  ),
);
execSync(`npx tsc -p ${join(SRC, "tsconfig.json")}`, { stdio: "inherit" });

// ESM estricto: webpack (fullySpecified) y Node exigen la extensión en los imports relativos de un paquete
// "type": "module". tsc no la añade, así que se completa aquí: `./x` → `./x.js` o `./x/index.js`.
const walkFiles = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walkFiles(join(d, e.name)) : [join(d, e.name)]));
for (const file of walkFiles(join(OUT, "dist")).filter((f) => /\.(js|d\.ts)$/.test(f))) {
  const src = readFileSync(file, "utf8");
  const fixed = src.replace(/((?:from|import)\s*\(?\s*)(["'])(\.{1,2}\/[^"']+)\2/g, (m, kw, q, spec) => {
    if (/\.(js|css|json)$/.test(spec)) return m;
    const abs = join(dirname(file), spec);
    const ext = existsSync(abs + ".js") ? ".js" : existsSync(join(abs, "index.js")) ? "/index.js" : null;
    if (!ext) throw new Error(`No se resuelve ${spec} desde ${file}`);
    return `${kw}${q}${spec}${ext}${q}`;
  });
  if (fixed !== src) writeFileSync(file, fixed);
}

// tsc conserva las directivas, pero comprobamos que ningún archivo cliente la haya perdido
const missing = files.filter((f) => /\.tsx?$/.test(f) && readFileSync(f, "utf8").trimStart().startsWith('"use client"')).filter((f) => {
  const js = join(OUT, "dist", f.replace(/\.tsx?$/, ".js"));
  return !existsSync(js) || !readFileSync(js, "utf8").trimStart().startsWith('"use client"');
});
if (missing.length) throw new Error(`"use client" perdido en: ${missing.join(", ")}`);

// ---------- 4. CSS, recursos, docs, CLI ----------
for (const f of files.filter((x) => x.endsWith(".css"))) cpSync(f, join(OUT, "dist", f));
cpSync("public/pixel/kenney-pixel-ui", join(OUT, "assets/pixel/kenney-pixel-ui"), { recursive: true });
cpSync("scripts/trama-cli.mjs", join(OUT, "bin/trama-ui.mjs"));
// Catálogo para agentes con las rutas del paquete: `@/components/ui/X` → `trama-ui/X`
const catalogMd = readFileSync("docs/CATALOG.md", "utf8")
  .replace(/import (\w+) from "@\/components\/ui\/(\w+)"/g, 'import $1 from "trama-ui/$2"')
  .replace(/"@\/components\/ui\/styles\/kit\.css"/g, '"trama-ui/styles.css"')
  .replace(/Vista previa en vivo: `\/componentes#<id>`\./, "");
writeFileSync(join(OUT, "CATALOG.md"), catalogMd);
cpSync("scripts/package-README.md", join(OUT, "README.md"));
writeFileSync(join(OUT, "LICENSE"), readFileSync("LICENSE", "utf8"));
writeFileSync(
  join(OUT, "THIRD-PARTY.md"),
  "# Recursos de terceros\n\n- **Kenney «Pixel UI»** (`assets/pixel/kenney-pixel-ui`): CC0 — ver `assets/pixel/kenney-pixel-ui/License.txt`.\n- **Pixelarticons** (dependencia `pixelarticons`): MIT, © Gerrit Halfmann.\n",
);

// ---------- 5. package.json ----------
const used = [...new Set(files.filter((f) => /\.tsx?$/.test(f)).flatMap(packageImports))].sort();
const PEERS = ["react", "react-dom", "next", ...Object.keys(OPTIONAL_PEERS)];
const deps = Object.fromEntries(used.filter((p) => !PEERS.includes(p) && root.dependencies[p]).map((p) => [p, root.dependencies[p]]));
const pkg = {
  name: root.name,
  version: root.version,
  description: "Componentes React/Next.js de ASCII, textmode y pixel art: fondos de caracteres, tarjetas, secciones de landing y más, con 8 estilos y tema por tokens CSS.",
  license: root.license ?? "MIT",
  author: root.author,
  repository: { type: "git", url: "git+https://github.com/DanielMartinezSebastian/trama.git" },
  homepage: "https://github.com/DanielMartinezSebastian/trama#readme",
  bugs: { url: "https://github.com/DanielMartinezSebastian/trama/issues" },
  type: "module",
  sideEffects: ["**/*.css"],
  main: "./dist/index.js",
  types: "./dist/index.d.ts",
  exports: {
    ".": { types: "./dist/index.d.ts", default: "./dist/index.js" },
    "./styles.css": "./dist/components/ui/styles/kit.css",
    "./fonts": { types: "./dist/lib/ui/fonts.d.ts", default: "./dist/lib/ui/fonts.js" },
    "./tokens": { types: "./dist/lib/ui/tokens.d.ts", default: "./dist/lib/ui/tokens.js" },
    "./assets/*": "./assets/*",
    "./*": { types: "./dist/components/ui/*.d.ts", default: "./dist/components/ui/*.js" },
    "./package.json": "./package.json",
  },
  bin: { "trama-ui": "bin/trama-ui.mjs" },
  files: ["dist", "assets", "bin", "CATALOG.md", "THIRD-PARTY.md"],
  keywords: ["react", "nextjs", "components", "ascii", "textmode", "pixel-art", "ui-kit", "landing"],
  peerDependencies: { react: ">=19", "react-dom": ">=19", next: ">=15", ...OPTIONAL_PEERS },
  peerDependenciesMeta: { next: { optional: true }, three: { optional: true }, "@react-three/fiber": { optional: true } },
  dependencies: deps,
};
writeFileSync(join(OUT, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
rmSync(SRC, { recursive: true, force: true });

const count = (d: string): number => readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(join(d, e.name)) : 1), 0);
console.log(`✓ ${pkg.name}@${pkg.version} → ${OUT}/ (${count(OUT)} archivos, ${components.length} componentes, deps: ${Object.keys(deps).join(", ")})`);
