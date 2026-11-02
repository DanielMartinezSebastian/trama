"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState, type WheelEvent } from "react";
import { AVISO, CONDICIONES, PARADAS, PLAZAS, duracion, precio } from "./data";
import { ReservaCampos } from "./ReservaCampos";
import { AVANCE_ANDEN, COCHES_MAQUETA, fijarPlaza, libres, paradaCoche, usePlaza } from "./maqueta-datos";
import styles from "./maqueta.module.css";

const MaquetaScene = dynamic(() => import("./MaquetaScene"), { ssr: false });
const NOMBRES = ["Butacas", "Literas", "Cabinas", "Cafetería", "Furgón"];

/* El tren a vista de maqueta: pasa bajo la cámara con el scroll y las plazas libres, encendidas, se tocan en la escena. */
export default function Maqueta() {
  const scrollEl = useRef<HTMLElement | null>(null);
  const [capitulo, setCapitulo] = useState(-1);
  const elegida = usePlaza();
  const [origen, setOrigen] = useState("bilbao");
  const [destino, setDestino] = useState("cadiz");

  const ir = (t: number) => {
    const el = scrollEl.current;
    // salto directo: ScrollControls ya amortigua el recorrido del tren
    if (el) el.scrollTop = t * (el.scrollHeight - el.clientHeight);
  };
  const seguirScroll = (e: WheelEvent<HTMLElement>) => { if (scrollEl.current) scrollEl.current.scrollTop += e.deltaY; };

  const clase = elegida ? PLAZAS[elegida.coche] : undefined;
  const importe = clase ? precio(clase, origen, destino) : 0;
  const nombre = (id: string) => PARADAS.find((p) => p.id === id)?.nombre ?? "";
  const resumen = clase && elegida ? `Coche ${elegida.coche + 1}, plaza ${elegida.n + 1}, ${nombre(origen)} → ${nombre(destino)}, ${importe} €` : "";
  const asignar = (coche: number) => fijarPlaza({ coche, n: libres(COCHES_MAQUETA[coche].plazas)[0] });

  return <main className={styles.page}>
    <div className={styles.escena}>
      <MaquetaScene scrollEl={scrollEl} onCapitulo={setCapitulo} />
    </div>

    <nav className={styles.mandos} aria-label="Coches del tren" onWheel={seguirScroll}>
      <span className={styles.marca}>Lucero</span>
      {NOMBRES.map((n, i) => <button key={n} type="button" aria-label={`Coche ${i + 1}, ${n}`} aria-current={capitulo === i ? "true" : undefined} onClick={() => ir(paradaCoche(i))}>{i + 1}</button>)}
      <button type="button" className={styles.reservar} aria-current={capitulo === 5 ? "true" : undefined} onClick={() => ir(AVANCE_ANDEN)}>Reservar</button>
    </nav>

    <aside className={styles.panel} onWheel={capitulo === 5 ? undefined : seguirScroll} aria-live="polite">
      {capitulo === -1 ? <>
        <h1>Mira el tren desde arriba y escoge tu sitio.</h1>
        <p>Lucero sale de Bilbao a las 21:40 y llega a Cádiz a las 08:40. Baja con el scroll: el tren pasa por debajo y las plazas libres están encendidas.</p>
      </> : null}

      {capitulo >= 0 && capitulo < 3 ? <>
        <p className={styles.dato}>Coche {capitulo + 1}</p>
        <h2>{PLAZAS[capitulo].nombre}</h2>
        <p>{PLAZAS[capitulo].resumen}</p>
        <p className={styles.dato}>Quedan {PLAZAS[capitulo].libres} · Bilbao–Cádiz {precio(PLAZAS[capitulo], "bilbao", "cadiz")} €</p>
        <button type="button" className={styles.boton} onClick={() => asignar(capitulo)}>Asignarme una plaza libre</button>
      </> : null}

      {capitulo === 3 ? <>
        <p className={styles.dato}>Coche 4</p>
        <h2>Cafetería</h2>
        <p>{CONDICIONES[4].texto}</p>
        <p>{CONDICIONES[5].texto}</p>
      </> : null}

      {capitulo === 4 ? <>
        <p className={styles.dato}>Coche 5</p>
        <h2>Furgón</h2>
        <dl>{CONDICIONES.slice(0, 4).map((c) => <div key={c.id}><dt>{c.titulo}</dt><dd>{c.texto}</dd></div>)}</dl>
      </> : null}

      {capitulo === 5 ? <>
        <h2>Andén</h2>
        <div className={styles.selectores}>
          <label>Subes en
            <select value={origen} onChange={(e) => { setOrigen(e.target.value); if (PARADAS.findIndex((p) => p.id === e.target.value) >= PARADAS.findIndex((p) => p.id === destino)) setDestino("cadiz"); }}>
              {PARADAS.slice(0, -1).map((p) => <option key={p.id} value={p.id}>{p.hora} · {p.nombre}</option>)}
            </select>
          </label>
          <label>Bajas en
            <select value={destino} onChange={(e) => setDestino(e.target.value)}>
              {PARADAS.slice(PARADAS.findIndex((p) => p.id === origen) + 1).map((p) => <option key={p.id} value={p.id}>{p.hora} · {p.nombre}</option>)}
            </select>
          </label>
        </div>
        <p className={styles.dato}>{duracion(origen, destino)}{clase ? ` · ${importe} €` : ""}</p>
        <ReservaCampos className={styles.form} resumen={resumen} plaza={elegida ? "ok" : ""} variant="outline" etiqueta="Reservar plaza" />
        <p className={styles.aviso}>{AVISO} Otras versiones: <Link href="/lucero/horario">horario</Link> · <Link href="/lucero/vagon">vagón</Link> · <Link href="/lucero/ventanilla">ventanilla</Link>.</p>
      </> : null}

      {capitulo !== 5 ? <p className={styles.seleccion}>{clase && elegida ? `Tu plaza: coche ${elegida.coche + 1}, número ${elegida.n + 1}` : "Aún sin plaza"}</p> : null}
    </aside>
  </main>;
}
