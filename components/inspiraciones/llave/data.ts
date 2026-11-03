/* Datos de Llave (docs/60): residencias de estudiantes inventadas en Valencia, Madrid y Salamanca, con habitaciones por
   tipo y precio al mes. Datos puros. */

const I = "/img/inspiraciones/llave/";

export const FOTOS = {
  portada: `${I}portada.webp`,
  habitacion: `${I}habitacion.webp`,
  cocina: `${I}cocina.webp`,
  estudio: `${I}estudio.webp`,
  comun: `${I}comun.webp`,
  cerradura: `${I}cerradura.webp`,
  app: `${I}app.webp`,
  gimnasio: `${I}gimnasio.webp`,
  oferta: `${I}oferta.webp`,
};

export type Habitacion = { id: string; n: string; m2: number; precio: number; texto: string; img: string };
export type Residencia = { id: string; n: string; ciudad: string; color: string; tinta: string; plazas: number; texto: string; habitaciones: Habitacion[] };

const h = (id: string, n: string, m2: number, precio: number, texto: string, img: string): Habitacion => ({ id, n, m2, precio, texto, img });

export const RESIDENCIAS: Residencia[] = [
  { id: "blasco", n: "Llave Blasco", ciudad: "Valencia", color: "#2f5bea", tinta: "#ffffff", plazas: 214, texto: "A cinco minutos andando del campus de Blasco Ibáñez, con azotea y huerto.", habitaciones: [h("individual", "Individual", 14, 590, "Cama de 135, escritorio y baño propio", FOTOS.habitacion), h("estudio", "Estudio", 22, 790, "Con cocina propia y zona de estar", FOTOS.estudio), h("doble", "Doble compartida", 24, 460, "Dos camas, dos escritorios, baño compartido", FOTOS.comun)] },
  { id: "moncloa", n: "Llave Moncloa", ciudad: "Madrid", color: "#ffd31a", tinta: "#111111", plazas: 320, texto: "Junto a Ciudad Universitaria, con sala de estudio abierta 24 horas.", habitaciones: [h("individual", "Individual", 13, 720, "Cama de 135, escritorio y baño propio", FOTOS.habitacion), h("estudio", "Estudio", 20, 940, "Con cocina propia y zona de estar", FOTOS.estudio)] },
  { id: "unamuno", n: "Llave Unamuno", ciudad: "Salamanca", color: "#ff6a1f", tinta: "#111111", plazas: 128, texto: "En el casco histórico, dentro de un convento del siglo XVII rehabilitado.", habitaciones: [h("individual", "Individual", 15, 480, "Cama de 135, escritorio y baño propio", FOTOS.habitacion), h("doble", "Doble compartida", 26, 380, "Dos camas, dos escritorios, baño compartido", FOTOS.comun)] },
];

export const PAGINAS = [
  { path: "residencias", titulo: "Residencias" },
  { path: "vivir", titulo: "Cómo se vive" },
  { path: "reservar", titulo: "Reservar" },
  ...RESIDENCIAS.map((r) => ({ path: `residencias/${r.id}`, titulo: r.n })),
];

/** las tarjetas del bento de la portada */
export const BLOQUES = [
  { id: "comunidad", t: "Comunidad", texto: "Cenas, torneos y una persona de la casa que conoce a todo el mundo.", color: "#e8442d", img: FOTOS.comun },
  { id: "estudio", t: "Donde tu concentración funciona", texto: "Salas de estudio silenciosas y una biblioteca que no cierra.", color: "#ffd31a", img: FOTOS.estudio },
  { id: "seguridad", t: "Seguridad", texto: "Acceso con el móvil, recepción todo el día y cámaras en las zonas comunes.", color: "#ff6a1f", img: FOTOS.cerradura },
  { id: "inteligente", t: "Vivir con el móvil", texto: "La llave, la lavandería y las reservas de sala, en la app.", color: "#1fa34a", img: FOTOS.app },
  { id: "apoyo", t: "Apoyo", texto: "Ayuda con el papeleo, la beca y los primeros días en la ciudad.", color: "#8a4fff", img: FOTOS.cocina },
  { id: "deporte", t: "Gimnasio", texto: "Abierto de seis a doce, incluido en el precio.", color: "#2f5bea", img: FOTOS.gimnasio },
];

export const INCLUIDO = ["Agua, luz y calefacción", "Wifi de 1 Gb", "Limpieza semanal de zonas comunes", "Gimnasio", "Lavandería con la app", "Recepción 24 h"];
export const DURACIONES = [
  { id: "curso", n: "Curso completo", meses: 10, dto: 0.05 },
  { id: "cuatri", n: "Un cuatrimestre", meses: 5, dto: 0 },
  { id: "verano", n: "Verano", meses: 2, dto: 0 },
];
export const SEÑAL = 200;
