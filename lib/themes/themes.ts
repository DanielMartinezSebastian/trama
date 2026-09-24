import type { HoverEffect } from "asciify-engine";

/** Datos puros de las landings temáticas (seguros para servidor y cliente). */
export type ThemeCard = { title: string; text: string; meta: string };

export type Theme = {
  id: string;
  brand: string;
  kicker: string;
  title: string;
  sub: string;
  cta: string;
  cardsTitle: string;
  cards: ThemeCard[];
  final: { title: string; text: string; cta: string };
  /** Nombre de la escena de fondo en cada sección (se muestra en la esquina) */
  scenes: [string, string, string];
  palette: { bg: string; fg: string; muted: string; accent: string; accent2: string; card: string; line: string };
  font: string;
  cardStyle: "glass" | "solid" | "outline";
  radius: number;
  /** Carácter con el que se dibujan los números en ASCII (asciifyText) */
  glyph: string;
  /** Patrón de texto que se repite como fondo de cada card (renderTextBackground) */
  tile: string;
  hover: HoverEffect;
  /** Caracteres del efecto scramble de los títulos */
  chars: string;
  reveal: "dissolve" | "wipe" | "rise";
  /** Transición breve entre secciones */
  flash: "sweep" | "iris" | "slices";
  /** Carácter que sigue al puntero */
  cursor: string;
};

