"use client";

import type { CSSProperties } from "react";
import FAQSection from "@/components/ui/FAQSection";
import LogoCloud from "@/components/ui/LogoCloud";
import ProductCard from "@/components/ui/ProductCard";
import RollLink from "@/components/ui/RollLink";
import { DISCIPLINAS, EVENTOS, TIENDA } from "./data";
import { loboHref } from "./enlaces";
import { HorarioLobo } from "./HorarioLobo";

/*
 * Portada de Lobo Gym: réplica de Fenriz Gym (docs/50 §3.4); cabecera, menú, pie y demás páginas en Sitio.tsx (docs/56), artes marciales en un barrio. Blanco y negro con un solo degradado de
 * marca (amarillo, rojo, azul) en franjas y subrayados; condensada gruesa en mayúsculas y una sans fina; disciplinas en
 * tarjetas de retrato B/N con el nombre encima, la clase de prueba, los eventos en carteles a duotono, el horario de la
 * semana (ClassSchedule) y el menú que cae desde «MENÚ ≡».
 */

/** banda de foto a sangre en B/N entre secciones, como las de Fenriz */
const Banda = ({ src }: { src: string }) => (
  <div className="lb-banda" aria-hidden>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt="" loading="lazy" />
  </div>
);



export default function Lobo() {
  return (
    <>

      <section className="lb-hero" id="inicio">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/inspiraciones/lobo/portada.webp`} alt="Entrenamiento en grupo en el gimnasio" />
        <div className="lb-hero__txt">
          <h1>ARTES MARCIALES.<br />DESDE VALLECAS.<br />CON CARIÑO.</h1>
          <p>Ven a entrenar con nosotros en el corazón de Vallecas. Te espera una comunidad estupenda con entrenadores que saben. Juntos sacamos lo mejor de ti.</p>
          <RollLink fade href={loboHref("clases")} label="Ver las clases" className="lb-boton" />
        </div>
        <i className="lb-franja" aria-hidden />
      </section>

      <section className="lb-clases" id="clases">
        <h2 className="lb-sub">NUESTRAS CLASES</h2>
        <p>En más de 1.500 m² tienes de todo: deportes de combate, fitness y recuperación. Tú decides: artes marciales mixtas, Muay Thai, BJJ, boxeo o lucha. Seas principiante o competidor con ambición, tenemos tu clase.</p>
        <div className="lb-disciplinas">
          {DISCIPLINAS.map((d) => (
            <a key={d.n} href={loboHref(`clases/${d.id}`)} className="lb-disc">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.img} alt="" loading="lazy" />
              <span>{d.n}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="lb-prueba" id="prueba">
        <div>
          <h2>CLASE DE PRUEBA</h2>
          <p>Reserva una clase de prueba gratis o apúntate a uno de nuestros cursos de iniciación. En la página de la clase de prueba te contamos cómo funciona.</p>
          <RollLink fade href={loboHref("prueba")} label="Más sobre la prueba" className="lb-boton" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/inspiraciones/lobo/prueba.webp`} alt="" loading="lazy" />
      </section>

      <Banda src={`/img/inspiraciones/lobo/banda-1.webp`} />
      <section className="lb-nosotros" id="nosotros">
        <h2 className="lb-sub">SOBRE NOSOTROS</h2>
        <p>Abrimos en 2010 y desde entonces estamos en la plaza de Vallecas. Empezamos como gimnasio de MMA y con los años nos hemos convertido en la casa de muchos deportes de combate, con foco en MMA, BJJ y Muay Thai.</p>
        <p>Siete días a la semana, el equipo y la comunidad llenan más de 140 clases, y en los tatamis grandes hay sitio para entrenar por tu cuenta o hacer sparring con amigos.</p>
        <RollLink fade href={loboHref("contacto")} label="Saber más" className="lb-boton lb-boton--negro" />
        <ul className="lb-federaciones" aria-label="Federaciones"><li>FEDERACIÓN DE MUAY THAI</li><li>LIGA MMA</li><li>COPA BJJ</li></ul>
        <LogoCloud label="Nuestros socios" brands="Federación Madrileña, GEMMAF, AMMAG" variant="minimal" className="lb-socios" />
      </section>
      <Banda src={`/img/inspiraciones/lobo/banda-2.webp`} />

      <section className="lb-eventos" id="eventos">
        <h2 className="lb-sub">EVENTOS</h2>
        <p>Seminarios con luchadoras y luchadores de aquí y de fuera y torneos de todas las disciplinas: siempre hay algo en el calendario.</p>
        <div className="lb-carteles">
          {EVENTOS.map((e) => (
            <article key={e.id} style={{ "--tono": e.tono } as CSSProperties}>
              <div className="lb-cartel">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/img/inspiraciones/lobo/cartel.webp`} alt="" loading="lazy" />
                <b>{e.titulo}</b>
              </div>
              <small>{e.dia}</small>
              <p>{e.texto}</p>
              <RollLink fade href={loboHref(`eventos/${e.id}`)} label="Apúntate" className="lb-boton" />
            </article>
          ))}
        </div>
      </section>

      <section className="lb-horario" id="horario">
        <h2 className="lb-sub">HORARIO</h2>
        <HorarioLobo />
      </section>

      <Banda src={`/img/inspiraciones/lobo/banda-3.webp`} />
      <section className="lb-faq" id="contacto">
        <div>
          <h2 className="lb-sub lb-sub--izq">PREGUNTAS Y CONTACTO</h2>
          <p>¿Tienes dudas sobre el gimnasio, las clases, la clase de prueba o la cuota? Mira nuestras preguntas frecuentes o escríbenos.</p>
          <FAQSection kicker="" title="" layout="stack" presentation="lines" align="left" defaultOpen={-1} variant="minimal" className="lb-faq__lista"
            items={"¿Necesito experiencia?|No. Cada disciplina tiene grupos de inicio.\n¿Qué me llevo a la clase de prueba?|Ropa cómoda, agua y ganas; los guantes te los dejamos.\n¿Puedo congelar la cuota?|Sí, hasta dos meses al año por lesión o viaje."} />
          <p className="lb-faq__botones"><RollLink fade href={loboHref("contacto")} label="Escríbenos" className="lb-boton" /><RollLink fade href="mailto:hola@lobo.example" label="E-mail" className="lb-boton" /><RollLink fade href={loboHref("contacto?asunto=colaboracion")} label="Colaboraciones" className="lb-boton" /></p>
        </div>
        <div className="lb-mapa" aria-label="Mapa: Plaza de Vallecas 5"><i aria-hidden /></div>
      </section>

      <section className="lb-tienda" id="tienda">
        <h2 className="lb-sub">TIENDA</h2>
        <p>Ropa y material del Lobo: entrena con la camiseta del barrio.</p>
        <div className="lb-tienda__rejilla">
          {TIENDA.map((t) => (
            <ProductCard key={t.id} title={t.title} price={t.price} image={t.image} meta="Lobo Gym" ratio="1 / 1" href={loboHref(`tienda/${t.id}`)} variant="minimal" />
          ))}
        </div>
        <RollLink fade href={loboHref("tienda")} label="A la tienda" className="lb-boton lb-boton--negro" />
      </section>

    </>
  );
}
