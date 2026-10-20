import { photo } from "@/lib/sites/photos";
import { video } from "@/lib/sites/videos";
import type { GuideHero, GuideStory } from "@/lib/ui/guides";

/**
 * Contenido de ejemplo de /guias: una marca ficticia (Albor, lámparas y proyectos de luz natural) contada igual en todas las
 * guías, para que lo único que cambie entre versiones sea el sistema (guía), la composición y el relato.
 */
const ph = (topic: Parameters<typeof photo>[0], i: number) => {
  const p = photo(topic, i);
  return { src: p.src, alt: p.title };
};

export const CONTENT = {
  brand: "Albor",
  nav: ["Colección", "Proyectos", "Estudio", "Contacto"],
  eyebrow: "Luz natural · desde 2014",
  titleLines: ["Luz que", "llega lejos"],
  title: "Luz que llega lejos",
  titleEm: "Luz que *llega* lejos",
  sub: "Menos consumo, más calma.",
  lead: "Diseñamos lámparas y espacios que aprovechan la luz del día. Menos consumo, más calma, y casas que se leen sin encender nada.",
  cta: "Ver colección",
  cta2: "Hablar con el estudio",
  manifesto:
    "Creemos que la mejor lámpara es la que no hace falta encender. Por eso empezamos cada proyecto mirando por la ventana: dónde sale el sol, qué rebota, qué se queda en sombra. Después dibujamos, medimos y construimos lo justo para que la luz llegue más lejos.",
  features: [
    { title: "Orientación", text: "Estudiamos el recorrido del sol en tu parcela antes de proponer una sola pieza." },
    { title: "Materiales", text: "Vidrio reciclado, latón sin lacar y madera de la zona: envejecen bien y se reparan." },
    { title: "Mantenimiento", text: "Cinco años de revisión incluidos. Si algo falla, lo arreglamos en el taller." },
  ],
  stats: [
    { value: "12", label: "años de oficio" },
    { value: "340", label: "proyectos entregados" },
    { value: "−38 %", label: "consumo eléctrico medio" },
  ],
  data: ["LAT 36,5° N", "LUX 12 400", "CO₂ −2,1 t/año"],
  quote: { text: "Entramos en casa y no encendimos una luz hasta las nueve de la noche.", by: "Clara R., Cádiz" },
  offer: { title: "Estudio de luz gratuito", text: "Te visitamos, medimos y te enviamos un plano de luz con presupuesto en dos semanas.", items: ["Visita y medición", "Plano de luz natural", "Propuesta de piezas", "Presupuesto cerrado"] },
  projects: [
    { title: "Casa Levante", meta: "Vivienda", year: "2026", ...ph("arquitectura", 0) },
    { title: "Biblioteca Sur", meta: "Equipamiento", year: "2025", ...ph("interiores", 1) },
    { title: "Hotel Pinar", meta: "Hostelería", year: "2025", ...ph("interiores", 3) },
    { title: "Taller Ría", meta: "Industria", year: "2024", ...ph("arquitectura", 2) },
    { title: "Mirador 7", meta: "Espacio público", year: "2023", ...ph("arquitectura", 4) },
  ],
  timeline: [
    { year: "2014", title: "Primer taller", text: "Dos personas y un horno de vidrio en una nave de Cádiz." },
    { year: "2017", title: "Primera colección", text: "Seis lámparas de latón y vidrio soplado, todas reparables." },
    { year: "2021", title: "Estudio de proyectos", text: "Empezamos a diseñar la luz de casas enteras, no solo piezas." },
    { year: "2026", title: "Fábrica solar", text: "El taller funciona con la luz que estudia: cero kilovatios de la red." },
  ],
  chapters: [
    { title: "Observar", text: "Pasamos un día entero en el sitio. Anotamos cada hora qué entra por cada hueco." },
    { title: "Medir", text: "Luxómetro, plano y maqueta: sabemos cuánta luz llega a cada rincón antes de proponer nada." },
    { title: "Construir", text: "Solo añadimos lo que falta: una claraboya, un reflector, una lámpara que no se note." },
  ],
  states: [
    { title: "Amanecer", text: "La luz entra rasante y templada; el latón la devuelve hacia el techo." },
    { title: "Mediodía", text: "El vidrio difusor reparte la luz cenital sin deslumbrar." },
    { title: "Tarde", text: "La pieza se apaga sola: la casa ya tiene luz suficiente." },
    { title: "Noche", text: "Un único punto cálido, a la altura de los ojos, para leer." },
  ],
  spots: [
    { x: 22, y: 38, title: "Claraboya", text: "Abre el centro de la casa al cielo." },
    { x: 58, y: 30, title: "Reflector", text: "Una lama de latón que lleva la luz al fondo." },
    { x: 74, y: 64, title: "Lámpara de lectura", text: "La única que se enciende de noche." },
  ],
  before: ph("interiores", 5),
  after: ph("interiores", 2),
  object: ph("objetos", 0),
  collage: [ph("objetos", 1), ph("interiores", 0), ph("arquitectura", 1), ph("objetos", 3)],
  dark: ph("arquitectura", 3),
  wide: ph("interiores", 4),
  video: (() => {
    const v = video("costa", 0);
    return { src: v.src, poster: v.posterSrc, alt: v.alt };
  })(),
  email: "hola@albor.example",
  city: "Cádiz",
};

