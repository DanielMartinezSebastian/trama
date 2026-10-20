/** Travesía — productora ficticia de documentales de mar. Demo de transiciones entre rutas con la coreografía de las webs de
 * cine premiadas (docs/14): una sola «pantalla» de vídeo vive en el layout y viaja del índice a la portada de cada
 * documental, a la ventana de «siguiente», al retrato de la productora y a la píldora de contacto sin cortarse nunca.
 * Vídeos de Wikimedia Commons (`npm run videos:fetch`, créditos en /creditos). Datos puros. */

export const SLUG = "travesia";

export const meta = {
  slug: SLUG,
  name: "Travesía",
  title: "Travesía · documentales de mar",
  blurb:
    "Productora de documentales con la coreografía de las webs de cine premiadas (docs/14): la portada es un índice tipográfico con una ventana de vídeo que reproduce el título que señalas y tiñe la página con su luz; al abrirlo, esa misma ventana —sin cortar el vídeo— se expande a pantalla completa mientras las palabras del título vuelan hasta el titular; «Siguiente documental» encoge el vídeo a una ventana, cambia de película y lo vuelve a expandir; y la marca de la cabecera se convierte, palabra a palabra, en el titular gigante de la productora. Usa Traveler, TravelSlot, SharedText, AmbientLight, MetaTable y PageTransition.",
  accent: "#ff7a59",
  tag: "cine · documental",
};

const v = (f: string) => `/video/${f}`;

/** El tráiler que viaja por toda la web (Traveler «reel»). */
export const REEL = {
  src: v("oceano/01-arrecife.mp4"),
  poster: v("oceano/01-arrecife.jpg"),
  label: "Tráiler · temporada 2026",
  alt: "Los canales turquesa de un arrecife de coral, vistos desde el aire",
};

export type Doc = {
  slug: string;
  title: string;
  /** mar abierto o costa: el filtro del listado */
  kind: "mar" | "costa";
  format: string;
  year: string;
  place: string;
  video: string;
  poster: string;
  alt: string;
  logline: string;
  synopsis: string[];
  crew: { k: string; v: string }[];
};

