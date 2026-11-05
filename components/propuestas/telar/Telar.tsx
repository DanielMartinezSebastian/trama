"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CodeBlock from "@/components/ui/CodeBlock";
import Reveal from "@/components/ui/Reveal";
import ScrubText from "@/components/ui/ScrubText";
import Weave from "./Weave";
import "./telar.css";

/*
 * Propuesta «Telar» para la portada de Trama: el nombre hecho materia. La urdimbre son los ocho tokens del tema, la
 * trama los componentes que la cruzan; los tejidos, lo que se ha hecho con ellos (demos por sector) y el muestrario,
 * las guías de estilo. La portada es una tela que se teje con el scroll.
 */

type Counts = { components: number; categories: number; styles: number; demos: number; sites: number };
type Sector = { id: string; label: string; n: number };
type Guia = { id: string; label: string; bg: string; fg: string; acc: string };

const VARIANTS = ["editorial", "minimal", "solid", "outline", "glass", "retro", "terminal", "dotmatrix", "neon"] as const;
const TOKENS = [
  ["--bg", "fondo", "#efe8da"],
  ["--fg", "tinta", "#1c1915"],
  ["--mut", "texto secundario", "#5b5348"],
  ["--acc", "acento", "#b0300f"],
  ["--acc2", "segundo acento", "#2f4a6b"],
  ["--card", "superficie", "#f7f2e8"],
  ["--ln", "líneas", "#c9bb9f"],
  ["--r", "radio", "0px"],
];
// ligamentos para las muestras de cada sector: tafetán, sarga, espiga, cuadros…
const LIGAMENTOS = ["tafetan", "sarga", "espiga", "cuadro", "rizo", "punto", "gasa", "tweed", "canale", "rombo", "listado"];

