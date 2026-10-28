"use client";

import { useState } from "react";
import LineDraw from "@/components/ui/LineDraw";
import TeamSection from "@/components/ui/TeamSection";
import { CURSOS, DESTACADOS, PROFES, TESTIMONIOS } from "./data";
import { ahoraHref } from "./enlaces";

/*
 * Ahora, escuela de diseño y negocio: réplica de Future London Academy (docs/50 §3.6). Amarillo y negro, una sola letra en
 * mayúsculas (y en contorno para el formato), una A gigante de líneas que se dibuja (LineDraw), el muro de profesores
 * (TeamSection wall), los cursos destacados en tarjetas amarillas que se solapan, la lista de cursos a todo el ancho,
 * un testimonio con retrato B/N y el muro de logos. Cabecera, pie con el boletín y demás páginas en Sitio.tsx (docs/56).
 */

export default function Ahora() {
  const [t, setT] = useState(0);
  const tes = TESTIMONIOS[t];
  return (
    <>
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
          <TeamSection kicker="" title="" subtitle="" layout="wall" photoTone="color" members={PROFES.map(({ name, role, photo }) => ({ name, role, photo }))} variant="minimal" className="ah-team" />
          <a href={ahoraHref("profesores")} className="ah-muro__todos">Ver todos</a>
        </div>
      </section>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/inspiraciones/ahora/promocion.webp" alt="Una promoción de alumnos celebrando" className="ah-grupo" />

      <section className="ah-proximos" id="cursos">
        <h2>EXPLORA NUESTROS PRÓXIMOS<br />CURSOS Y EXPERIENCIAS</h2>
        <div className="ah-solapadas">
          {DESTACADOS.map((d, i) => (
            <a key={d.titulo} href={ahoraHref(d.href)} style={{ zIndex: i + 1 }}>
              <h3>{d.titulo}</h3>
              <p>{d.texto}</p>
              {d.img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.img} alt="" loading="lazy" />
              )}
              <ul>{d.chips.map((c) => <li key={c}>{c}</li>)}</ul>
            </a>
          ))}
        </div>
      </section>

      <ul className="ah-lista">
        {CURSOS.filter((c) => c.formato === "en línea" && c.id !== "mini-mba").map((c) => (
          <li key={c.t}><a href={ahoraHref(`cursos/${c.id}`)}><b>{c.t}</b><span>{c.f}</span><i aria-hidden>→</i></a></li>
        ))}
        <li><a href={ahoraHref("empresas")}><b>Programas de formación a medida</b><span>Cuando quieras · en Madrid, en tu oficina o en línea</span><i aria-hidden>→</i></a></li>
        <li className="ah-lista__mas"><a href={ahoraHref("cursos")}>Más cursos <i aria-hidden>→</i></a></li>
      </ul>

      <section className="ah-testimonio">
        <div>
          <blockquote>{tes.t}</blockquote>
          <p><b>{tes.a}</b><br />{tes.r}</p>
          <div className="ah-flechas"><button type="button" aria-label="Anterior" onClick={() => setT((t + TESTIMONIOS.length - 1) % TESTIMONIOS.length)}>←</button><button type="button" aria-label="Siguiente" onClick={() => setT((t + 1) % TESTIMONIOS.length)}>→</button></div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tes.img} alt="" />
      </section>

      <section className="ah-logos">
        <h2>YA HEMOS INSPIRADO A GENTE<br />DE ESTAS EMPRESAS</h2>
        <ul>{["BMW", "Microsoft", "Nike", "IKEA", "pwc", "Aēsop", "SAMSUNG", "accenture", "MITSUBISHI", "shopify", "NETFLIX", "LinkedIn", "Apple", "wise", "BBC"].map((l) => <li key={l}>{l}</li>)}</ul>
      </section>
    </>
  );
}
