import type { BriefService } from "@/components/ui/BriefFlow";
import type { CohortProgram } from "@/components/ui/CohortList";
import type { EnrollmentCohort } from "@/components/ui/EnrollmentFlow";

/* Datos de Oficio (docs/56): programas, talleres y cursos por lanzar con su ficha y convocatorias, mentores y
   colaboraciones. Datos puros. */

const href = (path: string) => `/inspiraciones/oficio/${path}`;

export type Programa = CohortProgram & { id: string; grupo: "programas" | "talleres" | "pronto"; precio: number; senal: number; modulos: string[]; mentores: string[]; fechas: EnrollmentCohort[] };

const ficha = (id: string, cta: string) => ({ href: href(`programas/${id}`), cta });

export const PROGRAMAS: Programa[] = [
  { id: "marketing-ia", grupo: "programas", title: "Marketing digital con IA: promoción 12", kicker: "Diseñado con Iota, agencia creativa", formats: ["12 semanas", "9 módulos", "Presencial"], includes: ["Charlas de emprendedores que lo han conseguido", "La guía para montar tu web", "IA para redes sociales", "Clases presenciales y tutorías de dudas", "Campañas reales con presupuesto: prueba tu idea"], status: "few", ...ficha("marketing-ia", "Solicitar plaza"), precio: 1490, senal: 150, modulos: ["Fundamentos y estrategia", "Tu web en una semana", "Redes con IA", "Contenido que vende", "Anuncios de pago", "Correo y automatización", "Analítica", "Campaña real", "Presentación final"], mentores: ["Iota", "Marta Gil", "Raúl Peña"], fechas: [{ label: "Promoción 12", dates: "enero – marzo 2027 · L y X tarde", status: "few", seats: 3 }, { label: "Promoción 13", dates: "abril – junio 2027", status: "soon" }] },
  { id: "rendimiento", grupo: "programas", title: "Marketing de rendimiento: promoción 1", kicker: "Diseñado con Iota, agencia creativa", formats: ["10 semanas", "8 módulos", "Presencial"], includes: ["Medios de pago desde cero", "Analítica y atribución", "Presupuestos reales"], status: "open", ...ficha("rendimiento", "Reservar clase de prueba"), precio: 1290, senal: 150, modulos: ["Embudo y objetivos", "Anuncios en buscadores", "Anuncios en redes", "Creatividades que convierten", "Analítica y atribución", "Pruebas A/B", "Presupuestos", "Caso final"], mentores: ["Iota", "Raúl Peña"], fechas: [{ label: "Promoción 1", dates: "febrero – abril 2027 · M y J tarde", status: "open", seats: 14 }] },
  { id: "contenidos", grupo: "talleres", title: "Marketing de contenidos", kicker: "Con Iota, estudio de marketing", summary: "Una masterclass interactiva y gratuita.", status: "open", ...ficha("contenidos", "Reserva tu sitio en la masterclass"), precio: 0, senal: 0, modulos: ["Qué contar y a quién", "Formatos que funcionan", "Calendario de un mes", "Preguntas en directo"], mentores: ["Iota"], fechas: [{ label: "Masterclass gratis", dates: "jueves 19 de noviembre · 19:00 · en línea", status: "open", seats: 60 }] },
  { id: "canva-ia", grupo: "talleres", title: "Canva avanzado con IA", kicker: "Con Susana K. Vera", summary: "Promoción 1: tres sábados por la mañana.", status: "soon", ...ficha("canva-ia", "Reserva tu sitio en la promoción 1"), precio: 190, senal: 50, modulos: ["Plantillas y marca", "Imágenes con IA", "Vídeo corto", "Tu kit para redes"], mentores: ["Susana K. Vera"], fechas: [{ label: "Promoción 1", dates: "enero 2027 · sábados", status: "soon" }] },
  ...["Diseño gráfico con IA", "Creación de contenido y marketing", "Gestión de personas", "Ventas sin miedo"].map((t, i): Programa => {
    const id = ["diseno-ia", "creacion-contenido", "gestion-personas", "ventas"][i];
    return { id, grupo: "pronto", title: t, summary: "Ahora mismo en pruebas internas. Apúntate a la lista y te avisamos el primero.", status: "soon", ...ficha(id, "Reservar ya"), precio: 0, senal: 0, modulos: ["Introducción", "Estrategia en redes", "Creación y anuncios", "Y mucho más…"], mentores: [], fechas: [{ label: "Primera promoción", dates: "2027", status: "soon" }] };
  }),
];

export const MENTORES = [
  { n: "Iota", r: "Agencia creativa · diseña los programas de marketing" },
  { n: "Marta Gil", r: "Directora de contenido · 12 años en agencias" },
  { n: "Raúl Peña", r: "Medios de pago · ha gestionado 4 M€ en anuncios" },
  { n: "Susana K. Vera", r: "Diseñadora · creadora de plantillas para marcas" },
  { n: "Lola Ibáñez", r: "Personas y equipos · ex-directora de RR. HH." },
  { n: "Tomás Rey", r: "Ventas B2B · fundador de dos empresas" },
];

export const SERVICIOS_MENTOR: BriefService[] = [
  { label: "Dar un programa", hint: "de 8 a 12 semanas, presencial" },
  { label: "Dar una masterclass", hint: "una tarde, en línea o en Madrid" },
  { label: "Mentorías uno a uno", hint: "con los alumnos de una promoción" },
];

export const SERVICIOS_COLABORA: BriefService[] = [
  { label: "Charla en tu evento", hint: "foros, ferias y congresos" },
  { label: "Taller para tu empresa", hint: "marketing, ventas o IA para el equipo" },
  { label: "Alianza con tu centro", hint: "institutos, universidades y asociaciones" },
];

export const PAGINAS = [
  { path: "programas", titulo: "Programas" },
  ...PROGRAMAS.map((p) => ({ path: `programas/${p.id}`, titulo: p.title })),
  { path: "mentores", titulo: "Mentores" },
  { path: "colabora", titulo: "Colabora" },
  { path: "legal", titulo: "Condiciones y privacidad" },
];
