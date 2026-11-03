"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { AREAS, CIUDADES, CLIENTES, EQUIPO, OFERTAS, OPINIONES, SERVICIOS } from "./data";
import { canteraHref } from "./enlaces";
import Semitono from "./Semitono";
import "./cantera.css";

/*
 * Cantera (docs/58), a partir de Aspen Search: selección de perfiles técnicos. La página es una rejilla de baldosas de filetes
 * finos: palabra enorme, semitono en lienzo, una baldosa negra y otra menta. Reloj de cada ciudad en la cabecera y modo noche.
 * Ofertas con filtros combinables, favoritas, candidatura y petición para empresas.
 */

const GUARDADAS = "trama:cantera:guardadas";

function Hora({ zona, ciudad }: { zona: string; ciudad: string }) {
  const [h, setH] = useState("");
  useEffect(() => {
    const f = () => setH(new Date().toLocaleTimeString("es-ES", { timeZone: zona, hour: "2-digit", minute: "2-digit" }));
    f();
    const t = setInterval(f, 20000);
    return () => clearInterval(t);
  }, [zona]);
  return (
    <span className="ct-hora">
      {ciudad} {h}
    </span>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [noche, setNoche] = useState(false);
  const ruta = usePathname().split("/")[3] ?? "";
  const nav: [string, string][] = [
    ["ofertas", "Ofertas"],
    ["empresas", "Empresas"],
    ["equipo", "Equipo"],
    ["guardadas", "Guardadas"],
  ];
  return (
    <div className={`ct ${noche ? "ct--noche" : ""}`} id="top">
      <header className="ct-head">
        <a href={canteraHref()} className="ct-logo" aria-label="Cantera, inicio">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <path d="M3 21 12 3l9 18h-6l-3-7-3 7Z" fill="currentColor" />
          </svg>
        </a>
        <div className="ct-horas">
          <Hora zona="Europe/Madrid" ciudad="MAD" />
          <Hora zona="Europe/London" ciudad="LON" />
          <Hora zona="America/New_York" ciudad="NYC" />
        </div>
        <nav aria-label="Principal">
          {nav.map(([p, l]) => (
            <a key={p} href={canteraHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <button type="button" className="ct-tema" role="switch" aria-checked={noche} aria-label="Modo noche" onClick={() => setNoche(!noche)}>
          <i />
        </button>
        <a href={canteraHref("empresas")} className="ct-contacto">
          Hablemos <span aria-hidden>→</span>
        </a>
        <div className="ct-burger">
          <FullscreenMenu trigger="plus" layout="drop" size="sm" numbered rules brand="Cantera" openLabel="Menú" closeLabel="Cerrar" note="Selección técnica" links={[{ label: "Inicio", href: canteraHref() }, ...nav.map(([p, l]) => ({ label: l, href: canteraHref(p) }))]} />
        </div>
      </header>
      {children}
      <footer className="ct-pie">
        <p>Cantera</p>
        <div>
          <a href="mailto:hola@cantera.example">hola@cantera.example</a>
          <small>Empresa de demostración de Trama. Clientes y ofertas inventados.</small>
        </div>
      </footer>
    </div>
  );
}

function Portada() {
  return (
    <main>
      <section className="ct-mosaico">
        <div className="ct-b ct-b--marca">
          <h1>Cantera</h1>
        </div>
        <div className="ct-b ct-b--semi">
          <Semitono semilla={1} />
        </div>
        <div className="ct-b ct-b--semi">
          <Semitono semilla={2} />
        </div>
        <div className="ct-b ct-b--negra">
          <p>Colocamos ingeniería, investigación cuantitativa y especialistas en IA en las empresas que dan forma a los mercados. Desde 2006.</p>
          <a href={canteraHref("empresas")}>
            Empezar a hablar <span aria-hidden>→</span>
          </a>
        </div>
        <div className="ct-b ct-b--menta">
          <p>No movemos volumen. Movemos carreras, y a las empresas con criterio para invertir en ellas.</p>
          <div className="ct-carrusel" aria-label="Empresas recientes">
            {[...CLIENTES, ...CLIENTES].map((c, i) => (
              <span key={i} aria-hidden={i >= CLIENTES.length}>
                {c.n}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="ct-manifiesto">
        <p className="ct-mono">Quiénes somos</p>
        <p className="ct-texto">Tu próxima conversación debería ser con alguien que entiende el trabajo: los sistemas, las estrategias y la diferencia entre un equipo que te afila y otro que te para.</p>
      </section>

      <section className="ct-clientes" aria-label="Clientes">
        <div className="ct-b ct-cli-txt">
          <p className="ct-mono">Clientes</p>
          <p>Dos décadas de relación. No son logos: son personas a las que hemos ayudado a contratar desde que eran tres.</p>
          <a href={canteraHref("empresas")} className="ct-boton">
            Trabaja con nosotros <span aria-hidden>→</span>
          </a>
        </div>
        <ul>
          {CLIENTES.map((c) => (
            <li key={c.n}>
              <i style={{ background: c.c }} />
              <b>{c.n}</b>
              <span className="ct-mono">{c.s}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ct-opiniones" aria-label="Opiniones">
        {OPINIONES.map((o, i) => (
          <figure key={o.p} className={i === 0 ? "es-grande" : ""}>
            <blockquote>«{o.t}»</blockquote>
            <figcaption className="ct-mono">
              {o.p} · {o.e}
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="ct-ofertas-cta">
        <Semitono semilla={3} />
        <a href={canteraHref("ofertas")}>
          {OFERTAS.length} ofertas abiertas <span aria-hidden>→</span>
        </a>
      </section>
    </main>
  );
}

const leerGuardadas = (): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(GUARDADAS) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};
function useGuardadas() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => setIds(leerGuardadas()), []);
  const alternar = (id: string) => {
    const v = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    setIds(v);
    try {
      localStorage.setItem(GUARDADAS, JSON.stringify(v));
    } catch {
      /* sin almacenamiento */
    }
  };
  return { ids, alternar };
}

function Fila({ o, ids, alternar }: { o: (typeof OFERTAS)[number]; ids: string[]; alternar: (id: string) => void }) {
  const si = ids.includes(o.id);
  return (
    <li className="ct-fila">
      <a href={canteraHref(`ofertas/${o.id}`)}>
        <b>{o.puesto}</b>
        <span>{o.empresa}</span>
        <span>
          {o.ciudad} · {o.modo}
        </span>
        <span>{o.salario}</span>
      </a>
      <button type="button" aria-pressed={si} aria-label={`${si ? "Quitar de guardadas" : "Guardar"}: ${o.puesto}`} onClick={() => alternar(o.id)}>
        {si ? "★" : "☆"}
      </button>
    </li>
  );
}

function Ofertas() {
  const q = useSearchParams();
  const [area, setArea] = useState(q.get("area") ?? "");
  const [ciudad, setCiudad] = useState("");
  const [texto, setTexto] = useState("");
  const { ids, alternar } = useGuardadas();
  const lista = OFERTAS.filter((o) => (!area || o.area === area) && (!ciudad || o.ciudad === ciudad) && (!texto || `${o.puesto} ${o.empresa}`.toLowerCase().includes(texto.toLowerCase())));
  return (
    <main className="ct-pag">
      <h1>Ofertas</h1>
      <div className="ct-filtros">
        <label>
          <span className="ct-mono">Buscar</span>
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Puesto o empresa" />
        </label>
        <div role="group" aria-label="Área">
          {["", ...AREAS].map((a) => (
            <button key={a || "todas"} type="button" aria-pressed={area === a} onClick={() => setArea(a)}>
              {a || "Todas"}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Ciudad">
          {["", ...CIUDADES].map((c) => (
            <button key={c || "todas"} type="button" aria-pressed={ciudad === c} onClick={() => setCiudad(c)}>
              {c || "Todas"}
            </button>
          ))}
        </div>
      </div>
      <p className="ct-mono" aria-live="polite">
        {lista.length} de {OFERTAS.length}
      </p>
      {lista.length ? (
        <ul className="ct-lista">
          {lista.map((o) => (
            <Fila key={o.id} o={o} ids={ids} alternar={alternar} />
          ))}
        </ul>
      ) : (
        <p className="ct-nada">Nada con esos filtros. Escríbenos igualmente: la mitad de los puestos no se publican.</p>
      )}
    </main>
  );
}

function Oferta({ id }: { id: string }) {
  const o = OFERTAS.find((x) => x.id === id);
  const { ids, alternar } = useGuardadas();
  if (!o) return <NoHay />;
  return (
    <main className="ct-pag">
      <a href={canteraHref("ofertas")} className="ct-mono ct-volver">
        ← Todas las ofertas
      </a>
      <h1 className="ct-h1-med">{o.puesto}</h1>
      <div className="ct-oferta">
        <div>
          <p className="ct-texto">{o.texto}</p>
          <h2 className="ct-mono">Qué piden</h2>
          <ul>
            {o.pides.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <button type="button" className="ct-boton" aria-pressed={ids.includes(o.id)} onClick={() => alternar(o.id)}>
            {ids.includes(o.id) ? "Guardada ★" : "Guardar ☆"}
          </button>
        </div>
        <aside>
          <dl>
            {[["Empresa", o.empresa], ["Ciudad", o.ciudad], ["Modo", o.modo], ["Salario", o.salario]].map(([k, v]) => (
              <div key={k}>
                <dt className="ct-mono">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <ContactForm title="Presenta tu candidatura" subtitle="Te contesta una persona que conoce el puesto." messagePlaceholder="Enlace a tu trabajo y qué te interesa" submitLabel="Enviar candidatura" successTitle="Recibida" successMessage="Te escribimos en menos de una semana, sea cual sea la respuesta." variant="minimal" />
        </aside>
      </div>
    </main>
  );
}

function Guardadas() {
  const { ids, alternar } = useGuardadas();
  const lista = OFERTAS.filter((o) => ids.includes(o.id));
  return (
    <main className="ct-pag">
      <h1>Guardadas</h1>
      {lista.length ? (
        <ul className="ct-lista">
          {lista.map((o) => (
            <Fila key={o.id} o={o} ids={ids} alternar={alternar} />
          ))}
        </ul>
      ) : (
        <p className="ct-nada">
          Todavía no has guardado nada. <a href={canteraHref("ofertas")}>Mira las ofertas</a>.
        </p>
      )}
    </main>
  );
}

function Empresas() {
  return (
    <main className="ct-pag">
      <h1>Empresas</h1>
      <p className="ct-texto">Trabajamos con exclusividad y con pocas empresas a la vez. Si encajamos, te presentamos a tres personas, no a treinta.</p>
      <BriefFlow className="ct-flujo" title="Quiero contratar" services={SERVICIOS} servicesLabel="¿Qué buscas?" budgets="Una persona, De dos a cinco, Más de cinco" budgetLabel="¿Cuántas personas?" timelines="Este trimestre, Antes de seis meses, Sin prisa" question="¿Qué tiene que hacer esa persona en su primer año?" prefix="CT" storageKey="trama:cantera:empresa" variant="minimal" />
    </main>
  );
}

function Equipo() {
  return (
    <main className="ct-pag">
      <h1>Equipo</h1>
      <div className="ct-equipo">
        {EQUIPO.map((e, i) => (
          <article key={e.n}>
            <div className="ct-b ct-b--semi">
              <Semitono semilla={i + 4} />
            </div>
            <b>{e.n}</b>
            <span className="ct-mono">{e.c}</span>
            <p>{e.d}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="ct-pag">
      <h1>404</h1>
      <p className="ct-nada">
        Esta oferta ya no existe. <a href={canteraHref("ofertas")}>Mira las que quedan</a>.
      </p>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "ofertas" && b) return <Oferta id={b} />;
  if (a === "ofertas")
    return (
      <Suspense>
        <Ofertas />
      </Suspense>
    );
  const P = { empresas: Empresas, equipo: Equipo, guardadas: Guardadas }[a];
  return P ? <P /> : <NoHay />;
}
