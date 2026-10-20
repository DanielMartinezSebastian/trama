/** Volt — web personal de una ciclista profesional ficticia, Nora Vidal. Fórmula «Atleta en voltaje» (docs/13, a partir de Lando
 * Norris, sitio del año 2025 en Awwwards): oliva casi negro y un amarillo ácido, curvas de nivel detrás de todo, titular en palo
 * seco con palabras en serifa, barras de acento que descubren el texto, firma que se dibuja, collage de fotos con fecha y lugar,
 * cambio de tema por sección (oliva → hueso → negro) y fichas con la esquina recortada. Datos puros. */

export const SLUG = "volt";

export const meta = {
  slug: SLUG,
  name: "Volt",
  title: "Nora Vidal · ciclista profesional",
  blurb:
    "Web personal de una ciclista con la fórmula «Atleta en voltaje» (Lando Norris, sitio del año 2025): oliva y amarillo ácido, curvas de nivel de fondo, titular con palabras en serifa que entran tapadas por barras de color, firma que se dibuja sobre la foto, collage con lugar y fecha, estela de fotos bajo el cursor, el tema de la página cambia por sección (oliva → hueso → negro) y fichas de palmarés con la esquina recortada. Usa GridBackground (contour), SplitText (block, emphasis), LineDraw, ThemeScroll, ImageTrail, Marquee, Parallax, MetaTable y BigFooter.",
  accent: "#d2ff00",
  tag: "deporte · marca personal",
};

export const ROUTES = [{ path: "", title: "Inicio" }];

export const NEXT_RACE = { name: "Vuelta a Burgos", stage: "Etapa 3 · Lagunas de Neila", date: "14 ago 2026", km: "164 km", climb: "3.120 m+" };

export const MANIFESTO = "*Rodar* más lejos, pelear cada *subida* y no esconderse en el viento. Diez años de *carretera* y lo que queda por correr.";

export type Shot = { file: string; alt: string; place: string; year: string; w: number; x: number; y: number; speed: number };
// Collage: posición en % del ancho de la sección y desplazamiento vertical en px; `speed` es el parallax de cada foto
export const SHOTS: Shot[] = [
  { file: "deporte/02-green-bicycle-unsplash.jpg", alt: "Bicicleta verde apoyada en una pared", place: "Girona", year: "2019", w: 22, x: 4, y: 0, speed: 0.08 },
  { file: "deporte/05-road-bike-race-on-sunny-day-unsplash.jpg", alt: "Pelotón en una carrera de carretera un día de sol", place: "Tour de Francia", year: "2025", w: 32, x: 34, y: 200, speed: -0.06 },
  { file: "deporte/08-casey-climbing-unsplash.jpg", alt: "Una escaladora en una pared de roca", place: "Montserrat", year: "2024", w: 18, x: 78, y: 0, speed: 0.1 },
  { file: "deporte/06-man-wearing-motorcycle-helmet-unsplash.jpg", alt: "Persona con casco de visera espejo en un camino de tierra", place: "Teruel", year: "2023", w: 20, x: 14, y: 560, speed: -0.08 },
  { file: "deporte/07-two-cyclists-race-on-road-unsplash.jpg", alt: "Dos ciclistas disputando un sprint en carretera", place: "Mundial de Zúrich", year: "2024", w: 24, x: 70, y: 520, speed: 0.05 },
];

export const QUOTE = "No importa dónde empiezas, sino *cómo* avanzas desde ahí.";

export type Win = { title: string; year: string; file: string; alt: string; note: string };
export const WINS: Win[] = [
  { title: "Campeonato de España", year: "2025", file: "deporte/07-two-cyclists-race-on-road-unsplash.jpg", alt: "Dos ciclistas en el sprint final", note: "Ruta · Valencia" },
  { title: "Etapa reina del Tour", year: "2025", file: "deporte/05-road-bike-race-on-sunny-day-unsplash.jpg", alt: "El pelotón subiendo un puerto", note: "Col du Tourmalet" },
  { title: "Llegada a París", year: "2024", file: "deporte/01-old-arc-de-triomphe-photograph-with-cars-unsplas.jpg", alt: "El Arco del Triunfo de París con coches antiguos", note: "Campos Elíseos" },
  { title: "Bici del año", year: "2023", file: "deporte/02-green-bicycle-unsplash.jpg", alt: "La bicicleta verde de la temporada", note: "Edición limitada" },
];

export const SEASON = [
  { k: "Victorias", v: "27" },
  { k: "Podios", v: "61" },
  { k: "Km en 2026", v: "28.400" },
  { k: "Equipo", v: "Ardent Racing" },
];

export const CALENDAR = [
  { date: "14 ago", race: "Vuelta a Burgos", place: "Burgos, ES" },
  { date: "30 ago", race: "Clásica de San Sebastián", place: "Donostia, ES" },
  { date: "21 sep", race: "Mundial de ruta", place: "Kigali, RW" },
  { date: "11 oct", race: "Il Lombardia", place: "Bérgamo, IT" },
];

export const TRAIL = ["deporte/02-green-bicycle-unsplash.jpg", "deporte/05-road-bike-race-on-sunny-day-unsplash.jpg", "deporte/06-man-wearing-motorcycle-helmet-unsplash.jpg", "deporte/07-two-cyclists-race-on-road-unsplash.jpg", "deporte/08-casey-climbing-unsplash.jpg", "deporte/01-old-arc-de-triomphe-photograph-with-cars-unsplas.jpg"];
