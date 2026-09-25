"use client";

import { useState } from "react";
import AsciiBackground, { ASCII_CHARSETS, ASCII_SCENES, ASCII_STYLES, type AsciiBackgroundProps } from "@/components/ui/AsciiBackground";
import CrtOverlay from "@/components/ui/CrtOverlay";
import GridBackground from "@/components/ui/GridBackground";
import RetroCanvas from "@/components/ui/RetroCanvas";
import RetroShapes, { RETRO_SHAPES } from "@/components/ui/RetroShapes";
import TerminalTyper from "@/components/ui/TerminalTyper";
import TextmodeBackground, { TEXTMODE_SKETCHES } from "@/components/ui/TextmodeBackground";
import type { ResolutionInfo } from "@/lib/asciify/resolution";
import type { CatalogEntry } from "../schema";
import { Sample } from "./shared";

const fmt = (n: number) => (Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : n.toFixed(1));

/**
 * Vista previa del fondo ASCII con un indicador de la resolución real: la celda pedida frente a la que dibuja el motor, la
 * rejilla resultante y si ha tenido que agrandarla (tope de celdas del motor) o si el modo adaptativo ha bajado el presupuesto.
 */
function AsciiPreview(props: AsciiBackgroundProps) {
  const [info, setInfo] = useState<ResolutionInfo | null>(null);
  const cut = info && (info.limited || info.degraded);
  return (
    <>
      <AsciiBackground {...props} onResolution={setInfo} />
      <Sample>Contenido sobre el fondo</Sample>
      {info && (
        <div className="ui-sample" style={{ left: "auto", right: 24, top: 24, bottom: "auto", maxWidth: 300 }} role="status">
          <strong>
            Celda {fmt(info.requested)} px pedida → {fmt(info.effective)} px real
          </strong>
          <span>
            {info.columns}×{info.rows} = {(info.columns * info.rows).toLocaleString("es")} celdas · tope {info.maxCells.toLocaleString("es")}
          </span>
          {cut && (
            <span style={{ color: "var(--acc)" }}>
              {info.degraded ? "El modo adaptativo ha bajado la resolución por rendimiento." : "Limitada por el tope de celdas del motor (160 000): usa un contenedor más pequeño para celdas más finas."}
            </span>
          )}
        </div>
      )}
    </>
  );
}

const PROGRESS_SCENES = new Set(ASCII_SCENES.filter((s) => s.progress).map((s) => s.id as string));
const PALETTES = ["original", "tint", "duotone", "gradient"];

