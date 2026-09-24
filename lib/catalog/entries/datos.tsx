"use client";

import AsciiChart from "@/components/ui/AsciiChart";
import CodeBlock from "@/components/ui/CodeBlock";
import StatCounter from "@/components/ui/StatCounter";
import Table from "@/components/ui/Table";
import TerminalTyper from "@/components/ui/TerminalTyper";
import Timeline from "@/components/ui/Timeline";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, toneProp, variantProp } from "./shared";

export const datos: CatalogEntry[] = [
  {
    id: "stat-counter",
    component: "StatCounter",
    path: "@/components/ui/StatCounter",
    name: "Cifra ASCII que cuenta",
    category: "datos",
    styles: ["retro", "neon", "minimal", "terminal"],
    description: "Número grande en fuente bitmap de asciify-engine que cuenta hacia arriba con GSAP.",
    stageHeight: 280,
    replayable: true,
    props: [
      { key: "value", label: "Valor", type: "number", default: 250, min: 0, max: 9999999, step: 1 },
      { key: "format", label: "Formato", type: "select", default: "int", options: ["int", "decimal", "compact"] },
      { key: "decimals", label: "Decimales", type: "number", default: 1, min: 0, max: 3, step: 1, when: (p) => p.format === "decimal" },
      { key: "prefix", label: "Prefijo", type: "text", default: "" },
      { key: "suffix", label: "Sufijo", type: "text", default: "+" },
      { key: "label", label: "Etiqueta", type: "text", default: "PROYECTOS" },
      toneProp("acc"),
      { key: "align", label: "Alineación", type: "select", default: "center", options: ["left", "center", "right"] },
      { key: "char", label: "Carácter", type: "text", default: "#" },
      { key: "scale", label: "Escala", type: "number", default: 1, min: 1, max: 3, step: 1 },
      { key: "duration", label: "Duración (s)", type: "number", default: 1.6, min: 0.5, max: 4, step: 0.1 },
      { key: "trigger", label: "Disparador", type: "select", default: "mount", options: ["mount", "inview", "hover"] },
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <StatCounter value={p.value as number} format={p.format as never} decimals={p.decimals as number} prefix={p.prefix as string} suffix={p.suffix as string} label={p.label as string} tone={p.tone as never} align={p.align as never} char={(p.char as string) || "#"} scale={p.scale as number} duration={p.duration as number} trigger={p.trigger as never} playKey={replay} />
      </div>
    ),
  },
  {
    id: "ascii-chart",
    component: "AsciiChart",
    path: "@/components/ui/AsciiChart",
    name: "Gráfico ASCII",
    category: "datos",
    styles: ALL_STYLES,
    description: "Barras verticales, horizontales, área o sparkline dibujados con caracteres, con animación de crecimiento.",
    stageHeight: 340,
    replayable: true,
    props: [
      { key: "data", label: "Valores (separados por comas)", type: "text", default: "12, 18, 9, 24, 31, 27, 40, 36" },
      { key: "labels", label: "Etiquetas", type: "text", default: "L,M,X,J,V,S,D,L" },
      { key: "kind", label: "Tipo", type: "select", default: "bars", options: ["bars", "hbars", "area", "spark"] },
      { key: "height", label: "Altura (filas)", type: "number", default: 10, min: 4, max: 20, step: 1, when: (p) => p.kind === "bars" || p.kind === "area" },
      { key: "fillChar", label: "Carácter de relleno", type: "text", default: "█", when: (p) => p.kind !== "spark" },
      { key: "animate", label: "Animar", type: "boolean", default: true },
      variantProp("terminal"),
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <AsciiChart data={p.data as string} labels={p.labels as string} kind={p.kind as never} height={p.height as number} fillChar={(p.fillChar as string) || "█"} animate={p.animate as boolean} variant={p.variant as never} playKey={replay} />
      </div>
    ),
  },
  {
    id: "terminal-typer",
    component: "TerminalTyper",
    path: "@/components/ui/TerminalTyper",
    name: "Terminal que escribe sola",
    category: "datos",
    styles: ALL_STYLES,
    description: "Terminal con escritura carácter a carácter. En estilo retro es un monitor de fósforo con el color de --acc.",
    stageHeight: 340,
    replayable: true,
    props: [
      { key: "lines", label: "Líneas", type: "text", multiline: true, default: "$ npx create-landing hoja-vivero\n[ok] plantilla descargada\n[ok] gsap ScrollTrigger configurado\n$ npm run dev\nready - http://localhost:3000" },
      variantProp("terminal"),
      { key: "chrome", label: "Barra de ventana", type: "boolean", default: true },
      { key: "title", label: "Título de la ventana", type: "text", default: "zsh — proyecto", when: (p) => p.chrome === true },
      { key: "cursor", label: "Cursor", type: "select", default: "block", options: ["block", "bar", "underscore"] },
      { key: "charsPerSecond", label: "Caracteres por segundo", type: "number", default: 32, min: 8, max: 120, step: 2 },
      { key: "prompt", label: "Prompt", type: "text", default: "$" },
      { key: "loop", label: "En bucle", type: "boolean", default: true },
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <div style={{ width: 460, maxWidth: "100%" }}>
          <TerminalTyper lines={p.lines as string} variant={p.variant as never} chrome={p.chrome as boolean} title={p.title as string} cursor={p.cursor as never} charsPerSecond={p.charsPerSecond as number} prompt={(p.prompt as string) || "$"} loop={p.loop as boolean} playKey={replay} />
        </div>
      </div>
    ),
  },
  {
    id: "timeline",
    component: "Timeline",
    path: "@/components/ui/Timeline",
    name: "Línea de pasos",
    category: "datos",
    styles: ALL_STYLES,
    description: "Proceso, hoja de ruta o historial en vertical, con marcadores numerados, punto o carácter.",
    stageHeight: 380,
    props: [
      { key: "steps", label: "Pasos (Título|Descripción por línea)", type: "text", multiline: true, default: "Reserva|Eliges día y nivel en menos de un minuto.\nLlegada|Recibes neopreno y tabla en la playa.\nClase|Dos horas con monitor titulado.\nRepite|Bono de cinco clases con descuento." },
      { key: "marker", label: "Marcador", type: "select", default: "number", options: ["number", "dot", "glyph"] },
      { key: "glyph", label: "Carácter", type: "text", default: "*", when: (p) => p.marker === "glyph" },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Timeline steps={p.steps as string} marker={p.marker as never} glyph={(p.glyph as string) || "*"} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "table",
    component: "Table",
    path: "@/components/ui/Table",
    name: "Tabla de datos",
    category: "datos",
    styles: ALL_STYLES,
    description: "Tabla a partir de texto CSV. La cabecera y las filas se adaptan a la variante.",
    stageHeight: 300,
    props: [
      { key: "csv", label: "CSV (primera línea = cabecera)", type: "text", multiline: true, default: "Plan, Clases, Precio\nIniciación, 1, 35 €\nBono 5, 5, 150 €\nSurf trip, 6, 240 €" },
      { key: "striped", label: "Filas alternas", type: "boolean", default: true },
      variantProp("solid"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Table csv={p.csv as string} striped={p.striped as boolean} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "code-block",
    component: "CodeBlock",
    path: "@/components/ui/CodeBlock",
    name: "Bloque de código",
    category: "datos",
    styles: ALL_STYLES,
    description: "Código con cabecera, numeración de línea opcional y botón de copiar. Sin resaltado de sintaxis.",
    stageHeight: 260,
    props: [
      { key: "code", label: "Código", type: "text", multiline: true, default: 'export function greet(name: string) {\n  return `Hola, ${name}`;\n}' },
      { key: "language", label: "Lenguaje (si no hay nombre de archivo)", type: "text", default: "tsx" },
      { key: "filename", label: "Nombre de archivo", type: "text", default: "" },
      { key: "showLineNumbers", label: "Numerar líneas", type: "boolean", default: true },
      variantProp("terminal"),
    ],
    render: (p) => (
      <div className="ui-center">
        <CodeBlock code={p.code as string} language={p.language as string} filename={p.filename as string} showLineNumbers={p.showLineNumbers as boolean} variant={p.variant as never} />
      </div>
    ),
  },
];
