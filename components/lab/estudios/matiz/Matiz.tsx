"use client";

import { useState } from "react";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import MenuList, { type MenuSection } from "@/components/ui/MenuList";
import ShapeMosaic, { type ShapeMosaicItem } from "@/components/ui/ShapeMosaic";
import TeamSection from "@/components/ui/TeamSection";
import "./matiz.css";

/*
 * Matiz, atelier de color: réplica de Il Colorista (docs/50 §3.1). Mosaico de formas salmón con fotos que se disuelven en
 * color al bajar (ShapeMosaic), el manifiesto en gris, tratamientos en carrusel con su ficha, el equipo en círculos B/N,
 * noticias en rejilla, la carta como menú de paquetes con nombre y el menú oscuro con filetes que se dibujan.
 */

const F = "/img/hebra/";
const PORTADA: ShapeMosaicItem[] = [
  { shape: "circle", tone: 0, src: `${F}trabajo-ondas.webp`, alt: "Melena ondulada con reflejos miel" },
  { shape: "square", tone: 0, src: `${F}rizos.webp`, alt: "Rizo natural con brillo" },
  { shape: "circle", tone: 1, src: `${F}trabajo-balayage.webp`, alt: "Balayage a mano alzada" },
  { shape: "square", tone: 3 },
  { shape: "square", tone: 1 },
  { shape: "circle", tone: 3 },
  { shape: "square", tone: 0, src: `${F}trabajo-rizo.webp`, alt: "Rizo definido" },
  { shape: "circle", tone: 0, src: `${F}trabajo-corte-corto.webp`, alt: "Pixie con textura" },
  { shape: "circle", tone: 2 },
  { shape: "square", tone: 2, src: `${F}color.webp`, alt: "Aplicación de color con pincel" },
  { shape: "circle", tone: 1 },
  { shape: "square", tone: 3 },
];
const GEOMETRIA: ShapeMosaicItem[] = [
  { shape: "square", tone: 3 }, { shape: "circle", tone: 2 }, { shape: "square", tone: 1 }, { shape: "circle", tone: 3 },
  { shape: "circle", tone: 1 }, { shape: "square", tone: 2 }, { shape: "circle", tone: 3 }, { shape: "square", tone: 1 },
];

const TRATAMIENTOS = [
  { img: `${F}color.webp`, nombre: "Tratamiento", texto: "Consulta, color, balayage, matiz y reconstrucción." },
  { img: `${F}rizos.webp`, nombre: "Rizo sartorial", texto: "Corte en seco, hidratación profunda y definición." },
  { img: `${F}salon.webp`, nombre: "Ritual de brillo", texto: "Baño de color, masaje y acabado al aire." },
];

const CARTA: MenuSection[] = [
  { title: "Los rubios a medida", note: "Cada rubio tiene un nombre y una luz", items: [
    { name: "Rubio Valencia", description: "Consulta + mechas al aire + matiz + reconstrucción + peinado", price: 169 },
    { name: "Rubio Menorca", description: "Consulta + balayage + matiz + peinado", price: 145 },
    { name: "Rubio Lisboa", description: "Consulta + iluminación de contorno + peinado", price: 98 },
  ] },
  { title: "Coloraciones", items: [
    { name: "Castaño de otoño", description: "Consulta + color de raíz a puntas + baño de brillo + peinado", price: 92 },
    { name: "Cobre", description: "Consulta + color + matiz cobrizo + peinado", price: 96 },
  ] },
  { title: "Bienestar", items: [
    { name: "Pausa", description: "Diagnóstico del cuero cabelludo + masaje + tratamiento + peinado", price: 48 },
  ] },
  { title: "Corte", items: [
    { name: "Corte de autor", description: "Consulta + lavado + corte + peinado", price: 55 },
  ] },
];

