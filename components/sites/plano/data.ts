/** Plano — web de «Cota», software ficticio que revisa modelos de edificación al guardarlos. Fórmula: Heron AI (plano técnico). Datos puros. */
export const SLUG = "plano";

export const meta = {
  slug: SLUG,
  name: "Plano",
  title: "Plano · revisión de modelos de edificación",
  blurb:
    "Web de producto técnico con la fórmula «plano»: marco de línea fina con regla de marcas y cruces de registro, navegación en celdas, etiquetas mono en mayúsculas, titulares gruesos y apretados, rejillas de celdas con divisores discontinuos y un único acento naranja. Usa BlueprintFrame, CellGrid, EdgeTab, MetaTable y el tema blueprintTokens.",
  accent: "#c43500",
  tag: "producto técnico · plano",
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "producto", title: "Producto" },
];

export const PROBLEMS = [
  { t: "Cada cambio\nlo haces tú", p: "Revisas a mano cada plano, uno a uno, incluso lo que ya has comprobado cien veces." },
  { t: "La revisión\nllega tarde", p: "Los errores de normativa aparecen en la entrega, cuando corregirlos cuesta una semana." },
  { t: "Nadie vigila\nlas colisiones", p: "Instalaciones y estructura se cruzan en silencio hasta que alguien abre las dos vistas." },
  { t: "Lo pequeño\nse acumula", p: "Las comprobaciones repetitivas se comen la semana que tenías para diseñar." },
];

export const CLIENTS = ["PINECREST", "VERTEX", "HALDEN & MARSH", "VERDANT", "NORTHBRIDGE"];

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

/* ---------- maqueta: planta de un pequeño centro de trabajo (en % de un mundo de 1800 × 1100 px) ---------- */
export const MODEL_WORLD = { w: 1800, h: 1100 };

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

/** Lo que Cota ha encontrado en el modelo: cada incidencia es un punto de la maqueta. */
export const ISSUES = [
  { id: "c1", x: 55, y: 36, title: "Colisión", meta: "Instalaciones · planta 1", text: "El conducto de ventilación cruza la viga del eje C a 2,62 m." },
  { id: "c2", x: 36, y: 40, title: "Altura libre", meta: "Normativa · sala A", text: "Bajo el falso techo quedan 2,38 m; el mínimo para uso de oficina es 2,50 m." },
  { id: "c3", x: 68, y: 70, title: "Paso de puerta", meta: "Accesibilidad", text: "El giro de 1,50 m no cabe delante de la puerta del aseo." },
  { id: "c4", x: 33, y: 67, title: "Escalera", meta: "Cotas · núcleo", text: "La huella del último peldaño mide 26 cm: el resto mide 28." },
];
