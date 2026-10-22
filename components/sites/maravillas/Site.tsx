"use client";

import { Suspense, createContext, lazy, startTransition, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MutableRefObject, type PointerEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import MetaTable from "@/components/ui/MetaTable";
import PageTransition, { NAV_BACK, NAV_FORWARD, PageTransitionPersist } from "@/components/ui/PageTransition";
import ScratchReveal from "@/components/ui/ScratchReveal";
import SharedText from "@/components/ui/SharedText";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Traveler, { TravelSlot, TravelStage, useTraveler } from "@/components/ui/Traveler";
import { GLBoundary } from "@/lib/ui/gl";
import { tokensToStyle, type TokenSet } from "@/lib/ui/tokens";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { SiteFrame, siteHref } from "../shared";
import { BRAND, PROLOGUE, ROOMS, SLUG, STAR, STARS, STORM_MINUTES, STORM_TIME, getRoom, type Room, type RoomSlug } from "./data";
import { POSE_START, type PieceMode, type PiecePose } from "./pose";
import "./maravillas.css";

/*
 * Maravillas (docs/24): una historia interactiva entre rutas, con diseño editorial de letras enormes.
 * · Cuatro piezas 3D (modelos reales de Sketchfab) son cuatro `Traveler` que viven en el Shell: la misma pieza, viva, pasa
 *   de la vista previa del índice a su sala, de la sala al estante de la cabecera y del estante a la vitrina final.
 * · Cada sala es una ruta con un juego que se juega SOBRE la pieza (la página escribe su pose; la escena la lee).
 * · Las pistas pasan de una sala a otra: la concha dice que la piedra dirá a quién mirar, la piedra dice la estrella, el
 *   astrolabio da la hora y el reloj pide esa hora.
 * · El título de cada sala es la palabra del índice, que viaja letra a letra (SharedText); la ruta cambia con un barrido.
 */

const THEME: TokenSet = {
  bg: "#efe9de",
  fg: "#1b1814",
  mut: "#6d655a",
  acc: "#c8412b",
  acc2: "#2c5a5e",
  card: "#e6dfd1",
  ln: "rgba(27,24,20,0.16)",
  r: 4,
  font: "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
  display: "var(--font-bodoni-moda), Didot, Georgia, serif",
  accentFont: "var(--font-geist-mono), ui-monospace, monospace",
};
const TOKENS = { ...tokensToStyle(THEME), "--sel-bg": THEME.acc, "--sel-fg": THEME.bg } as CSSProperties;

const href = (p = "") => siteHref(SLUG, p);
const roomHref = (s: RoomSlug) => href(`sala/${s}`);
const PieceScene = lazy(() => import("./pieceScene"));

/* ---------------------------------------------------------------- estado de la partida (sobrevive al navegar) */

type Saved = { won: Record<RoomSlug, boolean>; started: number | null; finished: number | null };
const NONE: Saved = { won: { mar: false, tierra: false, cielo: false, tiempo: false }, started: null, finished: null };
const KEY = "maravillas-partida";

type Game = Saved & {
  win: (s: RoomSlug) => void;
  start: () => void;
  reset: () => void;
  poses: Record<RoomSlug, MutableRefObject<PiecePose>>;
  /** el eje de cada juego en su panel (fracciones), medido por la escena: cambia con el encuadre de cada pantalla */
  anchors: Record<RoomSlug, MutableRefObject<{ x: number; y: number }>>;
  /** cuánto sedimento se ha rascado en la sala II (lo escribe la capa, lo lee la página) */
  dug: MutableRefObject<number>;
  /** la pieza que ya se ha guardado en el estante sin salir de su sala */
  stowed: RoomSlug | null;
  stow: (s: RoomSlug | null) => void;
};
const GameCtx = createContext<Game | null>(null);
const useGame = () => useContext(GameCtx)!;

const count = (won: Saved["won"]) => ROOMS.filter((r) => won[r.slug]).length;

/** El puntero en toda la ventana (−1…1): las piezas se inclinan un poco hacia él. */
const pointer = { current: { x: 0, y: 0 } };

export function Shell({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(NONE);
  const [stowed, stow] = useState<RoomSlug | null>(null);
  const poses = useMemo(() => Object.fromEntries(ROOMS.map((r) => [r.slug, { current: { ...POSE_START[r.slug] } }])) as Game["poses"], []);
  const anchors = useMemo(() => Object.fromEntries(ROOMS.map((r) => [r.slug, { current: { x: 0.5, y: 0.5 } }])) as Game["anchors"], []);
  const dug = useRef(0);
  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as Saved | null;
      if (s?.won) setSaved({ ...NONE, ...s, won: { ...NONE.won, ...s.won } });
    } catch {
      /* sin almacenamiento */
    }
    const move = (e: globalThis.PointerEvent) => {
      pointer.current.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / innerHeight) * 2 - 1);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, []);
  const save = useCallback((fn: (s: Saved) => Saved) => {
    setSaved((prev) => {
      const next = fn(prev);
      try {
        sessionStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* sin almacenamiento */
      }
      return next;
    });
  }, []);
  // los pseudo-elementos de la transición leen los tokens de :root (docs/05 · Tema)
  useEffect(() => {
    const s = document.documentElement.style;
    s.setProperty("--ui-vt-page", THEME.bg);
    s.setProperty("--acc", THEME.acc);
    // el papel también debajo de la transición (si no, asoma el fondo del documento por el borde de las capturas)
    s.setProperty("background-color", THEME.bg);
    return () => {
      s.removeProperty("--ui-vt-page");
      s.removeProperty("--acc");
      s.removeProperty("background-color");
    };
  }, []);
  const game: Game = {
    ...saved,
    poses,
    anchors,
    dug,
    stowed,
    stow,
    start: () => save((s) => (s.started ? s : { ...s, started: Date.now() })),
    win: (slug) =>
      save((s) => {
        if (s.won[slug]) return s;
        const won = { ...s.won, [slug]: true };
        return { ...s, won, finished: count(won) === ROOMS.length ? Date.now() : s.finished };
      }),
    reset: () => {
      ROOMS.forEach((r) => Object.assign(poses[r.slug].current, POSE_START[r.slug]));
      dug.current = 0;
      stow(null);
      save(() => NONE);
    },
  };
  return (
    <SiteFrame tokens={TOKENS} className="mv">
      <GameCtx.Provider value={game}>
        <TravelStage className="mv-stage">
          <SmoothScroll lerp={0.08} syncGsap={false} />
          <a className="mv-skip" href="#contenido">Saltar al contenido</a>
          <Header />
          {ROOMS.map((r, i) => (
            <Traveler key={r.slug} id={`pieza-${r.slug}`} className="mv-trav" pace="slow" delay={i * 90}>
              <PieceTraveler room={r} />
            </Traveler>
          ))}
          {children}
        </TravelStage>
      </GameCtx.Provider>
    </SiteFrame>
  );
}

