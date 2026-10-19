"use client";

import { type CSSProperties, type ReactNode } from "react";
import BigFooter from "@/components/ui/BigFooter";
import CookieBanner from "@/components/ui/CookieBanner";
import CustomCursor from "@/components/ui/CustomCursor";
import ElasticText from "@/components/ui/ElasticText";
import FitText from "@/components/ui/FitText";
import RollLink from "@/components/ui/RollLink";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SplitText from "@/components/ui/SplitText";
import StickerCollage from "@/components/ui/StickerCollage";
import WorkViews from "@/components/ui/WorkViews";
import { photo } from "@/lib/sites/photos";
import { sticker } from "@/lib/sites/stickers";
import { editorialTokens, tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { JOBS, SLUG } from "./data";
import "./mota.css";

// crema con un único acento coral; texto pequeño siempre en tinta (el coral solo en tamaños grandes)
const TOKENS: CSSProperties = tokensToStyle({ ...editorialTokens, bg: "#f4f0e8", fg: "#17140f", mut: "#625c52", card: "#e9e3d7", ln: "rgba(23,20,15,0.2)", acc: "#ff5a36", r: 14, display: 'var(--font-bricolage-grotesque), var(--font-inter-tight), sans-serif' });
const href = (p = "") => siteHref(SLUG, p);

const STICKERS = [
  { id: "a", src: sticker("burst", "#ff5a36", "#fff3c4"), x: 12, y: 24, width: 130, rotate: -12, label: "Pegatina de una explosión" },
  { id: "b", src: sticker("smile", "#ffd23d"), x: 88, y: 22, width: 110, rotate: 10, label: "Pegatina de una cara sonriente" },
  { id: "c", src: sticker("flower", "#ff8fb6", "#ffe066"), x: 84, y: 78, width: 120, rotate: -6, label: "Pegatina de una flor" },
  { id: "d", src: sticker("tv", "#47c2ff", "#fff3c4"), x: 14, y: 76, width: 120, rotate: 8, label: "Pegatina de una tele antigua" },
  { id: "e", src: sticker("bolt", "#ffd23d"), x: 50, y: 10, width: 80, rotate: 14, label: "Pegatina de un rayo" },
];

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <SiteFrame tokens={TOKENS} className="mo">
      <SmoothScroll />
      <CustomCursor hideNative />
      <header className="mo-head">
        <nav aria-label="Principal" className="mo-nav">
          <RollLink label="Inicio" href={href()} />
          <RollLink label="Proyectos" href={href("proyectos")} />
          <RollLink label="Hola" href="mailto:hola@mota.example" />
        </nav>
      </header>
      <main id="contenido">{children}</main>
      <BigFooter heading="mota" lead="¿Tienes un local, una casa o una idea?" email="hola@mota.example" links={[{ label: "Inicio", href: href() }, { label: "Proyectos", href: href("proyectos") }]} note="© 2026 Mota Estudio" credit="Créditos de las imágenes" creditHref="/creditos" city="Valencia" timeZone="Europe/Madrid" />
      <CookieBanner storageKey="mota-cookies" policyHref="#" title="Galletas, pero de las buenas" text="Usamos las imprescindibles y, si nos dejas, alguna para saber qué te gusta." />
    </SiteFrame>
  );
}

/* ---------- inicio ---------- */
function Home() {
  return (
    <>
      <section className="mo-hero">
        <h1 className="ui-sr">Mota, estudio de interiorismo y marca</h1>
        <div className="mo-mark" aria-hidden><FitText>`mota</FitText></div>
        <div className="mo-hero__row">
          <p className="mo-hero__p">Somos un estudio pequeño de interiorismo, marca y diseño gráfico para sitios que quieren tener carácter.</p>
          <a className="mo-pill" href="#colage" data-cursor="Bajar">Mira lo que hacemos ↓</a>
        </div>
      </section>

      <section id="colage" aria-label="Collage">
        <StickerCollage stickers={STICKERS} height="min(88vh, 760px)">
          <ElasticText as="p" mode="scroll" stretch={0.9} className="mo-big">Locales con alma, casas con humor.</ElasticText>
        </StickerCollage>
      </section>

      <section className="mo-sec" aria-label="Proyectos">
        <SplitText as="h2" by="words" stagger={0.05} className="mo-h2">Lo último.</SplitText>
        <WorkViews items={JOBS.slice(0, 5).map((j) => ({ title: j.title, meta: j.kind, year: j.year, image: photo(j.topic, j.i).src, alt: j.alt, href: href("proyectos") }))} />
      </section>
    </>
  );
}

/* ---------- proyectos ---------- */
function Jobs() {
  return (
    <section className="mo-sec" style={{ paddingTop: "clamp(40px, 6vw, 88px)" }}>
      <SplitText as="h1" by="lines" trigger="mount" className="mo-h2">Proyectos.</SplitText>
      <WorkViews views={["grid", "list", "index"]} items={JOBS.map((j) => ({ title: j.title, meta: j.kind, year: j.year, image: photo(j.topic, j.i).src, alt: j.alt, href: href("proyectos") }))} />
    </section>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a] = path;
  if (!a) return <Home />;
  if (a === "proyectos") return <Jobs />;
  return null;
}
