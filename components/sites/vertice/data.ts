/** Vértice — grupo industrial ficticio con tres negocios. Fórmula «Corporativo claro» (docs/12): barra de utilidades,
 * megamenú con descripciones, una frase en el hero, cifras con fuente, entrada por sector, filtro en frase (Pentagram),
 * prueba antes que discurso, inversores, prensa, empleo y sostenibilidad. Movimiento nivel 1 (docs/11 §2). Datos puros. */

export const SLUG = "vertice";

export const meta = {
  slug: SLUG,
  name: "Vértice",
  title: "Vértice · grupo industrial",
  blurb:
    "Web corporativa de un grupo industrial con la fórmula «Corporativo claro»: barra de utilidades (inversores, prensa, empleo, proveedores), megamenú con una línea por enlace y buscador, una frase en el hero, cifras con fuente y fecha, entrada por sector, soluciones filtradas con una frase («Fabricamos [qué] para [sector]»), clientes y premios con laureles, inversores con cotización e informes, sala de prensa, empleo y contacto por área. Movimiento mínimo. Usa NavBar (utility, mega, search), FilterBar (sentence), LogoCloud (awards), KpiCard, DataTable, Breadcrumbs, ContactForm, Footer y CookieBanner.",
  accent: "#2a4b8d",
  tag: "corporativo · industria",
};

export type SectorId = "movilidad" | "energia" | "agua";

export const SECTORS: {
  id: SectorId;
  name: string;
  line: string;
  lead: string;
  text: string;
  figures: { v: string; k: string }[];
  photo: { topic: "arquitectura" | "naturaleza" | "ciudad"; i: number; alt: string };
  contact: { name: string; role: string; email: string };
}[] = [
  {
    id: "movilidad",
    name: "Movilidad",
    line: "Estructuras y baterías ligeras para vehículos eléctricos",
    lead: "Piezas de aluminio y carcasas de batería que quitan peso sin quitar seguridad.",
    text: "Diseñamos y fabricamos estructuras de aluminio, carcasas de batería y sistemas de gestión térmica para fabricantes de vehículos eléctricos, autobuses y maquinaria. Ingeniería en Bilbao, fabricación en tres plantas europeas y entregas en secuencia a línea.",
    figures: [
      { v: "11", k: "fabricantes de vehículos clientes" },
      { v: "3", k: "plantas en Europa" },
      { v: "−18 %", k: "peso medio frente a acero" },
    ],
    photo: { topic: "arquitectura", i: 1, alt: "Cúpula de vidrio con estructura en retícula" },
    contact: { name: "Irene Larrañaga", role: "Directora comercial de Movilidad", email: "movilidad@vertice.example" },
  },
  {
    id: "energia",
    name: "Energía",
    line: "Subestaciones compactas y almacenamiento para redes",
    lead: "Equipos que conectan renovables a la red y guardan la energía que sobra.",
    text: "Subestaciones prefabricadas, centros de transformación y contenedores de almacenamiento con baterías para eléctricas, parques solares y eólicos e industria. Llave en mano: ingeniería, fabricación, montaje y mantenimiento durante toda la vida del equipo.",
    figures: [
      { v: "2,4 GW", k: "conectados a la red desde 2015" },
      { v: "640 MWh", k: "de almacenamiento instalado" },
      { v: "24 h", k: "servicio de mantenimiento" },
    ],
    photo: { topic: "naturaleza", i: 4, alt: "Paisaje abierto con cielo amplio" },
    contact: { name: "Andrés Molina", role: "Director comercial de Energía", email: "energia@vertice.example" },
  },
  {
    id: "agua",
    name: "Agua",
    line: "Tratamiento y reutilización de agua para ciudades e industria",
    lead: "Plantas que limpian el agua y la devuelven al uso, con menos energía.",
    text: "Plantas de tratamiento y reutilización para ayuntamientos, consorcios e industria alimentaria y química: diseño, construcción y operación. Telemetría propia para controlar consumos y vertidos desde un solo panel.",
    figures: [
      { v: "180", k: "plantas en operación" },
      { v: "41 hm³", k: "de agua reutilizada al año" },
      { v: "−30 %", k: "energía por metro cúbico desde 2019" },
    ],
    photo: { topic: "naturaleza", i: 0, alt: "Camino entre raíces en un bosque verde" },
    contact: { name: "Marta Echeverría", role: "Directora comercial de Agua", email: "agua@vertice.example" },
  },
];

