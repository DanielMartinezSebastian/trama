"use client";

import PricingSection from "@/components/ui/PricingSection";
import "./vive.css";

/*
 * Vive Club: réplica de FIT AND YOU (docs/50 §3.4). Negro, blanco y naranja; condensada en mayúsculas enorme con
 * espaciado negativo y «[+]» como firma de los enlaces. Menú en isla, damero de fotos y círculos, «membresía» con el
 * círculo naranja, las clases como lista de nombres gigantes por zona, una cinta de cifras, ventajas en tarjetas
 * ladeadas alrededor del titular y los planes (PricingSection).
 */

const F = "/img/forja/";
const C = "/img/cadencia/";
const ZONAS = [
  { zona: "Estudio exclusivo", clases: ["TRX", "Fly-yoga", "Ciclo", "Mente y cuerpo"] },
  { zona: "Clases en grupo", clases: ["Estiramientos", "Body shape", "Yoga", "Pilates", "Dance mix"] },
  { zona: "Spa", clases: ["Masaje", "Natación", "Baño"] },
];
const VENTAJAS = [
  { n: "01", titulo: "Agua y toalla cada día", img: `${C}equipo/dani.webp`, giro: -8 },
  { n: "02", titulo: "Puntos para los de siempre", img: `${F}fuerza.webp`, giro: 6 },
  { n: "03", titulo: "Invita a un amigo cada mes", img: `${C}equipo/ines.webp`, giro: -4 },
  { n: "04", titulo: "Cuota a plazos sin intereses", img: `${C}fuerza.webp`, giro: 8 },
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
        <img src={`${F}sala.webp`} alt="La sala del club con luces lineales en el techo" />
      </section>

      <section className="vv-damero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${C}grupo.webp`} alt="" />
        <span className="vv-circulo">Entrenamiento<br />personal sin igual</span>
        <i aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${F}grupo.webp`} alt="" />
        <i aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${C}local.webp`} alt="" />
        <i aria-hidden />
        <span className="vv-circulo">Clases en grupo<br />como ninguna</span>
      </section>

      <section className="vv-memb">
        <h2>MEMBRESÍA<br /><span className="vv-con">CON <b aria-hidden>✕</b></span> <span className="vv-naranja">MÁS VENTAJAS</span></h2>
        <div className="vv-memb__foto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${F}recovery.webp`} alt="" />
          <a href="#planes" className="vv-bola">ÚNETE [+]</a>
        </div>
      </section>

      <section className="vv-clases" id="clases">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${F}pesado.webp`} alt="" className="vv-clases__fondo" />
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
          plans={"Básico|50 €|/ mes|no|Sala sin entrenador;Vestuarios|Para empezar\nClub|90 €|/ mes|si|Sala;Clases en grupo;Spa una vez al mes|El más elegido\nPremium|120 €|/ mes|no|Todo lo anterior;Estudio exclusivo;Spa sin límite|Para ir a por todas\nPersonal|150 €|/ mes|no|Todo lo anterior;4 sesiones de entrenador personal|A tu medida"}
          variant="minimal"
          cta="Únete [+]"
          className="vv-precios"
        />
      </section>

      <footer className="vv-pie" id="clubes">
        <div><b>4 CLUBES</b><p>Castellana · Retiro · Arganzuela · Pozuelo</p></div>
        <div><p>De 6:00 a 23:00 · todos los días</p><p>© 2026 Vive Club. Todos los derechos reservados.</p></div>
        <a href="#planes" className="vv-unete">Únete [+]</a>
      </footer>
    </div>
  );
}