export const DOCS: Doc[] = [
  {
    slug: "puntas-negras",
    title: "Puntas negras",
    kind: "mar",
    format: "Largometraje · 84 min",
    year: "2026",
    place: "Gran Barrera, Australia",
    video: v("oceano/02-tiburon-puntas-negras.mp4"),
    poster: v("oceano/02-tiburon-puntas-negras.jpg"),
    alt: "Un tiburón de puntas negras patrulla el agua clara sobre la arena, visto desde el aire",
    logline: "Un año siguiendo a los tiburones de arrecife que nadie quiere mirar de cerca.",
    synopsis: [
      "En la laguna de una isla de coral, una población de tiburones de puntas negras patrulla el mismo canal cada marea. El equipo pasó once meses con un dron y dos cámaras submarinas para contar sus rutinas sin cebos ni jaulas.",
      "Una película sobre la paciencia: la de los animales que esperan el pez enfermo y la de quienes esperan, durante semanas, a que el agua vuelva a estar clara.",
    ],
    crew: [
      { k: "Dirección", v: "Inés Arrieta" },
      { k: "Fotografía", v: "Bruno Sal" },
      { k: "Música", v: "Coral Ensemble" },
      { k: "Estreno", v: "Festival de Sitges" },
    ],
  },
  {
    slug: "marea-rosa",
    title: "Marea rosa",
    kind: "costa",
    format: "Cortometraje · 22 min",
    year: "2026",
    place: "Ras Jebel, Túnez",
    video: v("costa/03-playa-tunez.mp4"),
    poster: v("costa/03-playa-tunez.jpg"),
    alt: "Una playa de Túnez al atardecer, con la orilla rosada, vista desde el aire",
    logline: "Veinte minutos de atardecer sobre una playa que cambia de color con cada ola.",
    synopsis: [
      "En el norte de Túnez, la orilla de una playa se vuelve rosa durante unos minutos al caer el sol. Un único vuelo cenital, sin narrador ni música, sigue esa franja de color mientras la marea la borra.",
      "Rodado durante una semana de octubre, con la misma hora y la misma altura cada tarde, para montar una sola puesta de sol perfecta.",
    ],
    crew: [
      { k: "Dirección", v: "Marta Oyarzun" },
      { k: "Fotografía", v: "Bruno Sal" },
      { k: "Sonido", v: "Leo Ferrán" },
      { k: "Estreno", v: "Documenta Madrid" },
    ],
  },
  {
    slug: "giradores",
    title: "Giradores",
    kind: "mar",
    format: "Serie · 4 episodios",
    year: "2025",
    place: "Hawái, Estados Unidos",
    video: v("oceano/03-delfines-hawai.mp4"),
    poster: v("oceano/03-delfines-hawai.jpg"),
    alt: "Un grupo de delfines girador nada bajo el agua azul en Hawái",
    logline: "Por qué un delfín salta y gira siete veces en el aire, y qué pasa cuando vuelve abajo.",
    synopsis: [
      "Los delfines girador descansan de día en bahías poco profundas y salen a cazar de noche. La serie sigue a un grupo durante un ciclo lunar completo, con biólogas que llevan veinte años reconociéndolos por la aleta.",
      "Cuatro episodios: el descanso, la caza, el juego y las visitas, cada vez más frecuentes, de embarcaciones de turistas.",
    ],
    crew: [
      { k: "Dirección", v: "Inés Arrieta y Kai Nohea" },
      { k: "Fotografía submarina", v: "Lucía Varo" },
      { k: "Música", v: "Tomás Reina" },
      { k: "Emisión", v: "Plataforma por anunciar" },
    ],
  },
  {
    slug: "barrack-point",
    title: "Barrack Point",
    kind: "costa",
    format: "Largometraje · 91 min",
    year: "2025",
    place: "Nueva Gales del Sur, Australia",
    video: v("oceano/04-delfines-barrack-point.mp4"),
    poster: v("oceano/04-delfines-barrack-point.jpg"),
    alt: "Un grupo de delfines nada en agua verde, visto desde el aire",
    logline: "Una roca, dos especies y el mismo banco de peces.",
    synopsis: [
      "Frente a un cabo rocoso, focas y delfines comparten durante unas semanas el paso de un banco de salmonetes. Compiten, a veces cooperan y casi siempre se ignoran.",
      "Filmado desde un dron a gran altura para no alterar su comportamiento, con el oleaje como única banda sonora.",
    ],
    crew: [
      { k: "Dirección", v: "Marta Oyarzun" },
      { k: "Dron", v: "Ana Guijarro" },
      { k: "Montaje", v: "Pau Ribes" },
      { k: "Estreno", v: "Seminci" },
    ],
  },
  {
    slug: "arena-negra",
    title: "Arena negra",
    kind: "costa",
    format: "Cortometraje · 14 min",
    year: "2024",
    place: "Lækjavík, Islandia",
    video: v("costa/01-olas-islandia.mp4"),
    poster: v("costa/01-olas-islandia.jpg"),
    alt: "Olas rompiendo en una playa de arena negra bajo un acantilado en Islandia",
    logline: "Catorce minutos de olas en una playa volcánica, sin cortes.",
    synopsis: [
      "Una cámara fija y una playa de arena negra en el sur de Islandia. La película dura lo que dura una marea subiendo un palmo.",
      "Una pieza para sala, pensada para verse en silencio y a oscuras.",
    ],
    crew: [
      { k: "Dirección", v: "Leo Ferrán" },
      { k: "Fotografía", v: "Leo Ferrán" },
      { k: "Sonido", v: "Sigrún Ólafs" },
      { k: "Estreno", v: "Punto de Vista" },
    ],
  },
  {
    slug: "borde-del-mapa",
    title: "El borde del mapa",
    kind: "costa",
    format: "Serie · 6 episodios",
    year: "2024",
    place: "Oregón, Estados Unidos",
    video: v("costa/02-costa-oregon.mp4"),
    poster: v("costa/02-costa-oregon.jpg"),
    alt: "Vuelo de dron a ras de los acantilados y el oleaje de la costa de Oregón",
    logline: "Quinientos kilómetros de costa recorridos a ras de acantilado.",
    synopsis: [
      "Un viaje de norte a sur por la costa de Oregón con drones de carreras, a pocos metros de las rocas. Cada episodio, un tramo y una comunidad que vive de cara al Pacífico.",
      "Pescadores, guardas de faro y surfistas de invierno cuentan cómo cambia la línea de costa de un año a otro.",
    ],
    crew: [
      { k: "Dirección", v: "Kai Nohea" },
      { k: "Dron FPV", v: "Ana Guijarro" },
      { k: "Música", v: "Tomás Reina" },
      { k: "Emisión", v: "Televisión pública" },
    ],
  },
];

export const getDoc = (slug: string) => DOCS.find((d) => d.slug === slug);

export const ROUTES = [
  { path: "", title: "Índice" },
  ...DOCS.map((d) => ({ path: `documentales/${d.slug}`, title: d.title })),
  { path: "productora", title: "Productora" },
  { path: "contacto", title: "Contacto" },
];

export const MANIFESTO = "Rodamos el mar sin cebos, sin jaulas y sin prisa. Historias largas, contadas desde arriba y desde dentro del agua.";

export const TEAM = [
  { name: "Inés Arrieta", role: "Dirección y producción" },
  { name: "Marta Oyarzun", role: "Dirección" },
  { name: "Bruno Sal", role: "Dirección de fotografía" },
  { name: "Ana Guijarro", role: "Dron y FPV" },
  { name: "Leo Ferrán", role: "Sonido y dirección" },
];

export const FACTS = [
  { k: "Fundada", v: "2016, en Donostia" },
  { k: "Títulos", v: "14 documentales" },
  { k: "Horas en el agua", v: "+3.200" },
  { k: "Equipo fijo", v: "9 personas" },
];
