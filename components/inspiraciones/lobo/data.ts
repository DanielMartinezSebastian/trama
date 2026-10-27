import type { ScheduleClass } from "@/components/ui/ClassSchedule";
import type { EnrollmentCohort } from "@/components/ui/EnrollmentFlow";
import type { MembershipPlanOption } from "@/components/ui/MembershipFlow";

/* Datos de Lobo Gym (docs/56): disciplinas, horario, cuotas, eventos y tienda. Datos puros. */

const I = "/img/inspiraciones/lobo/";

export const DISCIPLINAS = [
  { id: "muay-thai", n: "Muay Thai", img: `${I}disciplina-muay-thai.webp`, texto: "El arte de los ocho miembros: puños, codos, rodillas y patadas. Técnica, acondicionamiento y sparring controlado.", para: "Desde el primer día: hay grupo de inicio tres mañanas a la semana." },
  { id: "bjj", n: "BJJ", img: `${I}disciplina-bjj.webp`, texto: "Jiu-jitsu brasileño: control, palancas y estrangulaciones en el suelo. Con kimono y sin él.", para: "Ideal si quieres un deporte de combate sin golpes." },
  { id: "mma", n: "MMA", img: `${I}disciplina-mma.webp`, texto: "Artes marciales mixtas: el golpeo de pie, el derribo y el suelo en la misma clase.", para: "Para quien ya ha probado alguna disciplina y quiere juntarlas." },
  { id: "boxeo", n: "Boxeo", img: `${I}disciplina-boxeo.webp`, texto: "Guardia, desplazamientos, combinaciones y saco. Hay clase en familia los sábados.", para: "Para todas las edades a partir de 12 años." },
  { id: "fitness", n: "Fitness", img: `${I}disciplina-fitness.webp`, texto: "Fuerza y acondicionamiento pensados para luchadores, abiertos a todos.", para: "Complemento perfecto para cualquier disciplina." },
  { id: "recuperacion", n: "Recuperación", img: `${I}disciplina-recuperacion.webp`, texto: "Movilidad, estiramientos y respiración para llegar entero a la siguiente clase.", para: "Para todos, sobre todo después de semanas duras." },
];

export const HORARIO: ScheduleClass[] = [
  { id: "mt-inicio", time: "07:00", name: "Muay Thai inicio", minutes: 60, category: "Muay Thai", level: "Inicio", coach: "Rocío", room: "Tatami 1", capacity: 20, booked: 12, weekdays: [1, 3, 5] },
  { id: "bjj-tecnica", time: "09:30", name: "BJJ técnica", minutes: 75, category: "BJJ", level: "Todos", coach: "Bruno", room: "Tatami 2", capacity: 16, booked: 9, weekdays: [2, 4] },
  { id: "fitness", time: "12:00", name: "Fitness", minutes: 45, category: "Fitness", level: "Todos", coach: "Dani", room: "Sala", capacity: 14, booked: 6, weekdays: [1, 2, 3, 4, 5] },
  { id: "mma", time: "18:00", name: "MMA", minutes: 90, category: "MMA", level: "Intermedio", coach: "Iván", room: "Jaula", capacity: 16, booked: 16, weekdays: [1, 3, 5] },
  { id: "boxeo", time: "19:30", name: "Boxeo", minutes: 60, category: "Boxeo", level: "Todos", coach: "Luciano", room: "Ring", capacity: 20, booked: 15, weekdays: [1, 2, 3, 4, 5] },
  { id: "recuperacion", time: "20:30", name: "Recuperación", minutes: 45, category: "Recuperación", level: "Todos", coach: "Nico", room: "Sala", capacity: 12, booked: 3, weekdays: [2, 4] },
  { id: "open-mat", time: "11:00", name: "Open mat", minutes: 120, category: "BJJ", level: "Avanzado", coach: "Bruno", room: "Tatami 2", capacity: 24, booked: 10, weekdays: [0] },
  { id: "mt-sparring", time: "10:00", name: "Muay Thai sparring", minutes: 90, category: "Muay Thai", level: "Avanzado", coach: "Rocío", room: "Ring", capacity: 20, booked: 8, weekdays: [6, 0] },
  { id: "boxeo-familia", time: "12:00", name: "Boxeo en familia", minutes: 60, category: "Boxeo", level: "Inicio", coach: "Luciano", room: "Ring", capacity: 20, booked: 11, weekdays: [6] },
];

