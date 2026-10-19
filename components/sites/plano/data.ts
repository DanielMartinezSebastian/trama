/** Plano — web de «Cota», software ficticio que revisa modelos de edificación al guardarlos. Fórmulas: Heron AI (plano técnico),
 * Atlas Motion (relato por pasos sobre un objeto en despiece), Cartier Watches & Wonders (salas y ficha editorial) y Sleep Well
 * Creatives (capítulos numerados, fondo que alterna, grano). Datos puros. */
import type { CameraStop, MapBlock } from "@/lib/map3d/scene";
import { walls } from "@/lib/sites/maqueta";

export const SLUG = "plano";

export const meta = {
  slug: SLUG,
  name: "Plano",
  title: "Plano · revisión de modelos de edificación",
  blurb:
    "Web de producto técnico con la fórmula «plano» y un relato en 3D: la foto del edificio se disuelve en la planta con cotas, la planta se levanta en maqueta, un barrido de luz encuentra las incidencias, el edificio se separa por capas en cuatro pasos (en alambre y sobre fondo oscuro) y la cámara visita cada incidencia como una sala con su ficha editorial. Usa BlueprintFrame, PinnedSection, ExplorableCanvas (despiece, barrido, foco y fondo por parada), ScrubText, FitText, CellGrid, MetaTable, ImageReveal, EdgeTab y GridBackground (grano).",
  accent: "#c43500",
  tag: "producto técnico · relato 3D",
};

/* ---------- maqueta: planta de un pequeño centro de trabajo (en % de un mundo de 1800 × 1100 px) ---------- */
export const MODEL_WORLD = { w: 1800, h: 1100 };
const ASPECT = MODEL_WORLD.h / MODEL_WORLD.w;

/** Muros de la planta: [x1, y1, x2, y2] en %. Los huecos son puertas. */
export const PLAN_WALLS: [number, number, number, number][] = [
  [25, 20, 75, 20],
  [25, 20, 25, 80],
  [75, 20, 75, 80],
  [25, 80, 50, 80],
  [72, 80, 75, 80],
  [48, 20, 48, 48],
  [25, 55, 40, 55],
  [46, 55, 75, 55],
  [62, 62, 62, 80],
  [62, 20, 62, 40],
];

/** Capas del despiece, de abajo arriba: cada paso de la revisión deja sólida la suya */
export const LAYERS = { base: 0, estructura: 1, instalaciones: 2, muros: 3 } as const;

const COLS = [30, 40, 55, 68].flatMap((x) => [{ x, y: 30 }, { x, y: 62 }]);

/** la maqueta del modelo, por capas: base de madera, estructura (pilares, vigas y escalera), instalaciones y muros */
export const MODEL: MapBlock[] = [
  { x: 50, y: 50, w: 56, d: 66, h: 6, mat: "wood", layer: LAYERS.base },
  ...[[14, 26], [16, 44], [13, 70], [86, 30], [88, 58], [84, 78], [40, 90], [60, 92]].map(([x, y]) => ({ x, y, w: 3.4, d: 3.4 / ASPECT, h: 120, shape: "tree" as const, layer: LAYERS.base })),
  // estructura
  ...COLS.map(({ x, y }) => ({ x, y, w: 0.9, d: 0.9 / ASPECT, h: 90, shape: "cylinder" as const, layer: LAYERS.estructura })),
  { x: 49, y: 30, w: 40, d: 1.1 / ASPECT, h: 8, z: 82, layer: LAYERS.estructura },
  { x: 49, y: 62, w: 40, d: 1.1 / ASPECT, h: 8, z: 82, layer: LAYERS.estructura },
  { x: 55, y: 46, w: 0.9, d: 32, h: 8, z: 82, layer: LAYERS.estructura },
  ...Array.from({ length: 7 }, (_, i) => ({ x: 31 + i * 1.1, y: 70, w: 1.1, d: 9, h: 10 + i * 11, mat: (i === 6 ? "accent" : "paper") as MapBlock["mat"], layer: LAYERS.estructura })),
  // instalaciones: el conducto que cruza la viga del eje C, un ramal y el patinillo
  { x: 47, y: 36, w: 38, d: 2.2, h: 10, z: 76, mat: "accent", layer: LAYERS.instalaciones },
  { x: 36, y: 44, w: 1.4, d: 16, h: 8, z: 76, layer: LAYERS.instalaciones },
  { x: 70, y: 26, w: 2.4, d: 2.4 / ASPECT, h: 90, shape: "cylinder", layer: LAYERS.instalaciones },
  { x: 64, y: 31, w: 12, d: 1.6, h: 8, z: 76, layer: LAYERS.instalaciones },
  // muros y fachada de metacrilato
  ...walls(PLAN_WALLS, { h: 90, thick: 0.45, aspect: ASPECT }).map((b) => ({ ...b, layer: LAYERS.muros })),
  ...walls([[50, 80, 72, 80]], { h: 90, thick: 0.3, aspect: ASPECT, mat: "acrylic" }).map((b) => ({ ...b, layer: LAYERS.muros })),
];

export const MODEL_DIMS = [
  { x1: 25, y1: 14, x2: 75, y2: 14, label: "27,00 m" },
  { x1: 20, y1: 20, x2: 20, y2: 80, label: "19,80 m" },
];

