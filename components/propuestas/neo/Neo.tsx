"use client";

import Link from "next/link";
import { useState } from "react";
import CrossCluster from "@/components/ui/CrossCluster";
import DeviceMockup3D from "@/components/ui/DeviceMockup3D";
import Marquee from "@/components/ui/Marquee";
import ObjectStage from "@/components/ui/ObjectStage";
import TypeField from "@/components/ui/TypeField";
import DemoPreviewLink from "@/components/site/DemoPreviewLink";
import InstallChip from "@/components/site/InstallChip";
import StartSteps from "@/components/site/StartSteps";
import VariantLab from "@/components/site/VariantLab";
import { VERSION } from "@/components/site/theme";
import type { DemoItem } from "@/components/site/DemosIndex";
import type { HomeData } from "@/components/site/HomePage";
import "./neo.css";

/*
 * Propuesta «Neo» para la portada de Trama: la estructura de la web actual (portada con cifras, componentes con el
 * banco de variantes, demos y empezar) con una piel neofuturista y cuatro escenas 3D del propio kit, una por acto:
 * ObjectStage (nudo cromado que mira al puntero), CrossCluster (cruces de cristal), DeviceMockup3D (la web del
 * sector elegido, viva dentro de un portátil) y TypeField (campo de letras al cerrar). Todas cargan three bajo
 * demanda y caen a una versión plana sin WebGL o con movimiento reducido.
 */

type Sector = { id: string; label: string; blurb: string; items: DemoItem[] };

const pad = (n: number) => String(n).padStart(2, "0");
// la web que se enseña en el portátil: la primera web completa del sector, si la hay
const portada = (s: Sector) => s.items.find((i) => i.href.startsWith("/sitios/")) ?? s.items[0];

