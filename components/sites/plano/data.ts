/** Plano — web de «Cota», software ficticio que revisa modelos de edificación al guardarlos. Fórmulas: Heron AI (plano técnico),
 * Atlas Motion (relato por pasos sobre un objeto en despiece), Cartier Watches & Wonders (salas y ficha editorial) y Sleep Well
 * Creatives (capítulos numerados, fondo que alterna, grano) en la página «Recorrido». Datos puros. */
import type { CameraStop, MapModel } from "@/lib/map3d/scene";

export const SLUG = "plano";

export const meta = {
  slug: SLUG,
  name: "Plano",
  title: "Plano · revisión de modelos de edificación",
  blurb:
    "Web de producto técnico con la fórmula «plano»: marco de línea fina con regla de marcas y cruces de registro, navegación en celdas, etiquetas mono en mayúsculas, titulares gruesos y apretados, rejillas de celdas con divisores discontinuos, un único acento naranja sobre blanco y negro y la maqueta 3D de un edificio real (la clínica de muestra de buildingSMART, convertida de IFC) con cuatro incidencias medidas en su modelo. En «Recorrido», un relato 3D: la foto se disuelve en la planta, un barrido de luz encuentra las incidencias, el edificio se separa por capas en cuatro pasos y la cámara visita cada incidencia como una sala con su ficha. Usa BlueprintFrame, CellGrid, EdgeTab, MetaTable, ExplorableCanvas (despiece, barrido, foco y fondo por parada), PinnedSection, ScrubText, FitText, ImageReveal y GridBackground (grano).",
  accent: "#c43500",
  tag: "producto técnico · relato 3D",
};

/* ---------- maqueta: un edificio real, la clínica de muestra de buildingSMART (en % de un mundo de 1800 × 1100 px) ---------- */
/**
 * «Medical-Dental Clinic»: una clínica real de dos plantas (datos anonimizados) que buildingSMART publica en IFC con sus
 * modelos de arquitectura, estructura y climatización, con licencia CC BY 4.0. `scripts/maqueta/ifc_to_glb.py` lo pasa a
 * un GLB por capas y a la planta baja en SVG (`public/models/clinica/`). Las cuatro incidencias están medidas en esos
 * IFC: los elementos, las cotas y los nombres son los del modelo.
 */
export const MODEL_WORLD = { w: 1800, h: 1100 };
/** px del mundo por metro */
const PX_M = 11;
/** centro de la planta en coordenadas del IFC (m) y lo que se sube la maqueta para que la solera apoye en el tablero */
const IFC_CENTER = { x: -24.818, y: 23.836 };
const LIFT = 0.16;

/** capas del despiece, de abajo arriba (`extras.layer` de cada nodo del GLB) */
export const LAYERS = { base: 0, estructura: 1, instalaciones: 2, muros: 3, cubierta: 4 } as const;

export const MODEL: MapModel = {
  src: "/models/clinica/modelo.glb",
  scale: PX_M,
  plan: { src: "/models/clinica/plan.svg", w: 69.95, h: 58.97 },
};
/** la misma maqueta sin la cubierta, para ver las salas de la planta 1 */
export const MODEL_OPEN: MapModel = { ...MODEL, hide: [LAYERS.cubierta] };

/** Punto del IFC (m; x al este, y al norte, z cota) → punto del mundo: la planta va girada, con el norte a la derecha */
export function ifcPoint(x: number, y: number, z = 0) {
  return {
    x: 50 + (((y - IFC_CENTER.y) * PX_M) / MODEL_WORLD.w) * 100,
    y: 50 + (((x - IFC_CENTER.x) * PX_M) / MODEL_WORLD.h) * 100,
    z: (z + LIFT) * PX_M,
  };
}

// cotas generales del cuerpo principal (sin el porche del sur): 56,90 m de sur a norte y 52,66 m de oeste a este
const SW = ifcPoint(-52.28, -0.38), NE = ifcPoint(0.38, 56.52);
export const MODEL_DIMS = [
  { x1: SW.x, y1: SW.y - 5, x2: NE.x, y2: SW.y - 5, label: "56,90 m" },
  { x1: SW.x - 9, y1: SW.y, x2: SW.x - 9, y2: NE.y, label: "52,66 m" },
];

