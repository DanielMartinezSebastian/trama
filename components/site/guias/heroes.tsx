import type { CSSProperties, ReactNode } from "react";
import FitText from "@/components/ui/FitText";
import LocalTime from "@/components/ui/LocalTime";
import type { GuideHero } from "@/lib/ui/guides";
import { CONTENT, type GuideContent } from "./content";

/**
 * Las ocho composiciones del primer pantallazo (docs/16 §3), escritas solo con las clases `ui-g-*` de la guía y el CSS de
 * `guias.css` (prefijo `gx-`). No fijan colores ni tamaños: todo sale de la guía que las envuelve (`GuideFrame`), así que la
 * misma composición se ve distinta en cada guía. El texto sobre foto o vídeo va en blanco sobre una veladura, que no depende
 * del tema.
 */

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Cabeceras medidas: tres puntos (Reservar · marca · Menú), barra (marca · enlaces), cuatro columnas (con reloj), isla. */
function Header({ c, kind, onMedia = false }: { c: GuideContent; kind: "split3" | "bar" | "cols4" | "island"; onMedia?: boolean }) {
  const cls = `gx-head gx-head--${kind} ${onMedia ? "gx-on-media" : ""}`;
  if (kind === "split3")
    return (
      <header className={`ui-g-header ${cls}`}>
        <a href="#" className="ui-g-label gx-hide-sm">{c.cta2}</a>
        <span className="gx-brand">{c.brand}</span>
        <a href="#" className="ui-g-label">Menú</a>
      </header>
    );
  if (kind === "cols4")
    return (
      <header className={`ui-g-header ${cls}`}>
        <span className="gx-brand">{c.brand}</span>
        <span className="ui-g-label ui-g-muted gx-hide-sm">{c.eyebrow}</span>
        <span className="ui-g-mono ui-g-muted gx-hide-sm">
          <LocalTime city={c.city} timeZone="Europe/Madrid" />
        </span>
        <a href="#" className="ui-g-btn ui-g-btn--ghost gx-btn-sm">Menú</a>
      </header>
    );
  if (kind === "island")
    return (
      <header className={`gx-head gx-head--island`}>
        <nav className="gx-island ui-g-card" aria-label="Secciones">
          <span className="gx-brand">{c.brand}</span>
          {c.nav.slice(0, 3).map((n) => (
            <a key={n} href="#" className="gx-hide-sm">{n}</a>
          ))}
          <a href="#" className="ui-g-btn gx-btn-sm">{c.cta}</a>
        </nav>
      </header>
    );
  return (
    <header className={`ui-g-header ${cls}`}>
      <span className="gx-brand">{c.brand}</span>
      <nav className="gx-links" aria-label="Secciones">
        {c.nav.map((n) => (
          <a key={n} href="#" className="ui-g-label gx-hide-sm">{n}</a>
        ))}
        <a href="#" className="ui-g-label gx-show-sm">Menú</a>
      </nav>
    </header>
  );
}

function Video({ c }: { c: GuideContent }) {
  return <video className="gx-media" src={c.video.src} poster={c.video.poster} aria-label={c.video.alt} muted loop playsInline autoPlay preload="metadata" />;
}

