"use client";

import { useId } from "react";
import Accordion from "@/components/ui/Accordion";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Dropdown from "@/components/ui/Dropdown";
import NavBar from "@/components/ui/NavBar";
import Pagination from "@/components/ui/Pagination";
import ScrollProgress, { type ScrollProgressProps } from "@/components/ui/ScrollProgress";
import Tabs from "@/components/ui/Tabs";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, toneProp, variantProp } from "./shared";

const LOREM = Array.from({ length: 9 }, (_, i) =>
  i % 3 === 0
    ? `Capítulo ${i / 3 + 1}`
    : "Desplaza este texto para ver avanzar la barra. El componente mide el scroll de la página o de cualquier contenedor y se ancla a un borde, a una esquina o al flujo del documento.",
);

/**
 * Vista previa: una caja con scroll propio y la barra anclada a ella (position="absolute") siguiendo ese scroll por selector.
 * Cada instancia tiene su id: en «Comparar los estilos» conviven ocho.
 */
function ScrollProgressPreview(props: ScrollProgressProps) {
  const id = "sprog-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const inline = props.placement === "inline";
  return (
    <div className="pg-sprog">
      {inline && <ScrollProgress {...props} target={`#${id}`} />}
      <div id={id} className="pg-sprog__box" tabIndex={0}>
        {LOREM.map((t, i) => (i % 3 === 0 ? <h3 key={i}>{t}</h3> : <p key={i}>{t}</p>))}
      </div>
      {!inline && <ScrollProgress {...props} position="absolute" target={`#${id}`} />}
    </div>
  );
}

