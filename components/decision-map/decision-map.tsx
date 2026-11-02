"use client";

import { memo, useCallback, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
} from "@xyflow/react";
import styles from "./decision-map.module.css";

type RuleKind = "gate" | "guide" | "choice" | "handoff" | "output";
type Decision = {
  id: string;
  stage: string;
  kind: RuleKind;
  owner: string;
  title: string;
  summary: string;
  trigger: string;
  result: string;
  source: string;
  paths: string[];
  branches: { when: string; then: string }[];
};
type DecisionNodeData = Decision & { selected: boolean; dimmed: boolean; visible: boolean };
type DecisionNode = Node<DecisionNodeData, "decision">;

const decisions: Decision[] = [
  { id:"route", stage:"01 · Entrada y alcance", kind:"guide", owner:"Orquestador + descripciones de skills", title:"¿Qué tipo de trabajo describe el encargo?", summary:"La activación depende de la petición y el contexto, no de una secuencia única.", trigger:"El agente disponible interpreta el encargo y las skills que puede usar.", result:"Puede cargar build/style, sumar research para una referencia o kit-evolution para cambiar Trama. Solo investigar/revisar conserva ese alcance.", source:"Descripciones y límites de las cuatro skills instaladas.", paths:["build","reference","variants","kit","revision"], branches:[{when:"Construir/editar con Trama",then:"trama-build; trama-style cuando hay decisiones visuales."},{when:"La referencia cambia decisiones",then:"trama-research puede preparar evidencia para style/build."},{when:"Cambiar una capacidad del kit fuente",then:"trama-kit-evolution."},{when:"Solo investigar o revisar",then:"Entregar ese análisis sin convertirlo en demo o cambio de kit."}]},
  { id:"scope", stage:"01 · Entrada y alcance", kind:"choice", owner:"Todas las skills · alcance", title:"¿Cuál es el resultado autorizado?", summary:"Construir, estudiar y cambiar la librería son alcances distintos.", trigger:"Interpretar el verbo, objeto y autorización expresa del encargo.", result:"Mantener el trabajo en consumidor/demo, entregar brief/propuesta o implementar una capacidad reusable autorizada.", source:"trama-research · alcance; trama-build · consumidor; trama-kit-evolution · autorización.", paths:["build","reference","variants","kit","revision"], branches:[{when:"Demo/consumidor",then:"Resolver localmente; no cambiar el paquete público."},{when:"Análisis sin construcción",then:"Entregar expediente o brief, sin implementar."},{when:"Evolución de Trama pedida",then:"Investigar la capa reusable e implementar el mínimo sustentado."},{when:"Publicar, desplegar o push",then:"Requiere autorización propia; no se deduce del encargo de construir."}]},
  { id:"requirements", stage:"01 · Entrada y alcance", kind:"choice", owner:"trama-build + trama-style", title:"¿Qué es obligatorio y qué queda libre?", summary:"Separa restricciones reales de preferencias para no cerrar opciones por defecto.", trigger:"Antes de fijar concepto, estilo, contenido y arquitectura.", result:"Conservar requisitos; explorar fuera de la marca cuando el usuario permita esa libertad.", source:"trama-build · varias versiones; trama-style · variedad y marca.", paths:["build","reference","variants","kit","revision"], branches:[{when:"Innegociable",then:"Funcionalidad, contenido legal, marca expresamente exigida e integración requerida."},{when:"Preferencia o inspiración parcial",then:"Orientan sin convertirse automáticamente en límites rígidos."},{when:"Hueco no especificado",then:"Decisión creativa informada; no rellenar siempre con la misma plantilla."}]},
  { id:"research-mode", stage:"02 · Referencia y evidencia", kind:"choice", owner:"trama-research", title:"¿Qué modo de investigación corresponde?", summary:"Cinco modos, con un valor predeterminado explícito para referencias premiadas.", trigger:"Hay una referencia que cambia decisiones o se pidió estudiarla.", result:"Elegir reproducción, adaptación, inspiración fiel a firma, inspiración temática libre o estudio sin construir.", source:"trama-research · identificación del modo.", paths:["reference","variants","kit"], branches:[{when:"Reproducir / adaptar",then:"Analizar qué rasgos se mantienen y cuáles se traducen."},{when:"Web premiada, “inspirada en”, “pseudo-clon”",then:"Por defecto, inspiración con fidelidad de firma."},{when:"Inspiración temática libre",then:"Solo si el usuario pide expresamente un punto de partida suelto."},{when:"Solo investigar",then:"Entregar el expediente sin construir."},{when:"Sin referencia pertinente",then:"Omitir esta skill."}]},
  { id:"evidence", stage:"02 · Referencia y evidencia", kind:"gate", owner:"trama-research", title:"¿Qué se observó y qué sigue incierto?", summary:"No completar los huecos con hechos inventados.", trigger:"Cada expediente basado en URL, captura o guía externa.", result:"Brief acotado y trazable con incertidumbres explícitas.", source:"trama-research · captura, URL y registro observado/inferido/decidido.", paths:["reference","variants","kit"], branches:[{when:"URL",then:"Fecha, URL final, viewport, scroll, carga, rutas/estados y acción explorada."},{when:"Captura",then:"Archivo/hash, dimensiones, recorte y regiones; una imagen no demuestra CSS o interacción."},{when:"Hallazgos",then:"Separar observado, inferido y decidido; anotar lo no observado."},{when:"Alcance",then:"Inspeccionar las regiones que cambian decisiones, no rastrear todo por defecto."}]},
  { id:"signature", stage:"02 · Referencia y evidencia", kind:"gate", owner:"trama-research → trama-build", title:"¿Cuál es la firma que se debe preservar?", summary:"La firma incluye arquitectura, medio, gesto, coreografía, profundidad y texto.", trigger:"Inspiración con fidelidad, reproducción o adaptación cuyo comportamiento observado importa.", result:"Marcar cada rasgo conservar/reinterpretar/omitir; capturar el momento de firma antes de extender el sitio.", source:"trama-research · matriz de traducción; trama-build · puerta de fidelidad.", paths:["reference"], branches:[{when:"Medio observado: DOM / canvas / shader / Three-WebGL / WebGPU",then:"Mantener el medio dominante; no sustituir escena 3D por filtro de imagen salvo que esa fuera la técnica."},{when:"Firma identificada",then:"Construir y capturar la escena/gesto antes del resto."},{when:"Activos y contenido",then:"Cambiar marca, copy, datos y assets para evitar clonar."}]},
  { id:"cinema", stage:"02 · Referencia y evidencia", kind:"guide", owner:"trama-research + herramientas Cine", title:"¿La decisión depende de 3D, WebGL o movimiento?", summary:"Profundizar en evidencia temporal solo cuando afecta a la propuesta.", trigger:"La escena, cámara, shader, movimiento, transición o coste deciden el resultado.", result:"Capturar y analizar los gestos pertinentes; una captura estática no acredita movimiento.", source:"trama-research · Cine/WebGL; método Cine del repositorio.", paths:["reference","kit"], branches:[{when:"Sí",then:"Mapa/capturas temporales y herramientas Cine según la pregunta."},{when:"No",then:"No exigir estudio 3D a una web DOM convencional."},{when:"Varias referencias",then:"Separar patrones compartidos de firmas singulares."}]},
  { id:"context", stage:"03 · Contexto Trama", kind:"gate", owner:"trama-build + trama-style", title:"¿Qué kit y versión están instalados?", summary:"La API real del consumidor es la fuente de compatibilidad.", trigger:"Antes de recomendar guías, componentes, imports o configuración Next.", result:"Resolver contexto, revisar índice y consultar catálogo/exports/declaraciones de esa versión.", source:"trama-build · detección de contexto; trama-style · conocimiento instalado.", paths:["build","reference","variants","revision"], branches:[{when:"Índice disponible",then:"Abrir después solo guía, receta y piezas pertinentes."},{when:"Pieza ausente del índice",then:"Buscar en CATALOG, exports y declaraciones antes de concluir que falta."},{when:"Versión antigua/sin knowledge",then:"Usar su catálogo y declaraciones; no copiar valores de main/latest."},{when:"Código copiado",then:"Revisar .kit.json y adaptaciones locales."}]},
  { id:"resources", stage:"03 · Contexto Trama", kind:"choice", owner:"trama-build + trama-style", title:"¿Qué recurso existente encaja?", summary:"Recetas, demos y guías informan; no fijan una plantilla.", trigger:"Con el contexto del kit resuelto.", result:"Usar secciones/piezas, referencia/receta, guía/adaptación o composición local según el encargo.", source:"trama-build · selección; trama-style · guía no plantilla.", paths:["build","reference","variants","revision"], branches:[{when:"Secciones encajan",then:"Componer con ellas primero y bajar a piezas para lo específico."},{when:"Receta / web completa / inspiración",then:"Tomar evidencia de estructura, no copiarla automáticamente."},{when:"Guía visual",then:"Seleccionar por público, contenido, acción y firma; guía no es arquitectura."},{when:"Pieza no adecuada",then:"Composición local; no forzar una API ni usar internals."}]},
  { id:"direction", stage:"04 · Dirección visual", kind:"choice", owner:"trama-style", title:"¿Guía, adaptación o dirección propia?", summary:"Tres salidas legítimas; referencias tienen prioridad de firma.", trigger:"Definir color, tipografía, espacio, superficie y movimiento.", result:"Conservar una dirección ya elegida o crear una compatible sin forzar GuideFrame.", source:"trama-style · selección de dirección y GuideFrame opcional.", paths:["build","reference","variants","revision"], branches:[{when:"Identidad ya elegida",then:"Conservar salvo que el encargo pida cambiar."},{when:"Guía que encaja",then:"Aplicar roles/tokens útiles y comprobar fuentes."},{when:"Adaptación local",then:"Apartarse localmente sin alterar la guía global."},{when:"Dirección propia",then:"Válida; GuideFrame es opcional."},{when:"Referencia premiada",then:"Arquitectura, medio y coreografía prevalecen sobre el parecido de paleta."}]},
  { id:"diversity", stage:"04 · Dirección visual", kind:"choice", owner:"trama-build + trama-style", title:"¿Cómo evitar versiones que sean skins?", summary:"Abrir y comparar conceptos antes de construir todas las opciones.", trigger:"El usuario solicita varias versiones del mismo proyecto.", result:"Escoger las propuestas con mayor distancia estructural sin alterar requisitos comunes.", source:"trama-build · varias versiones; trama-style · tres o más opciones.", paths:["variants"], branches:[{when:"Primero",then:"Separar requisitos innegociables de preferencias."},{when:"Explorar",then:"Idear más candidatas que entregables y escribir una tesis para cada una."},{when:"Seleccionar",then:"Maximizar distancia en premisa, arquitectura, interacción, composición, tipografía, navegación y tono."},{when:"Tres o más versiones",then:"Diferir claramente en al menos cuatro ejes libres."},{when:"Comprobación",then:"Comparar primeros pantallazos lado a lado y descartar esqueletos repetidos."},{when:"Referencia fiel",then:"La firma estudiada limita la diversidad admisible."}]},
  { id:"images", stage:"04 · Dirección visual", kind:"choice", owner:"trama-build + trama-style", title:"¿Una imagen raster aporta algo concreto?", summary:"Generación de imagen es una opción condicional, no un paso fijo.", trigger:"Una foto, ilustración o textura puede apoyar contenido o dirección.", result:"Usar recurso lícito u original, revisar recorte y declarar alt; no presentar ficción como hecho.", source:"trama-build / trama-style · rama de imagen raster.", paths:["build","reference","variants"], branches:[{when:"No aporta",then:"Resolver con CSS, SVG, diagramas o componentes."},{when:"Hay recurso aportado/licenciado",then:"Comprobar permiso, recorte y comportamiento responsive."},{when:"Hace falta raster original y imagegen está disponible",then:"Brief de sujeto, tono, encuadre, proporción y paleta."},{when:"Imagegen no está disponible",then:"Usar recurso lícito o alternativa vector/CSS; no asumir herramienta."},{when:"En todos los casos",then:"Alt útil o vacío si decorativa; sin marcas/copy incrustados ni afirmaciones ficticias."}]},
  { id:"architecture", stage:"05 · Construcción", kind:"choice", owner:"trama-build", title:"¿Qué estructura resuelve el contenido y la acción?", summary:"La arquitectura parte del usuario y del gesto que debe completar.", trigger:"Después de fijar requisitos, contexto y dirección.", result:"Páginas, contenido, navegación, componentes y estados listos para implementar.", source:"trama-build · alcance y composición; guía del repo para Next.", paths:["build","reference","variants","revision"], branches:[{when:"Concretar",then:"Público, contenido, páginas, acción principal y alcance de integración."},{when:"Secciones encajan",then:"Usarlas con copy propio y ocultar opcionales con strings vacíos."},{when:"Firma exige otra escena/layout",then:"Composición propia; no rebajar Three/WebGL a un efecto genérico."},{when:"Next.js",then:"Leer documentación local de esa versión antes de crear rutas."}]},
  { id:"technique", stage:"05 · Construcción", kind:"choice", owner:"trama-build → trama-kit-evolution si está autorizado", title:"¿La técnica requerida existe y encaja?", summary:"Buscar motores y patrones antes de declarar una capacidad ausente.", trigger:"La dirección requiere render, movimiento o cálculo particular.", result:"Usar API pública, resolver localmente, declarar límites o traspasar una mejora reusable autorizada.", source:"trama-build · fidelidad; trama-kit-evolution · búsqueda en catálogo, Cine y motores.", paths:["reference","build","kit"], branches:[{when:"API/export disponible",then:"Usar la versión comprobada."},{when:"No aparece en índice",then:"Revisar motores, docs, atlas y catálogo."},{when:"Falta en consumidor sin permiso de kit",then:"Implementar localmente si es viable o explicar límite."},{when:"Evolución del kit autorizada",then:"Traspasar evidencia y prototipar técnica reusable."},{when:"Firma WebGL",then:"Preservar técnica y aportar evidencia temporal del gesto."}]},
  { id:"integration", stage:"05 · Construcción", kind:"gate", owner:"trama-build", title:"¿Los estados e integraciones son reales?", summary:"No presentar una simulación como servicio conectado.", trigger:"Reservas, pagos, email, identidad, disponibilidad o conexión externa.", result:"Completar estados y conectar/verificar o declarar límites con claridad.", source:"trama-build · estados relevantes e integraciones simuladas.", paths:["build","variants","revision"], branches:[{when:"Recorrido",then:"Completar carga, vacío, error y confirmación cuando apliquen."},{when:"Integración no conectada",then:"Marcarla simulada/limitada; no prometer efectos reales."},{when:"Integración requerida",then:"Conectar y verificar de extremo a extremo o declarar bloqueo."}]},
  { id:"handoff", stage:"06 · Evolución del kit", kind:"handoff", owner:"trama-research → trama-kit-evolution", title:"¿Está autorizado cambiar la librería fuente?", summary:"Una oportunidad detectada no equivale a permiso.", trigger:"Petición directa de evolucionar Trama o continuación de mejora reusable autorizada.", result:"Sin permiso: mantener demo y ofrecer opciones. Con permiso: elegir e implementar capa mínima sustentada.", source:"trama-research · traspaso; trama-kit-evolution · alcance del repo.", paths:["kit","reference"], branches:[{when:"Solo construir o investigar",then:"Mantener solución local; no cambiar node_modules ni el kit."},{when:"Usuario pidió capacidad reusable",then:"Continuar en el repo fuente y evaluar capas."},{when:"Consumidor empaquetado",then:"Nunca editar node_modules como si fuera fuente."}]},
  { id:"layer", stage:"06 · Evolución del kit", kind:"choice", owner:"trama-kit-evolution", title:"¿En qué capa generalizable pertenece?", summary:"Composición singular y técnica reusable pueden convivir.", trigger:"Cambio de kit autorizado y evidencia suficiente del hueco.", result:"Elegir composición local, ajuste, componente, técnica/motor o guía medida.", source:"trama-kit-evolution · decisiones de capa.", paths:["kit"], branches:[{when:"Firma o contenido singular",then:"Composición local/demo."},{when:"Encaja con componente público",then:"Ajustar componente existente."},{when:"Interacción útil en varios contextos",then:"Crear componente público."},{when:"Render/movimiento/cálculo compartido",then:"Técnica o motor reusable."},{when:"Familia medible de color/tipo/espacio/movimiento",then:"Guía visual; una paleta o página aislada no basta."},{when:"Evidencia/permiso insuficiente",then:"Entregar opciones, riesgos y siguiente experimento."}]},
  { id:"kit-checks", stage:"06 · Evolución del kit", kind:"gate", owner:"trama-kit-evolution", title:"¿Qué comprobaciones corresponden a esa capa?", summary:"API, guía y técnica tienen artefactos específicos, además de checks comunes.", trigger:"Después de implementar el cambio reusable autorizado.", result:"Documentación, catálogo, calidad y cuaderno consistentes; sin publicar automáticamente.", source:"trama-kit-evolution · implementar y comprobar.", paths:["kit"], branches:[{when:"Componente/API",then:"Docs §§3/9, accesibilidad, estados, cleanup, tokens, README y catálogo."},{when:"Guía",then:"Medición, ficha GuideFrame, contraste, probe y catálogo."},{when:"Técnica",then:"Receta reproducible, metas comparables y banco cuando aplica."},{when:"Todo cambio",then:"Typecheck, catalog:check, shadows, verify y build/paquete según impacto."}]},
  { id:"contrast", stage:"07 · Revisión y cierre", kind:"gate", owner:"trama-style + trama-build", title:"¿Todo el texto contrasta con su fondo real?", summary:"Los fondos variables quedan pendientes hasta medirlos o cubrirlos con scrim.", trigger:"Cada ruta/estado y superficie donde aparece texto informativo.", result:"Cero incumplimientos: 4,5:1 texto normal; 3:1 texto grande/gráfico.", source:"trama-style · contraste; trama-build · qa:contrast y estados.", paths:["build","reference","variants","revision","kit"], branches:[{when:"Medir",then:"Cada par real texto/superficie, incluidas tarjetas, estados y overlays."},{when:"Gradiente/foto/transparencia no medible",then:"Inspeccionar muestras o añadir superficie opaca; no darlo por aprobado."},{when:"Falla",then:"Corregir texto/fondo y medir de nuevo; la sombra no repara contraste."}]},
  { id:"overlap", stage:"07 · Revisión y cierre", kind:"gate", owner:"trama-style + trama-build", title:"¿La capa es intencional y el texto sigue claro?", summary:"La geometría detecta candidatos; la revisión decide si dañan la lectura.", trigger:"Capturas con tipografía densa, metadatos, capas o cambios responsive.", result:"Aceptar composición deliberada legible; corregir interferencia, clipping o controles bloqueados.", source:"trama-style · solapamientos/responsive; trama-build · qa:visual-text.", paths:["build","variants","revision"], branches:[{when:"Revisar",then:"Texto visible de span/div, rotado, metadatos y overlays; no solo h1 y controles."},{when:"Colisión deliberada, orden claro y lectura intacta",then:"Se acepta."},{when:"Tapado, mezclado, recortado, asociación confusa o clic bloqueado",then:"Fallo; corregir layout/tamaño/espacio/capa."},{when:"Responsive",then:"Anchos CSS reales y ambos lados de los breakpoints; herramienta señala candidatos."}]},
  { id:"function", stage:"07 · Revisión y cierre", kind:"gate", owner:"trama-build + kit-evolution según alcance", title:"¿El recorrido se completa en el navegador?", summary:"Compilar y capturar no demuestra que todo el flujo funcione.", trigger:"Antes de entregar web o cambio del kit.", result:"Verificar interacción, rutas, teclado, estados, responsive y movimiento según impacto.", source:"trama-build · verificación; trama-kit-evolution · comprobaciones.", paths:["build","reference","variants","revision","kit"], branches:[{when:"Probar",then:"Tipos/build, rutas, CTA, formularios, estados, teclado/foco, móvil y consola."},{when:"WebGL/movimiento",then:"Evidencia temporal del gesto; captura estática no basta."},{when:"Falla",then:"Volver a arquitectura, técnica, contexto o estilo según la causa."}]},
  { id:"feedback", stage:"07 · Revisión y cierre", kind:"output", owner:"Usuario + skills de construcción/revisión", title:"¿Qué ocurre con la elección o el feedback?", summary:"El usuario elige; el cambio vuelve al nodo responsable.", trigger:"Aprueba una dirección, señala defecto o pide más versiones.", result:"Preservar rasgos aprobados, aplicar cambios acotados y repetir las comprobaciones afectadas.", source:"trama-build · iteración; trama-style · identidad aprobada; reglas de publicación.", paths:["revision","variants"], branches:[{when:"Dirección aprobada",then:"Conservar su identidad y cambiar solo lo pedido."},{when:"Fallo concreto",then:"Corregir la decisión/capa responsable y repetir QA afectado."},{when:"Más variantes",then:"Mantener requisitos y aumentar distancia de concepto, no renombrar skins."},{when:"Entrega",then:"Informar cambios, evidencia y límites; push/publicar/desplegar requiere permiso."}]},
];

