"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Reveal from "@/components/ui/Reveal";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { CAMPOS, CAPACIDADES, DEMOS, DRONES, EQUIPO, FRASES, MISIONES, PRENSA, PUESTOS, V, type Dron } from "./data";
import { marejadaHref } from "./enlaces";
import "./marejada.css";

/*
 * Marejada (docs/58), a partir de Seasats: drones marinos autónomos. Toda la web vive en una tarjeta redondeada con una
 * columna de navegación a la derecha, y esa columna es la firma: cada bloque tiene su color, de arena a verde bosque. Serifa
 * fina muy grande sobre el mar y mono en botones y etiquetas. Comparador de la flota con selección y petición de demostración.
 */

const COLUMNA: { path: string; label: string; hijos?: [string, string][]; tono: string }[] = [
  { path: "", label: "Inicio", tono: "arena", hijos: [["capacidades", "Capacidades"], ["misiones", "Misiones"]] },
  { path: "flota", label: "Flota", tono: "salvia", hijos: DRONES.map((d) => [`flota/${d.id}`, d.nombre]) },
  { path: "equipo", label: "Equipo", tono: "liquen" },
  { path: "empleo", label: "Empleo", tono: "musgo" },
  { path: "prensa", label: "Prensa", tono: "pino" },
  { path: "contacto", label: "Contacto", tono: "bosque" },
];

