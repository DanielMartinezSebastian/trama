/** Almíbar · barrio — versión 3 de la pastelería (ver lib/sites/almibar.ts): el café del día a día con la estética de puntos de
 * Trama en claro. Carta en mesa por QR, pedido en mesa sin login, club de sellos y visita. Datos puros. */

export const SLUG = "almibar-barrio";

export const TABLES = Array.from({ length: 12 }, (_, i) => i + 1);

export const meta = {
  slug: SLUG,
  name: "Almíbar · barrio",
  title: "Almíbar · café de barrio en puntos",
  blurb:
    "Tercera versión de la pastelería Almíbar, fórmula «Café en puntos» (dot matrix en claro, movimiento 1): el vídeo del obrador pintado en puntos en el hero y lo práctico del día a día — carta en HTML con los 14 alérgenos y filtro «Sin…», QR imprimible para cada mesa que abre /mesa/<n> con pedido a barra sin registro, barra de acciones en móvil, club de sellos con código personal y horario «abierto ahora» con festivos. Usa VideoPlayer (ascii dots), MenuList, QRCode (dots), OpeningHours, ActionBar, QuantityStepper, Toggle, TextField, Toast y CookieBanner.",
  accent: "#d4612a",
  tag: "café · QR · dot matrix",
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "carta", title: "Carta" },
  ...TABLES.map((n) => ({ path: `mesa/${n}`, title: `Mesa ${n}` })),
  { path: "club", title: "Club de sellos" },
  { path: "visitanos", title: "Visítanos" },
];

/** «Hoy en la vitrina»: lo que queda a media mañana (dato de demostración). */
export const SHOWCASE: { id: string; left: number }[] = [
  { id: "croissant", left: 14 },
  { id: "caracola", left: 4 },
  { id: "queso", left: 6 },
  { id: "huesos", left: 3 },
  { id: "hogaza", left: 2 },
  { id: "napolitana", left: 0 },
];

/** Las mesas 1–12 están en la tienda del Centro (la de Delicias solo tiene terraza). */
export const TABLE_STORE = "centro";

export const QR_STEPS = [
  { n: "01", t: "Escanea el código de tu mesa", d: "Está en el servilletero. Abre la carta con los alérgenos de cada plato, sin descargar nada." },
  { n: "02", t: "Pide desde el móvil", d: "Añade lo que quieras y escribe una nota («sin azúcar», «para compartir»). Sin registrarte." },
  { n: "03", t: "Te lo llevamos", d: "El pedido llega a la barra al momento. Pagas como siempre: al final, en barra o en la mesa." },
];

export const CLUB = {
  goal: 10,
  demoStamps: 7,
  perks: ["El 10.º café, gratis (cualquier café o chocolate)", "Una porción de tarta en tu cumpleaños", "Aviso de los dulces de temporada antes que nadie", "Sin app: tu tarjeta es un código en el móvil"],
  terms: "Un sello por consumición de café o chocolate. Los sellos caducan a los 12 meses. Vale en las dos tiendas. Sin cuota y te das de baja cuando quieras desde el enlace del correo.",
  code: "ALM-7K2Q-0193",
};

export const ACCESS = [
  { t: "Entrada sin escalones", d: "Rampa en la puerta del Centro y entrada a nivel en Delicias." },
  { t: "Aseo adaptado", d: "En el Centro, con barras de apoyo y cambiador." },
  { t: "Trona y espacio para carritos", d: "Dos tronas; pide la mesa grande del fondo." },
  { t: "Perros bienvenidos", d: "En las terrazas, con cuenco de agua. Dentro, solo perros de asistencia." },
  { t: "Wifi gratis", d: "Red «Almibar-clientes». La contraseña está en el ticket." },
  { t: "Carta en letra grande", d: "La de la mesa se amplía con el móvil; en barra hay una impresa en A4." },
];

export const GETTING = [
  { store: "centro", how: "Tranvía: parada César Augusto (4 min a pie). Bus 21, 22 y 32. Aparcabicis en la plaza." },
  { store: "delicias", how: "Tranvía: parada Delicias, a 50 m. Bizi Zaragoza enfrente. Zona azul en la avenida." },
];
