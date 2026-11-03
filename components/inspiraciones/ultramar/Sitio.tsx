"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Marquee from "@/components/ui/Marquee";
import { CIFRAS, ENVIOS, NOTICIAS, PUERTOS, RUTAS, SERVICIOS, TARIFAS } from "./data";
import { ultramarHref } from "./enlaces";
import Globo from "./Globo";
import "./ultramar.css";

/*
 * Ultramar (docs/58), a partir de United Carriers: logística global. Portada negra con un globo de puntos y rutas (lienzo 2D,
 * continentes a mano), titular extendido en mayúsculas y cinta de avisos; después, blanco con cifras gigantes y un contenedor
 * dibujado que cruza al bajar. Flujos: seguimiento por código y presupuesto calculado al momento.
 */

const NAV: [string, string][] = [
  ["servicios", "Servicios"],
  ["seguimiento", "Seguimiento"],
  ["presupuesto", "Presupuesto"],
  ["empresa", "Empresa"],
];
const eur = (n: number) => `${Math.round(n).toLocaleString("es-ES")} €`;

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  return (
    <div className={`um ${ruta ? "" : "um--inicio"}`} id="top">
      <a href={ultramarHref("empresa")} className="um-aviso">
        <Marquee variant="minimal" text={NOTICIAS.join("   ///   ")} separator="   ///   " rows={1} direction="left" duration={40} tone="fg" pauseOnHover={false} />
      </a>
      <header className="um-head">
        <a href={ultramarHref()} className="um-logo">
          ULTRAMAR
        </a>
        <nav aria-label="Principal">
          {NAV.map(([p, l]) => (
            <a key={p} href={ultramarHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <a href={ultramarHref("presupuesto")} className="um-pildora">
          Trabaja con nosotros
        </a>
        <div className="um-burger">
          <FullscreenMenu trigger="plus" layout="island" reveal="circle" size="sm" numbered brand="Ultramar" openLabel="Menú" closeLabel="Cerrar" note="Cada tramo del viaje" links={[{ label: "Inicio", href: ultramarHref() }, ...NAV.map(([p, l]) => ({ label: l, href: ultramarHref(p) }))]} />
        </div>
      </header>
      {children}
      <footer className="um-pie">
        <p>Un solo responsable, de origen a destino.</p>
        <nav aria-label="Pie">
          {NAV.map(([p, l]) => (
            <a key={p} href={ultramarHref(p)}>
              {l}
            </a>
          ))}
        </nav>
        <small>Ultramar · empresa de demostración de Trama. Envíos y tarifas inventados.</small>
      </footer>
    </div>
  );
}

function Contenedor() {
  return (
    <svg viewBox="0 0 640 170" aria-hidden className="um-contenedor">
      <rect x="10" y="18" width="620" height="118" fill="#d7d9dc" stroke="#111" strokeWidth="2" />
      {Array.from({ length: 30 }, (_, i) => (
        <line key={i} x1={30 + i * 20} y1="22" x2={30 + i * 20} y2="132" stroke="#8d9096" strokeWidth="6" />
      ))}
      <rect x="4" y="136" width="632" height="10" fill="#111" />
      <circle cx="90" cy="156" r="13" fill="#111" />
      <circle cx="550" cy="156" r="13" fill="#111" />
      <circle cx="500" cy="156" r="13" fill="#111" />
    </svg>
  );
}

function Portada() {
  const cruza = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => {
      const r = cruza.current?.getBoundingClientRect();
      if (r) setP(Math.max(0, Math.min(1, 1 - r.bottom / (innerHeight + r.height))));
    };
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  return (
    <main>
      <section className="um-hero">
        <Globo rutas={RUTAS} className="um-globo" inicio={-20} />
        <div className="um-hero__txt">
          <p className="um-mono">Un solo operador</p>
          <h1>Cada tramo del viaje</h1>
          <p>Mar, aire, carretera y aduanas gestionados por el mismo equipo, para que siempre sepas dónde está tu carga.</p>
          <div>
            <a href={ultramarHref("presupuesto")} className="um-pildora um-pildora--clara">
              Pide presupuesto
            </a>
            <a href={ultramarHref("seguimiento")} className="um-pildora">
              Seguir un envío
            </a>
          </div>
        </div>
        <ul className="um-puertos" aria-label="Puertos propios">
          {PUERTOS.map((x) => (
            <li key={x.id}>{x.n}</li>
          ))}
        </ul>
      </section>

      <section className="um-lema">
        <p>
          <span>Movemos carga.</span> Respondemos del resultado.
        </p>
      </section>

      <section className="um-cifras" aria-label="Cifras">
        {CIFRAS.map(([a, b]) => (
          <div key={b}>
            <b>{a}</b>
            <span>{b}</span>
          </div>
        ))}
      </section>

      <section className="um-cruza" ref={cruza} aria-hidden>
        <div style={{ transform: `translateX(${110 - p * 220}%)` }}>
          <Contenedor />
        </div>
      </section>

      <section className="um-servicios">
        <h2>Cuatro formas de llegar</h2>
        {SERVICIOS.map((s, i) => (
          <a key={s.id} href={ultramarHref(`servicios/${s.id}`)}>
            <span className="um-mono">0{i + 1}</span>
            <b>{s.n}</b>
            <span>{s.lema}</span>
          </a>
        ))}
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto }: { titulo: string; texto?: string }) => (
  <header className="um-cab">
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function Servicios() {
  return (
    <main className="um-pag">
      <Cab titulo="Servicios" />
      <div className="um-tarjetas">
        {SERVICIOS.map((s) => (
          <a key={s.id} href={ultramarHref(`servicios/${s.id}`)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt={s.n} loading="lazy" />
            <b>{s.n}</b>
            <span>{s.lema}</span>
          </a>
        ))}
      </div>
    </main>
  );
}

function Servicio({ id }: { id: string }) {
  const s = SERVICIOS.find((x) => x.id === id);
  if (!s) return <NoHay />;
  return (
    <main className="um-pag">
      <Cab titulo={s.n} texto={s.lema} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.img} alt={s.n} className="um-ancha" />
      <div className="um-dos">
        <p>{s.texto}</p>
        <div className="um-mini">
          {s.cifras.map(([k, v]) => (
            <div key={k}>
              <b>{v}</b>
              <span>{k}</span>
            </div>
          ))}
        </div>
      </div>
      <a href={ultramarHref("presupuesto")} className="um-pildora um-pildora--oscura um-solo">
        Pide presupuesto
      </a>
    </main>
  );
}

function Seguimiento() {
  const q = useSearchParams();
  const [codigo, setCodigo] = useState(q.get("c") ?? "");
  const [buscado, setBuscado] = useState(q.get("c") ?? "");
  const envio = ENVIOS.find((e) => e.codigo === buscado.trim().toUpperCase());
  return (
    <main className="um-pag">
      <Cab titulo="Seguimiento" texto="Prueba con UM-2041 o UM-3390." />
      <form
        className="um-buscar"
        onSubmit={(e) => {
          e.preventDefault();
          setBuscado(codigo);
        }}
      >
        <label>
          <span className="um-mono">Código de envío</span>
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="UM-0000" />
        </label>
        <button type="submit" className="um-pildora um-pildora--oscura">
          Buscar
        </button>
      </form>
      <div aria-live="polite">
        {buscado && !envio && <p className="um-error">No encontramos «{buscado}». Revisa el código de tu albarán.</p>}
        {envio && (
          <section className="um-envio">
            <h2>
              {envio.origen} → {envio.destino}
            </h2>
            <p>
              {envio.carga}. Llegada prevista: <b>{envio.eta}</b>.
            </p>
            <ol>
              {envio.hitos.map((h) => (
                <li key={h.t} className={h.ok ? "is-ok" : ""}>
                  <b>{h.t}</b>
                  <span>{h.d}</span>
                  <small>{h.f}</small>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </main>
  );
}

function Presupuesto() {
  const [modo, setModo] = useState("Marítimo");
  const [origen, setOrigen] = useState(PUERTOS[0].id);
  const [destino, setDestino] = useState(PUERTOS[3].id);
  const [kilos, setKilos] = useState(1200);
  const [hecho, setHecho] = useState(false);
  const t = TARIFAS[modo];
  const a = PUERTOS.find((p) => p.id === origen)!;
  const b = PUERTOS.find((p) => p.id === destino)!;
  const zonas = Math.abs(a.z - b.z) + 1;
  const igual = origen === destino;
  const total = (t.base + t.kilo * kilos) * (0.7 + zonas * 0.3);
  return (
    <main className="um-pag">
      <Cab titulo="Presupuesto" texto="Una cifra orientativa ahora y una oferta en firme en 24 horas." />
      <div className="um-calc">
        <form onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend className="um-mono">Modo</legend>
            {Object.keys(TARIFAS).map((m) => (
              <button key={m} type="button" aria-pressed={modo === m} onClick={() => setModo(m)}>
                {m}
              </button>
            ))}
          </fieldset>
          <label>
            <span className="um-mono">Origen</span>
            <select value={origen} onChange={(e) => setOrigen(e.target.value)}>
              {PUERTOS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.n}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="um-mono">Destino</span>
            <select value={destino} onChange={(e) => setDestino(e.target.value)}>
              {PUERTOS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.n}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="um-mono">Peso: {kilos.toLocaleString("es-ES")} kg</span>
            <input type="range" min={50} max={24000} step={50} value={kilos} onChange={(e) => setKilos(Number(e.target.value))} />
          </label>
        </form>
        <aside aria-live="polite">
          {igual ? (
            <p>El origen y el destino son el mismo puerto.</p>
          ) : (
            <>
              <p className="um-mono">
                {a.n} → {b.n} · {t.dias}
              </p>
              <b>{eur(total)}</b>
              <small>Orientativo, sin impuestos.</small>
              {hecho ? (
                <p>Recibido. Te mandamos la oferta en firme mañana.</p>
              ) : (
                <ContactForm title="" subtitle="" fields="name,email" submitLabel="Quiero la oferta en firme" variant="minimal" onSubmit={() => setHecho(true)} />
              )}
            </>
          )}
        </aside>
      </div>
    </main>
  );
}

function Empresa() {
  return (
    <main className="um-pag">
      <Cab titulo="Empresa" texto="Treinta años moviendo cosas que no se pueden perder." />
      <div className="um-cifras um-cifras--claras">
        <div>
          <b>1994</b>
          <span>Fundada en Algeciras</span>
        </div>
        <div>
          <b>1.800</b>
          <span>Personas en plantilla</span>
        </div>
      </div>
      <div className="um-dos">
        <p>Empezamos con un camión y un contenedor de aceite. Seguimos siendo una empresa familiar, con la diferencia de que ahora el contenedor da la vuelta al mundo.</p>
        <p>Cada cliente tiene una persona con nombre y teléfono, que responde de todos los tramos.</p>
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="um-pag">
      <Cab titulo="Mercancía perdida" texto="Esta página no aparece en ningún albarán." />
      <a href={ultramarHref()} className="um-pildora um-pildora--oscura um-solo">
        Volver
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "servicios" && b) return <Servicio id={b} />;
  if (a === "seguimiento")
    return (
      <Suspense>
        <Seguimiento />
      </Suspense>
    );
  const P = { servicios: Servicios, presupuesto: Presupuesto, empresa: Empresa }[a];
  return P ? <P /> : <NoHay />;
}
