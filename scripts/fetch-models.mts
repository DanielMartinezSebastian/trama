/**
 * Busca y descarga modelos 3D con licencias que permiten redistribuir (CC0 y CC BY; se descartan SA, ND y NC), guarda sus
 * créditos y mide cuánto están **articulados** (esqueleto, animaciones, piezas con nombre). Con `--partes` genera además,
 * con [gltfjsx](https://github.com/pmndrs/gltfjsx), un componente de React Three Fiber con cada pieza como un nodo propio.
 * Es el hermano de `images:fetch` y `videos:fetch` para 3D.
 *
 *   npm run models:fetch -- buscar "skull"                        → busca en todas las fuentes
 *   npm run models:fetch -- buscar "skeleton" --articulado         → solo animados o con esqueleto (donde la fuente lo sabe)
 *   npm run models:fetch -- buscar "lantern" --fuente polyhaven --n 20
 *   npm run models:fetch -- buscar "gravestone" --caras 30000           → solo modelos ligeros (Sketchfab)
 *   npm run models:fetch -- bajar polyhaven:Lantern_01 farol-viejo  → public/models/farol-viejo/farol-viejo.glb + créditos
 *   npm run models:fetch -- bajar sketchfab:<uid> esqueleto --partes → … + components/models/Esqueleto.tsx (gltfjsx)
 *   npm run models:fetch -- revisar public/models/x/x.glb           → solo el informe de articulación
 *
 * Claves: en `.env.scripts` (raíz del repo, ignorado por git y que Next.js no lee); plantilla en `.env.example`.
 *
 * Fuentes (en `buscar`, en este orden):
 * - `sketchfab`: la biblioteca más grande y la que más modelos animados y con esqueleto tiene. Buscar no pide nada;
 *   **descargar pide un token** de una cuenta gratuita: `SKETCHFAB_TOKEN` (Sketchfab → Settings → Password & API).
 *   Filtra por licencia (`cc0`, `by`), descargable y, con `--articulado`, animado.
 * - `polypizza`: modelos low poly (Quaternius, Kenney, Google Poly…), muchos animados. Pide `POLY_PIZZA_KEY` (gratis en
 *   poly.pizza/settings/api) para buscar y para bajar.
 * - `polyhaven`: 500+ modelos CC0 de atrezo con texturas PBR, sin clave. No traen esqueleto; algunos vienen por piezas.
 * - `khronos`: los modelos de muestra de glTF (CC0 o CC BY), sin clave. Algunos con esqueleto y animaciones.
 *
 * Salida: `public/models/<nombre>/<nombre>.glb` (un único GLB, texturas incluidas), una entrada en
 * `public/models/credits.json` (autor, licencia, origen y el informe de articulación) y una fila en `public/models/LICENSES.md`.
 * Con `--partes`: `npx gltfjsx --transform --keepmeshes --keepnames --types` (Draco y texturas WebP a `--res`, pero **sin
 * juntar mallas**, para no perder la articulación), el GLB optimizado al lado y el componente en `components/models/`.
 * El decodificador de Draco se copia una vez a `public/draco/` (sin CDN externo). Los componentes usan `useGLTF` y, si hay
 * animaciones, `useAnimations` de `@react-three/drei`.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";

// secretos locales: `.env.scripts` en la raíz (ignorado por git y fuera del alcance de Next.js; plantilla en `.env.example`).
// Lo que ya venga en el entorno manda. Los tokens solo viajan en cabeceras: nunca se escriben en la salida ni en los créditos.
if (existsSync(".env.scripts")) process.loadEnvFile(".env.scripts");

const UA = "TramaUI-demo-models/1.0 (https://github.com/DanielMartinezSebastian/trama; demo assets)";
const OUT = "public/models";
const CREDITS = join(OUT, "credits.json");
const SOURCES = ["sketchfab", "polypizza", "polyhaven", "khronos"] as const;
type Source = (typeof SOURCES)[number];

type Cand = {
  source: Source;
  id: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  page: string;
  /** lo que la fuente sabe de antemano */
  animated?: boolean;
  rigged?: boolean;
  faces?: number;
};