/** cifras del grupo: cada una con su fuente y fecha (docs/11 B5, docs/12 G7) */
export const GROUP_FIGURES = [
  { v: "1.240 M€", k: "facturación 2025", src: "Informe anual 2025" },
  { v: "4.800", k: "personas en 9 países", src: "Plantilla a 31-12-2025" },
  { v: "62 %", k: "de las ventas, fuera de España", src: "Informe anual 2025" },
  { v: "−41 %", k: "emisiones propias desde 2019", src: "Informe de sostenibilidad 2025, verificado por un tercero" },
];

/* ---------- soluciones: el catálogo que se filtra con una frase ---------- */
export type Kind = "equipos" | "plantas" | "servicios" | "componentes";
export const KINDS: { value: Kind; label: string }[] = [
  { value: "componentes", label: "componentes" },
  { value: "equipos", label: "equipos" },
  { value: "plantas", label: "plantas completas" },
  { value: "servicios", label: "servicios" },
];

export const SOLUTIONS: { id: string; name: string; sector: SectorId; kind: Kind; text: string }[] = [
  { id: "bastidor", name: "Bastidor de aluminio extruido", sector: "movilidad", kind: "componentes", text: "Estructura inferior para furgonetas y autobuses eléctricos." },
  { id: "carcasa", name: "Carcasa de batería", sector: "movilidad", kind: "componentes", text: "Aluminio y composite, con protección frente a impactos y fuego." },
  { id: "termica", name: "Placa de gestión térmica", sector: "movilidad", kind: "componentes", text: "Refrigeración líquida integrada en la carcasa." },
  { id: "linea", name: "Montaje en secuencia a línea", sector: "movilidad", kind: "servicios", text: "Entregamos el módulo montado en el orden de la línea del cliente." },
  { id: "subestacion", name: "Subestación compacta", sector: "energia", kind: "equipos", text: "Prefabricada en fábrica, montada en obra en una semana." },
  { id: "almacenamiento", name: "Contenedor de almacenamiento", sector: "energia", kind: "equipos", text: "Baterías de 4 MWh en un contenedor de 40 pies." },
  { id: "parque", name: "Conexión de parques renovables", sector: "energia", kind: "plantas", text: "Ingeniería y construcción de la conexión a red llave en mano." },
  { id: "mantenimiento", name: "Mantenimiento predictivo", sector: "energia", kind: "servicios", text: "Sensores y visitas programadas para evitar paradas." },
  { id: "edar", name: "Depuradora municipal", sector: "agua", kind: "plantas", text: "De 5.000 a 500.000 habitantes, con fangos aprovechados." },
  { id: "reutilizacion", name: "Planta de reutilización", sector: "agua", kind: "plantas", text: "Agua regenerada para riego y uso industrial." },
  { id: "membranas", name: "Módulos de membrana", sector: "agua", kind: "equipos", text: "Ultrafiltración en bastidores intercambiables." },
  { id: "operacion", name: "Operación y telemetría", sector: "agua", kind: "servicios", text: "Operamos la planta y enseñamos consumos y vertidos en un panel." },
];

/* ---------- prueba: clientes, premios y prensa ---------- */
export const CLIENTS = "Iberdrola Redes, Irizar, Canal del Norte, Volta Trucks, Aguas de Levante, Grupo Solaria, Ayuntamiento de Vitoria";
export const AWARDS = "Premio Nacional de Innovación 2025 | Gran empresa, EU Water Awards 2024 | Reutilización, Red Dot 2025 | Diseño de producto";
export const QUOTE = { text: "Vértice ha pasado de fabricar piezas a resolver redes enteras sin perder su cultura de taller.", source: "Expansión", date: "marzo de 2026" };

/* ---------- inversores ---------- */
export const STOCK = { ticker: "VTX", market: "Bolsa de Madrid · Mercado continuo", price: "18,42 €", delta: "+1,3 %", spark: [16.9, 17.2, 17.0, 17.5, 17.8, 17.6, 18.0, 18.1, 17.9, 18.3, 18.42] };

export const REPORTS = [
  { title: "Informe anual 2025", kind: "Anual", date: "2026-02-26", size: "8,4 MB" },
  { title: "Resultados del tercer trimestre 2026", kind: "Trimestral", date: "2026-10-28", size: "1,2 MB" },
  { title: "Resultados del primer semestre 2026", kind: "Semestral", date: "2026-07-29", size: "2,1 MB" },
  { title: "Informe de sostenibilidad 2025", kind: "Sostenibilidad", date: "2026-03-30", size: "6,7 MB" },
  { title: "Resultados del primer trimestre 2026", kind: "Trimestral", date: "2026-04-29", size: "1,1 MB" },
  { title: "Presentación a inversores · Capital Markets Day", kind: "Presentación", date: "2025-11-18", size: "5,3 MB" },
  { title: "Informe de gobierno corporativo 2025", kind: "Gobierno", date: "2026-02-26", size: "1,9 MB" },
];

