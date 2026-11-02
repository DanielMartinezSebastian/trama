/* Datos de Zanco (docs/58): mueble inventado con sus colores, materiales, premios y artículos. Datos puros. */

const I = "/img/inspiraciones/zanco/";
export const FOTOS = { taller: `${I}taller.webp`, casa: `${I}casa.webp`, material: `${I}material.webp` };

export type Color = { id: string; n: string; c: string; fondo: string };
export const COLORES: Color[] = [
  { id: "limon", n: "Limón", c: "#f4d21f", fondo: "#3c3c3c" },
  { id: "tomate", n: "Tomate", c: "#d8391f", fondo: "#e7e2da" },
  { id: "lavanda", n: "Lavanda", c: "#b29de0", fondo: "#e7e2da" },
  { id: "oliva", n: "Oliva", c: "#7f8a2c", fondo: "#cdc0b0" },
  { id: "tinta", n: "Tinta", c: "#2a2a2a", fondo: "#cdc0b0" },
];

export type Forma = "silla" | "taburete" | "mesa" | "banco" | "perchero";
export type Mueble = { id: string; n: string; forma: Forma; precio: number; colores: string[]; lema: string; texto: string; medidas: string; peso: string };
export const MUEBLES: Mueble[] = [
  { id: "ciguena", n: "Cigüeña", forma: "silla", precio: 329, colores: ["limon", "tomate", "lavanda", "tinta"], lema: "La silla que se apila", texto: "Una sola pieza de plástico de redes de pesca. Se flexiona contigo cuando te recuestas y se apila de ocho en ocho.", medidas: "46 × 52 × 82 cm", peso: "3,8 kg" },
  { id: "garza", n: "Garza", forma: "taburete", precio: 189, colores: ["limon", "oliva", "tinta"], lema: "Alto y sin vergüenza", texto: "Para barras, para hablar con quien cocina y para ponerse los zapatos.", medidas: "38 × 38 × 75 cm", peso: "2,6 kg" },
  { id: "flamenco", n: "Flamenco", forma: "mesa", precio: 450, colores: ["tomate", "lavanda", "tinta"], lema: "Una pata de más", texto: "Mesa auxiliar de tres patas que aguanta en suelos torcidos.", medidas: "60 × 60 × 45 cm", peso: "6,2 kg" },
  { id: "pato", n: "Pato", forma: "banco", precio: 520, colores: ["oliva", "tomate", "limon"], lema: "Sitio para tres y un bolso", texto: "Banco de recibidor, de pie de cama o de ducha. Da igual, se moja bien.", medidas: "120 × 36 × 44 cm", peso: "8,1 kg" },
  { id: "avestruz", n: "Avestruz", forma: "perchero", precio: 240, colores: ["tinta", "lavanda", "limon"], lema: "Cuelga lo que quieras", texto: "Seis ganchos que no te sacan un ojo.", medidas: "45 × 45 × 170 cm", peso: "4,4 kg" },
];

export const PREMIOS: { g: string; l: [string, string][] }[] = [
  { g: "Diseño", l: [["Premio Mueble del Atlántico · Mobiliario", "2025"], ["Pata de Oro · Sostenibilidad", "2024"], ["Silla Abierta · Mención", "2023"]] },
  { g: "Sostenibilidad", l: [["Etiqueta Verde · Oro", "2025"], ["Premio Redes Limpias", "2024"]] },
  { g: "Prensa", l: [["Mueble del año, Revista Casa", "2025"], ["Lo mejor de la feria, Diario Hábitat", "2024"]] },
];

export const ENTRADAS = [
  { id: "de-red-a-silla", t: "De red de pesca a silla", d: "Dónde acaba lo que sale del mar.", img: FOTOS.material, c: "Cada Cigüeña lleva 1,2 kg de redes recogidas en la lonja de Burela, trituradas y moldeadas en Vigo." },
  { id: "por-que-se-mueve", t: "Por qué se mueve tu silla", d: "Una silla rígida cansa antes.", img: FOTOS.casa, c: "Una silla que cede cinco grados obliga a la espalda a moverse un poco. Eso es todo el secreto." },
];

export const FAQ = [
  "¿Cuánto tarda?|Entre tres y cinco días en la península.",
  "¿Y si no me gusta?|Tienes treinta días para devolverlo, nosotros pasamos a recogerlo.",
  "¿Se puede usar fuera?|Sí, todo es resistente a la intemperie.",
  "¿Y cuando se rompa?|Te lo recompramos a peso y vuelve a ser silla.",
].join("\n");

export const PAGINAS = [
  { path: "tienda", titulo: "Tienda" },
  ...MUEBLES.map((m) => ({ path: `tienda/${m.id}`, titulo: m.n })),
  { path: "pedido", titulo: "Pedido" },
  { path: "nosotros", titulo: "Nosotros" },
  { path: "blog", titulo: "Blog" },
  ...ENTRADAS.map((e) => ({ path: `blog/${e.id}`, titulo: e.t })),
  { path: "preguntas", titulo: "Preguntas" },
];
