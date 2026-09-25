"use client";

import Article from "@/components/ui/Article";
import ArticleHeader from "@/components/ui/ArticleHeader";
import Callout from "@/components/ui/Callout";
import Prose, { DEMO_MARKDOWN } from "@/components/ui/Prose";
import TableOfContents from "@/components/ui/TableOfContents";
import { INTENTS } from "@/components/ui/intent";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, INTENT_LABELS, toneProp, variantProp } from "./shared";

/** Las vistas previas de texto largo van en una caja con scroll propio: el índice y la barra de lectura la siguen a ella. */
const Scroller = ({ children, pad = 32 }: { children: React.ReactNode; pad?: number }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "auto", padding: pad }}>{children}</div>
);

export const contenido: CatalogEntry[] = [
  {
    id: "prose",
    component: "Prose",
    path: "@/components/ui/Prose",
    name: "Texto con formato (Prose)",
    category: "contenido",
    styles: ALL_STYLES,
    description:
      "La tipografía de un artículo o una página de documentación: títulos con ancla, párrafos, listas anidadas y de tareas, citas con firma, avisos, código, tablas, imágenes con pie, resaltado y teclas. Desde Markdown o desde tu propio HTML/MDX.",
    stageHeight: 560,
    notes: [
      "Markdown → elementos React, sin HTML crudo: un texto de un CMS o de un usuario no puede inyectar marcado, y los enlaces solo admiten http(s), mailto, rutas y anclas.",
      "Avisos al estilo GitHub: `> [!NOTE] Título`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`. Código: ```lenguaje archivo. Imágenes: `![alt](url \"pie\")`, con `gen:N` para las de ejemplo.",
      "Con children en lugar de markdown, cualquier HTML o MDX recibe la misma tipografía.",
      "Los títulos llevan id (los mismos que calcula TableOfContents con el mismo Markdown).",
    ],
    props: [
      { key: "markdown", label: "Markdown", type: "text", multiline: true, default: DEMO_MARKDOWN },
      { key: "size", label: "Tamaño del texto", type: "select", default: "md", options: ["sm", "md", "lg"] },
      { key: "measure", label: "Ancho de línea", type: "select", default: "normal", options: ["narrow", "normal", "wide", "full"], labels: { narrow: "estrecho (~60 caracteres)", normal: "normal (~70)", wide: "ancho (~84)", full: "todo el contenedor" } },
      { key: "dropCap", label: "Letra capital", type: "boolean", default: false },
      { key: "anchors", label: "Anclas en los títulos", type: "boolean", default: true },
      toneProp("acc", ["acc", "acc2", "fg"]),
      { key: "codeVariant", label: "Variante del código", type: "select", default: "terminal", options: ["glass", "solid", "outline", "neon", "retro", "terminal", "minimal", "dotmatrix"] },
      variantProp("minimal"),
    ],
    render: (p) => (
      <Scroller>
        <Prose
          markdown={p.markdown as string}
          size={p.size as never}
          measure={p.measure as never}
          dropCap={p.dropCap as boolean}
          anchors={p.anchors as boolean}
          tone={p.tone as never}
          codeVariant={p.codeVariant as never}
          variant={p.variant as never}
          className="pg-center-x"
        />
      </Scroller>
    ),
  },
  {
    id: "callout",
    component: "Callout",
    path: "@/components/ui/Callout",
    name: "Aviso de documentación",
    category: "contenido",
    styles: ALL_STYLES,
    description: "Nota, consejo, importante, cuidado o peligro dentro de un texto largo. Es contenido (lleva párrafos y no se descarta), no un estado de la interfaz como Alert. Puede plegarse.",
    stageHeight: 260,
    notes: ["En Prose se escribe `> [!NOTE] Título` (o TIP, IMPORTANT, WARNING, CAUTION) seguido de las líneas del aviso.", "El texto admite Markdown de línea; una línea en blanco separa párrafos. Con children se pinta lo que pases."],
    props: [
      { key: "intent", label: "Tipo", type: "select", default: "info", options: INTENTS, labels: INTENT_LABELS },
      { key: "title", label: "Título", type: "text", default: "Antes de entrar al agua" },
      { key: "text", label: "Texto", type: "text", multiline: true, default: "Revisa el **parte de olas** del día y avisa al monitor si es tu primera clase. Tienes la tabla de mareas en [Reservas](#reservas)." },
      { key: "kind", label: "Aspecto", type: "select", default: "bar", options: ["bar", "soft", "outline"], labels: { bar: "barra lateral", soft: "fondo teñido", outline: "solo borde" } },
      { key: "icon", label: "Icono (vacío = el del tipo)", type: "text", default: "" },
      { key: "collapsible", label: "Plegable", type: "boolean", default: false },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div className="ui-center">
        <div style={{ width: "min(100%, 620px)" }}>
          <Callout intent={p.intent as never} title={p.title as string} text={p.text as string} kind={p.kind as never} icon={p.icon as string} collapsible={p.collapsible as boolean} variant={p.variant as never} />
        </div>
      </div>
    ),
  },
  {
    id: "table-of-contents",
    component: "TableOfContents",
    path: "@/components/ui/TableOfContents",
    name: "Índice de la página",
    category: "contenido",
    styles: ALL_STYLES,
    description: "«En esta página»: las secciones de un texto largo, con la que se está leyendo marcada. Sale del mismo Markdown que Prose, de los títulos de un contenedor de la página o de una lista a mano.",
    stageHeight: 520,
    notes: ["markdown = mismos ids que Prose con ese texto · target = selector de un contenedor ya pintado (lee sus h2/h3 con id) · items = a mano, `## Título` por línea.", "En la vista previa, desplaza el texto: el índice marca la sección visible."],
    props: [
      { key: "title", label: "Título", type: "text", default: "En esta página" },
      { key: "kind", label: "Estilo", type: "select", default: "rail", options: ["rail", "list", "numbered"], labels: { rail: "carril lateral", list: "lista", numbered: "numerado" } },
      { key: "depth", label: "Profundidad", type: "select", default: "3", options: ["2", "3"], labels: { "2": "solo secciones", "3": "secciones y subsecciones" } },
      variantProp("minimal"),
    ],
    render: (p) => (
      <Scroller>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(180px, 220px) minmax(0, 1fr)", gap: 40, alignItems: "start" }}>
          <TableOfContents markdown={DEMO_MARKDOWN} title={p.title as string} kind={p.kind as never} depth={Number(p.depth) as 2 | 3} sticky variant={p.variant as never} />
          <Prose markdown={DEMO_MARKDOWN} size="sm" variant={p.variant as never} />
        </div>
      </Scroller>
    ),
  },
  {
    id: "article-header",
    component: "ArticleHeader",
    path: "@/components/ui/ArticleHeader",
    name: "Cabecera de artículo",
    category: "contenido",
    styles: ALL_STYLES,
    description: "Categoría, título, entradilla, autor con cargo, fecha, tiempo de lectura, etiquetas y portada de una entrada de blog o una página de documentación.",
    stageHeight: 560,
    props: [
      { key: "kicker", label: "Categoría", type: "text", default: "Guías" },
      { key: "title", label: "Título", type: "text", default: "Tu primera clase de surf" },
      { key: "subtitle", label: "Entradilla", type: "text", default: "Qué traer, cómo es la clase y qué hacer si algo sale mal. Todo en cinco minutos." },
      { key: "author", label: "Autor", type: "text", default: "Lucía Ferrán" },
      { key: "authorRole", label: "Cargo", type: "text", default: "Monitora jefe" },
      { key: "date", label: "Fecha", type: "text", default: "12 sep 2026" },
      { key: "readTime", label: "Tiempo de lectura", type: "text", default: "5 min" },
      { key: "tags", label: "Etiquetas (comas)", type: "text", default: "Iniciación, Seguridad, Material" },
      { key: "cover", label: "Portada (URL o gen:N)", type: "text", default: "gen:1" },
      { key: "align", label: "Alineación", type: "select", default: "left", options: ["left", "center"] },
      variantProp("minimal"),
    ],
    render: (p) => (
      <Scroller>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <ArticleHeader
            kicker={p.kicker as string}
            title={p.title as string}
            subtitle={p.subtitle as string}
            author={p.author as string}
            authorRole={p.authorRole as string}
            date={p.date as string}
            readTime={p.readTime as string}
            tags={p.tags as string}
            cover={p.cover as string}
            align={p.align as never}
            variant={p.variant as never}
          />
        </div>
      </Scroller>
    ),
  },
  {
    id: "article",
    component: "Article",
    path: "@/components/ui/Article",
    name: "Artículo completo",
    category: "contenido",
    styles: ALL_STYLES,
    description: "La sección lista para un blog o una documentación: cabecera, índice lateral que sigue la lectura, cuerpo en Markdown con formato y barra de progreso de lectura opcional. En contenedores estrechos el índice sube sobre el texto.",
    stageHeight: 640,
    notes: [
      "Un «# Título» al principio del Markdown se quita: el título ya lo pone la cabecera.",
      "readTime=\"auto\" calcula los minutos del propio texto.",
      "progress pinta una barra fija arriba de la ventana: en la vista previa la sigue la página, no la caja.",
    ],
    props: [
      { key: "title", label: "Título", type: "text", default: "Tu primera clase de surf" },
      { key: "kicker", label: "Categoría", type: "text", default: "Guías" },
      { key: "markdown", label: "Cuerpo (Markdown)", type: "text", multiline: true, default: DEMO_MARKDOWN },
      { key: "toc", label: "Índice", type: "select", default: "right", options: ["right", "left", "none"] },
      { key: "tocKind", label: "Estilo del índice", type: "select", default: "rail", options: ["rail", "list", "numbered"], when: (p) => p.toc !== "none" },
      { key: "cover", label: "Portada (URL o gen:N)", type: "text", default: "gen:1" },
      { key: "dropCap", label: "Letra capital", type: "boolean", default: false },
      { key: "progress", label: "Barra de lectura", type: "boolean", default: false },
      variantProp("minimal"),
    ],
    render: (p) => (
      <Scroller pad={36}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Article
            title={p.title as string}
            kicker={p.kicker as string}
            markdown={p.markdown as string}
            toc={p.toc as never}
            tocKind={p.tocKind as never}
            cover={p.cover as string}
            dropCap={p.dropCap as boolean}
            progress={p.progress as boolean}
            variant={p.variant as never}
          />
        </div>
      </Scroller>
    ),
  },
];
