"use client";

import { useState } from "react";
import MenuList from "@/components/ui/MenuList";
import ShapeMosaic, { type ShapeMosaicItem } from "@/components/ui/ShapeMosaic";
import TeamSection from "@/components/ui/TeamSection";
import { CARTA, NOTICIAS } from "./data";
import { matizHref } from "./enlaces";

/*
 * Portada de Matiz, atelier de color: réplica de Il Colorista (docs/50 §3.1); la cabecera, el pie y las demás páginas
 * están en Sitio.tsx (docs/56). Mosaico de formas salmón con fotos que se disuelven en
 * color al bajar (ShapeMosaic), el manifiesto en gris, tratamientos en carrusel con su ficha, el equipo en círculos B/N,
 * noticias en rejilla, la carta como menú de paquetes con nombre y el menú oscuro con filetes que se dibujan.
 */

const PORTADA: ShapeMosaicItem[] = [
  { shape: "circle", tone: 0, src: `/img/inspiraciones/matiz/mosaico-ondas.webp`, alt: "Melena ondulada con reflejos miel" },
  { shape: "square", tone: 0, src: `/img/inspiraciones/matiz/mosaico-rizo.webp`, alt: "Rizo natural con brillo" },
  { shape: "circle", tone: 1, src: `/img/inspiraciones/matiz/mosaico-balayage.webp`, alt: "Balayage a mano alzada" },
  { shape: "square", tone: 3 },
  { shape: "square", tone: 1 },
  { shape: "circle", tone: 3 },
  { shape: "square", tone: 0, src: `/img/inspiraciones/matiz/mosaico-rizo-definido.webp`, alt: "Rizo definido" },
  { shape: "circle", tone: 0, src: `/img/inspiraciones/matiz/mosaico-pixie.webp`, alt: "Pixie con textura" },
  { shape: "circle", tone: 2 },
  { shape: "square", tone: 2, src: `/img/inspiraciones/matiz/mosaico-pincel.webp`, alt: "Aplicación de color con pincel" },
  { shape: "circle", tone: 1 },
  { shape: "square", tone: 3 },
];
const GEOMETRIA: ShapeMosaicItem[] = [
  { shape: "square", tone: 3 }, { shape: "circle", tone: 2 }, { shape: "square", tone: 1 }, { shape: "circle", tone: 3 },
  { shape: "circle", tone: 1 }, { shape: "square", tone: 2 }, { shape: "circle", tone: 3 }, { shape: "square", tone: 1 },
];

const TRATAMIENTOS = [
  { img: `/img/inspiraciones/matiz/servicio-tratamiento.webp`, nombre: "Tratamiento", texto: "Consulta, color, balayage, matiz y reconstrucción." },
  { img: `/img/inspiraciones/matiz/servicio-rizo.webp`, nombre: "Rizo sartorial", texto: "Corte en seco, hidratación profunda y definición." },
  { img: `/img/inspiraciones/matiz/servicio-brillo.webp`, nombre: "Ritual de brillo", texto: "Baño de color, masaje y acabado al aire." },
];

/** apuntarse al boletín o pedir la revista: un correo y la confirmación, sin enviar nada */
function Suscripcion({ texto, accion, hecho }: { texto: string; accion: string; hecho: string }) {
  const [abierto, setAbierto] = useState(false);
  const [correo, setCorreo] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  if (ok) return <div className="mz-revista__tarjeta"><p>{hecho}</p><p className="mz-nota" role="status">Enviado a {correo} (demostración: no sale nada).</p></div>;
  return (
    <div className="mz-revista__tarjeta">
      <p>{texto}</p>
      {abierto ? (
        <form className="mz-suscribe" noValidate onSubmit={(e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(correo.trim())) return setError("Revisa el correo."); setOk(true); }}>
          <label>tu correo<input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="email" autoFocus /></label>
          <button type="submit">enviar</button>
          {error && <small role="alert">{error}</small>}
        </form>
      ) : (
        <button type="button" className="mz-enlace" onClick={() => setAbierto(true)}>{accion}</button>
      )}
    </div>
  );
}

