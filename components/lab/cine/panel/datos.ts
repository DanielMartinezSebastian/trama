import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { veredictos, type Objetivos } from "@/lib/cine/objetivos";
import type { Ronda } from "./rondas";

/*
 * Lo vivo de cada ronda, leído de `.refs3d` en cada petición (el panel solo existe en local): todo lo que hay en cada
 * carpeta de captura (informes, vídeos, imágenes, datos, textos y subcarpetas como los fotogramas o los shaders), el
 * último alejamiento por eje, el historial de `cine:vuelta` y el ruido de la referencia. Solo para el servidor.
 */

const RAIZ = join(process.cwd(), ".refs3d");
const RECETAS = join(process.cwd(), "scripts", "cine", "recetas.json");

export type Tipo = "informe" | "video" | "imagen" | "datos" | "texto" | "otro";
export type Archivo = { nombre: string; titulo: string; href: string; tipo: Tipo; kb: number };
export type Subcarpeta = { nombre: string; href: string; n: number };
export type Carpeta = { papel: string; ruta: string; href: string; existe: boolean; archivos: Archivo[]; subcarpetas: Subcarpeta[]; orden?: string };
export type Vuelta = { n: number; fecha: string; nota: string; commit: string; alejamiento: Record<string, number>; veredicto?: { cumple: number; total: number }; carpeta?: string };
export type Puntuacion = { fecha: string; vuelta: number | null; sensacion: number; profundidad: number; nota: string };
export type Viva = {
  /** referencia, banco y comparación (de la última vuelta si hay vueltas) */
  capturas: Carpeta[];
  /** el resto de lo que generó la ronda: exploraciones, sondas, pruebas, ruido */
  extras: Carpeta[];
  alejamiento: Record<string, number> | null;
  de: string | null;
  vueltas: Vuelta[];
  ruido: Record<string, number> | null;
  /** objetivo y veredicto de cada eje del último medido (lib/cine/objetivos) */
  veredicto: ReturnType<typeof veredictos> | null;
  /** las puntuaciones del usuario (sensación y profundidad), de la más nueva a la más vieja */
  puntuaciones: Puntuacion[];
  orden: string | null;
};

const enc = (rel: string) => rel.replace(/\\/g, "/").split("/").filter(Boolean).map(encodeURIComponent).join("/");
/** la URL local de un archivo o carpeta de `.refs3d` (la sirve la ruta /lab/cine/archivo) */
export const hrefArchivo = (rel: string) => `/lab/cine/archivo/${enc(rel)}`;
/** la URL del visor de código del repo (ruta /lab/cine/codigo) */
export const hrefCodigo = (rel: string) => `/lab/cine/codigo/${enc(rel)}`;

const leer = <T,>(p: string): T | null => {
  try {
    return JSON.parse(readFileSync(p, "utf8")) as T;
  } catch {
    return null;
  }
};

const TIPO_EXT: Record<string, Tipo> = {
  ".html": "informe",
  ".mp4": "video",
  ".webm": "video",
  ".png": "imagen",
  ".jpg": "imagen",
  ".jpeg": "imagen",
  ".webp": "imagen",
  ".json": "datos",
  ".jsonl": "datos",
  ".md": "texto",
  ".txt": "texto",
  ".log": "texto",
  ".glsl": "texto",
  ".wgsl": "texto",
  ".ass": "texto",
};
const TITULOS: Record<string, string> = {
  "informe.html": "Informe interactivo",
  "lado.mp4": "Vídeo lado a lado (referencia | banco)",
  "video.mp4": "Vídeo de la captura",
  "anotado.mp4": "Vídeo anotado (tramos de cámara)",
  "hoja.jpg": "Hoja de contacto",
  "par.png": "Par de fotogramas (referencia arriba, banco abajo)",
  "pasadas.md": "Cadena de render",
  "comparacion.md": "Comparación por ejes",
  "comparacion.json": "Comparación (datos)",
  "explora.md": "Exploración",
  "sonda.md": "Sonda de la escena",
  "sonda.json": "Sonda (datos)",
  "ficha.json": "Ficha medida",
  "ficha.auto.json": "Ficha automática",
  "relato.json": "Relato escrito",
  "flujo.json": "Movimiento de imagen",
  "tonos.json": "Reparto de tonos",
  "vuelta.md": "Resumen de la vuelta",
  "conjunto.md": "Dinámica del conjunto",
  "conjunto.json": "Dinámica del conjunto (datos)",
  "meta.json": "Meta de la captura (con la orden)",
  "inventario.json": "Inventario de la escena",
  "timeline.jsonl": "Serie por fotograma",
  "red.json": "Recursos de red",
  "imagen.json": "Medidas de imagen",
};
// lo que no conviene enseñar como recurso: scripts de un uso y lo intermedio del análisis
const OCULTOS = /\.(mts|cjs|mjs|ts|rgb)$|^_cortes\.txt$|^anotado\.ass$/;

