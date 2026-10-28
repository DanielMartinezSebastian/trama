"use client";

import BentoGrid from "@/components/ui/BentoGrid";
import BigFooter from "@/components/ui/BigFooter";
import ImageReveal from "@/components/ui/ImageReveal";
import Parallax from "@/components/ui/Parallax";
import PinnedSection from "@/components/ui/PinnedSection";
import ScrubText from "@/components/ui/ScrubText";
import SectionIndex from "@/components/ui/SectionIndex";
import StackedCards from "@/components/ui/StackedCards";
import { fashionArt } from "@/lib/sites/art";
import type { CatalogEntry } from "../schema";

/** Scroll narrativo y composición editorial (ver docs/06-indice-replicar-webs-premiadas.md). */
const IMG = fashionArt(4, "coat");
const EDITORIAL_STYLES = ["editorial", "minimal"] as CatalogEntry["styles"];

export const scroll: CatalogEntry[] = [
  {
    id: "scrub-text",
    component: "ScrubText",
    path: "@/components/ui/ScrubText",
    name: "Texto que se enciende con el scroll",
    category: "texto",
    styles: EDITORIAL_STYLES,
    description: "Párrafo cuyas palabras pasan de apagadas a plenas según haces scroll. Un cálculo por fotograma, sin GSAP; el lector de pantalla lo lee entero.",
    stageHeight: 380,
    notes: ["Depende del scroll de la página: en el catálogo avanza al desplazar la ventana. Ver el efecto completo en /sitios/estudio.", "Dentro de un PinnedSection el párrafo no se mueve: usa scope=\".ui-pin\" y range={[a, b]} para que se encienda en ese tramo de la sección (portada de /sitios/plano)."],
    props: [
      { key: "text", label: "Texto", type: "text", multiline: true, default: "Una web es un lugar, no un folleto. Cuidamos cómo se entra, cómo se recorre y qué se siente al salir." },
      { key: "dim", label: "Opacidad apagada", type: "number", default: 0.3, min: 0.05, max: 0.6, step: 0.01 },
      { key: "from", label: "Empieza (fracción de ventana)", type: "number", default: 0.85, min: 0.4, max: 1, step: 0.05 },
      { key: "to", label: "Termina (fracción de ventana)", type: "number", default: 0.35, min: 0, max: 0.8, step: 0.05 },
    ],
    render: (p) => (
      <div style={{ padding: 24, fontSize: "clamp(22px, 3.4vw, 40px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.03em", maxWidth: 760 }}>
        <ScrubText dim={p.dim as number} from={p.from as number} to={p.to as number}>{(p.text as string) || " "}</ScrubText>
      </div>
    ),
  },
  {
    id: "hide-on-scroll",
    component: "HideOnScroll",
    path: "@/components/ui/HideOnScroll",
    name: "Cabecera que se esconde al bajar",
    category: "navegacion",
    styles: EDITORIAL_STYLES,
    description: "Envoltorio de cabeceras fijas: se esconde al bajar, vuelve al subir o llegar arriba, y no se esconde si un descendiente tiene el foco ni con movimiento reducido.",
    stageHeight: 140,
    notes: ["Va fijo arriba de la ventana; en el catálogo solo se muestra su uso. Ver en /sitios/estudio."],
    props: [{ key: "offset", label: "Scroll antes de esconderse (px)", type: "number", default: 120, min: 0, max: 600, step: 10 }],
    children: "<nav>…tu cabecera…</nav>",
    render: () => (
      <div className="ui-center">
        <span className="ui-hint">Se esconde al bajar la página y vuelve al subir. Ver /sitios/estudio</span>
      </div>
    ),
  },
  {
    id: "section-index",
    component: "SectionIndex",
    path: "@/components/ui/SectionIndex",
    name: "Indicador de sección",
    category: "navegacion",
    styles: EDITORIAL_STYLES,
    description: "«02 / 05 · Servicios» fijo en una esquina, siguiendo la sección que cruza la mitad de la pantalla. Marca tus secciones con data-section.",
    stageHeight: 140,
    notes: ["Necesita secciones con data-section en la página; en el catálogo no hay ninguna. Ver en /sitios/estudio."],
    props: [
      { key: "position", label: "Posición", type: "select", default: "left", options: ["left", "right"] },
      { key: "selector", label: "Selector de secciones", type: "text", default: "[data-section]" },
    ],
    render: (p) => (
      <div className="ui-center">
        <SectionIndex position={p.position as never} selector={p.selector as string} />
        <span className="ui-hint">Marca tus secciones con data-section=&quot;Nombre&quot;</span>
      </div>
    ),
  },
  {
    id: "pinned-section",
    component: "PinnedSection",
    path: "@/components/ui/PinnedSection",
    name: "Sección fijada con progreso",
    category: "transiciones",
    styles: EDITORIAL_STYLES,
    description: "Se queda fija mientras haces scroll y publica su progreso (0 → 1) en la variable CSS --pin-p para que los hijos se muevan, cambien de opacidad o se recorten con ella. position: sticky, sin GSAP.",
    stageHeight: 140,
    notes: ["Ejemplo de CSS: .titulo { transform: translateX(calc(var(--pin-p) * -40vw)); }", "Ocupa (length + 1) alturas de ventana en el documento."],
    props: [{ key: "length", label: "Pantallas de recorrido", type: "number", default: 2, min: 1, max: 8, step: 0.5 }],
    children: '<h2 className="titulo">Título</h2>',
    render: () => (
      <div className="ui-center">
        <PinnedSection length={1}><span /></PinnedSection>
        <span className="ui-hint">Fija su contenido y publica --pin-p. Ver el uso en el código.</span>
      </div>
    ),
  },
  {
    id: "horizontal-scroll",
    component: "HorizontalScroll",
    path: "@/components/ui/HorizontalScroll",
    name: "Scroll horizontal",
    category: "galerias",
    styles: EDITORIAL_STYLES,
    description: "El scroll vertical de la página desplaza una fila de paneles en horizontal. En pantallas estrechas y con movimiento reducido pasa a ser un carrusel nativo con imán, sin secuestrar el scroll.",
    stageHeight: 140,
    notes: ["Cada hijo directo es un panel. Ver en /sitios/estudio (sección «Cómo trabajamos»).", "También publica --hs-p (0 → 1)."],
    props: [
      { key: "heading", label: "Texto fijo", type: "text", default: "Cómo trabajamos" },
      { key: "gap", label: "Espacio entre paneles (px)", type: "number", default: 24, min: 0, max: 80, step: 2 },
      { key: "minWidth", label: "Ancho mínimo para fijar (px)", type: "number", default: 860, min: 320, max: 1400, step: 20 },
    ],
    children: "<article>Panel 1</article>\n<article>Panel 2</article>\n<article>Panel 3</article>",
    render: () => (
      <div className="ui-center">
        <span className="ui-hint">Ocupa la ventana entera mientras dura el recorrido. Ver /sitios/estudio</span>
      </div>
    ),
  },
  {
    id: "stacked-cards",
    component: "StackedCards",
    path: "@/components/ui/StackedCards",
    name: "Tarjetas apiladas",
    category: "tarjetas",
    styles: ["editorial", "solid", "minimal"],
    description: "Cada tarjeta se pega arriba y la siguiente la cubre al hacer scroll. position: sticky puro; las cubiertas se encogen un poco donde hay animaciones ligadas al scroll.",
    stageHeight: 360,
    notes: ["Las tarjetas necesitan fondo opaco para tapar a las anteriores."],
    props: [
      { key: "top", label: "Distancia al borde (px)", type: "number", default: 24, min: 0, max: 200, step: 4 },
      { key: "step", label: "Asomo entre tarjetas (px)", type: "number", default: 16, min: 0, max: 60, step: 2 },
      { key: "gap", label: "Espacio de scroll (vh)", type: "number", default: 14, min: 4, max: 40, step: 2 },
      { key: "shrink", label: "Encoger las cubiertas", type: "boolean", default: true },
    ],
    children: "<article>Tarjeta 1</article>\n<article>Tarjeta 2</article>\n<article>Tarjeta 3</article>",
    render: (p) => (
      <div style={{ width: "100%", padding: 16 }}>
        <StackedCards top={p.top as number} step={p.step as number} gap={p.gap as number} shrink={p.shrink as boolean}>
          {["Estrategia", "Diseño", "Código"].map((t, i) => (
            <article key={t} style={{ background: "var(--bg)", border: "1px solid var(--ln)", padding: 28, minHeight: 160, display: "grid", alignContent: "space-between" }}>
              <span style={{ color: "var(--mut)" }}>0{i + 1}</span>
              <b style={{ fontSize: 32, letterSpacing: "-0.04em" }}>{t}</b>
            </article>
          ))}
        </StackedCards>
      </div>
    ),
  },
  {
    id: "parallax",
    component: "Parallax",
    path: "@/components/ui/Parallax",
    name: "Parallax",
    category: "transiciones",
    styles: EDITORIAL_STYLES,
    description: "Mueve su contenido a distinto ritmo que el scroll (profundidad). Sin GSAP; se apaga con movimiento reducido. Para imágenes: el contenedor recorta y el hijo es más alto.",
    stageHeight: 300,
    props: [{ key: "speed", label: "Velocidad (−0,5 a 0,5)", type: "number", default: 0.15, min: -0.5, max: 0.5, step: 0.01 }],
    children: '<img src="…" alt="" />',
    render: (p) => (
      <div className="ui-center">
        <div style={{ width: 220, height: 220, overflow: "clip", border: "1px solid var(--ln)" }}>
          <Parallax speed={p.speed as number}>
            <div style={{ height: 320, background: "linear-gradient(160deg, var(--acc), var(--bg))" }} />
          </Parallax>
        </div>
        <span className="ui-hint">Haz scroll en la página para ver el desplazamiento</span>
      </div>
    ),
  },
  {
    id: "image-reveal",
    component: "ImageReveal",
    path: "@/components/ui/ImageReveal",
    name: "Imagen que se descubre",
    category: "galerias",
    styles: ["editorial", "minimal", "solid"],
    description: "Imagen que se abre con una máscara (clip-path) mientras se asienta de una ampliación a su tamaño. Reserva su hueco con ratio y espera al Preloader.",
    stageHeight: 380,
    replayable: true,
    props: [
      { key: "from", label: "Se abre desde", type: "select", default: "bottom", options: ["bottom", "top", "left", "right", "center"] },
      { key: "ratio", label: "Relación de aspecto", type: "text", default: "4 / 5" },
      { key: "zoom", label: "Ampliación inicial", type: "number", default: 1.25, min: 1, max: 2, step: 0.05 },
      { key: "duration", label: "Duración (s)", type: "number", default: 1.2, min: 0.3, max: 3, step: 0.1 },
    ],
    render: (p, { replay }) => (
      <div style={{ width: "min(100%, 280px)", padding: 16 }}>
        <ImageReveal key={replay} src={IMG} from={p.from as never} ratio={p.ratio as string} zoom={p.zoom as number} duration={p.duration as number} />
      </div>
    ),
  },
  {
    id: "bento-grid",
    component: "BentoGrid",
    path: "@/components/ui/BentoGrid",
    name: "Rejilla bento",
    category: "tarjetas",
    styles: ["editorial", "glass", "solid", "outline", "minimal"],
    description: "Celdas de distinto tamaño (1×1, 2×1, 1×2, 2×2) que encajan sin huecos. CSS puro; cada celda admite título, texto, cifra grande o imagen de fondo.",
    stageHeight: 520,
    props: [
      { key: "columns", label: "Columnas", type: "select", default: "4", options: ["2", "3", "4"] },
      { key: "variant", label: "Variante de estilo", type: "select", default: "editorial", options: ["glass", "solid", "outline", "neon", "retro", "terminal", "minimal", "dotmatrix", "editorial"] },
    ],
    render: (p) => (
      <div style={{ width: "100%", padding: 16 }}>
        <BentoGrid
          columns={Number(p.columns) as 2 | 3 | 4}
          variant={p.variant as never}
          cells={[
            { title: "Años", stat: "12" },
            { title: "Un estudio pequeño", text: "Nueve personas, sin capas.", span: "2x1" },
            { title: "Proyectos", stat: "86" },
            { title: "Casa Alba", image: IMG, span: "2x2", href: "#" },
            { title: "Premios", stat: "3" },
            { title: "Hablemos", text: "Cuéntanos qué tienes.", span: "2x1", href: "#" },
          ]}
        />
      </div>
    ),
  },
  {
    id: "big-footer",
    component: "BigFooter",
    path: "@/components/ui/BigFooter",
    name: "Pie de página grande",
    category: "secciones",
    styles: EDITORIAL_STYLES,
    description: "Correo grande, enlaces que ruedan y un titular que llena el ancho, con los colores del tema invertidos. Compone FitText, RollLink y LocalTime.",
    stageHeight: 520,
    props: [
      { key: "heading", label: "Titular", type: "text", default: "Hablemos." },
      { key: "lead", label: "Frase", type: "text", default: "¿Tienes un proyecto?" },
      { key: "email", label: "Correo", type: "text", default: "hola@estudio.example" },
      { key: "note", label: "Nota izquierda", type: "text", default: "© 2026 Estudio" },
      { key: "credit", label: "Nota derecha", type: "text", default: "Hecho con Trama" },
      { key: "city", label: "Ciudad (hora local)", type: "text", default: "Madrid" },
    ],
    render: (p) => (
      <div style={{ width: "100%" }}>
        <BigFooter heading={p.heading as string} lead={p.lead as string} email={p.email as string} note={p.note as string} credit={p.credit as string} city={p.city as string} links={[{ label: "Proyectos", href: "#" }, { label: "Estudio", href: "#" }, { label: "Contacto", href: "#" }]} />
      </div>
    ),
  },
];
