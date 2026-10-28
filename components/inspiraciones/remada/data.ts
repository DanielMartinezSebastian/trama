import type { CohortProgram } from "@/components/ui/CohortList";
import type { EnrollmentCohort } from "@/components/ui/EnrollmentFlow";

/* Datos de Remada (docs/56): los viajes con su ficha y sus convocatorias, el curso en línea y los vlogs. Datos puros. */

const I = "/img/inspiraciones/remada/";
const href = (path: string) => `/inspiraciones/remada/${path}`;

export type Viaje = CohortProgram & { id: string; precio: number; senal: number; incluye: string[]; dia: string[]; fechas: EnrollmentCohort[] };

export const VIAJES: Viaje[] = [
  { id: "mentawai", title: "Indonesia, islas Mentawai, Playground", levels: ["intermedio", "avanzado"], summary: "Un archipiélago con el que sueña cualquier surfista: aquí entiendes lo que es «la ola perfecta».", image: `${I}viaje-mentawai.webp`, cohorts: [{ label: "diciembre 2026", dates: ["03.12 – 10.12", "10.12 – 17.12", "17.12 – 24.12"] }, { label: "enero 2027", dates: ["14.01 – 21.01", "21.01 – 28.01"] }], status: "open", href: href("viajes/mentawai"), cta: "saber más", precio: 2450, senal: 400, incluye: ["7 noches en casa de surf frente al pico", "barca diaria a los mejores spots", "dos sesiones de agua al día con vídeo", "análisis en grupo cada tarde", "pensión completa"], dia: ["6:00 · primera sesión con la marea", "11:00 · desayuno y análisis de vídeo", "16:00 · segunda sesión", "19:00 · surfskate y cena"], fechas: [{ label: "03.12 – 10.12", dates: "diciembre 2026", status: "few", seats: 2 }, { label: "10.12 – 17.12", dates: "diciembre 2026", status: "open", seats: 6 }, { label: "17.12 – 24.12", dates: "diciembre 2026", status: "closed" }, { label: "14.01 – 21.01", dates: "enero 2027", status: "open", seats: 8 }, { label: "21.01 – 28.01", dates: "enero 2027", status: "open", seats: 8 }] },
  { id: "corea", title: "Corea del Sur (ola artificial)", levels: ["principiante", "intermedio", "avanzado"], summary: "El campo de entrenamiento perfecto: olas idénticas y surfskate para afinar la técnica y progresar rápido.", image: `${I}viaje-corea.webp`, cohorts: [{ label: "mayo 2027", dates: ["20.05 – 30.05"] }, { label: "septiembre 2027", dates: ["20.09 – 01.10"] }], status: "few", href: href("viajes/corea"), cta: "saber más", precio: 2890, senal: 500, incluye: ["10 noches de hotel junto a la piscina de olas", "sesiones de ola artificial por nivel", "surfskate cada día", "vídeo de cada ola", "traslados"], dia: ["8:00 · surfskate de calentamiento", "10:00 · sesión en la piscina de olas", "14:00 · análisis de vídeo", "17:00 · segunda sesión"], fechas: [{ label: "20.05 – 30.05", dates: "mayo 2027", status: "few", seats: 3 }, { label: "20.09 – 01.10", dates: "septiembre 2027", status: "open", seats: 10 }] },
  { id: "hainan", title: "China, Hainan (ola artificial)", levels: ["principiante", "intermedio", "avanzado"], summary: "Tecnología de ola perfecta, entrenamiento de surfskate y comodidad de hotel.", image: `${I}viaje-hainan.webp`, cohorts: [{ label: "noviembre 2026", dates: ["03.11 – 12.11"] }, { label: "febrero 2027", dates: ["22.02 – 03.03"] }], status: "open", href: href("viajes/hainan"), cta: "saber más", precio: 2690, senal: 450, incluye: ["9 noches de hotel con desayuno", "piscina de olas y playa", "surfskate y vídeo", "una excursión"], dia: ["9:00 · piscina de olas", "13:00 · comida y vídeo", "16:00 · playa o surfskate", "20:00 · cena en grupo"], fechas: [{ label: "03.11 – 12.11", dates: "noviembre 2026", status: "open", seats: 7 }, { label: "22.02 – 03.03", dates: "febrero 2027", status: "open", seats: 12 }] },
  { id: "g-land", title: "Indonesia, Java, G-Land", levels: ["intermedio", "avanzado"], summary: "Una casa de campo en un parque nacional, olas amables con poca gente y la comida de siempre.", image: `${I}viaje-gland.webp`, cohorts: [{ label: "2027", dates: [] }], status: "soon", href: href("viajes/g-land"), cta: "saber más", precio: 2300, senal: 400, incluye: ["7 noches en el campamento del parque", "olas largas con poca gente", "vídeo y análisis", "pensión completa"], dia: ["6:30 · sesión de la mañana", "12:00 · comida y siesta", "16:00 · sesión de tarde", "19:00 · análisis"], fechas: [{ label: "fechas de 2027", dates: "por confirmar", status: "soon" }] },
];

export const NUCLEO = [
  { t: "análisis en vídeo de los errores", d: "El vídeo es el espejo de tu surf: ves desde fuera cómo surfeas de verdad. Así se progresa más rápido.", img: `${I}metodo-video.webp` },
  { t: "el método de los pasos pequeños", d: "Convierto lo complejo en sencillo. Partimos cada movimiento en pasos, en tierra y en el agua.", img: `${I}metodo-pasos.webp` },
  { t: "surfskate", d: "Si grabación y estructura ayudan a ver el movimiento, el surfskate es donde se nota, se ensaya y se fija.", img: `${I}metodo-surfskate.webp` },
  { t: "un campamento con todo", d: "Dos sesiones al día, práctica constante y decenas de olas: una semana vale más que meses sueltos en casa.", img: `${I}metodo-campamento.webp` },
];

export const VLOGS = [
  { slug: "mentawai", t: "#vlog islas mentawai", f: "diciembre 17", img: `${I}vlog-mentawai.webp`, texto: "Siete días, catorce sesiones y una ola que no se acababa nunca. El grupo de diciembre en el pico de Playground." },
  { slug: "g-land", t: "#vlog g-land, java", f: "diciembre 24", img: `${I}vlog-gland.webp`, texto: "La casa en la selva, los monos en el tejado y las izquierdas largas de G-Land." },
  { slug: "corea", t: "#vlog corea del sur", f: "enero 03", img: `${I}vlog-corea.webp`, texto: "Cien olas idénticas al día: así se corrige un giro en una semana." },
];

export const PAGINAS = [
  { path: "viajes", titulo: "Calendario de viajes" },
  ...VIAJES.map((v) => ({ path: `viajes/${v.id}`, titulo: v.title })),
  { path: "online", titulo: "Clases en línea" },
  { path: "vlogs", titulo: "Vlogs" },
  { path: "contacto", titulo: "Contacto" },
];
