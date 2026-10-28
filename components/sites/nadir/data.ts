export const SLUG = "nadir";
export const meta = {
  slug: SLUG,
  name: "Nádir",
  title: "NÁDIR · una señal al otro lado del silencio",
  blurb: "Expedición de ficción en tres capítulos: una señal, un descenso y un hallazgo. Una semilla mecánica procedural de Three.js se abre y se descompone al avanzar por scroll, con cámara coreografiada, partículas, audio sintetizado opcional y un mensaje que se revela en la última ruta. Sin modelos ni texturas externos; alternativa estática para movimiento reducido y ausencia de WebGL.",
  accent: "#e8b693",
  tag: "ciencia ficción · Three.js · scrollytelling",
};
export const ROUTES = [
  { path: "", title: "La señal" },
  { path: "descenso", title: "El descenso" },
  { path: "hallazgo", title: "El hallazgo" },
];

/** La misma paleta alimenta los tokens del DOM y los materiales de la escena. */
export const COLORS = {
  abyss: "#071923", mineral: "#123442", ice: "#edf5ef", mist: "#a6bdc3", copper: "#e8b693", signal: "#b3ebdf",
};

export const CHAPTERS = [
  {
    path: "", number: "01", title: "La señal", word: "NÁDIR", sub: "Lo desconocido\ntambién nos llama.",
    intro: "Durante 38 años escuchamos el vacío. Hasta que el vacío nos devolvió una pregunta.",
    coordinate: "RA 19h 41m · DEC −08° 12′", telemetry: "TRANSMISIÓN ENTRANTE", next: "descenso", nextLabel: "Iniciar el descenso",
    steps: [
      { label: "Registro 001 / 03:14 UTC", title: "Al principio,\nsolo era ruido.", body: "Entre millones de frecuencias apareció un pulso. Breve. Exacto. Imposible de confundir con una estrella.", detail: "Un pulso cada 38 segundos", value: "38 s", caption: "INTERVALO DE REPETICIÓN" },
      { label: "Registro 002 / La anomalía", title: "Algo estaba\nescuchando.", body: "Enviamos la secuencia de vuelta. La respuesta llegó antes de que nuestra señal pudiera alcanzarla. No era un eco.", detail: "Origen sin catalogar · sector Nádir", value: "−08°", caption: "DECLINACIÓN DEL ORIGEN" },
      { label: "Registro 003 / La decisión", title: "Hay preguntas\nque son un lugar.", body: "La señal no contenía palabras. Contenía coordenadas. Construimos una nave para llegar hasta ellas.", detail: "Destino fijado · autorización de partida", value: "01", caption: "EXPEDICIÓN SIN PRECEDENTES" },
    ],
  },
  {
    path: "descenso", number: "02", title: "El descenso", word: "UMBRAL", sub: "Para llegar más lejos,\nhay que ir hacia dentro.",
    intro: "A 6.400 metros bajo una superficie sin nombre encontramos algo que no debería seguir funcionando.",
    coordinate: "PROFUNDIDAD −6.400 M · SECTOR N−07", telemetry: "ENLACE DE EXPLORACIÓN", next: "hallazgo", nextLabel: "Entrar en el núcleo",
    steps: [
      { label: "Bitácora 004 / Bajo la superficie", title: "El silencio\ntenía estructura.", body: "No había ruinas. Había una máquina. Valvas minerales suspendidas alrededor de un núcleo que guardaba una luz.", detail: "Arquitectura de origen desconocido", value: "6.400", caption: "METROS BAJO LA SUPERFICIE" },
      { label: "Bitácora 005 / Aproximación", title: "Nada se toca.\nTodo se sostiene.", body: "Cada pieza flotaba a la misma distancia de la siguiente. Al acercarnos, el mecanismo empezó a abrirse. Como si nos reconociera.", detail: "Separación de valvas · núcleo accesible", value: "0 g", caption: "GRAVEDAD EN EL INTERIOR" },
      { label: "Bitácora 006 / El umbral", title: "No era una puerta.\nEra una espera.", body: "En el centro, una luz repetía el ritmo de la señal. Habíamos cruzado el espacio para encontrar el principio de una conversación.", detail: "Contacto confirmado · continuar al núcleo", value: "38 s", caption: "EL MISMO PULSO. AQUÍ." },
    ],
  },
  {
    path: "hallazgo", number: "03", title: "El hallazgo", word: "ORIGEN", sub: "No vinimos\na encontrar respuestas.",
    intro: "La máquina guardaba una sola cosa. No era un arma. No era un mapa. Era un recuerdo de lo que significa estar vivo.",
    coordinate: "NÚCLEO N−07 · CONTACTO ESTABLECIDO", telemetry: "ARCHIVO RECUPERADO", next: "", nextLabel: "Volver a la primera señal",
    steps: [
      { label: "Archivo 007 / Memoria", title: "Alguien estuvo\naquí antes.", body: "Una civilización había reunido todo lo que temía perder: el agua, la luz, la voz de quienes se habían marchado.", detail: "Archivo de memoria · integridad confirmada", value: "∞", caption: "FORMAS DE RECORDAR" },
      { label: "Archivo 008 / El mensaje", title: "La señal\nera una invitación.", body: "No nos pedían que los encontráramos. Nos pedían que no olvidáramos mirar. El núcleo sigue encendido. El mensaje te espera abajo.", detail: "Transmisión completa · descifrado disponible", value: "01", caption: "MENSAJE PARA QUIEN ESCUCHE" },
    ],
  },
];
