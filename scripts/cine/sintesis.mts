/**
 * Síntesis de varias webs (docs/38 §3): para encargos del tipo «revisa estas cinco webs y saca plantillas, componentes y
 * lo que le falta a la librería». Junta los mapas de `cine:web` (y, si las hay, la sonda y la cadena de render de cada
 * una) en una matriz de rasgos. Cuenta qué se repite y lo cruza con las piezas del kit: qué ya tenemos, qué hay que
 * estudiar a fondo con `cine:*` y qué falta.
 *
 *   npm run cine:sintesis -- <url o carpeta de cine:web> [<url o carpeta> …] [--out carpeta]
 *
 * Con una URL sin mapa, lanza antes `cine:web`. Salida: sintesis.md y sintesis.json.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

type Web = {
  url: string;
  pagina: { three: string | null; globales: string[]; fuentes: string[]; fijos: string[]; cursor: boolean; enlaces: string[]; titulo: string };
  firmasJs: string[];
  transicion: { pasos: number[] } | null;
  secciones: { tipo: string; desde: number; hasta: number; fondo3d: boolean; fijada: boolean; virtual: boolean; gl: string }[];
  pantallas: { gl: { calls: number; tris: number; pasadas: number } | null }[];
};

const argv = process.argv.slice(2);
const i = argv.indexOf("--out");
const OUT = resolve(i >= 0 ? argv[i + 1] : join(".refs3d", "sintesis", new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")));
const entradas = argv.filter((a, k) => !a.startsWith("--") && argv[k - 1] !== "--out");
if (!entradas.length) {
  console.log("Uso: npm run cine:sintesis -- <url o carpeta> [<url o carpeta> …] [--out carpeta]");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const slug = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 50);
const webs: { id: string; dir: string; w: Web }[] = [];
for (const e of entradas) {
  const dir = /^https?:\/\//.test(e) ? join(".refs3d", "webs", slug(e)) : e;
  if (!existsSync(join(dir, "web.json"))) {
    console.log(`→ mapa de ${e}`);
    execFileSync(process.execPath, [resolve("node_modules/tsx/dist/cli.mjs"), resolve("scripts/cine/web.mts"), e, "--out", dir], { stdio: "inherit" });
  }
  webs.push({ id: dir.split(/[\\/]/).pop()!, dir, w: JSON.parse(readFileSync(join(dir, "web.json"), "utf8")) as Web });
}

/*
 * Rasgos: lo que se lee del mapa. Cada uno con la pieza del kit que lo cubre (o «falta») y, si es 3D, si pide un
 * estudio a fondo con cine:* (docs/35).
 */
type Rasgo = { id: string; nombre: string; tiene: (w: Web) => boolean; kit: string; estudio?: boolean };
const glMax = (w: Web) => Math.max(0, ...w.pantallas.map((p) => p.gl?.calls ?? 0));
const tipos = (w: Web, t: string) => w.secciones.filter((s) => s.tipo === t).length;
const RASGOS: Rasgo[] = [
  { id: "3d-fondo", nombre: "Escena 3D detrás del contenido", tiene: (w) => w.secciones.some((s) => s.fondo3d), kit: "ObjectStage · ModelNav · escenas de demo (docs/22)", estudio: true },
  { id: "3d-portada", nombre: "Portada con escena 3D sola", tiene: (w) => w.secciones[0]?.tipo === "escena 3D sola" || (w.secciones[0]?.fondo3d ?? false), kit: "Hero + ObjectStage · CrossCluster · EngravedMap · Porthole", estudio: true },
  { id: "3d-pesada", nombre: "Escena pesada (≥ 20 llamadas por fotograma)", tiene: (w) => glMax(w) >= 20, kit: "presupuesto con gl.js; estudiar la cadena (pasadas.md)", estudio: true },
  { id: "fijada", nombre: "Secciones fijadas al scroll (relato)", tiene: (w) => w.secciones.some((s) => s.fijada), kit: "PinnedSection · ChapterStage · ScrubText · useScrollStory" },
  { id: "virtual", nombre: "Scroll virtual (la rueda mueve la escena sin desplazar)", tiene: (w) => w.secciones.some((s) => s.virtual), kit: "useScrollStory · ScrollStage", estudio: true },
  { id: "titular", nombre: "Titulares gigantes", tiene: (w) => tipos(w, "titular gigante") > 0, kit: "FitText · SplitText · TypeField" },
  { id: "galeria", nombre: "Galerías y tarjetas de proyectos", tiene: (w) => tipos(w, "galería") > 0, kit: "ImageGallery · DragGrid · ProjectList · StackedCards · DistortImage" },
  { id: "video", nombre: "Vídeo en la página", tiene: (w) => tipos(w, "vídeo") > 0, kit: "VideoPlayer" },
  { id: "lenis", nombre: "Scroll suave (Lenis)", tiene: (w) => [...w.pagina.globales, ...w.firmasJs].some((x) => /lenis/i.test(x)), kit: "SmoothScroll" },
  { id: "gsap", nombre: "GSAP / ScrollTrigger", tiene: (w) => [...w.pagina.globales, ...w.firmasJs].some((x) => /gsap|scrolltrigger/i.test(x)), kit: "lib/motion (sin GSAP) · PinnedSection" },
  { id: "cursor", nombre: "Cursor propio", tiene: (w) => w.pagina.cursor, kit: "CustomCursor · GlyphCursor" },
  { id: "menu", nombre: "Navegación fija", tiene: (w) => w.pagina.fijos.some((f) => /^nav|header|menu/i.test(f)), kit: "IslandNav · FullscreenMenu · HideOnScroll" },
  { id: "paginas", nombre: "Varias páginas", tiene: (w) => w.pagina.enlaces.length > 2, kit: "webs completas (docs/03) · PageTransition" },
  { id: "transicion", nombre: "Transición animada entre páginas", tiene: (w) => (w.transicion?.pasos.filter((x) => x > 0.02).length ?? 0) >= 3, kit: "PageTransition · ElementTransition (docs/05, 14)", estudio: true },
  { id: "otro-motor", nombre: "Motor sin three (WebGL propio, Pixi, OGL…)", tiene: (w) => !w.pagina.three && glMax(w) > 0, kit: "gl.js + cine:flujo para medir; recrear en TSL", estudio: true },
];

