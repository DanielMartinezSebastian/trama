/** Faro — producto SaaS ficticio (bandeja de soporte con agentes). Fórmula «Producto nocturno» (docs/13, a partir de Linear y
 * Raycast): negro casi puro, Inter de peso medio con tracking negativo, la interfaz real como héroe con luz que cae desde arriba
 * y un fundido hacia el suelo, haces de luz detrás del titular, párrafo en dos tonos, secciones «título a la izquierda, texto a
 * la derecha», explorador de funciones, atajos de teclado y ⌘K. Datos puros. */

export const SLUG = "faro";

export const meta = {
  slug: SLUG,
  name: "Faro",
  title: "Faro · soporte para equipos y agentes",
  blurb:
    "Landing de producto con la fórmula «Producto nocturno» (Linear, Raycast): negro casi puro, titular en Inter 510 con tracking negativo, haces de luz en WebGL detrás, la propia aplicación como imagen principal con un foco desde arriba y fundido al suelo, logos de clientes, párrafo en dos tonos, secciones título-texto, explorador de funciones con capturas, atajos con teclas, ⌘K que busca en la página, precios y un cierre con manchas de color. Usa GradientField (beams, mesh), AppShell, FeatureExplorer, Kbd, CommandPalette, LogoCloud, PricingSection, Badge y Footer.",
  accent: "#7170ff",
  tag: "SaaS · producto",
};

export const ROUTES = [{ path: "", title: "Inicio" }];

export type Ticket = { id: string; title: string; who: string; tag: string; tone: "acc" | "ok" | "warn" | "mut"; state: string; time: string };
export const TICKETS: Ticket[] = [
  { id: "SOP-2184", title: "No llegan los correos de recuperación", who: "Lucía M.", tag: "Correo", tone: "warn", state: "En curso", time: "hace 2 min" },
  { id: "SOP-2183", title: "Factura duplicada en marzo", who: "Agente · Facturas", tag: "Pagos", tone: "acc", state: "Resuelto por agente", time: "hace 6 min" },
  { id: "SOP-2179", title: "¿Se puede exportar a CSV?", who: "Agente · Docs", tag: "Producto", tone: "ok", state: "Respondido", time: "hace 14 min" },
  { id: "SOP-2176", title: "Error 500 al subir un adjunto grande", who: "Marc R.", tag: "Bug", tone: "warn", state: "Escalado a ingeniería", time: "hace 31 min" },
  { id: "SOP-2170", title: "Cambiar el titular de la cuenta", who: "Agente · Cuentas", tag: "Cuenta", tone: "mut", state: "Esperando al cliente", time: "hace 1 h" },
];

export const SECTIONS = [
  {
    id: "entrada",
    title: "Entrada y reparto",
    text: "Correo, chat, formularios y Slack llegan a una sola bandeja. Faro etiqueta, prioriza y asigna cada conversación al equipo que toca antes de que nadie la abra.",
  },
  {
    id: "agentes",
    title: "Agentes que resuelven",
    text: "Los agentes de Faro responden lo repetido con tus documentos y tu tono, y pasan a una persona lo que no saben, con el resumen hecho.",
  },
  {
    id: "informes",
    title: "Lo que pasa, en cifras",
    text: "Tiempo de primera respuesta, resolución por canal y temas que crecen esta semana. Sin exportar a una hoja de cálculo.",
  },
];

export const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["⌘", "K"], label: "Buscar o ejecutar" },
  { keys: ["C"], label: "Nueva conversación" },
  { keys: ["A"], label: "Asignar" },
  { keys: ["⇧", "R"], label: "Responder con agente" },
  { keys: ["E"], label: "Cerrar" },
];

export const PLANS =
  "Inicio|0 €|/ mes|no|3 personas;1 agente;Correo y chat;-Informes|Para empezar a ordenar el soporte|0 €\n" +
  "Equipo|19 €|/ persona y mes|si|Personas ilimitadas;Agentes ilimitados;Todos los canales;Informes|Para equipos que crecen|190 €\n" +
  "Empresa|A medida||no|SSO y SCIM;Residencia de datos en la UE;Acuerdo de nivel de servicio;Gestor de cuenta|Para organizaciones grandes|A medida";