/* ---------- incidencias: cada una es un punto de la maqueta, una «sala» del relato y una ficha ---------- */
export type Issue = {
  id: string;
  x: number;
  y: number;
  /** altura del punto sobre el tablero (px del mundo) */
  z: number;
  title: string;
  meta: string;
  text: string;
  /** ficha: el párrafo largo, la regla, el elemento y el arreglo */
  detail: string;
  rule: string;
  element: string;
  severity: "Alta" | "Media" | "Baja";
  fix: string;
  photo: { topic: "arquitectura" | "interiores"; i: number; alt: string };
};

export const ISSUES: Issue[] = [
  {
    id: "c1",
    ...ifcPoint(-26.44, 47.21, 4.26),
    title: "Colisión",
    meta: "Instalaciones · techo de planta baja",
    text: "Un conducto de 500 × 350 mm atraviesa tres vigas W460X60 del forjado de planta 1.",
    detail: "El conducto corre 23,4 m por el techo del pasillo de la planta baja entre las cotas 4,09 y 4,44 m. Por esa franja pasan tres vigas W460X60 cuyo canto va de 4,01 a 4,47 m: el conducto queda entero dentro de las tres. En el modelo de climatización no se ve, porque las vigas están en el de estructura; Cota cruza los dos modelos al guardar.",
    rule: "Instalaciones fuera del canto de las vigas, salvo pasos previstos",
    element: "Conducto 500 × 350 (596837) · vigas W460X60 180472, 180750 y 180920",
    severity: "Alta",
    fix: "Bajar el conducto bajo las vigas: con la cara superior a 3,99 m quedan aún 96 cm sobre el falso techo del pasillo (2,68 m).",
    photo: { topic: "interiores", i: 3, alt: "Espacio de trabajo con techo de instalaciones a la vista" },
  },
  {
    id: "c2",
    ...ifcPoint(-44.13, 45.75, 6.78),
    title: "Altura libre",
    meta: "Normativa · laboratorio de prótesis, planta 1",
    text: "Un conducto baja hasta 6,78 m y deja 2,21 m libres en el laboratorio 2C17.",
    detail: "En el laboratorio de prótesis de la planta 1 el falso techo está a 2,68 m del suelo. Un tramo de conducto de 300 × 300 mm baja del plenum hasta la cota 6,78 m y lo atraviesa: debajo quedan 2,21 m. Puede ser la bajada a una campana o un tramo mal colocado: Cota lo marca para que alguien lo decida antes de la obra.",
    rule: "Altura libre mínima en salas de trabajo (regla del estudio): 2,50 m",
    element: "Conducto 300 × 300 (718994) · laboratorio 2C17",
    severity: "Media",
    fix: "Si alimenta una campana, modelarla y darla de alta; si no, subir el tramo al plenum.",
    photo: { topic: "interiores", i: 0, alt: "Sala de techo alto con luz natural" },
  },
  {
    id: "c3",
    ...ifcPoint(-36.95, 53.2, 2.06),
    title: "Escalera",
    meta: "Cotas · escaleras de evacuación",
    text: "26 peldaños para subir 4,57 m: contrahuella de 17,6 cm, y en uso público el máximo es 17,5.",
    detail: "Las tres escaleras de la clínica salvan los 4,57 m entre plantas en dos tramos de 12 y 14 peldaños: cada contrahuella mide 17,58 cm. En un edificio de uso público el Código Técnico pide 17,5 cm como máximo. Son 0,8 mm por peldaño, pero la regla es la que es: Cota divide la altura entre plantas por el número de peldaños de cada tramo y no se fía de la etiqueta del tipo.",
    rule: "Contrahuella de 17,5 cm como máximo en zonas de uso público (CTE DB SUA 1, 4.2.1)",
    element: "Escaleras de los núcleos 1AS1, 1BS2 y 1CS3 · tipo «Concrete Pan»",
    severity: "Baja",
    fix: "Un peldaño más: 27 contrahuellas de 16,9 cm con huella de 28 cm (2C + H = 61,9 cm).",
    photo: { topic: "arquitectura", i: 5, alt: "Ángulos de un edificio contra el cielo" },
  },
  {
    id: "c4",
    ...ifcPoint(-37.19, 31.7, 9.25),
    title: "Nomenclatura",
    meta: "Coordinación · cubierta",
    text: "La planta de cubierta se llama «Roof - Main» en arquitectura y «Roof - Mech» en climatización.",
    detail: "Los tres modelos comparten las plantas, pero no el nombre de la de cubierta: arquitectura y estructura la llaman «Roof - Main» y climatización «Roof - Mech». Al federar los modelos, los equipos del cuarto de máquinas de la cubierta quedan en una planta que no existe para los demás y quedan fuera de cualquier filtro por planta que hagan los demás.",
    rule: "Mismos nombres de planta en todos los modelos de la coordinación",
    element: "Planta «Roof - Mech» (cota 9,25 m) · modelo de climatización",
    severity: "Baja",
    fix: "Renombrar la planta a «Roof - Main» en el modelo de climatización y volver a exportar.",
    photo: { topic: "arquitectura", i: 3, alt: "Pasillo blanco que lleva a una sala" },
  },
];

