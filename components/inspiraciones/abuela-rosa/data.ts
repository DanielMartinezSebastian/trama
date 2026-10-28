/* Datos de Abuela Rosa (docs/56): los mojos de la tienda con su tinta para el bote en CSS, recetas e historia. Datos puros. */

export type Mojo = { id: string; nombre: string; etiqueta: string; precio: number; tinta: string; shu: string; picante: number; texto: string; ingredientes: string; tamanos: boolean };

export const MOJOS: Mojo[] = [
  { id: "mojo-picon", nombre: "Mojo picón", etiqueta: "MOJO\nPICÓN", precio: 12, tinta: "linear-gradient(90deg, #a83d10, #f07a32 30%, #ffb070 45%, #e8612c 60%, #9a3610)", shu: "2.400 SHU", picante: 3, texto: "El de siempre: ajo, pimienta palmera, comino y aceite, machacado a mortero. Rojo, espeso y con el fuego al final.", ingredientes: "Aceite de oliva, pimienta palmera, ajo, comino, vinagre de vino, sal y pimentón.", tamanos: true },
  { id: "mojo-verde", nombre: "Mojo verde", etiqueta: "MOJO\nVERDE", precio: 11, tinta: "linear-gradient(90deg, #2f5d18, #6aa83a 30%, #a9d77a 45%, #5c9a2e 60%, #2a5214)", shu: "600 SHU", picante: 1, texto: "Cilantro, perejil y pimiento verde: fresco, suave y para todo, del pescado a las papas.", ingredientes: "Aceite de oliva, cilantro, perejil, pimiento verde, ajo, comino, vinagre y sal.", tamanos: true },
  { id: "mojo-diablo", nombre: "Mojo del diablo", etiqueta: "MOJO\nDEL\nDIABLO", precio: 14, tinta: "linear-gradient(90deg, #4d0a0a, #9c1a14 30%, #d84a32 45%, #8a1710 60%, #3d0707)", shu: "18.000 SHU", picante: 5, texto: "La receta del nieto que se pasó de guindillas. Solo para quien sabe lo que hace.", ingredientes: "Aceite de oliva, guindilla, pimienta palmera, ajo, comino, vinagre y sal.", tamanos: true },
  { id: "trio", nombre: "Los tres de la abuela", etiqueta: "LOS\nTRES", precio: 32, tinta: "linear-gradient(90deg, #a83d10, #f07a32 25%, #6aa83a 50%, #9c1a14 75%, #4d0a0a)", shu: "600 – 18.000", picante: 3, texto: "Picón, verde y diablo en tres botes de 148 ml, en su caja de cartón. Para regalar o para probarlos todos.", ingredientes: "Los tres mojos de la casa.", tamanos: false },
];

export const TAMANOS = [
  { value: "148", label: "148 ml", extra: 0 },
  { value: "250", label: "250 ml", extra: 6 },
];

export type Receta = { id: string; t: string; tiempo: string; raciones: string; mojo: string; ingredientes: string[]; pasos: string[] };

export const RECETAS: Receta[] = [
  { id: "papas-arrugadas", t: "Papas arrugadas con mojo", tiempo: "35 min", raciones: "4", mojo: "mojo-picon", ingredientes: ["1 kg de papas pequeñas", "150 g de sal gorda", "Agua para cubrir", "Mojo picón al gusto"], pasos: ["Lava las papas sin pelarlas y ponlas en una olla con la sal y agua justo para cubrirlas.", "Cuécelas tapadas unos 20 minutos, hasta que se pinchen bien.", "Tira el agua y déjalas al fuego sin tapa, moviendo la olla, hasta que la piel se arrugue y salga la sal.", "Sírvelas con el mojo en un cuenco al lado."] },
  { id: "huevos-rotos", t: "Huevos rotos con mojo verde", tiempo: "25 min", raciones: "2", mojo: "mojo-verde", ingredientes: ["2 patatas grandes", "4 huevos", "Aceite de oliva", "Mojo verde"], pasos: ["Corta las patatas en bastones y fríelas a fuego medio hasta que estén doradas.", "Fríe los huevos con la yema líquida.", "Pon los huevos sobre las patatas, rómpelos y riega con mojo verde."] },
  { id: "pollo-al-diablo", t: "Pollo al mojo del diablo", tiempo: "1 h 10 min", raciones: "4", mojo: "mojo-diablo", ingredientes: ["8 contramuslos de pollo", "4 cucharadas de mojo del diablo", "1 limón", "Sal"], pasos: ["Mezcla el mojo con el zumo de limón y una pizca de sal.", "Embadurna el pollo y déjalo marinar al menos 30 minutos.", "Hornéalo a 200 °C unos 35 minutos, dándole la vuelta a mitad.", "Sírvelo con más mojo para quien se atreva."] },
];

export const HISTORIA = [
  { a: "1976", t: "El mortero de La Orotava", d: "Rosa empieza a hacer el mojo de su madre para las comidas de los domingos." },
  { a: "1998", t: "Media isla lo pide", d: "Los botes de cristal reciclado viajan en maletas a Madrid, Londres y Caracas." },
  { a: "2019", t: "Los nietos se ponen serios", d: "Montan un obrador pequeño sin cambiar la receta: todo sigue a mortero." },
  { a: "2026", t: "De nuestra familia a la tuya", d: "Llega a toda España en botes de 148 y 250 ml." },
];

export const PAGINAS = [
  { path: "tienda", titulo: "Tienda" },
  ...MOJOS.map((m) => ({ path: `tienda/${m.id}`, titulo: m.nombre })),
  { path: "pedido", titulo: "Pedido" },
  { path: "recetas", titulo: "Recetas" },
  ...RECETAS.map((r) => ({ path: `recetas/${r.id}`, titulo: r.t })),
  { path: "historia", titulo: "Historia" },
];
