"use client";

import ChatWidget from "@/components/ui/ChatWidget";
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
      "Se adapta a cualquier tema: hereda la tipografía del contenedor, lleva siempre una base opaca bajo la superficie de la variante y el color de estado se puede atenuar (intentStyle=mono) en temas monocromos.",
      "Usa la librería sonner (toast/Toaster): sin ella habría que reimplementar apilado, gestos táctiles, temporizador y accesibilidad.",
      "Cada instancia lleva un id propio para no cruzarse con otras — importante en «Comparar los estilos», donde conviven varios Toaster a la vez.",
    ],
    props: [
      intentProp("success", undefined, { when: (p) => p.loading !== true }),
      { key: "loading", label: "En curso (con indicador de carga)", type: "boolean", default: false },
      { key: "title", label: "Título", type: "text", default: "Cambios guardados" },
      { key: "description", label: "Descripción", type: "text", default: "Tu perfil se actualizó correctamente." },
      { key: "position", label: "Posición", type: "select", default: "bottom-right", options: ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] },
      variantProp("glass"),
      { key: "intentStyle", label: "Color de estado", type: "select", default: "bar", options: ["bar", "icon", "tint", "mono"], labels: { bar: "barra lateral", icon: "solo icono", tint: "fondo teñido", mono: "sin color (monocromo)" } },
      { key: "icons", label: "Iconos", type: "select", default: "auto", options: ["auto", "svg", "glyph", "none"], labels: { auto: "auto (glifos en terminal, retro y dotmatrix)", svg: "svg", glyph: "glifos de texto", none: "ninguno" } },
      { key: "actionLabel", label: "Botón de acción", type: "text", default: "" },
      { key: "closeButton", label: "Botón de cerrar", type: "boolean", default: false },
      { key: "duration", label: "Duración (s)", type: "number", default: 4, min: 1, max: 20, step: 1 },
      { key: "expand", label: "Pila desplegada", type: "boolean", default: false },
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <Toast intent={p.intent as never} loading={p.loading as boolean} title={p.title as string} description={p.description as string} position={p.position as never} variant={p.variant as never} intentStyle={p.intentStyle as never} icons={p.icons as never} actionLabel={p.actionLabel as string} closeButton={p.closeButton as boolean} duration={p.duration as number} expand={p.expand as boolean} playKey={replay} />
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
    description: "Texto de ayuda al posar el ratón o el foco. Envuelve el disparador real (botón, icono, enlace) o pinta un texto subrayado. Por defecto flota junto al ratón y lo sigue con inercia; con follow={false} queda fijo sobre el disparador y funciona solo con CSS.",
    stageHeight: 200,
    children: (p) => (p.demo === "button" ? '<Button label="Exportar" glyph="icon:download" />' : undefined),
    notes: [
      "Con un único elemento como hijo, este recibe aria-describedby apuntando al tooltip; el foco lo pone el propio botón, sin paradas de tabulador extra.",
      "Con follow, el tooltip sigue al ratón (se da la vuelta en los bordes de la ventana y sin inercia con prefers-reduced-motion). Con teclado o en táctil se coloca sobre el disparador, como con follow={false}.",
    ],
    props: [
      { key: "demo", label: "Disparador", type: "select", default: "button", options: ["button", "text"], labels: { button: "un botón (children)", text: "texto (label)" }, noCode: true },
      { key: "label", label: "Texto disparador", type: "text", default: "Pasa el ratón por aquí", when: (p) => p.demo === "text" },
      { key: "content", label: "Contenido del tooltip", type: "text", default: "Descarga el informe en CSV." },
      { key: "side", label: "Lado", type: "select", default: "top", options: ["top", "right", "bottom", "left"], hint: "Con «flotar con el ratón», lado del puntero en el que aparece" },
      { key: "follow", label: "Flotar con el ratón", type: "boolean", default: true, hint: "Desactívalo para que quede fijo sobre el disparador" },
      { key: "align", label: "Alineación respecto al puntero", type: "select", default: "center", options: ["start", "center", "end"], when: (p) => p.follow === true, hint: "start = a la derecha/abajo del puntero, end = a la izquierda/arriba; con «Lado» da 12 posiciones" },
      { key: "gap", label: "Distancia al puntero (px)", type: "number", default: 16, min: 0, max: 80, step: 2, when: (p) => p.follow === true },
      { key: "offsetX", label: "Desplazamiento X (px)", type: "number", default: 0, min: -80, max: 80, step: 2, when: (p) => p.follow === true, hint: "Positivo = a la derecha" },
      { key: "offsetY", label: "Desplazamiento Y (px)", type: "number", default: 0, min: -80, max: 80, step: 2, when: (p) => p.follow === true, hint: "Positivo = hacia abajo" },
      { key: "inertia", label: "Inercia", type: "number", default: 0.72, min: 0, max: 0.95, step: 0.01, when: (p) => p.follow === true, hint: "0 = pegado al puntero" },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Tooltip follow={p.follow as boolean} align={p.align as never} gap={p.gap as number} offsetX={p.offsetX as number} offsetY={p.offsetY as number} inertia={p.inertia as number} label={p.label as string} content={p.content as string} side={p.side as never} variant={p.variant as never}>
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
  {
    id: "chat-widget",
    component: "ChatWidget",
    path: "@/components/ui/ChatWidget",
    name: "Chat de ayuda (chatbot)",
    category: "overlays",
    styles: ALL_STYLES,
    description: "Asistente flotante en una esquina: responde por reglas (palabras clave → respuesta, con respuestas rápidas) o, con onMessage, conectado a un modelo o servicio real. Indicador de escritura, aviso de no leídos y teclado.",
    stageHeight: 220,
    notes: [
      "Reglas, una por línea: `precio, cuesta => Cuesta **35 €**. || Reservar, Horarios`. Gana la que tiene más claves en el mensaje (sin tildes ni mayúsculas); tras `||`, las respuestas rápidas siguientes.",
      "onMessage(texto, historial) → texto o { text, quickReplies } (puede ser async): sustituye a las reglas para usar un backend.",
      "Flota sobre la ventana (portal a document.body con los tokens copiados): en la vista previa aparece en la esquina de la pantalla, no en el escenario.",
    ],
    props: [
      { key: "title", label: "Nombre", type: "text", default: "Asistente Maré" },
      { key: "subtitle", label: "Subtítulo", type: "text", default: "Responde al momento · o te pasa con el equipo" },
      { key: "greeting", label: "Saludo", type: "text", default: "¡Hola! Soy el asistente de la escuela. Pregúntame por **clases**, **precios** o **material**." },
      { key: "quickReplies", label: "Respuestas rápidas", type: "text", default: "Precios, Horarios, Reservar, Hablar con una persona" },
      { key: "launcherLabel", label: "Texto del botón", type: "text", default: "¿Te ayudo?" },
      { key: "position", label: "Esquina", type: "select", default: "bottom-right", options: ["bottom-right", "bottom-left"] },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <p className="ui-hint">El chat flota en la esquina de la ventana →</p>
        <ChatWidget
          title={p.title as string}
          subtitle={p.subtitle as string}
          greeting={p.greeting as string}
          quickReplies={p.quickReplies as string}
          launcherLabel={p.launcherLabel as string}
          position={p.position as never}
          variant={p.variant as never}
          defaultOpen
        />
      </div>
    ),
  },
];
