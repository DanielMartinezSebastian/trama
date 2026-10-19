"use client";

import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { CameraStop, MapBlock, MapDim } from "@/lib/map3d/scene";
import { clamp01, trackScroll } from "@/lib/motion/progress";
import { attachDragPan, type DragPan } from "@/lib/ui/dragPan";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";
import OptionPicker from "./OptionPicker";

export type { CameraStop, MapBlock, MapDim };

// three y react-three-fiber solo se descargan con depth="3d", cuando el equipo puede y el mapa está cerca de la pantalla
const Map3DScene = lazy(() => import("@/lib/map3d/scene"));

export type MapMarker = {
  id: string;
  /** posición en el mundo, en % (0–100) */
  x: number;
  y: number;
  title: string;
  meta?: string;
  text?: string;
  image?: string;
  alt?: string;
  href?: string;
  /** color del punto (CSS); por defecto el acento */
  color?: string;
};

export type ExplorableCanvasProps = {
  markers: MapMarker[];
  /** tamaño del mundo en px; más grande que la ventana para que haya algo que explorar */
  world?: { w: number; h: number };
  /** capa de fondo (SVG, imagen, WebGL…) que ocupa todo el mundo */
  background?: ReactNode;
  /** alto de la ventana (CSS) */
  height?: string;
  /** muestra los botones «Mapa / Lista» (la lista es la alternativa accesible) */
  listToggle?: boolean;
  /** textos */
  hint?: string;
  /** flat = plano 2D · 3d = maqueta 3D (three.js) con la cámara inclinada; sin WebGL o con movimiento reducido, se queda en 2D */
  depth?: "flat" | "3d";
  /** volúmenes de la maqueta (y, en 2D, sus huellas en planta si no hay `background`) */
  blocks?: MapBlock[];
  /** con 3D: inclinación de la cámara respecto a la vertical (grados; 0 = cenital) */
  tilt?: number;
  /** con 3D: la cámara empieza cenital (el plano) y se levanta mientras los volúmenes crecen (la maqueta) */
  intro?: boolean;
  /** con 3D: color del cartón y del tablero (CSS) */
  paper?: string;
  /** con 3D: color de la madera de balsa (CSS); por defecto un tono miel. Un gris cálido la deja en la gama de una web en blanco y negro */
  wood?: string;
  /** con 3D: imagen dibujada sobre el tablero (URL o data URI) */
  groundImage?: string;
  /** cotas dibujadas sobre el tablero (y sobre el plano 2D) */
  dims?: MapDim[];
  /** drag = se explora arrastrando · scroll = la cámara recorre `path` con el scroll (ponlo dentro de un `PinnedSection`) */
  nav?: "drag" | "scroll";
  /** con `nav="scroll"`: paradas de la cámara; la de cada momento enseña su `title` y `text` */
  path?: CameraStop[];
  /** con `nav="scroll"`: false = no pinta el texto de la parada (la web pinta sus propios capítulos con `onStop` o `--stop`) */
  captions?: boolean;
  /** con `nav="scroll"`: avisa al cambiar de parada (índice de la más cercana) */
  onStop?: (i: number) => void;
  /** con 3D y arrastre: separación fija entre capas (`MapBlock.layer`), en px del mundo: la maqueta en despiece */
  explode?: number;
  /** false = sin marco: sin borde ni fondo propio y la maqueta se funde con la página por los bordes (la arquitectura 3D
   * queda integrada en la web en vez de dentro de una caja) */
  frame?: boolean;
  /** texto del enlace de la ficha de un punto */
  linkLabel?: string;
  className?: string;
};

/** Normaliza cualquier color CSS a `#rrggbb` / `rgb()` (three no entiende `color(srgb …)` ni `color-mix`) */
const cssColor = (c: string | undefined, fallback: string) => {
  if (!c || typeof document === "undefined") return c || fallback;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.fillStyle = fallback;
  ctx.fillStyle = c;
  return ctx.fillStyle.startsWith("rgba") ? ctx.fillStyle.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, "rgb($1,$2,$3)") : ctx.fillStyle;
};

