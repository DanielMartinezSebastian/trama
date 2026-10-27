"use client";

import CohortList, { type CohortProgram } from "@/components/ui/CohortList";
import { Montserrat, Permanent_Marker } from "next/font/google";
import "./oficio.css";

// letras propias de esta réplica, no del kit: Magic Brush (de pago) → Permanent Marker, rotulador de trazo seco con el
// espaciado abierto de Honhar; Montserrat como el original (docs/cuaderno/replica-oficio.md)
const brocha = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--of-marker", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--of-montserrat", display: "swap" });

/*
 * Oficio, instituto de formación práctica: réplica de Honhar (docs/50 §3.6). Neobrutalismo amarillo: recuadros con borde,
 * botones blancos con sombra negra desplazada, titulares de brocha en mayúsculas; la pizarra de la portada con sus
 * personajes, sellos de valoración, cifras en recuadros, principios con la palabra tachada, programas por promoción en
 * tarjetas (CohortList), talleres, «lanzamos pronto», la masterclass gratis y los resultados.
 */

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
    <div className={`of ${brocha.variable} ${montserrat.variable}`}>
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
          <img src={`/img/inspiraciones/oficio/fila-alumno.webp`} alt="" />
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
        <img src={`/img/inspiraciones/oficio/masterclass.webp`} alt="" />
      </section>

      <section className="of-resultados" id="resultados">
        <h2>100+ ALUMNOS FORMADOS EN LOS CURSOS DE OFICIO</h2>
        <ul>
          <li>→ <b>22</b> alumnos han montado su propia empresa</li>
          <li>→ Casi <b>15</b> se han hecho autónomos y ya entregan proyectos</li>
          <li>→ Unos cuantos se han ido a trabajar fuera y otros lo aplican en el negocio familiar</li>
        </ul>
        <div className="of-videos">
          {[`/img/inspiraciones/oficio/testimonio-1.webp`, `/img/inspiraciones/oficio/testimonio-2.webp`, `/img/inspiraciones/oficio/testimonio-3.webp`, `/img/inspiraciones/oficio/testimonio-4.webp`, `/img/inspiraciones/oficio/testimonio-5.webp`].map((src, i) => (
            <figure key={src} style={{ marginTop: i % 2 ? 30 : 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" />
              <span aria-hidden>▶</span>
            </figure>
          ))}
        </div>
        <a href="#programas" className="of-boton">Fórmate con Oficio →</a>
      </section>

      {/* el final de Honhar: la presencia en eventos (en negro), «sé mentor», «aprendizaje sin límites», el lema con las dos
          señales y el pie oscuro con el mapa */}
      <section className="of-presencia">
        <div>
          <small>Nos movemos</small>
          <h2>HEMOS ESTADO PRESENTES EN</h2>
          <ul><li>Foro de Empleo Digital, Madrid (2025)</li><li>Semana del Emprendimiento, Valencia (2025)</li><li>Congreso de Marketing, Sevilla (2024)</li><li>Feria de Formación Profesional, Bilbao (2024)</li></ul>
          <a href="#contacto" className="of-boton">Invítanos a tu evento →</a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/inspiraciones/oficio/eventos.webp" alt="" loading="lazy" />
      </section>

      <section className="of-mentor">
        <div>
          <h2>SÉ MENTOR EN OFICIO</h2>
          <ul><li>Nos gusta formar a quien forma a otros</li><li>Mezclamos creatividad y método</li><li>Traemos lo mejor del sector a clase</li><li>Compartimos lo que aprendemos</li></ul>
          <a href="#contacto" className="of-boton">Empieza tu curso con Oficio →</a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/inspiraciones/oficio/mentores.webp" alt="El equipo de mentores de Oficio" loading="lazy" />
      </section>

      <section className="of-sinlimite">
        <h2>APRENDIZAJE SIN LÍMITES</h2>
        <div>
          <article><h3>SOMOS DISTINTOS</h3><ul><li>100 % aprendizaje práctico</li><li>Atención uno a uno</li><li>Aprendizaje estructurado</li><li>Debates en grupo</li><li>Preparación de entrevistas</li><li>Contactos del sector</li><li>Charlas de emprendedores</li></ul><a href="#contacto" className="of-boton">Síguenos en LinkedIn →</a></article>
          <article className="of-sinlimite__negra"><h3>NOS HACEMOS OÍR</h3><p>Lo que pasa en clase lo contamos en redes: proyectos, visitas y alumnos que ya trabajan.</p><a href="#contacto" className="of-boton">Síguenos en Instagram →</a></article>
        </div>
      </section>

      <section className="of-lema" aria-label="Nuestro lema">
        <p className="of-lema__frase">NO REPARTIMOS TEORÍA, REPARTIMOS <mark>OFICIO</mark>.</p>
        <span className="of-lema__fondo" aria-hidden>Inscríbete</span>
        <span className="of-senal of-senal--izq">PROFESORES: PARA ENSEÑAR OFICIO</span>
        <span className="of-senal of-senal--der">ALUMNOS: PARA APRENDERLO</span>
      </section>

      <footer className="of-pie">
        <div className="of-pie__mapa" aria-label="Mapa: Calle del Oficio 12, Madrid"><i aria-hidden /></div>
        <div><b>OFICIO</b><a href="#historia">Nuestra historia</a><a href="#contacto">Sé mentor</a><a href="#programas">Inscríbete</a></div>
        <div><b>LEGAL</b><a href="#inicio">Condiciones</a><a href="#inicio">Privacidad</a><a href="#inicio">Trae a un amigo</a></div>
        <div id="contacto"><b>CONTACTO</b><span>Cursos e inscripciones: 910 000 000</span><span>Colaboraciones y eventos: 910 000 001</span><span>Empresas y centros: hola@oficio.example</span></div>
        <small>© 2026 Oficio · Calle del Oficio 12, Madrid</small>
      </footer>
    </div>
  );
}
