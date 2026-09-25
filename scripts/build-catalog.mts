/**
 * Genera el índice del kit legible por agentes y personas a partir de `lib/catalog/` (la misma fuente que
 * `/componentes`), y valida que catálogo, archivos y docs no se desincronicen.
 *
 *   npm run catalog          → escribe docs/catalog.json y docs/CATALOG.md
 *   npm run catalog:check    → falla si están desactualizados o si alguna validación no pasa
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { CATEGORIES, STYLES, defaultsOf, snippet, type PropSpec } from "@/lib/catalog/schema";
import { catalog } from "@/lib/catalog/catalog";
import { demos } from "@/lib/demos";
import { closure, kitComponents } from "./kit-lib.mts";

const CHECK = process.argv.includes("--check");
const errors: string[] = [];

/** Landings «kit» (construidas solo con components/ui/): slug de la demo → archivo. */
const KIT_LANDING_FILES: Record<string, string> = {
  "th-ciphergrid": "components/landings/CyberpunkLanding.tsx",
  "th-mycel": "components/landings/MycelLanding.tsx",
  "th-folio": "components/landings/FolioLanding.tsx",
  "th-dotmatrix": "components/landings/DotmatrixLanding.tsx",
  "th-minimal": "components/landings/minimal/MinimalLanding.tsx",
  "th-geometry": "components/landings/minimal/GeometryLanding.tsx",
  "th-faceta": "components/landings/minimal/FacetaLanding.tsx",
};

// ---------- Validación ----------
const ids = new Set<string>();
for (const e of catalog) {
  if (ids.has(e.id)) errors.push(`id duplicado: ${e.id}`);
  ids.add(e.id);
  const file = e.path.replace(/^@\//, "") + ".tsx";
  if (!existsSync(file)) errors.push(`${e.id}: no existe ${file}`);
  for (const p of e.props) {
    if (p.type === "select" && !p.options.includes(p.default)) errors.push(`${e.id}.${p.key}: el default "${p.default}" no está en options`);
    if (p.type === "number" && (p.default < p.min || p.default > p.max)) errors.push(`${e.id}.${p.key}: default fuera de [min, max]`);
  }
}
for (const c of CATEGORIES) if (!catalog.some((e) => e.category === c.id)) errors.push(`categoría sin componentes: ${c.id}`);

const readme = readFileSync("docs/README.md", "utf8");
for (const e of catalog) if (!readme.includes("`" + e.component + "`")) errors.push(`docs/README.md no menciona \`${e.component}\``);

for (const d of demos.filter((d) => d.render === "kit")) {
  if (!KIT_LANDING_FILES[d.slug]) errors.push(`landing kit sin archivo registrado en scripts/build-catalog.mts: ${d.slug}`);
}

// El kit no puede depender del sitio: si lo hiciera, kit:export arrastraría catálogo, demos o landings.
const FORBIDDEN = ["lib/catalog/", "lib/demos", "lib/themes/", "components/landings/", "components/playground/", "app/"];
for (const f of closure(kitComponents())) {
  if (FORBIDDEN.some((x) => f.startsWith(x))) errors.push(`el kit depende de ${f} (components/ui/ no puede importar del sitio)`);
}

// Reglas de nombres (guía §2.2, glosario): cada nombre de prop significa una sola cosa. Los alias @deprecated no cuentan.
const NAME_RULES: { prop: string; ok: (type: string) => boolean; hint: string }[] = [
  { prop: "size", ok: (t) => /^("(sm|md|lg)"\s*\|?\s*)+$/.test(t.trim()), hint: 'solo un preset "sm" | "md" | "lg"; para px usa fontSize, cellSize, iconSize…' },
  { prop: "style", ok: (t) => t.includes("CSSProperties"), hint: "es el style CSS de React; para el render ASCII usa asciiStyle" },
  { prop: "hover", ok: () => false, hint: "demasiado genérico: textHover, fieldHover…" },
  { prop: "trigger", ok: (t) => !/\bstring\b/.test(t), hint: "es cuándo se anima; para el texto de un botón usa triggerLabel" },
  { prop: "tone", ok: (t) => !/primary|secondary|success|danger|warning|warn|info\b/.test(t), hint: "es el token de color (acc, acc2, fg, mut); color semántico = intent, énfasis = emphasis" },
  { prop: "speed", ok: (t) => t.trim() === "number", hint: "es un multiplicador; para segundos usa duration" },
];
for (const file of kitComponents()) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const m = line.match(/^\s+(\w+)\?: (.+);$/);
    if (!m || /@deprecated/.test(lines[i - 1] ?? "")) return;
    const rule = NAME_RULES.find((r) => r.prop === m[1]);
    if (rule && !rule.ok(m[2])) errors.push(`${file}:${i + 1}: la prop «${m[1]}: ${m[2]}» rompe las reglas de nombres (${rule.hint})`);
  });
}

