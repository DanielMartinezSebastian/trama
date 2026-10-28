import type { BriefService } from "@/components/ui/BriefFlow";
import type { LineupEvent } from "@/components/ui/EventLineup";
import type { SeatTable, SeatZone } from "@/components/ui/SeatMap";
import type { ShowMenu } from "@/components/ui/ShowBookingFlow";

/* La Tramoya, venta-teatro en Chiclana de la Frontera (docs/57): la cartelera de noviembre y diciembre de 2026, la sala,
   los menús, la carta y los eventos privados. Datos puros; las fechas son fijas para que servidor y navegador coincidan. */

export const SLUG = "la-tramoya";
export const meta = { slug: SLUG, name: "La Tramoya", title: "La Tramoya · venta-teatro en Chiclana", blurb: "Restaurante con espectáculo en directo en Chiclana de la Frontera: cartelera por noches, ficha de cada función, reserva de mesa en el plano de la sala con menú y entrada en QR, carta de venta gaditana, eventos privados y un telón entre páginas.", accent: "#b3121f", tag: "restaurante · espectáculo" };

const I = "/img/tramoya/";

export type Espectaculo = { id: string; titulo: string; genero: string; artista: string; texto: string; img: string; hora: string; precio: number; dura: string };

export const ESPECTACULOS: Record<string, Espectaculo> = {
  bulerias: { id: "bulerias", titulo: "Noche de bulerías", genero: "Flamenco", artista: "Cuadro flamenco de La Tramoya", texto: "Cante, toque y baile a un metro de la mesa: el cuadro de la casa con bailaora, dos guitarras y palmas. La bulería de Cádiz, con su gracia y su compás.", img: `${I}show-flamenco.webp`, hora: "22:00", precio: 38, dura: "75 min" },
  copla: { id: "copla", titulo: "Copla en la venta", genero: "Copla", artista: "Rocío del Pinar y su piano", texto: "Las coplas de siempre —Quintero, León y Quiroga— con piano, voz y alguna historia de la Chiclana de antes entre canción y canción.", img: `${I}show-copla.webp`, hora: "22:00", precio: 36, dura: "70 min" },
  chirigota: { id: "chirigota", titulo: "Antología de chirigotas", genero: "Carnaval", artista: "Chirigota Los del Pinar del Hierro", texto: "Pasodobles, cuplés y popurrí con tipo y bombo: el carnaval de Cádiz no espera a febrero. Se ríe la sala entera y algún comensal sale en un cuplé.", img: `${I}show-chirigota.webp`, hora: "22:00", precio: 34, dura: "80 min" },
  rumba: { id: "rumba", titulo: "Rumba de La Barrosa", genero: "Rumba", artista: "Los Salineros", texto: "Rumba, palmas y canciones de playa para acabar bailando entre las mesas. La noche más fiestera de la semana.", img: `${I}show-rumba.webp`, hora: "22:30", precio: 34, dura: "90 min" },
  guitarra: { id: "guitarra", titulo: "Fino y guitarra", genero: "Guitarra", artista: "Manuel Salinas, guitarra sola", texto: "Mediodía de domingo: guitarra flamenca de concierto con un fino de Chiclana bien frío y la comida de la venta.", img: `${I}show-guitarra.webp`, hora: "14:00", precio: 30, dura: "60 min" },
  zambomba: { id: "zambomba", titulo: "Zambomba flamenca", genero: "Navidad", artista: "Cuadro de La Tramoya y amigos", texto: "La tradición de diciembre en la provincia: villancicos por bulerías alrededor de la candela, zambomba, pestiños y anís. Se canta con la sala.", img: `${I}show-zambomba.webp`, hora: "22:00", precio: 40, dura: "90 min" },
  nochevieja: { id: "nochevieja", titulo: "Nochevieja en La Tramoya", genero: "Especial", artista: "Todo el elenco", texto: "Cena de gala, el mejor flamenco, la chirigota y las campanadas desde el escenario. Uvas, cotillón y rumba hasta que el cuerpo aguante.", img: `${I}show-nochevieja.webp`, hora: "21:00", precio: 95, dura: "toda la noche" },
};

