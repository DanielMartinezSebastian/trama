"use client";

import { startTransition, useEffect, useId, useRef, useState } from "react";
import ElementTransition from "@/components/ui/ElementTransition";
import PageTransition, {
  NAV_BACK,
  NAV_FORWARD,
  DIRECTIONAL_TRANSITION_KINDS,
  PAGE_TRANSITION_KINDS,
  PageTransitionPersist,
  markPageTransition,
  type PageTransitionDirection,
  type PageTransitionKind,
} from "@/components/ui/PageTransition";
import Panel from "@/components/ui/Panel";
import Presence, { PRESENCE_EFFECTS } from "@/components/ui/Presence";
import Reveal, { REVEAL_KINDS, type RevealDirection, type RevealEasing, type RevealKind } from "@/components/ui/Reveal";
import SceneFlash from "@/components/ui/SceneFlash";
import SharedText from "@/components/ui/SharedText";
import Traveler, { TravelSlot, TravelStage, useTraveler, type TravelBlend, type TravelFit } from "@/components/ui/Traveler";
import { video } from "@/lib/sites/videos";
import { vcls } from "@/components/ui/variants";
import { CHARSETS } from "@/lib/ui/fx";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, variantProp } from "./shared";

const CHAR_OPTIONS = Object.keys(CHARSETS);

/** `direction` de las familias con dirección; «auto» = sin la prop (`down` en scan, `left` en el resto). */
const directionProp = {
  key: "direction",
  label: "Dirección (slide, wipe, scan, stack)",
  type: "select",
  default: "auto",
  options: ["auto", "left", "right", "up", "down"],
  labels: { auto: "sin indicar (down en scan, left en el resto)" },
  when: (p: Record<string, unknown>) => (DIRECTIONAL_TRANSITION_KINDS as readonly unknown[]).includes(p.kind),
} as const;
const dirOf = (v: unknown) => (v === "auto" ? undefined : (v as PageTransitionDirection));
const isAscii = (p: Record<string, unknown>) => String(p.effect).startsWith("ascii-");

/** Páginas de la mini web del ejemplo de PageTransition. */
const VT_PAGES = [
  { title: "Inicio", lines: ["> sistema listo", "Tres páginas de ejemplo para probar la transición.", "Usa las pestañas o Anterior / Siguiente."] },
  { title: "Proyectos", lines: ["> ls proyectos/", "01  cartografía ASCII", "02  sintetizador en el navegador", "03  tipografía de matriz de puntos"] },
  { title: "Contacto", lines: ["> contacto --abrir", "Escríbeme y te respondo en un par de días.", "hola@ejemplo.dev"] },
];

type VtDemoProps = {
  kind: PageTransitionKind;
  direction?: PageTransitionDirection;
  pace: "fast" | "normal" | "slow";
  tone: "acc" | "acc2" | "fg";
  replay: number;
  /** `page`: PageTransition (anima la ventana entera); `element`: ElementTransition (solo la caja de la página) */
  scope: "page" | "element";
};

/**
 * Mini web con cabecera fija y tres páginas: cada cambio de página va dentro de `startTransition` con su tipo
 * (`nav-forward` / `nav-back` o ninguno), igual que una navegación del App Router con `<Link transitionTypes>`.
 * Con `scope="page"` se anima la ventana entera, como en una web real (la cabecera del sitio y la de la mini web quedan
 * quietas); con `scope="element"`, solo la caja del contenido.
 */
