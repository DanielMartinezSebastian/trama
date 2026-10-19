"use client";

import BlueprintFrame from "@/components/ui/BlueprintFrame";
import CellGrid from "@/components/ui/CellGrid";
import CircleButton from "@/components/ui/CircleButton";
import CrossfadeHero from "@/components/ui/CrossfadeHero";
import EdgeTab from "@/components/ui/EdgeTab";
import ExpandingPanels from "@/components/ui/ExpandingPanels";
import IslandNav from "@/components/ui/IslandNav";
import MetaTable from "@/components/ui/MetaTable";
import ScatterText from "@/components/ui/ScatterText";
import { moodArt } from "@/lib/sites/art";
import type { CatalogEntry } from "../schema";

/** Fórmulas de webs premiadas (docs/07-formulas-webs-top.md). */
const IMGS = [moodArt(1, "#1c2340", "#c9552b", "#f0c98a"), moodArt(2, "#14312f", "#b9803a", "#e9d9b0"), moodArt(3, "#3a1d2b", "#d77a5b", "#f3d6c0")];
const STYLES = ["editorial", "minimal", "outline"] as CatalogEntry["styles"];
// un elemento `position: fixed` dentro de un ancestro con transform se queda dentro de él: así cabe en el escenario del catálogo
const Boxed = ({ h, children }: { h: number; children: React.ReactNode }) => (
  <div style={{ position: "relative", width: "100%", height: h, transform: "translateZ(0)", overflow: "hidden", border: "1px dashed var(--ln)" }}>{children}</div>
);

