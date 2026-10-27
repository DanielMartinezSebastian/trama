import type { ScheduleClass } from "@/components/ui/ClassSchedule";
import type { MembershipPlanOption } from "@/components/ui/MembershipFlow";

/* Datos de Talla Fitness (docs/56): la oferta, el horario de clases y las cuotas. Datos puros. */

const I = "/img/inspiraciones/talla/";

export const OFERTA = [
  { id: "fitness", t: "FITNESS", img: `${I}menu-fitness.webp`, texto: "Sala de 600 m² con maquinaria de fuerza, peso libre y cardio. Entra cuando quieras de 6:00 a 23:00 y pide ayuda a un coach cuando la necesites.", incluye: ["Plan de entrenamiento gratis", "Revisión cada dos meses", "Café gratis después"] },
  { id: "personal", t: "ENTRENAMIENTO PERSONAL", img: `${I}menu-personal.webp`, texto: "Un coach para ti solo, con un plan que cambia contigo. Sesiones de 60 minutos o packs mensuales.", incluye: ["Valoración inicial", "Plan a medida", "Registro de progresos"] },
  { id: "grupo", t: "CLASES EN GRUPO", img: `${I}menu-grupo.webp`, texto: "Fuerza, kettlebells, movilidad y ciclo. Grupos de hasta 14 personas y un coach que corrige.", incluye: ["Todas incluidas en la cuota", "Reserva desde el horario", "Clase de prueba gratis"] },
  { id: "hyrox", t: "HYROX", img: `${I}menu-hyrox.webp`, texto: "Preparación para la carrera HYROX: carrera, trineo, remo y wall balls en grupos pequeños.", incluye: ["Grupos de hasta 8", "Simulacro mensual", "Plan de carrera"] },
];

export const CLASES: ScheduleClass[] = [
  { id: "fuerza", time: "07:00", name: "Fuerza básica", minutes: 50, category: "Clases en grupo", level: "Todos", coach: "Yeray", room: "Sala 1", capacity: 14, booked: 9, weekdays: [1, 3, 5] },
  { id: "kettlebell", time: "13:30", name: "Kettlebells", minutes: 45, category: "Clases en grupo", level: "Intermedio", coach: "Bea", room: "Sala 1", capacity: 14, booked: 14, weekdays: [2, 4] },
  { id: "movilidad", time: "19:00", name: "Movilidad", minutes: 45, category: "Clases en grupo", level: "Todos", coach: "Bea", room: "Sala 2", capacity: 14, booked: 5, weekdays: [1, 2, 3, 4, 5] },
  { id: "ciclo", time: "20:00", name: "Ciclo", minutes: 45, category: "Clases en grupo", level: "Todos", coach: "Yeray", room: "Sala 2", capacity: 20, booked: 12, weekdays: [1, 3, 5] },
  { id: "hyrox-basico", time: "18:00", name: "HYROX básico", minutes: 60, category: "HYROX", level: "Inicio", coach: "Nacho", room: "Pista", capacity: 8, booked: 6, weekdays: [2, 4] },
  { id: "hyrox-simulacro", time: "10:00", name: "Simulacro HYROX", minutes: 75, category: "HYROX", level: "Intenso", coach: "Nacho", room: "Pista", capacity: 8, booked: 3, weekdays: [6] },
];

export const CUOTAS: MembershipPlanOption[] = [
  { id: "individual", name: "Individual", price: 38, period: "mes", features: ["Entrena sin límite", "Clases en grupo", "Planes gratis"], highlight: false },
  { id: "familia", name: "Familia", price: 34, period: "mes por persona", features: ["Lo mismo, con descuento familiar", "Menores gratis si sois cuatro"], highlight: true },
  { id: "estudiante", name: "Estudiante", price: 29, period: "mes", features: ["De 16 a 25 años", "Con carné de estudiante"] },
  { id: "hyrox-basico", name: "HYROX básico", price: 40, period: "mes", features: ["Grupos pequeños", "Simulacro mensual"] },
  { id: "hyrox-premium", name: "HYROX premium", price: 58, period: "mes", features: ["Plan individual", "Sesión mensual de técnica"] },
];

export const PAGINAS = [
  { path: "oferta", titulo: "Oferta" },
  ...OFERTA.map((o) => ({ path: `oferta/${o.id}`, titulo: o.t.toLowerCase() })),
  { path: "horario", titulo: "Horario" },
  { path: "socio", titulo: "Hazte socio" },
  { path: "mi-cuenta", titulo: "Mi cuenta" },
  { path: "contacto", titulo: "Contacto" },
];
