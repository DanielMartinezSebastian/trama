/**
 * Las rondas del método de cine 3D para el panel `/lab/cine` (solo en local): qué se estudió, de dónde, qué entró en el
 * kit, con qué herramientas, dónde está escrito y qué salió. Lo que cambia con cada vuelta (el último alejamiento, el
 * historial, el ruido, qué vídeos hay) no va aquí: lo lee `datos.ts` del disco (`.refs3d`).
 */

export type Componente = {
  nombre: string;
  /** id de la entrada del catálogo (`/componentes#<id>`) */
  catalogo?: string;
  /** dónde vive el motor en el repo */
  ruta: string;
};

export type Ronda = {
  /** número o rango de rondas */
  n: string;
  fecha: string;
  titulo: string;
  tipo: "calibracion" | "estudio" | "herramientas";
  /** la web estudiada */
  fuente?: { nombre: string; url: string; motor: string; gesto: string };
  /** banco del laboratorio (ruta) y receta de `cine:vuelta` */
  lab?: string;
  receta?: string;
  componentes: Componente[];
  herramientas: string[];
  /** documento del método (archivo de docs/) */
  doc: string;
  commits: string[];
  /** cifras del cierre de la ronda (alejamiento por eje, 0 % = igual) */
  resultado: { eje: string; valor: string }[];
  conclusion: string;
  /** capturas en `.refs3d` (rutas relativas); si hay receta con vueltas, se usa la última vuelta como banco */
  capturas?: { ref?: string; banco?: string; cmp?: string };
  /** el resto de lo que generó la ronda en `.refs3d`: exploraciones, sondas, pruebas, capturas previas */
  extras?: { papel: string; ruta: string }[];
  pendiente: string[];
};

