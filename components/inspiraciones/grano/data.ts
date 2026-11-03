/* Datos de Grano (docs/60): productora de contenidos inventada, en Madrid, que hace documentales, campañas, series cortas
   y piezas para apps. Datos puros. */

const I = "/img/inspiraciones/grano/";

export const PAGINAS = [
  { path: "trabajo", titulo: "Trabajo" },
  { path: "info", titulo: "Info" },
  { path: "contacto", titulo: "Contacto" },
  ...["floristeria-ulla", "mar-de-fondo", "talento-unido", "pizarra-verde", "corre-ligero", "canal-cancha", "abrir-persiana", "festival-rail"].map((id) => ({ path: `trabajo/${id}`, titulo: "Proyecto" })),
];

export type Proyecto = { id: string; n: string; cliente: string; tipo: "Documental" | "Campaña" | "Serie" | "App" | "Evento"; año: number; color: string; a: string; b: string; texto: string; creditos: [string, string][] };
export const PROYECTOS: Proyecto[] = [
  { id: "floristeria-ulla", n: "Floristería Ulla", cliente: "Ulla Flores", tipo: "Campaña", año: 2026, color: "#9be59a", a: `${I}ulla-a.webp`, b: `${I}ulla-b.webp`, texto: "Una floristería de barrio que pasó a servir a hoteles y bodas. Doce piezas cortas que cuentan un día de trabajo, del mercado de madrugada al último ramo.", creditos: [["Dirección", "Irene Pardo"], ["Fotografía", "Saúl Ríos"], ["Montaje", "Grano"]] },
  { id: "mar-de-fondo", n: "Mar de fondo", cliente: "Cofradía de Laredo", tipo: "Documental", año: 2025, color: "#c7aaff", a: `${I}mar-a.webp`, b: `${I}mar-b.webp`, texto: "Cuarenta minutos con la última flota de bajura del puerto. Rodado en tres inviernos, con las voces de quienes faenan.", creditos: [["Dirección", "Nerea Gil"], ["Sonido", "Marco Lué"], ["Color", "Grano"]] },
  { id: "talento-unido", n: "Talento unido", cliente: "Agencia Unida", tipo: "Serie", año: 2026, color: "#86a4ff", a: `${I}talento-a.webp`, b: `${I}talento-b.webp`, texto: "Seis retratos de artistas representados por la agencia, cada uno en el sitio donde empezó. Una serie para redes y una pieza larga para su web.", creditos: [["Dirección", "Irene Pardo"], ["Fotografía", "Ana Ferro"], ["Música", "Lusa"]] },
  { id: "pizarra-verde", n: "Pizarra verde", cliente: "Pizarra", tipo: "App", año: 2025, color: "#8fe3a8", a: `${I}pizarra-a.webp`, b: `${I}pizarra-b.webp`, texto: "La app de una cooperativa escolar necesitaba explicar en un minuto lo que hace. Animación, rodaje en tres colegios y la versión vertical.", creditos: [["Animación", "Pau Molí"], ["Rodaje", "Grano"], ["Guion", "Nerea Gil"]] },
  { id: "corre-ligero", n: "Corre ligero", cliente: "Ligero Running", tipo: "Campaña", año: 2026, color: "#ffb56e", a: `${I}corre-a.webp`, b: `${I}corre-b.webp`, texto: "Una zapatilla para correr en ciudad, rodada a las seis de la mañana en cuatro barrios con corredores de verdad, sin modelos.", creditos: [["Dirección", "Saúl Ríos"], ["Producción", "Grano"], ["Color", "Lía Vera"]] },
  { id: "canal-cancha", n: "Canal cancha", cliente: "Cancha", tipo: "App", año: 2025, color: "#ff90e4", a: `${I}cancha-a.webp`, b: `${I}cancha-b.webp`, texto: "La identidad animada de una app de baloncesto de barrio: cabeceras, transiciones y cuarenta ilustraciones que se mueven.", creditos: [["Ilustración", "Mar Coll"], ["Animación", "Pau Molí"], ["Dirección", "Grano"]] },
  { id: "abrir-persiana", n: "Abrir la persiana", cliente: "Comercio de Lavapiés", tipo: "Documental", año: 2024, color: "#8eebf4", a: `${I}persiana-a.webp`, b: `${I}persiana-b.webp`, texto: "Ocho comercios que abren cada mañana desde hace más de cuarenta años. Un corto para el festival de barrio y un libro de fotos.", creditos: [["Dirección", "Nerea Gil"], ["Fotografía", "Ana Ferro"], ["Edición", "Grano"]] },
  { id: "festival-rail", n: "Festival raíl", cliente: "Raíl Fest", tipo: "Evento", año: 2026, color: "#f4e27c", a: `${I}rail-a.webp`, b: `${I}rail-b.webp`, texto: "Tres días de música en una estación abandonada: cobertura en directo, resumen diario y una pieza de cierre que se vio en todas las pantallas.", creditos: [["Realización", "Saúl Ríos"], ["Directo", "Grano"], ["Sonido", "Marco Lué"]] },
];

export const SERVICIOS = [
  ["Documental", "Historias largas con tiempo para mirar: investigación, rodaje y montaje."],
  ["Campaña", "Piezas cortas para marcas, del guion a las versiones para cada pantalla."],
  ["Serie", "Formatos de varios capítulos para redes y plataformas."],
  ["Animación", "Identidades que se mueven, ilustración y gráficos para apps."],
  ["Directo", "Cobertura de eventos y festivales con edición el mismo día."],
];

export const CLIENTES = ["Ulla Flores", "Cofradía de Laredo", "Agencia Unida", "Pizarra", "Ligero Running", "Cancha", "Raíl Fest", "Museo del Traje", "Teatro Pradillo"];

export const ESTUDIO = { foto: `${I}estudio.webp`, equipo: `${I}equipo.webp` };
