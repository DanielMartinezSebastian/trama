import type { ScheduleClass } from "@/components/ui/ClassSchedule";
import type { MembershipPlanOption } from "@/components/ui/MembershipFlow";

/* Datos de Vive Club (docs/56): clubes, clases por zona, membresías y ventajas. Datos puros. */

const I = "/img/inspiraciones/vive/";

export const CLUBES = [
  { id: "castellana", nombre: "Vive Castellana", dir: "Paseo de la Castellana 120", correo: "castellana@vive.example", x: 22, y: 30, horario: "L-V|06:00-23:00\nS-D|08:00-21:00", zonas: "Sala, estudio exclusivo, spa y piscina" },
  { id: "retiro", nombre: "Vive Retiro", dir: "Calle de Ibiza 12", correo: "retiro@vive.example", x: 48, y: 58, horario: "L-V|06:00-23:00\nS-D|08:00-21:00", zonas: "Sala, clases en grupo y spa" },
  { id: "arganzuela", nombre: "Vive Arganzuela", dir: "Paseo de la Chopera 40", correo: "arganzuela@vive.example", x: 64, y: 26, horario: "L-V|06:30-22:30\nS-D|09:00-20:00", zonas: "Sala y clases en grupo" },
  { id: "pozuelo", nombre: "Vive Pozuelo", dir: "Avenida de Europa 8, Pozuelo", correo: "pozuelo@vive.example", x: 78, y: 70, horario: "L-V|06:00-23:00\nS-D|08:00-21:00", zonas: "Sala, estudio exclusivo, spa y piscina exterior" },
];

export const CLASES: ScheduleClass[] = [
  { id: "trx", time: "07:00", name: "TRX", minutes: 45, category: "Estudio exclusivo", level: "Todos", coach: "Álex", room: "Castellana", capacity: 10, booked: 8, weekdays: [1, 3, 5] },
  { id: "fly-yoga", time: "09:00", name: "Fly-yoga", minutes: 45, category: "Estudio exclusivo", level: "Inicio", coach: "Marta", room: "Pozuelo", capacity: 8, booked: 8, weekdays: [2, 4, 6] },
  { id: "ciclo", time: "19:00", name: "Ciclo", minutes: 45, category: "Estudio exclusivo", level: "Intenso", coach: "Sergio", room: "Retiro", capacity: 20, booked: 14, weekdays: [1, 2, 3, 4, 5] },
  { id: "body-shape", time: "18:00", name: "Body shape", minutes: 45, category: "Clases en grupo", level: "Todos", coach: "Lía", room: "Arganzuela", capacity: 25, booked: 11, weekdays: [1, 3, 5] },
  { id: "pilates", time: "10:00", name: "Pilates", minutes: 45, category: "Clases en grupo", level: "Todos", coach: "Marta", room: "Castellana", capacity: 18, booked: 17, weekdays: [1, 2, 3, 4, 5, 6] },
  { id: "dance-mix", time: "20:00", name: "Dance mix", minutes: 45, category: "Clases en grupo", level: "Todos", coach: "Lía", room: "Retiro", capacity: 25, booked: 6, weekdays: [2, 4] },
  { id: "natacion", time: "08:00", name: "Natación técnica", minutes: 45, category: "Spa", level: "Intermedio", coach: "Sergio", room: "Pozuelo", capacity: 12, booked: 4, weekdays: [0, 6] },
];

export const PLANES: (MembershipPlanOption & { nombre: string; texto: string })[] = [
  { id: "basico", nombre: "[1] Básico", name: "Básico", price: 50, period: "mes", features: ["Sala sin entrenador", "Vestuarios", "Los cuatro clubes"], texto: "Para empezar" },
  { id: "club", nombre: "[2] Club", name: "Club", price: 90, period: "mes", features: ["Sala", "Clases en grupo", "Spa una vez al mes"], texto: "El más elegido" },
  { id: "todo", nombre: "[3] Todo incluido", name: "Todo incluido", price: 120, period: "mes", features: ["Todo lo anterior", "Estudio exclusivo", "Spa sin límite"], texto: "Para ir a por todas", highlight: true },
  { id: "exclusivo", nombre: "[4] Exclusivo", name: "Exclusivo", price: 150, period: "mes", features: ["Todo lo anterior", "4 sesiones de entrenador personal"], texto: "A tu medida" },
];

/** qué zonas incluye cada plan (para reservar clase) */
export const ZONAS_DEL_PLAN: Record<string, string[]> = { basico: [], club: ["Clases en grupo"], todo: ["Clases en grupo", "Estudio exclusivo", "Spa"], exclusivo: ["Clases en grupo", "Estudio exclusivo", "Spa"] };

export const VENTAJAS = [
  { n: "01", titulo: "Agua y toalla cada día", img: `${I}bonus-agua.webp`, giro: -8, texto: "Botella de agua filtrada y toalla limpia en recepción cada vez que vienes. No hace falta traer nada." },
  { n: "02", titulo: "Puntos para los de siempre", img: `${I}bonus-puntos.webp`, giro: 6, texto: "Cada visita suma un punto. Con cincuenta, un mes de spa gratis; con cien, una sesión de entrenador personal." },
  { n: "03", titulo: "Invita a un amigo cada mes", img: `${I}bonus-amigo.webp`, giro: -4, texto: "Un pase de un día al mes para quien quieras. Si se apunta, los dos tenéis un mes al 50 %." },
  { n: "04", titulo: "Cuota a plazos sin intereses", img: `${I}bonus-plazos.webp`, giro: 8, texto: "La anualidad del plan Exclusivo, en doce plazos sin intereses ni comisiones." },
];

export const PAGINAS = [
  { path: "clases", titulo: "Clases" },
  { path: "clubes", titulo: "Clubes" },
  { path: "membresias", titulo: "Membresías" },
  { path: "ventajas", titulo: "Ventajas" },
  { path: "mi-cuenta", titulo: "Mi cuenta" },
];