const matriz = RASGOS.map((r) => ({ ...r, webs: webs.filter((x) => r.tiene(x.w)).map((x) => x.id) }));
const n = webs.length;
const md: string[] = [
  `# Síntesis de ${n} webs`,
  "",
  "Lo que se repite en las webs, si el kit ya lo tiene y si pide un estudio a fondo (docs/38). La matriz sale de los mapas de `cine:web`; lo 3D se confirma con `cine:sonda` y `cine:capture` antes de decidir.",
  "",
  "## Webs",
  "",
  "| Web | three | Librerías | Secciones | Llamadas máx. | Fuentes |",
  "|---|---|---|---|---|---|",
  ...webs.map(({ id, w }) => `| [${id}](${w.url}) | ${w.pagina.three ?? "—"} | ${[...new Set([...w.pagina.globales, ...w.firmasJs])].join(", ") || "—"} | ${w.secciones.map((s) => s.tipo.replace("escena 3D sola", "3D").replace("titular gigante", "titular")).filter((t, k, x) => t !== x[k - 1]).join(" → ")} | ${glMax(w)} | ${w.pagina.fuentes.slice(0, 3).join(", ")} |`),
  "",
  "## Rasgos, de más a menos repetidos",
  "",
  "| Rasgo | Webs | En el kit | ¿Estudio a fondo? |",
  "|---|---|---|---|",
  ...matriz
    .filter((r) => r.webs.length)
    .sort((a, b) => b.webs.length - a.webs.length)
    .map((r) => `| ${r.nombre} | ${r.webs.length}/${n} (${r.webs.join(", ")}) | ${r.kit} | ${r.estudio ? "sí: cine:explora → sonda → captura" : "no: componer con el kit"} |`),
  "",
  "## Qué hacer",
  "",
  `- **Plantilla común**: la secuencia de secciones que más se repite es el esqueleto de la demo: ${(() => {
    const seq = webs.map(({ w }) => w.secciones.map((s) => s.tipo).filter((t, k, a) => t !== a[k - 1]).slice(0, 6).join(" → "));
    return seq.join(" | ");
  })()}.`,
  `- **Rasgos en ${Math.ceil(n / 2)} o más webs**: entran en la demo o en la plantilla (docs/07, fórmulas).`,
  "- **Rasgos marcados para estudio**: una ronda de cine (docs/35) por concepto, no por web. El concepto que se repite en varias webs es el que más rinde en la librería.",
  "- **Lo que el kit no cubre**: va a docs/36 Fase D, con la lista de comprobación de versatilidad.",
];
writeFileSync(join(OUT, "sintesis.md"), md.join("\n"));
writeFileSync(join(OUT, "sintesis.json"), JSON.stringify({ webs: webs.map(({ id, dir, w }) => ({ id, dir, url: w.url })), matriz: matriz.map(({ tiene, ...r }) => r) }, null, 1));
console.log(md.join("\n"));
console.log(`\n  ${join(OUT, "sintesis.md")}`);
