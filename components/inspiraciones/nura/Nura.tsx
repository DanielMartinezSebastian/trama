"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import GradientField from "@/components/ui/GradientField";
import TeamSection from "@/components/ui/TeamSection";
import { trackScroll } from "@/lib/motion/progress";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { ESTILISTAS, OBRAS, type Obra as ObraDatos } from "./data";
import { nuraHref } from "./enlaces";

/*
 * Portada de Nura, pelo y arte: réplica de ALICE Hair & Art (docs/50 §3.2); el pie, la barra fija y las demás páginas,
 * en Sitio.tsx (docs/56). Una sola letra en mayúsculas pequeñas para todo, grises
 * con grano, un collage de fotos sueltas que se desenfocan al bajar, el equipo en filas con su reserva y una sala que
 * expone arte: aquí, obras generativas hechas con GradientField, el fondo de degradado de Trama.
 */

const COLLAGE = [
  { src: "/img/inspiraciones/nura/collage-pixie.webp", x: 0, y: 0, w: 15, alt: "Pixie oscuro con textura" },
  { src: "/img/inspiraciones/nura/collage-secado.webp", x: 28, y: 6, w: 10, alt: "Afeitado con navaja", bn: true },
  { src: "/img/inspiraciones/nura/collage-bol.webp", x: 36, y: 22, w: 12, alt: "Estilista con un bol de color", bn: true },
  { src: "/img/inspiraciones/nura/collage-platino.webp", x: 78, y: 4, w: 11, alt: "Balayage miel" },
  { src: "/img/inspiraciones/nura/collage-cepillo.webp", x: 4, y: 64, w: 11, alt: "Estilista con un cepillo", bn: true },
  { src: "/img/inspiraciones/nura/collage-rizo.webp", x: 84, y: 52, w: 13, alt: "Rizo definido" },
];


/** una obra de la sala: su lienzo generativo con los tonos de la obra; enlaza a su ficha */
export function Obra({ o, grande = false }: { o: ObraDatos; grande?: boolean }) {
  const tokens = { "--bg": o.tonos[2], "--fg": "#fff", "--acc": o.tonos[0], "--acc2": o.tonos[1] } as CSSProperties;
  const lienzo = (
    <div className="nu-obra__lienzo">
      <GradientField kind={o.pieza} speed={0.4} intensity={1} grain />
    </div>
  );
  if (grande) return <div className="nu-obra nu-obra--grande" style={tokens}>{lienzo}</div>;
  return (
    <a href={nuraHref(`arte/${o.slug}`)} className="nu-obra" style={tokens}>
      {lienzo}
      <span className="nu-obra__pie">{o.titulo} · {o.tecnica}{o.vendida ? " · vendida" : ""}</span>
    </a>
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
    <>
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
            <a href={nuraHref("pelo")}>Pelo</a>
            <span className="nu-barra" aria-hidden><i /></span>
            <a href={nuraHref("arte")}>&amp; Arte</a>
          </div>
          <a href={nuraHref("info")} className="nu-calle">Calle del Espíritu Santo 12, MAD</a>
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
          members={ESTILISTAS.map((e) => ({ name: e.name, role: e.ig, bio: e.bio, photo: e.photo, href: nuraHref(`reservar?estilista=${encodeURIComponent(e.name)}`) }))}
        />
      </section>

      <section className="nu-arte" id="arte">
        <div className="nu-arte__cab">
          <span>/ Exposición actual</span>
          <a href={nuraHref("arte")} className="nu-vertodo">Ver todo <i aria-hidden>▶</i></a>
        </div>
        <div className="nu-sala">
          {OBRAS.map((o) => (
            <Obra key={o.slug} o={o} />
          ))}
        </div>
      </section>

    </>
  );
}
