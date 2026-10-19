"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import BlueprintFrame from "@/components/ui/BlueprintFrame";
import CellGrid from "@/components/ui/CellGrid";
import EdgeTab from "@/components/ui/EdgeTab";
import ExplorableCanvas from "@/components/ui/ExplorableCanvas";
import FitText from "@/components/ui/FitText";
import GridBackground from "@/components/ui/GridBackground";
import ImageReveal from "@/components/ui/ImageReveal";
import MetaTable from "@/components/ui/MetaTable";
import PinnedSection from "@/components/ui/PinnedSection";
import RollLink from "@/components/ui/RollLink";
import ScrubText from "@/components/ui/ScrubText";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SplitText from "@/components/ui/SplitText";
import { getLenis } from "@/lib/motion/lenis";
import { photo } from "@/lib/sites/photos";
import { blueprintArt } from "@/lib/sites/art";
import { blueprintTokens, FONT_PAIRINGS, tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { CHAPTERS, CLIENTS, FEATURES, INTEGRATIONS, ISSUE_STOP, ISSUES, MODEL, MODEL_DIMS, MODEL_WORLD, PROBLEMS, PROOF, SLUG, SPECS, TOUR } from "./data";
import "./plano.css";

const PAIR = FONT_PAIRINGS.find((p) => p.id === "tecnico")!;
/** tonos de la demo: blanco y negro apagados (como las fotos) y un solo acento. Van en los tokens para que todo los use
 * (la selección de texto, el tramo oscuro) y también como constantes para la maqueta 3D, que no entiende `var()` */
const TONES = { ink: "#1d1c1a", cream: "#efe9dc", mutDark: "#b9b2a3", wood: "#cbc3b4", paper: "#f1efe9" };
// tema del kit `blueprintTokens` con el par tipográfico «técnico» y los tonos de la demo
const TOKENS: CSSProperties = {
  ...tokensToStyle({ ...blueprintTokens, display: PAIR.display }),
  "--font-accent": PAIR.accent,
  "--ink": TONES.ink,
  "--cream": TONES.cream,
  "--mut-dark": TONES.mutDark,
  "--wood": TONES.wood,
  // selección en tinta sobre papel, no en naranja
  "--sel-bg": blueprintTokens.fg,
  "--sel-fg": blueprintTokens.bg,
} as CSSProperties;
const href = (p = "") => siteHref(SLUG, p);
const pad = (n: number) => String(n).padStart(2, "0");

/** pantallas de scroll que dura el relato (algo más de una por parada) */
const LEN = 13;

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <SiteFrame tokens={TOKENS} className="pn">
      <SmoothScroll />
      <div className="pn-wrap">
        <BlueprintFrame>
          <header className="pn-head">
            <a className="pn-brand" href={href()}><span aria-hidden>◩</span> Cota</a>
            <nav className="pn-nav pn-mono" aria-label="Principal">
              <a href={href("producto")}>Producto</a>
              <a href={href("recorrido")}>Recorrido</a>
              <a href={href("producto")}>Precios</a>
            </nav>
            <a className="pn-cta pn-mono" href={href("producto")}>Solicitar demo <span aria-hidden>→</span></a>
          </header>
          <main id="contenido">{children}</main>
          <footer className="pn-foot pn-mono">
            <span>© 2026 Cota · Software de revisión de modelos</span>
            <span>Demo de Trama — producto ficticio · <a href="/creditos">Créditos de las imágenes</a></span>
          </footer>
        </BlueprintFrame>
      </div>
      <EdgeTab label="Solicitar demo" href={href("producto")} mark="C." top="56%" />
    </SiteFrame>
  );
}

