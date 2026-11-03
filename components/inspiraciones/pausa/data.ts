import type { BookingService, BookingStaff } from "@/components/ui/BookingFlow";

/* Datos de Pausa (docs/59): clínica de medicina estética inventada en Madrid. Tratamientos, preocupaciones, equipo. Datos puros. */

const I = "/img/inspiraciones/pausa/";

export const FOTOS = {
  portada: `${I}portada.webp`,
  hombre: `${I}hombre.webp`,
  gel: `${I}gel.webp`,
  gota: `${I}gota.webp`,
  agua: `${I}agua.webp`,
  piel: `${I}piel.webp`,
  preocupaciones: `${I}preocupaciones.webp`,
  tratamientos: `${I}tratamientos.webp`,
  labios: `${I}labios.webp`,
  serum: `${I}serum.webp`,
  sala: `${I}sala.webp`,
};

export type Tratamiento = BookingService & { id: string; lema: string; recuperacion: string; resultados: string; sesiones: string; img: string };
export const TRATAMIENTOS: Tratamiento[] = [
  { id: "consulta", name: "Consulta de valoración", category: "Consulta", minutes: 45, price: 60, lema: "Escuchar antes de tratar", description: "Hablamos de lo que te preocupa, revisamos tu piel con luz polarizada y te proponemos un plan por escrito. Si empiezas un tratamiento, se descuenta.", recuperacion: "Ninguna", resultados: "Un plan por escrito", sesiones: "Una", img: FOTOS.sala },
  { id: "toxina", name: "Relajación muscular", category: "Inyectables", minutes: 30, price: 280, from: true, lema: "Suavizar sin congelar", description: "Pequeñas dosis en frente, entrecejo o patas de gallo para que la expresión siga siendo tuya.", recuperacion: "Inmediata", resultados: "A los 10 días; duran de 3 a 4 meses", sesiones: "Una, con revisión a las dos semanas", img: FOTOS.gota },
  { id: "acido", name: "Hidratación profunda", category: "Inyectables", minutes: 45, price: 320, from: true, lema: "Luz desde dentro", description: "Ácido hialurónico no reticulado repartido en microgotas: la piel recupera agua y elasticidad sin cambiar volúmenes.", recuperacion: "24 a 48 horas", resultados: "Progresivos durante un mes", sesiones: "Tres, separadas un mes", img: FOTOS.gel },
  { id: "labios", name: "Labios naturales", category: "Inyectables", minutes: 45, price: 350, lema: "Definir, no inflar", description: "Hidratamos y perfilamos respetando la proporción de tu cara. Si no hace falta, te lo decimos.", recuperacion: "48 horas", resultados: "Inmediatos; duran de 9 a 12 meses", sesiones: "Una", img: FOTOS.labios },
  { id: "peeling", name: "Renovación química", category: "Piel", minutes: 40, price: 140, from: true, lema: "La piel nueva, sin prisas", description: "Ácidos suaves adaptados a tu tipo de piel para unificar el tono, afinar la textura y tratar manchas leves.", recuperacion: "De 3 a 5 días de descamación fina", resultados: "Tras la segunda sesión", sesiones: "Cuatro, separadas tres semanas", img: FOTOS.agua },
  { id: "microagujas", name: "Inducción de colágeno", category: "Piel", minutes: 60, price: 220, lema: "Que la piel haga su trabajo", description: "Microagujas a profundidad controlada con suero de péptidos: marcas de acné, poros y firmeza.", recuperacion: "De 1 a 2 días de rojez", resultados: "A partir del mes", sesiones: "Tres o cuatro", img: FOTOS.serum },
  { id: "laser", name: "Láser de manchas", category: "Láser", minutes: 30, price: 190, from: true, lema: "Un tono, sin sombras", description: "Luz pulsada para manchas solares y rojeces. Solo de octubre a abril, lejos del sol fuerte.", recuperacion: "Las manchas oscurecen y caen en una semana", resultados: "Tras dos o tres sesiones", sesiones: "Dos o tres, separadas un mes", img: FOTOS.piel },
];
export const CATEGORIAS = ["Consulta", "Inyectables", "Piel", "Láser"];

export type Preocupacion = { id: string; n: string; texto: string; tratamientos: string[] };
export const PREOCUPACIONES: Preocupacion[] = [
  { id: "arrugas", n: "Arrugas de expresión", texto: "Las líneas de la frente y los ojos se marcan antes en pieles finas o muy expresivas.", tratamientos: ["toxina", "acido"] },
  { id: "manchas", n: "Manchas y tono desigual", texto: "Sol, hormonas o acné antiguo dejan marcas que se tratan mejor en invierno.", tratamientos: ["laser", "peeling"] },
  { id: "textura", n: "Poros y textura", texto: "Cuando la piel se ve gruesa o con marcas, se puede pedir que fabrique colágeno nuevo.", tratamientos: ["microagujas", "peeling"] },
  { id: "deshidratacion", n: "Piel apagada", texto: "Falta de agua, no de producto: se nota en el brillo y en las líneas finas.", tratamientos: ["acido", "peeling"] },
  { id: "labios", n: "Labios finos o asimétricos", texto: "Con la edad pierden definición; a veces basta con hidratarlos.", tratamientos: ["labios"] },
];

export const EQUIPO: (BookingStaff & { foto: string; bio: string })[] = [
  { name: "Dra. Inés Valcárcel", role: "Directora médica", photo: `${I}doctora.webp`, foto: `${I}doctora.webp`, bio: "Dermatóloga. Doce años en el Hospital de la Princesa antes de abrir Pausa.", services: ["consulta", "toxina", "acido", "labios", "laser"] },
  { name: "Dr. Tomás Ribera", role: "Médico estético", photo: `${I}doctor.webp`, foto: `${I}doctor.webp`, bio: "Medicina estética y anatomía facial. Profesor en el máster de la Complutense.", services: ["consulta", "toxina", "acido", "labios", "microagujas"] },
  { name: "Lucía Montes", role: "Enfermera", photo: `${I}enfermera.webp`, foto: `${I}enfermera.webp`, bio: "Enfermera dermocosmética. Se ocupa de los tratamientos de piel y del seguimiento.", services: ["peeling", "microagujas", "laser"] },
];

export const RAZONES = [
  { t: "Una experiencia sin prisas", d: "Citas largas, una sola persona contigo de principio a fin y una sala que no parece un hospital.", img: FOTOS.agua },
  { t: "Tratamiento a medida", d: "Ningún protocolo cerrado: el plan sale de tu piel, tu calendario y lo que quieres conseguir.", img: FOTOS.gel },
  { t: "Varias técnicas a la vez", d: "Combinamos inyectables, láser y cuidado de la piel cuando suman, no para vender más.", img: FOTOS.gota },
  { t: "El arte de renovar la piel", d: "Preferimos tres sesiones suaves a una agresiva. El resultado dura más y se nota menos.", img: FOTOS.serum },
];

export const HORARIO: [string, string][] = [
  ["Lunes", "10:00 – 19:00"],
  ["Martes", "Cerrado"],
  ["Miércoles a viernes", "10:00 – 19:00"],
  ["Sábado", "10:00 – 14:00"],
];

export const PAGINAS = [
  { path: "tratamientos", titulo: "Tratamientos" },
  ...TRATAMIENTOS.map((t) => ({ path: `tratamientos/${t.id}`, titulo: t.name })),
  { path: "preocupaciones", titulo: "Preocupaciones" },
  { path: "clinica", titulo: "La clínica" },
  { path: "consulta", titulo: "Reservar consulta" },
];
