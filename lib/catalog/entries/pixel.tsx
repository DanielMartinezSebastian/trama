"use client";

import Icon from "@/components/ui/Icon";
import PixelFrame, { PIXEL_FRAME_SKINS } from "@/components/ui/PixelFrame";
import Sprite, { SPRITE_SHEET } from "@/components/ui/Sprite";
import type { Tone } from "@/components/ui/variants";
import { ICON_GROUPS, ICON_NAMES, type IconName } from "@/lib/ui/icons";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, toneProp } from "./shared";

const PIXEL_STYLES = ["retro", "terminal", "minimal", "dotmatrix"] as const;
const FRAME_COLORS = Array.from(new Set(Object.values(PIXEL_FRAME_SKINS).flatMap((s) => Object.keys(s.fills))));

/** El icono elegido en grande y, debajo, el set curado entero por grupos: el propio catálogo hace de navegador de iconos. */
function IconGallery({ name, size, sharp, tone }: { name: IconName; size: number; sharp: boolean; tone: Tone }) {
  return (
    <div className="ui-icongal">
      <div className="ui-icongal__hero">
        <Icon name={name} iconSize={size} sharp={sharp} tone={tone} label={name} />
        <code>{`<Icon name="${name}" />`}</code>
      </div>
      {ICON_GROUPS.map((g) => (
        <section key={g.label}>
          <h4>
            {g.label} · {g.names.length}
          </h4>
          <div className="ui-icongal__grid">
            {g.names.map((n) => (
              <div key={n} className="ui-icongal__cell" data-on={n === name}>
                <Icon name={n} iconSize={24} sharp={sharp} />
                <span>{n}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** La hoja de Kenney entera a escala 1 con la baldosa elegida enmarcada: así se ven las coordenadas col/fila. */
function SpriteSheet({ col, row }: { col: number; row: number }) {
  const { src, width, height, tile, gap } = SPRITE_SHEET;
  const step = tile + gap;
  return (
    <div className="ui-sheet" style={{ width, height, backgroundImage: `url(${src})` }}>
      <span className="ui-sheet__mark" style={{ left: col * step - 1, top: row * step - 1, width: tile + 2, height: tile + 2 }} />
    </div>
  );
}

export const pixel: CatalogEntry[] = [
  {
    id: "icon",
    component: "Icon",
    path: "@/components/ui/Icon",
    name: "Icono pixel art",
    category: "pixel",
    styles: ALL_STYLES,
    description: "Icono SVG de Pixelarticons sobre rejilla de 24 px. Se tiñe con un token del tema o con el color del texto que lo rodea.",
    stageHeight: 520,
    props: [
      { key: "name", label: "Icono", type: "select", default: "heart", options: ICON_NAMES, hint: `${ICON_NAMES.length} del set curado; el resto de Pixelarticons entra con la prop icon` },
      { key: "iconSize", label: "Tamaño (px)", type: "number", default: 48, min: 16, max: 120, step: 4, hint: "Los múltiplos de 24 dan píxeles del mismo tamaño; otros valores mantienen bordes nítidos pero desiguales" },
      { key: "sharp", label: "Esquinas duras", type: "boolean", default: false, hint: "Solo la mitad de los iconos tiene versión sharp; el resto se queda como está" },
      toneProp("acc"),
    ],
    notes: [
      "Sin `tone` el icono hereda el color del texto (`currentColor`): dentro de un Button o un Badge toma el color de ese componente.",
      "Sin `label` es decorativo (aria-hidden); con `label` se anuncia como imagen.",
      "Para un icono fuera del set: `import { Zap } from \"pixelarticons/react/Zap\"` y `<Icon icon={Zap} />` (también valen las variantes …Solid y …Glyph).",
      "Iconos de Pixelarticons, licencia MIT (© Gerrit Halfmann).",
    ],
    render: (p) => (
      <div className="ui-center ui-center--top ui-center--cols">
        <IconGallery name={p.name as IconName} size={Number(p.iconSize)} sharp={p.sharp as boolean} tone={p.tone as Tone} />
      </div>
    ),
  },
  {
    id: "pixel-frame",
    component: "PixelFrame",
    path: "@/components/ui/PixelFrame",
    name: "Marco pixel art",
    category: "pixel",
    styles: [...PIXEL_STYLES],
    description: "Panel de 9 cortes (border-image) con las piezas de Kenney «Pixel UI». Trae fondo propio y una paleta de tinta local: se lee igual sobre cualquier tema.",
    stageHeight: 340,
    props: [
      { key: "skin", label: "Piel", type: "select", default: "colored", options: Object.keys(PIXEL_FRAME_SKINS) },
      { key: "color", label: "Color", type: "select", default: "blue", options: FRAME_COLORS, hint: "colored: blue green grey red yellow · outline: blue green red yellow · ancient: brown grey tan white. Si la piel no lo trae, usa el primero" },
      { key: "pressed", label: "Hundido", type: "boolean", default: false },
      { key: "scale", label: "Escala", type: "select", default: "2", options: ["1", "2", "3", "4"], hint: "Píxeles CSS por píxel del sprite; el marco ocupa 16 × escala px por lado" },
      { key: "title", label: "Título", type: "text", default: "Sala del archivo" },
      { key: "text", label: "Texto", type: "text", default: "Cada marco trae su propio fondo: el texto no depende de lo que haya detrás.", multiline: true },
    ],
    notes: [
      "El marco sustituye la paleta del kit por una de tinta sobre papel (fondo, texto y acentos): los componentes de dentro se leen sobre el marco, no sobre la página. La variante neon no es legible ahí dentro; usa solid, outline, minimal, glass o retro.",
      "Piezas de Kenney «Pixel UI» (CC0, sin atribución obligatoria): public/pixel/kenney-pixel-ui/. Las versiones «inlay» del pack (44 px) no se usan.",
    ],
    render: (p) => (
      <div className="ui-center">
        <PixelFrame skin={p.skin as never} color={p.color as string} pressed={p.pressed as boolean} scale={Number(p.scale) as 1 | 2 | 3 | 4}>
          <strong style={{ display: "block", fontSize: 18, marginBottom: 6 }}>{p.title as string}</strong>
          <span style={{ fontSize: 14, lineHeight: 1.5 }}>{p.text as string}</span>
        </PixelFrame>
      </div>
    ),
  },
  {
    id: "sprite",
    component: "Sprite",
    path: "@/components/ui/Sprite",
    name: "Sprite pixel art",
    category: "pixel",
    styles: [...PIXEL_STYLES],
    description: "Una baldosa 16×16 de la hoja de Kenney «Pixel UI»: flechas, casillas, punteros. Píxeles ya coloreados, no se tiñen con el tema.",
    stageHeight: 700,
    props: [
      { key: "col", label: "Columna", type: "number", default: 16, min: 0, max: SPRITE_SHEET.cols - 1, step: 1 },
      { key: "row", label: "Fila", type: "number", default: 23, min: 0, max: SPRITE_SHEET.rows - 1, step: 1 },
      { key: "scale", label: "Escala", type: "number", default: 6, min: 1, max: 12, step: 1, hint: "Con enteros cada píxel del sprite son exactamente N píxeles CSS" },
    ],
    notes: [
      "La hoja tiene 30 columnas × 33 filas de baldosas de 16 px con 2 px de margen; la que eliges sale enmarcada abajo. Las baldosas vacías simplemente no dibujan nada.",
      "Piezas de Kenney «Pixel UI» (CC0): public/pixel/kenney-pixel-ui/spritesheet/sheet.png.",
    ],
    render: (p) => (
      <div className="ui-center ui-center--top">
        <Sprite col={Number(p.col)} row={Number(p.row)} scale={Number(p.scale)} label={`sprite ${p.col}, ${p.row}`} />
        <SpriteSheet col={Number(p.col)} row={Number(p.row)} />
      </div>
    ),
  },
];
