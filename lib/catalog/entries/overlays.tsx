"use client";

import Button from "@/components/ui/Button";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Tooltip from "@/components/ui/Tooltip";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, intentProp, variantProp } from "./shared";

/**
 * Elementos que aparecen por encima de la página: diálogos, notificaciones, ayuda contextual.
 * Modal y Drawer abren desde un botón propio en el escenario (o desde «Repetir animación», que
 * cambia su `playKey`); Toast lanza sobre `sonner` — ver `components/ui/Toast.tsx`.
 */
export const overlays: CatalogEntry[] = [
  {
    id: "modal",
    component: "Modal",
    path: "@/components/ui/Modal",
    name: "Modal",
    category: "overlays",
    styles: ALL_STYLES,
    description: "Diálogo modal: un botón lo abre, el fondo o Escape lo cierran. position: fixed, sin portal.",
    stageHeight: 220,
    replayable: true,
    props: [
      { key: "triggerLabel", label: "Botón", type: "text", default: "Eliminar cuenta" },
      { key: "title", label: "Título", type: "text", default: "¿Seguro que quieres continuar?" },
      { key: "body", label: "Cuerpo", type: "text", multiline: true, default: "Esta acción no se puede deshacer. Se borrarán todos tus datos y no podrás recuperarlos." },
      { key: "confirmLabel", label: "Botón de confirmar", type: "text", default: "Sí, eliminar" },
      { key: "cancelLabel", label: "Botón de cancelar", type: "text", default: "Cancelar" },
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["sm", "md", "lg"] },
      intentProp("accent", undefined, { label: "Color del botón de confirmar (intent)", hint: "danger para acciones destructivas" }),
      variantProp("glass"),
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <Modal intent={p.intent as never}
          triggerLabel={p.triggerLabel as string}
          title={p.title as string}
          body={p.body as string}
          confirmLabel={p.confirmLabel as string}
          cancelLabel={p.cancelLabel as string}
          size={p.size as never}
          variant={p.variant as never}
          playKey={replay}
        />
      </div>
    ),
  },
  {
    id: "toast",
    component: "Toast",
    path: "@/components/ui/Toast",
    name: "Notificación (Toast)",
    category: "overlays",
    styles: ALL_STYLES,
    description: "Notificación temporal apilable, construida sobre sonner (apilado, gestos y temporizador ya resueltos) con el aspecto del kit por encima.",
    stageHeight: 220,
    replayable: true,
    notes: [
      "Usa la librería sonner (toast/Toaster): sin ella habría que reimplementar apilado, gestos táctiles, temporizador y accesibilidad.",
      "Cada instancia lleva un id propio para no cruzarse con otras — importante en «Comparar los 7 estilos», donde conviven 7 Toaster a la vez.",
    ],
    props: [
      intentProp("success", undefined, { when: (p) => p.loading !== true }),
      { key: "loading", label: "En curso (con indicador de carga)", type: "boolean", default: false },
      { key: "title", label: "Título", type: "text", default: "Cambios guardados" },
      { key: "description", label: "Descripción", type: "text", default: "Tu perfil se actualizó correctamente." },
      { key: "position", label: "Posición", type: "select", default: "bottom-right", options: ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] },
      variantProp("glass"),
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <Toast intent={p.intent as never} loading={p.loading as boolean} title={p.title as string} description={p.description as string} position={p.position as never} variant={p.variant as never} playKey={replay} />
      </div>
    ),
  },
  {
    id: "tooltip",
    component: "Tooltip",
    path: "@/components/ui/Tooltip",
    name: "Tooltip",
    category: "overlays",
    styles: ALL_STYLES,
    description: "Texto de ayuda al posar el ratón o el foco. Envuelve el disparador real (botón, icono, enlace) o pinta un texto subrayado. Solo CSS, sin JavaScript.",
    stageHeight: 200,
    children: (p) => (p.demo === "button" ? '<Button label="Exportar" glyph="icon:download" />' : undefined),
    notes: ["Con un único elemento como hijo, este recibe aria-describedby apuntando al tooltip; el foco lo pone el propio botón, sin paradas de tabulador extra."],
    props: [
      { key: "demo", label: "Disparador", type: "select", default: "button", options: ["button", "text"], labels: { button: "un botón (children)", text: "texto (label)" }, noCode: true },
      { key: "label", label: "Texto disparador", type: "text", default: "Pasa el ratón por aquí", when: (p) => p.demo === "text" },
      { key: "content", label: "Contenido del tooltip", type: "text", default: "Descarga el informe en CSV." },
      { key: "side", label: "Lado", type: "select", default: "top", options: ["top", "right", "bottom", "left"] },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Tooltip label={p.label as string} content={p.content as string} side={p.side as never} variant={p.variant as never}>
          {p.demo === "button" ? <Button label="Exportar" glyph="icon:download" variant={p.variant as never} /> : undefined}
        </Tooltip>
      </div>
    ),
  },
  {
    id: "drawer",
    component: "Drawer",
    path: "@/components/ui/Drawer",
    name: "Panel lateral (Drawer)",
    category: "overlays",
    styles: ALL_STYLES,
    description: "Panel deslizante desde un lateral (menú móvil, carrito, filtros). Se cierra con el fondo, Escape o su botón.",
    stageHeight: 220,
    replayable: true,
    props: [
      { key: "triggerLabel", label: "Botón", type: "text", default: "Abrir menú" },
      { key: "side", label: "Lado", type: "select", default: "left", options: ["left", "right"] },
      { key: "title", label: "Título", type: "text", default: "Menú" },
      { key: "body", label: "Cuerpo", type: "text", multiline: true, default: "Clases, Tablas, Reservas, Contacto, Ayuda." },
      variantProp("glass"),
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <Drawer triggerLabel={p.triggerLabel as string} side={p.side as never} title={p.title as string} body={p.body as string} variant={p.variant as never} playKey={replay} />
      </div>
    ),
  },
];
