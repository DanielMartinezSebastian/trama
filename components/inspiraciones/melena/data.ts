import type { BookingPlace, BookingService, BookingStaff } from "@/lib/commerce/booking";
import type { EnrollmentCohort } from "@/components/ui/EnrollmentFlow";

/* Datos de Melena (docs/56): dos salones, la carta, el equipo, la tienda, la academia y el blog. Datos puros. */

const I = "/img/inspiraciones/melena/";

export const SALONES: BookingPlace[] = [
  { id: "gran-via", name: "Gran Vía", address: "Gran Vía 31, Madrid" },
  { id: "arenal", name: "Arenal", address: "Calle del Arenal 9, Madrid" },
];

export const SERVICIOS: BookingService[] = [
  { id: "corte-mujer", name: "Corte y peinado", minutes: 60, price: 42, category: "Corte", description: "Diagnóstico, lavado con ritual, corte y peinado." },
  { id: "corte-hombre", name: "Corte de caballero", minutes: 40, price: 26, category: "Corte", description: "Lavado, corte y acabado." },
  { id: "peinado", name: "Peinado de evento", minutes: 50, price: 38, category: "Peinado", description: "Ondas, recogido suelto o liso pulido." },
  { id: "recogido-novia", name: "Recogido de novia", minutes: 90, price: 120, from: true, category: "Peinado", description: "Con prueba previa incluida." },
  { id: "color-raiz", name: "Color de raíz", minutes: 90, price: 55, category: "Color", description: "Retoque de raíz con baño de brillo." },
  { id: "balayage", name: "Balayage", minutes: 180, price: 145, from: true, category: "Color", description: "Aclarado a mano alzada y matiz." },
  { id: "ritual", name: "Ritual de hidratación", minutes: 45, price: 35, category: "Cuidado", description: "Mascarilla intensiva, masaje y vapor." },
  { id: "keratina", name: "Alisado con keratina", minutes: 150, price: 160, from: true, category: "Cuidado", description: "Pelo liso y sin encrespado durante tres meses." },
];

export const CATEGORIAS = ["Corte", "Peinado", "Color", "Cuidado"];

export const EQUIPO: (BookingStaff & { bio: string })[] = [
  { name: "Inés", role: "Fundadora · color", places: ["gran-via"], bio: "Abrió Melena en 2014. Balayages que crecen sin raya.", services: ["corte-mujer", "color-raiz", "balayage", "ritual"] },
  { name: "Paula", role: "Corte y peinado", places: ["gran-via", "arenal"], bio: "La de los recogidos de novia y los cortes con movimiento.", services: ["corte-mujer", "corte-hombre", "peinado", "recogido-novia", "ritual"] },
  { name: "Nico", role: "Corte y color", places: ["arenal"], bio: "Cortes cortos, color de raíz y todo lo de caballero.", services: ["corte-mujer", "corte-hombre", "color-raiz", "keratina", "ritual"] },
  { name: "Lara", role: "Cuidado y tratamientos", places: ["arenal", "gran-via"], bio: "Keratina, rituales y diagnóstico del cuero cabelludo.", services: ["ritual", "keratina", "peinado"] },
];

export type Producto = { id: string; title: string; price: number; compareAt: number; image: string; meta: string; texto: string };

export const PRODUCTOS: Producto[] = [
  { id: "serum-noche", title: "Sérum de noche reparador", price: 26.5, compareAt: 35.4, image: `${I}producto-serum.webp`, meta: "Ritual de noche · 100 ml", texto: "Aceites de argán y camelia que reparan mientras duermes. Dos gotas en medios y puntas." },
  { id: "laca-flexible", title: "Laca de fijación flexible", price: 21.9, compareAt: 27.4, image: `${I}producto-laca.webp`, meta: "Forma · 200 ml", texto: "Sujeta sin endurecer y se cepilla sin dejar polvo." },
  { id: "balsamo", title: "Bálsamo sin aclarado", price: 18.2, compareAt: 24.3, image: `${I}producto-balsamo.webp`, meta: "Color protegido · tamaño viaje", texto: "Protege el color del sol y del calor del secador." },
  { id: "champu", title: "Champú de expiación", price: 24, compareAt: 32, image: `${I}producto-champu.webp`, meta: "Hidratación · 300 ml", texto: "Limpieza suave para el pelo seco o teñido, sin sulfatos." },
];

export type Curso = { id: string; titulo: string; texto: string; precio: number; senal: number; nivel: string[]; temario: string[]; convocatorias: EnrollmentCohort[] };

