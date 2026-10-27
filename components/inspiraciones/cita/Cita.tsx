"use client";

import { useState } from "react";
import DeviceMockup from "@/components/ui/DeviceMockup";
import FAQSection from "@/components/ui/FAQSection";
import QRCode from "@/components/ui/QRCode";
import Reveal from "@/components/ui/Reveal";
import ScrollExpand from "@/components/ui/ScrollExpand";
import { ARTICULOS, LOCALES } from "./data";
import { citaHref } from "./enlaces";

/*
 * Portada de Cita Barbers: réplica de Rendezvous (docs/50 §3.2); la cabecera, el pie y las demás páginas están en
 * Sitio.tsx (docs/56). Naranja y negro, serif de titulares con la cursiva para el énfasis,
 * datos en máquina de escribir; un vídeo que crece con el scroll (ScrollExpand), «Locales» y «Clientes» como palabras
 * gigantes, los locales en retratos con «+», reseñas en B/N, la app en un móvil (DeviceMockup) y «Descárgala» con su QR.
 */


const RESENAS = [
  { nombre: "Samir", img: "/img/inspiraciones/cita/resena-samir.webp", texto: "He ido tres veces al de Chamberí y cada visita ha sido excepcional. Hugo es un barbero increíble: su técnica es de primera y el trato, de lujo." },
  { nombre: "Ezequiel", img: "/img/inspiraciones/cita/resena-ezequiel.webp", texto: "Experiencia buenísima. Iván es el mejor de la ciudad. Un local muy bonito, con café y gente amable. No puedo recomendarlo más." },
  { nombre: "Marcos", img: "/img/inspiraciones/cita/resena-marcos.webp", texto: "Reservé desde la app en dos minutos, me avisaron un día antes y salí con el degradado que llevaba meses buscando." },
];


