/** Referencias piloto derivadas del catálogo, las guías, recetas y declaraciones TS. Sin imports desde el kit al catálogo. */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { posix, relative, resolve } from "node:path";
import ts from "typescript";
import { type CatalogEntry } from "../lib/catalog/schema";
import { type RecetaSector } from "../lib/catalog/sectores";
import { type StyleGuide } from "../lib/ui/guides";
import { closure, packageImports, toPosix } from "./kit-lib.mts";
import { resolvePublicExport } from "./package-surface.mts";

export const KNOWLEDGE_DIR = "docs/agents";
const GENERATORS = ["scripts/agent-knowledge.mts", "scripts/build-catalog.mts", "scripts/package-surface.mts", "scripts/build-package.mts", "scripts/kit-lib.mts", "scripts/skill-context.mjs", "lib/catalog/schema.ts", "lib/catalog/catalog.tsx", "lib/catalog/sectores.ts", "package.json", "package-lock.json"];
const utf8 = (path: string) => readFileSync(path, "utf8");
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const sorted = (values: string[]) => [...new Set(values)].sort();
const brief = (text: string) => {
  const sentence = text.split(". ")[0];
  return sentence.length <= 220 ? sentence : sentence.slice(0, 220).replace(/\s+\S*$/, "") + "…";
};
/** Contraste WCAG 2 entre dos `#rrggbb`; `null` si alguno no es hex opaco (rgba, var…). */
const contrast = (a: string, b: string) => {
  const lum = (css: string) => {
    const m = /^#([0-9a-f]{6})$/i.exec(css.trim());
    if (!m) return null;
    const [r, g, bl] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)];
  if (x === null || y === null) return null;
  return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100;
};
/** Roles de texto sobre los fondos de la guía, con el uso que admite cada par (4,5:1 texto normal; 3:1 grande/controles). */
const contrastTable = (tokens: Record<string, unknown>) => ["fg", "mut", "acc", "acc2"].flatMap((text) => ["bg", "card"].flatMap((surface) => {
  const ratio = contrast(String(tokens[text] ?? ""), String(tokens[surface] ?? ""));
  if (ratio === null) return [];
  return [{ text, surface, ratio, use: ratio >= 4.5 ? "texto normal" : ratio >= 3 ? "solo texto grande, iconos o bordes de control" : "decorativo: no usar para texto ni controles" }];
}));
const diagnostics = (items: readonly ts.Diagnostic[]) => ts.formatDiagnosticsWithColorAndContext(items, {
  getCurrentDirectory: () => process.cwd(), getCanonicalFileName: (f) => f, getNewLine: () => "\n",
});

