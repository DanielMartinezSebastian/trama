"use client";

import { Suspense, createContext, lazy, startTransition, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type MutableRefObject, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import MetaTable from "@/components/ui/MetaTable";
import PageTransition, { PageTransitionPersist } from "@/components/ui/PageTransition";
import SkillCheck from "@/components/ui/SkillCheck";
import SoundToggle from "@/components/ui/SoundToggle";
import Traveler, { TravelSlot, TravelStage, useTraveler } from "@/components/ui/Traveler";
import { GLBoundary } from "@/lib/ui/gl";
import { playSfx } from "@/lib/ui/sfx";
import { tokensToStyle, type TokenSet } from "@/lib/ui/tokens";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { SiteFrame, siteHref } from "../shared";
import type { ScreenBox } from "./actorScene";
import { BOSS, BRAND, CHEST, FACTS, FEATURES, HEARTS, HEROES, SCORE, SLUG, getHero, type Hero, type HeroId } from "./data";
import "./runa.css";

/*
 * Runa (docs/25): la web de lanzamiento de un videojuego que es su propia demo.
 * · Tres viajeros viven en el Shell: el héroe (de la selección al HUD, a la arena y a la victoria), la runa (del cofre al
 *   inventario) y el jefe (de la pantalla de título a la arena). Son el mismo lienzo, vivo, en todas las rutas.
 * · Transiciones DURAS entre rutas: pixelado por defecto, glitch al bajar al jefe, barrido de líneas al volver al menú;
 *   cartel de nivel en corte seco, temblor de pantalla y destello al golpear o recibir.
 * · Minijuegos: forzar la cerradura (SkillCheck; los intentos dependen de la agilidad del héroe) y golpear los puntos débiles
 *   del jefe (solo con la runa del nivel 1: la pista pasa de una ruta a otra).
 */

const THEME: TokenSet = {
  bg: "#0a0a12",
  fg: "#f4f1e8",
  mut: "#8b8aa3",
  acc: "#ff2e63",
  acc2: "#08f7fe",
  card: "#14142a",
  ln: "rgba(244,241,232,0.16)",
  r: 2,
  font: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
  display: "var(--font-anton), Impact, sans-serif",
  accentFont: "var(--font-press-start-2p), ui-monospace, monospace",
};
const TOKENS = { ...tokensToStyle(THEME), "--sel-bg": THEME.acc, "--sel-fg": THEME.bg, "--gold": "#ffe600" } as CSSProperties;

const href = (p = "") => siteHref(SLUG, p);
/** La imagen fija de cada modelo (capturada de su propio lienzo, fondo transparente): se ve mientras carga el 3D, con
 * movimiento reducido y sin WebGL. */
const sprite = (name: string) => `/img/runa/${name}.webp`;
const Sprite = ({ name }: { name: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img className="rn-sprite" src={sprite(name)} alt="" decoding="async" />
);
const ActorScene = lazy(() => import("./actorScene"));
const RuneScene = lazy(() => import("./runeScene"));

/** Las navegaciones con tipo: cada una con su transición dura. */
const T = { start: "pixel", boss: "jefe", menu: "menu" } as const;
const TRANSITIONS = { [T.start]: "pixelate", [T.boss]: "glitch", [T.menu]: "scanline" } as const;

/** El reposo del jefe (su clip trae pose en T, reposo y andar seguidos: docs/25 §5). */
const BOSS_IDLE = { from: 0.1, to: 3.0 };

/* ---------------------------------------------------------------- la partida (sobrevive al navegar) */

type Saved = { hero: HeroId | null; chest: boolean; rune: boolean; bossHp: number; hearts: number; score: number; started: number | null; finished: number | null };
const NEW: Saved = { hero: null, chest: false, rune: false, bossHp: BOSS.hp, hearts: HEARTS, score: 0, started: null, finished: null };
const KEY = "runa-partida";

type Game = Saved & {
  candidate: HeroId;
  setCandidate: (h: HeroId) => void;
  update: (fn: (s: Saved) => Saved) => void;
  reset: () => void;
  /** cuenta de golpes al jefe (el lienzo destella y retrocede con cada uno) */
  bossHits: number;
  bossHit: () => void;
  /** dónde cae el jefe en su hueco (lo mide su escena) */
  bossBox: MutableRefObject<ScreenBox>;
  /** temblor de pantalla: `hit` al golpear, `hurt` al recibir (destello rojo) */
  jolt: (kind: "hit" | "hurt") => void;
};
const GameCtx = createContext<Game | null>(null);
const useGame = () => useContext(GameCtx)!;

export function Shell({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(NEW);
  const [candidate, setCandidate] = useState<HeroId>("caballero");
  const [bossHits, setBossHits] = useState(0);
  const bossBox = useRef<ScreenBox>({ x0: 0.3, y0: 0.15, x1: 0.7, y1: 0.95 });
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as Saved | null;
      if (s) {
        setSaved({ ...NEW, ...s });
        if (s.hero) setCandidate(s.hero);
      }
    } catch {
      /* sin almacenamiento */
    }
  }, []);
  const update = useCallback((fn: (s: Saved) => Saved) => {
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
    s.setProperty("background-color", THEME.bg);
    return () => {
      s.removeProperty("--ui-vt-page");
      s.removeProperty("--acc");
      s.removeProperty("background-color");
    };
  }, []);
  const jolt = useCallback((kind: "hit" | "hurt") => {
    const el = frame.current;
    if (!el) return;
    el.classList.remove("is-hit", "is-hurt");
    void el.offsetWidth; // reinicia la animación
    el.classList.add(`is-${kind}`);
  }, []);
  const game: Game = {
    ...saved,
    candidate,
    setCandidate,
    update,
    bossHits,
    bossHit: () => setBossHits((n) => n + 1),
    bossBox,
    jolt,
    reset: () => {
      setBossHits(0);
      update(() => ({ ...NEW }));
    },
  };
  return (
    <SiteFrame tokens={TOKENS} className="rn">
      <GameCtx.Provider value={game}>
        <div className="rn-frame" ref={frame} onAnimationEnd={(e) => e.currentTarget.classList.remove("is-hit", "is-hurt")}>
          <TravelStage className="rn-stage">
            <a className="rn-skip" href="#contenido">Saltar al contenido</a>
            <Hud />
            <Traveler id="jefe" className="rn-trav rn-trav--boss" pace="slow">
              <BossTraveler />
            </Traveler>
            <Traveler id="heroe" className="rn-trav rn-trav--hero" pace="slow" delay={60}>
              <HeroTraveler />
            </Traveler>
            <Traveler id="runa" className="rn-trav rn-trav--rune" pace="slow" delay={140}>
              <RuneTraveler />
            </Traveler>
            {children}
          </TravelStage>
        </div>
        <div className="rn-crt" aria-hidden />
      </GameCtx.Provider>
    </SiteFrame>
  );
}