/** Huellas en planta de los volúmenes: el fondo 2D cuando hay `blocks` y no hay `background` (y la reserva del 3D) */
function Footprints({ blocks, dims = [] }: { blocks: MapBlock[]; dims?: MapDim[] }) {
  return (
    <svg className="ui-xcan__plan" width="100%" height="100%" aria-hidden>
      <defs>
        <pattern id="ui-xcan-grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0H0V100" fill="none" stroke="currentColor" strokeOpacity=".12" /></pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ui-xcan-grid)" />
      {blocks.map((b, i) =>
        b.shape && b.shape !== "box" ? (
          <ellipse key={i} cx={`${b.x}%`} cy={`${b.y}%`} rx={`${b.w / 2}%`} ry={`${b.d / 2}%`} />
        ) : (
          <rect key={i} x={`${b.x - b.w / 2}%`} y={`${b.y - b.d / 2}%`} width={`${b.w}%`} height={`${b.d}%`} data-acc={b.mat === "accent" ? "" : undefined} transform={b.rot ? `rotate(${b.rot})` : undefined} style={b.rot ? { transformBox: "fill-box", transformOrigin: "center" } : undefined} />
        ),
      )}
      {dims.map((d, i) => (
        <g key={`d${i}`} className="ui-xcan__dim">
          <line x1={`${d.x1}%`} y1={`${d.y1}%`} x2={`${d.x2}%`} y2={`${d.y2}%`} />
          <text x={`${(d.x1 + d.x2) / 2}%`} y={`${(d.y1 + d.y2) / 2}%`} dy="-6">{d.label}</text>
        </g>
      ))}
    </svg>
  );
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Lienzo explorable por arrastre (Overworld Audio): un mundo más grande que la ventana con puntos clicables. Se arrastra con
 * ratón o dedo (con inercia), con las flechas del teclado, y cada punto es un botón que centra la vista y abre su ficha. Incluye
 * **vista de lista** como alternativa (accesible, sin gestos) y el hint de uso. Sin inercia ni animaciones con
 * `prefers-reduced-motion`. En móvil el lienzo captura el gesto: la lista es la salida para quien prefiera hacer scroll.
 *
 * Con `depth="3d"` el mismo mundo se ve como **maqueta de papel en 3D** (three.js, Overworld Audio): volúmenes de cartón,
 * metacrilato y madera (`blocks`), sombras suaves, cámara inclinada que sigue el arrastre y una intro que pasa del plano a la
 * maqueta. Los puntos siguen siendo botones del DOM (teclado, foco, lector de pantalla) colocados sobre la escena. Mientras
 * carga, y si el equipo no puede o pide reducir movimiento, se ve el plano 2D con las huellas de los volúmenes.
 *
 * Con `nav="scroll"` dentro de un `PinnedSection` no se arrastra: el scroll lleva la cámara por las paradas de `path` (de la
 * planta cenital a la maqueta y de un detalle a otro, como Oryzo, Primland o las salas de Cartier) y cada parada enseña su
 * texto. `dims` dibuja cotas sobre el tablero, como anotaciones de CAD. Cada parada puede además separar la maqueta por capas
 * (`explode`, el despiece de Atlas), dejar una capa sólida y el resto en alambre (`focusLayer`), barrerla con un plano de luz que
 * descubre los puntos (`scan`), resaltar un punto (`focus`) y cambiar el fondo (`bg`). El componente publica `--stop` (parada
 * con decimales) y `--tour-p` (0–1) para que la web anime sus propios capítulos (`captions={false}` + `onStop`).
 *
 * Se compone de piezas del kit: el arrastre es el de `DragGrid` (`lib/ui/dragPan.ts`), el cambio «Mapa / Lista» es un
 * `OptionPicker` y la carga del 3D es la de `ObjectStage` y `Logo3D` (`lib/ui/gl.tsx`).
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete) aunque se use en 2D: se importa por subruta,
 * `trama-ui/ExplorableCanvas`.
 */
