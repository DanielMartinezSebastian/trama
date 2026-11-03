/* Datos de Bolo (docs/60): logística de giras inventada, con base en Zaragoza y Bilbao, que mueve escenarios, luces y
   backline de conciertos, festivales y rodajes por Europa. Datos puros. */

const I = "/img/inspiraciones/bolo/";

export const FOTOS = {
  portada: `${I}portada.webp`,
  cabina: `${I}cabina.webp`,
  muelle: `${I}muelle.webp`,
  faros: `${I}faros.webp`,
  conductora: `${I}conductora.webp`,
  equipo: `${I}equipo.webp`,
  carretera: `${I}carretera.webp`,
  flota: `${I}flota.webp`,
  remolque: `${I}remolque.webp`,
  almacen: `${I}almacen.webp`,
  noche: `${I}noche.webp`,
};

export const PAGINAS = [
  { path: "servicios", titulo: "Servicios" },
  { path: "flota", titulo: "Flota" },
  { path: "cultura", titulo: "Cultura" },
  { path: "empleo", titulo: "Empleo" },
  { path: "planifica", titulo: "Planifica tu gira" },
  { path: "contacto", titulo: "Contacto" },
];

export type Servicio = { id: string; n: string; t: string; texto: string; img: string };
export const SERVICIOS: Servicio[] = [
  { id: "giras", n: "01", t: "Giras completas", texto: "Escenario, luces, sonido y backline de una ciudad a la siguiente, con el montaje esperando cuando llega el equipo.", img: FOTOS.carretera },
  { id: "festivales", n: "02", t: "Festivales", texto: "Lanzaderas entre almacén y recinto, rampas de carga por turnos y un jefe de muelle durante todo el montaje.", img: FOTOS.muelle },
  { id: "rodajes", n: "03", t: "Rodajes y eventos", texto: "Camiones con plataforma, almacén cerca del set y conductores acostumbrados a esperar a que termine la toma.", img: FOTOS.remolque },
  { id: "almacen", n: "04", t: "Almacén entre giras", texto: "Doce mil metros con control de humedad para que los flight cases no se pasen el invierno en un garaje.", img: FOTOS.almacen },
];

export const VALORES = [
  { n: "1", t: "Ejecución sin sustos", texto: "Cada detalle se resuelve antes de salir. Sin carreras de última hora: un equipo que sabe que todo tiene que llegar como se planeó." },
  { n: "2", t: "La seguridad primero", texto: "De la carretera al escenario, vehículos revisados, conductores con experiencia y protocolos que no se negocian." },
  { n: "3", t: "Soluciones, no excusas", texto: "Nos sincronizamos con tu calendario, tus dificultades y tus prioridades. No reaccionamos: nos adelantamos." },
];

export const PREGUNTAS = [
  ["¿Turno de noche?", "Es lo que hacemos."],
  ["¿Cambia la ruta por el tiempo?", "Desviamos antes de que sea un problema."],
  ["¿Cambio de sala a mitad de gira?", "Nos adaptamos sobre la marcha."],
  ["¿Hay que añadir una fecha?", "Considéralo hecho."],
  ["¿Flota más limpia?", "Un tercio de los camiones ya va con biometano."],
];

export const CIFRAS = [
  ["70+", "camiones en carretera"],
  ["140", "años de experiencia sumados en el muelle"],
  ["100 %", "conductores en plantilla"],
  ["24/7", "despacho y seguimiento en directo"],
];