export const navegacion: CatalogEntry[] = [
  {
    id: "navbar",
    component: "NavBar",
    path: "@/components/ui/NavBar",
    name: "Barra de navegación",
    category: "navegacion",
    styles: ALL_STYLES,
    description: "Barra de navegación completa: siete disposiciones (o piezas en el orden que quieras), seis formas de barra, submenús desplegables o mega menú con categorías, barra de búsqueda o paleta ⌘K, menú móvil propio, anuncio, dos llamadas a la acción y comportamiento al hacer scroll.",
    stageHeight: 520,
    notes: [
      "Enlaces como texto, una sección por línea: `Sección > Hijo|descripción|icon:nombre; Hijo=/ruta`. Dentro de un submenú, `#Categoría` abre una columna con título. `Etiqueta=#id` es un enlace real y `Etiqueta [nuevo]` lleva insignia.",
      "layout elige una disposición; slots la sustituye pieza a pieza: brand, links, search, actions, spacer y menu separadas por espacios, `|` para otra fila y `/` para columnas alineadas a izquierda, centro y derecha. Ej.: \"brand / links / search actions\".",
      "Se pliega en menú móvil según el ancho de su contenedor (collapseAt), no de la ventana: baja «Ancho de la vista previa» para verlo.",
      "Con search=\"button\" o \"command\" (y siempre en móvil), ⌘K / Ctrl+K y «/» abren la paleta; busca en los enlaces, sus categorías y searchItems.",
      "La paleta y el cajón móvil salen a document.body con los tokens copiados: un ancestro con backdrop-filter (glass, cabeceras con blur) atraparía su position: fixed.",
    ],
    props: [
      { key: "layout", label: "Disposición", type: "select", default: "classic", options: ["classic", "left", "right", "center", "split", "stacked", "minimal"], labels: { classic: "clásica (marca · enlaces · acciones)", left: "enlaces junto a la marca", right: "enlaces junto a las acciones", center: "enlaces centrados", split: "marca en el centro", stacked: "dos filas (búsqueda arriba, secciones abajo)", minimal: "mínima (marca + menú)" } },
      { key: "slots", label: "Piezas a medida (sustituye a la disposición)", type: "text", default: "", hint: "brand links search actions spacer menu · | nueva fila · / columnas" },
      { key: "shape", label: "Forma de la barra", type: "select", default: "island", options: ["island", "full", "contained", "floating", "transparent", "underline"], labels: { island: "tarjeta", full: "de borde a borde", contained: "de borde a borde, contenido centrado", floating: "píldora flotante", transparent: "transparente", underline: "solo línea inferior" } },
      { key: "size", label: "Densidad", type: "select", default: "md", options: ["sm", "md", "lg"] },
      { key: "search", label: "Búsqueda", type: "select", default: "bar", options: ["none", "bar", "inline", "button", "command"], labels: { none: "sin búsqueda", bar: "barra de búsqueda", inline: "campo compacto", button: "icono → paleta", command: "botón ⌘K → paleta" } },
      { key: "searchPlaceholder", label: "Texto de la búsqueda", type: "text", default: "Buscar clases, tablas…", when: (p) => p.search !== "none" },
      { key: "searchItems", label: "Entradas extra de búsqueda", type: "text", default: "Horarios, Mareas de hoy, Bonos regalo", when: (p) => p.search !== "none" },
      { key: "brand", label: "Marca", type: "text", default: "Maré" },
      {
        key: "links",
        label: "Enlaces (una sección por línea)",
        type: "text",
        multiline: true,
        default:
          "Clases > Iniciación|Grupos de seis y espuma blanda|icon:users; Perfeccionamiento|Vídeo-análisis de tus olas|icon:video; Privadas|Un monitor solo para ti|icon:user\nTienda > #Tablas; Softboard; Longboard; Shortboard; #Neoprenos; Primavera 3/2; Invierno 4/3; #Accesorios; Quillas; Leash; Parafina\nReservas=#reservas\nContacto [nuevo]",
      },
      { key: "menuStyle", label: "Submenús", type: "select", default: "auto", options: ["auto", "dropdown", "mega"], labels: { auto: "auto (mega con descripciones o categorías)", dropdown: "desplegable", mega: "mega menú" } },
      { key: "openOn", label: "Abrir submenús con", type: "select", default: "hover", options: ["hover", "click"] },
      { key: "linksAlign", label: "Alinear enlaces (clásica)", type: "select", default: "center", options: ["start", "center", "end"], when: (p) => p.layout === "classic" && !p.slots },
      { key: "cta", label: "Botón principal", type: "text", default: "Reservar" },
      { key: "secondaryCta", label: "Botón secundario", type: "text", default: "Entrar" },
      { key: "announcement", label: "Anuncio", type: "text", default: "" },
      { key: "collapseAt", label: "Plegar por debajo de (px)", type: "number", default: 760, min: 0, max: 1400, step: 20 },
      { key: "mobileMenu", label: "Menú móvil", type: "select", default: "drawer", options: ["drawer", "sheet"], labels: { drawer: "cajón lateral", sheet: "hoja bajo la barra" } },
      { key: "defaultActive", label: "Enlace activo", type: "number", default: 0, min: 0, max: 5, step: 1 },
      variantProp("glass"),
      { key: "previewWidth", label: "Ancho de la vista previa (px, 0 = todo)", type: "number", default: 0, min: 0, max: 1400, step: 20, noCode: true },
    ],
    render: (p) => (
      <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <div style={{ width: (p.previewWidth as number) > 0 ? `min(100%, ${p.previewWidth}px)` : "100%" }}>
          <NavBar
            layout={p.layout as never}
            slots={p.slots as string}
            shape={p.shape as never}
            size={p.size as never}
            search={p.search as never}
            searchPlaceholder={p.searchPlaceholder as string}
            searchItems={p.searchItems as string}
            brand={p.brand as string}
            links={p.links as string}
            menuStyle={p.menuStyle as never}
            openOn={p.openOn as never}
            linksAlign={p.linksAlign as never}
            cta={p.cta as string}
            secondaryCta={p.secondaryCta as string}
            announcement={p.announcement as string}
            collapseAt={p.collapseAt as number}
            mobileMenu={p.mobileMenu as never}
            defaultActive={p.defaultActive as number}
            variant={p.variant as never}
            onNavigate={() => {}}
          />
        </div>
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
  {
    id: "scroll-progress",
    component: "ScrollProgress",
    path: "@/components/ui/ScrollProgress",
    name: "Progreso del scroll",
    category: "navegacion",
    styles: ALL_STYLES,
    description: "Cuánto se ha leído de la página o de un contenedor con scroll. Se ancla a cualquier borde o esquina (de la ventana o de su contenedor) o va en el flujo, como barra, tramos, puntos, caracteres o anillo.",
    stageHeight: 360,
    notes: [
      "Por defecto mide la página y se fija arriba de la ventana: <ScrollProgress /> en el layout basta.",
      "target=\"parent\" mide el ancestro con scroll más cercano; un selector (\"#articulo\") mide ese elemento. Con position=\"absolute\" se ancla al contenedor con position: relative.",
      "El avance se escribe como variable CSS en un rAF, sin re-renderizar React; con prefers-reduced-motion no se suaviza.",
      "En la vista previa la barra sigue la caja con scroll, no la página.",
    ],
    props: [
      { key: "placement", label: "Posición", type: "select", default: "top", options: ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right", "inline"] },
      { key: "kind", label: "Forma", type: "select", default: "bar", options: ["bar", "segments", "dots", "ascii", "ring"], labels: { bar: "barra", segments: "tramos", dots: "puntos", ascii: "caracteres", ring: "anillo" } },
      variantProp("minimal"),
      toneProp("acc"),
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["sm", "md", "lg"] },
      { key: "steps", label: "Tramos / caracteres", type: "number", default: 24, min: 4, max: 60, step: 1, when: (p) => p.kind === "segments" || p.kind === "dots" || p.kind === "ascii" },
      { key: "chars", label: "Caracteres (lleno y vacío)", type: "text", default: "", hint: "vacío = los de la variante", when: (p) => p.kind === "ascii" },
      { key: "showValue", label: "Mostrar porcentaje", type: "boolean", default: false },
      { key: "smooth", label: "Suavizado", type: "boolean", default: true },
    ],
    render: (p) => (
      <ScrollProgressPreview
        placement={p.placement as never}
        kind={p.kind as never}
        variant={p.variant as never}
        tone={p.tone as never}
        size={p.size as never}
        steps={p.steps as number}
        chars={p.chars as string}
        showValue={p.showValue as boolean}
        smooth={p.smooth as boolean}
      />
    ),
  },
];
