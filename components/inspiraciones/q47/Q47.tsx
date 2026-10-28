"use client";

import { useEffect, useState } from "react";
import LineDraw from "@/components/ui/LineDraw";
import LocalTime from "@/components/ui/LocalTime";
import { REEL, V } from "./data";
import { q47Href } from "./enlaces";

/*
 * Q47, agencia creativa: réplica de K72 (docs/50 §3.9). Portada sin scroll: un reel de vídeos que se suceden, el titular
 * con un vídeo pequeño metido como si fuera una palabra y una elipse lima dibujada (LineDraw), dos píldoras gigantes de
 * contorno y la hora de Madrid (LocalTime). El menú en escalera, el paso entre páginas con la misma escalera
 * (PageTransition stairs) y el resto de páginas, en Sitio.tsx (docs/56).
 */

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

export default function Q47() {
  return (
    <section className="q47-inicio">
      <Reel />
      <h1>
        <span className="q47-linea">LA CHISPA PARA</span>
        <span className="q47-linea">
          TODO{" "}
          <span className="q47-chip">
            <video src={`${V}costa/02-costa-oregon.mp4`} poster={`${V}costa/02-costa-oregon.jpg`} muted loop playsInline autoPlay aria-hidden />
          </span>{" "}
          LO
        </span>
        <span className="q47-linea">
          <span className="q47-creativo">
            CREATIVO
            <LineDraw shape="circle" trigger="mount" duration={1.4} delay={0.4} color="#d3fd50" strokeWidth={2} fit="stretch" className="q47-elipse" />
          </span>
        </span>
      </h1>
      <p className="q47-texto">Q47 es una agencia que construye marcas desde todos los ángulos. Hoy, mañana y dentro de muchos años. Las mejores chispas saltan cuando se sale de la zona cómoda y el roce enciende la estrategia, la marca y la comunicación con sentimiento de verdad. Decimos lo que pensamos y, cuando creemos en algo, vamos con todo.</p>
      <div className="q47-pildoras">
        <a href={q47Href("trabajo")} className="q47-pildora q47-pildora--grande">
          TRABAJO
        </a>
        <a href={q47Href("agencia")} className="q47-pildora q47-pildora--grande">
          AGENCIA
        </a>
      </div>
      <span className="q47-hora">
        <i aria-hidden>◍</i> MADRID_
        <LocalTime timeZone="Europe/Madrid" city="" seconds />
      </span>
    </section>
  );
}
