"use client";

import CohortList from "@/components/ui/CohortList";
import { PROGRAMAS } from "./data";
import { oficioHref } from "./enlaces";

/*
 * Oficio, instituto de formación práctica: réplica de Honhar (docs/50 §3.6). Neobrutalismo amarillo: recuadros con borde,
 * botones blancos con sombra negra desplazada, titulares de brocha en mayúsculas; la pizarra de la portada con sus
 * personajes, sellos de valoración, cifras en recuadros, principios con la palabra tachada, programas por promoción en
 * tarjetas (CohortList), talleres, «lanzamos pronto», la masterclass gratis y los resultados. Cabecera, pie, letras y
 * demás páginas en Sitio.tsx (docs/56).
 */

const ESTADOS = { open: "Inscripción abierta", few: "Últimas plazas", soon: "Lanzamos pronto" };
const RED = { in: "https://www.linkedin.com/", sl: "https://slack.com/", ig: "https://www.instagram.com/" };

export default function Oficio() {
  return (
    <>
      <section className="of-hero" id="inicio">
        <div className="of-pizarra">
          <p>NO REPARTIMOS SABER,<br />REPARTIMOS OFICIO.</p>
          <span className="of-pollito of-pollito--a" aria-hidden><i /></span>
          <span className="of-pollito of-pollito--b" aria-hidden><i /></span>
          <span className="of-pollito of-pollito--c" aria-hidden><i /></span>
          <span className="of-cubo of-cubo--a" aria-hidden>OFICIO</span>
          <span className="of-cubo of-cubo--b" aria-hidden />
        </div>
        <aside className="of-redes" aria-label="Redes">{Object.entries(RED).map(([k, u]) => <a key={k} href={u} target="_blank" rel="noopener noreferrer">{k}</a>)}</aside>
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
        <a href={oficioHref("mentores")} className="of-boton">Respaldado por una agencia con éxito →</a>
      </section>

      <section className="of-prensa">
        <h2>COMO EN:</h2>
        <ul><li>TIECON</li><li>PECFEST</li><li>NASSUMMIT</li><li>ANI</li><li>Diario Económico</li><li>AISensy</li></ul>
      </section>

      <section className="of-programas" id="programas">
        <h2>PROGRAMAS ACTUALES Y PRÓXIMOS</h2>
        <CohortList programs={PROGRAMAS.filter((x) => x.grupo === "programas")} layout="cards" variant="solid" className="of-cohorts" statusLabels={ESTADOS} />
      </section>

      <section className="of-programas" id="talleres">
        <h2>PRÓXIMOS TALLERES, MASTERCLASSES Y CURSOS INTENSIVOS</h2>
        <CohortList programs={PROGRAMAS.filter((x) => x.grupo === "talleres")} layout="cards" variant="solid" className="of-cohorts of-cohorts--talleres" statusLabels={ESTADOS} />
      </section>

      <section className="of-pronto">
        <h2>¡LANZAMOS PRONTO! <span aria-hidden>⬡</span></h2>
        <p><u>*AHORA MISMO EN PRUEBAS INTERNAS*</u></p>
        <div className="of-pronto__fila">
          {PROGRAMAS.filter((x) => x.grupo === "pronto").map((x, i) => (
            <article key={x.id} className={i > 1 ? "is-borroso" : ""}><h3>{x.title}</h3><ul>{x.modulos.map((m) => <li key={m}>{m}</li>)}</ul><a href={oficioHref(`programas/${x.id}`)}>Reservar ya →</a></article>
          ))}
        </div>
        <a href={oficioHref("mentores#se-mentor")} className="of-boton of-boton--ancho">Lanza tu curso con Oficio →</a>
      </section>

      <section className="of-masterclass">
        <div>
          <h2>OFRECEMOS UNA MASTERCLASS GRATIS ANTES DE LANZAR CADA CURSO</h2>
          <p>● 28 masterclasses con éxito &nbsp; ● 1.000+ asistentes</p>
          <a href={oficioHref("programas/contenidos")} className="of-boton">Reserva la próxima masterclass →</a>
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
          <a href={oficioHref("colabora")} className="of-boton">Invítanos a tu evento →</a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/inspiraciones/oficio/eventos.webp" alt="" loading="lazy" />
      </section>

      <section className="of-mentor">
        <div>
          <h2>SÉ MENTOR EN OFICIO</h2>
          <ul><li>Nos gusta formar a quien forma a otros</li><li>Mezclamos creatividad y método</li><li>Traemos lo mejor del sector a clase</li><li>Compartimos lo que aprendemos</li></ul>
          <a href={oficioHref("mentores#se-mentor")} className="of-boton">Empieza tu curso con Oficio →</a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/inspiraciones/oficio/mentores.webp" alt="El equipo de mentores de Oficio" loading="lazy" />
      </section>

      <section className="of-sinlimite">
        <h2>APRENDIZAJE SIN LÍMITES</h2>
        <div>
          <article><h3>SOMOS DISTINTOS</h3><ul><li>100 % aprendizaje práctico</li><li>Atención uno a uno</li><li>Aprendizaje estructurado</li><li>Debates en grupo</li><li>Preparación de entrevistas</li><li>Contactos del sector</li><li>Charlas de emprendedores</li></ul><a href={RED.in} target="_blank" rel="noopener noreferrer" className="of-boton">Síguenos en LinkedIn →</a></article>
          <article className="of-sinlimite__negra"><h3>NOS HACEMOS OÍR</h3><p>Lo que pasa en clase lo contamos en redes: proyectos, visitas y alumnos que ya trabajan.</p><a href={RED.ig} target="_blank" rel="noopener noreferrer" className="of-boton">Síguenos en Instagram →</a></article>
        </div>
      </section>

      <section className="of-lema" aria-label="Nuestro lema">
        <p className="of-lema__frase">NO REPARTIMOS TEORÍA, REPARTIMOS <mark>OFICIO</mark>.</p>
        <a href={oficioHref("programas")} className="of-lema__fondo">Inscríbete</a>
        <span className="of-senal of-senal--izq">PROFESORES: PARA ENSEÑAR OFICIO</span>
        <span className="of-senal of-senal--der">ALUMNOS: PARA APRENDERLO</span>
      </section>
    </>
  );
}
