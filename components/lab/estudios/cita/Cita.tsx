"use client";

import { useState } from "react";
import DeviceMockup from "@/components/ui/DeviceMockup";
import FAQSection from "@/components/ui/FAQSection";
import QRCode from "@/components/ui/QRCode";
import ScrollExpand from "@/components/ui/ScrollExpand";
import SmoothScroll from "@/components/ui/SmoothScroll";
import "./cita.css";

/*
 * Cita Barbers: réplica de Rendezvous (docs/50 §3.2). Naranja y negro, serif de titulares con la cursiva para el énfasis,
 * datos en máquina de escribir; un vídeo que crece con el scroll (ScrollExpand), «Locales» y «Clientes» como palabras
 * gigantes, los locales en retratos con «+», reseñas en B/N, la app en un móvil (DeviceMockup) y «Descárgala» con su QR.
 */

const LOCALES = [
  { nombre: "Malasaña", img: "/img/retratos/06-man-with-crossed-arms-unsplash.jpg", dir: "Calle del Pez 21", horas: "L–V 9:00–21:00 · S 9:00–19:00" },
  { nombre: "Chamberí", img: "/img/retratos/07-gray-haired-man-portrait-unsplash.jpg", dir: "Calle de Fuencarral 140", horas: "L–S 10:00–20:00" },
  { nombre: "Lavapiés", img: "/img/retratos/08-the-misadventures-of-an-ill-spent-youth-unsplash.jpg", dir: "Calle del Ave María 9", horas: "L–V 10:00–21:00" },
  { nombre: "Salamanca", img: "/img/esparta/equipo/ivan.webp", dir: "Calle de Goya 33", horas: "L–S 9:00–20:00" },
  { nombre: "Chueca", img: "/img/esparta/equipo/hugo.webp", dir: "Calle de Hortaleza 70", horas: "L–D 10:00–20:00" },
];

const RESENAS = [
  { nombre: "Samir", img: "/img/esparta/navaja.webp", texto: "He ido tres veces al de Chamberí y cada visita ha sido excepcional. Hugo es un barbero increíble: su técnica es de primera y el trato, de lujo." },
  { nombre: "Ezequiel", img: "/img/esparta/sillon.webp", texto: "Experiencia buenísima. Iván es el mejor de la ciudad. Un local muy bonito, con café y gente amable. No puedo recomendarlo más." },
  { nombre: "Marcos", img: "/img/esparta/corte.webp", texto: "Reservé desde la app en dos minutos, me avisaron un día antes y salí con el degradado que llevaba meses buscando." },
];

const PAPEL = [
  { titulo: "Granos tras el afeitado: cómo evitarlos en la nuca", img: "/img/esparta/navaja.webp" },
  { titulo: "Guía para cuidar la barba con canas", img: "/img/esparta/equipo/bruno.webp" },
  { titulo: "Pomada, cera o pasta: cuál te va", img: "/img/esparta/barba.webp" },
];