export type GuideContent = typeof CONTENT;

/** Nombres y fichas de las composiciones (docs/16 §3) y de los relatos (docs/16 §4). */
export const HEROES: { id: GuideHero; code: string; label: string; note: string; refs: string }[] = [
  { id: "split-video", code: "C1", label: "Vídeo a sangre, titular escalonado", note: "Vídeo de fondo, titular en dos líneas sangradas a izquierda y derecha, CTA abajo a la derecha y cabecera en tres puntos.", refs: "Tengile Malamala, Son Daven" },
  { id: "framed-object", code: "C2", label: "Objeto en un marco", note: "El visual dentro de un marco con margen, la marca gigante detrás y el subtítulo en dos tonos abajo; reloj en la cabecera.", refs: "Lidar Drone Scanning, Heron AI" },
  { id: "marquee-window", code: "C3", label: "Rótulo con ventana", note: "Una frase gigante en cinta que pasa por detrás de una foto centrada; frase y chip debajo; barra inferior con CTA.", refs: "Realevate" },
  { id: "asym-editorial", code: "C4", label: "Asimétrico editorial", note: "Foto grande sangrada a la derecha, pieza pequeña con pie en la columna central y vacío a la izquierda.", refs: "Odyssée" },
  { id: "product-center", code: "C5", label: "Producto centrado", note: "Isla de navegación, el objeto entra desde arriba, titular centrado en una línea y un botón.", refs: "Butter, Raycast" },
  { id: "collage-manifesto", code: "C6", label: "Collage y manifiesto", note: "El visual ocupa dos tercios; abajo a la izquierda, un párrafo-titular con etiqueta.", refs: "Pensatori Irrazionali, Pangram Pangram" },
  { id: "dark-data", code: "C7", label: "Foto oscura con datos", note: "Foto a sangre oscurecida, titular a la izquierda, datos en mono flotando y tarjetas de acceso abajo a la derecha.", refs: "CoMinVi, Moto Finance" },
  { id: "wordmark", code: "C8", label: "Marca de borde a borde", note: "La marca llena el ancho; debajo, una franja de foto y el texto en columnas.", refs: "OFFFForum, Neutomni, Lando Norris" },
];

export const STORIES: { id: GuideStory; code: string; label: string; note: string; refs: string }[] = [
  { id: "service", code: "R10", label: "Servicio claro", note: "Promesa → prueba → oferta → acción. Una idea por pantalla.", refs: "Webs de pyme (docs/11)" },
  { id: "chapters", code: "R1", label: "Capítulos fijados", note: "La sección se queda fija y los capítulos se suceden con el scroll.", refs: "Zero, Forged, EXAT" },
  { id: "object", code: "R2", label: "Un objeto que guía", note: "El mismo objeto se queda en pantalla y cambia de estado mientras pasa el texto.", refs: "Heron AI, Trionn, Igloo Inc" },
  { id: "product", code: "R3", label: "Producto en escena", note: "Emoción → comprensión (ventajas) → compra.", refs: "iyO, Aether 1, Moto Finance" },
  { id: "manifesto", code: "R4", label: "Manifiesto tipográfico", note: "Un párrafo que se enciende con el scroll y cifras que lo prueban.", refs: "Obys, Jason Bergh" },
  { id: "index", code: "R5", label: "Índice primero", note: "Directamente los proyectos, con vista previa al pasar el puntero.", refs: "Kononenko, Partizan, Bisous" },
  { id: "world", code: "R6", label: "Mundo explorable", note: "Una imagen que hace de mapa: cada punto abre su historia.", refs: "San Rita, Overworld Audio" },
  { id: "timeline", code: "R7", label: "Línea de tiempo", note: "Un capítulo por año, en horizontal.", refs: "Ten Years Away, Tengile Malamala" },
  { id: "before-after", code: "R8", label: "Antes / después", note: "El estado de antes y el de después, con un deslizador.", refs: "Heron AI, Colonia Zacamil" },
  { id: "webfilm", code: "R9", label: "Webfilm con elecciones", note: "Un billete de entrada y escenas que avanzan con decisiones del usuario.", refs: "Chasing the Moment, The Tie-break" },
];
