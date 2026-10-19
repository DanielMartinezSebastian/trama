"use client";

import AppShell from "@/components/ui/AppShell";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Chart from "@/components/ui/Chart";
import CommandPalette from "@/components/ui/CommandPalette";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import Kbd from "@/components/ui/Kbd";
import KpiCard from "@/components/ui/KpiCard";
import Button from "@/components/ui/Button";
import { VARIANTS } from "@/components/ui/variants";
import type { CatalogEntry } from "../schema";

/** UI de producto: dashboards y aplicaciones (ver docs/06-indice-replicar-webs-premiadas.md, Fase 4). */
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const A = [38, 41, 40, 44, 47, 51, 50, 55, 58, 61, 66, 71];
const B = [29, 31, 32, 33, 35, 36, 38, 39, 41, 42, 44, 46];
const ROWS = [
  { id: "1", nombre: "Lucía Ferrer", plan: "Pro", mrr: 99, estado: "Activo" },
  { id: "2", nombre: "Marco Delgado", plan: "Business", mrr: 349, estado: "Impago" },
  { id: "3", nombre: "Irene Sola", plan: "Starter", mrr: 29, estado: "Activo" },
  { id: "4", nombre: "Pablo Quintana", plan: "Pro", mrr: 99, estado: "En prueba" },
  { id: "5", nombre: "Nerea Campos", plan: "Business", mrr: 349, estado: "Activo" },
  { id: "6", nombre: "Hugo Beltrán", plan: "Starter", mrr: 29, estado: "Baja" },
  { id: "7", nombre: "Alba Rius", plan: "Pro", mrr: 99, estado: "Activo" },
];
const COLS = [
  { key: "nombre" as const, label: "Cliente", sortable: true },
  { key: "plan" as const, label: "Plan", sortable: true },
  { key: "mrr" as const, label: "MRR (€)", sortable: true, align: "right" as const },
  { key: "estado" as const, label: "Estado", sortable: true, render: (r: (typeof ROWS)[number]) => <Badge text={r.estado} intent={r.estado === "Activo" ? "success" : r.estado === "Impago" ? "warning" : r.estado === "Baja" ? "neutral" : "info"} variant="editorial" dot /> },
];
const CMDS = [
  { id: "a", label: "Ir a Resumen", group: "Páginas", href: "#" },
  { id: "b", label: "Ir a Clientes", group: "Páginas", href: "#" },
  { id: "c", label: "Ir a Informes", group: "Páginas", href: "#", keywords: "gráficos métricas" },
  { id: "d", label: "Lucía Ferrer", hint: "Nodo Energía · Pro", group: "Clientes", href: "#" },
  { id: "e", label: "Marco Delgado", hint: "Mapa Studio · Business", group: "Clientes", href: "#" },
  { id: "f", label: "Irene Sola", hint: "Atlas Logística · Starter", group: "Clientes", href: "#" },
];
const TONE = { key: "variant", label: "Variante de estilo", type: "select" as const, default: "editorial", options: VARIANTS, hint: "Cambia superficie, borde, radio, sombra y tipografía" };
const PRODUCT = ["editorial", "outline", "solid", "glass", "minimal", "terminal"] as CatalogEntry["styles"];