export const AGENDA = [
  { date: "28 oct 2026", what: "Resultados del tercer trimestre" },
  { date: "17 nov 2026", what: "Capital Markets Day, Madrid" },
  { date: "25 feb 2027", what: "Resultados anuales 2026" },
  { date: "22 abr 2027", what: "Junta general de accionistas" },
];

/* ---------- prensa ---------- */
export const NEWS = [
  { date: "14 oct 2026", tag: "Energía", title: "Vértice conectará a la red tres parques solares en Aragón", text: "Un contrato de 86 M€ para subestaciones y almacenamiento de 120 MWh." },
  { date: "2 oct 2026", tag: "Agua", title: "La planta de reutilización de Vitoria ya riega 400 hectáreas", text: "El agua regenerada sustituye a la del embalse en los meses de sequía." },
  { date: "19 sep 2026", tag: "Movilidad", title: "Nueva línea de carcasas de batería en la planta de Martorell", text: "Inversión de 42 M€ y 260 empleos para atender a dos fabricantes europeos." },
  { date: "4 sep 2026", tag: "Grupo", title: "Resultados del primer semestre: las ventas crecen un 12 %", text: "La cartera de pedidos alcanza un máximo histórico de 2.900 M€." },
  { date: "22 jul 2026", tag: "Sostenibilidad", title: "Vértice valida sus objetivos climáticos con SBTi", text: "Reducción del 50 % de emisiones propias en 2030 respecto a 2019." },
];

/* ---------- empleo ---------- */
export const JOBS = [
  { id: "j1", title: "Ingeniera/o de diseño mecánico", area: "Movilidad", place: "Bilbao", mode: "Presencial", type: "Indefinido" },
  { id: "j2", title: "Técnica/o de puesta en marcha de subestaciones", area: "Energía", place: "Zaragoza", mode: "Desplazamientos", type: "Indefinido" },
  { id: "j3", title: "Jefa/e de planta de tratamiento", area: "Agua", place: "Valencia", mode: "Presencial", type: "Indefinido" },
  { id: "j4", title: "Analista de datos de telemetría", area: "Agua", place: "Bilbao", mode: "Híbrido", type: "Indefinido" },
  { id: "j5", title: "Comprador/a de materias primas", area: "Grupo", place: "Bilbao", mode: "Híbrido", type: "Indefinido" },
  { id: "j6", title: "Soldador/a de aluminio TIG", area: "Movilidad", place: "Martorell", mode: "Presencial", type: "Indefinido" },
  { id: "j7", title: "Becaria/o de ingeniería eléctrica", area: "Energía", place: "Madrid", mode: "Híbrido", type: "Prácticas" },
  { id: "j8", title: "Responsable de relación con inversores", area: "Grupo", place: "Madrid", mode: "Presencial", type: "Indefinido" },
];

/* ---------- sostenibilidad ---------- */
export const GOALS = [
  { year: "2019", title: "Año base", text: "Medimos por primera vez las emisiones de todas las plantas." },
  { year: "2025", title: "−41 % de emisiones propias", text: "Electricidad renovable en las nueve plantas y flota de servicio eléctrica." },
  { year: "2030", title: "−50 % (objetivo validado por SBTi)", text: "Hornos de aluminio eléctricos y recuperación de calor." },
  { year: "2040", title: "Cero emisiones netas", text: "Incluida la cadena de suministro, con proveedores comprometidos." },
];

/* ---------- contacto por área ---------- */
export const AREAS = [
  { t: "Clientes y ventas", p: "Una persona de cada negocio te responde en dos días laborables.", c: "comercial@vertice.example" },
  { t: "Inversores y accionistas", p: "Relación con inversores, junta y dividendos.", c: "inversores@vertice.example" },
  { t: "Prensa", p: "Gabinete de comunicación, también fuera de horario para urgencias.", c: "prensa@vertice.example · +34 944 000 120" },
  { t: "Proveedores", p: "Alta de proveedores, código de conducta y portal de compras.", c: "compras@vertice.example" },
  { t: "Canal ético", p: "Comunicación confidencial de incumplimientos (Ley 2/2023).", c: "canaletico.vertice.example" },
];

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "sectores", title: "Sectores" },
  ...SECTORS.map((s) => ({ path: `sectores/${s.id}`, title: s.name })),
  { path: "soluciones", title: "Soluciones" },
  { path: "sostenibilidad", title: "Sostenibilidad" },
  { path: "inversores", title: "Inversores" },
  { path: "prensa", title: "Sala de prensa" },
  { path: "empleo", title: "Empleo" },
  { path: "contacto", title: "Contacto" },
];
