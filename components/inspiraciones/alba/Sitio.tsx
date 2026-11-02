"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Reveal from "@/components/ui/Reveal";
import { CERCA, ETAPAS, FOTOS, TIPOS, VIVIENDAS, type Vivienda } from "./data";
import { albaHref } from "./enlaces";
import "./alba.css";

/*
 * Alba Residencia (docs/58), a partir de ERA Residence: promoción residencial. Burdeos #340c24 con caligrafía gigante apenas
 * visible, marco de esquinas biseladas y una didona estrecha centrada; al bajar, el marco se abre y entra la foto. Selector de
 * viviendas: una rejilla de bloques y plantas con su estado, una ficha al lado y la visita con esa vivienda ya elegida.
 */

const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;
const PLANTAS = ["Bajo", "Primera", "Ático"];
const CLAVE = "trama:alba:visita";

function Flor({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden className="al-flor">
      {[0, 45, 90, 135].map((r) => (
        <path key={r} d="M24 4c5 8 5 32 0 40-5-8-5-32 0-40Z" transform={`rotate(${r} 24 24)`} />
      ))}
    </svg>
  );
}

const Rotulo = () => (
  <span className="al-rotulo">
    <b>ALBA</b>
    <b>RESIDENCIA</b>
    <i>Nerja</i>
  </span>
);

