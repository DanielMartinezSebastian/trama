import type { LineupEvent } from "@/components/ui/EventLineup";

/* Datos de Pulso Lento (docs/58): músico inventado, discos, gira y trayectoria. Datos puros. */

const I = "/img/inspiraciones/pulso-lento/";
export const FOTOS = { nombre: `${I}nombre.webp`, retrato: `${I}retrato.webp`, estudio: `${I}estudio.webp`, directo: `${I}directo.webp` };

export type Disco = { id: string; titulo: string; ano: number; img: string; bpm: number; notas: number[]; texto: string; temas: string[]; precio: number };
export const DISCOS: Disco[] = [
  { id: "la-esencia", titulo: "La esencia", ano: 2026, img: `${I}disco-esencia.webp`, bpm: 122, notas: [110, 110, 165, 147], texto: "Un archivo de canciones grabadas durante años, entre un estudio en Vallecas y un piso prestado en Lisboa.", temas: ["Hora de bailar", "Línea 9", "Domingo eléctrico", "Vaho", "La esencia"], precio: 29 },
  { id: "noche-larga", titulo: "Noche larga", ano: 2023, img: `${I}disco-noche.webp`, bpm: 118, notas: [98, 98, 131, 123], texto: "Grabado de un tirón en tres noches y mezclado de día.", temas: ["Túnel", "Faro", "Noche larga", "Amanece en la M-30"], precio: 26 },
  { id: "madrid-sur", titulo: "Madrid Sur", ano: 2019, img: `${I}disco-sur.webp`, bpm: 126, notas: [82, 123, 110, 98], texto: "El disco del barrio: bombos que suenan a nave industrial.", temas: ["Polígono", "Madrid Sur", "Luz de obra", "Última línea"], precio: 24 },
];

export const CONCIERTOS: (LineupEvent & { sala: string; ciudad: string })[] = [
  { id: "madrid-sala-sur", title: "Madrid · Sala Sur", sala: "Sala Sur", ciudad: "Madrid", date: "2026-12-05", time: "23:30", genre: "España", price: 32, status: "few", left: 40 },
  { id: "barcelona-nave-9", title: "Barcelona · Nave 9", sala: "Nave 9", ciudad: "Barcelona", date: "2026-12-12", time: "23:00", genre: "España", price: 34, status: "open" },
  { id: "lisboa-doca", title: "Lisboa · Doca", sala: "Doca", ciudad: "Lisboa", date: "2027-01-16", time: "23:00", genre: "Europa", price: 30, status: "open" },
  { id: "berlin-kraft", title: "Berlín · Halle Ost", sala: "Halle Ost", ciudad: "Berlín", date: "2027-02-06", time: "00:00", genre: "Europa", price: 38, status: "soldout" },
  { id: "valencia-playa", title: "Valencia · Festival Marina", sala: "Festival Marina", ciudad: "Valencia", date: "2027-06-20", time: "21:00", genre: "España", price: 45, status: "open" },
];

export const ANOS: { a: string; t: string; d: string; c: string }[] = [
  { a: "1996", t: "Una caja de ritmos prestada", d: "Primeras maquetas en un trastero de Usera.", c: "#fff" },
  { a: "2004", t: "Primer vinilo", d: "Quinientas copias que se vendieron a mano.", c: "#c5c5c5" },
  { a: "2012", t: "Largos directos", d: "Empieza a tocar sesiones de seis horas sin ordenador a la vista.", c: "#a7ff9c" },
  { a: "2019", t: "Madrid Sur", d: "El disco que le dio la vuelta a todo.", c: "#ff6831" },
  { a: "2026", t: "La esencia", d: "Treinta años después, todo lo que quedaba por decir.", c: "#fff" },
];

export const CAMISETA = { id: "camiseta-gira", titulo: "Camiseta de la gira", precio: 35, img: `${I}camiseta.webp` };

export const PAGINAS = [
  { path: "musica", titulo: "Música" },
  ...DISCOS.map((d) => ({ path: `musica/${d.id}`, titulo: d.titulo })),
  { path: "gira", titulo: "Gira" },
  ...CONCIERTOS.map((c) => ({ path: `gira/${c.id}`, titulo: c.title })),
  { path: "trayectoria", titulo: "Trayectoria" },
  { path: "tienda", titulo: "Tienda" },
  { path: "pedido", titulo: "Pedido" },
];
