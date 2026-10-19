"use client";

import { useState } from "react";
import CookieBanner from "@/components/ui/CookieBanner";
import ElasticText from "@/components/ui/ElasticText";
import EntryGate from "@/components/ui/EntryGate";
import ExplorableCanvas from "@/components/ui/ExplorableCanvas";
import SoundToggle from "@/components/ui/SoundToggle";
import StickerCollage from "@/components/ui/StickerCollage";
import WorkViews from "@/components/ui/WorkViews";
import { photo } from "@/lib/sites/photos";
import { sticker } from "@/lib/sites/stickers";
import type { CatalogEntry } from "../schema";

/** Ronda 3 de webs premiadas (docs/08-ronda-3-webs-premiadas.md). */
const STYLES = ["editorial", "minimal", "outline"] as CatalogEntry["styles"];
const Boxed = ({ h, children }: { h: number; children: React.ReactNode }) => (
  <div style={{ position: "relative", width: "100%", height: h, transform: "translateZ(0)", overflow: "hidden", border: "1px dashed var(--ln)" }}>{children}</div>
);

const WORK = [
  { title: "Casa Alba", meta: "Interiorismo", year: "2026", image: photo("interiores", 4).src },
  { title: "Tinta y Sal", meta: "Identidad", year: "2026", image: photo("objetos", 4).src },
  { title: "Nodo", meta: "Producto digital", year: "2025", image: photo("estudio", 1).src },
  { title: "Faro", meta: "Web + 3D", year: "2025", image: photo("arquitectura", 4).src },
  { title: "Ola", meta: "Campaña", year: "2024", image: photo("gastronomia", 1).src },
];

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

function GateDemo({ variant }: { variant: "sound" | "age" | "plain" }) {
  const [on, setOn] = useState(false);
  const [n, setN] = useState(0);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <button type="button" className="ui-gate__btn" onClick={() => { setOn(true); setN(n + 1); }}>Mostrar la pantalla de entrada</button>
      <Boxed h={320}>
        {on && (
          <EntryGate
            key={n}
            variant={variant}
            title={variant === "age" ? "¿Eres mayor de edad?" : variant === "sound" ? "Mejor con sonido" : "Bienvenida"}
            text={variant === "age" ? "Elige una opción para entrar." : "Puedes cambiarlo después desde la cabecera."}
            actions={variant === "age" ? [{ label: "Sí", value: "si", primary: true }, { label: "No", value: "no", href: "#" }] : variant === "sound" ? [{ label: "Entrar con sonido", value: "on", primary: true }, { label: "Sin sonido", value: "off" }] : [{ label: "Entrar", value: "ok", primary: true }]}
            onChoose={() => setOn(false)}
          />
        )}
      </Boxed>
    </div>
  );
}

