"use client";

import Marquee from "@/components/ui/Marquee";
import { NOTICIAS } from "./data";
import { patronHref, usePatron } from "./marco";

/*
 * Portada de Patrón Barber & Groom: réplica de Don Barber & Groom (docs/50 §3.2); el menú lateral, la bolsa, el pie y
 * las demás páginas están en Sitio.tsx (docs/56). Gótica condensada enorme para los servicios y los
 * títulos, ancha y pequeña para el texto; azul gris, topo y hueso; una cinta que corre (Marquee), el dueño con su nombre
 * gigante sobre el retrato, «shop in shop», servicios con el óvalo en el centro, noticias y un menú en panel lateral con
 * la foto de portada a la izquierda. Botones en óvalo de contorno.
 */


export default function Patron() {
  const { menu, abrirMenu, bolsa, abrirBolsa } = usePatron();

  return (
    <>
      <section className="pt-portada" id="inicio">
        <div className="pt-foto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/img/inspiraciones/patron/local.webp`} alt="El local: madera, latón y azulejo" />
          <a href={patronHref()} className="pt-logo">PATRÓN<small>Barber<br />&amp; Groom</small></a>
          <div className="pt-servicios">
            <span>Servicios a medida</span>
            <a href={patronHref("servicios#barberia")}>Barbería</a>
            <a href={patronHref("servicios")}>Lista de precios</a>
            <a href={patronHref("servicios#spa")}>Cuidado y spa</a>
            <a href={patronHref("servicios#manos")}>Manos y pies</a>
          </div>
        </div>
        <div className="pt-lado">
          <nav className="pt-nav" aria-label="Accesos">
            <a href={patronHref("reservar")}>Reservar</a>
            <a href="tel:+34910000000">+34 910 000 000</a>
            <button type="button" className="pt-bolsa" onClick={abrirBolsa}>Bolsa ({bolsa})</button>
            <button type="button" className="pt-burger" aria-label="Abrir el menú" aria-expanded={menu} onClick={abrirMenu}><i /><i /><i /></button>
          </nav>
          <figure className="pt-producto">
            <figcaption>Patrón · productos<br />para hombre</figcaption>
            <div className="pt-libro"><b>PATRÓN</b><small>de la cabeza<br />a los pies</small></div>
            <a href={patronHref("tienda")}>Saber más</a>
          </figure>
          {/* en Don Barber la cinta corre al pie de la columna derecha, dentro de la primera pantalla */}
          <Marquee variant="minimal" text="BIENVENIDO AL MUNDO DE PATRÓN" separator="     " rows={1} duration={30} className="pt-cinta pt-cinta--portada" />
        </div>
      </section>

      <section className="pt-familia" id="equipo">
        <p className="pt-chico">Cuidado y bienestar<br /><b>La familia</b></p>
        <p className="pt-chico pt-chico--ancho">Un grupo escogido de profesionales con talento y entusiasmo: cada cliente sale del salón arreglado y como nuevo.</p>
        <h2>JULIÁN<br />ARANDA</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/inspiraciones/patron/dueno.webp`} alt="Julián Aranda, dueño y maestro barbero" />
        <p className="pt-chico">Dueño · maestro barbero</p>
        <a href={patronHref("equipo")} className="pt-ovalo">El equipo</a>
      </section>

      <section className="pt-marcas" id="tienda">
        <p className="pt-chico">Una selección de productos<br />solo para hombre</p>
        <ul aria-label="Marcas"><li>RITUAL</li><li><b>REUZA</b></li><li>label.n</li><li>K · MORA</li></ul>
        <h2>SHOP IN SHOP</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/inspiraciones/patron/tienda.webp`} alt="La tienda dentro de la barbería" />
        <a href={patronHref("tienda")} className="pt-ovalo">Ver la tienda</a>
      </section>

      <section className="pt-serv" id="servicios">
        <p className="pt-chico">Tratamientos de la casa<br /><span>Servicios de barbería y tratamientos propios, hechos con oficio y atención de verdad.</span></p>
        <h2>SERVICIOS</h2>
        <div className="pt-serv__fila">
          <article>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/inspiraciones/patron/servicio-barberia.webp`} alt="" />
            <a href={patronHref("servicios#spa")}>Cuidado y spa</a>
            <p>Depilación y tratamientos para cara y cuerpo, pensados para la piel del hombre.</p>
          </article>
          <article className="pt-serv__central">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/inspiraciones/patron/servicio-afeitado.webp`} alt="" />
            <a href={patronHref("servicios#barberia")}>Barbería</a>
            <p>Los mejores servicios de corte y afeitado en el centro de Madrid.</p>
          </article>
          <article>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/inspiraciones/patron/servicio-manicura.webp`} alt="" />
            <a href={patronHref("servicios#manos")}>Manos y pies</a>
            <p>Tratamientos de lujo para él en una sala propia.</p>
          </article>
        </div>
        <a href={patronHref("servicios")} className="pt-ovalo">Todos los servicios</a>
      </section>

      <section className="pt-noticias">
        <p className="pt-chico">Infórmate<br /><span>Todo lo que nos interesa a diario: relaciones, moda, deporte, comida, viajes y cuidado personal.</span></p>
        <h2>NOTICIAS</h2>
        <div className="pt-noticias__fila">
          {NOTICIAS.map((n) => (
            <a key={n.slug} href={patronHref(`noticias/${n.slug}`)} className="pt-noticia">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.img} alt="" loading="lazy" />
              <small>{n.cat}</small>
              <p>{n.titulo}</p>
              <time>{n.fecha}</time>
            </a>
          ))}
        </div>
        <a href={patronHref("noticias")} className="pt-ovalo">Todas las noticias</a>
      </section>

    </>
  );
}