export default function Cita() {
  const [r, setR] = useState(0);
  return (
    <div className="ci">
      <SmoothScroll />
      <header className="ci-head">
        <a href="#inicio" className="ci-logo" aria-label="Cita Barbers, inicio">
          <span>CITA</span>
          <svg viewBox="0 0 60 22" aria-hidden><path d="M2 20 L30 6 M58 20 L30 6 M18 4 a4 4 0 1 0 0.1 0 M42 4 a4 4 0 1 0 0.1 0" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
        </a>
        <a href="#app" className="ci-app">Descarga la app ↗</a>
      </header>

      <section className="ci-hero" id="inicio">
        <h1>Barberías de Madrid <em>especializadas en los cortes cortos más actuales</em></h1>
      </section>
      <ScrollExpand length={1.6} from={{ width: "11vw", height: "7vw" }} offset={{ x: "0vw", y: "-30vh" }} inset={20} radius={[4, 14]} className="ci-reel" overlay={<span className="ci-play" aria-hidden>▶</span>}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/esparta/corte.webp" alt="Un barbero trabaja con máquina en un local de madera y azulejo" />
      </ScrollExpand>

      <section className="ci-placer">
        <p className="ci-maquina">No va solo de cortarse el pelo. Va de regalarse un rato a uno mismo en mitad de una semana con prisas.</p>
        <h2><em>Va del gusto de sentirse bien</em></h2>
      </section>

      <section className="ci-locales" id="locales">
        <h2 className="ci-gigante"><em>Locales</em><sup>5</sup></h2>
        <div className="ci-locales__rejilla">
          {LOCALES.map((l) => (
            <details key={l.nombre} className="ci-local">
              <summary>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.img} alt="" loading="lazy" />
                <span><em>{l.nombre}</em><b aria-hidden>+</b></span>
              </summary>
              <p className="ci-maquina">{l.dir}<br />{l.horas}</p>
              <a href="#app" className="ci-boton">Reservar</a>
            </details>
          ))}
        </div>
      </section>

      <section className="ci-frase">
        <h2>Cuando te ves bien, <em>te sientes</em> <em className="ci-naranja">bien</em></h2>
      </section>

      <section className="ci-clientes">
        <h2 className="ci-gigante ci-gigante--asoma"><em>Clientes</em></h2>
        <div className="ci-resenas">
          <div className="ci-flechas">
            <button type="button" aria-label="Anterior" onClick={() => setR((r + RESENAS.length - 1) % RESENAS.length)}>←</button>
            <button type="button" aria-label="Siguiente" onClick={() => setR((r + 1) % RESENAS.length)}>→</button>
          </div>
          {[RESENAS[r], RESENAS[(r + 1) % RESENAS.length]].map((x) => (
            <figure key={x.nombre} className="ci-resena">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.img} alt="" loading="lazy" />
              <figcaption>
                <em className="ci-naranja">{x.nombre}</em>
                <blockquote><p>«{x.texto}»</p></blockquote>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="ci-app-sec" id="app">
        <h2 className="ci-gigante ci-gigante--asoma"><em>Nuestra app</em></h2>
        <div className="ci-app-grid">
          <ol className="ci-pasos">
            <li><b>1</b>Cambia o anula tu cita sin llamar por teléfono.</li>
            <li><b>2</b>Ahorra tiempo: reserva desde cualquier sitio y en cualquier local, rápido y sin líos.</li>
            <li><b>3</b>Recibe recordatorios. Te avisamos antes de tu cita para que no se te pase.</li>
          </ol>
          <DeviceMockup device="phone" platform="ios" className="ci-movil">
            <div className="ci-pantalla">
              <small>Entrar · Registrarse</small>
              <strong>Reserva tu próxima <span>cita</span> en nuestros locales.</strong>
              <div className="ci-pantalla__chips"><span>Cerca</span><span>Buscar</span></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/esparta/local.webp" alt="" />
              <span className="ci-pantalla__local">Chueca · Hortaleza 70</span>
              <span className="ci-pantalla__boton">Reservar</span>
            </div>
          </DeviceMockup>
        </div>
        <div className="ci-descarga">
          <h2><em>Descárgala</em><br /><em>ya</em> <QRCode value="https://cita.example/app" codeSize={110} tone="fg" contrast="theme" quiet={1} className="ci-qr" /></h2>
          <div className="ci-tiendas"><a href="#app">Google Play</a><a href="#app">App Store</a></div>
        </div>
      </section>

      <section className="ci-papel">
        <h2 className="ci-gigante"><em>Papel</em></h2>
        <div className="ci-papel__rejilla">
          {PAPEL.map((p) => (
            <article key={p.titulo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt="" loading="lazy" />
              <h3>{p.titulo}</h3>
            </article>
          ))}
        </div>
      </section>

      {/* en negro, como el final de Rendezvous: preguntas en dos columnas, reserva y el pie con foto */}
      <section className="ci-negro">
        <h2 className="ci-gigante"><em>Preguntas</em></h2>
        <div className="ci-faq">
          <FAQSection kicker="" title="Servicios y condiciones" layout="stack" presentation="lines" align="left" defaultOpen={-1} variant="minimal"
            items={"¿Atendéis sin cita?|Si hay un sillón libre, sí; con la app te aseguras la hora.\n¿Los precios son iguales en todos los locales?|Sí, la carta es la misma en los cinco.\n¿Hay un tiempo mínimo entre citas?|No, pero para mantener un degradado recomendamos volver cada tres semanas.\n¿Me lavan el pelo?|Sí, el lavado va incluido en el corte."} />
          <FAQSection kicker="" title="Reserva y cancelación" layout="stack" presentation="lines" align="left" defaultOpen={-1} variant="minimal"
            items={"¿Qué es el kit de Cita?|Un neceser con cera, peine y aceite de barba que regalamos con el bono de diez cortes.\n¿Qué pasa si no me presento?|La segunda vez sin avisar pedimos una señal para reservar.\n¿Puedo cambiar la cita?|Hasta dos horas antes, desde la app y sin coste.\n¿Cómo cancelo?|En la app, en «Mis citas», o llamando al local."} />
        </div>
        <div className="ci-reserva">
          <h2><em>Reserva ya</em></h2>
          <a href="#app" className="ci-boton">Reservar ↗</a>
          <h2><em>o desde la app</em></h2>
          <p className="ci-maquina">También puedes seguir los mismos pasos en la web. Si ya has reservado con nosotros, tus datos y tu historial te esperan en la app.</p>
        </div>
      </section>

      <footer className="ci-pie">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/esparta/sillon.webp" alt="" />
        <p><em>Sé tu mejor versión</em><br /><em>en Cita</em></p>
        <nav aria-label="Pie">
          <a href="#inicio">Instagram</a><a href="#inicio">Facebook</a><a href="#inicio">LinkedIn</a><a href="#inicio">YouTube</a>
          <a href="#inicio">Política de privacidad</a><a href="#inicio">Condiciones</a><a href="#app">Descarga la app ↗</a>
        </nav>
        <span className="ci-maquina">© Cita Barbers · Madrid</span>
      </footer>
    </div>
  );
}
