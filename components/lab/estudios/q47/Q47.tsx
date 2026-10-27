"use client";

import { useEffect, useRef, useState } from "react";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import LineDraw from "@/components/ui/LineDraw";
import LocalTime from "@/components/ui/LocalTime";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import "./q47.css";

/*
 * Q47, agencia creativa: réplica de K72 (docs/50 §3.9). Portada sin scroll: un reel de vídeos que se suceden, el titular
 * con un vídeo pequeño metido como si fuera una palabra y una elipse lima dibujada (LineDraw), dos píldoras gigantes de
 * contorno y la hora de Madrid (LocalTime). El menú se abre en escalera y cada fila gira a una banda lima con su frase
 * corriendo (FullscreenMenu reveal="stairs" linkHover="marquee"); el paso a «Trabajo» usa la misma escalera, y el
 * catálogo lleva una barra arriba que dice qué proyecto estás viendo.
 */

const V = "/video/";
const REEL = [`${V}ciudad/02-avenida-noche`, `${V}costa/01-olas-islandia`, `${V}oceano/03-delfines-hawai`, `${V}ciudad/03-budapest`, `${V}costa/03-playa-tunez`, `${V}ciudad/01-rascacielos-noche`];
const PROYECTOS = [
  { cliente: "Banco Atlántico", titulo: "Adelántate", ano: "2025", img: `${V}ciudad/01-rascacielos-noche.jpg` },
  { cliente: "Lana Norte", titulo: "Tejido en casa", ano: "2024", img: "/img/objetos/05-rustic-tulip-vase-unsplash.jpg" },
  { cliente: "Quesos Ribera", titulo: "Abre el envoltorio", ano: "2024", img: "/img/pasteleria/02-pexels-photo-132694.jpg" },
  { cliente: "Club de hockey", titulo: "Aquí, por los nuestros", ano: "2023", img: "/img/deporte/05-road-bike-race-on-sunny-day-unsplash.jpg" },
  { cliente: "Widescape", titulo: "Paisajes anchos", ano: "2022", img: `${V}costa/02-costa-oregon.jpg` },
  { cliente: "Navidad Q47", titulo: "La ventana", ano: "2022", img: `${V}ciudad/03-budapest.jpg` },
];

/** la escalera de K72: cinco columnas negras bajan escalonadas desde la derecha, cambia la vista y se retiran */
function useEscalera() {
  const [fase, setFase] = useState<"quieta" | "cubre" | "descubre">("quieta");
  const reduced = useReducedMotion();
  const ir = (cambiar: () => void) => {
    if (reduced) return cambiar();
    setFase("cubre");
    window.setTimeout(() => {
      cambiar();
      window.scrollTo(0, 0);
      setFase("descubre");
      window.setTimeout(() => setFase("quieta"), 700);
    }, 650);
  };
  const capa = (
    <div className={`q47-escalera is-${fase}`} aria-hidden>
      {[0, 1, 2, 3, 4].map((k) => <i key={k} style={{ ["--k" as string]: 4 - k }} />)}
    </div>
  );
  return { ir, capa };
}

function Reel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % REEL.length), 2800);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="q47-reel" aria-hidden>
      {REEL.map((src, k) => (
        <video key={src} src={`${src}.mp4`} poster={`${src}.jpg`} muted loop playsInline autoPlay preload="metadata" className={k === i ? "is-on" : ""} />
      ))}
    </div>
  );
}

function Trabajo({ volver }: { volver: () => void }) {
  const [vista, setVista] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setVista(Number((e.target as HTMLElement).dataset.i))), { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  const p = PROYECTOS[vista];
  return (
    <section className="q47-trabajo">
      <div className="q47-barra"><span>{p.cliente}</span><span>{p.titulo}</span><span>{p.ano}</span></div>
      <h1>TRABAJO<sup>{PROYECTOS.length}</sup></h1>
      <div className="q47-rejilla">
        {PROYECTOS.map((x, k) => (
          <a key={x.titulo} href="#trabajo" className="q47-proyecto" data-i={k} ref={(el) => { refs.current[k] = el; }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={x.img} alt={`${x.cliente}: ${x.titulo}`} loading="lazy" />
            <span className="q47-ver">VER PROYECTO</span>
          </a>
        ))}
      </div>
      <button type="button" className="q47-pildora q47-volver" onClick={volver}>INICIO</button>
    </section>
  );
}

export default function Q47() {
  const [pagina, setPagina] = useState<"inicio" | "trabajo">("inicio");
  const { ir, capa } = useEscalera();
  const a = (dest: "inicio" | "trabajo") => ir(() => setPagina(dest));

  return (
    <div className={`q47 q47--${pagina}`}>
      <header className="q47-head">
        <button type="button" className="q47-logo" onClick={() => a("inicio")} aria-label="Q47, inicio">Q47</button>
        <FullscreenMenu
          brand="Q47"
          trigger="burger"
          triggerHover="fill"
          cover
          reveal="stairs"
          linkHover="marquee"
          rules
          align="center"
          note="MADRID"
          links={[
            { label: "TRABAJO", href: "#trabajo", marquee: "LO QUE HACEMOS", images: [`${V}costa/01-olas-islandia.jpg`, `${V}ciudad/02-avenida-noche.jpg`] },
            { label: "AGENCIA", href: "#agencia", marquee: "CONÓCENOS", images: [`${V}ciudad/03-budapest.jpg`] },
            { label: "CONTACTO", href: "#contacto", marquee: "MÁNDANOS UN FAX", images: [`${V}oceano/01-arrecife.jpg`] },
            { label: "BLOG", href: "#blog", marquee: "LEE ARTÍCULOS", images: [`${V}costa/03-playa-tunez.jpg`] },
          ]}
          footer={[{ label: "FB", href: "#" }, { label: "IG", href: "#" }, { label: "IN", href: "#" }, { label: "BE", href: "#" }]}
          className="q47-menu"
        />
      </header>

      {pagina === "inicio" ? (
        <section className="q47-inicio">
          <Reel />
          <h1>
            <span className="q47-linea">LA CHISPA PARA</span>
            <span className="q47-linea">TODO <span className="q47-chip"><video src={`${V}costa/02-costa-oregon.mp4`} poster={`${V}costa/02-costa-oregon.jpg`} muted loop playsInline autoPlay aria-hidden /></span> LO</span>
            <span className="q47-linea"><span className="q47-creativo">CREATIVO<LineDraw shape="circle" trigger="mount" duration={1.4} delay={0.4} color="#d3fd50" strokeWidth={2} fit="stretch" className="q47-elipse" /></span></span>
          </h1>
          <p className="q47-texto">Q47 es una agencia que construye marcas desde todos los ángulos. Hoy, mañana y dentro de muchos años. Las mejores chispas saltan cuando se sale de la zona cómoda y el roce enciende la estrategia, la marca y la comunicación con sentimiento de verdad. Decimos lo que pensamos y, cuando creemos en algo, vamos con todo.</p>
          <div className="q47-pildoras">
            <button type="button" className="q47-pildora q47-pildora--grande" onClick={() => a("trabajo")}>TRABAJO</button>
            <a href="#agencia" className="q47-pildora q47-pildora--grande">AGENCIA</a>
          </div>
          <span className="q47-hora"><i aria-hidden>◍</i> MADRID_<LocalTime timeZone="Europe/Madrid" city="" seconds /></span>
        </section>
      ) : (
        <Trabajo volver={() => a("inicio")} />
      )}
      {capa}
    </div>
  );
}
