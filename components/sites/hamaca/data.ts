/** Hamaca — radio de verano ficticia con estética de escritorio Y2K. Fórmula «Escritorio Y2K» (docs/13, a partir de Poolsuite):
 * la web es un sistema operativo antiguo sobre papel cuadriculado rosa; barra de menú con la hora, ventanas con barra de título
 * que se arrastran y se apilan, un reproductor como ventana principal, foto en semitono y un dock con iconos pixel que abre el
 * resto (agenda, postales, club). En móvil las ventanas se apilan como tarjetas. Datos puros. */

export const SLUG = "hamaca";

export const meta = {
  slug: SLUG,
  name: "Hamaca",
  title: "Hamaca · radio de verano",
  blurb:
    "Radio de verano con la fórmula «Escritorio Y2K» (Poolsuite): papel cuadriculado rosa, barra de menú con la hora, ventanas de sistema antiguo que se arrastran, se apilan y se cierran, reproductor de música sintetizada como ventana principal, foto en semitono y un dock de iconos pixel que abre la agenda, las postales y el club. Con teclado: cada ventana es un diálogo no modal con su botón de cerrar. Usa AudioPlayer (retro), GridBackground, Icon (pixel), LocalTime, TextField y Button.",
  accent: "#2f5be0",
  tag: "música · Y2K",
};

export const ROUTES = [{ path: "", title: "Inicio" }];

export const TRACKS =
  "Tumbona|Hamaca FM|synth:ambient:84:3|2:10\n" +
  "Piscina municipal|Hamaca FM|synth:ambient:92:7|1:50\n" +
  "Sombrilla 1998|Los Socorristas|synth:techno:118:11|2:20\n" +
  "Granizado|Hamaca FM|synth:ambient:76:5|1:40";

export const SHOWS = [
  { time: "10:00", name: "Desayuno con sal", host: "Marta y Joel" },
  { time: "13:00", name: "Hora de la siesta", host: "Selección automática" },
  { time: "18:00", name: "Atardecer en el chiringuito", host: "DJ Toalla" },
  { time: "22:00", name: "Baño de noche", host: "Las Medusas" },
];

export const POSTCARDS = [
  { file: "verano/04-palm-trees-and-water-unsplash.jpg", alt: "Puesta de sol en la orilla, con palmeras y casas al fondo", place: "Formentera" },
  { file: "verano/01-positano-s-sunset-unsplash.jpg", alt: "Atardecer sobre las casas de Positano", place: "Positano" },
  { file: "verano/02-cityscape-of-barcelona-city-beach-unsplash.jpg", alt: "La playa de la Barceloneta con la ciudad detrás", place: "Barcelona" },
  { file: "verano/03-sunset-beach-1-unsplash.jpg", alt: "Puesta de sol en una playa casi vacía", place: "Tarifa" },
];

export type WinId = "radio" | "agenda" | "postales" | "club";
export const DOCK: { id: WinId; label: string; icon: "music" | "calendar" | "image" | "heart" }[] = [
  { id: "radio", label: "Radio", icon: "music" },
  { id: "agenda", label: "Agenda", icon: "calendar" },
  { id: "postales", label: "Postales", icon: "image" },
  { id: "club", label: "Club", icon: "heart" },
];