export type Camion = { id: string; n: string; tipo: "Tráiler" | "Rígido" | "Furgón" | "Plataforma"; m3: number; carga: string; plazas: number; img: string; nota: string };
export const FLOTA: Camion[] = [
  { id: "megatrailer", n: "Megatráiler 13,6", tipo: "Tráiler", m3: 100, carga: "24 t", plazas: 2, img: FOTOS.flota, nota: "El de las giras grandes: un escenario completo con su techo." },
  { id: "trailer-frio", n: "Tráiler con clima", tipo: "Tráiler", m3: 90, carga: "22 t", plazas: 2, img: FOTOS.remolque, nota: "Para instrumentos y pantallas LED que no soportan el calor de agosto." },
  { id: "rigido-12", n: "Rígido de 12 m", tipo: "Rígido", m3: 55, carga: "12 t", plazas: 3, img: FOTOS.cabina, nota: "Entra en cascos históricos y patios de teatro." },
  { id: "rigido-8", n: "Rígido de 8 m", tipo: "Rígido", m3: 38, carga: "7 t", plazas: 3, img: FOTOS.faros, nota: "El backline de una banda con su técnico al lado." },
  { id: "furgon", n: "Furgón de enlace", tipo: "Furgón", m3: 14, carga: "1,2 t", plazas: 3, img: FOTOS.noche, nota: "Lo que se olvidó en la sala anterior, a tiempo para la prueba de sonido." },
  { id: "plataforma", n: "Plataforma con pluma", tipo: "Plataforma", m3: 0, carga: "18 t", plazas: 2, img: FOTOS.muelle, nota: "Grupos electrógenos, contenedores y estructuras de festival." },
];

export type Oferta = { id: string; t: string; lugar: string; tipo: string; texto: string };
export const OFERTAS: Oferta[] = [
  { id: "conductor-giras", t: "Conductora o conductor de giras (C+E)", lugar: "Zaragoza", tipo: "Jornada completa", texto: "Rutas por Europa de dos a seis semanas con descanso pagado entre giras. Carné C+E y CAP al día." },
  { id: "jefe-muelle", t: "Jefe de muelle", lugar: "Bilbao", tipo: "Jornada completa", texto: "Coordinar la carga y descarga en festivales, con turnos de noche y equipo de seis personas." },
  { id: "despacho", t: "Despacho nocturno", lugar: "Zaragoza", tipo: "Turno de noche", texto: "Seguir la flota en directo y resolver lo que pase entre las once y las siete." },
  { id: "mecanica", t: "Mecánica de flota", lugar: "Zaragoza", tipo: "Jornada completa", texto: "Revisiones antes de cada salida y asistencia en ruta por teléfono." },
];

export const OFICINAS = [
  { ciudad: "Zaragoza", dir: ["Plataforma Logística, calle Río Ebro 14", "50197 Zaragoza"], tel: "976 000 000" },
  { ciudad: "Bilbao", dir: ["Muelle de Zorrotzaurre 8", "48014 Bilbao"], tel: "944 000 000" },
];

/** ciudades del planificador, con su posición aproximada en km (x este, y norte) desde Zaragoza */
export const CIUDADES: { id: string; n: string; x: number; y: number }[] = [
  { id: "zaragoza", n: "Zaragoza", x: 0, y: 0 },
  { id: "madrid", n: "Madrid", x: -260, y: -110 },
  { id: "barcelona", n: "Barcelona", x: 255, y: 30 },
  { id: "valencia", n: "Valencia", x: 60, y: -230 },
  { id: "bilbao", n: "Bilbao", x: -150, y: 190 },
  { id: "sevilla", n: "Sevilla", x: -390, y: -470 },
  { id: "lisboa", n: "Lisboa", x: -750, y: -260 },
  { id: "paris", n: "París", x: 120, y: 810 },
  { id: "lyon", n: "Lyon", x: 520, y: 560 },
  { id: "milan", n: "Milán", x: 820, y: 560 },
];

/** precio de referencia por km y camión, según el tipo */
export const TARIFA_KM: Record<Camion["tipo"], number> = { Tráiler: 1.9, Rígido: 1.45, Furgón: 0.8, Plataforma: 1.7 };
/** coste fijo por parada (muelle, permisos, carga y descarga) */
export const COSTE_PARADA = 380;
