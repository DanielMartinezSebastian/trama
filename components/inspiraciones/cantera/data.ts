import type { BriefService } from "@/components/ui/BriefFlow";

/* Datos de Cantera (docs/58): selección de perfiles técnicos: clientes, ofertas, opiniones y equipo inventados. Datos puros. */

export type Oferta = { id: string; puesto: string; empresa: string; area: string; ciudad: string; modo: string; salario: string; texto: string; pides: string[] };
export const OFERTAS: Oferta[] = [
  { id: "ingenieria-sistemas", puesto: "Ingeniería de sistemas de baja latencia", empresa: "Vatio Labs", area: "Ingeniería", ciudad: "Madrid", modo: "Híbrido", salario: "110–150 k€", texto: "Un equipo de nueve personas que escribe el motor de precios de un fondo sistemático.", pides: ["C++ moderno o Rust", "Sistemas operativos", "Cinco años de experiencia"] },
  { id: "investigacion-cuantitativa", puesto: "Investigación cuantitativa", empresa: "Sextante", area: "Cuantitativo", ciudad: "Barcelona", modo: "Presencial", salario: "130–190 k€", texto: "Buscan a alguien que disfrute más de una señal que falla que de una presentación.", pides: ["Doctorado o equivalente", "Python y estadística", "Publicaciones valoradas"] },
  { id: "aprendizaje-automatico", puesto: "Ingeniería de aprendizaje automático", empresa: "Oriel", area: "IA", ciudad: "Londres", modo: "Híbrido", salario: "120–170 k£", texto: "Modelos en producción con clientes de verdad, no un laboratorio con buenas vistas.", pides: ["Entrenar y desplegar modelos", "PyTorch", "Criterio para decir que no"] },
  { id: "datos-plataforma", puesto: "Plataforma de datos", empresa: "Sintonía", area: "Datos", ciudad: "Madrid", modo: "En remoto", salario: "80–105 k€", texto: "Primera persona de plataforma en una empresa de cuarenta. Mucho por construir.", pides: ["SQL sin miedo", "Orquestación", "Ganas de decidir"] },
  { id: "direccion-ingenieria", puesto: "Dirección de ingeniería", empresa: "Faro Pagos", area: "Dirección", ciudad: "Nueva York", modo: "Híbrido", salario: "220–280 k$", texto: "Dirigir a treinta personas en una empresa de pagos que acaba de duplicarse.", pides: ["Equipos de más de veinte", "Experiencia regulada", "Te apetece programar a veces"] },
  { id: "investigacion-ia", puesto: "Investigación en IA aplicada", empresa: "Oriel", area: "IA", ciudad: "Barcelona", modo: "Híbrido", salario: "125–160 k€", texto: "Convertir artículos en producto antes de que dejen de ser noticia.", pides: ["Publicaciones recientes", "Ejecución rápida", "Inglés de trabajo"] },
];

export const AREAS = [...new Set(OFERTAS.map((o) => o.area))];
export const CIUDADES = [...new Set(OFERTAS.map((o) => o.ciudad))];

export const CLIENTES = [
  { n: "Sextante", s: "Fondo cuantitativo", c: "#08225a" },
  { n: "Vatio Labs", s: "Infraestructura", c: "#004b87" },
  { n: "Oriel", s: "Inteligencia artificial", c: "#009aa6" },
  { n: "Faro Pagos", s: "Pagos", c: "#232323" },
  { n: "Sintonía", s: "Datos", c: "#a1ffcb" },
];

export const OPINIONES = [
  { t: "Fue la primera vez que un seleccionador se leyó mi código antes de llamarme.", p: "Ingeniería de software", e: "Fondo cuantitativo" },
  { t: "Me dijeron que no era el puesto para mí y tenían razón. Seis meses después me llamaron para el bueno.", p: "Investigación", e: "Laboratorio de IA" },
  { t: "Nos mandaron tres personas. Contratamos a las tres.", p: "Dirección técnica", e: "Empresa de pagos" },
];

export const EQUIPO = [
  { n: "Jimena Alarcón", c: "Fundadora", d: "Veinte años colocando ingenieros." },
  { n: "Óscar Tejero", c: "Cuantitativo", d: "Fue investigador antes de cambiar de lado." },
  { n: "Lúa Cendón", c: "IA", d: "Conoce a media conferencia por su nombre." },
  { n: "Diego Amat", c: "Dirección", d: "Busca a quien dirige a los demás." },
];

export const SERVICIOS: BriefService[] = [
  { label: "Un puesto", hint: "Búsqueda exclusiva de una persona." },
  { label: "Un equipo", hint: "Varias contrataciones relacionadas." },
  { label: "Dirección", hint: "Puestos de dirección técnica." },
];

export const PAGINAS = [
  { path: "ofertas", titulo: "Ofertas" },
  ...OFERTAS.map((o) => ({ path: `ofertas/${o.id}`, titulo: o.puesto })),
  { path: "empresas", titulo: "Para empresas" },
  { path: "equipo", titulo: "Equipo" },
  { path: "guardadas", titulo: "Guardadas" },
];
