"use client";

import { useState, type CSSProperties } from "react";
import ClassSchedule from "@/components/ui/ClassSchedule";
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
          <a href="#clases" className="lb-boton">Ver las clases</a>
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
          <a href="#horario" className="lb-boton">Más sobre la prueba</a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${F}tecnica.webp`} alt="" loading="lazy" />
      </section>

      <section className="lb-nosotros" id="nosotros">
        <h2 className="lb-sub">SOBRE NOSOTROS</h2>
        <p>Abrimos en 2010 y desde entonces estamos en la plaza de Vallecas. Empezamos como gimnasio de MMA y con los años nos hemos convertido en la casa de muchos deportes de combate, con foco en MMA, BJJ y Muay Thai.</p>
        <p>Siete días a la semana, el equipo y la comunidad llenan más de 140 clases, y en los tatamis grandes hay sitio para entrenar por tu cuenta o hacer sparring con amigos.</p>
        <a href="#nosotros" className="lb-boton lb-boton--negro">Saber más</a>
        <ul className="lb-federaciones" aria-label="Federaciones"><li>FEDERACIÓN DE MUAY THAI</li><li>LIGA MMA</li><li>COPA BJJ</li></ul>
      </section>

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
              <a href="#eventos" className="lb-boton">Más información</a>
            </article>
          ))}
        </div>
      </section>

      <section className="lb-horario" id="horario">
        <h2 className="lb-sub">HORARIO</h2>
        <ClassSchedule classes={HORARIO} layout="week" filters="category" variant="minimal" className="lb-semana" />
      </section>

      <footer className="lb-pie">
        <i className="lb-franja" aria-hidden />
        <div><strong className="lb-logo">LOBO</strong><p>Plaza de Vallecas 5<br />28031 Madrid</p></div>
        <div><p>Lunes a domingo<br />07:00 – 23:00</p></div>
        <div><p>hola@lobo.example<br />Instagram · YouTube</p></div>
      </footer>
    </div>
  );
}
