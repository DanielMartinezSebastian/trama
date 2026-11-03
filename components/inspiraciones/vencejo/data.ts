/* Datos de Vencejo (docs/59): fabricante inventado de deportivos hechos a mano, nacido en un taller de aviación de Getafe en
   1911. Modelo, configurador, herencia, boutique y noticias. Datos puros. */

const I = "/img/inspiraciones/vencejo/";

export const FOTOS = {
  portada: `${I}portada.webp`,
  tapon: `${I}tapon.webp`,
  piloto: `${I}piloto.webp`,
  rueda: `${I}rueda.webp`,
  interior: `${I}interior.webp`,
  concurso: `${I}concurso.webp`,
  feria: `${I}feria.webp`,
};

export const MODELO = {
  n: "Céfiro XXV",
  lema: "Ocho cilindros, dos plazas y veinticinco unidades",
  base: 485000,
  datos: [
    ["Motor", "V8 4,2 litros atmosférico"],
    ["Potencia", "525 CV a 7.800 rpm"],
    ["Cambio", "Manual de seis velocidades, rejilla vista"],
    ["0–100 km/h", "3,9 s"],
    ["Peso", "1.290 kg"],
    ["Unidades", "25, numeradas"],
  ] as [string, string][],
};

export type Opcion = { id: string; n: string; precio: number; hex?: string };
export const COLORES: Opcion[] = [
  { id: "petroleo", n: "Verde petróleo", precio: 0, hex: "#1f4a4f" },
  { id: "plata", n: "Plata aviación", precio: 0, hex: "#b9bec3" },
  { id: "noche", n: "Azul noche", precio: 4200, hex: "#16203a" },
  { id: "teja", n: "Rojo teja", precio: 4200, hex: "#8e2f22" },
  { id: "marfil", n: "Marfil 1934", precio: 9800, hex: "#e9e1cf" },
];
export const INTERIORES: Opcion[] = [
  { id: "conac", n: "Cuero coñac", precio: 0, hex: "#8a4b26" },
  { id: "negro", n: "Cuero negro", precio: 0, hex: "#1a1a1a" },
  { id: "verde", n: "Cuero verde inglés", precio: 6400, hex: "#2c4a32" },
];
export const LLANTAS: Opcion[] = [
  { id: "radios", n: "De radios", precio: 0 },
  { id: "turbina", n: "De turbina", precio: 7900 },
];
export const EXTRAS: Opcion[] = [
  { id: "maletas", n: "Juego de maletas a medida", precio: 12500 },
  { id: "jaula", n: "Jaula antivuelco para circuito", precio: 18900 },
  { id: "curso", n: "Curso de conducción en el Jarama", precio: 3500 },
];

export type Hito = { anio: number; t: string; d: string; img?: string };
export const HISTORIA: Hito[] = [
  { anio: 1911, t: "Un taller de aviones", d: "Los hermanos Arroyo construyen hélices y fuselajes de madera en un hangar de Getafe.", img: `${I}hangar-1911.webp` },
  { anio: 1922, t: "El primer coche", d: "Con lo aprendido en los aviones, un biplaza ligero de aluminio para un cliente de Madrid." },
  { anio: 1934, t: "Las carreras", d: "Un Vencejo gana su categoría en la subida a Rabassada. La hélice se queda en el emblema.", img: `${I}carreras-1934.webp` },
  { anio: 1958, t: "El cierre", d: "La empresa cierra. Quedan los planos, tres coches y el nombre." },
  { anio: 1999, t: "El regreso", d: "Un grupo de ingenieros recupera la marca y abre un taller de doce personas en Valladolid.", img: `${I}taller-1999.webp` },
  { anio: 2026, t: "La serie XXV", d: "Veinticinco unidades del Céfiro, cada una con el nombre de su dueño grabado en el chasis." },
];

export type Articulo = { id: string; n: string; precio: number; img: string; d: string };
export const BOUTIQUE: Articulo[] = [
  { id: "maqueta", n: "Céfiro XXV a escala 1:18", precio: 390, img: `${I}maqueta.webp`, d: "Resina pintada a mano, en el color que elijas para tu coche." },
  { id: "libro", n: "Vencejo, 1911–2026", precio: 120, img: `${I}libro.webp`, d: "Trescientas páginas de planos, fotos y cartas de clientes." },
  { id: "llavero", n: "Llavero de cuero y aluminio", precio: 85, img: `${I}llavero.webp`, d: "El mismo cuero coñac que el interior." },
  { id: "gorra", n: "Gorra de lona petróleo", precio: 45, img: `${I}gorra.webp`, d: "Lona encerada; se adapta con el uso." },
];

export type Noticia = { id: string; t: string; f: string; img: string; texto: string };
export const NOTICIAS: Noticia[] = [
  { id: "herencia", t: "Presentamos el archivo Vencejo: planos y fotos desde 1911", f: "28 oct 2026", img: `${I}hangar-1911.webp`, texto: "Hemos digitalizado los planos y fotografías que se salvaron del cierre de 1958. Se pueden consultar con cita en Valladolid." },
  { id: "concurso", t: "El Céfiro XXV, finalista al mejor deportivo del Concurso de Elegancia de Aranjuez", f: "12 oct 2026", img: `${I}concurso.webp`, texto: "El jurado destacó la carrocería sin alerones y el interior cosido a mano." },
  { id: "feria", t: "Primera aparición pública en la Feria de Clásicos de Madrid", f: "20 sep 2026", img: `${I}feria.webp`, texto: "Tres días, una tarima negra y más de once mil visitas al stand." },
];

export const PAGINAS = [
  { path: "cefiro", titulo: "Céfiro XXV" },
  { path: "configurador", titulo: "Configurador" },
  { path: "herencia", titulo: "Herencia" },
  { path: "boutique", titulo: "Boutique" },
  ...BOUTIQUE.map((a) => ({ path: `boutique/${a.id}`, titulo: a.n })),
  { path: "pedido", titulo: "Pedido" },
  { path: "noticias", titulo: "Noticias" },
  ...NOTICIAS.map((n) => ({ path: `noticias/${n.id}`, titulo: n.t })),
  { path: "contacto", titulo: "Contacto" },
];
