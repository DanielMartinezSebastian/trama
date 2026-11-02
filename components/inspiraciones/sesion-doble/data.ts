import type { SeatTable, SeatZone } from "@/components/ui/SeatMap";

/* Datos de Sesión Doble (docs/58): catálogo inventado de películas y series, críticas, sesiones y butacas. Datos puros. */

const I = "/img/inspiraciones/sesion-doble/";

export type Critica = { medio: string; frase: string; estrellas: number };
export type Titulo = { id: string; titulo: string; tipo: "Cine" | "Serie"; direccion: string; ano: number; reparto: string[]; genero: string; duracion: string; img: string; tinta: string; sinopsis: string; criticas: [Critica, Critica]; estado: "En cines" | "Próximamente" | "Catálogo"; sesiones?: string[] };

export const TITULOS: Titulo[] = [
  { id: "planta-menos-uno", titulo: "Planta menos uno", tipo: "Cine", direccion: "Inés Carrasco", ano: 2026, reparto: ["Lola Bermejo", "Tomás Rial"], genero: "Terror", duracion: "1 h 47 min", img: `${I}planta-menos-uno.webp`, tinta: "#2b2c0a", sinopsis: "Un conserje baja al sótano de un edificio de oficinas y encuentra una planta que no aparece en los planos.", criticas: [{ medio: "La Butaca", frase: "Da miedo sin levantar la voz", estrellas: 5 }, { medio: "Fotograma Diario", frase: "Un pasillo que no olvidarás", estrellas: 4.5 }], estado: "En cines", sesiones: ["Hoy 18:30", "Hoy 21:15", "Mañana 19:00"] },
  { id: "la-invitada", titulo: "La invitada", tipo: "Cine", direccion: "Marc Soler", ano: 2026, reparto: ["Ana Oliva", "Bruno Vega"], genero: "Comedia", duracion: "1 h 38 min", img: `${I}la-invitada.webp`, tinta: "#fff4d6", sinopsis: "Una pareja organiza una cena para reconciliar a su familia. Ninguna de las dos sabe quién ha invitado a la mujer del fondo.", criticas: [{ medio: "Cine Abierto", frase: "La cena más tensa del año", estrellas: 4 }, { medio: "El Proyector", frase: "Ternura con cuchillo", estrellas: 4.5 }], estado: "En cines", sesiones: ["Hoy 20:00", "Mañana 17:45", "Mañana 22:00"] },
  { id: "la-apisonadora", titulo: "La apisonadora", tipo: "Cine", direccion: "Sergio Nieto", ano: 2025, reparto: ["Darío Mena", "Eva Sanz"], genero: "Drama", duracion: "2 h 3 min", img: `${I}la-apisonadora.webp`, tinta: "#d8e04a", sinopsis: "Un boxeador retirado aprende a cuidar de su padre en un pueblo que ya solo vive de sus recuerdos.", criticas: [{ medio: "La Butaca", frase: "Golpea más cuando no pega", estrellas: 4.5 }, { medio: "Revista Rollo", frase: "Un gigante muy amable", estrellas: 4 }], estado: "Catálogo" },
  { id: "corazon-de-acero", titulo: "Corazón de acero", tipo: "Cine", direccion: "Paula Ferrer", ano: 2024, reparto: ["Hugo Prat", "Nadia Bel"], genero: "Drama", duracion: "3 h 10 min", img: `${I}corazon-de-acero.webp`, tinta: "#ffffff", sinopsis: "Un arquitecto exiliado reconstruye su vida y su ciudad durante treinta años.", criticas: [{ medio: "Fotograma Diario", frase: "Una cumbre de la temporada", estrellas: 5 }, { medio: "Cine Abierto", frase: "Monumental y frágil", estrellas: 4.5 }], estado: "Catálogo" },
  { id: "campeon-de-barrio", titulo: "Campeón de barrio", tipo: "Cine", direccion: "Ibai Larra", ano: 2025, reparto: ["Rubén Costa", "Mar Ortega"], genero: "Comedia", duracion: "2 h 9 min", img: `${I}campeon-de-barrio.webp`, tinta: "#ffe08a", sinopsis: "El mejor jugador de ping-pong de Vallecas está dispuesto a todo para que le tomen en serio.", criticas: [{ medio: "El Proyector", frase: "Irresistible y agotador", estrellas: 4.5 }, { medio: "Revista Rollo", frase: "Pura energía nerviosa", estrellas: 4 }], estado: "Catálogo" },
  { id: "pajaro-dama", titulo: "Pájaro dama", tipo: "Cine", direccion: "Clara Vidal", ano: 2023, reparto: ["Sara Roig", "Elena Muñoz"], genero: "Drama", duracion: "1 h 34 min", img: `${I}pajaro-dama.webp`, tinta: "#ffd05c", sinopsis: "El último año de instituto de una chica que quiere irse de Zamora y de una madre que no sabe decírselo todo.", criticas: [{ medio: "La Butaca", frase: "Una rara y bienvenida excepción", estrellas: 5 }, { medio: "Fotograma Diario", frase: "Tierna y sin trampas", estrellas: 4.5 }], estado: "Catálogo" },
  { id: "maquina-ex", titulo: "Máquina ex", tipo: "Cine", direccion: "Álex Garcés", ano: 2022, reparto: ["Óscar Ruiz", "Alicia Vives"], genero: "Ciencia ficción", duracion: "1 h 48 min", img: `${I}maquina-ex.webp`, tinta: "#ff2e4d", sinopsis: "Un programador pasa una semana en casa de su jefe para evaluar a una inteligencia que quizá le esté evaluando a él.", criticas: [{ medio: "Cine Abierto", frase: "Astuta y persuasiva", estrellas: 4.5 }, { medio: "Revista Rollo", frase: "Inquietante hasta el final", estrellas: 4 }], estado: "Catálogo" },
  { id: "marea-baja", titulo: "Marea baja", tipo: "Serie", direccion: "Julia Bosch", ano: 2026, reparto: ["Pablo Ruano", "Irene Lago"], genero: "Suspense", duracion: "8 episodios", img: `${I}marea-baja.webp`, tinta: "#a6e8ff", sinopsis: "Una inspectora vuelve a su pueblo gallego cuando la marea deja a la vista un coche desaparecido en 1998.", criticas: [{ medio: "El Proyector", frase: "Se te mete en los huesos", estrellas: 4.5 }, { medio: "La Butaca", frase: "Galicia nunca fue tan oscura", estrellas: 4 }], estado: "Próximamente" },
  { id: "hermanas-mayores", titulo: "Hermanas mayores", tipo: "Serie", direccion: "Noa Rey", ano: 2025, reparto: ["Rita Mora", "Luz Pena"], genero: "Comedia", duracion: "2 temporadas", img: `${I}hermanas-mayores.webp`, tinta: "#ffc1dc", sinopsis: "Cuatro hermanas sesentonas heredan un bar de carretera y a su clientela.", criticas: [{ medio: "Revista Rollo", frase: "Te quedas a vivir en el bar", estrellas: 4.5 }, { medio: "Cine Abierto", frase: "Una alegría de reparto", estrellas: 4 }], estado: "Catálogo" },
];

export const GENEROS = [...new Set(TITULOS.map((t) => t.genero))];

export const ZONAS: SeatZone[] = [
  { id: "centro", name: "Centro" },
  { id: "lateral", name: "Lateral", price: -1.5, color: "#7a7a7a" },
];

/** butacas dobles, la marca de la casa */
export const BUTACAS: SeatTable[] = Array.from({ length: 5 }, (_, f) =>
  Array.from({ length: 8 }, (_, c) => ({ id: `${"ABCDE"[f]}${c + 1}`, label: `${"ABCDE"[f]}${c + 1}`, zone: c > 1 && c < 6 ? "centro" : "lateral", seats: 2, x: 8 + c * 12, y: 26 + f * 15, shape: "square" as const })),
).flat();

export const PRECIO = 9.5;

export const PAGINAS = [
  { path: "indice", titulo: "Índice" },
  ...TITULOS.map((t) => ({ path: `titulo/${t.id}`, titulo: t.titulo })),
  { path: "entradas", titulo: "Entradas" },
  { path: "mis-entradas", titulo: "Mis entradas" },
];
