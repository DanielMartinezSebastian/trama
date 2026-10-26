/** La Voz de la Tierra — una historia sobre el Disco de Oro de las Voyager en cuatro rutas con un viajero compartido
 * (docs/14 y docs/24). Datos puros: los leen la web y el registro (`lib/sites`). Las cifras y las fechas son las que
 * publica NASA/JPL (misión Voyager); la invitación final («Disco de Oro II») es una ficción y la web lo dice. */

export const SLUG = "voz-de-la-tierra";
export const MEDIA = {
  record: "/img/voyager/01-the-sounds-of-earth-gpn-2000-001976.jpg",
  cover: "/img/voyager/02-the-sounds-of-earth-record-cover-gpn-2000-001978.jpg",
  earth: "/img/voyager/03-the-earth-seen-from-apollo-17.jpg",
  pale: "/img/voyager/04-pale-blue-dot.jpg",
  video: "/video/voyager/01-tierra-desde-la-iss.mp4",
  poster: "/video/voyager/01-tierra-desde-la-iss.jpg",
  greetings: "/audio/voyager/saludos.mp3",
};

export const meta = {
  slug: SLUG,
  name: "La Voz de la Tierra",
  title: "La Voz de la Tierra · el Disco de Oro de las Voyager, en cuatro rutas",
  blurb:
    "Una carta desde la Tierra en cuatro capítulos: el Disco de Oro, sus voces, el viaje y tu mensaje. Disco y cubierta 3D con archivo fotográfico de NASA, saludos originales, película de la Tierra desde la ISS y fotografías históricas con atribución. El mismo objeto acompaña la navegación; el mensaje se conserva solo en este dispositivo y se puede descargar.",
  accent: "#e8b64c",
  tag: "cifras reales · 3D · narrativa",
};

export const ROUTES = [
  { path: "", title: "El objeto" },
  { path: "surcos", title: "Surcos" },
  { path: "viaje", title: "El viaje" },
  { path: "mensaje", title: "El mensaje" },
];

export const BRAND = {
  name: "La Voz de la Tierra",
  sub: "El Disco de Oro · Voyager 1 y 2",
  launched: "1977",
  legal: "Demo de la librería Trama: una web narrativa de ejemplo, no una web oficial de la misión Voyager.",
};

/** La ficha del objeto: lo que de verdad se sabe del disco, en pareja de clave y valor. */
export const FACTS = [
  { k: "Lanzamiento", v: "1977 · Voyager 2 primero (20-08) y Voyager 1 después (05-09)" },
  { k: "Contenido", v: "115 imágenes · 90 min de música · 55 saludos · los sonidos de la Tierra" },
  { k: "Velocidad", v: "16⅔ rpm, más lenta que la de un vinilo doméstico" },
  { k: "Material", v: "Cobre bañado en oro, con una funda de aluminio grabada" },
  { k: "Portada", v: "La lámina de instrucciones y el mapa de púlsares que sitúa la Tierra" },
];

export type State = "objeto" | "surcos" | "viaje" | "mensaje";

export type Chapter = {
  slug: State;
  /** la palabra que viaja de página a página (SharedText) */
  word: string;
  /** la marca que acompaña a la palabra */
  year: string;
  lede: string;
  body: string[];
  next: State | null;
};

