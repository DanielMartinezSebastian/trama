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
  pendiente: string[];
};

export const RONDAS: Ronda[] = [
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
    pendiente: ["Tidewater (sin escena)", "componente PostFX"],
  },
];

export const GITHUB = "https://github.com/DanielMartinezSebastian/trama";
