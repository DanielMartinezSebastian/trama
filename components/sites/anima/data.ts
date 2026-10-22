/** Ánima — fiesta de Halloween en Valencia (ficticia). La noche se cuenta en actos, de la puerta al amanecer, con una
 * calavera 3D procedural que cambia en cada uno (docs/20). Datos puros. */

export const SLUG = "anima";

export const meta = {
  slug: SLUG,
  name: "Ánima",
  title: "Ánima · fiesta de Halloween en Valencia",
  blurb:
    "Fiesta de Halloween contada como una noche en seis actos (la puerta, el pasaje del terror, la pista, el concurso de disfraces, la cena de los muertos y la medianoche) con una calavera 3D procedural, modelada con una función de distancia y MarchingCubes, que abre la mandíbula, castañetea, enciende los ojos, se parte y se multiplica. Cuadros que pasan por detrás de la calavera entre niebla y ascuas, cuenta atrás hasta la fiesta (Countdown), programa por horas, entradas con tipo y cantidad, y la información práctica: lugar, normas y preguntas.",
  accent: "#ff7a1a",
  tag: "evento · halloween · 3D",
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "programa", title: "Programa" },
  { path: "entradas", title: "Entradas" },
  { path: "info", title: "Info" },
  { path: "laboratorio", title: "Laboratorio" },
];

export const BRAND = {
  name: "Ánima",
  legal: "Ánima Eventos S. L. (empresa ficticia de demostración)",
  city: "Valencia",
  venue: "Nave 13 · Antigua Fábrica de Hielo",
  address: "Calle de la Niebla 13, 46024 Valencia",
  zone: "El Grau, a 6 min del metro Marítim",
  map: "https://www.openstreetmap.org/search?query=Mar%C3%ADtim%20Valencia",
  phone: "+34 960 000 013",
  phoneHref: "tel:+34960000013",
  whatsappHref: "https://wa.me/34600000013?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20%C3%81nima",
  email: "hola@anima.example",
};

/** La noche: abre el 31 de octubre a las 21:00 (hora de Madrid) y cierra a las 6:00. */
export const EVENT = {
  start: "2026-10-31T21:00:00+01:00",
  end: "2026-11-01T06:00:00+01:00",
  doors: "21:00",
  close: "6:00",
  age: "+16",
  capacity: 1200,
};

export type Interlude = { back: string; front: string; flip?: boolean };
export type Chapter = {
  id: string;
  k: string;
  /** a qué hora pasa */
  time: string;
  title: string;
  thesis: string;
  what: string;
  /** el detalle largo: en el cuadro solo para lectores de pantalla (en pantalla lo cuentan las cintas) */
  how: string;
  cta: { label: string; href: string };
  interlude: Interlude;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "puerta",
    k: "01",
    time: "21:00",
    title: "La puerta",
    thesis: "A las nueve se abren las puertas. Ven disfrazado.",
    what: "Entrada general 25 €; con disfraz, 20 €. Si llegas sin él, en la puerta te maquillamos gratis.",
    how: "Calabazas, niebla en el suelo y un portero que no parpadea. El guardarropa está a la izquierda y cuesta 2 €.",
    cta: { label: "Comprar entradas", href: "entradas" },
    interlude: { back: "Niebla · calabazas · velas", front: "La noche más larga del año" },
  },
  {
    id: "pasaje",
    k: "02",
    time: "21:30",
    title: "El pasaje",
    thesis: "Noventa metros de pasaje del terror. Con actores.",
    what: "Pases en grupos de seis cada diez minutos. Si dices «basta», se enciende la luz y te sacan.",
    how: "Un hospital abandonado, una capilla y un sótano. Recomendado para mayores de 16; no apto para embarazadas ni personas con problemas de corazón.",
    cta: { label: "Ver el programa", href: "programa" },
    interlude: { back: "No mires atrás", front: "Seis personas · diez minutos · ninguna salida", flip: true },
  },
  {
    id: "pista",
    k: "03",
    time: "22:00",
    title: "La pista",
    thesis: "Tres DJs, dos salas y música hasta las seis.",
    what: "Sala grande: techno oscuro. Sala pequeña: los éxitos de siempre de Halloween, Thriller incluido.",
    how: "De 22:00 a 6:00, sin pausa. Hay zona de descanso con sofás y agua gratis.",
    cta: { label: "Ver los horarios", href: "programa" },
    interlude: { back: "Bailar hasta que salga el sol", front: "Techno · Thriller · gritos" },
  },
  {
    id: "concurso",
    k: "04",
    time: "1:00",
    title: "El concurso",
    thesis: "500 € al mejor disfraz de la noche.",
    what: "Inscripción gratis en la puerta hasta las 0:30. Vota el público con el móvil y decide un jurado.",
    how: "Tres premios: mejor disfraz (500 €), mejor grupo (300 €) y más terrorífico (dos entradas para el año que viene).",
    cta: { label: "Bases del concurso", href: "info" },
    interlude: { back: "Calaveras · brujas · vampiros", front: "El público vota, el jurado decide", flip: true },
  },
  {
    id: "cena",
    k: "05",
    time: "21:00–4:00",
    title: "La cena de los muertos",
    thesis: "Food trucks, ponche de calabaza y calaveras de azúcar.",
    what: "Cuatro food trucks con opciones veganas y sin gluten. La barra cierra a las 5:30.",
    how: "Pan de muerto, hamburguesas negras, tacos y crepes. Se paga con tarjeta o con el móvil; no hay efectivo.",
    cta: { label: "Información práctica", href: "info" },
    interlude: { back: "Pan de muerto · ponche · tacos", front: "Se come con las manos" },
  },
  {
    id: "medianoche",
    k: "06",
    time: "0:00",
    title: "Medianoche",
    thesis: "A las doce se apagan todas las luces.",
    what: "Un minuto de oscuridad total. Después, el espectáculo de fuego en el patio.",
    how: "Con bailarines, zancudos y una banda de percusión. Dura veinte minutos; la pista se para mientras tanto.",
    cta: { label: "Comprar entradas", href: "entradas" },
    interlude: { back: "Un minuto a oscuras", front: "Y después, fuego", flip: true },
  },
];

