"use client";

import PricingSection from "@/components/ui/PricingSection";
import { PLANES, VENTAJAS } from "./data";
import { MapaClubes } from "./MapaClubes";
import { viveHref } from "./enlaces";

/*
 * Portada de Vive Club: réplica de FIT AND YOU (docs/50 §3.4); cabecera, pie y demás páginas en Sitio.tsx (docs/56). Negro, blanco y naranja; condensada en mayúsculas enorme con
 * espaciado negativo y «[+]» como firma de los enlaces. Menú en isla, damero de fotos y círculos, «membresía» con el
 * círculo naranja, las clases como lista de nombres gigantes por zona, una cinta de cifras, ventajas en tarjetas
 * ladeadas alrededor del titular y los planes (PricingSection).
 */

const ZONAS = [
  { zona: "Estudio exclusivo", clases: ["TRX", "Fly-yoga", "Ciclo", "Mente y cuerpo"] },
  { zona: "Clases en grupo", clases: ["Estiramientos", "Body shape", "Yoga", "Pilates", "Dance mix"] },
  { zona: "Spa", clases: ["Masaje", "Natación", "Baño"] },
];

export default function Vive() {
  return (
    <>

      <section className="vv-hero" id="inicio">
        <h1>NO ES FITNESS.<br /><span>ES VIDA.</span></h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/inspiraciones/vive/portada-sala.webp`} alt="La sala del club con luces lineales en el techo" />
      </section>

      <section className="vv-damero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/inspiraciones/vive/damero-personal.webp`} alt="" />
        <span className="vv-circulo">Entrenamiento<br />personal sin igual</span>
        <i aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/inspiraciones/vive/damero-clase.webp`} alt="" />
        <i aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/inspiraciones/vive/damero-club.webp`} alt="" />
        <i aria-hidden />
        <span className="vv-circulo">Clases en grupo<br />como ninguna</span>
      </section>

      <section className="vv-memb">
        <h2>MEMBRESÍA<br /><span className="vv-con">CON <b aria-hidden>✕</b></span> <span className="vv-naranja">MÁS VENTAJAS</span></h2>
        <div className="vv-memb__foto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/img/inspiraciones/vive/membresia-spa.webp`} alt="" />
          <a href={viveHref("membresias")} className="vv-bola">ÚNETE [+]</a>
        </div>
      </section>

      <section className="vv-clases" id="clases">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/inspiraciones/vive/clases-fondo.webp`} alt="" className="vv-clases__fondo" />
        <h2>NUESTRAS<br />CLASES</h2>
        <div className="vv-zonas">
          {ZONAS.map((z) => (
            <div key={z.zona}>
              <small>{z.zona}</small>
              <ul>{z.clases.map((c) => <li key={c}><a href={viveHref(`clases?zona=${encodeURIComponent(z.zona)}`)}>{c}</a></li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <div className="vv-cifras" aria-label="4 clubes, 45 minutos de entreno, 20 actividades">
        <div className="vv-cifras__pista" aria-hidden>
          {Array.from({ length: 2 }, (_, k) => (
            <span key={k}><b>4</b> CLUBES <b>45</b> MIN DE ENTRENO <b>20</b> ACTIVIDADES</span>
          ))}
        </div>
      </div>

      <section className="vv-ventajas" id="ventajas">
        <h2><span className="vv-naranja">VENTAJAS</span><br /><b aria-hidden>✕</b><br />PARA TI</h2>
        {VENTAJAS.map((v, i) => (
          <article key={v.n} className={`vv-carta vv-carta--${i}`} style={{ rotate: `${v.giro}deg` }}>
            <h3>{v.titulo}</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.img} alt="" loading="lazy" />
            <div><span>{v.n}</span><a href={viveHref(`ventajas#v${v.n}`)}>MÁS DETALLES [+]</a></div>
          </article>
        ))}
      </section>

      <section className="vv-planes" id="planes">
        <PricingSection
          kicker="Membresías"
          title="ELIGE TU PLAN"
          subtitle="Sin matrícula. Acceso a los cuatro clubes."
          plans={PLANES.map((p) => ({ name: p.nombre, price: `${p.price} €`, period: "/ mes", features: p.features, description: p.texto, highlighted: p.highlight, href: viveHref(`membresias?plan=${p.id}`) }))}
          variant="minimal"
          cta="Compra [+]"
          badge=""
          highlight="invert"
          className="vv-precios"
        />
      </section>

      {/* el final de FIT AND YOU: el club más cercano en un mapa, «pon tu forma física primero» con una foto en la línea,
          el círculo «únete» y el pie «tú tienes el control» */}
      <section className="vv-mapa" id="clubes">
        <h2>ENCUENTRA<br />TU CLUB<br />MÁS CERCANO</h2>
        <MapaClubes />
      </section>

      <section className="vv-primero">
        <h2>PON TU <span className="vv-primero__foto" style={{ backgroundImage: `url(/img/inspiraciones/vive/primero-foto.webp)` }} aria-hidden /> FORMA<br />FÍSICA PRIMERO <span className="vv-naranja">HOY</span></h2>
        <a href={viveHref("membresias")} className="vv-bola vv-bola--fin">ÚNETE [+]</a>
      </section>

    </>
  );
}