// ---------- Recetas de las landings ----------
const byComponent = new Map(catalog.map((e) => [e.component, e]));
const landings = demos
  .filter((d) => KIT_LANDING_FILES[d.slug])
  .map((d) => {
    const file = KIT_LANDING_FILES[d.slug];
    const src = readFileSync(file, "utf8");
    // Componentes del kit en orden de primera aparición en el JSX (≈ orden en la página)
    const found: { component: string; at: number; uses: number }[] = [];
    // Solo lo que se importa del kit (una landing puede tener componentes locales con el mismo nombre)
    const imported = new Set([...src.matchAll(/import\s+(\w+)(?:\s*,\s*\{[^}]*\})?\s+from\s+"@\/components\/ui\/(\w+)"/g)].map((m) => m[2]));
    for (const [name] of byComponent) {
      if (!imported.has(name)) continue;
      const re = new RegExp(`<${name}[\\s/>]`, "g");
      const hits = [...src.matchAll(re)];
      if (hits.length) found.push({ component: name, at: hits[0].index!, uses: hits.length });
    }
    found.sort((a, b) => a.at - b.at);
    return {
      slug: d.slug,
      title: d.title,
      url: `/demo/${d.slug}`,
      file,
      description: d.blurb,
      components: found.map(({ component, uses }) => ({ component, id: byComponent.get(component)!.id, uses })),
    };
  });

// ---------- Salida ----------
const propOut = (p: PropSpec) => ({
  key: p.key,
  type: p.type,
  default: p.default,
  label: p.label,
  ...(p.hint ? { hint: p.hint } : {}),
  ...(p.type === "select" ? { options: p.options } : {}),
  ...(p.type === "number" ? { min: p.min, max: p.max } : {}),
});

const json = {
  $comment: "Generado por scripts/build-catalog.mts desde lib/catalog/. No editar a mano: npm run catalog.",
  css: "@/components/ui/styles/kit.css",
  tokens: ["--bg", "--fg", "--mut", "--acc", "--acc2", "--card", "--ln", "--r"],
  styles: STYLES.map((s) => s.id),
  categories: CATEGORIES.map((c) => ({ ...c, components: catalog.filter((e) => e.category === c.id).map((e) => e.id) })),
  components: catalog.map((e) => ({
    id: e.id,
    name: e.name,
    component: e.component,
    import: `import ${e.component} from "${e.path}";`,
    category: e.category,
    styles: e.styles,
    description: e.description,
    props: e.props.filter((p) => !p.noCode).map(propOut),
    ...(e.notes?.length ? { notes: e.notes } : {}),
    example: snippet(e, defaultsOf(e)),
    preview: `/componentes#${e.id}`,
  })),
  landings,
};

const md: string[] = [
  "# Catálogo de Trama",
  "",
  "> Generado por `scripts/build-catalog.mts` desde `lib/catalog/`. No editar a mano: `npm run catalog`.",
  "> Versión en datos: [`catalog.json`](./catalog.json). Vista previa en vivo: `/componentes#<id>`.",
  "",
  "Todos los componentes: `import X from \"@/components/ui/X\"`, CSS una vez con `import \"@/components/ui/styles/kit.css\"`,",
  "tema con los tokens `--bg --fg --mut --acc --acc2 --card --ln --r` en cualquier contenedor, estilo con",
  `\`variant\` (${STYLES.map((s) => s.id).join(" · ")}). Las listas se pasan como texto (una entrada por línea o separadas por comas; campos con \`|\`), tal como muestran los defaults.`,
  "",
];
for (const c of CATEGORIES) {
  md.push(`## ${c.label} (\`${c.id}\`)`, "", c.blurb, "");
  for (const e of catalog.filter((x) => x.category === c.id)) {
    md.push(`### ${e.name} — \`${e.component}\``, "", e.description, "");
    const kids = typeof e.children === "function" ? e.children(defaultsOf(e)) : e.children;
    if (kids) md.push(`Envuelve contenido (\`children\`), p. ej.: \`${kids.replace(/\n/g, " ")}\``, "");
    const props = e.props.filter((p) => !p.noCode);
    if (props.length) {
      md.push("| prop | tipo | default |", "|---|---|---|");
      for (const p of props) {
        const type = p.type === "select" ? p.options.map((o) => `\`${o}\``).join(" · ") : p.type === "number" ? `number ${p.min}–${p.max}` : p.type;
        const def = JSON.stringify(p.default).replace(/\|/g, "\\|");
        md.push(`| \`${p.key}\` | ${type} | ${def.length > 90 ? def.slice(0, 87) + "…\"" : def} |`);
      }
      md.push("");
    }
    if (e.notes?.length) md.push(...e.notes.map((n) => `- ${n}`), "");
  }
}
md.push("## Landings de referencia", "", "Componentes del kit que usa cada una, en orden de aparición. Pídelas como plantilla por su slug.", "");
for (const l of landings) {
  md.push(`### ${l.title} — \`${l.url}\``, "", l.description, "", `Archivo: \`${l.file}\``, "", l.components.map((c) => `\`${c.component}\`${c.uses > 1 ? ` ×${c.uses}` : ""}`).join(" → "), "");
}

const outputs: [string, string][] = [
  ["docs/catalog.json", JSON.stringify(json, null, 2) + "\n"],
  ["docs/CATALOG.md", md.join("\n")],
];

if (CHECK) {
  for (const [file, content] of outputs) {
    if (!existsSync(file) || readFileSync(file, "utf8") !== content) errors.push(`${file} está desactualizado: ejecuta npm run catalog`);
  }
} else {
  for (const [file, content] of outputs) writeFileSync(file, content);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s):\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log(`✓ ${catalog.length} componentes, ${CATEGORIES.length} categorías, ${landings.length} landings${CHECK ? " (al día)" : " → docs/catalog.json, docs/CATALOG.md"}`);