/** El programa por horas (formato del Timeline del kit: «título|texto» por línea). */
export const PROGRAM = [
  "21:00 · Se abren las puertas|Maquillaje gratis para quien venga sin disfraz, hasta las 23:00.",
  "21:30 · Pasaje del terror|Pases cada 10 minutos en grupos de seis, hasta las 3:00.",
  "22:00 · Empieza la música|Dos salas: techno oscuro y los clásicos de Halloween.",
  "0:00 · Medianoche|Un minuto a oscuras y espectáculo de fuego en el patio.",
  "0:30 · Cierra la inscripción del concurso|En el puesto junto al guardarropa.",
  "1:00 · Concurso de disfraces|Desfile en la sala grande; vota el público desde el móvil.",
  "5:30 · Cierra la barra|Agua gratis toda la noche en la zona de descanso.",
  "6:00 · Amanece|Chocolate con churros en la puerta para los que aguanten.",
].join("\n");

export type Ticket = { id: string; name: string; price: number; note: string; soldOut?: boolean };
export const TICKETS: Ticket[] = [
  { id: "anticipada", name: "Anticipada", price: 18, note: "Hasta el 24 de octubre", soldOut: true },
  { id: "disfraz", name: "Con disfraz", price: 20, note: "Hay que venir disfrazado (se comprueba en la puerta)" },
  { id: "general", name: "General", price: 25, note: "Con o sin disfraz" },
  { id: "pasaje", name: "General + pasaje", price: 32, note: "Incluye un pase al pasaje del terror" },
  { id: "vip", name: "VIP", price: 55, note: "Pasaje sin cola, zona reservada y dos copas" },
];
export const MAX_TICKETS = 8;
/** gastos de gestión por entrada */
export const FEE = 1.2;

export const FAQ =
  "¿Hay edad mínima?|Sí: 16 años. Los menores de 18 tienen que traer la autorización firmada y venir con un adulto.\n" +
  "¿Es obligatorio ir disfrazado?|No, pero la entrada con disfraz es más barata y, si llegas sin él, en la puerta te maquillamos gratis hasta las 23:00.\n" +
  "¿Puedo salir y volver a entrar?|Sí, una vez, con el sello en la mano.\n" +
  "¿Qué no se puede llevar?|Armas de verdad o réplicas metálicas, botellas de cristal y bengalas. Las réplicas de plástico de los disfraces, sí.\n" +
  "¿Cómo llego?|En metro hasta Marítim (líneas 5 y 8) y seis minutos andando. Hay aparcamiento de bicis en la puerta; de coche, el de la Marina.\n" +
  "¿Y si llueve?|Todo pasa dentro de la nave salvo el espectáculo de fuego, que se hace en el porche.\n" +
  "¿Se devuelven las entradas?|Hasta 48 horas antes, menos los gastos de gestión. Después se pueden ceder a otra persona cambiando el nombre.";

export const RULES = [
  ["Edad", "Mayores de 16; de 16 a 18, con autorización y un adulto."],
  ["Accesibilidad", "Nave a pie de calle, aseos adaptados y zona tranquila sin efectos de luz."],
  ["Efectos", "Hay luces estroboscópicas en la sala grande y en el pasaje: lo avisamos en cada entrada."],
  ["Pago", "Dentro, solo tarjeta o móvil."],
] as const;

/** Datos estructurados del evento (schema.org/Event). */
export const eventJsonLd = (url: string) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Ánima · Noche de Halloween",
  startDate: EVENT.start,
  endDate: EVENT.end,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: { "@type": "Place", name: BRAND.venue, address: { "@type": "PostalAddress", streetAddress: "Calle de la Niebla 13", postalCode: "46024", addressLocality: "Valencia", addressCountry: "ES" } },
  offers: TICKETS.filter((t) => !t.soldOut).map((t) => ({ "@type": "Offer", name: t.name, price: t.price, priceCurrency: "EUR", availability: "https://schema.org/InStock", url })),
  typicalAgeRange: "16-",
  organizer: { "@type": "Organization", name: BRAND.legal },
});
