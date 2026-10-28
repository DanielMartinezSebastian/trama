"use client";

import { useEffect, useState } from "react";
import CrossCluster from "@/components/ui/CrossCluster";
import LineDraw from "@/components/ui/LineDraw";
import FloatingVideo from "@/components/ui/FloatingVideo";
import ScrollExpand from "@/components/ui/ScrollExpand";
import { PROYECTOS } from "./data";
import { cenitHref } from "./enlaces";

/*
 * Cénit, estudio de experiencias 3D: inspiración de Trama basada en lusion.co (docs/43, docs/55), con marca, proyectos y
 * textos propios. En la referencia todo es un lienzo WebGL bajo una capa de DOM fija; aquí el DOM es la página y el 3D va
 * donde hace falta (en /lab/cine/lusion-web se sigue comparando con la original):
 *   - cabecera fija (en Sitio.tsx, con las letras, el pie y las demás páginas; docs/56): logo, sonido, «Hablemos» y
 *     «Menú», que abre enlaces y el boletín;
 *   - portada: tarjeta oscura con el racimo de cruces (CrossCluster) y «BAJA PARA EXPLORAR» entre cruces;
 *   - «Ideas valientes, hechas realidad» con la cinta azul que se dibuja con el scroll (LineDraw tube), el párrafo y
 *     «Cómo trabajamos»; la tarjeta pequeña crece hasta el reel a sangre con «VER ● REEL» (ScrollExpand);
 *   - «Proyectos»: doce en dos columnas (imagen, etiquetas y título) y «Ver todos los proyectos»;
 *   - «Donde las ideas se vuelven experiencias» con la cinta cian, los párrafos y la tableta con la Tierra que crece hasta
 *     la escena negra del astronauta.
 */

const REEL = ["/video/cielo/01-nubes-atardecer.mp4", "/video/oceano/01-arrecife.mp4", "/video/ciudad/01-rascacielos-noche.mp4", "/video/oceano/03-delfines-hawai.mp4"];

/** cambia de clip cada 3 s, con un fundido: el reel de la referencia */
function Reel() {
  const [k, setK] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setK((x) => (x + 1) % REEL.length), 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="lw-reel">
      {REEL.map((src, i) => (
        <video key={src} src={src} muted loop playsInline autoPlay preload="metadata" style={{ opacity: i === k ? 1 : 0 }} />
      ))}
    </div>
  );
}

const I = "/img/inspiraciones/cenit/";

export function Pastilla({ texto, href, oscura = false }: { texto: string; href: string; oscura?: boolean }) {
  return (
    <a href={href} className={`lw-pill ${oscura ? "is-dark" : ""}`}>
      <i aria-hidden />
      {texto}
    </a>
  );
}

