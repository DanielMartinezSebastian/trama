"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AVISO, CONDICIONES, PARADAS, PLAZAS, duracion, precio, tramos } from "./data";
import { ReservaCampos } from "./ReservaCampos";
import styles from "./horario.module.css";

const eur = (n: number) => `${n} €`;

/* La página es la tabla: sin portada, sin imágenes y sin movimiento. Se reserva escribiendo sobre el propio horario. */
export default function Horario() {
  const [origen, setOrigen] = useState("bilbao");
  const [destino, setDestino] = useState<string | null>("cadiz");
  const [plaza, setPlaza] = useState("");

  const iOrigen = PARADAS.findIndex((p) => p.id === origen);
  const iDestino = destino ? PARADAS.findIndex((p) => p.id === destino) : -1;
  const elegida = PLAZAS.find((p) => p.id === plaza);

  function tocar(id: string, i: number) {
    if (destino || i <= iOrigen) { setOrigen(id === "cadiz" ? "jerez" : id); setDestino(id === "cadiz" ? "cadiz" : null); return; }
    setDestino(id);
  }

  const nombre = (id: string) => PARADAS.find((p) => p.id === id)?.nombre ?? "";
  const resumen = useMemo(() => {
    if (!destino) return "";
    return `${nombre(origen)} → ${nombre(destino)}${elegida ? `, ${elegida.nombre.toLowerCase()}, ${eur(precio(elegida, origen, destino))}` : ""}`;
  }, [origen, destino, elegida]);

  return <main className={styles.page}>
    <header className={styles.cabecera}>
      <p className={styles.tren}>921</p>
      <div>
        <h1>Lucero. Bilbao–Cádiz, todas las noches.</h1>
        <p>Toca la estación donde subes y después aquella en la que bajas.</p>
      </div>
    </header>

    <div className={styles.cuerpo}>
      <table className={styles.tabla}>
        <caption className={styles.oculto}>Paradas y horas del tren 921 Lucero</caption>
        <thead><tr><th scope="col">Hora</th><th scope="col">Estación</th><th scope="col"><span className={styles.oculto}>Tu trayecto</span></th></tr></thead>
        <tbody>
          {PARADAS.map((p, i) => {
            const extremo = i === iOrigen || i === iDestino;
            const dentro = i >= iOrigen && (destino ? i <= iDestino : i === iOrigen);
            const marca = CONDICIONES.find((c) => c.id === p.nota)?.marca;
            return <tr key={p.id} className={extremo ? styles.extremo : dentro ? styles.dentro : undefined}>
              <td className={styles.hora}>{p.hora}</td>
              <th scope="row">
                <button type="button" onClick={() => tocar(p.id, i)} aria-pressed={dentro}>
                  {p.nombre}{marca ? <sup>{marca}</sup> : null}
                </button>
              </th>
              <td className={styles.estado}>{i === iOrigen ? "Subes" : i === iDestino ? "Bajas" : ""}</td>
            </tr>;
          })}
        </tbody>
      </table>

      <aside className={styles.panel} id="reserva">
        <h2>{destino ? `${tramos(origen, destino)} tramos · ${duracion(origen, destino)}` : "¿Dónde bajas?"}</h2>
        <fieldset disabled={!destino}>
          <legend>Tarifas del trayecto, desayuno incluido</legend>
          {PLAZAS.map((p) => <label key={p.id} className={plaza === p.id ? styles.marcada : undefined}>
            <input type="radio" name="plaza" value={p.id} checked={plaza === p.id} onChange={() => setPlaza(p.id)} />
            <span><b>{p.nombre}</b><small>{p.resumen} Quedan {p.libres}.</small></span>
            <em>{destino ? eur(precio(p, origen, destino)) : "—"}</em>
          </label>)}
        </fieldset>
        <ReservaCampos className={styles.form} resumen={resumen} plaza={destino ? plaza : ""} variant="outline" etiqueta="Apartar esta plaza" />
      </aside>
    </div>

    <footer className={styles.notas}>
      <ol>
        {CONDICIONES.map((c) => <li key={c.id}><b>{c.marca}</b><span><strong>{c.titulo}.</strong> {c.texto}</span></li>)}
      </ol>
      <p>{AVISO} Otras versiones: <Link href="/lucero/vagon">vagón</Link> · <Link href="/lucero/ventanilla">ventanilla</Link>.</p>
    </footer>

    <a className={styles.barra} href="#reserva">
      {destino ? `${duracion(origen, destino)} · desde ${eur(precio(PLAZAS[0], origen, destino))}` : "Elige dónde bajas"}<span>Reservar</span>
    </a>
  </main>;
}