const positions: Record<string, { x: number; y: number }> = {
  route:{x:0,y:40},scope:{x:0,y:260},requirements:{x:0,y:480},
  "research-mode":{x:390,y:0},evidence:{x:390,y:220},signature:{x:390,y:440},cinema:{x:390,y:660},
  context:{x:780,y:160},resources:{x:780,y:420},
  direction:{x:1170,y:0},diversity:{x:1170,y:260},images:{x:1170,y:520},
  architecture:{x:1560,y:130},technique:{x:1560,y:390},integration:{x:1560,y:650},
  handoff:{x:1950,y:0},layer:{x:1950,y:260},"kit-checks":{x:1950,y:520},
  contrast:{x:2340,y:0},overlap:{x:2340,y:250},function:{x:2340,y:500},feedback:{x:2340,y:750},
};

const connections: { from:string; to:string; label:string; paths:string[] }[] = [
  {from:"route",to:"scope",label:"alcance",paths:["build","reference","variants","kit","revision"]},
  {from:"scope",to:"requirements",label:"resultado definido",paths:["build","reference","variants","kit","revision"]},
  {from:"requirements",to:"research-mode",label:"hay referencia",paths:["reference","variants","kit"]},
  {from:"requirements",to:"context",label:"sin referencia / consumidor",paths:["build","variants","revision"]},
  {from:"research-mode",to:"evidence",label:"estudio requerido",paths:["reference","variants","kit"]},
  {from:"research-mode",to:"context",label:"solo construir",paths:["build"]},
  {from:"evidence",to:"signature",label:"inspiración fiel",paths:["reference"]},
  {from:"evidence",to:"cinema",label:"depende de movimiento",paths:["reference","kit"]},
  {from:"signature",to:"cinema",label:"medio / gesto",paths:["reference"]},
  {from:"signature",to:"context",label:"mapear técnica",paths:["reference"]},
  {from:"cinema",to:"context",label:"técnica observada",paths:["reference","kit"]},
  {from:"context",to:"resources",label:"APIs comprobadas",paths:["build","reference","variants","revision"]},
  {from:"resources",to:"direction",label:"dirección visual",paths:["build","reference","variants","revision"]},
  {from:"direction",to:"diversity",label:"si hay varias versiones",paths:["variants"]},
  {from:"direction",to:"images",label:"asset si aporta",paths:["build","reference","variants"]},
  {from:"diversity",to:"architecture",label:"conceptos elegidos",paths:["variants"]},
  {from:"images",to:"architecture",label:"recursos listos",paths:["build","reference","variants"]},
  {from:"direction",to:"architecture",label:"una dirección",paths:["build","reference","revision"]},
  {from:"architecture",to:"technique",label:"técnica necesaria",paths:["reference","build","kit"]},
  {from:"architecture",to:"integration",label:"flujo conectado",paths:["build","variants","revision"]},
  {from:"technique",to:"handoff",label:"kit autorizado",paths:["kit"]},
  {from:"technique",to:"contrast",label:"demo local",paths:["build","reference","variants"]},
  {from:"handoff",to:"layer",label:"evolución autorizada",paths:["kit"]},
  {from:"layer",to:"kit-checks",label:"capa seleccionada",paths:["kit"]},
  {from:"architecture",to:"contrast",label:"interfaz construida",paths:["build","reference","variants","revision"]},
  {from:"integration",to:"function",label:"estados completos",paths:["build","variants","revision"]},
  {from:"kit-checks",to:"function",label:"validación de kit",paths:["kit"]},
  {from:"contrast",to:"overlap",label:"contraste pasa",paths:["build","reference","variants","revision","kit"]},
  {from:"overlap",to:"function",label:"lectura pasa",paths:["build","variants","revision"]},
  {from:"function",to:"feedback",label:"recorrido verificado",paths:["build","reference","variants","revision","kit"]},
  {from:"feedback",to:"direction",label:"iterar sobre la elegida",paths:["revision"]},
  {from:"feedback",to:"diversity",label:"pedir más variantes",paths:["variants"]},
];

