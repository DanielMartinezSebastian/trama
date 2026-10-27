"use client";

import CustomCursor from "@/components/ui/CustomCursor";
import FitText from "@/components/ui/FitText";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import LocalTime from "@/components/ui/LocalTime";
import Preloader from "@/components/ui/Preloader";
import OptionPicker from "@/components/ui/OptionPicker";
import ProjectList, { PROJECT_VIEWS, type ProjectView } from "@/components/ui/ProjectList";
import RollLink from "@/components/ui/RollLink";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SplitText, { SPLIT_BY, SPLIT_EFFECTS } from "@/components/ui/SplitText";
import { useEffect, useState } from "react";
import { photo } from "@/lib/sites/photos";
import type { CatalogEntry } from "../schema";

/** Piezas de movimiento y tipografía cinética (ver docs/06-indice-replicar-webs-premiadas.md). */
const PROJECTS = [
  { title: "Casa Alba", meta: "Interiorismo", year: "2026", image: photo("interiores", 4).src },
  { title: "Tinta y Sal", meta: "Identidad", year: "2026", image: photo("objetos", 4).src },
  { title: "Nodo", meta: "Producto", year: "2025", image: photo("estudio", 1).src },
  { title: "Faro Studio", meta: "Web + 3D", year: "2025", image: photo("arquitectura", 4).src },
  { title: "Ola", meta: "Campaña", year: "2024", image: photo("gastronomia", 1).src },
];

const VIEW_NAMES: Record<ProjectView, string> = { list: "Lista", grid: "Cuadrícula", index: "Índice" };

/** ProjectList con su selector de vista: un OptionPicker con números, como en 'kin. */
function ProjectsDemo(p: { view: ProjectView; preview: "follow" | "cursor" | "none"; numbered: boolean; follow: number; tilt: number; cursorLabel: string; picker: boolean }) {
  const [view, setView] = useState<ProjectView>(p.view);
  useEffect(() => setView(p.view), [p.view]);
  return (
    <div style={{ width: "100%", padding: 16, display: "grid", gap: 14 }}>
      {p.preview === "cursor" && <CustomCursor />}
      {p.picker && (
        <OptionPicker label="Vista" options={PROJECT_VIEWS.map((v, i) => ({ value: v, label: VIEW_NAMES[v], short: String(i + 1) }))} value={view} onChange={(v) => setView(v as ProjectView)} />
      )}
      <ProjectList items={PROJECTS.map((x) => ({ ...x, href: "#" }))} view={view} preview={p.preview} numbered={p.numbered} follow={p.follow} tilt={p.tilt} cursorLabel={p.cursorLabel} />
    </div>
  );
}

