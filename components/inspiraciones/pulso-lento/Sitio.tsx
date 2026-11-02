"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import CartDrawer from "@/components/ui/CartDrawer";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import EventLineup from "@/components/ui/EventLineup";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useCart } from "@/lib/commerce/cart";
import { ANOS, CAMISETA, CONCIERTOS, DISCOS, FOTOS, type Disco } from "./data";
import { pulsoHref } from "./enlaces";
import "./pulso-lento.css";

/*
 * Pulso Lento (docs/58), a partir de Paul Kalkbrenner: la web de un músico. Blanco suizo, nombre enorme con una foto metida entre
 * las dos palabras, disco con retrato circular, años gigantes y bloques de verde y naranja. El reproductor persiste entre páginas
 * y suena de verdad: un bucle sintetizado con Web Audio a partir del bpm y las notas de cada disco, sin archivos.
 */

const NAV: [string, string][] = [
  ["musica", "Música"],
  ["gira", "Gira"],
  ["trayectoria", "Trayectoria"],
  ["tienda", "Tienda"],
];
const eur = (n: number) => `${n} €`;

type Radio = { disco: Disco; sonando: boolean; poner: (d: Disco) => void; alternar: () => void };
const Reproductor = createContext<Radio | null>(null);
const useRadio = () => useContext(Reproductor)!;
const Bolsa = createContext<{ carrito: ReturnType<typeof useCart>; abrir: () => void } | null>(null);
const useBolsa = () => useContext(Bolsa)!;

/** bucle de bombo y bajo con osciladores; se programa cada compás para que un cambio de disco entre a tiempo */
function useBucle(disco: Disco, sonando: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (!sonando) {
      ctx.current?.suspend();
      return;
    }
    const c = (ctx.current ??= new AudioContext());
    c.resume();
    const paso = 60 / disco.bpm;
    let siguiente = c.currentTime + 0.05;
    let n = 0;
    const nota = (f: number, t: number, d: number, g: number, tipo: OscillatorType) => {
      const o = c.createOscillator();
      const a = c.createGain();
      o.type = tipo;
      o.frequency.setValueAtTime(f, t);
      if (tipo === "sine") o.frequency.exponentialRampToValueAtTime(40, t + d);
      a.gain.setValueAtTime(g, t);
      a.gain.exponentialRampToValueAtTime(0.001, t + d);
      o.connect(a).connect(c.destination);
      o.start(t);
      o.stop(t + d);
    };
    const id = setInterval(() => {
      while (siguiente < c.currentTime + 0.3) {
        nota(120, siguiente, 0.22, 0.32, "sine");
        nota(disco.notas[n % disco.notas.length], siguiente + paso / 2, paso / 2, 0.1, "sawtooth");
        siguiente += paso;
        n++;
      }
    }, 80);
    return () => clearInterval(id);
  }, [disco, sonando]);
  useEffect(() => () => void ctx.current?.close(), []);
}

export function Shell({ children }: { children: ReactNode }) {
  const [disco, setDisco] = useState(DISCOS[0]);
  const [sonando, setSonando] = useState(false);
  const [bolsa, setBolsa] = useState(false);
  const carrito = useCart("trama:pulso-lento:bolsa");
  useBucle(disco, sonando);
  const poner = useCallback((d: Disco) => {
    setDisco(d);
    setSonando(true);
  }, []);
  const links = [{ label: "Inicio", href: pulsoHref() }, ...NAV.map(([p, l]) => ({ label: l, href: pulsoHref(p) }))];
  return (
    <Reproductor.Provider value={{ disco, sonando, poner, alternar: () => setSonando(!sonando) }}>
      <Bolsa.Provider value={{ carrito, abrir: () => setBolsa(true) }}>
        <div className="pu" id="top">
          <header className="pu-head">
            <a href={pulsoHref()} className="pu-sello" aria-label="Pulso Lento, inicio">
              <i />
            </a>
            <nav aria-label="Principal">
              {NAV.map(([p, l]) => (
                <a key={p} href={pulsoHref(p)}>
                  {l}
                </a>
              ))}
              <button type="button" onClick={() => setBolsa(true)}>
                Bolsa ({carrito.count})
              </button>
            </nav>
            <div className="pu-burger">
              <FullscreenMenu brand="Pulso Lento" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Madrid" links={links} />
            </div>
          </header>
          {children}
          <footer className="pu-pie">
            <p>Pulso Lento</p>
            <small>Músico de demostración de Trama: discos, salas y fechas inventados. El sonido es un bucle sintetizado en el navegador.</small>
          </footer>
          <div className="pu-reproductor" role="region" aria-label="Reproductor">
            <button type="button" onClick={() => setSonando(!sonando)} aria-pressed={sonando} aria-label={sonando ? "Pausar" : "Reproducir"}>
              {sonando ? "❚❚" : "▶"}
            </button>
            <span className={`pu-barras ${sonando ? "is-on" : ""}`} aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <div>
              <small>{sonando ? "Ahora suena" : "En pausa"}</small>
              <b>{disco.temas[0]}</b>
            </div>
          </div>
          <CartDrawer open={bolsa} onOpenChange={setBolsa} lines={carrito.lines} onQty={carrito.setQty} onRemove={carrito.remove} title="Tu bolsa" checkoutHref={pulsoHref("pedido")} checkoutLabel="Ir al pedido" emptyText="No hay nada en tu bolsa." continueHref={pulsoHref("tienda")} />
        </div>
      </Bolsa.Provider>
    </Reproductor.Provider>
  );
}

