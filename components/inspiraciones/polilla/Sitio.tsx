"use client";

import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CartDrawer from "@/components/ui/CartDrawer";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import FAQSection from "@/components/ui/FAQSection";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Marquee from "@/components/ui/Marquee";
import MembershipFlow from "@/components/ui/MembershipFlow";
import Reveal from "@/components/ui/Reveal";
import { useCart } from "@/lib/commerce/cart";
import { FAQ, GENEROS, LIBROS, PASOS, PLANES, REGALOS, VOCES, type Libro } from "./data";
import { polillaHref } from "./enlaces";
import "./polilla.css";

/*
 * Polilla (docs/58), a partir de Aardvark Book Club: club de lectura por suscripción. Fondo amarillo con manchas orgánicas,
 * ultranegra enorme, píldoras claras y libros con volumen que caen con el scroll. La caja se llena en una página y sigue
 * siendo la misma al navegar (hasta tres libros, el límite lo marca el plan); el alta es MembershipFlow y regalar va por
 * CheckoutFlow. Las portadas se componen con letra y color: no hay imágenes que encargar.
 */

const SOCIA = "trama:polilla:socia";
const NAV: [string, string][] = [
  ["libros", "Libros"],
  ["regalar", "Regalar"],
  ["preguntas", "Preguntas"],
];
const money = (n: number) => `${n} €`;

type Estado = { caja: string[]; poner: (id: string) => void; quitar: (id: string) => void; carrito: ReturnType<typeof useCart>; abrirBolsa: () => void };
const Club = createContext<Estado | null>(null);
const useClub = () => useContext(Club)!;
const CLAVE = "trama:polilla:caja";

function Polilla({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden className="pl-bicho">
      <path d="M20 8c-2 4-2 22 0 26 2-4 2-22 0-26Z" />
      <path d="M19 14C12 3 3 6 3 14s8 13 15 8ZM21 14c7-11 16-8 16 0s-8 13-15 8Z" />
    </svg>
  );
}

export function Manchas({ claro = "#faed8f", fuerte = "#fca326" }: { claro?: string; fuerte?: string }) {
  return (
    <svg className="pl-manchas" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path fill={claro} d="M0 720C120 560 210 470 330 400c120-70 180-250 320-270s170 150 260 230 180 40 250-60 170-210 280-180v780H0Z" />
      <path fill={fuerte} d="M250 900c70-110 120-190 220-200s130 90 190 90 90-170 130-230 90 10 120 60 40 130 130 140 200-40 400-30v170Z" />
    </svg>
  );
}

/** un libro con volumen en CSS: tapa, lomo y cantos; la portada es solo letra y color */
export function Libro3D({ libro, giro = -24, className = "" }: { libro: Libro; giro?: number; className?: string }) {
  const estilo = { "--lomo": libro.lomo, "--tapa": libro.tapa, "--tinta": libro.tinta, "--giro": `${giro}deg` } as CSSProperties;
  return (
    <span className={`pl-libro ${className}`} style={estilo} role="img" aria-label={`Portada de ${libro.titulo}, de ${libro.autora}`}>
      <span className="pl-libro__cuerpo">
        <span className="pl-libro__tapa">
          <b>{libro.titulo}</b>
          <i>{libro.autora}</i>
        </span>
        <span className="pl-libro__lomo" />
        <span className="pl-libro__canto" />
      </span>
    </span>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [caja, setCaja] = useState<string[]>([]);
  const [bolsa, setBolsa] = useState(false);
  const carrito = useCart("trama:polilla:regalos");
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
      if (Array.isArray(v)) setCaja(v.filter((x) => LIBROS.some((l) => l.id === x)).slice(0, 3));
    } catch {
      /* sin almacenamiento: la caja vive en memoria */
    }
  }, []);
  const guardar = (v: string[]) => {
    setCaja(v);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(v));
    } catch {
      /* nada */
    }
  };
  const links = [{ label: "Inicio", href: polillaHref() }, ...NAV.map(([p, l]) => ({ label: l, href: polillaHref(p) })), { label: "Tu caja", href: polillaHref("caja") }, { label: "Hazte socia", href: polillaHref("socia") }];
  return (
    <Club.Provider value={{ caja, poner: (id) => caja.length < 3 && !caja.includes(id) && guardar([...caja, id]), quitar: (id) => guardar(caja.filter((x) => x !== id)), carrito, abrirBolsa: () => setBolsa(true) }}>
      <div className="pl" id="top">
        <header className="pl-head">
          <a href={polillaHref()} className="pl-logo">
            <Polilla />
            Polilla<small>club de lectura</small>
          </a>
          <nav aria-label="Principal">
            {NAV.map(([p, l]) => (
              <a key={p} href={polillaHref(p)} className="pl-chip">
                {l}
              </a>
            ))}
            <a href={polillaHref("caja")} className="pl-chip pl-chip--caja">
              Tu caja ({caja.length})
            </a>
            <a href={polillaHref("socia")} className="pl-cta pl-cta--naranja">
              Hazte socia <span aria-hidden>→</span>
            </a>
          </nav>
          <div className="pl-menu">
            <FullscreenMenu brand="Polilla" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Libros a tu puerta" links={links} />
          </div>
        </header>
        {children}
        <footer className="pl-pie">
          <p className="pl-pie__frase">Lee algo que no habrías elegido.</p>
          <div>
            <nav aria-label="Pie">
              {NAV.map(([p, l]) => (
                <a key={p} href={polillaHref(p)}>
                  {l}
                </a>
              ))}
              <a href="mailto:hola@polilla.example">Escríbenos</a>
            </nav>
            <button type="button" className="pl-chip" onClick={() => setBolsa(true)}>
              Regalos en la bolsa ({carrito.count})
            </button>
          </div>
          <small>Polilla · club de lectura de demostración de Trama. Los libros y las autoras son inventados.</small>
        </footer>
        <CartDrawer open={bolsa} onOpenChange={setBolsa} lines={carrito.lines} onQty={carrito.setQty} onRemove={carrito.remove} title="Tus regalos" checkoutHref={polillaHref("pedido")} checkoutLabel="Pagar" emptyText="Aún no has elegido ningún regalo." continueHref={polillaHref("regalar")} />
      </div>
    </Club.Provider>
  );
}

