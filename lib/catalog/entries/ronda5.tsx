"use client";

import FeatureExplorer from "@/components/ui/FeatureExplorer";
import GradientField, { GRADIENT_KINDS } from "@/components/ui/GradientField";
import ImageTrail from "@/components/ui/ImageTrail";
import LineDraw, { LINE_SHAPES } from "@/components/ui/LineDraw";
import ThemeScroll from "@/components/ui/ThemeScroll";
import { photo, photos } from "@/lib/sites/photos";
import type { CatalogEntry } from "../schema";
import { Sample, variantProp } from "./shared";

/** Ronda 5: sitios del año, webs de producto y estéticas nuevas (docs/13-ronda-5-esteticas.md). */
const STYLES = ["editorial", "minimal", "outline", "glass"] as CatalogEntry["styles"];

const FEATURE_ITEMS = [
  `Tabla blanda|Espuma de 8 pies para las primeras olas: flota de sobra y no hace daño si te cae encima.|${photo("naturaleza", 1).src}|Bosque junto a la playa`,
  `Neopreno a medida|Tallas de la XS a la XXL, de 4/3 mm en invierno y 3/2 en verano.|${photo("objetos", 2).src}|Objetos de la escuela sobre una mesa`,
  `Monitores titulados|Un monitor por cada seis alumnos, siempre en el agua contigo.|${photo("eventos", 1).src}|Grupo escuchando a una monitora`,
].join("\n");

