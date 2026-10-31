"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Button from "@/components/ui/Button";
import PolarisScene from "./PolarisScene";
import "./polaris.css";

type Expedition = { id: string; title: string; kind: string; year: string; location: string; image: string; alt: string; note: string; index: string };
const expeditions: Expedition[] = [
  { id: "marea-cero", title: "Marea cero", kind: "Terreno", year: "2026", location: "Plataforma Nansen · 74° S", image: "/images/polaris/ice-shelf.webp", alt: "Investigadora ante una grieta de hielo azul en una plataforma polar", note: "Una grieta de dos kilómetros cambia de forma cada hora. El equipo registra su pulso térmico y la deriva de la plataforma.", index: "01" },
  { id: "debajo-del-azul", title: "Debajo del azul", kind: "Instrumentación", year: "2025", location: "Fosa de Linde · 68° S", image: "/images/polaris/sensor-beneath-ice.webp", alt: "Dos especialistas bajan un sensor luminoso dentro de una profunda grieta glaciar", note: "Una red de sensores mide las corrientes que recorren el hielo por dentro, lejos de la luz y de la señal satelital.", index: "02" },
  { id: "noche-clara", title: "Noche clara", kind: "Terreno", year: "2025", location: "Campamento Aurora · 71° S", image: "/images/polaris/aurora-camp.webp", alt: "Tres personas avanzan sobre una cresta bajo una aurora boreal y junto a una estación polar", note: "Durante seis noches, tres estaciones sincronizan el movimiento de la nieve con la actividad de la aurora.", index: "03" },
];
const filters = ["Todo", "Terreno", "Instrumentación"];