export const CUOTAS: MembershipPlanOption[] = [
  { id: "una", name: "Una disciplina", price: 45, period: "mes", features: ["Todas las clases de una disciplina", "Fitness y recuperación"] },
  { id: "todas", name: "Todas las disciplinas", price: 65, period: "mes", features: ["Más de 140 clases a la semana", "Open mat y sparring"], highlight: true },
  { id: "joven", name: "Joven (hasta 21)", price: 39, period: "mes", features: ["Todas las disciplinas", "Con DNI"] },
];

export type Evento = { id: string; dia: string; titulo: string; texto: string; tono: string; fechas: EnrollmentCohort[] };

export const EVENTOS: Evento[] = [
  { id: "sparring-boxeo", dia: "Sábados", titulo: "Sparring de boxeo con Luciano", texto: "Sparring de boxeo para gente con experiencia. Protecciones obligatorias.", tono: "#4b1fd1", fechas: [{ label: "Este sábado", dates: "11:00 – 13:00", status: "few", seats: 3 }, { label: "Sábado que viene", dates: "11:00 – 13:00", status: "open", seats: 12 }] },
  { id: "sparring-muay-thai", dia: "Domingos", titulo: "Sparring de Muay Thai", texto: "Sparring de Muay Thai para avanzados, por parejas de peso.", tono: "#c7a400", fechas: [{ label: "Este domingo", dates: "10:00 – 11:30", status: "open", seats: 8 }, { label: "Domingo que viene", dates: "10:00 – 11:30", status: "open", seats: 14 }] },
  { id: "open-mat", dia: "Domingos", titulo: "Open mat de BJJ", texto: "Esterilla abierta de grappling y BJJ, también para gente de otros clubes.", tono: "#1747c9", fechas: [{ label: "Este domingo", dates: "11:00 – 13:00", status: "closed" }, { label: "Domingo que viene", dates: "11:00 – 13:00", status: "open", seats: 20 }] },
];

export const TIENDA = [
  { id: "camiseta", title: "Camiseta Lobo", price: 25, image: `${I}tienda-camiseta.webp`, texto: "Algodón grueso, negra, con el lobo del barrio en la espalda." },
  { id: "sudadera", title: "Sudadera Lobo", price: 55, image: `${I}tienda-sudadera.webp`, texto: "Con capucha, para el calentamiento y el camino a casa." },
  { id: "gorra", title: "Gorra Lobo", price: 20, image: `${I}tienda-gorra.webp`, texto: "Negra, bordada, talla única ajustable." },
  { id: "bolsa", title: "Bolsa de deporte", price: 45, image: `${I}tienda-bolsa.webp`, texto: "Cabe todo: guantes, espinilleras, toalla y ropa de cambio." },
];

export const PAGINAS = [
  { path: "clases", titulo: "Clases" },
  ...DISCIPLINAS.map((d) => ({ path: `clases/${d.id}`, titulo: d.n })),
  { path: "prueba", titulo: "Clase de prueba" },
  { path: "eventos", titulo: "Eventos" },
  ...EVENTOS.map((e) => ({ path: `eventos/${e.id}`, titulo: e.titulo })),
  { path: "horario", titulo: "Horario" },
  { path: "cuotas", titulo: "Cuotas" },
  { path: "mi-cuenta", titulo: "Mi cuenta" },
  { path: "tienda", titulo: "Tienda" },
  ...TIENDA.map((t) => ({ path: `tienda/${t.id}`, titulo: t.title })),
  { path: "pedido", titulo: "Pedido" },
  { path: "contacto", titulo: "Contacto" },
];