export const ronda5: CatalogEntry[] = [
  {
    id: "line-draw",
    component: "LineDraw",
    path: "@/components/ui/LineDraw",
    name: "Trazo que se dibuja (firma, subrayado, círculo)",
    category: "transiciones",
    styles: STYLES,
    description:
      "Un trazo SVG que se dibuja solo al entrar en pantalla, al montar o siguiendo el scroll: firma, subrayado, círculo o flecha a mano alzada, o cualquier trazado propio (`d` + `viewBox`). La firma sobre la foto de Lando Norris. Decorativo (aria-hidden): el texto va aparte.",
    stageHeight: 320,
    replayable: true,
    notes: [
      "Cada tramo (`M…`) se dibuja después del anterior, con el tiempo repartido por su longitud real.",
      "trigger=\"scroll\" avanza entre el 90 % y el 35 % del alto de la ventana y se borra al subir.",
      "Sin JS o con movimiento reducido el trazo se ve completo.",
    ],
    props: [
      { key: "shape", label: "Trazo", type: "select", default: "signature", options: Object.keys(LINE_SHAPES), labels: { signature: "firma", underline: "subrayado", circle: "círculo", arrow: "flecha" } },
      { key: "trigger", label: "Disparador", type: "select", default: "inview", options: ["inview", "mount", "scroll"] },
      { key: "duration", label: "Duración (s)", type: "number", default: 1.6, min: 0.3, max: 5, step: 0.1 },
      { key: "strokeWidth", label: "Grosor (px)", type: "number", default: 3, min: 1, max: 12, step: 0.5 },
      { key: "tone", label: "Color", type: "select", default: "acc", options: ["acc", "acc2", "fg", "mut"] },
    ],
    render: (p, { replay }) => (
      <div style={{ width: "min(100%, 520px)", padding: 24 }}>
        <LineDraw shape={p.shape as never} trigger={p.trigger as never} duration={p.duration as number} strokeWidth={p.strokeWidth as number} tone={p.tone as never} playKey={replay} />
      </div>
    ),
  },
  {
    id: "gradient-field",
    component: "GradientField",
    path: "@/components/ui/GradientField",
    name: "Fondo de color en WebGL (manchas, cinta, haces)",
    category: "fondos",
    styles: STYLES,
    description:
      "Fondo de color animado en WebGL sin dependencias: manchas que se mezclan (mesh), la cinta iridiscente de Stripe (ribbon) o los haces de luz en diagonal de Raycast (beams). Usa los colores del tema (--bg, --acc, --acc2) y cambia con él. Media resolución, pausado fuera de pantalla; sin WebGL queda un degradado CSS.",
    stageHeight: 360,
    notes: [
      "Rellena su contenedor (position: absolute; inset: 0) o la ventana con position=\"fixed\".",
      "Con movimiento reducido o speed=0 pinta un solo fotograma.",
      "Pon el texto encima con contraste suficiente sobre la parte más clara del fondo; intensity baja el color.",
    ],
    props: [
      { key: "kind", label: "Escena", type: "select", default: "mesh", options: GRADIENT_KINDS, labels: { mesh: "manchas (mesh)", ribbon: "cinta (Stripe)", beams: "haces (Raycast)" } },
      { key: "speed", label: "Velocidad", type: "number", default: 1, min: 0, max: 3, step: 0.1 },
      { key: "intensity", label: "Intensidad", type: "number", default: 1, min: 0.1, max: 1.5, step: 0.05 },
      { key: "grain", label: "Grano", type: "boolean", default: true },
    ],
    render: (p) => (
      <>
        <GradientField kind={p.kind as never} speed={p.speed as number} intensity={p.intensity as number} grain={p.grain as boolean} />
        <Sample>Texto sobre el fondo</Sample>
      </>
    ),
  },
  {
    id: "theme-scroll",
    component: "ThemeScroll",
    path: "@/components/ui/ThemeScroll",
    name: "Tema que cambia por sección",
    category: "transiciones",
    styles: STYLES,
    description:
      "Contenedor cuyo tema cambia según la sección que cruza el centro de la ventana (oliva → hueso → negro en Lando Norris). Cada sección elige su tema con data-theme; cambian los tokens, así que todo lo de dentro (también una cabecera fija) cambia con ellos, y el fondo se funde.",
    stageHeight: 420,
    notes: [
      "Depende del scroll de la página: en el catálogo, desplaza la ventana con la ficha a media altura. Ver /sitios/volt.",
      "Cada tema es parcial (bg, fg, mut, acc, acc2, card, ln): lo que no pongas se hereda.",
      "Elige colores que se lean en todos los temas: el contenido no cambia, solo sus tokens.",
    ],
    props: [{ key: "duration", label: "Fundido (s)", type: "number", default: 0.7, min: 0, max: 2, step: 0.1 }],
    render: (p) => (
      <ThemeScroll
        duration={p.duration as number}
        themes={{ a: { bg: "#282c20", fg: "#e8eadf", mut: "#a3a893", acc: "#d2ff00" }, b: { bg: "#ecebe3", fg: "#1c1f16", mut: "#55594a", acc: "#5a7800" }, c: { bg: "#111210", fg: "#ecebe3", mut: "#9b9d92", acc: "#d2ff00" } }}
        style={{ width: "100%" }}
      >
        {["a", "b", "c"].map((t, i) => (
          <section key={t} data-theme={t} style={{ minHeight: 260, display: "grid", placeItems: "center", fontSize: 32, fontWeight: 800 }}>
            <span>
              Sección {i + 1} <span style={{ color: "var(--acc)" }}>· tema {t}</span>
            </span>
          </section>
        ))}
      </ThemeScroll>
    ),
  },
  {
    id: "image-trail",
    component: "ImageTrail",
    path: "@/components/ui/ImageTrail",
    name: "Estela de imágenes bajo el cursor",
    category: "interaccion",
    styles: STYLES,
    description:
      "Al mover el puntero por la zona van apareciendo fotos donde está, que crecen y se desvanecen: uno de los efectos más repetidos en portfolios premiados. Decorativa (las imágenes van aria-hidden); lo que cuenta va en el contenido, por encima.",
    stageHeight: 420,
    notes: ["Solo con puntero fino y sin movimiento reducido; en táctil queda el contenido.", "Recicla 10 <img>: no crea nodos al mover el ratón."],
    props: [
      { key: "imageWidth", label: "Ancho de cada foto (px)", type: "number", default: 220, min: 100, max: 400, step: 10 },
      { key: "threshold", label: "Distancia entre fotos (px)", type: "number", default: 80, min: 20, max: 240, step: 10 },
      { key: "lifetime", label: "Vida (s)", type: "number", default: 0.9, min: 0.3, max: 3, step: 0.1 },
      { key: "rotate", label: "Giro máximo (°)", type: "number", default: 8, min: 0, max: 30, step: 1 },
    ],
    render: (p) => (
      <ImageTrail images={[...photos("deporte"), ...photos("verano")].map((x) => x.src).join(",")} imageWidth={p.imageWidth as number} threshold={p.threshold as number} lifetime={p.lifetime as number} rotate={p.rotate as number} style={{ width: "100%", height: 380, display: "grid", placeItems: "center" }}>
        <p style={{ margin: 0, fontSize: 40, fontWeight: 800, textAlign: "center" }}>Mueve el ratón por aquí</p>
      </ImageTrail>
    ),
  },
  {
    id: "feature-explorer",
    component: "FeatureExplorer",
    path: "@/components/ui/FeatureExplorer",
    name: "Explorador de ventajas con imagen",
    category: "secciones",
    styles: ["editorial", "minimal", "glass", "solid", "outline"],
    description:
      "Lista de píldoras con «+» (páginas de producto de Apple): la elegida se abre en una tarjeta con su texto y cambia la imagen de al lado con un fundido. Una abierta cada vez; cada píldora es un botón con aria-expanded.",
    stageHeight: 480,
    notes: ["Una ventaja por línea: «Título|Texto|imagen|texto alternativo» (imagen: URL, ruta o gen:N).", "En móvil la imagen va encima de la lista."],
    props: [
      { key: "items", label: "Ventajas", type: "text", multiline: true, default: FEATURE_ITEMS },
      { key: "defaultIndex", label: "Abierta al empezar", type: "number", default: 0, min: 0, max: 5, step: 1 },
      { key: "mediaSide", label: "Imagen a la", type: "select", default: "right", options: ["right", "left"], labels: { right: "derecha", left: "izquierda" } },
      variantProp("editorial"),
    ],
    render: (p) => <FeatureExplorer key={p.defaultIndex as number} items={p.items as string} defaultIndex={p.defaultIndex as number} mediaSide={p.mediaSide as never} variant={p.variant as never} />,
  },
];