export default function ExplorableCanvas({ markers, world = { w: 2600, h: 1700 }, background, height = "78vh", listToggle = true, hint = "Arrastra para explorar · pulsa un punto", depth = "flat", blocks = [], tilt = 52, intro = true, paper = "#f3efe7", wood, groundImage, dims, nav = "drag", path, captions = true, onStop, explode, linkLabel = "Ver proyecto →", frame = true, className = "" }: ExplorableCanvasProps) {
  const box = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const pan = useRef<DragPan | null>(null);
  const panPos = useRef({ x: 0, y: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const markerEls = useRef(new Map<string, HTMLElement>());
  const progress = useRef(0);
  const [stop, setStop] = useState(0);
  const tour = nav === "scroll" && !!path && path.length > 1;
  const [mode, setMode] = useState<"map" | "list">("map");
  const [open, setOpen] = useState<string | null>(null);
  const [ready3d, setReady3d] = useState(false);
  const reduced = useReducedMotion();
  const tokens = useTokens(box);
  const gl = useGLGate(box, { want: depth === "3d" && mode === "map" && !reduced, margin: "0px" });
  const three = gl.use3d && ready3d;
  const colors = useMemo(
    () => ({ paper: cssColor(paper, "#f3efe7"), bg: cssColor(tokens?.["--bg"], "#f3efe7"), line: cssColor(tokens?.["--fg"], "#222"), accent: cssColor(tokens?.["--acc"], "#ff5a36"), wood: wood ? cssColor(wood, "#d9b183") : undefined }),
    [paper, wood, tokens],
  );
  const pts = useMemo(() => markers.map((m) => ({ id: m.id, x: m.x, y: m.y })), [markers]);
  // three no entiende cualquier color CSS: los fondos de las paradas se normalizan aquí
  const route = useMemo(() => path?.map((s) => (s.bg ? { ...s, bg: cssColor(s.bg, colors.bg) } : s)), [path, colors.bg]);
  const stopCb = useRef(onStop);
  stopCb.current = onStop;

  // el mundo nunca deja ver su borde: la vista se recorta a [ventana − mundo, 0]
  const limits = useCallback(() => {
    const v = view.current;
    return { minX: Math.min(0, (v?.clientWidth ?? 0) - world.w), minY: Math.min(0, (v?.clientHeight ?? 0) - world.h) };
  }, [world.w, world.h]);

  // recorrido por scroll: el progreso sale del PinnedSection que lo envuelve (o del propio lienzo)
  useEffect(() => {
    const host = box.current?.closest(".ui-pin") ?? box.current;
    if (!tour || !host || !path) return;
    let last = -1;
    return trackScroll(host, (r, vh) => {
      const p = host === box.current ? clamp01((vh - r.top) / (r.height + vh)) : clamp01(-r.top / (r.height - vh));
      progress.current = p;
      const f = p * (path.length - 1);
      const i = Math.round(f);
      const el = box.current;
      if (el) {
        el.style.setProperty("--stop", f.toFixed(3));
        el.style.setProperty("--tour-p", p.toFixed(4));
        // fondo de la vista (también la del plano 2D): mezcla de los de las dos paradas que rodean el momento
        const a = path[Math.floor(f)]?.bg, b = path[Math.min(path.length - 1, Math.floor(f) + 1)]?.bg;
        if (a || b) el.style.setProperty("--xc-bg", `color-mix(in srgb, ${b ?? "var(--bg)"} ${((f % 1) * 100).toFixed(1)}%, ${a ?? "var(--bg)"})`);
      }
      setStop(i);
      if (i !== last) {
        last = i;
        stopCb.current?.(i);
      }
    });
  }, [tour, path]);

  useEffect(() => {
    const v = view.current;
    if (mode !== "map" || !v) return;
    const b = limits();
    if (tour) {
      // sin arrastre: el plano 2D (reserva del 3D) queda centrado
      panPos.current = { x: b.minX / 2, y: b.minY / 2 };
      if (layer.current) layer.current.style.transform = `translate3d(${b.minX / 2}px, ${b.minY / 2}px, 0)`;
      return;
    }
    const p = attachDragPan(v, {
      apply: (x, y) => {
        panPos.current = { x, y };
        if (layer.current) layer.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      },
      clamp: (x, y) => {
        const l = limits();
        return [clamp(x, l.minX, 0), clamp(y, l.minY, 0)];
      },
      inertia: 0.94,
      keyStep: 120,
      reduced,
      start: [b.minX / 2, b.minY / 2],
    });
    pan.current = p;
    const ro = new ResizeObserver(() => {
      const c = p.get();
      p.set(c.x, c.y);
    });
    ro.observe(v);
    return () => {
      ro.disconnect();
      p.destroy();
      pan.current = null;
    };
  }, [mode, limits, reduced, tour]);

  const sel = markers.find((m) => m.id === open) ?? null;
  // centra el punto (un poco por encima del centro, para dejar sitio a la ficha)
  const pick = (m: MapMarker) => {
    setOpen(m.id);
    const v = view.current;
    if (v) pan.current?.to(v.clientWidth / 2 - (m.x / 100) * world.w, v.clientHeight * 0.42 - (m.y / 100) * world.h);
  };

  const card = sel && (
    <div className="ui-xcan__card" role="region" aria-label={`Ficha: ${sel.title}`}>
      {sel.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={sel.image} alt={sel.alt ?? ""} />
      )}
      <div>
        {sel.meta && <small>{sel.meta}</small>}
        <b>{sel.title}</b>
        {sel.text && <p>{sel.text}</p>}
        {sel.href && <a href={sel.href}>{linkLabel}</a>}
      </div>
      <button type="button" className="ui-xcan__x" aria-label="Cerrar ficha" onClick={() => setOpen(null)}>×</button>
    </div>
  );

  return (
    <div ref={box} className={`ui-xcan ${three ? "ui-xcan--3d" : ""} ${tour ? "ui-xcan--tour" : ""} ${frame ? "" : "ui-xcan--bare"} ${className}`.trim()} style={{ "--xc-h": height } as CSSProperties}>
      {listToggle && (
        <OptionPicker
          className="ui-xcan__tog"
          label="Forma de ver los proyectos"
          hideLabel
          showValue={false}
          options={[{ value: "map", label: "Mapa" }, { value: "list", label: "Lista" }]}
          value={mode}
          onChange={(v) => setMode(v as "map" | "list")}
        />
      )}
      {mode === "map" ? (
        <div
          ref={view}
          className="ui-xcan__view"
          tabIndex={0}
          role="group"
          aria-roledescription="mapa explorable"
          aria-label="Mapa de proyectos. Usa las flechas para desplazarlo y el tabulador para recorrer los puntos"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            pointer.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 };
          }}
        >
          {gl.use3d && gl.mounted && (
            <div className={`ui-xcan__gl ${three ? "is-on" : ""}`} aria-hidden>
              <GLBoundary onError={gl.fail}>
                <Suspense fallback={null}>
                  <Map3DScene world={world} blocks={blocks} markers={pts} pan={panPos} markerEls={markerEls} pointer={pointer} colors={colors} groundImage={groundImage} dims={dims} path={tour ? route : undefined} progress={tour ? progress : undefined} tilt={tilt} explode={explode} intro={intro} active={gl.near} onReady={() => setReady3d(true)} />
                </Suspense>
              </GLBoundary>
            </div>
          )}
          <div ref={layer} className="ui-xcan__world" style={{ width: world.w, height: world.h }}>
            <div className="ui-xcan__bg">{background ?? (blocks.length > 0 && <Footprints blocks={blocks} dims={dims} />)}</div>
            {markers.map((m) => (
              <button
                key={m.id}
                ref={(el) => {
                  if (el) markerEls.current.set(m.id, el);
                  else markerEls.current.delete(m.id);
                }}
                type="button"
                className="ui-xcan__pt"
                data-on={m.id === open ? "" : undefined}
                aria-expanded={m.id === open}
                style={{ left: `${m.x}%`, top: `${m.y}%`, "--pt": m.color } as CSSProperties}
                onClick={() => pick(m)}
              >
                <i aria-hidden />
                <span>{m.title}</span>
              </button>
            ))}
          </div>
          {tour && captions && path?.[stop] && (path[stop].title || path[stop].text) ? (
            <div className="ui-xcan__stop" aria-live="polite" key={stop}>
              <small>{String(stop + 1).padStart(2, "0")} / {String(path.length).padStart(2, "0")}</small>
              {path[stop].title && <b>{path[stop].title}</b>}
              {path[stop].text && <p>{path[stop].text}</p>}
            </div>
          ) : (
            !tour && <p className="ui-xcan__hint" aria-hidden>{hint}</p>
          )}
          {card}
        </div>
      ) : (
        <ul className="ui-xcan__list">
          {markers.map((m) => (
            <li key={m.id}>
              <a href={m.href ?? "#"}>
                <b>{m.title}</b>
                {m.meta && <small>{m.meta}</small>}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
