import type { CSSProperties, ReactNode } from "react";
import FitText from "@/components/ui/FitText";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import PinnedSection from "@/components/ui/PinnedSection";
import ProjectList from "@/components/ui/ProjectList";
import ScrubText from "@/components/ui/ScrubText";
import type { GuideStory } from "@/lib/ui/guides";
import { CONTENT, type GuideContent } from "./content";
import { BeforeAfterLite, Hotspots, Webfilm } from "./parts";

/**
 * Las diez estructuras de relato (docs/16 §4) con el mismo contenido. Cada una es el cuerpo de la página después de la
 * portada; todas acaban en el mismo cierre. Solo usan piezas del kit y las clases `ui-g-*`, así que siguen la guía que las
 * envuelve.
 */

const pad = (n: number) => String(n + 1).padStart(2, "0");

function Head({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="gx-sec-head">
      <p className="ui-g-label ui-g-muted">{kicker}</p>
      <h2 className="ui-g-h2">{title}</h2>
    </div>
  );
}

function Features({ c }: { c: GuideContent }) {
  return (
    <section className="ui-g-section ui-g-wrap">
      <Head kicker="Cómo trabajamos" title="Tres cosas que hacemos distinto" />
      <div className="ui-g-grid gx-features">
        {c.features.map((f, n) => (
          <article key={f.title} className="gx-feature ui-g-line">
            <p className="ui-g-mono ui-g-muted">{pad(n)}</p>
            <h3 className="gx-feature__title">{f.title}</h3>
            <p className="ui-g-body ui-g-muted">{f.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Stats({ c }: { c: GuideContent }) {
  return (
    <section className="ui-g-section ui-g-wrap">
      <div className="ui-g-grid gx-stats">
        {c.stats.map((s) => (
          <div key={s.label} className="gx-stat ui-g-line">
            <p className="ui-g-h1">{s.value}</p>
            <p className="ui-g-label ui-g-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Quote({ c }: { c: GuideContent }) {
  return (
    <section className="ui-g-section ui-g-wrap gx-quote">
      <blockquote>
        <p className="ui-g-h2">«{c.quote.text}»</p>
        <footer className="ui-g-label ui-g-muted">{c.quote.by}</footer>
      </blockquote>
    </section>
  );
}

function Offer({ c }: { c: GuideContent }) {
  return (
    <section className="ui-g-section ui-g-wrap">
      <div className="gx-offer ui-g-card">
        <div>
          <p className="ui-g-label ui-g-muted">Para empezar</p>
          <h2 className="ui-g-h2">{c.offer.title}</h2>
          <p className="ui-g-body ui-g-muted">{c.offer.text}</p>
        </div>
        <ul className="gx-offer__list">
          {c.offer.items.map((it) => (
            <li key={it} className="ui-g-line">{it}</li>
          ))}
        </ul>
        <a href="#" className="ui-g-btn">{c.cta2}</a>
      </div>
    </section>
  );
}

/** Cierre común: llamada a la acción, marca a todo el ancho y pie con correo y ciudad. */
function Closing({ c }: { c: GuideContent }) {
  return (
    <footer className="gx-closing ui-g-wrap">
      <div className="gx-closing__cta">
        <p className="ui-g-h2">¿Hablamos de tu luz?</p>
        <a href="#" className="ui-g-btn">{c.cta2}</a>
      </div>
      <FitText as="p" className="ui-g-brand gx-closing__brand">
        {c.brand}
      </FitText>
      <div className="gx-closing__meta ui-g-label ui-g-muted">
        <span>{c.email}</span>
        <span>{c.city}</span>
        <span>© 2026 {c.brand} (marca ficticia)</span>
      </div>
    </footer>
  );
}

const Service = ({ c }: { c: GuideContent }) => (
  <>
    <Features c={c} />
    <Stats c={c} />
    <Quote c={c} />
    <Offer c={c} />
  </>
);

const Chapters = ({ c }: { c: GuideContent }) => (
  <>
    <PinnedSection length={3} className="gx-chapters">
      <div className="gx-chapters__inner ui-g-wrap">
        <p className="ui-g-label ui-g-muted">Método</p>
        {c.chapters.map((ch, n) => (
          <article key={ch.title} className="gx-chapter" style={{ "--n": n } as CSSProperties}>
            <p className="ui-g-mono ui-g-muted">
              {pad(n)} / {pad(c.chapters.length - 1)}
            </p>
            <h2 className="ui-g-h1">{ch.title}</h2>
            <p className="ui-g-body">{ch.text}</p>
          </article>
        ))}
        <div className="gx-chapters__bar" aria-hidden />
      </div>
    </PinnedSection>
    <Offer c={c} />
  </>
);

const ObjectStory = ({ c }: { c: GuideContent }) => (
  <>
    <section className="ui-g-section ui-g-wrap gx-object">
      <div className="gx-object__stick">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.object.src} alt={c.object.alt} />
      </div>
      <div className="gx-object__steps">
        {c.states.map((s, n) => (
          <article key={s.title} className="gx-object__step">
            <p className="ui-g-mono ui-g-muted">{pad(n)}</p>
            <h2 className="ui-g-h2">{s.title}</h2>
            <p className="ui-g-body ui-g-muted">{s.text}</p>
          </article>
        ))}
      </div>
    </section>
    <Stats c={c} />
  </>
);

const Product = ({ c }: { c: GuideContent }) => (
  <>
    <section className="ui-g-section ui-g-wrap gx-product">
      <p className="ui-g-h2 gx-product__poem">Una pieza de latón, un vidrio y la luz que ya tenías.</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.collage[0].src} alt={c.collage[0].alt} />
    </section>
    <Features c={c} />
    <Offer c={c} />
  </>
);

const Manifesto = ({ c }: { c: GuideContent }) => (
  <>
    <section className="ui-g-section ui-g-wrap gx-manifesto">
      <p className="ui-g-label ui-g-muted">Manifiesto</p>
      <ScrubText as="p" className="ui-g-h2">{c.manifesto}</ScrubText>
    </section>
    <Stats c={c} />
  </>
);

const Index = ({ c }: { c: GuideContent }) => (
  <>
    <section className="ui-g-section ui-g-wrap">
      <Head kicker="Proyectos" title="Trabajo reciente" />
      <ProjectList items={c.projects.map((p) => ({ title: p.title, meta: p.meta, year: p.year, image: p.src, alt: p.alt, href: "#" }))} />
    </section>
    <section className="ui-g-section ui-g-wrap gx-next ui-g-line">
      <p className="ui-g-label ui-g-muted">Siguiente proyecto</p>
      <a href="#" className="ui-g-h1">{c.projects[0].title} →</a>
    </section>
  </>
);

const World = ({ c }: { c: GuideContent }) => (
  <>
    <section className="ui-g-section ui-g-wrap">
      <Head kicker="Explora" title="Una casa, tres decisiones de luz" />
      <Hotspots c={c} />
    </section>
    <Quote c={c} />
  </>
);

const TimelineStory = ({ c }: { c: GuideContent }) => (
  <>
    <HorizontalScroll heading="" className="gx-timeline">
      {c.timeline.map((t) => (
        <article key={t.year} className="gx-year">
          <p className="ui-g-brand gx-year__num">{t.year}</p>
          <h2 className="ui-g-h2">{t.title}</h2>
          <p className="ui-g-body ui-g-muted">{t.text}</p>
        </article>
      ))}
    </HorizontalScroll>
    <Offer c={c} />
  </>
);

const BeforeAfter = ({ c }: { c: GuideContent }) => (
  <>
    <section className="ui-g-section ui-g-wrap">
      <Head kicker="Casa Levante" title="El mismo salón, a la misma hora" />
      <BeforeAfterLite c={c} />
    </section>
    <Stats c={c} />
  </>
);

const Film = ({ c }: { c: GuideContent }) => (
  <>
    <section className="ui-g-section ui-g-wrap">
      <Webfilm c={c} />
    </section>
    <Offer c={c} />
  </>
);

const MAP: Record<GuideStory, (p: { c: GuideContent }) => ReactNode> = {
  service: Service,
  chapters: Chapters,
  object: ObjectStory,
  product: Product,
  manifesto: Manifesto,
  index: Index,
  world: World,
  timeline: TimelineStory,
  "before-after": BeforeAfter,
  webfilm: Film,
};

/** Cuerpo de la página para un relato, con su cierre. */
export function GuideStoryView({ id, content = CONTENT }: { id: GuideStory; content?: GuideContent }) {
  const S = MAP[id] ?? Service;
  return (
    <>
      <S c={content} />
      <Closing c={content} />
    </>
  );
}