export const formulas: CatalogEntry[] = [
  {
    id: "blueprint-frame",
    component: "BlueprintFrame",
    path: "@/components/ui/BlueprintFrame",
    name: "Marco de plano técnico",
    category: "tarjetas",
    styles: STYLES,
    description: "Borde de línea fina con regla de marcas milimétricas y cruces «+» de registro en las esquinas: la piel de las webs de producto técnico (fórmula Heron AI). Decorativo, sin JS.",
    stageHeight: 300,
    props: [
      { key: "ticks", label: "Regla de marcas", type: "boolean", default: true },
      { key: "marks", label: "Cruces de esquina", type: "boolean", default: true },
      { key: "inset", label: "Separación (px)", type: "number", default: 6, min: 0, max: 40, step: 2 },
      { key: "padding", label: "Relleno (px)", type: "number", default: 32, min: 0, max: 80, step: 4 },
    ],
    children: "<h2>Contenido del plano</h2>",
    render: (p) => (
      <div style={{ width: "100%", padding: 12 }}>
        <BlueprintFrame ticks={p.ticks as boolean} marks={p.marks as boolean} inset={p.inset as number} padding={p.padding as number}>
          <p className="ui-hint" style={{ margin: 0 }}>Contenido dentro de un plano</p>
        </BlueprintFrame>
      </div>
    ),
  },
  {
    id: "cell-grid",
    component: "CellGrid",
    path: "@/components/ui/CellGrid",
    name: "Rejilla de celdas con divisores",
    category: "tarjetas",
    styles: STYLES,
    description: "Celdas separadas por divisores de línea fina, continuos o discontinuos, sin tarjetas ni sombras. Los divisores se dibujan con el hueco de la rejilla: sin dobles bordes con cualquier número de celdas.",
    stageHeight: 260,
    props: [
      { key: "columns", label: "Columnas", type: "select", default: "4", options: ["1", "2", "3", "4", "5"] },
      { key: "line", label: "Divisor", type: "select", default: "solid", options: ["solid", "dashed"], labels: { solid: "continuo", dashed: "discontinuo" } },
      { key: "padding", label: "Relleno (px)", type: "number", default: 24, min: 8, max: 60, step: 2 },
    ],
    children: "<div>Celda 1</div>\n<div>Celda 2</div>",
    render: (p) => (
      <div style={{ width: "100%", padding: 12 }}>
        <CellGrid columns={Number(p.columns) as never} line={p.line as never} padding={p.padding as number}>
          {["Normativa", "Colisiones", "Cotas", "Informe"].map((t) => <b key={t}>{t}</b>)}
        </CellGrid>
      </div>
    ),
  },
  {
    id: "island-nav",
    component: "IslandNav",
    path: "@/components/ui/IslandNav",
    name: "Navegación «isla»",
    category: "navegacion",
    styles: STYLES,
    description: "Píldora flotante centrada arriba, con vidrio esmerilado, que agrupa menú, marca y acción (fórmula Belgrade Arbor). Deja pasar los clics fuera de la píldora. Con un FullscreenMenu en `leading`, el menú se abre debajo de la isla.",
    stageHeight: 200,
    notes: ["Es position: fixed; aquí va contenida en el recuadro de puntos. En una web real cuelga de la ventana."],
    props: [{ key: "hideOnScroll", label: "Esconder al bajar", type: "boolean", default: false }],
    render: (p) => (
      <Boxed h={140}>
        <IslandNav hideOnScroll={p.hideOnScroll as boolean} leading={<button type="button" className="ui-fsm__btn">[menu]</button>} brand={<span>◐ Arbor</span>} trailing={<a href="#">Consultar →</a>} />
      </Boxed>
    ),
  },
  {
    id: "crossfade-hero",
    component: "CrossfadeHero",
    path: "@/components/ui/CrossfadeHero",
    name: "Hero con fundido de fotografías",
    category: "secciones",
    styles: STYLES,
    description: "Hero a sangre con fotografías que se funden, titular centrado y botón-píldora (fórmula OFFFForum). Accesible: botón de pausa visible (WCAG 2.2.2), se detiene al pasar el puntero o enfocar, con la pestaña oculta y con movimiento reducido.",
    stageHeight: 420,
    props: [
      { key: "kicker", label: "Línea superior", type: "text", default: "Montreal · septiembre 2027" },
      { key: "title", label: "Titular", type: "text", default: "Una semana de diseño, arte y cultura digital" },
      { key: "interval", label: "Segundos entre imágenes", type: "number", default: 5, min: 2, max: 12, step: 1 },
      { key: "shade", label: "Velo (0–1)", type: "number", default: 0.38, min: 0, max: 0.9, step: 0.05 },
      { key: "drift", label: "Zoom lento", type: "boolean", default: true },
    ],
    render: (p) => (
      <div style={{ width: "100%" }}>
        <CrossfadeHero slides={IMGS.map((src) => ({ src, alt: "" }))} kicker={p.kicker as string} title={p.title as string} cta={{ label: "Consigue tu entrada", href: "#" }} interval={p.interval as number} shade={p.shade as number} drift={p.drift as boolean} height="400px" />
      </div>
    ),
  },
  {
    id: "expanding-panels",
    component: "ExpandingPanels",
    path: "@/components/ui/ExpandingPanels",
    name: "Paneles que se expanden",
    category: "galerias",
    styles: STYLES,
    description: "Columnas verticales que se reparten el ancho; al pasar el puntero o enfocar con teclado una se expande y las demás se estrechan (fórmula LPAS). Cada panel es un enlace real; en estrechas se apilan en filas.",
    stageHeight: 380,
    props: [
      { key: "height", label: "Alto (CSS)", type: "text", default: "320px" },
      { key: "grow", label: "Crecimiento del activo", type: "number", default: 4, min: 1.5, max: 8, step: 0.5 },
    ],
    render: (p) => (
      <div style={{ width: "100%", padding: 12 }}>
        <ExpandingPanels height={p.height as string} grow={p.grow as number} panels={[{ title: "Residencias", meta: "186 viviendas", image: IMGS[0], href: "#" }, { title: "Oficinas", meta: "6.400 m²", image: IMGS[1], href: "#" }, { title: "Jardines", meta: "19.000 m²", image: IMGS[2], href: "#" }, { title: "Comercio", meta: "2.100 m²", image: IMGS[0], href: "#" }]} />
      </div>
    ),
  },
  {
    id: "scatter-text",
    component: "ScatterText",
    path: "@/components/ui/ScatterText",
    name: "Texto que se dispersa con el scroll",
    category: "texto",
    styles: STYLES,
    description: "Letras que se separan y se desvanecen al hacer scroll: la marca gigante de un hero que se disuelve (fórmula Belgrade Arbor). `scope` toma el progreso de la sección contenedora cuando el titular está en un contenedor sticky.",
    stageHeight: 300,
    notes: ["Depende del scroll de la página; con prefers-reduced-motion se ve entero y quieto."],
    props: [
      { key: "text", label: "Texto", type: "text", default: "ARBOR" },
      { key: "mode", label: "Modo", type: "select", default: "exit", options: ["exit", "enter"], labels: { exit: "se dispersa al salir", enter: "se compone al entrar" } },
      { key: "spread", label: "Separación (px)", type: "number", default: 220, min: 40, max: 600, step: 10 },
      { key: "lift", label: "Elevación (px)", type: "number", default: 40, min: 0, max: 200, step: 5 },
    ],
    render: (p) => (
      <div style={{ padding: 24, fontSize: "clamp(56px, 12vw, 140px)", lineHeight: 0.9, fontWeight: 400 }}>
        <ScatterText mode={p.mode as never} spread={p.spread as number} lift={p.lift as number}>{(p.text as string) || " "}</ScatterText>
      </div>
    ),
  },
  {
    id: "edge-tab",
    component: "EdgeTab",
    path: "@/components/ui/EdgeTab",
    name: "Pestaña de borde",
    category: "navegacion",
    styles: STYLES,
    description: "Pestaña fija pegada al borde de la ventana con el texto en vertical: una llamada a la acción siempre a mano que no ocupa la cabecera. Enlace o botón real con foco visible.",
    stageHeight: 220,
    notes: ["Es position: fixed; aquí va contenida en el recuadro de puntos."],
    props: [
      { key: "label", label: "Texto", type: "text", default: "Agenda tu visita" },
      { key: "side", label: "Lado", type: "select", default: "right", options: ["right", "left"] },
      { key: "mark", label: "Marca", type: "text", default: "A." },
      { key: "top", label: "Posición vertical", type: "text", default: "50%" },
    ],
    render: (p) => (
      <Boxed h={180}>
        <EdgeTab label={(p.label as string) || "Reservar"} href="#" side={p.side as never} mark={p.mark as string} top={p.top as string} />
      </Boxed>
    ),
  },
  {
    id: "meta-table",
    component: "MetaTable",
    path: "@/components/ui/MetaTable",
    name: "Ficha de datos (clave-valor)",
    category: "datos",
    styles: STYLES,
    description: "Datos clave-valor en una caja de línea fina (fechas, lugar, superficie, plazo). Es una lista de definiciones (<dl>): los lectores de pantalla leen cada pareja. Sin JS.",
    stageHeight: 260,
    props: [
      { key: "columns", label: "Columnas", type: "select", default: "1", options: ["1", "2"] },
      { key: "mono", label: "Claves en mono", type: "boolean", default: true },
    ],
    render: (p) => (
      <div style={{ width: "min(100%, 560px)", padding: 16 }}>
        <MetaTable columns={Number(p.columns) as 1 | 2} mono={p.mono as boolean} rows={[{ k: "Foro", v: "15 de septiembre" }, { k: "Festival", v: "16 y 17 de septiembre" }, { k: "Lugar", v: "Sala de las Artes, Montreal" }, { k: "Entradas", v: "Desde 45 €" }]} />
      </div>
    ),
  },
  {
    id: "circle-button",
    component: "CircleButton",
    path: "@/components/ui/CircleButton",
    name: "Botón circular (también dentro de un titular)",
    category: "interaccion",
    styles: STYLES,
    description: "Botón de icono circular. Con inline mide lo mismo que la letra y se coloca dentro de un titular («…interior design studio ⊙»). Enlace o botón real, con foco visible y nombre accesible.",
    stageHeight: 200,
    props: [
      { key: "label", label: "Nombre accesible", type: "text", default: "Ver más" },
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["sm", "md", "lg"] },
      { key: "inline", label: "Dentro de un titular", type: "boolean", default: false },
      { key: "look", label: "Aspecto", type: "select", default: "outline", options: ["outline", "solid"] },
    ],
    render: (p) => (
      <div className="ui-center" style={{ fontSize: p.inline ? 44 : 18, fontWeight: 600 }}>
        {p.inline ? <span>Un estudio de diseño <CircleButton label={p.label as string} inline look={p.look as never} href="#">→</CircleButton></span> : <CircleButton label={p.label as string} size={p.size as never} look={p.look as never} href="#">→</CircleButton>}
      </div>
    ),
  },
];