/** C1 · Vídeo a sangre, titular en dos líneas escalonadas (Tengile Malamala). */
function SplitVideo({ c }: { c: GuideContent }) {
  return (
    <section className="gx-hero gx-c1 gx-on-media">
      <Video c={c} />
      <div className="gx-scrim" aria-hidden />
      <Header c={c} kind="split3" onMedia />
      <div className="gx-c1__body ui-g-wrap ui-g-rise">
        <h1 className="ui-g-h1 gx-c1__title" style={i(0)}>
          <span>{c.titleLines[0]}</span>
          <span>{c.titleLines[1]}</span>
        </h1>
        <div className="gx-c1__side" style={i(1)}>
          <p className="ui-g-body">{c.lead}</p>
          <a href="#" className="gx-arrow-btn">
            <span>{c.cta}</span>
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/** C2 · El visual dentro de un marco, marca fantasma detrás, subtítulo en dos tonos (Lidar Drone Scanning). */
function FramedObject({ c }: { c: GuideContent }) {
  return (
    <section className="gx-hero gx-c2">
      <Header c={c} kind="cols4" />
      <div className="gx-c2__frame ui-g-card">
        <span className="ui-g-brand gx-c2__ghost" aria-hidden>{c.brand}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gx-c2__object" src={c.object.src} alt={c.object.alt} />
      </div>
      <div className="gx-c2__foot ui-g-wrap ui-g-rise">
        <h1 className="ui-g-h1 gx-two-tone" style={i(0)}>
          {c.title}. <span className="ui-g-muted">{c.sub}</span>
        </h1>
        <span className="ui-g-label" style={i(1)}>Desplaza ↓</span>
      </div>
    </section>
  );
}

/** C3 · Frase gigante en cinta que pasa por detrás de una foto centrada (Realevate). */
function MarqueeWindow({ c }: { c: GuideContent }) {
  const phrase = `${c.title} · `;
  return (
    <section className="gx-hero gx-c3">
      <Header c={c} kind="bar" />
      <div className="gx-c3__stage">
        {/* dos mitades iguales (3 frases cada una) para el bucle; la primera frase es el <h1>, el resto son copias ocultas */}
        <div className="gx-c3__belt">
          <span className="ui-g-brand">
            <h1 className="gx-c3__h1">{phrase}</h1>
            <span aria-hidden>{phrase.repeat(2)}</span>
          </span>
          <span className="ui-g-brand" aria-hidden>
            {phrase.repeat(3)}
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gx-c3__window" src={c.projects[0].src} alt={c.projects[0].alt} />
      </div>
      <div className="gx-c3__center ui-g-wrap ui-g-rise">
        <p className="ui-g-body" style={i(0)}>{c.lead}</p>
        <span className="gx-chip ui-g-label" style={i(1)}>{c.offer.title}</span>
      </div>
      <div className="gx-c3__bar ui-g-wrap">
        <span className="ui-g-label ui-g-muted">{c.brand}® 2026</span>
        <a href="#" className="ui-g-btn ui-g-btn--ghost">{c.cta}</a>
      </div>
    </section>
  );
}

/** C4 · Asimétrico: foto grande sangrada a la derecha, pieza pequeña con pie en el centro (Odyssée). */
function AsymEditorial({ c }: { c: GuideContent }) {
  return (
    <section className="gx-hero gx-c4">
      <Header c={c} kind="bar" />
      <div className="gx-c4__grid ui-g-grid ui-g-wrap">
        <div className="gx-c4__text ui-g-rise">
          <p className="ui-g-label ui-g-muted" style={i(0)}>{c.eyebrow}</p>
          <h1 className="ui-g-h2" style={i(1)}>{c.title}</h1>
          <a href="#" className="ui-g-btn" style={i(2)}>{c.cta2}</a>
        </div>
        <figure className="gx-c4__small">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.object.src} alt={c.object.alt} />
          <figcaption className="ui-g-body ui-g-muted">{c.lead}</figcaption>
        </figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gx-c4__big" src={c.wide.src} alt={c.wide.alt} />
      </div>
    </section>
  );
}

/** C5 · Producto: isla de navegación, objeto que entra desde arriba, titular centrado (Butter, Raycast). */
function ProductCenter({ c }: { c: GuideContent }) {
  return (
    <section className="gx-hero gx-c5">
      <Header c={c} kind="island" />
      <div className="gx-c5__body ui-g-wrap ui-g-rise">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gx-c5__object" src={c.object.src} alt={c.object.alt} style={i(0)} />
        <h1 className="ui-g-h1" style={i(1)}>{c.title}</h1>
        <p className="ui-g-body ui-g-muted" style={i(2)}>{c.lead.split(".")[0]}.</p>
        <div className="gx-row" style={i(3)}>
          <a href="#" className="ui-g-btn">{c.cta}</a>
          <a href="#" className="ui-g-btn ui-g-btn--ghost">{c.cta2}</a>
        </div>
      </div>
    </section>
  );
}

/** C6 · Collage a sangre y párrafo-titular abajo a la izquierda (Pensatori Irrazionali). */
function CollageManifesto({ c }: { c: GuideContent }) {
  return (
    <section className="gx-hero gx-c6">
      <Header c={c} kind="bar" />
      <div className="gx-c6__collage" aria-hidden>
        {c.collage.map((p, n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.src} src={p.src} alt="" className={`gx-c6__tile gx-c6__tile--${n}`} />
        ))}
      </div>
      <div className="gx-c6__text ui-g-wrap ui-g-rise">
        <p className="ui-g-label" style={i(0)}>+ ({c.eyebrow})</p>
        <h1 className="ui-g-h2 gx-c6__para" style={i(1)}>{c.manifesto.split(".")[0]}.</h1>
      </div>
    </section>
  );
}

