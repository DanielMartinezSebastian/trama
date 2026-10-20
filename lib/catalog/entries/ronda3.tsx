"use client";

import CookieBanner from "@/components/ui/CookieBanner";
import ExplorableCanvas, { type MapModel } from "@/components/ui/ExplorableCanvas";
import StickerCollage from "@/components/ui/StickerCollage";
import { photo } from "@/lib/sites/photos";
import { sticker } from "@/lib/sites/stickers";
import type { CatalogEntry } from "../schema";
import { variantProp } from "./shared";

/** Ronda 3 de webs premiadas (docs/08-ronda-3-webs-premiadas.md). La pantalla de entrada, el interruptor de sonido, la
 * tipografía elástica y el cambio de vista se fundieron con Modal, Toggle, SplitText y ProjectList (docs/04-pendientes.md §6). */
const STYLES = ["editorial", "minimal", "outline"] as CatalogEntry["styles"];
const Boxed = ({ h, children }: { h: number; children: React.ReactNode }) => (
  <div style={{ position: "relative", width: "100%", height: h, transform: "translateZ(0)", overflow: "hidden", border: "1px dashed var(--ln)" }}>{children}</div>
);

// la maqueta del catálogo: un trozo real del Eixample de Barcelona (1083 × 708 m a 1,6 px/m: un mundo de 1733 × 1133 px, girado para que las calles queden en
// horizontal) sacado de OpenStreetMap con las plantas del Catastro (`scripts/maqueta/osm_to_glb.py`). Cada punto está
// sobre un edificio real, marcado con el acento; `z` es su altura (m × px por metro)
const PX_M = 1.6;
const EIXAMPLE: MapModel = { src: "/models/eixample/modelo.glb", scale: PX_M, plan: { src: "/models/eixample/plan.svg", w: 1083, h: 708 } };
const MARKERS = [
  { id: "a", x: 18.28, y: 32.5, z: 15.5 * PX_M, title: "Eco", meta: "Identidad sonora", text: "Una marca de té que suena a tazas y a lluvia.", image: photo("naturaleza", 3).src },
  { id: "b", x: 38.94, y: 79.38, z: 18.6 * PX_M, title: "Faro", meta: "Podcast", text: "Doce episodios sobre arquitectura costera.", image: photo("arquitectura", 4).src },
  { id: "c", x: 50.81, y: 14.08, z: 15.5 * PX_M, title: "Ola", meta: "Campaña", text: "Un lanzamiento de un solo día, en directo.", image: photo("eventos", 4).src },
  { id: "d", x: 91.88, y: 62.3, z: 15.5 * PX_M, title: "Nodo", meta: "Sonido de producto", text: "Los avisos de una app de logística.", image: photo("estudio", 1).src },
];

/** atribución de los datos del mapa (ODbL): siempre a la vista sobre el lienzo */
const OsmCredit = () => (
  <a href="https://www.openstreetmap.org/copyright" style={{ position: "absolute", right: 10, bottom: 8, zIndex: 3, fontSize: 11, color: "var(--mut)", background: "color-mix(in srgb, var(--bg) 80%, transparent)", padding: "1px 6px", borderRadius: 4 }}>
    © OpenStreetMap
  </a>
);

