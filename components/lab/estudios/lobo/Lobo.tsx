"use client";

import { useState, type CSSProperties } from "react";
import ClassSchedule from "@/components/ui/ClassSchedule";
import FAQSection from "@/components/ui/FAQSection";
import LogoCloud from "@/components/ui/LogoCloud";
import ProductCard from "@/components/ui/ProductCard";
import RollLink from "@/components/ui/RollLink";
import "./lobo.css";

/*
 * Lobo Gym: réplica de Fenriz Gym (docs/50 §3.4), artes marciales en un barrio. Blanco y negro con un solo degradado de
 * marca (amarillo, rojo, azul) en franjas y subrayados; condensada gruesa en mayúsculas y una sans fina; disciplinas en
 * tarjetas de retrato B/N con el nombre encima, la clase de prueba, los eventos en carteles a duotono, el horario de la
 * semana (ClassSchedule) y el menú que cae desde «MENÚ ≡».
 */

const F = "/img/forja/";
const DISCIPLINAS = [
  { n: "Muay Thai", img: `${F}cardio.webp` },
  { n: "BJJ", img: `${F}movilidad.webp` },
  { n: "MMA", img: `${F}equipo/dani.webp` },
  { n: "Boxeo", img: `${F}equipo/nico.webp` },
  { n: "Fitness", img: `${F}pesado.webp` },
  { n: "Recuperación", img: `${F}recovery.webp` },
];
/** banda de foto a sangre en B/N entre secciones, como las de Fenriz */
const Banda = ({ src }: { src: string }) => (
  <div className="lb-banda" aria-hidden>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt="" loading="lazy" />
  </div>
);

const TIENDA = [
  { title: "Camiseta Lobo", price: 25, image: `${F}equipo/nico.webp` },
  { title: "Sudadera Lobo", price: 55, image: `${F}equipo/dani.webp` },
  { title: "Gorra Lobo", price: 20, image: `${F}tecnica.webp` },
  { title: "Bolsa de deporte", price: 45, image: `${F}pesado.webp` },
];

const EVENTOS = [
  { dia: "Sábados", titulo: "Sparring de boxeo con Luciano", texto: "Sparring de boxeo para gente con experiencia.", tono: "#4b1fd1" },
  { dia: "Domingos", titulo: "Sparring de Muay Thai", texto: "Sparring de Muay Thai para avanzados.", tono: "#c7a400" },
  { dia: "Domingos", titulo: "Open mat de BJJ", texto: "Esterilla abierta de grappling y BJJ.", tono: "#1747c9" },
];
const HORARIO = "07:00|Muay Thai inicio|60|Muay Thai|Inicio|Rocío|Tatami 1|20|12|1,3,5\n09:30|BJJ técnica|75|BJJ|Todos|Bruno|Tatami 2|16|9|2,4\n12:00|Fitness|45|Fitness|Todos|Dani|Sala|14|6|1,2,3,4,5\n18:00|MMA|90|MMA|Intermedio|Iván|Jaula|16|16|1,3,5\n19:30|Boxeo|60|Boxeo|Todos|Luciano|Ring|20|15|1,2,3,4,5\n20:30|Recuperación|45|Recuperación|Todos|Nico|Sala|12|3|2,4\n11:00|Open mat|120|BJJ|Avanzado|Bruno|Tatami 2|24|10|0\n10:00|Muay Thai sparring|90|Muay Thai|Avanzado|Rocío|Ring|20|8|6,0\n12:00|Boxeo en familia|60|Boxeo|Inicio|Luciano|Ring|20|11|6";

