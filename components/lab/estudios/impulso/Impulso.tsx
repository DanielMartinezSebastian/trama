"use client";

import { useEffect, useRef } from "react";
import LogoCloud from "@/components/ui/LogoCloud";
import Marquee from "@/components/ui/Marquee";
import ProjectList from "@/components/ui/ProjectList";
import { trackScroll } from "@/lib/motion/progress";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import "./impulso.css";

/*
 * Impulso Coaching: réplica de Essor Fitness (docs/50 §3.4). Negro absoluto y blanco, una sans apretada gigante con
 * espaciado negativo, cintas blancas de texto que separan secciones (Marquee), un titular que cruza la pantalla con el
 * scroll, fichas numeradas que crecen desde una miniatura, servicios en filas numeradas (ProjectList) y el manifiesto con
 * retratos detrás. Botones en píldora de contorno.
 */

const F = "/img/forja/";
const C = "/img/cadencia/";

function Cruza({ texto }: { texto: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    return trackScroll(el, (r, vh) => {
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      el.style.translate = `${(0.35 - p) * 90}vw 0`;
    });
  }, [reduced]);
  return (
    <div className="im-cruza">
      <h2 ref={ref}>{texto}</h2>
    </div>
  );
}

const FICHAS = [
  { n: "01", titulo: "El estudio", img: `${C}local.webp` },
  { n: "02", titulo: "Tomás Lluch", img: `${C}equipo/dani.webp` },
  { n: "03", titulo: "Cristina Bayo", img: `${C}equipo/ines.webp` },
  { n: "04", titulo: "Nuestra misión", img: `${C}grupo.webp` },
];

export default function Impulso() {
  return (
    <div className="im">
      <header className="im-head">
        <a href="#inicio" className="im-logo">Impulso Fitness</a>
        <div className="im-head__nav">
          <b>Coach deportivo • Entrenador personal</b>
          <nav aria-label="Principal"><a href="#inicio">Inicio</a> • <a href="#equipo">Equipo</a> • <a href="#servicios">Servicios</a> • <a href="#contacto">Contacto</a></nav>
        </div>
        <div className="im-head__datos"><b>+34 600 000 000 • hola@impulso.example</b><span>Calle de Ponzano 41 · 28003 Madrid</span></div>
        <a href="#contacto" className="im-pildora">Empiezo</a>
      </header>

      <section className="im-hero" id="inicio">
        <h1>Coaching deportivo<br />&amp; nutricional<br />en Chamberí</h1>
        <figure className="im-diploma">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${C}equipo/dani.webp`} alt="" />
          <figcaption>Coach titulado en ciencias del deporte</figcaption>
        </figure>
      </section>
      <Marquee variant="minimal" text="Entrenamiento personal     Entrenamiento en pareja     Grupo semiprivado     Nutrición     Seguimiento a distancia" separator="     " rows={1} duration={40} className="im-cinta" />
      <h2 className="im-marca">Impulso Fitness™</h2>
      <div className="im-nota">
        <span>★★★★★ 4,85/5 · 60+ reseñas</span>
        <span>Cardio • Postura • Fuerza • Pérdida de peso • Rendimiento • Longevidad</span>
      </div>

      <section className="im-promesa">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${C}equipo/dani.webp`} alt="Tomás, el entrenador, con el polo del estudio" />
        <div>
          <p>Mejora tu salud y tu rendimiento con un entrenador personal privado en Chamberí, titulado y reconocido por las aseguradoras.</p>
          <a href="#contacto" className="im-pildora">Pasa a la acción</a>
          <Marquee variant="minimal" text="Entrenamiento personal     Nuestros colaboradores     Seguimiento a distancia" separator="     " rows={1} duration={30} className="im-cinta im-cinta--fina" />
          <LogoCloud label="" brands="TheMeal, Clínica Alba, asca, qualitop, Mutua Sur, Q Vida" variant="outline" className="im-logos" />
        </div>
      </section>

      <div className="im-etiquetas"><span>Acompañamiento premium</span><span>Material profesional</span></div>
      <Cruza texto="Estudio privado de alto nivel en Chamberí" />
      <section className="im-estudio" id="equipo">
        <p>En nuestro estudio privado de Chamberí entrenas en un espacio solo para ti. Te dejamos <b>material de alta gama</b> de musculación y cardio, base de un <b>programa a medida</b> según tus objetivos y tus necesidades.</p>
        <a href="#contacto" className="im-pildora">Pide tu sesión de prueba</a>
        <div className="im-fichas">
          {FICHAS.map((f) => (
            <figure key={f.n} className="im-ficha">
              <div className="im-ficha__marco">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.img} alt="" loading="lazy" />
              </div>
              <figcaption><span>{f.titulo}</span><span>({f.n})</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <p className="im-etiqueta">Programa de entrenamiento a medida</p>
      <h2 className="im-servicios__titulo" id="servicios">Nuestros servicios</h2>
      <Marquee variant="minimal" text="Máquinas de cardio modernas     Material de musculación de alta gama     Consulta inicial" separator="     " rows={1} duration={36} className="im-cinta" />
      <section className="im-servicios">
        <ProjectList
          items={[
            { title: "Entrenamiento personal", meta: "Un coach privado en Chamberí solo para ti", image: "/img/cadencia/fuerza.webp" },
            { title: "Entrenamiento en pareja", meta: "Coaching a dos: eficaz y motivador", image: "/img/cadencia/grupo.webp" },
            { title: "Grupo pequeño", meta: "Grupos de 3 a 5 en una sala privada", image: "/img/cadencia/cardio.webp" },
            { title: "Nutrición", meta: "Tu plan de comidas a medida", image: "/img/cadencia/movilidad.webp" },
            { title: "Seguimiento a distancia", meta: "Programa y seguimiento en línea", image: "/img/cadencia/local.webp" },
          ]}
          className="im-lista"
        />
      </section>

      <section className="im-manifiesto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${C}equipo/nico.webp`} alt="" className="im-manifiesto__a" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${F}equipo/ines.webp`} alt="" className="im-manifiesto__b" />
        <p>En Impulso te proponemos un entrenamiento personal y un acompañamiento nutricional a medida en nuestro estudio privado de 70 m² en Chamberí.</p>
      </section>

      <footer className="im-pie" id="contacto">
        <span>+34 600 000 000</span>
        <a href="#contacto" className="im-pildora">Me apunto al reto</a>
        <span>hola@impulso.example</span>
      </footer>
    </div>
  );
}
