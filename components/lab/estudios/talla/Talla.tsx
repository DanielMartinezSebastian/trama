"use client";

import { useEffect, useState } from "react";
import Marquee from "@/components/ui/Marquee";
import OpeningHours from "@/components/ui/OpeningHours";
import PricingSection from "@/components/ui/PricingSection";
import "./talla.css";

/*
 * Talla Fitness: réplica de Skulpt Fitness (docs/50 §3.4), un gimnasio de barrio sin florituras. Gris claro, casi negro y
 * lima; condensada gruesa en mayúsculas y una sans neutra; bordes de sección curvos, humor, la clase de prueba gratis
 * siempre a la vista, una cinta lima (Marquee), la oferta numerada, planes con conmutador mes/año (PricingSection) y el
 * menú a pantalla completa en columnas con la palabra girada.
 */

const F = "/img/forja/";
const C = "/img/cadencia/";

export default function Talla() {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    if (!menu) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [menu]);

  return (
    <div className="tl">
      <header className="tl-head">
        <a href="#inicio" className="tl-logo">TALLA</a>
        <a href="#planes" className="tl-prueba">Clase de prueba gratis</a>
        <button type="button" className="tl-menu-btn" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? "Cerrar" : "Menú"}</button>
      </header>

      <section className="tl-hero" id="inicio">
        <h1>ENTRENA HOY.<br />CRECE MAÑANA.</h1>
        <p>Talla Fitness es el sitio de Carabanchel para cumplir tus objetivos. En el corazón del barrio, la opción ideal para quien vive aquí y para quien viene de fuera con ganas de entrenar.</p>
        <a href="#foto" className="tl-flecha" aria-label="Bajar">↓</a>
      </section>
      <div className="tl-foto" id="foto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${F}sala.webp`} alt="La sala del gimnasio con máquinas y barras" />
      </div>

      <section className="tl-oscuro">
        <h2><span>TU SOFÁ ES MUCHO</span><span>MÁS CÓMODO SI</span><span>LLEGAS AGOTADO</span></h2>
        <div className="tl-ventajas">
          {[
            { t: "COACHES CON OFICIO", img: `${C}equipo/dani.webp` },
            { t: "LA MEJOR MAQUINARIA", img: `${F}fuerza.webp` },
            { t: "CAFÉ GRATIS", img: `${C}local.webp` },
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
        {["FITNESS", "ENTRENAMIENTO PERSONAL", "CLASES EN GRUPO"].map((o, i) => (
          <a key={o} href="#planes"><small>0{i + 1}</small>{o}</a>
        ))}
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
          cta="MÁS INFORMACIÓN"
          badge=""
          variant="outline"
          footnote="* Con la cuota anual."
          className="tl-precios"
        />
        <h3>CUOTAS HYROX</h3>
        <div className="tl-hyrox">
          <article><b>HYROX BÁSICO</b><p>Entrena en grupos pequeños con nuestros coaches para tu primera carrera.</p><span>40 € / mes</span></article>
          <article><b>HYROX PREMIUM</b><p>Grupo pequeño, plan individual y sesión mensual de técnica.</p><span>58 € / mes</span></article>
        </div>
      </section>

      <footer className="tl-pie">
        <OpeningHours title="Horario" hours={"L-V|06:00-23:00\nS-D|08:00-21:00"} variant="minimal" />
        <div><p>hola@talla.example<br />910 000 000<br />Calle de Oca 72<br />28025 Madrid</p></div>
      </footer>

      <div className={`tl-menu ${menu ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menú" aria-hidden={!menu} inert={!menu}>
        <a href="#inicio" className="tl-logo">TALLA</a>
        <nav aria-label="Principal" onClick={() => setMenu(false)}>
          <a href="#planes"><span>OFERTA</span></a>
          <a href="#inicio"><span>NOSOTROS</span></a>
          <a href="#planes"><span>CONTACTO</span></a>
        </nav>
        <div className="tl-menu__datos">
          <p>hola@talla.example<br />910 000 000<br />Calle de Oca 72<br />28025 Madrid</p>
          <p><b>HORARIO</b><br />Lunes a viernes: 06:00 – 23:00<br />Sábado y domingo: 08:00 – 21:00</p>
          <p><b>HORARIO CON PERSONAL</b><br />Lunes a viernes: 08:00 – 22:00<br />Sábado y domingo: 09:00 – 13:00</p>
        </div>
        <button type="button" className="tl-menu-btn tl-menu__cerrar" onClick={() => setMenu(false)}>Cerrar</button>
      </div>
    </div>
  );
}
