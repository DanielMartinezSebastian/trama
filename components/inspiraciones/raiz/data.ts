import type { BookingService, BookingStaff } from "@/lib/commerce/booking";

/* Datos de Raíz Concept Salon (docs/56): técnicas de extensiones, trabajos y la consulta. Datos puros. */

const I = "/img/inspiraciones/raiz/";

export type Tecnica = { id: string; titulo: string; texto: string; desde: number; dura: string; para: string; pasos: string[]; img: string };

export const TECNICAS: Tecnica[] = [
  { id: "ultrasonido", titulo: "Extensiones por ultrasonido", texto: "Aplicación mechón a mechón con queratina activada por ultrasonido: la solución más duradera para pelo fino.", desde: 115, dura: "4 a 6 meses", para: "Pelo fino o con poca densidad que quiere largo sin peso.", pasos: ["Consulta y elección del tono", "Preparación y secciones", "Aplicación mechón a mechón", "Corte de integración y peinado"], img: `${I}galeria-ondas.webp` },
  { id: "adhesivas", titulo: "Extensiones adhesivas", texto: "Bandas finas e invisibles, aplicación rápida: dura hasta cuatro meses. Ideal para probar volumen y largo.", desde: 115, dura: "hasta 4 meses", para: "Quien quiere probar o necesita un cambio en una mañana.", pasos: ["Consulta", "Limpieza del pelo sin acondicionador", "Colocación de las bandas en sándwich", "Corte y peinado"], img: `${I}galeria-balayage.webp` },
  { id: "cosidas", titulo: "Extensiones cosidas", texto: "Cortinas cosidas a una trenza fina y pegada: sin pegamento ni calor. Volumen pleno y uniforme.", desde: 340, dura: "6 a 8 semanas entre ajustes", para: "Pelo grueso o rizado y quien no quiere calor ni adhesivos.", pasos: ["Consulta", "Trenzado de base", "Cosido de las cortinas", "Integración del color y corte"], img: `${I}despues-2.webp` },
  { id: "infoltimento", titulo: "Infoltimento", texto: "Media cabeza para dar cuerpo donde hace falta, sin cambiar el largo. Perfecto para pelo fino.", desde: 115, dura: "4 a 6 meses", para: "Quien quiere más densidad sin más largo.", pasos: ["Consulta", "Mapa de zonas con menos densidad", "Aplicación selectiva", "Peinado"], img: `${I}galeria-rizo.webp` },
  { id: "color", titulo: "Color y balayage", texto: "Degradado y matiz pensados para fundir extensión y pelo natural en un solo color.", desde: 40, dura: "según el color", para: "Integrar extensiones o renovar el color.", pasos: ["Diagnóstico", "Aplicación a mano alzada", "Matiz conjunto de extensión y pelo", "Baño de brillo"], img: `${I}galeria-estudio.webp` },
];

export const TRABAJOS = [
  { img: `${I}galeria-ondas.webp`, pie: "Largo y ondas suaves", tecnica: "ultrasonido" },
  { img: `${I}galeria-balayage.webp`, pie: "Balayage caramelo difuminado", tecnica: "color" },
  { img: `${I}galeria-rizo.webp`, pie: "El rizo, en la puerta del salón", tecnica: "infoltimento" },
  { img: `${I}despues-1.webp`, pie: "Ondas suaves tras el corte", tecnica: "ultrasonido" },
  { img: `${I}despues-2.webp`, pie: "Cosidas: largo y volumen", tecnica: "cosidas" },
  { img: `${I}despues-3.webp`, pie: "Castaño cobrizo con movimiento", tecnica: "color" },
  { img: `${I}galeria-corte.webp`, pie: "El detalle del corte", tecnica: "adhesivas" },
  { img: `${I}proceso-peinado.webp`, pie: "El peinado final", tecnica: "adhesivas" },
  { img: `${I}proceso-manos.webp`, pie: "Colocando las cortinas", tecnica: "cosidas" },
];

export const SERVICIOS: BookingService[] = [
  { id: "consulta", name: "Consulta de extensiones", minutes: 30, price: 0, description: "Valoramos tu pelo, elegimos método, largo y color. Gratis y sin compromiso." },
  { id: "retirada", name: "Retirada de extensiones", minutes: 60, price: 45, description: "Quitamos extensiones de cualquier método sin romper tu pelo." },
  { id: "mantenimiento", name: "Revisión y mantenimiento", minutes: 90, price: 70, description: "Subir, ajustar y sanear las extensiones que llevas." },
  { id: "color", name: "Color y balayage", minutes: 150, price: 40, from: true, description: "Color pensado para fundir extensión y pelo natural." },
];

export const EQUIPO: BookingStaff[] = [
  { name: "Raquel", role: "Especialista en extensiones", photo: `${I}proceso-sillon.webp` },
  { name: "Andrea", role: "Color y peinado", services: ["consulta", "color", "mantenimiento"] },
];

export const WHATSAPP = (texto = "Hola, me gustaría pedir una consulta de extensiones.") => `https://wa.me/34600000000?text=${encodeURIComponent(texto)}`;

export const PAGINAS = [
  { path: "servicios", titulo: "Servicios" },
  ...TECNICAS.map((t) => ({ path: `servicios/${t.id}`, titulo: t.titulo })),
  { path: "trabajos", titulo: "Trabajos" },
  { path: "consulta", titulo: "Pide tu consulta" },
  { path: "mis-citas", titulo: "Mis citas" },
  { path: "contacto", titulo: "Contacto" },
];
