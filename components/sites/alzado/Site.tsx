"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import BigFooter from "@/components/ui/BigFooter";
import CellGrid from "@/components/ui/CellGrid";
import CustomCursor from "@/components/ui/CustomCursor";
import ExplorableCanvas from "@/components/ui/ExplorableCanvas";
import OptionPicker from "@/components/ui/OptionPicker";
import PinnedSection from "@/components/ui/PinnedSection";
import Preloader from "@/components/ui/Preloader";
import ProjectList, { type ProjectView } from "@/components/ui/ProjectList";
import RollLink from "@/components/ui/RollLink";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SplitText from "@/components/ui/SplitText";
import { photo } from "@/lib/sites/photos";
import { tokensToStyle } from "@/lib/ui/tokens";
import { phosphor } from "@/lib/ui/icons-phosphor";
import { SiteFrame, siteHref } from "../shared";
import { HERO_BLOCKS, HERO_DIMS, HERO_PATH, HERO_WORLD, MAP_BLOCKS, MAP_WORLD, SERVICES, SITES, SLUG, WORKS } from "./data";
import "./alzado.css";

// papel cálido, tinta y un verde de plano; el texto pequeño siempre en tinta
const TOKENS: CSSProperties = tokensToStyle({
  bg: "#efebe3",
  fg: "#1b1a17",
  mut: "#625d54",
  acc: "#1f6f50",
  acc2: "#1b1a17",
  card: "#e6e1d6",
  ln: "rgba(27,26,23,0.18)",
  r: 6,
  font: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-inter-tight), var(--font-inter), sans-serif',
  accentFont: 'var(--font-geist-mono), ui-monospace, monospace',
});
const href = (p = "") => siteHref(SLUG, p);
const items = () => WORKS.map((w) => ({ title: w.title, meta: w.kind, year: w.year, image: photo(w.topic, w.i).src, alt: w.alt, href: href("proyectos") }));

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <SiteFrame tokens={TOKENS} className="az" icons={{ set: phosphor, weight: "thin" }}>
      <Preloader variant="fill" brand="Alzado" meta="Valencia · 2026" exit="curtain" />
      <SmoothScroll />
      <CustomCursor />
      <header className="az-head">
        <a className="az-brand" href={href()}>Alzado<span aria-hidden>°</span></a>
        <nav className="az-nav" aria-label="Principal">
          <RollLink label="Proyectos" href={href("proyectos")} />
          <RollLink label="Obras" href={`${href()}#obras`} />
          <RollLink label="Estudio" href={`${href()}#estudio`} />
        </nav>
      </header>
      <main id="contenido">{children}</main>
      <BigFooter heading="Alzado" lead="¿Tienes un solar, una casa o una idea?" email="hola@alzado.example" links={[{ label: "Inicio", href: href() }, { label: "Proyectos", href: href("proyectos") }]} note="© 2026 Alzado Arquitectura" credit="Créditos de las imágenes" creditHref="/creditos" city="Valencia" timeZone="Europe/Madrid" />
    </SiteFrame>
  );
}

/* ---------- inicio ---------- */
function Home() {
  return (
    <>
      {/* portada: el scroll lleva la cámara de la planta a la maqueta (PinnedSection + ExplorableCanvas nav="scroll") */}
      <PinnedSection length={3} className="az-hero">
        <div className="az-hero__title">
          <SplitText as="h1" by="chars" trigger="mount" stagger={0.04} className="az-h1">Alzado</SplitText>
          <p className="az-mono">Arquitectura que se entiende en maqueta · baja para recorrerla ↓</p>
        </div>
        <ExplorableCanvas depth="3d" nav="scroll" world={HERO_WORLD} blocks={HERO_BLOCKS} dims={HERO_DIMS} path={HERO_PATH} markers={[]} listToggle={false} paper="#f4f1ea" />
      </PinnedSection>

      <section id="estudio" className="az-sec az-manifest">
        <p className="az-mono">El estudio</p>
        <SplitText as="h2" by="lines" className="az-big">Dibujamos edificios que se pueden tocar antes de existir: en papel, en madera y en pantalla.</SplitText>
      </section>

      <section className="az-sec">
        <div className="az-row">
          <SplitText as="h2" by="words" className="az-h2">Proyectos</SplitText>
          <a className="az-mono az-link" href={href("proyectos")}>Ver todos →</a>
        </div>
        {/* índice con la foto dentro del cursor: ProjectList + CustomCursor */}
        <ProjectList preview="cursor" items={items().slice(0, 4)} />
      </section>

      <section id="obras" className="az-sec">
        <div className="az-row">
          <SplitText as="h2" by="words" className="az-h2">Obras en curso</SplitText>
          <p className="az-lead">Arrastra la maqueta de la ciudad y pulsa una obra.</p>
        </div>
        <ExplorableCanvas
          depth="3d"
          world={MAP_WORLD}
          blocks={MAP_BLOCKS}
          markers={SITES.map((s) => ({ id: s.id, x: s.x, y: s.y, title: s.title, meta: s.meta, text: s.text, image: photo(s.topic, s.i).src, href: href("proyectos") }))}
          tilt={54}
          frame={false}
          height="min(78vh, 720px)"
          paper="#f4f1ea"
          hint="Arrastra la ciudad · pulsa una obra"
        />
      </section>

      <section className="az-sec">
        <CellGrid columns={3} line="dashed" padding={28}>
          {SERVICES.map((s, i) => (
            <div key={s.t}>
              <span className="az-mono">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="az-h3">{s.t}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </CellGrid>
      </section>
    </>
  );
}

/* ---------- proyectos ---------- */
const VIEWS = [
  { value: "list", label: "Lista", short: "1" },
  { value: "grid", label: "Cuadrícula", short: "2" },
  { value: "index", label: "Índice", short: "3" },
];

function Works() {
  const [view, setView] = useState<ProjectView>("list");
  return (
    <section className="az-sec" style={{ paddingTop: "clamp(40px, 6vw, 88px)" }}>
      <SplitText as="h1" by="lines" trigger="mount" className="az-h2">Proyectos</SplitText>
      <OptionPicker className="az-views" label="Vista" options={VIEWS} value={view} onChange={(v) => setView(v as ProjectView)} />
      <ProjectList view={view} preview="cursor" items={items()} />
    </section>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a] = path;
  if (!a) return <Home />;
  if (a === "proyectos") return <Works />;
  return null;
}
