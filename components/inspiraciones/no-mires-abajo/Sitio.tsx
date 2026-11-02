"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ACCIONES, INICIO, META, PASOS, type Accion } from "./data";
import { abajoHref } from "./enlaces";
import Multitud, { type Escena } from "./Multitud";
import "./no-mires-abajo.css";

/*
 * No mires abajo (docs/58), a partir de Don't Look Up: un juego satírico de gestión en el navegador, todo a tinta sobre papel.
 * Eres enorme, multimillonario y vives sobre una multitud: la comisión da dinero y enfada; las decisiones gastan dinero y
 * calman. Se gana con un billón y se pierde si el enfado llega a 100. Es jugable de principio a fin y guarda la clasificación.
 */

const CLAVE = "trama:no-mires-abajo:clasificacion";
type Marca = { nombre: string; segundos: number; dinero: number; gano: boolean };

const leer = (): Marca[] => {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

export const dinero = (n: number) => {
  const a = Math.abs(n);
  const s = (x: number, u: string) => `${x.toLocaleString("es-ES", { maximumFractionDigits: x < 100 ? 1 : 0 })} ${u}`;
  if (a >= 1e12) return s(n / 1e12, "B €");
  if (a >= 1e9) return s(n / 1e9, "mM €");
  if (a >= 1e6) return s(n / 1e6, "M €");
  return `${Math.round(n).toLocaleString("es-ES")} €`;
};
const reloj = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function Shell({ children }: { children: ReactNode }) {
  return <div className="na">{children}</div>;
}

function Titulo() {
  const escena = useRef<Escena>({ gente: 34, enfado: 8 });
  return (
    <main className="na-portada">
      <Multitud escena={escena} className="na-lienzo" />
      <div className="na-portada__txt">
        <h1>
          NO
          <br />
          MIRES
          <br />
          ABAJO
        </h1>
        <p>Eres enorme, muy rico y estás de pie encima de bastante gente.</p>
        <div className="na-botones">
          <a href={abajoHref("jugar")} className="na-boton na-boton--negro">
            JUGAR
          </a>
          <a href={abajoHref("como-jugar")} className="na-boton">
            CÓMO SE JUEGA
          </a>
        </div>
        <nav aria-label="Más">
          <a href={abajoHref("clasificacion")}>Clasificación</a>
          <a href={abajoHref("creditos")}>Créditos</a>
        </nav>
      </div>
    </main>
  );
}

function Jugar() {
  const escena = useRef<Escena>({ gente: INICIO.gente, enfado: INICIO.enfado });
  const [fase, setFase] = useState<"juego" | "gano" | "tirado">("juego");
  const [pausa, setPausa] = useState(false);
  const [din, setDin] = useState(INICIO.dinero);
  const [gente, setGente] = useState(INICIO.gente);
  const [enfado, setEnfado] = useState(INICIO.enfado);
  const [comision, setComision] = useState(INICIO.comision);
  const [multi, setMulti] = useState(1);
  const [usadas, setUsadas] = useState<string[]>([]);
  // repetir una decisión sale cada vez más caro: si no, la distracción anularía el enfado
  const coste = (a: Accion) => a.coste * 1.7 ** usadas.filter((u) => u === a.id).length;
  const [t, setT] = useState(0);
  const [nombre, setNombre] = useState("");
  const [guardado, setGuardado] = useState(false);
  const est = useRef({ din, gente, enfado, comision, multi });
  est.current = { din, gente, enfado, comision, multi };

  const ingreso = gente * comision * multi * 2e5;
  // la comisión enfada más cuanto más alta; los sueldos (`multi` < 1) rebajan un poco
  const subida = (c: number) => Math.max(0, (c - 2) * 0.11);

  useEffect(() => {
    if (fase !== "juego" || pausa) return;
    const id = setInterval(() => {
      const e = est.current;
      const nd = e.din + e.gente * e.comision * e.multi * 2e5 * 0.2;
      const ne = Math.min(100, e.enfado + subida(e.comision) * 0.2);
      setDin(nd);
      setEnfado(ne);
      setGente((g) => g + (e.comision < 15 ? 0.05 : -0.02));
      setT((x) => x + 0.2);
      escena.current = { gente: e.gente, enfado: ne };
      if (nd >= META) setFase("gano");
      else if (ne >= 100) setFase("tirado");
    }, 200);
    return () => clearInterval(id);
  }, [fase, pausa]);

  const decidir = (a: Accion) => {
    setDin((d) => d - coste(a));
    setEnfado((e) => Math.max(0, Math.min(100, e + a.enfado)));
    setGente((g) => g + a.gente);
    setMulti((m) => m * a.multi);
    setUsadas((u) => [...u, a.id]);
  };

  const reiniciar = () => {
    setFase("juego");
    setPausa(false);
    setDin(INICIO.dinero);
    setGente(INICIO.gente);
    setEnfado(INICIO.enfado);
    setComision(INICIO.comision);
    setMulti(1);
    setUsadas([]);
    setT(0);
    setGuardado(false);
    escena.current = { gente: INICIO.gente, enfado: INICIO.enfado };
  };

  const peligro = enfado > 70;
  return (
    <main className={`na-juego ${peligro ? "is-peligro" : ""}`}>
      <Multitud escena={escena} className="na-lienzo" />
      <header className="na-marcador">
        <div>
          <b data-testid="dinero">{dinero(din)}</b>
          <small>{dinero(ingreso)} por segundo</small>
        </div>
        <div>
          <b>{dinero(META)}</b>
          <small>objetivo</small>
        </div>
        <div>
          <b>{reloj(t)}</b>
          <small>tiempo</small>
        </div>
        <div className="na-enfado">
          <small>Enfado de la gente: {Math.round(enfado)} %</small>
          <span role="progressbar" aria-label="Enfado" aria-valuenow={Math.round(enfado)} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${enfado}%` }} />
          </span>
        </div>
        <button type="button" className="na-boton" onClick={() => setPausa(!pausa)}>
          {pausa ? "SEGUIR" : "PAUSA"}
        </button>
      </header>

      <section className="na-panel" aria-label="Decisiones">
        <label className="na-comision">
          Comisión: <b>{comision} %</b>
          <input type="range" min={1} max={30} value={comision} onChange={(e) => setComision(Number(e.target.value))} />
          <small>{comision > 14 ? "ellos lo notan" : "casi ni se nota"}</small>
        </label>
        <ul>
          {ACCIONES.filter((a) => a.repetible || !usadas.includes(a.id)).map((a) => (
            <li key={a.id}>
              <button type="button" disabled={din < coste(a) || fase !== "juego"} onClick={() => decidir(a)}>
                <b>{a.nombre}</b>
                <span>{a.nota}</span>
                <em>{dinero(coste(a))}</em>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {fase !== "juego" && (
        <div className="na-fin" role="dialog" aria-modal="true" aria-label="Fin de la partida">
          <div>
            <h2>{fase === "gano" ? "UN BILLÓN" : "TE HAN TIRADO"}</h2>
            <p>{fase === "gano" ? `Lo has conseguido en ${reloj(t)}. Mira alrededor. No hay nadie.` : `Duraste ${reloj(t)}. Llevabas ${dinero(din)}, que ya no es tuyo.`}</p>
            {guardado ? (
              <a href={abajoHref("clasificacion")} className="na-boton">
                VER LA CLASIFICACIÓN
              </a>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  try {
                    const lista = [...leer(), { nombre: nombre.trim() || "Anónimo", segundos: Math.round(t), dinero: din, gano: fase === "gano" }];
                    localStorage.setItem(CLAVE, JSON.stringify(lista));
                  } catch {
                    /* sin almacenamiento */
                  }
                  setGuardado(true);
                }}
              >
                <label>
                  Tu nombre
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={20} />
                </label>
                <button type="submit" className="na-boton">
                  GUARDAR
                </button>
              </form>
            )}
            <button type="button" className="na-boton na-boton--negro" onClick={reiniciar}>
              OTRA VEZ
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const Marco = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <main className="na-pag">
    <a href={abajoHref()} className="na-volver">
      ← Volver
    </a>
    <h1>{titulo}</h1>
    {children}
  </main>
);

function Como() {
  return (
    <Marco titulo="CÓMO SE JUEGA">
      <ol className="na-pasos">
        {PASOS.map((p) => (
          <li key={p.t}>
            <h2>{p.t}</h2>
            <p>{p.d}</p>
          </li>
        ))}
      </ol>
      <a href={abajoHref("jugar")} className="na-boton na-boton--negro">
        JUGAR
      </a>
    </Marco>
  );
}

function Clasificacion() {
  const [lista, setLista] = useState<Marca[]>([]);
  useEffect(() => setLista(leer().sort((a, b) => Number(b.gano) - Number(a.gano) || (a.gano ? a.segundos - b.segundos : b.dinero - a.dinero)).slice(0, 10)), []);
  return (
    <Marco titulo="CLASIFICACIÓN">
      {lista.length ? (
        <ol className="na-tabla">
          {lista.map((m, i) => (
            <li key={`${m.nombre}${i}`}>
              <span>{i + 1}</span>
              <b>{m.nombre}</b>
              <span>{dinero(m.dinero)}</span>
              <span>{reloj(m.segundos)}</span>
              <span>{m.gano ? "ganó" : "tirado"}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p>Aún no ha jugado nadie en este navegador.</p>
      )}
      <a href={abajoHref("jugar")} className="na-boton na-boton--negro">
        INTENTARLO
      </a>
    </Marco>
  );
}

function Creditos() {
  return (
    <Marco titulo="CRÉDITOS">
      <p>Un juego de demostración de Trama. Personajes dibujados en un lienzo a línea, sin imágenes. Todo parecido con cualquier multimillonario es lo que estás pensando.</p>
      <p>Inspirado en la idea de Don&apos;t Look Up; reglas, textos y dibujos son propios.</p>
    </Marco>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a] = ruta;
  if (!a) return <Titulo />;
  const P = { jugar: Jugar, "como-jugar": Como, clasificacion: Clasificacion, creditos: Creditos }[a];
  return P ? (
    <P />
  ) : (
    <Marco titulo="AQUÍ ABAJO NO HAY NADA">
      <a href={abajoHref()} className="na-boton">
        SUBIR
      </a>
    </Marco>
  );
}
