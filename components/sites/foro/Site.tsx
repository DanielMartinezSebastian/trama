"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import BigFooter from "@/components/ui/BigFooter";
import CrossfadeHero from "@/components/ui/CrossfadeHero";
import CustomCursor from "@/components/ui/CustomCursor";
import FilterBar from "@/components/ui/FilterBar";
import FitText from "@/components/ui/FitText";
import MetaTable from "@/components/ui/MetaTable";
import Preloader from "@/components/ui/Preloader";
import ProjectList from "@/components/ui/ProjectList";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { moodArt } from "@/lib/sites/art";
import { editorialTokens, tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { DAYS, FACTS, SLUG, TALKS } from "./data";
import "./foro.css";

// tema del kit `editorialTokens`: blanco y negro puros con el acento rojo del festival
const TOKENS: CSSProperties = tokensToStyle({ ...editorialTokens, bg: "#ffffff", fg: "#0a0a0a", mut: "#555555", card: "#f1f1f1", ln: "rgba(10,10,10,0.22)", acc: "#d3300a", r: 0 });
const href = (p = "") => siteHref(SLUG, p);

const SLIDES = [
  { src: moodArt(1, "#1c2340", "#c9552b", "#f0c98a"), alt: "Sala del festival con luz cálida" },
  { src: moodArt(2, "#14312f", "#b9803a", "#e9d9b0"), alt: "Público en una charla" },
  { src: moodArt(3, "#3a1d2b", "#d77a5b", "#f3d6c0"), alt: "Taller de diseño" },
];
const talkItems = (list: typeof TALKS) => list.map((t) => ({ title: t.title, meta: t.who, year: t.hour, href: href("programa"), image: moodArt(t.seed + 10, "#222a44", "#c9552b", "#f0c98a"), alt: "" }));

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <SiteFrame tokens={TOKENS} className="fr">
      <Preloader variant="fill" brand="ArcoForo" duration={1.8} />
      <SmoothScroll />
      <CustomCursor hideNative />
      <main id="contenido">{children}</main>
      <BigFooter heading="ArcoForo" lead="Recibe las novedades del festival" email="hola@arcoforo.example" links={[{ label: "Programa", href: href("programa") }, { label: "Inicio", href: href() }]} note="© 2026 ArcoForo" credit="Demo de Trama" city="Montreal" timeZone="America/Toronto" />
    </SiteFrame>
  );
}

/* ---------- inicio ---------- */
function Home() {
  return (
    <>
      <nav className="fr-top" aria-label="Secundaria">
        <a href={href("programa")}>Programa</a>
        <a href="#entradas">Entradas</a>
        <a href="#entradas" lang="en">EN</a>
      </nav>
      <h1 className="ui-sr">ArcoForo, una semana de diseño, arte y cultura digital</h1>
      <div className="fr-mark" aria-hidden>
        <FitText><span className="fr-w1">ARCO</span><span className="fr-w2">FORO</span></FitText>
      </div>
      <div className="fr-meta">
        <MetaTable rows={FACTS} label="Datos del festival" />
        <span />
      </div>
      <CrossfadeHero slides={SLIDES} kicker="Montreal · septiembre 2027" title={<>Una semana de diseño, arte y cultura digital</>} cta={{ label: "Consigue tu entrada", href: "#entradas" }} height="92svh" />
      <section className="fr-sec" id="entradas">
        <h2 className="fr-h2">Programa</h2>
        <ProjectList items={talkItems(TALKS.slice(0, 5))} cursorLabel="Ver" />
        <p style={{ marginTop: 32 }}><a className="fr-pill" href={href("programa")}>Ver el programa completo</a></p>
      </section>
    </>
  );
}

/* ---------- programa ---------- */
function Program() {
  const [values, setValues] = useState<Record<string, string[]>>({ dia: [] });
  const shown = useMemo(() => (values.dia.length ? TALKS.filter((t) => values.dia.includes(t.day)) : TALKS), [values]);
  return (
    <section className="fr-sec" style={{ paddingTop: "clamp(24px, 4vw, 56px)" }}>
      <h1 className="fr-h2">Programa</h1>
      <FilterBar className="fr-days" groups={[{ id: "dia", label: "Día", options: DAYS }]} values={values} onChange={setValues} total={shown.length} noun="charlas" />
      <ProjectList items={talkItems(shown)} cursorLabel="Ver" />
    </section>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a] = path;
  if (!a) return <Home />;
  if (a === "programa") return <Program />;
  return null;
}
