/** La Voz de la Tierra — una historia sobre el Disco de Oro de las Voyager en cuatro rutas con un viajero compartido
 * (docs/14 y docs/24). Datos puros: los leen la web y el registro (`lib/sites`). Las cifras y las fechas son las que
 * publica NASA/JPL (misión Voyager); la invitación final («Disco de Oro II») es una ficción y la web lo dice. */

export const SLUG = "voz-de-la-tierra";

export const meta = {
  slug: SLUG,
  name: "La Voz de la Tierra",
  title: "La Voz de la Tierra · el Disco de Oro de las Voyager, en cuatro rutas",
  blurb:
    "Historia narrativa en cuatro rutas sobre el Disco de Oro de las Voyager: el objeto, lo que va grabado en sus surcos (música, imágenes, saludos y sonidos), el viaje que lo dejó a un día luz de casa y una pregunta final. El mismo disco 3D (procedural, sin modelos externos) viaja vivo entre rutas (Traveler), los titulares vuelan palabra a palabra entre páginas (SharedText) y cada ruta entra con una transición propia: iris, barrido, barrido de líneas y fundido.",
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
    lede: "En 1977 la NASA puso en dos naves un disco de oro: no va a ningún sitio determinado. Es una carta sin remite, escrita solo con lo que se puede oír y ver.",
    body: [
      "Es un disco de cobre bañado en oro, de doce pulgadas, girando a 16⅔ rpm (más lento que un vinilo casero). Lo protege una funda de aluminio con las instrucciones grabadas: cómo girarlo, cuánto dura la onda que lleva y, en la lámina superior, el mapa de púlsares que sitúa la posición de nuestra estrella en la galaxia.",
      "En la etiqueta ponía «The Sounds of Earth». El equipo que eligió lo que iba dentro lo encabezó Carl Sagan con Timothy Ferris: música, saludos, sonidos y fotografías. No lleva dirección de vuelta porque no hay una de vuelta: solo hay con quién hablar si alguien lo encuentra.",
    ],
    next: "surcos",
  },
  {
    slug: "surcos",
    word: "Surcos",
    year: "1977",
    lede: "No es un mapa del planeta, es una muestra: 90 minutos de música, 115 imágenes, 55 saludos y el ruido que había en el mundo.",
    body: [
      "Para poner un planeta en un disco alguien tuvo que elegir: qué música lo representa, qué foto lo resume, qué ruido se queda. Todas las decisiones fueron discutidas y ninguna es definitiva. Los discos las van por sus surcos en orden, una banda detrás de otra, y dan instrucciones para leerse.",
      "Aquí van cortes escogidos tal como aparecen en el disco; no es toda la lista, la lista completa la publica la NASA. Y el disco es un objeto público: con un tocadiscos y una aguja fina se lee casi cincuenta años después, tal y como está.",
    ],
    next: "viaje",
  },
  {
    slug: "viaje",
    word: "El viaje",
    year: "1977 → ∞",
    lede: "La distancia no se mide en kilómetros, se mide en horas de luz: la señal de Voyager 1 tarda casi un día en llegar a casa.",
    body: [
      "Voyager 1 se aleja a unos 17 km/s y ya no gira alrededor del Sol: dejó atrás la heliopausa en 2012. No mira nada, solo envía. El disco de oro no es un mapa de cómo volver, es la voz de alguien que salió de casa.",
      "El 18 de noviembre de 2026 a las 10:16 UTC la señal de Voyager 1 tarda exactamente 24 horas en llegar: la distancia a la Tierra habrá alcanzado los 25.902 millones de km que recorre la luz en un día entero. La web cuenta hacia esa marca.",
    ],
    next: "mensaje",
  },
  {
    slug: "mensaje",
    word: "El mensaje",
    year: "HOY",
    lede: "El disco no espera respuesta, pero nosotros sí. Escribimos una frase; la guardamos en tu navegador, no la enviamos.",
    body: [
      "Que no se nos vaya la mano: lo que se propone aquí es una ficción (la llamamos «Disco de Oro II») y no se va a grabar. Pero la pregunta es real: si mañana se grabara otro disco, ¿qué pondrías tú? La web te deja escribirlo.",
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
      { title: "Cavata (Cuarteto de cuerdas n.º 13)", author: "L. van Beethoven", cap: "La melodía lenta del cuarteto" },
      { title: "Melancholy Blues", author: "Louis Armstrong", cap: "El único jazz del disco" },
      { title: "Johnny B. Goode", author: "Chuck Berry", cap: "Rock and roll, letra en inglés" },
      { title: "Dark Was the Night", author: "Blind Willie Johnson", cap: "Una voz y una guitarra" },
      { title: "Chakrulo", author: "Polifonía de Georgia", cap: "Coro de voces, himno de su país" },
      { title: "El Cascabel", author: "Lorenzo Barcelata", cap: "México, la guitarra por delante" },
    ],
  },
  {
    kicker: "Saludos",
    title: "55 lenguas",
    cap: "Es lo primero que se oye: la banda empieza en los saludos, en todas las lenguas que cabían.",
    items: [
      { title: "Hola / Hello", author: "España · EE. UU.", cap: "El hola español y el hello del inglés" },
      { title: "Bonjour / Hallo", author: "Francia · Alemania", cap: "Dos lenguas de contacto" },
      { title: "Jambo", author: "Suajili", cap: "El hola del este de África" },
      { title: "Merhaba", author: "Turquía", cap: "«Bienvenido» en turco" },
      { title: "Salam", author: "Lenguas árabes", cap: "«Paz»" },
      { title: "Los primeros dos saludos", author: "Sumerio · Acadio", cap: "Dos lenguas que ya nadie habla" },
    ],
  },
  {
    kicker: "Sonidos",
    title: "Los sonidos de la Tierra",
    cap: "«The Sounds of Earth»: lo que suena fuera de nuestra casa, en una sola toma.",
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
      { title: "La Tierra desde el espacio", author: "Imagen final", cap: "El planeta tal y como se ve desde arriba" },
      { title: "La anatomía de un ser humano", author: "Una de las primeras", cap: "Lo primero que la imagen enseña" },
      { title: "El ADN", author: "Una de las primeras", cap: "La molécula con la que estamos hechos" },
      { title: "Un supermercado", author: "Una del medio", cap: "Lo que se ve en cualquier lado del mundo" },
      { title: "Una avenida con tráfico", author: "Una del medio", cap: "Cómo se mueve la gente" },
      { title: "La Gran Muralla", author: "Una del medio", cap: "Lo que queda de las civilizaciones" },
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
  { k: "Distancia · Voyager 1", v: "≈ 25,9 mil millones de km (casi un día luz)" },
  { k: "Distancia · Voyager 2", v: "≈ 21,7 mil millones de km" },
  { k: "Velocidad", v: "~17 km/s (V1): es la señal, no la nave, la que tarda casi un día" },
  { k: "Fuera de la burbuja del Sol", v: "Heliopausa · Voyager 1 en 2012 · Voyager 2 en 2018" },
];

/* ---------------------------------------------------------------- el mensaje final */

export const FINAL = {
  title: "Ponerla en el disco",
  cap: "Escribe una frase corta, un saludo o una única palabra. La guardamos aquí, en tu navegador, y no se envía a ningún sitio.",
  placeholder: "Una frase corta. No tiene que ser bonita.",
  note: "Esto es una demo: la frase se queda en tu navegador (localStorage). No hay backend.",
  cardKicker: "SURCO 001 · 2026",
  cardTitle: "Tu frase, en el surco",
  again: "Escribir otra",
  home: "Volver al principio",
  prompts: [
    "Escríbele a quien no entiende este planeta",
    "Un saludo para quien no sepa español",
    "Una frase exacta sobre tu día de hoy",
  ],
};

export const FICTION = [
  "El «Disco de Oro II» que se sugiere aquí es ficción y lo decimos: no lo vamos a grabar y no hay un equipo que lo escuche.",
];
