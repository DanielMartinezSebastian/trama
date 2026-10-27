"use client";

import { useEffect, useRef } from "react";
import FAQSection from "@/components/ui/FAQSection";
import LogoCloud from "@/components/ui/LogoCloud";
import Marquee from "@/components/ui/Marquee";
import PricingSection from "@/components/ui/PricingSection";
import ProjectList from "@/components/ui/ProjectList";
import RollLink from "@/components/ui/RollLink";
import SmoothScroll from "@/components/ui/SmoothScroll";
import TestimonialSection from "@/components/ui/TestimonialSection";
import { trackScroll } from "@/lib/motion/progress";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import "./impulso.css";

/*
 * Impulso Coaching: réplica de Essor Fitness (docs/50 §3.4, par medido en docs/cuaderno/replica-impulso.md). Negro absoluto
 * y blanco, una sans de display apretada (Inter Display 600 a 208 px, −3,8 %), cintas blancas finas de texto que separan
 * secciones (Marquee), titulares gigantes que cruzan la pantalla mientras la sección queda fijada, fichas con la foto
 * nítida dentro de su versión desenfocada, servicios en filas numeradas (ProjectList), el manifiesto con retratos, los
 * diplomas, el reto, el muro de la fama, testimonios, tarifas en seis tarjetas, preguntas frecuentes y contacto.
 */

const F = "/img/forja/";
const C = "/img/cadencia/";

/** titular gigante que cruza la pantalla de derecha a izquierda mientras su sección queda fijada (Essor) */
function Cruza({ texto, alto = 220 }: { texto: string; alto?: number }) {
  const caja = useRef<HTMLDivElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = caja.current, t = h2.current;
    if (!el || !t || reduced) return;
    return trackScroll(el, (r, vh) => {
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      t.style.translate = `${-p * Math.max(0, t.scrollWidth - innerWidth + 48)}px 0`;
    });
  }, [reduced]);
  return (
    <div ref={caja} className="im-cruza" style={{ height: reduced ? "auto" : `${alto}vh` }}>
      <div className="im-cruza__fijo">
        <h2 ref={h2}>{texto}</h2>
      </div>
    </div>
  );
}

const Cinta = ({ texto, className = "" }: { texto: string; className?: string }) => (
  <Marquee variant="minimal" text={texto} separator="" rows={1} duration={40} className={`im-cinta ${className}`} />
);

const FICHAS = [
  { n: "01", titulo: "El estudio", img: `${F}sala.webp` },
  { n: "02", titulo: "Tomás Lluch", img: `${C}equipo/dani.webp` },
  { n: "03", titulo: "Cristina Bayo", img: `${F}equipo/ines.webp` },
  { n: "04", titulo: "Nuestra misión", img: `${C}grupo.webp` },
];

const DIPLOMAS = [
  { t: "Grado en Ciencias de la Actividad Física y del Deporte", c: "Universidad Autónoma de Madrid", d: "Fisiología del ejercicio, biomecánica y planificación del entrenamiento." },
  { t: "Diplomado en Nutrición Deportiva", c: "Escuela de Nutrición Aplicada", d: "Planes de alimentación para el rendimiento y la recomposición corporal." },
  { t: "Instructor certificado de entrenamiento funcional", c: "Federación de Fitness", d: "Técnica, progresiones y prevención de lesiones en grupos pequeños." },
];

const FAMA = [`${F}grupo.webp`, `${C}fuerza.webp`, `${F}tecnica.webp`, `${C}cardio.webp`, `${F}pesado.webp`, `${C}movilidad.webp`, `${F}recovery.webp`];

