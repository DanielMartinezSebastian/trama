/** Encargos y criterios fijados antes de generar las respuestas; P4 conserva sus defaults. */
export type EvaluationSuite = {
  id: string;
  guide: string;
  fonts: string;
  reference: string;
  artSrc: string;
  compositionContent: string[];
  tasks: { id: "composition" | "reference" | "booking"; prompt: string }[];
};

export const EVALUATION_SUITES: Record<string, EvaluationSuite> = {
  salon: {
    id: "salon", guide: "salon", fonts: "Cormorant/Manrope", reference: ".refs3d/agent-pilot/reference-hero.png", artSrc: "/images/trazo.svg",
    compositionContent: ["Consulta inicial", "Corte", "Color", "35", "65"],
    tasks: [
      { id: "composition", prompt: "Construye una sección comercial conocida para Linde, salón ficticio. Un h1 'Linde — Corte y color', introducción breve, tres servicios (Consulta inicial gratis/15 min; Corte 35 €/45 min; Color desde 65 €/90 min), y enlaces claros para reservar usando bookHref. Guía salon, contraste legible, disposición responsive y copy propio. Usar piezas del kit que encajen. Sin imágenes ni servicios conectados." },
      { id: "reference", prompt: "Adapta la captura adjunta al hero de Linde. Mantén jerarquía editorial con el titular 'Un corte. Un color. Tu manera.', texto breve y CTA usando bookHref. En escritorio texto a la izquierda e ilustración a la derecha; en móvil apilar texto antes de imagen sin desborde. La ilustración propia se recibe como artSrc, con alt descriptivo. Guía salon, tono cálido y contraste legible. No afirmes conocer tipografías/CSS exactos de la imagen; registra observado/inferido/decidido en brief.md. Se pide adaptación, no igualdad de píxeles." },
      { id: "booking", prompt: "Implementa un flujo de reserva local con Trama. Si mode='book': servicio/profesional, día/hueco, datos inválidos y confirmación con enlace appointmentsHref. Si mode='appointments': vacío/citas persistidas, enlace bookHref, anulación con confirmación. Servicios: consulta (15min/0€), corte (45min/35€), color (90min/65€/from); Alba hace todos y Dani consulta/corte. Usa la storageKey recibida para ambas vistas; textos explícitos de demostración sin correos/agenda conectados. Cerrado 0,1; sábado cierre14; times 10,11,12,13,16,17,18 en formato HH:mm, min1 max45, cutoff24h. Un h1 propio por vista. Guía salon. No implementes un servidor de reservas." },
    ],
  },
  boutique: {
    id: "boutique", guide: "boutique", fonts: "Cormorant/Inter", reference: ".refs3d/agent-boutique/reference-hero.png", artSrc: "/images/movimiento.svg",
    compositionContent: ["Sesión inicial", "Clase privada", "Dúo", "35", "65"],
    tasks: [
      { id: "composition", prompt: "Construye una sección comercial para Compás, estudio ficticio de pilates. Un h1 'Compás — Pilates y movimiento', introducción breve, tres servicios (Sesión inicial gratis/15 min; Clase privada 35 €/45 min; Dúo desde 65 €/60 min), y enlaces claros para reservar usando bookHref. Guía boutique, contraste legible, disposición responsive y copy propio. Usar piezas del kit que encajen. Sin imágenes ni servicios conectados." },
      { id: "reference", prompt: "Adapta la captura adjunta al hero de Compás, estudio ficticio de pilates. Mantén jerarquía editorial con el titular 'Fuerza con calma. Movimiento contigo.', texto breve y CTA usando bookHref. En escritorio texto a la izquierda e ilustración a la derecha; en móvil apilar texto antes de imagen sin desborde. La ilustración propia se recibe como artSrc, con alt descriptivo. Guía boutique, tono cercano y contraste legible. No afirmes conocer tipografías/CSS exactos de la imagen; registra observado/inferido/decidido en brief.md. Se pide adaptación, no igualdad de píxeles." },
      { id: "booking", prompt: "Implementa un flujo de reserva local para Compás, estudio ficticio de pilates, con Trama. Si mode='book': servicio/profesional, día/hueco, datos inválidos y confirmación con enlace appointmentsHref. Si mode='appointments': vacío/citas persistidas, enlace bookHref, anulación con confirmación. Servicios: inicial (15min/0€, Sesión inicial), privada (45min/35€, Clase privada), duo (60min/65€/from, Dúo); Alba hace todos y Dani inicial/privada. Usa la storageKey recibida para ambas vistas; textos explícitos de demostración sin correos/agenda conectados. Cerrado 0,1; sábado cierre14; times 10,11,12,13,16,17,18 en formato HH:mm, min1 max45, cutoff24h. Un h1 propio por vista. Guía boutique. No implementes un servidor de reservas ni presentes la demo como tratamiento sanitario." },
    ],
  },
};

export function evaluationSuite(id: string): EvaluationSuite {
  const suite = Object.hasOwn(EVALUATION_SUITES, id) ? EVALUATION_SUITES[id] : undefined;
  if (!suite) throw new Error(`Suite de evaluación desconocida: ${id}`);
  return suite;
}
