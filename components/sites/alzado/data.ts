/** Alzado — estudio ficticio de arquitectura. Fórmulas: Oryzo y Explore Primland (cámara 3D que recorre una maqueta con el scroll,
 * anotaciones de CAD), Overworld Audio (mapa 3D explorable) y 'kin (índice con cambio de vista). Datos puros. */
import type { CameraStop, MapBlock, MapDim } from "@/lib/map3d/scene";
import { city } from "@/lib/sites/maqueta";

export const SLUG = "alzado";

export const meta = {
  slug: SLUG,
  name: "Alzado",
  title: "Alzado · arquitectura que se entiende en maqueta",
  blurb:
    "Web de un estudio de arquitectura con la fórmula «maqueta que se recorre»: preloader con la marca, portada fijada en la que el scroll lleva la cámara de la planta con cotas a la maqueta 3D de madera y metacrilato (three.js), proyectos con la foto dentro del cursor y cambio de vista, y mapa 3D de obras que se arrastra. Usa Preloader, PinnedSection, ExplorableCanvas (depth=\"3d\", nav=\"scroll\" y \"drag\"), SplitText, ProjectList con OptionPicker, CustomCursor, CellGrid y BigFooter.",
  accent: "#1f6f50",
  tag: "arquitectura · maqueta 3D",
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "proyectos", title: "Proyectos" },
];

/* ---------- la maqueta de la portada: un bloque de viviendas en U, de madera, en un barrio de cartón ---------- */
export const HERO_WORLD = { w: 2400, h: 1500 };
const HERO_ASPECT = HERO_WORLD.h / HERO_WORLD.w;

/** el proyecto: madera de balsa, un pabellón de metacrilato, el núcleo de escalera con el acento y árboles en el patio */
const PROJECT: MapBlock[] = [
  { x: 50, y: 50, w: 32, d: 50, h: 6, mat: "wood" },
  { x: 39, y: 52, w: 6, d: 34, h: 150, mat: "wood" },
  { x: 61, y: 54, w: 6, d: 30, h: 110, mat: "wood" },
  { x: 50, y: 34, w: 28, d: 10, h: 200, mat: "wood" },
  { x: 56, y: 34, w: 2.4, d: 4, h: 222, shape: "cylinder", mat: "accent" },
  { x: 50, y: 68, w: 14, d: 7, h: 46, mat: "acrylic" },
  { x: 47, y: 50, w: 2.2, d: 3.5, h: 110, shape: "tree" },
  { x: 53, y: 54, w: 2.6, d: 4, h: 120, shape: "tree" },
  { x: 49, y: 58, w: 2, d: 3.2, h: 100, shape: "tree" },
];

/** el barrio: manzanas de cartón blanco, sin nada dentro del solar */
const CONTEXT = city({ seed: 23, aspect: HERO_ASPECT, cell: 8, street: 2.6, maxH: 130, accent: 0, mix: false }).filter((b) => !(b.x > 26 && b.x < 74 && b.y > 15 && b.y < 85));

export const HERO_BLOCKS: MapBlock[] = [...CONTEXT, ...PROJECT];

export const HERO_DIMS: MapDim[] = [
  { x1: 34, y1: 24, x2: 66, y2: 24, label: "38,40 m" },
  { x1: 31, y1: 25, x2: 31, y2: 75, label: "37,50 m" },
  { x1: 43, y1: 75, x2: 57, y2: 75, label: "16,80 m" },
];

/** el recorrido: planta → maqueta → patio → fachada */
export const HERO_PATH: CameraStop[] = [
  { x: 50, y: 50, tilt: 0, zoom: 0.95, title: "Primero, el plano.", text: "Todo empieza en papel: la planta, las cotas y la orientación del solar." },
  { x: 50, y: 52, tilt: 44, zoom: 1.1, title: "Después, el volumen.", text: "Levantamos la maqueta para entender la escala del barrio y cómo cae la luz." },
  { x: 50, y: 54, tilt: 56, zoom: 1.8, yaw: 32, title: "Un patio que respira.", text: "Las tres alas se abren al sur y dejan un patio con árboles para toda la manzana." },
  { x: 50, y: 48, tilt: 60, zoom: 1.05, yaw: -42, title: "Madera, vidrio y barrio.", text: "Estructura de madera, un pabellón de vidrio en planta baja y la escalera como faro." },
];

/* ---------- proyectos ---------- */
export type Work = { title: string; kind: string; year: string; topic: "arquitectura" | "ciudad" | "interiores"; i: number; alt: string };

export const WORKS: Work[] = [
  { title: "Patio Ruzafa", kind: "Vivienda colectiva", year: "2026", topic: "arquitectura", i: 0, alt: "Fachada geométrica gris con ventanas en relieve" },
  { title: "Casa Albufera", kind: "Vivienda unifamiliar", year: "2026", topic: "interiores", i: 4, alt: "Salón luminoso con sofá y plantas" },
  { title: "Mercat Nou", kind: "Equipamiento", year: "2025", topic: "ciudad", i: 3, alt: "Edificio blanco con terrazas y escaleras" },
  { title: "Galería Faro", kind: "Cultura", year: "2025", topic: "arquitectura", i: 3, alt: "Pasillo blanco que lleva a una sala" },
  { title: "Biblioteca Turia", kind: "Equipamiento", year: "2024", topic: "arquitectura", i: 5, alt: "Ángulos de un edificio contra el cielo" },
  { title: "Oficinas Grao", kind: "Trabajo", year: "2023", topic: "interiores", i: 3, alt: "Planta en un espacio de trabajo compartido" },
];

/* ---------- obras en curso: el mapa ---------- */
export const MAP_WORLD = { w: 2600, h: 1600 };
const MAP_ASPECT = MAP_WORLD.h / MAP_WORLD.w;

export const SITES = [
  { id: "ruzafa", x: 30, y: 36, title: "Ruzafa", meta: "Vivienda · obra", text: "24 viviendas alrededor de un patio. Estructura de madera en curso.", topic: "arquitectura" as const, i: 0 },
  { id: "grao", x: 68, y: 30, title: "Grao", meta: "Oficinas · proyecto", text: "Rehabilitación de una nave del puerto para oficinas.", topic: "interiores" as const, i: 3 },
  { id: "turia", x: 52, y: 66, title: "Turia", meta: "Biblioteca · licencia", text: "Una biblioteca de barrio junto al antiguo cauce.", topic: "arquitectura" as const, i: 5 },
  { id: "benimaclet", x: 80, y: 72, title: "Benimaclet", meta: "Mercado · concurso", text: "Propuesta para cubrir un mercado al aire libre.", topic: "ciudad" as const, i: 3 },
];

/** cada obra es una pieza de madera en una plaza del barrio de cartón */
export const MAP_BLOCKS: MapBlock[] = [
  ...city({ seed: 5, plazas: SITES, aspect: MAP_ASPECT, cell: 6.5, maxH: 140, accent: 0, mix: false }),
  ...SITES.map((s) => ({ x: s.x + 3, y: s.y - 4, w: 3.4, d: 4.6, h: 130, mat: "wood" as const })),
];

export const SERVICES = [
  { t: "Arquitectura", p: "Vivienda, equipamientos y rehabilitación, del anteproyecto a la dirección de obra." },
  { t: "Interiorismo", p: "Espacios de trabajo, comercio y casas pensados con la misma regla que el edificio." },
  { t: "Maquetas y visualización", p: "Maquetas físicas y 3D para que cliente, vecinos y ayuntamiento entiendan el proyecto." },
];
