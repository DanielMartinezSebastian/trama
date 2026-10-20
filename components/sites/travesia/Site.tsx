"use client";

import { createContext, startTransition, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import AmbientLight from "@/components/ui/AmbientLight";
import BigFooter from "@/components/ui/BigFooter";
import { SharedText } from "@/components/ui/ElementTransition";
import MetaTable from "@/components/ui/MetaTable";
import PageTransition, { NAV_BACK, NAV_FORWARD, PageTransitionPersist } from "@/components/ui/PageTransition";
import Traveler, { TravelSlot, TravelStage, useTraveler } from "@/components/ui/Traveler";
import { tokensToStyle, type TokenSet } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { DOCS, FACTS, REEL, SLUG, TEAM, getDoc, type Doc } from "./data";
import "./travesia.css";

/*
 * Travesía (docs/14). Coreografía tomada de las webs de cine premiadas, no de una plantilla:
 * · Índice tipográfico (The Art of Documentary, Mario Roudil): al señalar un título, la «pantalla» lo reproduce y la luz
 *   ambiental de toda la página toma su color (We Go Again, Giordano Betti).
 * · Al abrirlo, esa misma pantalla —el mismo <video>, sin cortarse— se expande a la portada del documental y las
 *   palabras del título vuelan hasta el titular (Traveler + SharedText).
 * · «Siguiente documental» en dos tiempos (Ciel Rose): la pantalla se encoge a una ventana mientras cambia de película y
 *   luego se expande como portada nueva.
 * · La marca de la cabecera se convierte, palabra a palabra, en el titular gigante de la productora (Mario Roudil).
 */

const THEME: TokenSet = {
  bg: "#0b0d0c",
  fg: "#ece6da",
  mut: "#9a9d97",
  acc: "#ff7a59",
  acc2: "#5fd0c2",
  card: "rgba(236,230,218,0.05)",
  ln: "rgba(236,230,218,0.16)",
  r: 6,
  font: "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
  display: "var(--font-fraunces), Georgia, serif",
  accentFont: "var(--font-fraunces), Georgia, serif",
};
const TOKENS = { ...tokensToStyle(THEME), "--sel-bg": THEME.acc, "--sel-fg": THEME.bg } as CSSProperties;

const href = (path = "") => siteHref(SLUG, path);
const BRAND = "Travesía Documental";
/** Lo que puede reproducir la pantalla: cada documental y el tráiler de la temporada. */
const FILMS = [...DOCS.map((d) => ({ id: d.slug, src: d.video, poster: d.poster, alt: d.alt, label: d.title })), { id: "reel", src: REEL.src, poster: REEL.poster, alt: REEL.alt, label: REEL.label }];

type ScreenState = {
  /** qué película reproduce la pantalla */
  film: string;
  setFilm: (id: string) => void;
  /**
   * «Siguiente» en curso: la ficha (slug) que acopla la pantalla a su ventana del final antes de navegar. Es la ficha y no
   * un booleano porque la ficha siguiente es el mismo componente: con un booleano, en el commit de la navegación ella
   * también pintaría su ventana de «siguiente» (prioridad 2) y la pantalla no iría a la portada.
   */
  docking: string | null;
  setDocking: (slug: string | null) => void;
};
const ScreenContext = createContext<ScreenState>({ film: "reel", setFilm: () => {}, docking: null, setDocking: () => {} });
const useScreen = () => useContext(ScreenContext);

/** Cada página dice qué se reproduce en ella (al montarse). */
function useFilm(id: string) {
  const { setFilm } = useScreen();
  useLayoutEffect(() => setFilm(id), [id, setFilm]);
}

export function Shell({ children }: { children: ReactNode }) {
  const [film, setFilm] = useState("reel");
  const [docking, setDocking] = useState<string | null>(null);
  const path = usePathname();
  useEffect(() => setDocking(null), [path]);
  // los pseudo-elementos de la transición leen los tokens de :root, no del contenedor del tema (docs/05 · Tema)
  useEffect(() => {
    const s = document.documentElement.style;
    s.setProperty("--ui-vt-page", THEME.bg);
    s.setProperty("--acc", THEME.acc);
    return () => {
      s.removeProperty("--ui-vt-page");
      s.removeProperty("--acc");
    };
  }, []);
  return (
    <SiteFrame tokens={TOKENS} className="tv">
      <ScreenContext.Provider value={{ film, setFilm, docking, setDocking }}>
        <AmbientLight target=".tv-screen video.is-on" opacity={0.5} blur={110} />
        <TravelStage className="tv-stage">
          <Header />
          <Traveler id="pantalla" className="tv-screen" pace="slow">
            <Screen />
          </Traveler>
          {children}
        </TravelStage>
      </ScreenContext.Provider>
    </SiteFrame>
  );
}

function Header() {
  const path = usePathname();
  const links = [
    { label: "Índice", to: href() },
    { label: "Productora", to: href("productora") },
    { label: "Contacto", to: href("contacto") },
  ];
  // En la productora la marca ES el titular de la página: no puede estar a la vez en la cabecera (mismo nombre).
  const brandHere = path !== href("productora");
  return (
    <PageTransitionPersist name="tv-head">
      <header className="tv-head">
        <a className="tv-head__brand" href={href()} data-transition={NAV_BACK} aria-label="Travesía Documental, índice">
          {brandHere && <SharedText name="tv-marca" text={BRAND} stagger={60} />}
        </a>
        <nav aria-label="Principal" className="tv-head__nav">
          {links.map((l) => (
            <a key={l.to} href={l.to} aria-current={path === l.to ? "page" : undefined} data-transition={NAV_FORWARD}>
              {l.label}
            </a>
          ))}
        </nav>
      </header>
    </PageTransitionPersist>
  );
}

const clock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}:${String(Math.floor((s % 1) * 24)).padStart(2, "0")}`;

/**
 * La pantalla: un <video> por película, apilados; solo el activo se ve y se reproduce. Cambiar de película es un fundido
 * dentro de la misma caja, sin pantallazo negro (los demás ya tienen metadatos). Vive en el marco: viaja, no se monta.
 */
function Screen() {
  const { film } = useScreen();
  const at = useTraveler("pantalla");
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [time, setTime] = useState(0);
  useEffect(() => {
    for (const [id, v] of Object.entries(refs.current)) {
      if (!v) continue;
      if (id === film) void v.play().catch(() => {});
      else v.pause();
    }
    const v = refs.current[film];
    if (!v) return;
    const tick = () => setTime(v.currentTime);
    v.addEventListener("timeupdate", tick);
    return () => v.removeEventListener("timeupdate", tick);
  }, [film]);
  const current = FILMS.find((f) => f.id === film) ?? FILMS[FILMS.length - 1];
  return (
    <figure className="tv-screen__in">
      {FILMS.map((f) => (
        <video
          key={f.id}
          ref={(el) => {
            refs.current[f.id] = el;
          }}
          className={f.id === film ? "is-on" : ""}
          src={f.src}
          poster={f.poster}
          muted
          loop
          playsInline
          preload={f.id === film ? "auto" : "metadata"}
          aria-hidden={f.id !== film}
          aria-label={f.alt}
        />
      ))}
      <figcaption className="tv-screen__cap" data-at={at ?? ""}>
        <span className="tv-screen__rec" aria-hidden />
        <span className="tv-screen__label">{current.label}</span>
        <span className="tv-screen__tc">{clock(time)}</span>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- índice */

function Index() {
  const { film, setFilm } = useScreen();
  const active = getDoc(film) ?? DOCS[0];
  const router = useRouter();
  // al llegar, la pantalla reproduce el último documental señalado (o el primero)
  useFilm(active.slug);
  // Las fichas, precargadas: la pantalla y el título solo viajan si la página de destino se pinta en el mismo commit
  // que la navegación (si se queda cargando, la transición termina antes de que llegue el hueco nuevo).
  useEffect(() => DOCS.forEach((d) => router.prefetch(href(`documentales/${d.slug}`))), [router]);
  return (
    <section className="tv-index" aria-labelledby="tv-index-t">
      <h1 id="tv-index-t" className="tv-sr">
        Travesía Documental: seis documentales de mar
      </h1>
      <ol className="tv-index__list">
        {DOCS.map((d, i) => (
          <li key={d.slug} className={d.slug === active.slug ? "is-on" : ""}>
            <a href={href(`documentales/${d.slug}`)} data-transition={NAV_FORWARD} onPointerEnter={() => setFilm(d.slug)} onFocus={() => setFilm(d.slug)}>
              <span className="tv-index__n">{String(i + 1).padStart(2, "0")}</span>
              <SharedText name={`tv-t-${d.slug}`} text={d.title} className="tv-index__t" stagger={40} />
              <span className="tv-index__meta">
                {d.format} · {d.year}
              </span>
            </a>
          </li>
        ))}
      </ol>
      <div className="tv-index__aside">
        <TravelSlot id="pantalla" at="indice" className="tv-index__screen" />
        <p className="tv-index__log" key={active.slug}>
          {active.logline}
        </p>
      </div>
      <footer className="tv-index__foot">
        <span>Seis documentales · 2024–2026</span>
        <span className="tv-index__hint">Señala un título para verlo</span>
        <a href="/creditos">Créditos de los vídeos</a>
      </footer>
    </section>
  );
}

/* ---------------------------------------------------------------- ficha */

function Detail({ d }: { d: Doc }) {
  const { setFilm, docking: dockingFrom, setDocking } = useScreen();
  const router = useRouter();
  useFilm(d.slug);
  const docking = dockingFrom === d.slug;
  const i = DOCS.indexOf(d);
  const next = DOCS[(i + 1) % DOCS.length];
  const nextHref = href(`documentales/${next.slug}`);
  // precargada: el tiempo 2 (navegar) tiene que montar la ficha siguiente en el mismo commit (ver Index)
  useEffect(() => router.prefetch(nextHref), [router, nextHref]);
  const goNext = (e: MouseEvent) => {
    e.preventDefault();
    if (docking) return;
    // tiempo 1: la pantalla baja a la ventana de «siguiente» y cambia de película por el camino
    startTransition(() => {
      setDocking(d.slug);
      setFilm(next.slug);
    });
    // tiempo 2: navegar; la ventana se expande a la portada del siguiente
    window.setTimeout(() => router.push(nextHref, { transitionTypes: [NAV_FORWARD] }), 980);
  };
  return (
    <article className="tv-doc">
      <header className="tv-doc__hero">
        <TravelSlot id="pantalla" at="portada" className="tv-doc__screen" />
        <div className="tv-doc__over">
          <a className="tv-doc__back" href={href()} data-transition={NAV_BACK}>
            ← Índice
          </a>
          <SharedText as="h1" name={`tv-t-${d.slug}`} text={d.title} className="tv-doc__t" stagger={50} />
          <p className="tv-doc__meta tv-rise">
            <span>{d.format}</span>
            <span>{d.year}</span>
            <span>{d.place}</span>
          </p>
        </div>
      </header>
      <div className="tv-doc__body">
        <p className="tv-doc__log">{d.logline}</p>
        <div className="tv-doc__cols">
          <MetaTable rows={d.crew} label="Equipo" />
          <div className="tv-doc__text">
            {d.synopsis.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </div>
      <a className="tv-next" href={nextHref} onClick={goNext} data-navigate="manual">
        <span className="tv-next__k">Siguiente documental</span>
        <span className="tv-next__win">
          {/* el póster espera en la ventana; al pulsar, la pantalla baja aquí (prioridad 2) y lo tapa */}
          {docking ? (
            <TravelSlot id="pantalla" at="siguiente" priority={2} className="tv-next__slot" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={next.poster} alt="" />
          )}
        </span>
        <SharedText name={`tv-t-${next.slug}`} text={next.title} className="tv-next__t" stagger={40} />
      </a>
      <Footer />
    </article>
  );
}

/* ---------------------------------------------------------------- productora y contacto */

function Studio() {
  useFilm("reel");
  return (
    <article className="tv-studio">
      <h1 className="tv-studio__brand">
        <SharedText name="tv-marca" text={BRAND} stagger={70} />
      </h1>
      <div className="tv-studio__grid">
        <div className="tv-studio__text">
          <p className="tv-lead">Somos nueve personas entre Donostia y Lisboa. Empezamos grabando la costa vasca con un dron prestado; hoy coproducimos con televisiones públicas y festivales de toda Europa.</p>
          <p>Trabajamos sin cebos ni jaulas, con permisos de cada parque marino y con biólogos en el equipo desde la preproducción. Si un plano molesta a un animal, no se rueda.</p>
          <MetaTable rows={FACTS} columns={2} label="La productora en cifras" />
          <ul className="tv-team" aria-label="Equipo">
            {TEAM.map((t) => (
              <li key={t.name}>
                <b>{t.name}</b>
                <span>{t.role}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="tv-studio__aside" aria-label="Tráiler de la temporada">
          <TravelSlot id="pantalla" at="retrato" className="tv-studio__slot" />
        </aside>
      </div>
      <Footer />
    </article>
  );
}

function Contact() {
  useFilm("reel");
  return (
    <article className="tv-contact">
      <h1 className="tv-contact__t">
        Rodemos <TravelSlot id="pantalla" at="pildora" as="span" className="tv-pill" /> el mar juntos
      </h1>
      <dl className="tv-contact__list">
        <div>
          <dt>Proyectos y coproducción</dt>
          <dd>
            <a href="mailto:hola@travesia.example">hola@travesia.example</a>
          </dd>
        </div>
        <div>
          <dt>Distribución y festivales</dt>
          <dd>
            <a href="mailto:ventas@travesia.example">ventas@travesia.example</a>
          </dd>
        </div>
        <div>
          <dt>Estudio</dt>
          <dd>Paseo de Francia 12, Donostia</dd>
        </div>
      </dl>
    </article>
  );
}

function Footer() {
  return <BigFooter heading="Rodemos juntos" lead="Coproducciones, encargos y distribución" email="hola@travesia.example" note="© 2026 Travesía. Productora ficticia: demo construida con Trama." credit="Créditos de los vídeos" creditHref="/creditos" city="Donostia" timeZone="Europe/Madrid" />;
}

export function Page({ path }: { path: string[] }) {
  const route = path.join("/");
  let content: ReactNode = null;
  if (route === "") content = <Index />;
  else if (path[0] === "documentales" && path[1] && getDoc(path[1])) content = <Detail d={getDoc(path[1])!} />;
  else if (route === "productora") content = <Studio />;
  else if (route === "contacto") content = <Contact />;
  return (
    <PageTransition key={route} kind="fade" pace="normal">
      <main id="contenido" className={`tv-main tv-main--${path[0] || "indice"}`}>
        {content}
      </main>
    </PageTransition>
  );
}
