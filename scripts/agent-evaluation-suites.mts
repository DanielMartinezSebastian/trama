/** Encargos y criterios fijados antes de generar las respuestas; P4 conserva sus defaults. */
export type EvaluationSuite = {
  id: string;
  guide: string;
  fonts: string;
  reference: string;
  artSrc: string;
  compositionContent: string[];
  tasks: { id: string; prompt: string }[];
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
  signature: {
    id: "signature", guide: "sin guía prefijada", fonts: "Inter/Newsreader/JetBrains Mono", reference: ".refs3d/research-igloo-inc/desktop/pantallas/00.jpg", artSrc: "/images/trazo.svg",
    compositionContent: [],
    tasks: [
      { id: "webgl", prompt: "Construye la primera pantalla y un recorrido corto para NIVAL, observatorio ficticio que registra el movimiento del hielo. Esta referencia visual es Igloo Inc. de Awwwards. Conserva la firma técnica observada: escena WebGL/Three a sangre, objeto geométrico procedural que evoluciona al avanzar por 3 capítulos, movimiento de cámara/profundidad y partículas; los capítulos deben tener cambios visuales claros y texto HTML legible encima. Reinterpreta su ritmo y atmósfera con un objeto y formas propios; no copies ni reuses sus assets, modelo, texto o marca. No sustituyas la escena 3D por una fotografía con filtro/shader 2D. Usa el canvas de React Three Fiber con geometría procedural y useFrame, o una pieza pública de Trama solo si conserva esos cambios de objeto/cámara/escena; explica la elección en el brief. Sin imágenes raster, red ni dependencias nuevas: instalación disponible incluye `@react-three/fiber` y `three`. Usa un tema/expedición propio, no impongas GuideFrame; mantén h1, texto principal, navegación y CTA accesibles y visibles. Implementa scroll de al menos 3 actos (puede apoyarse en window.scrollY) y respuesta del puntero. Registra en brief qué firma conservaste, qué reinterpreta tu escena y la técnica real. La imagen se refiere a composición/medio, no a los activos." },
      { id: "directions", prompt: "Una misma empresa ficticia crea software a medida para grandes organizaciones, con UX de alto impacto en campañas, aplicaciones, webs y ferias. Diseña tres propuestas de homepage realmente distintas para esta misma empresa, originales y accionables. Entrégalas en un solo componente como un selector accesible con `role=tablist`, tres botones `role=tab` y tres paneles alternativos; cada panel debe ocupar una página completa (no mini-tarjeta) y cambiar su estructura, jerarquía, medio dominante, gesto/acción y navegación. Descubre tres conceptos a partir del encargo, no partas de una guía o plantilla común; permite que cada uno use dirección visual y tokens diferentes, conservando solo señales corporativas coherentes. No reutilices entre las tres el esquema hero→tarjetas→contacto, una misma grilla o solo cambies paleta/tipo/copy. Cada propuesta explica el valor y lleva a una acción distinta o adaptada. Usa solo piezas públicas de Trama, HTML/CSS/Canvas 2D o SVG local; no imágenes raster, red, rutas ni dependencias nuevas. En `brief` compara las tres por concepto, composición, medio, acción, navegación, tipografía/tono, y marca al menos cuatro diferencias estructurales comprobables. El control de variantes se excluye de los diseños comparados." },
    ],
  },
};

export function evaluationSuite(id: string): EvaluationSuite {
  const suite = Object.hasOwn(EVALUATION_SUITES, id) ? EVALUATION_SUITES[id] : undefined;
  if (!suite) throw new Error(`Suite de evaluación desconocida: ${id}`);
  return suite;
}
