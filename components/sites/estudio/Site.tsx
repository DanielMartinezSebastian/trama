"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import CustomCursor from "@/components/ui/CustomCursor";
import FitText from "@/components/ui/FitText";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import LocalTime from "@/components/ui/LocalTime";
import Marquee from "@/components/ui/Marquee";
import Preloader from "@/components/ui/Preloader";
import ProjectList from "@/components/ui/ProjectList";
import RollLink from "@/components/ui/RollLink";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SplitText from "@/components/ui/SplitText";
import { fashionArt } from "@/lib/sites/art";
import { getLenis } from "@/lib/motion/lenis";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { FACTS, PROJECTS, SERVICES, SLUG } from "./data";
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

/** Cabecera que se esconde al bajar y reaparece al subir. */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setHidden(y > last && y > 120);
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return hidden;
}

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  const hidden = useHideOnScroll();
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
      <header className="es-head" data-hidden={hidden ? "" : undefined}>
        <a className="es-brand" href={href()}>Marea®</a>
        <LocalTime city="Madrid" timeZone="Europe/Madrid" />
        <FullscreenMenu brand="Marea Studio" links={LINKS} footer={[{ label: "Instagram", href: "#" }, { label: "LinkedIn", href: "#" }, { label: MAIL, href: `mailto:${MAIL}` }]} note="Madrid · Lisboa" />
      </header>
      <main id="contenido">{children}</main>
      <footer className="es-foot">
        <div className="es-foot__top">
          <div>
            <p style={{ margin: 0, opacity: 0.6 }}>¿Tienes un proyecto?</p>
            <a className="es-foot__mail" href={`mailto:${MAIL}`} data-cursor="Escribir">{MAIL}</a>
          </div>
          <nav aria-label="Pie" style={{ display: "grid", gap: 4, justifyItems: "start" }}>
            {LINKS.map((l) => <RollLink key={l.href} label={l.label} href={l.href} />)}
          </nav>
        </div>
        <div className="es-foot__fit"><FitText>Hablemos.</FitText></div>
        <div className="es-foot__bot">
          <span>© 2026 Marea Studio</span>
          <LocalTime city="Madrid" timeZone="Europe/Madrid" />
          <span>Demo de Trama</span>
        </div>
      </footer>
    </SiteFrame>
  );
}

/* ---------- páginas ---------- */
function Home() {
  return (
    <>
      <section className="es-hero">
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

      <section className="es-sec" id="proyectos">
        <div className="es-eyebrow"><span>Proyectos seleccionados</span><span>2024 — 2026</span></div>
        <ProjectList items={ITEMS} />
        <p style={{ marginTop: 32 }}><RollLink label="Ver todos los proyectos →" href={href("proyectos")} /></p>
      </section>

      <section className="es-sec">
        <div className="es-eyebrow"><span>Qué hacemos</span><span>04</span></div>
        <SplitText as="h2" by="words" className="es-h2" stagger={0.05}>
          Trabajamos donde la estrategia, el diseño y el código se tocan.
        </SplitText>
        <ul className="es-svc">
          {SERVICES.map((s) => (
            <li key={s.n}>
              <span>{s.n}</span>
              <b>{s.name}</b>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="es-sec" style={{ paddingTop: 0 }}>
        <div className="es-facts">
          {FACTS.map((f) => (
            <div key={f.l}>
              <b>{f.v}</b>
              <span>{f.l}</span>
            </div>
          ))}
        </div>
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
