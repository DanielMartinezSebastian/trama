"use client";

import { type CSSProperties, type ReactNode } from "react";
import BlueprintFrame from "@/components/ui/BlueprintFrame";
import CellGrid from "@/components/ui/CellGrid";
import EdgeTab from "@/components/ui/EdgeTab";
import MetaTable from "@/components/ui/MetaTable";
import RollLink from "@/components/ui/RollLink";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SplitText from "@/components/ui/SplitText";
import { photo } from "@/lib/sites/photos";
import { blueprintArt } from "@/lib/sites/art";
import { blueprintTokens, FONT_PAIRINGS, tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { CLIENTS, FEATURES, PROBLEMS, SLUG, SPECS } from "./data";
import "./plano.css";

const PAIR = FONT_PAIRINGS.find((p) => p.id === "tecnico")!;
// tema del kit `blueprintTokens` con el par tipográfico «técnico»
const TOKENS: CSSProperties = { ...tokensToStyle({ ...blueprintTokens, display: PAIR.display }), "--font-accent": PAIR.accent } as CSSProperties;
const href = (p = "") => siteHref(SLUG, p);

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
              <a href={href("producto")}>Precios</a>
              <a href={href()}>Recursos</a>
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

/* ---------- inicio ---------- */
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
    </>
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
  const [a] = path;
  if (!a) return <Home />;
  if (a === "producto") return <Product />;
  return null;
}
