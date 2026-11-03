"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Reveal from "@/components/ui/Reveal";
import { BLOQUES, DURACIONES, FOTOS, INCLUIDO, RESIDENCIAS, SEÑAL, type Residencia } from "./data";
import { llaveHref } from "./enlaces";
import "./llave.css";

/*
 * Llave (docs/60), a partir de Units: residencias de estudiantes. Un lateral fijo de pestañas de colores (una por
 * residencia) y la portada como una rejilla de tarjetas de color pleno muy redondeadas, con una letra gruesa y redonda en
 * negro y fotos dentro de las tarjetas. El aviso amarillo de oferta sale una vez y se recuerda. Flujos: elegir residencia,
 * habitación y duración, y reservar con señal (pago digital).
 */

const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;
const AVISO = "trama:llave:aviso";

/** el aviso de la oferta: una vez por navegador, y se cierra con la cruz, con Esc o eligiendo */
function Aviso() {
  const [ver, setVer] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(AVISO)) {
        const t = setTimeout(() => setVer(true), 1800);
        return () => clearTimeout(t);
      }
    } catch {
      /* sin almacenamiento: sin aviso */
    }
  }, []);
  const cerrar = () => {
    setVer(false);
    try {
      localStorage.setItem(AVISO, "1");
    } catch {
      /* nada */
    }
  };
  useEffect(() => {
    if (!ver) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [ver]);
  if (!ver) return null;
  return (
    <div className="ll-aviso" role="dialog" aria-modal="false" aria-labelledby="ll-aviso-t">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FOTOS.oferta} alt="" />
      <button type="button" className="ll-aviso__x" onClick={cerrar} aria-label="Cerrar el aviso">
        ×
      </button>
      <p className="ll-aviso__etq">Reserva antes del 30 de noviembre y el primer mes, a mitad de precio</p>
      <p id="ll-aviso-t" className="ll-t">¿Aún buscas habitación?</p>
      <a href={llaveHref("reservar")} className="ll-boton" onClick={cerrar}>
        Reservar la mía
      </a>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [, , , a, b] = usePathname().split("/");
  const activa = a === "residencias" ? b : undefined;
  const links = [{ label: "Inicio", href: llaveHref() }, { label: "Residencias", href: llaveHref("residencias") }, { label: "Cómo se vive", href: llaveHref("vivir") }, { label: "Reservar", href: llaveHref("reservar") }];
  return (
    <div className="ll" id="top">
      <aside className="ll-lado" aria-label="Residencias">
        <a href={llaveHref()} className="ll-lado__marca">
          llave.
        </a>
        <nav>
          {RESIDENCIAS.map((r) => (
            <a key={r.id} href={llaveHref(`residencias/${r.id}`)} style={{ "--c": r.color, "--t": r.tinta } as CSSProperties} aria-current={activa === r.id ? "page" : undefined}>
              <span>{r.ciudad}</span>
            </a>
          ))}
          <a href={llaveHref("vivir")} style={{ "--c": "#1fa34a", "--t": "#111" } as CSSProperties} aria-current={a === "vivir" ? "page" : undefined}>
            <span>Vivir</span>
          </a>
          <a href={llaveHref("reservar")} style={{ "--c": "#8a4fff", "--t": "#fff" } as CSSProperties} aria-current={a === "reservar" ? "page" : undefined}>
            <span>Reservar</span>
          </a>
        </nav>
      </aside>
      <header className="ll-movil">
        <a href={llaveHref()} className="ll-lado__marca">
          llave.
        </a>
        <FullscreenMenu trigger="burger" layout="full" reveal="circle" tone="acc" size="lg" brand="Llave" openLabel="Menú" closeLabel="Cerrar" note="Valencia · Madrid · Salamanca" links={links} className="ll-menu" />
      </header>
      <div className="ll-cuerpo">
        {children}
        <footer className="ll-pie">
          <p className="ll-t">Vivir como estudiante, otra vez</p>
          <div>
            <span>hola@llave.example · 960 000 000</span>
            <span>Llave · residencias de demostración de Trama. Residencias, precios y ofertas inventados.</span>
          </div>
        </footer>
      </div>
      <Aviso />
    </div>
  );
}