function PageTransitionDemo({ kind, direction, pace, tone, replay, scope }: VtDemoProps) {
  const [page, setPage] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const name = `pg-vt-head-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  // Los pseudo-elementos de la transición heredan de <html>, no del escenario: se copian ahí los tokens del tema elegido.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    const cs = getComputedStyle(el);
    const keys = ["--acc", "--acc2", "--fg", "--mut"];
    const prev = keys.map((k) => html.style.getPropertyValue(k));
    const prevPage = html.style.getPropertyValue("--ui-vt-page");
    keys.forEach((k) => html.style.setProperty(k, cs.getPropertyValue(k)));
    html.style.setProperty("--ui-vt-page", cs.getPropertyValue("--bg"));
    return () => {
      keys.forEach((k, i) => (prev[i] ? html.style.setProperty(k, prev[i]) : html.style.removeProperty(k)));
      if (prevPage) html.style.setProperty("--ui-vt-page", prevPage);
      else html.style.removeProperty("--ui-vt-page");
    };
  });

  const go = (to: number, type?: string) =>
    startTransition(() => {
      if (type) markPageTransition(type);
      setPage((to + VT_PAGES.length) % VT_PAGES.length);
    });

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    go(page + 1, NAV_FORWARD);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al pulsar «Repetir animación»
  }, [replay]);

  const p = VT_PAGES[page];
  const content = (
    <section className="pg-vt__page">
      <h3>{p.title}</h3>
      {p.lines.map((l) => (
        <p key={l}>{l}</p>
      ))}
    </section>
  );
  return (
    <div ref={root} className="pg-vt">
      <PageTransitionPersist name={name}>
        <nav className="pg-vt__nav" aria-label="Páginas del ejemplo">
          <strong>mi-web</strong>
          {VT_PAGES.map((x, i) => (
            <button key={x.title} type="button" className={i === page ? "is-on" : ""} aria-current={i === page ? "page" : undefined} onClick={() => i !== page && go(i)}>
              {x.title}
            </button>
          ))}
        </nav>
      </PageTransitionPersist>
      {scope === "page" ? (
        <PageTransition key={page} kind={kind} direction={direction} pace={pace} tone={tone}>
          {content}
        </PageTransition>
      ) : (
        <ElementTransition key={page} kind={kind} direction={direction} pace={pace} tone={tone}>
          {content}
        </ElementTransition>
      )}
      <div className="pg-vt__pager">
        <button type="button" onClick={() => go(page - 1, NAV_BACK)}>
          ← Anterior <span>nav-back</span>
        </button>
        <button type="button" onClick={() => go(page + 1, NAV_FORWARD)}>
          Siguiente → <span>nav-forward</span>
        </button>
      </div>
    </div>
  );
}

/** Sitios del ejemplo de Traveler: el mismo vídeo cambia de caja sin volver a empezar. */
const TRAVEL_SPOTS = [
  { at: "tarjeta", label: "Tarjeta" },
  { at: "lateral", label: "Columna" },
  { at: "cine", label: "Cine" },
  { at: "pildora", label: "Píldora" },
] as const;

function TravelerTag({ id }: { id: string }) {
  const at = useTraveler(id);
  return <span className="pg-travel__tag">{at ?? "—"}</span>;
}

/**
 * Mini página con cuatro huecos para el mismo viajero: cada botón monta otro hueco dentro de `startTransition` y el
 * navegador lleva el vídeo, en directo, de una caja a otra. En una web, los huecos están en páginas distintas.
 */
function TravelerDemo({ fit, blend, pace }: { fit: TravelFit; blend: TravelBlend; pace: "fast" | "normal" | "slow" }) {
  const [spot, setSpot] = useState<(typeof TRAVEL_SPOTS)[number]["at"]>("tarjeta");
  const id = `demo${useId().replace(/[^a-zA-Z0-9]/g, "")}`; // único: el comparador monta varias copias a la vez
  const clip = video("oceano", 0);
  const slot = <TravelSlot key={spot} id={id} at={spot} className={`pg-travel__slot pg-travel__slot--${spot}`} as={spot === "pildora" ? "span" : "div"} />;
  return (
    <TravelStage className="pg-travel">
      <div className="pg-travel__bar" role="group" aria-label="Hueco del vídeo">
        {TRAVEL_SPOTS.map((s) => (
          <button key={s.at} type="button" aria-pressed={spot === s.at} onClick={() => startTransition(() => setSpot(s.at))}>
            {s.label}
          </button>
        ))}
        <TravelerTag id={id} />
      </div>
      <Traveler id={id} fit={fit} blend={blend} pace={pace} className="pg-travel__rider">
        <video src={clip.src} poster={clip.posterSrc} muted loop playsInline autoPlay aria-label={clip.alt} />
      </Traveler>
      <div className={`pg-travel__page pg-travel__page--${spot}`}>
        {spot === "cine" && slot}
        <div className="pg-travel__main">
          {spot === "pildora" ? (
            <p className="pg-travel__title">Hablemos {slot} del mar</p>
          ) : (
            <>
              <p className="pg-travel__title">Documentales de mar</p>
              <div className="pg-travel__cards">
                {spot === "tarjeta" ? slot : <span className="pg-travel__ph" />}
                <span className="pg-travel__ph" />
                <span className="pg-travel__ph" />
              </div>
            </>
          )}
        </div>
        {spot === "lateral" && <aside className="pg-travel__aside">{slot}</aside>}
      </div>
    </TravelStage>
  );
}

/**
 * Mini página con dos vistas del mismo texto: pequeño en la esquina (como la marca de una cabecera) y titular gigante.
 * Cada cambio va dentro de `startTransition`, como una navegación: las palabras vuelan de una caja a otra, escalonadas.
 */
function SharedTextDemo({ text, stagger, pace }: { text: string; stagger: number; pace: "fast" | "normal" | "slow" }) {
  const [big, setBig] = useState(false);
  const name = `demo-st${useId().replace(/[^a-zA-Z0-9]/g, "")}`; // único: el comparador monta varias copias a la vez
  return (
    <div className="pg-stext">
      <div className="pg-stext__bar">
        <button type="button" aria-pressed={!big} onClick={() => startTransition(() => setBig(false))}>Esquina</button>
        <button type="button" aria-pressed={big} onClick={() => startTransition(() => setBig(true))}>Titular</button>
      </div>
      {big ? (
        <SharedText key="big" as="h3" name={name} text={text} stagger={stagger} pace={pace} className="pg-stext__big" />
      ) : (
        <SharedText key="small" name={name} text={text} stagger={stagger} pace={pace} className="pg-stext__small" />
      )}
    </div>
  );
}

export const transiciones: CatalogEntry[] = [
  {
    id: "scene-flash",
    component: "SceneFlash",
    path: "@/components/ui/SceneFlash",
    name: "Transición de escena",
    category: "transiciones",
    styles: ["neon", "retro", "minimal", "outline", "dotmatrix"],
    description: "Barrido, iris, rebanadas, persianas o mosaico de píxeles para acompañar un cambio de sección. Usa --acc y --acc2.",
    stageHeight: 300,
    replayable: true,
    props: [
      { key: "kind", label: "Tipo", type: "select", default: "sweep", options: ["sweep", "iris", "slices", "blinds", "pixels"] },
      { key: "duration", label: "Duración (s)", type: "number", default: 1, min: 0.3, max: 3, step: 0.1 },
      { key: "loop", label: "En bucle", type: "boolean", default: false },
    ],
    render: (p, { replay }) => (
      <>
        <div className="ui-center">
          <span className="ui-hint">Pulsa «Repetir animación» o activa el bucle</span>
        </div>
        <SceneFlash kind={p.kind as never} duration={p.duration as number} loop={p.loop as boolean} playKey={replay} />
      </>
    ),
  },
  {
    id: "page-transition",
    component: "PageTransition",
    path: "@/components/ui/PageTransition",
    name: "Transición de página",
    category: "transiciones",
    styles: ALL_STYLES,
    description:
      "Anima la ventana entera al navegar (todo salvo la cabecera y lo que envuelvas en PageTransitionPersist) con la View Transitions API y el <ViewTransition> de React, sin configurar en el App Router de Next: fundido, deslizamiento, barrido de color, línea de escaneo, pila de barras, persianas, disolución por píxeles, encendido CRT, glitch, iris o escritura de terminal. CSS puro con los tokens del tema; una animación fija o una por tipo de navegación.",
    stageHeight: 380,
    replayable: true,
    children: "{/* contenido de la página */}",
    notes: [
      "Anima la raíz del documento (::view-transition-old/new(root)): fondos fijos, pie y márgenes incluidos. En este ejemplo, al cambiar de página se anima toda la ventana del catálogo; las cabeceras quedan quietas.",
      "Va en cada page.tsx (o en un template.tsx), nunca en un layout. La animación la elige la página de destino. Sin nodos extra en el DOM.",
      "`scan`: una línea brillante del color `tone` recorre la pantalla (de arriba abajo por defecto) y deja detrás la página nueva, sin apagado CRT. `stack`: una pila de barras de grandes a pequeñas (--acc, --acc2 y su mezcla) tapa la página, se comprime y se va por el lado de `direction`.",
      "Tipos de navegación: `nav-forward` usa `kind` con `direction` y `nav-back` la dirección contraria (`slide`, `wipe`, `scan`, `stack`; sin `direction` —«auto» en este catálogo—, `down` en scan y `left` en el resto); `trama-<animación>` (p. ej. `trama-glitch`, o `pageTransitionType(\"glitch\")`) elige la animación de esa navegación; `types={{ \"mi-tipo\": \"iris\" }}` añade los tuyos. En Next: `<Link transitionTypes={[NAV_FORWARD]}>`.",
      "Cabecera, barra o cualquier elemento fijo que deba quedarse quieto: envuélvelo en `<PageTransitionPersist name=\"cabecera\">` (un `name` único por elemento).",
      "Los pseudo-elementos de la transición heredan de <html>: los tokens (--acc, --acc2, --fg, --bg) se leen de :root. Si tu tema vive en un contenedor, repite ahí --acc y el fondo (--ui-vt-page).",
      "Con «reducir movimiento», solo un fundido de 120 ms. Sin soporte (React sin ViewTransition, navegador sin la API) la página cambia sin animar.",
    ],
    props: [
      { key: "kind", label: "Animación", type: "select", default: "fade", options: PAGE_TRANSITION_KINDS },
      directionProp,
      { key: "pace", label: "Ritmo", type: "select", default: "normal", options: ["fast", "normal", "slow"], labels: { fast: "rápido (240 ms)", normal: "normal (380 ms)", slow: "lento (560 ms)" } },
      { key: "tone", label: "Color del efecto", type: "select", default: "acc", options: ["acc", "acc2", "fg"] },
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <PageTransitionDemo scope="page" kind={p.kind as PageTransitionKind} direction={dirOf(p.direction)} pace={p.pace as never} tone={p.tone as never} replay={replay} />
      </div>
    ),
  },
  {
    id: "element-transition",
    component: "ElementTransition",
    path: "@/components/ui/ElementTransition",
    name: "Transición de elemento",
    category: "transiciones",
    styles: ALL_STYLES,
    description:
      "Las mismas 11 animaciones de PageTransition, pero sobre la caja de un elemento suelto (una tarjeta, un panel, el contenido de una pestaña) cuando entra o sale dentro de una transición de React. Incluye SharedTransition para elementos compartidos que se transforman de una vista a otra.",
    stageHeight: 380,
    replayable: true,
    children: "{/* el elemento que entra o sale */}",
    notes: [
      "Anima al montarse o desmontarse dentro de `startTransition`, una navegación o un `<Suspense>`: para cambiar de contenido, cambia su `key`. Sin nodos extra en el DOM.",
      "Mismos `kind`, `direction`, `pace`, `tone` y `types` que PageTransition, y los mismos tipos de transición (`nav-forward`, `nav-back`, `trama-<animación>`).",
      "Elemento compartido: `<SharedTransition name={`foto-${id}`}>` en la miniatura del listado y en la imagen de la ficha; al navegar de una a otra, el navegador la transforma de una caja a la otra por encima de la animación de página. `fit=\"cover\"` si las dos cajas tienen distinta proporción; `layout` para que también se deslice al reordenar o filtrar en la misma vista.",
      "React no forma la pareja si el elemento de la vista de salida estaba fuera del viewport (una tarjeta por debajo del pliegue): entonces solo cambia de página.",
      "Con «reducir movimiento», solo un fundido de 120 ms. Sin soporte, el cambio es inmediato.",
    ],
    props: [
      { key: "kind", label: "Animación", type: "select", default: "fade", options: PAGE_TRANSITION_KINDS },
      directionProp,
      { key: "pace", label: "Ritmo", type: "select", default: "normal", options: ["fast", "normal", "slow"], labels: { fast: "rápido (240 ms)", normal: "normal (380 ms)", slow: "lento (560 ms)" } },
      { key: "tone", label: "Color del efecto", type: "select", default: "acc", options: ["acc", "acc2", "fg"] },
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <PageTransitionDemo scope="element" kind={p.kind as PageTransitionKind} direction={dirOf(p.direction)} pace={p.pace as never} tone={p.tone as never} replay={replay} />
      </div>
    ),
  },
  {
    id: "shared-text",
    component: "SharedText",
    path: "@/components/ui/SharedText",
    name: "Texto que viaja palabra a palabra",
    category: "transiciones",
    styles: ALL_STYLES,
    description:
      "El mismo texto en dos vistas (la marca pequeña de la cabecera y el titular gigante de otra página, o el título de un índice y el de su ficha): al cambiar de una a otra, cada palabra vuela a su sitio nuevo con un retraso escalonado, por encima de todo. View Transitions API; el tamaño y el color los pone el CSS de cada vista.",
    stageHeight: 340,
    notes: [
      "Mismo `name` y mismo `text` en las dos vistas; cada palabra se llama `${name}-0`, `${name}-1`… y tiene que ser única en cada página.",
      "Anima en una navegación o dentro de `startTransition` (como en este ejemplo). Las palabras van con z-index 130: por encima de la página, de los fijos y de un `Traveler` (un titular sobre su vídeo).",
      "React no forma la pareja si la palabra de la vista de salida estaba fuera del viewport: entonces solo cambia.",
      "Cada palabra lleva `ui-stext__w--<n>` para darle estilo propio (la segunda en cursiva, por ejemplo). Los lectores de pantalla leen el texto entero una vez.",
      "Demo: /sitios/travesia (título del índice → titular de la ficha, y la marca de la cabecera → titular de la productora).",
    ],
    props: [
      { key: "text", label: "Texto", type: "text", default: "Travesía Documental" },
      { key: "stagger", label: "Escalonado (ms)", type: "number", default: 50, min: 0, max: 200, step: 10 },
      { key: "pace", label: "Ritmo", type: "select", default: "slow", options: ["fast", "normal", "slow"], labels: { fast: "rápido (240 ms)", normal: "normal (380 ms)", slow: "lento (560 ms)" } },
    ],
    render: (p) => <SharedTextDemo text={p.text as string} stagger={p.stagger as number} pace={p.pace as never} />,
  },
  {
    id: "traveler",
    component: "Traveler",
    path: "@/components/ui/Traveler",
    name: "Elemento que viaja entre rutas",
    category: "transiciones",
    styles: ALL_STYLES,
    description:
      "Un elemento que no desaparece al navegar: vive en el layout (TravelStage) y cada página marca con TravelSlot la caja que ocupa en ella. Al cambiar de ruta, el navegador lo lleva de una caja a otra (posición, tamaño y proporción) con la View Transitions API, con el contenido en directo: un vídeo sigue sonando, un lienzo sigue animando. Para reproductores que se encogen a una esquina, marcas que pasan del titular a la cabecera o una imagen que crece hasta ser la portada.",
    stageHeight: 460,
    children: "{/* lo que viaja: un <video>, un lienzo, la marca… */}",
    notes: [
      "En una web: `<TravelStage>` en el layout envolviendo a los `<Traveler id=\"reel\">` y a `{children}`; en cada página, `<TravelSlot id=\"reel\" at=\"mini\" className=\"…\" />` con el tamaño y el sitio por CSS. La página que no tenga hueco lo deja invisible e inerte (sigue vivo).",
      "El viajero lleva `data-at` con el nombre del hueco: su CSS cambia de aspecto en cada sitio (esquinas, controles). `useTraveler(id)` da ese nombre en React; `onMove` avisa al cambiar.",
      "`blend=\"live\"` (por defecto) muestra solo el estado nuevo, en directo, cambiando de caja: ideal para vídeo y lienzos. `crossfade` funde el viejo con el nuevo (si el contenido cambia de forma). `fit=\"cover\"` recorta si cambia la proporción; `stretch` estira (texto o SVG con la misma proporción).",
      "Huecos `position: fixed` (mini reproductor en una esquina, cabecera fija) y dentro de `sticky` funcionan. Con varios huecos a la vez gana el de mayor `priority`.",
      "Dentro de una misma página (modo cine, ampliar): monta otro hueco dentro de `startTransition`, como en este ejemplo.",
      "Con «reducir movimiento», cambia de sitio con un fundido de 120 ms. Sin la API, salta de caja sin animar. Demo completa: /sitios/travesia.",
    ],
    props: [
      { key: "fit", label: "Proporción distinta", type: "select", default: "cover", options: ["cover", "stretch"], labels: { cover: "recortar (cover)", stretch: "estirar (stretch)" } },
      { key: "blend", label: "Imagen del viaje", type: "select", default: "live", options: ["live", "crossfade"], labels: { live: "en directo (live)", crossfade: "fundido (crossfade)" } },
      { key: "pace", label: "Ritmo", type: "select", default: "normal", options: ["fast", "normal", "slow"], labels: { fast: "rápido (420 ms)", normal: "normal (640 ms)", slow: "lento (900 ms)" } },
    ],
    render: (p) => <TravelerDemo fit={p.fit as TravelFit} blend={p.blend as TravelBlend} pace={p.pace as never} />,
  },
  {
    id: "reveal",
    preview: (p) => p.trigger !== "mount" ? "inview" : undefined,
    component: "Reveal",
    path: "@/components/ui/Reveal",
    name: "Revelado de contenido",
    category: "transiciones",
    styles: ALL_STYLES,
    description:
      "Revela lo que envuelve al montar, al entrar en pantalla o siguiendo el scroll: 7 efectos × 4 direcciones, escalonado de hijos o de palabras/letras, curvas con rebote y repetición al volver a entrar.",
    stageHeight: 460,
    replayable: true,
    children: "<Card />\n<Card />\n<Card />",
    notes: [
      "Con «inview» y «scroll», desplaza el escenario: el contenido empieza debajo.",
      "«stagger» escalona los hijos directos (aquí, las tres tarjetas); «split» trocea un texto plano (aquí, el titular).",
      "El estado oculto viene en el HTML del servidor: no hay parpadeo antes de hidratar. Sin JS o con movimiento reducido se ve directamente.",
      "Al terminar no deja transform/filter/clip-path: un Modal o Drawer dentro sigue funcionando.",
    ],
    props: [
      { key: "kind", label: "Efecto", type: "select", default: "slide", options: REVEAL_KINDS },
      { key: "direction", label: "Dirección", type: "select", default: "up", options: ["up", "down", "left", "right"], when: (p) => ["slide", "blur", "wipe", "flip"].includes(String(p.kind)) },
      { key: "distance", label: "Distancia (px)", type: "number", default: 40, min: 0, max: 160, step: 5, when: (p) => p.kind === "slide" || p.kind === "blur" },
      { key: "trigger", label: "Disparador", type: "select", default: "inview", options: ["mount", "inview", "scroll"], labels: { mount: "al montar", inview: "al entrar en pantalla", scroll: "sigue el scroll" } },
      { key: "once", label: "Solo la primera vez", type: "boolean", default: true, when: (p) => p.trigger === "inview" },
      { key: "threshold", label: "Umbral visible", type: "number", default: 0.2, min: 0, max: 1, step: 0.05, when: (p) => p.trigger === "inview" },
      { key: "duration", label: "Duración (s)", type: "number", default: 0.8, min: 0.2, max: 3, step: 0.1, when: (p) => p.trigger !== "scroll" },
      { key: "delay", label: "Retardo (s)", type: "number", default: 0, min: 0, max: 2, step: 0.1, when: (p) => p.trigger !== "scroll" },
      { key: "easing", label: "Curva", type: "select", default: "out", options: ["out", "in-out", "back", "linear"], labels: { out: "suave (out)", "in-out": "entrada y salida", back: "con rebote", linear: "lineal" }, when: (p) => p.trigger !== "scroll" },
      { key: "stagger", label: "Escalonado de las tarjetas (s)", type: "number", default: 0.12, min: 0, max: 0.5, step: 0.02 },
      { key: "split", label: "Titular troceado", type: "select", default: "words", options: ["none", "words", "chars"], noCode: true },
      { key: "headline", label: "Titular", type: "text", default: "Cada sección entra cuando llegas a ella", noCode: true },
      variantProp("glass"),
    ],
    render: (p, { replay }) => {
      const common = {
        kind: p.kind as RevealKind,
        direction: p.direction as RevealDirection,
        distance: p.distance as number,
        trigger: p.trigger as "mount" | "inview" | "scroll",
        once: p.once as boolean,
        threshold: p.threshold as number,
        duration: p.duration as number,
        delay: p.delay as number,
        easing: p.easing as RevealEasing,
        playKey: replay,
      };
      const scrolls = p.trigger !== "mount";
      return (
        <div className={`ui-center pg-rv ${scrolls ? "pg-rv--scroll" : ""}`}>
          {scrolls && <p className="pg-rv__hint">Desplaza hacia abajo ↓</p>}
          <Reveal {...common} as="h3" split={p.split as never} className="pg-rv__title">
            {p.headline as string}
          </Reveal>
          <Reveal {...common} stagger={p.stagger as number} className="pg-rv__grid">
            {["Arranque", "Escala", "Soporte"].map((t, i) => (
              <Panel key={t} title={t} body={["Despliega en minutos.", "Crece sin tocar nada.", "Personas, no bots."][i]} footer="" bar="" variant={p.variant as never} />
            ))}
          </Reveal>
          {scrolls && <p className="pg-rv__hint">↑ Vuelve arriba{p.once === false && p.trigger === "inview" ? " y baja otra vez: se repite" : ""}</p>}
        </div>
      );
    },
  },
  {
    id: "presence",
    component: "Presence",
    path: "@/components/ui/Presence",
    name: "Aparición / desaparición (hacker)",
    category: "transiciones",
    styles: ALL_STYLES,
    description:
      "Envuelve cualquier contenido y anima su entrada y salida: capas de glifos que se descifran, glitch con separación RGB y corrupción, datamosh, fragmentos, encendido CRT, parpadeo de neón, estática de TV, censura o arranque de sistema.",
    stageHeight: 380,
    children: (p) => `<Panel title=${JSON.stringify(p.title)} body=${JSON.stringify(String(p.text).split("\n")[0] + "…")} variant="${p.variant}" />`,
    replayable: true,
    notes: [
      "El contenido está siempre en el DOM; con movimiento reducido se muestra u oculta sin animar.",
      "Con «Bucle automático» activado se repite sola; desactívalo para controlarla con «Mostrar contenido».",
      "chars, celda y rastro solo aplican a los efectos «ascii-*»; columnas a fragmentos; bandas a datamosh; alto de barra y texto a censura; líneas a arranque.",
      "13 efectos, 8 estilos de superficie para el contenido de ejemplo: 104 combinaciones.",
    ],
    props: [
      { key: "effect", label: "Efecto", type: "select", default: "ascii-rain", options: PRESENCE_EFFECTS.map((e) => e.id) },
      { key: "loop", label: "Bucle automático", type: "boolean", default: true },
      { key: "show", label: "Mostrar contenido", type: "boolean", default: true, when: (p) => p.loop !== true },
      { key: "hold", label: "Pausa del bucle (s)", type: "number", default: 1.2, min: 0.2, max: 4, step: 0.1, when: (p) => p.loop === true },
      { key: "duration", label: "Duración (s)", type: "number", default: 1.2, min: 0.3, max: 3, step: 0.1 },
      { key: "intensity", label: "Intensidad", type: "number", default: 0.7, min: 0.1, max: 1, step: 0.05, when: (p) => p.effect !== "boot" && p.effect !== "redact" },
      { key: "tone", label: "Color del efecto", type: "select", default: "acc", options: ["acc", "acc2", "fg"] },
      { key: "chars", label: "Glifos", type: "select", default: "symbols", options: CHAR_OPTIONS, when: isAscii },
      { key: "cell", label: "Celda (px)", type: "number", default: 14, min: 8, max: 28, step: 1, when: isAscii },
      { key: "edge", label: "Rastro en el borde", type: "boolean", default: true, when: isAscii },
      { key: "tiles", label: "Columnas de fragmentos", type: "number", default: 6, min: 3, max: 10, step: 1, when: (p) => p.effect === "shatter" },
      { key: "bands", label: "Bandas", type: "number", default: 10, min: 4, max: 24, step: 1, when: (p) => p.effect === "slices" },
      { key: "rowHeight", label: "Alto de barra (px)", type: "number", default: 22, min: 12, max: 40, step: 1, when: (p) => p.effect === "redact" },
      { key: "redactLabel", label: "Texto tachado", type: "text", default: "REDACTED", when: (p) => p.effect === "redact" },
      {
        key: "bootLines",
        label: "Líneas de arranque (entrada / --- / salida)",
        type: "text",
        multiline: true,
        default: "[ OK ] montando sistema de archivos\n[ OK ] iniciando servicios\n[ .. ] descifrando interfaz\n[ OK ] acceso concedido\n---\n[ .. ] cerrando sesión\n[ OK ] volcando memoria\n[ OK ] apagado",
        when: (p) => p.effect === "boot",
      },
      // Las tres siguientes son del contenido de ejemplo, no de Presence: van en `children`, no en sus props
      { ...variantProp("terminal"), label: "Estilo del contenido", noCode: true },
      { key: "title", label: "Título del contenido", type: "text", default: "ACCESO_CONCEDIDO.sh", noCode: true },
      { key: "text", label: "Texto del contenido", type: "text", multiline: true, default: "usuario: root\npermisos: rwxrwxrwx\nsesión iniciada 03:14 h", noCode: true },
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <Presence
          effect={p.effect as never}
          loop={p.loop as boolean}
          show={p.show as boolean}
          hold={p.hold as number}
          duration={p.duration as number}
          intensity={p.intensity as number}
          tone={p.tone as never}
          chars={p.chars as never}
          cell={p.cell as number}
          edge={p.edge as boolean}
          tiles={p.tiles as number}
          bands={p.bands as number}
          rowHeight={p.rowHeight as number}
          redactLabel={p.redactLabel as string}
          bootLines={p.bootLines as string}
          playKey={replay}
        >
          <div className={`ui-surface ${vcls(p.variant as never)}`} style={{ padding: 22, width: 300, maxWidth: "100%" }}>
            <strong style={{ display: "block", marginBottom: 8, fontSize: 16 }}>{(p.title as string) || " "}</strong>
            <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.6, opacity: 0.85, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{p.text as string}</pre>
          </div>
        </Presence>
      </div>
    ),
  },
];
