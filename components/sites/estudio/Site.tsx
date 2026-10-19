"use client";

import { usePathname } from "next/navigation";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import BentoGrid from "@/components/ui/BentoGrid";
import BigFooter from "@/components/ui/BigFooter";
import CustomCursor from "@/components/ui/CustomCursor";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import HideOnScroll from "@/components/ui/HideOnScroll";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import ImageReveal from "@/components/ui/ImageReveal";
import LocalTime from "@/components/ui/LocalTime";
import Marquee from "@/components/ui/Marquee";
import Preloader from "@/components/ui/Preloader";
import Parallax from "@/components/ui/Parallax";
import ProjectList from "@/components/ui/ProjectList";
import RollLink from "@/components/ui/RollLink";
import ScrubText from "@/components/ui/ScrubText";
import SectionIndex from "@/components/ui/SectionIndex";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SplitText from "@/components/ui/SplitText";
import StackedCards from "@/components/ui/StackedCards";
import { fashionArt } from "@/lib/sites/art";
import { getLenis } from "@/lib/motion/lenis";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { FACTS, PROCESS, PROJECTS, SERVICES, SLUG } from "./data";
import "./estudio.css";

const TOKENS: CSSProperties = tokensToStyle({
  bg: "#f2efe9",
  fg: "#121110",
  mut: "#6c675e",
  acc: "#ff4d1c",
  acc2: "#121110",
  card: "#e8e4dc",
  ln: "rgba(18,17,16,0.16)",
  r: 16,
  font: 'var(--font-inter), "Helvetica Neue", Arial, sans-serif',
  display: 'var(--font-inter), "Helvetica Neue", Arial, sans-serif',
});

const href = (p = "") => siteHref(SLUG, p);
const LINKS = [
  { label: "Proyectos", href: href("proyectos"), meta: String(PROJECTS.length).padStart(2, "0") },
  { label: "Estudio", href: href("estudio") },
  { label: "Contacto", href: href("contacto") },
];
const MAIL = "hola@marea.example";
const ITEMS = PROJECTS.map((p) => ({ title: p.title, meta: p.meta, year: p.year, href: href("proyectos"), image: fashionArt(p.seed, p.art), alt: p.lead }));

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  // al cambiar de página, arriba del todo (también con Lenis)
  useEffect(() => {
    const l = getLenis();
    if (l) l.scrollTo(0, { immediate: true });
  }, [path]);
  return (
    <SiteFrame tokens={TOKENS} className="es">
      <Preloader variant="counter" brand="Marea Studio" meta="Madrid — 2026" duration={1.8} />
      <SmoothScroll />
      <CustomCursor hideNative />
      <HideOnScroll className="es-head">
        <a className="es-brand" href={href()}>Marea®</a>
        <LocalTime city="Madrid" timeZone="Europe/Madrid" />
        <FullscreenMenu brand="Marea Studio" links={LINKS} footer={[{ label: "Instagram", href: "#" }, { label: "LinkedIn", href: "#" }, { label: MAIL, href: `mailto:${MAIL}` }]} note="Madrid · Lisboa" />
      </HideOnScroll>
      <SectionIndex />
      <main id="contenido">{children}</main>
      <BigFooter
        heading="Hablemos."
        email={MAIL}
        links={LINKS.map((l) => ({ label: l.label, href: l.href }))}
        note="© 2026 Marea Studio"
        credit="Demo de Trama"
        city="Madrid"
      />
    </SiteFrame>
  );
}