/* ---------- capturas de interfaz dibujadas (SVG): no hay producto real que fotografiar ---------- */
const C = { bg: "#0d0e10", panel: "#141518", ln: "#24262b", fg: "#e6e7ea", mut: "#6f747d", acc: "#7170ff", ok: "#4cc38a", warn: "#f2b84b" };
const svg = (body: string) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="${C.bg}"/>${body}</svg>`)}`;
const bar = (x: number, y: number, w: number, h: number, f: string, r = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}"/>`;

function inboxArt() {
  const cols = ["Correo", "Chat", "Slack"];
  let s = "";
  cols.forEach((_, i) => {
    const x = 40 + i * 250;
    s += bar(x, 50, 230, 500, C.panel, 12) + bar(x + 20, 72, 70, 10, C.mut) + bar(x + 190, 72, 20, 10, C.ln);
    for (let k = 0; k < 4 - (i % 2); k++) {
      const y = 104 + k * 104;
      s += bar(x + 14, y, 202, 90, C.bg, 10) + bar(x + 28, y + 18, 60, 8, C.mut) + bar(x + 28, y + 36, 150 - k * 12, 10, C.fg);
      s += bar(x + 28, y + 62, 46, 14, [C.acc, C.ok, C.warn][(k + i) % 3], 7);
    }
  });
  return svg(s);
}

function agentArt() {
  let s = bar(80, 60, 640, 480, C.panel, 16);
  s += `<circle cx="128" cy="116" r="18" fill="${C.ln}"/>` + bar(160, 102, 300, 10, C.fg) + bar(160, 122, 220, 10, C.mut);
  s += bar(250, 180, 420, 96, C.bg, 12) + `<circle cx="660" cy="190" r="0"/>` + bar(272, 202, 320, 10, C.fg) + bar(272, 222, 360, 10, C.fg) + bar(272, 242, 180, 10, C.mut);
  s += bar(250, 296, 160, 26, C.acc, 13) + bar(424, 296, 130, 26, C.ln, 13);
  s += `<circle cx="128" cy="380" r="18" fill="${C.acc}"/>` + bar(160, 366, 120, 10, C.acc) + bar(160, 386, 360, 10, C.mut) + bar(160, 406, 280, 10, C.mut);
  s += bar(110, 470, 580, 44, C.bg, 10) + bar(130, 487, 180, 10, C.mut) + bar(640, 480, 32, 24, C.fg, 6);
  return svg(s);
}

function reportArt() {
  let s = bar(40, 40, 720, 520, C.panel, 16);
  [0, 1, 2].forEach((i) => {
    const x = 70 + i * 230;
    s += bar(x, 70, 200, 90, C.bg, 10) + bar(x + 18, 90, 80, 8, C.mut) + bar(x + 18, 112, 90 - i * 14, 24, C.fg, 4);
  });
  const vals = [40, 64, 52, 80, 72, 110, 96, 140, 128, 160, 150, 190];
  vals.forEach((v, i) => (s += bar(90 + i * 52, 500 - v * 1.6, 30, v * 1.6, i === vals.length - 1 ? C.acc : C.ln, 4)));
  s += bar(70, 520, 660, 1, C.ln, 0);
  return svg(s);
}

export const FEATURES = [
  { title: "Bandeja unificada", text: "Todos los canales en columnas, con etiquetas y prioridad puestas al llegar.", image: inboxArt(), alt: "Bandeja de Faro con tres columnas: correo, chat y Slack" },
  { title: "Agentes con tus documentos", text: "Un agente propone la respuesta; tú apruebas, editas o se la pasas a otra persona.", image: agentArt(), alt: "Conversación con la respuesta propuesta por un agente y los botones para enviarla o editarla" },
  { title: "Informes sin hojas de cálculo", text: "Tiempo de respuesta, volumen por canal y temas en alza, actualizados al minuto.", image: reportArt(), alt: "Panel de informes con tres cifras y un gráfico de barras" },
];
