/** Marea Studio — estudio creativo de ejemplo (patrones de web premiada: preloader, texto cinético, menú a pantalla completa…). Datos puros. */
import type { LookKind } from "@/lib/sites/art";

export const SLUG = "estudio";

export const meta = {
  slug: SLUG,
  name: "Marea Studio",
  title: "Marea Studio · estudio creativo",
  blurb:
    "Web de un estudio creativo con los patrones de las webs premiadas: scroll suave, preloader con contador, titulares que entran por líneas, menú a pantalla completa, cursor con etiqueta, lista de proyectos con vista previa y pie con titular a todo el ancho.",
  accent: "#ff4d1c",
  tag: "estudio · movimiento",
};

export type Project = { slug: string; title: string; meta: string; year: string; art: LookKind; seed: number; lead: string };

export const PROJECTS: Project[] = [
  { slug: "casa-alba", title: "Casa Alba", meta: "Identidad + web", year: "2026", art: "coat", seed: 4, lead: "Una casa rural que quería dejar de parecer un catálogo." },
  { slug: "tinta-y-sal", title: "Tinta y Sal", meta: "Tienda online", year: "2026", art: "arch", seed: 2, lead: "Cerámica hecha a mano con una tienda que se siente como un taller." },
  { slug: "nodo", title: "Nodo", meta: "Producto digital", year: "2025", art: "dress", seed: 6, lead: "Una app de logística que por fin se entiende a la primera." },
  { slug: "faro-studio", title: "Faro", meta: "Web + 3D", year: "2025", art: "fabric", seed: 5, lead: "Un estudio de arquitectura y su obra, girando en pantalla." },
  { slug: "ola", title: "Ola", meta: "Campaña", year: "2024", art: "still", seed: 3, lead: "Lanzamiento de una marca de bebidas con una web de un solo día." },
];

export const SERVICES = [
  { n: "01", name: "Estrategia y marca", text: "Qué eres, a quién le hablas y cómo suena. Antes de dibujar nada." },
  { n: "02", name: "Diseño de producto y web", text: "Sistemas de diseño, prototipos y páginas pensadas para moverse." },
  { n: "03", name: "Desarrollo a medida", text: "Next.js, animación y WebGL cuando aporta. Rápido en un móvil normal." },
  { n: "04", name: "Contenido y movimiento", text: "Textos, fotografía y animación que cuentan lo mismo que la web." },
];

export const PROCESS = [
  { n: "01", name: "Escuchar", text: "Una semana de conversaciones con tu equipo y con tus clientes. Sin prisa y sin presentaciones." },
  { n: "02", name: "Dibujar", text: "Mapas, prototipos y pruebas en papel. Lo feo y rápido primero, lo bonito después." },
  { n: "03", name: "Construir", text: "Diseño y código a la vez, con versiones que puedes tocar cada semana." },
  { n: "04", name: "Medir", text: "Salimos, miramos qué pasa de verdad y ajustamos lo que no funciona." },
  { n: "05", name: "Cuidar", text: "Seguimos contigo. Una web viva se mantiene como un jardín, no como una estatua." },
];

export const FACTS = [
  { v: "12", l: "años" },
  { v: "86", l: "proyectos" },
  { v: "9", l: "personas" },
  { v: "3", l: "premios" },
];

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "proyectos", title: "Proyectos" },
  { path: "estudio", title: "Estudio" },
  { path: "laboratorio", title: "Laboratorio" },
  { path: "contacto", title: "Contacto" },
];
