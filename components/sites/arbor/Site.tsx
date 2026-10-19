"use client";

import { type CSSProperties, type ReactNode } from "react";
import CircleButton from "@/components/ui/CircleButton";
import EdgeTab from "@/components/ui/EdgeTab";
import ExpandingPanels from "@/components/ui/ExpandingPanels";
import FitText from "@/components/ui/FitText";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import IslandNav from "@/components/ui/IslandNav";
import MetaTable from "@/components/ui/MetaTable";
import ScatterText from "@/components/ui/ScatterText";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SplitText from "@/components/ui/SplitText";
import { photo } from "@/lib/sites/photos";
import { forestTokens, tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { AREAS, FACTS, HOMES, SLUG } from "./data";
import "./arbor.css";

// tema del kit `forestTokens`
const TOKENS: CSSProperties = tokensToStyle(forestTokens);
const href = (p = "") => siteHref(SLUG, p);

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <SiteFrame tokens={TOKENS} className="ar">
      <SmoothScroll />
      <IslandNav
        leading={<FullscreenMenu brand="Arbor" links={[{ label: "Inicio", href: href() }, { label: "Residencias", href: href("residencias") }]} footer={[{ label: "Instagram", href: "#" }, { label: "visitas@arbor.example", href: "mailto:visitas@arbor.example" }]} note="Arbor · Residencias entre árboles" />}
        brand={<span className="ar-monogram" aria-label="Arbor">A</span>}
        trailing={<a href={href("residencias")}>Consultar <span aria-hidden>→</span></a>}
      />
      <main id="contenido">{children}</main>
      <EdgeTab label="Agenda tu visita" href={href("residencias")} mark="A." top="55%" />
      <footer className="ar-foot">
        <FitText>Arbor</FitText>
        <div className="ar-foot__row"><span>© 2026 Arbor Residencial</span><span>Demo de Trama — complejo ficticio · <a href="/creditos">Créditos de las imágenes</a></span></div>
      </footer>
    </SiteFrame>
  );
}

/* ---------- inicio ---------- */
function Home() {
  return (
    <>
      <section className="ar-hero" aria-label="Arbor">
        <div className="ar-hero__stick">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ar-hero__img" src={photo("arquitectura", 4).src} alt="Fachada de un edificio de piedra clara con ventanas regulares" />
          <div className="ar-hero__veil" aria-hidden />
          <div className="ar-hero__mark">
            <h1 className="ui-sr">Arbor, residencias entre árboles</h1>
            <ScatterText as="div" spread={320} scope=".ar-hero">ARBOR</ScatterText>
            <div className="ar-hero__sub"><span>Residencial y oficinas</span><span>Nuevo Belgrado · 2028</span><span>Baja para explorar ↓</span></div>
          </div>
        </div>
      </section>

      <section className="ar-sec">
        <div className="ar-row">
          <div>
            <SplitText as="h2" by="words" stagger={0.05} className="ar-lead">Vivir entre árboles, a diez minutos de todo.</SplitText>
            <p className="ar-p">Ciento ochenta y seis viviendas alrededor de un jardín de cuarenta árboles centenarios. Un lugar para quedarse, pensado para durar. <CircleButton label="Ver las residencias" href={href("residencias")} size="sm">→</CircleButton></p>
            <a className="ar-cta" href={href("residencias")}>Ver residencias <span aria-hidden>→</span></a>
          </div>
          <MetaTable rows={FACTS} label="Datos del proyecto" />
        </div>
      </section>

      <section className="ar-panels" aria-label="Áreas del proyecto">
        <ExpandingPanels
          height="68vh"
          panels={AREAS.map((a) => ({ title: a.title, meta: a.meta, color: a.color, image: photo(a.seed % 2 ? "naturaleza" : "interiores", a.seed).src, alt: "" }))}
        />
      </section>
    </>
  );
}

/* ---------- residencias ---------- */
function Homes() {
  return (
    <section className="ar-sec" style={{ paddingTop: "clamp(110px, 14vw, 200px)" }}>
      <SplitText as="h1" by="lines" trigger="mount" className="ar-lead">Cuatro maneras de vivir entre árboles.</SplitText>
      <ul className="ar-homes" style={{ marginTop: "clamp(32px, 6vw, 80px)" }}>
        {HOMES.map((h) => (
          <li key={h.name}><b>{h.name}</b><span>{h.beds}</span><span>{h.m2}</span><em>desde {h.from}</em></li>
        ))}
      </ul>
      <a className="ar-cta" href="mailto:visitas@arbor.example">Agenda tu visita <span aria-hidden>→</span></a>
    </section>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a] = path;
  if (!a) return <Home />;
  if (a === "residencias") return <Homes />;
  return null;
}
