"use client";

import { Suspense, lazy, useEffect, useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import AudioPlayer from "@/components/ui/AudioPlayer";
import Button from "@/components/ui/Button";
import Countdown from "@/components/ui/Countdown";
import MetaTable from "@/components/ui/MetaTable";
import PageTransition, { NAV_BACK, NAV_FORWARD, PageTransitionPersist, type PageTransitionKind } from "@/components/ui/PageTransition";
import Preloader from "@/components/ui/Preloader";
import SharedText from "@/components/ui/SharedText";
import TextField from "@/components/ui/TextField";
import Traveler, { TravelSlot, TravelStage, useTraveler } from "@/components/ui/Traveler";
import { GLBoundary } from "@/lib/ui/gl";
import { tokensToStyle, type TokenSet } from "@/lib/ui/tokens";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { SiteFrame, siteHref } from "../shared";
import { BRAND, CHAPTERS, FACTS, FINAL, FICTION, LIGHT_DAY, LIGHT_DAY_CHIP, MILESTONES, ROUTES, SECTIONS, SLUG, TRIP, chapter, type State } from "./data";
import { LoadingRecord } from "./art";
import "./voz-de-la-tierra.css";

/*
 * La Voz de la Tierra (docs/14 · docs/24). Una historia en cuatro rutas con el mismo disco vivo en todas:
 * · El disco 3D (procedural, sin modelos externos) vive en el Shell como `Traveler`: en la portada es el prota, en
 *   «Surcos» se apoya en la columna lateral, en «El viaje» se empequeñece hasta una moneda fija (se va alejando) y en
 *   «El mensaje» vuelve a ser grande frente a la escritura (TravelSlot por página, mismo `id`).
 * · Las palabras de cada capítulo viajan de página a página con `SharedText` (portada → índice → titular → pie).
 * · Cada ruta entra con una transición distinta: iris (el disco se abré), barrido de líneas (los surcos), barrido
 *   (la distancia) y fundido (la voz). La página de destino la elige (PageTransition en cada ruta).
 * · Cifras reales de NASA/JPL; lo inventado se declara en la propia web.
 */

const THEME: TokenSet = {
  bg: "#0a0908",
  fg: "#f3ead6",
  mut: "#8e8577",
  acc: "#e8b64c",
  acc2: "#4a9fa4",
  card: "rgba(243,234,214,0.05)",
  ln: "rgba(243,234,214,0.16)",
  r: 2,
  font: "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
  display: "var(--font-gloock), Didot, Georgia, serif",
  accentFont: "var(--font-martian-mono), ui-monospace, monospace",
};
const TOKENS = { ...tokensToStyle(THEME), "--sel-bg": THEME.acc, "--sel-fg": THEME.bg } as CSSProperties;

const href = (p = "") => siteHref(SLUG, p);
const SLOT_KEY = "voz-de-la-tierra-surco";
const RecordScene = lazy(() => import("./recordScene"));

/** El puntero en toda la ventana (−1…1): el conjunto se inclina un poco hacia él. */
const pointer = { current: { x: 0, y: 0 } };
/** La transición que cada ruta pide al llegar (pág. de destino). */
const KIND: Record<string, PageTransitionKind> = { "": "iris", surcos: "scan", viaje: "wipe", mensaje: "fade" };

/* ---------------------------------------------------------------- el disco que viaja */

/** El disco: su lienzo (se monta la primera vez que tiene hueco) y, sin WebGL o con movimiento reducido, el disco plano. */
function Record() {
  const at = useTraveler("disco");
  const reduced = useReducedMotion();
  const [seen, setSeen] = useState(false);
  const [ready, setReady] = useState(false);
  const [fail, setFail] = useState(false);
  useEffect(() => {
    if (at) setSeen(true);
  }, [at]);
  return (
    <div className={`vd-record ${ready ? "is-ready" : ""}`} aria-hidden="true">
      {(reduced || fail || !ready) && (
        <span className="vd-record__flat">
          <i />
          <b />
        </span>
      )}
      {seen && !reduced && !fail && (
        <GLBoundary onError={() => setFail(true)}>
          <Suspense fallback={null}>
            <RecordScene active={at !== null} pointer={pointer} onReady={() => setReady(true)} />
          </Suspense>
        </GLBoundary>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- el marco (preloader y cabecera) */

function preloadFor(path: string) {
  void path; // el disco procedural no baja archivos: solo se adelanta la escena
  return { assets: [] as string[], modules: [() => import("./recordScene")] };
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  // se decide al entrar: el preloader solo sale una vez por pestaña
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useMemo(() => preloadFor(path), []);
  useEffect(() => {
    const move = (e: globalThis.PointerEvent) => {
      pointer.current.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / innerHeight) * 2 - 1);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
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
  return (
    <SiteFrame tokens={TOKENS} className="vd">
      <Preloader
        className="vd-pre"
        once="session"
        duration={1.2}
        exit="iris"
        label="Sincronizando la señal"
        brand={BRAND.name}
        meta={BRAND.launched}
        assets={load.assets}
        modules={load.modules}
        waitFor={{ root: ".vd-trav[data-at] .vd-record", ready: ".is-ready" }}
        art={<LoadingRecord />}
      />
      <TravelStage className="vd-stage">
        <a className="vd-skip" href="#contenido">Saltar al contenido</a>
        <Header />
        <Traveler id="disco" className="vd-trav" pace="slow">
          <Record />
        </Traveler>
        {children}
      </TravelStage>
    </SiteFrame>
  );
}

function Header() {
  const path = usePathname();
  const on = (p: string) => (p ? path.includes(`/${p}`) : path === href());
  return (
    <PageTransitionPersist name="vd-head">
      <header className="vd-head">
        <a className="vd-brand" href={href()} data-transition={NAV_BACK} aria-label={`${BRAND.name}, El objeto`}>
          <span className="vd-brand__name">{BRAND.name}</span>
          <span className="vd-brand__sub">{BRAND.sub}</span>
        </a>
        <nav className="vd-head__nav" aria-label="Rutas de la historia">
          {CHAPTERS.map((c) => (
            <a key={c.slug} href={href(c.slug === "objeto" ? "" : c.slug)} data-transition={c.slug === "objeto" ? NAV_BACK : NAV_FORWARD} aria-current={on(c.slug === "objeto" ? "" : c.slug) ? "page" : undefined}>
              {c.word}
            </a>
          ))}
        </nav>
        <p className="vd-head__chip" aria-hidden>
          <span>{BRAND.launched}</span>
          <b>→ ∞</b>
        </p>
      </header>
    </PageTransitionPersist>
  );
}

/* ---------------------------------------------------------------- prólogo e índice */

function Home() {
  const router = useRouter();
  const obj = chapter("objeto")!;
  // las rutas, precargadas: el titular solo viaja si la página se pinta en el mismo commit (docs/14 §5)
  useEffect(() => {
    CHAPTERS.forEach((c) => router.prefetch(href(c.slug === "objeto" ? "" : c.slug)));
  }, [router]);
  return (
    <>
      <section className="vd-hero" aria-labelledby="vd-hero-t">
        <div className="vd-hero__txt">
          <p className="vd-kicker">
            <span>{BRAND.launched}</span>
            <span>{BRAND.sub}</span>
            <span>115 imágenes · 90 min de música · 55 saludos</span>
          </p>
          <h1 id="vd-hero-t" className="vd-hero__t">
            <SharedText name="vd-c-objeto" text={obj.word} className="vd-hero__w" stagger={60} />
          </h1>
          <p className="vd-lead">{obj.lede}</p>
        </div>
        <div className="vd-hero__piece">
          <TravelSlot id="disco" at="portada" priority={1} className="vd-fill" />
          <p className="vd-hero__cap" aria-hidden>El Disco de Oro · cobre bañado en oro · 16⅔ rpm</p>
        </div>
      </section>

      <section className="vd-index" aria-label="Lo que sigue en la historia">
        <ol className="vd-index__list">
          {CHAPTERS.filter((c) => c.slug !== "objeto").map((c) => (
            <li key={c.slug}>
              <a href={href(c.slug)} data-transition={NAV_FORWARD}>
                <span className="vd-index__meta">{c.year}</span>
                <SharedText name={`vd-c-${c.slug}`} text={c.word} className="vd-index__w" stagger={0} />
                <span className="vd-index__how">{c.lede.split(".")[0]}.</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="vd-pl" aria-label="El objeto, con su ficha">
        {obj.body.map((p, i) => (
          <p key={i} className={i === 0 ? "vd-pl__first" : ""}>{p}</p>
        ))}
        <MetaTable rows={FACTS} columns={2} label="Ficha del Disco de Oro" className="vd-pl__table" />
      </section>

      <Colophon />
    </>
  );
}

/* ---------------------------------------------------------------- las rutas */

/** Cabecera común de las rutas: la marca, el año, la palabra (que viaja) y la entradilla. */
function PageHead({ slug }: { slug: State }) {
  const c = chapter(slug)!;
  return (
    <section className="vd-pagehead">
      <p className="vd-kicker">
        <span>{c.year}</span>
        <span>{ROUTES.find((r) => (r.path ? r.path === slug : slug === "objeto"))?.title}</span>
      </p>
      <h1 className="vd-word">
        <SharedText name={`vd-c-${slug}`} text={c.word} className="vd-word__w" stagger={0} />
      </h1>
      <p className="vd-lead">{c.lede}</p>
    </section>
  );
}

/** El «siguiente capítulo» en la base de cada ruta: la palabra siguiente ya está en su sitio. */
function Next({ from }: { from: State | null }) {
  if (!from) return null;
  const next = chapter(from)!;
  return (
    <a className="vd-next" href={href(next.slug)} data-transition={NAV_FORWARD}>
      <span className="vd-next__k">{next.year}</span>
      <SharedText name={`vd-c-${next.slug}`} text={next.word} className="vd-next__w" stagger={0} />
      <span className="vd-next__go" aria-hidden>Seguir →</span>
    </a>
  );
}

function Surcos() {
  const s = chapter("surcos")!;
  return (
    <>
      <PageHead slug="surcos" />
      <section className="vd-surcos">
        <aside className="vd-surcos__aside">
          <div className="vd-surcos__slot">
            <TravelSlot id="disco" at="surcos" priority={1} className="vd-fill" />
          </div>
          <p className="vd-cap" aria-hidden>El disco, girando a 16⅔ rpm</p>
        </aside>
        <div className="vd-surcos__body">
          <div className="vd-prose">
            {s.body.map((p, i) => (
              <p key={i} className={i === 0 ? "vd-prose__first" : ""}>{p}</p>
            ))}
          </div>
          {SECTIONS.map((sec) => (
            <article key={sec.kicker} className="vd-sec">
              <header className="vd-sec__head">
                <p className="vd-sec__k">{sec.kicker}</p>
                <h2 className="vd-sec__t">{sec.title}</h2>
                <p className="vd-cap">{sec.cap}</p>
              </header>
              <ul className="vd-list">
                {sec.items.map((it) => (
                  <li key={it.title}>
                    <p className="vd-list__t">{it.title}</p>
                    <p className="vd-list__a">{it.author}</p>
                    <p className="vd-list__c">{it.cap}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <article className="vd-sec vd-sec--audio">
            <header className="vd-sec__head">
              <p className="vd-sec__k">La señal de prueba</p>
              <h2 className="vd-sec__t">No es el disco</h2>
              <p className="vd-cap">
                Esto no es la música del Disco de Oro: es una señal de prueba del kit, sintetizada en tu navegador. Sirve
                para que esta sección se oiga; el contenido real del disco es la lista de arriba.
              </p>
            </header>
            <AudioPlayer
              tracks={
                "Señal de prueba · ambient|Trama kit|synth:ambient:60:7|1:20\n" +
                "Señal de prueba · techno|Trama kit|synth:techno:120:5|1:00\n" +
                "Señal de prueba · hardtechno|Trama kit|synth:hardtechno:140:9|0:50"
              }
              layout="full"
              visualizer="bars"
              repeat="off"
              defaultVolume={0.6}
              variant="minimal"
              className="vd-audio"
            />
          </article>
        </div>
      </section>
      <Next from={s.next} />
      <Colophon />
    </>
  );
}

function Viaje() {
  const v = chapter("viaje")!;
  return (
    <>
      <PageHead slug="viaje" />
      {/* el disco, lejos: una moneda fija arriba a la derecha (su caja no se aparta del viewport) */}
      <div className="vd-coin">
        <TravelSlot id="disco" at="viaje" priority={1} className="vd-fill" />
      </div>
      <section className="vd-prose vd-viaje__prose">
        {v.body.map((p, i) => (
          <p key={i} className={i === 0 ? "vd-prose__first" : ""}>{p}</p>
        ))}
      </section>
      <section className="vd-trip" aria-label="Lo que vale, en números">
        <MetaTable rows={TRIP} columns={2} label="La señal, en números" className="vd-trip__table" />
      </section>
      <section className="vd-tl" aria-label="Como se ha despegado la nave">
        <ol className="vd-tl__list">
          {MILESTONES.map((m) => (
            <li key={m.year}>
              <p className="vd-tl__y">{m.year}</p>
              <h2 className="vd-tl__t">{m.title}</h2>
              <p className="vd-tl__b">{m.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="vd-count" aria-labelledby="vd-count-t">
        <p className="vd-kicker">
          <span>La marca</span>
          <span>{LIGHT_DAY_CHIP}</span>
        </p>
        <h2 id="vd-count-t" className="vd-count__t">Cuánto falta para que la señal tarde un día entero en llegar</h2>
        <Countdown to={LIGHT_DAY} units="dhms" size="lg" variant="minimal" label="Faltan" done="Está a un día luz: la marca ya está cumplida" className="vd-count__cd" />
        <p className="vd-cap vd-cap--xs">
          Cifras de NASA/JPL para Voyager 1, 2026. La distancia no se mide en kilómetros: se mide en horas de luz, y aquí
          empieza a contarse en días.
        </p>
      </section>
      <Next from={v.next} />
      <Colophon />
    </>
  );
}

/* ---------------------------------------------------------------- el mensaje final */

function SavedCard({ text, at, onReset }: { text: string; at: number; onReset: () => void }) {
  void at; // por ahora no lo mostramos: puede volver a salir cuando quede registro real
  return (
    <article className="vd-saved">
      <p className="vd-saved__k">{FINAL.cardKicker}</p>
      <p className="vd-saved__t">«{text}»</p>
      <div className="vd-actions">
        <Button label={FINAL.again} intent="accent" emphasis="outline" variant="outline" onClick={onReset} />
        <Button label={FINAL.home} intent="neutral" emphasis="ghost" variant="outline" href={href()} />
      </div>
      <p className="vd-cap vd-cap--xs">{FICTION[0]}</p>
    </article>
  );
}

function Mensaje() {
  const m = chapter("mensaje")!;
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState<{ text: string; at: number } | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SLOT_KEY);
      if (raw) setSaved(JSON.parse(raw) as { text: string; at: number });
    } catch {
      /* sin almacenamiento */
    }
  }, []);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    const record = { text, at: Date.now() };
    try {
      localStorage.setItem(SLOT_KEY, JSON.stringify(record));
    } catch {
      /* sin almacenamiento */
    }
    setSaved(record);
  };
  return (
    <>
      <PageHead slug="mensaje" />
      <section className="vd-msg">
        <div className="vd-msg__piece">
          <TravelSlot id="disco" at="mensaje" priority={1} className="vd-fill" />
          <p className="vd-cap" aria-hidden>El disco, esperando su próximo surco</p>
        </div>
        <div className="vd-msg__form">
          {saved ? (
            <SavedCard text={saved.text} at={saved.at} onReset={() => setSaved(null)} />
          ) : (
            <>
              <div className="vd-prose">
                {m.body.map((p, i) => (
                  <p key={i} className={i === 0 ? "vd-prose__first" : ""}>{p}</p>
                ))}
              </div>
              <form className="vd-form" onSubmit={submit}>
                <div className="vd-form__prompts" aria-label="Ideas para empezar">
                  {FINAL.prompts.map((p) => (
                    <button key={p} type="button" className="vd-chip" onClick={() => setValue(p)}>
                      {p}
                    </button>
                  ))}
                </div>
                <TextField
                  label="Tu frase"
                  placeholder={FINAL.placeholder}
                  name="frase"
                  multiline
                  rows={3}
                  variant="outline"
                  required
                  value={value}
                  onChange={(v) => setValue(v)}
                />
                <div className="vd-actions">
                  <Button label="Ponerla en el disco" intent="accent" emphasis="primary" variant="solid" type="submit" disabled={!value.trim()} />
                </div>
                <p className="vd-cap vd-cap--xs">{FINAL.note}</p>
              </form>
            </>
          )}
        </div>
      </section>
      <Colophon />
    </>
  );
}

/* ---------------------------------------------------------------- pie común */

function Colophon() {
  return (
    <footer className="vd-colophon">
      <p className="vd-colophon__big">{BRAND.name}</p>
      <div className="vd-colophon__cols">
        <p>{BRAND.legal} Las cifras y las fechas de esta web son las que publica NASA/JPL sobre la misión Voyager.</p>
        <p>
          Fuentes de las cifras:{" "}
          <a href="https://science.nasa.gov/mission/voyager/" target="_blank" rel="noopener noreferrer">
            science.nasa.gov/mission/voyager
          </a>
          . Ni una sola cita de Carl Sagan: sus frases van con derechos.
        </p>
        <p>Demo de Trama: Traveler, SharedText, PageTransition, Countdown, MetaTable, AudioPlayer y TextField en una historia entre rutas.</p>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- la página según la ruta */

export function Page({ path }: { path: string[] }) {
  const route = path.join("/");
  let content: ReactNode = <Home />;
  if (route === "surcos") content = <Surcos />;
  else if (route === "viaje") content = <Viaje />;
  else if (route === "mensaje") content = <Mensaje />;
  return (
    <PageTransition key={route} kind={KIND[route] ?? "iris"} pace="slow" tone="acc" direction={route === "viaje" || route === "surcos" ? "down" : undefined}>
      <main id="contenido" className={`vd-main vd-main--${path[0] || "objeto"}`}>
        {content}
      </main>
    </PageTransition>
  );
}
