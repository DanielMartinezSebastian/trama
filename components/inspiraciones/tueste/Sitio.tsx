"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Reveal from "@/components/ui/Reveal";
import { BLOG, ESPECIALIDADES, FOTOS, MAQUINAS, OPINIONES, PILARES, type Maquina } from "./data";
import { tuesteHref } from "./enlaces";
import "./tueste.css";

/*
 * Tueste (docs/60), a partir de CoffeeTech: tostadoras de café industriales. Portada negra con el titular centrado en una
 * grotesca enorme y la máquina; después, crema claro con la cita del fundador, el catálogo en tarjetas grises, las
 * especialidades en fotos oscuras, la opinión con un número gigante y las tres líneas de la casa con flecha. Naranja solo
 * en las llamadas. Flujos: catálogo con filtro de capacidad, comparador de hasta tres máquinas y petición de presupuesto.
 */

const NAV: [string, string][] = [
  ["catalogo", "Catálogo"],
  ["tecnologia", "Tecnología"],
  ["comparar", "Comparar"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;
const CLAVE = "trama:tueste:comparar";

/** la selección del comparador, guardada en el navegador */
function useComparar() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
      if (Array.isArray(v)) setIds(v.filter((x) => MAQUINAS.some((m) => m.id === x)).slice(0, 3));
    } catch {
      /* sin almacenamiento */
    }
  }, []);
  const guardar = (n: string[]) => {
    setIds(n);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(n));
    } catch {
      /* nada */
    }
  };
  const alternar = (id: string) => guardar(ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= 3 ? ids : [...ids, id]);
  return { ids, alternar, guardar };
}

