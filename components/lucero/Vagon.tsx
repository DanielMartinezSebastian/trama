"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AVISO, CONDICIONES, PARADAS, PLAZAS, duracion, precio } from "./data";
import { ReservaCampos } from "./ReservaCampos";
import styles from "./vagon.module.css";

const COCHES = [
  { id: "loco", nombre: "Inicio" },
  { id: "butaca", nombre: "Butacas" },
  { id: "litera", nombre: "Literas" },
  { id: "cabina", nombre: "Cabinas" },
  { id: "cafe", nombre: "Cafetería" },
  { id: "furgon", nombre: "Furgón" },
  { id: "taquilla", nombre: "Taquilla" },
];

/* Plazas ocupadas por coche: los totales libres coinciden con `PLAZAS`. */
const OCUPADAS = { butaca: [1, 4, 6, 9, 12, 13, 15, 18], litera: [1, 2, 7, 8, 10], cabina: [1, 4] };
const TOTAL = { butaca: 20, litera: 12, cabina: 5 };

function Persona({ color }: { color: string }) {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="7" fill={color} /><path d="M3 32c1-11 7-14 13-14s12 3 13 14z" fill={color} /></svg>;
}

function Asiento({ tipo, n, elegido, onElegir }: { tipo: keyof typeof OCUPADAS; n: number; elegido: boolean; onElegir: () => void }) {
  const nombre = PLAZAS.find((p) => p.id === tipo)?.nombre;
  const ocupado = OCUPADAS[tipo].includes(n);
  if (ocupado) return <span className={`${styles.asiento} ${styles.ocupado}`} role="img" aria-label={`${nombre} ${n}, ocupada`}><Persona color={["#d9482b", "#2a6f97", "#7a4fa3"][n % 3]} /></span>;
  return <button type="button" className={`${styles.asiento} ${elegido ? styles.elegido : ""}`} aria-pressed={elegido} aria-label={`${nombre} ${n}, libre`} onClick={onElegir}>{n}</button>;
}

function Coche({ id, numero, titulo, children, nota }: { id: string; numero: string; titulo: string; children: ReactNode; nota: ReactNode }) {
  return <section id={`coche-${id}`} data-coche={id} className={styles.coche} aria-label={titulo}>
    <div className={styles.rotulo}><span>{numero}</span><h2>{titulo}</h2></div>
    <div className={styles.interior}>{children}</div>
    <div className={styles.bogies} aria-hidden="true"><i /><i /><i /><i /></div>
    <div className={styles.nota}>{nota}</div>
  </section>;
}