/* ---------- utilidades ---------- */
const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const opt = (name: string, def = "") => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : def;
};
const positional = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--") && ["fuente", "n", "licencia", "res", "caras"].includes(args[i - 1].slice(2))));
const words = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean);
const pascal = (s: string) => s.replace(/(^|[-_\s]+)(\w)/g, (_, __, c: string) => c.toUpperCase()).replace(/[^A-Za-z0-9]/g, "");
/** CC0 y CC BY sí; SA, ND y NC no (la misma regla que las fotos). */
const licenseOk = (l: string) => /cc0|public domain|cc-by|cc by|attribution/i.test(l) && !/\b(sa|nd|nc)\b|share ?alike|non-?commercial|no ?deriv/i.test(l);

async function json(url: string, headers: Record<string, string> = {}) {
  const r = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${url}`);
  return r.json();
}
async function download(url: string, to: string, headers: Record<string, string> = {}) {
  const r = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
  if (!r.ok) throw new Error(`${r.status} al bajar ${url}`);
  mkdirSync(dirname(to), { recursive: true });
  writeFileSync(to, Buffer.from(await r.arrayBuffer()));
}

/* ---------- fuentes: búsqueda ---------- */
async function searchSketchfab(q: string, n: number, articulated: boolean): Promise<Cand[]> {
  const out: Cand[] = [];
  for (const lic of opt("licencia", "cc0,by").split(",")) {
    const p = new URLSearchParams({ type: "models", q, downloadable: "true", license: lic, count: String(Math.min(24, n)), sort_by: "-likeCount" });
    if (articulated) p.set("animated", "true");
    // --caras N: como mucho N caras (para la web: los escaneos de museo pasan del millón)
    if (opt("caras")) p.set("max_face_count", opt("caras"));
    const d = await json(`https://api.sketchfab.com/v3/search?${p}`);
    for (const r of d.results ?? []) {
      out.push({
        source: "sketchfab", id: r.uid, title: r.name, author: r.user?.displayName || r.user?.username || "?",
        license: r.license?.label ?? lic, licenseUrl: r.license?.url ?? "", page: r.viewerUrl,
        animated: (r.animationCount ?? 0) > 0, faces: r.faceCount,
      });
    }
  }
  return out;
}

async function searchPolyPizza(q: string, n: number): Promise<Cand[]> {
  const key = process.env.POLY_PIZZA_KEY;
  if (!key) throw new Error("falta POLY_PIZZA_KEY (gratis en https://poly.pizza/settings/api)");
  const d = await json(`https://api.poly.pizza/v1.1/search/${encodeURIComponent(q)}?Limit=${Math.min(32, n)}`, { "x-auth-token": key });
  return (d.results ?? []).map((r: any): Cand => ({
    source: "polypizza", id: r.ID, title: r.Title, author: r.Creator?.Username ?? "?", license: r.Licence ?? "?",
    licenseUrl: /cc0|zero/i.test(r.Licence ?? "") ? "https://creativecommons.org/publicdomain/zero/1.0/" : "https://creativecommons.org/licenses/by/3.0/",
    page: `https://poly.pizza/m/${r.ID}`, animated: !!r.Animated, faces: r["Tri Count"],
  }));
}

async function searchPolyHaven(q: string): Promise<Cand[]> {
  const d = await json("https://api.polyhaven.com/assets?t=models");
  const w = words(q);
  return Object.entries<any>(d)
    .filter(([id, a]) => w.some((x) => [id, a.name, ...(a.tags ?? []), ...(a.categories ?? [])].join(" ").toLowerCase().includes(x)))
    .map(([id, a]): Cand => ({
      source: "polyhaven", id, title: a.name, author: Object.keys(a.authors ?? {}).join(", ") || "Poly Haven",
      license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", page: `https://polyhaven.com/a/${id}`,
      rigged: false, animated: false,
    }));
}

