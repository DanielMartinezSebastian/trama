"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import BentoGrid from "@/components/ui/BentoGrid";
import ContactForm from "@/components/ui/ContactForm";
import PointCloud, { POINTCLOUD_REST, type PointCloudState } from "@/components/ui/PointCloud";
import SmoothScroll from "@/components/ui/SmoothScroll";
import StatsSection from "@/components/ui/StatsSection";
import { useScrollStory } from "@/lib/story/useScrollStory";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame } from "../shared";
import { BRAND, CHAPTERS, SERVICES, STATS } from "./data";
import "./cota.css";

const TOKENS: CSSProperties = tokensToStyle({
  bg: "#0a0f12",
  fg: "#e6eef2",
  mut: "#8fa3ad",
  acc: "#ffb347",
  acc2: "#2fb7c9",
  card: "#111a1f",
  ln: "rgba(230,238,242,0.14)",
  r: 10,
  font: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-space-grotesk), var(--font-inter), sans-serif',
  accentFont: 'var(--font-geist-mono), ui-monospace, monospace',
});

export function Shell({ children }: { children: ReactNode }) {
  return (
    <SiteFrame tokens={TOKENS} className="ct">
      <SmoothScroll lerp={0.07} syncGsap={false} />
      <header className="ct-head">
        <a className="ct-brand" href="#top" aria-label="Cota, arriba">
          <span aria-hidden>◬</span> Cota
        </a>
        <a className="ct-head__cta" href="#contacto">Pedir un vuelo</a>
      </header>
      <main id="top">{children}</main>
      <footer className="ct-foot">
        <p>{BRAND.legal} · {BRAND.city} · <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></p>
        <p>Demo de Trama: el terreno es procedural y la empresa no existe.</p>
      </footer>
    </SiteFrame>
  );
}

/* ---------- el guion: una pose de la nube por paso (useScrollStory interpola con el scroll) ---------- */
const P = (p: Partial<PointCloudState>): PointCloudState => ({ ...POINTCLOUD_REST, ...p });
type Beat = { kind: "hero" | "card"; pose: PointCloudState; chapter: number; side?: "left" | "right" };
const BEATS: Beat[] = [
  // portada: vista alta y lejana, el barrido empieza (los puntos aparecen)
  { kind: "hero", chapter: -1, pose: P({ reveal: 0.55, heightColor: 0, lift: 0, yaw: 0.2, pitch: 0.95, zoom: 1, x: 0.2, y: 0.05 }) },
  // 01 vuelo: la cámara baja y gira; el barrido avanza
  { kind: "card", chapter: 0, side: "left", pose: P({ reveal: 0.75, heightColor: 0, lift: 0, yaw: 0.9, pitch: 0.55, zoom: 0.95, x: 0.18 }) },
  // 02 escaneo: todo barrido y color por cota
  { kind: "card", chapter: 1, side: "right", pose: P({ reveal: 1, heightColor: 1, lift: 0, yaw: 1.6, pitch: 0.7, zoom: 0.9, x: -0.18 }) },
  // 03 medición: la línea de medida
  { kind: "card", chapter: 2, side: "left", pose: P({ reveal: 1, heightColor: 1, lift: 0, measure: 1, yaw: 2.3, pitch: 0.95, zoom: 0.95, x: 0.18 }) },
  // 04 gemelo digital: los edificios se levantan, de cerca sobre el solar
  { kind: "card", chapter: 3, side: "right", pose: P({ reveal: 1, heightColor: 0.45, lift: 1, yaw: 3.6, pitch: 0.6, zoom: 0.78, x: -0.16 }) },
];
const KEYS = Object.keys(POINTCLOUD_REST) as (keyof PointCloudState)[];

