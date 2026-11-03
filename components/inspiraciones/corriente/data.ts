/* Datos de Nada Corriente (docs/60): promotora inmobiliaria inventada, en Valencia, con cuatro promociones de viviendas.
   Datos puros. */

const I = "/img/inspiraciones/corriente/";

export const FOTOS = {
  salon: `${I}salon.webp`,
  cocina: `${I}cocina.webp`,
  terraza: `${I}terraza.webp`,
  piscina: `${I}piscina.webp`,
  dormitorio: `${I}dormitorio.webp`,
  fachada: `${I}fachada.webp`,
  bano: `${I}bano.webp`,
  jardin: `${I}jardin.webp`,
};

export type Vivienda = { id: string; tipo: string; dorm: number; m2: number; planta: string; precio: number; estado: "Disponible" | "Reservada" | "Vendida" };
export type Promocion = { id: string; n: string; ciudad: string; estado: "En venta" | "Próximamente" | "Entregada"; entrega: string; img: string; galeria: string[]; texto: string; viviendas: Vivienda[] };

const v = (id: string, tipo: string, dorm: number, m2: number, planta: string, precio: number, estado: Vivienda["estado"] = "Disponible"): Vivienda => ({ id, tipo, dorm, m2, planta, precio, estado });

export const PROMOCIONES: Promocion[] = [
  {
    id: "la-solana", n: "La Solana", ciudad: "Godella", estado: "En venta", entrega: "Primavera de 2028", img: FOTOS.fachada, galeria: [FOTOS.salon, FOTOS.piscina, FOTOS.dormitorio],
    texto: "Doce casas pareadas entre pinos, con jardín propio, piscina comunitaria y cubiertas que recogen el agua de lluvia.",
    viviendas: [v("s1", "Pareada", 3, 142, "Baja + 1", 465000), v("s2", "Pareada", 3, 142, "Baja + 1", 469000, "Reservada"), v("s3", "Pareada", 4, 168, "Baja + 1", 528000), v("s4", "Esquina", 4, 181, "Baja + 1", 559000), v("s5", "Pareada", 3, 142, "Baja + 1", 472000, "Vendida"), v("s6", "Esquina", 4, 181, "Baja + 1", 565000)],
  },
  {
    id: "rua", n: "Rúa", ciudad: "Valencia · Russafa", estado: "En venta", entrega: "Otoño de 2027", img: FOTOS.cocina, galeria: [FOTOS.cocina, FOTOS.bano, FOTOS.salon],
    texto: "Una manzana del ensanche rehabilitada: veintiún pisos con techos altos, suelos hidráulicos recuperados y patio de luces ajardinado.",
    viviendas: [v("r1", "Piso", 1, 58, "1.º", 219000), v("r2", "Piso", 2, 84, "2.º", 312000), v("r3", "Piso", 2, 86, "3.º", 324000, "Reservada"), v("r4", "Piso", 3, 112, "4.º", 409000), v("r5", "Ático", 2, 96, "5.º", 455000), v("r6", "Piso", 1, 61, "2.º", 228000, "Vendida")],
  },
  {
    id: "juno", n: "Juno", ciudad: "Alboraia", estado: "Próximamente", entrega: "2029", img: FOTOS.terraza, galeria: [FOTOS.terraza, FOTOS.jardin, FOTOS.piscina],
    texto: "Treinta viviendas frente a la huerta, a diez minutos de la playa en bicicleta. Lista de interés abierta.",
    viviendas: [v("j1", "Piso", 2, 88, "1.º", 289000), v("j2", "Piso", 3, 110, "2.º", 352000), v("j3", "Ático", 3, 124, "3.º", 431000)],
  },
  {
    id: "plaza", n: "Plaza", ciudad: "Valencia · El Carmen", estado: "Entregada", entrega: "Entregada en 2025", img: FOTOS.jardin, galeria: [FOTOS.jardin, FOTOS.salon, FOTOS.bano],
    texto: "Nueve pisos en un edificio de 1912 de la plaza del Árbol. Vendidos antes de terminar la obra.",
    viviendas: [v("p1", "Piso", 2, 79, "1.º", 298000, "Vendida"), v("p2", "Piso", 3, 104, "2.º", 371000, "Vendida")],
  },
];

export const PAGINAS = [
  { path: "proyectos", titulo: "Proyectos" },
  { path: "conocenos", titulo: "Conócenos" },
  { path: "contacto", titulo: "Contacto" },
  ...PROMOCIONES.map((p) => ({ path: `proyectos/${p.id}`, titulo: p.n })),
];

export const VALORES = ["Elegancia", "Funcionalidad", "Luz", "Calma", "Material"];
