"use client";

import AsciiBackground, { ASCII_CHARSETS, ASCII_SCENES, ASCII_STYLES } from "@/components/ui/AsciiBackground";
import CrtOverlay from "@/components/ui/CrtOverlay";
import GridBackground from "@/components/ui/GridBackground";
import TerminalTyper from "@/components/ui/TerminalTyper";
import TextmodeBackground, { TEXTMODE_SKETCHES } from "@/components/ui/TextmodeBackground";
import type { CatalogEntry } from "../schema";
import { Sample } from "./shared";

const PROGRESS_SCENES = new Set(ASCII_SCENES.filter((s) => s.progress).map((s) => s.id as string));
const PALETTES = ["original", "tint", "duotone", "gradient"];

export const fondos: CatalogEntry[] = [
  {
    id: "ascii-background",
    component: "AsciiBackground",
    path: "@/components/ui/AsciiBackground",
    name: "Fondo ASCII (Studio)",
    category: "fondos",
    styles: ["terminal", "retro", "neon", "minimal"],
    description: "Escena procedural convertida en caracteres con asciify-engine. 15 estilos de render, hover, acabado óptico y paleta del tema.",
    stageHeight: 420,
    notes: [
      "Rellena el contenedor: debe tener position: relative y tamaño.",
      "palette reinterpreta los colores con --bg, --acc y --acc2: cambia el tema y el fondo cambia.",
      "Las escenas marcadas con progreso cambian con la prop progress (0–1).",
      "Cambiar props no remonta: se aplican en caliente.",
    ],
    props: [
      { key: "scene", label: "Escena", type: "select", default: "lava", options: ASCII_SCENES.map((s) => s.id) },
      { key: "asciiStyle", label: "Estilo de render", type: "select", default: "ascii", options: ASCII_STYLES },
      { key: "palette", label: "Paleta del tema", type: "select", default: "tint", options: PALETTES, hint: "tint tiñe con --acc · duotone usa --bg/--acc · gradient añade --acc2" },
      { key: "tintAmount", label: "Fuerza de la paleta", type: "number", default: 0.6, min: 0, max: 1, step: 0.05, when: (p) => p.palette !== "original" },
      { key: "cellSize", label: "Tamaño de celda", type: "number", default: 8, min: 4, max: 24, step: 1 },
      { key: "colorMode", label: "Color de los caracteres", type: "select", default: "source", options: ["source", "accent", "gray"], hint: "accent usa el token --acc" },
      { key: "charset", label: "Caracteres", type: "select", default: "detailed", options: Object.keys(ASCII_CHARSETS), when: (p) => p.asciiStyle === "ascii" },
      { key: "asciiHover", label: "Hover", type: "select", default: "water", options: ["none", "trail", "water", "contour", "dissolve", "silk", "vortex"] },
      { key: "hoverStrength", label: "Fuerza del hover", type: "number", default: 0.7, min: 0, max: 1, step: 0.05, when: (p) => p.asciiHover !== "none" },
      { key: "hoverRadius", label: "Radio del hover", type: "number", default: 0.28, min: 0.1, max: 0.6, step: 0.02, when: (p) => p.asciiHover !== "none" },
      { key: "speed", label: "Velocidad de la escena", type: "number", default: 1, min: 0.1, max: 4, step: 0.1 },
      { key: "fps", label: "Fotogramas por segundo", type: "number", default: 60, min: 10, max: 60, step: 5 },
      { key: "bloom", label: "Bloom", type: "number", default: 0.2, min: 0, max: 1, step: 0.05 },
      { key: "scanlines", label: "Scanlines", type: "number", default: 0, min: 0, max: 1, step: 0.05 },
      { key: "vignette", label: "Viñeta", type: "number", default: 0.3, min: 0, max: 1, step: 0.05 },
      { key: "grain", label: "Grano", type: "number", default: 0, min: 0, max: 1, step: 0.05 },
      { key: "glitch", label: "Glitch", type: "number", default: 0, min: 0, max: 1, step: 0.05 },
      { key: "opacity", label: "Opacidad", type: "number", default: 1, min: 0.1, max: 1, step: 0.05 },
      { key: "progress", label: "Progreso de la escena", type: "number", default: 0.3, min: 0, max: 1, step: 0.01, when: (p) => PROGRESS_SCENES.has(String(p.scene)) },
    ],
    render: (p) => (
      <>
        <AsciiBackground
          scene={p.scene as never}
          asciiStyle={p.asciiStyle as never}
          palette={p.palette as never}
          tintAmount={p.tintAmount as number}
          cellSize={p.cellSize as number}
          colorMode={p.colorMode as never}
          charset={p.charset as never}
          asciiHover={p.asciiHover as never}
          hoverStrength={p.hoverStrength as number}
          hoverRadius={p.hoverRadius as number}
          speed={p.speed as number}
          fps={p.fps as number}
          bloom={p.bloom as number}
          scanlines={p.scanlines as number}
          vignette={p.vignette as number}
          grain={p.grain as number}
          glitch={p.glitch as number}
          opacity={p.opacity as number}
          progress={PROGRESS_SCENES.has(String(p.scene)) ? (p.progress as number) : undefined}
        />
        <Sample>Contenido sobre el fondo</Sample>
      </>
    ),
  },
  {
    id: "textmode-background",
    component: "TextmodeBackground",
    path: "@/components/ui/TextmodeBackground",
    name: "Fondo generativo (textmode.js)",
    category: "fondos",
    styles: ["terminal", "neon", "retro", "minimal"],
    description: "Simulaciones por celda con textmode.js: plasma, lluvia, fuego, vida… El puntero interactúa y la paleta sigue el tema.",
    stageHeight: 420,
    notes: ["Cada celda es un carácter con su propio color.", "Cambiar sketch, tamaño o fps recrea el lienzo; la paleta y la opacidad no."],
    props: [
      { key: "sketch", label: "Sketch", type: "select", default: "plasma", options: TEXTMODE_SKETCHES.map((s) => s.id) },
      { key: "palette", label: "Paleta del tema", type: "select", default: "tint", options: PALETTES, hint: "duotone convierte el sketch en dos tonos: --bg y --acc" },
      { key: "tintAmount", label: "Fuerza de la paleta", type: "number", default: 0.6, min: 0, max: 1, step: 0.05, when: (p) => p.palette !== "original" },
      { key: "fontSize", label: "Tamaño de celda", type: "number", default: 14, min: 8, max: 28, step: 1 },
      { key: "frameRate", label: "Fotogramas por segundo", type: "number", default: 60, min: 10, max: 60, step: 5 },
      { key: "opacity", label: "Opacidad", type: "number", default: 1, min: 0.1, max: 1, step: 0.05 },
    ],
    render: (p) => (
      <>
        <TextmodeBackground sketch={p.sketch as never} fontSize={p.fontSize as number} palette={p.palette as never} tintAmount={p.tintAmount as number} frameRate={p.frameRate as number} opacity={p.opacity as number} />
        <Sample>Contenido sobre el fondo</Sample>
      </>
    ),
  },
  {
    id: "grid-background",
    component: "GridBackground",
    path: "@/components/ui/GridBackground",
    name: "Fondo de rejilla (CSS)",
    category: "fondos",
    styles: ["minimal", "outline", "retro", "terminal"],
    description: "Puntos, líneas, cruces o diagonales con CSS puro. La opción más ligera para fondos discretos.",
    stageHeight: 320,
    props: [
      { key: "kind", label: "Tipo", type: "select", default: "dots", options: ["dots", "lines", "cross", "diagonal"] },
      { key: "cellSize", label: "Tamaño de celda", type: "number", default: 28, min: 12, max: 80, step: 2 },
      { key: "opacity", label: "Opacidad", type: "number", default: 0.6, min: 0.1, max: 1, step: 0.05 },
      { key: "fade", label: "Difuminar bordes", type: "boolean", default: true },
      { key: "drift", label: "Desplazamiento lento", type: "boolean", default: false },
    ],
    render: (p) => (
      <>
        <GridBackground kind={p.kind as never} cellSize={p.cellSize as number} opacity={p.opacity as number} fade={p.fade as boolean} drift={p.drift as boolean} />
        <Sample>Sin canvas, sin JS</Sample>
      </>
    ),
  },
  {
    id: "crt-overlay",
    component: "CrtOverlay",
    path: "@/components/ui/CrtOverlay",
    name: "Efecto CRT",
    category: "fondos",
    styles: ["retro", "terminal", "neon"],
    description: "Capa de monitor antiguo: líneas de barrido, viñeta, parpadeo y barra de refresco. Se superpone a cualquier contenido.",
    stageHeight: 340,
    notes: ["Se coloca como hijo de un contenedor con position: relative.", "No bloquea el puntero."],
    props: [
      { key: "scanlines", label: "Líneas de barrido", type: "number", default: 0.3, min: 0, max: 0.8, step: 0.05 },
      { key: "vignette", label: "Viñeta", type: "number", default: 0.6, min: 0, max: 1, step: 0.05 },
      { key: "flicker", label: "Parpadeo", type: "number", default: 0.4, min: 0, max: 1, step: 0.05 },
      { key: "sweep", label: "Barra de refresco", type: "boolean", default: true },
    ],
    render: (p) => (
      <>
        <div className="ui-center">
          <div style={{ width: 460, maxWidth: "100%" }}>
            <TerminalTyper lines={"$ ./arcade --insert-coin\n[ok] fichas: 3\n[ok] jugador 1 listo\nPRESS START"} variant="retro" charsPerSecond={26} chrome={false} />
          </div>
        </div>
        <CrtOverlay scanlines={p.scanlines as number} vignette={p.vignette as number} flicker={p.flicker as number} sweep={p.sweep as boolean} />
      </>
    ),
  },
];
