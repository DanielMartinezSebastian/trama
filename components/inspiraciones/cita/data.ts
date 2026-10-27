import type { BookingPlace, BookingService, BookingStaff } from "@/lib/commerce/booking";

/* Datos de Cita Barbers (docs/56): locales, carta, barberos y revista. Datos puros: los lee también el registro. */

const I = "/img/inspiraciones/cita/";

export type Local = BookingPlace & { barrio: string; img: string; horario: string; texto: string; metro: string };

export const LOCALES: Local[] = [
  { id: "malasana", name: "Malasaña", barrio: "Malasaña", address: "Calle del Pez 21, Madrid", img: `${I}local-malasana.webp`, horario: "L-V|09:00-21:00\nS|09:00-19:00\nD|cerrado", metro: "Noviciado · Tribunal", texto: "El primero. Azulejo verde, tres sillones y la cafetera que nunca se apaga. Aquí empezó todo en 2016." },
  { id: "chamberi", name: "Chamberí", barrio: "Chamberí", address: "Calle de Fuencarral 140, Madrid", img: `${I}local-chamberi.webp`, horario: "L-S|10:00-20:00\nD|cerrado", metro: "Quevedo · Bilbao", texto: "Cinco sillones frente a un ventanal y Hugo, que lleva aquí desde el primer día. El de los degradados." },
  { id: "lavapies", name: "Lavapiés", barrio: "Lavapiés", address: "Calle del Ave María 9, Madrid", img: `${I}local-lavapies.webp`, horario: "L-V|10:00-21:00\nS|10:00-15:00\nD|cerrado", metro: "Lavapiés · Antón Martín", texto: "Pequeño y con música. El local de barrio de verdad: aquí se viene a cortarse el pelo y a quedarse un rato." },
  { id: "salamanca", name: "Salamanca", barrio: "Salamanca", address: "Calle de Goya 33, Madrid", img: `${I}local-salamanca.webp`, horario: "L-S|09:00-20:00\nD|cerrado", metro: "Goya · Velázquez", texto: "El más tranquilo. Afeitado con toalla caliente y una sala aparte para el ritual completo." },
  { id: "chueca", name: "Chueca", barrio: "Chueca", address: "Calle de Hortaleza 70, Madrid", img: `${I}local-chueca.webp`, horario: "L-D|10:00-20:00", metro: "Chueca · Gran Vía", texto: "El único abierto los domingos. Luz de tarde, sillones de cuero y la mejor terraza para esperar tu turno." },
];

export const SERVICIOS: BookingService[] = [
  { id: "corte", name: "Corte", minutes: 30, price: 22, category: "Pelo", description: "Corte a tijera o máquina, lavado y peinado." },
  { id: "degradado", name: "Degradado", minutes: 40, price: 25, category: "Pelo", description: "Degradado a cero o bajo, con acabado a navaja." },
  { id: "corte-barba", name: "Corte y barba", minutes: 50, price: 32, category: "Combinados", description: "Corte, arreglo de barba y aceite. El más pedido." },
  { id: "barba", name: "Barba", minutes: 25, price: 15, category: "Barba", description: "Perfilado, recorte y aceite de barba." },
  { id: "afeitado", name: "Afeitado clásico", minutes: 35, price: 20, category: "Barba", description: "Navaja, toalla caliente y bálsamo." },
  { id: "infantil", name: "Corte infantil", minutes: 25, price: 16, category: "Pelo", description: "Hasta los 12 años, con paciencia y piruleta." },
];

export const BARBEROS: BookingStaff[] = [
  { name: "Hugo", role: "Degradados · Chamberí", places: ["chamberi", "malasana"] },
  { name: "Iván", role: "Clásico y navaja · Salamanca", places: ["salamanca", "chamberi"] },
  { name: "Bruno", role: "Barba y canas", places: ["malasana", "lavapies"] },
  { name: "Samuel", role: "Corte a tijera", places: ["chueca", "lavapies"], services: ["corte", "corte-barba", "infantil", "barba"] },
  { name: "Dani", role: "Degradados · Chueca", places: ["chueca", "salamanca"] },
];

