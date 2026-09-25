/** Metadatos de las demos (sin funciones, seguros para componentes de servidor). */
import { kitLandingDemos } from "./demos-kit-landing";
import { scrollDemos } from "./demos-scroll";
import { themeDemos } from "./demos-themes";
import { textDemos } from "./demos-text";

export type Family = "textmode" | "asciify" | "text" | "scroll" | "landing";

/** Copy de la landing superpuesta en los demos con scroll. */
export type Landing = {
  kicker: string;
  title: string;
  sub: string;
  cta: string;
  features: [string, string][];
  final: string;
};

export type DemoMeta = {
  slug: string;
  family: Family;
  title: string;
  blurb: string;
  /** Cómo interactuar; solo tiene sentido si `reactive` */
  hint: string;
  reactive: boolean;
  accent: string;
  /** Qué librería(s) renderizan; se muestra en la tarjeta */
  lib?: "textmode.js" | "asciify" | "ambas" | "three.js";
  /** Componente de render; por defecto se deduce de la familia. "kit" = landing construida con components/ui/ */
  render?: "textmode" | "asciify" | "layers" | "kit";
  /** Selectores extra junto al cajón de texto (solo demos de texto) */
  controls?: ("font" | "effect")[];
  /** Muestra el cajón de texto aunque no sea de la familia texto */
  text?: boolean;
  /** Landing superpuesta (solo familia scroll) */
  landing?: Landing;
  /** Id de la landing temática (solo familia landing) */
  theme?: string;
};

