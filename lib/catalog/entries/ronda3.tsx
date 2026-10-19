"use client";

import CookieBanner from "@/components/ui/CookieBanner";
import ExplorableCanvas from "@/components/ui/ExplorableCanvas";
import StickerCollage from "@/components/ui/StickerCollage";
import { city } from "@/lib/sites/maqueta";
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

const MARKERS = [
  { id: "a", x: 22, y: 30, title: "Eco", meta: "Identidad sonora", text: "Una marca de té que suena a tazas y a lluvia.", image: photo("naturaleza", 3).src },
  { id: "b", x: 48, y: 58, title: "Faro", meta: "Podcast", text: "Doce episodios sobre arquitectura costera.", image: photo("arquitectura", 4).src },
  { id: "c", x: 74, y: 34, title: "Ola", meta: "Campaña", text: "Un lanzamiento de un solo día, en directo.", image: photo("eventos", 4).src },
  { id: "d", x: 62, y: 80, title: "Nodo", meta: "Sonido de producto", text: "Los avisos de una app de logística.", image: photo("estudio", 1).src },
];

// la maqueta del catálogo: un barrio de cartón con una plaza en cada punto (mundo de 2600 × 1700)
const CITY = city({ seed: 3, plazas: MARKERS, aspect: 1700 / 2600, cell: 7, maxH: 150 });
// el mismo barrio repartido en tres capas para enseñar el despiece (`explode`): árboles en la base, el resto alternando
const CITY_LAYERS = CITY.map((b, i) => ({ ...b, layer: b.shape === "tree" ? 0 : (i % 3) + 1 }));

const Rings = () => (
  <svg width="100%" height="100%" aria-hidden style={{ position: "absolute", inset: 0 }}>
    <defs>
      <pattern id="ui-cat-dots" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="currentColor" opacity=".28" /></pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ui-cat-dots)" style={{ color: "var(--mut)" }} />
    {MARKERS.map((m) => [90, 170, 260, 360].map((r) => <circle key={m.id + r} cx={`${m.x}%`} cy={`${m.y}%`} r={r} fill="none" stroke="currentColor" strokeOpacity=".18" style={{ color: "var(--fg)" }} />))}
  </svg>
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
      "Los volúmenes son datos (`blocks`); `lib/sites/maqueta.ts` trae dos generadores para las demos: `city()` (manzanas con plazas) y `walls()` (muros a partir de un plano).",
      "nav=\"scroll\" necesita un PinnedSection alrededor: ver la portada de la demo Alzado.",
      "Cada parada de `path` puede separar las capas (`explode`, con `MapBlock.layer`), dejar una sólida y el resto en alambre (`focusLayer`), barrer la maqueta con un plano de luz que descubre los puntos (`scan`), resaltar un punto (`focus`) y cambiar el fondo (`bg`). Con captions={false} y onStop la web pinta sus propios capítulos: ver la portada de /sitios/plano.",
      "`MapBlock.z` levanta un volumen del tablero (vigas, conductos) y mat=\"wire\" lo dibuja solo en aristas.",
    ],
    render: (p) => <ExplorableCanvas key={`${p.depth}${p.intro}`} markers={MARKERS.map((m) => ({ ...m, href: "#" }))} background={p.depth === "3d" ? undefined : <Rings />} blocks={CITY_LAYERS} depth={p.depth as never} tilt={p.tilt as number} intro={p.intro as boolean} explode={p.explode as number} frame={p.frame as boolean} height="480px" listToggle={p.listToggle as boolean} hint={p.hint as string} />,
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
      { key: "position", label: "Posición", type: "select", default: "bottom-left", options: ["bottom-left", "bottom-right", "bottom"] },
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
