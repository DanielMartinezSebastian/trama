export const SLUG = "esparta";
export const meta = { slug: SLUG, name: "Esparta", title: "Esparta · barbería de carácter", blurb: "Barbería de barrio con fotografías de corte y barba, navegación lateral, ticket del ritual, carta de servicios y reserva con profesional y agenda persistente.", accent: "#a33322", tag: "barbería · oficio" };
export const ROUTES = [{ path: "", title: "La barbería" }, { path: "servicios", title: "Corte y barba" }, { path: "equipo", title: "Los barberos" }, { path: "reservar", title: "Reservar sillón" }, { path: "mis-citas", title: "Mis citas" }];
export const SERVICES = [
  { id: "corte", name: "Corte de la casa", description: "Tijera o máquina, degradado y acabado. El corte que funciona también al día siguiente.", price: 24, minutes: 45, category: "Corte" },
  { id: "clasico", name: "Clásico a tijera", description: "Secciones, forma y textura. Un clásico trabajado a mano.", price: 29, minutes: 60, category: "Corte" },
  { id: "barba", name: "Barba de carácter", description: "Diseño, contorno a navaja, toalla caliente y aceite de barba.", price: 22, minutes: 45, category: "Barba" },
  { id: "afeitado", name: "Afeitado tradicional", description: "Preparación, espuma, navaja y bálsamo. Como debe hacerse.", price: 26, minutes: 45, category: "Barba" },
  { id: "ritual", name: "El ritual Esparta", description: "Corte de la casa, diseño de barba y toalla caliente. Todo en su sitio.", price: 42, minutes: 90, category: "Ritual" },
  { id: "consulta", name: "Hablemos del corte", description: "Valoramos rostro, crecimiento y mantenimiento antes de decidir.", price: 0, minutes: 20, category: "Ritual" },
];
export const TEAM = [{ name: "Hugo", role: "Tijera y clásicos", initial: "H", services: ["corte", "clasico", "ritual", "consulta"] }, { name: "Bruno", role: "Barba y navaja", initial: "B", services: ["corte", "barba", "afeitado", "ritual", "consulta"] }, { name: "Iván", role: "Degradado y textura", initial: "I", services: ["corte", "clasico", "barba", "ritual", "consulta"] }];
export type Appointment = { id: string; service: string; professional: string; date: string; time: string; name: string };
export const validAppointments = (v: unknown): v is Appointment[] => Array.isArray(v) && v.every(a => a && typeof a.id === "string" && SERVICES.some(s => s.id === a.service) && TEAM.some(p => p.name === a.professional && p.services.includes(a.service)) && /^\d{4}-\d{2}-\d{2}$/.test(a.date) && /^\d{2}:\d{2}$/.test(a.time) && typeof a.name === "string");
export const PORTRAIT = "/img/esparta/corte.webp";
export const VINTAGE = PORTRAIT;