function Logo() {
  return (
    <svg className="te-logo" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 3a9 9 0 1 0 9 9" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="18.5" cy="5.5" r="2.4" fill="var(--acc)" />
    </svg>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  const links = [{ label: "Inicio", href: tuesteHref() }, ...NAV.map(([p, l]) => ({ label: l, href: tuesteHref(p) })), { label: "Contacto", href: tuesteHref("contacto") }];
  return (
    <div className={`te ${ruta ? "" : "te--inicio"}`} id="top">
      <header className="te-head">
        <a href={tuesteHref()} className="te-head__marca">
          Tueste
          <Logo />
        </a>
        <nav aria-label="Principal" className="te-head__nav">
          {NAV.map(([p, l]) => (
            <a key={p} href={tuesteHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <div className="te-head__acc">
          <a href={tuesteHref("catalogo")} className="te-boton te-boton--naranja">
            Productos
          </a>
          <a href={tuesteHref("contacto")} className="te-boton te-boton--borde">
            Contacto
          </a>
        </div>
        <FullscreenMenu trigger="count" layout="drop" reveal="slide" size="md" linkHover="slide" brand="Tueste" openLabel="Menú" closeLabel="Cerrar" note="Vitoria-Gasteiz · desde 1998" links={links} className="te-menu" />
      </header>
      {children}
      <Pie />
    </div>
  );
}

function Pie() {
  return (
    <footer className="te-pie">
      <p className="te-pie__t">Hablemos</p>
      <div className="te-pie__cols">
        <span className="te-pie__logo">
          <Logo />
        </span>
        <div>
          <b>Visítanos</b>
          <span>Polígono de Jundiz, calle Lermandabide 8</span>
          <span>01015 Vitoria-Gasteiz</span>
        </div>
        <div>
          <b>Mapa</b>
          {NAV.map(([p, l]) => (
            <a key={p} href={tuesteHref(p)}>
              {l}
            </a>
          ))}
        </div>
        <div>
          <b>Escríbenos</b>
          <a href="mailto:hola@tueste.example">hola@tueste.example</a>
          <span>945 000 000</span>
        </div>
      </div>
      <small>Tueste · fabricante de demostración de Trama. Máquinas, precios y clientes inventados.</small>
    </footer>
  );
}

function Tarjeta({ m, comparar }: { m: Maquina; comparar?: ReturnType<typeof useComparar> }) {
  const marcada = comparar?.ids.includes(m.id);
  return (
    <article className="te-tarjeta">
      <a href={tuesteHref(`catalogo/${m.id}`)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.img} alt="" loading="lazy" />
        <b>{m.n}</b>
      </a>
      <span className="te-etiquetas">
        <small>{m.kg} kg/h</small>
        <small>{m.gas && m.electrica ? "gas o eléctrica" : m.gas ? "gas" : "eléctrica"}</small>
      </span>
      {comparar && (
        <button type="button" className="te-comparar" aria-pressed={marcada} disabled={!marcada && comparar.ids.length >= 3} onClick={() => comparar.alternar(m.id)}>
          {marcada ? "✓ En el comparador" : "Comparar"}
        </button>
      )}
    </article>
  );
}

function Portada() {
  const [op, setOp] = useState(0);
  const o = OPINIONES[op];
  return (
    <main>
      <section className="te-hero">
        <h1 className="te-gigante">
          Tostar café,
          <br />
          otra vez
        </h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.portada} alt="Una tostadora Tueste negra en penumbra" />
      </section>

      <section className="te-fundador">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.fundador} alt="Ander Ruiz, fundador de Tueste, sonriendo en el taller" loading="lazy" />
        <div>
          <p>Siempre empujando el oficio hacia delante: diseñamos y fabricamos tostadoras de café, de las que caben en un obrador a las líneas completas de una fábrica, para quien valora la técnica, el oficio y un tueste que no se olvida.</p>
          <a href={tuesteHref("tecnologia")} className="te-enlace">
            Sobre nosotros →
          </a>
        </div>
      </section>

      <section className="te-mas" aria-hidden>
        <p className="te-gigante te-gigante--claro">Más allá de lo esperado</p>
      </section>

      <section className="te-productos">
        <p className="te-sobre">[ Nuestros productos ]</p>
        <div className="te-rejilla">
          {MAQUINAS.slice(0, 4).map((m) => (
            <Tarjeta key={m.id} m={m} />
          ))}
        </div>
        <a href={tuesteHref("catalogo")} className="te-grande">
          Ver todo el catálogo →
        </a>
      </section>

      <section className="te-especialidad">
        <p className="te-sobre">[ Nuestra especialidad ]</p>
        <div>
          {ESPECIALIDADES.map((e) => (
            <figure key={e.n}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.img} alt="" loading="lazy" />
              <figcaption>{e.n}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="te-opinion">
        <p className="te-sobre">[ Opiniones ]</p>
        <p className="te-opinion__n" aria-hidden>
          {String(op + 1).padStart(2, "0")}
        </p>
        <blockquote aria-live="polite">
          <p>«{o.t}»</p>
          <footer>
            {o.n} · {o.e}
          </footer>
        </blockquote>
        <div className="te-flechas">
          <button type="button" onClick={() => setOp((op + OPINIONES.length - 1) % OPINIONES.length)} aria-label="Opinión anterior">
            ←
          </button>
          <button type="button" onClick={() => setOp((op + 1) % OPINIONES.length)} aria-label="Opinión siguiente">
            →
          </button>
        </div>
      </section>

      <section className="te-pilares">
        <p className="te-sobre">[ Nuestra manera ]</p>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.fabrica} alt="La nave de montaje de Tueste" loading="lazy" />
          <ul>
            {PILARES.map((p) => (
              <li key={p.id}>
                <a href={tuesteHref(`tecnologia#${p.id}`)}>
                  {p.t} <span aria-hidden>→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="te-blog">
        <p className="te-sobre">[ Del blog ]</p>
        <h2 className="te-grande">Al día con todo lo nuevo</h2>
        <div>
          {BLOG.map((b, k) => (
            <Reveal key={b.t} as="article" kind="fade" delay={k * 0.06}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.img} alt="" loading="lazy" />
              <small>{b.tipo}</small>
              <b>{b.t}</b>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="te-cta">
        <p className="te-grande">¿Quieres saber más?</p>
        <div>
          <a href={tuesteHref("catalogo")} className="te-boton te-boton--borde">
            Catálogo
          </a>
          <a href={tuesteHref("contacto")} className="te-boton">
            Contacto
          </a>
        </div>
      </section>
    </main>
  );
}

function Catalogo() {
  const comparar = useComparar();
  const [min, setMin] = useState(0);
  const [electrica, setElectrica] = useState(false);
  const lista = MAQUINAS.filter((m) => m.kg >= min && (!electrica || m.electrica));
  return (
    <main className="te-pag">
      <header className="te-cab">
        <p className="te-sobre">[ Catálogo ]</p>
        <h1 className="te-gigante te-gigante--pag">Siete máquinas</h1>
      </header>
      <div className="te-filtros">
        <label>
          <span>
            Capacidad mínima <b>{min} kg/h</b>
          </span>
          <input type="range" min={0} max={240} step={10} value={min} onChange={(e) => setMin(Number(e.target.value))} />
        </label>
        <label className="te-check">
          <input type="checkbox" checked={electrica} onChange={(e) => setElectrica(e.target.checked)} />
          Solo eléctricas (sin gas ni chimenea)
        </label>
        <a href={tuesteHref("comparar")} className="te-boton te-boton--naranja" aria-live="polite">
          Comparar ({comparar.ids.length}/3)
        </a>
      </div>
      <div className="te-rejilla" aria-live="polite">
        {lista.map((m) => (
          <Tarjeta key={m.id} m={m} comparar={comparar} />
        ))}
        {!lista.length && <p>Ninguna máquina cumple los dos filtros. Prueba con menos capacidad.</p>}
      </div>
    </main>
  );
}

const FILAS: [string, (m: Maquina) => string][] = [
  ["Serie", (m) => m.serie],
  ["Capacidad", (m) => `${m.kg} kg/h`],
  ["Carga por tueste", (m) => m.carga],
  ["Energía", (m) => (m.gas && m.electrica ? "gas o eléctrica" : m.gas ? "gas" : "eléctrica")],
  ["Consumo", (m) => m.consumo],
  ["Precio desde", (m) => eur(m.precio)],
];

function Ficha({ m }: { m: Maquina }) {
  const comparar = useComparar();
  return (
    <main className="te-pag">
      <div className="te-ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.img} alt={`Tostadora ${m.n}`} />
        <div>
          <p className="te-sobre">[ {m.serie} ]</p>
          <h1 className="te-gigante te-gigante--pag">{m.n}</h1>
          <p className="te-grande">{m.nota}</p>
          <dl>
            {FILAS.map(([n, f]) => (
              <div key={n}>
                <dt>{n}</dt>
                <dd>{f(m)}</dd>
              </div>
            ))}
          </dl>
          <div className="te-ficha__acc">
            <a href={tuesteHref(`contacto?maquina=${m.id}`)} className="te-boton te-boton--naranja">
              Pedir presupuesto
            </a>
            <button type="button" className="te-boton te-boton--borde" aria-pressed={comparar.ids.includes(m.id)} onClick={() => comparar.alternar(m.id)}>
              {comparar.ids.includes(m.id) ? "✓ En el comparador" : "Añadir al comparador"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Comparar() {
  const comparar = useComparar();
  const sel = comparar.ids.map((id) => MAQUINAS.find((m) => m.id === id)!);
  return (
    <main className="te-pag">
      <header className="te-cab">
        <p className="te-sobre">[ Comparar ]</p>
        <h1 className="te-gigante te-gigante--pag">Lado a lado</h1>
      </header>
      {sel.length < 2 ? (
        <p className="te-grande">
          Elige al menos dos máquinas en el <a href={tuesteHref("catalogo")}>catálogo</a>.
        </p>
      ) : (
        <div className="te-tabla">
          <table>
            <thead>
              <tr>
                <td />
                {sel.map((m) => (
                  <th key={m.id} scope="col">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.img} alt="" />
                    {m.n}
                    <button type="button" onClick={() => comparar.alternar(m.id)} aria-label={`Quitar ${m.n}`}>
                      Quitar
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FILAS.map(([n, f]) => (
                <tr key={n}>
                  <th scope="row">{n}</th>
                  {sel.map((m) => (
                    <td key={m.id}>{f(m)}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" />
                {sel.map((m) => (
                  <td key={m.id}>
                    <a href={tuesteHref(`contacto?maquina=${m.id}`)} className="te-boton te-boton--naranja">
                      Presupuesto
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function Tecnologia() {
  return (
    <main className="te-pag">
      <header className="te-cab">
        <p className="te-sobre">[ Nuestra manera ]</p>
        <h1 className="te-gigante te-gigante--pag">Hecho para durar</h1>
      </header>
      {PILARES.map((p, k) => (
        <section key={p.id} id={p.id} className="te-pilar">
          <span className="te-opinion__n">{String(k + 1).padStart(2, "0")}</span>
          <h2 className="te-grande">{p.t}</h2>
          <p>{p.texto}</p>
        </section>
      ))}
    </main>
  );
}

function Contacto() {
  // la máquina que llega del catálogo (`?maquina=`), leída tras montar: la página es estática
  const [id, setId] = useState<string | null>(null);
  useEffect(() => setId(new URLSearchParams(location.search).get("maquina")), []);
  const m = MAQUINAS.find((x) => x.id === id);
  return (
    <main className="te-pag">
      <header className="te-cab">
        <p className="te-sobre">[ Contacto ]</p>
        <h1 className="te-gigante te-gigante--pag">Pide presupuesto</h1>
      </header>
      <BriefFlow key={m?.id ?? "nada"} className="te-flujo" title={m ? `Presupuesto: ${m.n}` : "Cuéntanos qué tuestas"} services={MAQUINAS.map((x) => ({ label: x.n, hint: `${x.kg} kg/h` }))} initialServices={m ? [m.n] : []} servicesLabel="¿Qué máquinas te interesan?" budgets="Menos de 30.000 €, 30.000–100.000 €, Más de 100.000 €" timelines="Este trimestre, Este año, Solo estoy mirando" question="¿Qué tuestas, cuánto al mes y dónde?" fields="company,phone" prefix="TU" variant="minimal" />
    </main>
  );
}

function NoHay() {
  return (
    <main className="te-pag">
      <h1 className="te-gigante te-gigante--pag">Esta página se ha quemado</h1>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "catalogo" && b) {
    const m = MAQUINAS.find((x) => x.id === b);
    return m ? <Ficha m={m} /> : <NoHay />;
  }
  const P = { catalogo: Catalogo, tecnologia: Tecnologia, comparar: Comparar, contacto: Contacto }[a];
  return P ? <P /> : <NoHay />;
}