export const producto: CatalogEntry[] = [
  {
    id: "kbd",
    component: "Kbd",
    path: "@/components/ui/Kbd",
    name: "Tecla (atajo)",
    category: "feedback",
    styles: PRODUCT,
    description: "Una tecla o combinación en un recuadro (<kbd>): atajos en menús, paletas y ayudas.",
    stageHeight: 140,
    props: [{ key: "text", label: "Texto", type: "text", default: "⌘K" }],
    children: (p) => String(p.text ?? "⌘K"),
    render: (p) => (
      <div className="ui-center" style={{ fontSize: 18 }}>
        <Kbd>{(p.text as string) || " "}</Kbd>
      </div>
    ),
  },
  {
    id: "avatar",
    component: "Avatar",
    path: "@/components/ui/Avatar",
    name: "Avatar",
    category: "feedback",
    styles: PRODUCT,
    description: "Imagen o iniciales con punto de estado opcional. El nombre y el estado van como texto accesible.",
    stageHeight: 160,
    props: [
      { key: "name", label: "Nombre", type: "text", default: "Lucía Ferrer" },
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["sm", "md", "lg"] },
      { key: "status", label: "Estado", type: "select", default: "online", options: ["none", "online", "away", "busy", "offline"] },
      { key: "tone", label: "Color (token)", type: "select", default: "acc", options: ["fg", "acc", "acc2", "mut"] },
    ],
    render: (p) => (
      <div className="ui-center">
        <Avatar name={(p.name as string) || "?"} size={p.size as never} status={p.status as never} tone={p.tone as never} />
      </div>
    ),
  },
  {
    id: "kpi-card",
    component: "KpiCard",
    path: "@/components/ui/KpiCard",
    name: "Tarjeta de indicador (KPI)",
    category: "datos",
    styles: PRODUCT,
    description: "Etiqueta, cifra, variación con color semántico y mini gráfica. El color nunca es la única señal: la variación lleva signo y flecha.",
    stageHeight: 220,
    notes: ["lowerIsBetter invierte los colores cuando que baje es bueno (bajas, tiempos de respuesta)."],
    props: [
      { key: "label", label: "Etiqueta", type: "text", default: "Ingresos recurrentes" },
      { key: "value", label: "Valor", type: "text", default: "71.000 €" },
      { key: "delta", label: "Variación", type: "text", default: "+7,6 %" },
      { key: "trend", label: "Tendencia", type: "select", default: "up", options: ["up", "down", "flat"] },
      { key: "lowerIsBetter", label: "Bajar es bueno", type: "boolean", default: false },
      { key: "note", label: "Nota", type: "text", default: "vs. mes anterior" },
      TONE,
    ],
    render: (p) => (
      <div style={{ width: "min(100%, 300px)", padding: 16 }}>
        <KpiCard label={p.label as string} value={p.value as string} delta={p.delta as string} trend={p.trend as never} lowerIsBetter={p.lowerIsBetter as boolean} note={p.note as string} variant={p.variant as never} spark={A} />
      </div>
    ),
  },
  {
    id: "chart",
    component: "Chart",
    path: "@/components/ui/Chart",
    name: "Gráfico (líneas, áreas, barras)",
    category: "datos",
    styles: PRODUCT,
    description: "Gráfico en SVG sin librerías: escala «bonita», animación de trazo, guía con valores al pasar el puntero o con las flechas. Los datos van además en una tabla oculta para lectores de pantalla.",
    stageHeight: 380,
    notes: ["Máximo recomendable: 4 series. Tonos: acc, acc2, fg, mut."],
    props: [
      { key: "kind", label: "Tipo", type: "select", default: "area", options: ["line", "area", "bar"], labels: { line: "líneas", area: "áreas", bar: "barras" } },
      { key: "legend", label: "Leyenda", type: "boolean", default: true },
      { key: "unit", label: "Unidad", type: "text", default: " k€" },
      { key: "height", label: "Alto (px)", type: "number", default: 260, min: 140, max: 520, step: 10 },
    ],
    render: (p) => (
      <div style={{ width: "100%", padding: 16 }}>
        <Chart kind={p.kind as never} labels={MONTHS} series={[{ name: "Este año", data: A, tone: "acc" }, { name: "Año anterior", data: B, tone: "mut" }]} unit={p.unit as string} legend={p.legend as boolean} height={p.height as number} label="Ingresos mensuales de este año y del anterior" />
      </div>
    ),
  },
  {
    id: "data-table",
    component: "DataTable",
    path: "@/components/ui/DataTable",
    name: "Tabla de datos interactiva",
    category: "datos",
    styles: PRODUCT,
    description: "Ordena al pulsar la cabecera (aria-sort), busca en todas las columnas, selecciona filas y pagina. Datos como array de objetos; celdas a tu manera con render.",
    stageHeight: 440,
    notes: ["Para datos estáticos en CSV, Table. La búsqueda, el orden y la página se anuncian con aria-live."],
    props: [
      { key: "searchable", label: "Búsqueda", type: "boolean", default: true },
      { key: "selectable", label: "Selección de filas", type: "boolean", default: true },
      { key: "pageSize", label: "Filas por página (0 = todas)", type: "number", default: 4, min: 0, max: 20, step: 1 },
      { key: "striped", label: "Filas alternas", type: "boolean", default: false },
      TONE,
    ],
    render: (p) => (
      <div style={{ width: "100%", padding: 16 }}>
        <DataTable columns={COLS} rows={ROWS} rowKey="id" caption="Clientes de ejemplo" searchable={p.searchable as boolean} selectable={p.selectable as boolean} pageSize={p.pageSize as number} striped={p.striped as boolean} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "command-palette",
    component: "CommandPalette",
    path: "@/components/ui/CommandPalette",
    name: "Paleta de comandos (⌘K)",
    category: "overlays",
    styles: PRODUCT,
    description: "Caja de búsqueda sobre la página con lista filtrada por varias palabras (sin acentos ni mayúsculas), agrupada y navegable con flechas, Intro y Esc. Patrón ARIA combobox + listbox; atrapa el foco y lo devuelve al cerrar.",
    stageHeight: 200,
    notes: ["Se abre con el botón o con Ctrl/⌘ + K. Se pinta en un portal con los tokens del tema."],
    props: [
      { key: "trigger", label: "Botón visible", type: "boolean", default: true },
      { key: "hotkey", label: "Atajo Ctrl/⌘ K", type: "boolean", default: true },
      { key: "triggerLabel", label: "Texto del botón", type: "text", default: "Buscar" },
      { key: "placeholder", label: "Placeholder", type: "text", default: "Escribe un comando o busca…" },
    ],
    render: (p) => (
      <div className="ui-center">
        <CommandPalette items={CMDS} trigger={p.trigger as boolean} hotkey={p.hotkey as boolean} triggerLabel={p.triggerLabel as string} placeholder={p.placeholder as string} />
      </div>
    ),
  },
  {
    id: "app-shell",
    component: "AppShell",
    path: "@/components/ui/AppShell",
    name: "Marco de aplicación",
    category: "navegacion",
    styles: PRODUCT,
    description: "Barra lateral con grupos (plegable a iconos), barra superior y contenido con su propio scroll. En pantallas estrechas la barra pasa a panel con botón (Esc y fuera cierran). Los enlaces son <a href> reales con aria-current.",
    stageHeight: 480,
    notes: ["height admite 100svh (página entera) o un valor fijo cuando va dentro de otra cosa."],
    props: [
      { key: "title", label: "Título de la página", type: "text", default: "Resumen" },
      { key: "collapsible", label: "Plegable", type: "boolean", default: true },
      { key: "height", label: "Alto", type: "text", default: "440px" },
      TONE,
    ],
    render: (p) => (
      <div style={{ width: "100%", padding: 12 }}>
        <AppShell
          brand={<><span aria-hidden>◐</span><span>Pulso</span></>}
          title={p.title as string}
          collapsible={p.collapsible as boolean}
          height={p.height as string}
          variant={p.variant as never}
          groups={[
            { items: [{ label: "Resumen", href: "#", icon: "◧", active: true }, { label: "Clientes", href: "#", icon: "◉", badge: "24" }, { label: "Informes", href: "#", icon: "◭" }] },
            { label: "Cuenta", items: [{ label: "Ajustes", href: "#", icon: "◌" }] },
          ]}
          footer={<div style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar name="Daniel Marín" size="sm" status="online" /><span className="ui-app__txt" style={{ fontSize: 13 }}>Daniel Marín</span></div>}
          actions={<Avatar name="Daniel Marín" size="sm" />}
        >
          <p style={{ margin: 0, color: "var(--mut)" }}>Aquí va el contenido de la página.</p>
        </AppShell>
      </div>
    ),
  },
  {
    id: "empty-state",
    component: "EmptyState",
    path: "@/components/ui/EmptyState",
    name: "Estado vacío",
    category: "feedback",
    styles: PRODUCT,
    description: "Qué pasa y qué puedes hacer cuando no hay datos, resultados o hay un error. Una sola acción principal.",
    stageHeight: 300,
    props: [
      { key: "title", label: "Título", type: "text", default: "Aún no has conectado integraciones" },
      { key: "text", label: "Texto", type: "text", multiline: true, default: "Conecta tu pasarela de pago o tu CRM para que importemos los clientes." },
      { key: "glyph", label: "Glifo", type: "text", default: "◌" },
      TONE,
    ],
    children: "<Button label=\"Conectar una integración\" />",
    render: (p) => (
      <div style={{ width: "min(100%, 520px)", padding: 16 }}>
        <EmptyState title={p.title as string} text={p.text as string} glyph={p.glyph as string} variant={p.variant as never}>
          <Button label="Conectar una integración" variant={p.variant as never} emphasis="primary" />
        </EmptyState>
      </div>
    ),
  },
];