function Portada() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const f = () => setY(scrollY);
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  const [a, b, c, d] = [LIBROS[0], LIBROS[2], LIBROS[1], LIBROS[3]];
  return (
    <main>
      <section className="pl-hero">
        <Manchas />
        <span className="pl-cae pl-cae--a" style={{ translate: `0 ${y * 0.32}px`, rotate: `${y * 0.02 - 18}deg` }}>
          <Libro3D libro={b} giro={30} />
        </span>
        <span className="pl-cae pl-cae--b" style={{ translate: `0 ${y * 0.16}px`, rotate: `${16 - y * 0.03}deg` }}>
          <Libro3D libro={a} />
        </span>
        <span className="pl-cae pl-cae--c" style={{ translate: `0 ${y * -0.1}px`, rotate: `${y * 0.04 + 28}deg` }}>
          <Libro3D libro={c} giro={18} />
        </span>
        <div className="pl-hero__texto">
          <h1>Abre historias que dan de qué hablar</h1>
          <p>El club de lectura que no se parece a un club de lectura. Elige hasta tres novedades al mes, recíbelas en casa y luego entra en la conversación.</p>
          <a href={polillaHref("socia")} className="pl-cta">
            Hazte socia <span aria-hidden>→</span>
          </a>
        </div>
        <p className="pl-mano">envíos a toda España</p>
      </section>

      <section className="pl-mes" aria-labelledby="pl-mes-t">
        <div className="pl-mes__cab">
          <h2 id="pl-mes-t">Los libros de noviembre</h2>
          <a href={polillaHref("libros")} className="pl-cta pl-cta--negra">
            Verlos todos <span aria-hidden>→</span>
          </a>
        </div>
        <div className="pl-mes__fila">
          {LIBROS.slice(0, 5).map((l, i) => (
            <a key={l.id} href={polillaHref(`libros/${l.id}`)} className="pl-carta" style={{ "--c": l.tapa, "--t": l.tinta, rotate: `${[-3, 2, -2, 3, -1][i]}deg` } as CSSProperties}>
              <small>{l.genero}</small>
              <b>{l.titulo}</b>
              <span>{l.gancho}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="pl-como" aria-labelledby="pl-como-t">
        <div className="pl-como__cab">
          <h2 id="pl-como-t">Cómo funciona</h2>
          <p className="pl-mano">piensa en nosotras como tu librera de guardia</p>
        </div>
        <Reveal kind="slide" stagger={0.1} className="pl-pasos">
          {PASOS.map((p, i) => (
            <article key={p.n} style={{ background: p.c, rotate: `${[-4, -1, 1, 4][i]}deg` }}>
              <small className="pl-mano">{p.n}</small>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </article>
          ))}
        </Reveal>
      </section>

      <section className="pl-generos" aria-label="Géneros">
        <p className="pl-generos__ant">Cada mes hay</p>
        <div className="pl-generos__lista">
          {GENEROS.slice(0, 5).map((g) => (
            <a key={g} href={`${polillaHref("libros")}?genero=${encodeURIComponent(g)}`}>
              {g}
            </a>
          ))}
        </div>
        <p className="pl-mano pl-generos__fin">¡y más!</p>
        <span className="pl-cae pl-cae--d">
          <Libro3D libro={d} giro={22} />
        </span>
      </section>

      <Marquee variant="minimal" text="ABRE · LEE · CUENTA" separator="   ✶   " rows={1} duration={24} tone="fg" pauseOnHover={false} className="pl-cinta" />

      <section className="pl-voces" aria-labelledby="pl-voces-t">
        <h2 id="pl-voces-t">¿Por qué Polilla?</h2>
        <div>
          {VOCES.map((v) => (
            <blockquote key={v.a}>
              <p>«{v.q}»</p>
              <cite>{v.a}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="pl-planes" aria-labelledby="pl-planes-t">
        <Manchas claro="#ffd24a" fuerte="#fd48f2" />
        <h2 id="pl-planes-t">Elige cuánto lees</h2>
        <div className="pl-planes__fila">
          {PLANES.map((p) => (
            <a key={p.id} href={`${polillaHref("socia")}?plan=${p.id}`} className="pl-plan">
              <b>{p.name}</b>
              <span>
                {money(p.price)}
                <small>{p.period}</small>
              </span>
              <ul>
                {p.features?.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto, color = "#ffd24a" }: { titulo: string; texto?: string; color?: string }) => (
  <header className="pl-cab" style={{ background: color }}>
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function BotonCaja({ id }: { id: string }) {
  const { caja, poner, quitar } = useClub();
  const dentro = caja.includes(id);
  const llena = caja.length >= 3;
  return (
    <button type="button" className={`pl-cta ${dentro ? "pl-cta--negra" : ""}`} disabled={!dentro && llena} onClick={() => (dentro ? quitar(id) : poner(id))} aria-pressed={dentro}>
      {dentro ? "Quitar de la caja" : llena ? "Caja llena" : "Meter en la caja"}
    </button>
  );
}

function Libros() {
  const q = useSearchParams().get("genero") ?? "";
  const [genero, setGenero] = useState(GENEROS.includes(q) ? q : "");
  const lista = LIBROS.filter((l) => !genero || l.genero === genero);
  return (
    <main className="pl-pag">
      <Cab titulo="Los libros" texto={`${LIBROS.length} novedades este mes. Hasta tres en tu caja.`} color="#fd48f2" />
      <div className="pl-filtros" role="group" aria-label="Género">
        {["", ...GENEROS].map((g) => (
          <button key={g || "todos"} type="button" className="pl-chip" aria-pressed={genero === g} onClick={() => setGenero(g)}>
            {g || "Todos"}
          </button>
        ))}
      </div>
      <p className="pl-recuento" aria-live="polite">
        {lista.length} {lista.length === 1 ? "libro" : "libros"}
      </p>
      <div className="pl-rejilla">
        {lista.map((l) => (
          <article key={l.id} className="pl-ficha">
            <a href={polillaHref(`libros/${l.id}`)} aria-label={`Ver ${l.titulo}`}>
              <Libro3D libro={l} />
            </a>
            <small>{l.genero}</small>
            <h2>
              <a href={polillaHref(`libros/${l.id}`)}>{l.titulo}</a>
            </h2>
            <p>{l.autora}</p>
            <BotonCaja id={l.id} />
          </article>
        ))}
      </div>
    </main>
  );
}

function Ficha({ id }: { id: string }) {
  const i = LIBROS.findIndex((x) => x.id === id);
  if (i < 0) return <NoHay />;
  const l = LIBROS[i];
  const sig = LIBROS[(i + 1) % LIBROS.length];
  return (
    <main className="pl-pag">
      <section className="pl-detalle" style={{ background: l.tapa, color: l.tinta }}>
        <Libro3D libro={l} giro={-30} className="pl-libro--grande" />
        <div>
          <small>
            {l.genero} · {l.paginas} páginas
          </small>
          <h1>{l.titulo}</h1>
          <p className="pl-detalle__autora">{l.autora}</p>
          <p>{l.blurb}</p>
          <p className="pl-mano">«{l.librera}», dice tu librera</p>
          <BotonCaja id={l.id} />
        </div>
      </section>
      <a href={polillaHref(`libros/${sig.id}`)} className="pl-siguiente">
        Siguiente: {sig.titulo} <span aria-hidden>→</span>
      </a>
    </main>
  );
}

function Caja() {
  const { caja, quitar } = useClub();
  const libros = caja.map((id) => LIBROS.find((l) => l.id === id)!);
  const plan = PLANES[Math.max(0, libros.length - 1)];
  return (
    <main className="pl-pag">
      <Cab titulo="Tu caja" texto="Puedes cambiarla hasta el día 20." color="#a4f6f8" />
      {!libros.length ? (
        <div className="pl-vacio">
          <p>Tu caja está vacía. Hay ocho libros esperando.</p>
          <a href={polillaHref("libros")} className="pl-cta">
            Elegir libros <span aria-hidden>→</span>
          </a>
        </div>
      ) : (
        <div className="pl-caja">
          <ul>
            {libros.map((l) => (
              <li key={l.id}>
                <Libro3D libro={l} />
                <div>
                  <b>{l.titulo}</b>
                  <span>{l.autora}</span>
                </div>
                <button type="button" className="pl-chip" onClick={() => quitar(l.id)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <aside>
            <p>
              Plan para tu caja: <b>{plan.name}</b>
            </p>
            <p className="pl-caja__precio">
              {money(plan.price)}
              <small>{plan.period}</small>
            </p>
            <a href={`${polillaHref("socia")}?plan=${plan.id}`} className="pl-cta">
              Continuar <span aria-hidden>→</span>
            </a>
          </aside>
        </div>
      )}
    </main>
  );
}

function Socia() {
  const q = useSearchParams();
  return (
    <main className="pl-pag">
      <Cab titulo="Hazte socia" texto="Sin permanencia. Pausa o cancela antes del día 20." color="#ffd24a" />
      <MembershipFlow className="pl-flujo" plans={PLANES} initialPlan={q.get("plan") ?? undefined} storageKey={SOCIA} club="Polilla" accountHref={polillaHref("caja")} scheduleHref={polillaHref("libros")} note="Pago simulado: es una demostración." variant="minimal" />
    </main>
  );
}

function Regalar() {
  const { carrito, abrirBolsa } = useClub();
  return (
    <main className="pl-pag">
      <Cab titulo="Regala libros" texto="Una tarjeta en el buzón y una caja al mes durante el tiempo que elijas." color="#ffdbfd" />
      <div className="pl-planes__fila pl-regalos">
        {REGALOS.map((r) => (
          <article key={r.id} className="pl-plan" style={{ background: r.c }}>
            <b>{r.titulo}</b>
            <span>{money(r.precio)}</span>
            <p>{r.nota}</p>
            <button
              type="button"
              className="pl-cta"
              onClick={() => {
                carrito.add({ id: r.id, title: r.titulo, price: r.precio, meta: "Suscripción regalo" });
                abrirBolsa();
              }}
            >
              Añadir a la bolsa
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}

function Pedido() {
  const { carrito } = useClub();
  return (
    <main className="pl-pag">
      <Cab titulo="Tu pedido" color="#ffdbfd" />
      <CheckoutFlow className="pl-flujo" lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} delivery="shipping" shippingCost={0} orderPrefix="PL" shopHref={polillaHref("regalar")} />
    </main>
  );
}

function Preguntas() {
  return (
    <main className="pl-pag">
      <Cab titulo="Preguntas" texto="Lo que más nos escribís." color="#b7a6ff" />
      <div className="pl-faq">
        <FAQSection kicker="" title="" items={FAQ} layout="stack" presentation="lines" align="left" defaultOpen={0} variant="minimal" />
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="pl-pag">
      <Cab titulo="Esta página se la comió la polilla" color="#fd48f2" />
      <div className="pl-vacio">
        <a href={polillaHref("libros")} className="pl-cta">
          Volver a los libros
        </a>
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "libros" && b) return <Ficha id={b} />;
  const P = { libros: Libros, caja: Caja, socia: Socia, regalar: Regalar, pedido: Pedido, preguntas: Preguntas }[a];
  return P ? (
    <Suspense>
      <P />
    </Suspense>
  ) : (
    <NoHay />
  );
}