export type Articulo = { slug: string; titulo: string; img: string; entradilla: string; cuerpo: string[]; fecha: string };

export const ARTICULOS: Articulo[] = [
  {
    slug: "granos-tras-el-afeitado",
    titulo: "Granos tras el afeitado: cómo evitarlos en la nuca",
    img: `${I}blog-afeitado.webp`,
    fecha: "12 oct 2026",
    entradilla: "La nuca es la zona que más sufre al rasurar. Tres gestos sencillos para que el degradado no venga con premio.",
    cuerpo: [
      "Casi todos los granos de la nuca tienen el mismo origen: un pelo que, recién cortado, vuelve a crecer hacia dentro. Pasa más con el pelo rizado y con los degradados muy bajos, donde la cuchilla va pegada a la piel.",
      "Lo primero es la dirección. En la nuca, el pelo crece hacia abajo y hacia los lados: si pasas la máquina a contrapelo, el corte queda más apurado, pero también más expuesto. Pídenos un degradado a favor de pelo si tienes la piel sensible.",
      "Después, el frío. Un poco de agua fría o un bálsamo sin alcohol cierra el poro. Y durante dos días, nada de cuellos ajustados ni de rascar: es lo que convierte una rojez en un grano.",
    ],
  },
  {
    slug: "barba-con-canas",
    titulo: "Guía para cuidar la barba con canas",
    img: `${I}blog-barba-canas.webp`,
    fecha: "28 sep 2026",
    entradilla: "La cana es más gruesa y más seca. No hay que esconderla: hay que tratarla de otra manera.",
    cuerpo: [
      "La primera cana de la barba no se parece a las demás: es más rígida, se riza a su aire y se nota más porque refleja la luz. Por eso una barba con canas parece más desordenada aunque esté igual de larga.",
      "El truco está en la hidratación. Un aceite ligero por la noche y un bálsamo por la mañana domestican la cana sin apelmazarla. Y el perfil, más limpio que nunca: una línea de mejilla bien marcada hace que el gris parezca intencionado.",
      "Si prefieres matizarla, existen tintes progresivos que no dejan el color plano. Pregúntale a Bruno: es el que más barbas grises ve a la semana.",
    ],
  },
  {
    slug: "pomada-cera-o-pasta",
    titulo: "Pomada, cera o pasta: cuál te va",
    img: `${I}blog-pomada.webp`,
    fecha: "9 sep 2026",
    entradilla: "Brillo, fijación y cómo se lava. Lo que diferencia de verdad a los tres tarros de la estantería.",
    cuerpo: [
      "La pomada da brillo y deja el pelo moldeable todo el día: es la de los peinados clásicos hacia atrás. Las de base agua se lavan sin esfuerzo; las de base aceite aguantan más, pero piden champú doble.",
      "La cera es la intermedia: fijación media, acabado natural. Va bien con el pelo corto y con texturas despeinadas que se rehacen con los dedos.",
      "La pasta es mate y de fijación alta. Si tu pelo es fino, es la que más volumen da sin que se note que llevas algo. Una cantidad del tamaño de un garbanzo basta: el error más común es poner demasiado.",
    ],
  },
];

/** las páginas internas, para el registro (rutas prerenderizadas) */
export const PAGINAS = [
  { path: "locales", titulo: "Locales" },
  ...LOCALES.map((l) => ({ path: `locales/${l.id}`, titulo: `Cita ${l.name}` })),
  { path: "tarifas", titulo: "Tarifas" },
  { path: "reservar", titulo: "Reservar" },
  { path: "mis-citas", titulo: "Mis citas" },
  { path: "revista", titulo: "Revista" },
  ...ARTICULOS.map((a) => ({ path: `revista/${a.slug}`, titulo: a.titulo })),
];
