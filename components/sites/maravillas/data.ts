/** Maravillas — gabinete de curiosidades en Albarracín (ficticio). Una historia interactiva entre rutas: cuatro piezas 3D
 * perdidas en una tormenta, una sala y un juego por pieza, y pistas que pasan de una sala a otra (docs/24). Datos puros. */

export const SLUG = "maravillas";

export const meta = {
  slug: SLUG,
  name: "Maravillas",
  title: "Maravillas · un gabinete de curiosidades que hay que recomponer",
  blurb:
    "Historia interactiva entre rutas con diseño editorial de letras grandes: cuatro piezas 3D reales (un nautilo, un amonites escaneado por un museo, un astrolabio y un reloj de bolsillo con sus agujas) se perdieron en una tormenta de 1894. Cada sala es una ruta con un juego (girar la concha hasta su espiral, rascar el sedimento, apuntar la alidada a una estrella, poner el reloj en hora) y la pista de una sala resuelve la siguiente. Las piezas viajan entre rutas: del índice a su sala, de la sala al estante de la cabecera y del estante a la vitrina final (Traveler, SharedText, ScratchReveal).",
  accent: "#c8412b",
  tag: "historia interactiva · 3D · juegos",
};

export type RoomSlug = "mar" | "tierra" | "cielo" | "tiempo";

export const ROUTES = [
  { path: "", title: "Prólogo" },
  { path: "sala/mar", title: "Sala I · Mar" },
  { path: "sala/tierra", title: "Sala II · Tierra" },
  { path: "sala/cielo", title: "Sala III · Cielo" },
  { path: "sala/tiempo", title: "Sala IV · Tiempo" },
  { path: "vitrina", title: "Vitrina" },
];

export const BRAND = {
  name: "Maravillas",
  long: "Gabinete Maravillas",
  legal: "Gabinete Maravillas (museo ficticio de demostración)",
  city: "Albarracín",
  founded: "1871",
  collector: "Fermín Ordás",
};

/** La hora a la que se paró todo (la da el astrolabio y la pide el reloj): 3:40 → 220 minutos en la esfera de 12 h. */
export const STORM_MINUTES = 3 * 60 + 40;
export const STORM_TIME = "3:40";
/** La estrella que hay que mirar (la dice la piedra). */
export const STAR = "Vega";

export type Model = { src: string; title: string; author: string; license: string; page: string; scan?: string };

export type Room = {
  slug: RoomSlug;
  n: string;
  /** la palabra gigante de la sala */
  word: string;
  piece: string;
  game: string;
  /** cómo se juega, en una línea */
  how: string;
  lede: string;
  body: string[];
  facts: { k: string; v: string }[];
  /** lo que aparece al ganar: la pista para la sala siguiente */
  clue: string;
  model: Model;
};