const NOTICIAS = [
  { img: `${F}trabajo-balayage.webp`, titulo: "Matiz busca talento" },
  { img: `${F}trabajo-ondas.webp`, titulo: "Mi rubio perfecto" },
  { img: `${F}salon.webp`, titulo: "El método de las mechas al aire" },
  { img: `${F}trabajo-rizo.webp`, titulo: "Mi castaño perfecto" },
  { img: `${F}color.webp`, titulo: "Qué es la armocromía" },
  { img: `${F}corte.webp`, titulo: "Colorear y nutrir" },
  { img: `${F}trabajo-corte-corto.webp`, titulo: "El color perfecto existe" },
  { img: `${F}rizos.webp`, titulo: "Amoniaco: ¿sí o no?" },
];

export default function Matiz() {
  const [t, setT] = useState(0);
  const tr = TRATAMIENTOS[t];
  return (
    <div className="mz">
      <header className="mz-head">
        <a className="mz-logo" href="#inicio">Matiz</a>
        <nav aria-label="Redes" className="mz-social">
          <a href="#contacto">fb</a>
          <a href="#contacto">ig</a>
          <a href="#contacto">wa</a>
        </nav>
        <FullscreenMenu
          brand="Matiz"
          openLabel="menú"
          closeLabel="cerrar"
          trigger="label"
          rules
          cover
          note="Calle de Sueca 18 · Valencia"
          links={[
            { label: "inicio", href: "#inicio" },
            { label: "servicios", href: "#carta" },
            { label: "método rostro a medida", href: "#metodo", meta: "ir al formulario" },
            { label: "noticias", href: "#noticias" },
            { label: "contacto", href: "#contacto" },
          ]}
          footer={[{ label: "Instagram", href: "#contacto" }, { label: "WhatsApp", href: "#contacto" }]}
          className="mz-menu"
        />
      </header>

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
        <p className="mz-links"><a href="#metodo">descúbrelo ↗</a><a href="#contacto">pide cita ↗</a></p>
      </section>

      <section className="mz-trat" aria-roledescription="carrusel" aria-label="Tratamientos">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={tr.img} src={tr.img} alt="" />
        <div className="mz-trat__ficha">
          <strong>{tr.nombre}</strong>
          <span>{tr.texto}</span>
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
        linkLabel=""
        variant="minimal"
        className="mz-team"
        members={[
          { name: "Marcos", role: "Colorista · Estilista", photo: "/img/hebra/equipo/leo.webp" },
          { name: "Lidia", role: "Especialista en rubios · Encargada", photo: "/img/hebra/equipo/vera.webp" },
          { name: "Alba", role: "Corte y textura", photo: "/img/hebra/equipo/alba.webp" },
        ]}
      />

      <section className="mz-news" id="noticias">
        <article className="mz-news__card mz-news__card--brand">
          <span>Matiz</span>
          <p>Matiz busca talento</p>
        </article>
        {NOTICIAS.slice(1).map((n) => (
          <article key={n.titulo} className="mz-news__card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={n.img} alt="" loading="lazy" />
            <small>noticias</small>
            <h3>{n.titulo}</h3>
            <a href="#noticias">leer</a>
          </article>
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
      </section>

      <section className="mz-revista" aria-label="Revista y boletín">
        <div className="mz-revista__bloque">
          <span className="mz-revista__circulo" />
          <div className="mz-revista__tarjeta">
            <p>Matiz #7<br />Otoño – Invierno 2026</p>
            <a href="#contacto">descarga la revista</a>
          </div>
        </div>
        <div className="mz-revista__bloque mz-revista__bloque--b">
          <div className="mz-revista__tarjeta">
            <p>Entérate de las novedades y las ofertas</p>
            <a href="#contacto">apúntate al boletín</a>
          </div>
          <span className="mz-revista__circulo" />
        </div>
      </section>

      <footer className="mz-foot" id="contacto">
        <div><a href="#contacto">Privacidad</a> — <a href="#contacto">Cookies</a> — <a href="#contacto">Preferencias</a><br />hola@matiz.example<br />T. 960 000 000</div>
        <div>Calle de Sueca 18<br />46006 Valencia</div>
        <div>Todos los días<br />8:30 – 18:30</div>
      </footer>
    </div>
  );
}