export default function PolarisLanding() {
  const [filter, setFilter] = useState("Todo");
  const [selected, setSelected] = useState<Expedition | null>(null);
  const [sent, setSent] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [act, setAct] = useState(0);
  const [flash, setFlash] = useState(0);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const trigger = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const restoreFocus = useRef(false);
  const visible = expeditions.filter((item) => filter === "Todo" || item.kind === filter);
  const closeExpedition = () => { restoreFocus.current = true; setSelected(null); };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => {
      const next = Math.min(3, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
      progress.current = next;
      const currentAct = Math.min(3, Math.floor(next + 0.12));
      setAct((previous) => {
        if (previous === currentAct) return previous;
        setFlash((n) => n + 1);
        return currentAct;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    if (!selected && restoreFocus.current) {
      restoreFocus.current = false;
      trigger.current?.focus();
    }
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeExpedition();
      else if (event.key === "Tab") { event.preventDefault(); closeButton.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); };
  }, [selected]);

  const movePointer = (event: PointerEvent<HTMLDivElement>) => {
    pointer.current = {
      x: (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1,
      y: 1 - (event.clientY / Math.max(1, window.innerHeight)) * 2,
    };
  };

  const theme = {
    "--polaris-ink": "#08131c",
    "--polaris-frost": "#c6edf3",
    "--polaris-signal": "#ff784d",
    "--bg": "#08131c",
    "--fg": "#f1f4f6",
    "--mut": "#bdc9ce",
    "--acc": "#ff784d",
    "--acc2": "#90d9e5",
    "--card": "#14232d",
    "--ln": "rgba(220,244,248,.24)",
  } as CSSProperties;

  return (
    <div className="polaris-shell" style={theme} onPointerMove={movePointer} data-act={act}>
      <div className="polaris-world" aria-hidden="true" data-ready={reduced ? "reduced" : undefined}>
        <img className="polaris-world-fallback" src="/images/polaris/ice-shelf.webp" alt="" />
        <Canvas
            className="polaris-world-canvas"
            camera={{ position: [0, 0, 10], fov: 38, near: 0.1, far: 70 }}
            dpr={[1, 1.35]}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
            frameloop="always"
            fallback={null}
            onCreated={({ gl }) => { if (gl.getContext()) document.querySelector(".polaris-world")?.setAttribute("data-ready", "true"); }}
          >
            <PolarisScene progress={progress} pointer={pointer} reduced={reduced} />
        </Canvas>
        <div className="polaris-world-shade" />
      </div>
      <div key={flash} className="polaris-scene-cut" aria-hidden="true" />

      <header className="polaris-header">
        <a className="polaris-mark" href="#superficie" aria-label="POLARIS, inicio"><span>POLARIS</span><i>◉</i></a>
        <span className="polaris-header-coordinate">ARCHIVO DE CAMPO / ANTÁRTIDA</span>
        <nav aria-label="Navegación principal">
          <a href="#registro">Registros <span>0{Math.min(act + 1, 3)}</span></a>
          <a href="#estacion">La estación</a>
          <a href="#contacto">Contacto <span>↗</span></a>
        </nav>
      </header>

      <main className="polaris-story">
        <section className="polaris-act polaris-act--surface" id="superficie" aria-labelledby="polaris-title">
          <div className="polaris-act-index"><span>CAMPO / 01</span><span>74° SUR · NANSEN</span></div>
          <div className="polaris-hero-copy">
            <p className="polaris-kicker"><i /> ARCHIVO SONORO DE CAMPO</p>
            <h1 id="polaris-title">Oímos<br /><em>moverse</em><br />el hielo.</h1>
            <p>Un observatorio ficticio escucha las corrientes que circulan bajo la Antártida. Cada señal abre una ruta nueva.</p>
            <Button label="Descender al registro" href="#registro" variant="outline" emphasis="outline" glyph="↓" className="polaris-cta" />
          </div>
          <div className="polaris-act-foot"><span>ESTACIÓN MÓVIL 04 · EN VIVO</span><span>GIRA EL CAMPO CON EL PUNTERO</span><span>01 — 03</span></div>
        </section>

        <section className="polaris-act polaris-act--listening" aria-labelledby="listening-title">
          <div className="polaris-act-index"><span>SEÑAL / 02</span><span>CAPA DE PRESIÓN</span></div>
          <div className="polaris-chapter-copy">
            <p className="polaris-kicker">LO QUE EL SATÉLITE NO ALCANZA</p>
            <h2 id="listening-title">A 18 metros,<br /><em>la señal se abre.</em></h2>
            <p>La sonda avanza por una grieta que no aparece en los mapas. El campo se pliega alrededor del sensor y deja oír el agua atrapada.</p>
            <span className="polaris-chapter-data"><b>18 m</b> PROFUNDIDAD DEL SENSOR <i /> −31° TEMPERATURA EN SUPERFICIE</span>
          </div>
          <span className="polaris-orbit-label">NIVEL 02 · 32.4 HZ</span>
          <div className="polaris-act-foot"><span>DESCENSO / 00:14</span><span>LA MALLA SE ABRE CON EL RECORRIDO</span><span>02 — 03</span></div>
        </section>

        <section className="polaris-act polaris-act--echo" id="estacion" aria-labelledby="echo-title">
          <div className="polaris-act-index"><span>SEÑAL / 03</span><span>ECO DE RETORNO</span></div>
          <div className="polaris-chapter-copy polaris-chapter-copy--right">
            <p className="polaris-kicker">LA CÁMARA INTERIOR</p>
            <h2 id="echo-title">El hielo<br />también <em>responde.</em></h2>
            <p>Cuando los fragmentos se separan, el micrófono encuentra una cámara hueca. El eco dibuja una forma que solo dura unos segundos.</p>
            <a className="polaris-text-link" href="#registro">Escuchar tres registros <span>↘</span></a>
          </div>
          <div className="polaris-act-foot"><span>CAMPO ABIERTO · 06:42 UTC</span><span>LA LUZ SIGUE A LA CORRIENTE</span><span>03 — 03</span></div>
        </section>

        <section className="polaris-register" id="registro" aria-labelledby="register-title">
          <div className="polaris-register-head">
            <div><p className="polaris-kicker">CUADERNOS DE CAMPO / 2024—2026</p><h2 id="register-title">Señales<br /><em>recibidas.</em></h2></div>
            <p>Fragmentos de expedición traducidos a imágenes, mediciones y notas de quienes llegaron hasta el borde.</p>
          </div>
          <div className="polaris-filters" role="group" aria-label="Filtrar registros">
            {filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}<sup>{item === "Todo" ? "03" : String(expeditions.filter((entry) => entry.kind === item).length).padStart(2, "0")}</sup></button>)}
            <span>{visible.length} señales</span>
          </div>
          <ol className="polaris-record-list">
            {visible.map((item) => (
              <li key={item.id}>
                <button className="polaris-record" type="button" onClick={(event) => { trigger.current = event.currentTarget; setSelected(item); }} aria-label={`Abrir registro: ${item.title}`}>
                  <span className="polaris-record-index">{item.index}</span>
                  <span className="polaris-record-image"><img src={item.image} alt="" loading="lazy" /><i aria-hidden="true">↗</i></span>
                  <span className="polaris-record-title"><small>{item.kind.toUpperCase()} · {item.year}</small><b>{item.title}</b><span>{item.location}</span></span>
                  <span className="polaris-record-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
                </button>
              </li>
            ))}
          </ol>
          <p className="polaris-register-note">ARCHIVO FICTICIO · NO SON DATOS CIENTÍFICOS REALES</p>
        </section>

        <section className="polaris-contact" id="contacto" aria-labelledby="contact-title">
          <div><p className="polaris-kicker">UNA FRECUENCIA ABIERTA</p><h2 id="contact-title">Trae una<br /><em>pregunta.</em></h2><p>Recibe el próximo cuaderno de campo o propón una colaboración para seguir escuchando.</p></div>
          <form onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
            <label>Tu correo<input type="email" required placeholder="nombre@ejemplo.com" /></label>
            <label>¿Qué quieres escuchar?<select defaultValue="Cuaderno de campo"><option>Cuaderno de campo</option><option>Colaboración científica</option><option>Archivo visual</option></select></label>
            <button type="submit">{sent ? "Solicitud anotada ✓" : "Sintonizar el cuaderno ↗"}</button>
            <small>{sent ? "Confirmación de muestra. No se han enviado ni guardado tus datos." : "Formulario de demostración: no envía datos ni activa una suscripción."}</small>
          </form>
        </section>
      </main>

      <footer className="polaris-footer"><a className="polaris-mark" href="#superficie">POLARIS<i>◉</i></a><span>OBSERVATORIO DE CAMPO · DEMO FICTICIA</span><a href="#superficie">VOLVER A LA SUPERFICIE ↑</a><span>© 2026 · SIN DATOS REALES DE CAMPO</span></footer>

      {selected && <div className="polaris-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeExpedition(); }}>
        <section className="polaris-modal" role="dialog" aria-modal="true" aria-labelledby="expedition-title">
          <button ref={closeButton} className="polaris-modal-close" type="button" onClick={closeExpedition} aria-label="Cerrar registro">×</button>
          <img src={selected.image} alt={selected.alt} />
          <div><p className="polaris-kicker">{selected.kind.toUpperCase()} · {selected.year} · {selected.location}</p><h2 id="expedition-title">{selected.title}</h2><p>{selected.note}</p><small>RELATO Y EXPEDICIÓN FICTICIOS · NO SON DATOS CIENTÍFICOS REALES</small></div>
        </section>
      </div>}

      <div className="polaris-world-labels" aria-hidden="true"><span>{["SUPERFICIE", "DESCENSO", "CÁMARA", "ARCHIVO"][act]}</span><i>{String(Math.floor(progress.current * 32 + 1)).padStart(3, "0")} / 128</i></div>
    </div>
  );
}