function Header() {
  const { won } = useGame();
  const n = count(won);
  return (
    <PageTransitionPersist name="mv-head">
      <header className="mv-head">
        <a className="mv-brand" href={href()} data-transition={NAV_BACK} aria-label={`${BRAND.long}, prólogo`}>
          <span className="mv-brand__name">Maravillas</span>
          <span className="mv-brand__sub">Gabinete · {BRAND.city}</span>
        </a>
        {/* el estante: cada pieza recuperada vuela aquí (su hueco) y se queda girando */}
        <ol className="mv-shelf" aria-label={`Estante: ${n} de 4 piezas recuperadas`}>
          {ROOMS.map((r) => (
            <li key={r.slug}>
              <a href={roomHref(r.slug)} data-transition={NAV_FORWARD} aria-label={`Sala ${r.n}, ${r.word}: ${won[r.slug] ? "recuperada" : "por recuperar"}`} className={won[r.slug] ? "is-won" : ""}>
                {won[r.slug] ? <TravelSlot id={`pieza-${r.slug}`} at="estante" className="mv-shelf__slot" /> : <span className="mv-shelf__n" aria-hidden>{r.n}</span>}
              </a>
            </li>
          ))}
        </ol>
        <a className="mv-head__case" href={href("vitrina")} data-transition={NAV_FORWARD}>
          Vitrina <b>{n}/4</b>
        </a>
      </header>
    </PageTransitionPersist>
  );
}