function DecisionCard({ data, selected }: NodeProps<DecisionNode>) {
  return <article className={`${styles.node} ${styles[data.kind]} ${selected ? styles.selected : ""} ${data.dimmed ? styles.dimmed : ""} ${!data.visible ? styles.filtered : ""}`}>
    <Handle type="target" position={Position.Left} className={styles.handle} />
    <div className={styles.nodeTop}><span>{data.stage}</span><b>{data.kind === "gate" ? "PUERTA" : data.kind === "handoff" ? "TRASPASO" : data.kind === "choice" ? "ELECCIÓN" : data.kind === "output" ? "SALIDA" : "ORIENTACIÓN"}</b></div>
    <h3>{data.title}</h3><p>{data.summary}</p>
    <div className={styles.nodeSignals}><span>{data.branches.length} ramales</span><span>{data.owner.split(" · ")[0]}</span></div>
    <Handle type="source" position={Position.Right} className={styles.handle} />
  </article>;
}
const nodeTypes = { decision: memo(DecisionCard) };

const scenarioInfo: Record<string,string> = {
  all:"Todas las decisiones y conexiones documentadas.",
  build:"Consumidor Trama: contexto y catálogo → selección → dirección → arquitectura → función y QA. Research entra solo si una referencia altera decisiones.",
  reference:"Inspiración: modo → evidencia → firma y técnica → composición → revisión de fidelidad. No se sustituye el medio observado.",
  variants:"Varias propuestas: requisitos → conceptos candidatos → distancia en ejes → comparación → elección. Se mantienen las condiciones comunes.",
  kit:"Evolución autorizada: evidencia → traspaso → capa reusable → documentación, catálogo y validación. Sin autorización, la demo permanece local.",
  revision:"Iteración: feedback regresa al nodo responsable; se conservan los rasgos aprobados y se repite QA afectado.",
};