const pad = (n: number, l = 6) => String(Math.max(0, Math.round(n))).padStart(l, "0");

function Hud() {
  const g = useGame();
  const hero = getHero(g.hero);
  const clock = useRef<HTMLSpanElement>(null);
  // en la arena y en la victoria el héroe está en escena: el retrato lo dice
  const onStage = /\/(nivel-2|victoria)$/.test(usePathname());
  useEffect(() => {
    const t = setInterval(() => {
      if (!clock.current) return;
      const end = g.finished ?? Date.now();
      const s = g.started ? Math.floor((end - g.started) / 1000) : 0;
      clock.current.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    }, 250);
    return () => clearInterval(t);
  }, [g.started, g.finished]);
  return (
    <PageTransitionPersist name="rn-hud">
      <header className="rn-hud">
        <a className="rn-logo" href={href()} data-transition={T.menu} aria-label="Runa, pantalla de título">RUNA</a>
        <p className="rn-hud__score" aria-label={`Puntuación ${g.score}`}>
          <span>1UP</span> {pad(g.score)}
        </p>
        <p className="rn-hud__right">
          <span className="rn-hearts" aria-label={`${g.hearts} vidas`}>
            {Array.from({ length: HEARTS }, (_, i) => (
              <i key={i} className={i < g.hearts ? "is-on" : ""} aria-hidden>♥</i>
            ))}
          </span>
          <span className="rn-hud__time" ref={clock} aria-hidden>00:00</span>
          <SoundToggle className="rn-sound" onLabel="" offLabel="" label="Sonido de 8 bits" />
        </p>
      </header>
      {/* abajo a la izquierda: el retrato del héroe y el inventario (los dos son huecos de viajeros) */}
      {hero && (
        <aside className="rn-dock" aria-label="Tu héroe y tu inventario">
          <div className={`rn-dock__portrait ${onStage ? "is-away" : ""}`}>
            <TravelSlot id="heroe" at="hud" className="rn-fill" />
          </div>
          <div className="rn-dock__info">
            <b>{hero.name}</b>
            <span>{hero.role}</span>
          </div>
          <div className={`rn-dock__inv ${g.rune ? "is-full" : ""}`} aria-label={g.rune ? "Inventario: la runa" : "Inventario vacío"}>
            {g.rune ? <TravelSlot id="runa" at="inventario" className="rn-fill" /> : <span aria-hidden>·</span>}
          </div>
        </aside>
      )}
    </PageTransitionPersist>
  );
}