function Portada() {
  return (
    <main className="ll-bento">
      <section className="ll-tarjeta ll-tarjeta--hero" style={{ "--c": "#2f5bea" } as CSSProperties}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.portada} alt="La sala común de una residencia Llave, con sofás de colores y estudiantes" />
        <h1 className="ll-t ll-t--hero">Hogar, a tu manera</h1>
      </section>
      <section className="ll-tarjeta ll-tarjeta--mapa" style={{ "--c": "#ffd31a" } as CSSProperties}>
        <p className="ll-etq">Ubicación</p>
        <h2 className="ll-t">Donde tu vida funciona</h2>
        <ul>
          {RESIDENCIAS.map((r) => (
            <li key={r.id}>
              <a href={llaveHref(`residencias/${r.id}`)}>
                <b>{r.ciudad}</b> <span>{r.texto}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="ll-tarjeta ll-tarjeta--universo" style={{ "--c": "#e8442d" } as CSSProperties}>
        <h2 className="ll-t">Una llave. Un universo entero.</h2>
        <p>Habitación, comunidad, estudio y deporte, con un solo contrato y todo incluido.</p>
        <a href={llaveHref("reservar")} className="ll-boton ll-boton--blanco">
          Reservar
        </a>
      </section>
      {BLOQUES.map((b, k) => (
        <Reveal key={b.id} as="section" kind="scale" delay={(k % 3) * 0.06} className={`ll-tarjeta ll-tarjeta--b${k}`} style={{ "--c": b.color } as CSSProperties}>
          <p className="ll-etq">{b.t}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.img} alt="" loading="lazy" />
          <p>{b.texto}</p>
        </Reveal>
      ))}
      <section className="ll-tarjeta ll-tarjeta--incluido" style={{ "--c": "#f2efe8" } as CSSProperties}>
        <h2 className="ll-t">Todo incluido</h2>
        <ul>
          {INCLUIDO.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Residencias() {
  return (
    <main className="ll-pag">
      <h1 className="ll-t ll-t--pag">Residencias</h1>
      <div className="ll-lista">
        {RESIDENCIAS.map((r) => (
          <a key={r.id} href={llaveHref(`residencias/${r.id}`)} className="ll-tarjeta" style={{ "--c": r.color, color: r.tinta } as CSSProperties}>
            <p className="ll-etq">{r.ciudad}</p>
            <h2 className="ll-t">{r.n}</h2>
            <p>{r.texto}</p>
            <p>
              {r.plazas} plazas · desde {eur(Math.min(...r.habitaciones.map((x) => x.precio)))}/mes
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}

function Ficha({ r }: { r: Residencia }) {
  return (
    <main className="ll-pag">
      <section className="ll-tarjeta ll-ficha__cab" style={{ "--c": r.color, color: r.tinta } as CSSProperties}>
        <p className="ll-etq">{r.ciudad}</p>
        <h1 className="ll-t ll-t--pag">{r.n}</h1>
        <p>{r.texto}</p>
      </section>
      <div className="ll-habs">
        {r.habitaciones.map((x) => (
          <article key={x.id} className="ll-tarjeta" style={{ "--c": "#ffffff" } as CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={x.img} alt="" loading="lazy" />
            <h2 className="ll-t">{x.n}</h2>
            <p>
              {x.m2} m² · {x.texto}
            </p>
            <p className="ll-precio">{eur(x.precio)}/mes</p>
            <a href={llaveHref(`reservar?r=${r.id}&h=${x.id}`)} className="ll-boton">
              Reservar esta
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}

function Vivir() {
  return (
    <main className="ll-pag">
      <h1 className="ll-t ll-t--pag">Cómo se vive en Llave</h1>
      <div className="ll-lista">
        {BLOQUES.map((b) => (
          <section key={b.id} className="ll-tarjeta" style={{ "--c": b.color } as CSSProperties}>
            <p className="ll-etq">{b.t}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.img} alt="" loading="lazy" />
            <p>{b.texto}</p>
          </section>
        ))}
      </div>
    </main>
  );
}

function Reservar() {
  const [res, setRes] = useState(RESIDENCIAS[0].id);
  const [hab, setHab] = useState(RESIDENCIAS[0].habitaciones[0].id);
  const [dur, setDur] = useState(DURACIONES[0].id);
  const [pagar, setPagar] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const r = RESIDENCIAS.find((x) => x.id === q.get("r"));
    if (r) {
      setRes(r.id);
      setHab(r.habitaciones.find((x) => x.id === q.get("h"))?.id ?? r.habitaciones[0].id);
    }
  }, []);
  const r = RESIDENCIAS.find((x) => x.id === res)!;
  const x = r.habitaciones.find((y) => y.id === hab) ?? r.habitaciones[0];
  const d = DURACIONES.find((y) => y.id === dur)!;
  const total = Math.round(x.precio * d.meses * (1 - d.dto));
  const linea = [{ id: `llave-${r.id}-${x.id}-${d.id}`, title: `Señal · ${r.n}`, price: SEÑAL, qty: 1, meta: `${x.n} · ${d.n}` }];
  return (
    <main className="ll-pag">
      <h1 className="ll-t ll-t--pag">Reserva tu habitación</h1>
      {!pagar ? (
        <div className="ll-reserva">
          <fieldset>
            <legend>Residencia</legend>
            {RESIDENCIAS.map((y) => (
              <button key={y.id} type="button" aria-pressed={res === y.id} style={{ "--c": y.color, "--t": y.tinta } as CSSProperties} onClick={() => { setRes(y.id); setHab(y.habitaciones[0].id); }}>
                <b>{y.ciudad}</b>
                <small>{y.n}</small>
              </button>
            ))}
          </fieldset>
          <fieldset>
            <legend>Habitación</legend>
            {r.habitaciones.map((y) => (
              <button key={y.id} type="button" aria-pressed={x.id === y.id} onClick={() => setHab(y.id)}>
                <b>{y.n}</b>
                <small>
                  {y.m2} m² · {eur(y.precio)}/mes
                </small>
              </button>
            ))}
          </fieldset>
          <fieldset>
            <legend>Estancia</legend>
            {DURACIONES.map((y) => (
              <button key={y.id} type="button" aria-pressed={dur === y.id} onClick={() => setDur(y.id)}>
                <b>{y.n}</b>
                <small>
                  {y.meses} meses{y.dto ? ` · ${y.dto * 100} % menos` : ""}
                </small>
              </button>
            ))}
          </fieldset>
          <aside className="ll-tarjeta ll-reserva__total" style={{ "--c": "#ffd31a" } as CSSProperties} aria-live="polite">
            <p className="ll-etq">Tu estancia</p>
            <p>
              {x.n} en {r.n}, {d.n.toLowerCase()}
            </p>
            <p className="ll-precio">{eur(total)}</p>
            <p>Hoy pagas una señal de {eur(SEÑAL)}; el resto, mes a mes.</p>
            <button type="button" className="ll-boton" onClick={() => setPagar(true)}>
              Pagar la señal
            </button>
          </aside>
        </div>
      ) : (
        <CheckoutFlow lines={linea} onQty={() => setPagar(false)} onClear={() => undefined} delivery="digital" orderPrefix="LL" shopHref={llaveHref("reservar")} note="Reserva de demostración: no se cobra nada. Prueba con la tarjeta 4242 4242 4242 4242." variant="minimal" className="ll-checkout" />
      )}
    </main>
  );
}

function NoHay() {
  return (
    <main className="ll-pag">
      <h1 className="ll-t ll-t--pag">Esta puerta no abre</h1>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "residencias" && b) {
    const r = RESIDENCIAS.find((x) => x.id === b);
    return r ? <Ficha r={r} /> : <NoHay />;
  }
  const P = { residencias: Residencias, vivir: Vivir, reservar: Reservar }[a];
  return P ? <P /> : <NoHay />;
}
