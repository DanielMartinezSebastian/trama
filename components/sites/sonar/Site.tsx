"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import BigFooter from "@/components/ui/BigFooter";
import CellGrid from "@/components/ui/CellGrid";
import ExplorableCanvas from "@/components/ui/ExplorableCanvas";
import Modal from "@/components/ui/Modal";
import OptionPicker from "@/components/ui/OptionPicker";
import ProjectList, { type ProjectView } from "@/components/ui/ProjectList";
import RollLink from "@/components/ui/RollLink";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SplitText from "@/components/ui/SplitText";
import Toggle from "@/components/ui/Toggle";
import { city } from "@/lib/sites/maqueta";
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
const WORLD = { w: 2600, h: 1700 };
// la ciudad de cartón: una plaza despejada en cada proyecto
const BLOCKS = city({ seed: 11, plazas: WORKS, aspect: WORLD.h / WORLD.w, cell: 6.5, maxH: 150, accent: 0.05 });

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

/** Ecualizador del interruptor de sonido: barras que se mueven con el sonido activo (CSS en sonar.css). */
const Eq = () => <span className="sn-eq">{[0, 1, 2, 3].map((i) => <i key={i} style={{ animationDelay: `${i * -0.23}s` }} />)}</span>;

const GATE_KEY = "sonar-entrada";

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  // pantalla de entrada (Modal a pantalla completa) una vez por sesión; la elección enciende el interruptor de la cabecera
  const [gate, setGate] = useState(false);
  const [sound, setSound] = useState(false);
  useEffect(() => {
    try {
      const v = sessionStorage.getItem(GATE_KEY);
      if (v) setSound(v === "on");
      else setGate(true);
    } catch {
      setGate(true);
    }
  }, []);
  const choose = (v: string) => {
    setSound(v === "on");
    try {
      sessionStorage.setItem(GATE_KEY, v);
    } catch {
      /* sin almacenamiento: se volverá a preguntar */
    }
  };

  return (
    <SiteFrame tokens={TOKENS} className="sn">
      <SmoothScroll />
      <Modal
        size="full"
        open={gate}
        onOpenChange={setGate}
        dismissible={false}
        variant="outline"
        title={<><span className="sn-gate__mark" aria-hidden>◉</span>Mejor con sonido</>}
        body="Esta web es una demo: no suena nada, pero así se vería la pantalla de entrada de un estudio de audio."
        actions={[{ label: "Entrar con sonido", value: "on", emphasis: "primary", autoFocus: true }, { label: "Entrar sin sonido", value: "off", emphasis: "outline" }]}
        onAction={choose}
      />
      <header className="sn-head">
        <a className="sn-brand" href={href()}><span aria-hidden>◉</span> Sonar</a>
        <nav className="sn-nav" aria-label="Principal">
          <RollLink label="Proyectos" href={href("proyectos")} />
          <RollLink label="Servicios" href={`${href()}#servicios`} />
          <RollLink label="Contacto" href="mailto:hola@sonar.example" />
        </nav>
        <Toggle className="sn-snd" label="Sonido" indicator={<Eq />} checked={sound} onChange={setSound} />
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
        <SplitText as="h1" by="words" trigger="mount" elastic="pointer" stretch={0.7} radius={190} className="sn-hero__t">Construimos experiencias sonoras inolvidables.</SplitText>
        <p className="sn-hero__p">Identidad sonora, sonido de producto y música para espacios. Pasa el puntero por el titular.</p>
        <a className="sn-pill" href="#mapa">Explorar los proyectos ↓</a>
      </section>

      <section id="mapa" className="sn-sec" aria-label="Mapa de proyectos">
        <ExplorableCanvas
          markers={WORKS.map((w) => ({ id: w.id, x: w.x, y: w.y, title: w.title, meta: `${w.kind} · ${w.year}`, text: w.text, image: photo(w.topic, w.i).src, alt: w.alt, href: href("proyectos") }))}
          world={WORLD}
          depth="3d"
          blocks={BLOCKS}
          paper="#e9eef4"
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
const VIEWS = [
  { value: "list", label: "Lista", short: "1" },
  { value: "grid", label: "Cuadrícula", short: "2" },
  { value: "index", label: "Índice", short: "3" },
];

function Works() {
  const [view, setView] = useState<ProjectView>("list");
  return (
    <section className="sn-sec" style={{ paddingTop: "clamp(40px, 6vw, 80px)" }}>
      <SplitText as="h1" by="lines" trigger="mount" className="sn-h2">Proyectos.</SplitText>
      <p className="sn-lead">Pulsa los números para cambiar la forma de verlos.</p>
      <OptionPicker className="sn-views" label="Vista" options={VIEWS} value={view} onChange={(v) => setView(v as ProjectView)} />
      <ProjectList
        view={view}
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
