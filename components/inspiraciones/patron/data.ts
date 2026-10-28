import type { BookingService, BookingStaff } from "@/lib/commerce/booking";

/* Datos de Patrón Barber & Groom (docs/56): servicios por sala, el equipo, la tienda y las noticias. Datos puros. */

const I = "/img/inspiraciones/patron/";

export const SALAS = [
  { id: "barberia", nombre: "Barbería", img: `${I}servicio-afeitado.webp`, texto: "Los mejores servicios de corte y afeitado en el centro de Madrid." },
  { id: "spa", nombre: "Cuidado y spa", img: `${I}servicio-spa.webp`, texto: "Depilación y tratamientos para cara y cuerpo, pensados para la piel del hombre." },
  { id: "manos", nombre: "Manos y pies", img: `${I}servicio-manicura.webp`, texto: "Tratamientos de lujo para él en una sala propia." },
];

export const SERVICIOS: (BookingService & { sala: string })[] = [
  { id: "corte", sala: "barberia", name: "Corte clásico", minutes: 45, price: 38, description: "Consulta, lavado, corte a tijera y peinado con producto." },
  { id: "corte-barba", sala: "barberia", name: "Corte y barba", minutes: 70, price: 58, description: "El corte con arreglo de barba, toalla caliente y aceite." },
  { id: "afeitado", sala: "barberia", name: "Afeitado de navaja", minutes: 45, price: 35, description: "Tres toallas calientes, navaja y bálsamo de la casa." },
  { id: "barba", sala: "barberia", name: "Arreglo de barba", minutes: 30, price: 25, description: "Perfilado, recorte y tratamiento." },
  { id: "facial", sala: "spa", name: "Facial del caballero", minutes: 50, price: 55, description: "Limpieza profunda, exfoliación y mascarilla hidratante." },
  { id: "depilacion", sala: "spa", name: "Depilación de espalda", minutes: 30, price: 32, description: "Con cera tibia y loción calmante." },
  { id: "reflexologia", sala: "spa", name: "Reflexología", minutes: 40, price: 45, description: "Masaje de pies para el estrés y el cansancio." },
  { id: "manicura", sala: "manos", name: "Manicura masculina", minutes: 30, price: 28, description: "Limado, cutículas, hidratación y pulido mate." },
  { id: "pedicura", sala: "manos", name: "Pedicura", minutes: 45, price: 40, description: "Tratamiento completo en sillón con baño de pies." },
];

export const EQUIPO: (BookingStaff & { bio: string })[] = [
  { name: "Julián", role: "Dueño · maestro barbero", photo: `${I}dueno.webp`, bio: "Treinta años de oficio. Aprendió en la barbería de su padre en Chamberí y abrió Patrón en 2009.", services: ["corte", "corte-barba", "afeitado", "barba"] },
  { name: "Álvaro", role: "Barbero · hijo de Julián", photo: `${I}menu-familia.webp`, bio: "La segunda generación: degradados finos y barbas largas.", services: ["corte", "corte-barba", "barba", "afeitado"] },
  { name: "Elena", role: "Esteticista", bio: "Faciales, depilación y reflexología en la sala de cuidado.", services: ["facial", "depilacion", "reflexologia", "manicura", "pedicura"] },
  { name: "Rocío", role: "Manicura y pedicura", bio: "La sala de manos y pies es suya: precisión y conversación.", services: ["manicura", "pedicura", "reflexologia"] },
];

export type Producto = { id: string; marca: string; nombre: string; precio: number; formato: string; texto: string; tono: string };

export const PRODUCTOS: Producto[] = [
  { id: "pomada-mate", marca: "RITUAL", nombre: "Pomada mate", precio: 22, formato: "100 ml", texto: "Fijación media, acabado sin brillo. Se lava con agua.", tono: "#7e929c" },
  { id: "aceite-barba", marca: "REUZA", nombre: "Aceite de barba", precio: 26, formato: "30 ml", texto: "Argán y cedro. Suaviza la barba y calma la piel de debajo.", tono: "#a39d96" },
  { id: "balsamo-afeitado", marca: "PATRÓN", nombre: "Bálsamo para después del afeitado", precio: 24, formato: "75 ml", texto: "Sin alcohol, con aloe y avena. El de la casa.", tono: "#d8c08a" },
  { id: "champu-diario", marca: "label.n", nombre: "Champú de uso diario", precio: 19, formato: "250 ml", texto: "Suave, sin sulfatos, para lavar todos los días.", tono: "#eceae0" },
  { id: "jabon-afeitar", marca: "K · MORA", nombre: "Jabón de afeitar en cuenco", precio: 29, formato: "150 g", texto: "Espuma densa con brocha; cuenco de cerámica reutilizable.", tono: "#757171" },
  { id: "peine-carey", marca: "PATRÓN", nombre: "Peine de bolsillo", precio: 14, formato: "acetato", texto: "Hecho a mano, dientes finos y anchos.", tono: "#2b2b2b" },
];

export type Noticia = { slug: string; cat: string; titulo: string; fecha: string; img: string; cuerpo: string[] };

export const NOTICIAS: Noticia[] = [
  { slug: "reflexologia-estres", cat: "Salud masculina", titulo: "Reflexología para el estrés, la ansiedad y el cansancio", fecha: "25 ene", img: `${I}blog-reflexologia.webp`, cuerpo: ["La reflexología trabaja sobre puntos concretos de los pies que, según la tradición, se corresponden con el resto del cuerpo. Más allá de la teoría, lo que sí está claro es que cuarenta minutos de masaje lento bajan las pulsaciones.", "En la sala de cuidado la combinamos con un baño de pies tibio y aceite de lavanda. Es el servicio que más regalan las parejas por Navidad.", "Si vienes por primera vez, avisa de cualquier lesión o problema de circulación: adaptamos la presión."] },
  { slug: "camisa-blanca", cat: "Moda y estilo", titulo: "Lo básico bien hecho: la camisa blanca", fecha: "16 dic", img: `${I}blog-camisa.webp`, cuerpo: ["Una camisa blanca dice mucho de quien la lleva: el cuello, el largo de la manga y cómo cae sobre los hombros.", "Busca algodón de doble hilo, cuello que se sostenga sin varillas y una manga que asome un centímetro bajo la chaqueta.", "Y plánchala recién lavada, aún húmeda: es el secreto de las camisas que parecen nuevas durante años."] },
  { slug: "accesorios-invierno", cat: "Moda y estilo", titulo: "Los accesorios de este invierno", fecha: "25 oct", img: `${I}blog-accesorios.webp`, cuerpo: ["El invierno es la estación de los accesorios: un reloj con correa de piel, guantes de cabritilla y una bufanda de lana gruesa.", "La regla es la misma que en la barbería: pocos y buenos. Un reloj sencillo dura décadas; una moda, una temporada.", "En la tienda tenemos una selección pequeña de peines, navajas y estuches de viaje que caben en el bolsillo del abrigo."] },
];

export const PAGINAS = [
  { path: "servicios", titulo: "Servicios" },
  { path: "equipo", titulo: "La familia" },
  { path: "tienda", titulo: "Shop in shop" },
  ...PRODUCTOS.map((p) => ({ path: `tienda/${p.id}`, titulo: p.nombre })),
  { path: "pedido", titulo: "Pedido" },
  { path: "noticias", titulo: "Noticias" },
  ...NOTICIAS.map((n) => ({ path: `noticias/${n.slug}`, titulo: n.titulo })),
  { path: "reservar", titulo: "Reservar" },
  { path: "mis-citas", titulo: "Mis citas" },
  { path: "contacto", titulo: "Contacto" },
];
