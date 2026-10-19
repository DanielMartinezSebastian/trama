"use client";

import CookieBanner from "@/components/ui/CookieBanner";
import ExplorableCanvas from "@/components/ui/ExplorableCanvas";
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

const MARKERS = [
  { id: "a", x: 22, y: 30, title: "Eco", meta: "Identidad sonora", text: "Una marca de té que suena a tazas y a lluvia.", image: photo("naturaleza", 3).src },
  { id: "b", x: 48, y: 58, title: "Faro", meta: "Podcast", text: "Doce episodios sobre arquitectura costera.", image: photo("arquitectura", 4).src },
  { id: "c", x: 74, y: 34, title: "Ola", meta: "Campaña", text: "Un lanzamiento de un solo día, en directo.", image: photo("eventos", 4).src },
  { id: "d", x: 62, y: 80, title: "Nodo", meta: "Sonido de producto", text: "Los avisos de una app de logística.", image: photo("estudio", 1).src },
];

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
    description: "Un mundo más grande que la ventana con puntos clicables (Overworld Audio): se arrastra con inercia, se mueve con flechas, cada punto centra la vista y abre su ficha. Incluye vista de lista como alternativa accesible. Usa el mismo arrastre que DragGrid (lib/ui/dragPan.ts) y un OptionPicker para «Mapa / Lista».",
    stageHeight: 560,
    props: [
      { key: "listToggle", label: "Botón Mapa / Lista", type: "boolean", default: true },
      { key: "hint", label: "Pista de uso", type: "text", default: "Arrastra para explorar · pulsa un punto" },
    ],
    render: (p) => <ExplorableCanvas markers={MARKERS.map((m) => ({ ...m, href: "#" }))} background={<Rings />} height="480px" listToggle={p.listToggle as boolean} hint={p.hint as string} />,
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