/* ---------- incidencias: cada una es un punto de la maqueta, una «sala» del relato y una ficha ---------- */
export type Issue = {
  id: string;
  x: number;
  y: number;
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
    x: 55,
    y: 36,
    title: "Colisión",
    meta: "Instalaciones · planta 1",
    text: "El conducto de ventilación cruza la viga del eje C a 2,62 m.",
    detail: "El conducto principal de ventilación de la planta 1 pasa a 2,62 m del suelo, justo por donde corre la viga del eje C. En el modelo no se tocan por 4 cm de dibujo, pero en obra no cabe el aislamiento del conducto. Cota lo marca al guardar el archivo de instalaciones, no en la reunión de coordinación.",
    rule: "Separación mínima entre instalaciones y estructura: 5 cm",
    element: "Conducto VEN-P1-03 · viga C-2",
    severity: "Alta",
    fix: "Bajar el conducto 12 cm en el tramo del eje C o pasarlo por el hueco previsto en la viga.",
    photo: { topic: "interiores", i: 3, alt: "Espacio de trabajo con techo de instalaciones a la vista" },
  },
  {
    id: "c2",
    x: 36,
    y: 40,
    title: "Altura libre",
    meta: "Normativa · sala A",
    text: "Bajo el falso techo quedan 2,38 m; el mínimo para uso de oficina es 2,50 m.",
    detail: "El falso techo de la sala A se bajó para esconder el ramal de ventilación y la altura libre quedó en 2,38 m. Para uso de oficina el mínimo es 2,50 m. Nadie lo había vuelto a medir desde el cambio de instalaciones: Cota relaciona las dos cosas y avisa en el mismo informe.",
    rule: "Altura libre mínima en uso administrativo: 2,50 m",
    element: "Falso techo FT-A · sala A",
    severity: "Alta",
    fix: "Llevar el ramal por el pasillo y subir el falso techo a 2,55 m.",
    photo: { topic: "interiores", i: 0, alt: "Sala de techo alto con luz natural" },
  },
  {
    id: "c3",
    x: 68,
    y: 70,
    title: "Paso de puerta",
    meta: "Accesibilidad",
    text: "El giro de 1,50 m no cabe delante de la puerta del aseo.",
    detail: "Delante de la puerta del aseo accesible tiene que caber un círculo de 1,50 m libre de obstáculos. El muro que se movió para ganar un almacén deja 1,32 m. Es un error pequeño en planta y caro en obra; Cota lo encuentra porque comprueba los giros, no solo el ancho de las puertas.",
    rule: "Espacio de giro libre de 1,50 m delante de puertas accesibles",
    element: "Puerta P-07 · aseo accesible",
    severity: "Media",
    fix: "Retranquear 20 cm el muro del almacén o cambiar el sentido de apertura.",
    photo: { topic: "arquitectura", i: 3, alt: "Pasillo blanco que lleva a una sala" },
  },
  {
    id: "c4",
    x: 33,
    y: 67,
    title: "Escalera",
    meta: "Cotas · núcleo",
    text: "La huella del último peldaño mide 26 cm: el resto mide 28.",
    detail: "Todas las huellas de la escalera miden 28 cm menos la última, que se quedó en 26 al ajustar el rellano. Una huella distinta es exactamente donde la gente tropieza. Cota revisa las cotas de cada peldaño contra la primera y avisa de la que no cuadra.",
    rule: "Huellas iguales en un mismo tramo de escalera",
    element: "Escalera E-1 · peldaño 7",
    severity: "Baja",
    fix: "Repartir los 2 cm entre las siete huellas o alargar el rellano.",
    photo: { topic: "arquitectura", i: 5, alt: "Ángulos de un edificio contra el cielo" },
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

export const TOUR: CameraStop[] = [
  { x: 50, y: 50, tilt: 0, zoom: 0.92 },
  { x: 50, y: 52, tilt: 46, zoom: 1.08, yaw: -22 },
  { x: 50, y: 50, tilt: 38, zoom: 1.02, yaw: 0, scan: true },
  { x: 50, y: 50, tilt: 64, zoom: 0.78, yaw: 32, explode: 130, focusLayer: LAYERS.muros, bg: DARK },
  { x: 50, y: 50, tilt: 64, zoom: 0.78, yaw: 68, explode: 130, focusLayer: LAYERS.instalaciones, bg: DARK },
  { x: 50, y: 50, tilt: 64, zoom: 0.78, yaw: 104, explode: 130, focusLayer: LAYERS.estructura, bg: DARK },
  { x: 50, y: 50, tilt: 62, zoom: 0.8, yaw: 140, explode: 130, bg: DARK },
  ...ISSUES.map((i, k) => ({ x: at(i.id).x, y: at(i.id).y, tilt: 50, zoom: 1.6, yaw: [24, -28, 34, -40][k], focus: i.id })),
  { x: 50, y: 50, tilt: 0, zoom: 0.92 },
];

/** paradas en las que empieza cada incidencia (para volver a su sala desde la ficha) */
export const ISSUE_STOP = Object.fromEntries(ISSUES.map((i) => [i.id, CHAPTERS.findIndex((c) => c.issue === i.id)]));

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "producto", title: "Producto" },
  ...ISSUES.map((i) => ({ path: `incidencias/${i.id}`, title: `Incidencia: ${i.title}` })),
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
