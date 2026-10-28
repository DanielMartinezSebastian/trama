import type { BriefService } from "@/components/ui/BriefFlow";
import type { EnrollmentCohort } from "@/components/ui/EnrollmentFlow";

/* Datos de Ahora (docs/56): cursos con temario y convocatorias, profesores, diario y formación para empresas. Datos puros. */

const I = "/img/inspiraciones/ahora/";

export type Profe = { id: string; name: string; role: string; photo: string; bio: string };

export const PROFES: Profe[] = [
  { id: "alan", name: "Alan Cuní", role: "Laboratorio Frontera", photo: `${I}profe-alan.webp`, bio: "Dirige la estrategia de producto de un laboratorio de innovación; antes, quince años en agencias." },
  { id: "simon", name: "Simón Gómez", role: "Estudio Norte", photo: `${I}profe-simon.webp`, bio: "Fundador de un estudio de marca con clientes en tres continentes." },
  { id: "manuel", name: "Manuel Serrano", role: "Grupo Alba", photo: `${I}profe-manuel.webp`, bio: "Director financiero de un grupo creativo: explica números a gente de letras." },
  { id: "dora", name: "Dora Núñez", role: "Nielsen Lab", photo: `${I}profe-dora.webp`, bio: "Investigadora de usabilidad; ha medido más de 300 productos digitales." },
  { id: "clara", name: "Clara Vela", role: "Infinito Marca", photo: `${I}profe-clara.webp`, bio: "Directora creativa; lleva la marca de dos empresas del IBEX." },
  { id: "oscar", name: "Óscar Ruiz", role: "Turing Labs", photo: `${I}profe-oscar.webp`, bio: "Diseña operaciones de equipos creativos de 5 a 500 personas." },
  { id: "ines", name: "Inés Lago", role: "Producto, ex-Uber", photo: `${I}profe-ines.webp`, bio: "Ha llevado producto en dos empresas de movilidad; mentora de fundadoras." },
];

export type Curso = { id: string; t: string; f: string; formato: "en línea" | "presencial"; precio: number; senal: number; duracion: string; texto: string; temario: string[]; profes: string[]; fechas: EnrollmentCohort[] };

const enLinea: EnrollmentCohort[] = [
  { label: "Acceso inmediato", dates: "a tu ritmo", status: "open" },
  { label: "Edición en directo", dates: "enero 2027 · martes a las 18:00", status: "few", seats: 5 },
];

export const CURSOS: Curso[] = [
  { id: "marca-hoy", t: "Marca hoy", f: "A tu ritmo, en línea", formato: "en línea", precio: 490, senal: 490, duracion: "6 semanas · 4 h a la semana", texto: "Cómo se construye una marca que aguante: posicionamiento, identidad, tono y sistema, con casos de estudios de Madrid.", temario: ["Posicionamiento y promesa", "Identidad visual como sistema", "Tono y voz", "Marca en producto", "Medir una marca", "Proyecto final con revisión"], profes: ["simon", "clara"], fechas: enLinea },
  { id: "estrategia-producto", t: "Estrategia de diseño de producto", f: "A tu ritmo, en línea", formato: "en línea", precio: 590, senal: 590, duracion: "8 semanas · 4 h a la semana", texto: "Del problema a la hoja de ruta: investigación, apuestas, métricas y cómo defender las decisiones de diseño ante negocio.", temario: ["Encontrar el problema", "Investigación ligera", "Apuestas y prioridades", "Métricas que importan", "Hoja de ruta", "Contarlo a dirección"], profes: ["alan", "dora", "ines"], fechas: enLinea },
  { id: "liderazgo-creativo", t: "Liderazgo creativo", f: "A tu ritmo, en línea", formato: "en línea", precio: 540, senal: 540, duracion: "6 semanas · 3 h a la semana", texto: "Dirigir a gente creativa sin apagarla: feedback, contratación, crecimiento y cultura de equipo.", temario: ["De hacer a dirigir", "Dar y pedir feedback", "Contratar bien", "Planes de carrera", "Cultura y rituales"], profes: ["clara", "oscar"], fechas: enLinea },
  { id: "operaciones-creativas", t: "Operaciones creativas", f: "A tu ritmo, en línea", formato: "en línea", precio: 490, senal: 490, duracion: "5 semanas · 3 h a la semana", texto: "Procesos, herramientas y presupuestos para que el estudio funcione sin que nadie se queme.", temario: ["Flujo de trabajo", "Presupuestar proyectos", "Herramientas y sistemas", "Capacidad y planificación", "Cerrar proyectos"], profes: ["oscar", "manuel"], fechas: enLinea },
  { id: "programa-ejecutivo", t: "Programa ejecutivo", f: "Presencial en Madrid · julio 2027", formato: "presencial", precio: 6900, senal: 300, duracion: "5 días intensivos + 3 meses de mentoría", texto: "Por fin, un programa de negocio para líderes de diseño: finanzas, operaciones, dirección y emprendimiento, con visitas a estudios de Madrid.", temario: ["Finanzas para directivos creativos", "Operaciones y escala", "Dirección y equipos", "Emprender un estudio", "Visitas a cuatro estudios", "Mentoría individual"], profes: ["manuel", "oscar", "simon", "ines"], fechas: [{ label: "Julio 2027", dates: "12 – 16 de julio · Madrid", status: "few", seats: 4 }, { label: "Octubre 2027", dates: "por confirmar", status: "soon" }] },
  { id: "mini-mba", t: "Mini-MBA", f: "A tu ritmo, en línea", formato: "en línea", precio: 990, senal: 990, duracion: "10 semanas · 5 h a la semana", texto: "Un curso práctico de negocio impartido por líderes de producto. Domina lo esencial y da el salto en tu carrera.", temario: ["Estrategia", "Finanzas", "Marketing", "Operaciones", "Producto", "Liderazgo", "Proyecto final"], profes: ["manuel", "ines", "alan"], fechas: enLinea },
];

