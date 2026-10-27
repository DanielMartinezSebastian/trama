import { leerCuaderno, type Ficha } from "@/components/lab/cuaderno/datos";
import { REPLICAS, type Replica } from "@/components/inspiraciones/registro";
import { RECETAS_SECTOR, type RecetaSector } from "@/lib/catalog/sectores";
import { GUIDE_EXCEPTIONS, STYLE_GUIDES, type StyleGuide } from "@/lib/ui/guides";
import repo from "./repo.json";

/*
 * Todo lo que el repo sabe de cada guía de estilo (docs/54), para su hoja en /guias/<guía> y el índice de /guias:
 *   - su medida en el navegador y las páginas del repo más afines (repo.json, de `refs:probe --repo`);
 *   - las fichas del cuaderno de su familia (docs/cuaderno): patrones, tono, paleta, tipografía y movimiento que se repiten;
 *   - su receta de sector (lib/catalog/sectores.ts);
 *   - las inspiraciones que la siguen (components/inspiraciones/registro.ts, /inspiraciones/<slug>);
 *   - las excepciones medidas (GUIDE_EXCEPTIONS) y los gestos del kit que corresponden a su movimiento.
 * Solo en servidor (lee docs/cuaderno con fs).
 */

export type PaginaRepo = {
  tipo: "guia" | "web" | "landing" | "replica";
  ruta: string;
  guia?: string;
  titulo?: string;
  medidas: {
    fondo: string | null;
    paleta: [string, number][];
    titular: { letra: string; vw: number; peso: number; interlineado: number; tracking: number; mayusculas: boolean } | null;
    texto: { size: number; lh: number; measureEm: number } | null;
    familias: string[];
    margen: number | null;
    radios: string[];
    curvas: string[];
    hover: number;
    libs: string[];
    pantallas: number;
  };
  afinidad: { guia: string; afinidad: number }[];
};

export const REPO = repo as unknown as { fecha: string; base: string; paginas: PaginaRepo[]; fallidas: string[] };

/** la ruta pública de una página medida: las réplicas del laboratorio se publican como inspiraciones */
export const rutaPublica = (p: PaginaRepo) => (p.tipo === "replica" ? p.ruta.replace("/lab/estudios/", "/inspiraciones/") : p.ruta);

/** el gesto del kit que da cada movimiento del cuaderno */
export const GESTOS_KIT: Record<string, string> = {
  "subrayado que crece": 'NavBar linkHover="underline"',
  "texto que rueda": "RollLink (fade)",
  "relleno que baja": 'FullscreenMenu triggerHover="fill"',
  "transición en escalera": 'PageTransition kind="stairs" · FullscreenMenu reveal="stairs"',
  "fila que gira a marquesina": 'FullscreenMenu linkHover="marquee"',
  "filetes que se dibujan": "FullscreenMenu rules",
  "cinta que corre": 'Marquee variant="minimal"',
  "scroll suavizado": "SmoothScroll",
  "titular que cruza": "PinnedSection con el titular desplazado",
  "trazo que se dibuja": "LineDraw",
  "fotos que se disuelven": "ShapeMosaic dissolve",
  "crecer con el scroll": "ScrollExpand",
  "palabras que asoman": 'Reveal kind="slide"',
  "foto fija": "FeatureExplorer",
  "menú que cae": "FullscreenMenu",
  "vídeos que se suceden": "VideoPlayer",
  "producto fijo": "ObjectStage o position: fixed",
  "enlaces que suben escalonados": "FullscreenMenu",
};

const cuenta = (xs: string[]) => {
  const m = new Map<string, number>();
  for (const x of xs) m.set(x, (m.get(x) ?? 0) + 1);
  return [...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};

export type DatosGuia = {
  g: StyleGuide;
  medida: PaginaRepo | undefined;
  afines: { p: PaginaRepo; afinidad: number }[];
  fichas: Ficha[];
  patrones: [string, number][];
  tono: [string, number][];
  paleta: [string, number][];
  tipografia: [string, number][];
  movimiento: [string, number][];
  piezas: [string, number][];
  colores: string[];
  receta: RecetaSector | undefined;
  inspiraciones: Replica[];
  excepciones: { rule: string; why: string }[];
};

export function datosDeGuia(id: string): DatosGuia | null {
  const g = STYLE_GUIDES.find((x) => x.id === id);
  if (!g) return null;
  const fichas = leerCuaderno().filter((f) => ["réplica", "demo", "concepto"].includes(f.tipo) && f.etiquetas.guia.includes(g.label.toLowerCase()));
  const todo = (k: "patrones" | "tono" | "paleta" | "tipografia" | "movimiento" | "piezas") => cuenta(fichas.flatMap((f) => f.etiquetas[k]));
  // las páginas del repo cuya guía más afín es esta, de más a menos afines
  const afines = REPO.paginas
    .filter((p) => p.tipo !== "guia" && p.afinidad[0]?.guia === id)
    .map((p) => ({ p, afinidad: p.afinidad[0].afinidad }))
    .sort((a, b) => b.afinidad - a.afinidad);
  return {
    g,
    medida: REPO.paginas.find((p) => p.tipo === "guia" && p.guia === id),
    afines,
    fichas,
    patrones: todo("patrones"),
    tono: todo("tono"),
    paleta: todo("paleta"),
    tipografia: todo("tipografia"),
    movimiento: todo("movimiento"),
    piezas: todo("piezas"),
    colores: [...new Set(fichas.flatMap((f) => f.colores))],
    receta: RECETAS_SECTOR.find((r) => r.guia === id),
    inspiraciones: REPLICAS.filter((r) => r.guia === id),
    excepciones: GUIDE_EXCEPTIONS[id] ?? [],
  };
}

/** contraste WCAG entre dos colores hex */
export function contraste(a: string, b: string) {
  const l = (h: string) => {
    const m = /^#?([0-9a-f]{6})/i.exec(h.trim());
    if (!m) return 0;
    const [r, g, bb] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255).map((c) => (c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bb;
  };
  const [x, y] = [l(a), l(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