export default function Cenit() {
  return (
    <>
      {/* la sensación de la referencia, scroll virtual con inercia larga (docs/42), la pone el marco (registro: scroll "cinematic") */}

      {/* portada */}
      <section className="lw-hero">
        <p className="lw-hero__lead">Contamos historias en 3D y creamos webs interactivas que hacen que las marcas se recuerden</p>
        <div className="lw-hero__card">
          <CrossCluster height="100%" colors={["#061dfb", "#bcbcbc", "#111111"]} />
        </div>
        <div className="lw-rule" aria-hidden>
          <b>+</b>
          <b>+</b>
          <span>BAJA PARA EXPLORAR</span>
          <b>+</b>
          <b>+</b>
        </div>
      </section>

      {/* Ideas valientes */}
      <section className="lw-bold">
        {/* la cinta entra por arriba a la izquierda, cruza el titular y baja a rodear la tarjeta del reel (pantallas 04–06) */}
        <LineDraw className="lw-ribbon lw-ribbon--azul" tube trigger="scroll" scrollRange={[0.8, -0.9]} strokeWidth={17} color="#2f3cff" viewBox="0 0 1440 1500" d="M-60 30C120 40 260 110 330 220C410 350 430 520 420 700C410 860 330 960 210 1010C80 1060 60 1200 200 1260C360 1330 560 1250 600 1110C630 1000 560 930 470 950" />
        <h2>
          Ideas valientes,
          <br />
          hechas realidad
        </h2>
        <div className="lw-bold__text">
          <p>Juntamos diseño, movimiento, 3D y desarrollo para hacer experiencias digitales que llaman la atención y funcionan sin costuras. De un lanzamiento de campaña a un mundo de marca entero: trabajo que se mira y que invita a tocar.</p>
          <Pastilla texto="Cómo trabajamos" href={cenitHref("estudio")} />
        </div>
      </section>
      <ScrollExpand length={2.2} from={{ width: "26vw", height: "16vw" }} offset={{ x: "-26vw", y: "-6vh" }} tilt={18} radius={[14, 18]}
        overlay={
          <p className="lw-playreel">
            VER{" "}
            <span aria-hidden>
              <svg viewBox="0 0 24 24">
                <path d="M8.5 5.8v12.4a.6.6 0 0 0 .9.5l9.8-6.2a.6.6 0 0 0 0-1L9.4 5.3a.6.6 0 0 0-.9.5Z" />
              </svg>
            </span>{" "}
            REEL
          </p>
        }>
        <Reel />
      </ScrollExpand>

      {/* Proyectos */}
      <section className="lw-work">
        <div className="lw-work__head">
          <h2>Proyectos</h2>
          <p>Una selección de experiencias digitales inmersivas para marcas con ambición y equipos que miran lejos.</p>
        </div>
        {/* un segundo vídeo, suelto: acompaña al scroll por la columna de proyectos, se mece, sigue un poco al cursor y solo
            crece si se pulsa (la miniatura viaja al centro y se oye) */}
        <div className="lw-float">
          <FloatingVideo src="/video/obrador/02-masa-rodillo.mp4" poster="/video/obrador/02-masa-rodillo.jpg" label="Detrás de las cámaras" caption="Taller · 0:30" title="Ver cómo se hizo en el taller de Cénit" width="min(280px, 46vw)" tilt={-7} />
        </div>
        <div className="lw-grid">
          {PROYECTOS.map((x) => (
            <a key={x.id} className="lw-card" href={cenitHref(`proyectos/${x.id}`)}>
              <span className="lw-card__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.img} alt="" loading="lazy" />
              </span>
              <small>{x.tags.join(" · ")}</small>
              <strong>{x.titulo}</strong>
            </a>
          ))}
        </div>
        <div className="lw-center">
          <Pastilla texto="Ver todos los proyectos" href={cenitHref("proyectos")} />
        </div>
      </section>

      {/* Donde las ideas */}
      <section className="lw-where">
        {/* la cinta cian sale por la derecha junto a «See all projects», ondula bajo el titular y baja hacia la tableta (pantallas 30–33) */}
        <LineDraw className="lw-ribbon lw-ribbon--cian" tube trigger="scroll" scrollRange={[0.85, -0.8]} strokeWidth={15} color="#3fc8ef" viewBox="0 0 1440 1500" d="M1500 40C1350 20 1220 -10 1120 20C1000 60 1060 160 960 210C820 280 700 230 640 330C580 440 720 520 760 640C800 780 640 880 470 900C300 920 220 1040 300 1180C360 1280 520 1300 600 1240" />
        <h2>
          Donde las ideas
          <br />
          se vuelven
          <br />
          experiencias
        </h2>
        <div className="lw-where__text">
          <p>No perseguimos modas ni hacemos lo mismo que todos. Hacemos experiencias digitales con carácter propio, que hablan como tu marca, atrapan a tu público y se quedan en la memoria.</p>
          <p>Nuestro proceso mezcla dirección creativa, oficio 3D y desarrollo interactivo para construir recorridos a medida: originales, pulidos y pensados para dejar huella.</p>
        </div>
      </section>
      <ScrollExpand length={2.4} from={{ width: "32vw", height: "22vw" }} offset={{ x: "-22vw", y: "4vh" }} tilt={0} radius={[28, 0]} inset={0}
        overlay={<img className="lw-astro" src={`${I}astronauta.webp`} alt="Un astronauta flota en el espacio" />}>
        <video src="/video/voyager/01-tierra-desde-la-iss.mp4" muted loop playsInline autoPlay preload="metadata" />
      </ScrollExpand>
    </>
  );
}