/* ---------- el relato de la portada: una parada de cámara por capítulo ---------- */
const DARK = "#1d1c1a";

export type Chapter = { kind: "intro" | "save" | "scan" | "step" | "issue" | "report"; n?: string; title: string; text?: string; word?: string; issue?: string };

export const CHAPTERS: Chapter[] = [
  { kind: "intro", title: "Revisa tus modelos mientras los dibujas.", text: "Cota comprueba normativa, colisiones y cotas cada vez que guardas, dentro de tu programa de siempre." },
  { kind: "save", title: "Guardas.", text: "Cada vez que guardas un modelo, alguien tendría que revisarlo entero: las alturas, los pasos, los cruces de instalaciones, cada cota. Nadie tiene esa semana. Por eso los errores llegan a la entrega." },
  { kind: "scan", title: "Cota revisa.", text: "En segundos, cada elemento del modelo pasa por 1.400 reglas. Lo que no cumple se queda marcado en su sitio." },
  { kind: "step", n: "01", word: "Normativa", title: "Normativa", text: "Alturas libres, recorridos de evacuación, accesibilidad y superficies útiles, en cada muro y cada puerta." },
  { kind: "step", n: "02", word: "Colisiones", title: "Colisiones", text: "Conductos, tuberías y bandejas contra vigas y forjados, con la separación que pide tu instalador." },
  { kind: "step", n: "03", word: "Cotas", title: "Cotas", text: "Cotas que faltan, que se repiten o que no cuadran: de los pilares a cada peldaño de la escalera." },
  { kind: "step", n: "04", word: "Nomenclatura", title: "Nomenclatura", text: "Capas, familias y materiales con el nombre que manda tu estudio, para que el modelo se entienda solo." },
  ...ISSUES.map((i) => ({ kind: "issue" as const, issue: i.id, title: i.title, text: i.text })),
  { kind: "report", title: "Informe listo.", text: "Cuatro incidencias, ordenadas por gravedad, cada una con el enlace al elemento. Antes de que cierres el archivo." },
];

const at = (id: string) => ISSUES.find((i) => i.id === id)!;
/** la capa que enseña cada incidencia */
const ISSUE_LAYER: Record<string, number> = { c1: LAYERS.instalaciones, c2: LAYERS.instalaciones, c3: LAYERS.estructura, c4: LAYERS.cubierta };

