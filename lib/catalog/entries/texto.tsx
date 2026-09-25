"use client";

import BitmapText from "@/components/ui/BitmapText";
import Divider from "@/components/ui/Divider";
import Marquee from "@/components/ui/Marquee";
import NeonSign from "@/components/ui/NeonSign";
import ScrambleText from "@/components/ui/ScrambleText";
import SectionHeader from "@/components/ui/SectionHeader";
import Typewriter from "@/components/ui/Typewriter";
import { BANNER_FONTS } from "@/lib/text/store";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, toneProp, variantProp } from "./shared";

export const texto: CatalogEntry[] = [
  {
    id: "scramble-text",
    component: "ScrambleText",
    path: "@/components/ui/ScrambleText",
    name: "Texto que se descifra",
    category: "texto",
    styles: ["minimal", "neon", "terminal", "retro", "dotmatrix"],
    description: "Titular que se resuelve entre glifos aleatorios (GSAP ScrambleText). El texto real está siempre en el DOM.",
    stageHeight: 260,
    replayable: true,
    props: [
      { key: "text", label: "Texto", type: "text", default: "Aprende a leer el mar" },
      { key: "chars", label: "Caracteres", type: "text", default: "!<>-_\\/[]{}=+*^?#" },
      { key: "duration", label: "Duración (s)", type: "number", default: 1.2, min: 0.3, max: 4, step: 0.1 },
      { key: "speed", label: "Velocidad de glifos", type: "number", default: 0.6, min: 0.2, max: 2, step: 0.1 },
      { key: "trigger", label: "Disparador", type: "select", default: "mount", options: ["mount", "hover", "loop"] },
      toneProp("fg", ["fg", "acc", "acc2", "mut", "gradient"]),
      { key: "as", label: "Etiqueta", type: "select", default: "h2", options: ["h1", "h2", "h3", "p", "span"] },
      { key: "fontSize", label: "Tamaño (px)", type: "number", default: 40, min: 16, max: 96, step: 2 },
      { key: "weight", label: "Grosor", type: "number", default: 800, min: 300, max: 900, step: 100 },
      { key: "tracking", label: "Espaciado (em)", type: "number", default: -0.02, min: -0.05, max: 0.3, step: 0.01 },
      { key: "align", label: "Alineación", type: "select", default: "center", options: ["left", "center", "right"] },
      { key: "uppercase", label: "Mayúsculas", type: "boolean", default: false },
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <ScrambleText
          text={(p.text as string) || " "}
          chars={(p.chars as string) || "#"}
          duration={p.duration as number}
          speed={p.speed as number}
          trigger={p.trigger as never}
          tone={p.tone as never}
          as={p.as as never}
          fontSize={p.fontSize as number}
          weight={p.weight as number}
          tracking={p.tracking as number}
          align={p.align as never}
          uppercase={p.uppercase as boolean}
          playKey={replay}
        />
      </div>
    ),
  },
  {
    id: "typewriter",
    component: "Typewriter",
    path: "@/components/ui/Typewriter",
    name: "Frases que se escriben",
    category: "texto",
    styles: ALL_STYLES,
    description: "Titular de héroe con frases que se escriben y se borran en bucle.",
    stageHeight: 220,
    props: [
      { key: "prefix", label: "Texto fijo", type: "text", default: "Aprende " },
      { key: "phrases", label: "Frases (una por línea)", type: "text", multiline: true, default: "surf en Cantabria\nolas para todos\nel mar te espera" },
      { key: "typeSpeed", label: "Velocidad al escribir", type: "number", default: 14, min: 4, max: 40, step: 1 },
      { key: "deleteSpeed", label: "Velocidad al borrar", type: "number", default: 30, min: 8, max: 80, step: 1 },
      { key: "pause", label: "Pausa (s)", type: "number", default: 1.4, min: 0, max: 5, step: 0.1 },
      { key: "cursor", label: "Cursor", type: "select", default: "bar", options: ["bar", "block", "underscore", "none"] },
      { key: "fontSize", label: "Tamaño (px)", type: "number", default: 40, min: 16, max: 80, step: 2 },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Typewriter prefix={p.prefix as string} phrases={p.phrases as string} typeSpeed={p.typeSpeed as number} deleteSpeed={p.deleteSpeed as number} pause={p.pause as number} cursor={p.cursor as never} fontSize={p.fontSize as number} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "neon-sign",
    component: "NeonSign",
    path: "@/components/ui/NeonSign",
    name: "Rótulo de neón",
    category: "texto",
    styles: ["neon", "retro", "outline"],
    description: "Tubo de neón, contorno o sombra de píxel, con parpadeo opcional. Usa --acc y --acc2.",
    stageHeight: 240,
    props: [
      { key: "text", label: "Texto", type: "text", default: "ABIERTO" },
      { key: "mode", label: "Modo", type: "select", default: "tube", options: ["tube", "outline", "pixel"] },
      { key: "tone", label: "Color (token)", type: "select", default: "acc", options: ["acc", "acc2", "fg"] },
      { key: "fontSize", label: "Tamaño (px)", type: "number", default: 64, min: 24, max: 120, step: 2 },
      { key: "flicker", label: "Parpadeo", type: "boolean", default: true },
    ],
    render: (p) => (
      <div className="ui-center">
        <NeonSign text={(p.text as string) || " "} mode={p.mode as never} tone={p.tone as never} fontSize={p.fontSize as number} flicker={p.flicker as boolean} />
      </div>
    ),
  },
  {
    id: "bitmap-text",
    component: "BitmapText",
    path: "@/components/ui/BitmapText",
    name: "Titular ASCII (bitmap / FIGlet)",
    category: "texto",
    styles: ["retro", "neon", "terminal", "dotmatrix"],
    description: "Arte de texto generado por asciify-engine: fuente bitmap 7×7 o 21 fuentes FIGlet.",
    stageHeight: 260,
    props: [
      { key: "text", label: "Texto", type: "text", default: "PIXEL" },
      { key: "font", label: "Fuente", type: "select", default: "Bitmap", options: BANNER_FONTS },
      { key: "char", label: "Carácter (solo Bitmap)", type: "text", default: "#", when: (p) => p.font === "Bitmap" },
      { key: "scale", label: "Escala (solo Bitmap)", type: "number", default: 1, min: 1, max: 3, step: 1, when: (p) => p.font === "Bitmap" },
      { key: "fontSize", label: "Tamaño del carácter", type: "number", default: 11, min: 5, max: 16, step: 1 },
      toneProp("acc"),
      { key: "align", label: "Alineación", type: "select", default: "left", options: ["left", "center", "right"] },
      { key: "glow", label: "Halo", type: "boolean", default: true },
      { key: "glowSize", label: "Tamaño del halo (px)", type: "number", default: 8, min: 2, max: 30, step: 1, when: (p) => p.glow === true },
      { key: "animate", label: "Animación", type: "select", default: "none", options: ["none", "flicker", "scan"] },
    ],
    render: (p) => (
      <div className="ui-center">
        <BitmapText text={(p.text as string) || " "} font={p.font as string} char={(p.char as string) || "#"} scale={p.scale as number} fontSize={p.fontSize as number} tone={p.tone as never} align={p.align as never} glow={p.glow as boolean} glowSize={p.glowSize as number} animate={p.animate as never} />
      </div>
    ),
  },
  {
    id: "marquee",
    component: "Marquee",
    path: "@/components/ui/Marquee",
    name: "Cinta de texto",
    category: "texto",
    styles: ALL_STYLES,
    description: "Filas de texto en bucle, en CSS puro y sin JS. Siete estilos y color por token.",
    stageHeight: 260,
    props: [
      { key: "text", label: "Texto", type: "text", default: "NUEVA COLECCIÓN" },
      variantProp("terminal"),
      toneProp("acc"),
      { key: "direction", label: "Dirección", type: "select", default: "alternate", options: ["alternate", "left", "right"] },
      { key: "duration", label: "Vuelta completa (s)", type: "number", default: 18, min: 6, max: 60, step: 1 },
      { key: "rows", label: "Filas", type: "number", default: 2, min: 1, max: 5, step: 1 },
      { key: "fontSize", label: "Tamaño (px)", type: "number", default: 28, min: 14, max: 64, step: 2 },
      { key: "tilt", label: "Inclinación (°)", type: "number", default: 0, min: -8, max: 8, step: 0.5 },
      { key: "separator", label: "Separador", type: "text", default: "  //  " },
      { key: "edgeFade", label: "Difuminar extremos", type: "boolean", default: false },
      { key: "pauseOnHover", label: "Pausa al pasar el ratón", type: "boolean", default: true },
    ],
    render: (p) => (
      <div className="ui-center ui-center--full">
        <Marquee text={(p.text as string) || " "} variant={p.variant as never} tone={p.tone as never} direction={p.direction as never} duration={p.duration as number} rows={p.rows as number} fontSize={p.fontSize as number} tilt={p.tilt as number} separator={p.separator as string} edgeFade={p.edgeFade as boolean} pauseOnHover={p.pauseOnHover as boolean} />
      </div>
    ),
  },
  {
    id: "section-header",
    component: "SectionHeader",
    path: "@/components/ui/SectionHeader",
    name: "Cabecera de sección",
    category: "texto",
    styles: ALL_STYLES,
    description: "Sobretítulo, titular, subtítulo y regla decorativa.",
    stageHeight: 300,
    props: [
      { key: "kicker", label: "Sobretítulo", type: "text", default: "Cómo funciona" },
      { key: "title", label: "Titular", type: "text", default: "Tres pasos y estás en el agua" },
      { key: "subtitle", label: "Subtítulo", type: "text", default: "Reserva, elige tu horario y nosotros nos ocupamos del resto." },
      { key: "align", label: "Alineación", type: "select", default: "left", options: ["left", "center"] },
      { key: "rule", label: "Regla", type: "select", default: "line", options: ["none", "line", "ascii", "dots"] },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div className="ui-center">
        <SectionHeader kicker={p.kicker as string} title={p.title as string} subtitle={p.subtitle as string} align={p.align as never} rule={p.rule as never} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "divider",
    component: "Divider",
    path: "@/components/ui/Divider",
    name: "Separador",
    category: "texto",
    styles: ALL_STYLES,
    description: "Separador con etiqueta. El modo texto dibuja la regla con caracteres.",
    stageHeight: 180,
    props: [
      { key: "label", label: "Etiqueta", type: "text", default: "o continúa con" },
      { key: "mode", label: "Modo", type: "select", default: "line", options: ["line", "text"] },
      { key: "pattern", label: "Patrón (modo texto)", type: "text", default: "-=", when: (p) => p.mode === "text" },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div className="ui-center" style={{ padding: "24px 40px" }}>
        <div style={{ width: "min(100%, 460px)" }}>
          <Divider label={p.label as string} mode={p.mode as never} pattern={(p.pattern as string) || "-"} variant={p.variant as never} />
        </div>
      </div>
    ),
  },
];
