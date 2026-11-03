/* Datos de Turia Grotesk (docs/60): una tipografía inventada de la fundición Tipos Turia, presentada como la guía oficial
   de viaje de Valencia. Pesos, licencias, usos y postales. Datos puros. */

const I = "/img/inspiraciones/turia/";

export const FOTOS = {
  portada: `${I}portada.webp`,
  banderas: `${I}banderas.webp`,
  mercado: `${I}mercado.webp`,
  metro: `${I}metro.webp`,
  postal1: `${I}postal-1.webp`,
  postal2: `${I}postal-2.webp`,
  postal3: `${I}postal-3.webp`,
};

export const PAGINAS = [
  { path: "probar", titulo: "Probar" },
  { path: "pesos", titulo: "Pesos" },
  { path: "en-uso", titulo: "En uso" },
  { path: "licencias", titulo: "Licencias" },
  { path: "licencias/pedido", titulo: "Pedido" },
];

/** los diez pesos, con su color en la carta de pesos */
export const PESOS: { n: string; w: number; c: string }[] = [
  { n: "Hairline", w: 100, c: "#f2ead8" },
  { n: "Thin", w: 150, c: "#ffd23f" },
  { n: "Extralight", w: 200, c: "#ff9f1c" },
  { n: "Light", w: 300, c: "#f4511e" },
  { n: "Book", w: 350, c: "#d81b60" },
  { n: "Regular", w: 400, c: "#8e44ad" },
  { n: "Medium", w: 500, c: "#3f51b5" },
  { n: "Semibold", w: 600, c: "#1565c0" },
  { n: "Bold", w: 700, c: "#1b7f44" },
  { n: "Black", w: 900, c: "#111111" },
];

export const EVOLUCION: [string, string][] = [
  ["2016", "Primeros dibujos en el taller del Carmen"],
  ["2018", "Primera versión, cinco pesos"],
  ["2020", "Cirílico y griego"],
  ["2022", "Versión 2: diez pesos y cursivas"],
  ["2024", "Variable y números tabulares"],
  ["2026", "Versión 3: rehecha, revisada, presentada otra vez"],
];

export const ATRACCIONES: { t: string; texto: string }[] = [
  { t: "El Mercado Central", texto: "Cuarenta letreros de puesto rotulados a mano: de ahí salen la «a» de dos pisos y la «g» de anzuelo." },
  { t: "Las Torres de Serranos", texto: "Las proporciones de las mayúsculas se tomaron de las placas de bronce de la puerta." },
  { t: "La línea 3 de metro", texto: "Probada en señalética a ocho metros de distancia: la «e» se abrió para que no se cierre de lejos." },
];

export type Licencia = { id: string; n: string; para: string; precios: [string, number][] };
export const LICENCIAS: Licencia[] = [
  { id: "escritorio", n: "Escritorio", para: "Para instalar en ordenadores: diseño, maquetación, impresión.", precios: [["1–3 personas", 60], ["4–10 personas", 160], ["11–50 personas", 420]] },
  { id: "web", n: "Web", para: "Para usar con @font-face en webs, según visitas al mes.", precios: [["Hasta 50.000 visitas", 80], ["Hasta 500.000 visitas", 240], ["Sin límite", 680]] },
  { id: "app", n: "App", para: "Para incrustar en una aplicación móvil o de escritorio.", precios: [["1 aplicación", 300], ["3 aplicaciones", 750]] },
];
export const PAQUETES = [
  { id: "familia", n: "Familia completa", texto: "Los diez pesos y sus cursivas", factor: 1 },
  { id: "cuatro", n: "Cuatro pesos", texto: "Light, Regular, Medium y Bold", factor: 0.55 },
  { id: "uno", n: "Un peso", texto: "El que elijas", factor: 0.2 },
];

export const USOS: { t: string; donde: string; img: string }[] = [
  { t: "Señalética de la línea 3", donde: "Metro de Valencia", img: FOTOS.metro },
  { t: "Carteles del Mercado Central", donde: "Mercado Central", img: FOTOS.mercado },
  { t: "Bienal de diseño", donde: "Valencia", img: FOTOS.postal1 },
  { t: "Revista de barrio", donde: "Russafa", img: FOTOS.postal2 },
  { t: "Etiquetas de horchata", donde: "Alboraia", img: FOTOS.postal3 },
  { t: "Libro de ruta del puerto", donde: "Marina", img: FOTOS.banderas },
];

export const PANGRAMA = "Jovial vecina de Russafa baila un vals con zapatos de charol, y trae la horchata de Alboraia.";
export const IDIOMAS = ["Español", "Valencià", "Català", "Euskara", "Galego", "Português", "Français", "Deutsch", "Polski", "Čeština", "Română", "Türkçe", "Ελληνικά", "Русский", "Українська"];
export const ACENTOS = ["áàâäãåā", "éèêëěē", "íìîïī", "óòôöõō", "úùûüů", "ñçčšž"];