/* ---------------------------------------------------------------- los viajeros */

function Lazy3D({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [fail, setFail] = useState(false);
  if (reduced || fail) return null;
  return (
    <GLBoundary onError={() => setFail(true)}>
      <Suspense fallback={null}>{children}</Suspense>
    </GLBoundary>
  );
}

function HeroTraveler() {
  const g = useGame();
  const at = useTraveler("heroe");
  const id = at === "seleccion" ? g.candidate : g.hero ?? g.candidate;
  const hero = getHero(id)!;
  const [ready, setReady] = useState<string | null>(null);
  const yaw = at === "arena" ? 0.85 : at === "hud" ? 0.35 : 0.25;
  return (
    <div className={`rn-actor ${ready === hero.src ? "is-ready" : ""}`} data-at={at ?? ""} aria-hidden>
      {at && <Sprite name={hero.id} />}
      {at && (
        <Lazy3D>
          <ActorScene key={hero.src} src={hero.src} hide={hero.hide} yaw={yaw} spin={at === "seleccion" ? 0.35 : 0} follow={at === "hud" ? 0.05 : 0.18} active rim={["#ff2e63", "#08f7fe"]} onReady={() => setReady(hero.src)} />
        </Lazy3D>
      )}
    </div>
  );
}

function BossTraveler() {
  const g = useGame();
  const at = useTraveler("jefe");
  const [ready, setReady] = useState(false);
  return (
    <div className={`rn-actor rn-actor--boss ${ready ? "is-ready" : ""} ${g.bossHp <= 0 ? "is-down" : ""}`} data-at={at ?? ""} aria-hidden>
      {at && <Sprite name="jefe" />}
      {at && (
        <Lazy3D>
          <ActorScene src={BOSS.src} loop={BOSS_IDLE} yaw={at === "arena" ? -0.55 : 0} follow={0.12} hit={g.bossHits} down={g.bossHp <= 0} active screen={g.bossBox} rim={["#08f7fe", "#ff2e63"]} onReady={() => setReady(true)} />
        </Lazy3D>
      )}
    </div>
  );
}

function RuneTraveler() {
  const at = useTraveler("runa");
  const reduced = useReducedMotion();
  return (
    <div className="rn-rune" data-at={at ?? ""} aria-hidden>
      {at && reduced && <Sprite name="runa" />}
      {at && (
        <Lazy3D>
          <RuneScene active glow={at === "inventario" ? 0.7 : 1} />
        </Lazy3D>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- piezas comunes */

/** El cartel de nivel: negro a pantalla completa con el número y el nombre, y corte seco (sin fundido). */
function StageCard({ n, title }: { n: string; title: string }) {
  return (
    <div className="rn-card" aria-hidden>
      <p className="rn-card__n">{n}</p>
      <p className="rn-card__t">{title}</p>
      <p className="rn-card__ready">¿Listo?</p>
    </div>
  );
}

/** «Pulsa start»: Enter o Espacio en la página llevan a `to`. */
function usePressStart(to: string, enabled = true) {
  const router = useRouter();
  useEffect(() => {
    if (!enabled) return;
    const key = (e: KeyboardEvent) => {
      if (e.repeat || !(e.key === "Enter" || e.code === "Space")) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(t.tagName)) return;
      e.preventDefault();
      playSfx("start");
      router.push(to, { transitionTypes: [T.start] });
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [router, to, enabled]);
}

function Wishlist({ big = false }: { big?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={`rn-wish ${big ? "rn-wish--big" : ""}`} onClick={() => setDone(true)} aria-live="polite">
      {done ? "¡Gracias! (es una demo: no se guarda nada)" : "Añadir a la lista de deseados"}
    </button>
  );
}

/* ---------------------------------------------------------------- título */

function Title() {
  const g = useGame();
  const router = useRouter();
  const next = g.hero ? (g.finished ? href("victoria") : g.rune ? href("nivel-2") : href("nivel-1")) : href("heroe");
  usePressStart(next);
  useEffect(() => {
    ["heroe", "nivel-1", "nivel-2", "victoria"].forEach((p) => router.prefetch(href(p)));
  }, [router]);
  return (
    <>
      <section className="rn-title" aria-labelledby="rn-title-t">
        <p className="rn-kicker">
          <span>{BRAND.studio} presenta</span>
          <span>{BRAND.release}</span>
        </p>
        <div className="rn-title__stage">
          <h1 id="rn-title-t" className="rn-title__word">
            <span>RU</span>
            <span>NA</span>
          </h1>
          {/* el jefe, detrás de las letras: viajará a la arena del nivel 2 */}
          {g.bossHp > 0 && <TravelSlot id="jefe" at="titulo" className="rn-title__boss" />}
        </div>
        <p className="rn-title__sub">Un roguelite de mazmorras que cambian, runas que se engarzan y jefes con puntos débiles.</p>
        <a className="rn-start" href={next} data-transition={T.start} onClick={() => playSfx("start")}>
          {g.hero ? "Continuar" : "Pulsa start"}
        </a>
        <p className="rn-mut rn-title__hint">Enter o Espacio · la web es la demo: juégala</p>
      </section>
      <PressKit />
    </>
  );
}

/* ---------------------------------------------------------------- elige héroe */

const STAT = ["FUE", "MAG", "AGI"];
/** pernos de la cerradura: menos cuanto más ágil (caballero 4, doctora 3, exploradora 2) */
const lockRounds = (h: Hero) => Math.max(2, 6 - h.stats[2]);

function Select() {
  const g = useGame();
  const router = useRouter();
  const hero = getHero(g.candidate)!;
  const i = HEROES.indexOf(hero);
  const pick = (id: HeroId) => {
    if (id !== g.candidate) playSfx("select");
    g.setCandidate(id);
  };
  const go = () => {
    playSfx("confirm");
    g.update((s) => ({ ...s, hero: hero.id, started: s.started ?? Date.now() }));
    router.push(href("nivel-1"), { transitionTypes: [T.start] });
  };
  useEffect(() => {
    router.prefetch(href("nivel-1"));
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") pick(HEROES[(i + 1) % HEROES.length].id);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") pick(HEROES[(i + HEROES.length - 1) % HEROES.length].id);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, g, i]);
  return (
    <section className="rn-select" aria-labelledby="rn-select-t">
      <StageCard n="Jugador 1" title="Elige héroe" />
      <p className="rn-kicker">
        <span>Selección</span>
        <span>← → para cambiar · Enter para elegir</span>
      </p>
      <div className="rn-select__grid">
        <div className="rn-select__left">
        <h1 id="rn-select-t" className="rn-h1 rn-select__t">Elige héroe</h1>
        <ol className="rn-roster" role="listbox" aria-label="Héroes">
          {HEROES.map((h, k) => (
            <li key={h.id} role="option" aria-selected={h.id === hero.id}>
              <button type="button" className={`rn-roster__item ${h.id === hero.id ? "is-on" : ""}`} onClick={() => pick(h.id)} onFocus={() => pick(h.id)} onDoubleClick={go}>
                <span className="rn-roster__k">P{k + 1}</span>
                <span className="rn-roster__name">{h.name}</span>
                <span className="rn-roster__role">{h.role}</span>
                <span className="rn-stats" aria-label={h.stats.map((v, j) => `${STAT[j]} ${v}`).join(", ")}>
                  {h.stats.map((v, j) => (
                    <span key={j}>
                      <em>{STAT[j]}</em>
                      {Array.from({ length: 5 }, (_, x) => (
                        <i key={x} className={x < v ? "is-on" : ""} />
                      ))}
                    </span>
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="rn-start rn-start--btn" onClick={go}>
          Jugar con {hero.name}
        </button>
        </div>
        <div className="rn-select__stage">
          <TravelSlot id="heroe" at="seleccion" priority={1} className="rn-fill" />
          <p className="rn-select__line">{hero.line}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- nivel 1: el cofre */

function NeedHero() {
  return (
    <div className="rn-need">
      <p>Antes de bajar, elige héroe.</p>
      <a className="rn-start" href={href("heroe")} data-transition={T.start}>Elegir héroe</a>
    </div>
  );
}

function Level1() {
  const g = useGame();
  const hero = getHero(g.hero);
  const router = useRouter();
  const [tries, setTries] = useState(0);
  const [msg, setMsg] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => router.prefetch(href("nivel-2")), [router]);
  if (!hero) return <NeedHero />;
  const rounds = Math.max(2, lockRounds(hero));
  return (
    <section className="rn-level rn-level--1" aria-labelledby="rn-l1-t">
      <StageCard n="Nivel 1" title="La cámara" />
      <p className="rn-kicker">
        <span>Nivel 1 · La cámara</span>
        <span>{hero.name} · {rounds} pernos</span>
      </p>
      <h1 id="rn-l1-t" className="rn-h1 rn-h1--wide">{g.chest ? "Botín" : "Cerradura"}</h1>
      <div className="rn-level__grid">
        <div className="rn-chest">
          <div className={`rn-actor ${ready ? "is-ready" : ""}`}>
            <Sprite name="cofre" />
            <Lazy3D>
              <ActorScene src={CHEST.src} once="Armature|A_Open" rest="Armature|A_Close" play={g.chest} yaw={-0.45} follow={0.12} active rim={["#ffe600", "#ff2e63"]} onReady={() => setReady(true)} />
            </Lazy3D>
          </div>
          {/* la runa sale del cofre: su hueco aparece al abrirlo y desaparece al cogerla (vuela al inventario) */}
          {g.chest && !g.rune && <TravelSlot id="runa" at="cofre" priority={1} className="rn-chest__rune" />}
        </div>
        <aside className="rn-level__side">
          {!g.chest ? (
            <>
              <p className="rn-lead">Un cofre con cerradura de pernos. Pulsa cuando la aguja pase por la zona roja; cada acierto levanta un perno.</p>
              <SkillCheck
                className="rn-skill"
                rounds={rounds}
                speed={0.55 + hero.stats[2] * 0.02}
                zone={0.1 + hero.stats[2] * 0.012}
                actionLabel="Forzar"
                globalKey
                label="Forzar la cerradura"
                onHit={(n) => {
                  playSfx("coin", { pitch: 1 + n * 0.12 });
                  g.update((s) => ({ ...s, score: s.score + SCORE.pin }));
                  g.jolt("hit");
                }}
                onMiss={() => {
                  playSfx("hurt", { volume: 0.14 });
                  setTries((t) => t + 1);
                  setMsg(["El perno se resiste.", "Clic. Nada.", "Casi. Otra vez."][tries % 3]);
                  g.jolt("hurt");
                }}
                onComplete={() => {
                  playSfx("open");
                  setMsg("");
                  g.update((s) => ({ ...s, chest: true, score: s.score + SCORE.chest }));
                }}
              />
              <p className="rn-msg" aria-live="polite">{msg}</p>
            </>
          ) : !g.rune ? (
            <>
              <p className="rn-lead">Dentro, una runa que late. Dicen que es lo único que hiere al Señor de los Huesos.</p>
              <button type="button" className="rn-start rn-start--btn" onClick={() => {
                playSfx("powerup");
                startTransition(() => g.update((s) => ({ ...s, rune: true })));
              }}>
                Coger la runa
              </button>
            </>
          ) : (
            <>
              <p className="rn-lead">La runa está en tu inventario. Abajo, en el trono, alguien te espera.</p>
              <a className="rn-start rn-start--danger" href={href("nivel-2")} data-transition={T.boss} onClick={() => playSfx("hurt", { pitch: 0.6, volume: 0.18 })}>
                Bajar al trono
              </a>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- nivel 2: el jefe */

type Target = { id: number; x: number; y: number };

function Level2() {
  const g = useGame();
  const hero = getHero(g.hero);
  const router = useRouter();
  const [fighting, setFighting] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [msg, setMsg] = useState("");
  const seq = useRef(0);
  const down = g.bossHp <= 0;
  const over = g.hearts <= 0;
  useEffect(() => router.prefetch(href("victoria")), [router]);
  // el combate: sin punto débil en pantalla, aparece uno (dentro de la silueta del jefe, que mide su escena); si se apaga
  // sin golpearlo, el jefe golpea. Un único efecto que se reprograma cada vez que cambia el punto
  const g2 = useRef(g);
  g2.current = g;
  useEffect(() => {
    if (!fighting || down || over) return;
    if (!target) {
      const t = window.setTimeout(() => {
        const b = g2.current.bossBox.current;
        setTarget({ id: ++seq.current, x: b.x0 + (0.2 + Math.random() * 0.6) * (b.x1 - b.x0), y: b.y0 + (0.12 + Math.random() * 0.5) * (b.y1 - b.y0) });
      }, 650);
      return () => clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setTarget(null);
      playSfx(g2.current.hearts <= 1 ? "lose" : "hurt");
      g2.current.jolt("hurt");
      g2.current.update((s) => ({ ...s, hearts: s.hearts - 1 }));
      setMsg("¡Te alcanza!");
    }, 1500);
    return () => clearTimeout(t);
  }, [fighting, down, over, target]);
  const strike = () => {
    if (!target || !hero) return;
    setTarget(null);
    if (!g.rune) {
      playSfx(g.hearts <= 1 ? "lose" : "hurt");
      setMsg("El golpe le atraviesa. Sin la runa no le haces nada.");
      g.jolt("hurt");
      g.update((s) => ({ ...s, hearts: s.hearts - 1 }));
      return;
    }
    g.bossHit();
    g.jolt("hit");
    const last = g.bossHp - hero.hit <= 0;
    playSfx("hit", { pitch: 0.9 + Math.random() * 0.2 });
    if (last) window.setTimeout(() => playSfx("win"), 380);
    setMsg(["¡Crac!", "¡En el hueso!", "¡Se tambalea!"][Math.floor(Math.random() * 3)]);
    g.update((s) => {
      const hp = Math.max(0, s.bossHp - hero.hit);
      const won = hp <= 0;
      return { ...s, bossHp: hp, score: s.score + SCORE.hit + (won ? SCORE.boss + s.hearts * SCORE.heart : 0), finished: won ? Date.now() : s.finished };
    });
  };
  if (!hero) return <NeedHero />;
  const retry = () => {
    setTarget(null);
    setMsg("");
    setFighting(false);
    g.update((s) => ({ ...s, hearts: HEARTS, bossHp: BOSS.hp }));
  };
  return (
    <section className="rn-level rn-level--2" aria-labelledby="rn-l2-t">
      <StageCard n="Nivel 2" title="El trono" />
      <p className="rn-kicker">
        <span>Nivel 2 · El trono</span>
        <span>{g.rune ? "Runa engarzada" : "Sin runa"}</span>
      </p>
      <div className="rn-bossbar" role="meter" aria-label={`Vida del jefe: ${g.bossHp} de ${BOSS.hp}`} aria-valuemin={0} aria-valuemax={BOSS.hp} aria-valuenow={g.bossHp}>
        <span className="rn-bossbar__name">{BOSS.name}</span>
        <span className="rn-bossbar__track"><i style={{ width: `${(g.bossHp / BOSS.hp) * 100}%` }} /></span>
      </div>
      <div className="rn-arena">
        <div className="rn-arena__hero">
          <TravelSlot id="heroe" at="arena" priority={1} className="rn-fill" />
        </div>
        <div className="rn-arena__boss">
          {/* derrotado sigue aquí mientras cae; en la victoria ya no tiene hueco y se va */}
          <TravelSlot id="jefe" at="arena" priority={1} className="rn-fill" />
          {target && (
            <button key={target.id} type="button" className="rn-weak" style={{ left: `${target.x * 100}%`, top: `${target.y * 100}%` }} onClick={strike} aria-label="¡Punto débil! Golpea">
              <span />
            </button>
          )}
        </div>
        <p className="rn-arena__msg" aria-live="assertive">{msg}</p>
        {!fighting && !down && !over && (
          <div className="rn-arena__start">
            {!g.rune && <p className="rn-warn">No llevas la runa. <a href={href("nivel-1")} data-transition={T.start}>Volver a la cámara</a></p>}
            <button type="button" className="rn-start rn-start--btn rn-start--danger" onClick={() => {
              playSfx("start");
              setFighting(true);
            }}>¡A luchar!</button>
            <p className="rn-mut">Golpea los puntos débiles antes de que se apaguen.</p>
          </div>
        )}
        {over && !down && (
          <div className="rn-over" role="alertdialog" aria-label="Fin de la partida">
            <p className="rn-over__t">Game over</p>
            <button type="button" className="rn-start rn-start--btn" onClick={retry}>Reintentar</button>
          </div>
        )}
        {down && (
          <div className="rn-arena__start">
            <p className="rn-win">¡Derrotado!</p>
            <a className="rn-start" href={href("victoria")} data-transition={T.start}>Reclamar el botín</a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- victoria y prensa */

function Victory() {
  const g = useGame();
  const hero = getHero(g.hero);
  const won = g.bossHp <= 0;
  const secs = g.started && g.finished ? Math.round((g.finished - g.started) / 1000) : null;
  return (
    <>
      <section className="rn-victory" aria-labelledby="rn-v-t">
        <StageCard n={won ? "Fin" : "Pausa"} title={won ? "Victoria" : "Sin terminar"} />
        <p className="rn-kicker">
          <span>{won ? "Partida completada" : "Aún queda el jefe"}</span>
          <span>{secs !== null ? `${Math.floor(secs / 60)} min ${secs % 60} s` : "—"}</span>
        </p>
        <h1 id="rn-v-t" className="rn-h1 rn-h1--giant">{won ? "Victoria" : "Continuará"}</h1>
        <div className="rn-victory__grid">
          <div className="rn-victory__hero">
            {hero && <TravelSlot id="heroe" at="victoria" priority={1} className="rn-fill" />}
            {g.rune && <TravelSlot id="runa" at="victoria" priority={1} className="rn-victory__rune" />}
          </div>
          <dl className="rn-scores">
            <div><dt>Puntuación</dt><dd>{pad(g.score)}</dd></div>
            <div><dt>Héroe</dt><dd>{hero?.name ?? "—"}</dd></div>
            <div><dt>Vidas</dt><dd>{"♥".repeat(Math.max(0, g.hearts)) || "—"}</dd></div>
            <div><dt>Runa</dt><dd>{g.rune ? "Engarzada" : "—"}</dd></div>
          </dl>
        </div>
        <div className="rn-victory__cta">
          <Wishlist big />
          <button type="button" className="rn-link" onClick={() => startTransition(() => g.reset())}>Volver a jugar</button>
        </div>
      </section>
      <PressKit />
    </>
  );
}

/** capturas de prensa: sacadas de la propia demo a 1920 × 1080 (docs/25 §6) */
const SHOTS = [
  { f: "01-titulo", t: "Título", alt: "Pantalla de título: RUNA en rosa y cian con el jefe entre las sílabas" },
  { f: "02-heroes", t: "Elige héroe", alt: "Selección de héroe con la exploradora y sus barras de fuerza, magia y agilidad" },
  { f: "03-cofre", t: "La cámara", alt: "El cofre abierto con la runa rosa flotando encima" },
  { f: "04-jefe", t: "El trono", alt: "Combate contra el Señor de los Huesos con un punto débil marcado en el pecho" },
  { f: "05-victoria", t: "Victoria", alt: "Pantalla de victoria con la puntuación, la heroína y la runa" },
];

function PressKit() {
  const credits = useMemo(() => [...HEROES.map((h) => h.model), CHEST.model, BOSS.model], []);
  return (
    <section className="rn-press" id="prensa" aria-labelledby="rn-press-t">
      <h2 id="rn-press-t" className="rn-h2">Kit de prensa</h2>
      <div className="rn-press__grid">
        <ol className="rn-features">
          {FEATURES.map((f) => (
            <li key={f.k}>
              <span>{f.k}</span>
              <b>{f.t}</b>
              <p>{f.d}</p>
            </li>
          ))}
        </ol>
        <div>
          <MetaTable rows={FACTS} mono label="Ficha del juego" />
          <p className="rn-mut rn-press__contact">Prensa y claves: <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></p>
          <Wishlist />
        </div>
      </div>
      <h3 className="rn-h3">Capturas</h3>
      <ul className="rn-shots">
        {SHOTS.map((c) => (
          <li key={c.f}>
            <a href={`/img/runa/prensa/${c.f}.jpg`} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/img/runa/prensa/${c.f}-640.jpg`} alt={c.alt} width={640} height={360} loading="lazy" decoding="async" />
            </a>
            <p>
              {c.t} · <a href={`/img/runa/prensa/${c.f}.jpg`} download>1920 × 1080</a>
            </p>
          </li>
        ))}
      </ul>
      <footer className="rn-foot">
        <p>{BRAND.legal}. Runa no existe; los modelos 3D sí, con licencia CC BY 4.0:</p>
        <ul>
          {credits.map((c) => (
            <li key={c.page}><a href={c.page} target="_blank" rel="noopener noreferrer">{c.title}</a> · {c.author}</li>
          ))}
        </ul>
        <p>Demo de Trama: Traveler, SkillCheck, lib/gems y View Transitions con cortes duros.</p>
      </footer>
    </section>
  );
}

export function Page({ path }: { path: string[] }) {
  const route = path.join("/");
  let content: ReactNode = <Title />;
  if (route === "heroe") content = <Select />;
  else if (route === "nivel-1") content = <Level1 />;
  else if (route === "nivel-2") content = <Level2 />;
  else if (route === "victoria") content = <Victory />;
  return (
    <PageTransition key={route} kind="pixelate" pace="fast" tone="acc" types={TRANSITIONS}>
      <main id="contenido" className={`rn-main rn-main--${route || "titulo"}`}>
        {content}
      </main>
    </PageTransition>
  );
}

