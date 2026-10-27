"use client";

import Carousel from "@/components/ui/Carousel";
import LogoCloud from "@/components/ui/LogoCloud";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { CURSOS, PRODUCTOS } from "./data";
import { melenaHref } from "./enlaces";

/*
 * Portada de Melena: réplica de Hair Me Up (docs/50 §3.2); cabecera, pie, nota y reservas fijas, y las demás páginas,
 * en Sitio.tsx (docs/56). Salón, tienda y academia en una sola web: arco melocotón detrás del nombre,
 * sello circular, servicios numerados con filete, palabras de fondo enormes y tenues en cada sección (SectionHeader
 * backdrop), productos con precio rebajado (ProductCard), cursos en carrusel, una pestaña fija con la nota y dos píldoras
 * de reserva, una por salón.
 */

const SERVICIOS = ["Corte", "Peinado", "Color", "Cuidado"];

export default function Melena() {
  return (
    <>

      <section className="me-hero" id="inicio">
        <div className="me-arco" aria-hidden />
        <p className="me-bienvenida">Bienvenida a</p>
        <h1>Melena</h1>
        <span className="me-linea" aria-hidden />
        <a href={melenaHref("reservar")} className="me-redondo">Empieza<br />la aventura</a>
        <a href={melenaHref("conocenos")} className="me-pildora me-pildora--equipo">Conoce al equipo</a>
      </section>

      <section className="me-servicios" id="servicios">
        <p className="me-etiqueta">Los servicios más pedidos</p>
        <ol>
          {SERVICIOS.map((s, i) => (
            <li key={s}>
              <a href={melenaHref(`precios#${s.toLowerCase()}`)}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h2>{s}</h2>
              </a>
            </li>
          ))}
        </ol>
        <a href={melenaHref("precios")} className="me-pildora">Ver precios</a>
      </section>

      <section className="me-sobre" id="equipo">
        <SectionHeader kicker="Conócenos" title="Melena es el sitio donde cuidamos de tu pelo y te enseñamos a cuidarlo" subtitle="" rule="none" variant="editorial" className="me-sh" />
        <a href={melenaHref("conocenos")} className="me-pildora">Conoce al equipo</a>
      </section>

      <section className="me-tienda" id="tienda">
        <div className="me-embajada">
          <SectionHeader kicker="" title="Melena, salón embajador oficial de Ritual en España" subtitle="" backdrop="tienda" rule="none" variant="editorial" className="me-sh" />
          <a href={melenaHref("tienda")} className="me-pildora">Ir a la tienda</a>
        </div>
        <p className="me-etiqueta">Promociones</p>
        <div className="me-productos">
          {PRODUCTOS.map((p) => (
            <ProductCard key={p.id} title={p.title} price={p.price} compareAt={p.compareAt} image={p.image} meta={p.meta} href={melenaHref(`tienda/${p.id}`)} badge="−25 %" ratio="1 / 1" variant="minimal" />
          ))}
        </div>
      </section>

      <section className="me-academia" id="academia">
        <div className="me-academia__cab">
          <SectionHeader kicker="Academia Melena" title="Te invitamos a la Academia Melena: aprende, afina el oficio y sorprende a tus clientas." subtitle="" rule="none" variant="editorial" className="me-sh" />
          <p className="me-aka" aria-hidden><span>aca</span><span>de</span><span>mia</span></p>
        </div>
        <a href={melenaHref("academia")} className="me-pildora">Entra en la academia</a>
        <p className="me-etiqueta">Otros cursos</p>
        <Carousel perView={1} arrows dots="none" variant="minimal" label="Cursos de la academia" className="me-cursos">
          {CURSOS.map((c) => (
            <article key={c.id} className="me-curso">
              <h3>{c.titulo}</h3>
              <p>{c.texto}</p>
              <a href={melenaHref(`academia/${c.id}`)} className="me-pildora">Ver el curso</a>
            </article>
          ))}
        </Carousel>
      </section>

      <section className="me-blog" id="blog">
        <SectionHeader kicker="" title="Sigue al día con nosotras" subtitle="" backdrop="blog" rule="none" variant="editorial" className="me-sh" />
        <a href={melenaHref("blog")} className="me-pildora">Ir al blog</a>
        <p className="me-etiqueta">Marcas en el salón y en la tienda</p>
        <LogoCloud label="" brands="RITUAL, OLEA, BRUMA, NÁCAR, SALVIA, ÁMBAR" variant="minimal" />
      </section>

    </>
  );
}