/* ---------- páginas ---------- */
function Home() {
  return (
    <>
      <section className="es-hero" data-section="Inicio">
        <SplitText as="h1" by="lines" trigger="mount" stagger={0.12} duration={1.1} delay={0.1}>
          Diseñamos webs que se sienten, no solo se ven.
        </SplitText>
        <div className="es-hero__row">
          <p className="es-hero__lead">Estudio independiente de diseño y desarrollo. Estrategia, marca y producto digital, con el movimiento justo.</p>
          <span className="es-hero__scroll" aria-hidden>Scroll ↓</span>
        </div>
      </section>

      <div className="es-strip" aria-hidden>
        <Marquee text="IDENTIDAD · WEB · PRODUCTO · MOVIMIENTO · 3D" variant="minimal" tone="fg" rows={1} fontSize={28} duration={40} separator="   ✺   " />
      </div>

      <section className="es-sec es-manifest" data-section="Manifiesto">
        <ScrubText className="es-scrub" from={0.9} to={0.3}>
          Creemos que una web es un lugar, no un folleto. Por eso cuidamos cómo se entra, cómo se recorre y qué se siente al salir. Cada animación tiene que ganarse su sitio.
        </ScrubText>
      </section>

      <section className="es-sec" id="proyectos" data-section="Proyectos">
        <div className="es-eyebrow"><span>Proyectos seleccionados</span><span>2024 — 2026</span></div>
        <ProjectList items={ITEMS} />
        <p style={{ marginTop: 32 }}><RollLink label="Ver todos los proyectos →" href={href("proyectos")} /></p>
      </section>

      <section className="es-sec" data-section="Servicios">
        <div className="es-eyebrow"><span>Qué hacemos</span><span>04</span></div>
        <SplitText as="h2" by="words" className="es-h2" stagger={0.05}>
          Trabajamos donde la estrategia, el diseño y el código se tocan.
        </SplitText>
        <div style={{ height: "clamp(32px, 6vw, 80px)" }} />
        <StackedCards top={88} step={16} gap={14}>
          {SERVICES.map((s) => (
            <article key={s.n} className="es-scard">
              <span>{s.n}</span>
              <b>{s.name}</b>
              <p>{s.text}</p>
            </article>
          ))}
        </StackedCards>
      </section>

      <section data-section="Proceso" aria-label="Proceso de trabajo">
        <HorizontalScroll heading="Cómo trabajamos — de izquierda a derecha" gap={20}>
          {PROCESS.map((p) => (
            <article key={p.n} className="es-step">
              <span>{p.n}</span>
              <b>{p.name}</b>
              <p>{p.text}</p>
            </article>
          ))}
        </HorizontalScroll>
      </section>

      <section className="es-sec" data-section="Estudio">
        <div className="es-eyebrow"><span>El estudio</span><span>Madrid · Lisboa</span></div>
        <BentoGrid
          columns={4}
          variant="editorial"
          cells={[
            { title: "Años de oficio", stat: FACTS[0].v },
            { title: "Un estudio pequeño por decisión", text: "Nueve personas, sin capas intermedias. Quien te vende el proyecto lo hace.", span: "2x1" },
            { title: "Proyectos", stat: FACTS[1].v },
            { title: "Casa Alba", image: fashionArt(4, "coat"), span: "2x2", href: href("proyectos") },
            { title: "Personas", stat: FACTS[2].v },
            { title: "Premios", stat: FACTS[3].v },
            { title: "Hablemos", text: "Cuéntanos qué tienes entre manos.", span: "2x1", href: href("contacto") },
          ]}
        />
      </section>

      <section className="es-sec es-duo" aria-label="Imágenes">
        <div className="es-duo__a"><Parallax speed={0.08}><ImageReveal src={fashionArt(2, "arch")} ratio="4 / 5" from="bottom" /></Parallax></div>
        <div className="es-duo__b"><Parallax speed={-0.06}><ImageReveal src={fashionArt(6, "dress")} ratio="3 / 4" from="left" delay={0.15} /></Parallax></div>
      </section>
    </>
  );
}

function Projects() {
  return (
    <section className="es-sec" style={{ paddingTop: "clamp(120px, 16vw, 220px)" }}>
      <SplitText as="h1" by="lines" trigger="mount" className="es-h2" delay={0.1}>
        Proyectos que nos han hecho pensar.
      </SplitText>
      <div style={{ height: "clamp(32px, 6vw, 80px)" }} />
      <ProjectList items={ITEMS} />
      <div className="es-grid" style={{ marginTop: "clamp(48px, 8vw, 120px)" }}>
        {PROJECTS.map((p) => (
          <article className="es-card" key={p.slug} data-cursor="Ver">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fashionArt(p.seed, p.art)} alt="" loading="lazy" />
            <h3>{p.title}</h3>
            <p>{p.lead}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Studio() {
  return (
    <section className="es-sec" style={{ paddingTop: "clamp(120px, 16vw, 220px)" }}>
      <SplitText as="h1" by="lines" trigger="mount" className="es-h2" delay={0.1}>
        Nueve personas, una sola mesa larga.
      </SplitText>
      <div className="es-two" style={{ marginTop: "clamp(40px, 7vw, 100px)" }}>
        <SplitText as="p" by="lines" className="es-p" stagger={0.08}>
          Empezamos en 2014 con una idea sencilla: que una web bien hecha se nota en cómo se mueve, no solo en cómo se ve.
        </SplitText>
        <p style={{ margin: 0, color: "var(--mut)", lineHeight: 1.5, maxWidth: "52ch" }}>
          Trabajamos con equipos pequeños que quieren algo distinto a lo de siempre. Nos metemos en el problema, probamos pronto y enseñamos cosas que funcionan,
          no presentaciones. Cuando una animación no aporta, la quitamos.
        </p>
      </div>
      <ul className="es-svc">
        {SERVICES.map((s) => (
          <li key={s.n}><span>{s.n}</span><b>{s.name}</b><p>{s.text}</p></li>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  return (
    <section className="es-sec" style={{ paddingTop: "clamp(120px, 16vw, 220px)", minHeight: "80svh" }}>
      <SplitText as="h1" by="lines" trigger="mount" className="es-h2" delay={0.1}>
        Cuéntanos qué tienes en la cabeza.
      </SplitText>
      <p style={{ marginTop: "clamp(32px, 6vw, 80px)" }}>
        <a className="es-big-mail" href={`mailto:${MAIL}`} data-cursor="Escribir">{MAIL}</a>
      </p>
      <p className="es-p" style={{ marginTop: 32, color: "var(--mut)" }}>Respondemos en un día laborable. Nos encuentras en Madrid y Lisboa.</p>
    </section>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a] = path;
  if (!a) return <Home />;
  if (a === "proyectos") return <Projects />;
  if (a === "estudio") return <Studio />;
  if (a === "contacto") return <Contact />;
  return null;
}
