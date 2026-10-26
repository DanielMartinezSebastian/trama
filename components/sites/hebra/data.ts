export const SLUG = "hebra";
export const meta = { slug: SLUG, name: "Hebra", title: "Hebra · un buen día de pelo", blurb: "Salón de corte y color con diagnóstico de estilo, servicios con precio y duración, reserva por profesional, agenda y cambios de cita guardados en el navegador.", accent: "#c7ee73", tag: "peluquería · reservas" };
export const ROUTES = [{ path: "", title: "El salón" }, { path: "servicios", title: "Servicios y precios" }, { path: "equipo", title: "Las manos" }, { path: "reservar", title: "Reservar cita" }, { path: "mis-citas", title: "Mis citas" }];
export const SERVICES = [
  { id: "corte", name: "Corte con intención", description: "Diagnóstico, lavado, corte y acabado. A tu textura, a tu ritmo.", price: 42, minutes: 60, category: "Corte" },
  { id: "rizo", name: "Rizo a rizo", description: "Corte en seco, hidratación y definición. Para ondas y rizos.", price: 58, minutes: 75, category: "Corte" },
  { id: "color", name: "Color en movimiento", description: "Baño de color y acabado. Primera visita con diagnóstico previo.", price: 76, minutes: 90, category: "Color" },
  { id: "luz", name: "Luz a medida", description: "Balayage, matiz, tratamiento y acabado. Presupuesto tras diagnóstico.", price: 125, minutes: 150, category: "Color" },
  { id: "ritual", name: "Pausa para tu pelo", description: "Limpieza, masaje e hidratación con acabado natural.", price: 35, minutes: 45, category: "Cuidado" },
  { id: "consulta", name: "Primero, hablamos", description: "Diagnóstico de color o gran cambio. Sin compromiso.", price: 0, minutes: 20, category: "Cuidado" },
];
export const TEAM = [{ name: "Alba", role: "Corte y textura", initial: "A", services: ["corte", "rizo", "ritual", "consulta"] }, { name: "Vera", role: "Color y luz", initial: "V", services: ["corte", "color", "luz", "ritual", "consulta"] }, { name: "Leo", role: "Forma y acabado", initial: "L", services: ["corte", "rizo", "ritual", "consulta"] }];
export type Appointment = { id: string; service: string; professional: string; date: string; time: string; name: string };
export const validAppointments = (v: unknown): v is Appointment[] => Array.isArray(v) && v.every((a) => a && typeof a.id === "string" && SERVICES.some(s => s.id === a.service) && TEAM.some(p => p.name === a.professional) && /^\d{4}-\d{2}-\d{2}$/.test(a.date) && /^\d{2}:\d{2}$/.test(a.time) && typeof a.name === "string");
export const PORTRAIT = "/img/peluqueria/02-wind-through-her-hair-unsplash.jpg";
export const VINTAGE = "/img/peluqueria/01-vintage-hair-unsplash.jpg";