export const movimiento: CatalogEntry[] = [
  {
    id: "split-text",
    preview: (p) => p.trigger === "inview" || p.elastic === "scroll" ? "inview" : undefined,
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
      "effect=\"block\": una barra del color de acento tapa cada palabra y se retira descubriéndola (Lando Norris); con by=lines o words. emphasis pone las palabras entre *asteriscos* en la fuente de acento (titular mixto palo seco + serifa). Ver /sitios/volt.",
    ],
    props: [
      { key: "text", label: "Texto", type: "text", multiline: true, default: "Diseñamos webs que se sienten como una conversación y no como un folleto." },
      { key: "by", label: "Unidad", type: "select", default: "lines", options: SPLIT_BY, labels: { lines: "líneas", words: "palabras", chars: "letras" } },
      { key: "effect", label: "Efecto", type: "select", default: "rise", options: SPLIT_EFFECTS },
      { key: "emphasis", label: "Palabras *destacadas*", type: "boolean", default: false, hint: "entre asteriscos, en la fuente de acento y el color --acc" },
      { key: "mask", label: "Máscara de recorte", type: "boolean", default: true },
      { key: "trigger", label: "Disparador", type: "select", default: "mount", options: ["mount", "inview"] },
      { key: "stagger", label: "Escalonado (s)", type: "number", default: 0.1, min: 0.01, max: 0.4, step: 0.01 },
      { key: "duration", label: "Duración (s)", type: "number", default: 0.9, min: 0.2, max: 2.5, step: 0.1 },
      { key: "delay", label: "Retardo (s)", type: "number", default: 0, min: 0, max: 2, step: 0.1 },
      { key: "elastic", label: "Elástica", type: "select", default: "off", options: ["off", "pointer", "scroll"], labels: { off: "no", pointer: "con el puntero", scroll: "con el scroll" }, hint: "las letras se estiran (Mat Voyce, Uncommon); desactiva la máscara" },
      { key: "stretch", label: "Estirado", type: "number", default: 0.6, min: 0.2, max: 1.2, step: 0.1, when: (p) => p.elastic !== "off" },
    ],
    render: (p, { replay }) => (
      <div style={{ padding: 24, fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", maxWidth: 760 }}>
        <SplitText by={p.by as never} effect={p.effect as never} emphasis={p.emphasis as boolean} mask={p.mask as boolean} trigger={p.trigger as never} stagger={p.stagger as number} duration={p.duration as number} delay={p.delay as number} elastic={p.elastic === "off" ? undefined : (p.elastic as never)} stretch={p.stretch as number} playKey={replay}>
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
    description: "Enlace o botón cuyo texto sube y es sustituido por una copia igual al pasar el puntero o enfocar (el «rolling text» de Essor, Fenriz o K72). Con fade, la palabra que sale se funde. Solo CSS.",
    stageHeight: 200,
    props: [
      { key: "label", label: "Texto", type: "text", default: "Ver proyectos" },
      { key: "direction", label: "Dirección", type: "select", default: "up", options: ["up", "down"] },
      { key: "fade", label: "Fundido", type: "boolean", default: false },
      { key: "href", label: "Enlace (vacío = botón)", type: "text", default: "#" },
    ],
    render: (p) => (
      <div className="ui-center" style={{ fontSize: 28, fontWeight: 700 }}>
        <RollLink label={(p.label as string) || " "} direction={p.direction as never} fade={p.fade as boolean} href={(p.href as string) || undefined} />
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
      "Punto que persigue al puntero en toda la página y **se ve sobre cualquier fondo**: lee el fondo de debajo (claro, oscuro o imagen) y cambia de color, con un contorno de contraste. Se hace aro sobre enlaces (sin tapar el texto), muestra una etiqueta con data-cursor=\"Ver\", una **imagen** con data-cursor-img=\"/foto.jpg\" (así se compone el índice de proyectos con foto: ProjectList preview=\"cursor\"), se oculta con data-cursor=\"hide\" y es una barra en campos de texto. Solo con puntero fino.",
    stageHeight: 280,
    notes: ["Es global (position: fixed): en el catálogo actúa sobre toda la ventana mientras esta ficha está abierta.", "hideNative oculta el cursor del sistema, salvo en campos de texto."],
    props: [
      { key: "cursorSize", label: "Tamaño (px)", type: "number", default: 14, min: 6, max: 40, step: 1 },
      { key: "follow", label: "Seguimiento", type: "number", default: 0.18, min: 0.05, max: 1, step: 0.01 },
      { key: "blend", label: "Mezcla", type: "select", default: "none", options: ["none", "difference"], labels: { none: "se adapta al fondo", difference: "invertir lo de debajo" } },
      { key: "hideNative", label: "Ocultar cursor del sistema", type: "boolean", default: false },
      { key: "imageWidth", label: "Ancho de la imagen (px)", type: "number", default: 260, min: 120, max: 420, step: 10 },
      { key: "tilt", label: "Inclinación de la imagen (°)", type: "number", default: 6, min: 0, max: 20, step: 1 },
    ],
    render: (p) => (
      <div className="ui-center" style={{ gap: 24, flexWrap: "wrap" }}>
        <CustomCursor cursorSize={p.cursorSize as number} follow={p.follow as number} blend={p.blend as never} hideNative={p.hideNative as boolean} imageWidth={p.imageWidth as number} tilt={p.tilt as number} />
        <span className="ui-hint">Mueve el puntero por la página</span>
        <a href="#" data-cursor="Ver" style={{ padding: "28px 40px", border: "1px solid var(--ln)", borderRadius: 12 }} onClick={(e) => e.preventDefault()}>data-cursor=&quot;Ver&quot;</a>
        <a href="#" data-cursor-img={photo("interiores", 4).src} style={{ padding: "28px 40px", border: "1px solid var(--ln)", borderRadius: 12 }} onClick={(e) => e.preventDefault()}>data-cursor-img</a>
        <a href="#" style={{ padding: 12 }} onClick={(e) => e.preventDefault()}>un enlace</a>
        <input aria-label="Campo de ejemplo" placeholder="un campo de texto" style={{ padding: 10 }} />
      </div>
    ),
  },
  {
    id: "smooth-scroll",
    preview: "scroll",
    component: "SmoothScroll",
    path: "@/components/ui/SmoothScroll",
    name: "Scroll suave (Lenis)",
    category: "interaccion",
    styles: ["minimal"],
    description: "Scroll con inercia de toda la página, sincronizado con ScrollTrigger. No pinta nada. Se apaga con prefers-reduced-motion y en táctil.",
    stageHeight: 140,
    notes: [
      "Colócalo una vez, en el marco de la web. Pausar desde un menú o modal: lockScroll() de @/lib/motion/lenis.",
      "En el catálogo se activa dentro de una página independiente: el scroll suave no modifica los controles ni el menú del visor.",
    ],
    props: [
      { key: "lerp", label: "Inercia", type: "number", default: 0.1, min: 0.03, max: 0.3, step: 0.01 },
      { key: "wheelMultiplier", label: "Rueda ×", type: "number", default: 1, min: 0.3, max: 2.5, step: 0.1 },
      { key: "anchors", label: "Anclas suaves", type: "boolean", default: true },
      { key: "syncGsap", label: "Sincronizar con GSAP", type: "boolean", default: true },
    ],
    render: (p) => (
      <div>
        <SmoothScroll lerp={p.lerp as number} wheelMultiplier={p.wheelMultiplier as number} anchors={p.anchors as boolean} syncGsap={p.syncGsap as boolean} />
        {["Desplaza con inercia", "Cambia la sensación", "Vuelve al principio"].map((title, i) => <section key={title} id={`smooth-demo-${i}`} className="pg-preview__section"><h2>{title}</h2><p>Prueba la rueda o el trackpad y ajusta la inercia en los controles del catálogo.</p><a href={`#smooth-demo-${(i + 1) % 3}`}>Ir a la siguiente sección ↓</a></section>)}
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
      "Pantalla de entrada con contador, palabras o barra; bloquea el scroll, se salta con clic o Esc y avisa a SplitText para que sus textos entren al abrirse. Solo la primera visita de la pestaña por defecto. Para webs con 3D, carga real: baja los modelos contando bytes (assets), adelanta los fragmentos de JS de las escenas (modules) y espera a que el lienzo pinte (waitFor), con una animación propia (art).",
    stageHeight: 200,
    replayable: true,
    notes: [
      "Cubre toda la ventana (position: fixed). En el catálogo se lanza al pulsar «Repetir animación» con once=always.",
      "Carga real (Quilate, Ánima, Cota, Maravillas, Runa): assets={[\"/models/x.glb\"]} modules={[() => import(\"./scene\")]} waitFor={{ root: \".ui-pcloud__gl\", ready: \".is-on\" }} art={<svg…/>}; el arte lee var(--p) de 0 a 1.",
    ],
    props: [
      { key: "variant", label: "Variante", type: "select", default: "counter", options: ["counter", "words", "bar", "fill"], labels: { counter: "contador", words: "palabras", bar: "barra", fill: "la marca se rellena" } },
      { key: "brand", label: "Marca", type: "text", default: "Estudio" },
      { key: "meta", label: "Texto lateral", type: "text", default: "Madrid — 2026" },
      { key: "duration", label: "Duración (s)", type: "number", default: 2, min: 0.5, max: 5, step: 0.1 },
      { key: "exit", label: "Salida", type: "select", default: "curtain", options: ["curtain", "fade", "cut", "iris"], labels: { curtain: "cortina", fade: "fundido", cut: "corte seco (CRT)", iris: "iris" } },
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
    name: "Proyectos: lista, cuadrícula o índice con vista previa",
    category: "secciones",
    styles: ["minimal", "solid", "outline"],
    description:
      "Tres vistas (filas con título enorme, cuadrícula de imágenes o índice de texto) que se animan al cambiar (GSAP Flip, 'kin). En lista e índice, al pasar el puntero el resto se atenúa y aparece la foto: propia, que sigue al puntero con inclinación, o dentro de CustomCursor (preview=\"cursor\"). Con teclado se coloca en la fila enfocada; en táctil, miniatura bajo el título. El selector de vista no va dentro: se compone con un OptionPicker.",
    stageHeight: 640,
    props: [
      { key: "view", label: "Vista", type: "select", default: "list", options: PROJECT_VIEWS, labels: VIEW_NAMES },
      { key: "picker", label: "Selector de vista (OptionPicker)", type: "boolean", default: true },
      { key: "preview", label: "Vista previa", type: "select", default: "follow", options: ["follow", "cursor", "none"], labels: { follow: "imagen que sigue al puntero", cursor: "dentro de CustomCursor", none: "ninguna" } },
      { key: "numbered", label: "Numeración", type: "boolean", default: true },
      { key: "follow", label: "Seguimiento", type: "number", default: 0.14, min: 0.05, max: 1, step: 0.01 },
      { key: "tilt", label: "Inclinación máx. (°)", type: "number", default: 8, min: 0, max: 20, step: 1 },
      { key: "cursorLabel", label: "Etiqueta del cursor", type: "text", default: "Ver" },
    ],
    render: (p) => (
      <div style={{ width: "100%", padding: 16 }}>
        <ProjectsDemo view={p.view as ProjectView} picker={p.picker as boolean} preview={p.preview as never} numbered={p.numbered as boolean} follow={p.follow as number} tilt={p.tilt as number} cursorLabel={p.cursorLabel as string} />
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
      "Botón [menu] que abre un menú de pantalla completa: la cortina baja y los enlaces suben uno a uno. Si el botón está en un <header>, la cabecera NO se mueve: el menú se abre debajo y el mismo botón pasa a [close] sin cambiar de sitio ni de tamaño. Cierra con Esc, pausa el scroll sin que salte la página y deja inerte lo que queda tapado. Opciones: trigger=\"burger\" (icono que se cruza en ✕), triggerHover=\"fill\" (el acento baja desde arriba al pasar, como el botón de K72), cover (llega hasta arriba aunque haya cabecera, que queda encima), backdrop=\"blur\" (vidrio), align=\"center\" (enlaces centrados en la tipografía de titulares), rules (filetes que se dibujan), linkHover=\"marquee\" (la fila gira a una banda del acento con su frase corriendo, como K72) y reveal=\"stairs\" (se abre en escalera). Un enlace a la página actual («Inicio» en la portada) cierra y sube al principio; con el menú abierto, la ActionBar fija se aparta.",
    stageHeight: 200,
    props: [
      { key: "brand", label: "Marca", type: "text", default: "Estudio" },
      { key: "openLabel", label: "Texto abrir", type: "text", default: "menu" },
      { key: "closeLabel", label: "Texto cerrar", type: "text", default: "close" },
      { key: "note", label: "Nota del pie", type: "text", default: "Madrid, ES" },
      { key: "trigger", label: "Botón", type: "select", default: "label", options: ["label", "burger"], labels: { label: "[menu]", burger: "hamburguesa" } },
      { key: "triggerHover", label: "Botón al pasar", type: "select", default: "none", options: ["none", "fill"], labels: { none: "color", fill: "relleno que baja" } },
      { key: "backdrop", label: "Fondo", type: "select", default: "solid", options: ["solid", "blur"], labels: { solid: "sólido", blur: "vidrio" } },
      { key: "align", label: "Enlaces", type: "select", default: "start", options: ["start", "center"], labels: { start: "a la izquierda", center: "centrados" } },
      { key: "rules", label: "Filetes", type: "boolean", default: false },
      { key: "linkHover", label: "Al pasar", type: "select", default: "color", options: ["color", "marquee"], labels: { color: "color", marquee: "banda con marquesina" } },
      { key: "reveal", label: "Apertura", type: "select", default: "curtain", options: ["curtain", "stairs"], labels: { curtain: "cortina", stairs: "escalera" } },
    ],
    render: (p) => (
      <div className="ui-center">
        <FullscreenMenu
          trigger={p.trigger as never}
          triggerHover={p.triggerHover as never}
          backdrop={p.backdrop as never}
          align={p.align as never}
          rules={p.rules as boolean}
          linkHover={p.linkHover as never}
          reveal={p.reveal as never}
          brand={p.brand as string}
          openLabel={p.openLabel as string}
          closeLabel={p.closeLabel as string}
          note={p.note as string}
          links={[
            { label: "Proyectos", href: "#", meta: "04", marquee: "Lo que hemos hecho", images: ["/img/estudio/01-gadgets-on-a-desk-unsplash.jpg", "/img/estudio/04-workspace-unsplash.jpg"] },
            { label: "Estudio", href: "#", meta: "", marquee: "Quiénes somos" },
            { label: "Contacto", href: "#", meta: "", marquee: "Escríbenos" },
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