export default function DecisionMap() {
  const [scenario, setScenario] = useState("all");
  const [filters, setFilters] = useState<RuleKind[]>(["gate","guide","choice","handoff","output"]);
  const [selectedId, setSelectedId] = useState("route");
  const flowRef = useRef<ReactFlowInstance<DecisionNode, Edge> | null>(null);
  const selected = decisions.find(item => item.id === selectedId) ?? decisions[0];
  const nodeList = useMemo<DecisionNode[]>(() => decisions.map(item => ({
    id:item.id, type:"decision", position:positions[item.id], data:{...item,selected:item.id===selectedId,dimmed:scenario!=="all"&&!item.paths.includes(scenario),visible:filters.includes(item.kind)},
  })), [selectedId,scenario,filters]);
  const edgeList = useMemo<Edge[]>(() => connections.map((edge,index) => {
    const source = decisions.find(item => item.id === edge.from)!;
    const target = decisions.find(item => item.id === edge.to)!;
    const inScenario = scenario === "all" || edge.paths.includes(scenario);
    const visible = filters.includes(source.kind) && filters.includes(target.kind);
    const active = inScenario && visible;
    return { id:`${edge.from}-${edge.to}-${index}`, source:edge.from, target:edge.to, label:edge.label, type:"smoothstep", animated:active&&scenario!=="all", markerEnd:{type:MarkerType.ArrowClosed,color:active?"#73786d":"#b7b9ad"}, style:{stroke:active?"#73786d":"#c5c6bd",strokeWidth:active?1.8:1.1,opacity:active?1:.14}, labelStyle:{fontSize:9,fontFamily:"ui-monospace, monospace",fill:active?"#343a33":"#777c73",opacity:active?1:.12}, labelBgStyle:{fill:"#f8f7f1",fillOpacity:active ? .94 : 0}, labelBgPadding:[4,3], labelBgBorderRadius:2, pathOptions:{borderRadius:12} };
  }),[scenario,filters]);
  const onNodeClick = useCallback((_: MouseEvent, node: DecisionNode) => setSelectedId(node.id),[]);
  const toggleFilter = (kind:RuleKind) => setFilters(current => current.includes(kind)?current.filter(item=>item!==kind):[...current,kind]);
  const chooseScenario = (id:string) => setScenario(id);
  const focusDecision = () => {
    const node = nodeList.find(item => item.id === selectedId);
    if (node) window.requestAnimationFrame(() => flowRef.current?.fitView({nodes:[node],duration:380,padding:1.8,minZoom:.62,maxZoom:1.1}));
  };
  const reset = () => {
    chooseScenario("all");
    setFilters(["gate","guide","choice","handoff","output"]);
    setSelectedId("route");
    window.requestAnimationFrame(() => flowRef.current?.fitView({duration:380,padding:.15,minZoom:.12,maxZoom:.8}));
  };

  return <main className={styles.page}>
    <header className={styles.top}><a className={styles.brand} href="/">TRAMA / SKILLS</a><span>Mapa de decisiones · grafo interactivo</span></header>
    <section className={styles.hero}><div><span className={styles.eyebrow}>Encargo → decisiones → interfaz → revisión</span><h1>El flujo, <i>con sus desvíos.</i></h1><p>Arrastra el lienzo, acerca y aleja, o elige una decisión para inspeccionar sus ramas. Las conexiones muestran las rutas principales; el panel recoge las alternativas de cada decisión.</p></div><aside><b>Qué representa</b><p>Las skills son instrucciones en lenguaje natural, no un router ejecutable. El orquestador decide cuáles cargar según encargo y contexto. Este mapa expone reglas escritas; no es telemetría ni razonamiento privado del agente.</p></aside></section>
    <section className={styles.toolbar} aria-label="Controles del grafo"><div><span className={styles.controlLabel}>Recorrido · resalta sus decisiones y conexiones</span><div className={styles.buttons}>{[["all","Todo"],["build","Construir"],["reference","Referencia"],["variants","Variantes"],["kit","Evolucionar kit"],["revision","Iterar"]].map(([id,label])=><button key={id} type="button" aria-pressed={scenario===id} onClick={()=>chooseScenario(id)}>{label}</button>)}</div></div><div><span className={styles.controlLabel}>Mostrar nodos</span><div className={styles.buttons}>{([["gate","Puertas"],["guide","Orientación"],["choice","Elecciones"],["handoff","Traspasos"],["output","Salidas"]] as [RuleKind,string][]).map(([kind,label])=><button key={kind} type="button" aria-pressed={filters.includes(kind)} onClick={()=>toggleFilter(kind)}>{label}</button>)}</div></div></section>
    <p className={styles.scenarioText} aria-live="polite">{scenarioInfo[scenario]} <span>· {decisions.length} decisiones / {connections.length} conexiones</span></p>
    <section className={styles.workspace} aria-label="Grafo interactivo de decisiones"><div className={styles.canvas}>
      <ReactFlow nodes={nodeList} edges={edgeList} nodeTypes={nodeTypes} onInit={instance=>{flowRef.current=instance;}} onNodeClick={onNodeClick} fitView fitViewOptions={{padding:.15,minZoom:.12,maxZoom:.8}} minZoom={.1} maxZoom={1.35} nodesConnectable={false} edgesReconnectable={false} proOptions={{hideAttribution:true}} defaultEdgeOptions={{type:"smoothstep"}}>
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#c8c8bd"/><Controls showInteractive={false}/><MiniMap pannable zoomable nodeColor={node=>({gate:"#a63c20",guide:"#174f9e",choice:"#6848a6",handoff:"#096b60",output:"#1d211d"}[node.data.kind as RuleKind]??"#174f9e")} maskColor="rgba(238,236,228,.76)"/>
      </ReactFlow>
      <div className={styles.instructions}>Arrastra para recorrer · rueda para zoom · clic en nodo para inspeccionar</div>
    </div><aside className={styles.inspector} aria-live="polite" aria-atomic="true"><header><span>{selected.owner}</span><b>{selected.stage}</b></header><div className={styles.details}><span className={`${styles.badge} ${styles[selected.kind]}`}>{selected.kind==="gate"?"PUERTA":selected.kind==="handoff"?"TRASPASO":selected.kind==="choice"?"ELECCIÓN":selected.kind==="output"?"SALIDA":"ORIENTACIÓN"}</span><h2>{selected.title}</h2><p>{selected.summary}</p><section><h3>Cuándo se activa</h3><p>{selected.trigger}</p></section><section><h3>Qué produce</h3><p>{selected.result}</p></section><section><h3>Ramas</h3><ul>{selected.branches.map(branch=><li key={branch.when}><strong>{branch.when}</strong><span>{branch.then}</span></li>)}</ul></section><section><h3>Fuente</h3><p>{selected.source}</p></section><div className={styles.actions}><button type="button" onClick={focusDecision}>Enfocar decisión</button><button type="button" onClick={reset}>Restablecer mapa</button></div></div></aside></section>
    <footer className={styles.footer}><span>Modelo explicativo de instrucciones; no registra la activación real de skills.</span><span>Fuentes: <code>trama-research</code> · <code>trama-style</code> · <code>trama-build</code> · <code>trama-kit-evolution</code></span></footer>
  </main>;
}