export default function Telar({ counts, sectores, guias }: { counts: Counts; sectores: Sector[]; guias: Guia[] }) {
  return (
    <div className="tel" data-scrollable>
      <header className="tel-top">
        <a href="/" className="tel-brand">Trama</a>
        <nav aria-label="Secciones">
          <a href="#urdimbre">Urdimbre</a>
          <a href="#trama">Trama</a>
          <a href="#tejidos">Tejidos</a>
          <a href="#muestrario">Muestrario</a>
          <a href="#al-telar">Empezar</a>
        </nav>
      </header>

      <main>
        <section className="tel-hero" aria-labelledby="tel-h1">
          <Weave className="tel-hero__weave" />
          <div className="tel-hero__card">
            <p className="tel-kicker">Componentes para React y Next.js</p>
            <h1 id="tel-h1">Trama<span>.</span></h1>
            <p className="tel-hero__lead">
              En un telar, la urdimbre está tensa y quieta, y la trama la cruza una y otra vez hasta hacer tela. Aquí la urdimbre son ocho variables CSS y la trama, {counts.components} piezas que la atraviesan.
            </p>
            <div className="tel-ctas">
              <Button label="Empezar a tejer" href="/docs/empezar" variant="editorial" intent="accent" />
              <Button label="Ver las piezas" href="/componentes" variant="editorial" intent="neutral" emphasis="outline" />
            </div>
          </div>
        </section>

        <section id="urdimbre" className="tel-sec tel-urdimbre" aria-labelledby="tel-urd">
          <div className="tel-sec__head">
            <p className="tel-num">01 — Urdimbre</p>
            <h2 id="tel-urd">Ocho hilos tensos sostienen todo el tema.</h2>
          </div>
          <div className="tel-urdimbre__grid">
            <ol className="tel-hilos">
              {TOKENS.map(([t, n, v]) => (
                <li key={t} style={{ ["--hilo" as string]: t === "--r" ? "#1c1915" : v }}>
                  <span className="tel-hilo" aria-hidden />
                  <code>{t}</code>
                  <span>{n}</span>
                </li>
              ))}
            </ol>
            <figure className="tel-foto">
              <img src="/propuestas/telar/telar-manos.webp" alt="Manos pasando una lanzadera de madera entre los hilos de un telar" />
              <figcaption>Imagen generada para esta propuesta.</figcaption>
            </figure>
          </div>
          <div className="tel-scrub">
            <ScrubText dim={0.52}>Cambias un hilo y cambia toda la tela: el fondo, la tinta y el acento se declaran una vez en un contenedor y cada pieza los hereda. Sin colores fijos, sin temas duplicados, sin tocar un componente.</ScrubText>
          </div>
        </section>

        <section id="trama" className="tel-sec tel-trama" aria-labelledby="tel-tr">
          <div className="tel-sec__head">
            <p className="tel-num">02 — Trama</p>
            <h2 id="tel-tr">Una pieza, nueve pasadas.</h2>
            <p>La prop <code>variant</code> cambia el acabado de cada pieza sin cambiar su urdimbre. Estas son las mismas dos piezas en los nueve acabados del kit.</p>
          </div>
          <Reveal kind="wipe" direction="right" stagger={0.06}>
            {VARIANTS.map((v, i) => (
              <div key={v} className="tel-pasada" data-oscura={["terminal", "neon", "retro"].includes(v) || undefined}>
                <span className="tel-pasada__n">{String(i + 1).padStart(2, "0")}</span>
                <code>{v}</code>
                <Button label="Reservar" variant={v} size="sm" />
                <Badge text="Nuevo" variant={v} intent="accent" />
              </div>
            ))}
          </Reveal>
        </section>

        <section id="tejidos" className="tel-sec" aria-labelledby="tel-tej">
          <div className="tel-sec__head">
            <p className="tel-num">03 — Tejidos</p>
            <h2 id="tel-tej">Lo que ya se ha tejido, por sector.</h2>
            <p>{counts.demos} demos y {counts.sites} webs completas. Elige la muestra de tu negocio y ábrela entera.</p>
          </div>
          <figure className="tel-banda">
            <img src="/propuestas/telar/telar-muestras.webp" alt="Nueve muestras de tejido de colores y texturas distintas sobre una mesa de lino" />
          </figure>
          <ul className="tel-muestras">
            {sectores.map((s, i) => (
              <li key={s.id}>
                <a href={`/demos#${s.id}`}>
                  <span className={`tel-lig tel-lig--${LIGAMENTOS[i % LIGAMENTOS.length]}`} aria-hidden />
                  <strong>{s.label}</strong>
                  <span>{s.n} demos</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="muestrario" className="tel-sec" aria-labelledby="tel-mue">
          <div className="tel-sec__head">
            <p className="tel-num">04 — Muestrario</p>
            <h2 id="tel-mue">{guias.length} guías de estilo, medidas en webs premiadas.</h2>
            <p>Cada franja es una guía: su fondo, su tinta y su acento. Colores, letra, escala y movimiento listos para un proyecto.</p>
          </div>
          <ul className="tel-guias">
            {guias.map((g) => (
              <li key={g.id}>
                <a href={`/guias/${g.id}`} style={{ background: g.bg, color: g.fg }} title={g.label}>
                  <span className="tel-guia__acc" style={{ background: g.acc }} aria-hidden />
                  <span className="tel-guia__label">{g.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <figure className="tel-sec tel-banda tel-banda--urdimbre">
          <img src="/propuestas/telar/telar-urdimbre.webp" alt="Hilos de urdimbre crudos en un telar, cruzados por una pasada de trama bermellón" />
          <figcaption>Imágenes de tejido generadas para esta propuesta.</figcaption>
        </figure>

        <section id="al-telar" className="tel-sec tel-fin" aria-labelledby="tel-fin">
          <div>
            <p className="tel-num">05 — Al telar</p>
            <h2 id="tel-fin">Instala, tensa tus ocho hilos y teje.</h2>
            <div className="tel-ctas">
              <Button label="Guía de primeros pasos" href="/docs/empezar" variant="editorial" intent="accent" />
              <Button label="Para agentes" href="/docs/agentes" variant="editorial" intent="neutral" emphasis="outline" />
            </div>
          </div>
          <CodeBlock
            filename="app/layout.tsx"
            language="tsx"
            showLineNumbers={false}
            variant="editorial"
            code={`import "trama-ui/styles.css";
import { Hero, Button } from "trama-ui";

<main style={{ "--bg": "#efe8da", "--fg": "#1c1915", "--acc": "#b0300f" }}>
  <Hero title="Tu titular" variant="editorial" />
</main>`}
          />
        </section>
      </main>

      <footer className="tel-foot">
        <span>Trama · {counts.components} piezas · {counts.categories} categorías · {counts.styles} acabados</span>
        <a href="/demos">Todas las demos</a>
      </footer>
    </div>
  );
}
