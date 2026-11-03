/* Datos de Tierra Ancha (docs/59): colección inventada de campamentos de safari en una reserva ficticia, la Reserva de Saba.
   Datos puros. */

const I = "/img/inspiraciones/tierra-ancha/";

export const FOTOS = {
  portada: `${I}portada.webp`,
  leopardo: `${I}leopardo.webp`,
  suite: `${I}suite.webp`,
  todoterreno: `${I}todoterreno.webp`,
  guia: `${I}guia.webp`,
  rastreador: `${I}rastreador.webp`,
  abejaruco: `${I}abejaruco.webp`,
  tortuga: `${I}tortuga.webp`,
  jirafas: `${I}jirafas.webp`,
  rio: `${I}rio-aereo.webp`,
  boma: `${I}boma.webp`,
  guardas: `${I}guardas.webp`,
  escuela: `${I}escuela.webp`,
};

export type Campamento = {
  id: string;
  n: string;
  tipo: "Lodge" | "Campamento";
  lema: string;
  img: string;
  texto: string;
  suites: number;
  noche: number;
  rasgos: string[];
};
export const CAMPAMENTOS: Campamento[] = [
  { id: "marula", n: "Lodge Marula", tipo: "Lodge", lema: "Sobre pilotes, a la orilla del río de arena", img: `${I}lodge-marula.webp`, texto: "Ocho suites de madera y lona levantadas sobre el cauce. Por la mañana los elefantes bajan a cavar en la arena buscando agua, a veinte metros de la terraza.", suites: 8, noche: 1180, rasgos: ["Terraza sobre el río", "Spa al aire libre", "Niños desde 6 años"] },
  { id: "baobab", n: "Campamento Baobab", tipo: "Campamento", lema: "Tiendas de lona bajo un árbol de mil años", img: `${I}campamento-baobab.webp`, texto: "Seis tiendas amplias con baño de cobre, repartidas a la sombra del baobab más viejo de la reserva. Por la noche se oye todo.", suites: 6, noche: 860, rasgos: ["Baño exterior", "Cena en la boma", "Solo adultos"] },
  { id: "kopje", n: "Casa Kopje", tipo: "Lodge", lema: "Una casa entera en lo alto de las rocas", img: `${I}casa-kopje.webp`, texto: "Cuatro dormitorios, cocinera y guía propios, y una piscina que mira a cuarenta kilómetros de sabana. Para familias o grupos que viajan juntos.", suites: 4, noche: 3400, rasgos: ["Uso exclusivo", "Guía privado", "Piscina infinita"] },
  { id: "arenas", n: "Campamento Arenas", tipo: "Campamento", lema: "El safari de 1931, con agua caliente", img: `${I}campamento-arenas.webp`, texto: "El primer campamento de la familia, restaurado con sus faroles y su porche. Doce habitaciones y el bar más antiguo de la reserva.", suites: 12, noche: 640, rasgos: ["Ambiente clásico", "Familias", "Bar de 1931"] },
];

export type Experiencia = { id: string; n: string; texto: string; img: string; hora: string };
export const EXPERIENCIAS: Experiencia[] = [
  { id: "safari", n: "Safari en todoterreno", texto: "Dos salidas al día con guía y rastreador. Seis viajeros como máximo por vehículo.", img: FOTOS.todoterreno, hora: "5:30 y 16:00" },
  { id: "a-pie", n: "Safari a pie", texto: "Tres horas leyendo huellas con un rastreador. Se aprende más del terreno que en una semana de coche.", img: FOTOS.rastreador, hora: "6:00" },
  { id: "boma", n: "Cena en la boma", texto: "Mesa larga alrededor del fuego, cocina de la región y el cielo más oscuro que habrás visto.", img: FOTOS.boma, hora: "20:00" },
  { id: "aves", n: "Mañana de aves", texto: "Más de trescientas especies registradas. Prismáticos y guía de campo en la habitación.", img: FOTOS.abejaruco, hora: "7:00" },
];

export type Entrada = { id: string; t: string; fecha: string; tipo: "Diario de fauna" | "Historias"; img: string; texto: string[] };
export const DIARIO: Entrada[] = [
  { id: "la-leona-del-rio", t: "La leona del río vuelve con tres cachorros", fecha: "28 oct 2026", tipo: "Diario de fauna", img: FOTOS.leopardo, texto: ["Llevábamos cinco semanas sin verla. El martes apareció en la orilla norte, delgada y tranquila, con tres cachorros de unas seis semanas.", "Los guías han acordado no acercar más de un vehículo a la vez mientras sigan en la madriguera."] },
  { id: "noventa-anos", t: "Noventa años en la misma orilla", fecha: "12 oct 2026", tipo: "Historias", img: FOTOS.rio, texto: ["En 1931, la bisabuela de la familia montó cuatro tiendas junto al río para cazadores. En 1964 se prohibió la caza en la reserva y las tiendas se quedaron para mirar.", "Hoy la tierra es de las comunidades vecinas, que la arriendan y deciden con nosotros cómo se cuida."] },
  { id: "abejarucos", t: "Llegan los abejarucos carmín", fecha: "30 sep 2026", tipo: "Diario de fauna", img: FOTOS.abejaruco, texto: ["Cada septiembre, las colonias excavan sus nidos en los taludes del río. Este año contamos más de doscientos agujeros en la curva de Marula."] },
];

export const CITA = { texto: "No hay otro lugar donde la fauna se deje mirar con tanta calma. Es, sin discusión, el sitio más extraordinario en el que he rodado.", autor: "Lucía Benavente, documentalista" };

export const CIFRAS: [string, string][] = [
  ["1931", "primer campamento a la orilla del río"],
  ["13.000", "hectáreas sin vallas"],
  ["94 %", "del equipo, de las comunidades vecinas"],
];

export const PAGINAS = [
  { path: "campamentos", titulo: "Campamentos" },
  ...CAMPAMENTOS.map((c) => ({ path: `campamentos/${c.id}`, titulo: c.n })),
  { path: "experiencias", titulo: "Experiencias" },
  { path: "conservacion", titulo: "Conservación" },
  { path: "diario", titulo: "Diario" },
  ...DIARIO.map((d) => ({ path: `diario/${d.id}`, titulo: d.t })),
  { path: "planifica", titulo: "Planifica tu estancia" },
];