export const ronda3: CatalogEntry[] = [
  {
    id: "entry-gate",
    component: "EntryGate",
    path: "@/components/ui/EntryGate",
    name: "Pantalla de entrada (sonido / mayoría de edad)",
    category: "overlays",
    styles: STYLES,
    description: "Diálogo a pantalla completa con titular enorme y dos botones: «Entrar con sonido / sin sonido» (Overworld Audio) o «¿Eres mayor de edad?» (Santioni Spirits). Bloquea el scroll, atrapa el foco y recuerda la elección en la sesión. Es una declaración, no una verificación legal.",
    stageHeight: 420,
    props: [{ key: "variant", label: "Tono", type: "select", default: "sound", options: ["sound", "age", "plain"], noCode: true }],
    render: (p) => <GateDemo variant={p.variant as never} />,
  },
  {
    id: "sound-toggle",
    component: "SoundToggle",
    path: "@/components/ui/SoundToggle",
    name: "Interruptor de sonido con ecualizador",
    category: "interaccion",
    styles: STYLES,
    description: "Botón con barras animadas que se mueven cuando el sonido está activo. Arranca siempre apagado; con `src` controla un audio en bucle y con `onChange` avisa a tu propio reproductor.",
    stageHeight: 160,
    props: [
      { key: "bars", label: "Barras", type: "number", default: 4, min: 3, max: 8 },
      { key: "labelOff", label: "Texto apagado", type: "text", default: "Sonido: no" },
      { key: "labelOn", label: "Texto encendido", type: "text", default: "Sonido: sí" },
    ],
    render: (p) => <div className="ui-center"><SoundToggle bars={p.bars as number} labelOff={p.labelOff as string} labelOn={p.labelOn as string} /></div>,
  },
  {
    id: "elastic-text",
    component: "ElasticText",
    path: "@/components/ui/ElasticText",
    name: "Tipografía elástica",
    category: "texto",
    styles: STYLES,
    description: "Las letras se estiran en vertical cuando el puntero pasa cerca o cuando haces scroll rápido (Mat Voyce, Uncommon). Solo transforma: el texto sigue legible y accesible, y se queda quieto con movimiento reducido.",
    stageHeight: 300,
    props: [
      { key: "text", label: "Texto", type: "text", default: "Diseño que se siente" },
      { key: "mode", label: "Respuesta a", type: "select", default: "pointer", options: ["pointer", "scroll"], labels: { pointer: "puntero", scroll: "scroll" } },
      { key: "stretch", label: "Estirado", type: "number", default: 0.6, min: 0.2, max: 1.2, step: 0.1 },
    ],
    render: (p) => (
      <div className="ui-center" style={{ padding: 24 }}>
        <ElasticText as="h2" mode={p.mode as never} stretch={p.stretch as number} style={{ fontSize: "clamp(36px, 8vw, 96px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>{p.text as string}</ElasticText>
      </div>
    ),
  },
  {
    id: "work-views",
    component: "WorkViews",
    path: "@/components/ui/WorkViews",
    name: "Trabajos con cambio de vista animado",
    category: "galerias",
    styles: STYLES,
    description: "Colección de proyectos con botones «Vista ① ② ③»: lista con miniatura, cuadrícula o índice de texto. Al cambiar, cada elemento viaja a su nueva posición (GSAP Flip) en vez de saltar ('kin).",
    stageHeight: 640,
    props: [
      { key: "label", label: "Texto del selector", type: "text", default: "Vista" },
      { key: "views", label: "Vistas", type: "select", default: "3", options: ["2", "3"], labels: { "2": "Lista y cuadrícula", "3": "Lista, cuadrícula e índice" } },
    ],
    render: (p) => <WorkViews items={WORK.map((w) => ({ ...w, href: "#" }))} switchLabel={p.label as string} views={p.views === "2" ? ["list", "grid"] : ["list", "grid", "index"]} />,
  },
  {
    id: "explorable-canvas",
    component: "ExplorableCanvas",
    path: "@/components/ui/ExplorableCanvas",
    name: "Lienzo explorable por arrastre",
    category: "galerias",
    styles: STYLES,
    description: "Un mundo más grande que la ventana con puntos clicables (Overworld Audio): se arrastra con inercia, se mueve con flechas, cada punto centra la vista y abre su ficha. Incluye vista de lista como alternativa accesible.",
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
    description: "Aviso con la marca de la web (Neutomni). «Rechazar» pesa lo mismo que «Aceptar», hay vista «Personalizar» con categorías y recuerda la elección. No bloquea la página.",
    stageHeight: 360,
    props: [
      { key: "position", label: "Posición", type: "select", default: "bottom-left", options: ["bottom-left", "bottom-right", "bottom"] },
      { key: "title", label: "Título", type: "text", default: "¿Qué te parecen las cookies?" },
    ],
    render: (p) => (
      <Boxed h={300}>
        <CookieBanner key={`${p.position}${p.title}`} storageKey="ui-cat-cookies" position={p.position as never} title={p.title as string} policyHref="#" />
      </Boxed>
    ),
  },
];
