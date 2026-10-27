"use client";

import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Progress from "@/components/ui/Progress";
import Skeleton from "@/components/ui/Skeleton";
import Spinner from "@/components/ui/Spinner";
import SkeletonDemo from "@/components/playground/SkeletonDemo";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, intentProp, toneProp, variantProp } from "./shared";

export const feedback: CatalogEntry[] = [
  {
    id: "badge",
    component: "Badge",
    path: "@/components/ui/Badge",
    name: "Insignia",
    category: "feedback",
    styles: ALL_STYLES,
    description: "Etiqueta de estado en cinco tonos, con punto opcional.",
    stageHeight: 200,
    props: [
      { key: "text", label: "Texto", type: "text", default: "Nuevo" },
      intentProp("accent"),
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["md", "lg"] },
      { key: "dot", label: "Punto", type: "boolean", default: false },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Badge text={(p.text as string) || " "} intent={p.intent as never} size={p.size as never} dot={p.dot as boolean} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "progress",
    component: "Progress",
    path: "@/components/ui/Progress",
    name: "Barra de progreso",
    category: "feedback",
    styles: ALL_STYLES,
    description: "Barra con franjas animadas o dibujada con caracteres. Retro la dibuja por bloques.",
    stageHeight: 220,
    props: [
      { key: "label", label: "Etiqueta", type: "text", default: "Subiendo" },
      { key: "value", label: "Valor", type: "number", default: 62, min: 0, max: 100, step: 1 },
      { key: "showValue", label: "Mostrar valor", type: "boolean", default: true },
      { key: "striped", label: "Franjas animadas", type: "boolean", default: false, when: (p) => p.ascii !== true },
      { key: "ascii", label: "Barra de caracteres", type: "boolean", default: false },
      { key: "fillChar", label: "Carácter lleno", type: "text", default: "#", when: (p) => p.ascii === true },
      { key: "emptyChar", label: "Carácter vacío", type: "text", default: "-", when: (p) => p.ascii === true },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Progress label={p.label as string} value={p.value as number} showValue={p.showValue as boolean} striped={p.striped as boolean} ascii={p.ascii as boolean} fillChar={(p.fillChar as string) || "#"} emptyChar={(p.emptyChar as string) || "-"} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "alert",
    component: "Alert",
    path: "@/components/ui/Alert",
    name: "Aviso",
    category: "feedback",
    styles: ALL_STYLES,
    description: "Mensaje inline con icono según el tipo, permanente (no desaparece solo). Para una notificación temporal, ver Toast en Overlays.",
    stageHeight: 240,
    props: [
      { key: "title", label: "Título", type: "text", default: "Cambios guardados" },
      { key: "message", label: "Mensaje", type: "text", default: "Tu perfil se actualizó correctamente." },
      intentProp("success"),
      { key: "dismissible", label: "Se puede cerrar", type: "boolean", default: true },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Alert title={p.title as string} message={p.message as string} intent={p.intent as never} dismissible={p.dismissible as boolean} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "spinner",
    component: "Spinner",
    path: "@/components/ui/Spinner",
    name: "Indicador de carga",
    category: "feedback",
    styles: ALL_STYLES,
    description: "Anillo CSS o animaciones de texto: línea, braille, puntos, barra y bloques.",
    stageHeight: 200,
    props: [
      { key: "kind", label: "Tipo", type: "select", default: "braille", options: ["ring", "line", "braille", "dots", "bar", "blocks"] },
      { key: "label", label: "Texto", type: "text", default: "Cargando…" },
      { key: "fontSize", label: "Tamaño (px)", type: "number", default: 20, min: 12, max: 48, step: 1 },
      { key: "fps", label: "Fotogramas por segundo", type: "number", default: 12, min: 2, max: 30, step: 1, when: (p) => p.kind !== "ring" },
      variantProp("terminal"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Spinner kind={p.kind as never} label={p.label as string} fontSize={p.fontSize as number} fps={p.fps as number} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "skeleton",
    component: "Skeleton",
    path: "@/components/ui/Skeleton",
    name: "Esqueleto de carga",
    category: "feedback",
    styles: ALL_STYLES,
    description: "Estado de carga que conserva el tamaño del texto o del elemento que sustituye. Se compone dentro del contenido real: imagen, título, párrafo y acción. También ofrece formas independientes y las plantillas de texto, tarjeta, avatar y tabla.",
    stageHeight: 620,
    children: (p) => p.demo === "primitives" ? undefined : "El contenido marca el ritmo de la página",
    notes: [
      "Usa loading={loading} en cada pieza de tu contenido, dentro de su tipografía y maquetación reales. Al pasar a false se devuelve el hijo original sin envoltorios adicionales.",
      "El contenido de ejemplo permite reservar espacio; no se deducen datos que aún no existen. Si no conoces el tamaño, usa kind=\"block\" con width y height o reserva una proporción estable para la imagen.",
      "Con un hijo HTML se conserva el mismo nodo; los componentes propios deben propagar className, style, inert, aria-hidden y tabIndex a su raíz. Una tarjeta entera envuelta se convierte en un solo bloque: envuelve sus piezas para representar su estructura.",
      "Los hijos se montan durante la carga. Para medios pesados o componentes con efectos, usa una forma independiente en el fallback en vez de montar el contenido anticipadamente.",
      "Mientras carga, la pieza es decorativa y no interactiva. Marca la región que carga con aria-busy y ofrece un estado accesible fuera de ella; la animación se desactiva con movimiento reducido.",
      "kind y lines se aplican sin children. width, height y borderRadius también permiten ajustar la pieza cargando: deben coincidir con la caja del contenido final para evitar saltos. Las plantillas son aproximaciones, no un análisis automático del contenido.",
    ],
    props: [
      { key: "demo", label: "Ejemplo", type: "select", default: "card", options: ["card", "article", "table", "primitives"], labels: { card: "Tarjeta con contenido real", article: "Artículo y fotografía", table: "Tabla por celdas", primitives: "Formas independientes" }, noCode: true },
      { key: "loading", label: "Contenido en carga", type: "boolean", default: true },
      { key: "kind", label: "Tipo de forma", type: "select", default: "text", options: ["text", "block", "card", "avatar", "table"], when: (p) => p.demo === "primitives" },
      { key: "lines", label: "Líneas / filas", type: "number", default: 3, min: 1, max: 6, step: 1, when: (p) => p.demo === "primitives" && (p.kind === "text" || p.kind === "table") },
      { key: "width", label: "Anchura (CSS, vacío = automática)", type: "text", default: "", when: (p) => p.demo === "primitives" },
      { key: "height", label: "Altura (CSS, vacío = automática)", type: "text", default: "", when: (p) => p.demo === "primitives" && (p.kind === "avatar" || p.kind === "block") },
      { key: "borderRadius", label: "Radio (CSS, vacío = original)", type: "text", default: "" },
      { key: "animation", label: "Animación", type: "select", default: "shimmer", options: ["shimmer", "pulse", "none"], labels: { shimmer: "Barrido", pulse: "Pulso", none: "Sin animación" } },
      toneProp("mut"),
    ],
    render: (p) => (
      <div className="ui-center pg-skeleton-stage">
        {p.demo === "primitives" ? <div className="pg-skeleton-primitives"><Skeleton kind={p.kind as never} lines={p.lines as number} tone={p.tone as never} loading={p.loading as boolean} width={(p.width as string) || undefined} height={(p.height as string) || undefined} borderRadius={(p.borderRadius as string) || undefined} animation={p.animation as never} /></div> : <SkeletonDemo layout={p.demo as never} loading={p.loading as boolean} tone={p.tone as never} borderRadius={(p.borderRadius as string) || undefined} animation={p.animation as never} />}
      </div>
    ),
  },
];
