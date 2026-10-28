import type { ScheduleClass } from "@/components/ui/ClassSchedule";
import type { MembershipPlanOption } from "@/components/ui/MembershipFlow";
import type { BookingService, BookingStaff } from "@/lib/commerce/booking";

/* Datos de Núcleo, estudio de pilates (docs/56): clases, bonos, sesiones privadas e instructoras. Datos puros. */

const I = "/img/inspiraciones/nucleo/";

export const CLASES: ScheduleClass[] = [
  { id: "reformer-manana", time: "08:00", name: "Reformer", minutes: 50, category: "Reformer", level: "Todos", coach: "Inés", room: "Estudio 1", capacity: 3, booked: 2, weekdays: [1, 2, 3, 4, 5] },
  { id: "silla", time: "09:30", name: "Silla de estabilidad", minutes: 50, category: "Silla", level: "Intermedio", coach: "Nico", room: "Estudio 2", capacity: 3, booked: 3, weekdays: [1, 3, 5] },
  { id: "torre-barril", time: "12:00", name: "Torre y barril", minutes: 50, category: "Torre", level: "Todos", coach: "Inés", room: "Estudio 1", capacity: 3, booked: 1, weekdays: [2, 4] },
  { id: "reformer-tarde", time: "18:30", name: "Reformer al atardecer", minutes: 50, category: "Reformer", level: "Inicio", coach: "Dani", room: "Estudio 1", capacity: 3, booked: 2, weekdays: [1, 2, 3, 4, 5] },
  { id: "eleccion", time: "10:00", name: "A elección de Núcleo", minutes: 55, category: "Reformer", level: "Todos", coach: "Nico", room: "Estudio 2", capacity: 3, booked: 0, weekdays: [6, 0] },
];

export const BONOS: MembershipPlanOption[] = [
  { id: "bono-4", name: "Bono 4", price: 120, period: "mes", features: ["4 clases semiprivadas", "Caducan a los 35 días"] },
  { id: "bono-8", name: "Bono 8", price: 210, period: "mes", features: ["8 clases semiprivadas", "Una sesión de valoración"], highlight: true },
  { id: "ilimitado", name: "Ilimitado", price: 290, period: "mes", features: ["Clases sin límite según plazas", "Toallas y agua"] },
];

export const PRIVADAS: BookingService[] = [
  { id: "privada", name: "Sesión privada", minutes: 55, price: 75, description: "Uno a uno, con tus objetivos y necesidades." },
  { id: "pareja", name: "Sesión en pareja", minutes: 55, price: 100, description: "Para dos, con indicaciones personales para cada una." },
  { id: "trio", name: "Sesión en trío", minutes: 55, price: 120, description: "Para tres amigas o un equipo pequeño." },
  { id: "valoracion", name: "Valoración inicial", minutes: 30, price: 0, description: "Postura, historial y objetivos antes de empezar. Gratis." },
];

export const INSTRUCTORAS: (BookingStaff & { bio: string })[] = [
  { name: "Inés", role: "Fundadora · reformer y torre", photo: `${I}coach-ines.webp`, bio: "Certificada en pilates clásico y contemporáneo. Abrió Núcleo en 2019." },
  { name: "Nico", role: "Silla y movilidad", photo: `${I}coach-nico.webp`, bio: "Viene de la danza: control, respiración y mucha precisión." },
  { name: "Dani", role: "Iniciación y posparto", photo: `${I}coach-dani.webp`, bio: "Clases de inicio y recuperación posparto, con paciencia infinita." },
];

export const PAGINAS = [
  { path: "estudio", titulo: "El estudio" },
  { path: "clases", titulo: "Clases" },
  { path: "bonos", titulo: "Bonos" },
  { path: "privadas", titulo: "Sesiones privadas" },
  { path: "mi-cuenta", titulo: "Mi cuenta" },
  { path: "contacto", titulo: "Contacto" },
];
