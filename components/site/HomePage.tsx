import Link from "next/link";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import HomeStage from "./HomeStage";
import InstallChip from "./InstallChip";
import StartSteps from "./StartSteps";
import VariantLab from "./VariantLab";

/*
 * Portada de la web: componente de servidor. El texto, las listas y los enlaces llegan como HTML sin JavaScript propio;
 * solo son cliente las islas interactivas: el fondo (HomeStage), el banco de variantes, las pestañas de «Empezar» y el
 * botón de copiar.
 */

export type HomeData = {
  counts: { components: number; categories: number; styles: number; demos: number; sites: number };
  categories: { id: string; label: string; blurb: string; count: number; first: string }[];
  landings: { slug: string; name: string; kind: string; lib: string; accent: string }[];
  sites: { slug: string; name: string; tag: string; pages: number; accent: string }[];
  componentNames: string[];
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function HomePage({ data }: { data: HomeData }) {
  const { counts } = data;

  return (
    <>
      <HomeStage />

      <main className="tr-home">
        {/* ---------- 00 · portada ---------- */}
        <section className="tr-hero" data-act={0}>
          <p className="tr-label">Librería de componentes · React / Next.js</p>
          <div className="tr-hero__body">
            <h1 className="tr-hero__name">TRAMA</h1>
            <p className="tr-hero__lead">
              ASCII, textmode, pixel art y secciones de landing. <span>Un juego de tokens, ocho estilos y seis intenciones de color</span> para montar webs con carácter sin salir de React.
            </p>
            <div className="tr-hero__cta">
              <Link href="/docs/empezar" className="tr-btn tr-btn--solid">
                Empezar
              </Link>
              <Link href="/componentes" className="tr-btn">
                Ver componentes →
              </Link>
              <InstallChip />
            </div>
          </div>
          <dl className="tr-stats">
            <div>
              <dt>componentes</dt>
              <dd>{counts.components}</dd>
            </div>
            <div>
              <dt>categorías</dt>
              <dd>{counts.categories}</dd>
            </div>
            <div>
              <dt>estilos</dt>
              <dd>{counts.styles}</dd>
            </div>
            <div>
              <dt>demos</dt>
              <dd>{counts.demos}</dd>
            </div>
            <div>
              <dt>webs completas</dt>
              <dd>{counts.sites}</dd>
            </div>
          </dl>
        </section>

        <div className="tr-strip">
          <Marquee text={data.componentNames.join(" · ")} variant="minimal" tone="mut" rows={1} fontSize={12} duration={140} separator="   ·   " edgeFade />
        </div>

        {/* ---------- 01 · componentes ---------- */}
        <section id="componentes" className="tr-sec" data-act={1}>
          <header className="tr-sec__head">
            <p className="tr-label">01 — Componentes</p>
            <h2 className="tr-statement">
              Un componente,
              <br />
              ocho estilos.
            </h2>
            <p className="tr-sec__lead">
              El tema son ocho tokens CSS en un contenedor; el estilo, la prop <code>variant</code>; el color semántico, la prop <code>intent</code>. Pruébalo: todo lo de abajo son piezas reales del kit.
            </p>
          </header>
          <Reveal trigger="inview" kind="fade">
            <VariantLab />
          </Reveal>

          <div className="tr-sub">
            <p className="tr-label">
              {counts.categories} categorías · {counts.components} componentes
            </p>
            <Link href="/componentes" className="tr-link">
              Abrir el catálogo interactivo →
            </Link>
          </div>
          <ol className="tr-index">
            {data.categories.map((c, i) => (
              <li key={c.id}>
                <Link href={`/componentes?c=${c.id}#${c.first}`} className="tr-index__row">
                  <span className="tr-n">{pad(i + 1)}</span>
                  <span className="tr-index__name">{c.label}</span>
                  <span className="tr-index__blurb">{c.blurb}</span>
                  <span className="tr-index__count">{c.count}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- 02 · landings ---------- */}
        <section id="landings" className="tr-sec" data-act={2}>
          <header className="tr-sec__head">
            <p className="tr-label">02 — Landings de referencia</p>
            <h2 className="tr-statement">Hechas solo con el kit.</h2>
            <p className="tr-sec__lead">Cada una es una página completa sin CSS de componentes propio: solo tokens, variantes y composición. Ábrelas, cópialas, parte de su estructura.</p>
          </header>
          <ol className="tr-releases">
            {data.landings.map((l, i) => (
              <li key={l.slug}>
                <Link href={`/demo/${l.slug}`} className="tr-release" style={{ ["--accent" as string]: l.accent }}>
                  <span className="tr-n">{pad(i + 1)}</span>
                  <span className="tr-release__name">{l.name}</span>
                  <span className="tr-release__meta">
                    {l.kind} · {l.lib}
                  </span>
                  <span className="tr-release__go">Ver →</span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="tr-sub">
            <p className="tr-label">{counts.demos} demos en total: fondos, texto, scroll y landings</p>
            <Link href="/demos" className="tr-link">
              Todas las demos →
            </Link>
          </div>
        </section>

        {/* ---------- 03 · webs completas ---------- */}
        <section id="webs" className="tr-sec" data-act={3}>
          <header className="tr-sec__head">
            <p className="tr-label">03 — Webs completas</p>
            <h2 className="tr-statement">Varias páginas, estado real.</h2>
            <p className="tr-sec__lead">Blog, tienda con carrito, servicios con chatbot, fabricante y portfolio: navegación entre páginas, estado compartido y contenido propio, cada una con su tema.</p>
          </header>
          <ol className="tr-releases tr-releases--sm">
            {data.sites.map((s, i) => (
              <li key={s.slug}>
                <Link href={`/sitios/${s.slug}`} className="tr-release" style={{ ["--accent" as string]: s.accent }}>
                  <span className="tr-n">{pad(i + 1)}</span>
                  <span className="tr-release__name">{s.name}</span>
                  <span className="tr-release__meta">
                    {s.tag} · {s.pages} páginas
                  </span>
                  <span className="tr-release__go">Ver →</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- 04 · empezar ---------- */}
        <section id="empezar" className="tr-sec tr-sec--last" data-act={4}>
          <header className="tr-sec__head">
            <p className="tr-label">04 — Empezar</p>
            <h2 className="tr-statement">Instala. Pon tus tokens. Compón.</h2>
          </header>
          <div className="tr-start">
            <StartSteps />
            <ol className="tr-steps">
              <li>
                <span className="tr-n">01</span>
                <div>
                  <strong>Secciones primero</strong>
                  <p>Hero, FeatureGrid, PricingSection, FAQSection, ContactForm, Footer… y piezas sueltas solo para lo que falte.</p>
                </div>
              </li>
              <li>
                <span className="tr-n">02</span>
                <div>
                  <strong>Pasa siempre el texto</strong>
                  <p>Los defaults son copy de demostración. Un texto opcional se oculta con una cadena vacía.</p>
                </div>
              </li>
              <li>
                <span className="tr-n">03</span>
                <div>
                  <strong>Sin colores fijos</strong>
                  <p>Todo sale de <code>--bg --fg --mut --acc --acc2 --card --ln --r</code>: cambia el tema en un solo sitio.</p>
                </div>
              </li>
              <li>
                <Link href="/docs/empezar" className="tr-link">
                  Guía de primeros pasos →
                </Link>
              </li>
            </ol>
          </div>
        </section>
      </main>
    </>
  );
}
