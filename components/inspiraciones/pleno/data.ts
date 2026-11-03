/* Datos de PLENO (docs/59): semana inventada de diseño, arte y cultura digital en Las Naves, Valencia, con un día de foro
   profesional y dos de festival. Datos puros. */

const I = "/img/inspiraciones/pleno/";

export const ESCENARIOS = [1, 2, 3, 4].map((n) => `${I}escenario-${n}.webp`);
export const NAVE = `${I}nave.webp`;

export type Ponente = { id: string; n: string; oficio: string; ciudad: string; img: string; bio: string };
export const PONENTES: Ponente[] = [
  { id: "carla-soto", n: "Carla Soto", oficio: "Diseño de identidad", ciudad: "Ciudad de México", img: `${I}ponente-1.webp`, bio: "Ha dibujado la identidad de tres museos y un partido político. Habla de cómo se defiende una marca en una asamblea." },
  { id: "teo-brandt", n: "Teo Brandt", oficio: "Arte generativo", ciudad: "Berlín", img: `${I}ponente-2.webp`, bio: "Programa piezas que cambian con el tiempo de la ciudad donde se exponen." },
  { id: "elvira-mas", n: "Elvira Mas", oficio: "Tipografía", ciudad: "Barcelona", img: `${I}ponente-3.webp`, bio: "Lleva veinte años dibujando letras para periódicos; su última familia tiene 64 estilos." },
  { id: "dario-quesada", n: "Darío Quesada", oficio: "Ilustración", ciudad: "Valencia", img: `${I}ponente-4.webp`, bio: "Ilustra libros infantiles y carteles de fiestas populares, y no ve la diferencia." },
  { id: "nora-ike", n: "Nora Ike", oficio: "Dirección creativa", ciudad: "Lagos", img: `${I}ponente-5.webp`, bio: "Dirige un estudio de doce personas que hace campañas para marcas de cuatro continentes." },
  { id: "pol-arnau", n: "Pol Arnau", oficio: "Código creativo", ciudad: "Lisboa", img: `${I}ponente-6.webp`, bio: "Hace instalaciones con sensores baratos y explica cómo en un repositorio abierto." },
];

export type Sesion = { id: string; dia: 0 | 1 | 2; hora: string; t: string; ponente?: string; sala: "Nave 1" | "Nave 2" | "Patio"; tipo: "Charla" | "Taller" | "Mesa" | "Fiesta" };
export const DIAS = ["Mié 15 · Foro", "Jue 16 · Pleno", "Vie 17 · Pleno"];
export const SESIONES: Sesion[] = [
  { id: "f1", dia: 0, hora: "10:00", t: "Defender una marca en público", ponente: "carla-soto", sala: "Nave 1", tipo: "Charla" },
  { id: "f2", dia: 0, hora: "11:30", t: "Mesa: precios, plazos y clientes", sala: "Nave 1", tipo: "Mesa" },
  { id: "f3", dia: 0, hora: "16:00", t: "Portfolio en vivo: revisión de proyectos", sala: "Nave 2", tipo: "Taller" },
  { id: "p1", dia: 1, hora: "10:30", t: "Obras que cambian con el tiempo", ponente: "teo-brandt", sala: "Nave 1", tipo: "Charla" },
  { id: "p2", dia: 1, hora: "12:00", t: "Dibujar 64 estilos sin perder el norte", ponente: "elvira-mas", sala: "Nave 1", tipo: "Charla" },
  { id: "p3", dia: 1, hora: "16:00", t: "Sensores de tres euros", ponente: "pol-arnau", sala: "Nave 2", tipo: "Taller" },
  { id: "p4", dia: 1, hora: "22:00", t: "Fiesta de apertura", sala: "Patio", tipo: "Fiesta" },
  { id: "v1", dia: 2, hora: "10:30", t: "El cartel de fiestas es diseño", ponente: "dario-quesada", sala: "Nave 1", tipo: "Charla" },
  { id: "v2", dia: 2, hora: "12:00", t: "Un estudio, cuatro continentes", ponente: "nora-ike", sala: "Nave 1", tipo: "Charla" },
  { id: "v3", dia: 2, hora: "17:00", t: "Clausura y premios del público", sala: "Nave 1", tipo: "Mesa" },
];

export type Entrada = { id: string; n: string; precio: number; d: string; incluye: string[] };
export const ENTRADAS: Entrada[] = [
  { id: "foro", n: "Foro", precio: 120, d: "Miércoles 15: el día profesional", incluye: ["Charlas y mesas del foro", "Revisión de portfolio", "Comida"] },
  { id: "pleno", n: "Pleno", precio: 180, d: "Jueves 16 y viernes 17", incluye: ["Todas las charlas del festival", "Talleres con plaza libre", "Fiesta de apertura"] },
  { id: "semana", n: "Semana", precio: 260, d: "Los tres días", incluye: ["Foro y festival", "Talleres con reserva", "Fiesta y clausura"] },
  { id: "estudiante", n: "Estudiante", precio: 70, d: "Jueves y viernes, con carné", incluye: ["Charlas del festival", "Fiesta de apertura"] },
];

export const FAQ = [
  "¿Dónde es?|En Las Naves, Calle de Joan Verdeguer 16, Valencia. Metro Ayora o tranvía Marina.",
  "¿Las charlas son en español?|La mayoría. Las de ponentes de fuera tienen traducción simultánea con auriculares.",
  "¿Puedo cambiar el nombre de la entrada?|Sí, hasta una semana antes, desde el correo de confirmación.",
  "¿Hay entradas de un solo día?|El foro es de un día. Para el festival, la entrada Pleno cubre jueves y viernes.",
  "¿Es accesible?|Las tres salas están a pie de calle y hay bucle magnético en la Nave 1.",
].join("\n");

export const PAGINAS = [
  { path: "programa", titulo: "Programa" },
  { path: "ponentes", titulo: "Ponentes" },
  ...PONENTES.map((p) => ({ path: `ponentes/${p.id}`, titulo: p.n })),
  { path: "entradas", titulo: "Entradas" },
  { path: "lugar", titulo: "El lugar" },
  { path: "preguntas", titulo: "Preguntas" },
  { path: "prensa", titulo: "Sala de prensa" },
];
