"use client";

import DistortImage, { DISTORT_EFFECTS } from "@/components/ui/DistortImage";
import DragGrid from "@/components/ui/DragGrid";
import PointCloud from "@/components/ui/PointCloud";
import ObjectStage, { OBJECT_MATERIAL_LIST, OBJECT_SHAPE_LIST } from "@/components/ui/ObjectStage";
import TypeField from "@/components/ui/TypeField";
import Porthole from "@/components/ui/Porthole";
import ToyDrive from "@/components/ui/ToyDrive";
import CrossCluster from "@/components/ui/CrossCluster";
import EngravedMap from "@/components/ui/EngravedMap";
import ChapterStage from "@/components/ui/ChapterStage";
import { fashionArt, withSize, type LookKind } from "@/lib/sites/art";
import type { CatalogEntry } from "../schema";

/** WebGL y rejillas (ver docs/06-indice-replicar-webs-premiadas.md, Fase 3). */
const KINDS: LookKind[] = ["coat", "arch", "dress", "fabric", "still", "shirt"];
const ART = KINDS.map((k, i) => ({ src: withSize(fashionArt(i + 1, k), 800, 1000), alt: `Composición ${i + 1}` }));
const EDITORIAL = ["editorial", "minimal"] as CatalogEntry["styles"];