const KHRONOS = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models";
async function searchKhronos(q: string, articulated: boolean): Promise<Cand[]> {
  const d = await json(`${KHRONOS}/model-index.json`);
  const w = words(q);
  return d
    .filter((m: any) => m.variants?.["glTF-Binary"])
    .filter((m: any) => w.some((x) => [m.name, m.label, ...(m.tags ?? [])].join(" ").toLowerCase().includes(x)))
    .filter((m: any) => !articulated || (m.tags ?? []).some((t: string) => /anim|skin|morph/.test(t)))
    .map((m: any): Cand => ({
      source: "khronos", id: m.name, title: m.label ?? m.name, author: "(ver metadata.json)", license: "CC0 / CC BY (ver metadata.json)", licenseUrl: "",
      page: `https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/${m.name}`,
    }));
}

/* ---------- fuentes: descarga ---------- */
async function getSketchfab(id: string, to: string): Promise<Partial<Cand>> {
  const token = process.env.SKETCHFAB_TOKEN;
  if (!token) throw new Error("falta SKETCHFAB_TOKEN (Sketchfab → Settings → Password & API); buscar no lo pide, bajar sí");
  const meta = await json(`https://api.sketchfab.com/v3/models/${id}`);
  const dl = await json(`https://api.sketchfab.com/v3/models/${id}/download`, { Authorization: `Token ${token}` });
  if (!dl.glb?.url) throw new Error("Sketchfab no ofrece GLB para este modelo");
  await download(dl.glb.url, to);
  return {
    title: meta.name, author: meta.user?.displayName || meta.user?.username, license: meta.license?.label ?? "?",
    licenseUrl: meta.license?.url ?? "", page: meta.viewerUrl, animated: (meta.animationCount ?? 0) > 0,
  };
}

async function getPolyPizza(id: string, to: string): Promise<Partial<Cand>> {
  const key = process.env.POLY_PIZZA_KEY;
  if (!key) throw new Error("falta POLY_PIZZA_KEY (gratis en https://poly.pizza/settings/api)");
  const m = await json(`https://api.poly.pizza/v1.1/model/${id}`, { "x-auth-token": key });
  await download(m.Download, to);
  return { title: m.Title, author: m.Creator?.Username, license: m.Licence, page: `https://poly.pizza/m/${id}`, animated: !!m.Animated };
}

