"use client";

import { useEffect, useState } from "react";
import Marquee from "@/components/ui/Marquee";
import "./patron.css";

/*
 * Patrón Barber & Groom: réplica de Don Barber & Groom (docs/50 §3.2). Gótica condensada enorme para los servicios y los
 * títulos, ancha y pequeña para el texto; azul gris, topo y hueso; una cinta que corre (Marquee), el dueño con su nombre
 * gigante sobre el retrato, «shop in shop», servicios con el óvalo en el centro, noticias y un menú en panel lateral con
 * la foto de portada a la izquierda. Botones en óvalo de contorno.
 */

const E = "/img/esparta/";
const NOTICIAS = [
  { cat: "Salud masculina", titulo: "Reflexología para el estrés, la ansiedad y el cansancio", fecha: "25 ene", img: `${E}navaja.webp` },
  { cat: "Moda y estilo", titulo: "Lo básico bien hecho: la camisa blanca", fecha: "16 dic", img: `${E}local.webp` },
  { cat: "Moda y estilo", titulo: "Los accesorios de este invierno", fecha: "25 oct", img: `${E}sillon.webp` },
];

export default function Patron() {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    if (!menu) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [menu]);

  return (
    <div className="pt">
      <section className="pt-portada" id="inicio">
        <div className="pt-foto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${E}local.webp`} alt="El local: madera, latón y azulejo" />
          <a href="#inicio" className="pt-logo">PATRÓN<small>Barber<br />&amp; Groom</small></a>
          <div className="pt-servicios">
            <span>Servicios a medida</span>
            <a href="#servicios">Barbería</a>
            <a href="#servicios">Lista de precios</a>
            <a href="#servicios">Cuidado y spa</a>
            <a href="#servicios">Manos y pies</a>
          </div>
        </div>
        <div className="pt-lado">
          <nav className="pt-nav" aria-label="Accesos">
            <a href="#contacto">Reservar</a>
            <a href="#contacto">+34 910 000 000</a>
            <span><b>ES</b> EN</span>
            <button type="button" className="pt-burger" aria-label="Abrir el menú" aria-expanded={menu} onClick={() => setMenu(true)}><i /><i /><i /></button>
          </nav>
          <figure className="pt-producto">
            <figcaption>Patrón · productos<br />para hombre</figcaption>
            <div className="pt-libro"><b>PATRÓN</b><small>de la cabeza<br />a los pies</small></div>
            <a href="#tienda">Saber más</a>
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
        <img src={`${E}equipo/bruno.webp`} alt="Julián Aranda, dueño y maestro barbero" />
        <p className="pt-chico">Dueño · maestro barbero</p>
        <a href="#equipo" className="pt-ovalo">El equipo</a>
      </section>

      <section className="pt-marcas" id="tienda">
        <p className="pt-chico">Una selección de productos<br />solo para hombre</p>
        <ul aria-label="Marcas"><li>RITUAL</li><li><b>REUZA</b></li><li>label.n</li><li>K · MORA</li></ul>
        <h2>SHOP IN SHOP</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${E}sillon.webp`} alt="La tienda dentro de la barbería" />
      </section>

      <section className="pt-serv" id="servicios">
        <p className="pt-chico">Tratamientos de la casa<br /><span>Servicios de barbería y tratamientos propios, hechos con oficio y atención de verdad.</span></p>
        <h2>SERVICIOS</h2>
        <div className="pt-serv__fila">
          <article>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${E}local.webp`} alt="" />
            <a href="#servicios">Cuidado y spa</a>
            <p>Depilación y tratamientos para cara y cuerpo, pensados para la piel del hombre.</p>
          </article>
          <article className="pt-serv__central">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${E}navaja.webp`} alt="" />
            <a href="#servicios">Barbería</a>
            <p>Los mejores servicios de corte y afeitado en el centro de Madrid.</p>
          </article>
          <article>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${E}sillon.webp`} alt="" />
            <a href="#servicios">Manos y pies</a>
            <p>Tratamientos de lujo para él en una sala propia.</p>
          </article>
        </div>
        <a href="#servicios" className="pt-ovalo">Todos los servicios</a>
      </section>

      <section className="pt-noticias">
        <p className="pt-chico">Infórmate<br /><span>Todo lo que nos interesa a diario: relaciones, moda, deporte, comida, viajes y cuidado personal.</span></p>
        <h2>NOTICIAS</h2>
        <div className="pt-noticias__fila">
          {NOTICIAS.map((n) => (
            <article key={n.titulo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.img} alt="" loading="lazy" />
              <small>{n.cat}</small>
              <p>{n.titulo}</p>
              <time>{n.fecha}</time>
            </article>
          ))}
        </div>
        <a href="#inicio" className="pt-ovalo">Todas las noticias</a>
      </section>

      <footer className="pt-pie" id="contacto">
        <div className="pt-pie__datos">
          <p>Calle de Almagro 23<br />28010 Madrid</p>
          <p>Facebook<br />YouTube<br />Instagram</p>
          <p>T. +34 910 000 000<br />E. hola@patron.example</p>
        </div>
        <a href="#contacto" className="pt-boletin">BOLETÍN</a>
      </footer>
      <Marquee variant="minimal" text="BIENVENIDO AL MUNDO DE PATRÓN" separator="     " rows={1} duration={30} className="pt-cinta pt-cinta--pie" />

      <div className={`pt-menu ${menu ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menú" aria-hidden={!menu} inert={!menu}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${E}local.webp`} alt="" className="pt-menu__foto" />
        <div className="pt-menu__panel">
          <button type="button" className="pt-ovalo pt-cerrar" onClick={() => setMenu(false)}>Salir</button>
          <nav aria-label="Principal" onClick={() => setMenu(false)}>
            <a href="#inicio" className="pt-menu__activo">Inicio</a>
            <a href="#equipo">Perfil</a>
            <span><a href="#equipo">Historia</a><a href="#equipo">Galería</a><a href="#equipo">El equipo</a></span>
            <a href="#servicios">Servicios</a>
            <a href="#inicio">Noticias</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <figure className="pt-menu__tarjeta">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${E}equipo/hugo.webp`} alt="" />
            <figcaption><i>Mantente impecable</i></figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
