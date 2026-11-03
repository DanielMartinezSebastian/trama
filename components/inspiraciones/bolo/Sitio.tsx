"use client";

import { useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Reveal from "@/components/ui/Reveal";
import { CIFRAS, CIUDADES, COSTE_PARADA, FLOTA, FOTOS, OFERTAS, OFICINAS, PREGUNTAS, SERVICIOS, TARIFA_KM, VALORES, type Camion } from "./data";
import { boloHref } from "./enlaces";
import "./bolo.css";

/*
 * Bolo (docs/60), a partir de Truck'N Roll: logística de giras. Negro carbón, titulares en una condensada de 900 en
 * mayúsculas que llenan la pantalla palabra a palabra con fotos metidas entre las líneas, un logotipo de pegatina girado
 * y un único acento violeta eléctrico. Una sección blanca con paréntesis gigantes rompe el negro, y el pie es violeta con
 * dos cintas cruzadas. Flujos: planificar la gira (paradas, camiones y presupuesto al momento) y candidatura a una oferta.
 */

const NAV: [string, string][] = [
  ["servicios", "Servicios"],
  ["flota", "Flota"],
  ["cultura", "Cultura"],
  ["contacto", "Contacto"],
];
const eur = (n: number) => `${Math.round(n).toLocaleString("es-ES")} €`;

/** el logotipo: una pegatina girada con la palabra en dos líneas */
function Pegatina({ grande = false }: { grande?: boolean }) {
  return (
    <span className={`bo-pegatina ${grande ? "bo-pegatina--grande" : ""}`} aria-label="Bolo">
      <span aria-hidden>BO</span>
      <span aria-hidden>&apos;LO</span>
    </span>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  const links = [{ label: "Inicio", href: boloHref() }, ...NAV.map(([p, l]) => ({ label: l, href: boloHref(p) })), { label: "Empleo", href: boloHref("empleo") }, { label: "Planifica tu gira", href: boloHref("planifica") }];
  return (
    <div className={`bo ${ruta ? "" : "bo--inicio"}`} id="top">
      <header className="bo-head">
        <p className="bo-head__lema">
          Bolo®
          <br />
          Logística
          <br />
          de giras
        </p>
        <a href={boloHref()} className="bo-head__marca">
          <Pegatina />
        </a>
        <nav aria-label="Principal" className="bo-head__nav">
          {NAV.slice(0, 3).map(([p, l]) => (
            <a key={p} href={boloHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
          <a href={boloHref("contacto")} className="bo-head__contacto" aria-current={ruta === "contacto" ? "page" : undefined}>
            Contacto
          </a>
        </nav>
        <FullscreenMenu trigger="lines" layout="full" reveal="stairs" tone="acc" size="lg" numbered linkHover="slide" brand="Bolo" openLabel="Menú" closeLabel="Cerrar" note="Zaragoza · Bilbao · 24/7" links={links} className="bo-menu" />
      </header>
      {children}
      <Pie />
    </div>
  );
}

function Pie() {
  return (
    <footer className="bo-pie">
      <div className="bo-cintas" aria-hidden>
        {[0, 1].map((k) => (
          <div key={k} className={`bo-cinta bo-cinta--${k}`}>
            <div>
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i}>
                  ES UNA GIRA <i>BO&apos;LO</i>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bo-pie__oficinas">
        {OFICINAS.map((o) => (
          <address key={o.ciudad}>
            <b>{o.ciudad}</b>
            {o.dir.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <span>{o.tel}</span>
          </address>
        ))}
      </div>
      <div className="bo-pie__cols">
        <div>
          <b>Muévete.</b>
          <a href={boloHref("planifica")}>Pon tu gira en marcha, segura y a tiempo →</a>
        </div>
        <div>
          <b>Únete.</b>
          <a href={boloHref("empleo")}>Trabaja detrás de los conciertos más grandes →</a>
        </div>
        <div>
          <b>Síguenos.</b>
          <span>
            <a href="#top">Instagram</a> · <a href="#top">LinkedIn</a> · <a href="#top">YouTube</a>
          </span>
        </div>
      </div>
      <p className="bo-pie__legal">Bolo · logística de giras de demostración de Trama. Empresa, flota, precios y ofertas inventados.</p>
    </footer>
  );
}

/** una línea de titular gigante; `foto` mete una imagen entre las palabras */
function Linea({ children, foto, alt = "" }: { children: ReactNode; foto?: string; alt?: string }) {
  return (
    <span className="bo-linea">
      {children}
      {foto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={foto} alt={alt} loading="lazy" />
      )}
    </span>
  );
}

function Portada() {
  return (
    <main>
      <section className="bo-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bo-hero__foto bo-hero__foto--a" src={FOTOS.portada} alt="Un camión de gira con los faros encendidos en la niebla" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bo-hero__foto bo-hero__foto--b" src={FOTOS.muelle} alt="Un técnico guía la carga en el muelle" />
        <h1 className="bo-gigante bo-hero__t">
          Giras
          <br />
          enteras,
          <br />
          sin excusas.
        </h1>
        <div className="bo-hero__txt">
          <p className="bo-hero__lema">El motor de cada concierto.</p>
          <p className="bo-grande">No solo movemos equipo. Nos aseguramos de que todo llegue a su sitio, cuando más importa.</p>
          <div className="bo-dos">
            <p>Llevamos el escenario de tu gira a cada ciudad a tiempo, con profesionalidad y sin sorpresas.</p>
            <p>Conocemos la vida de las giras, los festivales y los rodajes: planificamos cada ruta y resolvemos lo que surja por el camino.</p>
          </div>
        </div>
      </section>

      <section className="bo-movemos" aria-label="Movemos conciertos hacia delante">
        <p className="bo-gigante" aria-hidden>
          <Linea>Movemos</Linea>
          <Linea foto={FOTOS.remolque}>los</Linea>
          <Linea>conciertos</Linea>
          <Linea foto={FOTOS.cabina}>adelante</Linea>
        </p>
        <aside>
          <span>Desde 1994</span>
          <span>Zaragoza · Bilbao</span>
        </aside>
      </section>

      <section className="bo-valores">
        <p className="bo-sobre">Tres pasos clave</p>
        <ol>
          {VALORES.map((v, i) => (
            <Reveal key={v.n} as="li" kind="slide" direction="up" delay={i * 0.08}>
              <h3>
                <span>({v.n})</span> {v.t}
              </h3>
              <p>{v.texto}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={[FOTOS.faros, FOTOS.noche, FOTOS.conductora][i]} alt="" loading="lazy" />
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bo-afinados">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.equipo} alt="Dos jefes de muelle delante del camión" loading="lazy" />
        <p className="bo-gigante bo-afinados__a">Cada gira es distinta.</p>
        <p className="bo-gigante bo-afinados__b">Siempre afinados.</p>
        <p className="bo-afinados__pie">(Casos) · Confía en un equipo de expertos y disfruta de la tranquilidad.</p>
      </section>

      <section className="bo-preguntas">
        <p>No nos limitamos a aparecer. Llegamos preparados, comprometidos y pensando dos pasos por delante: eso marca la diferencia cuando el concierto está en juego.</p>
        <ul>
          {PREGUNTAS.map(([q, a]) => (
            <li key={q}>
              <b>{q}</b> <span>{a}</span>
              <i aria-hidden>↗</i>
            </li>
          ))}
        </ul>
      </section>

      <section className="bo-red">
        <p className="bo-red__t">
          <span className="bo-red__par" aria-hidden>
            (
          </span>
          <span className="bo-red__centro">
            <span>Una</span>
            <span>red sólida</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FOTOS.flota} alt="Tres camiones de la flota en el muelle de noche" loading="lazy" />
            <span>que nunca</span>
            <span>duerme</span>
          </span>
          <span className="bo-red__par" aria-hidden>
            )
          </span>
        </p>
        <dl className="bo-cifras">
          {CIFRAS.map(([n, t]) => (
            <div key={t}>
              <dt>{n}</dt>
              <dd>{t}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bo-listos">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.carretera} alt="Un tráiler en la autopista al atardecer" loading="lazy" />
        <div>
          <p className="bo-grande">¿Listos?</p>
          <p className="bo-grande bo-listos__b">Salimos a la carretera.</p>
          <p>Cuéntanos tu gira y nuestros expertos te dicen cómo moverla.</p>
          <a href={boloHref("planifica")} className="bo-barra">
            Planifica tu logística <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      <Fantasma />
    </main>
  );
}

/** la frase en gris sobre negro, con el enlace a la cultura de la casa */
function Fantasma() {
  return (
    <section className="bo-fantasma">
      <p className="bo-gigante" aria-label="La gente no recuerda camiones. Recuerda nombres.">
        <span aria-hidden>La gente no recuerda camiones.</span> <span aria-hidden>Recuerda nombres.</span>
      </p>
      <div>
        <p>Descubre nuestro mundo y lo que hace única nuestra cultura.</p>
        <a href={boloHref("cultura")} className="bo-chip">
          Cultura <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}

function Cab({ sobre, titulo, texto }: { sobre: string; titulo: string; texto?: string }) {
  return (
    <header className="bo-cab">
      <p className="bo-sobre">{sobre}</p>
      <h1 className="bo-gigante">{titulo}</h1>
      {texto && <p className="bo-grande">{texto}</p>}
    </header>
  );
}

function Servicios() {
  return (
    <main className="bo-pag">
      <Cab sobre="Servicios" titulo="Lo movemos todo" texto="Cuatro maneras de trabajar con nosotros. Todas empiezan con una llamada y un plan por escrito." />
      <div className="bo-servicios">
        {SERVICIOS.map((s) => (
          <article key={s.id} id={s.id}>
            <span className="bo-servicios__n">{s.n}</span>
            <h2>{s.t}</h2>
            <p>{s.texto}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt="" loading="lazy" />
            <a href={boloHref(`planifica?servicio=${s.id}`)} className="bo-chip">
              Planificar <span aria-hidden>→</span>
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}

function Flota() {
  const tipos = ["Todos", ...new Set(FLOTA.map((c) => c.tipo))];
  const [tipo, setTipo] = useState("Todos");
  const lista = FLOTA.filter((c) => tipo === "Todos" || c.tipo === tipo);
  return (
    <main className="bo-pag">
      <Cab sobre="Flota" titulo="Setenta camiones, un despacho" texto="Todos propios, revisados antes de cada salida y con seguimiento en directo." />
      <div className="bo-filtro" role="group" aria-label="Tipo de vehículo">
        {tipos.map((t) => (
          <button key={t} type="button" aria-pressed={tipo === t} onClick={() => setTipo(t)}>
            {t} <small>{t === "Todos" ? FLOTA.length : FLOTA.filter((c) => c.tipo === t).length}</small>
          </button>
        ))}
      </div>
      <ul className="bo-flota" aria-live="polite">
        {lista.map((c) => (
          <li key={c.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt="" loading="lazy" />
            <h2>{c.n}</h2>
            <p>{c.nota}</p>
            <dl>
              <div>
                <dt>Volumen</dt>
                <dd>{c.m3 ? `${c.m3} m³` : "abierta"}</dd>
              </div>
              <div>
                <dt>Carga</dt>
                <dd>{c.carga}</dd>
              </div>
              <div>
                <dt>Plazas</dt>
                <dd>{c.plazas}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Cultura() {
  return (
    <main className="bo-pag">
      <Cab sobre="Cultura" titulo="Gente de carretera" texto="Conductoras, jefes de muelle y mecánicos que conocen los conciertos por dentro. Nadie es subcontratado." />
      <section className="bo-cultura">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.equipo} alt="Parte del equipo de muelle de Bolo" loading="lazy" />
        <div>
          {VALORES.map((v) => (
            <article key={v.n}>
              <h2>
                <span>({v.n})</span> {v.t}
              </h2>
              <p>{v.texto}</p>
            </article>
          ))}
        </div>
      </section>
      <Fantasma />
    </main>
  );
}

function Empleo() {
  const [oferta, setOferta] = useState(OFERTAS[0].id);
  const actual = OFERTAS.find((o) => o.id === oferta)!;
  return (
    <main className="bo-pag">
      <Cab sobre="Empleo" titulo="Únete a la gira" texto="Trabaja detrás de los conciertos más grandes. Contrato propio, descansos pagados entre giras y formación." />
      <div className="bo-empleo">
        <ul className="bo-ofertas" role="list">
          {OFERTAS.map((o) => (
            <li key={o.id}>
              <button type="button" aria-pressed={oferta === o.id} onClick={() => setOferta(o.id)}>
                <b>{o.t}</b>
                <span>
                  {o.lugar} · {o.tipo}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <section className="bo-candidatura" aria-label={`Candidatura: ${actual.t}`}>
          <h2>{actual.t}</h2>
          <p>{actual.texto}</p>
          <ContactForm key={actual.id} title="Mándanos tu candidatura" subtitle={`${actual.lugar} · ${actual.tipo}. Te llamamos en una semana.`} submitLabel="Enviar candidatura" successMessage={`Recibida tu candidatura para «${actual.t}». Te llamamos en una semana.`} variant="minimal" />
        </section>
      </div>
    </main>
  );
}

/** distancia por carretera aproximada entre dos ciudades (la recta por 1,25) */
const km = (a: string, b: string) => {
  const p = CIUDADES.find((c) => c.id === a)!, q = CIUDADES.find((c) => c.id === b)!;
  return Math.round(Math.hypot(p.x - q.x, p.y - q.y) * 1.25);
};

function Planifica() {
  const [paradas, setParadas] = useState<string[]>(["zaragoza", "madrid", "valencia", "barcelona"]);
  const [camiones, setCamiones] = useState<Record<Camion["tipo"], number>>({ Tráiler: 2, Rígido: 1, Furgón: 1, Plataforma: 0 });
  const [nueva, setNueva] = useState("bilbao");
  const tramos = paradas.slice(1).map((c, i) => ({ de: paradas[i], a: c, km: km(paradas[i], c) }));
  const total = tramos.reduce((s, t) => s + t.km, 0);
  const porKm = (Object.keys(camiones) as Camion["tipo"][]).reduce((s, t) => s + camiones[t] * TARIFA_KM[t], 0);
  const vehiculos = Object.values(camiones).reduce((s, n) => s + n, 0);
  const precio = total * porKm + paradas.length * COSTE_PARADA * Math.max(1, vehiculos);
  // ocho horas de conducción al día a 70 km/h de media, como en la tabla de tiempos de conducción
  const dias = Math.max(1, Math.ceil(total / 560));
  const nombre = (id: string) => CIUDADES.find((c) => c.id === id)!.n;
  const resumen = useMemo(() => `${paradas.map(nombre).join(" → ")} · ${total} km · ${vehiculos} vehículos`, [paradas, total, vehiculos]);
  const mover = (i: number, d: -1 | 1) => setParadas((p) => {
    const n = [...p];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    return n;
  });
  return (
    <main className="bo-pag">
      <Cab sobre="Planifica tu gira" titulo="Pon la gira en el mapa" texto="Ordena las paradas y elige los camiones: te damos los kilómetros, los días de carretera y un presupuesto orientativo." />
      <div className="bo-plan">
        <section aria-labelledby="bo-paradas">
          <h2 id="bo-paradas">Paradas</h2>
          <ol className="bo-paradas">
            {paradas.map((p, i) => (
              <li key={`${p}-${i}`}>
                <span className="bo-paradas__n">{String(i + 1).padStart(2, "0")}</span>
                <b>{nombre(p)}</b>
                {i > 0 && <small>{tramos[i - 1].km} km</small>}
                <span className="bo-paradas__acc">
                  <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} aria-label={`Subir ${nombre(p)}`}>
                    ↑
                  </button>
                  <button type="button" onClick={() => mover(i, 1)} disabled={i === paradas.length - 1} aria-label={`Bajar ${nombre(p)}`}>
                    ↓
                  </button>
                  <button type="button" onClick={() => setParadas((q) => q.filter((_, k) => k !== i))} disabled={paradas.length <= 2} aria-label={`Quitar ${nombre(p)}`}>
                    ×
                  </button>
                </span>
              </li>
            ))}
          </ol>
          <div className="bo-anadir">
            <label htmlFor="bo-nueva">Añadir parada</label>
            <select id="bo-nueva" value={nueva} onChange={(e) => setNueva(e.target.value)}>
              {CIUDADES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.n}
                </option>
              ))}
            </select>
            <button type="button" className="bo-chip" onClick={() => setParadas((p) => (p[p.length - 1] === nueva ? p : [...p, nueva]))}>
              Añadir
            </button>
          </div>
        </section>
        <section aria-labelledby="bo-camiones">
          <h2 id="bo-camiones">Camiones</h2>
          <ul className="bo-camiones">
            {(Object.keys(camiones) as Camion["tipo"][]).map((t) => (
              <li key={t}>
                <b>{t}</b>
                <small>{TARIFA_KM[t].toLocaleString("es-ES")} €/km</small>
                <span className="bo-paso">
                  <button type="button" onClick={() => setCamiones((c) => ({ ...c, [t]: Math.max(0, c[t] - 1) }))} disabled={camiones[t] === 0} aria-label={`Un ${t} menos`}>
                    −
                  </button>
                  <output aria-live="polite">{camiones[t]}</output>
                  <button type="button" onClick={() => setCamiones((c) => ({ ...c, [t]: Math.min(12, c[t] + 1) }))} aria-label={`Un ${t} más`}>
                    +
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <aside className="bo-presupuesto" aria-live="polite">
          <p className="bo-sobre">Presupuesto orientativo</p>
          <dl>
            <div>
              <dt>Kilómetros</dt>
              <dd>{total.toLocaleString("es-ES")}</dd>
            </div>
            <div>
              <dt>Días de carretera</dt>
              <dd>{dias}</dd>
            </div>
            <div>
              <dt>Vehículos</dt>
              <dd>{vehiculos}</dd>
            </div>
          </dl>
          <p className="bo-presupuesto__total">{vehiculos ? eur(precio) : "Elige al menos un camión"}</p>
          <small>Sin IVA ni peajes. Incluye conductores, carga y descarga en cada parada.</small>
        </aside>
      </div>
      <section className="bo-enviar">
        <BriefFlow className="bo-flujo" title="Envíalo a despacho" services={[{ label: "Gira completa" }, { label: "Festival" }, { label: "Rodaje o evento" }, { label: "Almacén entre giras" }]} servicesLabel="¿Qué movemos?" budgets="Menos de 20.000 €, 20.000–80.000 €, Más de 80.000 €" budgetLabel="Presupuesto de transporte" timelines="Este mes, Este trimestre, Más adelante" question={`Cuéntanos la gira. Llevamos apuntado: ${resumen}`} fields="company,phone" prefix="BO" variant="minimal" />
      </section>
    </main>
  );
}

function Contacto() {
  return (
    <main className="bo-pag">
      <Cab sobre="Contacto" titulo="Hablemos de tu gira" texto="Despacho abierto las veinticuatro horas. Para presupuestos, mejor el planificador." />
      <div className="bo-contacto">
        <ContactForm title="Escríbenos" subtitle="Te respondemos en menos de un día laborable." submitLabel="Enviar" successMessage="Recibido. Un coordinador te escribe hoy." variant="minimal" />
        <div>
          {OFICINAS.map((o) => (
            <address key={o.ciudad}>
              <b>{o.ciudad}</b>
              {o.dir.map((l) => (
                <span key={l}>{l}</span>
              ))}
              <span>{o.tel}</span>
            </address>
          ))}
          <a href={boloHref("planifica")} className="bo-barra">
            Planifica tu logística <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="bo-pag">
      <Cab sobre="404" titulo="Esta salida no existe" texto="Vuelve a la portada o planifica una gira." />
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a] = ruta;
  if (!a) return <Portada />;
  const P = { servicios: Servicios, flota: Flota, cultura: Cultura, empleo: Empleo, planifica: Planifica, contacto: Contacto }[a];
  return P ? <P /> : <NoHay />;
}
