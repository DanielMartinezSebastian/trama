import type { EnrollmentCohort } from "@/components/ui/EnrollmentFlow";
import type { MembershipPlanOption } from "@/components/ui/MembershipFlow";
import type { BookingService, BookingStaff } from "@/lib/commerce/booking";

/* Datos de Impulso Fitness (docs/56): servicios, equipo, packs, tarifas y el reto. Datos puros. */

const I = "/img/inspiraciones/impulso/";

export type Servicio = { id: string; titulo: string; meta: string; img: string; texto: string; para: string; incluye: string[]; reserva: string };

export const SERVICIOS: Servicio[] = [
  { id: "personal", titulo: "Entrenamiento personal", meta: "Un coach privado en Chamberí solo para ti", img: `${I}servicio-personal.webp`, texto: "Sesiones de 60 minutos en el estudio privado, con un plan que cambia cada cuatro semanas según cómo respondes.", para: "Quien quiere resultados medibles con alguien que corrige cada repetición.", incluye: ["Valoración inicial de fuerza y movilidad", "Plan de cuatro semanas revisado", "Registro de cargas en la app"], reserva: "sesion" },
  { id: "pareja", titulo: "Entrenamiento en pareja", meta: "Coaching a dos: eficaz y motivador", img: `${I}servicio-pareja.webp`, texto: "Dos personas, un coach y un plan para cada una dentro de la misma sesión.", para: "Parejas, amigos o compañeros de trabajo que se animan mutuamente.", incluye: ["Dos planes individuales", "Ejercicios en pareja", "Precio por sesión compartido"], reserva: "duo" },
  { id: "grupo", titulo: "Grupo pequeño", meta: "Grupos de 3 a 5 en una sala privada", img: `${I}servicio-grupo.webp`, texto: "Circuitos de fuerza y acondicionamiento con la atención de un entrenamiento personal.", para: "Quien entrena mejor acompañado sin perder la técnica.", incluye: ["Máximo cinco personas", "Horario fijo semanal", "Seguimiento individual"], reserva: "sesion" },
  { id: "nutricion", titulo: "Nutrición", meta: "Tu plan de comidas a medida", img: `${I}servicio-nutricion.webp`, texto: "Consulta con Cristina, análisis de tus hábitos y un plan de comidas que puedas cumplir.", para: "Quien quiere perder grasa, ganar músculo o comer mejor sin dietas imposibles.", incluye: ["Análisis de composición corporal", "Plan nutricional a medida", "Revisión a las cuatro semanas"], reserva: "nutricion" },
  { id: "distancia", titulo: "Seguimiento a distancia", meta: "Programa y seguimiento en línea", img: `${I}servicio-distancia.webp`, texto: "Tu programa en la app, vídeos de cada ejercicio y una videollamada de revisión cada dos semanas.", para: "Quien viaja o entrena en casa o en otro gimnasio.", incluye: ["Programa personalizado", "Vídeos de técnica", "Revisiones por videollamada"], reserva: "consulta" },
];

export const SESIONES: BookingService[] = [
  { id: "prueba", name: "Sesión de prueba", minutes: 60, price: 0, description: "Objetivos, mediciones y un primer entrenamiento. Gratis." },
  { id: "sesion", name: "Sesión de coach privado", minutes: 60, price: 95, description: "Entrenamiento personal en el estudio." },
  { id: "duo", name: "Duo Training", minutes: 60, price: 120, description: "Para dos personas, precio por sesión." },
  { id: "nutricion", name: "Consulta de nutrición", minutes: 60, price: 90, description: "Análisis y plan nutricional a medida." },
  { id: "consulta", name: "Consulta de seguimiento", minutes: 30, price: 65, description: "Ajuste del plan y revisión de resultados." },
];

export const EQUIPO: (BookingStaff & { bio: string })[] = [
  { name: "Tomás", role: "Coach · ciencias del deporte", photo: `${I}menu-tomas.webp`, services: ["prueba", "sesion", "duo", "consulta"], bio: "Tomás Lluch fundó Impulso en 2018. Grado en Ciencias del Deporte y quince años entrenando a gente que empezaba de cero." },
  { name: "Cristina", role: "Nutricionista", photo: `${I}menu-cristina.webp`, services: ["prueba", "nutricion", "consulta"], bio: "Cristina Bayo, diplomada en Nutrición Deportiva. Planes de comida que se pueden cumplir un martes cualquiera." },
];

export const PACKS: MembershipPlanOption[] = [
  { id: "coach-12", name: "Coach privado · 12 sesiones", price: 1140, period: "pack", features: ["95 € la sesión", "Valoración incluida"] },
  { id: "duo-12", name: "Duo Training · 12 sesiones", price: 1440, period: "pack", features: ["120 € la sesión", "Para dos personas"] },
  { id: "pack-impulso", name: "Pack Impulso", price: 1950, period: "pack", features: ["32 sesiones en 3 meses", "Plan nutricional", "Seguimiento a distancia"], highlight: true },
];

export const RETO: EnrollmentCohort[] = [
  { label: "Reto de otoño", dates: "4 nov – 27 ene", status: "few", seats: 2 },
  { label: "Reto de invierno", dates: "13 ene – 7 abr", status: "open", seats: 8 },
  { label: "Reto de primavera", dates: "abril", status: "soon" },
];

export const PAGINAS = [
  { path: "equipo", titulo: "El equipo" },
  { path: "servicios", titulo: "Servicios" },
  ...SERVICIOS.map((s) => ({ path: `servicios/${s.id}`, titulo: s.titulo })),
  { path: "tarifas", titulo: "Tarifas" },
  { path: "reservar", titulo: "Reservar" },
  { path: "packs", titulo: "Packs" },
  { path: "reto", titulo: "Reto de 12 semanas" },
  { path: "mi-cuenta", titulo: "Mi cuenta" },
  { path: "contacto", titulo: "Contacto" },
];
