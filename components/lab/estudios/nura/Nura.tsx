"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import GradientField from "@/components/ui/GradientField";
import TeamSection from "@/components/ui/TeamSection";
import { trackScroll } from "@/lib/motion/progress";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import "./nura.css";

/*
 * Nura, pelo y arte: réplica de ALICE Hair & Art (docs/50 §3.2). Una sola letra en mayúsculas pequeñas para todo, grises
 * con grano, un collage de fotos sueltas que se desenfocan al bajar, el equipo en filas con su reserva y una sala que
 * expone arte: aquí, obras generativas hechas con GradientField, el fondo de degradado de Trama.
 */

const COLLAGE = [
  { src: "/img/hebra/trabajo-corte-corto.webp", x: 0, y: 0, w: 15, alt: "Pixie oscuro con textura" },
  { src: "/img/esparta/navaja.webp", x: 28, y: 6, w: 10, alt: "Afeitado con navaja", bn: true },
  { src: "/img/hebra/equipo/vera.webp", x: 36, y: 22, w: 12, alt: "Estilista con un bol de color", bn: true },
  { src: "/img/hebra/trabajo-balayage.webp", x: 78, y: 4, w: 11, alt: "Balayage miel" },
  { src: "/img/hebra/equipo/leo.webp", x: 4, y: 64, w: 11, alt: "Estilista con un cepillo", bn: true },
  { src: "/img/hebra/trabajo-rizo.webp", x: 84, y: 52, w: 13, alt: "Rizo definido" },
];

const OBRAS: { titulo: string; tecnica: string; pieza: "mesh" | "ribbon" | "beams"; tonos: [string, string, string] }[] = [
  { titulo: "Siesta en el desierto", tecnica: "campo de degradado", pieza: "mesh", tonos: ["#ffb800", "#ff3b1f", "#1c2bd9"] },
  { titulo: "Cactus azul", tecnica: "campo de degradado", pieza: "ribbon", tonos: ["#2a4dff", "#ff6a00", "#ffd400"] },
  { titulo: "Nudo de verano", tecnica: "haces de luz", pieza: "beams", tonos: ["#ff2d6f", "#ffe600", "#1a1a6e"] },
  { titulo: "Colinas", tecnica: "campo de degradado", pieza: "beams", tonos: ["#2fbf4a", "#ffcc00", "#e2462b"] },
  { titulo: "Anillos de sol", tecnica: "cinta", pieza: "ribbon", tonos: ["#ff7a00", "#00a3ff", "#2b0f4c"] },
  { titulo: "Mediodía", tecnica: "campo de degradado", pieza: "mesh", tonos: ["#00c2a8", "#ff4fa3", "#ffe14d"] },
];

function Obra({ o }: { o: (typeof OBRAS)[number] }) {
  const tokens = { "--bg": o.tonos[2], "--fg": "#fff", "--acc": o.tonos[0], "--acc2": o.tonos[1] } as CSSProperties;
  return (
    <figure className="nu-obra" style={tokens}>
      <div className="nu-obra__lienzo">
        <GradientField kind={o.pieza} speed={0.4} intensity={1} grain />
      </div>
      <figcaption>{o.titulo} · {o.tecnica}</figcaption>
    </figure>
  );
}

