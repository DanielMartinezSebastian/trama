"use client";

import DistortImage, { DISTORT_EFFECTS } from "@/components/ui/DistortImage";
import DragGrid from "@/components/ui/DragGrid";
import ObjectStage, { OBJECT_MATERIAL_LIST, OBJECT_SHAPE_LIST } from "@/components/ui/ObjectStage";
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
];