export default function Matiz() {
  const [t, setT] = useState(0);
  const tr = TRATAMIENTOS[t];
  return (
    <>

      <section className="mz-hero" id="inicio">
        <h1>Atelier de color<br />en Ruzafa</h1>
        <ShapeMosaic items={PORTADA} columns={3} drift={90} className="mz-mosaic" />
      </section>
      <section className="mz-geo" aria-hidden>
        <ShapeMosaic items={GEOMETRIA} columns={4} drift={140} dissolve={false} />
      </section>

      <section className="mz-manifiesto" id="metodo">
        <p className="mz-firma">Matiz Atelier<br />Cuando pienso en mi clienta ideal imagino<br />a una mujer que se cuida para sí misma,<br />que valora lo que la hace única.<br />Cada mujer tiene su color.</p>
        <h2>de aquí nace<br /><b>el método</b><br /><b>rostro a medida</b></h2>
        <p className="mz-links"><a href={matizHref("metodo")}>descúbrelo ↗</a><a href={matizHref("reservar?servicio=consulta")}>pide cita ↗</a></p>
      </section>

      <section className="mz-trat" aria-roledescription="carrusel" aria-label="Tratamientos">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={tr.img} src={tr.img} alt="" />
        <div className="mz-trat__ficha">
          <strong>{tr.nombre}</strong>
          <span>{tr.texto}</span>
          <a href={matizHref("servicios")}>ver la carta ↗</a>
        </div>
        <div className="mz-trat__flechas">
          <button type="button" aria-label="Anterior" onClick={() => setT((t + TRATAMIENTOS.length - 1) % TRATAMIENTOS.length)}>←</button>
          <button type="button" aria-label="Siguiente" onClick={() => setT((t + 1) % TRATAMIENTOS.length)}>→</button>
        </div>
      </section>

      <TeamSection
        kicker=""
        title="nuestro equipo"
        subtitle=""
        shape="circle"
        photoTone="mono"
        linkLabel="pide cita"
        variant="minimal"
        className="mz-team"
        members={[
          { name: "Marcos", role: "Colorista · Estilista", photo: "/img/inspiraciones/matiz/equipo-marcos.webp", href: matizHref("reservar?profesional=Marcos") },
          { name: "Lidia", role: "Especialista en rubios · Encargada", photo: "/img/inspiraciones/matiz/equipo-lidia.webp", href: matizHref("reservar?profesional=Lidia") },
          { name: "Alba", role: "Corte y textura", photo: "/img/inspiraciones/matiz/equipo-alba.webp", href: matizHref("reservar?profesional=Alba") },
        ]}
      />

      <section className="mz-news" id="noticias">
        <a href={matizHref(`noticias/${NOTICIAS[0].slug}`)} className="mz-news__card mz-news__card--brand">
          <span>Matiz</span>
          <p>{NOTICIAS[0].titulo}</p>
        </a>
        {NOTICIAS.slice(1).map((n) => (
          <a key={n.slug} href={matizHref(`noticias/${n.slug}`)} className="mz-news__card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={n.img} alt="" loading="lazy" />
            <small>noticias</small>
            <h3>{n.titulo}</h3>
            <span className="mz-leer">leer</span>
          </a>
        ))}
      </section>

      <section className="mz-carta" id="carta">
        <div className="mz-carta__cabecera">
          <span className="mz-sol" aria-hidden />
          <span className="mz-acuarela mz-acuarela--a" aria-hidden />
          <span className="mz-acuarela mz-acuarela--b" aria-hidden />
          <h2>Carta<br />otoño – invierno<br />2026</h2>
        </div>
        <MenuList menu={CARTA} layout="list" filter={false} legend={false} nav={false} footnote="Consulta inicial 29 € · gratuita si después pides cita." variant="minimal" className="mz-menulist" />
        <p className="mz-links mz-links--carta"><a href={matizHref("reservar")}>pide cita ↗</a><a href={matizHref("servicios")}>todos los servicios ↗</a></p>
      </section>

      <section className="mz-revista" aria-label="Revista y boletín">
        <div className="mz-revista__bloque">
          <span className="mz-revista__circulo" />
          <Suscripcion texto="Matiz #7 · Otoño – Invierno 2026" accion="descarga la revista" hecho="Te mandamos la revista por correo." />
        </div>
        <div className="mz-revista__bloque mz-revista__bloque--b">
          <Suscripcion texto="Entérate de las novedades y las ofertas" accion="apúntate al boletín" hecho="Ya estás en el boletín. Gracias." />
          <span className="mz-revista__circulo" />
        </div>
      </section>

    </>
  );
}
