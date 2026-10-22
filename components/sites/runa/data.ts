/** Runa — web de lanzamiento de un roguelite indie (ficticio) que se juega: la web es una demo con pantalla de título,
 * selección de héroe, dos niveles con minijuego y la victoria con la lista de deseados y el kit de prensa (docs/25). */

export const SLUG = "runa";

export const meta = {
  slug: SLUG,
  name: "Runa",
  title: "Runa · el roguelite de Estudio Musgo, en una demo que se juega en la web",
  blurb:
    "Web de lanzamiento de un videojuego indie que es su propia demo: pantalla de título con el jefe detrás de las letras, selección de héroe entre tres modelos 3D animados (el elegido se queda en el HUD de todas las páginas), un cofre que se abre forzando la cerradura (SkillCheck) y suelta una runa (la gema de Quilate) que vuela al inventario, y el jefe, que viaja desde la portada, al que solo se le hace daño con la runa. Transiciones duras entre rutas (pixelado, glitch, barrido de líneas), cartel de nivel y temblor de pantalla; marcador, lista de deseados y kit de prensa.",
  accent: "#ff2e63",
  tag: "videojuego · 3D · minijuegos",
};

export const ROUTES = [
  { path: "", title: "Título" },
  { path: "heroe", title: "Elige héroe" },
  { path: "nivel-1", title: "Nivel 1 · La cámara" },
  { path: "nivel-2", title: "Nivel 2 · El trono" },
  { path: "victoria", title: "Victoria · prensa" },
];

export const BRAND = {
  game: "Runa",
  studio: "Estudio Musgo",
  city: "Bilbao",
  legal: "Estudio Musgo (estudio ficticio de demostración)",
  email: "prensa@musgo.example",
  release: "Primavera de 2027",
  platforms: "PC · Mac · Steam Deck",
  price: "14,99 €",
};

export type ModelCredit = { title: string; author: string; license: string; page: string };

export type HeroId = "caballero" | "doctora" | "exploradora";
export type Hero = {
  id: HeroId;
  name: string;
  role: string;
  line: string;
  /** fuerza, magia y agilidad (0–5) */
  stats: [number, number, number];
  src: string;
  /** cuánto pesa su golpe contra el jefe (puntos de vida por acierto) */
  hit: number;
  /** mallas del modelo que no se pintan */
  hide?: string[];
  model: ModelCredit;
};

export const HEROES: Hero[] = [
  {
    id: "caballero",
    name: "Sir Ánker",
    role: "Caballero de la Orden",
    line: "Pega fuerte y aguanta más. Lento con las cerraduras.",
    stats: [5, 1, 2],
    src: "/models/caballero/caballero-transformed.glb",
    hit: 26,
    model: { title: "knight of the blood order", author: "DJMaesen", license: "CC BY 4.0", page: "https://sketchfab.com/3d-models/knight-of-the-blood-order-98a655cb943d41d68974848ac2409559" },
  },
  {
    id: "doctora",
    name: "La Doctora",
    role: "Médica de la peste",
    line: "Sus pociones abren lo que no abre una llave.",
    stats: [2, 5, 3],
    src: "/models/doctor-peste/doctor-peste-transformed.glb",
    hit: 20,
    model: { title: "Plague Doctor", author: "BeardenInc", license: "CC BY 4.0", page: "https://sketchfab.com/3d-models/plague-doctor-41f7a1dfd6984135b876f334908e3ca4" },
  },
  {
    id: "exploradora",
    name: "Iru",
    role: "Exploradora",
    line: "Rápida con las manos y con los pies. Golpe ligero.",
    stats: [2, 2, 5],
    src: "/models/exploradora/exploradora-transformed.glb",
    hit: 20,
    // trae una peana verde chillón que no casa con la mazmorra
    hide: ["Cylinder001_Material001_0"],
    model: { title: "Explorer", author: "Bento", license: "CC BY 4.0", page: "https://sketchfab.com/3d-models/explorer-0c702359f0594f08b2a1e7b8d1f01d67" },
  },
];
export const getHero = (id: string | null | undefined) => HEROES.find((h) => h.id === id);

export const CHEST = {
  src: "/models/cofre/cofre-transformed.glb",
  model: { title: "Treasure Chest", author: "Multipainkiller Studio", license: "CC BY 4.0", page: "https://sketchfab.com/3d-models/treasure-chest-b124919b7bc3470c82daeef72823f941" },
};
export const BOSS = {
  name: "El Señor de los Huesos",
  src: "/models/senor-esqueleto/senor-esqueleto-transformed.glb",
  hp: 100,
  model: { title: "Skeleton Lord", author: "DJMaesen", license: "CC BY 4.0", page: "https://sketchfab.com/3d-models/skeleton-lord-a3f7b44275cf4c489ad62c535268ac16" },
};

/** puntos */
export const SCORE = { pin: 100, chest: 500, hit: 250, boss: 2000, heart: 300 };
export const HEARTS = 3;

export const FEATURES = [
  { k: "01", t: "Mazmorras que cambian", d: "Cada partida, otra planta. Las salas, los cofres y los jefes se barajan." },
  { k: "02", t: "Tres héroes, tres formas de jugar", d: "Fuerza, magia o manos rápidas: cambia cómo abres, cómo peleas y qué te llevas." },
  { k: "03", t: "Runas que se combinan", d: "Las runas del botín se engarzan en el arma y cambian sus golpes." },
  { k: "04", t: "Jefes con puntos débiles", d: "Nada de esponjas de vida: hay que mirar dónde golpear." },
];

export const FACTS = [
  { k: "Género", v: "Roguelite de acción" },
  { k: "Plataformas", v: BRAND.platforms },
  { k: "Lanzamiento", v: BRAND.release },
  { k: "Precio", v: BRAND.price },
  { k: "Idiomas", v: "Español, euskera, inglés" },
  { k: "Estudio", v: `${BRAND.studio} · ${BRAND.city}` },
];
