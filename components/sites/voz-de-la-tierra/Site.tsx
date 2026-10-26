"use client";

import { Suspense, createContext, lazy, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import AudioPlayer from "@/components/ui/AudioPlayer";
import Button from "@/components/ui/Button";
import Countdown from "@/components/ui/Countdown";
import MetaTable from "@/components/ui/MetaTable";
import PageTransition, { NAV_BACK, NAV_FORWARD, PageTransitionPersist } from "@/components/ui/PageTransition";
import Preloader from "@/components/ui/Preloader";
import SharedText from "@/components/ui/SharedText";
import TextField from "@/components/ui/TextField";
import VideoPlayer from "@/components/ui/VideoPlayer";
import Traveler, { TravelSlot, TravelStage, useTraveler } from "@/components/ui/Traveler";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { tokensToStyle, type TokenSet } from "@/lib/ui/tokens";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { SiteFrame, siteHref } from "../shared";
import { BRAND, CHAPTERS, FACTS, FINAL, FICTION, LIGHT_DAY, LIGHT_DAY_CHIP, MEDIA, MILESTONES, ROUTES, SECTIONS, SLUG, TRIP, chapter, type State } from "./data";
import { LoadingRecord } from "./art";
import "./voz-de-la-tierra.css";

/*
 * La Voz de la Tierra (docs/14 · docs/24). Una historia en cuatro rutas con el mismo disco vivo en todas:
 * · El disco 3D (procedural, sin modelos externos) vive en el Shell como `Traveler`: en la portada es el prota, en
 *   «Surcos» se apoya en la columna lateral, en «El viaje» se empequeñece hasta una moneda fija (se va alejando) y en
 *   «El mensaje» vuelve a ser grande frente a la escritura (TravelSlot por página, mismo `id`).
 * · Las palabras de cada capítulo viajan de página a página con `SharedText` (portada → índice → titular → pie).
 * · El mismo objeto cambia de caja y de pose al navegar. Los textos permanecen legibles,
 *   sin fundidos de tarjetas ni barridos que oculten la documentación.
 * · Cifras reales de NASA/JPL; lo inventado se declara en la propia web.
 */

const THEME: TokenSet = {
  bg: "#0a0908",
  fg: "#f3ead6",
  mut: "#b2a796",
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
const RecordView = createContext<{ view: "disco" | "cubierta"; setView: (view: "disco" | "cubierta") => void }>({ view: "disco", setView: () => {} });

function RecordControls() {
  const { view, setView } = useContext(RecordView);
  return <div className="vd-object-controls" aria-label="Inspeccionar el objeto">
    <button type="button" aria-pressed={view === "disco"} onClick={() => setView("disco")}>El disco <span>01</span></button>
    <button type="button" aria-pressed={view === "cubierta"} onClick={() => setView("cubierta")}>La cubierta <span>02</span></button>
  </div>;
}

function ArchiveFigure({ src, alt, label, caption, source, className = "" }: { src: string; alt: string; label: string; caption: string; source: string; className?: string }) {
  return <figure className={`vd-archive ${className}`}>
    <img src={src} alt={alt} loading="lazy" decoding="async" />
    <figcaption><span className="vd-sec__k">{label}</span><p>{caption}</p><a href={source} target="_blank" rel="noopener noreferrer">NASA · ver archivo ↗</a></figcaption>
  </figure>;
}

/** El puntero en toda la ventana (−1…1): el conjunto se inclina un poco hacia él. */
const pointer = { current: { x: 0, y: 0 } };

/* ---------------------------------------------------------------- el disco que viaja */

/** El disco: su lienzo (se monta la primera vez que tiene hueco) y, sin WebGL o con movimiento reducido, el disco plano. */
function Record() {
  const at = useTraveler("disco");
  const { view } = useContext(RecordView);
  const reduced = useReducedMotion();
  const [seen, setSeen] = useState(false);
  const [ready, setReady] = useState(false);
  const [fail, setFail] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const gate = useGLGate(root, { want: seen && !reduced });
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    if (at) setSeen(true);
  }, [at]);
  return (
    <div ref={root} className={`vd-record ${ready ? "is-ready" : ""}`} aria-hidden="true">
      {(!gate.use3d || fail || !ready) && (
        <span className="vd-record__flat">
          <img src={view === "cubierta" ? MEDIA.cover : MEDIA.record} alt="" width={1600} height={1600} />
        </span>
      )}
      {gate.use3d && gate.mounted && !fail && (
        <GLBoundary onError={() => setFail(true)}>
          <Suspense fallback={null}>
            <RecordScene active={at !== null && gate.near} mode={at ?? "portada"} view={view} pointer={pointer} onReady={onReady} />
          </Suspense>
        </GLBoundary>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- el marco (preloader y cabecera) */

function preloadFor(path: string) {
  void path; // el disco procedural no baja archivos: solo se adelanta la escena
  return { assets: [MEDIA.record, MEDIA.cover], modules: [() => import("./recordScene")] };
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [view, setView] = useState<"disco" | "cubierta">("disco");
  useEffect(() => setView("disco"), [path]);
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
    <SiteFrame tokens={TOKENS} className="vd"><RecordView.Provider value={{ view, setView }}>
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
        art={<LoadingRecord />}
      />
      <TravelStage className="vd-stage">
        <a className="vd-skip" href="#contenido">Saltar al contenido</a>
        <Header />
        <Traveler id="disco" className="vd-trav" pace="slow">
          <Record />
        </Traveler>
        <PageTransition key={path} kind="none" pace="slow">{children}</PageTransition>
      </TravelStage>
    </RecordView.Provider></SiteFrame>
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
            La voz<br /><em>de la Tierra.</em>
          </h1>
          <p className="vd-lead">{obj.lede}</p>
          <a className="vd-text-link" href="#el-archivo">Abrir el archivo <span aria-hidden="true">↓</span></a>
        </div>
        <div className="vd-hero__piece">
          <div className="vd-hero__slot"><TravelSlot id="disco" at="portada" priority={1} className="vd-fill" /></div>
          <p className="vd-hero__cap">Disco y cubierta · reconstrucción con archivo de NASA</p>
          <RecordControls />
        </div>
      </section>

      <section className="vd-film" id="el-archivo" aria-labelledby="vd-film-title">
        <header><p className="vd-sec__k">Un lugar al que llamar casa</p><h2 id="vd-film-title">Antes de ser un punto,<br />fuimos todo esto.</h2><p className="vd-cap">La Tierra desde la Estación Espacial Internacional. Un vistazo al mundo que quisimos presentar.</p></header>
        <VideoPlayer src={MEDIA.video} poster={MEDIA.poster} title="La Tierra desde la ISS · NASA Johnson" controls="minimal" ratio="16/9" muted loop variant="minimal" />
        <p className="vd-media-credit">NASA Johnson · archivo contemporáneo desde la ISS, no una filmación de las Voyager. <a href="/creditos">Créditos de los recursos ↗</a></p>
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

      <ArchiveFigure src={MEDIA.cover} alt="Cubierta original del Disco de Oro con instrucciones grabadas y mapa de púlsares" label="Archivo 01 / las instrucciones" caption="Cómo escucharnos sin conocer nuestro idioma. La cubierta explica cómo reproducir el disco, reconstruir sus imágenes y localizar el Sol." source="https://science.nasa.gov/mission/voyager/golden-record-cover/" className="vd-archive--cover" />

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
          <RecordControls />
          <p className="vd-cap">El disco y su cubierta. Explora las dos caras del archivo.</p>
        </aside>
        <div className="vd-surcos__body">
          <div className="vd-prose">
            {s.body.map((p, i) => (
              <p key={i} className={i === 0 ? "vd-prose__first" : ""}>{p}</p>
            ))}
          </div>
          {SECTIONS.map((sec, sectionIndex) => (
            <article key={sec.kicker} className="vd-sec">
              <header className="vd-sec__head">
                <p className="vd-sec__k">{sec.kicker}</p>
                <h2 className="vd-sec__t">{sec.title}</h2>
                <p className="vd-cap">{sec.cap}</p>
              </header>
              {sectionIndex === 1 && <AudioPlayer tracks={`55 saludos al universo|NASA · grabación original de 1977|${MEDIA.greetings}|4:25|${MEDIA.record}`} layout="bar" visualizer="wave" showPlaylist={false} repeat="off" defaultVolume={.55} variant="minimal" className="vd-audio" />}
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
          <p className="vd-media-credit">Selección de contenidos y grabación: <a href="https://science.nasa.gov/mission/voyager/golden-record-contents/" target="_blank" rel="noopener noreferrer">archivo del Disco de Oro de NASA ↗</a></p>
        </div>
      </section>
      <ArchiveFigure src={MEDIA.earth} alt="Fotografía de la Tierra tomada por la tripulación del Apolo 17, con África y la Antártida visibles" label="Archivo 02 / nuestro mundo" caption="La Tierra fotografiada por Apolo 17 en 1972. Una imagen de contexto para esta historia; no se presenta como una de las 115 imágenes grabadas en el disco." source="https://commons.wikimedia.org/wiki/File:The_Earth_seen_from_Apollo_17.jpg" className="vd-archive--earth" />
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
      <ArchiveFigure src={MEDIA.pale} alt="La Tierra como un diminuto punto luminoso en una franja de luz, fotografiada por Voyager 1" label="Archivo 03 / 14 de febrero de 1990" caption="La Tierra, vista desde unos 6.000 millones de kilómetros del Sol. El pequeño punto luminoso dentro del rayo de luz es nuestro planeta. Fotografía original, conservada sin ampliar su resolución." source="https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/" className="vd-archive--pale" />
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
          Hito anunciado por NASA/JPL para Voyager 1. Una medida de distancia: 24 horas de viaje para su señal.
          {" "}<a href="https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/" target="_blank" rel="noopener noreferrer">Consultar la misión ↗</a>
        </p>
      </section>
      <Next from={v.next} />
      <Colophon />
    </>
  );
}

/* ---------------------------------------------------------------- el mensaje final */

function SavedCard({ text, at, onReset }: { text: string; at: number; onReset: () => void }) {
  const download = () => {
    const blob = new Blob([`La Voz de la Tierra\n\n${text}\n\nUn mensaje imaginario. Guardado el ${new Date(at).toLocaleDateString("es-ES")}.\n`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "mi-surco-tierra.txt"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <article className="vd-saved">
      <p className="vd-saved__k">{FINAL.cardKicker}</p>
      <p className="vd-saved__t">«{text}»</p>
      <div className="vd-actions">
        <Button label="Descargar mi frase" glyph="↓" intent="accent" variant="solid" onClick={download} />
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
  const [storageFailed, setStorageFailed] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SLOT_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && "text" in parsed && "at" in parsed && typeof parsed.text === "string" && parsed.text.trim() && parsed.text.length <= 280 && typeof parsed.at === "number" && Number.isFinite(parsed.at)) setSaved({ text: parsed.text, at: parsed.at });
      }
    } catch {
      /* sin almacenamiento */
    }
  }, []);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = value.trim().slice(0, 280);
    if (!text) return;
    const record = { text, at: Date.now() };
    try {
      localStorage.setItem(SLOT_KEY, JSON.stringify(record));
    } catch {
      setStorageFailed(true);
    }
    setSaved(record);
  };
  const reset = () => {
    try { localStorage.removeItem(SLOT_KEY); } catch { setStorageFailed(true); }
    setSaved(null); setValue("");
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
            <><SavedCard text={saved.text} at={saved.at} onReset={reset} /><p className="vd-cap" role="status">{storageFailed ? "No se pudo guardar en este dispositivo. Descarga tu frase para conservarla." : "Tu frase está guardada en este dispositivo."}</p></>
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
                  onChange={(v) => setValue(v.slice(0, 280))}
                />
                <span className="vd-form__count">{value.length} / 280 caracteres</span>
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
      <div className="vd-colophon__top">
        <div>
          <p className="vd-kicker"><span>Fin de la transmisión</span><span>{BRAND.launched} — ∞</span></p>
          <p className="vd-colophon__message">Seguimos aquí,<br /><em>por si alguien escucha.</em></p>
        </div>
        <a className="vd-colophon__brand" href={href()}>
          <span>{BRAND.name}</span>
          <small>{BRAND.sub}</small>
        </a>
      </div>
      <div className="vd-colophon__cols">
        <nav aria-label="Explorar la historia">
          <p className="vd-colophon__label">Explora</p>
          <a href={href()}>El objeto</a>
          <a href={href("surcos")}>Los surcos</a>
          <a href={href("viaje")}>El viaje</a>
          <a href={href("mensaje")}>Tu mensaje</a>
        </nav>
        <div>
          <p className="vd-colophon__label">Fuentes y archivo</p>
          <a href="https://science.nasa.gov/mission/voyager/" target="_blank" rel="noopener noreferrer">Misión Voyager · NASA/JPL ↗</a>
          <a href="/creditos">Fotografías, película y grabación ↗</a>
          <p>Las cifras y fechas proceden de NASA/JPL.</p>
        </div>
        <div>
          <p className="vd-colophon__label">Una historia independiente</p>
          <p>Un relato sobre el Disco de Oro, sus voces y el largo viaje de las Voyager.</p>
          <p>{BRAND.legal}</p>
        </div>
      </div>
      <p className="vd-colophon__end">{BRAND.sub}<span>Una carta de presentación desde la Tierra</span></p>
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
  return <main id="contenido" className={`vd-main vd-main--${path[0] || "objeto"}`} tabIndex={-1}>{content}</main>;
}
