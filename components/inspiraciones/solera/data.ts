/* Datos de Solera Arquitectura (docs/59): estudio inventado de arquitectura e interiores con oficinas en Sevilla y Bilbao.
   Datos puros. */

const I = "/img/inspiraciones/solera/";

export const FOTOS = { portada: `${I}portada.webp`, equipo: `${I}equipo.webp`, maqueta: `${I}maqueta.webp` };

export type Sector = { id: string; n: string; lema: string; color: string; tinta: string; img: string; texto: string };
export const SECTORES: Sector[] = [
  { id: "vivienda", n: "Vivienda", lema: "Vivienda asequible y cooperativas", color: "#6e625a", tinta: "#f4efe9", img: `${I}vivienda.webp`, texto: "Vivienda pública, cooperativas y alquiler asequible: plantas que se puedan amueblar de verdad y zonas comunes que se usen." },
  { id: "interiores", n: "Interiores", lema: "Diseño para el día a día", color: "#a65232", tinta: "#fbeee6", img: `${I}interiores.webp`, texto: "Interiores de oficinas, residencias y equipamientos, pensados con quien los va a mantener." },
  { id: "educacion", n: "Educación", lema: "Edificios que enseñan", color: "#c9d6e3", tinta: "#1b2430", img: `${I}educacion.webp`, texto: "Colegios, institutos y campus: aulas flexibles, luz natural y pasillos donde quedarse." },
  { id: "civico", n: "Cívico", lema: "Arquitectura al servicio", color: "#737b6b", tinta: "#f2f3ee", img: `${I}civico.webp`, texto: "Centros de salud, bibliotecas y centros cívicos con presupuestos públicos y vecinos exigentes." },
  { id: "comercial", n: "Comercial", lema: "Lugares para trabajar", color: "#e6b9a0", tinta: "#2b1a12", img: `${I}comercial.webp`, texto: "Oficinas y locales que se adaptan a cómo trabaja cada equipo, no al revés." },
];

export type Proyecto = { id: string; n: string; lugar: string; sector: string; anio: number; m2: string; cliente: string; img: string; texto: string };
export const PROYECTOS: Proyecto[] = [
  { id: "rectorado", n: "Edificio de apoyo académico", lugar: "Universidad de Huelva", sector: "educacion", anio: 2025, m2: "6.200 m²", cliente: "Universidad de Huelva", img: `${I}p-rectorado.webp`, texto: "Tutorías, salas de estudio y servicios al estudiante en un solo edificio, atado al campus por una escalera exterior que se ha convertido en lugar de encuentro." },
  { id: "huerta", n: "Viviendas La Huerta", lugar: "Dos Hermanas, Sevilla", sector: "vivienda", anio: 2024, m2: "84 viviendas", cliente: "EMVISESA", img: `${I}p-huerta.webp`, texto: "Ochenta y cuatro viviendas de alquiler asequible alrededor de un jardín con piscina comunitaria. Ventilación cruzada en todas." },
  { id: "centro-salud", n: "Centro de salud Txurdinaga", lugar: "Bilbao", sector: "civico", anio: 2025, m2: "3.400 m²", cliente: "Osakidetza", img: `${I}p-centro-salud.webp`, texto: "Consultas a fachada, esperas con vistas y un patio interior que da luz a las salas de extracción." },
  { id: "biblioteca", n: "Biblioteca de Triana", lugar: "Sevilla", sector: "civico", anio: 2023, m2: "1.900 m²", cliente: "Ayuntamiento de Sevilla", img: `${I}p-biblioteca.webp`, texto: "Una nave de corral de vecinos convertida en biblioteca: la estructura de madera original se queda a la vista." },
  { id: "cooperativa", n: "Cooperativa Entrepatios", lugar: "Bilbao", sector: "vivienda", anio: 2026, m2: "32 viviendas", cliente: "Cooperativa Entrepatios", img: `${I}p-cooperativa.webp`, texto: "Treinta y dos viviendas en cesión de uso diseñadas con sus futuros vecinos en once talleres." },
  { id: "coworking", n: "Oficinas La Fábrica", lugar: "Sevilla", sector: "comercial", anio: 2024, m2: "2.300 m²", cliente: "Grupo Azahar", img: `${I}p-coworking.webp`, texto: "Una antigua fábrica de cerámica convertida en oficinas compartidas con lucernarios y patios plantados." },
  { id: "residencia", n: "Residencia de mayores Lantegi", lugar: "Getxo", sector: "interiores", anio: 2025, m2: "4.100 m²", cliente: "Diputación de Bizkaia", img: `${I}interiores.webp`, texto: "Interiores en unidades de convivencia de doce personas, con cocina propia y madera en techos y suelos." },
];

export const NOTICIAS = [
  { f: "30 oct 2026", t: "La Biblioteca de Triana, finalista del Premio de Arquitectura Andaluza" },
  { f: "21 oct 2026", t: "Estaremos en el congreso de Edificios Educativos de Valencia" },
  { f: "24 sep 2026", t: "Entregamos las llaves de las 84 viviendas de La Huerta" },
  { f: "12 may 2026", t: "Abrimos convocatoria para dos plazas de arquitecta júnior en Bilbao" },
];

export const PAGINAS = [
  { path: "proyectos", titulo: "Proyectos" },
  ...PROYECTOS.map((p) => ({ path: `proyectos/${p.id}`, titulo: p.n })),
  ...SECTORES.map((s) => ({ path: `sectores/${s.id}`, titulo: s.n })),
  { path: "estudio", titulo: "Estudio" },
  { path: "noticias", titulo: "Noticias" },
  { path: "contacto", titulo: "Contacto" },
];
