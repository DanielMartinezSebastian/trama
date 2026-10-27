"use client";

import { useState } from "react";
import LineDraw from "@/components/ui/LineDraw";
import TeamSection from "@/components/ui/TeamSection";
import "./ahora.css";

/*
 * Ahora, escuela de diseño y negocio: réplica de Future London Academy (docs/50 §3.6). Amarillo y negro, una sola letra en
 * mayúsculas (y en contorno para el formato), una A gigante de líneas que se dibuja (LineDraw), el muro de profesores
 * (TeamSection wall), los cursos destacados en tarjetas amarillas que se solapan, la lista de cursos a todo el ancho,
 * un testimonio con retrato B/N, el muro de logos y el boletín.
 */

const PROFES = [
  { name: "Alan Cuní", role: "Laboratorio Frontera", photo: `/img/inspiraciones/ahora/profe-alan.webp` },
  { name: "Simón Gómez", role: "Estudio Norte", photo: `/img/inspiraciones/ahora/profe-simon.webp` },
  { name: "Manuel Serrano", role: "Grupo Alba", photo: `/img/inspiraciones/ahora/profe-manuel.webp` },
  { name: "Dora Núñez", role: "Nielsen Lab", photo: `/img/inspiraciones/ahora/profe-dora.webp` },
  { name: "Clara Vela", role: "Infinito Marca", photo: `/img/inspiraciones/ahora/profe-clara.webp` },
  { name: "Óscar Ruiz", role: "Turing Labs", photo: `/img/inspiraciones/ahora/profe-oscar.webp` },
  { name: "Inés Lago", role: "Producto, ex-Uber", photo: `/img/inspiraciones/ahora/profe-ines.webp` },
];
const DESTACADOS = [
  { titulo: "Programas a medida", texto: "Soluciones de formación para empresas y retos concretos.", chips: ["Cuando quieras", "En línea", "Bajo pedido"], img: "/img/inspiraciones/ahora/a-medida.webp" },
  { titulo: "Programa ejecutivo", texto: "Por fin, un programa de negocio para líderes de diseño: finanzas, operaciones, dirección y emprendimiento.", chips: ["Próxima edición: julio 2027", "Presencial"] },
  { titulo: "Mini-MBA", texto: "Un curso práctico de negocio impartido por líderes de producto. Domina lo esencial y da el salto en tu carrera.", chips: ["A tu ritmo", "En línea"] },
];
const CURSOS = [
  { t: "Marca hoy", f: "A tu ritmo, en línea" },
  { t: "Estrategia de diseño de producto", f: "A tu ritmo, en línea" },
  { t: "Liderazgo creativo", f: "A tu ritmo, en línea" },
  { t: "Operaciones creativas", f: "A tu ritmo, en línea" },
  { t: "Programas de formación a medida", f: "Cuando quieras · en Madrid, en tu oficina o en línea" },
];
const TESTIMONIOS = [
  { t: "El contenido fue muy inspirador e informativo y cubrió un montón de temas. Me encantó poder conocer a gente creativa de todo el mundo, además de a los ponentes. Pocas veces tienes esa conversación cara a cara.", a: "Vicky Fong", r: "Directora creativa asociada", img: `/img/inspiraciones/ahora/testimonio-vicky.webp` },
  { t: "Salí con un plan de negocio para mi estudio y con una red de gente que sigue respondiendo a mis correos dos años después.", a: "Andrés Paz", r: "Fundador de un estudio de diseño", img: `/img/inspiraciones/ahora/testimonio-andres.webp` },
];

