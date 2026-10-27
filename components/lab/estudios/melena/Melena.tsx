"use client";

import Carousel from "@/components/ui/Carousel";
import LogoCloud from "@/components/ui/LogoCloud";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import "./melena.css";

/*
 * Melena: réplica de Hair Me Up (docs/50 §3.2). Salón, tienda y academia en una sola web: arco melocotón detrás del nombre,
 * sello circular, servicios numerados con filete, palabras de fondo enormes y tenues en cada sección (SectionHeader
 * backdrop), productos con precio rebajado (ProductCard), cursos en carrusel, una pestaña fija con la nota y dos píldoras
 * de reserva, una por salón.
 */

const SERVICIOS = ["Corte", "Peinado", "Color", "Cuidado"];
const PRODUCTOS = [
  { title: "Sérum de noche reparador", price: 26.5, compareAt: 35.4, image: "/img/objetos/05-rustic-tulip-vase-unsplash.jpg", meta: "Ritual de noche · 100 ml" },
  { title: "Laca de fijación flexible", price: 21.9, compareAt: 27.4, image: "/img/objetos/06-joanna-kosinska-2016-10-30-unsplash.jpg", meta: "Forma · 200 ml" },
  { title: "Bálsamo sin aclarado", price: 18.2, compareAt: 24.3, image: "/img/objetos/02-suhyeon-choi-2017-01-19-unsplash.jpg", meta: "Color protegido · tamaño viaje" },
  { title: "Champú de expiación", price: 24.0, compareAt: 32.0, image: "/img/objetos/01-wood-table-in-front-of-white-wall-unsplash.jpg", meta: "Hidratación · 300 ml" },
];
const CURSOS = [
  { titulo: "Cortes de salón actuales: curso de dos días", texto: "Una introducción profesional a las técnicas de corte de las grandes academias." },
  { titulo: "Color sin miedo: diagnóstico y fórmula", texto: "Tres mañanas para leer el cabello, mezclar y corregir sin sorpresas." },
  { titulo: "Recogidos de novia", texto: "Un taller práctico con modelos reales y kit de horquillas incluido." },
];

export default function Melena() {
  return (
    <div className="me">
      <header className="me-head">
        <a href="#inicio" className="me-sello" aria-label="Melena, inicio"><span>m</span></a>
        <nav aria-label="Principal">
          <a href="#equipo">Conócenos</a>
          <a href="#servicios">Precios</a>
          <a href="#blog">Blog</a>
          <a href="#academia">Academia</a>
          <a href="#tienda">Tienda</a>
        </nav>
        <span className="me-redes" aria-hidden>◎ ⓕ ⓟ</span>
        <a href="#contacto" className="me-pildora">Contacta</a>
      </header>

      <section className="me-hero" id="inicio">
        <div className="me-arco" aria-hidden />
        <p className="me-bienvenida">Bienvenida a</p>
        <h1>Melena</h1>
        <span className="me-linea" aria-hidden />
        <a href="#servicios" className="me-redondo">Empieza<br />la aventura</a>
        <a href="#equipo" className="me-pildora me-pildora--equipo">Conoce al equipo</a>
      </section>

      <section className="me-servicios" id="servicios">
        <p className="me-etiqueta">Los servicios más pedidos</p>
        <ol>
          {SERVICIOS.map((s, i) => (
            <li key={s}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h2>{s}</h2>
            </li>
          ))}
        </ol>
        <a href="#servicios" className="me-pildora">Ver precios</a>
      </section>

      <section className="me-sobre" id="equipo">
        <SectionHeader kicker="Conócenos" title="Melena es el sitio donde cuidamos de tu pelo y te enseñamos a cuidarlo" subtitle="" rule="none" variant="editorial" className="me-sh" />
        <a href="#equipo" className="me-pildora">Conoce al equipo</a>
      </section>

      <section className="me-tienda" id="tienda">
        <div className="me-embajada">
          <SectionHeader kicker="" title="Melena, salón embajador oficial de Ritual en España" subtitle="" backdrop="tienda" rule="none" variant="editorial" className="me-sh" />
          <a href="#tienda" className="me-pildora">Ir a la tienda</a>
        </div>
        <p className="me-etiqueta">Promociones</p>
        <div className="me-productos">
          {PRODUCTOS.map((p) => (
            <ProductCard key={p.title} {...p} badge="−25 %" ratio="1 / 1" variant="minimal" />
          ))}
        </div>
      </section>

      <section className="me-academia" id="academia">
        <div className="me-academia__cab">
          <SectionHeader kicker="Academia Melena" title="Te invitamos a la Academia Melena: aprende, afina el oficio y sorprende a tus clientas." subtitle="" rule="none" variant="editorial" className="me-sh" />
          <p className="me-aka" aria-hidden><span>aca</span><span>de</span><span>mia</span></p>
        </div>
        <a href="#academia" className="me-pildora">Entra en la academia</a>
        <p className="me-etiqueta">Otros cursos</p>
        <Carousel perView={1} arrows dots="none" variant="minimal" label="Cursos de la academia" className="me-cursos">
          {CURSOS.map((c) => (
            <article key={c.titulo} className="me-curso">
              <h3>{c.titulo}</h3>
              <p>{c.texto}</p>
              <a href="#academia" className="me-pildora">Ver el curso</a>
            </article>
          ))}
        </Carousel>
      </section>

      <section className="me-blog" id="blog">
        <SectionHeader kicker="" title="Sigue al día con nosotras" subtitle="" backdrop="blog" rule="none" variant="editorial" className="me-sh" />
        <a href="#blog" className="me-pildora">Ir al blog</a>
        <p className="me-etiqueta">Marcas en el salón y en la tienda</p>
        <LogoCloud label="" brands="RITUAL, OLEA, BRUMA, NÁCAR, SALVIA, ÁMBAR" variant="minimal" />
      </section>

      <footer className="me-pie" id="contacto">
        <div><strong>Melena</strong><p>Gran Vía 31 · Calle del Arenal 9<br />Madrid</p></div>
        <div><p>hola@melena.example<br />910 000 000</p></div>
        <form onSubmit={(e) => e.preventDefault()} className="me-boletin">
          <label>Boletín<input type="email" placeholder="tu correo" /></label>
          <button type="submit" className="me-pildora">Apuntarme</button>
        </form>
      </footer>

      <a href="#contacto" className="me-nota" aria-label="Nota 5,0: ver opiniones">
        <b>★</b>
        <strong>5,0</strong>
        <span>Mira las opiniones</span>
      </a>
      <div className="me-reservas">
        <a href="#contacto" className="me-pildora me-pildora--fija">Reserva en <b>Gran Vía</b></a>
        <a href="#contacto" className="me-pildora me-pildora--fija">Reserva en <b>Arenal</b></a>
      </div>
    </div>
  );
}
