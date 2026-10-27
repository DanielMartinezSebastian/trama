"use client";

import PricingSection from "@/components/ui/PricingSection";
import "./vive.css";

/*
 * Vive Club: réplica de FIT AND YOU (docs/50 §3.4). Negro, blanco y naranja; condensada en mayúsculas enorme con
 * espaciado negativo y «[+]» como firma de los enlaces. Menú en isla, damero de fotos y círculos, «membresía» con el
 * círculo naranja, las clases como lista de nombres gigantes por zona, una cinta de cifras, ventajas en tarjetas
 * ladeadas alrededor del titular y los planes (PricingSection).
 */

const ZONAS = [
  { zona: "Estudio exclusivo", clases: ["TRX", "Fly-yoga", "Ciclo", "Mente y cuerpo"] },
  { zona: "Clases en grupo", clases: ["Estiramientos", "Body shape", "Yoga", "Pilates", "Dance mix"] },
  { zona: "Spa", clases: ["Masaje", "Natación", "Baño"] },
];
const VENTAJAS = [
  { n: "01", titulo: "Agua y toalla cada día", img: `/img/inspiraciones/vive/bonus-agua.webp`, giro: -8 },
  { n: "02", titulo: "Puntos para los de siempre", img: `/img/inspiraciones/vive/bonus-puntos.webp`, giro: 6 },
  { n: "03", titulo: "Invita a un amigo cada mes", img: `/img/inspiraciones/vive/bonus-amigo.webp`, giro: -4 },
  { n: "04", titulo: "Cuota a plazos sin intereses", img: `/img/inspiraciones/vive/bonus-plazos.webp`, giro: 8 },
];

export default function Vive() {
  return (
    <div className="vv">
      <header className="vv-head">
        <a href="#inicio" className="vv-logo">VIVE<span>●</span></a>
        <nav className="vv-isla" aria-label="Principal">
          <a href="#clases">Clases</a>
          <a href="#ventajas">Ventajas</a>
          <a href="#planes">Membresías</a>
          <a href="#clubes">Clubes</a>
        </nav>
        <a href="#planes" className="vv-unete">Únete [+]</a>
      </header>

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
          <a href="#planes" className="vv-bola">ÚNETE [+]</a>
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
              <ul>{z.clases.map((c) => <li key={c}><a href="#planes">{c}</a></li>)}</ul>
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
            <div><span>{v.n}</span><a href="#planes">MÁS DETALLES [+]</a></div>
          </article>
        ))}
      </section>

      <section className="vv-planes" id="planes">
        <PricingSection
          kicker="Membresías"
          title="ELIGE TU PLAN"
          subtitle="Sin matrícula. Acceso a los cuatro clubes."
          plans={"[1] Básico|50 €|/ mes|no|Sala sin entrenador;Vestuarios;Acceso a los cuatro clubes|Para empezar\n[2] Club|90 €|/ mes|no|Sala;Clases en grupo;Spa una vez al mes|El más elegido\n[3] Todo incluido|120 €|/ mes|si|Todo lo anterior;Estudio exclusivo;Spa sin límite|Para ir a por todas\n[4] Exclusivo|150 €|/ mes|no|Todo lo anterior;4 sesiones de entrenador personal|A tu medida"}
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
        <div className="vv-mapa__plano" aria-label="Mapa de los cuatro clubes">
          {[[22, 30], [48, 58], [64, 26], [78, 70]].map(([x, y], i) => (
            <i key={i} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden />
          ))}
          <div className="vv-mapa__ficha">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/inspiraciones/vive/mapa-club.webp`} alt="" />
            <p><b>VIVE CASTELLANA</b><br />Paseo de la Castellana 120, Madrid<br />castellana@vive.example</p>
          </div>
        </div>
      </section>

      <section className="vv-primero">
        <h2>PON TU <span className="vv-primero__foto" style={{ backgroundImage: `url(/img/inspiraciones/vive/primero-foto.webp)` }} aria-hidden /> FORMA<br />FÍSICA PRIMERO <span className="vv-naranja">HOY</span></h2>
        <a href="#planes" className="vv-bola vv-bola--fin">ÚNETE [+]</a>
      </section>

      <footer className="vv-pie">
        <div className="vv-pie__nav">
          <a href="#inicio" className="vv-logo">VIVE<span>●</span></a>
          <nav aria-label="Pie"><a href="#clases">Clases</a><a href="#ventajas">Ventajas</a><a href="#planes">Membresías</a><a href="#clubes">Clubes</a></nav>
          <nav aria-label="Redes"><a href="#inicio">TikTok</a><a href="#inicio">Facebook</a><a href="#inicio">Instagram</a></nav>
          <a href="#inicio" className="vv-arriba" aria-label="Volver arriba">↑</a>
        </div>
        <p className="vv-pie__lema">TÚ TIENES EL CONTROL</p>
        <div className="vv-pie__legal"><span>Castellana · Retiro · Arganzuela · Pozuelo · de 6:00 a 23:00</span><span>© 2026 Vive Club</span></div>
      </footer>
    </div>
  );
}
