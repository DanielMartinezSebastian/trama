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