/* ---------- recorrido: el relato «De guardar a entregar» (Atlas, Cartier, Sleep Well) ---------- */
function Chapter({ i, on }: { i: number; on: boolean }) {
  const c = CHAPTERS[i];
  const tab = on ? undefined : -1;
  const issue = c.issue ? ISSUES.find((x) => x.id === c.issue)! : null;
  return (
    <li className={`pn-ch pn-ch--${c.kind}`} data-on={on ? "" : undefined}>
      {c.kind === "intro" ? (
        <div className="pn-ch__row">
          <h1>{c.title}</h1>
          <div className="pn-ch__sub">
            <p>{c.text}</p>
            <span className="pn-mono">Revit · Rhino · ArchiCAD · SketchUp</span>
          </div>
          <span className="pn-ch__go pn-mono" aria-hidden>Baja para revisar ↓</span>
        </div>
      ) : c.kind === "step" ? (
        <>
          <div className="pn-ch__card">
            <span className="pn-ch__n" aria-hidden>{c.n}</span>
            <p className="pn-mono">Paso {c.n} de 04 · la revisión</p>
            <h2>{c.title}</h2>
            <p>{c.text}</p>
          </div>
          <div className="pn-ch__word" aria-hidden>
            <FitText max={200}>{c.word}</FitText>
          </div>
        </>
      ) : (
        <div className="pn-ch__card">
          <p className="pn-mono">
            {issue ? `Incidencia ${pad(ISSUES.indexOf(issue) + 1)} / ${pad(ISSUES.length)} · ${issue.meta}` : c.kind === "save" ? "El problema" : c.kind === "scan" ? "1.400 reglas" : "Al cerrar el archivo"}
          </p>
          <h2>{c.title}</h2>
          {c.kind === "save" ? (
            <ScrubText scope=".ui-pin" range={[0.03, 0.13]} dim={0.22}>{c.text!}</ScrubText>
          ) : (
            <p>{c.text}</p>
          )}
          {issue && (
            <a className="pn-btn pn-mono" href={href(`incidencias/${issue.id}`)} tabIndex={tab}>
              <span>Ver incidencia</span><i aria-hidden>→</i>
            </a>
          )}
          {c.kind === "report" && (
            <>
              <ol className="pn-report">
                {ISSUES.map((x) => (
                  <li key={x.id}>
                    <a href={href(`incidencias/${x.id}`)} tabIndex={tab}>
                      <b>{x.title}</b>
                      <span className="pn-mono">{x.severity}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <a className="pn-btn pn-mono" href={href("producto")} tabIndex={tab}><span>Ver el producto</span><i aria-hidden>→</i></a>
            </>
          )}
        </div>
      )}
    </li>
  );
}

function Tour() {
  const [stop, setStop] = useState(0);
  const dark = CHAPTERS[stop]?.kind === "step";
  // al volver de una ficha (#sala-c1…): el scroll suave arranca arriba, así que se salta a la sala después
  useEffect(() => {
    const el = location.hash.startsWith("#sala-") ? document.getElementById(location.hash.slice(1)) : null;
    if (!el) return;
    // se insiste unas veces: el scroll suave puede arrancar después y devolver la página a su posición
    let tries = 0, t = 0;
    const go = () => {
      const y = el.getBoundingClientRect().top + scrollY;
      if (Math.abs(scrollY - y) < 40 || tries++ > 8) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else scrollTo(0, y);
      t = window.setTimeout(go, 250);
    };
    t = window.setTimeout(go, 120);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      {/* grano de papel sobre el recorrido (Sleep Well) */}
      <GridBackground kind="grain" position="fixed" opacity={0.14} fade={false} />
      <div className="pn-story" style={{ "--len": LEN } as CSSProperties}>
        {/* anclas: cada incidencia tiene su «sala» a la altura de scroll de su parada (la ficha vuelve aquí) */}
        {ISSUES.map((x) => (
          <span key={x.id} id={`sala-${x.id}`} className="pn-anchor" style={{ "--at": ISSUE_STOP[x.id] / (TOUR.length - 1) } as CSSProperties} />
        ))}
        <PinnedSection length={LEN} className={`pn-tour ${dark ? "is-dark" : ""}`}>
          <ExplorableCanvas
            depth="3d"
            nav="scroll"
            world={MODEL_WORLD}
            blocks={MODEL}
            dims={MODEL_DIMS}
            path={TOUR}
            captions={false}
            onStop={setStop}
            markers={ISSUES.map((x) => ({ id: x.id, x: x.x, y: x.y, title: x.title, meta: x.meta, text: x.text, href: href(`incidencias/${x.id}`), color: "var(--acc)" }))}
            linkLabel="Ver incidencia →"
            listToggle={false}
            paper={TONES.paper}
            wood={TONES.wood}
          />
          {/* foto primero: la fachada se disuelve en la planta con el scroll (Atlas: vídeo → pintura) */}
          <div className="pn-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo("arquitectura", 2).src} alt="Fachada de edificio en blanco y negro" />
          </div>
          <ol className="pn-chs">
            {CHAPTERS.map((_, i) => <Chapter key={i} i={i} on={i === stop} />)}
          </ol>
          <div className="pn-rail pn-mono" aria-hidden>
            <span>{pad(stop + 1)} / {pad(CHAPTERS.length)}</span>
            <ol>{CHAPTERS.map((c, i) => <li key={i} data-on={i === stop ? "" : undefined} data-k={c.kind} />)}</ol>
          </div>
        </PinnedSection>
      </div>

      <section className="pn-dark pn-proof" aria-label="Resultados">
        <p className="pn-mono">Con Cota · datos de la demo</p>
        <SplitText as="h2" by="words" stagger={0.05} className="pn-big">Menos semanas perdidas en revisar.</SplitText>
        <CellGrid columns={3} line="dashed" padding={28}>
          {PROOF.map((x) => (
            <div key={x.k} className="pn-stat"><b>{x.v}</b><p>{x.k}</p></div>
          ))}
        </CellGrid>
        <div className="pn-clients">
          <div className="pn-clients__bar pn-mono"><span>Estudios que ya revisan con Cota</span><span aria-hidden>← →</span></div>
          <CellGrid columns={5} line="dashed" padding={18}>
            {CLIENTS.map((c) => <span key={c} className="pn-mono" style={{ fontWeight: 700 }}>{c}</span>)}
          </CellGrid>
        </div>
      </section>

      <section id="integraciones" className="pn-int" aria-label="Integraciones">
        <div className="pn-int__head">
          <SplitText as="h2" by="words" stagger={0.05} className="pn-big">Dentro de tu programa.</SplitText>
          <p>Cota no es otra ventana: vive en el programa en el que ya dibujas y revisa el archivo que tienes abierto.</p>
        </div>
        <div className="pn-cards">
          {INTEGRATIONS.map((x) => (
            <div key={x.t} className="pn-tick">
              <h3>{x.t}</h3>
              <p>{x.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pn-end" aria-label="Solicitar demo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo("arquitectura", 6).src} alt="Ayuntamiento de Toronto visto desde abajo" loading="lazy" />
        <div className="pn-end__txt">
          <SplitText as="h2" by="words" stagger={0.05} className="pn-big">¿Lo vemos con uno de tus modelos?</SplitText>
          <a className="pn-btn pn-btn--solid pn-mono" href={href("producto")}><span>Solicitar demo</span><i aria-hidden>→</i></a>
        </div>
      </section>
    </>
  );
}

/* ---------- inicio: la maquetación técnica (Heron) ---------- */
function Home() {
  return (
    <>
      <section className="pn-hero">
        <div className="pn-hero__art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo("arquitectura", 2).src} alt="Fachada de edificio en blanco y negro" />
        </div>
        <div className="pn-hero__row">
          <SplitText as="h1" by="lines" trigger="mount" stagger={0.1} delay={0.1}>Revisa tus modelos mientras los dibujas.</SplitText>
          <div className="pn-hero__sub">
            <p>Cota comprueba normativa, colisiones y cotas cada vez que guardas, dentro de tu programa de siempre.</p>
            <span className="pn-mono">Revit · Rhino · ArchiCAD · SketchUp</span>
          </div>
          <a className="pn-hero__go pn-mono" href="#problema">Descubrir ↓</a>
        </div>
      </section>

      <section className="pn-split">
        <div className="pn-split__art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={blueprintArt(2, "#c43500")} alt="Dibujo de línea de otro edificio con un círculo de acento" loading="lazy" />
        </div>
        <div className="pn-split__txt">
          <div className="pn-split__body">
            <SplitText as="h2" by="words" stagger={0.05}>Lo repetitivo del modelado no debería comerse tu semana.</SplitText>
            <p>Cota se ocupa de lo fiel y manual para que tú te quedes con el diseño, no con el programa.</p>
            <a className="pn-btn pn-mono" href={href("producto")}><span>Saber más</span><i aria-hidden>→</i></a>
          </div>
          <div className="pn-clients">
            <div className="pn-clients__bar pn-mono"><span>Clientes</span><span aria-hidden>← →</span></div>
            <CellGrid columns={5} line="dashed" padding={18}>
              {CLIENTS.map((c) => <span key={c} className="pn-mono" style={{ fontWeight: 700 }}>{c}</span>)}
            </CellGrid>
          </div>
        </div>
      </section>

      <section id="problema" className="pn-sec pn-prob" aria-label="Problemas que resuelve">
        <CellGrid columns={4} padding={28}>
          {PROBLEMS.map((p) => (
            <div key={p.t}><h3>{p.t}</h3><p>{p.p}</p></div>
          ))}
        </CellGrid>
      </section>

      <section className="pn-mid">
        <SplitText as="h2" by="words" stagger={0.06}>A tu lado, dentro del modelo.</SplitText>
      </section>

      <section className="pn-model pn-model--home" aria-label="Maqueta del modelo revisado">
        <div className="pn-model__bar">
          <p className="pn-mono">Modelo revisado · {ISSUES.length} incidencias</p>
          <a className="pn-btn pn-mono" href={href("recorrido")}><span>Ver el recorrido</span><i aria-hidden>→</i></a>
        </div>
        <ExplorableCanvas
          depth="3d"
          world={MODEL_WORLD}
          blocks={MODEL}
          markers={ISSUES.map((x) => ({ id: x.id, x: x.x, y: x.y, title: x.title, meta: x.meta, text: x.text, href: href(`incidencias/${x.id}`), color: "var(--acc)" }))}
          linkLabel="Ver incidencia →"
          tilt={50}
          frame={false}
          paper={TONES.paper}
          wood={TONES.wood}
          height="min(76vh, 680px)"
          hint="Arrastra la maqueta · pulsa una incidencia"
        />
      </section>
    </>
  );
}

/* ---------- ficha de una incidencia (Cartier: «Explore» → ficha editorial con URL propia) ---------- */
function IssuePage({ id }: { id: string }) {
  const k = ISSUES.findIndex((x) => x.id === id);
  if (k < 0) return null;
  const x = ISSUES[k];
  const prev = ISSUES[(k + ISSUES.length - 1) % ISSUES.length], next = ISSUES[(k + 1) % ISSUES.length];
  return (
    <article className="pn-issue">
      <a className="pn-issue__x" href={`${href("recorrido")}#sala-${x.id}`} aria-label="Volver a la maqueta">×</a>
      <header className="pn-issue__head">
        <p className="pn-mono">Incidencia {pad(k + 1)} / {pad(ISSUES.length)} · {x.meta}</p>
        <SplitText as="h1" by="lines" trigger="mount">{x.title}</SplitText>
        <p className="pn-issue__short">{x.text}</p>
      </header>
      <ImageReveal src={photo(x.photo.topic, x.photo.i).src} alt={x.photo.alt} ratio="16 / 8" from="bottom" className="pn-issue__img" />
      <ScrubText className="pn-issue__lead" dim={0.2} from={0.9} to={0.6}>{x.detail}</ScrubText>
      <MetaTable
        label={`Datos de la incidencia: ${x.title}`}
        columns={2}
        rows={[
          { k: "Regla", v: x.rule },
          { k: "Elemento", v: x.element },
          { k: "Gravedad", v: x.severity },
          { k: "Arreglo propuesto", v: x.fix },
        ]}
      />
      <nav className="pn-issue__nav pn-mono" aria-label="Otras incidencias">
        <a href={href(`incidencias/${prev.id}`)}>← {prev.title}</a>
        <a href={`${href("recorrido")}#sala-${x.id}`}>Volver a la maqueta</a>
        <a href={href(`incidencias/${next.id}`)}>{next.title} →</a>
      </nav>
    </article>
  );
}

/* ---------- producto ---------- */
function Product() {
  return (
    <div className="pn-page">
      <section>
        <p className="pn-mono" style={{ marginBottom: 20 }}>Producto</p>
        <SplitText as="h1" by="lines" trigger="mount">Una revisión que no se olvida de nada.</SplitText>
      </section>
      <section className="pn-model" aria-label="Maqueta del modelo en despiece">
        <p className="pn-mono">El modelo por capas · base, estructura, instalaciones y muros</p>
        <ExplorableCanvas depth="3d" world={MODEL_WORLD} blocks={MODEL} explode={80} markers={[]} tilt={52} frame={false} paper={TONES.paper} wood={TONES.wood} listToggle={false} height="min(76vh, 680px)" hint="Arrastra el despiece" />
      </section>
      <section>
        <MetaTable rows={SPECS} columns={2} label="Ficha técnica de Cota" />
      </section>
      <section className="pn-feat" aria-label="Qué revisa">
        <CellGrid columns={3} line="dashed" padding={28}>
          {FEATURES.map((f) => <div key={f.t}><h2>{f.t}</h2><p>{f.p}</p></div>)}
        </CellGrid>
      </section>
      <section style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 56px)" }}>¿Lo vemos con uno de tus modelos?</h2>
        <RollLink label="Solicitar demo →" href="mailto:demo@cota.example" className="pn-mono" />
      </section>
    </div>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a, b] = path;
  if (!a) return <Home />;
  if (a === "producto") return <Product />;
  if (a === "recorrido") return <Tour />;
  if (a === "incidencias" && b) return <IssuePage id={b} />;
  return null;
}
