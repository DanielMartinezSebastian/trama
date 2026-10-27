"use client";

import CohortList, { type CohortProgram } from "@/components/ui/CohortList";
import "./oficio.css";

/*
 * Oficio, instituto de formación práctica: réplica de Honhar (docs/50 §3.6). Neobrutalismo amarillo: recuadros con borde,
 * botones blancos con sombra negra desplazada, titulares de brocha en mayúsculas; la pizarra de la portada con sus
 * personajes, sellos de valoración, cifras en recuadros, principios con la palabra tachada, programas por promoción en
 * tarjetas (CohortList), talleres, «lanzamos pronto», la masterclass gratis y los resultados.
 */

const F = "/img/forja/";
const R = "/img/retratos/";
const PROGRAMAS: CohortProgram[] = [
  { title: "Marketing digital con IA: promoción 12", kicker: "Diseñado con Iota, agencia creativa", formats: ["12 semanas", "9 módulos", "Presencial"], includes: ["Charlas de emprendedores que lo han conseguido", "La guía para montar tu web", "IA para redes sociales", "Clases presenciales y tutorías de dudas", "Campañas reales con presupuesto: prueba tu idea"], status: "soon", href: "#programas", cta: "Solicitar plaza" },
  { title: "Marketing de rendimiento: promoción 1", kicker: "Diseñado con Iota, agencia creativa", formats: ["10 semanas", "8 módulos", "Presencial"], includes: ["Medios de pago desde cero", "Analítica y atribución", "Presupuestos reales"], status: "soon", href: "#programas", cta: "Reservar clase de prueba" },
];
const TALLERES: CohortProgram[] = [
  { title: "Marketing de contenidos", kicker: "Con Iota, estudio de marketing", summary: "Una masterclass interactiva.", status: "soon", href: "#talleres", cta: "Reserva tu sitio en la masterclass" },
  { title: "Canva avanzado con IA", kicker: "Con Susana K. Vera", summary: "Promoción 1.", status: "soon", href: "#talleres", cta: "Reserva tu sitio en la promoción 1" },
];