/* El tren entero dibujado en corte lateral: se recorre de lado y la plaza se elige sobre el propio dibujo. */
export default function Vagon() {
  const via = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState("loco");
  const [plaza, setPlaza] = useState<{ tipo: keyof typeof OCUPADAS; n: number } | null>(null);
  const [origen, setOrigen] = useState("bilbao");
  const [destino, setDestino] = useState("cadiz");

  useEffect(() => {
    const el = via.current;
    if (!el) return;
    const rueda = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", rueda, { passive: false });
    const visor = new IntersectionObserver((entradas) => {
      for (const e of entradas) if (e.isIntersecting) setActivo((e.target as HTMLElement).dataset.coche ?? "loco");
    }, { root: el, rootMargin: "0px -50% 0px -50%" });
    el.querySelectorAll("[data-coche]").forEach((n) => visor.observe(n));
    return () => { el.removeEventListener("wheel", rueda); visor.disconnect(); };
  }, []);

  const ir = (id: string) => {
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(`coche-${id}`)?.scrollIntoView({ behavior: quieto ? "auto" : "smooth", inline: "center", block: "nearest" });
  };
  const datos = plaza ? PLAZAS.find((p) => p.id === plaza.tipo) : undefined;
  const importe = datos ? precio(datos, origen, destino) : 0;
  const nombre = (id: string) => PARADAS.find((p) => p.id === id)?.nombre ?? "";
  const resumen = datos && plaza ? `${datos.nombre} ${plaza.n}, ${nombre(origen)} → ${nombre(destino)}, ${importe} €` : "";
  const fija = (tipo: keyof typeof OCUPADAS, n: number) => setPlaza({ tipo, n });
  const es = (tipo: keyof typeof OCUPADAS, n: number) => plaza?.tipo === tipo && plaza.n === n;
  const numeros = (tipo: keyof typeof OCUPADAS) => Array.from({ length: TOTAL[tipo] }, (_, i) => i + 1);

  return <main className={styles.page}>
    <nav className={styles.mapa} aria-label="Coches del tren">
      {COCHES.map((c) => <button key={c.id} type="button" aria-current={activo === c.id ? "true" : undefined} onClick={() => ir(c.id)}>{c.nombre}</button>)}
    </nav>

    <div className={styles.via} ref={via} tabIndex={0} role="region" aria-label="Tren en corte lateral; se recorre de lado">
      <div className={styles.tren}>
        <section id="coche-loco" data-coche="loco" className={styles.loco} aria-label="Lucero">
          <div className={styles.morro} aria-hidden="true" />
          <div className={styles.lateral}>
            <h1>Lucero</h1>
            <p>Un hotel de cuatro coches que va de Bilbao a Cádiz mientras duermes. Cada noche a las 21:40.</p>
            <button type="button" onClick={() => ir("butaca")}>Sube y elige sitio →</button>
          </div>
          <div className={styles.bogies} aria-hidden="true"><i /><i /></div>
        </section>

        <Coche id="butaca" numero="1" titulo="Butacas" nota={<p>{PLAZAS[0].resumen} Desde {precio(PLAZAS[0], "bilbao", "miranda")} €.</p>}>
          <div className={styles.dosPisos}>{numeros("butaca").map((n) => <Asiento key={n} tipo="butaca" n={n} elegido={es("butaca", n)} onElegir={() => fija("butaca", n)} />)}</div>
        </Coche>

        <Coche id="litera" numero="2" titulo="Literas" nota={<p>{PLAZAS[1].resumen} Desde {precio(PLAZAS[1], "bilbao", "miranda")} €.</p>}>
          <div className={styles.compartimentos}>
            {[0, 4, 8].map((d) => <div key={d} className={styles.compartimento}>
              {[1, 2, 3, 4].map((i) => <Asiento key={i} tipo="litera" n={d + i} elegido={es("litera", d + i)} onElegir={() => fija("litera", d + i)} />)}
            </div>)}
          </div>
        </Coche>

        <Coche id="cabina" numero="3" titulo="Cabinas" nota={<p>{PLAZAS[2].resumen} Desde {precio(PLAZAS[2], "bilbao", "miranda")} €.</p>}>
          <div className={styles.cabinas}>
            {numeros("cabina").map((n) => <div key={n} className={styles.cabina}><Asiento tipo="cabina" n={n} elegido={es("cabina", n)} onElegir={() => fija("cabina", n)} /></div>)}
          </div>
        </Coche>

        <Coche id="cafe" numero="4" titulo="Cafetería" nota={<p>{CONDICIONES[4].texto}</p>}>
          <ul className={styles.carta}>
            <li>Abre en Miranda de Ebro</li>
            <li>Cierra al llegar a Salamanca</li>
            <li>Primeras cafeteras en Mérida</li>
            <li>{CONDICIONES[5].texto}</li>
          </ul>
        </Coche>

        <Coche id="furgon" numero="5" titulo="Furgón" nota={<p>{CONDICIONES[3].texto}</p>}>
          <ul className={styles.carga}>
            {CONDICIONES.slice(0, 3).map((c) => <li key={c.id}><b>{c.titulo}</b>{c.texto}</li>)}
          </ul>
        </Coche>

        <section id="coche-taquilla" data-coche="taquilla" className={styles.taquilla} aria-label="Taquilla">
          <h2>Taquilla</h2>
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
          <p>{duracion(origen, destino)} de viaje{datos ? ` · ${importe} €` : ""}.</p>
          <ReservaCampos className={styles.form} resumen={resumen} plaza={plaza ? "ok" : ""} variant="solid" />
          <p className={styles.aviso}>{AVISO} Otras versiones: <Link href="/lucero/horario">horario</Link> · <Link href="/lucero/ventanilla">ventanilla</Link>.</p>
        </section>
      </div>

      <ol className={styles.traviesas} aria-label="Recorrido">
        {PARADAS.map((p) => <li key={p.id}><b>{p.hora}</b>{p.nombre}</li>)}
      </ol>
    </div>

    <div className={styles.talon} aria-live="polite">
      <p>{datos && plaza ? `${datos.nombre} ${plaza.n} · ${importe} €` : "Toca una plaza libre del tren"}</p>
      <button type="button" onClick={() => ir(plaza ? "taquilla" : "butaca")}>{plaza ? "Ir a taquilla →" : "Ver plazas →"}</button>
    </div>
  </main>;
}