export const themes: Theme[] = [
  {
    id: "tide",
    brand: "Maré Surf Club",
    kicker: "ESCUELA DE SURF · CANTABRIA",
    title: "Aprende a leer el mar",
    sub: "Del primer remo a tu primera ola verde. Neopreno, tabla y monitores titulados incluidos.",
    cta: "Reservar clase",
    cardsTitle: "Tres formas de entrar al agua",
    cards: [
      { title: "Iniciación", text: "Grupos de seis, espuma blanda y mucha paciencia. Te levantas el primer día.", meta: "2 h · desde 35 €" },
      { title: "Clases privadas", text: "Un monitor solo para ti. Vídeo de tus olas para corregir la técnica.", meta: "1,5 h · desde 70 €" },
      { title: "Surf trips", text: "Fines de semana persiguiendo la mejor marea por toda la costa norte.", meta: "3 días · desde 240 €" },
    ],
    final: { title: "El swell llega el sábado", text: "Quedan doce plazas. Trae toalla, nosotros ponemos el resto.", cta: "Apuntarme" },
    scenes: ["amanecer", "mediodía", "atardecer y noche"],
    palette: { bg: "#04121c", fg: "#eaf6ff", muted: "#8fb3c9", accent: "#ff8a5c", accent2: "#3fd0c9", card: "rgba(255,255,255,0.07)", line: "rgba(255,255,255,0.18)" },
    font: 'var(--font-manrope), "Segoe UI", sans-serif',
    cardStyle: "glass",
    radius: 18,
    glyph: "~",
    tile: "OLA · MAR · SAL · ",
    hover: "trail",
    chars: "~-=^_",
    reveal: "wipe",
    flash: "sweep",
    cursor: "~",
  },
  {
    id: "brew",
    brand: "Grano Tostadores",
    kicker: "TOSTADO ARTESANAL · DESDE 1994",
    title: "Café que se toma su tiempo",
    sub: "Granos de origen único, tostados en lotes pequeños cada lunes y en tu puerta el jueves.",
    cta: "Ver el catálogo",
    cardsTitle: "Del grano a la taza",
    cards: [
      { title: "Origen único", text: "Fincas que conocemos por su nombre. Notas a fruta roja, cacao y panela.", meta: "250 g · 12 €" },
      { title: "Mezclas de la casa", text: "Equilibradas para espresso o filtro. La favorita de la barra desde hace años.", meta: "1 kg · 34 €" },
      { title: "Suscripción", text: "Un café distinto cada mes, con la ficha de cata y la historia de la finca.", meta: "mensual · 14 €" },
    ],
    final: { title: "Primera tanda de la semana", text: "Se tuesta el lunes a las 7:00. Pide antes del domingo y llega fresco.", cta: "Hacer un pedido" },
    scenes: ["el grano", "el vapor", "la taza"],
    palette: { bg: "#140b06", fg: "#f5e6cf", muted: "#b39a7c", accent: "#e0a458", accent2: "#c46b3c", card: "rgba(245,230,207,0.08)", line: "rgba(224,164,88,0.4)" },
    font: 'var(--font-fraunces), Georgia, serif',
    cardStyle: "solid",
    radius: 6,
    glyph: "o",
    tile: "CAFE · GRANO · TUESTE · ",
    hover: "magnify",
    chars: "o0*.,:",
    reveal: "rise",
    flash: "iris",
    cursor: "o",
  },
  {
    id: "orbit",
    brand: "Órbita Aeroespacial",
    kicker: "MISIÓN 07 · VENTANA ABIERTA",
    title: "Hacia arriba, sin excusas",
    sub: "Lanzadores reutilizables y satélites a medida para quien necesita llegar a órbita a tiempo.",
    cta: "Solicitar lanzamiento",
    cardsTitle: "Servicios de misión",
    cards: [
      { title: "Lanzadores", text: "Primera etapa reutilizable con más de cuarenta reactivaciones certificadas.", meta: "LEO · 4,2 t" },
      { title: "Satélites a medida", text: "Del concepto a la plataforma integrada en dieciocho meses.", meta: "12 U – 180 kg" },
      { title: "Formación", text: "Programa de operadores de misión con simulador de cabina completo.", meta: "12 semanas" },
    ],
    final: { title: "T-menos diez", text: "La próxima ventana de lanzamiento cierra el día 21. Reserva tu carga útil.", cta: "Reservar carga" },
    scenes: ["rampa", "ascenso", "órbita y luna"],
    palette: { bg: "#02030a", fg: "#e8ecff", muted: "#8a93b8", accent: "#7cc4ff", accent2: "#ffd27c", card: "rgba(124,196,255,0.06)", line: "rgba(124,196,255,0.45)" },
    font: 'var(--font-space-grotesk), "Segoe UI", sans-serif',
    cardStyle: "outline",
    radius: 2,
    glyph: "*",
    tile: "T-10 · 9 · 8 · 7 · IGNICION · ",
    hover: "attract",
    chars: "+*.-/0123456789",
    reveal: "dissolve",
    flash: "iris",
    cursor: "+",
  },
  {
    id: "pulse",
    brand: "Pulso Club",
    kicker: "CLUB · VIERNES Y SÁBADOS",
    title: "La ciudad respira a 128 bpm",
    sub: "Tres salas, un sistema de sonido que se siente en el esternón y luces que no perdonan.",
    cta: "Lista de invitados",
    cardsTitle: "Esta noche en Pulso",
    cards: [
      { title: "Sala principal", text: "Techno y house hasta el amanecer con residentes y artistas invitados.", meta: "00:00 – 07:00" },
      { title: "Terraza", text: "Copas, sintetizadores y vistas al skyline. Sonido más suave, más charla.", meta: "22:00 – 04:00" },
      { title: "Sesiones en vivo", text: "Directos de electrónica experimental en la sala pequeña, aforo limitado.", meta: "aforo 120" },
    ],
    final: { title: "Entrada antes de la una", text: "Lista con precio reducido hasta las 00:30. Después, en puerta.", cta: "Apuntarme a la lista" },
    scenes: ["la calle", "las azoteas", "el neón cian"],
    palette: { bg: "#05020d", fg: "#f3e9ff", muted: "#9c86bd", accent: "#ff3fa4", accent2: "#35e0ff", card: "rgba(10,4,24,0.72)", line: "rgba(255,63,164,0.6)" },
    font: 'var(--font-jetbrains-mono), ui-monospace, Consolas, monospace',
    cardStyle: "outline",
    radius: 0,
    glyph: "#",
    tile: "BASS // BEAT // DROP // ",
    hover: "glitchText",
    chars: "#%&@$/\\|<>01",
    reveal: "dissolve",
    flash: "slices",
    cursor: "#",
  },
  {
    id: "bloom",
    brand: "Hoja Vivero",
    kicker: "PLANTAS DE INTERIOR · ENVÍO EN 48 H",
    title: "Tu casa, un poco más selva",
    sub: "Plantas sanas, con su maceta y un cuaderno de cuidados para que ninguna se te muera.",
    cta: "Ver plantas",
    cardsTitle: "Empieza por aquí",
    cards: [
      { title: "Colección sombra", text: "Pothos, zamioculcas y helechos que perdonan la falta de luz.", meta: "desde 9 €" },
      { title: "Cuidados fáciles", text: "Recordatorios de riego por WhatsApp y una hoja de ruta estación por estación.", meta: "incluido" },
      { title: "Macetas de barro", text: "Hechas a mano en un taller de Toledo, con drenaje y plato a juego.", meta: "desde 14 €" },
    ],
    final: { title: "Una planta para cada rincón", text: "Cuéntanos cuánta luz tienes y elegimos por ti. Devolución gratuita.", cta: "Elegir mi planta" },
    scenes: ["brote", "crecimiento", "floración"],
    palette: { bg: "#06120a", fg: "#eaf5e4", muted: "#8fae88", accent: "#ff8fb8", accent2: "#9be36b", card: "rgba(155,227,107,0.08)", line: "rgba(155,227,107,0.3)" },
    font: 'var(--font-instrument-serif), "Palatino Linotype", Palatino, serif',
    cardStyle: "glass",
    radius: 28,
    glyph: "&",
    tile: "hoja · raiz · flor · ",
    hover: "glow",
    chars: "&%*+.:",
    reveal: "rise",
    flash: "iris",
    cursor: "*",
  },
  {
    id: "arcade",
    brand: "Pixel Club",
    kicker: "SALÓN RECREATIVO · 1 FICHA = 1 VIDA",
    title: "Insert coin para continuar",
    sub: "Setenta máquinas originales, pinball y una barra de refrescos con pajita de neón.",
    cta: "Ver horarios",
    cardsTitle: "Elige jugador",
    cards: [
      { title: "Máquinas clásicas", text: "De los 80 a los 2000. Todas en funcionamiento y con la pantalla original.", meta: "0,50 € / ficha" },
      { title: "Torneos semanales", text: "Ranking de récords y premios a los tres primeros. Inscripción gratuita.", meta: "jueves 20:00" },
      { title: "Cumpleaños retro", text: "Sala privada, fichas ilimitadas y tarta con forma de marciano.", meta: "hasta 12 jugadores" },
    ],
    final: { title: "Game over es solo el principio", text: "Abrimos todos los días de 16:00 a 00:00. Tu récord te está esperando.", cta: "Cómo llegar" },
    scenes: ["bloques", "invasores", "insert coin"],
    palette: { bg: "#0b1a0b", fg: "#dff5b8", muted: "#8fae68", accent: "#9bbc0f", accent2: "#f5d76e", card: "#0f380f", line: "#9bbc0f" },
    font: 'var(--font-space-mono), "Courier New", Courier, monospace',
    cardStyle: "solid",
    radius: 0,
    glyph: "@",
    tile: "P1 · P2 · GAME · OVER · ",
    hover: "shatter",
    chars: "@#%&01",
    reveal: "dissolve",
    flash: "slices",
    cursor: "#",
  },
];

export const getTheme = (id: string) => themes.find((t) => t.id === id);
