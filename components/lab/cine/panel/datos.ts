import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Ronda } from "./rondas";

/*
 * Lo vivo de cada ronda, leído de `.refs3d` en cada petición (el panel solo existe en local): qué capturas hay y con qué
 * archivos (informe, vídeo lado a lado, hoja de contacto, par de fotogramas, cadena de render), el último alejamiento
 * por eje, el historial de `cine:vuelta` y el ruido de la referencia. Solo para componentes de servidor.
 */

const RAIZ = join(process.cwd(), ".refs3d");
const RECETAS = join(process.cwd(), "scripts", "cine", "recetas.json");

export type Archivo = { nombre: string; href: string; tipo: "informe" | "video" | "imagen" | "texto" };
export type Captura = { papel: "referencia" | "banco" | "comparación"; ruta: string; existe: boolean; archivos: Archivo[]; orden?: string };
export type Vuelta = { n: number; fecha: string; nota: string; commit: string; alejamiento: Record<string, number> };
export type Viva = {
  capturas: Captura[];
  alejamiento: Record<string, number> | null;
  /** de qué comparación sale el alejamiento */
  de: string | null;
  vueltas: Vuelta[];
  ruido: Record<string, number> | null;
  /** la orden con la que se repite la vuelta */
  orden: string | null;
};

/** la URL local de un archivo de `.refs3d` (la sirve la ruta /lab/cine/archivo) */
export const hrefArchivo = (rel: string) => `/lab/cine/archivo/${rel.split(/[\\/]/).map(encodeURIComponent).join("/")}`;

const leer = <T,>(p: string): T | null => {
  try {
    return JSON.parse(readFileSync(p, "utf8")) as T;
  } catch {
    return null;
  }
};

const ARCHIVOS: [string, string, Archivo["tipo"]][] = [
  ["informe.html", "informe interactivo", "informe"],
  ["lado.mp4", "vídeo lado a lado", "video"],
  ["video.mp4", "vídeo", "video"],
  ["anotado.mp4", "vídeo anotado", "video"],
  ["hoja.jpg", "hoja de contacto", "imagen"],
  ["par.png", "par de fotogramas", "imagen"],
  ["pasadas.md", "cadena de render", "texto"],
  ["comparacion.md", "comparación", "texto"],
  ["explora.md", "exploración", "texto"],
  ["sonda.md", "sonda", "texto"],
];

function captura(papel: Captura["papel"], rel: string): Captura {
  const dir = join(RAIZ, rel);
  const existe = existsSync(dir);
  const archivos = existe ? ARCHIVOS.filter(([f]) => existsSync(join(dir, f))).map(([f, nombre, tipo]) => ({ nombre, href: hrefArchivo(`${rel}/${f}`), tipo })) : [];
  const meta = existe ? leer<{ orden?: string }>(join(dir, "meta.json")) : null;
  return { papel, ruta: rel, existe, archivos, orden: meta?.orden };
}

/** la última vuelta de una receta (carpeta y número), si hay */
function ultimaVuelta(carpeta: string) {
  const dir = join(process.cwd(), carpeta);
  if (!existsSync(dir)) return null;
  const vs = readdirSync(dir).filter((d) => /^vuelta-\d+$/.test(d)).sort();
  // con barras normales: la ruta se enseña y forma parte de las URL de los archivos
  return vs.length ? `${carpeta}/${vs[vs.length - 1]}`.replace(/\\/g, "/").replace(/^\.refs3d\//, "") : null;
}

export function datosVivos(r: Ronda): Viva {
  const recetas = leer<Record<string, { carpeta: string; ref: string }>>(RECETAS) ?? {};
  const receta = r.receta ? recetas[r.receta] : undefined;
  const carpeta = receta?.carpeta;
  const vuelta = carpeta ? ultimaVuelta(carpeta) : null;
  // con vueltas, la última manda (banco y comparación); sin ellas, las capturas de la ronda
  const ref = receta?.ref?.replace(/^\.refs3d[\\/]/, "") ?? r.capturas?.ref;
  const banco = vuelta ? `${vuelta}/banco` : r.capturas?.banco;
  const cmp = vuelta ? `${vuelta}/cmp` : r.capturas?.cmp;
  const capturas = [ref && captura("referencia", ref), banco && captura("banco", banco), cmp && captura("comparación", cmp)].filter(Boolean) as Captura[];
  if (vuelta) {
    const par = join(RAIZ, vuelta, "par.png");
    if (existsSync(par)) capturas.find((c) => c.papel === "comparación")?.archivos.push({ nombre: "par de fotogramas", href: hrefArchivo(`${vuelta}/par.png`), tipo: "imagen" });
  }
  const comp = cmp ? leer<{ alejamiento: Record<string, number> }>(join(RAIZ, cmp, "comparacion.json")) : null;
  const historial = carpeta && existsSync(join(process.cwd(), carpeta, "historial.jsonl")) ? readFileSync(join(process.cwd(), carpeta, "historial.jsonl"), "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l) as Vuelta) : [];
  const ruido = carpeta ? leer<{ alejamiento: Record<string, number> }>(join(process.cwd(), carpeta, "ruido.json"))?.alejamiento ?? null : null;
  return { capturas, alejamiento: comp?.alejamiento ?? null, de: cmp ?? null, vueltas: historial, ruido, orden: r.receta && r.lab ? `npm run cine:vuelta -- ${r.receta}` : null };
}

/** los documentos del método que el panel enseña (docs/26–34) */
export const DOCS_CINE = (() => {
  try {
    return readdirSync(join(process.cwd(), "docs"))
      .filter((f) => /^(2[6-9]|3\d)-.*\.md$/.test(f))
      .sort();
  } catch {
    return [] as string[];
  }
})();