/** Poly Haven sirve glTF suelto (bin + texturas): se baja todo a una carpeta y se empaqueta en un único GLB. */
async function getPolyHaven(id: string, to: string): Promise<Partial<Cand>> {
  const res = opt("res", "1k");
  const files = await json(`https://api.polyhaven.com/files/${id}`);
  const g = files.gltf?.[res]?.gltf;
  if (!g) throw new Error(`Poly Haven no tiene ${id} en glTF a ${res} (prueba --res 2k)`);
  const tmp = join(dirname(to), "_src");
  await download(g.url, join(tmp, basename(new URL(g.url).pathname)));
  for (const [rel, f] of Object.entries<any>(g.include ?? {})) await download(f.url, join(tmp, rel));
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(join(tmp, basename(new URL(g.url).pathname)));
  await io.write(to, doc);
  execFileSync(process.platform === "win32" ? "cmd" : "rm", process.platform === "win32" ? ["/c", "rmdir", "/s", "/q", tmp] : ["-rf", tmp]);
  const info = await json(`https://api.polyhaven.com/info/${id}`);
  return { title: info.name, author: Object.keys(info.authors ?? {}).join(", "), license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", page: `https://polyhaven.com/a/${id}` };
}

async function getKhronos(id: string, to: string): Promise<Partial<Cand>> {
  const idx = await json(`${KHRONOS}/model-index.json`);
  const m = idx.find((x: any) => x.name === id);
  if (!m?.variants?.["glTF-Binary"]) throw new Error(`Khronos no tiene ${id} en GLB`);
  await download(`${KHRONOS}/${id}/glTF-Binary/${m.variants["glTF-Binary"]}`, to);
  const meta = await json(`${KHRONOS}/${id}/metadata.json`).catch(() => null);
  const l = meta?.legal?.[0];
  return {
    title: meta?.name ?? id, author: (meta?.legal ?? []).map((x: any) => x.artist).filter(Boolean).join(", ") || "?",
    license: l?.spdx ?? "?", licenseUrl: l?.licenseUrl ?? "", page: `https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/${id}`,
  };
}

/* ---------- articulación ---------- */
type Report = { triangles: number; nodes: number; meshes: number; namedParts: string[]; skins: number; joints: number; animations: string[]; materials: number; textures: number; kb: number; verdict: string };
async function inspect(file: string): Promise<Report> {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(file);
  const root = doc.getRoot();
  let triangles = 0;
  for (const m of root.listMeshes())
    for (const p of m.listPrimitives()) {
      const i = p.getIndices(), pos = p.getAttribute("POSITION");
      triangles += Math.round((i ? i.getCount() : pos?.getCount() ?? 0) / 3);
    }
  const meshNodes = root.listNodes().filter((n) => n.getMesh());
  const namedParts = meshNodes.map((n) => n.getName()).filter((s) => s && !/^(mesh|object|node|group)?[_.\s-]*\d*$/i.test(s));
  const skins = root.listSkins();
  const joints = skins.reduce((a, s) => a + s.listJoints().length, 0);
  const animations = root.listAnimations().map((a) => a.getName() || "(sin nombre)");
  const verdict =
    skins.length ? `con esqueleto (${joints} huesos)${animations.length ? ` y ${animations.length} animaciones` : ""}`
    : animations.length ? `animado por piezas (${animations.length} animaciones)`
    : meshNodes.length > 1 ? `por piezas (${meshNodes.length} mallas${namedParts.length ? `, ${namedParts.length} con nombre` : ""})`
    : "una sola pieza (para articularlo hay que partirlo: ver docs/20 §2)";
  return { triangles, nodes: root.listNodes().length, meshes: meshNodes.length, namedParts: namedParts.slice(0, 40), skins: skins.length, joints, animations: animations.slice(0, 40), materials: root.listMaterials().length, textures: root.listTextures().length, kb: Math.round(statSync(file).size / 1024), verdict };
}
const printReport = (r: Report) => {
  console.log(`  ${r.verdict}`);
  console.log(`  ${r.triangles.toLocaleString("es-ES")} triángulos · ${r.nodes} nodos · ${r.materials} materiales · ${r.textures} texturas · ${r.kb.toLocaleString("es-ES")} KB`);
  if (r.namedParts.length) console.log(`  piezas: ${r.namedParts.slice(0, 16).join(", ")}${r.namedParts.length > 16 ? "…" : ""}`);
  if (r.animations.length) console.log(`  animaciones: ${r.animations.slice(0, 12).join(", ")}${r.animations.length > 12 ? "…" : ""}`);
};

/* ---------- gltfjsx: el componente por piezas ---------- */
function parts(glb: string, name: string) {
  // decodificador de Draco local (gltfjsx --transform comprime con Draco; useGLTF lo busca en /draco/)
  const draco = "public/draco";
  if (!existsSync(join(draco, "draco_decoder.wasm"))) {
    mkdirSync(draco, { recursive: true });
    for (const f of ["draco_decoder.js", "draco_decoder.wasm", "draco_wasm_wrapper.js"]) copyFileSync(join("node_modules/three/examples/jsm/libs/draco/gltf", f), join(draco, f));
  }
  const comp = join("components/models", `${pascal(name)}.tsx`);
  mkdirSync(dirname(comp), { recursive: true });
  // gltfjsx con node directamente (sin shell). --keepmeshes: el --transform no junta mallas (si no, se pierden las piezas);
  // --keepnames: los nombres de origen
  const res = opt("res", "1024").replace(/^(\d)k$/, (_, d: string) => String(Number(d) * 1024));
  execFileSync(process.execPath, [join("node_modules", "gltfjsx", "cli.js"), glb, "--transform", "--keepmeshes", "--keepnames", "--types", "--resolution", res, "--draco", "/draco/", "--output", comp], { stdio: "inherit" });
  // el GLB optimizado sale junto al componente: va a public/models/<nombre>/
  const made = join(dirname(comp), `${basename(glb, ".glb")}-transformed.glb`);
  const dest = join(dirname(glb), basename(made));
  if (existsSync(made)) renameSync(made, dest);
  // adaptar el código a este proyecto: React 19 (sin JSX global, useRef con valor inicial), los módulos de three que ya usa
  // el repo en vez de three-stdlib, y la ruta pública del GLB
  let src = readFileSync(comp, "utf8")
    .replace(/(['"])[^'"]*?([^/\\'"]+-transformed\.glb)\1/g, `"/models/${name}/$2"`)
    .replace(/import \{ GLTF, SkeletonUtils \} from 'three-stdlib'/, `import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";\nimport * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js"`)
    .replace(/import \{ GLTF \} from 'three-stdlib'/, `import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js"`)
    .replace(/JSX\.IntrinsicElements\['group'\]/g, "ThreeElements['group']")
    .replace(/React\.useRef<THREE\.Group>\(\)/g, "React.useRef<THREE.Group>(null)")
    .replace(/ as GLTFResult/g, " as unknown as GLTFResult");
  // con animaciones: una prop `play` con el nombre de la que debe sonar (fundido de 0,3 s al cambiar)
  if (/const \{ actions \} = useAnimations\(animations, group\)/.test(src))
    src = src
      .replace(/export function Model\(props: ThreeElements\['group'\]\)/, "export function Model({ play, ...props }: ThreeElements['group'] & { play?: ActionName })")
      .replace(
        /const \{ actions \} = useAnimations\(animations, group\)/,
        "const { actions } = useAnimations(animations, group)\n  React.useEffect(() => {\n    const a = play ? actions[play] : null\n    a?.reset().fadeIn(0.3).play()\n    return () => {\n      a?.fadeOut(0.3)\n    }\n  }, [actions, play])",
      );
  // sin animaciones: gltfjsx deja `GLTFAction` sin declarar y `React` sin usar
  if (!/interface GLTFAction/.test(src)) src = src.replace(/animations: GLTFAction\[\]/g, "animations: THREE.AnimationClip[]");
  if (!/React\./.test(src)) src = src.replace(/import React from 'react'\n/, "");
  if (src.includes("ThreeElements")) src = src.replace(/import \{ ([^}]*) \} from '@react-three\/fiber'/, (_m, g: string) => `import { ${g}, type ThreeElements } from '@react-three/fiber'`);
  if (src.includes("ThreeElements") && !/from '@react-three\/fiber'/.test(src)) src = src.replace("import React from 'react'", "import React from 'react'\nimport type { ThreeElements } from '@react-three/fiber'");
  writeFileSync(comp, `"use client";\n// Generado con gltfjsx por scripts/fetch-models.mts (modelo en public/models/${name}/; créditos en public/models/credits.json)\n${src}`);
  console.log(`  componente: ${comp}
  modelo optimizado: ${dest}`);
}