export const RONDAS: Ronda[] = [
  {
    n: "26",
    fecha: "26-10-2026",
    titulo: "Réplicas completas y scroll con sensación: Meer Mohsin con su emblema, Lusion entera, la tubería de Quilate en el kit",
    tipo: "estudio",
    fuente: { nombre: "Lusion (web entera)", url: "https://lusion.co/", motor: "three r158 (todo en WebGL)", gesto: "rueda" },
    lab: "/lab/cine/lusion-web",
    componentes: [
      { nombre: "ScrollExpand", catalogo: "scroll-expand", ruta: "components/ui/ScrollExpand.tsx" },
      { nombre: "LineDraw (tube)", catalogo: "line-draw", ruta: "components/ui/LineDraw.tsx" },
      { nombre: "ThornEmblem (wings)", catalogo: "thorn-emblem", ruta: "lib/emblem/alas.ts" },
      { nombre: "FluidCursor", catalogo: "fluid-cursor", ruta: "components/ui/FluidCursor.tsx" },
      { nombre: "lib/motion/scroll-feel", ruta: "lib/motion/scroll-feel.ts" },
      { nombre: "useScrollTimeline", ruta: "lib/story/useScrollTimeline.ts" },
    ],
    herramientas: ["cine:ritmo (perfil de scroll)", "volcado del DOM con estilos", "images:fetch retratos y espacio"],
    doc: "43-lusion-replica.md",
    commits: ["eff3b7e"],
    resultado: [
      { eje: "Quilate con el motor del kit (ritmo)", valor: "8 de 8 medidas idénticas" },
      { eje: "Cota: rapidez · acoplamiento", valor: "1,98 → 1,07 · 0,34 → 0,29" },
    ],
    conclusion:
      "Las demos tienen que ser la web entera, no la sección medida. Meer Mohsin: el emblema, rehecho tras estudiarlo (dos alas tribales que dan vueltas y acaban pequeñas arriba). Lusion: réplica de la portada entera con piezas del kit. Y la sensación de Quilate es ahora una tubería del kit que se mide con cine:ritmo (docs/42).",
    capturas: {},
    extras: [
      { papel: "Ritmo de Quilate y Cota", ruta: "ritmo" },
      { papel: "Inventario de Lusion", ruta: "lusion-web" },
      { papel: "Inventario de la portada de Meer Mohsin", ruta: "mm-hero" },
    ],
    pendiente: ["Lusion: reel curvado en WebGL, astronauta 3D, transición de proyecto", "Meer Mohsin: secciones S1, S6–S9 (docs/41)", "Chartogne completa"],
  },
  {
    n: "25",
    fecha: "25–26-10-2026",
    titulo: "Sensación y profundidad: Meer Mohsin con su escena, Chartogne más denso, muestras y grabado para cualquier escena",
    tipo: "estudio",
    fuente: { nombre: "Meer Mohsin (portada y relato)", url: "https://www.meermohsin.me/", motor: "three r180", gesto: "rueda" },
    lab: "/lab/cine/relato",
    receta: "relato",
    componentes: [
      { nombre: "ThornEmblem", catalogo: "thorn-emblem", ruta: "components/ui/ThornEmblem.tsx" },
      { nombre: "FlameHorizon", catalogo: "flame-horizon", ruta: "components/ui/FlameHorizon.tsx" },
      { nombre: "TornPaper", catalogo: "torn-paper", ruta: "components/ui/TornPaper.tsx" },
      { nombre: "ProjectReel", catalogo: "project-reel", ruta: "components/ui/ProjectReel.tsx" },
      { nombre: "GravureCanvas", catalogo: "gravure-canvas", ruta: "components/ui/GravureCanvas.tsx" },
      { nombre: "lib/emblem (emblema de púas)", ruta: "lib/emblem/" },
    ],
    herramientas: ["cine:vuelta --muestras N", "gancho: sin cubos de entorno", "gancho: escena por mallas y triángulos"],
    doc: "40-ronda-25-sensacion.md",
    commits: ["4e17844"],
    resultado: [
      { eje: "Meer Mohsin: imagen · cámara · profundidad", valor: "72 → 31 % · 100 → 0 % · 57 → 10 %" },
      { eje: "Chartogne: profundidad (imagen)", valor: "28 → 16 % (9 %)" },
      { eje: "Lusion (3 muestras): imagen · acabado", valor: "57 → 23 % ± 15 (cumple) · 34 → 25 %" },
      { eje: "Bruno con decorado e intro: imagen · acabado · atmósfera", valor: "100 → 65 % · 81 → 25 % · 55 → 14 %" },
    ],
    conclusion:
      "El eje de profundidad encontró lo que el ojo notaba: el paisaje de Chartogne era menos denso que la referencia. Meer Mohsin estaba lejos porque faltaba la escena, no el texto: con el emblema de púas, las llamas con manos, el papel rasgado, la caligráfica y la cámara de la referencia, la imagen baja del 72 al 44 % y la cámara del 100 al 0 %. Con cinco muestras, Lusion queda claramente por encima de su ruido: la causa son los claros de más.",
    capturas: {},
    extras: [
      { papel: "Prueba de llamas y emblema", ruta: "vueltas/relato" },
      { papel: "Muestras de Lusion", ruta: "vueltas/lusion/muestras" },
      { papel: "Vueltas de Chartogne", ruta: "vueltas/chartogne" },
    ],
    pendiente: ["Meer Mohsin: luz, logotipo y barra, figura que cae", "Lusion: acabado y posprocesado", "Chartogne: red de caminos", "Bruno: sombra del mundo y salida del coche"],
  },
  {
    n: "24",
    fecha: "25-10-2026",
    titulo: "Reestudio, mapa de webs enteras, profundidad y veredicto por objetivos",
    tipo: "herramientas",
    fuente: { nombre: "Meer Mohsin, Lusion y Active Theory (síntesis)", url: "https://www.meermohsin.me/", motor: "three, Hydra", gesto: "rueda" },
    componentes: [],
    herramientas: ["cine:reestudio", "cine:web", "cine:sintesis", "eje de profundidad (A8)", "objetivos y veredicto (A1)", "tu puntuación (A9)"],
    doc: "35-procedimiento.md",
    commits: ["6dd5205"],
    resultado: [
      { eje: "Reestudio: ejes iguales al cierre", valor: "7 de 7 estudios" },
      { eje: "Ruido de las webs deterministas", valor: "0–2 %" },
      { eje: "Más lejos: Meer Mohsin (cámara · luz · imagen)", valor: "100 · 85 · 72 %" },
      { eje: "Bruno (imagen · acabado)", valor: "100 · 81 %" },
    ],
    conclusion:
      "Con referencias nuevas y el inspector de hoy, todos los estudios dan lo mismo que al cerrarlos: el método es reproducible. Las demos que no se sienten como su referencia son las que recortaron escena o decorado. Las vueltas ahora dicen si cada eje cumple su objetivo, miden la profundidad (atmósfera, desenfoque, planos, paralaje) y el panel recoge tu puntuación. Para encargos de varias webs, cine:web hace el mapa entero y cine:sintesis cruza las webs con el kit (docs/38).",
    capturas: {},
    extras: [
      { papel: "Reestudio de los cinco primeros", ruta: "reestudio/2026-10-25-11-20" },
      { papel: "Reestudio de Chartogne y Lusion", ruta: "reestudio/2026-10-25-12-22" },
      { papel: "Mapa de Meer Mohsin (cine:web)", ruta: "webs/meermohsin" },
      { papel: "Síntesis de tres webs", ruta: "sintesis/prueba" },
      { papel: "Mapas de webs", ruta: "webs" },
    ],
    pendiente: ["D1 GravureCanvas", "B1 Meer Mohsin con emblema y escena roja", "B2 Bruno con decorado", "A2 --muestras", "pestaña de webs mapeadas"],
  },
  {
    n: "23",
    fecha: "25-10-2026",
    titulo: "La API gráfica, el flujo del vídeo y el ruido de cada eje",
    tipo: "herramientas",
    fuente: { nombre: "Active Theory (caso sin three)", url: "https://activetheory.net/", motor: "Hydra (motor propio)", gesto: "rueda" },
    receta: "activetheory",
    componentes: [],
    herramientas: ["hooks/gl.js", "pasadas.md (cadena de render)", "cine:flujo", "cine:vuelta --ruido", "presupuesto unilateral"],
    doc: "34-api-grafica-flujo-y-ruido.md",
    commits: ["190fe08"],
    resultado: [
      { eje: "Chartogne, todos los ejes", valor: "≤ 10 %" },
      { eje: "Ruido de Lusion (imagen · acabado)", valor: "48 % · 26 %" },
      { eje: "Ruido de Active Theory (imagen · acabado)", valor: "38 % · 16 %" },
    ],
    conclusion:
      "El coste y la cadena de render se leen de WebGL y WebGPU con cualquier motor: Active Theory se describe sola (anamórficos, bloom, simulación de 256², un millón de partículas). Sin three, el flujo del vídeo hace de cámara. Y cada eje tiene su ruido: en webs vivas hay que comparar con el ruido, no con un umbral fijo.",
    capturas: { ref: "f9/activetheory" },
    extras: [{ papel: "Exploración de Active Theory", ruta: "explora/activetheory" }, { papel: "Referencia de Active Theory (con la cadena de render)", ruta: "f9/activetheory" }, { papel: "Giro por arrastre: referencia recortada", ruta: "f9/ct-arr-ref" }, { papel: "Giro por arrastre: banco recortado", ruta: "f9/ct-arr-banco" }, { papel: "Calibración del flujo (comparación)", ruta: "f9/ct-arr-cmp" }, { papel: "Capturas del panel", ruta: "f9" }],
    pendiente: ["cine:vuelta --muestras N (comparar distribuciones)", "flujo con homografía", "Ficha.relato"],
  },
  {
    n: "22",
    fecha: "25-10-2026",
    titulo: "Revisión de pendientes y herramientas del inspector",
    tipo: "herramientas",
    receta: "chartogne",
    componentes: [{ nombre: "EngravedMap (pájaros y giro por arrastre)", catalogo: "engraved-map", ruta: "lib/gravure/birds.ts" }],
    herramientas: ["cine:explora", "cine:sonda", "cine:vuelta + recetas", "cine:tramo movimiento", "--movil", "orden en meta.json"],
    doc: "33-revision-y-herramientas.md",
    commits: ["ea72632", "45ccd8f"],
    resultado: [
      { eje: "Giro por arrastre (banco frente a referencia)", valor: "≤ 1,1°" },
      { eje: "Una vuelta completa", valor: "~3 min sin intervención" },
    ],
    conclusion:
      "En .refs3d había 66 scripts de un uso y el trío captura → análisis → comparación se lanzaba a mano 12–18 veces por estudio. Ahora es una orden por paso, y las herramientas encontraron dos cosas de Chartogne que se habían pasado por alto: los pájaros y el giro al arrastrar.",
    extras: [{ papel: "Exploración de Chartogne", ruta: "explora/chartogne" }, { papel: "Sonda de Chartogne", ruta: "sonda/chartogne" }, { papel: "Arrastre en la referencia", ruta: "f8/c-chartogne-arrastre" }, { papel: "Arrastre en el banco", ruta: "f8/b-chartogne-arrastre" }],
    pendiente: ["eje de presupuesto con pasadas (hecho en la ronda 23)", "motores sin three (hecho en la ronda 23)"],
  },
  {
    n: "21",
    fecha: "25-10-2026",
    titulo: "Ilustración en 3D: el grabado a lápiz",
    tipo: "estudio",
    fuente: { nombre: "Chartogne-Taillet", url: "https://chartogne-taillet.com/en", motor: "three r122", gesto: "aviso de edad, rueda y arrastre" },
    lab: "/lab/cine/chartogne",
    receta: "chartogne",
    componentes: [
      { nombre: "EngravedMap", catalogo: "engraved-map", ruta: "components/ui/EngravedMap.tsx" },
      { nombre: "lib/gravure (materialLapiz, pilaGrabado)", ruta: "lib/gravure/" },
    ],
    herramientas: ["cine:tramo", "render.dprFijo"],
    doc: "32-estudio-chartogne-grabado.md",
    commits: ["09d399c"],
    resultado: [
      { eje: "imagen", valor: "8 %" },
      { eje: "acabado", valor: "7 %" },
      { eje: "cámara", valor: "5 %" },
    ],
    conclusion:
      "La escena no pinta colores: guarda normal, lápiz y cercanía, y una pasada final pinta papel, lápiz y contornos de Sobel. Primer estudio en que coinciden el concepto y el acabado, con un paisaje procedural propio.",
    capturas: { ref: "f8/r-chartogne", banco: "f8/b-chartogne", cmp: "f8/comparacion-chartogne" },
    extras: [{ papel: "Captura completa (aviso, título y vuelo)", ruta: "f8/c-chartogne" }, { papel: "Tramo cortado por movimiento", ruta: "f8/r-chartogne-mov" }, { papel: "Sondas e imágenes sueltas", ruta: "f8/sonda" }],
    pendiente: ["mapa cenital con la lista de parcelas", "aparición por baldosas para el DOM", "viento de los árboles"],
  },
  {
    n: "20",
    fecha: "24-10-2026",
    titulo: "Materiales premium: sombreado analítico entre vecinas",
    tipo: "estudio",
    fuente: { nombre: "Lusion", url: "https://lusion.co/", motor: "three r158 con motor propio", gesto: "puntero" },
    lab: "/lab/cine/lusion",
    receta: "lusion",
    componentes: [
      { nombre: "CrossCluster", catalogo: "cross-cluster", ruta: "components/ui/CrossCluster.tsx" },
      { nombre: "lib/crosscluster (material TSL, física)", ruta: "lib/crosscluster/" },
    ],
    herramientas: ["cine:conjunto", "--recorte"],
    doc: "31-estudio-lusion-materiales.md",
    commits: ["5b63562"],
    resultado: [
      { eje: "cámara", valor: "0 %" },
      { eje: "dinámica del conjunto", valor: "17,6 %" },
      { eje: "acabado · imagen", valor: "27 % · 42 % (ruido 26 % · 48 %)" },
    ],
    conclusion:
      "Cada píxel calcula la oclusión, la sombra y el reflejo de las otras 23 cruces sin luces ni entorno. La dinámica se midió sin el código: el racimo sigue al puntero un 31 % y las cruces chocan como bolas. Revisado en la ronda 23: imagen y acabado estaban dentro del ruido de la propia web.",
    capturas: { ref: "f8/r-lusion-co", banco: "f8/b-lusion", cmp: "f8/comparacion-lusion" },
    extras: [{ papel: "Primer sondeo con scroll", ruta: "f8/c-lusion-co" }, { papel: "Captura con el puntero (ventana entera)", ruta: "f8/p-lusion-co" }, { papel: "Sondas, dinámica e imágenes sueltas", ruta: "f8/sonda" }, { papel: "Todas las capturas de la ronda", ruta: "f8" }],
    pendiente: ["comparar distribuciones (varias capturas por lado)", "chaflán de la cruz con SDF mallado", "giro en la cola"],
  },
  {
    n: "19",
    fecha: "24-10-2026",
    titulo: "Relato con scroll: medir el DOM",
    tipo: "estudio",
    fuente: { nombre: "Meer Mohsin", url: "https://www.meermohsin.me/", motor: "three r180, Lenis y GSAP", gesto: "rueda" },
    lab: "/lab/cine/relato",
    receta: "relato",
    componentes: [{ nombre: "ChapterStage", catalogo: "chapter-stage", ruta: "components/ui/ChapterStage.tsx" }],
    herramientas: ["hooks/dom.js", "relato.json", "eje de texto (--tramo-scroll)", "--espera"],
    doc: "30-relato-con-scroll-y-dom.md",
    commits: ["257f80b", "a377fc6"],
    resultado: [{ eje: "texto (momento · duración)", valor: "21 % (0–3 % · 7–20 %)" }],
    conclusion: "La herramienta ve el relato escrito: qué texto entra, cuándo y cómo. Lo que se ve lo deciden los píxeles, no la pila del DOM.",
    capturas: { ref: "f7/mm3", banco: "f7/banco5", cmp: "f7/cmp5" },
    extras: [{ papel: "Todas las capturas de la ronda", ruta: "f7" }],
    pendiente: ["umbral del párrafo", "letra caligráfica", "emblema 3D de la sección"],
  },
  {
    n: "18",
    fecha: "24-10-2026",
    titulo: "Física e interacción, y el eje de acabado",
    tipo: "estudio",
    fuente: { nombre: "Bruno Simon", url: "https://bruno-simon.com/", motor: "WebGPU + TSL, Rapier", gesto: "clic y teclas" },
    lab: "/lab/cine/bruno",
    receta: "bruno",
    componentes: [
      { nombre: "ToyDrive", catalogo: "toy-drive", ruta: "components/ui/ToyDrive.tsx" },
      { nombre: "lib/physics (sin WebAssembly)", ruta: "lib/physics/" },
    ],
    herramientas: ["eje de acabado", "eje de dinámica (--pieza, --ventanas)", "--teclas"],
    doc: "29-estudio-bruno-simon-y-acabado.md",
    commits: ["7b8205a", "f2ecfb4"],
    resultado: [
      { eje: "dinámica del coche", valor: "12 %" },
      { eje: "acabado de Hublot", valor: "49 % → 11 %" },
    ],
    conclusion: "La física se midió desde la pose del chasis y se recreó sin WebAssembly (la CSP de producción no lo deja). El decorado no se recreó: imagen y acabado quedan lejos.",
    capturas: { ref: "f6/bruno", banco: "f6/banco", cmp: "f6/cmp" },
    extras: [{ papel: "Exploración de Bruno Simon", ruta: "f6/bs-explora" }, { papel: "Pruebas de la física", ruta: "f6/fis" }, { papel: "Todas las capturas de la ronda", ruta: "f6" }],
    pendiente: ["decorado de ToyDrive", "más cuerpos en lib/physics"],
  },
  {
    n: "17",
    fecha: "24-10-2026",
    titulo: "Segundo estudio y coste del método",
    tipo: "estudio",
    fuente: { nombre: "Hublot (darkroom.engineering)", url: "https://hublot.darkroom.engineering/", motor: "WebGPU + TSL", gesto: "arrastre" },
    lab: "/lab/cine/hublot",
    receta: "hublot",
    componentes: [{ nombre: "Porthole", catalogo: "porthole", ruta: "components/ui/Porthole.tsx" }],
    herramientas: ["cine:rampa", "núcleo de escena", "--arrastre"],
    doc: "28-estudio-hublot-y-coste.md",
    commits: ["99944f7", "ca47c67"],
    resultado: [
      { eje: "cámara", valor: "3 %" },
      { eje: "imagen", valor: "10–13 %" },
    ],
    conclusion: "Todo procedural, sin modelos ni luces. Cuesta de 2 a 5 h por web llegar a «completado».",
    capturas: { ref: "f5/hublot-salida2", banco: "f5/banco10", cmp: "f5/cmp10" },
    extras: [{ papel: "Exploración de Hublot", ruta: "f5/hublot-explora" }, { papel: "Captura con el puntero", ruta: "f5/hublot" }, { papel: "Todas las capturas de la ronda (vueltas 8–10, brillos, kit)", ruta: "f5" }],
    pendiente: ["pueblos más cálidos", "destello de lente"],
  },
  {
    n: "15–16",
    fecha: "24-10-2026",
    titulo: "Primer estudio real",
    tipo: "estudio",
    fuente: { nombre: "Plain Sight", url: "https://motion-pieces.pages.dev/plain-sight/", motor: "three + R3F", gesto: "rueda" },
    lab: "/lab/cine/plain-sight",
    receta: "plain-sight",
    componentes: [
      { nombre: "TypeField", catalogo: "type-field", ruta: "components/ui/TypeField.tsx" },
      { nombre: "lib/postfx (pila TSL)", ruta: "lib/postfx/" },
    ],
    herramientas: ["ajuste copia a copia", "coreografía de instancias"],
    doc: "27-estudio-plain-sight.md",
    commits: ["f4383ec", "b260d52"],
    resultado: [{ eje: "coreografía", valor: "12 %" }],
    conclusion: "La envolvente de muchas copias no es el movimiento: hay que ajustar copia a copia.",
    capturas: { ref: "f4/plain-sight", banco: "exp/ps-banco-tema", cmp: "exp/cmp-tema" },
    extras: [{ papel: "Capturas de Plain Sight", ruta: "f4" }, { papel: "Experimentos y vueltas", ruta: "exp" }],
    pendiente: ["componente PostFX del kit"],
  },
  {
    n: "0–14",
    fecha: "23–24-10-2026",
    titulo: "Método y calibración",
    tipo: "calibracion",
    fuente: { nombre: "Ejemplos de three y pmndrs (bloom, camera-scroll)", url: "https://pmndrs.github.io/examples/camera-scroll/", motor: "three + R3F", gesto: "tiempo y rueda" },
    lab: "/lab/cine/camera-scroll",
    receta: "camera-scroll",
    componentes: [],
    herramientas: ["cine:capture", "cine:analyze", "cine:compare", "ficha de escena (lib/cine)", "banco WebGPU + TSL"],
    doc: "26-cine-3d-metodo-y-vocabulario.md",
    commits: ["69c2b7a", "8b48392", "da5d131"],
    resultado: [
      { eje: "bloom (SSIM)", valor: "0,996" },
      { eje: "camera-scroll: cámara · SSIM", valor: "0,51 % · 0,921" },
    ],
    conclusion: "Captura a fotograma exacto con reloj virtual, ficha de escena con vocabulario y bucle de comparación por ejes, calibrado con ejemplos de código abierto.",
    capturas: { ref: "cal/camera-scroll", banco: "cal/camera-scroll-banco", cmp: "cal/comparacion-camera-scroll-banco" },
    extras: [{ papel: "Calibración bloom: referencia", ruta: "bloom/ref" }, { papel: "Calibración bloom: banco", ruta: "bloom/banco2" }, { papel: "Calibración bloom: comparación", ruta: "bloom/comparacion-banco2" }, { papel: "Calibraciones", ruta: "cal" }],
    pendiente: ["Tidewater (sin escena)", "componente PostFX"],
  },
];

export const GITHUB = "https://github.com/DanielMartinezSebastian/trama";
