"use client";

import type { CSSProperties, ReactNode } from "react";
import BigFooter from "@/components/ui/BigFooter";
import Button from "@/components/ui/Button";
import FitText from "@/components/ui/FitText";
import GridBackground from "@/components/ui/GridBackground";
import ImageTrail from "@/components/ui/ImageTrail";
import LineDraw from "@/components/ui/LineDraw";
import Marquee from "@/components/ui/Marquee";
import MetaTable from "@/components/ui/MetaTable";
import Parallax from "@/components/ui/Parallax";
import SplitText from "@/components/ui/SplitText";
import ThemeScroll, { type ThemeScrollTheme } from "@/components/ui/ThemeScroll";
import { tokensToStyle, voltTokens } from "@/lib/ui/tokens";
import { SiteFrame } from "../shared";
import { CALENDAR, MANIFESTO, NEXT_RACE, QUOTE, SEASON, SHOTS, TRAIL, WINS } from "./data";
import "./volt.css";

const img = (f: string) => `/img/${f}`;

// Tres temas que se suceden con el scroll (docs/13 · Lando Norris): oliva → hueso → negro. El acento de «hueso» es un oliva
// oscuro, porque el amarillo ácido no se lee sobre claro; los dos oscuros comparten el amarillo.
const THEMES: Record<string, ThemeScrollTheme> = {
  oliva: { bg: voltTokens.bg, fg: voltTokens.fg, mut: voltTokens.mut, acc: voltTokens.acc, acc2: voltTokens.acc2, card: voltTokens.card, ln: voltTokens.ln },
  hueso: { bg: "#ecebe3", fg: "#1c1f16", mut: "#55594a", acc: "#5a7800", acc2: "#1c1f16", card: "rgba(28,31,22,0.05)", ln: "rgba(28,31,22,0.18)" },
  negro: { bg: "#111210", fg: "#ecebe3", mut: "#9b9d92", acc: voltTokens.acc, acc2: voltTokens.acc2, card: "rgba(236,235,227,0.05)", ln: "rgba(236,235,227,0.16)" },
};

const TOKENS = { ...tokensToStyle(voltTokens), "--sel-bg": voltTokens.acc, "--sel-fg": "#111210" } as CSSProperties;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <SiteFrame tokens={TOKENS} className="vt">
      {children}
    </SiteFrame>
  );
}

/** Ficha con la esquina inferior derecha recortada y la etiqueta en el hueco (cascos de Lando Norris). */
function Notched({ children, label, className = "" }: { children: ReactNode; label: ReactNode; className?: string }) {
  return (
    <div className={`vt-notch ${className}`}>
      <div className="vt-notch__card">
        <div className="vt-notch__in">{children}</div>
      </div>
      <p className="vt-notch__label">{label}</p>
    </div>
  );
}

function Header() {
  return (
    <header className="vt-head">
      <a href="#inicio" className="vt-brand" aria-label="Nora Vidal, inicio">
        <i>Nora</i>
        <b>Vidal</b>
      </a>
      <span className="vt-mono" aria-hidden>NV</span>
      <nav className="vt-head__nav" aria-label="Secciones">
        <a href="#palmares">Palmarés</a>
        <a href="#calendario">Calendario</a>
        <Button label="Tienda" href="#tienda" variant="solid" size="sm" />
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="vt-hero" data-theme="oliva">
      <p className="vt-kicker">Ciclista profesional · Ardent Racing</p>
      <figure className="vt-hero__photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img("deporte/06-man-wearing-motorcycle-helmet-unsplash.jpg")} alt="Nora Vidal con el casco de visera espejo, en un camino de tierra" fetchPriority="high" />
        <LineDraw className="vt-hero__sign" shape="signature" trigger="mount" delay={0.6} duration={2} strokeWidth={4} />
      </figure>
      <h1 className="vt-hero__name">
        <FitText>
          <i>Nora</i> <b>Vidal</b>
        </FitText>
      </h1>
      <Notched className="vt-race" label={<><b>Próxima</b> carrera</>}>
        <p className="vt-race__t">{NEXT_RACE.name}</p>
        <p>{NEXT_RACE.stage}</p>
        <p className="vt-race__meta">{NEXT_RACE.date} · {NEXT_RACE.km} · {NEXT_RACE.climb}</p>
      </Notched>
    </section>
  );
}

