import type { BookingService, BookingStaff } from "@/lib/commerce/booking";

/* Datos de Nura, pelo y arte (docs/56): servicios, estilistas, las obras de la sala y las páginas. Datos puros. */

const I = "/img/inspiraciones/nura/";

export const SERVICIOS: BookingService[] = [
  { id: "corte", name: "Corte", minutes: 60, price: 48, description: "Consulta, lavado, corte y secado." },
  { id: "corte-corto", name: "Corte corto o pixie", minutes: 45, price: 40, description: "Para pelo por encima de la oreja." },
  { id: "color", name: "Color", minutes: 120, price: 85, from: true, description: "Color completo con baño de brillo." },
  { id: "rubio", name: "Rubio platino", minutes: 210, price: 180, from: true, description: "Decoloración, matiz y tratamiento de enlaces." },
  { id: "extensiones", name: "Extensiones", minutes: 150, price: 220, from: true, description: "Con consulta previa incluida." },
  { id: "secado", name: "Secado y peinado", minutes: 40, price: 30, description: "Para un evento o porque sí." },
];

export const ESTILISTAS: (BookingStaff & { ig: string; bio: string })[] = [
  { name: "Nuria Vidal", role: "Fundadora", ig: "@nuria.nura", photo: `${I}equipo-nuria.webp`, bio: "Fundadora del estudio. Más de diez años en todo tipo de cortes y colores, especialista en estilos personales hechos a la medida de cada clienta." },
  { name: "Vera", role: "Rubios y extensiones", ig: "@veracolors", photo: `${I}equipo-vera.webp`, services: ["color", "rubio", "extensiones", "secado"], bio: "Diez años en el oficio. Conocida por su precisión con los rubios, las extensiones y los secados que te dejan imparable." },
  { name: "Leo", role: "Corte y tendencias", ig: "@leo_cuts", photo: `${I}equipo-leo.webp`, services: ["corte", "corte-corto", "color", "secado"], bio: "Cortes atrevidos y de moda o clásicos que no pasan. Ideal si buscas un cambio grande o algo que dure." },
];

export type Obra = { slug: string; titulo: string; tecnica: string; pieza: "mesh" | "ribbon" | "beams"; tonos: [string, string, string]; medida: string; precio: number; texto: string; vendida?: boolean };

export const ARTISTA = { nombre: "Clara Ibarra", bio: "Pintora digital de Madrid. Trabaja con campos de color que se mueven despacio, como luz de tarde sobre una pared. Esta es su primera exposición en Nura." };

export const OBRAS: Obra[] = [
  { slug: "siesta-en-el-desierto", titulo: "Siesta en el desierto", tecnica: "campo de degradado", pieza: "mesh", tonos: ["#ffb800", "#ff3b1f", "#1c2bd9"], medida: "edición digital 1/10 · pantalla de 55″", precio: 650, texto: "El calor de las tres de la tarde, cuando nada se mueve salvo el aire." },
  { slug: "cactus-azul", titulo: "Cactus azul", tecnica: "campo de degradado", pieza: "ribbon", tonos: ["#2a4dff", "#ff6a00", "#ffd400"], medida: "edición digital 2/10 · pantalla de 43″", precio: 520, texto: "Una forma que se dobla sobre sí misma, como una planta que busca sombra.", vendida: true },
  { slug: "nudo-de-verano", titulo: "Nudo de verano", tecnica: "haces de luz", pieza: "beams", tonos: ["#ff2d6f", "#ffe600", "#1a1a6e"], medida: "edición digital 1/5 · proyección", precio: 900, texto: "Haces que se cruzan y se deshacen: un verano entero en un minuto." },
  { slug: "colinas", titulo: "Colinas", tecnica: "campo de degradado", pieza: "beams", tonos: ["#2fbf4a", "#ffcc00", "#e2462b"], medida: "edición digital 3/10 · pantalla de 55″", precio: 650, texto: "El paisaje de la infancia de la artista, sin un solo árbol dibujado." },
  { slug: "anillos-de-sol", titulo: "Anillos de sol", tecnica: "cinta", pieza: "ribbon", tonos: ["#ff7a00", "#00a3ff", "#2b0f4c"], medida: "edición digital 1/10 · pantalla de 32″", precio: 420, texto: "Una cinta de luz que da vueltas como un anillo de humo." },
  { slug: "mediodia", titulo: "Mediodía", tecnica: "campo de degradado", pieza: "mesh", tonos: ["#00c2a8", "#ff4fa3", "#ffe14d"], medida: "edición digital 4/10 · pantalla de 43″", precio: 520, texto: "Colores a la hora en que la luz no deja sombras." },
];

export const PAGINAS = [
  { path: "pelo", titulo: "Pelo" },
  { path: "arte", titulo: "Arte" },
  ...OBRAS.map((o) => ({ path: `arte/${o.slug}`, titulo: o.titulo })),
  { path: "reservar", titulo: "Reservar" },
  { path: "mis-citas", titulo: "Mis citas" },
  { path: "info", titulo: "Info" },
];
