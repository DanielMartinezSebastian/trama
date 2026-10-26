export const SLUG = "forja";
export const meta = { slug: SLUG, name: "Forja", title: "Forja · entrena tu siguiente nivel", blurb: "Cuaderno de entrenamiento oscuro: una sesión explicada en tres capítulos 3D, fotografía de grupo, horario, reservas y espera, lista de cuotas y área personal persistente.", accent: "#f16538", tag: "entrenamiento · proceso 3D" };
export const ROUTES = [{ path: "", title: "El club" }, { path: "clases", title: "Horario y reservas" }, { path: "planes", title: "Planes" }, { path: "club", title: "Espacio y equipo" }, { path: "mi-ritmo", title: "Mi ritmo" }];
export const CLASSES = [
  { id: "base", name: "Base camp", category: "Fuerza", level: "Inicio", coach: "Inés", time: "07:30", minutes: 50, capacity: 12, booked: 8, room: "Sala 01", description: "Aprende sentadilla, bisagra y empuje. Vamos contigo desde la primera repetición." },
  { id: "flow", name: "Mobility lab", category: "Movilidad", level: "Todos", coach: "Nico", time: "09:00", minutes: 45, capacity: 10, booked: 5, room: "Sala 02", description: "Respiración y movilidad para moverte con más libertad." },
  { id: "engine", name: "Engine room", category: "Cardio", level: "Intermedio", coach: "Dani", time: "13:30", minutes: 45, capacity: 12, booked: 12, room: "Sala 01", description: "Intervalos en remo y bicicleta. Un bloque de energía para tu día." },
  { id: "strong", name: "Heavy club", category: "Fuerza", level: "Intermedio", coach: "Inés", time: "18:00", minutes: 55, capacity: 12, booked: 11, room: "Sala 01", description: "Fuerza con progresión y técnica, en un grupo que te acompaña." },
  { id: "reset", name: "Recovery", category: "Movilidad", level: "Inicio", coach: "Nico", time: "19:00", minutes: 40, capacity: 10, booked: 7, room: "Sala 02", description: "Una sesión tranquila para cerrar el día. Todos los movimientos se adaptan." },
];
export type Booking = { key: string; classId: string; date: string; waitlist: boolean };
export type Member = { plan: string; bookings: Booking[]; goal: string };
export const INITIAL: Member = { plan: "", bookings: [], goal: "Crear un hábito" };
export const validMember = (v: unknown): v is Member => {
  if (!v || typeof v !== "object") return false;
  const a = v as Member;
  return ["", "Esencial", "Club", "Libre"].includes(a.plan) && ["Crear un hábito", "Ganar fuerza", "Moverme mejor"].includes(a.goal) && Array.isArray(a.bookings) && a.bookings.every(b => b && CLASSES.some(c => c.id === b.classId) && typeof b.key === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.date) && typeof b.waitlist === "boolean");
};
export const GYM = "/img/forja/grupo.webp";
export const TRAINING = "/img/forja/recovery.webp";

/** Weekends use the club's shorter opening hours; no hidden evening sessions. */
export function sessionsOn(date: string) {
  const day = new Date(`${date}T12:00:00`).getDay();
  return CLASSES.filter(c => {
    const start = Number(c.time.slice(0,2)) * 60 + Number(c.time.slice(3));
    const open = day === 0 ? 540 : day === 6 ? 480 : 390;
    const close = day === 0 ? 780 : day === 6 ? 900 : 1320;
    return start >= open && start + c.minutes <= close;
  });
}