/* ---------- créditos ---------- */
function credit(entry: Record<string, unknown>) {
  const list: Record<string, unknown>[] = existsSync(CREDITS) ? JSON.parse(readFileSync(CREDITS, "utf8")) : [];
  const next = [...list.filter((e) => e.name !== entry.name), entry];
  writeFileSync(CREDITS, JSON.stringify(next, null, 2) + "\n");
  const lic = join(OUT, "LICENSES.md");
  let md = readFileSync(lic, "utf8");
  const head = "## Descargados con `npm run models:fetch`";
  if (!md.includes(head)) md += `\n${head}\n\n| Archivo | Origen | Licencia |\n|---|---|---|\n`;
  const row = `| \`${entry.name}/${entry.name}.glb\` | *${entry.title}*, ${entry.author}, de [${entry.source}](${entry.page}) | ${entry.licenseUrl ? `[${entry.license}](${entry.licenseUrl})` : entry.license} |`;
  const lines = md.split("\n").filter((l) => !l.startsWith(`| \`${entry.name}/`));
  // la fila va justo después de la última de su tabla (detrás puede haber notas en prosa)
  let at = lines.indexOf(head) + 1;
  while (at < lines.length && (lines[at] === "" || lines[at].startsWith("|"))) at++;
  while (at > 0 && lines[at - 1] === "") at--;
  lines.splice(at, 0, row);
  writeFileSync(lic, lines.join("\n").replace(/\n*$/, "\n"));
}