export const TOUR: CameraStop[] = [
  { x: 50, y: 50, tilt: 0, zoom: 0.92 },
  { x: 50, y: 52, tilt: 46, zoom: 1.08, yaw: -22 },
  { x: 50, y: 50, tilt: 38, zoom: 1.02, yaw: 0, scan: true },
  { x: 50, y: 50, tilt: 64, zoom: 0.6, yaw: 32, explode: 170, focusLayer: LAYERS.muros, bg: DARK },
  { x: 50, y: 50, tilt: 64, zoom: 0.6, yaw: 68, explode: 170, focusLayer: LAYERS.instalaciones, bg: DARK },
  { x: 50, y: 50, tilt: 64, zoom: 0.6, yaw: 104, explode: 170, focusLayer: LAYERS.estructura, bg: DARK },
  { x: 50, y: 50, tilt: 62, zoom: 0.62, yaw: 140, explode: 170, bg: DARK },
  // cada incidencia, con su capa sólida y el resto en alambre: así se ve el conducto dentro del forjado
  ...ISSUES.map((i, k) => ({ x: at(i.id).x, y: at(i.id).y, tilt: 50, zoom: 1.6, yaw: [24, -28, 34, -40][k], focus: i.id, focusLayer: ISSUE_LAYER[i.id] })),
  { x: 50, y: 50, tilt: 0, zoom: 0.92 },
];

/** paradas en las que empieza cada incidencia (para volver a su sala desde la ficha) */
export const ISSUE_STOP = Object.fromEntries(ISSUES.map((i) => [i.id, CHAPTERS.findIndex((c) => c.issue === i.id)]));

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "producto", title: "Producto" },
  { path: "recorrido", title: "Recorrido: así revisa Cota un modelo" },
  ...ISSUES.map((i) => ({ path: `incidencias/${i.id}`, title: `Incidencia: ${i.title}` })),
];

/* ---------- portada ---------- */
export const PROBLEMS = [
  { t: "Cada cambio\nlo haces tú", p: "Revisas a mano cada plano, uno a uno, incluso lo que ya has comprobado cien veces." },
  { t: "La revisión\nllega tarde", p: "Los errores de normativa aparecen en la entrega, cuando corregirlos cuesta una semana." },
  { t: "Nadie vigila\nlas colisiones", p: "Instalaciones y estructura se cruzan en silencio hasta que alguien abre las dos vistas." },
  { t: "Lo pequeño\nse acumula", p: "Las comprobaciones repetitivas se comen la semana que tenías para diseñar." },
];

/* ---------- después del relato ---------- */
export const CLIENTS = ["PINECREST", "VERTEX", "HALDEN & MARSH", "VERDANT", "NORTHBRIDGE"];

/** cifras de la demo (ficticias) */
export const PROOF = [
  { v: "−62 %", k: "incidencias que llegan a la entrega" },
  { v: "9 h", k: "de revisión manual menos por semana y persona" },
  { v: "1.400", k: "reglas comprobadas cada vez que guardas" },
];

export const INTEGRATIONS = [
  { t: "Revit", p: "Complemento que revisa al guardar y señala el elemento en la vista 3D." },
  { t: "Rhino", p: "Panel lateral con la lista de incidencias y el salto a cada una." },
  { t: "ArchiCAD", p: "Revisión por fases del proyecto, con las reglas de tu estudio." },
  { t: "SketchUp", p: "Para anteproyectos: alturas, superficies y accesibilidad desde el primer boceto." },
];

export const SPECS = [
  { k: "Programas", v: "Revit, Rhino, ArchiCAD, SketchUp" },
  { k: "Revisa", v: "Normativa, colisiones, cotas y nomenclatura" },
  { k: "Cuándo", v: "Cada vez que guardas el modelo" },
  { k: "Informe", v: "PDF y lista de incidencias con enlace al elemento" },
  { k: "Alojamiento", v: "En tu red o en la nuestra, tú eliges" },
  { k: "Licencia", v: "Por puesto, mensual o anual" },
];

export const FEATURES = [
  { t: "Normativa", p: "Reglas de accesibilidad, evacuación y superficies, revisadas al guardar." },
  { t: "Colisiones", p: "Cruces entre estructura e instalaciones, con el elemento señalado." },
  { t: "Cotas", p: "Detecta cotas faltantes, duplicadas o fuera de tolerancia." },
  { t: "Nomenclatura", p: "Capas, familias y materiales con el nombre que manda tu estudio." },
  { t: "Informe", p: "Lista de incidencias lista para enviar, ordenada por gravedad." },
  { t: "Historial", p: "Qué se arregló, cuándo y quién lo hizo, por versión del modelo." },
];
