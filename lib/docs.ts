import { readFileSync } from "node:fs";
import { join } from "node:path";
import { headingsOf } from "@/lib/ui/markdown";

/**
 * Documentación de la web (`/docs/<slug>`): las mismas páginas Markdown de `docs/`, leídas en el build. Una sola fuente: lo que
 * lee un agente en el repo es lo que se publica. Solo para componentes de servidor (usa `fs`).
 */

/** `blurb` = entradilla visible; `description` = meta descripción para buscadores (70–160 caracteres). */
export type DocPage = { slug: string; file: string; title: string; blurb: string; description: string };
export type DocGroup = { label: string; pages: DocPage[] };

export const DOC_GROUPS: DocGroup[] = [
  {
    label: "Empezar",
    pages: [
      { slug: "empezar", file: "00-empezar.md", title: "Primeros pasos", blurb: "Instalar, poner el tema y montar la primera página.", description: "Instala Trama con npm o copiando el código, define los ocho tokens de tema, elige variant e intent y monta tu primera landing en Next.js." },
      { slug: "", file: "README.md", title: "Visión general", blurb: "Qué es librería y qué es sitio, npm o copia, scripts.", description: "Visión general de Trama: qué es librería y qué es sitio, instalación con npm o kit:export, catálogo interactivo, landings y webs de referencia." },
    ],
  },
  {
    label: "Referencia",
    pages: [{ slug: "catalogo", file: "CATALOG.md", title: "Catálogo de props", blurb: "Cada componente con su import, props, tipos y defaults.", description: "Referencia de todos los componentes de Trama: import, props con tipos y valores por defecto, y las recetas de las landings de referencia." }],
  },
  {
    label: "Guías",
    pages: [
      { slug: "guia", file: "02-guia-de-componentes.md", title: "Crear componentes", blurb: "Tokens, sistema de estilos, reglas y trampas conocidas.", description: "Guía para crear y ampliar componentes de Trama: tokens, sistema de estilos, variantes, accesibilidad, rendimiento y trampas conocidas." },
      { slug: "webs-completas", file: "03-webs-completas.md", title: "Webs completas", blurb: "Sitios de varias páginas: estructura y estado compartido.", description: "Cómo están hechas las webs completas de ejemplo de Trama: varias páginas, navegación sin recarga y estado compartido (carrito, chat)." },
    ],
  },
  {
    label: "Historia",
    pages: [{ slug: "decisiones", file: "01-evaluacion.md", title: "Decisiones", blurb: "Por qué el kit es como es.", description: "Historial de decisiones de diseño de Trama: por qué el kit de componentes es como es, con la evaluación de cada etapa." }],
  },
];

export const DOC_PAGES = DOC_GROUPS.flatMap((g) => g.pages);
export const getDoc = (slug: string) => DOC_PAGES.find((p) => p.slug === slug);

const REPO = "https://github.com/DanielMartinezSebastian/trama/blob/main";
const hrefOf = (slug: string) => (slug ? `/docs/${slug}` : "/docs");

/** Enlaces relativos del Markdown del repo → rutas de la web (otra página de docs) o GitHub (código, JSON). */
function rewriteLinks(md: string) {
  return md.replace(/\]\((\.{1,2}\/[^)\s#]*)(#[^)\s]*)?(\s+"[^"]*")?\)/g, (_, path: string, hash = "", title = "") => {
    const file = path.replace(/^\.\//, "");
    const doc = DOC_PAGES.find((p) => p.file === file);
    if (doc) return `](${hrefOf(doc.slug)}${hash}${title})`;
    const repoPath = path.startsWith("../") ? path.slice(3) : `docs/${file}`;
    return `](${REPO}/${repoPath}${hash}${title})`;
  });
}

export function loadDoc(page: DocPage) {
  const raw = readFileSync(join(process.cwd(), "docs", page.file), "utf8");
  // el título va en la cabecera de la página: fuera el primer `# …` del archivo
  const markdown = rewriteLinks(raw.replace(/^\s*# .*\n/, ""));
  const headings = headingsOf(markdown).filter((h) => h.level === 2);
  return { markdown, headings };
}

export const docHref = hrefOf;