/** qué hay cada día de la semana (0 domingo … 6 sábado); los sábados se alternan chirigota y rumba */
const REGLA: Record<number, string | ((d: Date) => string)> = { 0: "guitarra", 4: "bulerias", 5: (d) => (d.getMonth() === 11 && d.getDate() < 25 ? "zambomba" : "copla"), 6: (d) => (Math.floor(d.getDate() / 7) % 2 ? "chirigota" : "rumba") };
const hash = (s: string) => [...s].reduce((n, c) => Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export type Funcion = LineupEvent & { show: string };

export const FUNCIONES: Funcion[] = (() => {
  const out: Funcion[] = [];
  for (let d = new Date(2026, 10, 5, 12); d <= new Date(2026, 11, 31, 12); d.setDate(d.getDate() + 1)) {
    const r = REGLA[d.getDay()];
    const show = iso(d) === "2026-12-31" ? "nochevieja" : iso(d) === "2026-12-24" || iso(d) === "2026-12-25" ? "" : typeof r === "function" ? r(d) : r;
    if (!show) continue;
    const e = ESPECTACULOS[show];
    const h = hash(`${show}|${iso(d)}`) % 100;
    const status: Funcion["status"] = show === "nochevieja" ? "few" : h < 12 ? "soldout" : h < 34 ? "few" : "open";
    out.push({ id: `${show}-${iso(d)}`, show, title: e.titulo, date: iso(d), time: e.hora, genre: e.genero, blurb: e.artista, image: e.img, price: e.precio, status, left: status === "few" ? 2 + (h % 5) : undefined, href: `/sitios/${SLUG}/cartelera/${show}-${iso(d)}` });
  }
  return out;
})();

export const ZONAS: SeatZone[] = [
  { id: "primera", name: "Primera fila", price: 8, color: "#b3121f" },
  { id: "patio", name: "Patio", color: "#c9962f" },
  { id: "altillo", name: "Altillo", price: 4, color: "#2f5d7c" },
  { id: "barra", name: "Barra de la bodega", price: -6, color: "#6b6152" },
];

const fila = (zona: string, y: number, xs: number[], seats: number, pref: string, shape: SeatTable["shape"] = "round", n0 = 1): SeatTable[] => xs.map((x, i) => ({ id: `${pref}${n0 + i}`, label: `${pref}${n0 + i}`, zone: zona, seats, x, y, shape }));

export const MESAS: SeatTable[] = [
  ...fila("primera", 26, [24, 38, 50, 62, 76], 4, "A"),
  ...fila("patio", 46, [14, 28, 42, 58, 72, 86], 4, "B"),
  ...fila("patio", 62, [20, 36, 50, 64, 80], 6, "C"),
  ...fila("altillo", 82, [12, 26], 2, "D"),
  ...fila("altillo", 82, [74, 88], 2, "D", "round", 3),
  ...fila("barra", 84, [43, 57], 3, "E", "bar"),
];

export const MENUS: ShowMenu[] = [
  { id: "venta", name: "Menú de la venta", price: 38, description: "Chicharrones, tortillitas, papas aliñás, pescaíto o carne en salsa, postre y una copa de fino." },
  { id: "almadraba", name: "Menú almadraba", price: 52, description: "Tartar y encebollado de atún de almadraba, ensalada de la huerta de Chiclana, tocino de cielo y moscatel." },
  { id: "tapeo", name: "Tapeo y función", price: 26, description: "Tres tapas a elegir y una bebida. Para quien viene sobre todo a ver el espectáculo." },
];

export type Plato = { n: string; d: string; p: number; img?: string };

export const CARTA: { t: string; platos: Plato[] }[] = [
  { t: "Para picar", platos: [
    { n: "Chicharrones de Chiclana", d: "Prensados, en finas lonchas, con limón y sal gorda.", p: 9, img: `${I}plato-chicharrones.webp` },
    { n: "Tortillitas de camarones", d: "Finas y crujientes, como en las ventas de toda la vida.", p: 11, img: `${I}plato-tortillitas.webp` },
    { n: "Papas aliñás", d: "Con cebolleta, perejil y melva de Barbate.", p: 8 },
  ] },
  { t: "Del mar", platos: [
    { n: "Atún de almadraba encebollado", d: "Atún rojo de la almadraba de Sancti Petri, cebolla dulce y fino.", p: 22, img: `${I}plato-atun.webp` },
    { n: "Pescaíto frito de la bahía", d: "Acedías, cazón en adobo y puntillitas.", p: 18, img: `${I}plato-pescaito.webp` },
  ] },
  { t: "De la venta", platos: [
    { n: "Carrillada al moscatel", d: "Ocho horas al fuego lento con moscatel de Chiclana.", p: 17 },
    { n: "Berza gaditana", d: "Los jueves de invierno, como manda la tradición.", p: 14 },
    { n: "Tocino de cielo", d: "Con un vasito de moscatel.", p: 6 },
  ] },
  { t: "Vinos de Chiclana", platos: [
    { n: "Fino de la casa, en rama", d: "De la bota de la bodega, a la copa.", p: 3.5, img: `${I}vino-fino.webp` },
    { n: "Moscatel de Chiclana", d: "Dulce y aromático, para el postre.", p: 4 },
    { n: "Vino de la tierra de Cádiz, blanco", d: "Botella.", p: 19 },
  ] },
];

export const NOCHE = [
  { h: "20:30", t: "Se abre la venta", d: "Llegas, te sentamos en tu mesa del plano y empieza la cena con un fino." },
  { h: "22:00", t: "Sube el telón", d: "El espectáculo a un metro: las cocinas se callan y la sala escucha." },
  { h: "23:30", t: "Sobremesa", d: "Moscatel, café y, si la noche lo pide, el elenco baja a la sala." },
];

export const EVENTOS: BriefService[] = [
  { label: "Cumpleaños o aniversario", hint: "mesa preparada, tarta y dedicatoria desde el escenario" },
  { label: "Cena de empresa", hint: "sala completa o altillo, con menú cerrado" },
  { label: "Despedida", hint: "chirigota con el homenajeado como protagonista" },
  { label: "Boda o pedida", hint: "cuadro flamenco para la celebración" },
];

export const PAQUETES = [
  { t: "El altillo", d: "Hasta 12 personas con vistas al escenario, menú de la venta y fino de bienvenida.", p: "desde 45 € / persona", img: `${I}sala-altillo.webp` },
  { t: "La sala entera", d: "De 40 a 90 personas, espectáculo a medida y barra libre de vinos de Chiclana.", p: "a consultar", img: `${I}sala-escenario.webp` },
  { t: "El patio", d: "Cócteles y tapeo bajo los naranjos antes de la función.", p: "desde 28 € / persona", img: `${I}sala-patio.webp` },
];

/** la tira de la portada: una semana en la casa, de jueves a domingo, con la cocina y la sala entre función y función */
export const GALERIA = [
  { img: `${I}show-flamenco.webp`, forma: "alta", dia: "Jueves", t: "Bulerías a un metro de la mesa" },
  { img: `${I}sala-patio.webp`, forma: "ancha", dia: "20:30", t: "Se abre el patio de los naranjos" },
  { img: `${I}plato-atun.webp`, forma: "cuadrada", dia: "En la mesa", t: "Atún de almadraba encebollado" },
  { img: `${I}show-copla.webp`, forma: "alta", dia: "Viernes", t: "Copla con piano y mantón" },
  { img: `${I}barra-bodega.webp`, forma: "ancha", dia: "En la barra", t: "Fino de la bota, con venencia" },
  { img: `${I}show-chirigota.webp`, forma: "alta", dia: "Sábado", t: "La chirigota no espera a febrero" },
  { img: `${I}plato-tortillitas.webp`, forma: "cuadrada", dia: "Para picar", t: "Tortillitas de camarones" },
  { img: `${I}show-guitarra.webp`, forma: "alta", dia: "Domingo", t: "Guitarra sola al mediodía" },
];

export const DIRECCION = "Carretera de La Barrosa, km 3 · 11130 Chiclana de la Frontera (Cádiz)";

export const ROUTES = [
  { path: "", title: "La venta-teatro" },
  { path: "cartelera", title: "Cartelera" },
  ...FUNCIONES.map((f) => ({ path: `cartelera/${f.id}`, title: `${f.title} · ${f.date}` })),
  { path: "reservar", title: "Reservar mesa" },
  { path: "carta", title: "Carta y menús" },
  { path: "la-sala", title: "La sala" },
  { path: "eventos", title: "Eventos privados" },
  { path: "mis-entradas", title: "Mis entradas" },
  { path: "como-llegar", title: "Cómo llegar" },
];