export default function Ahora() {
  const [t, setT] = useState(0);
  const tes = TESTIMONIOS[t];
  return (
    <div className="ah">
      <header className="ah-head">
        <a href="#inicio" className="ah-logo">FUTURA<br />ESCUELA<br />AHORA</a>
        <nav aria-label="Principal"><a href="#cursos">Cursos</a><a href="#cursos">A medida</a><a href="#profes">Profesores</a><a href="#inicio">Diario</a><a href="#boletin">Contacto</a></nav>
      </header>

      <section className="ah-hero" id="inicio">
        <LineDraw
          viewBox="0 0 900 900"
          d="M150 900L380 60L520 60L750 900M200 900L420 110L480 110L700 900M250 900L440 160L460 160L650 900M300 620L600 620M320 560L580 560"
          trigger="mount"
          duration={2.4}
          color="#ffffff"
          strokeWidth={16}
          fit="cover"
          className="ah-a"
        />
        <h1>CREAMOS<br />EXPERIENCIAS<br />DE APRENDIZAJE</h1>
        <span className="ah-baja" aria-hidden>↓</span>
      </section>

      <section className="ah-intro" id="profes">
        <div className="ah-intro__txt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/inspiraciones/ahora/intro-taller.webp" alt="" />
          <h2>Hacemos cursos prácticos en Madrid con diseñadores, innovadores y agencias de renombre.</h2>
          <p>Quien trabaja en las industrias creativas necesita estar al día de las tendencias, las grandes ideas y la tecnología más lista. Y para eso no hay sitio mejor que Madrid.</p>
          <p>Nuestras experiencias te sumergen en la vida creativa, comercial y cultural de la ciudad: acceso a personas, agencias y empresas que trabajan hoy, aprendiendo de primera mano cómo funcionan por dentro.</p>
          <p>Si quieres llevar tu empresa al siguiente nivel o dar un empujón a tu carrera, nos encantará inspirarte.</p>
        </div>
        <div className="ah-muro">
          <div className="ah-muro__cifra"><b>200 +</b><span>profesores y mentores de renombre</span></div>
          <TeamSection kicker="" title="" subtitle="" layout="wall" photoTone="color" members={PROFES} variant="minimal" className="ah-team" />
          <a href="#profes" className="ah-muro__todos">Ver todos</a>
        </div>
      </section>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/inspiraciones/ahora/promocion.webp" alt="Una promoción de alumnos celebrando" className="ah-grupo" />

      <section className="ah-proximos" id="cursos">
        <h2>EXPLORA NUESTROS PRÓXIMOS<br />CURSOS Y EXPERIENCIAS</h2>
        <div className="ah-solapadas">
          {DESTACADOS.map((d, i) => (
            <article key={d.titulo} style={{ zIndex: i + 1 }}>
              <h3>{d.titulo}</h3>
              <p>{d.texto}</p>
              {d.img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.img} alt="" loading="lazy" />
              )}
              <ul>{d.chips.map((c) => <li key={c}>{c}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <ul className="ah-lista">
        {CURSOS.map((c) => (
          <li key={c.t}><a href="#cursos"><b>{c.t}</b><span>{c.f}</span><i aria-hidden>→</i></a></li>
        ))}
        <li className="ah-lista__mas"><a href="#cursos">Más cursos <i aria-hidden>→</i></a></li>
      </ul>

      <section className="ah-testimonio">
        <div>
          <blockquote>{tes.t}</blockquote>
          <p><b>{tes.a}</b><br />{tes.r}</p>
          <div className="ah-flechas"><button type="button" aria-label="Anterior" onClick={() => setT((t + 1) % TESTIMONIOS.length)}>←</button><button type="button" aria-label="Siguiente" onClick={() => setT((t + 1) % TESTIMONIOS.length)}>→</button></div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tes.img} alt="" />
      </section>

      <section className="ah-logos">
        <h2>YA HEMOS INSPIRADO A GENTE<br />DE ESTAS EMPRESAS</h2>
        <ul>{["BMW", "Microsoft", "Nike", "IKEA", "pwc", "Aēsop", "SAMSUNG", "accenture", "MITSUBISHI", "shopify", "NETFLIX", "LinkedIn", "Apple", "wise", "BBC"].map((l) => <li key={l}>{l}</li>)}</ul>
      </section>

      <footer className="ah-pie" id="boletin">
        <h2>DESCUBRE NUESTRO INSTAGRAM <span>→</span></h2>
        <div className="ah-insta">{["Imagina que esto es tu MBA", "Encuentra a los tuyos", "Antes / después", "Programa ejecutivo", "Conoce a Clara", "¿Eres director creativo?"].map((x, i) => <span key={x} className={i === 3 ? "is-circulo" : ""}>{x}</span>)}</div>
        <div className="ah-pie__fila">
          <div><h3>SÍGUENOS<br />EN REDES</h3><p className="ah-redes">{["f", "x", "ig", "yt", "in", "tt"].map((r) => <span key={r}>{r}</span>)}</p></div>
          <form onSubmit={(e) => e.preventDefault()}><h3>APÚNTATE<br />AL BOLETÍN</h3><p>Ideas sobre liderazgo de diseño, estrategia y cultura, y novedades de los próximos programas.</p><label><input type="email" placeholder="Tu correo" /><button type="submit" aria-label="Enviar">→</button></label></form>
        </div>
        <small>© 2026 Ahora · Condiciones · Privacidad</small>
      </footer>
    </div>
  );
}
