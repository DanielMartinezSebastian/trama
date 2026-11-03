"use client";

import { Suspense, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Parallax from "@/components/ui/Parallax";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Reveal from "@/components/ui/Reveal";
import { CAMPAMENTOS, CIFRAS, CITA, DIARIO, EXPERIENCIAS, FOTOS, type Campamento } from "./data";
import { anchaHref } from "./enlaces";
import "./tierra-ancha.css";

/*
 * Tierra Ancha (docs/59), a partir de Tengile MalaMala Collection: campamentos de safari. Crema y verde oliva, serifa de
 * trazo finísimo en mayúsculas para los titulares (PP Fragment 220 → Cormorant Garamond 300) y una grotesca pequeña para
 * el resto. La portada es una foto a sangre con el titular en dos líneas desplazadas; después, párrafos enormes en serifa,
 * un collage suelto de fotos de fauna que flotan a distinta velocidad y cartas de los campamentos. Flujo: planificar la
 * estancia con presupuesto al momento.
 */

const NAV: [string, string][] = [
  ["campamentos", "Campamentos"],
  ["experiencias", "Experiencias"],
  ["conservacion", "Conservación"],
  ["diario", "Diario"],
];
const eur = (n: number) => `${Math.round(n).toLocaleString("es-ES")} €`;

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  return (
    <div className={`ta ${ruta ? "" : "ta--inicio"}`} id="top">
      <header className="ta-head">
        <a href={anchaHref("planifica")} className="ta-mini">
          Consultar
        </a>
        <a href={anchaHref()} className="ta-logo" aria-label="Tierra Ancha, inicio">
          <span>Tierra</span>
          <span>Ancha</span>
          <small>colección</small>
        </a>
        <FullscreenMenu
          trigger="text"
          linkHover="slide"
          layout="split"
          reveal="fade"
          size="md"
          className="ta-menu"
          brand="Tierra Ancha"
          openLabel="Menú"
          closeLabel="Cerrar"
          note="Reserva de Saba"
          links={[{ label: "Inicio", href: anchaHref() }, ...NAV.map(([p, l]) => ({ label: l, href: anchaHref(p) })), { label: "Planifica tu estancia", href: anchaHref("planifica") }]}
          footer={[{ label: "Instagram", href: "#" }, { label: "hola@tierraancha.example", href: "#" }]}
          aside={
            // eslint-disable-next-line @next/next/no-img-element
            <img src={FOTOS.leopardo} alt="" />
          }
        />
      </header>
      {children}
      <footer className="ta-pie">
        <div className="ta-pie__boletin">
          <h2>Cartas desde la reserva</h2>
          <p>Una al mes: qué ha pasado en el río, quién ha nacido y cuándo vuelven las lluvias.</p>
          <ContactForm title="" subtitle="" fields="email" layout="inline" submitLabel="Suscribirme" successTitle="Hecho" successMessage="La primera carta sale a final de mes." variant="minimal" />
        </div>
        <nav className="ta-pie__cols" aria-label="Pie">
          <div>
            <h3>Explorar</h3>
            {NAV.map(([p, l]) => (
              <a key={p} href={anchaHref(p)}>
                {l}
              </a>
            ))}
          </div>
          <div>
            <h3>Campamentos</h3>
            {CAMPAMENTOS.map((c) => (
              <a key={c.id} href={anchaHref(`campamentos/${c.id}`)}>
                {c.n}
              </a>
            ))}
          </div>
          <div>
            <h3>Reserva</h3>
            <a href={anchaHref("planifica")}>Planifica tu estancia</a>
            <span>+34 900 000 000</span>
            <span>viajes@tierraancha.example</span>
          </div>
        </nav>
        <p className="ta-pie__marca" aria-hidden>
          Tierra Ancha
        </p>
        <small>Tierra Ancha · colección de demostración de Trama. Campamentos, reserva y precios inventados.</small>
      </footer>
    </div>
  );
}