export function selectPilot(catalog: CatalogEntry[], recipes: RecetaSector[], guides: StyleGuide[]) {
  const recipe = recipes.find((r) => r.pilot);
  if (!recipe?.pilot || recipes.filter((r) => r.pilot).length !== 1) throw new Error("El contrato P1 exige exactamente una receta piloto");
  const guide = guides.find((g) => g.id === recipe.guia);
  if (!guide) throw new Error(`Guía inexistente: ${recipe.guia}`);
  const names = sorted([...recipe.secciones.flatMap(([, names]) => names), ...recipe.pilot.components]);
  const entries = names.map((name) => {
    const entry = catalog.find((c) => c.component === name);
    if (!entry) throw new Error(`Pieza inexistente en receta ${recipe.id}: ${name}`);
    if (!/^[a-z0-9-]+$/.test(entry.id)) throw new Error(`ID de pieza no válido: ${entry.id}`);
    const module = resolvePublicExport(`trama-ui/${name}`);
    if (!module.types || !existsSync(entry.path.replace(/^@\//, "") + ".tsx")) throw new Error(`Destino inexistente: ${name}`);
    return entry;
  });
  if (new Set(entries.map((e) => e.id)).size !== entries.length) throw new Error("IDs duplicados en piloto");
  return { recipe, guide, entries };
}

/** Emite declaraciones con TypeScript, conservando objetos, callbacks y dependencias de tipos. */
export function declarationSnapshot(files: string[]) {
  const outDir = resolve(".cache/agent-declarations");
  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX, strict: true, skipLibCheck: true, esModuleInterop: true, isolatedModules: true,
    declaration: true, emitDeclarationOnly: true, rootDir: process.cwd(), outDir, types: [],
    paths: { "@/*": [resolve("*")] },
  };
  const program = ts.createProgram(files, options);
  const errors = ts.getPreEmitDiagnostics(program).filter((d) => d.category === ts.DiagnosticCategory.Error);
  if (errors.length) throw new Error(diagnostics(errors));
  const declarations = new Map<string, string>();
  program.emit(undefined, (file, content) => {
    const path = toPosix(relative(outDir, file));
    // Los imports del snapshot son relativos y se resuelven a otras declaraciones, igual que los del paquete.
    const output = content.replace(/(from\s+|import\s*\(\s*|import\s+)(["'])([^"']+)\2/g, (all, prefix, quote, spec: string) => {
      if (!spec.startsWith("@/") && !spec.startsWith(".")) return all;
      let target = spec;
      if (spec.startsWith("@/")) {
        target = posix.relative(posix.dirname(path), spec.slice(2));
        if (!target.startsWith(".")) target = "./" + target;
      }
      if (!/\.(js|json|css)$/.test(target)) target += ".js";
      return `${prefix}${quote}${target}${quote}`;
    });
    declarations.set(path, output);
  }, undefined, true);
  for (const [path, content] of declarations) {
    for (const match of content.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)["'](\.[^"']+)["']/g)) {
      if (match[1].endsWith(".css")) continue; // Recurso de ejecución, no declaración TypeScript.
      const target = posix.normalize(posix.join(posix.dirname(path), match[1])).replace(/\.js$/, ".d.ts");
      if (!declarations.has(target)) throw new Error(`Referencia de tipos rota: ${path} → ${target}`);
    }
  }
  return declarations;
}

export function knowledgeOutputs(catalog: CatalogEntry[], recipes: RecetaSector[], guides: StyleGuide[]) {
  const { recipe, guide, entries } = selectPilot(catalog, recipes, guides);
  const pilot = recipe.pilot!;
  const pkg = JSON.parse(utf8("package.json"));
  const entrySources = readdirSync("lib/catalog/entries").filter((f) => /\.tsx?$/.test(f)).map((f) => `lib/catalog/entries/${f}`);
  const files = closure([...entries.map((e) => e.path.replace(/^@\//, "") + ".tsx"), "lib/ui/fonts.ts"]);
  const declarations = declarationSnapshot(files.filter((f) => /\.tsx?$/.test(f)));
  const output = new Map<string, string>();
  for (const [path, text] of declarations) output.set(`${KNOWLEDGE_DIR}/types/${path}`, text);
  const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const sourceDirty = !!execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], { encoding: "utf8" }).trim();
  const sourceList = (extra: string[]) => sorted([...GENERATORS, ...extra]).map((path) => ({ path, sha256: hash(path) }));
  const common = (kind: string, id: string, extra: string[]) => ({
    schemaVersion: 1, packageName: pkg.name as string, packageVersion: pkg.version as string,
    sourceCommit, sourceDirty, kind, id, status: "pilot", sources: sourceList(extra),
    validation: { publicTypes: "generated-from-source", packageExamples: "not-certified-by-generation", browserFlow: "not-certified-by-generation" },
  });
  const examples = pilot.examples.map((fixture) => {
    const code = utf8(fixture).replace(/\r\n/g, "\n");
    if (/[@]\/|\/img\/hebra\//.test(code)) throw new Error(`Ejemplo ligado al repo: ${fixture}`);
    const imported = [...code.matchAll(/(?:from\s+|import\s+)["'](trama-ui[^"']*)["']/g)].map((m) => m[1]);
    for (const specifier of imported) {
      const target = resolvePublicExport(specifier);
      if (specifier !== "trama-ui" && target.types && !declarations.has(target.types.replace("./dist/", ""))) throw new Error(`Ejemplo sin destino de tipos: ${specifier}`);
      if (!target.types && !existsSync(target.default.replace("./dist/", ""))) throw new Error(`Recurso público inexistente: ${specifier}`);
    }
    const name = posix.basename(fixture);
    output.set(`${KNOWLEDGE_DIR}/examples/${name}`, code);
    return { id: name.replace(".tsx.txt", ""), fixture, file: `examples/${name}`, code, requirements: imported,
      validation: "La generación no acredita compilación o navegador; validar tipos, build y recorrido en el proyecto consumidor. Los ensayos del paquete se registran en el informe de entrega." };
  });
  const relevantExamples = (name: string) => examples.filter((e) => e.requirements.includes(`trama-ui/${name}`));
  const add = (path: string, data: Record<string, unknown>, links: { title: string; href: string }[] = []) => {
    const jsonPath = `${KNOWLEDGE_DIR}/${path}.json`;
    // Procedencia es una foto de la generación: conservarla si el contenido y hashes siguen idénticos.
    // Así un commit de las propias salidas o de archivos ajenos no crea deriva perpetua.
    if (existsSync(jsonPath)) {
      const previous = JSON.parse(utf8(jsonPath));
      const content = (x: Record<string, unknown>) => JSON.stringify({ ...x, sourceCommit: null, sourceDirty: null });
      if (content(previous) === content(data)) {
        data.sourceCommit = previous.sourceCommit;
        data.sourceDirty = previous.sourceDirty;
      }
    }
    output.set(jsonPath, JSON.stringify(data, null, 2) + "\n");
    const title = String(data.name ?? data.id);
    const md = [`# ${title}`, "", "> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.", "",
      `Paquete: ${pkg.name}@${pkg.version} · esquema 1. [Ficha JSON y hashes de procedencia](./${posix.basename(path)}.json).`, "",
      ...links.flatMap((l) => [`- [${l.title}](${l.href})`]), ""];
    for (const [key, value] of Object.entries(data)) {
      if (["name", "kind", "id", "packageName", "packageVersion", "schemaVersion", "status", "sources", "sourceCommit", "sourceDirty"].includes(key)) continue;
      if (path === "index" && key === "items") {
        md.push("## Selección", "", "| Tipo | ID | Uso |", "| --- | --- | --- |");
        for (const item of value as { kind: string; id: string; description: string }[]) md.push(`| ${item.kind} | ${item.id} | ${item.description.replace(/\|/g, "\\|")} |`);
        md.push("");
        continue;
      }
      if (key === "contrast") {
        md.push("## Contraste", "", "| Texto | Fondo | Ratio | Uso |", "| --- | --- | --- | --- |");
        for (const c of value as { text: string; surface: string; ratio: number; use: string }[]) md.push(`| --${c.text} | --${c.surface} | ${c.ratio.toFixed(2).replace(".", ",")}:1 | ${c.use} |`);
        md.push("");
        continue;
      }
      if (key === "examples") {
        md.push("## Ejemplos", "");
        for (const example of value as typeof examples) md.push(`### ${example.id}`, "", example.validation, "", "```tsx", example.code.trimEnd(), "```", "");
        if (!(value as unknown[]).length) md.push("Sin ejemplo específico; consultar receta/guía y declaración completa.", "");
        continue;
      }
      md.push(`## ${key}`, "", typeof value === "string" ? value : "```json\n" + JSON.stringify(value, null, 2) + "\n```", "");
    }
    output.set(`${KNOWLEDGE_DIR}/${path === "index" ? "README" : path}.md`, md.join("\n"));
  };
  for (const entry of entries) {
    const source = entry.path.replace(/^@\//, "") + ".tsx";
    const deps = closure([source]);
    const module = resolvePublicExport(`trama-ui/${entry.component}`);
    const declaration = module.types!.replace("./dist/", "");
    if (!declarations.has(declaration)) throw new Error(`Declaración ausente: ${entry.component}`);
    const metadataFile = entrySources.find((p) => utf8(p).includes(`id: "${entry.id}"`));
    if (!metadataFile) throw new Error(`Sin fuente del catálogo: ${entry.id}`);
    const metadataSources = closure([metadataFile]).filter((path) => path.startsWith("lib/catalog/"));
    const selectedExamples = relevantExamples(entry.component);
    add(`components/${entry.id}`, {
      ...common("component", entry.id, [...deps, ...metadataSources, ...selectedExamples.map((e) => e.fixture)]),
      name: entry.name, component: entry.component, description: entry.description, category: entry.category,
      import: `import ${entry.component} from "trama-ui/${entry.component}";`,
      api: { module: `trama-ui/${entry.component}`, props: `React.ComponentProps<typeof ${entry.component}>`, declaration: `types/${declaration}`, packageDeclaration: module.types, complete: "Consultar declaración y sus imports transitivos; controles del visor no son la firma." },
      playgroundProps: entry.props.map(({ when: _when, ...p }) => p),
      notes: entry.notes ?? [], requirements: ["import \"trama-ui/styles.css\" una vez; tema/guía en contenedor.", ...(entry.consumption?.requirements ?? [])],
      dependencies: { components: deps.filter((p) => p.startsWith("components/ui/") && p.endsWith(".tsx") && p !== source).map((p) => posix.basename(p, ".tsx")), packages: sorted(deps.filter((p) => /\.tsx?$/.test(p)).flatMap(packageImports)).map((name) => ({ name, version: pkg.dependencies[name] ?? pkg.devDependencies[name] ?? null })) },
      examples: selectedExamples, limitations: entry.consumption?.limitations ?? [],
    }, [{ title: "API completa (snapshot de declaraciones)", href: `../types/${declaration}` }, { title: "Índice piloto", href: "../README.md" }]);
  }
  const guideSources = ["lib/ui/guides.ts", "lib/ui/tokens.ts", "lib/ui/fonts.ts", "components/ui/styles/ui-guides.css"];
  // Todas las guías tienen ficha (tokens, fuentes, contraste); receta, piezas y ejemplos siguen siendo los del piloto.
  for (const g of [guide, ...guides.filter((x) => x.id !== guide.id)]) {
  if (!/^[a-z0-9-]+$/.test(g.id)) throw new Error(`ID de guía no válido: ${g.id}`);
  const guideExamples = g.id === guide.id ? examples : [];
  add(`guides/${g.id}`, {
    ...common("guide", g.id, [...guideSources, ...guideExamples.map((e) => e.fixture)]), name: g.label, guide: g,
    application: { component: "GuideFrame", import: 'import GuideFrame from "trama-ui/GuideFrame";', usage: `<GuideFrame guide="${g.id}">`, css: "trama-ui/styles.css", classes: sorted([...utf8("components/ui/styles/ui-guides.css").matchAll(/\.(ui-g-[a-z0-9-]+)/g)].map((m) => m[1])), fontVariables: sorted([...JSON.stringify(g.fonts).matchAll(/var\((--font-[^)]+)\)/g)].map((m) => m[1])) },
    contrast: contrastTable(g.tokens as Record<string, unknown>),
    requirements: ["En Next.js: fuentes requeridas desde trama-ui/fonts en layout de servidor, transpilePackages: ['trama-ui']; verificar build y carga con next/font/google.", "Usar las clases ui-g-* para escala y composición; pasar variante sugerida a las piezas que la admitan.", "Nombrar las fuentes por su variable (`var(--font-cormorant-garamond)`, ver fontVariables) o heredarlas de ui-g-*; el nombre literal ('Cormorant') no coincide con la familia que registra next/font y cae a una fuente del sistema.", "Los pares de `contrast` por debajo de 4,5:1 no sirven para texto normal tal cual: GuideFrame textContrast calcula --mut-text/--acc-text para el texto del kit sobre --bg (sRGB opaco), conservando --mut/--acc decorativos. Consultar sus límites en la API; para otras superficies/estados o CSS propio, adaptar y medir el tema local."],
    examples: guideExamples, limitations: ["La tabla de contraste mide tokens sobre fondos lisos; revisar la aplicación visual en cada proyecto (imágenes, transparencias, estados). Una guía no certifica accesibilidad.", "Fotos, vídeos y fuentes Fontshare no se redistribuyen por esta ficha.", "No se declara soporte universal de Next.js o de React genérico a partir de un consumidor piloto."],
  }, [{ title: "GuideFrame y API", href: "../components/guide-frame.md" }, { title: "Índice piloto", href: "../README.md" }]);
  }
  add(`recipes/${recipe.id}`, {
    ...common("recipe", recipe.id, ["lib/catalog/sectores.ts", ...entrySources, "lib/ui/guides.ts", ...pilot.examples]),
    name: recipe.sector, recipe: { ...recipe, pilot: undefined },
    sections: recipe.secciones.map(([title, names]) => ({ title, components: names.map((name) => entries.find((e) => e.component === name)!.id) })),
    flow: pilot.flow, pages: pilot.pages, integrations: pilot.integrations, assets: pilot.assets,
    requirements: ["Versión exacta del paquete; leer guía y declaraciones antes de componer. Recursos y copy del consumidor fijados antes de medir."],
    examples, limitations: pilot.limitations,
  }, [{ title: "Guía seleccionada", href: `../guides/${guide.id}.md` }, ...entries.map((e) => ({ title: e.component, href: `../components/${e.id}.md` }))]);
  const items = [
    ...[guide, ...guides.filter((x) => x.id !== guide.id)].map((g) => ({ kind: "guide", id: g.id, name: g.label, description: brief(g.note), file: `guides/${g.id}.json` })),
    { kind: "recipe", id: recipe.id, name: recipe.sector, description: recipe.cuando, file: `recipes/${recipe.id}.json` },
    ...entries.map((e) => ({ kind: "component", id: e.id, name: e.component, description: brief(e.description), file: `components/${e.id}.json` })),
  ];
  add("index", {
    ...common("index", "pilot", ["lib/catalog/sectores.ts", "lib/ui/guides.ts", ...entrySources]), name: "Conocimiento de Trama — piloto salon", scope: "pilot", items,
    requirements: ["Abrir solo la guía, receta o piezas necesarias; las fichas enlazan declaraciones completas."], examples: [],
    limitations: ["Selección parcial: todas las guías, pero solo la receta y las piezas de salon; no es inventario completo del paquete.", "La generación no acredita instalación, descubrimiento del cliente ni recorrido. Los entornos/casos ensayados se documentan en la entrega; sin promesa universal de compatibilidad o ahorro."],
  }, items.map((item) => ({ title: `${item.kind}: ${item.name}`, href: `./${item.file.replace(/\.json$/, ".md")}` })));
  // Helpers autocontenidos de las skills, derivados de una única implementación.
  if (existsSync("skills")) for (const entry of readdirSync("skills", { withFileTypes: true }).filter((e) => e.isDirectory())) {
    if (!existsSync(`skills/${entry.name}/SKILL.md`)) throw new Error(`Directorio sin SKILL.md: ${entry.name}`);
    output.set(`skills/${entry.name}/scripts/context.mjs`, utf8("scripts/skill-context.mjs"));
  }
  return output;
}