export const ronda3: CatalogEntry[] = [
  {
    id: "explorable-canvas",
    component: "ExplorableCanvas",
    path: "@/components/ui/ExplorableCanvas",
    name: "Lienzo explorable por arrastre",
    category: "galerias",
    styles: STYLES,
    description: "Un mundo más grande que la ventana con puntos clicables (Overworld Audio): se arrastra con inercia, se mueve con flechas, cada punto centra la vista y abre su ficha. Incluye vista de lista como alternativa accesible. Con depth=\"3d\" el mundo es una maqueta de papel en three.js (cartón, metacrilato, madera y árboles de espuma, sombras suaves) con una intro que pasa del plano a la maqueta; con nav=\"scroll\" dentro de un PinnedSection, el scroll lleva la cámara por una ruta de paradas (Oryzo, Primland). Usa el arrastre de DragGrid (lib/ui/dragPan.ts), un OptionPicker para «Mapa / Lista» y la carga diferida de los componentes 3D (lib/ui/gl.tsx).",
    stageHeight: 560,
    props: [
      { key: "depth", label: "Profundidad", type: "select", default: "3d", options: ["flat", "3d"], labels: { flat: "plano 2D", "3d": "maqueta 3D (three.js)" } },
      { key: "tilt", label: "Inclinación de la cámara (°)", type: "number", default: 52, min: 0, max: 70, step: 2, when: (p) => p.depth === "3d" },
      { key: "intro", label: "Intro del plano a la maqueta", type: "boolean", default: true, when: (p) => p.depth === "3d" },
      { key: "explode", label: "Despiece: separación entre capas (px)", type: "number", default: 0, min: 0, max: 160, step: 10, when: (p) => p.depth === "3d" },
      { key: "frame", label: "Con marco (sin él, la maqueta se funde con la página)", type: "boolean", default: true },
      { key: "listToggle", label: "Botón Mapa / Lista", type: "boolean", default: true },
      { key: "hint", label: "Pista de uso", type: "text", default: "Arrastra para explorar · pulsa un punto" },
    ],
    notes: [
      "depth=\"3d\" carga three solo si el equipo puede y el mapa está en pantalla; mientras tanto (y con movimiento reducido) se ve el plano 2D con las huellas de los volúmenes.",
      "La maqueta puede ser un modelo real (`model`: GLB por capas). `scripts/maqueta/` convierte un IFC (`ifc_to_glb.py`, la clínica de /sitios/plano) o un barrio de OpenStreetMap (`osm_to_glb.py`, el Eixample de este ejemplo) con su planta en SVG para el tablero y la vista 2D. Los datos de OpenStreetMap piden la atribución a la vista (ODbL).",
      "También acepta volúmenes generados (`blocks`); `lib/sites/maqueta.ts` trae `city()` (manzanas con plazas) y `walls()` (muros a partir de un plano).",
      "nav=\"scroll\" necesita un PinnedSection alrededor: ver la portada de la demo Alzado.",
      "Cada parada de `path` puede separar las capas (`explode`, con `MapBlock.layer`), dejar una sólida y el resto en alambre (`focusLayer`), barrer la maqueta con un plano de luz que descubre los puntos (`scan`), resaltar un punto (`focus`) y cambiar el fondo (`bg`). Con captions={false} y onStop la web pinta sus propios capítulos: ver la portada de /sitios/plano.",
      "`MapBlock.z` levanta un volumen del tablero (vigas, conductos) y mat=\"wire\" lo dibuja solo en aristas.",
    ],
    render: (p) => (
      <div style={{ position: "relative" }}>
        <ExplorableCanvas key={`${p.depth}${p.intro}`} markers={MARKERS.map((m) => ({ ...m, href: "#" }))} model={EIXAMPLE} world={{ w: 1733, h: 1133 }} depth={p.depth as never} tilt={p.tilt as number} intro={p.intro as boolean} explode={p.explode as number} frame={p.frame as boolean} height="480px" listToggle={p.listToggle as boolean} hint={p.hint as string} />
        <OsmCredit />
      </div>
    ),
  },
  {
    id: "sticker-collage",
    component: "StickerCollage",
    path: "@/components/ui/StickerCollage",
    name: "Collage de pegatinas arrastrables",
    category: "interaccion",
    styles: STYLES,
    description: "Pegatinas vectoriales que flotan sobre un titular y se pueden arrastrar, apilar y mover con las flechas (Uncommon). Decorativo: el texto que importa va en el contenido, no en las pegatinas.",
    stageHeight: 460,
    props: [{ key: "float", label: "Flotan", type: "boolean", default: true }],
    render: (p) => (
      <StickerCollage
        height="400px"
        float={p.float as boolean}
        stickers={[
          { id: "a", src: sticker("burst", "#ff6a3d", "#fff3c4"), x: 16, y: 26, width: 110, rotate: -12, label: "Pegatina de una explosión" },
          { id: "b", src: sticker("smile", "#ffd23d"), x: 84, y: 24, width: 96, rotate: 10, label: "Pegatina de una cara sonriente" },
          { id: "c", src: sticker("bolt", "#47c2ff"), x: 78, y: 76, width: 90, rotate: 14, label: "Pegatina de un rayo" },
          { id: "d", src: sticker("flower", "#ff8fb6", "#ffe066"), x: 20, y: 78, width: 104, rotate: -8, label: "Pegatina de una flor" },
        ]}
      >
        <p style={{ margin: 0, fontSize: "clamp(32px, 7vw, 72px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>Hecho con ganas</p>
      </StickerCollage>
    ),
  },
  {
    id: "cookie-banner",
    component: "CookieBanner",
    path: "@/components/ui/CookieBanner",
    name: "Aviso de cookies",
    category: "overlays",
    styles: STYLES,
    description: "Aviso con la marca de la web (Neutomni). «Rechazar» pesa lo mismo que «Aceptar», hay vista «Personalizar» con categorías y recuerda la elección. No bloquea la página. Está hecho con Button y Toggle: para teñirlo, redefine --bg, --fg y --acc sobre .ui-cook.",
    stageHeight: 400,
    props: [
      { key: "position", label: "Posición", type: "select", default: "bottom-right", options: ["bottom-right", "bottom-left", "bottom"] },
      { key: "title", label: "Título", type: "text", default: "¿Qué te parecen las cookies?" },
      variantProp("minimal"),
    ],
    render: (p) => (
      <Boxed h={340}>
        <CookieBanner key={`${p.position}${p.title}${p.variant}`} storageKey="ui-cat-cookies" position={p.position as never} title={p.title as string} variant={p.variant as never} policyHref="#" />
      </Boxed>
    ),
  },
];
