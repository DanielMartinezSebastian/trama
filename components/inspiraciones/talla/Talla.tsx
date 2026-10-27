"use client";

import { useState } from "react";
import ContactForm from "@/components/ui/ContactForm";
import Marquee from "@/components/ui/Marquee";
import PricingSection from "@/components/ui/PricingSection";
import { OFERTA } from "./data";
import { tallaHref } from "./enlaces";

/*
 * Portada de Talla Fitness: réplica de Skulpt Fitness (docs/50 §3.4); cabecera, menú, pie y demás páginas en Sitio.tsx
 * (docs/56), un gimnasio de barrio sin florituras. Gris claro, casi negro y
 * lima; condensada gruesa en mayúsculas y una sans neutra; bordes de sección curvos, humor, la clase de prueba gratis
 * siempre a la vista, una cinta lima (Marquee), la oferta numerada, planes con conmutador mes/año (PricingSection) y el
 * menú a pantalla completa en columnas con la palabra girada.
 */



export default function Talla() {
  const [of, setOf] = useState(0);

  return (
    <>

      <section className="tl-hero" id="inicio">
        <h1>ENTRENA HOY.<br />CRECE MAÑANA.</h1>
        <p>Talla Fitness es el sitio de Carabanchel para cumplir tus objetivos. En el corazón del barrio, la opción ideal para quien vive aquí y para quien viene de fuera con ganas de entrenar.</p>
        <a href="#foto" className="tl-flecha" aria-label="Bajar">↓</a>
      </section>
      <div className="tl-foto" id="foto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/inspiraciones/talla/portada-sala.webp`} alt="La sala del gimnasio con máquinas y barras" />
      </div>

      <section className="tl-oscuro">
        <h2><span>TU SOFÁ ES MUCHO</span><span>MÁS CÓMODO SI</span><span>LLEGAS AGOTADO</span></h2>
        <div className="tl-ventajas">
          {[
            { t: "COACHES CON OFICIO", img: `/img/inspiraciones/talla/coaches.webp` },
            { t: "LA MEJOR MAQUINARIA", img: `/img/inspiraciones/talla/maquinaria.webp` },
            { t: "CAFÉ GRATIS", img: `/img/inspiraciones/talla/cafe.webp` },
          ].map((v) => (
            <figure key={v.t}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.img} alt="" loading="lazy" />
              <figcaption>{v.t}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <Marquee variant="minimal" text="EMPIEZA RÁPIDO. ACABA ANTES." separator=" " rows={1} duration={20} className="tl-cinta" />
      <section className="tl-oscuro tl-incluye">
        <p>Por eso no te contamos lo de siempre sobre ponerte más fuerte. Te sentirás más fuerte, más feliz, más resistente y con más energía. Pero eso no cae del cielo: hay que trabajarlo.</p>
        <ul>
          <li>Maquinaria de primera</li>
          <li>Coaches con experiencia</li>
          <li>Entrena sin límite</li>
          <li>Horario amplio</li>
          <li>Clases en grupo para todos</li>
          <li>Entrenamiento personal y coaching</li>
          <li>Una comunidad de verdad</li>
        </ul>
      </section>

      <section className="tl-oferta">
        <div className="tl-oferta__lista">
          {OFERTA.map((o, i) => (
            <a key={o.t} href={tallaHref(`oferta/${o.id}`)} onPointerEnter={() => setOf(i)} onFocus={() => setOf(i)} className={of === i ? "is-on" : ""}><small>0{i + 1}</small>{o.t}</a>
          ))}
        </div>
        <figure className="tl-oferta__foto" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={OFERTA[of].img} src={OFERTA[of].img} alt="" />
          <b>0{of + 1}</b>
        </figure>
      </section>

      <section className="tl-planes" id="planes">
        <h2>HAZTE SOCIO</h2>
        <PricingSection
          kicker=""
          title=""
          subtitle=""
          plans={"Individual|38 €|/ mes|no|Entrena sin límite;Seguimiento personal;Acceso a las clases en grupo;Planes de entrenamiento gratis;Buena comunidad|La cuota para sacarle todo a tu entreno.|34 €\nFamilia|34 €|/ mes|si|Entrena sin límite;Seguimiento personal;Acceso a las clases en grupo;Planes de entrenamiento gratis;Buena comunidad|Varias personas de la misma casa: descuento familiar. Si sois cuatro, los menores entrenan gratis.|29 €\nEstudiante|29 €|/ mes|no|Entrena sin límite;Seguimiento personal;Acceso a las clases en grupo;Planes de entrenamiento gratis;Buena comunidad|Entre 16 y 25 años y estudiando: hay una cuota para ti.|25 €"}
          toggle="accent"
          highlight="border"
          yearlyPeriod="/ mes, pago anual"
          yearlyNote="ahorra"
          cta="HAZTE SOCIO"
          ctaHref={tallaHref("socio")}
          badge=""
          variant="outline"
          footnote="* Con la cuota anual."
          className="tl-precios"
        />
        <h3>CUOTAS HYROX</h3>
        <div className="tl-hyrox">
          <a href={tallaHref("socio?plan=hyrox-basico")}><b>HYROX BÁSICO</b><p>Entrena en grupos pequeños con nuestros coaches para tu primera carrera.</p><span>40 € / mes</span></a>
          <a href={tallaHref("socio?plan=hyrox-premium")}><b>HYROX PREMIUM</b><p>Grupo pequeño, plan individual y sesión mensual de técnica.</p><span>58 € / mes</span></a>
        </div>
      </section>

      {/* el final de Skulpt: sección oscura de borde curvo con la cinta lima «¿quieres saber más?» y el formulario */}
      <section className="tl-contacto" id="contacto">
        <Marquee variant="minimal" text="¿QUIERES SABER MÁS?" separator=" " rows={1} duration={22} className="tl-contacto__cinta" />
        <div className="tl-contacto__cuerpo">
          <div>
            <p>¿Te apetece pasarte o quieres preguntar algo? Escríbenos y te contamos todo lo que quieras saber, sin compromiso.</p>
            <a href={tallaHref("horario")} className="tl-prueba">Clase de prueba gratis</a>
          </div>
          <ContactForm title="Escríbenos para saber más" subtitle="" submitLabel="Enviar" successMessage="Gracias, te escribimos pronto." variant="minimal" className="tl-form" />
        </div>
      </section>

    </>
  );
}