export const ROOMS: Room[] = [
  {
    slug: "mar",
    n: "I",
    word: "Mar",
    piece: "El nautilo",
    game: "La espiral",
    how: "Arrastra la concha hasta verla de frente, como en el dibujo del cuaderno.",
    lede: "Ordás la dibujó cuarenta veces en su cuaderno. Decía que la espiral era la firma del mar.",
    body: [
      "El nautilo crece hacia fuera y cierra a su espalda cada cámara que deja: la concha es un calendario de su vida. Cada vuelta, la espiral se hace unas tres veces más ancha.",
      "No es la proporción áurea, aunque lo repitan los carteles: una espiral áurea crecería casi siete veces por vuelta. Ordás lo midió con un compás y lo anotó al margen, subrayado dos veces.",
    ],
    facts: [
      { k: "Pieza", v: "Concha de Nautilus pompilius" },
      { k: "Crecimiento", v: "≈ ×3 por vuelta" },
      { k: "Juego", v: "Ponerla de frente" },
    ],
    clue: "Dentro de la última cámara había un papel enrollado: «La piedra dirá a quién mirar».",
    model: { src: "/models/nautilo/nautilo-transformed.glb", title: "Nautilus shell", author: "Hailey Majewski", license: "CC BY 4.0", page: "https://sketchfab.com/3d-models/nautilus-shell-ca29276e0659491eb4c5e6eb9d2ae0fc" },
  },
  {
    slug: "tierra",
    n: "II",
    word: "Tierra",
    piece: "El amonites",
    game: "La excavación",
    how: "Rasca el sedimento con el ratón o con el dedo hasta sacar la piedra.",
    lede: "La tormenta la tiró al patio y el barro la tapó entera. Hay que sacarla como la sacaron la primera vez.",
    body: [
      "Un amonites es el molde de un animal que nadaba hace unos 160 millones de años, en el Jurásico superior. Pariente lejano del nautilo: misma idea de concha con cámaras, otro final.",
      "Este ejemplar (Euaspidoceras) lo escanearon de verdad los Museos Virtuales de Malopolska y lo publicaron en dominio público. Ordás grabó algo en la matriz de la roca, junto al fósil.",
    ],
    facts: [
      { k: "Pieza", v: "Euaspidoceras paucituberculatum" },
      { k: "Edad", v: "Oxfordiense, ≈ 160 Ma" },
      { k: "Juego", v: "Rascar el sedimento" },
    ],
    clue: "Grabado en la roca, junto al fósil: VEGA.",
    model: { src: "/models/amonites/amonites-transformed.glb", title: "Ammonite Euaspidoceras paucituberkulatum Arkell", author: "Virtual Museums of Małopolska", license: "CC0", page: "https://sketchfab.com/3d-models/ammonite-euaspidoceras-paucituberkulatum-arkell-617f27f8364d4c908ec1c4e94967858f", scan: "Escaneo de museo" },
  },
  {
    slug: "cielo",
    n: "III",
    word: "Cielo",
    piece: "El astrolabio",
    game: "La altura",
    how: "Gira la alidada (la regla de latón) hasta la estrella que dice la piedra y suelta.",
    lede: "Con un astrolabio se sabía la hora de noche: se apuntaba a una estrella con la alidada y la altura daba la hora.",
    body: [
      "Es un mapa del cielo en latón. Se cuelga de la anilla, se mira a la estrella a lo largo de la regla y su altura sobre el horizonte, cruzada con la red de estrellas, dice qué hora es.",
      "Este astrolabio plano también es un escaneo de museo. Ordás lo usó la noche de la tormenta: apuntó a una estrella y anotó la hora antes de que se fuera la luz.",
    ],
    facts: [
      { k: "Pieza", v: "Astrolabio plano" },
      { k: "Para", v: "La hora por las estrellas" },
      { k: "Juego", v: "Apuntar a una estrella" },
    ],
    clue: `Al margen del cuaderno, con la letra temblando: «${STAR}, a su altura de las ${STORM_TIME}».`,
    model: { src: "/models/astrolabio/astrolabio-transformed.glb", title: "Planispheric astrolabe", author: "Virtual Museums of Małopolska", license: "CC BY 4.0", page: "https://sketchfab.com/3d-models/planispheric-astrolabe-f6dac1748e964711ad4331767317d7b9", scan: "Escaneo de museo" },
  },
  {
    slug: "tiempo",
    n: "IV",
    word: "Tiempo",
    piece: "El reloj",
    game: "La hora",
    how: "Arrastra alrededor de la esfera para mover las agujas y ponlo a la hora de la tormenta.",
    lede: "Se paró con el primer trueno y nadie se atrevió a darle cuerda. Vuelve a andar si le devuelves su hora.",
    body: [
      "Un reloj de bolsillo con tapa: la minutera y la horaria son piezas sueltas del modelo, así que se mueven como en uno de verdad. Al dar una vuelta entera a la minutera, la horaria avanza una hora.",
      "Para Ordás, el gabinete entero era una forma de parar el tiempo: guardar lo que el mar, la tierra y el cielo tardan siglos en hacer. Esta es la última pieza.",
    ],
    facts: [
      { k: "Pieza", v: "Reloj de bolsillo con tapa" },
      { k: "Mecanismo", v: "Agujas articuladas" },
      { k: "Juego", v: "Ponerlo en hora" },
    ],
    clue: "El reloj vuelve a andar. El gabinete está completo.",
    model: { src: "/models/reloj-bolsillo/reloj-bolsillo-transformed.glb", title: "Vintage pocket watch", author: "adsky_pes", license: "CC BY 4.0", page: "https://sketchfab.com/3d-models/vintage-pocket-watch-2e60626f61ba43e9b295ec27b4f56180" },
  },
];

export const getRoom = (slug: string) => ROOMS.find((r) => r.slug === slug);

/** Las estrellas del juego del cielo: ángulo sobre el horizonte del astrolabio (grados, 0 = derecha, 90 = arriba). */
export const STARS = [
  { name: "Capella", deg: 28 },
  { name: "Deneb", deg: 62 },
  { name: "Vega", deg: 98 },
  { name: "Altair", deg: 131 },
  { name: "Arturo", deg: 158 },
];

export const PROLOGUE = [
  `La noche del 22 de octubre de 1894 una tormenta reventó la claraboya del gabinete de ${BRAND.collector}, en ${BRAND.city}. Por la mañana faltaban cuatro maravillas: una concha, una piedra, un instrumento y un reloj.`,
  "El reloj del vestíbulo se paró con el primer trueno y nadie apuntó la hora. Eres la nueva persona a cargo del gabinete: recupera las cuatro, sala por sala. Cada una esconde la pista de la siguiente.",
];
