import type { BriefService } from "@/components/ui/BriefFlow";

/* Datos de Cénit (docs/56): los doce proyectos con su ficha, el proceso del estudio y lo que se puede pedir. Datos puros. */

const I = "/img/inspiraciones/cenit/";

export type Proyecto = { id: string; titulo: string; img: string; tags: string[]; cliente: string; ano: string; texto: string; hicimos: string };

const p = (id: string, titulo: string, img: string, tags: string, cliente: string, ano: string, texto: string, hicimos: string): Proyecto => ({ id, titulo, img: `${I}${img}`, tags: tags.split(" · "), cliente, ano, texto, hicimos });

export const PROYECTOS: Proyecto[] = [
  p("sora", "Arroz Sora · asistente", "proyecto-sora.webp", "Concepto · Web · Diseño · Desarrollo · 3D · Animación", "Arroces Sora", "2026", "Un asistente que te enseña a cocinar arroz con un grano de arroz que habla. La web es la cocina: cada paso de la receta mueve la cámara.", "Un personaje en 3D que responde con voz y una escena por paso de receta."),
  p("atlas", "Atlas, movimiento", "proyecto-atlas.webp", "Concepto · Web · Diseño · Desarrollo · 3D", "Atlas Sport", "2026", "El lanzamiento de una zapatilla contado como un mapa de calor del cuerpo en movimiento.", "Captura de movimiento convertida en partículas que siguen al scroll."),
  p("delta", "Delta, agente de código", "proyecto-delta.webp", "Web · Diseño · Desarrollo · 3D", "Delta Labs", "2025", "Un agente que programa por ti, explicado como una ciudad que se construye sola.", "Una ciudad procedural que crece con cada línea del ejemplo."),
  p("roble", "Roble", "proyecto-roble.webp", "Web · Diseño · Desarrollo · 3D · Animación", "Bodegas Roble", "2025", "Cien años de una bodega en un solo árbol que crece mientras bajas.", "Un roble en 3D con sus anillos como capítulos de la historia."),
  p("trueque", "Trueque", "proyecto-trueque.webp", "Concepto · Web · Diseño · Desarrollo · 3D", "Trueque", "2025", "Una plataforma de intercambio de objetos que se presenta como un mercadillo flotante.", "Puestos que se reordenan según lo que buscas."),
  p("maquina", "Máquina de sueños", "proyecto-maquina.webp", "Concepto · Ilustración 3D · Movimiento · Web", "Festival Onírico", "2024", "La imagen de un festival de cine fantástico: una máquina que fabrica sueños con las películas de la edición.", "Ilustración 3D animada y una web que funciona como programa."),
  p("humano", "Humano sintético", "proyecto-humano.webp", "Web · Diseño · Desarrollo · 3D", "Museo de la Ciencia", "2024", "Una exposición sobre inteligencia artificial que empieza en la web y acaba en la sala.", "Un rostro generado que reacciona a la cámara del visitante."),
  p("fusion", "Fusión espacial", "proyecto-fusion.webp", "Web · Diseño · Desarrollo · 3D", "Agencia Espacial", "2024", "Divulgar la fusión nuclear sin una sola fórmula en pantalla.", "Un reactor que puedes desmontar pieza a pieza."),
  p("orbita", "Galería Órbita", "proyecto-orbita.webp", "Web · Diseño · Desarrollo · 3D", "Galería Órbita", "2023", "Una galería de arte digital que gira alrededor del visitante.", "Salas en anillo con obras que cargan al acercarse."),
  p("festival", "Festival DDD", "proyecto-festival.webp", "Web · Diseño · Desarrollo · 3D", "DDD", "2023", "Un festival de diseño con un escenario que cambia con cada ponente.", "Un escenario en 3D configurable y el programa en directo."),
  p("chucu", "Mundo Chucu", "proyecto-chucu.webp", "Concepto · Web · Diseño de juego · 3D", "Chucu", "2023", "Un juego de navegador para una marca de golosinas.", "Un mundo pequeño con tres minijuegos y ranking."),
  p("refresco", "Refresco en realidad aumentada", "proyecto-refresco.webp", "RA · Desarrollo · 3D", "Refrescos Brisa", "2022", "La lata que, enfocada con el móvil, se convierte en una playa.", "Experiencia de realidad aumentada en la web, sin app."),
];

export const ETIQUETAS = ["3D", "Web", "Concepto", "Animación", "RA", "Diseño de juego"];

export const PROCESO = [
  { n: "01", t: "Descubrir", d: "Escuchamos, investigamos y encontramos la idea que solo tu marca puede contar." },
  { n: "02", t: "Dirigir", d: "Guion, referencias y un primer prototipo jugable en dos semanas." },
  { n: "03", t: "Construir", d: "Diseño, 3D y desarrollo en el mismo equipo: nada se pierde entre departamentos." },
  { n: "04", t: "Pulir", d: "Rendimiento en móviles modestos, accesibilidad y el último 10 % que se nota." },
];

export const PETICIONES: BriefService[] = [
  { label: "Web inmersiva", hint: "lanzamientos, marcas y campañas" },
  { label: "Experiencia 3D", hint: "configuradores, mundos y juegos" },
  { label: "Realidad aumentada", hint: "en la web, sin instalar nada" },
  { label: "Animación y reel", hint: "piezas para redes y eventos" },
];

export const PAGINAS = [
  { path: "proyectos", titulo: "Proyectos" },
  ...PROYECTOS.map((x) => ({ path: `proyectos/${x.id}`, titulo: x.titulo })),
  { path: "estudio", titulo: "Estudio" },
  { path: "contacto", titulo: "Contacto" },
];