export function Shell({ children }: { children: ReactNode }) {
  const links = [
    { label: "Inicio", href: albaHref() },
    { label: "Elige vivienda", href: albaHref("viviendas") },
    { label: "Tipologías", href: albaHref("tipos") },
    { label: "Nerja", href: albaHref("nerja") },
    { label: "Reserva una visita", href: albaHref("visita") },
  ];
  return (
    <div className="al" id="top">
      <header className="al-head">
        <a href={albaHref()} aria-label="Alba Residencia, inicio">
          <Flor />
        </a>
        <div className="al-head__der">
          <a href={albaHref("viviendas")}>Elige vivienda</a>
          <a href={albaHref("visita")}>Reserva y llama</a>
        </div>
        <div className="al-burger">
          <FullscreenMenu brand="Alba Residencia" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Nerja, Costa del Sol" links={links} />
        </div>
      </header>
      {children}
      <footer className="al-pie">
        <Flor size={56} />
        <p>Un lugar al que volver.</p>
        <nav aria-label="Pie">
          {links.slice(1).map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <small>Alba Residencia · promoción de demostración de Trama. Precios y viviendas inventados.</small>
      </footer>
    </div>
  );
}

function Portada() {
  const caja = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const f = () => {
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / (el.offsetHeight - innerHeight)));
      el.style.setProperty("--p", String(p));
    };
    f();
    addEventListener("scroll", f, { passive: true });
    addEventListener("resize", f);
    return () => {
      removeEventListener("scroll", f);
      removeEventListener("resize", f);
    };
  }, []);
  return (
    <main>
      <section className="al-entrada" ref={caja}>
        <div className="al-entrada__fijo">
          <span className="al-fantasma" aria-hidden>
            Nerja
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.cielo} alt="Bloques blancos con terrazas verdes bajo un cielo azul" className="al-entrada__foto" />
          <div className="al-marco" aria-hidden />
          <h1>
            <span className="sr-only">Alba Residencia, Nerja</span>
            <Rotulo />
          </h1>
          <p className="al-lado al-lado--a">COSTA</p>
          <p className="al-lado al-lado--b">DEL SOL</p>
          <p className="al-lema">
            ALBA RESIDENCIA
            <br />
            UN LUGAR AL QUE VOLVER
          </p>
        </div>
      </section>

      <section className="al-claro">
        <Reveal kind="slide">
          <p className="al-frase">Cuarenta y ocho viviendas entre jazmines, a seis minutos del Balcón de Europa.</p>
        </Reveal>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.piscina} alt="Piscina comunitaria entre palmeras y terrazas con buganvillas" className="al-ancha" loading="lazy" />
      </section>

      <section className="al-tipos" aria-labelledby="al-tipos-t">
        <h2 id="al-tipos-t">Tres formas de vivir aquí</h2>
        <div>
          {TIPOS.map((t) => (
            <a key={t.id} href={albaHref(`tipos/${t.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.img} alt={t.nombre} loading="lazy" />
              <b>{t.nombre}</b>
              <span>
                {t.dormitorios} dormitorios · desde {eur(t.desde)}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="al-oscuro">
        <span className="al-fantasma al-fantasma--b" aria-hidden>
          Volver
        </span>
        <h2>Elige tu vivienda en el plano</h2>
        <p>Mira qué queda libre, en qué bloque y a qué hora le da el sol.</p>
        <a href={albaHref("viviendas")} className="al-boton">
          ABRIR EL SELECTOR
        </a>
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto }: { titulo: string; texto?: string }) => (
  <header className="al-cab">
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function Selector() {
  const [tipo, setTipo] = useState("");
  const [soloLibres, setSoloLibres] = useState(false);
  const [sel, setSel] = useState<Vivienda | null>(null);
  const encaja = (v: Vivienda) => (!tipo || v.tipo === tipo) && (!soloLibres || v.estado === "libre");
  const libres = VIVIENDAS.filter((v) => v.estado === "libre" && (!tipo || v.tipo === tipo)).length;
  return (
    <main className="al-pag">
      <Cab titulo="Elige vivienda" texto={`${libres} viviendas libres con este filtro.`} />
      <div className="al-sel">
        <div>
          <div className="al-filtros" role="group" aria-label="Tipología">
            <button type="button" aria-pressed={!tipo} onClick={() => setTipo("")}>
              Todas
            </button>
            {TIPOS.map((t) => (
              <button key={t.id} type="button" aria-pressed={tipo === t.id} onClick={() => setTipo(t.id)}>
                {t.nombre}
              </button>
            ))}
            <button type="button" aria-pressed={soloLibres} onClick={() => setSoloLibres(!soloLibres)}>
              Solo libres
            </button>
          </div>
          <div className="al-bloques">
            {["A", "B", "C", "D"].map((b) => (
              <section key={b} aria-label={`Bloque ${b}`}>
                <h2>Bloque {b}</h2>
                {[2, 1, 0].map((p) => (
                  <div key={p} className="al-planta">
                    <small>{PLANTAS[p]}</small>
                    {VIVIENDAS.filter((v) => v.bloque === b && v.planta === p).map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        className={`al-puerta al-puerta--${v.estado}`}
                        disabled={!encaja(v)}
                        aria-pressed={sel?.id === v.id}
                        aria-label={`Vivienda ${v.id}, ${PLANTAS[p]}, ${v.estado}`}
                        onClick={() => setSel(v)}
                      >
                        {v.puerta}
                      </button>
                    ))}
                  </div>
                ))}
              </section>
            ))}
          </div>
          <p className="al-leyenda">
            <i className="al-puerta--libre" /> Libre <i className="al-puerta--reservada" /> Reservada <i className="al-puerta--vendida" /> Vendida
          </p>
        </div>
        <aside aria-live="polite">
          {sel ? (
            <>
              <p className="al-etq">
                Bloque {sel.bloque} · {PLANTAS[sel.planta]} · Puerta {sel.puerta}
              </p>
              <h2>{TIPOS.find((t) => t.id === sel.tipo)?.nombre}</h2>
              <p className="al-precio">{eur(sel.precio)}</p>
              <p>
                {TIPOS.find((t) => t.id === sel.tipo)?.m2}
                <br />
                Orientación {sel.orientacion.toLowerCase()}
              </p>
              {sel.estado === "vendida" ? (
                <p>Esta ya tiene dueña. Mira las de al lado.</p>
              ) : (
                <a href={`${albaHref("visita")}?v=${sel.id}`} className="al-boton">
                  {sel.estado === "libre" ? "VISITAR ESTA VIVIENDA" : "APUNTARME POR SI QUEDA LIBRE"}
                </a>
              )}
            </>
          ) : (
            <p>Pulsa una puerta para ver su ficha.</p>
          )}
        </aside>
      </div>
    </main>
  );
}

function Tipos() {
  return (
    <main className="al-pag">
      <Cab titulo="Tipologías" />
      <div className="al-lista">
        {TIPOS.map((t) => (
          <a key={t.id} href={albaHref(`tipos/${t.id}`)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.img} alt={t.nombre} loading="lazy" />
            <div>
              <h2>{t.nombre}</h2>
              <p>{t.texto}</p>
              <p className="al-etq">
                {t.m2} · desde {eur(t.desde)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}

function TipoPag({ id }: { id: string }) {
  const t = TIPOS.find((x) => x.id === id);
  if (!t) return <NoHay />;
  const fotos = [FOTOS.salon, FOTOS.dormitorio];
  return (
    <main className="al-pag">
      <Cab titulo={t.nombre} texto={t.texto} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={t.img} alt={t.nombre} className="al-ancha" />
      <div className="al-dos">
        {fotos.map((f, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={f} src={f} alt={i ? "Dormitorio con vistas al mar" : "Salón abierto a la terraza"} loading="lazy" />
        ))}
      </div>
      <p className="al-frase">
        {t.m2}. Desde {eur(t.desde)}.
      </p>
      <a href={albaHref("viviendas")} className="al-boton al-centro">
        VER LAS QUE QUEDAN
      </a>
    </main>
  );
}

function Nerja() {
  return (
    <main className="al-pag">
      <Cab titulo="Nerja" texto="Pueblo blanco, mar transparente y sierra a la espalda." />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FOTOS.plaza} alt="Calle encalada de Nerja con flores" className="al-ancha" />
      <div className="al-cerca">
        <ul>
          {CERCA.map((c) => (
            <li key={c.t}>
              <span>{c.t}</span>
              <b>{c.d}</b>
            </li>
          ))}
        </ul>
        <ol>
          {ETAPAS.map((e) => (
            <li key={e.t} className={e.ok ? "is-ok" : ""}>
              <span>{e.t}</span>
              <b>{e.f}</b>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}

function Visita() {
  const q = useSearchParams();
  const v = VIVIENDAS.find((x) => x.id === q.get("v"));
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [dia, setDia] = useState("");
  const [franja, setFranja] = useState("Mañana");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  if (ok)
    return (
      <main className="al-pag">
        <Cab titulo="Te esperamos" texto={`Visita ${ok}. Te llamamos para confirmarla.`} />
        <a href={albaHref("viviendas")} className="al-boton al-centro">
          VOLVER AL PLANO
        </a>
      </main>
    );
  const manana = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  return (
    <main className="al-pag">
      <Cab titulo="Reserva una visita" texto={v ? `Para la vivienda ${v.id}, bloque ${v.bloque}.` : "En la oficina de ventas, frente al Balcón de Europa."} />
      <form
        className="al-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (nombre.trim().length < 2) return setErr("Dinos tu nombre.");
          if (!/^[+\d\s]{9,}$/.test(tel)) return setErr("Escribe un teléfono válido.");
          if (!dia) return setErr("Elige un día.");
          const fecha = new Date(`${dia}T12:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long" });
          const texto = `del ${fecha}, por la ${franja.toLowerCase()}`;
          try {
            localStorage.setItem(CLAVE, JSON.stringify({ nombre, tel, dia, franja, vivienda: v?.id }));
          } catch {
            /* sin almacenamiento */
          }
          setOk(texto);
        }}
      >
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" />
        </label>
        <label>
          Teléfono
          <input value={tel} onChange={(e) => setTel(e.target.value)} inputMode="tel" autoComplete="tel" />
        </label>
        <label>
          Día
          <input type="date" min={manana} value={dia} onChange={(e) => setDia(e.target.value)} />
        </label>
        <fieldset>
          <legend>Franja</legend>
          {["Mañana", "Tarde"].map((f) => (
            <label key={f}>
              <input type="radio" name="franja" checked={franja === f} onChange={() => setFranja(f)} /> {f}
            </label>
          ))}
        </fieldset>
        {err && (
          <p role="alert" className="al-error">
            {err}
          </p>
        )}
        <button type="submit" className="al-boton">
          PEDIR LA VISITA
        </button>
      </form>
    </main>
  );
}

function NoHay() {
  return (
    <main className="al-pag">
      <Cab titulo="Esta puerta no existe" />
      <a href={albaHref()} className="al-boton al-centro">
        VOLVER AL INICIO
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "tipos" && b) return <TipoPag id={b} />;
  if (a === "visita")
    return (
      <Suspense>
        <Visita />
      </Suspense>
    );
  const P = { viviendas: Selector, tipos: Tipos, nerja: Nerja }[a];
  return P ? <P /> : <NoHay />;
}