export default function Cita() {
  const [r, setR] = useState(0);
  const [tienda, setTienda] = useState("");
  return (
    <>
      <section className="ci-hero" id="inicio">
        <Reveal kind="slide" direction="up" distance={60} trigger="mount" duration={0.9}>
          <h1>Barberías de Madrid <em>especializadas en los cortes cortos más actuales</em></h1>
        </Reveal>
      </section>
      <ScrollExpand length={1.6} from={{ width: "11vw", height: "7vw" }} offset={{ x: "0vw", y: "-30vh" }} inset={20} radius={[4, 14]} className="ci-reel" overlay={<span className="ci-play" aria-hidden>▶</span>}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/inspiraciones/cita/video-barbero.webp" alt="Un barbero trabaja con máquina en un local de madera y azulejo" />
      </ScrollExpand>

      <section className="ci-placer">
        <p className="ci-maquina">No va solo de cortarse el pelo. Va de regalarse un rato a uno mismo en mitad de una semana con prisas.</p>
        <Reveal kind="slide" direction="up" distance={60} duration={0.9}><h2><em>Va del gusto de sentirse bien</em></h2></Reveal>
      </section>

      <section className="ci-locales" id="locales">
        <Reveal kind="slide" direction="up" distance={80} duration={0.9}><h2 className="ci-gigante"><em>Locales</em><sup>5</sup></h2></Reveal>
        <div className="ci-locales__rejilla">
          {LOCALES.map((l) => (
            <details key={l.id} className="ci-local">
              <summary>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.img} alt="" loading="lazy" />
                <span><em>{l.name}</em><b aria-hidden>+</b></span>
              </summary>
              <p className="ci-maquina">{l.address}<br />Metro {l.metro}</p>
              <div className="ci-local__acciones">
                <a href={citaHref(`reservar?local=${l.id}`)} className="ci-boton">Reservar</a>
                <a href={citaHref(`locales/${l.id}`)} className="ci-enlace">Ver el local →</a>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="ci-frase">
        <Reveal kind="slide" direction="up" distance={60} duration={0.9}><h2>Cuando te ves bien, <em>te sientes</em> <em className="ci-naranja">bien</em></h2></Reveal>
      </section>

      <section className="ci-clientes">
        <Reveal kind="slide" direction="up" distance={80} duration={0.9}><h2 className="ci-gigante ci-gigante--asoma"><em>Clientes</em></h2></Reveal>
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
        <Reveal kind="slide" direction="up" distance={80} duration={0.9}><h2 className="ci-gigante ci-gigante--asoma"><em>Nuestra app</em></h2></Reveal>
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
              <img src="/img/inspiraciones/cita/reserva-local.webp" alt="" />
              <span className="ci-pantalla__local">Chueca · Hortaleza 70</span>
              <span className="ci-pantalla__boton">Reservar</span>
            </div>
          </DeviceMockup>
        </div>
        <div className="ci-descarga">
          <h2><em>Descárgala</em><br /><em>ya</em> <QRCode value="https://cita.example/app" codeSize={110} tone="fg" contrast="theme" quiet={1} className="ci-qr" /></h2>
          <div className="ci-tiendas">
            <button type="button" onClick={() => setTienda("Google Play")}>Google Play</button>
            <button type="button" onClick={() => setTienda("App Store")}>App Store</button>
          </div>
          {tienda && (
            <p className="ci-aviso" role="status">
              La app de Cita es de demostración y no está en {tienda}. <a href={citaHref("reservar")}>Reserva en la web →</a>
            </p>
          )}
        </div>
      </section>

      <section className="ci-papel">
        <Reveal kind="slide" direction="up" distance={80} duration={0.9}><h2 className="ci-gigante"><em>Papel</em></h2></Reveal>
        <div className="ci-papel__rejilla">
          {ARTICULOS.map((p) => (
            <a key={p.slug} href={citaHref(`revista/${p.slug}`)} className="ci-articulo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt="" loading="lazy" />
              <h3>{p.titulo}</h3>
            </a>
          ))}
        </div>
      </section>

      {/* en negro, como el final de Rendezvous: preguntas en dos columnas, reserva y el pie con foto */}
      <section className="ci-negro">
        <Reveal kind="slide" direction="up" distance={80} duration={0.9}><h2 className="ci-gigante"><em>Preguntas</em></h2></Reveal>
        <div className="ci-faq">
          <FAQSection kicker="" title="Servicios y condiciones" layout="stack" presentation="lines" align="left" defaultOpen={-1} variant="minimal"
            items={"¿Atendéis sin cita?|Si hay un sillón libre, sí; con la app te aseguras la hora.\n¿Los precios son iguales en todos los locales?|Sí, la carta es la misma en los cinco.\n¿Hay un tiempo mínimo entre citas?|No, pero para mantener un degradado recomendamos volver cada tres semanas.\n¿Me lavan el pelo?|Sí, el lavado va incluido en el corte."} />
          <FAQSection kicker="" title="Reserva y cancelación" layout="stack" presentation="lines" align="left" defaultOpen={-1} variant="minimal"
            items={"¿Qué es el kit de Cita?|Un neceser con cera, peine y aceite de barba que regalamos con el bono de diez cortes.\n¿Qué pasa si no me presento?|La segunda vez sin avisar pedimos una señal para reservar.\n¿Puedo cambiar la cita?|Hasta dos horas antes, desde la app y sin coste.\n¿Cómo cancelo?|En la app, en «Mis citas», o llamando al local."} />
        </div>
        <div className="ci-reserva">
          <h2><em>Reserva ya</em></h2>
          <a href={citaHref("reservar")} className="ci-boton">Reservar ↗</a>
          <h2><em>o desde la app</em></h2>
          <p className="ci-maquina">También puedes seguir los mismos pasos en la web. Si ya has reservado con nosotros, tus datos y tu historial te esperan en la app.</p>
        </div>
      </section>

    </>
  );
}