/** C7 · Foto oscura con titular a la izquierda, datos en mono y tarjetas de acceso (CoMinVi). */
function DarkData({ c }: { c: GuideContent }) {
  return (
    <section className="gx-hero gx-c7 gx-on-media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="gx-media" src={c.dark.src} alt={c.dark.alt} />
      <div className="gx-scrim gx-scrim--strong" aria-hidden />
      <Header c={c} kind="bar" onMedia />
      <div className="gx-c7__body ui-g-wrap ui-g-rise">
        <h1 className="ui-g-h1" style={i(0)}>{c.title}</h1>
        <ul className="gx-c7__data ui-g-mono" style={i(1)}>
          {c.data.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
      <div className="gx-c7__cards ui-g-wrap">
        {c.projects.slice(1, 3).map((p) => (
          <a key={p.title} href="#" className="gx-c7__card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt="" />
            <span className="ui-g-mono">{p.title} ▸</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/** C8 · La marca llena el ancho; debajo, franja de foto y texto en columnas (OFFFForum, Neutomni). */
function Wordmark({ c }: { c: GuideContent }) {
  return (
    <section className="gx-hero gx-c8">
      <Header c={c} kind="bar" />
      <div className="ui-g-wrap gx-c8__mark">
        <FitText as="h1" className="ui-g-brand gx-c8__fit">
          {c.brand}
        </FitText>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="gx-c8__strip" src={c.wide.src} alt={c.wide.alt} />
      <div className="gx-c8__cols ui-g-grid ui-g-wrap ui-g-rise">
        <p className="ui-g-label" style={i(0)}>{c.eyebrow}</p>
        <p className="ui-g-h2 gx-c8__claim" style={i(1)}>{c.title}</p>
        <div className="gx-c8__cta" style={i(2)}>
          <p className="ui-g-body ui-g-muted">{c.lead}</p>
          <a href="#" className="ui-g-btn">{c.cta}</a>
        </div>
      </div>
    </section>
  );
}

const MAP: Record<GuideHero, (p: { c: GuideContent }) => ReactNode> = {
  "split-video": SplitVideo,
  "framed-object": FramedObject,
  "marquee-window": MarqueeWindow,
  "asym-editorial": AsymEditorial,
  "product-center": ProductCenter,
  "collage-manifesto": CollageManifesto,
  "dark-data": DarkData,
  wordmark: Wordmark,
};

/** Pinta una composición por id con el contenido dado (por defecto, el de Albor). */
export function GuideHeroView({ id, content = CONTENT }: { id: GuideHero; content?: GuideContent }) {
  const C = MAP[id] ?? SplitVideo;
  return <C c={content} />;
}