export default function Neo({ data, sectores }: { data: HomeData; sectores: Sector[] }) {
  const { counts } = data;
  const [sectorId, setSector] = useState(sectores[0]?.id ?? "");
  const sector = sectores.find((s) => s.id === sectorId) ?? sectores[0];
  const enPantalla = sector ? portada(sector) : undefined;

  return (
    <main id="contenido" className="neo">
      {/* ---------- 00 · portada ---------- */}
      <section className="neo-hero" aria-labelledby="neo-h1">
        <div className="neo-hero__text">
          <p className="neo-label">Componentes, guías y recetas · React / Next.js · {VERSION}</p>
          <h1 id="neo-h1" className="neo-hero__name">TRAMA</h1>
          <p className="neo-hero__lead">
            Componentes, guías visuales y escenas 3D para construir webs con carácter. <strong>{counts.styles} acabados</strong>, tokens y composición, y una demo para cada sector.
          </p>
          <div className="neo-hero__cta">
            <Link href="/docs/empezar" className="neo-btn neo-btn--solid">Empezar</Link>
            <Link href="/componentes" className="neo-btn">Ver componentes →</Link>
            <Link href="/docs/agentes" className="neo-btn">Para agentes ↗</Link>
            <InstallChip command="npm run pkg:pack" />
          </div>
        </div>
        <div className="neo-hero__stage" aria-hidden>
          <span className="neo-orbit neo-orbit--a" />
          <span className="neo-orbit neo-orbit--b" />
          <ObjectStage shape="knot" material="metal" tone="fg" motion="pointer" follow={1.1} height={620} />
        </div>
        <dl className="neo-stats">
          {[
            ["entradas de catálogo", counts.components],
            ["categorías", counts.categories],
            ["acabados", counts.styles],
            ["demos", counts.demos],
            ["webs completas", counts.sites],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="neo-strip">
        <Marquee text={data.componentNames.join(" · ")} variant="minimal" tone="mut" rows={1} fontSize={12} duration={140} separator="   ·   " edgeFade />
      </div>

      {/* ---------- 01 · componentes ---------- */}
      <section id="componentes" className="neo-sec" aria-labelledby="neo-h-comp">
        <header className="neo-sec__head">
          <p className="neo-label">01 — Componentes</p>
          <h2 id="neo-h-comp">Un componente, {counts.styles} acabados.</h2>
          <p>El tema son ocho tokens CSS en un contenedor; el acabado, la prop <code>variant</code>; el color semántico, <code>intent</code>. Todo lo de abajo son piezas reales del kit.</p>
        </header>
        <div className="neo-cluster">
          <CrossCluster count={22} glass={3} glossy={0.4} follow={0.4} height={420} />
          <p className="neo-cluster__cap">CrossCluster · cruces de plástico y cristal que siguen al puntero, sin WebAssembly</p>
        </div>
        <VariantLab />
        <ol className="neo-index">
          {data.categories.map((c, i) => (
            <li key={c.id}>
              <Link href={`/componentes?c=${c.id}#${c.first}`}>
                <span className="neo-n">{pad(i + 1)}</span>
                <span className="neo-index__name">{c.label}</span>
                <span className="neo-index__blurb">{c.blurb}</span>
                <span className="neo-index__count">{c.count}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- 02 · por sector ---------- */}
      <section id="sectores" className="neo-sec" aria-labelledby="neo-h-sec">
        <header className="neo-sec__head">
          <p className="neo-label">02 — Por sector</p>
          <h2 id="neo-h-sec">Tu negocio, ya montado.</h2>
          <p>Webs completas, landings y réplicas de webs premiadas ordenadas por sector. Elige el tuyo: la primera se abre en vivo en el portátil.</p>
        </header>
        <div className="neo-chips" role="group" aria-label="Sector">
          {sectores.map((s) => (
            <button key={s.id} type="button" aria-pressed={s.id === sectorId} onClick={() => setSector(s.id)}>
              {s.label} <small>{s.items.length}</small>
            </button>
          ))}
        </div>
        {sector && (
          <div className="neo-sector">
            <div className="neo-sector__device">
              {enPantalla && (
                <DeviceMockup3D
                  key={enPantalla.href}
                  device="laptop"
                  url={enPantalla.href}
                  urlLabel={`trama.dev${enPantalla.href}`}
                  finish="graphite"
                  motion="pointer"
                  pointerX={14}
                  pointerY={8}
                  rotateX={6}
                  rotateY={-14}
                />
              )}
            </div>
            <div className="neo-sector__list">
              <p className="neo-sector__blurb">{sector.blurb}</p>
              <ol>
                {sector.items.map((d, i) => (
                  <li key={d.href}>
                    <DemoPreviewLink href={d.href} previewTitle={d.title} className="neo-row" style={{ ["--accent" as string]: d.accent }}>
                      <span className="neo-n">{pad(i + 1)}</span>
                      <span className="neo-row__title">{d.title}</span>
                      <span className="neo-row__meta">{d.meta}</span>
                    </DemoPreviewLink>
                  </li>
                ))}
              </ol>
              <Link href={`/demos#${sector.id}`} className="neo-link">Ver el sector en /demos →</Link>
            </div>
          </div>
        )}
      </section>

      {/* ---------- 03 · webs completas ---------- */}
      <section id="webs" className="neo-sec" aria-labelledby="neo-h-webs">
        <header className="neo-sec__head">
          <p className="neo-label">03 — Webs completas</p>
          <h2 id="neo-h-webs">Varias páginas, estado real.</h2>
          <p>Carrito, reservas, chat, suscripción y transiciones entre rutas, cada una con su tema.</p>
        </header>
        <ol className="neo-grid">
          {data.sites.slice(0, 12).map((s, i) => (
            <li key={s.slug}>
              <DemoPreviewLink href={`/sitios/${s.slug}`} previewTitle={s.name} className="neo-card" style={{ ["--accent" as string]: s.accent }}>
                <span className="neo-n">{pad(i + 1)}</span>
                <span className="neo-card__name">{s.name}</span>
                <span className="neo-card__meta">{s.tag} · {s.pages} páginas</span>
              </DemoPreviewLink>
            </li>
          ))}
        </ol>
        <Link href="/demos" className="neo-link">Todas las demos →</Link>
      </section>

      {/* ---------- 04 · empezar ---------- */}
      <section id="empezar" className="neo-sec neo-sec--last" aria-labelledby="neo-h-start">
        <header className="neo-sec__head">
          <p className="neo-label">04 — Empezar</p>
          <h2 id="neo-h-start">Instala. Pon tus tokens. Compón.</h2>
        </header>
        <div className="neo-start">
          <StartSteps />
          <ol className="neo-steps">
            <li><span className="neo-n">01</span><div><strong>Secciones primero</strong><p>Hero, FeatureGrid, PricingSection, FAQSection, ContactForm, Footer… y piezas sueltas para lo que falte.</p></div></li>
            <li><span className="neo-n">02</span><div><strong>Pasa siempre el texto</strong><p>Los defaults son copy de demostración. Un texto opcional se oculta con una cadena vacía.</p></div></li>
            <li><span className="neo-n">03</span><div><strong>Sin colores fijos</strong><p>Todo sale de <code>--bg --fg --mut --acc --acc2 --card --ln --r</code>.</p></div></li>
          </ol>
        </div>
        <div className="neo-field">
          <TypeField words={"COMPONENTES|acc\nRECETAS|acc2\nAGENTES|acc\nDEMOS|fg"} trigger="loop" duration={7} height={460} />
        </div>
      </section>
    </main>
  );
}