export default function Impulso() {
  return (
    <div className="im">
      <SmoothScroll />
      <header className="im-head">
        <a href="#inicio" className="im-logo">Impulso Fitness</a>
        <div className="im-head__nav">
          <b>Coach deportivo • Entrenador personal</b>
          <nav aria-label="Principal"><RollLink label="Inicio" href="#inicio" /> • <RollLink label="Equipo" href="#equipo" /> • <RollLink label="Servicios" href="#servicios" /> • <RollLink label="Contacto" href="#contacto" /></nav>
        </div>
        <div className="im-head__datos"><b>+34 600 000 000 • hola@impulso.example</b><span>Calle de Ponzano 41 · 28003 Madrid</span></div>
        <RollLink href="#contacto" label="Empiezo" className="im-pildora" />
      </header>

      <section className="im-hero" id="inicio">
        <h1>Coaching deportivo<br />&amp; nutricional<br />en Chamberí</h1>
        <figure className="im-diploma">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${C}equipo/dani.webp`} alt="" />
          <figcaption>Coach titulado en ciencias del deporte</figcaption>
        </figure>
      </section>
      <Cinta texto="Entrenamiento personal · Entrenamiento en pareja · Grupo semiprivado · Nutrición · Seguimiento a distancia ·" />
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
          <RollLink href="#contacto" label="Pasa a la acción" className="im-pildora" />
          <Cinta texto="Entrenamiento personal · Nuestros colaboradores · Seguimiento a distancia ·" className="im-cinta--fina" />
          <LogoCloud label="" brands="TheMeal, Clínica Alba, asca, qualitop, Mutua Sur, Q Vida" variant="outline" className="im-logos" />
        </div>
      </section>

      <div className="im-etiquetas"><span>Acompañamiento premium</span><span>Material profesional</span></div>
      <Cruza texto="Estudio privado de alto nivel en Chamberí" />
      <section className="im-estudio" id="equipo">
        <p>En nuestro estudio privado de Chamberí entrenas en un espacio solo para ti. Te dejamos <b>material de alta gama</b> de musculación y cardio, base de un <b>programa a medida</b> según tus objetivos y tus necesidades.</p>
        <RollLink href="#contacto" label="Pide tu sesión de prueba" className="im-pildora" />
        <div className="im-fichas">
          {FICHAS.map((f) => (
            <figure key={f.n} className="im-ficha">
              <div className="im-ficha__marco" style={{ backgroundImage: `url(${f.img})` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.img} alt="" loading="lazy" />
              </div>
              <figcaption><span>{f.titulo}</span><span>({f.n})</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <p className="im-etiqueta">Programa de entrenamiento a medida</p>
      <h2 className="im-gigante" id="servicios">Nuestros servicios</h2>
      <Cinta texto="Máquinas de cardio modernas · Material de musculación de alta gama · Consulta inicial ·" />
      <section className="im-servicios">
        <ProjectList
          items={[
            { title: "Entrenamiento personal", meta: "Un coach privado en Chamberí solo para ti", image: `${C}fuerza.webp` },
            { title: "Entrenamiento en pareja", meta: "Coaching a dos: eficaz y motivador", image: `${C}grupo.webp` },
            { title: "Grupo pequeño", meta: "Grupos de 3 a 5 en una sala privada", image: `${C}cardio.webp` },
            { title: "Nutrición", meta: "Tu plan de comidas a medida", image: `${C}movilidad.webp` },
            { title: "Seguimiento a distancia", meta: "Programa y seguimiento en línea", image: `${C}local.webp` },
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
        <RollLink href="#tarifas" label="Empieza tu transformación" className="im-pildora" />
      </section>

      <section className="im-diplomas" aria-labelledby="im-diplomas">
        <p className="im-etiqueta">Los expertos a tu servicio</p>
        <h2 className="im-gigante im-gigante--centro" id="im-diplomas">Diplomas</h2>
        <ol>
          {DIPLOMAS.map((d) => (
            <li key={d.t}>
              <b>{d.t}</b>
              <span>{d.c}</span>
              <span>{d.d}</span>
              <i className="im-papel" aria-hidden><em /><em /><em /></i>
            </li>
          ))}
        </ol>
      </section>

      <Cruza texto="Me apunto al reto de 12 semanas" alto={200} />
      <section className="im-reto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${F}tecnica.webp`} alt="Corrección de técnica en sentadilla" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${C}fuerza.webp`} alt="" />
        <p>Doce semanas, tres sesiones a la semana y un plan de comidas que puedas cumplir. Al final medimos juntos lo que ha cambiado.</p>
        <RollLink href="#contacto" label="Me apunto" className="im-pildora" />
      </section>

      <section className="im-bienestar">
        <h2 className="im-gigante">Bienestar.</h2>
        <p>Entrenar no va solo de levantar más: dormir mejor, moverse sin dolor y llegar con energía al final del día.</p>
      </section>

      <section className="im-fama" aria-labelledby="im-fama">
        <h2 className="im-gigante im-gigante--centro" id="im-fama">Muro de la fama</h2>
        <div className="im-fama__fotos">
          {FAMA.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" loading="lazy" className={`im-fama__f${i}`} />
          ))}
        </div>
      </section>

      <Cruza texto="★★★★★ Testimonios" alto={180} />
      <TestimonialSection
        kicker=""
        title=""
        align="left"
        rating={4.85}
        count={63}
        source="Google"
        distribution="5:58, 4:4, 3:1, 2:0, 1:0"
        avatars={false}
        presentation="plain"
        variant="minimal"
        className="im-testimonios"
        items={"Tomás es un coach estupendo, siempre pendiente durante los ejercicios para corregirte y explicar por qué.|Rocío Ávila|Clienta desde 2023\nMe ayudó a recuperar la forma después de una lesión de rodilla. Lo recomiendo sin dudar.|Susana Vega|Entrenamiento personal\nRecomiendo Impulso al 1000 %: sesiones variadas y exigentes, y un trato cercano.|Sonia Cruz|Duo Training"}
      />

      <section className="im-tarifas" id="tarifas">
        <p className="im-etiqueta">Fórmulas de entrenamiento</p>
        <h2 className="im-gigante im-gigante--gris">Tarifas</h2>
        <PricingSection
          kicker=""
          title=""
          subtitle=""
          layout="grid"
          cardLayout="compact"
          highlight="border"
          planCase="none"
          marker="check"
          badge=""
          variant="minimal"
          cta="Reservar"
          className="im-precios"
          plans={"Coach privado|95 €|/ sesión|no|12 sesiones · 95 € la sesión;24 sesiones · 90 € la sesión;36 sesiones · 85 € la sesión\nDuo Training|120 €|/ sesión|no|12 sesiones · 120 € la sesión;24 sesiones · 110 € la sesión;Para dos personas\nPack Impulso|1.950 €|/ 3 meses|si|32 sesiones;Plan nutricional incluido;Seguimiento a distancia\nNutrición|90 €|/ consulta|no|Análisis detallado;Evaluación del estado de salud;Plan nutricional a medida\nConsulta|65 €|/ consulta|no|Ajuste del plan;Motivación y apoyo;Revisión de resultados\nSeguimiento a distancia|A medida||no|Programa personalizado;Vídeos de ejercicios;Explicación de los ejercicios"}
        />
      </section>

      <FAQSection
        kicker="Preguntas frecuentes"
        title=""
        layout="split"
        presentation="lines"
        align="left"
        defaultOpen={-1}
        variant="minimal"
        className="im-faq"
        items={"¿Cómo empieza el servicio?|Con una sesión de prueba: hablamos de tus objetivos, medimos y probamos el estudio.\n¿Qué hacéis con un cliente nuevo?|Valoración de movilidad y fuerza, historial de lesiones y un plan de cuatro semanas para empezar.\n¿Qué formación tenéis?|Grado en Ciencias del Deporte, diplomado en Nutrición Deportiva y certificaciones de entrenamiento funcional.\n¿Cuánto se tarda en ver resultados?|Entre cuatro y seis semanas para notar cambios, y doce para medirlos con claridad.\n¿Con qué tipo de clientes trabajáis?|Desde quien empieza de cero hasta deportistas que preparan una competición.\n¿Qué debería saber antes de la primera sesión?|Ven con ropa cómoda, agua y, si tienes, informes médicos recientes."}
      />

      <section className="im-contacto" id="contacto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${C}equipo/dani.webp`} alt="" />
        <p>No dudes en escribirnos para cualquier pregunta o información.</p>
        <RollLink href="mailto:hola@impulso.example" label="hola@impulso.example" className="im-pildora" />
      </section>

      <section className="im-insta" aria-label="Instagram">
        <p className="im-etiqueta">Síguenos en Instagram @impulso.fitness</p>
        <div>
          {[...FAMA, `${C}local.webp`, `${F}sala.webp`].map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </div>
      </section>

      <footer className="im-pie">
        <span>+34 600 000 000</span>
        <RollLink href="#contacto" label="Me apunto al reto" className="im-pildora" />
        <span>hola@impulso.example</span>
      </footer>
    </div>
  );
}