export const fondos: CatalogEntry[] = [
  {
    id: "ascii-background",
    component: "AsciiBackground",
    path: "@/components/ui/AsciiBackground",
    name: "Fondo ASCII (Studio)",
    category: "fondos",
    styles: ["terminal", "retro", "neon", "minimal", "dotmatrix"],
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
      { key: "cellSize", label: "Tamaño de celda (px)", type: "number", default: 8, min: 0.1, max: 24, step: 0.1, hint: "Admite decimales. El indicador de la vista previa muestra la celda real y si el motor la ha limitado" },
      { key: "maxCells", label: "Máximo de celdas (0 = automático)", type: "number", default: 0, min: 0, max: 160000, step: 1000, hint: "Por defecto se sube solo lo justo para la celda pedida; el motor admite hasta 160 000" },
      { key: "adaptive", label: "Resolución adaptativa", type: "boolean", default: true, hint: "Baja la resolución sola si los fotogramas tardan demasiado (se lee al montar)" },
      { key: "colorMode", label: "Color de los caracteres", type: "select", default: "source", options: ["source", "accent", "gray"], hint: "accent usa el token --acc" },
      { key: "charset", label: "Caracteres", type: "select", default: "detailed", options: Object.keys(ASCII_CHARSETS), when: (p) => p.asciiStyle === "ascii" },
      { key: "asciiHover", label: "Hover", type: "select", default: "water", options: ["none", "trail", "water", "contour", "dissolve", "silk", "vortex"] },
      { key: "hoverStrength", label: "Fuerza del hover", type: "number", default: 0.7, min: 0, max: 1, step: 0.05, when: (p) => p.asciiHover !== "none" },
      { key: "hoverRadius", label: "Radio del hover", type: "number", default: 0.28, min: 0.1, max: 0.6, step: 0.02, when: (p) => p.asciiHover !== "none" },
      { key: "interaction", label: "Puntero", type: "select", default: "canvas", options: ["canvas", "window"], labels: { canvas: "lo recibe el lienzo", window: "toda la ventana (reacciona con contenido encima)" }, hint: "Con «window» el fondo reacciona aunque el puntero esté sobre otro elemento y no bloquea clics" },
      { key: "speed", label: "Velocidad de la escena", type: "number", default: 1, min: 0.1, max: 4, step: 0.1 },
      { key: "fps", label: "Fotogramas por segundo de la escena", type: "number", default: 60, min: 1, max: 60, step: 1, hint: "Con pocos fotogramas la escena se ve «a saltos»; el hover del motor sigue fluido" },
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
        <AsciiPreview
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
          interaction={p.interaction as never}
          maxCells={(p.maxCells as number) || undefined}
          adaptive={p.adaptive as boolean}
        />
      </>
    ),
  },
  {
    id: "textmode-background",
    component: "TextmodeBackground",
    path: "@/components/ui/TextmodeBackground",
    name: "Fondo generativo (textmode.js)",
    category: "fondos",
    styles: ["terminal", "neon", "retro", "minimal", "dotmatrix"],
    description: "Simulaciones por celda con textmode.js: plasma, lluvia, fuego, vida… El puntero interactúa y la paleta sigue el tema.",
    stageHeight: 420,
    notes: ["Cada celda es un carácter con su propio color.", "Cambiar sketch, tamaño o fps recrea el lienzo; la paleta y la opacidad no."],
    props: [
      { key: "sketch", label: "Sketch", type: "select", default: "plasma", options: TEXTMODE_SKETCHES.map((s) => s.id) },
      { key: "palette", label: "Paleta del tema", type: "select", default: "tint", options: PALETTES, hint: "duotone convierte el sketch en dos tonos: --bg y --acc" },
      { key: "tintAmount", label: "Fuerza de la paleta", type: "number", default: 0.6, min: 0, max: 1, step: 0.05, when: (p) => p.palette !== "original" },
      { key: "fontSize", label: "Tamaño de celda (px)", type: "number", default: 14, min: 1, max: 28, step: 0.1, hint: "Admite decimales. Con celdas muy finas se agranda sola si la rejilla pasa del máximo de celdas" },
      { key: "maxCells", label: "Máximo de celdas", type: "number", default: 250000, min: 20000, max: 1000000, step: 10000, hint: "Protege de rejillas que congelarían la página; sube el valor si tu equipo lo aguanta" },
      { key: "interaction", label: "Puntero", type: "select", default: "canvas", options: ["canvas", "window"], labels: { canvas: "lo recibe el lienzo", window: "toda la ventana (reacciona con contenido encima)" }, hint: "Con «window» el fondo reacciona aunque el puntero esté sobre otro elemento y no bloquea clics" },
      { key: "frameRate", label: "Fotogramas por segundo", type: "number", default: 60, min: 1, max: 60, step: 1, hint: "Cambiarlo recrea el lienzo" },
      { key: "opacity", label: "Opacidad", type: "number", default: 1, min: 0.1, max: 1, step: 0.05 },
    ],
    render: (p) => (
      <>
        <TextmodeBackground sketch={p.sketch as never} fontSize={p.fontSize as number} palette={p.palette as never} tintAmount={p.tintAmount as number} maxCells={p.maxCells as number} frameRate={p.frameRate as number} opacity={p.opacity as number} interaction={p.interaction as never} />
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
    styles: ["minimal", "outline", "retro", "terminal", "dotmatrix"],
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
    styles: ["retro", "terminal", "neon", "dotmatrix"],
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
  {
    id: "retro-canvas",
    component: "RetroCanvas",
    path: "@/components/ui/RetroCanvas",
    name: "Escena 3D retro",
    category: "fondos",
    styles: ["retro", "terminal", "neon", "minimal", "dotmatrix"],
    description: "Lienzo react-three-fiber con filtro de pixel art, ASCII y scanlines: cualquier escena 3D se ve como caracteres o píxeles con acabado de monitor CRT.",
    stageHeight: 420,
    notes: [
      "Requiere `three` y `@react-three/fiber` (dependencias opcionales de trama-ui). Importa `trama-ui/RetroCanvas`, no el barrel.",
      "Los hijos son la escena R3F (luces + mallas); sin hijos se muestra `RetroShapes`. Para un `<Canvas>` propio, `RetroFX` es solo el post-proceso.",
      "Rellena su contenedor (position: relative y tamaño). Pausa fuera de pantalla; con prefers-reduced-motion dibuja bajo demanda.",
      "Los colores salen de los tokens --fg, --bg y --acc; `fg`, `bg` y `accent` los sustituyen.",
    ],
    props: [
      { key: "shape", label: "Forma (RetroShapes)", type: "select", default: "chevrons", options: RETRO_SHAPES, noCode: true },
      { key: "mode", label: "Modo", type: "select", default: "ascii", options: ["ascii", "pixel", "both"] },
      { key: "tint", label: "Tinte", type: "select", default: "mono", options: ["mono", "scene", "gradient"] },
      { key: "ramp", label: "Rampa de glifos", type: "select", default: "dots", options: ["classic", "dots", "braille", "blocks", "binary", "hex", "code", "hatch", "circuit"], when: (p) => p.mode !== "pixel" },
      { key: "cellSize", label: "Celda ASCII (px)", type: "number", default: 7, min: 3, max: 20, step: 1, when: (p) => p.mode !== "pixel" },
      { key: "cellAspect", label: "Alto/ancho de celda", type: "number", default: 1.4, min: 1, max: 2.4, step: 0.1, when: (p) => p.mode !== "pixel" },
      { key: "pixelSize", label: "Píxel (px)", type: "number", default: 4, min: 1, max: 16, step: 1, when: (p) => p.mode !== "ascii" },
      { key: "levels", label: "Niveles de paleta", type: "number", default: 4, min: 2, max: 12, step: 1, when: (p) => p.mode !== "ascii" },
      { key: "dither", label: "Dither", type: "number", default: 0.6, min: 0, max: 1, step: 0.05 },
      { key: "ditherPattern", label: "Patrón de dither", type: "select", default: "bayer", options: ["bayer", "hatch", "halftone", "noise"] },
      { key: "contrast", label: "Contraste", type: "number", default: 1.25, min: 0.5, max: 2.5, step: 0.05 },
      { key: "invert", label: "Invertir", type: "boolean", default: false },
      { key: "scanlines", label: "Scanlines", type: "number", default: 0.35, min: 0, max: 1, step: 0.05 },
      { key: "scanlineSize", label: "Paso de scanline (px)", type: "number", default: 3, min: 1, max: 8, step: 0.5 },
      { key: "scanlineRoll", label: "Barrido brillante", type: "number", default: 0, min: 0, max: 1, step: 0.05 },
      { key: "vignette", label: "Viñeta", type: "number", default: 0.45, min: 0, max: 1, step: 0.05 },
      { key: "curvature", label: "Curvatura CRT", type: "number", default: 0, min: 0, max: 1, step: 0.05 },
      { key: "noise", label: "Ruido", type: "number", default: 0, min: 0, max: 0.3, step: 0.01 },
      { key: "flicker", label: "Parpadeo", type: "number", default: 0.04, min: 0, max: 0.3, step: 0.01 },
      { key: "glow", label: "Glow de fósforo", type: "number", default: 0, min: 0, max: 1, step: 0.05, when: (p) => p.mode !== "pixel" },
      { key: "rain", label: "Lluvia de código", type: "number", default: 0, min: 0, max: 1, step: 0.05, when: (p) => p.mode !== "pixel" },
      { key: "glitch", label: "Glitch", type: "number", default: 0, min: 0, max: 1, step: 0.05 },
      { key: "aberration", label: "Aberración cromática", type: "number", default: 0, min: 0, max: 1, step: 0.05 },
    ],
    render: (p) => (
      <RetroCanvas
        mode={p.mode as never}
        tint={p.tint as never}
        ramp={p.ramp as never}
        cellSize={p.cellSize as number}
        cellAspect={p.cellAspect as number}
        pixelSize={p.pixelSize as number}
        levels={p.levels as number}
        dither={p.dither as number}
        ditherPattern={p.ditherPattern as never}
        contrast={p.contrast as number}
        invert={p.invert as boolean}
        scanlines={p.scanlines as number}
        scanlineSize={p.scanlineSize as number}
        scanlineRoll={p.scanlineRoll as number}
        vignette={p.vignette as number}
        curvature={p.curvature as number}
        noise={p.noise as number}
        flicker={p.flicker as number}
        glow={p.glow as number}
        rain={p.rain as number}
        glitch={p.glitch as number}
        aberration={p.aberration as number}
        label="Escena 3D con filtro retro"
      >
        <RetroShapes shape={p.shape as never} />
      </RetroCanvas>
    ),
  },
];