export const CURSOS: Curso[] = [
  { id: "cortes-de-salon", titulo: "Cortes de salón actuales: curso de dos días", texto: "Una introducción profesional a las técnicas de corte de las grandes academias.", precio: 290, senal: 60, nivel: ["Estoy empezando", "Ya trabajo en un salón"], temario: ["Secciones y elevaciones", "Corte en seco y en mojado", "Capas, flequillos y desfilado", "Acabado y peinado para la foto"], convocatorias: [{ label: "Noviembre", dates: "16 y 17 nov", status: "few", seats: 3 }, { label: "Enero", dates: "18 y 19 ene", status: "open", seats: 10 }, { label: "Marzo", dates: "15 y 16 mar", status: "soon" }] },
  { id: "color-sin-miedo", titulo: "Color sin miedo: diagnóstico y fórmula", texto: "Tres mañanas para leer el cabello, mezclar y corregir sin sorpresas.", precio: 340, senal: 80, nivel: ["Básico", "Intermedio"], temario: ["Teoría del color aplicada", "Diagnóstico de porosidad y canas", "Fórmulas y correcciones", "Balayage a mano alzada"], convocatorias: [{ label: "Diciembre", dates: "1, 2 y 3 dic", status: "open", seats: 8 }, { label: "Febrero", dates: "9, 10 y 11 feb", status: "open", seats: 12 }] },
  { id: "recogidos-novia", titulo: "Recogidos de novia", texto: "Un taller práctico con modelos reales y kit de horquillas incluido.", precio: 180, senal: 40, nivel: ["Cualquier nivel"], temario: ["Preparación del pelo", "Tres recogidos de base", "Tocados y accesorios", "La prueba con la novia"], convocatorias: [{ label: "Octubre", dates: "26 oct", status: "closed" }, { label: "Abril", dates: "12 abr", status: "open", seats: 6 }] },
];

export type Post = { slug: string; titulo: string; fecha: string; entradilla: string; cuerpo: string[]; img: string };

export const BLOG: Post[] = [
  { slug: "pelo-en-otono", titulo: "Por qué se cae más el pelo en otoño", fecha: "20 oct 2026", img: `${I}producto-serum.webp`, entradilla: "Es normal y pasa cada año. Lo que puedes hacer para que se note menos.", cuerpo: ["En otoño el pelo cambia de ciclo: el que creció en verano se cae para dejar sitio al nuevo. Perder algo más durante unas semanas es normal.", "Masajear el cuero cabelludo al lavar, dormir lo suficiente y no abusar de las coletas tirantes ayuda a que se note menos.", "Si la caída dura más de tres meses o aparecen zonas claras, pídenos un diagnóstico del cuero cabelludo."] },
  { slug: "balayage-que-dure", titulo: "Cómo hacer que tu balayage dure", fecha: "2 oct 2026", img: `${I}producto-balsamo.webp`, entradilla: "Tres hábitos que alargan el color de un balayage hasta la siguiente visita.", cuerpo: ["Lava con agua tibia y un champú sin sulfatos: el agua caliente abre la cutícula y el color se va antes.", "Usa un matizador una vez por semana para que el rubio no amarillee.", "Y protege del sol en verano: el bálsamo sin aclarado de la tienda lleva filtro."] },
  { slug: "flequillo-si-o-no", titulo: "Flequillo: ¿sí o no?", fecha: "15 sep 2026", img: `${I}producto-laca.webp`, entradilla: "Depende de tu remolino más que de tu cara. Lo que miramos antes de cortarlo.", cuerpo: ["El flequillo favorece a casi todas las caras; lo que decide si funciona es el remolino de la frente.", "Antes de cortarlo lo peinamos en seco hacia delante para ver cómo cae de forma natural.", "Si dudas, empieza por uno largo y abierto: se integra en la melena si no te convence."] },
];

export const PAGINAS = [
  { path: "conocenos", titulo: "Conócenos" },
  { path: "precios", titulo: "Precios" },
  { path: "tienda", titulo: "Tienda" },
  ...PRODUCTOS.map((p) => ({ path: `tienda/${p.id}`, titulo: p.title })),
  { path: "pedido", titulo: "Pedido" },
  { path: "academia", titulo: "Academia" },
  ...CURSOS.map((c) => ({ path: `academia/${c.id}`, titulo: c.titulo })),
  { path: "blog", titulo: "Blog" },
  ...BLOG.map((b) => ({ path: `blog/${b.slug}`, titulo: b.titulo })),
  { path: "reservar", titulo: "Reservar" },
  { path: "mis-citas", titulo: "Mis citas" },
];