/** El viajero de una pieza: su lienzo (se monta la primera vez que la pieza tiene hueco) y, en la sala II, el sedimento. */
function PieceTraveler({ room }: { room: Room }) {
  const g = useGame();
  const at = useTraveler(`pieza-${room.slug}`);
  const reduced = useReducedMotion();
  const [seen, setSeen] = useState(false);
  const [ready, setReady] = useState(false);
  const [fail, setFail] = useState(false);
  useEffect(() => {
    if (at) setSeen(true);
  }, [at]);
  const mode: PieceMode = at === "sala" ? "game" : at === "estante" ? "shelf" : "display";
  // el sedimento: se pinta mientras la piedra no esté fuera, y se queda un momento al acabar para que se vea retirarse
  const [digging, setDigging] = useState(false);
  const dig = room.slug === "tierra" && at === "sala" && (!g.won.tierra || digging);
  return (
    <div className={`mv-piece ${ready ? "is-ready" : ""}`} data-mode={mode} aria-hidden={!dig}>
      {(reduced || fail || !ready) && (
        <span className="mv-piece__flat" aria-hidden>
          <i>{room.n}</i>
        </span>
      )}
      {seen && !reduced && !fail && (
        <GLBoundary onError={() => setFail(true)}>
          <Suspense fallback={null}>
            <PieceScene room={room.slug} pose={g.poses[room.slug]} anchor={g.anchors[room.slug]} mode={mode} active={at !== null} pointer={pointer} onReady={() => setReady(true)} />
          </Suspense>
        </GLBoundary>
      )}
      {/* el grabado de la roca se queda a la vista con la piedra fuera */}
      {room.slug === "tierra" && at === "sala" && g.won.tierra && !digging && <span className="mv-dig__word mv-dig__word--set">{STAR.toUpperCase()}</span>}
      {dig && (
        <ScratchReveal
          className="mv-dig"
          cover="dust"
          color="#a48d6c"
          brush={30}
          threshold={0.58}
          label="Rasca el sedimento"
          revealLabel="Sacar la piedra sin rascar"
          onProgress={(p) => (g.dug.current = p)}
          onReveal={() => {
            setDigging(true);
            g.win("tierra");
            window.setTimeout(() => setDigging(false), 1200);
          }}
        >
          <span className="mv-dig__word">{STAR.toUpperCase()}</span>
        </ScratchReveal>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- prólogo e índice */

function Home() {
  const g = useGame();
  const router = useRouter();
  const first = ROOMS.find((r) => !g.won[r.slug]) ?? ROOMS[0];
  const [hover, setHover] = useState<RoomSlug | null>(null);
  const shown = getRoom(hover ?? first.slug)!;
  // las salas, precargadas: la pieza y el título solo viajan si la sala se pinta en el mismo commit (docs/14 §5)
  useEffect(() => {
    ROOMS.forEach((r) => router.prefetch(roomHref(r.slug)));
    router.prefetch(href("vitrina"));
  }, [router]);
  const all = count(g.won) === ROOMS.length;
  return (
    <>
      <section className="mv-hero" aria-labelledby="mv-hero-t">
        <p className="mv-kicker">
          <span>Gabinete de curiosidades</span>
          <span>{BRAND.city} · desde {BRAND.founded}</span>
          <span>Historia interactiva en cuatro salas</span>
        </p>
        <h1 id="mv-hero-t" className="mv-hero__t">
          <span className="mv-hero__l1">Cuatro</span>
          <span className="mv-hero__l2"><em>maravillas</em></span>
          <span className="mv-hero__l3">perdidas</span>
        </h1>
        <div className="mv-hero__cols">
          <p className="mv-dropcap">{PROLOGUE[0]}</p>
          <p>{PROLOGUE[1]}</p>
          <div className="mv-hero__go">
            <a className="mv-cta" href={roomHref(first.slug)} data-transition={NAV_FORWARD}>
              {all ? "Ver la vitrina" : g.started ? `Seguir en la sala ${first.n}` : "Entrar en la sala I"} <span aria-hidden>→</span>
            </a>
            <p className="mv-mut">Unos cinco minutos. Se juega con el ratón o con el dedo; con teclado, flechas y Enter.</p>
          </div>
        </div>
      </section>

      <section className="mv-index" aria-label="Las cuatro salas">
        <ol className="mv-index__list">
          {ROOMS.map((r) => (
            <li key={r.slug} className={`${r.slug === shown.slug ? "is-on" : ""} ${g.won[r.slug] ? "is-won" : ""}`}>
              <a href={roomHref(r.slug)} data-transition={NAV_FORWARD} onPointerEnter={() => setHover(r.slug)} onFocus={() => setHover(r.slug)}>
                <span className="mv-index__n">{r.n}</span>
                <SharedText name={`mv-t-${r.slug}`} text={r.word} className="mv-index__w" stagger={0} />
                <span className="mv-index__meta">
                  <b>{r.piece}</b>
                  <span>{r.game}</span>
                  <span className="mv-index__state">{g.won[r.slug] ? "Recuperada" : "Perdida"}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
        <aside className="mv-index__aside" aria-live="polite">
          <div className="mv-index__pad">
            {g.won[shown.slug] ? <p className="mv-index__done">Ya está en el estante.</p> : <TravelSlot id={`pieza-${shown.slug}`} at="indice" priority={1} className="mv-fill" />}
          </div>
          <p className="mv-index__how">
            <span>Sala {shown.n} · {shown.game}</span> {shown.how}
          </p>
        </aside>
      </section>

      <section className="mv-rules" aria-label="Cómo se juega">
        <div>
          <span className="mv-rules__n">01</span>
          <h2>Cuatro salas</h2>
          <p>Mar, tierra, cielo y tiempo. En cada una hay una pieza que recuperar con un juego corto.</p>
        </div>
        <div>
          <span className="mv-rules__n">02</span>
          <h2>Una pista lleva a otra</h2>
          <p>Lo que encuentras en una sala resuelve la siguiente. Puedes ir en cualquier orden, pero el gabinete tiene el suyo.</p>
        </div>
        <div>
          <span className="mv-rules__n">03</span>
          <h2>La vitrina</h2>
          <p>Cada pieza recuperada vuela al estante de arriba y te acompaña. Con las cuatro, la vitrina se completa.</p>
        </div>
      </section>
      <Colophon />
    </>
  );
}

/* ---------------------------------------------------------------- las salas */

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const wrapPi = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
/** el ángulo del puntero respecto a un punto del panel (fracciones de su caja) */
function angleIn(e: PointerEvent<HTMLElement>, cx: number, cy: number) {
  const r = e.currentTarget.getBoundingClientRect();
  return { dx: e.clientX - (r.left + r.width * cx), dy: e.clientY - (r.top + r.height * cy) };
}
/** un bucle de animación mientras el componente vive */
function useLoop(fn: () => void) {
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      f.current();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
}

type GameProps = { room: Room; won: boolean; onWin: () => void; say: (s: string) => void };

/** I · La espiral: girar la concha hasta verla de frente (de frente o de espaldas: las dos enseñan la espiral). */
function SpiralGame({ won, onWin, say }: GameProps) {
  const pose = useGame().poses.mar;
  const meter = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const hold = useRef(0);
  const err = () => {
    const p = pose.current;
    const y = p.yaw - Math.round(p.yaw / Math.PI) * Math.PI;
    return Math.hypot(y, p.pitch);
  };
  useLoop(() => {
    const e = err();
    if (meter.current) meter.current.style.setProperty("--m", String(won ? 1 : clamp(1 - e / 1.3, 0, 1)));
    if (won) return;
    if (e < 0.14) {
      if (!hold.current) hold.current = performance.now();
      else if (performance.now() - hold.current > 380) {
        const p = pose.current;
        p.yaw = Math.round(p.yaw / Math.PI) * Math.PI;
        p.pitch = 0;
        onWin();
      }
    } else hold.current = 0;
  });
  const nudge = (dx: number, dy: number) => {
    if (won) return;
    const p = pose.current;
    p.yaw += dx;
    p.pitch = clamp(p.pitch + dy, -1.4, 1.4);
  };
  return (
    <div
      className="mv-pad mv-pad--drag"
      tabIndex={0}
      role="application"
      aria-label="La concha: arrástrala o usa las flechas para girarla hasta verla de frente"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        nudge((e.clientX - drag.current.x) * 0.008, (e.clientY - drag.current.y) * 0.008);
        drag.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => {
        drag.current = null;
        if (!won && err() < 0.5) say("Casi. Un poco más de frente.");
      }}
      onKeyDown={(e: KeyboardEvent) => {
        const m: Record<string, [number, number]> = { ArrowLeft: [-0.08, 0], ArrowRight: [0.08, 0], ArrowUp: [0, -0.08], ArrowDown: [0, 0.08] };
        if (m[e.key]) {
          e.preventDefault();
          nudge(...m[e.key]);
        }
      }}
    >
      {/* el dibujo del cuaderno: una espiral logarítmica que se triplica en cada vuelta */}
      <svg className="mv-sketch" viewBox="-100 -100 200 200" aria-hidden>
        <path d={spiralPath()} />
        <circle r="96" />
        <text x="-92" y="94">lám. XII · ×3 por vuelta</text>
      </svg>
      <TravelSlot id="pieza-mar" at="sala" priority={1} className="mv-fill" />
      <span className="mv-meter" ref={meter} aria-hidden><i /></span>
    </div>
  );
}
function spiralPath() {
  const b = Math.log(3) / (2 * Math.PI);
  let d = "";
  for (let t = 0; t <= 6 * Math.PI; t += 0.08) {
    const r = 1.6 * Math.exp(b * t);
    d += `${d ? "L" : "M"}${(r * Math.cos(t)).toFixed(2)} ${(-r * Math.sin(t)).toFixed(2)}`;
  }
  return d;
}

/** II · La excavación: el sedimento está en el viajero (encima de la pieza); aquí se lee cuánto falta. */
function DigGame({ won }: GameProps) {
  const { dug } = useGame();
  const out = useRef<HTMLSpanElement>(null);
  useLoop(() => {
    if (out.current) out.current.textContent = won ? "100 %" : `${Math.round(Math.min(1, dug.current / 0.58) * 100)} %`;
  });
  return (
    <div className="mv-pad mv-pad--dig">
      <TravelSlot id="pieza-tierra" at="sala" priority={1} className="mv-fill" />
      <p className="mv-pad__read">
        Sedimento retirado <span ref={out}>0 %</span>
      </p>
    </div>
  );
}

/** III · La altura: girar la alidada hasta una estrella y soltar. La alidada es simétrica: vale cualquiera de sus dos puntas. */
// el eje: el pasador del astrolabio escaneado (en fracciones del panel; la escena pone ahí la alidada)
// las estrellas, en un arco alrededor del eje de la alidada (lo mide la escena: `anchors.cielo`)
const SKY = { r: 0.47 };
function SkyGame({ won, onWin, say }: GameProps) {
  const { poses, anchors } = useGame();
  const pose = poses.cielo, anchor = anchors.cielo;
  const sky = useRef<SVGGElement>(null);
  const line = useRef<SVGLineElement>(null);
  const [lit, setLit] = useState<string | null>(won ? STAR : null);
  useLoop(() => {
    const a = pose.current.alidade;
    line.current?.setAttribute("x2", String(Math.cos(a) * 150));
    line.current?.setAttribute("y2", String(-Math.sin(a) * 150));
    sky.current?.setAttribute("transform", `translate(${((anchor.current.x - 0.5) * 200).toFixed(1)} ${((anchor.current.y - 0.5) * 200).toFixed(1)})`);
  });
  const aim = (a: number) => {
    let x = wrapPi(a);
    if (x < 0) x += Math.PI;
    pose.current.alidade = x;
  };
  const sight = () => {
    if (won) return;
    const deg = (pose.current.alidade * 180) / Math.PI;
    const near = STARS.map((s) => ({ s, d: Math.abs(s.deg - deg) })).sort((a, b) => a.d - b.d)[0];
    if (near.d > 7) return say("Por ahí no hay ninguna estrella brillante.");
    pose.current.alidade = (near.s.deg * Math.PI) / 180;
    setLit(near.s.name);
    if (near.s.name === STAR) onWin();
    else say(`Eso es ${near.s.name}. La piedra decía otra estrella.`);
  };
  return (
    <div
      className="mv-pad mv-pad--sky"
      tabIndex={0}
      role="application"
      aria-label="El astrolabio: gira la alidada con el puntero o con las flechas y suelta (o pulsa Enter) sobre una estrella"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        const { dx, dy } = angleIn(e, anchor.current.x, anchor.current.y);
        if (!won) aim(Math.atan2(-dy, dx));
      }}
      onPointerMove={(e) => {
        if (won || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
        const { dx, dy } = angleIn(e, anchor.current.x, anchor.current.y);
        aim(Math.atan2(-dy, dx));
      }}
      onPointerUp={sight}
      onKeyDown={(e) => {
        const turn = e.key === "ArrowLeft" || e.key === "ArrowUp" ? 0.035 : e.key === "ArrowRight" || e.key === "ArrowDown" ? -0.035 : 0;
        if (turn) {
          e.preventDefault();
          if (!won) aim(pose.current.alidade + turn);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          sight();
        }
      }}
    >
      <svg className="mv-sky" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <g ref={sky} transform="translate(0 6)">
          <line x1="-150" y1="0" x2="150" y2="0" className="mv-sky__horizon" />
          <line ref={line} x1="0" y1="0" x2="150" y2="0" className="mv-sky__sight" />
          {STARS.map((s) => {
            const a = (s.deg * Math.PI) / 180, R = SKY.r * 200;
            return (
              <g key={s.name} transform={`translate(${(Math.cos(a) * R).toFixed(1)} ${(-Math.sin(a) * R).toFixed(1)})`} className={`mv-star ${lit === s.name ? "is-lit" : ""}`}>
                <circle r="2.6" />
                <text y="-6">{s.name}</text>
              </g>
            );
          })}
        </g>
      </svg>
      <TravelSlot id="pieza-cielo" at="sala" priority={1} className="mv-fill" />
    </div>
  );
}

/** IV · La hora: arrastrar alrededor de la esfera; la minutera sigue al puntero y la horaria avanza con cada vuelta. */
const clockOf = (min: number) => {
  const m = ((Math.round(min) % 720) + 720) % 720;
  const h = Math.floor(m / 60) || 12;
  return `${h}:${String(m % 60).padStart(2, "0")}`;
};
function ClockGame({ won, onWin, say }: GameProps) {
  const { poses, anchors } = useGame();
  const pose = poses.tiempo, anchor = anchors.tiempo;
  const read = useRef<HTMLSpanElement>(null);
  const prev = useRef<number | null>(null);
  useLoop(() => {
    if (read.current) read.current.textContent = clockOf(pose.current.minute);
  });
  const angle = (e: PointerEvent<HTMLElement>) => {
    const { dx, dy } = angleIn(e, anchor.current.x, anchor.current.y);
    return Math.atan2(dx, -dy); // 0 arriba, crece en el sentido del reloj
  };
  const check = () => {
    if (won) return;
    const m = ((pose.current.minute % 720) + 720) % 720;
    if (Math.abs(m - STORM_MINUTES) <= 2.5) {
      pose.current.minute += STORM_MINUTES - m;
      pose.current.ticking = true;
      onWin();
    } else say(`Son las ${clockOf(pose.current.minute)}. El reloj no se mueve.`);
  };
  return (
    <div
      className="mv-pad mv-pad--dial"
      tabIndex={0}
      role="application"
      aria-label="El reloj: arrastra alrededor de la esfera o usa las flechas (con mayúsculas, de diez en diez) y pulsa Enter"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        prev.current = angle(e);
      }}
      onPointerMove={(e) => {
        if (won || prev.current === null) return;
        const a = angle(e);
        pose.current.minute += (wrapPi(a - prev.current) / (Math.PI * 2)) * 60;
        prev.current = a;
      }}
      onPointerUp={() => {
        prev.current = null;
        check();
      }}
      onKeyDown={(e) => {
        if (won) return;
        const step = (e.shiftKey ? 10 : 1) * (e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0);
        if (step) {
          e.preventDefault();
          pose.current.minute = Math.round(pose.current.minute) + step;
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          check();
        }
      }}
    >
      <TravelSlot id="pieza-tiempo" at="sala" priority={1} className="mv-fill" />
      <p className="mv-pad__read mv-pad__read--clock">
        <span ref={read}>10:08</span>
      </p>
    </div>
  );
}

const GAMES: Record<RoomSlug, (p: GameProps) => ReactNode> = { mar: SpiralGame, tierra: DigGame, cielo: SkyGame, tiempo: ClockGame };

/** La pista que pide cada sala y dónde se encuentra (para el aviso si aún no se tiene). */
const NEEDS: Partial<Record<RoomSlug, { from: RoomSlug; missing: string }>> = {
  cielo: { from: "tierra", missing: "Aún no sabes a qué estrella mirar: lo dice la piedra de la sala II." },
  tiempo: { from: "cielo", missing: "Aún no sabes la hora de la tormenta: la anotó Ordás con el astrolabio de la sala III." },
};

function RoomPage({ room }: { room: Room }) {
  const g = useGame();
  const router = useRouter();
  const won = g.won[room.slug];
  const [note, setNote] = useState("");
  const i = ROOMS.indexOf(room);
  const next = ROOMS[i + 1];
  const nextHref = next ? roomHref(next.slug) : href("vitrina");
  // al entrar: el juego empieza de cero (o resuelto, si la pieza ya está recuperada) y el reloj de la partida arranca
  useLayoutEffect(() => {
    const p = g.poses[room.slug].current;
    Object.assign(p, POSE_START[room.slug]);
    if (won) {
      if (room.slug === "mar") Object.assign(p, { yaw: 0, pitch: 0 });
      if (room.slug === "cielo") p.alidade = (STARS.find((s) => s.name === STAR)!.deg * Math.PI) / 180;
      if (room.slug === "tiempo") Object.assign(p, { minute: STORM_MINUTES, ticking: true });
    }
    g.dug.current = 0;
    g.stow(null);
    // solo al cambiar de sala
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.slug]);
  useEffect(() => {
    g.start();
    router.prefetch(nextHref);
    router.prefetch(href());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.slug]);
  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(""), 2600);
    return () => clearTimeout(t);
  }, [note]);
  const Game = GAMES[room.slug];
  const need = NEEDS[room.slug];
  const stowed = g.stowed === room.slug;
  return (
    <article className={`mv-room mv-room--${room.slug} ${won ? "is-won" : ""}`}>
      <header className="mv-room__head">
        <p className="mv-kicker">
          <span>Sala {room.n} de IV</span>
          <span>{room.piece}</span>
          <span>Juego · {room.game}</span>
        </p>
      </header>

      <div className="mv-room__play">
        <SharedText as="h1" name={`mv-t-${room.slug}`} text={room.word} className="mv-room__word" stagger={0} />
        <div className="mv-room__stage">{stowed ? <div className="mv-pad mv-pad--empty"><p>En el estante.</p></div> : <Game room={room} won={won} onWin={() => g.win(room.slug)} say={setNote} />}</div>
        <aside className="mv-room__side">
          <p className="mv-room__how">
            <span className="mv-label">Cómo se juega</span>
            {room.how}
          </p>
          {need && !won && !g.won[need.from] && (
            <p className="mv-room__need">
              {need.missing} <a href={roomHref(need.from)} data-transition={NAV_BACK}>Ir a la sala {getRoom(need.from)!.n}</a>
            </p>
          )}
          <p className="mv-room__note" aria-live="polite">{won ? "" : note}</p>
          {won && (
            <div className="mv-clue" aria-live="polite">
              <span className="mv-label">{room.slug === "tiempo" ? "Recuperada" : "Recuperada · la pista"}</span>
              <p>{room.clue}</p>
              {!stowed && (
                <button type="button" className="mv-link" onClick={() => startTransition(() => g.stow(room.slug))}>
                  Guardar en el estante ↑
                </button>
              )}
            </div>
          )}
        </aside>
      </div>

      <div className="mv-room__text">
        <p className="mv-lede">{room.lede}</p>
        <div className="mv-room__cols">
          {room.body.map((p, k) => (
            <p key={k} className={k === 0 ? "mv-dropcap" : ""}>{p}</p>
          ))}
        </div>
        <div className="mv-room__facts">
          <MetaTable rows={room.facts} mono label={`Ficha de ${room.piece.toLowerCase()}`} />
          <p className="mv-credit">
            Modelo 3D: <a href={room.model.page} target="_blank" rel="noopener noreferrer">{room.model.title}</a>, de {room.model.author} ({room.model.license}{room.model.scan ? ` · ${room.model.scan.toLowerCase()}` : ""}).
          </p>
        </div>
      </div>

      <a className="mv-next" href={nextHref} data-transition={NAV_FORWARD}>
        <span className="mv-next__k">{next ? `Sala ${next.n} · ${next.piece}` : "Fin del recorrido"}</span>
        {next ? <SharedText name={`mv-t-${next.slug}`} text={next.word} className="mv-next__w" stagger={0} /> : <span className="mv-next__w">Vitrina</span>}
        <span className="mv-next__go" aria-hidden>→</span>
      </a>
    </article>
  );
}