export const demos: DemoMeta[] = [
  {
    slug: "plasma",
    family: "textmode",
    title: "Plasma",
    blurb: "Interferencia de ondas convertida en rampa de glifos.",
    hint: "Mueve el puntero para deformar el campo · mantén pulsado para ampliar la onda",
    reactive: true,
    accent: "#c084fc",
  },
  {
    slug: "matrix",
    family: "textmode",
    title: "Lluvia digital",
    blurb: "Columnas de caracteres que caen y se descomponen.",
    hint: "El puntero enciende las columnas cercanas · pulsa para ampliar el radio",
    reactive: true,
    accent: "#4ade80",
  },
  {
    slug: "starfield",
    family: "textmode",
    title: "Warp",
    blurb: "Un campo de estrellas en fuga con estelas de caracteres.",
    hint: "El puntero dirige el punto de fuga · mantén pulsado para el hiperespacio",
    reactive: true,
    accent: "#60a5fa",
  },
  {
    slug: "ripples",
    family: "textmode",
    title: "Ondas",
    blurb: "Simulación de agua con ecuación de ondas.",
    hint: "Mueve el puntero para crear ondas · pulsa para soltar una gota grande",
    reactive: true,
    accent: "#22d3ee",
  },
  {
    slug: "life",
    family: "textmode",
    title: "Vida",
    blurb: "El autómata de Conway con estelas de células muertas.",
    hint: "Mueve el puntero para sembrar células · mantén pulsado para sembrar en grande",
    reactive: true,
    accent: "#2dd4bf",
  },
  {
    slug: "flow",
    family: "textmode",
    title: "Campo de flujo",
    blurb: "Ochocientas partículas siguiendo un campo de ruido.",
    hint: "El puntero atrae las partículas · mantén pulsado para repelerlas",
    reactive: true,
    accent: "#818cf8",
  },
  {
    slug: "fire",
    family: "textmode",
    title: "Fuego",
    blurb: "El clásico algoritmo de fuego de Doom en texto.",
    hint: "El puntero es una antorcha · mantén pulsado para un soplete",
    reactive: true,
    accent: "#fb923c",
  },
  {
    slug: "ocean",
    family: "textmode",
    title: "Atardecer",
    blurb: "Sol, horizonte y un reflejo que centellea entre las olas.",
    hint: "Ambiente · sin interacción",
    reactive: false,
    accent: "#f472b6",
  },
  {
    slug: "tunnel",
    family: "textmode",
    title: "Túnel",
    blurb: "Un tablero de ajedrez infinito en perspectiva.",
    hint: "Ambiente · sin interacción",
    reactive: false,
    accent: "#a78bfa",
  },
  {
    slug: "aurora",
    family: "textmode",
    title: "Aurora",
    blurb: "Cortinas de ruido sobre montañas y estrellas.",
    hint: "Ambiente · sin interacción",
    reactive: false,
    accent: "#34d399",
  },
  // ---------- asciify-engine ----------
  {
    slug: "as-lava",
    family: "asciify",
    title: "Lava",
    blurb: "Metaballs de colores convertidas a caracteres con rampa detallada.",
    hint: "Arrastra el puntero: una gota grande te sigue y el hover de agua deforma los caracteres",
    reactive: true,
    accent: "#fb7185",
  },
  {
    slug: "as-synthwave",
    family: "asciify",
    title: "Synthwave",
    blurb: "Sol a franjas y rejilla en perspectiva hechos de puntos con bloom.",
    hint: "Ambiente · sin interacción",
    reactive: false,
    accent: "#f0abfc",
  },
  {
    slug: "as-galaxy",
    family: "asciify",
    title: "Galaxia braille",
    blurb: "Una espiral de estrellas dibujada con caracteres braille.",
    hint: "El puntero desplaza el núcleo y crea un vórtice · pulsa para intensificar",
    reactive: true,
    accent: "#93c5fd",
  },
  {
    slug: "as-bricks",
    family: "asciify",
    title: "Ladrillos",
    blurb: "Olas de color reconstruidas con piezas tipo Lego.",
    hint: "Pasa el puntero: los ladrillos se disuelven y se reordenan",
    reactive: true,
    accent: "#fbbf24",
  },
  {
    slug: "as-voxel",
    family: "asciify",
    title: "Volúmenes",
    blurb: "Plasma convertido en columnas isométricas.",
    hint: "El puntero marca contornos sobre los volúmenes",
    reactive: true,
    accent: "#a3e635",
  },
  {
    slug: "as-disco",
    family: "asciify",
    title: "Sala de espejos",
    blurb: "Caleidoscopio en teselas facetadas con una luz cenital.",
    hint: "Mueve el puntero para girar el caleidoscopio y arrastrar la seda del hover",
    reactive: true,
    accent: "#e879f9",
  },
  {
    slug: "as-dither",
    family: "asciify",
    title: "Dither Game Boy",
    blurb: "Anillos girando con tramado Bayer y paleta de cuatro verdes.",
    hint: "El centro de los anillos sigue al puntero · pulsa para engrosarlos",
    reactive: true,
    accent: "#86efac",
  },
  {
    slug: "as-crt",
    family: "asciify",
    title: "Fósforo CRT",
    blurb: "Palabras deformadas en un monitor verde con scanlines y glitch.",
    hint: "Mover el puntero de izquierda a derecha ondula más las palabras",
    reactive: true,
    accent: "#4ade80",
  },
  {
    slug: "as-mosaic",
    family: "asciify",
    title: "Mosaico",
    blurb: "Un toro de puntos girando, cubierto de teselas de color.",
    hint: "El puntero inclina el toro y ondula el agua del mosaico",
    reactive: true,
    accent: "#22d3ee",
  },
  {
    slug: "as-lines",
    family: "asciify",
    title: "Grabado",
    blurb: "Orbes con estela trazados como líneas de grabado.",
    hint: "El puntero atrae las esferas · pulsa para repelerlas",
    reactive: true,
    accent: "#fdba74",
  },
  {
    slug: "as-spotlight",
    family: "asciify",
    title: "Linterna",
    blurb: "Motor clásico: ASCII a todo color iluminado por una linterna.",
    hint: "Mueve el puntero para iluminar la lava con el efecto linterna",
    reactive: true,
    accent: "#fde68a",
  },
  {
    slug: "as-neon",
    family: "asciify",
    title: "Neón matrix",
    blurb: "Lluvia verde con un cambio de color magenta bajo el puntero.",
    hint: "El puntero tiñe de neón las columnas cercanas y las acelera",
    reactive: true,
    accent: "#d946ef",
  },
  {
    slug: "as-shatter",
    family: "asciify",
    title: "Cristal roto",
    blurb: "Anillos de puntos que se rompen al acercarse el puntero.",
    hint: "Acerca el puntero para fracturar los puntos",
    reactive: true,
    accent: "#fb7185",
  },
  {
    slug: "as-gravity",
    family: "asciify",
    title: "Gravedad",
    blurb: "Galaxia cuyos caracteres son atraídos hacia el puntero.",
    hint: "El puntero atrae los caracteres de la galaxia",
    reactive: true,
    accent: "#60a5fa",
  },
  {
    slug: "as-webcam",
    family: "asciify",
    title: "Espejo (cámara)",
    blurb: "Tu cámara en directo convertida a ASCII a todo color.",
    hint: "Pulsa Activar cámara · el vídeo se procesa localmente",
    reactive: false,
    accent: "#f9a8d4",
  },
  ...textDemos,
  ...scrollDemos,
  ...themeDemos,
  ...kitLandingDemos,
];

export const getDemo = (slug: string) => demos.find((d) => d.slug === slug);