export default function Oficio() {
  return (
    <div className="of">
      <header className="of-head">
        <a href="#inicio" className="of-logo">OFI<span>C</span>IO</a>
        <nav aria-label="Principal"><a href="#programas">Programas ▾</a><a href="#movimiento">Movimiento</a><a href="#mentores">Mentores</a><a href="#historias">Historias</a><a href="#resultados">Resultados</a></nav>
        <a href="#programas" className="of-boton">Inscríbete</a>
      </header>

      <section className="of-hero" id="inicio">
        <div className="of-pizarra">
          <p>NO REPARTIMOS SABER,<br />REPARTIMOS OFICIO.</p>
          <span className="of-pollito of-pollito--a" aria-hidden><i /></span>
          <span className="of-pollito of-pollito--b" aria-hidden><i /></span>
          <span className="of-pollito of-pollito--c" aria-hidden><i /></span>
          <span className="of-cubo of-cubo--a" aria-hidden>OFICIO</span>
          <span className="of-cubo of-cubo--b" aria-hidden />
        </div>
        <aside className="of-redes" aria-label="Redes"><a href="#inicio">in</a><a href="#inicio">sl</a><a href="#inicio">ig</a></aside>
      </section>

      <section className="of-sellos" aria-label="Valoraciones">
        {[["★ Trustpilot", "4,3"], ["Empleo+", "5"], ["Libro de cursos", "5"], ["Glassdoor", "4,8"], ["Justdial", "4,8"], ["Clutch", "4,5"], ["Coaching", "5"], ["Google", "4,9"]].map(([n, v]) => (
          <div key={n}><b>{n}</b><span>Valoración {v}/5</span></div>
        ))}
        <a href="#historia" className="of-boton of-boton--ancho">Cómo empezó todo →</a>
      </section>

      <section className="of-titular" id="historia">
        <h1>LA ACADEMIA DE <mark>OFICIO PRÁCTICO</mark> MÁS GRANDE DE LA CIUDAD</h1>
        <p><u>Programas útiles y prácticos diseñados por gente del sector que trabaja en ello cada día</u></p>
        <div className="of-fila">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${R}06-man-with-crossed-arms-unsplash.jpg`} alt="" />
          <div className="of-cifras">
            <div><b>625+</b><span>alumnos contentos</span></div>
            <div><b>6</b><span>promociones con éxito</span></div>
            <div><b>17</b><span>masterclasses con éxito</span></div>
          </div>
        </div>
        <ul className="of-principios">
          <li><s>APRENDER</s> Trabaja en campañas reales</li>
          <li><s>LIBROS</s> Formación basada en casos</li>
          <li><s>PANTALLA</s> Trato directo con tus mentores</li>
          <li><s>PROFESORES</s> Gente del sector con experiencia real</li>
        </ul>
        <a href="#historia" className="of-boton">Respaldado por una agencia con éxito →</a>
      </section>

      <section className="of-prensa">
        <h2>COMO EN:</h2>
        <ul><li>TIECON</li><li>PECFEST</li><li>NASSUMMIT</li><li>ANI</li><li>Diario Económico</li><li>AISensy</li></ul>
      </section>

      <section className="of-programas" id="programas">
        <h2>PROGRAMAS ACTUALES Y PRÓXIMOS</h2>
        <CohortList programs={PROGRAMAS} layout="cards" variant="solid" className="of-cohorts" statusLabels={{ soon: "Lanzamos pronto" }} />
      </section>

      <section className="of-programas" id="talleres">
        <h2>PRÓXIMOS TALLERES, MASTERCLASSES Y CURSOS INTENSIVOS</h2>
        <CohortList programs={TALLERES} layout="cards" variant="solid" className="of-cohorts of-cohorts--talleres" statusLabels={{ soon: "Lanzamos pronto" }} />
      </section>

      <section className="of-pronto">
        <h2>¡LANZAMOS PRONTO! <span aria-hidden>⬡</span></h2>
        <p><u>*AHORA MISMO EN PRUEBAS INTERNAS*</u></p>
        <div className="of-pronto__fila">
          {["Diseño gráfico con IA", "Creación de contenido y marketing", "Gestión de personas", "Ventas sin miedo"].map((t, i) => (
            <article key={t} className={i > 1 ? "is-borroso" : ""}><h3>{t}</h3><ul><li>Introducción</li><li>Estrategia en redes</li><li>Creación y anuncios</li><li>Y mucho más…</li></ul><a href="#programas">Reservar ya →</a></article>
          ))}
        </div>
        <a href="#programas" className="of-boton of-boton--ancho">Lanza tu curso con Oficio →</a>
      </section>

      <section className="of-masterclass">
        <div>
          <h2>OFRECEMOS UNA MASTERCLASS GRATIS ANTES DE LANZAR CADA CURSO</h2>
          <p>● 28 masterclasses con éxito &nbsp; ● 1.000+ asistentes</p>
          <a href="#masterclass" className="of-boton">Avísame de la próxima clase →</a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${F}grupo.webp`} alt="" />
      </section>

      <section className="of-resultados" id="resultados">
        <h2>100+ ALUMNOS FORMADOS EN LOS CURSOS DE OFICIO</h2>
        <ul>
          <li>→ <b>22</b> alumnos han montado su propia empresa</li>
          <li>→ Casi <b>15</b> se han hecho autónomos y ya entregan proyectos</li>
          <li>→ Unos cuantos se han ido a trabajar fuera y otros lo aplican en el negocio familiar</li>
        </ul>
        <div className="of-videos">
          {[`${R}04-black-and-white-portrait-unsplash.jpg`, `${R}08-the-misadventures-of-an-ill-spent-youth-unsplash.jpg`, `${R}02-portrait-of-adolescence-unsplash.jpg`, `${R}10-feeling-blue-unsplash.jpg`, `${R}11-shadowed-portrait-unsplash.jpg`].map((src, i) => (
            <figure key={src} style={{ marginTop: i % 2 ? 30 : 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" />
              <span aria-hidden>▶</span>
            </figure>
          ))}
        </div>
        <a href="#programas" className="of-boton">Fórmate con Oficio →</a>
      </section>

      <footer className="of-pie">
        <p>Nos movemos</p>
        <h2>HEMOS ESTADO EN</h2>
        <ul><li>NasSummit, Bilbao</li><li>Tiecon 2023, Valencia</li><li>Conferencia de afiliados, Málaga</li><li>Pecfest 2024, Sevilla</li></ul>
        <a href="#inicio" className="of-boton">Invítanos a tu evento →</a>
      </footer>
    </div>
  );
}
