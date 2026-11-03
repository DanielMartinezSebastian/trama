/* Datos de Trocha (docs/60): moto eléctrica de enduro inventada, diseñada en Bilbao. Versiones, baterías, ángulos del
   visor con sus puntos de detalle y funciones. Datos puros. */

const I = "/img/inspiraciones/trocha/";

export const FOTOS = {
  portada: `${I}portada.webp`,
  motor: `${I}motor.webp`,
  barro: `${I}barro.webp`,
  piloto: `${I}piloto.webp`,
  modos: `${I}modos.webp`,
  cargador: `${I}cargador.webp`,
  bateria: `${I}bateria.webp`,
  bateriaS: `${I}bateria-s.webp`,
  pantalla: `${I}pantalla.webp`,
  guantes: `${I}guantes.webp`,
};

export const PAGINAS = [
  { path: "moto", titulo: "La moto" },
  { path: "historia", titulo: "Historia" },
  { path: "reservar", titulo: "Reservar" },
];

export const DATOS = [
  ["Diseño", "Bilbao"],
  ["Propósito", "El enduro que viene"],
  ["Disponible", "Primavera de 2027"],
  ["Precio", "desde 11.900 €"],
];

/** los ángulos del visor, cada uno con sus puntos de detalle (posición en % de la imagen) */
export const ANGULOS: { id: string; n: string; img: string; puntos: { x: number; y: number; t: string; texto: string }[] }[] = [
  { id: "lateral", n: "Lateral", img: `${I}vista-lateral.webp`, puntos: [{ x: 47, y: 56, t: "Motor de 16 kW", texto: "Par instantáneo desde parado y sin embrague." }, { x: 20, y: 70, t: "Suspensión de 300 mm", texto: "Horquilla y amortiguador regulables a mano." }, { x: 62, y: 38, t: "Asiento a 920 mm", texto: "Más bajo que una de gasolina equivalente." }] },
  { id: "frontal", n: "Frontal", img: `${I}vista-frontal.webp`, puntos: [{ x: 50, y: 30, t: "Faro de 4.000 lúmenes", texto: "Para salir de madrugada y volver de noche." }, { x: 50, y: 62, t: "Batería extraíble", texto: "Sale por arriba en treinta segundos." }] },
  { id: "trasera", n: "Trasera", img: `${I}vista-trasera.webp`, puntos: [{ x: 55, y: 48, t: "Freno regenerativo", texto: "Recupera energía en cada bajada." }, { x: 35, y: 70, t: "Transmisión por correa", texto: "Sin cadena que engrasar ni tensar." }] },
  { id: "detalle", n: "Detalle", img: `${I}vista-detalle.webp`, puntos: [{ x: 40, y: 45, t: "Pantalla mínima", texto: "Batería, modo y nada más." }, { x: 70, y: 60, t: "Guardabarros flexible", texto: "Se dobla en vez de romperse." }] },
];

export const FUNCIONES = [
  { t: "Batería intercambiable", texto: "Cambia de batería sin herramientas y sigue rodando.", img: FOTOS.bateria },
  { t: "Una pantalla que no distrae", texto: "Solo lo que hace falta mientras conduces.", img: FOTOS.pantalla },
  { t: "Guardado inteligente", texto: "Un hueco para la herramienta y el móvil, protegido del barro.", img: FOTOS.guantes },
];

export const MODOS = [
  ["Sendero", "Suave y silenciosa: para no molestar en el monte."],
  ["Enduro", "Toda la potencia, con control de tracción."],
  ["Pista", "Sin límites, en circuito cerrado."],
];

export const VERSIONES = [
  { id: "trail", n: "Trocha Trail", texto: "Homologada para carretera, luces y matrícula.", precio: 11900 },
  { id: "race", n: "Trocha Race", texto: "Solo para circuito y competición, 3 kg menos.", precio: 13400 },
];
export const BATERIAS = [
  { id: "66", n: "6,6 kWh", texto: "Hasta 2 h de enduro", precio: 0 },
  { id: "88", n: "8,8 kWh", texto: "Hasta 3 h de enduro", precio: 1600 },
];
export const COLORES = [
  { id: "amarillo", n: "Amarillo trocha", c: "#f2d21b" },
  { id: "negro", n: "Negro carbón", c: "#1d1d1b" },
  { id: "blanco", n: "Blanco tiza", c: "#efede6" },
];
export const SEÑAL = 300;