function Portada() {
  const { poner, disco, sonando } = useRadio();
  const d = DISCOS[0];
  return (
    <main>
      <section className="pu-hero">
        <h1>
          <span>Pulso</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.nombre} alt="" />
          <span>Lento</span>
        </h1>
        <p>Música, directos, discos y treinta años de trabajo en una sola página.</p>
      </section>

      <section className="pu-disco">
        <div className="pu-vinilo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.retrato} alt="Retrato en blanco y negro de Pulso Lento" style={{ animationPlayState: sonando ? "running" : "paused" }} />
          <button type="button" onClick={() => poner(d)} aria-label={`Reproducir ${d.titulo}`}>
            <i />
          </button>
        </div>
        <div className="pu-disco__txt">
          <nav aria-label="Discos">
            {DISCOS.map((x) => (
              <a key={x.id} href={pulsoHref(`musica/${x.id}`)} aria-current={disco.id === x.id ? "true" : undefined}>
                {x.ano}
              </a>
            ))}
            <a href={pulsoHref("musica")}>Todos los discos →</a>
          </nav>
          <h2>{d.titulo}</h2>
          <p>{d.texto}</p>
          <div className="pu-dos">
            <a href={pulsoHref(`musica/${d.id}`)}>Vinilo y CD</a>
            <button type="button" onClick={() => poner(d)}>
              {sonando && disco.id === d.id ? "Sonando" : `Escuchar «${d.titulo}»`}
            </button>
          </div>
        </div>
      </section>

      <section className="pu-ano" style={{ backgroundImage: `url(${FOTOS.directo})` }}>
        <p aria-hidden>1996</p>
        <a href={pulsoHref("trayectoria")}>Ver la trayectoria</a>
      </section>

      <section className="pu-gira" aria-labelledby="pu-gira-t">
        <h2 id="pu-gira-t">Gira</h2>
        <EventLineup events={CONCIERTOS.slice(0, 3).map((c) => ({ ...c, href: pulsoHref(`gira/${c.id}`) }))} groupBy="none" filters={false} cta="Entradas" variant="minimal" className="pu-lineup" statusLabels={{ open: "A la venta", few: "Últimas entradas" }} />
        <a href={pulsoHref("gira")} className="pu-enlace">
          Todas las fechas →
        </a>
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto, color = "#fff" }: { titulo: string; texto?: string; color?: string }) => (
  <header className="pu-cab" style={{ background: color }}>
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function Musica() {
  const { poner } = useRadio();
  return (
    <main>
      <Cab titulo="Música" color="#c5c5c5" />
      <div className="pu-discos">
        {DISCOS.map((d) => (
          <article key={d.id}>
            <a href={pulsoHref(`musica/${d.id}`)} aria-label={d.titulo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.img} alt="" loading="lazy" />
            </a>
            <div>
              <b>{d.titulo}</b>
              <span>{d.ano}</span>
              <button type="button" onClick={() => poner(d)}>
                Escuchar
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function DiscoPag({ id }: { id: string }) {
  const d = DISCOS.find((x) => x.id === id);
  const { poner } = useRadio();
  const { carrito, abrir } = useBolsa();
  if (!d) return <NoHay />;
  const comprar = (f: string, p: number) => {
    carrito.add({ id: `${d.id}-${f}`, title: d.titulo, price: p, meta: f, image: d.img });
    abrir();
  };
  return (
    <main className="pu-ficha">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={d.img} alt={`Portada de ${d.titulo}`} />
      <div>
        <p className="pu-etq">{d.ano}</p>
        <h1>{d.titulo}</h1>
        <p>{d.texto}</p>
        <ol>
          {d.temas.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <div className="pu-dos">
          <button type="button" onClick={() => poner(d)}>
            Escuchar
          </button>
          <button type="button" onClick={() => comprar("Vinilo", d.precio)}>
            Vinilo · {eur(d.precio)}
          </button>
          <button type="button" onClick={() => comprar("CD", d.precio - 12)}>
            CD · {eur(d.precio - 12)}
          </button>
        </div>
      </div>
    </main>
  );
}

function Gira() {
  return (
    <main>
      <Cab titulo="Gira" texto="Sesiones largas. Sin telonero." color="#a7ff9c" />
      <div className="pu-marco">
        <EventLineup events={CONCIERTOS.map((c) => ({ ...c, href: pulsoHref(`gira/${c.id}`) }))} groupBy="month" filters cta="Entradas" variant="minimal" className="pu-lineup" statusLabels={{ open: "A la venta", few: "Últimas entradas" }} />
      </div>
    </main>
  );
}

function Concierto({ id }: { id: string }) {
  const c = CONCIERTOS.find((x) => x.id === id);
  const { carrito, abrir } = useBolsa();
  const [n, setN] = useState(2);
  if (!c) return <NoHay />;
  const fecha = new Date(`${c.date}T12:00:00`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <main>
      <Cab titulo={c.ciudad} texto={`${c.sala}, ${fecha}, ${c.time}`} color="#ff6831" />
      <div className="pu-marco pu-entrada">
        {c.status === "soldout" ? (
          <p>Agotado. Se abrirá una lista de espera si se libera aforo.</p>
        ) : (
          <>
            <p className="pu-precio">{eur(c.price ?? 0)}</p>
            <QuantityStepper value={n} min={1} max={6} onChange={setN} label="Entradas" />
            <button
              type="button"
              className="pu-boton"
              onClick={() => {
                carrito.add({ id: `entrada-${c.id}`, title: `Entrada ${c.title}`, price: c.price ?? 0, meta: fecha }, n);
                abrir();
              }}
            >
              Añadir a la bolsa
            </button>
          </>
        )}
        <a href={pulsoHref("gira")} className="pu-enlace">
          ← Todas las fechas
        </a>
      </div>
    </main>
  );
}

function Trayectoria() {
  return (
    <main>
      {ANOS.map((a) => (
        <section key={a.a} className="pu-tramo" style={{ background: a.c }}>
          <p aria-hidden>{a.a}</p>
          <div>
            <h2>{a.t}</h2>
            <span>{a.d}</span>
          </div>
        </section>
      ))}
    </main>
  );
}

function Tienda() {
  const { carrito, abrir } = useBolsa();
  return (
    <main>
      <Cab titulo="Tienda" color="#c5c5c5" />
      <div className="pu-discos">
        {DISCOS.map((d) => (
          <article key={d.id}>
            <a href={pulsoHref(`musica/${d.id}`)} aria-label={d.titulo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.img} alt="" loading="lazy" />
            </a>
            <div>
              <b>{d.titulo}</b>
              <span>Vinilo · {eur(d.precio)}</span>
            </div>
          </article>
        ))}
        <article>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CAMISETA.img} alt={CAMISETA.titulo} loading="lazy" />
          <div>
            <b>{CAMISETA.titulo}</b>
            <span>{eur(CAMISETA.precio)}</span>
            <button
              type="button"
              onClick={() => {
                carrito.add({ id: CAMISETA.id, title: CAMISETA.titulo, price: CAMISETA.precio, image: CAMISETA.img });
                abrir();
              }}
            >
              Añadir
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}

function Pedido() {
  const { carrito } = useBolsa();
  return (
    <main>
      <Cab titulo="Tu pedido" />
      <CheckoutFlow className="pu-flujo" lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} delivery="shipping" shippingCost={6} freeShippingFrom={60} orderPrefix="PL" shopHref={pulsoHref("tienda")} />
    </main>
  );
}

function NoHay() {
  return (
    <main>
      <Cab titulo="Silencio" texto="Aquí no suena nada." color="#ff6831" />
      <div className="pu-marco">
        <a href={pulsoHref()} className="pu-enlace">
          Volver al inicio
        </a>
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "musica" && b) return <DiscoPag id={b} />;
  if (a === "gira" && b) return <Concierto id={b} />;
  const P = { musica: Musica, gira: Gira, trayectoria: Trayectoria, tienda: Tienda, pedido: Pedido }[a];
  return P ? <P /> : <NoHay />;
}