function Portada() {
  return (
    <main>
      <section className="ta-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.portada} alt="Elefantes cruzando una charca al atardecer" className="ta-hero__img" />
        <h1>
          <span>Abundancia</span>
          <span>sin prisa</span>
        </h1>
        <div className="ta-hero__pie">
          <p>Cuatro campamentos en trece mil hectáreas sin vallas, para ver la sabana y ayudar a que siga así.</p>
          <a href={anchaHref("campamentos")} className="ta-boton">
            Ver la colección <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      <section className="ta-intro">
        <p className="ta-etiqueta">Reserva de Saba</p>
        <Reveal kind="slide" as="p" className="ta-grande">
          A lo largo de uno de los tramos de río con más fauna del continente, la colección reúne lodges y campamentos para un safari tranquilo, con guías de la zona y tiempo para mirar.
        </Reveal>
      </section>

      <section className="ta-collage" aria-label="Fauna de la reserva">
        <Parallax speed={0.08} className="ta-collage__a">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.leopardo} alt="Leopardo en una rama" loading="lazy" />
        </Parallax>
        <div className="ta-collage__txt">
          <p className="ta-etiqueta">Alojamiento</p>
          <p className="ta-grande">Cada lodge y cada campamento cuenta la sabana a su manera: del porche de 1931 a la casa sobre las rocas. Todos miran al mismo río.</p>
        </div>
        <Parallax speed={0.18} className="ta-collage__b">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.tortuga} alt="Tortuga leopardo" loading="lazy" />
        </Parallax>
      </section>

      <section className="ta-cartas" aria-label="Campamentos">
        {CAMPAMENTOS.map((c) => (
          <Carta key={c.id} c={c} />
        ))}
      </section>

      <section className="ta-cita">
        <blockquote>
          <p>«{CITA.texto}»</p>
          <footer className="ta-etiqueta">{CITA.autor}</footer>
        </blockquote>
      </section>

      <section className="ta-conserva">
        <Parallax speed={0.12} className="ta-conserva__a">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.rio} alt="El río visto desde el aire" loading="lazy" />
        </Parallax>
        <div className="ta-conserva__b">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.guardas} alt="Guardas de la reserva" loading="lazy" />
          <p>La tierra es de las comunidades vecinas desde 2009. Nosotros la arrendamos, formamos a sus guardas y repartimos con ellas cada noche vendida.</p>
          <a href={anchaHref("conservacion")} className="ta-boton ta-boton--claro">
            Nuestra historia <span aria-hidden>→</span>
          </a>
        </div>
        <Parallax speed={0.24} className="ta-conserva__c">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.abejaruco} alt="Abejaruco carmín" loading="lazy" />
        </Parallax>
      </section>

      <section className="ta-cifras">
        {CIFRAS.map(([a, b]) => (
          <div key={b}>
            <b>{a}</b>
            <span>{b}</span>
          </div>
        ))}
      </section>

      <section className="ta-gente" aria-label="El equipo">
        <p className="ta-etiqueta">Quién te acompaña</p>
        <div>
          {[
            [FOTOS.guia, "Amani, guía desde 2008"],
            [FOTOS.rastreador, "Baraka, rastreador"],
            [FOTOS.guardas, "El equipo de guardas"],
            [FOTOS.escuela, "La escuela de Nyika"],
          ].map(([src, t]) => (
            <figure key={t}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" />
              <figcaption>{t}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="ta-diario">
        <header>
          <p className="ta-etiqueta">Diario</p>
          <a href={anchaHref("diario")} className="ta-mini">
            Todo el diario →
          </a>
        </header>
        <div>
          {DIARIO.map((d) => (
            <a key={d.id} href={anchaHref(`diario/${d.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.img} alt="" loading="lazy" />
              <small>
                {d.tipo} · {d.fecha}
              </small>
              <b>{d.t}</b>
            </a>
          ))}
        </div>
      </section>

      <section className="ta-llamada">
        <p className="ta-grande">Nuestros especialistas preparan cada viaje contigo: campamentos, noches, vuelos interiores y lo que quieras ver.</p>
        <a href={anchaHref("planifica")} className="ta-boton">
          Planifica tu estancia <span aria-hidden>→</span>
        </a>
      </section>
    </main>
  );
}

function Carta({ c }: { c: Campamento }) {
  return (
    <a href={anchaHref(`campamentos/${c.id}`)} className="ta-carta">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.img} alt="" loading="lazy" />
      <small className="ta-etiqueta">{c.tipo}</small>
      <b>{c.n}</b>
    </a>
  );
}

const Cab = ({ titulo, texto, etiqueta }: { titulo: string; texto?: string; etiqueta?: string }) => (
  <header className="ta-cab">
    {etiqueta && <p className="ta-etiqueta">{etiqueta}</p>}
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function Campamentos() {
  return (
    <main className="ta-pag">
      <Cab etiqueta="Alojamiento" titulo="Campamentos" texto="Dos lodges y dos campamentos a lo largo del mismo río. Se pueden combinar en un solo viaje." />
      {(["Lodge", "Campamento"] as const).map((t) => (
        <section key={t} className="ta-lista">
          <h2 className="ta-etiqueta">{t === "Lodge" ? "Lodges" : "Campamentos"}</h2>
          {CAMPAMENTOS.filter((c) => c.tipo === t).map((c) => (
            <a key={c.id} href={anchaHref(`campamentos/${c.id}`)} className="ta-fila">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt="" loading="lazy" />
              <div>
                <b>{c.n}</b>
                <p>{c.lema}</p>
                <small>
                  {c.suites} suites · desde {eur(c.noche)} la noche
                </small>
              </div>
            </a>
          ))}
        </section>
      ))}
    </main>
  );
}

function Ficha({ id }: { id: string }) {
  const c = CAMPAMENTOS.find((x) => x.id === id);
  if (!c) return <NoHay />;
  return (
    <main className="ta-pag">
      <Cab etiqueta={c.tipo} titulo={c.n} texto={c.lema} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.img} alt="" className="ta-ancha" />
      <div className="ta-dos">
        <p className="ta-grande">{c.texto}</p>
        <dl className="ta-datos">
          <div>
            <dt className="ta-etiqueta">Suites</dt>
            <dd>{c.suites}</dd>
          </div>
          <div>
            <dt className="ta-etiqueta">Desde</dt>
            <dd>{eur(c.noche)} la noche</dd>
          </div>
          {c.rasgos.map((r) => (
            <div key={r}>
              <dt className="ta-etiqueta">Incluye</dt>
              <dd>{r}</dd>
            </div>
          ))}
        </dl>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FOTOS.suite} alt="Interior de una suite" className="ta-media" loading="lazy" />
      <a href={anchaHref(`planifica?c=${c.id}`)} className="ta-boton ta-solo">
        Planifica una estancia en {c.n} <span aria-hidden>→</span>
      </a>
    </main>
  );
}

function Experiencias() {
  return (
    <main className="ta-pag">
      <Cab etiqueta="El día en la reserva" titulo="Experiencias" texto="Todo lo que se hace aquí empieza temprano y termina alrededor del fuego." />
      {EXPERIENCIAS.map((e, i) => (
        <article key={e.id} className={`ta-exp ${i % 2 ? "ta-exp--der" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={e.img} alt="" loading="lazy" />
          <div>
            <small className="ta-etiqueta">{e.hora}</small>
            <h2>{e.n}</h2>
            <p>{e.texto}</p>
          </div>
        </article>
      ))}
    </main>
  );
}

function Conservacion() {
  return (
    <main className="ta-pag">
      <Cab etiqueta="Desde 1931" titulo="Conservación" texto="Cuidar el equilibrio de la reserva es la razón de que existan los campamentos, no al revés." />
      <section className="ta-cifras ta-cifras--pag">
        {CIFRAS.map(([a, b]) => (
          <div key={b}>
            <b>{a}</b>
            <span>{b}</span>
          </div>
        ))}
      </section>
      <div className="ta-dos">
        <p className="ta-grande">Cada noche vendida paga guardas, la escuela de Nyika y la vigilancia del río en la estación seca.</p>
        <p>Los guardas salen de las comunidades vecinas y se forman dos años con nuestro equipo. Desde 2015 no se ha registrado ningún caso de caza furtiva en la orilla norte.</p>
      </div>
      <div className="ta-par">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.guardas} alt="Guardas de la reserva" loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.escuela} alt="Escuela de Nyika" loading="lazy" />
      </div>
    </main>
  );
}

function Diario() {
  const [tipo, setTipo] = useState("");
  const lista = DIARIO.filter((d) => !tipo || d.tipo === tipo);
  return (
    <main className="ta-pag">
      <Cab etiqueta="Diario" titulo="Desde el río" />
      <div className="ta-filtro" role="group" aria-label="Tipo">
        {["", "Diario de fauna", "Historias"].map((t) => (
          <button key={t || "todo"} type="button" aria-pressed={tipo === t} onClick={() => setTipo(t)}>
            {t || "Todo"}
          </button>
        ))}
      </div>
      <div className="ta-entradas">
        {lista.map((d) => (
          <a key={d.id} href={anchaHref(`diario/${d.id}`)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.img} alt="" loading="lazy" />
            <small className="ta-etiqueta">
              {d.tipo} · {d.fecha}
            </small>
            <b>{d.t}</b>
          </a>
        ))}
      </div>
    </main>
  );
}

function Entrada({ id }: { id: string }) {
  const d = DIARIO.find((x) => x.id === id);
  if (!d) return <NoHay />;
  return (
    <main className="ta-pag ta-articulo">
      <Cab etiqueta={`${d.tipo} · ${d.fecha}`} titulo={d.t} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={d.img} alt="" className="ta-media" />
      {d.texto.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <a href={anchaHref("diario")} className="ta-mini">
        ← Volver al diario
      </a>
    </main>
  );
}

const INTERESES = ["Grandes felinos", "Aves", "Fotografía", "Safari a pie", "Viaje en familia", "Luna de miel"];

function Planifica() {
  const q = useSearchParams();
  const [paso, setPaso] = useState(0);
  const [noches, setNoches] = useState<Record<string, number>>(() => {
    const c = q.get("c");
    return Object.fromEntries(CAMPAMENTOS.map((x) => [x.id, x.id === c ? 3 : 0]));
  });
  const [llegada, setLlegada] = useState("");
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);
  const [intereses, setIntereses] = useState<string[]>([]);
  const [datos, setDatos] = useState({ nombre: "", correo: "" });
  const [error, setError] = useState("");
  const [ref, setRef] = useState("");
  const elegidos = CAMPAMENTOS.filter((c) => noches[c.id] > 0);
  const total = elegidos.reduce((s, c) => s + noches[c.id] * c.noche * (1 + Math.max(0, adultos - 2) * 0.5 + ninos * 0.3), 0);
  const totalNoches = elegidos.reduce((s, c) => s + noches[c.id], 0);

  const seguir = () => {
    setError("");
    if (paso === 0 && !totalNoches) return setError("Elige al menos una noche en algún campamento.");
    if (paso === 1 && !llegada) return setError("Indica el día de llegada.");
    if (paso === 2) {
      if (datos.nombre.trim().length < 2) return setError("Escribe tu nombre.");
      if (!/^\S+@\S+\.\S+$/.test(datos.correo)) return setError("Revisa el correo.");
      return setRef(`TA-${String(Date.now()).slice(-5)}`);
    }
    setPaso(paso + 1);
  };

  if (ref)
    return (
      <main className="ta-pag">
        <Cab etiqueta={`Solicitud ${ref}`} titulo="Gracias" texto={`Una especialista te escribe en 24 horas con la propuesta de ${totalNoches} noches.`} />
        <a href={anchaHref()} className="ta-boton ta-solo">
          Volver al inicio <span aria-hidden>→</span>
        </a>
      </main>
    );

  return (
    <main className="ta-pag">
      <Cab etiqueta={`Paso ${paso + 1} de 3`} titulo="Planifica tu estancia" texto="Combina campamentos y noches. Te devolvemos una propuesta cerrada, con vuelos interiores." />
      <div className="ta-plan">
        <div className="ta-plan__form">
          {paso === 0 &&
            CAMPAMENTOS.map((c) => (
              <div key={c.id} className="ta-plan__fila">
                <div>
                  <b>{c.n}</b>
                  <small>desde {eur(c.noche)} la noche</small>
                </div>
                <QuantityStepper value={noches[c.id]} onChange={(n) => setNoches({ ...noches, [c.id]: n })} min={0} max={10} label={`Noches en ${c.n}`} size="sm" />
              </div>
            ))}
          {paso === 1 && (
            <>
              <label className="ta-campo">
                <span className="ta-etiqueta">Llegada</span>
                <input type="date" value={llegada} min="2026-11-04" onChange={(e) => setLlegada(e.target.value)} />
              </label>
              <div className="ta-plan__fila">
                <b>Adultos</b>
                <QuantityStepper value={adultos} onChange={setAdultos} min={1} max={8} label="Adultos" size="sm" />
              </div>
              <div className="ta-plan__fila">
                <b>Niños (6–15)</b>
                <QuantityStepper value={ninos} onChange={setNinos} min={0} max={6} label="Niños" size="sm" />
              </div>
            </>
          )}
          {paso === 2 && (
            <>
              <div className="ta-filtro" role="group" aria-label="Qué te gustaría ver">
                {INTERESES.map((i) => (
                  <button key={i} type="button" aria-pressed={intereses.includes(i)} onClick={() => setIntereses(intereses.includes(i) ? intereses.filter((x) => x !== i) : [...intereses, i])}>
                    {i}
                  </button>
                ))}
              </div>
              <label className="ta-campo">
                <span className="ta-etiqueta">Nombre</span>
                <input value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} autoComplete="name" />
              </label>
              <label className="ta-campo">
                <span className="ta-etiqueta">Correo</span>
                <input type="email" value={datos.correo} onChange={(e) => setDatos({ ...datos, correo: e.target.value })} autoComplete="email" />
              </label>
            </>
          )}
          {error && (
            <p className="ta-error" role="alert">
              {error}
            </p>
          )}
          <div className="ta-plan__botones">
            {paso > 0 && (
              <button type="button" className="ta-boton ta-boton--claro" onClick={() => setPaso(paso - 1)}>
                Atrás
              </button>
            )}
            <button type="button" className="ta-boton" onClick={seguir}>
              {paso === 2 ? "Enviar la solicitud" : "Continuar"} <span aria-hidden>→</span>
            </button>
          </div>
        </div>
        <aside className="ta-plan__resumen" aria-live="polite">
          <p className="ta-etiqueta">Tu viaje</p>
          {elegidos.length ? (
            <ul>
              {elegidos.map((c) => (
                <li key={c.id}>
                  {c.n}
                  <span>
                    {noches[c.id]} {noches[c.id] === 1 ? "noche" : "noches"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aún no has elegido campamentos.</p>
          )}
          <p>
            {adultos} {adultos === 1 ? "adulto" : "adultos"}
            {ninos ? ` · ${ninos} ${ninos === 1 ? "niño" : "niños"}` : ""}
            {llegada ? ` · llegada el ${new Date(llegada).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}` : ""}
          </p>
          <b>{eur(total)}</b>
          <small>Orientativo, pensión completa y safaris incluidos.</small>
        </aside>
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="ta-pag">
      <Cab titulo="Fuera del mapa" texto="Esta página no está en la reserva." />
      <a href={anchaHref()} className="ta-boton ta-solo">
        Volver <span aria-hidden>→</span>
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "campamentos" && b) return <Ficha id={b} />;
  if (a === "diario" && b) return <Entrada id={b} />;
  if (a === "planifica")
    return (
      <Suspense>
        <Planifica />
      </Suspense>
    );
  const P = { campamentos: Campamentos, experiencias: Experiencias, conservacion: Conservacion, diario: Diario }[a];
  return P ? <P /> : <NoHay />;
}