export const CHAPTERS: Chapter[] = [
  {
    slug: "objeto",
    word: "El objeto",
    year: "1977",
    lede: "En 1977 enviamos al espacio una pequeña muestra de lo que significa estar aquí. Dos discos de oro. Un planeta entero por presentar.",
    body: [
      "Doce pulgadas de cobre bañado en oro. Una cubierta de aluminio, una aguja y las instrucciones para reproducirlo a 16⅔ revoluciones por minuto. También un mapa de púlsares: una manera de explicar de dónde venimos sin compartir un idioma.",
      "Un comité presidido por Carl Sagan seleccionó la música, los sonidos, los saludos y las imágenes. El resultado viaja en Voyager 1 y Voyager 2. No sabemos si alguien lo encontrará. Sabemos que quisimos dejar constancia de que estuvimos aquí.",
    ],
    next: "surcos",
  },
  {
    slug: "surcos",
    word: "Surcos",
    year: "1977",
    lede: "No es un mapa del planeta, es una muestra: 90 minutos de música, 115 imágenes, 55 saludos y el ruido que había en el mundo.",
    body: [
      "Elegir fue la parte difícil. ¿Cómo presentar un mundo que tiene océanos, ciudades, muchas lenguas y maneras tan distintas de hacer música? El disco no pretende contarlo todo. Abre una conversación.",
      "Estos son algunos de sus contenidos. Más abajo puedes escuchar los saludos originales: voces humanas grabadas en 1977, sin traducción automática ni recreaciones.",
    ],
    next: "viaje",
  },
  {
    slug: "viaje",
    word: "El viaje",
    year: "1977 → ∞",
    lede: "La distancia no se mide en kilómetros, se mide en horas de luz: la señal de Voyager 1 tarda casi un día en llegar a casa.",
    body: [
      "Voyager 1 se aleja a unos 17 km/s y cruzó la heliopausa en 2012. Voyager 2 la siguió en 2018. Las dos continúan su camino por el espacio interestelar, con el mismo mensaje sujeto a su estructura.",
      "El 18 de noviembre de 2026 a las 10:16 UTC la señal de Voyager 1 tarda exactamente 24 horas en llegar: la distancia a la Tierra habrá alcanzado los 25.902 millones de km que recorre la luz en un día entero. La web cuenta hacia esa marca.",
    ],
    next: "mensaje",
  },
  {
    slug: "mensaje",
    word: "El mensaje",
    year: "HOY",
    lede: "Si solo pudieras dejar una frase de este planeta, ¿cuál sería? Un saludo, un recuerdo o algo que merezca seguir viajando.",
    body: [
      "Este surco es un ejercicio imaginario, no una nueva misión. Tu frase se queda en este dispositivo. Puedes descargarla como recuerdo, cambiarla o borrarla cuando quieras.",
    ],
    next: null,
  },
];

export const chapter = (slug: string) => CHAPTERS.find((c) => c.slug === slug);

/* ---------------------------------------------------------------- lo que va en el disco */

export type Piece = { title: string; author: string; cap: string };
export type Section = { kicker: string; title: string; cap: string; items: Piece[] };

/** Cortes reales del disco (la lista completa la publica la NASA): cuatro secciones, una por material. */
export const SECTIONS: Section[] = [
  {
    kicker: "Música",
    title: "27 piezas, 90 minutos",
    cap: "La banda la coordinó Timothy Ferris: de la música clásica al rock and roll, sin hilo temático.",
    items: [
      { title: "Concierto de Brandemburgo n.º 2", author: "J. S. Bach", cap: "Primera pieza de la banda" },
      { title: "Cavatina · Cuarteto n.º 13", author: "L. van Beethoven", cap: "La melodía lenta del cuarteto" },
      { title: "Melancholy Blues", author: "Louis Armstrong", cap: "Jazz de Nueva Orleans" },
      { title: "Johnny B. Goode", author: "Chuck Berry", cap: "Rock and roll, letra en inglés" },
      { title: "Dark Was the Night", author: "Blind Willie Johnson", cap: "Una voz y una guitarra" },
      { title: "Chakrulo", author: "Polifonía de Georgia", cap: "Coro de voces, himno de su país" },
      { title: "El Cascabel", author: "Lorenzo Barcelata", cap: "México, la guitarra por delante" },
    ],
  },
  {
    kicker: "Saludos",
    title: "55 lenguas",
    cap: "Voces de distintas comunidades, reunidas por Linda Salzman Sagan. La grabación original puede escucharse aquí.",
    items: [
      { title: "Español", author: "Un saludo para todos", cap: "Una voz cotidiana dirigida al universo" },
      { title: "Inglés", author: "Los niños del planeta Tierra", cap: "Un saludo pronunciado por un niño" },
      { title: "Acadio", author: "Una lengua antigua", cap: "También las lenguas del pasado tienen un lugar" },
      { title: "Mandarín", author: "Una invitación", cap: "El deseo de que alguien pueda visitarnos" },
    ],
  },
  {
    kicker: "Sonidos",
    title: "Los sonidos de la Tierra",
    cap: "Oleaje, viento, aves, ballenas, máquinas y personas: un retrato del planeta hecho de sonido.",
    items: [
      { title: "Trueno y lluvia", author: "Naturaleza", cap: "Lo que humedece y lo que descarga" },
      { title: "Olas y viento", author: "Naturaleza", cap: "Dos estados del mar y del aire" },
      { title: "Fuego y animales", author: "Naturaleza", cap: "Una cosa llamando a la otra" },
      { title: "Pájaros y delfines", author: "Fauna", cap: "Los que hablan entre sí" },
      { title: "Un tren al pasar", author: "Mecánica", cap: "El ruido no natural" },
      { title: "Una madre y su bebé", author: "Personas", cap: "Lo primero que la mayoría oímos" },
    ],
  },
  {
    kicker: "Imágenes",
    title: "115 imágenes",
    cap: "Cada imagen va codificada en los surcos: la portada explica el código, la lámina enseña cómo se lee.",
    items: [
      { title: "Nuestro lugar", author: "Astronomía", cap: "El Sol, los planetas y las magnitudes que compartimos" },
      { title: "La vida", author: "Biología", cap: "La estructura del ADN y la anatomía humana" },
      { title: "Lo cotidiano", author: "Cultura", cap: "Comida, construcción, transporte y encuentros" },
    ],
  },
];