export const webgl: CatalogEntry[] = [
  {
    id: "distort-image",
    component: "DistortImage",
    path: "@/components/ui/DistortImage",
    name: "Imagen con distorsión (WebGL)",
    category: "galerias",
    styles: EDITORIAL,
    description:
      "Imagen que se deforma con un shader alrededor del puntero: ondas, líquido, separación RGB o lupa. Es un <img> normal; el lienzo WebGL se crea al pasar el puntero y se destruye al apagarse, así que una rejilla de muchas imágenes no agota los contextos.",
    stageHeight: 420,
    notes: ["Requiere three y @react-three/fiber: se importa por subruta, trama-ui/DistortImage.", "Sin WebGL, en táctil, en equipos modestos y con movimiento reducido se queda la imagen plana."],
    props: [
      { key: "effect", label: "Efecto", type: "select", default: "ripple", options: DISTORT_EFFECTS, labels: { ripple: "ondas", liquid: "líquido", rgb: "separación RGB", lens: "lupa" } },
      { key: "strength", label: "Intensidad", type: "number", default: 1, min: 0.2, max: 3, step: 0.1 },
      { key: "radius", label: "Radio de influencia", type: "number", default: 0.45, min: 0.1, max: 1, step: 0.05 },
      { key: "ratio", label: "Relación de aspecto", type: "text", default: "4 / 5" },
    ],
    render: (p) => (
      <div style={{ width: "min(100%, 300px)", padding: 16 }}>
        <DistortImage src={ART[0].src} alt="" effect={p.effect as never} strength={p.strength as number} radius={p.radius as number} ratio={p.ratio as string} />
      </div>
    ),
  },
  {
    id: "drag-grid",
    component: "DragGrid",
    path: "@/components/ui/DragGrid",
    name: "Rejilla infinita arrastrable",
    category: "galerias",
    styles: EDITORIAL,
    description:
      "Rejilla que se arrastra en cualquier dirección sin fin, con inercia, táctil y teclado (flechas). Un grupo fijo de celdas se recoloca en cada fotograma: no hay miles de nodos. Un arrastre no dispara el clic de las celdas.",
    stageHeight: 460,
    notes: ["En táctil captura el gesto dentro del visor: dale un alto razonable para que se pueda seguir desplazando la página.", "Para el lector de pantalla hay una lista oculta con cada elemento una vez."],
    props: [
      { key: "cellWidth", label: "Ancho de celda (px)", type: "number", default: 200, min: 100, max: 420, step: 10 },
      { key: "ratio", label: "Proporción (ancho/alto)", type: "number", default: 0.8, min: 0.5, max: 1.6, step: 0.05 },
      { key: "gap", label: "Espacio (px)", type: "number", default: 14, min: 0, max: 40, step: 2 },
      { key: "inertia", label: "Inercia", type: "number", default: 0.93, min: 0.8, max: 0.98, step: 0.01 },
      { key: "drift", label: "Deriva (px/s)", type: "number", default: 0, min: 0, max: 80, step: 5 },
      { key: "wheel", label: "Rueda del ratón", type: "boolean", default: false },
    ],
    render: (p) => (
      <div style={{ width: "100%" }}>
        <DragGrid items={ART.map((a) => ({ ...a, href: "#" }))} height="440px" cellWidth={p.cellWidth as number} ratio={p.ratio as number} gap={p.gap as number} inertia={p.inertia as number} drift={p.drift as number} wheel={p.wheel as boolean} />
      </div>
    ),
  },
  {
    id: "object-stage",
    component: "ObjectStage",
    path: "@/components/ui/ObjectStage",
    name: "Objeto 3D con materiales físicos",
    category: "galerias",
    styles: EDITORIAL,
    description:
      "Un objeto 3D con metal, vidrio, plástico barnizado o mate y reflejos de estudio, sin cargar ningún HDR (RoomEnvironment de three). El color sale de los tokens del tema. Sin WebGL o con movimiento reducido, una esfera plana con degradado. Con src, un modelo GLB en vez de la forma (con sus materiales, encuadrado al lienzo; sin Draco ni meshopt, que piden WebAssembly): el ojo que te mira de /sitios/anima/info o la tumba de /sitios/anima/entradas; modelRotation lo orienta, follow dice cuánto gira hacia el puntero, glow pone una luz de color delante y env=\"none\" quita los reflejos de estudio para modelos con la luz horneada.",
    stageHeight: 400,
    notes: ["Requiere three y @react-three/fiber: se importa por subruta, trama-ui/ObjectStage.", "Es el contrapunto limpio de RetroCanvas: misma tecnología, sin filtro retro."],
    props: [
      { key: "shape", label: "Forma", type: "select", default: "knot", options: OBJECT_SHAPE_LIST, labels: { knot: "nudo", sphere: "esfera", torus: "toro", capsule: "cápsula", gem: "gema" } },
      { key: "material", label: "Material", type: "select", default: "metal", options: OBJECT_MATERIAL_LIST, labels: { metal: "metal", glass: "vidrio", gloss: "plástico barnizado", matte: "mate" } },
      { key: "tone", label: "Color (token)", type: "select", default: "acc", options: ["fg", "acc", "acc2", "mut"] },
      { key: "motion", label: "Movimiento", type: "select", default: "pointer", options: ["pointer", "spin", "float", "none"] },
      { key: "speed", label: "Velocidad", type: "number", default: 1, min: 0.2, max: 3, step: 0.1 },
      { key: "height", label: "Alto (px)", type: "number", default: 340, min: 160, max: 700, step: 10 },
      { key: "src", label: "Modelo GLB (en vez de la forma)", type: "select", default: "", options: ["", "/models/ojo-sangre/ojo-sangre-transformed.glb", "/models/tumba-magica/tumba-magica-transformed.glb"], labels: { "": "ninguno (la forma)", "/models/ojo-sangre/ojo-sangre-transformed.glb": "un ojo", "/models/tumba-magica/tumba-magica-transformed.glb": "una lápida" } },
      { key: "follow", label: "Giro hacia el puntero (rad)", type: "number", default: 0.9, min: 0, max: 1.6, step: 0.05 },
      { key: "glow", label: "Luz de color delante", type: "select", default: "", options: ["", "acc", "acc2", "fg"], labels: { "": "ninguna" } },
      { key: "env", label: "Reflejos", type: "select", default: "studio", options: ["studio", "none"], labels: { studio: "de estudio", none: "solo luces (luz horneada)" } },
    ],
    render: (p) => (
      <div style={{ width: "100%" }}>
        <ObjectStage shape={p.shape as never} material={p.material as never} tone={p.tone as never} motion={p.motion as never} speed={p.speed as number} height={p.height as number} src={(p.src as string) || undefined} follow={p.follow as number} glow={p.glow as never} env={p.env as never} />
      </div>
    ),
  },
  {
    id: "type-field",
    component: "TypeField",
    path: "@/components/ui/TypeField",
    name: "Campo de letras con palabras escondidas",
    category: "galerias",
    styles: EDITORIAL,
    description:
      "Un suelo de letras en 3D (56 × 23 columnas extruidas) con palabras escondidas a la vista: en reposo son del color del fondo, como todas; con el scroll, el puntero o solas, suben letra a letra con rebote, toman su color y dan sombra mientras el resto se hunde en una onda que sale del centro, y vuelven desde la última letra. El puntero hunde y tiñe las letras de alrededor. Concepto y coreografía medidos copia a copia en Plain Sight (motion-pieces) con cine:capture (docs/27). Letras y niebla del fondo (tema claro u oscuro), palabras de sus tokens; fuente Anton (OFL) servida con el kit. Sin WebGL o con movimiento reducido, las palabras en plano.",
    stageHeight: 520,
    notes: ["Requiere three y @react-three/fiber: se importa por subruta, trama-ui/TypeField.", "Una palabra por línea, «TEXTO|tono» (acc, acc2, fg, mut); hasta cuatro."],
    props: [
      { key: "words", label: "Palabras (una por línea)", type: "text", default: "ABOUT\nCONTACT|acc2\nWORKS|acc\nNEWS|acc2" },
      { key: "trigger", label: "Las mueve", type: "select", default: "loop", options: ["loop", "hover", "scroll"], labels: { loop: "solas, en bucle", hover: "el puntero encima", scroll: "el scroll" } },
      { key: "duration", label: "Ciclo (s, en bucle)", type: "number", default: 6, min: 3, max: 16, step: 1 },
      { key: "height", label: "Alto (px)", type: "number", default: 480, min: 280, max: 800, step: 10 },
    ],
    render: (p) => (
      <div style={{ width: "100%" }}>
        <TypeField words={p.words as string} trigger={p.trigger as never} duration={p.duration as number} height={p.height as number} />
      </div>
    ),
  },
  {
    id: "porthole",
    component: "Porthole",
    path: "@/components/ui/Porthole",
    name: "Ventanilla de avión al alba (WebGPU)",
    category: "galerias",
    styles: EDITORIAL,
    description:
      "La vista desde la ventanilla de un avión al alba, como fondo de portada: cielo con su resplandor bajo el horizonte, estrellas que titilan, ciudades y ríos en el suelo y el ala con su librea, todo procedural (sin modelos ni texturas). La cámara se asoma hacia el puntero como una cabeza y, al arrastrar, sale por la ventanilla (otro arrastre la devuelve). Concepto, cámara (ganancias y seguimiento) y la rampa del cielo medidos en Hublot (darkroom.engineering) con cine:capture (docs/28). WebGPU con reserva WebGL2, materiales de nodos sin luces. El tema pone la librea; los colores del cielo son los medidos. Sin WebGL o con movimiento reducido, el cielo plano enmarcado por la ventanilla.",
    stageHeight: 520,
    notes: ["Requiere three y @react-three/fiber: se importa por subruta, trama-ui/Porthole.", "Mueve el puntero para asomarte; arrastra para salir por la ventanilla.", "children va encima de la escena (titular, botones)."],
    props: [
      { key: "livery", label: "Librea (token)", type: "select", default: "acc", options: ["acc", "acc2", "fg", "mut"] },
      { key: "cities", label: "Ciudades", type: "number", default: 0.35, min: 0, max: 1, step: 0.05 },
      { key: "interactive", label: "Arrastrar para salir", type: "boolean", default: true },
      { key: "hint", label: "Pista", type: "text", default: "Arrastra para salir por la ventanilla" },
      { key: "height", label: "Alto (px)", type: "number", default: 480, min: 280, max: 800, step: 10 },
    ],
    render: (p) => (
      <div style={{ width: "100%" }}>
        <Porthole livery={p.livery as never} cities={p.cities as number} interactive={p.interactive as boolean} hint={p.hint as string} height={p.height as number} />
      </div>
    ),
  },
  {
    id: "toy-drive",
    component: "ToyDrive",
    path: "@/components/ui/ToyDrive",
    name: "Coche de juguete con física",
    category: "galerias",
    styles: EDITORIAL,
    description:
      "Un coche de juguete que se conduce y derriba las letras de una palabra y una pila de cajas, todo con física, desde una cámara isométrica que lo persigue: para portadas que quieren que el visitante juegue. Flechas o WASD con la pieza enfocada (espacio frena, R vuelve a la salida); con el ratón o el dedo, mantener pulsado lleva el coche hacia ese punto. Cámara (dirección, distancia, fov 25 y seguimiento) y dinámica (aceleración, punta, frenada, giro) medidas en el portfolio de Bruno Simon con cine:capture (docs/29). La física es la del kit, lib/physics, sin WebAssembly. Colores del tema: suelo del fondo, coche del acento, letras del texto. Sin WebGL o con movimiento reducido, la palabra en plano.",
    stageHeight: 520,
    notes: ["Requiere three y @react-three/fiber: se importa por subruta, trama-ui/ToyDrive.", "Haz clic en la escena y conduce con las flechas; o mantén pulsado sobre el suelo.", "La palabra admite hasta 8 letras."],
    props: [
      { key: "word", label: "Palabra", type: "text", default: "PLAY" },
      { key: "interactive", label: "Se conduce", type: "boolean", default: true },
      { key: "hint", label: "Pista", type: "text", default: "Flechas o WASD para conducir · mantén pulsado para ir hacia un punto · R vuelve" },
      { key: "height", label: "Alto (px)", type: "number", default: 480, min: 280, max: 800, step: 10 },
    ],
    render: (p) => (
      <div style={{ width: "100%" }}>
        <ToyDrive word={p.word as string} interactive={p.interactive as boolean} hint={p.hint as string} height={p.height as number} />
      </div>
    ),
  },
  {
    id: "cross-cluster",
    component: "CrossCluster",
    path: "@/components/ui/CrossCluster",
    name: "Racimo de cruces que sigue al puntero",
    category: "galerias",
    styles: EDITORIAL,
    description:
      "Un racimo de cruces de plástico que flotan juntas, se empujan y siguen al puntero, para portadas con un objeto 3D vivo detrás del titular. Sin luces ni mapa de entorno: cada píxel calcula de forma analítica la oclusión, la sombra y el reflejo que le dan las demás cruces, sobre un matcap y una sombra propia horneada; las de cristal refractan lo que tienen detrás. Material traducido de los shaders de la portada de Lusion; cámara y dinámica (cuánto sigue al puntero, cuánto tarda en volver, cómo se agita en reposo) medidas con cine:capture y cine:conjunto (docs/31). Física del kit, lib/physics, sin WebAssembly. Colores del tema: fondo de --card, cruces de acento, texto y atenuado, cristal de --acc2.",
    stageHeight: 520,
    notes: ["Requiere three y @react-three/fiber: se importa por subruta, trama-ui/CrossCluster.", "Usa WebGPU (o su reserva WebGL2): cada píxel recorre todas las cruces, así que con más de 30 el coste sube.", "El contenido que pases como hijo va encima sin quitarle el puntero a la escena."],
    props: [
      { key: "count", label: "Cruces", type: "number", default: 24, min: 8, max: 40, step: 1 },
      { key: "glass", label: "De cristal", type: "number", default: 2, min: 0, max: 4, step: 1 },
      { key: "glossy", label: "Fracción pulidas", type: "number", default: 0.25, min: 0, max: 1, step: 0.05 },
      { key: "follow", label: "Sigue al puntero", type: "number", default: 0.35, min: 0, max: 1, step: 0.05 },
      { key: "interactive", label: "Con puntero", type: "boolean", default: true },
      { key: "height", label: "Alto (px)", type: "number", default: 480, min: 280, max: 800, step: 10 },
    ],
    render: (p) => (
      <div style={{ width: "100%" }}>
        <CrossCluster count={p.count as number} glass={p.glass as number} glossy={p.glossy as number} follow={p.follow as number} interactive={p.interactive as boolean} height={p.height as number} />
      </div>
    ),
  },
  {
    id: "engraved-map",
    component: "EngravedMap",
    path: "@/components/ui/EngravedMap",
    name: "Paisaje grabado a lápiz",
    category: "galerias",
    styles: EDITORIAL,
    description:
      "Un paisaje de viñas y pueblo dibujado como un grabado a lápiz sobre papel: parcelas con surcos en direcciones distintas y caminos en blanco, casas con tejado a dos aguas y árboles con contorno, con un vuelo de entrada desde el horizonte y un leve paralaje con el puntero. Para bodegas, territorio, turismo o cualquier marca que quiera un 3D que no parezca 3D. Técnica medida en la portada de Chartogne-Taillet (docs/32): la escena no pinta colores sino normal, lápiz y cercanía, y una pasada final pone papel, lápiz y contornos de Sobel. Imagen al 8 %, acabado al 7 % y cámara al 5 % de la referencia. Colores del tema: papel de --card y lápiz de --mut.",
    stageHeight: 560,
    notes: ["Requiere three y @react-three/fiber: se importa por subruta, trama-ui/EngravedMap.", "Pinta siempre a 2× (como la referencia): los contornos y el grano se afinan al reducirse.", "El motor del grabado (lib/gravure: materialLapiz y pilaGrabado) vale para cualquier escena con WebGPURenderer."],
    props: [
      { key: "seed", label: "Semilla del paisaje", type: "number", default: 3, min: 1, max: 99, step: 1 },
      { key: "intro", label: "Vuelo de entrada (s)", type: "number", default: 3, min: 0, max: 8, step: 0.5 },
      { key: "interactive", label: "Paralaje con el puntero", type: "boolean", default: true },
      { key: "height", label: "Alto (px)", type: "number", default: 520, min: 280, max: 800, step: 10 },
    ],
    render: (p) => (
      <div style={{ width: "100%" }}>
        <EngravedMap seed={p.seed as number} intro={p.intro as number} interactive={p.interactive as boolean} height={p.height as number} />
      </div>
    ),
  },
  {
    id: "chapter-stage",
    component: "ChapterStage",
    path: "@/components/ui/ChapterStage",
    name: "Escenario por capítulos con fallo de señal",
    category: "transiciones",
    styles: EDITORIAL,
    description:
      "Escenario fijado al scroll para contar algo por capítulos: una palabra gigante por capítulo que se releva dentro de una máscara (la que sale sube con curva en S, la que entra llega desde abajo frenando), una tarjeta central con la imagen del capítulo que sufre un fallo de señal (separación de color, desgarros, líneas) en cada relevo, una sala en perspectiva dibujada con líneas, la lista del capítulo y la barra de capítulos. Coreografía medida en meermohsin.me con la medida del DOM de cine:capture (docs/30). Fijado al scroll de la página o controlado con progress (0–1). Colores del tema; sin WebGL, imagen y líneas en SVG.",
    stageHeight: 540,
    notes: ["Requiere three y @react-three/fiber: se importa por subruta, trama-ui/ChapterStage.", "Sin progress se fija al scroll: ocupa (suma de perChapter + 1) pantallas.", "perChapter admite una duración por capítulo, en pantallas."],
    props: [
      { key: "progress", label: "Progreso (modo controlado)", type: "number", default: 0.1, min: 0, max: 1, step: 0.01 },
      { key: "height", label: "Alto (px)", type: "number", default: 520, min: 320, max: 800, step: 10 },
    ],
    render: (p) => (
      <div style={{ width: "100%" }}>
        <ChapterStage
          progress={p.progress as number}
          height={p.height as number}
          chapters={[
            { word: "Legacy", label: "Tension", image: ART[0].src, items: ["Brand systems", "Art direction", "Motion"] },
            { word: "Craft", label: "Immersion", image: ART[3].src, items: ["Interfaces", "Prototyping", "Research"] },
            { word: "Impact", label: "Impact", image: ART[5].src, items: ["Launch", "Performance", "Growth"] },
          ]}
        />
      </div>
    ),
  },
  {
    id: "point-cloud",
    component: "PointCloud",
    path: "@/components/ui/PointCloud",
    name: "Nube de puntos de un terreno escaneado",
    category: "galerias",
    styles: EDITORIAL,
    description:
      "Un terreno escaneado como nube de puntos (topografía con dron, LIDAR, gemelos digitales), procedural y sin descargas: un barrido que revela los puntos con estela, color por cota (--acc2 en el valle, --acc en la cumbre), edificios que se levantan, línea de medida con su distancia y desnivel ({d}, {h}) y una lupa que lee la X/Y/Z bajo el ratón; un clic lanza un pulso de escaneo. Sola (motion) o guiada desde fuera con state (useScrollStory). Sin WebAssembly. Nació en /sitios/cota.",
    stageHeight: 460,
    notes: ["Requiere three y @react-three/fiber: se importa por subruta, trama-ui/PointCloud.", "Pasa el ratón por el terreno y haz clic."],
    props: [
      { key: "motion", label: "Movimiento", type: "select", default: "scan", options: ["scan", "orbit", "none"], labels: { scan: "barrido en bucle", orbit: "órbita lenta", none: "quieta" } },
      { key: "density", label: "Puntos por lado", type: "number", default: 180, min: 80, max: 260, step: 10 },
      { key: "seed", label: "Semilla del terreno", type: "number", default: 7, min: 1, max: 99, step: 1 },
      { key: "lens", label: "Radio de la lupa", type: "number", default: 0.16, min: 0, max: 0.4, step: 0.02 },
      { key: "readout", label: "Lectura X/Y/Z", type: "boolean", default: true },
    ],
    render: (p) => (
      <div style={{ width: "100%" }}>
        <PointCloud motion={p.motion as never} density={p.density as number} seed={p.seed as number} lens={p.lens as number} readout={p.readout as boolean} height="440px" />
      </div>
    ),
  },
];
