"use client";

import CustomCursor from "@/components/ui/CustomCursor";
import FitText from "@/components/ui/FitText";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import LocalTime from "@/components/ui/LocalTime";
import Preloader from "@/components/ui/Preloader";
import ProjectList from "@/components/ui/ProjectList";
import RollLink from "@/components/ui/RollLink";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SplitText, { SPLIT_BY, SPLIT_EFFECTS } from "@/components/ui/SplitText";
import { fashionArt } from "@/lib/sites/art";
import type { CatalogEntry } from "../schema";

/** Piezas de movimiento y tipografía cinética (ver docs/06-indice-replicar-webs-premiadas.md). */
const PROJECTS = [
  { title: "Casa Alba", meta: "Identidad", year: "2026", image: fashionArt(4, "coat") },
  { title: "Tinta y Sal", meta: "Web", year: "2026", image: fashionArt(2, "arch") },
  { title: "Nodo", meta: "Producto", year: "2025", image: fashionArt(6, "dress") },
  { title: "Faro Studio", meta: "Web + 3D", year: "2025", image: fashionArt(5, "fabric") },
];

export const movimiento: CatalogEntry[] = [
  {
    id: "split-text",
    component: "SplitText",
    path: "@/components/ui/SplitText",
    name: "Texto troceado (cinético)",
    category: "texto",
    styles: ["minimal", "solid", "outline", "terminal"],
    description:
      "Titular o párrafo que entra por líneas, palabras o letras, con máscara de recorte. CSS puro: el estado oculto viene en el HTML del servidor. Espera a que termine el Preloader, si lo hay.",
    stageHeight: 300,
    replayable: true,
    notes: [
      "by=lines mide cada palabra tras cargar las fuentes y al cambiar el ancho: la entrada es por línea real, no por saltos de línea escritos a mano.",
      "El lector de pantalla lee una copia del texto íntegro; las unidades visuales van aria-hidden.",
      "Solo admite un string (no trocea texto controlado por React, guía §10).",
    ],
    props: [
      { key: "text", label: "Texto", type: "text", multiline: true, default: "Diseñamos webs que se sienten como una conversación y no como un folleto." },
      { key: "by", label: "Unidad", type: "select", default: "lines", options: SPLIT_BY, labels: { lines: "líneas", words: "palabras", chars: "letras" } },
      { key: "effect", label: "Efecto", type: "select", default: "rise", options: SPLIT_EFFECTS },
      { key: "mask", label: "Máscara de recorte", type: "boolean", default: true },
      { key: "trigger", label: "Disparador", type: "select", default: "mount", options: ["mount", "inview"] },
      { key: "stagger", label: "Escalonado (s)", type: "number", default: 0.1, min: 0.01, max: 0.4, step: 0.01 },
      { key: "duration", label: "Duración (s)", type: "number", default: 0.9, min: 0.2, max: 2.5, step: 0.1 },
      { key: "delay", label: "Retardo (s)", type: "number", default: 0, min: 0, max: 2, step: 0.1 },
    ],
    render: (p, { replay }) => (
      <div style={{ padding: 24, fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", maxWidth: 760 }}>
        <SplitText by={p.by as never} effect={p.effect as never} mask={p.mask as boolean} trigger={p.trigger as never} stagger={p.stagger as number} duration={p.duration as number} delay={p.delay as number} playKey={replay}>
          {(p.text as string) || " "}
        </SplitText>
      </div>
    ),
  },
  {
    id: "fit-text",
    component: "FitText",
    path: "@/components/ui/FitText",
    name: "Texto a todo el ancho",
    category: "texto",
    styles: ["minimal", "solid", "outline"],
    description: "Una sola línea que llena exactamente el ancho del contenedor (titulares gigantes de pie de página). Se reajusta al cambiar el tamaño.",
    stageHeight: 220,
    props: [
      { key: "text", label: "Texto", type: "text", default: "Hablemos" },
      { key: "max", label: "Tope de tamaño (px, 0 = sin tope)", type: "number", default: 0, min: 0, max: 600, step: 10 },
    ],
    render: (p) => (
      <div style={{ padding: 24, width: "100%", fontWeight: 800 }}>
        <FitText max={(p.max as number) || undefined}>{(p.text as string) || " "}</FitText>
      </div>
    ),
  },
  {
    id: "roll-link",
    component: "RollLink",
    path: "@/components/ui/RollLink",
    name: "Enlace que rueda",
    category: "interaccion",
    styles: ["minimal", "solid", "outline", "terminal"],
    description: "Enlace o botón cuyo texto sube y es sustituido por una copia igual al pasar el puntero o enfocar. Solo CSS.",
    stageHeight: 200,
    props: [
      { key: "label", label: "Texto", type: "text", default: "Ver proyectos" },
      { key: "direction", label: "Dirección", type: "select", default: "up", options: ["up", "down"] },
      { key: "href", label: "Enlace (vacío = botón)", type: "text", default: "#" },
    ],
    render: (p) => (
      <div className="ui-center" style={{ fontSize: 28, fontWeight: 700 }}>
        <RollLink label={(p.label as string) || " "} direction={p.direction as never} href={(p.href as string) || undefined} />
      </div>
    ),
  },
  {
    id: "custom-cursor",
    component: "CustomCursor",
    path: "@/components/ui/CustomCursor",
    name: "Cursor de página con estados",
    category: "interaccion",
    styles: ["minimal", "solid", "neon"],
    description:
      "Punto que persigue al puntero en toda la página y cambia según lo que hay debajo: crece en enlaces, muestra una etiqueta con data-cursor=\"Ver\", se oculta con data-cursor=\"hide\" y se hace barra en campos de texto. Solo con puntero fino.",
    stageHeight: 280,
    notes: ["Es global (position: fixed): en el catálogo actúa sobre toda la ventana mientras esta ficha está abierta.", "hideNative oculta el cursor del sistema, salvo en campos de texto."],
    props: [
      { key: "cursorSize", label: "Tamaño (px)", type: "number", default: 14, min: 6, max: 40, step: 1 },
      { key: "follow", label: "Seguimiento", type: "number", default: 0.18, min: 0.05, max: 1, step: 0.01 },
      { key: "blend", label: "Mezcla", type: "select", default: "difference", options: ["difference", "none"] },
      { key: "hideNative", label: "Ocultar cursor del sistema", type: "boolean", default: false },
    ],
    render: (p) => (
      <div className="ui-center" style={{ gap: 24, flexWrap: "wrap" }}>
        <CustomCursor cursorSize={p.cursorSize as number} follow={p.follow as number} blend={p.blend as never} hideNative={p.hideNative as boolean} />
        <span className="ui-hint">Mueve el puntero por la página</span>
        <a href="#" data-cursor="Ver" style={{ padding: "28px 40px", border: "1px solid var(--ln)", borderRadius: 12 }} onClick={(e) => e.preventDefault()}>data-cursor=&quot;Ver&quot;</a>
        <a href="#" style={{ padding: 12 }} onClick={(e) => e.preventDefault()}>un enlace</a>
        <input aria-label="Campo de ejemplo" placeholder="un campo de texto" style={{ padding: 10 }} />
      </div>
    ),
  },
  {
    id: "smooth-scroll",
    component: "SmoothScroll",
    path: "@/components/ui/SmoothScroll",
    name: "Scroll suave (Lenis)",
    category: "interaccion",
    styles: ["minimal"],
    description: "Scroll con inercia de toda la página, sincronizado con ScrollTrigger. No pinta nada. Se apaga con prefers-reduced-motion y en táctil.",
    stageHeight: 140,
    notes: [
      "Colócalo una vez, en el marco de la web. Pausar desde un menú o modal: lockScroll() de @/lib/motion/lenis.",
      "No está activo en el catálogo para no alterar su scroll; pruébalo en /sitios/estudio.",
    ],
    props: [
      { key: "lerp", label: "Inercia", type: "number", default: 0.1, min: 0.03, max: 0.3, step: 0.01 },
      { key: "wheelMultiplier", label: "Rueda ×", type: "number", default: 1, min: 0.3, max: 2.5, step: 0.1 },
      { key: "anchors", label: "Anclas suaves", type: "boolean", default: true },
      { key: "syncGsap", label: "Sincronizar con GSAP", type: "boolean", default: true },
    ],
    render: (p) => (
      <div className="ui-center">
        <SmoothScroll enabled={false} lerp={p.lerp as number} wheelMultiplier={p.wheelMultiplier as number} anchors={p.anchors as boolean} syncGsap={p.syncGsap as boolean} />
        <span className="ui-hint">Sin salida visual: ver /sitios/estudio</span>
      </div>
    ),
  },
  {
    id: "preloader",
    component: "Preloader",
    path: "@/components/ui/Preloader",
    name: "Preloader",
    category: "transiciones",
    styles: ["minimal", "solid", "terminal"],
    description:
      "Pantalla de entrada con contador, palabras o barra; bloquea el scroll, se salta con clic o Esc y avisa a SplitText para que sus textos entren al abrirse. Solo la primera visita de la pestaña por defecto.",
    stageHeight: 200,
    replayable: true,
    notes: ["Cubre toda la ventana (position: fixed). En el catálogo se lanza al pulsar «Repetir animación» con once=always."],
    props: [
      { key: "variant", label: "Variante", type: "select", default: "counter", options: ["counter", "words", "bar"] },
      { key: "brand", label: "Marca", type: "text", default: "Estudio" },
      { key: "meta", label: "Texto lateral", type: "text", default: "Madrid — 2026" },
      { key: "duration", label: "Duración (s)", type: "number", default: 2, min: 0.5, max: 5, step: 0.1 },
      { key: "exit", label: "Salida", type: "select", default: "curtain", options: ["curtain", "fade"] },
    ],
    render: (p, { replay }) =>
      replay > 0 ? (
        <Preloader variant={p.variant as never} brand={p.brand as string} meta={p.meta as string} duration={p.duration as number} exit={p.exit as never} once="always" playKey={replay} />
      ) : (
        <div className="ui-center"><span className="ui-hint">Pulsa «Repetir animación»</span></div>
      ),
  },
  {
    id: "project-list",
    component: "ProjectList",
    path: "@/components/ui/ProjectList",
    name: "Lista de proyectos con vista previa",
    category: "secciones",
    styles: ["minimal", "solid", "outline"],
    description:
      "Filas con título enorme. Al pasar el puntero el resto se atenúa y una imagen sigue al cursor con inclinación según la velocidad; con teclado se coloca en la fila enfocada; en táctil, miniatura bajo el título.",
    stageHeight: 520,
    props: [
      { key: "numbered", label: "Numeración", type: "boolean", default: true },
      { key: "follow", label: "Seguimiento", type: "number", default: 0.14, min: 0.05, max: 1, step: 0.01 },
      { key: "tilt", label: "Inclinación máx. (°)", type: "number", default: 8, min: 0, max: 20, step: 1 },
      { key: "cursorLabel", label: "Etiqueta del cursor", type: "text", default: "Ver" },
    ],
    render: (p) => (
      <div style={{ width: "100%", padding: 16 }}>
        <ProjectList items={PROJECTS.map((x) => ({ ...x, href: "#" }))} numbered={p.numbered as boolean} follow={p.follow as number} tilt={p.tilt as number} cursorLabel={p.cursorLabel as string} />
      </div>
    ),
  },
  {
    id: "fullscreen-menu",
    component: "FullscreenMenu",
    path: "@/components/ui/FullscreenMenu",
    name: "Menú a pantalla completa",
    category: "navegacion",
    styles: ["minimal", "solid", "outline"],
    description:
      "Botón [menu] que abre un menú de pantalla completa: la cortina baja y los enlaces suben uno a uno. Si el botón está en un <header>, la cabecera NO se mueve: el menú se abre debajo y el mismo botón pasa a [close] sin cambiar de sitio ni de tamaño. Cierra con Esc, pausa el scroll sin que salte la página y deja inerte lo que queda tapado.",
    stageHeight: 200,
    props: [
      { key: "brand", label: "Marca", type: "text", default: "Estudio" },
      { key: "openLabel", label: "Texto abrir", type: "text", default: "menu" },
      { key: "closeLabel", label: "Texto cerrar", type: "text", default: "close" },
      { key: "note", label: "Nota del pie", type: "text", default: "Madrid, ES" },
    ],
    render: (p) => (
      <div className="ui-center">
        <FullscreenMenu
          brand={p.brand as string}
          openLabel={p.openLabel as string}
          closeLabel={p.closeLabel as string}
          note={p.note as string}
          links={[
            { label: "Proyectos", href: "#", meta: "04" },
            { label: "Estudio", href: "#", meta: "" },
            { label: "Contacto", href: "#", meta: "" },
          ]}
          footer={[{ label: "Instagram", href: "#" }, { label: "hola@estudio.example", href: "#" }]}
        />
      </div>
    ),
  },
  {
    id: "local-time",
    component: "LocalTime",
    path: "@/components/ui/LocalTime",
    name: "Hora local",
    category: "datos",
    styles: ["minimal", "terminal"],
    description: "«Madrid 14:32»: la hora de una ciudad, detalle habitual en estudios. Se pinta al montar, sin desajuste de hidratación.",
    stageHeight: 140,
    props: [
      { key: "city", label: "Ciudad", type: "text", default: "Madrid" },
      { key: "timeZone", label: "Zona IANA", type: "text", default: "Europe/Madrid" },
      { key: "seconds", label: "Segundos", type: "boolean", default: false },
    ],
    render: (p) => (
      <div className="ui-center" style={{ fontSize: 22 }}>
        <LocalTime city={p.city as string} timeZone={p.timeZone as string} seconds={p.seconds as boolean} />
      </div>
    ),
  },
];