export default function Lobo() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="lb">
      <header className="lb-head">
        <a href="#inicio" className="lb-logo">LOBO</a>
        <span className="lb-idioma"><b>ES</b> EN</span>
        <button type="button" className="lb-menu-btn" aria-expanded={menu} onClick={() => setMenu(!menu)}>MENÚ <span aria-hidden>{menu ? "✕" : "≡"}</span></button>
        <div className={`lb-menu ${menu ? "is-open" : ""}`} aria-hidden={!menu} inert={!menu}>
          <nav aria-label="Principal" onClick={() => setMenu(false)}>
            <a href="#clases">Clases</a>
            <a href="#eventos">Eventos</a>
            <a href="#horario">Precios</a>
            <a href="#horario">Horario</a>
            <a href="#nosotros">Sobre nosotros</a>
          </nav>
          <div className="lb-menu__sec"><a href="#horario">Socios</a><a href="#horario">Tienda</a><a href="#horario">Ayuda</a></div>
          <a href="#prueba" className="lb-boton lb-boton--borde" onClick={() => setMenu(false)}>Clase de prueba</a>
        </div>
      </header>

      <section className="lb-hero" id="inicio">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${F}grupo.webp`} alt="Entrenamiento en grupo en el gimnasio" />
        <div className="lb-hero__txt">
          <h1>ARTES MARCIALES.<br />DESDE VALLECAS.<br />CON CARIÑO.</h1>
          <p>Ven a entrenar con nosotros en el corazón de Vallecas. Te espera una comunidad estupenda con entrenadores que saben. Juntos sacamos lo mejor de ti.</p>
          <RollLink href="#clases" label="Ver las clases" className="lb-boton" />
        </div>
        <i className="lb-franja" aria-hidden />
      </section>

      <section className="lb-clases" id="clases">
        <h2 className="lb-sub">NUESTRAS CLASES</h2>
        <p>En más de 1.500 m² tienes de todo: deportes de combate, fitness y recuperación. Tú decides: artes marciales mixtas, Muay Thai, BJJ, boxeo o lucha. Seas principiante o competidor con ambición, tenemos tu clase.</p>
        <div className="lb-disciplinas">
          {DISCIPLINAS.map((d) => (
            <a key={d.n} href="#horario" className="lb-disc">
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
          <RollLink href="#horario" label="Más sobre la prueba" className="lb-boton" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${F}tecnica.webp`} alt="" loading="lazy" />
      </section>

      <Banda src={`${F}grupo.webp`} />
      <section className="lb-nosotros" id="nosotros">
        <h2 className="lb-sub">SOBRE NOSOTROS</h2>
        <p>Abrimos en 2010 y desde entonces estamos en la plaza de Vallecas. Empezamos como gimnasio de MMA y con los años nos hemos convertido en la casa de muchos deportes de combate, con foco en MMA, BJJ y Muay Thai.</p>
        <p>Siete días a la semana, el equipo y la comunidad llenan más de 140 clases, y en los tatamis grandes hay sitio para entrenar por tu cuenta o hacer sparring con amigos.</p>
        <RollLink href="#nosotros" label="Saber más" className="lb-boton lb-boton--negro" />
        <ul className="lb-federaciones" aria-label="Federaciones"><li>FEDERACIÓN DE MUAY THAI</li><li>LIGA MMA</li><li>COPA BJJ</li></ul>
        <LogoCloud label="Nuestros socios" brands="Federación Madrileña, GEMMAF, AMMAG" variant="minimal" className="lb-socios" />
      </section>
      <Banda src={`${F}tecnica.webp`} />

      <section className="lb-eventos" id="eventos">
        <h2 className="lb-sub">EVENTOS</h2>
        <p>Seminarios con luchadoras y luchadores de aquí y de fuera y torneos de todas las disciplinas: siempre hay algo en el calendario.</p>
        <div className="lb-carteles">
          {EVENTOS.map((e) => (
            <article key={e.titulo} style={{ "--tono": e.tono } as CSSProperties}>
              <div className="lb-cartel">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${F}cardio.webp`} alt="" loading="lazy" />
                <b>{e.titulo}</b>
              </div>
              <small>{e.dia}</small>
              <p>{e.texto}</p>
              <RollLink href="#eventos" label="Más información" className="lb-boton" />
            </article>
          ))}
        </div>
      </section>

      <section className="lb-horario" id="horario">
        <h2 className="lb-sub">HORARIO</h2>
        <ClassSchedule classes={HORARIO} layout="week" filters="category" variant="minimal" className="lb-semana" />
      </section>

      <Banda src={`${F}movilidad.webp`} />
      <section className="lb-faq" id="contacto">
        <div>
          <h2 className="lb-sub lb-sub--izq">PREGUNTAS Y CONTACTO</h2>
          <p>¿Tienes dudas sobre el gimnasio, las clases, la clase de prueba o la cuota? Mira nuestras preguntas frecuentes o escríbenos.</p>
          <FAQSection kicker="" title="" layout="stack" presentation="lines" align="left" defaultOpen={-1} variant="minimal" className="lb-faq__lista"
            items={"¿Necesito experiencia?|No. Cada disciplina tiene grupos de inicio.\n¿Qué me llevo a la clase de prueba?|Ropa cómoda, agua y ganas; los guantes te los dejamos.\n¿Puedo congelar la cuota?|Sí, hasta dos meses al año por lesión o viaje."} />
          <p className="lb-faq__botones"><RollLink href="#contacto" label="Escríbenos" className="lb-boton" /><RollLink href="#contacto" label="E-mail" className="lb-boton" /><RollLink href="#contacto" label="Colaboraciones" className="lb-boton" /></p>
        </div>
        <div className="lb-mapa" aria-label="Mapa: Plaza de Vallecas 5"><i aria-hidden /></div>
      </section>

      <section className="lb-tienda" id="tienda">
        <h2 className="lb-sub">TIENDA</h2>
        <p>Ropa y material del Lobo: entrena con la camiseta del barrio.</p>
        <div className="lb-tienda__rejilla">
          {TIENDA.map((t) => (
            <ProductCard key={t.title} {...t} meta="Lobo Gym" ratio="1 / 1" href="#tienda" variant="minimal" />
          ))}
        </div>
        <RollLink href="#tienda" label="A la tienda" className="lb-boton lb-boton--negro" />
      </section>

      <footer className="lb-pie">
        <i className="lb-franja" aria-hidden />
        <strong className="lb-logo">LOBO</strong>
        <div className="lb-pie__cols">
          <div><b>DIRECCIÓN</b><p>Lobo Gym<br />Plaza de Vallecas 5<br />28031 Madrid</p></div>
          <div><b>HORARIO</b><p>L-V 07:00 – 23:00<br />Sábado 10:00 – 20:00<br />Domingo 10:00 – 17:00</p></div>
          <div><b>SÍGUENOS</b><p>Instagram · Facebook · YouTube</p></div>
        </div>
        <nav aria-label="Pie"><a href="#clases">Clases</a><a href="#eventos">Eventos</a><a href="#horario">Precios</a><a href="#horario">Horario</a><a href="#nosotros">Sobre nosotros</a><a href="#tienda">Tienda</a></nav>
        <small>Aviso legal · Privacidad · © 2026 Lobo Gym</small>
      </footer>
    </div>
  );
}