function listar(papel: string, rel: string): Carpeta {
  rel = rel.replace(/\\/g, "/");
  const dir = join(RAIZ, rel);
  const existe = existsSync(dir) && statSync(dir).isDirectory();
  const archivos: Archivo[] = [];
  const subcarpetas: Subcarpeta[] = [];
  if (existe) {
    for (const f of readdirSync(dir).sort()) {
      const p = join(dir, f);
      const st = statSync(p);
      if (st.isDirectory()) subcarpetas.push({ nombre: f, href: hrefArchivo(`${rel}/${f}`), n: readdirSync(p).length });
      else if (!OCULTOS.test(f)) archivos.push({ nombre: f, titulo: TITULOS[f] ?? f, href: hrefArchivo(`${rel}/${f}`), tipo: TIPO_EXT[extname(f).toLowerCase()] ?? "otro", kb: Math.round(st.size / 1024) });
    }
  }
  const orden = existe ? leer<{ orden?: string }>(join(dir, "meta.json"))?.orden : undefined;
  return { papel, ruta: rel, href: hrefArchivo(rel), existe, archivos, subcarpetas, orden };
}

/** la última vuelta de una receta, relativa a `.refs3d` */
function ultimaVuelta(carpeta: string) {
  const dir = join(process.cwd(), carpeta);
  if (!existsSync(dir)) return null;
  const vs = readdirSync(dir).filter((d) => /^vuelta-\d+$/.test(d)).sort();
  // con barras normales: la ruta se enseña y forma parte de las URL de los archivos
  return vs.length ? `${carpeta}/${vs[vs.length - 1]}`.replace(/\\/g, "/").replace(/^\.refs3d\//, "") : null;
}

export function datosVivos(r: Ronda): Viva {
  const recetas = leer<Record<string, { carpeta: string; ref: string; objetivos?: Objetivos }>>(RECETAS) ?? {};
  const receta = r.receta ? recetas[r.receta] : undefined;
  const carpeta = receta?.carpeta;
  const carpetaRel = carpeta?.replace(/\\/g, "/").replace(/^\.refs3d\//, "");
  const vuelta = carpeta ? ultimaVuelta(carpeta) : null;
  const ref = receta?.ref?.replace(/^\.refs3d[\\/]/, "") ?? r.capturas?.ref;
  const banco = vuelta ? `${vuelta}/banco` : r.capturas?.banco;
  const cmp = vuelta ? `${vuelta}/cmp` : r.capturas?.cmp;
  const capturas = [ref && listar("Referencia", ref), banco && listar(vuelta ? "Banco (última vuelta)" : "Banco", banco), cmp && listar("Comparación", cmp)].filter(Boolean) as Carpeta[];
  // los archivos sueltos de la vuelta (par de fotogramas, tonos, resumen) van con la comparación
  if (vuelta) {
    const v = listar("Vuelta", vuelta);
    capturas.find((c) => c.papel === "Comparación")?.archivos.unshift(...v.archivos);
  }
  const extras = [...(r.extras ?? []), ...(carpetaRel && existsSync(join(RAIZ, carpetaRel, "ruido")) ? [{ papel: "Ruido (la referencia contra sí misma)", ruta: `${carpetaRel}/ruido/cmp` }] : [])].map((x) => listar(x.papel, x.ruta)).filter((c) => c.existe);
  const comp = cmp ? leer<{ alejamiento: Record<string, number> }>(join(RAIZ, cmp, "comparacion.json")) : null;
  const historial =
    carpeta && existsSync(join(process.cwd(), carpeta, "historial.jsonl"))
      ? readFileSync(join(process.cwd(), carpeta, "historial.jsonl"), "utf8")
          .trim()
          .split("\n")
          .filter(Boolean)
          .map((l) => {
            const v = JSON.parse(l) as Vuelta;
            return { ...v, carpeta: `${carpetaRel}/vuelta-${String(v.n).padStart(2, "0")}` };
          })
      : [];
  const ruido = carpeta ? leer<{ alejamiento: Record<string, number> }>(join(process.cwd(), carpeta, "ruido.json"))?.alejamiento ?? null : null;
  // el alejamiento de la última vuelta lleva también el conjunto (va al historial, no a comparacion.json)
  const alejamiento = historial.length ? historial[historial.length - 1].alejamiento : (comp?.alejamiento ?? null);
  const veredicto = alejamiento && r.receta ? veredictos(alejamiento, ruido, receta?.objetivos) : null;
  const puntuaciones =
    carpeta && existsSync(join(process.cwd(), carpeta, "puntuaciones.jsonl"))
      ? readFileSync(join(process.cwd(), carpeta, "puntuaciones.jsonl"), "utf8")
          .trim()
          .split("\n")
          .filter(Boolean)
          .map((l) => JSON.parse(l) as Puntuacion)
          .reverse()
      : [];
  return { capturas, extras, alejamiento, de: cmp ?? null, vueltas: historial, ruido, veredicto, puntuaciones, orden: r.receta && r.lab ? `npm run cine:vuelta -- ${r.receta}` : null };
}

/** Documentos del laboratorio numerados desde 26 (hasta 99). */
export const DOCS_CINE = (() => {
  try {
    return readdirSync(join(process.cwd(), "docs"))
      .filter((f) => /^(2[6-9]|[3-9]\d)-.*\.md$/.test(f))
      .sort();
  } catch {
    return [] as string[];
  }
})();
