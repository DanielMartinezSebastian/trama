"use client";

import Accordion from "@/components/ui/Accordion";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Dropdown from "@/components/ui/Dropdown";
import NavBar from "@/components/ui/NavBar";
import Pagination from "@/components/ui/Pagination";
import Tabs from "@/components/ui/Tabs";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, variantProp } from "./shared";

export const navegacion: CatalogEntry[] = [
  {
    id: "navbar",
    component: "NavBar",
    path: "@/components/ui/NavBar",
    name: "Barra de navegación",
    category: "navegacion",
    styles: ALL_STYLES,
    description: "Marca, enlaces y llamada a la acción. El enlace activo se marca de forma distinta en cada estilo.",
    stageHeight: 260,
    props: [
      { key: "brand", label: "Marca", type: "text", default: "Maré" },
      { key: "links", label: "Enlaces (separados por comas)", type: "text", default: "Clases, Tablas, Reservas, Contacto" },
      { key: "cta", label: "Botón", type: "text", default: "Reservar" },
      { key: "defaultActive", label: "Enlace activo", type: "number", default: 0, min: 0, max: 5, step: 1 },
      { key: "floating", label: "Flotante (píldora)", type: "boolean", default: false },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ alignContent: "start", padding: 24, justifyItems: p.floating ? "center" : "stretch" }}>
        <NavBar brand={p.brand as string} links={p.links as string} cta={p.cta as string} defaultActive={p.defaultActive as number} floating={p.floating as boolean} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "tabs",
    component: "Tabs",
    path: "@/components/ui/Tabs",
    name: "Pestañas",
    category: "navegacion",
    styles: ALL_STYLES,
    description: "Pestañas con teclado (←/→) y panel. El indicador de la activa cambia con el estilo.",
    stageHeight: 300,
    props: [
      { key: "items", label: "Pestañas (separadas por comas)", type: "text", default: "Resumen, Detalles, Reseñas" },
      { key: "content", label: "Contenido (una línea por pestaña)", type: "text", multiline: true, default: "Una vista general del producto.\nEspecificaciones técnicas y medidas.\nLo que dicen quienes ya lo usan." },
      { key: "defaultIndex", label: "Pestaña inicial", type: "number", default: 0, min: 0, max: 5, step: 1 },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Tabs items={p.items as string} content={p.content as string} defaultIndex={p.defaultIndex as number} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "accordion",
    component: "Accordion",
    path: "@/components/ui/Accordion",
    name: "Acordeón",
    category: "navegacion",
    styles: ALL_STYLES,
    description: "Preguntas frecuentes con paneles animados por CSS.",
    stageHeight: 360,
    props: [
      { key: "items", label: "Entradas (Pregunta|Respuesta por línea)", type: "text", multiline: true, default: "¿Necesito experiencia?|Ninguna. Empezamos desde cero con material blando.\n¿Qué incluye el precio?|Neopreno, tabla, monitor titulado y seguro.\n¿Puedo cancelar?|Hasta 24 horas antes, sin coste." },
      { key: "multiple", label: "Varios abiertos a la vez", type: "boolean", default: false },
      { key: "defaultOpen", label: "Abierto al inicio", type: "number", default: 0, min: 0, max: 5, step: 1 },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Accordion items={p.items as string} multiple={p.multiple as boolean} defaultOpen={p.defaultOpen as number} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "breadcrumbs",
    component: "Breadcrumbs",
    path: "@/components/ui/Breadcrumbs",
    name: "Migas de pan",
    category: "navegacion",
    styles: ALL_STYLES,
    description: "Ruta de navegación. El último elemento es la página actual, sin enlace.",
    stageHeight: 180,
    props: [
      { key: "items", label: "Ruta (separada por comas)", type: "text", default: "Inicio, Cursos, Iniciación al surf" },
      { key: "separator", label: "Separador", type: "text", default: "/" },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Breadcrumbs items={p.items as string} separator={p.separator as string} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "pagination",
    component: "Pagination",
    path: "@/components/ui/Pagination",
    name: "Paginación",
    category: "navegacion",
    styles: ALL_STYLES,
    description: "Números de página con elipsis cuando hay muchas. Gestiona su propia página activa.",
    stageHeight: 200,
    props: [
      { key: "total", label: "Total de páginas", type: "number", default: 9, min: 1, max: 40, step: 1 },
      { key: "defaultPage", label: "Página inicial", type: "number", default: 4, min: 1, max: 40, step: 1 },
      { key: "siblingCount", label: "Páginas vecinas", type: "number", default: 1, min: 0, max: 3, step: 1 },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Pagination total={p.total as number} defaultPage={p.defaultPage as number} siblingCount={p.siblingCount as number} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "dropdown",
    component: "Dropdown",
    path: "@/components/ui/Dropdown",
    name: "Menú desplegable",
    category: "navegacion",
    styles: ALL_STYLES,
    description: "Botón que abre una lista de acciones (⋮). Para elegir un valor de formulario, ver Select en Formularios.",
    stageHeight: 220,
    props: [
      { key: "label", label: "Botón", type: "text", default: "⋮" },
      { key: "items", label: "Acciones (separadas por comas)", type: "text", default: "Editar, Duplicar, Archivar, Eliminar" },
      { key: "align", label: "Alineación del menú", type: "select", default: "right", options: ["left", "right"] },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Dropdown label={p.label as string} items={p.items as string} align={p.align as never} variant={p.variant as never} />
      </div>
    ),
  },
];
