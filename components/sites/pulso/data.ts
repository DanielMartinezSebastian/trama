/** Pulso — panel de métricas de un SaaS ficticio (facturación y clientes). Datos puros, deterministas. */
export const SLUG = "pulso";

export const meta = {
  slug: SLUG,
  name: "Pulso",
  title: "Pulso · panel de métricas",
  blurb:
    "Panel de un SaaS con los patrones de producto: marco de aplicación con barra lateral plegable, paleta de comandos ⌘K, tarjetas de indicadores con mini gráficas, gráficos de líneas, áreas y barras en SVG, y una tabla de datos con búsqueda, orden, selección y paginación.",
  accent: "#5eead4",
  tag: "dashboard · producto",
};

export const ROUTES = [
  { path: "", title: "Resumen" },
  { path: "clientes", title: "Clientes" },
  { path: "informes", title: "Informes" },
  { path: "ajustes", title: "Ajustes" },
];

export type Customer = { id: string; name: string; company: string; plan: "Starter" | "Pro" | "Business"; mrr: number; status: "Activo" | "En prueba" | "Impago" | "Baja"; last: string };

const NAMES = ["Lucía Ferrer", "Marco Delgado", "Irene Sola", "Pablo Quintana", "Nerea Campos", "Hugo Beltrán", "Alba Rius", "Diego Marín", "Sara Olmos", "Íñigo Vera", "Carla Nieto", "Raúl Ibáñez", "Elena Pastor", "Jorge Lara", "Marta Esteve", "Adrián Toro", "Paula Gil", "Óscar Mora", "Noa Bravo", "Teo Salas", "Ana Cuesta", "Biel Roca", "Mireia Pons", "Leo Sanz"];
const COMPANIES = ["Atlas Logística", "Faro Digital", "Nodo Energía", "Casa Alba", "Tinta y Sal", "Ola Bebidas", "Brisa Viajes", "Mapa Studio", "Ribera Foods", "Cobalto Labs", "Trazo Moda", "Pixel y Prisma"];
const PLANS: Customer["plan"][] = ["Starter", "Pro", "Business"];
const MRR = { Starter: 29, Pro: 99, Business: 349 };
const STATUS: Customer["status"][] = ["Activo", "Activo", "Activo", "En prueba", "Activo", "Impago", "Activo", "Baja"];
const DAYS = ["hoy", "ayer", "hace 2 d", "hace 3 d", "hace 1 sem", "hace 2 sem", "hace 1 mes"];

export const CUSTOMERS: Customer[] = NAMES.map((name, i) => {
  const plan = PLANS[(i * 7 + 1) % 3];
  return { id: `C-${1001 + i}`, name, company: COMPANIES[(i * 5 + 2) % COMPANIES.length], plan, mrr: MRR[plan], status: STATUS[(i * 3 + 2) % STATUS.length], last: DAYS[(i * 5) % DAYS.length] };
});

export const MONTHS = ["Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"];
export const REVENUE = { actual: [38, 41, 40, 44, 47, 51, 50, 55, 58, 61, 66, 71], previo: [29, 31, 32, 33, 35, 36, 38, 39, 41, 42, 44, 46] };
export const SIGNUPS = { altas: [64, 71, 58, 80, 92, 88, 101, 97, 112, 120, 118, 134], bajas: [12, 14, 15, 11, 13, 16, 14, 18, 15, 13, 17, 16] };
export const RETENTION = [94, 93.5, 94.2, 94.8, 95.1, 94.9, 95.6, 96, 95.7, 96.3, 96.8, 97.1];
