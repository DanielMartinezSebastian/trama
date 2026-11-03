/* Datos de Nimbo (docs/59): plataforma inventada de GPU sin servidor para IA en tiempo real. Datos puros. */

const I = "/img/inspiraciones/nimbo/";

export const ARRANQUES: [string, number][] = [
  ["Nimbo (con instantáneas)", 2],
  ["Nimbo", 4],
  ["Proveedor A", 71],
  ["Clúster propio", 156],
];

export const RAZONES = [
  { t: "Arranques de 2 a 4 segundos", d: "Contenedores que se levantan en segundos con instantáneas de memoria y de GPU. Los picos se absorben solos." },
  { t: "Escala elástica de GPU", d: "Sin reservas ni permanencia: de cero a cientos de GPU según llegan las peticiones, y vuelta a cero." },
  { t: "Tu código, a tu manera", d: "Python, contenedores propios o cualquier framework. Si corre en tu máquina, corre aquí." },
  { t: "Observabilidad completa", d: "Registros, métricas y trazas de cada petición, compatibles con OpenTelemetry." },
];

export const REGIONES: { n: string; x: number; y: number; gpu: number }[] = [
  { n: "Virginia", x: 27, y: 38, gpu: 900 },
  { n: "Oregón", x: 15, y: 34, gpu: 600 },
  { n: "Fráncfort", x: 51, y: 30, gpu: 750 },
  { n: "Madrid", x: 47, y: 36, gpu: 300 },
  { n: "Bombay", x: 69, y: 47, gpu: 400 },
  { n: "Tokio", x: 87, y: 37, gpu: 500 },
  { n: "São Paulo", x: 35, y: 70, gpu: 250 },
];

export const FUNCIONES = ["Imágenes Docker propias", "Concurrencia y lotes", "Trabajos asíncronos", "Almacenamiento compartido", "Despliegue en varias regiones", "Más de 12 tipos de GPU", "Endpoints con streaming", "API REST", "Escalado automático", "Dockerfiles a medida", "Despliegue gradual", "Gestión de secretos"];

export type Ejemplo = { id: string; t: string; d: string; tipo: "Voz" | "LLM" | "Otros"; icono: string };
export const EJEMPLOS: Ejemplo[] = [
  { id: "voz-500", t: "Agente de voz en 500 ms", d: "Un agente que contesta en medio segundo con reconocimiento, modelo y síntesis en la misma región.", tipo: "Voz", icono: "◎" },
  { id: "centralita", t: "Agente para la centralita", d: "Atiende llamadas entrantes y deriva a una persona cuando hace falta.", tipo: "Voz", icono: "☏" },
  { id: "podcast", t: "Transcribir un podcast de una hora", d: "En menos de dos minutos, con hablantes separados.", tipo: "Voz", icono: "≋" },
  { id: "llm-propio", t: "Servir un LLM abierto con vLLM", d: "Un modelo de 70B con streaming y lotes continuos.", tipo: "LLM", icono: "▤" },
  { id: "vision", t: "Modelo de visión y lenguaje", d: "Describe imágenes y documentos escaneados en tiempo real.", tipo: "LLM", icono: "◐" },
  { id: "video", t: "Generar vídeo bajo demanda", d: "Clips de cinco segundos con colas y prioridades.", tipo: "Otros", icono: "▶" },
];

export const GPUS: { id: string; n: string; seg: number }[] = [
  { id: "t4", n: "T4 · 16 GB", seg: 0.000164 },
  { id: "l40", n: "L40S · 48 GB", seg: 0.000542 },
  { id: "a100", n: "A100 · 80 GB", seg: 0.000944 },
  { id: "h100", n: "H100 · 80 GB", seg: 0.001289 },
];

export const PLANES = [
  { n: "Pruebas", precio: "0 €", d: "30 € de crédito al mes para empezar", rasgos: ["3 endpoints", "Hasta 5 GPU a la vez", "Soporte en el foro"] },
  { n: "Equipo", precio: "100 €/mes", d: "Para productos en producción", rasgos: ["Endpoints ilimitados", "Hasta 30 GPU a la vez", "Soporte por chat", "Regiones a elegir"] },
  { n: "Empresa", precio: "A medida", d: "Volumen, contratos y despliegue en tu nube", rasgos: ["GPU reservadas", "SLA del 99,99 %", "Ingeniero asignado", "Auditorías de seguridad"] },
];

export type Post = { id: string; t: string; f: string; img: string; texto: string[] };
export const BLOG: Post[] = [
  { id: "agentes-de-voz", t: "Cómo bajamos un agente de voz a 500 milisegundos", f: "29 oct 2026", img: `${I}blog-voz.webp`, texto: ["La latencia de un agente de voz es la suma de tres modelos y dos viajes por la red. Si los tres viven en la misma región y la misma máquina, el viaje desaparece.", "Contamos cómo lo medimos y qué parte del tiempo se va en cada paso."] },
  { id: "coste-gpu-2026", t: "Cuánto cuesta de verdad servir un modelo en 2026", f: "15 oct 2026", img: `${I}blog-costes.webp`, texto: ["Comparamos GPU reservada, GPU por segundo y API de terceros con tres cargas reales.", "La conclusión corta: por debajo del 40 % de uso, pagar por segundo sale más barato."] },
  { id: "aislamiento", t: "Aislamiento entre clientes: lo que hacemos y por qué", f: "2 oct 2026", img: `${I}blog-seguridad.webp`, texto: ["Cada contenedor corre en su propia micro-máquina virtual. Así es como lo auditamos."] },
];

export const CODIGO = {
  python: `import nimbo

@nimbo.endpoint(gpu="L40S", min_replicas=0)
def responder(pregunta: str) -> str:
    return modelo.generar(pregunta)`,
  terminal: `$ pip install nimbo
$ nimbo login
$ nimbo deploy
✓ Desplegado en 41 s · https://api.nimbo.example/v1/responder`,
  curl: `curl https://api.nimbo.example/v1/responder \\
  -H "Authorization: Bearer $NIMBO_KEY" \\
  -d '{"pregunta": "¿Qué tiempo hace en Madrid?"}'`,
};

export const PAGINAS = [
  { path: "casos", titulo: "Casos de uso" },
  { path: "precios", titulo: "Precios" },
  { path: "docs", titulo: "Documentación" },
  { path: "blog", titulo: "Blog" },
  ...BLOG.map((b) => ({ path: `blog/${b.id}`, titulo: b.t })),
  { path: "empresa", titulo: "Empresa" },
  { path: "demo", titulo: "Pide una demo" },
];

export const EQUIPO_IMG = `${I}equipo.webp`;
