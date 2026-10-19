/** Sonar — estudio ficticio de identidad sonora. Fórmula: Overworld Audio (entrada con/sin sonido, mapa explorable de proyectos, tipografía serif sobre fondo nocturno). Datos puros. */
export const SLUG = "sonar";

export const meta = {
  slug: SLUG,
  name: "Sonar",
  title: "Sonar · estudio de identidad sonora",
  blurb:
    "Web de un estudio de sonido con la fórmula «experiencia explorable»: pantalla de entrada «con sonido / sin sonido», titular serif que se estira con el puntero, mapa de proyectos que se arrastra con inercia (con vista de lista alternativa), interruptor de sonido con ecualizador y cambio de vista animado en la página de proyectos. Usa EntryGate, SoundToggle, ElasticText, ExplorableCanvas, WorkViews y BigFooter.",
  accent: "#7fd0ff",
  tag: "audio · mapa explorable",
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "proyectos", title: "Proyectos" },
];

export type Work = { id: string; title: string; kind: string; year: string; text: string; x: number; y: number; topic: "naturaleza" | "arquitectura" | "eventos" | "estudio" | "interiores" | "ciudad"; i: number; alt: string };

export const WORKS: Work[] = [
  { id: "eco", title: "Eco", kind: "Identidad sonora", year: "2026", text: "Una marca de té que suena a tazas, vapor y lluvia sobre un tejado.", x: 20, y: 30, topic: "naturaleza", i: 3, alt: "Bosque nevado en tonos azules" },
  { id: "faro", title: "Faro", kind: "Podcast", year: "2026", text: "Doce episodios sobre arquitectura costera, con el mar siempre de fondo.", x: 46, y: 62, topic: "arquitectura", i: 4, alt: "Fachada de edificio con ventanas regulares" },
  { id: "ola", title: "Ola", kind: "Campaña en directo", year: "2025", text: "Un lanzamiento de un solo día con sonido generado por el público.", x: 76, y: 28, topic: "eventos", i: 4, alt: "Concierto con luces sobre el escenario" },
  { id: "nodo", title: "Nodo", kind: "Sonido de producto", year: "2025", text: "Los avisos y confirmaciones de una aplicación de logística.", x: 66, y: 78, topic: "estudio", i: 1, alt: "Mesa de trabajo con ordenador en invierno" },
  { id: "casa", title: "Casa Alba", kind: "Instalación", year: "2024", text: "Una casa rural que reacciona al paso de las personas.", x: 32, y: 80, topic: "interiores", i: 4, alt: "Salón con luz natural" },
  { id: "pulso", title: "Pulso", kind: "Música para espacios", year: "2024", text: "Tres horas de música generativa para un centro cívico.", x: 88, y: 58, topic: "ciudad", i: 0, alt: "Fachada de iglesia en una ciudad" },
];

export const SERVICES = [
  { t: "Identidad sonora", p: "El sonido de tu marca: un motivo reconocible, sus variaciones y un manual de uso para que suene igual en todas partes." },
  { t: "Sonido de producto", p: "Avisos, confirmaciones y errores que se entienden sin mirar la pantalla y que no cansan al décimo día." },
  { t: "Espacios y directo", p: "Instalaciones, paisajes sonoros y piezas en directo para museos, tiendas y festivales." },
];