export function Shell({ children }: { children: ReactNode }) {
  const camino = usePathname().split("/").slice(3).join("/");
  const links = COLUMNA.flatMap((c) => [{ label: c.label, href: marejadaHref(c.path) }]);
  return (
    <div className="mj">
      <a href={marejadaHref()} className="mj-logo" aria-label="Marejada, inicio">
        MAREJADA
      </a>
      <div className="mj-burger">
        <FullscreenMenu brand="Marejada" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Autonomía oceánica" links={links} />
      </div>
      <nav className="mj-columna" aria-label="Principal">
        {COLUMNA.map((c) => (
          <div key={c.label} className={`mj-bloque mj-bloque--${c.tono}`}>
            <a href={marejadaHref(c.path)} aria-current={camino === c.path ? "page" : undefined}>
              {c.label}
            </a>
            {c.hijos?.map(([p, l], i) => (
              <a key={p} href={marejadaHref(p)} aria-current={camino === p ? "page" : undefined}>
                <i>{String(i + 1).padStart(2, "0")}</i> {l}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div className="mj-lienzo">
        {children}
        <footer className="mj-pie">
          <p>Lo que pasa en el mar ya no tiene por qué ser un misterio.</p>
          <small>Marejada · empresa de demostración de Trama. Drones y misiones inventados.</small>
        </footer>
      </div>
    </div>
  );
}

function Agua({ video = `${V}costa/02-costa-oregon` }: { video?: string }) {
  return <video className="mj-agua" src={`${video}.mp4`} poster={`${video}.jpg`} autoPlay muted loop playsInline aria-hidden />;
}

function Dibujo({ d, className = "" }: { d: Dron; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={d.img} alt={`${d.nombre}, dron marino de ${d.eslora} de eslora`} className={className} loading="lazy" />;
}

function Portada() {
  const [f, setF] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setF((x) => (x + 1) % FRASES.length), 1900);
    return () => clearInterval(t);
  }, []);
  return (
    <main>
      <section className="mj-hero">
        <Agua />
        <h1>Autonomía oceánica que funciona</h1>
        <a href={marejadaHref("flota")} className="mj-boton">
          VER LA FLOTA <span aria-hidden>→</span>
        </a>
      </section>

      <section className="mj-frases">
        <Agua video={`${V}costa/01-olas-islandia`} />
        <div aria-live="off">
          {FRASES.map((x, i) => (
            <p key={x} className={i === f ? "is-on" : ""}>
              {x}
            </p>
          ))}
        </div>
        <p className="mj-frases__fin">El mar lo guarda todo. Nosotros lo leemos.</p>
      </section>

      <section className="mj-capacidades">
        <h2>Al agua en minutos.</h2>
        <Reveal kind="slide" stagger={0.1} className="mj-cuatro">
          {CAPACIDADES.map((c, i) => (
            <article key={c.t}>
              <span className="mj-mono">0{i + 1}</span>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </article>
          ))}
        </Reveal>
      </section>

      <section className="mj-flota">
        <h2>Tres tamaños para un solo océano</h2>
        <div className="mj-tres">
          {DRONES.map((d) => (
            <a key={d.id} href={marejadaHref(`flota/${d.id}`)}>
              <Dibujo d={d} />
              <b>{d.nombre}</b>
              <span>{d.lema}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mj-cifras">
        {[["1 M", "de millas autónomas"], ["2.300", "días en el mar"], ["14 m", "la ola más alta superada"]].map(([a, b]) => (
          <div key={b}>
            <b>{a}</b>
            <span>{b}</span>
          </div>
        ))}
      </section>

      <section className="mj-misiones">
        <h2>Misiones pasadas</h2>
        {MISIONES.map((m) => (
          <a key={m.id} href={marejadaHref(`misiones/${m.id}`)}>
            <span className="mj-mono">
              {m.lugar} · {m.ano}
            </span>
            <b>{m.titulo}</b>
          </a>
        ))}
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto }: { titulo: string; texto?: string }) => (
  <header className="mj-cab">
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function Capacidades() {
  return (
    <main>
      <Cab titulo="Capacidades" texto="Vigilancia, ciencia y mantenimiento de infraestructuras, sin tripulación y sin parar." />
      <div className="mj-video">
        <VideoPlayer src={`${V}oceano/03-delfines-hawai.mp4`} poster={`${V}oceano/03-delfines-hawai.jpg`} />
      </div>
      <div className="mj-cuatro mj-margen">
        {CAPACIDADES.map((c, i) => (
          <article key={c.t}>
            <span className="mj-mono">0{i + 1}</span>
            <h3>{c.t}</h3>
            <p>{c.d}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

function Misiones() {
  return (
    <main>
      <Cab titulo="Misiones" />
      <div className="mj-tarjetas">
        {MISIONES.map((m) => (
          <a key={m.id} href={marejadaHref(`misiones/${m.id}`)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.img} alt="" loading="lazy" />
            <span className="mj-mono">
              {m.lugar} · {m.ano}
            </span>
            <b>{m.titulo}</b>
          </a>
        ))}
      </div>
    </main>
  );
}

function MisionPag({ id }: { id: string }) {
  const m = MISIONES.find((x) => x.id === id);
  if (!m) return <NoHay />;
  return (
    <main>
      <Cab titulo={m.titulo} texto={`${m.lugar}, ${m.ano}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m.img} alt={m.titulo} className="mj-ancha" />
      <div className="mj-texto">
        <p>{m.texto}</p>
        <dl>
          {m.datos.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}

/** comparador: se eligen los drones que se quieren enfrentar y la tabla se recompone */
function Flota() {
  const [sel, setSel] = useState(DRONES.map((d) => d.id));
  const lista = DRONES.filter((d) => sel.includes(d.id));
  return (
    <main>
      <Cab titulo="Comparar la flota" texto="Elige los que quieras enfrentar." />
      <div className="mj-chips" role="group" aria-label="Drones a comparar">
        {DRONES.map((d) => (
          <button key={d.id} type="button" aria-pressed={sel.includes(d.id)} onClick={() => setSel(sel.includes(d.id) ? sel.filter((x) => x !== d.id) : [...sel, d.id])}>
            {d.nombre}
          </button>
        ))}
      </div>
      {lista.length ? (
        <div className="mj-tabla">
          <table>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Dato</span>
                </th>
                {lista.map((d) => (
                  <th key={d.id} scope="col">
                    <a href={marejadaHref(`flota/${d.id}`)}>{d.nombre}</a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAMPOS.map(([k, l]) => (
                <tr key={k}>
                  <th scope="row">{l}</th>
                  {lista.map((d) => (
                    <td key={d.id}>{d[k]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mj-margen">Elige al menos un dron para compararlo.</p>
      )}
    </main>
  );
}

function DronPag({ id }: { id: string }) {
  const d = DRONES.find((x) => x.id === id);
  if (!d) return <NoHay />;
  return (
    <main>
      <Cab titulo={d.nombre} texto={d.lema} />
      <Dibujo d={d} className="mj-ancha" />
      <div className="mj-texto">
        <div>
          <p>{d.texto}</p>
          <a href={`${marejadaHref("contacto")}?dron=${d.id}`} className="mj-boton mj-boton--oscuro">
            PEDIR DEMOSTRACIÓN <span aria-hidden>→</span>
          </a>
        </div>
        <dl>
          {CAMPOS.map(([k, l]) => (
            <div key={k}>
              <dt>{l}</dt>
              <dd>{d[k]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}

function Equipo() {
  return (
    <main>
      <Cab titulo="Equipo" texto="Gente que se marea poco." />
      <div className="mj-tres mj-margen">
        {EQUIPO.map((e) => (
          <article key={e.n}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={e.img} alt={`Retrato de ${e.n}`} loading="lazy" />
            <b>{e.n}</b>
            <span className="mj-mono">{e.c}</span>
            <p>{e.d}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

function Empleo() {
  return (
    <main>
      <Cab titulo="Empleo" />
      <ul className="mj-filas">
        {PUESTOS.map((p) => (
          <li key={p}>
            <a href={`mailto:empleo@marejada.example?subject=${encodeURIComponent(p)}`}>{p}</a>
          </li>
        ))}
      </ul>
      <div className="mj-margen">
        <ContactForm title="¿No está tu puesto?" subtitle="" submitLabel="Enviar" successMessage="Recibido. Te leemos esta semana." variant="minimal" />
      </div>
    </main>
  );
}

function Prensa() {
  return (
    <main>
      <Cab titulo="Prensa" />
      <ul className="mj-filas">
        {PRENSA.map((p) => (
          <li key={p.t}>
            <span className="mj-mono">
              {p.m} · {p.f}
            </span>
            <b>{p.t}</b>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Contacto() {
  return (
    <main>
      <Cab titulo="Pide una demostración" texto="La hacemos en el agua, en tu puerto." />
      <BriefFlow className="mj-margen" title="Demostración de Marejada" services={DEMOS} servicesLabel="¿Qué dron te interesa?" budgets="Una unidad, Entre dos y diez, Más de diez" budgetLabel="¿Cuántos?" timelines="Este trimestre, Este año, Estudiando" question="¿Qué quieres vigilar?" prefix="MJ" storageKey="trama:marejada:demo" variant="minimal" />
    </main>
  );
}

function NoHay() {
  return (
    <main>
      <Cab titulo="Fuera de cobertura" texto="Esta página se ha ido a la deriva." />
      <a href={marejadaHref()} className="mj-boton mj-boton--oscuro mj-solo">
        VOLVER A PUERTO
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "flota" && b) return <DronPag id={b} />;
  if (a === "misiones" && b) return <MisionPag id={b} />;
  const P = { capacidades: Capacidades, misiones: Misiones, flota: Flota, equipo: Equipo, empleo: Empleo, prensa: Prensa, contacto: Contacto }[a];
  return P ? <P /> : <NoHay />;
}
