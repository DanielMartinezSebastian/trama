"use client";

import { type CSSProperties, type ReactNode } from "react";
import BigFooter from "@/components/ui/BigFooter";
import CellGrid from "@/components/ui/CellGrid";
import ElasticText from "@/components/ui/ElasticText";
import EntryGate from "@/components/ui/EntryGate";
import ExplorableCanvas from "@/components/ui/ExplorableCanvas";
import RollLink from "@/components/ui/RollLink";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SoundToggle from "@/components/ui/SoundToggle";
import SplitText from "@/components/ui/SplitText";
import WorkViews from "@/components/ui/WorkViews";
import { photo } from "@/lib/sites/photos";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { SERVICES, SLUG, WORKS } from "./data";
import "./sonar.css";

// noche azul con un único acento celeste; titulares en Newsreader
const TOKENS: CSSProperties = tokensToStyle({
  bg: "#0b1119",
  fg: "#e7eef5",
  mut: "#93a3b5",
  acc: "#7fd0ff",
  acc2: "#e7eef5",
  card: "rgba(231,238,245,0.05)",
  ln: "rgba(231,238,245,0.18)",
  r: 14,
  font: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-newsreader), Georgia, serif',
  accentFont: 'var(--font-newsreader), Georgia, serif',
});
const href = (p = "") => siteHref(SLUG, p);

/** Anillos concéntricos alrededor de cada proyecto: el «sonar» que da nombre a la web. */
function Rings() {
  return (
    <svg className="sn-rings" width="100%" height="100%" aria-hidden>
      <defs>
        <pattern id="sn-dots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="currentColor" /></pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sn-dots)" className="sn-rings__dots" />
      {WORKS.map((w) => [80, 150, 230, 330, 450].map((r, i) => <circle key={w.id + r} cx={`${w.x}%`} cy={`${w.y}%`} r={r} fill="none" stroke="currentColor" strokeOpacity={0.2 - i * 0.03} />))}
    </svg>
  );
}

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <SiteFrame tokens={TOKENS} className="sn">
      <SmoothScroll />
      <EntryGate
        variant="sound"
        storageKey="sonar-entrada"
        mark="◉"
        title="Mejor con sonido"
        text="Esta web es una demo: no suena nada, pero así se vería la pantalla de entrada de un estudio de audio."
        actions={[{ label: "Entrar con sonido", value: "on", primary: true }, { label: "Entrar sin sonido", value: "off" }]}
      />
      <header className="sn-head">
        <a className="sn-brand" href={href()}><span aria-hidden>◉</span> Sonar</a>
        <nav className="sn-nav" aria-label="Principal">
          <RollLink label="Proyectos" href={href("proyectos")} />
          <RollLink label="Servicios" href={`${href()}#servicios`} />
          <RollLink label="Contacto" href="mailto:hola@sonar.example" />
        </nav>
        <SoundToggle />
      </header>
      <main id="contenido">{children}</main>
      <BigFooter heading="Sonar" lead="¿Cómo suena tu marca?" email="hola@sonar.example" links={[{ label: "Inicio", href: href() }, { label: "Proyectos", href: href("proyectos") }]} note="© 2026 Sonar Audio" credit="Créditos de las imágenes" creditHref="/creditos" city="Lisboa" timeZone="Europe/Lisbon" />
    </SiteFrame>
  );
}

/* ---------- inicio ---------- */
function Home() {
  return (
    <>
      <section className="sn-hero">
        <ElasticText as="h1" className="sn-hero__t" stretch={0.7} radius={190}>Construimos experiencias sonoras inolvidables.</ElasticText>
        <p className="sn-hero__p">Identidad sonora, sonido de producto y música para espacios. Pasa el puntero por el titular.</p>
        <a className="sn-pill" href="#mapa">Explorar los proyectos ↓</a>
      </section>

      <section id="mapa" className="sn-sec" aria-label="Mapa de proyectos">
        <ExplorableCanvas
          markers={WORKS.map((w) => ({ id: w.id, x: w.x, y: w.y, title: w.title, meta: `${w.kind} · ${w.year}`, text: w.text, image: photo(w.topic, w.i).src, alt: w.alt, href: href("proyectos") }))}
          world={{ w: 2600, h: 1700 }}
          background={<Rings />}
          height="min(80vh, 720px)"
        />
      </section>

      <section id="servicios" className="sn-sec">
        <SplitText as="h2" by="words" stagger={0.05} className="sn-h2">Qué hacemos con el sonido.</SplitText>
        <CellGrid columns={3} line="dashed" padding={28}>
          {SERVICES.map((s) => <div key={s.t}><h3 className="sn-h3">{s.t}</h3><p>{s.p}</p></div>)}
        </CellGrid>
      </section>
    </>
  );
}

/* ---------- proyectos ---------- */
function Works() {
  return (
    <section className="sn-sec" style={{ paddingTop: "clamp(40px, 6vw, 80px)" }}>
      <SplitText as="h1" by="lines" trigger="mount" className="sn-h2">Proyectos.</SplitText>
      <p className="sn-lead">Pulsa los números para cambiar la forma de verlos.</p>
      <WorkViews
        switchLabel="Vista"
        items={WORKS.map((w) => ({ title: w.title, meta: w.kind, year: w.year, image: photo(w.topic, w.i).src, alt: w.alt, href: href("proyectos") }))}
      />
    </section>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a] = path;
  if (!a) return <Home />;
  if (a === "proyectos") return <Works />;
  return null;
}
