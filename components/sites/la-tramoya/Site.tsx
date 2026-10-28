"use client";

import { Ultra } from "next/font/google";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ActionBar from "@/components/ui/ActionBar";
import BriefFlow from "@/components/ui/BriefFlow";
import ContactForm from "@/components/ui/ContactForm";
import CookieBanner from "@/components/ui/CookieBanner";
import EventLineup from "@/components/ui/EventLineup";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Marquee from "@/components/ui/Marquee";
import OpeningHours from "@/components/ui/OpeningHours";
import PageTransition from "@/components/ui/PageTransition";
import QRCode from "@/components/ui/QRCode";
import SeatMap from "@/components/ui/SeatMap";
import ShowBookingFlow from "@/components/ui/ShowBookingFlow";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { downloadCalendar, hoursUntil, prettyDate } from "@/lib/commerce/booking";
import { money } from "@/lib/commerce/money";
import { takenTables, useShowBookings } from "@/lib/commerce/shows";
import { phosphorRegular } from "@/lib/ui/icons-phosphor-regular";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { CARTA, DIRECCION, ESPECTACULOS, EVENTOS, FUNCIONES, MENUS, MESAS, NOCHE, PAQUETES, SLUG, ZONAS, type Funcion } from "./data";
import "./tramoya.css";

// la letra de cartel de esta web (no del kit): una slab negra de feria y varietés
const cartel = Ultra({ weight: "400", subsets: ["latin"], variable: "--tr-cartel", display: "swap" });

/*
 * La Tramoya, venta-teatro en Chiclana de la Frontera (docs/57): cena de venta gaditana y una función cada noche. La
 * portada es la sala a sangre con un acercamiento lento, el titular que entra por líneas y la franja de las próximas
 * funciones; la cartelera (EventLineup) lleva a la ficha de cada función, y la reserva (ShowBookingFlow) elige noche,
 * mesa en el plano (SeatMap), menú y pago y entrega la entrada en QR, que queda en «mis entradas». Carta, sala, eventos
 * privados (BriefFlow) y cómo llegar completan el sitio.
 */

const href = (p = "") => siteHref(SLUG, p);
const KEY = "trama:la-tramoya:entradas";
const TOKENS = tokensToStyle({ bg: "#f3e7d0", fg: "#1c1420", mut: "#5f5047", acc: "#b3121f", acc2: "#8a6420", card: "#fbf3e3", ln: "#cdb994", r: 0, font: "var(--font-manrope), sans-serif", display: "var(--font-fraunces), serif", glow: false });
const NAV: [string, string][] = [
  ["cartelera", "Cartelera"],
  ["carta", "Carta"],
  ["la-sala", "La sala"],
  ["eventos", "Eventos privados"],
  ["como-llegar", "Cómo llegar"],
];
const HORARIO = "L|cerrado\nM|cerrado\nX|cerrado\nJ|20:30-01:00\nV|20:30-02:00\nS|20:30-02:00\nD|13:30-17:30";