/* ---------- órdenes ---------- */
const [cmd, a1, a2] = positional;
if (cmd === "buscar" && a1) {
  const n = Number(opt("n", "12"));
  const articulated = flag("articulado");
  const want = (opt("fuente", SOURCES.join(",")).split(",") as Source[]).filter((s) => SOURCES.includes(s));
  for (const s of want) {
    try {
      const found =
        s === "sketchfab" ? await searchSketchfab(a1, n, articulated)
        : s === "polypizza" ? await searchPolyPizza(a1, n)
        : s === "polyhaven" ? (articulated ? [] : await searchPolyHaven(a1))
        : await searchKhronos(a1, articulated);
      const ok = found.filter((c) => c.source === "khronos" || licenseOk(c.license));
      console.log(`\n${s}: ${ok.length} (de ${found.length})${s === "polyhaven" && articulated ? " — sin esqueletos ni animaciones" : ""}`);
      for (const c of ok.slice(0, n))
        console.log(`  ${c.source}:${c.id}  ${c.title.slice(0, 48)}  · ${c.author.slice(0, 24)} · ${c.license}${c.animated ? " · animado" : ""}${c.faces ? ` · ${c.faces.toLocaleString("es-ES")} caras` : ""}`);
    } catch (e) {
      console.log(`\n${s}: no disponible — ${(e as Error).message}`);
    }
  }
} else if (cmd === "bajar" && a1 && a2) {
  const [source, ...rest] = a1.split(":");
  const id = rest.join(":");
  const name = a2.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const to = join(OUT, name, `${name}.glb`);
  mkdirSync(dirname(to), { recursive: true });
  const got =
    source === "sketchfab" ? await getSketchfab(id, to)
    : source === "polypizza" ? await getPolyPizza(id, to)
    : source === "polyhaven" ? await getPolyHaven(id, to)
    : source === "khronos" ? await getKhronos(id, to)
    : null;
  if (!got) throw new Error(`fuente desconocida: ${source} (${SOURCES.join(", ")})`);
  if (source !== "khronos" && !licenseOk(got.license ?? "")) console.warn(`  ¡ojo! licencia «${got.license}»: no está entre las admitidas (CC0, CC BY)`);
  const report = await inspect(to);
  console.log(`\n${name}: ${got.title} · ${got.author} · ${got.license}`);
  printReport(report);
  credit({ name, file: `${name}/${name}.glb`, source, id, title: got.title, author: got.author, license: got.license, licenseUrl: got.licenseUrl, page: got.page, fetched: new Date().toISOString().slice(0, 10), ...report });
  if (flag("partes")) {
    parts(to, name);
    // la web sirve el optimizado: el original (pesado) no se guarda y los créditos apuntan al optimizado
    const opt = join(dirname(to), `${name}-transformed.glb`);
    if (existsSync(opt)) {
      rmSync(to);
      const list: Record<string, unknown>[] = JSON.parse(readFileSync(CREDITS, "utf8"));
      for (const e of list) if (e.name === name) e.file = `${name}/${name}-transformed.glb`;
      writeFileSync(CREDITS, JSON.stringify(list, null, 2) + "\n");
      const lic = join(OUT, "LICENSES.md");
      writeFileSync(lic, readFileSync(lic, "utf8").replace(`| \`${name}/${name}.glb\` |`, `| \`${name}/${name}-transformed.glb\` |`));
    }
  }
} else if (cmd === "revisar" && a1) {
  printReport(await inspect(a1));
  if (flag("partes")) parts(a1, a2 ?? basename(a1, ".glb"));
} else {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0].replace(/^\/\*\*|\n \* ?/g, "\n"));
}