export const DESTACADOS = [
  { titulo: "Programas a medida", texto: "Soluciones de formación para empresas y retos concretos.", chips: ["Cuando quieras", "En línea", "Bajo pedido"], img: `${I}a-medida.webp`, href: "empresas" },
  { titulo: "Programa ejecutivo", texto: "Por fin, un programa de negocio para líderes de diseño: finanzas, operaciones, dirección y emprendimiento.", chips: ["Próxima edición: julio 2027", "Presencial"], href: "cursos/programa-ejecutivo" },
  { titulo: "Mini-MBA", texto: "Un curso práctico de negocio impartido por líderes de producto. Domina lo esencial y da el salto en tu carrera.", chips: ["A tu ritmo", "En línea"], href: "cursos/mini-mba" },
];

export const TESTIMONIOS = [
  { t: "El contenido fue muy inspirador e informativo y cubrió un montón de temas. Me encantó poder conocer a gente creativa de todo el mundo, además de a los ponentes. Pocas veces tienes esa conversación cara a cara.", a: "Vicky Fong", r: "Directora creativa asociada", img: `${I}testimonio-vicky.webp` },
  { t: "Salí con un plan de negocio para mi estudio y con una red de gente que sigue respondiendo a mis correos dos años después.", a: "Andrés Paz", r: "Fundador de un estudio de diseño", img: `${I}testimonio-andres.webp` },
];

export const DIARIO = [
  { id: "precio-del-diseno", t: "Cómo poner precio al diseño sin pedir perdón", f: "21.10.2026", autor: "manuel", texto: "Tres maneras de presupuestar —por horas, por valor y por fases— y cuándo conviene cada una. Con la plantilla que usamos en el programa ejecutivo." },
  { id: "feedback", t: "El feedback que no duele (y funciona)", f: "07.10.2026", autor: "clara", texto: "Separar la persona del trabajo, hablar de objetivos y no de gustos, y cerrar siempre con el siguiente paso." },
  { id: "madrid-creativa", t: "Madrid, ciudad creativa: diez estudios que visitar", f: "23.09.2026", autor: "simon", texto: "La ruta que hacemos con cada promoción: de los estudios de marca de Malasaña a los laboratorios de producto de Méndez Álvaro." },
];

export const SERVICIOS_EMPRESA: BriefService[] = [
  { label: "Taller para el equipo", hint: "uno o dos días, en vuestra oficina o en Madrid" },
  { label: "Programa de liderazgo", hint: "para responsables de diseño y producto" },
  { label: "Mini-MBA para equipos", hint: "grupo cerrado, con proyecto sobre vuestro negocio" },
  { label: "Viaje de estudio a Madrid", hint: "visitas a estudios y agencias" },
];

export const PAGINAS = [
  { path: "cursos", titulo: "Cursos" },
  ...CURSOS.map((c) => ({ path: `cursos/${c.id}`, titulo: c.t })),
  { path: "profesores", titulo: "Profesores" },
  { path: "empresas", titulo: "A medida" },
  { path: "diario", titulo: "Diario" },
  { path: "contacto", titulo: "Contacto" },
];