function Message() {
  return (
    <section className="vt-msg" data-theme="oliva" aria-labelledby="vt-msg-t">
      <h2 id="vt-msg-t" className="vt-label">Mensaje de Nora</h2>
      <div className="vt-msg__stage">
        <Marquee className="vt-msg__m vt-msg__m--serif" text="Lo hicimos en casa · Lo hicimos en casa" rows={1} direction="right" duration={34} fontSize={96} separator="  ·  " pauseOnHover={false} variant="minimal" tone="acc" />
        <Marquee className="vt-msg__m" text="Primera española en ganar la etapa reina · Nunca dejaré de correr" rows={1} direction="left" duration={30} fontSize={96} separator="  ·  " pauseOnHover={false} variant="minimal" tone="fg" />
        <figure className="vt-msg__photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("deporte/07-two-cyclists-race-on-road-unsplash.jpg")} alt="Nora Vidal en el sprint final de la etapa" loading="lazy" />
          <LineDraw className="vt-msg__sign" shape="signature" trigger="scroll" strokeWidth={6} />
        </figure>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="vt-manifesto" data-theme="oliva">
      <SplitText as="h2" by="lines" effect="block" emphasis className="vt-manifesto__t" duration={1.1} stagger={0.16}>
        {MANIFESTO}
      </SplitText>
    </section>
  );
}

function Collage() {
  return (
    <section className="vt-collage" data-theme="hueso" aria-labelledby="vt-collage-t">
      <h2 id="vt-collage-t" className="vt-label">Temporadas</h2>
      <ul className="vt-collage__grid">
        {SHOTS.map((s) => (
          <li key={s.file} style={{ "--w": `${s.w}%`, "--x": `${s.x}%`, "--y": `${s.y}px` } as CSSProperties}>
            <Parallax speed={s.speed}>
              <figure>
                <figcaption>{s.place}, {s.year}</figcaption>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(s.file)} alt={s.alt} loading="lazy" />
              </figure>
            </Parallax>
          </li>
        ))}
        <li className="vt-collage__quote">
          <SplitText as="p" by="words" effect="fade" emphasis>
            {QUOTE}
          </SplitText>
          <LineDraw className="vt-collage__sign" shape="signature" strokeWidth={2} duration={1.4} />
        </li>
      </ul>
    </section>
  );
}

function OnOff() {
  return (
    <section className="vt-onoff" data-theme="hueso">
      <ImageTrail images={TRAIL.map(img).join(",")} imageWidth={240} threshold={90}>
        <div className="vt-onoff__in">
          <SplitText as="h2" by="words" effect="block" emphasis className="vt-onoff__t">
            Dentro y fuera de la *carretera*
          </SplitText>
          <p className="vt-onoff__hint">Mueve el ratón por aquí: entrenos, viajes y días de descanso.</p>
        </div>
      </ImageTrail>
    </section>
  );
}

function Palmares() {
  return (
    <section id="palmares" className="vt-wins" data-theme="negro" aria-labelledby="vt-wins-t">
      <div className="vt-wins__head">
        <h2 id="vt-wins-t" className="vt-h2">Palmarés</h2>
        <MetaTable rows={SEASON} columns={2} label="Temporada en cifras" className="vt-season" />
      </div>
      <ul className="vt-wins__grid">
        {WINS.map((w, i) => (
          <li key={w.title} style={{ "--o": i % 2 ? "64px" : "0px" } as CSSProperties}>
            <Notched label={<><b>{w.title}</b> <span>{w.year}</span></>}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(w.file)} alt={w.alt} loading="lazy" />
              <span className="vt-wins__note">{w.note}</span>
            </Notched>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Calendar() {
  return (
    <section id="calendario" className="vt-cal" data-theme="negro" aria-labelledby="vt-cal-t">
      <h2 id="vt-cal-t" className="vt-h2">Calendario</h2>
      <ol className="vt-cal__list">
        {CALENDAR.map((c) => (
          <li key={c.race}>
            <span className="vt-cal__d">{c.date}</span>
            <span className="vt-cal__r">{c.race}</span>
            <span className="vt-cal__p">{c.place}</span>
          </li>
        ))}
      </ol>
      <div id="tienda" className="vt-shop">
        <p>Maillot de la temporada, gorras y la edición firmada del casco.</p>
        <Button label="Ir a la tienda" href="#tienda" variant="solid" size="lg" glyph="→" />
      </div>
    </section>
  );
}

export function Page({ path }: { path: string[] }) {
  if (path.length) return null;
  return (
    <ThemeScroll themes={THEMES} as="main" className="vt-main">
      <GridBackground kind="contour" position="fixed" drift fade={false} opacity={1} className="vt-contour" />
      <Header />
      <div id="contenido" className="vt-body">
        <Hero />
        <Message />
        <Manifesto />
        <Collage />
        <OnOff />
        <Palmares />
        <Calendar />
      </div>
      <div data-theme="negro">
        <BigFooter heading="Pedalea con Nora" lead="Prensa, patrocinio y eventos" email="hola@noravidal.example" note="© 2026 Nora Vidal. Atleta ficticia: demo construida con Trama." credit="Créditos de las fotos" creditHref="/creditos" city="Girona" timeZone="Europe/Madrid" />
      </div>
    </ThemeScroll>
  );
}
