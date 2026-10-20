/** Almíbar · Taller — la línea de tartas a medida de Almíbar (ficticia) con la fórmula «Taller 3D»: el producto es el
 * protagonista en 3D (relato de Demostración, docs/11 §4). Mismo negocio y datos que /sitios/almibar (lib/sites/almibar.ts);
 * aquí solo lo propio de esta versión. Datos puros. */

export const SLUG = "almibar-taller";

export const meta = {
  slug: SLUG,
  name: "Almíbar · Taller",
  title: "Almíbar Taller · tartas a medida",
  blurb:
    "Tartas a medida con la fórmula «Taller 3D»: la tarta es una escena three.js procedural (pisos, capas de bizcocho y relleno, cobertura con goteo, frutos rojos, flores y velas) que gira sobre un GradientField, hace despiece capa a capa con el scroll (PinnedSection) y cambia en vivo en el configurador con precio, alérgenos y DatePicker de recogida con antelación. Bodas (degustación con cita y estimador por invitados), empresas (precios por volumen) y una solicitud con señal del 30 %. Sin WebGL o con movimiento reducido, la misma tarta en SVG.",
  accent: "#b4475d",
  tag: "pastelería · 3D",
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "disena", title: "Diseña tu tarta" },
  { path: "bodas", title: "Bodas" },
  { path: "empresas", title: "Empresas" },
  { path: "solicitud", title: "Solicitud" },
];

/** Fases del despiece de la portada (una por tramo del scroll). */
export const PHASES = [
  { k: "01", title: "Bizcocho", text: "Horneado la víspera para que repose: vainilla de Madagascar, chocolate negro, red velvet, zanahoria o almendra sin gluten." },
  { k: "02", title: "Relleno", text: "Entre capa y capa, crema pastelera de la casa, frambuesa fresca, trufa, dulce de leche o limón. Dos capas por piso." },
  { k: "03", title: "Cobertura", text: "Desnuda para que se vean las capas, o con nata, buttercream, ganache con goteo o crema de pistacho." },
  { k: "04", title: "Decoración", text: "Frutos rojos, flores comestibles, velas y un mensaje escrito a mano. Lo montamos la mañana de la recogida." },
];

export const COLLECTIONS = [
  { title: "Cumpleaños", meta: "desde 28 € · 48 h", photo: 10, alt: "Cupcakes con crema de color gris azulado", href: "disena" },
  { title: "Bodas", meta: "degustación con cita", photo: 6, alt: "Postres emplatados en fila sobre platos blancos", href: "bodas" },
  { title: "Empresas", meta: "cajas con tu logo", photo: 13, alt: "Caja de cartón con bollería y un ramo de flores", href: "empresas" },
  { title: "Celebraciones", meta: "mesas dulces", photo: 9, alt: "Tartaletas de frutas sobre una tabla de madera", href: "bodas" },
];

/** Bodas: precio por invitado (tarta + mesa dulce) y mínimos. */
export const WEDDING = { perGuest: 6.5, sweetTable: 3.2, min: 40, max: 250, tastingFee: 25 };
export const TASTING_SLOTS = ["11:00", "12:30", "17:30", "19:00"];

// coma dentro de una celda: escapada (`\\,` en una cadena JS), como pide el formato de listas del kit
export const CORPORATE_TABLE =
  "Pedido, Unidades, Precio por unidad, Plazo\n" +
  "Caja desayuno (croissant\\, napolitana y zumo), 10–49, 7\\,90 €, 48 h\n" +
  "Caja desayuno, 50–199, 6\\,90 €, 72 h\n" +
  "Caja merienda (4 porciones de tarta), 10–49, 12\\,50 €, 48 h\n" +
  "Caja merienda, 50 o más, 10\\,90 €, 5 días\n" +
  "Galletas con logo (caja de 6), 50 o más, 4\\,20 €, 7 días";

export const CLIENTS = ["Colegio de Arquitectos de Aragón (ejemplo)", "Estudio Bajo Ebro", "Coworking La Harinera", "Clínica Dental Ribera (ficticia)", "Teatro de las Esquinas (ejemplo)"];

export const WEDDING_STEPS = "Primer contacto|Nos cuentas fecha, invitados y estilo; te respondemos en 24 horas.\nDegustación|Probáis tres bizcochos y tres rellenos en el obrador (25 €, se descuenta del pedido).\nDiseño|Os enviamos boceto y presupuesto cerrado; la señal del 30 % reserva la fecha.\nEl día|Montamos la tarta y la mesa dulce en el espacio y recogemos al día siguiente.";

export const WEDDING_FAQ =
  "¿Con cuánta antelación hay que reservar?|Entre tres y seis meses en temporada alta (mayo–octubre). Hacemos una sola boda por día.\n¿Podéis hacer la tarta sin gluten?|Sí: bizcocho de almendra y rellenos sin harina. El obrador manipula los 14 alérgenos, así que avisamos siempre de las trazas.\n¿Lleváis la tarta al lugar de la boda?|En Zaragoza y hasta 60 km, con montaje incluido. Más lejos, con un suplemento por kilómetro.\n¿Qué pasa si cambia el número de invitados?|Ajustamos el presupuesto hasta 10 días antes.";

export const HOME_FAQ =
  "¿Con cuánta antelación encargo?|48 horas para tartas de hasta 24 raciones; 7 días para las de tres pisos.\n¿Puedo ver la tarta antes?|El diseñador te enseña la tarta en 3D con tus capas y colores; al recogerla será igual, salvo pequeñas diferencias de hecho a mano.\n¿Cómo pago?|Señal del 30 % al confirmar (se devuelve si cancelas con 48 h) y el resto al recoger, en tienda o con tarjeta.\n¿Hacéis envíos?|Sí, en Zaragoza capital por 8 €. Las de pisos las montamos en el sitio.";
