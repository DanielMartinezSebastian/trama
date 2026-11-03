"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import ContactForm from "@/components/ui/ContactForm";
import FAQSection from "@/components/ui/FAQSection";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useCart } from "@/lib/commerce/cart";
import { DIAS, ENTRADAS, ESCENARIOS, FAQ, NAVE, PONENTES, SESIONES } from "./data";
import { plenoHref } from "./enlaces";
import "./pleno.css";

/*
 * PLENO (docs/59), a partir de OFFF Forum: semana de diseño, arte y cultura digital. Blanco y negro, fotos de escenario a sangre
 * que se funden una tras otra bajo el mismo titular centrado en una serifa de mayúsculas (Forvm → Instrument Serif) y un
 * logotipo de formas ultranegras junto a la palabra en serifa. Las fechas van en un recuadro con filete fino arriba a la
 * izquierda. Flujos: programa con agenda propia que se guarda y compra de entradas.
 */

const NAV: [string, string][] = [
  ["programa", "Programa"],
  ["ponentes", "Ponentes"],
  ["entradas", "Entradas"],
  ["lugar", "Lugar"],
  ["preguntas", "Preguntas"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;
const TITULAR = "Una semana de diseño, arte y cultura digital · Foro · 15 sep 2027 · Pleno 16–17 sep · Las Naves, Valencia";

/** el logotipo: formas ultranegras (círculo, cuadrado, triángulo y una píldora) y la palabra en serifa */
function Marca({ grande = false }: { grande?: boolean }) {
  return (
    <span className={`pl-marca ${grande ? "pl-marca--grande" : ""}`} aria-label="PLENO">
      <svg viewBox="0 0 330 100" aria-hidden>
        <circle cx="50" cy="50" r="50" />
        <rect x="110" y="0" width="100" height="100" rx="14" />
        <polygon points="218,100 260,0 302,100" />
        <rect x="306" y="0" width="24" height="56" rx="12" />
      </svg>
      <span>PLENO</span>
    </span>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  return (
    <div className={`pl ${ruta ? "" : "pl--inicio"}`} id="top">
      <header className="pl-head">
        <a href={plenoHref()} className="pl-head__marca">
          <Marca />
        </a>
        <dl className="pl-fechas">
          <div>
            <dt>Foro</dt>
            <dd>15 sep 2027</dd>
          </div>
          <div>
            <dt>Pleno</dt>
            <dd>16–17 sep 2027</dd>
          </div>
          <div className="pl-fechas__lugar">
            <dd>Las Naves, Valencia</dd>
          </div>
        </dl>
        <nav aria-label="Principal">
          {NAV.map(([p, l]) => (
            <a key={p} href={plenoHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <div className="pl-burger">
          <FullscreenMenu
            trigger="burger"
            layout="full"
            tone="fg"
            reveal="stairs"
            size="lg"
            align="center"
            className="pl-menu"
            brand="PLENO"
            openLabel="Menú"
            closeLabel="Cerrar"
            note="15–17 sep 2027 · Las Naves, Valencia"
            links={[{ label: "Inicio", href: plenoHref() }, ...NAV.map(([p, l]) => ({ label: l, href: plenoHref(p) })), { label: "Prensa", href: plenoHref("prensa") }]}
          />
        </div>
      </header>
      {children}
      <footer className="pl-pie">
        <div className="pl-pie__fila">
          <div className="pl-pie__boletin">
            <h2>Únete a la comunidad y recibe novedades, ofertas y contenido exclusivo.</h2>
            <ContactForm title="" subtitle="" fields="email" layout="inline" submitLabel="Apuntarme" successTitle="Hecho" successMessage="Te escribimos cuando haya cartel." variant="minimal" />
          </div>
          <nav aria-label="Pie">
            <a href={plenoHref("prensa")}>Sala de prensa</a>
            <a href={plenoHref("preguntas")}>Preguntas</a>
            <a href={plenoHref("lugar")}>Contacto</a>
          </nav>
        </div>
        <a href={plenoHref()} className="pl-pie__marca" aria-label="PLENO, inicio">
          <Marca grande />
        </a>
        <small>PLENO · festival de demostración de Trama. Ponentes, programa y precios inventados.</small>
      </footer>
    </div>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % ESCENARIOS.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="pl-hero">
      {ESCENARIOS.map((src, k) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt="" className={k === i ? "is-on" : ""} />
      ))}
      <div>
        <h1>{TITULAR}</h1>
        <a href={plenoHref("entradas")} className="pl-boton pl-boton--blanco">
          Consigue tu entrada
        </a>
      </div>
    </section>
  );
}

function Portada() {
  return (
    <main>
      <Hero />
      <section className="pl-ponentes">
        <header>
          <h2>Ponentes</h2>
          <a href={plenoHref("ponentes")} className="pl-boton">
            Ver todos
          </a>
        </header>
        <div>
          {PONENTES.map((p) => (
            <a key={p.id} href={plenoHref(`ponentes/${p.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt="" loading="lazy" />
              <b>{p.n}</b>
              <span>{p.oficio}</span>
            </a>
          ))}
        </div>
      </section>
      <section className="pl-dos">
        <article>
          <p className="pl-sobre">Miércoles 15</p>
          <h2>Foro</h2>
          <p>Un día para profesionales: precios, clientes, contratos y revisión de portfolios, con poca gente y mucho tiempo.</p>
        </article>
        <article>
          <p className="pl-sobre">Jueves 16 y viernes 17</p>
          <h2>Pleno</h2>
          <p>Dos días de charlas, talleres y una fiesta en el patio. Diseño, arte, código y todo lo que hay entre medias.</p>
        </article>
      </section>
      <section className="pl-banda">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={NAVE} alt="La nave principal" loading="lazy" />
        <a href={plenoHref("programa")} className="pl-boton pl-boton--blanco">
          Ver el programa
        </a>
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto }: { titulo: string; texto?: string }) => (
  <header className="pl-cab">
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

const CLAVE = "trama:pleno:agenda";

function Programa() {
  const [dia, setDia] = useState<0 | 1 | 2>(1);
  const [tipo, setTipo] = useState("");
  const [agenda, setAgenda] = useState<string[]>([]);
  const [solo, setSolo] = useState(false);
  useEffect(() => {
    try {
      setAgenda(JSON.parse(localStorage.getItem(CLAVE) ?? "[]"));
    } catch {
      setAgenda([]);
    }
  }, []);
  const marcar = (id: string) => {
    const n = agenda.includes(id) ? agenda.filter((x) => x !== id) : [...agenda, id];
    setAgenda(n);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(n));
    } catch {}
  };
  const lista = SESIONES.filter((s) => (solo ? agenda.includes(s.id) : s.dia === dia) && (!tipo || s.tipo === tipo));
  return (
    <main className="pl-pag">
      <Cab titulo="Programa" texto="Marca con ★ lo que no te quieres perder: tu agenda se queda guardada en este navegador." />
      <div className="pl-programa">
        <div className="pl-tabs" role="tablist" aria-label="Día">
          {DIAS.map((d, k) => (
            <button key={d} type="button" role="tab" aria-selected={!solo && dia === k} onClick={() => { setSolo(false); setDia(k as 0 | 1 | 2); }}>
              {d}
            </button>
          ))}
          <button type="button" role="tab" aria-selected={solo} onClick={() => setSolo(true)}>
            Mi agenda ({agenda.length})
          </button>
        </div>
        <div className="pl-filtro" role="group" aria-label="Tipo">
          {["", "Charla", "Taller", "Mesa", "Fiesta"].map((t) => (
            <button key={t || "todo"} type="button" aria-pressed={tipo === t} onClick={() => setTipo(t)}>
              {t || "Todo"}
            </button>
          ))}
        </div>
        <ul className="pl-sesiones" aria-live="polite">
          {lista.map((s) => {
            const p = PONENTES.find((x) => x.id === s.ponente);
            return (
              <li key={s.id}>
                <span className="pl-sesiones__hora">
                  {solo ? `${DIAS[s.dia].split(" · ")[0]} · ` : ""}
                  {s.hora}
                </span>
                <div>
                  <b>{s.t}</b>
                  <span>
                    {s.tipo} · {s.sala}
                    {p ? " · " : ""}
                    {p && <a href={plenoHref(`ponentes/${p.id}`)}>{p.n}</a>}
                  </span>
                </div>
                <button type="button" aria-pressed={agenda.includes(s.id)} aria-label={`${agenda.includes(s.id) ? "Quitar de" : "Añadir a"} mi agenda: ${s.t}`} onClick={() => marcar(s.id)}>
                  {agenda.includes(s.id) ? "★" : "☆"}
                </button>
              </li>
            );
          })}
          {!lista.length && <li className="pl-vacio">{solo ? "Tu agenda está vacía: marca sesiones con ☆." : "No hay sesiones de este tipo ese día."}</li>}
        </ul>
      </div>
    </main>
  );
}

function Ponentes() {
  return (
    <main className="pl-pag">
      <Cab titulo="Ponentes" texto="Seis de las veinticuatro personas del cartel. El resto, en marzo." />
      <section className="pl-ponentes pl-ponentes--pag">
        <div>
          {PONENTES.map((p) => (
            <a key={p.id} href={plenoHref(`ponentes/${p.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt="" loading="lazy" />
              <b>{p.n}</b>
              <span>
                {p.oficio} · {p.ciudad}
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function Ponente({ id }: { id: string }) {
  const p = PONENTES.find((x) => x.id === id);
  if (!p) return <NoHay />;
  const sus = SESIONES.filter((s) => s.ponente === id);
  return (
    <main className="pl-pag">
      <div className="pl-ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.img} alt={p.n} />
        <div>
          <p className="pl-sobre">
            {p.oficio} · {p.ciudad}
          </p>
          <h1>{p.n}</h1>
          <p>{p.bio}</p>
          {sus.map((s) => (
            <p key={s.id} className="pl-ficha__sesion">
              <b>{s.t}</b>
              <span>
                {DIAS[s.dia]} · {s.hora} · {s.sala}
              </span>
            </p>
          ))}
          <a href={plenoHref("entradas")} className="pl-boton">
            Consigue tu entrada
          </a>
        </div>
      </div>
    </main>
  );
}

function Entradas() {
  const carrito = useCart("trama:pleno:entradas");
  const [pagar, setPagar] = useState(false);
  const qty = (id: string) => carrito.lines.find((l) => l.id === id)?.qty ?? 0;
  const poner = (e: (typeof ENTRADAS)[number], q: number) => {
    if (qty(e.id)) carrito.setQty(e.id, q);
    else if (q > 0) carrito.add({ id: e.id, title: `Entrada ${e.n}`, price: e.precio });
  };
  return (
    <main className="pl-pag">
      <Cab titulo="Entradas" texto="Precio de lanzamiento hasta el 31 de marzo. Las entradas son nominativas y se recogen en la acreditación." />
      {pagar ? (
        <CheckoutFlow lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} delivery="pickup" pickups={[{ id: "naves", name: "Acreditación en Las Naves", address: "Calle de Joan Verdeguer 16, Valencia" }]} orderPrefix="PL" shopHref={plenoHref("entradas")} note="Compra de demostración: no se cobra nada." variant="minimal" className="pl-margen" />
      ) : (
        <>
          <div className="pl-entradas">
            {ENTRADAS.map((e) => (
              <article key={e.id}>
                <h2>{e.n}</h2>
                <p className="pl-sobre">{e.d}</p>
                <b>{eur(e.precio)}</b>
                <ul>
                  {e.incluye.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <QuantityStepper value={qty(e.id)} onChange={(q) => poner(e, q)} min={0} max={10} label={`Entradas ${e.n}`} />
              </article>
            ))}
          </div>
          <div className="pl-total" aria-live="polite">
            <span>
              {carrito.count} {carrito.count === 1 ? "entrada" : "entradas"} · <b>{eur(carrito.subtotal)}</b>
            </span>
            <button type="button" className="pl-boton pl-boton--negro" disabled={!carrito.count} onClick={() => setPagar(true)}>
              Comprar
            </button>
          </div>
        </>
      )}
    </main>
  );
}

function Lugar() {
  return (
    <main className="pl-pag">
      <Cab titulo="El lugar" texto="Las Naves: tres naves industriales y un patio en el barrio de Ayora." />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={NAVE} alt="Las Naves" className="pl-ancha" />
      <div className="pl-dos pl-dos--pag">
        <article>
          <h2>Cómo llegar</h2>
          <p>Calle de Joan Verdeguer 16, Valencia. Metro Ayora (línea 5) o tranvía Marina. Aparcamiento de bicis en la puerta.</p>
        </article>
        <article>
          <h2>Escríbenos</h2>
          <ContactForm title="" subtitle="" submitLabel="Enviar" successTitle="Gracias" successMessage="Contestamos en dos días." variant="minimal" />
        </article>
      </div>
    </main>
  );
}

function Preguntas() {
  return (
    <main className="pl-pag">
      <Cab titulo="Preguntas" />
      <FAQSection kicker="" title="" subtitle="" items={FAQ} presentation="lines" variant="minimal" className="pl-margen" />
    </main>
  );
}

function Prensa() {
  return (
    <main className="pl-pag">
      <Cab titulo="Sala de prensa" texto="Acreditaciones hasta el 1 de septiembre en prensa@pleno.example." />
      <ul className="pl-descargas">
        {["Dossier de prensa 2027 (PDF, 4 MB)", "Logotipos y tipografías (ZIP, 12 MB)", "Fotos de la edición 2026 (ZIP, 180 MB)", "Retratos de ponentes (ZIP, 40 MB)"].map((d) => (
          <li key={d}>
            <span>{d}</span>
            <a href="#" aria-disabled="true" onClick={(e) => e.preventDefault()}>
              Descargar
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

function NoHay() {
  return (
    <main className="pl-pag">
      <Cab titulo="Esta sala está vacía" texto="Vuelve al programa." />
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "ponentes" && b) return <Ponente id={b} />;
  const P = { programa: Programa, ponentes: Ponentes, entradas: Entradas, lugar: Lugar, preguntas: Preguntas, prensa: Prensa }[a];
  return P ? <P /> : <NoHay />;
}