/* ---------------------------------------------------------------- el viaje */

export type Milestone = { year: string; title: string; body: string };

export const MILESTONES: Milestone[] = [
  { year: "1977", title: "Se van", body: "El 20 de agosto sale la Voyager 2; el 5 de septiembre la Voyager 1. Van por rutas distintas, con una misión inicial de cuatro años." },
  { year: "1979–1989", title: "Los planetas", body: "Las dos naves pasan por Júpiter y Saturno; Voyager 2 sigue hasta Urano y Neptuno. Los discos van con ellas todo el tiempo." },
  { year: "1990", title: "La última foto", body: "El 14 de febrero Voyager 1 vuelve la mirada: la Tierra como un píxel, a 6.000 millones de km. Es la última vez que ve un planeta de la casa." },
  { year: "2012 · 2018", title: "La heliopausa", body: "Voyager 1 cruza la heliopausa el 25 de agosto de 2012; Voyager 2 lo hace el 5 de noviembre de 2018. Son los primeros objetos hechos por nosotros fuera de la burbuja del Sol." },
  { year: "2026", title: "Un día luz", body: "El 18 de noviembre a las 10:16 UTC la señal de Voyager 1 tarda exactamente 24 horas en llegar: 25.902 millones de km. Es un día luz de distancia." },
  { year: "≈ 40.000 años", title: "Otra estrella", body: "Voyager 1 pasará cerca de Gliese 445, una estrella pequeña de la Girafe. Y el disco quedará en otra sombra." },
];

/** El momento al que conduce la web: un día luz, alcanzado el 18-11-2026 a las 10:16:07 UTC. */
export const LIGHT_DAY = "2026-11-18T10:16:07Z";
export const LIGHT_DAY_CHIP = "2026-11-18 · 10:16 UTC";

/** La ficha del viaje, para MetaTable (valores de NASA/JPL, 2026). */
export const TRIP = [
  { k: "Un día luz", v: "≈ 25.902 millones de km" },
  { k: "En ese hito", v: "24 h de ida · al menos 48 h para recibir respuesta a una orden" },
  { k: "Velocidad", v: "~17 km/s (V1): es la señal, no la nave, la que tarda casi un día" },
  { k: "Fuera de la burbuja del Sol", v: "Heliopausa · Voyager 1 en 2012 · Voyager 2 en 2018" },
];

/* ---------------------------------------------------------------- el mensaje final */

export const FINAL = {
  title: "Ponerla en el disco",
  cap: "Escribe una frase corta, un saludo o una única palabra. La guardamos aquí, en tu navegador, y no se envía a ningún sitio.",
  placeholder: "Una frase corta. No tiene que ser bonita.",
  note: "Solo se guarda en este dispositivo. No se envía al espacio ni a ningún servidor.",
  cardKicker: "SURCO 001 · 2026",
  cardTitle: "Tu frase, en el surco",
  again: "Escribir otra",
  home: "Volver al principio",
  prompts: [
    "Aquí aprendimos a escuchar.",
    "Todavía nos sorprende el mar.",
    "Ojalá encuentres un lugar al que llamar casa.",
  ],
};

export const FICTION = [
  "El «Disco de Oro II» que se sugiere aquí es ficción y lo decimos: no lo vamos a grabar y no hay un equipo que lo escuche.",
];
