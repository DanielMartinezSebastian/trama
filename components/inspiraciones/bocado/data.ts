import type { LineupEvent } from "@/components/ui/EventLineup";

/* Datos de Bocado (docs/59): restaurante-pizzería inventado de Zaragoza, abierto en 1972. Datos puros. */

const I = "/img/inspiraciones/bocado/";

export const FOTOS = {
  portada: `${I}portada.webp`,
  cocina: `${I}cocina.webp`,
  horno: `${I}horno.webp`,
  salon: `${I}salon.webp`,
  terraza: `${I}terraza.webp`,
  tarjeta: `${I}tarjeta.webp`,
};

export type Placer = { id: string; n: string; sub: string; cuando: string; img: string; fondo: string };
export const PLACERES: Placer[] = [
  { id: "vermu", n: "La hora del vermú", sub: "Tus tardes, un poco mejores", cuando: "Todos los días de 17 a 20 h", img: `${I}happy-hour.webp`, fondo: "#7cc3bd" },
  { id: "mediodia", n: "Menú del mediodía", sub: "Pausa larga a precio corto", cuando: "De lunes a viernes de 13 a 16 h", img: `${I}mediodia.webp`, fondo: "#de2b2b" },
  { id: "mejillones", n: "Mejillones sin fin", sub: "El clásico de los miércoles", cuando: "Miércoles de 19 a 23 h", img: `${I}mejillones.webp`, fondo: "#2d3e2b" },
  { id: "vino", n: "Vino a mitad de precio", sub: "Todas las botellas de la carta", cuando: "Jueves desde las 13 h", img: `${I}vino.webp`, fondo: "#6b1d24" },
];

export type Plato = { id: string; n: string; d: string; precio: number; tag?: string };
export type Seccion = { id: string; n: string; img: string; platos: Plato[] };
export const CARTA: Seccion[] = [
  {
    id: "pizzas", n: "Pizzas", img: `${I}pizza.webp`, platos: [
      { id: "margarita", n: "Margarita de siempre", d: "Tomate de Casta, mozzarella, albahaca", precio: 11.5, tag: "Vegetariana" },
      { id: "bocado", n: "La Bocado", d: "Longaniza de Graus, cebolla confitada, queso de Tronchón", precio: 14.9, tag: "La de la casa" },
      { id: "huerta", n: "Huerta del Ebro", d: "Borraja, alcachofa, cebolla tierna, pesto de nueces", precio: 13.9, tag: "Vegetariana" },
      { id: "diabla", n: "Diabla", d: "Salami picante, guindilla, miel de romero", precio: 13.5 },
    ],
  },
  {
    id: "pastas", n: "Pastas", img: `${I}pasta.webp`, platos: [
      { id: "lasana", n: "Lasaña de la abuela Pilar", d: "Ragú de ternera cocinado ocho horas", precio: 13.9, tag: "La de la casa" },
      { id: "carbonara", n: "Carbonara de verdad", d: "Guanciale, yema y pecorino; sin nata", precio: 12.9 },
      { id: "ravioli", n: "Raviolis de calabaza", d: "Mantequilla de salvia y almendra tostada", precio: 13.5, tag: "Vegetariana" },
    ],
  },
  {
    id: "brasa", n: "Brasa", img: `${I}carne.webp`, platos: [
      { id: "entrecot", n: "Entrecot con patatas", d: "300 g, patatas cortadas a mano y salsa de pimienta", precio: 21.9 },
      { id: "costillas", n: "Costillas glaseadas", d: "Con ensalada de col y pan de maíz", precio: 17.5 },
      { id: "pollo", n: "Medio pollo al limón", d: "Con patatas panaderas", precio: 14.5 },
    ],
  },
  {
    id: "postres", n: "Postres", img: `${I}postre.webp`, platos: [
      { id: "tarta", n: "Tarta de queso", d: "Al horno, con frutos rojos", precio: 6.5, tag: "La de la casa" },
      { id: "tiramisu", n: "Tiramisú", d: "Con café de Casa Fosca", precio: 6.5 },
      { id: "helado", n: "Helado de la heladería de enfrente", d: "Dos bolas a elegir", precio: 5 },
    ],
  },
];

const d = (n: number) => {
  const x = new Date(2026, 10, 3 + n);
  return x.toISOString().slice(0, 10);
};
export const EVENTOS: LineupEvent[] = [
  { id: "soul", title: "Calle Soul", date: d(3), time: "21:30", genre: "Concierto", blurb: "Soul y funk de los setenta en el rincón del piano", image: `${I}concierto.webp`, price: 0, status: "open" },
  { id: "karaoke", title: "Karaoke de los jueves", date: d(9), time: "22:00", genre: "Karaoke", blurb: "Canta lo que quieras; la primera ronda la pone la casa", image: `${I}karaoke.webp`, price: 0, status: "few" },
  { id: "maquina", title: "Máquina del tiempo", date: d(11), time: "21:30", genre: "Concierto", blurb: "Versiones de los ochenta con Las Hermanas Lafuente", image: `${I}concierto.webp`, price: 8, status: "open" },
  { id: "trivial", title: "Trivial de barra", date: d(16), time: "21:00", genre: "Juego", blurb: "Equipos de cuatro; el premio es una cena", image: `${I}karaoke.webp`, price: 0, status: "open" },
  { id: "jazz", title: "Trío Moncayo", date: d(23), time: "21:30", genre: "Concierto", blurb: "Jazz tranquilo para cenar sin prisa", image: `${I}concierto.webp`, price: 8, status: "soldout" },
];

export const HORARIO: [string, string][] = [
  ["Comedor", "13:00 – 16:00 · 20:00 – 23:30"],
  ["Barra", "11:00 – 0:30"],
  ["Vermú", "17:00 – 20:00"],
  ["Para llevar", "12:30 – 23:30"],
  ["A domicilio", "13:00 – 23:00"],
];

export const ZONAS = ["Comedor", "Terraza", "Barra"];
export const TURNOS = ["13:00", "13:30", "14:00", "14:30", "15:00", "20:00", "20:30", "21:00", "21:30", "22:00"];

export const PAGINAS = [
  { path: "carta", titulo: "La carta" },
  { path: "restaurante", titulo: "El restaurante" },
  { path: "programacion", titulo: "Programación" },
  { path: "salones", titulo: "Salones privados" },
  { path: "reservar", titulo: "Reservar mesa" },
  { path: "pedir", titulo: "Pedir a domicilio" },
  { path: "tarjeta-regalo", titulo: "Tarjeta regalo" },
];