/* ---------------------------------------------------------------- la vitrina */

const mmss = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
};

function Showcase() {
  const g = useGame();
  const n = count(g.won);
  const all = n === ROOMS.length;
  return (
    <article className={`mv-case ${all ? "is-full" : ""}`}>
      <p className="mv-kicker">
        <span>Vitrina</span>
        <span>{n} de 4 piezas</span>
        <span>{BRAND.long}</span>
      </p>
      <div className="mv-case__head">
        <h1 className="mv-case__t">{all ? <>El gabinete, <em>restaurado</em></> : n === 0 ? <>La vitrina, <em>vacía</em></> : <>Faltan <em>{["cero", "una", "dos", "tres", "cuatro"][4 - n]}</em></>}</h1>
        {all ? (
          <p className="mv-lede">
            Recompuesto en {g.started && g.finished ? mmss(g.finished - g.started) : "una noche"}. El reloj anda otra vez desde las {STORM_TIME}, y Ordás puede volver a cerrar la claraboya.
          </p>
        ) : (
          <p className="mv-lede">Cada pieza que recuperes vuela del estante a su sitio en la vitrina. Las que faltan esperan en su sala.</p>
        )}
      </div>
      {/* el armario del gabinete: nogal, fondo de terciopelo, dos baldas con un foco por hueco y la cartela de cada pieza */}
      <div className="mv-cabinet">
        <p className="mv-cabinet__crest" aria-hidden>
          <span>{BRAND.long}</span>
          <span>MDCCCLXXI</span>
        </p>
        <div className="mv-cabinet__body">
          {[ROOMS.slice(0, 2), ROOMS.slice(2)].map((row, k) => (
            <ol key={k} className="mv-cabinet__row" aria-label={`Balda ${k + 1}`}>
              {row.map((r) => (
                <li key={r.slug} className={`mv-niche ${g.won[r.slug] ? "is-won" : ""}`}>
                  <div className="mv-niche__stage">
                    {g.won[r.slug] ? (
                      <TravelSlot id={`pieza-${r.slug}`} at="vitrina" priority={1} className="mv-fill" />
                    ) : (
                      <a className="mv-niche__empty" href={roomHref(r.slug)} data-transition={NAV_FORWARD}>
                        <span>{r.n}</span>
                        <small>Ir a la sala</small>
                      </a>
                    )}
                  </div>
                  <div className="mv-tag">
                    <p className="mv-tag__n">{r.n} · {r.word}</p>
                    <p className="mv-tag__t">{r.piece}</p>
                    <p className="mv-tag__c">{r.model.author} · {r.model.license}</p>
                  </div>
                </li>
              ))}
            </ol>
          ))}
        </div>
      </div>
      {n > 0 && (
        <button type="button" className="mv-link mv-case__reset" onClick={() => startTransition(() => g.reset())}>
          Devolverlo todo y empezar de nuevo
        </button>
      )}
      <Colophon />
    </article>
  );
}

function Colophon() {
  return (
    <footer className="mv-colophon">
      <p className="mv-colophon__big">Maravillas</p>
      <div className="mv-colophon__cols">
        <p>{BRAND.legal}. {BRAND.collector} y su tormenta son inventados; las piezas son modelos 3D reales.</p>
        <ul>
          {ROOMS.map((r) => (
            <li key={r.slug}>
              <a href={r.model.page} target="_blank" rel="noopener noreferrer">{r.model.title}</a> · {r.model.author} · {r.model.license}
            </li>
          ))}
        </ul>
        <p>Demo de Trama: Traveler, SharedText, ScratchReveal y View Transitions entre rutas.</p>
      </div>
    </footer>
  );
}

export function Page({ path }: { path: string[] }) {
  const route = path.join("/");
  let content: ReactNode = <Home />;
  if (path[0] === "sala" && path[1] && getRoom(path[1])) content = <RoomPage room={getRoom(path[1])!} />;
  else if (route === "vitrina") content = <Showcase />;
  return (
    <PageTransition key={route} kind="wipe" pace="slow" tone="acc">
      <main id="contenido" className={`mv-main mv-main--${path[0] || "prologo"}`}>
        {content}
      </main>
    </PageTransition>
  );
}