export function Page(_props: { path: string[] }) {
  const list = useRef<HTMLOListElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pose = useRef<PointCloudState>({ ...BEATS[0].pose });
  const [chapter, setChapter] = useState(-1);
  useScrollStory(list, stage, {
    onFrame: ({ j, next, t }) => {
      const a = BEATS[j].pose, b = BEATS[next].pose, p = pose.current;
      for (const k of KEYS) p[k] = a[k] + (b[k] - a[k]) * t;
      // en móvil, la nube centrada (los cuadros van abajo) y algo más lejos
      if (innerWidth < 760) {
        p.x = 0;
        p.y = 0.18;
        p.zoom *= 1.35;
      }
      const c = BEATS[t > 0.5 ? next : j].chapter;
      setChapter((prev) => (prev === c ? prev : c));
    },
  });

  return (
    <>
      <section className="ct-story" aria-label="Cómo medimos un terreno, en cuatro pasos">
        <div className="ct-stage" ref={stage}>
          <PointCloud state={pose} fill lens={0.16} follow={0.1} measure="-0.75,0.55;0.55,-0.25" measureLabel="{d} m · desnivel {h} m" alt="Nube de puntos de un terreno con un río, un cerro y un solar con edificios" />
          {/* índice: el paso en el que estás */}
          <nav className="ct-rail" aria-label="Pasos">
            {CHAPTERS.map((c, i) => (
              <a key={c.id} href={`#${c.id}`} aria-current={chapter === i ? "step" : undefined}>
                <span>{c.k}</span> {c.title}
              </a>
            ))}
          </nav>
          <div className="ct-cards">
            {BEATS.map((b, k) => {
              if (b.kind !== "card") return null;
              const c = CHAPTERS[b.chapter];
              return (
                <div key={k} className="ct-card" data-card={k} data-side={b.side}>
                  <article className="ct-card__box">
                    <p className="ct-card__k"><span>{c.k}</span> {c.title}</p>
                    <h2 className="ct-card__thesis">{c.thesis}</h2>
                    <p className="ct-card__what">{c.what}</p>
                    <p className="ct-card__stat">{c.stat}</p>
                  </article>
                </div>
              );
            })}
          </div>
          <span className="ct-bar" aria-hidden />
        </div>
        <ol className="ct-steps" ref={list}>
          <li data-step={0} className="ct-step ct-step--hero">
            <div className="ct-hero">
              <p className="ct-kicker">Topografía con dron · {BRAND.city}</p>
              <h1 className="ct-hero__title">Medimos el terreno al centímetro.</h1>
              <p className="ct-hero__sub">Volamos, escaneamos y te entregamos el terreno como datos: curvas, volúmenes y un gemelo digital en 24 horas.</p>
              <p className="ct-hint" aria-hidden>Pasa el ratón por los puntos · haz clic para escanear</p>
            </div>
          </li>
          {BEATS.map((b, k) =>
            b.kind === "card" ? (
              <li key={k} id={CHAPTERS[b.chapter].id} data-step={k} className="ct-step" aria-label={`${CHAPTERS[b.chapter].k}. ${CHAPTERS[b.chapter].title}`}>
                <p className="ui-sr">{CHAPTERS[b.chapter].thesis} {CHAPTERS[b.chapter].what}</p>
              </li>
            ) : null,
          )}
        </ol>
      </section>

      <section className="ct-wrap ct-sec">
        <p className="ct-kicker">Servicios</p>
        <h2 className="ct-h2">Lo que medimos.</h2>
        <BentoGrid columns={4} variant="minimal" className="ct-bento" cells={SERVICES.map((s) => ({ ...s }))} />
      </section>

      <section className="ct-wrap ct-sec">
        <StatsSection kicker="" title="En cifras" subtitle="" stats={STATS} tone="acc" />
      </section>

      <section className="ct-wrap ct-sec ct-contact" id="contacto">
        <div>
          <p className="ct-kicker">Contacto</p>
          <h2 className="ct-h2">¿Qué terreno quieres medir?</h2>
          <p className="ct-mut">Cuéntanos dónde y para qué; te respondemos con un plan de vuelo y un precio cerrado. O llama al <a href={BRAND.phoneHref}>{BRAND.phone}</a>.</p>
        </div>
        <ContactForm title="" subtitle="" fields="name,email,message" messagePlaceholder="Parcela, hectáreas y qué necesitas (curvas, volúmenes, gemelo…)" submitLabel="Pedir un vuelo" successTitle="Recibido (de mentira)" successMessage="Es una demo: no se envía nada." variant="minimal" onSubmit={() => ({ ok: true })} />
      </section>
    </>
  );
}