/** las funciones que aún no han pasado (se calcula en el navegador: el primer pintado es igual que el del servidor) */
function useProximas() {
  const [hoy, setHoy] = useState("");
  useEffect(() => {
    const d = new Date();
    setHoy(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }, []);
  return hoy ? FUNCIONES.filter((f) => f.date >= hoy) : FUNCIONES;
}

export function Shell({ children }: { children: ReactNode }) {
  const entradas = useShowBookings(KEY);
  const path = usePathname();
  // en la portada, la barra inferior del móvil repetiría los botones del héroe: aparece al dejarlo atrás
  const [conHeroe, setConHeroe] = useState(path === href());
  useEffect(() => {
    const heroe = path === href() ? document.querySelector(".tr-hero") : null;
    if (!heroe) return setConHeroe(false);
    setConHeroe(true);
    const io = new IntersectionObserver(([e]) => setConHeroe(e.isIntersecting), { threshold: 0.15 });
    io.observe(heroe);
    return () => io.disconnect();
  }, [path]);
  const proximas = useProximas();
  const esta = proximas[0];
  // los pseudo-elementos de la transición leen los tokens de :root (docs/05 · Tema): el papel debajo
  useEffect(() => {
    const s = document.documentElement.style;
    s.setProperty("--ui-vt-page", "#f3e7d0");
    s.setProperty("--acc", "#b3121f");
    return () => {
      s.removeProperty("--ui-vt-page");
      s.removeProperty("--acc");
    };
  }, []);
  return (
    <SiteFrame tokens={TOKENS} className={`tr ${cartel.variable}`} icons={{ set: phosphorRegular, weight: "regular" }}>
      <SmoothScroll feel="editorial" anchors syncGsap={false} />
      <div className="tr-aviso">
        <a href="/demos">TRAMA / WEBS COMPLETAS ↗</a>
        {esta && (
          <a href={href(`cartelera/${esta.id}`)}>
            Próxima función: <b>{esta.title}</b> · {prettyDate(esta.date)} · {esta.time}
          </a>
        )}
      </div>
      <header className="tr-head">
        <a href={href()} className="tr-logo" aria-label="La Tramoya, inicio">
          <small>venta-teatro</small>
          La Tramoya
        </a>
        <nav aria-label="Principal">
          {NAV.map(([p, l]) => (
            <a key={p} href={href(p)} aria-current={path.startsWith(href(p)) ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <a href={href("mis-entradas")} className="tr-entradas">
          Mis entradas{entradas.list.length ? ` (${entradas.list.length})` : ""}
        </a>
        <a href={href("reservar")} className="tr-boton">
          Reservar mesa
        </a>
        <FullscreenMenu brand="La Tramoya" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Chiclana de la Frontera · función cada noche" links={[{ label: "Inicio", href: href() }, ...NAV.map(([p, l]) => ({ label: l, href: href(p) })), { label: "Mis entradas", href: href("mis-entradas") }, { label: "Reservar mesa", href: href("reservar") }]} className="tr-menu" />
      </header>
      <main id="tr-contenido">{children}</main>
      <footer className="tr-pie">
        <div className="tr-pie__marca">
          <p className="tr-logo">
            <small>venta-teatro</small>
            La Tramoya
          </p>
          <p>
            Cocina de venta, vino de Chiclana y función cada noche desde 1962.
            <br />
            {DIRECCION}
          </p>
          <p>
            <a href="tel:+34956000000">956 000 000</a> · <a href="mailto:taquilla@latramoya.example">taquilla@latramoya.example</a>
          </p>
        </div>
        <OpeningHours hours={HORARIO} title="Abrimos la venta" timeZone="Europe/Madrid" variant="minimal" />
        <nav aria-label="Pie">
          {NAV.map(([p, l]) => (
            <a key={p} href={href(p)}>
              {l}
            </a>
          ))}
          <a href={href("mis-entradas")}>Mis entradas</a>
          <small>Restaurante de demostración de Trama: sin reservas ni cobros reales. Artistas y precios inventados.</small>
        </nav>
      </footer>
      <ActionBar actions={[{ label: "Cartelera", href: href("cartelera"), icon: "calendar" }, { label: "Reservar mesa", href: href("reservar"), icon: "arrow-right", primary: true }]} variant="minimal" className={`tr-barra-movil ${conHeroe ? "is-oculta" : ""}`} />
      <CookieBanner variant="minimal" storageKey="trama:la-tramoya:cookies" />
    </SiteFrame>
  );
}

function Portada() {
  const router = useRouter();
  const proximas = useProximas();
  const esta = proximas.find((f) => f.status !== "soldout") ?? proximas[0];
  return (
    <>
      <section className="tr-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/tramoya/hero-sala.webp" alt="La sala de La Tramoya con el escenario iluminado y las mesas con velas" className="tr-hero__foto" />
        <div className="tr-hero__texto">
          <p className="tr-kicker">Venta-teatro · Chiclana de la Frontera</p>
          <h1>
            <span>Cena de venta,</span>
            <span>vino de Chiclana</span>
            <span>
              <em>y función cada noche.</em>
            </span>
          </h1>
          <div className="tr-hero__acciones">
            <a href={esta ? `${href("reservar")}?funcion=${esta.id}` : href("reservar")} className="tr-boton tr-boton--claro">
              Reservar mesa
            </a>
            <a href={href("cartelera")} className="tr-boton tr-boton--borde">
              Ver la cartelera
            </a>
          </div>
        </div>
        <ol className="tr-hero__proximas" aria-label="Próximas funciones">
          {proximas.slice(0, 3).map((f) => (
            <li key={f.id}>
              <a href={href(`cartelera/${f.id}`)}>
                <small>
                  {prettyDate(f.date)} · {f.time}
                </small>
                <b>{f.title}</b>
                <span>{f.status === "soldout" ? "Agotado" : f.status === "few" ? `Últimas mesas · ${f.left}` : "Hay mesa"}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
      <nav className="tr-barra" aria-label="Accesos">
        <a href={href("cartelera")}>Cartelera</a>
        <a href={href("reservar")}>Reservar mesa</a>
        <a href={href("carta")}>La carta</a>
        <a href={href("como-llegar")}>Cómo llegar</a>
      </nav>

      <section className="tr-sec" id="cartelera">
        <header className="tr-sec__cab">
          <p className="tr-kicker">En el escenario</p>
          <h2>Esta semana sube el telón</h2>
        </header>
        <EventLineup events={proximas.slice(0, 6)} groupBy="none" filters={false} cta="Reservar" variant="minimal" className="tr-lineup" />
        <a href={href("cartelera")} className="tr-mas">
          Toda la cartelera de noviembre y diciembre →
        </a>
      </section>

      <Marquee variant="minimal" text="BULERÍAS ✶ COPLA ✶ CHIRIGOTA ✶ RUMBA ✶ ZAMBOMBA ✶ GUITARRA" separator="  ✶  " rows={1} duration={30} className="tr-cinta" />

      <section className="tr-sec tr-noche" id="noche">
        <header className="tr-sec__cab">
          <p className="tr-kicker">Programa de mano</p>
          <h2>Una noche en La Tramoya</h2>
        </header>
        <ol className="tr-programa">
          {NOCHE.map((n) => (
            <li key={n.h}>
              <b>{n.h}</b>
              <h3>{n.t}</h3>
              <p>{n.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="tr-sec tr-cocina">
        <header className="tr-sec__cab">
          <p className="tr-kicker">La cocina de la venta</p>
          <h2>Chicharrones, almadraba y fino de la bota</h2>
          <p>La cocina de las ventas de Chiclana, la de los domingos de toda la vida, con el atún de la almadraba de Sancti Petri y el vino de las bodegas del pueblo.</p>
        </header>
        <div className="tr-platos">
          {CARTA.flatMap((s) => s.platos)
            .filter((p) => p.img)
            .slice(0, 4)
            .map((p) => (
              <figure key={p.n}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.n} loading="lazy" />
                <figcaption>
                  <b>{p.n}</b>
                  <span>{money(p.p)}</span>
                </figcaption>
              </figure>
            ))}
        </div>
        <a href={href("carta")} className="tr-mas">
          La carta y los menús de función →
        </a>
      </section>

      <section className="tr-sec tr-sala">
        <div>
          <p className="tr-kicker">La sala</p>
          <h2>Elige mesa como quien elige butaca</h2>
          <p>Primera fila para ver los pies de la bailaora, el patio para cenar a gusto, el altillo para parejas y la barra de la bodega para quien viene a escuchar. Todas se eligen en el plano al reservar.</p>
          <a href={href("la-sala")} className="tr-boton">
            Ver la sala
          </a>
        </div>
        <SeatMap tables={MESAS} zones={ZONAS} taken={esta ? takenTables(esta.id, MESAS.map((m) => m.id), esta.status) : []} onChange={(m) => esta && router.push(`${href("reservar")}?funcion=${esta.id}&mesa=${m}`)} stage="Escenario" label="Plano de la sala: pulsa una mesa libre para reservarla" variant="minimal" className="tr-plano" />
      </section>

      <section className="tr-sec tr-privados">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/tramoya/evento-privado.webp" alt="Una mesa larga de celebración con el escenario al fondo" loading="lazy" />
        <div>
          <p className="tr-kicker">Eventos privados</p>
          <h2>Tu celebración, con telón</h2>
          <p>Cumpleaños con dedicatoria desde el escenario, cenas de empresa en el altillo o la sala entera para una boda flamenca.</p>
          <a href={href("eventos")} className="tr-boton">
            Pedir propuesta
          </a>
        </div>
      </section>
    </>
  );
}

function Cab({ kicker, titulo, texto }: { kicker: string; titulo: string; texto?: string }) {
  return (
    <header className="tr-pag__cab">
      <p className="tr-kicker">{kicker}</p>
      <h1>{titulo}</h1>
      {texto && <p>{texto}</p>}
    </header>
  );
}

function Cartelera() {
  const proximas = useProximas();
  return (
    <div className="tr-pag">
      <Cab kicker="Noviembre y diciembre" titulo="Cartelera" texto="Una función cada noche de jueves a domingo. Elige noche, reserva mesa en el plano y cena antes de que suba el telón." />
      <EventLineup events={proximas} groupBy="month" filters cta="Reservar" statusLabels={{ open: "Hay mesa" }} variant="minimal" className="tr-lineup" />
    </div>
  );
}

function FichaFuncion({ id }: { id: string }) {
  const f = FUNCIONES.find((x) => x.id === id) as Funcion;
  const e = ESPECTACULOS[f.show];
  const otras = useProximas().filter((x) => x.show === f.show && x.id !== f.id);
  const cerrada = f.status === "soldout" || f.status === "cancelled";
  const d = new Date(`${f.date}T12:00:00`);
  return (
    <div className="tr-pag">
      <a href={href("cartelera")} className="tr-volver">
        ← Cartelera
      </a>
      <article className="tr-ficha">
        <div className="tr-cartel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={e.img} alt={`${e.titulo}: ${e.artista}`} />
          <p className="tr-cartel__fecha">
            {d.toLocaleDateString("es-ES", { weekday: "long" })} {d.getDate()} de {d.toLocaleDateString("es-ES", { month: "long" })} · {f.time}
          </p>
          <h1>{e.titulo}</h1>
          <p className="tr-cartel__artista">{e.artista}</p>
        </div>
        <div className="tr-ficha__texto">
          <p className="tr-kicker">{e.genero}</p>
          <p className="tr-ficha__lead">{e.texto}</p>
          <dl>
            <div>
              <dt>Cena</dt>
              <dd>desde las 20:30</dd>
            </div>
            <div>
              <dt>Función</dt>
              <dd>
                {f.time} · {e.dura}
              </dd>
            </div>
            <div>
              <dt>Cena y función</dt>
              <dd>desde {money(e.precio)} / persona</dd>
            </div>
          </dl>
          {cerrada ? (
            <p className="tr-agotado" role="status">
              {f.status === "soldout" ? "Agotado esta noche." : "Función cancelada."} Mira otras fechas abajo.
            </p>
          ) : (
            <a href={`${href("reservar")}?funcion=${f.id}`} className="tr-boton tr-boton--grande">
              Reservar mesa para esta noche{f.status === "few" ? ` · quedan ${f.left}` : ""}
            </a>
          )}
          <h2>Los menús de la noche</h2>
          <ul className="tr-menus">
            {MENUS.map((m) => (
              <li key={m.id}>
                <b>
                  {m.name} · {money(m.price)}
                </b>
                <span>{m.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
      {otras.length > 0 && (
        <section className="tr-sec__otras">
          <h2>Otras noches de {e.titulo.toLowerCase()}</h2>
          <EventLineup events={otras.slice(0, 4)} groupBy="none" filters={false} cta="Reservar" variant="minimal" className="tr-lineup" />
        </section>
      )}
    </div>
  );
}

function Reservar() {
  const q = useSearchParams();
  const proximas = useProximas();
  return (
    <div className="tr-pag">
      <Cab kicker="Taquilla" titulo="Reservar mesa" texto="Elige la noche, la mesa en el plano de la sala y el menú. Se reserva con una señal de 10 € por persona; el resto se paga en la venta." />
      <ShowBookingFlow events={proximas} initialEvent={q.get("funcion") ?? undefined} initialTable={q.get("mesa") ?? undefined} tables={MESAS} zones={ZONAS} menus={MENUS} depositPerGuest={10} maxGuests={6} minutes={180} location={DIRECCION} storageKey={KEY} ticketsHref={href("mis-entradas")} variant="minimal" className="tr-flujo" />
    </div>
  );
}

function MisEntradas() {
  const entradas = useShowBookings(KEY);
  const [anular, setAnular] = useState("");
  return (
    <div className="tr-pag">
      <Cab kicker="Taquilla" titulo="Mis entradas" texto="Las reservas hechas en este navegador. Enseña el QR en la puerta; se pueden anular hasta 24 horas antes." />
      {entradas.ready && !entradas.list.length && (
        <p className="tr-vacio">
          Aún no tienes entradas. <a href={href("cartelera")}>Mira la cartelera →</a>
        </p>
      )}
      <ul className="tr-tickets">
        {entradas.list.map((b) => {
          const puede = hoursUntil({ date: b.date, time: b.time }) > 24;
          return (
            <li key={b.id}>
              <div>
                <p className="tr-kicker">{prettyDate(b.date)} · {b.time}</p>
                <h2>{b.event}</h2>
                <p>
                  Mesa {b.table} ({b.zone}) · {b.guests} {b.guests === 1 ? "persona" : "personas"} · {b.menu}
                </p>
                <p>
                  {b.id} · pagado {money(b.paid)} de {money(b.total)}
                </p>
                <div className="tr-tickets__acciones">
                  <button type="button" className="tr-link" onClick={() => downloadCalendar(b.event, b.date, b.time, 180, DIRECCION)}>
                    Añadir al calendario
                  </button>
                  {puede &&
                    (anular === b.id ? (
                      <>
                        <button type="button" className="tr-link tr-link--peligro" onClick={() => { entradas.cancel(b.id); setAnular(""); }}>
                          Sí, anular
                        </button>
                        <button type="button" className="tr-link" onClick={() => setAnular("")}>
                          No
                        </button>
                      </>
                    ) : (
                      <button type="button" className="tr-link" onClick={() => setAnular(b.id)}>
                        Anular
                      </button>
                    ))}
                </div>
              </div>
              <QRCode value={`${b.id}|${b.eventId}|${b.table}`} codeSize={112} label={`Entrada ${b.id}`} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Carta() {
  return (
    <div className="tr-pag">
      <Cab kicker="La cocina" titulo="Carta y menús" texto="Para la noche de función, un menú cerrado por persona; a mediodía y en la barra, la carta entera." />
      <section className="tr-sec__bloque">
        <h2>Menús de función</h2>
        <ul className="tr-menus tr-menus--grandes">
          {MENUS.map((m) => (
            <li key={m.id}>
              <b>{m.name}</b>
              <span>{m.description}</span>
              <em>{money(m.price)} / persona</em>
            </li>
          ))}
        </ul>
        <a href={href("reservar")} className="tr-boton">
          Reservar mesa con menú
        </a>
      </section>
      {CARTA.map((s) => (
        <section key={s.t} className="tr-sec__bloque" id={s.t.toLowerCase().replace(/\s+/g, "-")}>
          <h2>{s.t}</h2>
          <ul className="tr-carta">
            {s.platos.map((p) => (
              <li key={p.n}>
                {p.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.img} alt="" loading="lazy" />
                )}
                <span>
                  <b>{p.n}</b>
                  <small>{p.d}</small>
                </span>
                <em>{money(p.p)}</em>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="tr-nota">Alérgenos: pregúntanos; adaptamos los menús sin gluten y vegetarianos avisando al reservar.</p>
    </div>
  );
}

function Sala() {
  const [mesa, setMesa] = useState("");
  const m = MESAS.find((x) => x.id === mesa);
  const z = ZONAS.find((x) => x.id === m?.zone);
  return (
    <div className="tr-pag">
      <Cab kicker="La casa" titulo="La sala" texto="Una venta de carretera de 1962 convertida en teatro: el escenario donde estaba la chimenea, el patio de los naranjos y la bodega al fondo." />
      <div className="tr-sala tr-sala--pag">
        <SeatMap tables={MESAS} zones={ZONAS} value={mesa} onChange={setMesa} stage="Escenario" label="Plano de la sala: pulsa una mesa" variant="minimal" className="tr-plano" />
        <div className="tr-sala__info" aria-live="polite">
          {m ? (
            <>
              <p className="tr-kicker">{z?.name}</p>
              <h2>Mesa {m.label}</h2>
              <p>
                {m.seats} plazas{z?.price ? ` · ${z.price > 0 ? "suplemento" : "descuento"} de ${money(Math.abs(z.price))} por persona` : ""}.
              </p>
              <a href={`${href("reservar")}?mesa=${m.id}`} className="tr-boton">
                Reservar la mesa {m.label}
              </a>
            </>
          ) : (
            <p>Pulsa una mesa del plano para ver su zona, sus plazas y su precio.</p>
          )}
        </div>
      </div>
      <div className="tr-zonas">
        {[
          ["sala-escenario", "Primera fila", "A un metro de las tablas: se oye el zapateado en el pecho."],
          ["sala-patio", "El patio", "Bajo los naranjos y la parra, con la función de frente."],
          ["sala-altillo", "El altillo", "Mesas de dos con barandilla de madera, para ver la sala entera."],
          ["barra-bodega", "La barra de la bodega", "Entre botas de fino: de pie o en taburete, más barato y más cerca del tabernero."],
        ].map(([img, t, d]) => (
          <figure key={t}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/tramoya/${img}.webp`} alt={t} loading="lazy" />
            <figcaption>
              <b>{t}</b>
              <span>{d}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <section className="tr-historia">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/tramoya/venta-antigua.webp" alt="La fachada de la venta en los años sesenta, junto al pinar" loading="lazy" />
        <div>
          <p className="tr-kicker">Desde 1962</p>
          <h2>De venta de carretera a teatro</h2>
          <p>Abrió como venta para los que iban a La Barrosa por el camino del pinar: chicharrones, fino y una guitarra los sábados. La guitarra se quedó, llegó el cante, después la chirigota, y en los noventa la familia subió un escenario donde estaba la chimenea.</p>
          <p>Hoy la lleva la tercera generación, con la misma cocina y una función cada noche.</p>
        </div>
      </section>
      <p className="tr-nota">Accesible en silla de ruedas por el patio, con aseo adaptado. Avísanos al reservar y te guardamos una mesa del patio.</p>
    </div>
  );
}

function Eventos() {
  return (
    <div className="tr-pag">
      <Cab kicker="Celebraciones" titulo="Eventos privados" texto="Cumpleaños, empresas, despedidas y bodas con el escenario de testigo. Cuéntanos la idea y te mandamos una propuesta." />
      <div className="tr-paquetes">
        {PAQUETES.map((p) => (
          <article key={p.t}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt="" loading="lazy" />
            <h2>{p.t}</h2>
            <p>{p.d}</p>
            <em>{p.p}</em>
          </article>
        ))}
      </div>
      <BriefFlow className="tr-flujo" title="Evento en La Tramoya" services={EVENTOS} servicesLabel="¿Qué celebráis?" budgets="Menos de 1.000 €, 1.000–3.000 €, Más de 3.000 €" budgetLabel="Presupuesto aproximado" timelines="Este mes, En tres meses, Más adelante" question="Cuéntanos la fecha, cuántos seréis y qué espectáculo os gustaría." fields="phone" responseTime="Te respondemos en 48 horas." prefix="TRA" storageKey="trama:la-tramoya:eventos" variant="minimal" />
    </div>
  );
}

function ComoLlegar() {
  return (
    <div className="tr-pag">
      <Cab kicker="La venta" titulo="Cómo llegar" texto={DIRECCION} />
      <div className="tr-llegar">
        <div className="tr-mapa" role="img" aria-label="Mapa: La Tramoya, en la carretera de La Barrosa, entre Chiclana y la playa">
          <span className="tr-mapa__mar">Océano Atlántico</span>
          <span className="tr-mapa__lugar tr-mapa__lugar--chiclana">Chiclana</span>
          <span className="tr-mapa__lugar tr-mapa__lugar--barrosa">La Barrosa</span>
          <span className="tr-mapa__lugar tr-mapa__lugar--petri">Sancti Petri</span>
          <i className="tr-mapa__carretera" />
          <b className="tr-mapa__pin">La Tramoya</b>
        </div>
        <div className="tr-llegar__info">
          <h2>Venir</h2>
          <ul>
            <li>
              <b>En coche</b> · aparcamiento propio y gratuito bajo los pinos, 60 plazas.
            </li>
            <li>
              <b>En taxi</b> · 8 minutos desde el centro de Chiclana; te lo pedimos a la salida.
            </li>
            <li>
              <b>En autobús</b> · la línea de La Barrosa para en la puerta (parada «La Venta»).
            </li>
          </ul>
          <OpeningHours hours={HORARIO} title="Horario" timeZone="Europe/Madrid" layout="compact" variant="minimal" />
        </div>
      </div>
      <ContactForm title="Escribe a la taquilla" subtitle="Dudas sobre la cartelera, alergias o grupos." submitLabel="Enviar" successTitle="Gracias" successMessage="Te contestamos hoy mismo (demostración: no se envía nada)." variant="minimal" className="tr-contacto" />
    </div>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a, b] = path;
  const pagina = !a ? (
    <Portada />
  ) : a === "cartelera" ? (
    b ? (
      <FichaFuncion id={b} />
    ) : (
      <Cartelera />
    )
  ) : a === "reservar" ? (
    <Suspense>
      <Reservar />
    </Suspense>
  ) : a === "mis-entradas" ? (
    <MisEntradas />
  ) : a === "carta" ? (
    <Carta />
  ) : a === "la-sala" ? (
    <Sala />
  ) : a === "eventos" ? (
    <Eventos />
  ) : a === "como-llegar" ? (
    <ComoLlegar />
  ) : null;
  return (
    <PageTransition key={path.join("/")} kind="fade" pace="normal">
      {pagina}
    </PageTransition>
  );
}
