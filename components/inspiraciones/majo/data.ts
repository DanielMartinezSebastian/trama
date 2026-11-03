/* Datos de Majo (docs/60): robótica inventada, en Barcelona, que fabrica un robot doméstico amable para casas, tiendas,
   colegios y laboratorios. Datos puros. */

const I = "/img/inspiraciones/majo/";

export const FOTOS = {
  portada: `${I}portada.webp`,
  cara: `${I}cara.webp`,
  taller: `${I}taller.webp`,
  ciudad: `${I}ciudad.webp`,
  casa: `${I}casa.webp`,
  tienda: `${I}tienda.webp`,
  aula: `${I}aula.webp`,
  juego: `${I}juego.webp`,
  equipo: `${I}equipo.webp`,
};

export const PAGINAS = [
  { path: "producto", titulo: "Producto" },
  { path: "empresa", titulo: "Empresa" },
  { path: "noticias", titulo: "Noticias" },
  { path: "reservar", titulo: "Reservar" },
];

export const PUBLICOS = [
  { id: "desarrollo", n: "Para desarrollar", texto: "Un SDK abierto, simulador y acceso a cada articulación. Programa comportamientos en Python o con bloques.", img: FOTOS.taller },
  { id: "empresas", n: "Para empresas", texto: "Recibe clientes, lleva pedidos a la mesa o enseña la tienda. Flotas gestionadas desde un panel.", img: FOTOS.tienda },
  { id: "investigacion", n: "Para investigar", texto: "Una plataforma segura para estudiar la convivencia entre personas y robots, con datos que se pueden exportar.", img: FOTOS.aula },
];

export const USOS = [
  { n: "Tiendas y hostelería", c: "#e8b33c" },
  { n: "Casa", c: "#23756d" },
  { n: "Investigación y aulas", c: "#b34a35" },
  { n: "Ocio y experiencias", c: "#d97aa8" },
];

export const RASGOS = [
  { t: "Se mueve como tú", texto: "Camina, se agacha y sube un escalón. Las articulaciones ceden si chocan con algo." },
  { t: "Teleoperación completa", texto: "Desde el móvil o con un mando: el robot repite lo que haces, con medio segundo de margen." },
  { t: "Seguro desde el diseño", texto: "Pesa once kilos, no tiene esquinas y se para si alguien le pone la mano delante." },
];

export const NOTICIAS = [
  { t: "Majo empieza a repartir en tres cafeterías de Gràcia", fecha: "28 oct 2026", tipo: "Empresa" },
  { t: "Abrimos el SDK: todo el código de movimiento, en abierto", fecha: "14 oct 2026", tipo: "Desarrollo" },
  { t: "Un estudio con mayores: qué cambia cuando el robot saluda", fecha: "2 oct 2026", tipo: "Investigación" },
  { t: "Ronda de financiación para fabricar en Terrassa", fecha: "19 sep 2026", tipo: "Empresa" },
];

export const COLORES = [
  { id: "arena", n: "Arena", c: "#e8dcc6" },
  { id: "mostaza", n: "Mostaza", c: "#e8b33c" },
  { id: "verde", n: "Verde azulado", c: "#2f8f86" },
  { id: "teja", n: "Teja", c: "#c4553f" },
];
export const ACCESORIOS = [
  { id: "bandeja", n: "Bandeja", texto: "Lleva hasta tres kilos", precio: 120 },
  { id: "pantalla", n: "Pantalla frontal", texto: "Para menús y avisos", precio: 240 },
  { id: "base", n: "Base de carga", texto: "Vuelve sola a cargarse", precio: 180 },
  { id: "mando", n: "Mando de teleoperación", texto: "Con vibración", precio: 90 },
];
export const PRECIO_BASE = 6900;
export const SEÑAL = 250;