export default function Nura() {
  const hero = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  // el collage se desenfoca y se funde con el fondo a medida que la portada sube
  useEffect(() => {
    const el = hero.current;
    if (!el || reduced) return;
    return trackScroll(el, (r) => {
      const p = Math.min(1, Math.max(0, -r.top / (r.height * 0.6)));
      el.style.setProperty("--nu-p", p.toFixed(3));
    });
  }, [reduced]);

  return (
    <div className="nu">
      <section className="nu-hero" ref={hero}>
        <div className="nu-collage" aria-hidden>
          {COLLAGE.map((c) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={c.src} src={c.src} alt="" className={c.bn ? "is-bn" : ""} style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%` }} />
          ))}
        </div>
        <div className="nu-linea">
          <div className="nu-marca">
            <strong>N U R A</strong>
            <span>La mezcla justa de peluquería<br />y arte en un estudio de Malasaña</span>
          </div>
          <div className="nu-conmuta" aria-label="Secciones">
            <a href="#pelo">Pelo</a>
            <span className="nu-barra" aria-hidden><i /></span>
            <a href="#arte">&amp; Arte</a>
          </div>
          <a href="#reservar" className="nu-calle">Calle del Espíritu Santo 12, MAD</a>
        </div>
        <div className="nu-manifiesto">
          <p className="nu-titulo">Creativo, auténtico y con alma</p>
          <p>Entra en un refugio tranquilo, lejos de la rutina: un lugar creativo para tu ánimo, tu cabeza y tu pelo. Sal con energía, renovada y con un peinado personal que se parezca a ti y a tu manera de vestir.</p>
        </div>
      </section>

      <section className="nu-equipo" id="pelo">
        <p className="nu-intro">Un equipo escogido de estilistas independientes, cada uno con su estilo. Atentos a lo que imaginas, juntamos creatividad y oficio para hacerte tu mejor versión.</p>
        <TeamSection
          kicker=""
          title="/ Conoce a los estilistas"
          subtitle=""
          layout="rows"
          align="left"
          photoTone="mono"
          shape="portrait"
          linkLabel="Reservar"
          rowLink
          variant="minimal"
          members={[
            { name: "Nuria Vidal", role: "@nuria.nura", bio: "Fundadora del estudio. Más de diez años en todo tipo de cortes y colores, especialista en estilos personales hechos a la medida de cada clienta.", photo: "/img/hebra/equipo/alba.webp", href: "#reservar" },
            { name: "Vera", role: "@veracolors", bio: "Diez años en el oficio. Conocida por su precisión con los rubios, las extensiones y los secados que te dejan imparable.", photo: "/img/hebra/equipo/vera.webp", href: "#reservar" },
            { name: "Leo", role: "@leo_cuts", bio: "Cortes atrevidos y de moda o clásicos que no pasan. Ideal si buscas un cambio grande o algo que dure. Experto en corte, color y tendencias.", photo: "/img/hebra/equipo/leo.webp", href: "#reservar" },
          ]}
        />
      </section>

      <section className="nu-arte" id="arte">
        <div className="nu-arte__cab">
          <span>/ Exposición actual</span>
          <a href="#arte" className="nu-vertodo">Ver todo <i aria-hidden>▶</i></a>
        </div>
        <div className="nu-sala">
          {OBRAS.map((o) => (
            <Obra key={o.titulo} o={o} />
          ))}
        </div>
      </section>

      <footer className="nu-pie" id="reservar">
        <strong className="nu-pie__marca">N U R A</strong>
        <form className="nu-form" onSubmit={(e) => e.preventDefault()}>
          <span>Pelo &nbsp; &amp; Arte</span>
          <p>Para consultas del salón o sobre arte y exposiciones: hola@nura.example o el formulario.</p>
          <label>Nombre<input name="nombre" autoComplete="name" /></label>
          <label>Correo<input name="correo" type="email" autoComplete="email" /></label>
          <label>Tu mensaje<textarea name="mensaje" rows={4} /></label>
          <button type="submit">Enviar</button>
        </form>
        <div className="nu-pie__col">
          <span>Calle del Espíritu Santo 12, MAD</span>
          <span className="nu-pie__mut">Reservar</span>
          <a href="#pelo">Nuria Vidal</a>
          <a href="#pelo">Vera</a>
          <a href="#pelo">Leo</a>
        </div>
      </footer>

      <nav className="nu-barra-fija" aria-label="Accesos">
        <a href="#reservar">Info</a>
        <a href="#reservar">hola@nura.example</a>
        <a href="#arte">@nurapeloyarte</a>
        <a href="#">Arriba ↑</a>
      </nav>
    </div>
  );
}
