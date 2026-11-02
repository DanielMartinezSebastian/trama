"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AVISO, CONDICIONES, PARADAS, PLAZAS, duracion, precio } from "./data";
import { ReservaCampos } from "./ReservaCampos";
import styles from "./ventanilla.module.css";

const NocheScene = dynamic(() => import("./NocheScene"), { ssr: false });

/* Pared del compartimento según la hora: guinda al salir, casi negra de noche, crema al llegar. */
const PARED: [number, [number, number, number]][] = [[0, [82, 24, 40]], [.16, [38, 14, 28]], [.34, [14, 10, 20]], [.7, [14, 10, 20]], [.82, [96, 52, 66]], [.92, [226, 170, 140]], [1, [250, 236, 214]]];

function pared(t: number) {
  const siguiente = PARED.findIndex((k) => k[0] > t);
  const i = siguiente < 0 ? PARED.length - 1 : Math.max(0, siguiente - 1);
  const [t0, c0] = PARED[i], [t1, c1] = PARED[Math.min(i + 1, PARED.length - 1)];
  const k = t1 > t0 ? Math.min(1, Math.max(0, (t - t0) / (t1 - t0))) : 0;
  const c = c0.map((v, n) => Math.round(v + (c1[n] - v) * k));
  const lum = c.map((v) => { const s = v / 255; return s <= .03928 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; });
  const l = .2126 * lum[0] + .7152 * lum[1] + .0722 * lum[2];
  return { fondo: `rgb(${c.join(",")})`, tinta: l > .179 ? "#1c1014" : "#fff4e4" };
}
const reloj = (t: number) => {
  const m = (21 * 60 + 40 + Math.round(t * 660)) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/* Una sola toma fija desde el asiento: el scroll hace pasar las once horas de viaje y la reserva llega al amanecer. */
export default function Ventanilla() {
  const pelicula = useRef<HTMLDivElement>(null), raiz = useRef<HTMLElement>(null), hora = useRef<HTMLParagraphElement>(null);
  const avance = useRef(0);
  const [activa, setActiva] = useState(-1);
  const [plaza, setPlaza] = useState("");

  useEffect(() => {
    const medir = () => {
      const el = pelicula.current;
      if (!el) return;
      const t = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / (el.offsetHeight - innerHeight)));
      avance.current = t;
      const { fondo, tinta } = pared(t);
      raiz.current?.style.setProperty("--pared", fondo);
      raiz.current?.style.setProperty("--tinta", tinta);
      if (hora.current) hora.current.textContent = reloj(t);
      let i = -1;
      PARADAS.forEach((p, n) => { if (t >= p.minutos / 660 - .012) i = n; });
      setActiva(t < .012 ? -1 : i);
    };
    medir();
    addEventListener("scroll", medir, { passive: true });
    addEventListener("resize", medir);
    return () => { removeEventListener("scroll", medir); removeEventListener("resize", medir); };
  }, []);

  const saltar = (minutos: number) => {
    const el = pelicula.current;
    if (!el) return;
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: el.offsetTop + (minutos / 660) * (el.offsetHeight - innerHeight), behavior: quieto ? "auto" : "smooth" });
  };
  const parada = PARADAS[activa];
  const elegida = PLAZAS.find((p) => p.id === plaza);
  const resumen = elegida ? `${elegida.nombre}, Bilbao-Abando → Cádiz, ${precio(elegida, "bilbao", "cadiz")} €` : "";

  return <main ref={raiz} className={styles.page} data-scrollable>
    <div ref={pelicula} className={styles.pelicula}>
      <div className={styles.toma}>
        <header className={styles.arriba}>
          <span className={styles.marca}>Lucero</span>
          <p ref={hora} className={styles.reloj} aria-hidden="true">21:40</p>
          <a className={styles.cta} href="#reserva">Reservar</a>
        </header>

        <div className={styles.ventana}>
          <NocheScene avance={avance} />
          <i className={styles.cristal} aria-hidden="true" />
        </div>

        <nav className={styles.rail} aria-label="Paradas del viaje">
          {PARADAS.map((p, i) => <button key={p.id} type="button" aria-current={i === activa ? "true" : undefined} onClick={() => saltar(p.minutos)}><b>{p.hora}</b><span>{p.nombre}</span></button>)}
        </nav>

        <div className={styles.subtitulo} aria-live="off">
          {parada
            ? <p key={parada.id}><b>{parada.nombre}, {parada.hora}.</b> {parada.escena}</p>
            : <h1>Te duermes en Bilbao. Despiertas en Cádiz.</h1>}
        </div>
      </div>
    </div>

    <section id="reserva" className={styles.anden}>
      <div className={styles.columna}>
        <h2>Buenos días. Ya puedes reservar la próxima noche.</h2>
        <p>Once horas, once paradas y un desayuno. Precios del viaje entero, de Bilbao a Cádiz ({duracion("bilbao", "cadiz")}).</p>
        <div className={styles.plazas} role="radiogroup" aria-label="Elige dónde dormir">
          {PLAZAS.map((p) => <button key={p.id} type="button" role="radio" aria-checked={plaza === p.id} onClick={() => setPlaza(p.id)}>
            <b>{p.nombre}</b><em>{precio(p, "bilbao", "cadiz")} €</em><span>{p.resumen} Quedan {p.libres}.</span>
          </button>)}
        </div>
        <ReservaCampos className={styles.form} resumen={resumen} plaza={plaza} variant="editorial" etiqueta="Guardar mi noche" />
      </div>
      <div className={styles.columna}>
        <h3>Las paradas</h3>
        <ol className={styles.lista}>{PARADAS.map((p) => <li key={p.id}><span>{p.hora}</span>{p.nombre}</li>)}</ol>
        <h3>Antes de subir</h3>
        <dl className={styles.dudas}>{CONDICIONES.map((c) => <div key={c.id}><dt>{c.titulo}</dt><dd>{c.texto}</dd></div>)}</dl>
        <p className={styles.aviso}>{AVISO} Otras versiones: <Link href="/lucero/horario">horario</Link> · <Link href="/lucero/vagon">vagón</Link>.</p>
      </div>
    </section>
  </main>;
}
