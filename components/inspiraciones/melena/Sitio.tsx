"use client";

import dynamic from "next/dynamic";
import { createContext, Suspense, useContext, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { DM_Serif_Display, Lora } from "next/font/google";
import Accordion from "@/components/ui/Accordion";
import AppointmentList from "@/components/ui/AppointmentList";
import BookingFlow from "@/components/ui/BookingFlow";
import CartDrawer from "@/components/ui/CartDrawer";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import EnrollmentFlow from "@/components/ui/EnrollmentFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import ProductCard from "@/components/ui/ProductCard";
import QuantityStepper from "@/components/ui/QuantityStepper";
import SectionHeader from "@/components/ui/SectionHeader";
import TestimonialSection from "@/components/ui/TestimonialSection";
import { useCart } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/money";
import { BLOG, CATEGORIAS, CURSOS, EQUIPO, PRODUCTOS, SALONES, SERVICIOS } from "./data";
import { melenaHref } from "./enlaces";
import "./melena.css";

// las letras de Hair Me Up son libres: se cargan en la réplica, no en el kit (docs/cuaderno/replica-melena.md)
const dmSerif = DM_Serif_Display({ weight: "400", style: ["normal", "italic"], subsets: ["latin", "latin-ext"], variable: "--me-dm", display: "swap" });
const lora = Lora({ subsets: ["latin", "latin-ext"], variable: "--me-lora", display: "swap" });

/*
 * Melena con varias páginas (docs/56): la portada (Melena.tsx) y conócenos con las opiniones, precios, la tienda con ficha,
 * bolsa y pedido, la academia con cada curso y su solicitud (EnrollmentFlow), el blog, reservar en uno de los dos salones
 * y mis citas. El marco persiste: la cabecera (en el móvil, el menú a pantalla completa), la nota fija, las dos píldoras de
 * reserva, la bolsa y el pie con el boletín.
 */

const Portada = dynamic(() => import("./Melena"));
const CITAS = "trama:melena:citas";
const Bolsa = createContext<{ carrito: ReturnType<typeof useCart>; abrir: () => void } | null>(null);
const useBolsa = () => useContext(Bolsa)!;
const NAV: [string, string][] = [["conocenos", "Conócenos"], ["precios", "Precios"], ["blog", "Blog"], ["academia", "Academia"], ["tienda", "Tienda"]];

function Boletin() {
  const [correo, setCorreo] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  if (ok) return <p className="me-ok" role="status">Gracias: ya estás en el boletín.</p>;
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(correo.trim())) return setError("Revisa el correo."); setOk(true); }} className="me-boletin">
      <label>
        <span className="ui-sr">Correo</span>
        <input type="email" placeholder="tu correo" value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="email" />
      </label>
      <button type="submit" className="me-pildora">
        Apuntarme
      </button>
      {error && <small role="alert">{error}</small>}
    </form>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const carrito = useCart("trama:melena:bolsa");
  const [bolsa, setBolsa] = useState(false);
  return (
    <Bolsa.Provider value={{ carrito, abrir: () => setBolsa(true) }}>
      <div className={`me ${dmSerif.variable} ${lora.variable}`}>
        <header className="me-head">
          <a href={melenaHref()} className="me-sello" aria-label="Melena, inicio">
            <span>m</span>
          </a>
          <nav aria-label="Principal" className="me-nav">
            {NAV.map(([p, l]) => (
              <a key={p} href={melenaHref(p)} aria-current={path.startsWith(melenaHref(p)) ? "page" : undefined}>
                {l}
              </a>
            ))}
          </nav>
          <button type="button" className="me-bolsa" onClick={() => setBolsa(true)}>
            Bolsa ({carrito.count})
          </button>
          <a href={melenaHref("reservar")} className="me-pildora">
            Reserva
          </a>
          <FullscreenMenu brand="Melena" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Gran Vía 31 · Arenal 9 · Madrid" links={[{ label: "Inicio", href: melenaHref() }, ...NAV.map(([p, l]) => ({ label: l, href: melenaHref(p) })), { label: "Reservar", href: melenaHref("reservar") }, { label: "Mis citas", href: melenaHref("mis-citas") }]} className="me-menu" />
        </header>
        {children}
        <footer className="me-pie" id="contacto">
          <div className="me-pie__boletin">
            <h2>Mantente al día con nosotras</h2>
            <h3>Boletín</h3>
            <p>Apúntate al boletín y recibe primero las novedades, las promociones y los cursos de la academia.</p>
            <Boletin />
          </div>
          <div className="me-pie__datos">
            <div>
              <strong>Melena</strong>
              <p>
                Gran Vía 31 · Calle del Arenal 9
                <br />
                Madrid
              </p>
            </div>
            <div>
              <p>
                hola@melena.example
                <br />
                910 000 000
              </p>
            </div>
            <nav aria-label="Pie">
              {NAV.map(([p, l]) => (
                <a key={p} href={melenaHref(p)}>
                  {l}
                </a>
              ))}
              <a href={melenaHref("mis-citas")}>Mis citas</a>
            </nav>
          </div>
        </footer>
        <a href={melenaHref("conocenos#opiniones")} className="me-nota" aria-label="Nota 5,0: ver opiniones">
          <b>★</b>
          <strong>5,0</strong>
          <span>Mira las opiniones</span>
        </a>
        <div className="me-reservas">
          {SALONES.map((s) => (
            <a key={s.id} href={melenaHref(`reservar?salon=${s.id}`)} className="me-pildora me-pildora--fija">
              Reserva en <b>{s.name}</b>
            </a>
          ))}
        </div>
        <CartDrawer open={bolsa} onOpenChange={setBolsa} lines={carrito.lines} onQty={carrito.setQty} onRemove={carrito.remove} title="Tu bolsa" freeShippingFrom={40} checkoutHref={melenaHref("pedido")} checkoutLabel="Finalizar pedido" continueHref={melenaHref("tienda")} />
      </div>
    </Bolsa.Provider>
  );
}

function Cabecera({ palabra, kicker, titulo }: { palabra: string; kicker: string; titulo: string }) {
  return <SectionHeader kicker={kicker} title={titulo} subtitle="" backdrop={palabra} rule="none" variant="editorial" className="me-sh me-pag__cab" />;
}

function Conocenos() {
  return (
    <main className="me-pag">
      <Cabecera palabra="equipo" kicker="Conócenos" titulo="Cuidamos de tu pelo y te enseñamos a cuidarlo" />
      <p className="me-texto">Melena abrió en Gran Vía en 2014 y en Arenal en 2019. Somos salón, tienda y academia: lo que hacemos en el sillón lo enseñamos a otras peluqueras y lo vendemos para que lo uses en casa.</p>
      <ul className="me-equipo">
        {EQUIPO.map((p) => (
          <li key={p.name}>
            <span className="me-equipo__inicial" aria-hidden>
              {p.name[0]}
            </span>
            <h2>{p.name}</h2>
            <p className="me-etiqueta">{p.role}</p>
            <p>{p.bio}</p>
            <a href={melenaHref(`reservar?profesional=${p.name}`)} className="me-enlace">
              Reserva con {p.name} →
            </a>
          </li>
        ))}
      </ul>
      <div id="opiniones">
        <TestimonialSection
          kicker="5,0 · 214 opiniones"
          title="Lo que dicen de nosotras"
          subtitle=""
          layout="grid"
          variant="minimal"
          className="me-opiniones"
          items={[
            "Inés me hizo el balayage que llevaba años buscando. Dos meses después sigue precioso.|Marta G.|Gran Vía|5",
            "Me peinaron para la boda de mi hermana y aguantó toda la noche. Trato de diez.|Lucía R.|Arenal|5",
            "Hice el curso de corte y salí con técnica y con ganas. Muy recomendable.|Andrea P.|Academia|5",
          ].join("\n")}
        />
      </div>
    </main>
  );
}

function Precios() {
  return (
    <main className="me-pag">
      <Cabecera palabra="precios" kicker="Los dos salones, la misma carta" titulo="Precios" />
      {CATEGORIAS.map((cat) => (
        <section key={cat} id={cat.toLowerCase()} className="me-precios">
          <h2>{cat}</h2>
          <ul>
            {SERVICIOS.filter((s) => s.category === cat).map((s) => (
              <li key={s.id}>
                <span>
                  <b>{s.name}</b>
                  <small>{s.description}</small>
                </span>
                <span>
                  {s.from ? "desde " : ""}
                  {s.price} € · {s.minutes} min
                </span>
                <a href={melenaHref(`reservar?servicio=${s.id}`)} className="me-enlace">
                  Reservar →
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

function Tienda() {
  const { carrito, abrir } = useBolsa();
  return (
    <main className="me-pag">
      <Cabecera palabra="tienda" kicker="Salón embajador oficial de Ritual" titulo="Tienda" />
      <p className="me-texto">Promociones de otoño: 25 % en toda la línea. Envío gratis desde 40 € o recoge en el salón.</p>
      <div className="me-productos">
        {PRODUCTOS.map((p) => (
          <div key={p.id} className="me-producto">
            <ProductCard title={p.title} price={p.price} compareAt={p.compareAt} image={p.image} meta={p.meta} href={melenaHref(`tienda/${p.id}`)} badge="−25 %" ratio="1 / 1" variant="minimal" />
            <button type="button" className="me-pildora" onClick={() => { carrito.add({ id: p.id, title: p.title, price: p.price, image: p.image, meta: p.meta }); abrir(); }}>
              Añadir a la bolsa
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

function Ficha({ id }: { id: string }) {
  const { carrito, abrir } = useBolsa();
  const p = PRODUCTOS.find((x) => x.id === id)!;
  const [n, setN] = useState(1);
  return (
    <main className="me-pag me-ficha">
      <a href={melenaHref("tienda")} className="me-enlace">
        ← Tienda
      </a>
      <div className="me-ficha__rejilla">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.title} />
        <div>
          <p className="me-etiqueta">{p.meta}</p>
          <h1>{p.title}</h1>
          <p className="me-ficha__precio">
            <b>{money(p.price)}</b> <s>{money(p.compareAt)}</s>
          </p>
          <p className="me-texto">{p.texto}</p>
          <QuantityStepper value={n} onChange={setN} min={1} max={10} label={p.title} />
          <button type="button" className="me-pildora" onClick={() => { carrito.add({ id: p.id, title: p.title, price: p.price, image: p.image, meta: p.meta }, n); abrir(); }}>
            Añadir a la bolsa
          </button>
        </div>
      </div>
    </main>
  );
}

function Pedido() {
  const { carrito } = useBolsa();
  return (
    <main className="me-pag">
      <Cabecera palabra="pedido" kicker="Tienda Melena" titulo="Tu pedido" />
      <CheckoutFlow className="me-flujo" lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} pickups={SALONES} freeShippingFrom={40} orderPrefix="ME" shopHref={melenaHref("tienda")} />
    </main>
  );
}

function Academia() {
  return (
    <main className="me-pag">
      <Cabecera palabra="academia" kicker="Academia Melena" titulo="Aprende, afina el oficio y sorprende a tus clientas" />
      <ul className="me-cursos-lista">
        {CURSOS.map((c) => (
          <li key={c.id}>
            <h2>{c.titulo}</h2>
            <p>{c.texto}</p>
            <p className="me-etiqueta">
              {money(c.precio, "EUR", "es-ES", true)} · próximas: {c.convocatorias.map((x) => x.label).join(", ")}
            </p>
            <a href={melenaHref(`academia/${c.id}`)} className="me-pildora">
              Ver el curso
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Curso({ id }: { id: string }) {
  const c = CURSOS.find((x) => x.id === id)!;
  return (
    <main className="me-pag">
      <a href={melenaHref("academia")} className="me-enlace">
        ← Academia
      </a>
      <Cabecera palabra="curso" kicker="Academia Melena" titulo={c.titulo} />
      <p className="me-texto">{c.texto}</p>
      <Accordion items={c.temario.map((t, i) => `Módulo ${i + 1}: ${t}|Teoría breve, demostración en directo y práctica con cabezas de maniquí y modelos reales.`).join("\n")} presentation="lines" variant="minimal" className="me-temario" />
      <EnrollmentFlow className="me-flujo" program={c.titulo} cohorts={c.convocatorias} price={c.precio} deposit={c.senal} levels={c.nivel} question="¿Qué te gustaría aprender?" storageKey="trama:melena:solicitudes" />
    </main>
  );
}

function Blog() {
  return (
    <main className="me-pag">
      <Cabecera palabra="blog" kicker="Sigue al día con nosotras" titulo="Blog" />
      <ul className="me-blog-lista">
        {BLOG.map((b) => (
          <li key={b.slug}>
            <a href={melenaHref(`blog/${b.slug}`)}>
              <small>{b.fecha}</small>
              <h2>{b.titulo}</h2>
              <p>{b.entradilla}</p>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Post({ slug }: { slug: string }) {
  const b = BLOG.find((x) => x.slug === slug)!;
  return (
    <main className="me-pag me-post">
      <a href={melenaHref("blog")} className="me-enlace">
        ← Blog
      </a>
      <p className="me-etiqueta">{b.fecha}</p>
      <h1>{b.titulo}</h1>
      <p className="me-texto me-texto--grande">{b.entradilla}</p>
      {b.cuerpo.map((p) => (
        <p key={p.slice(0, 20)} className="me-texto">
          {p}
        </p>
      ))}
      <a href={melenaHref("reservar")} className="me-pildora">
        Reserva tu cita
      </a>
    </main>
  );
}

function Reservar() {
  const q = useSearchParams();
  return (
    <main className="me-pag">
      <Cabecera palabra="reserva" kicker="Gran Vía o Arenal" titulo="Reserva tu cita" />
      <BookingFlow
        key={`${q.get("editar") ?? ""}${q.get("salon") ?? ""}${q.get("servicio") ?? ""}${q.get("profesional") ?? ""}`}
        className="me-flujo"
        services={SERVICIOS}
        staff={EQUIPO}
        places={SALONES}
        initialPlace={q.get("salon") ?? undefined}
        initialService={q.get("servicio") ?? undefined}
        initialStaff={q.get("profesional") ?? undefined}
        editId={q.get("editar") ?? undefined}
        times="09:30, 10:30, 11:30, 12:30, 16:00, 17:00, 18:00"
        closedDays="0"
        closesAt={{ 6: "15:00" }}
        storageKey={CITAS}
        placeLabel="¿En qué salón?"
        business="Melena"
        appointmentsHref={melenaHref("mis-citas")}
      />
    </main>
  );
}

function MisCitas() {
  return (
    <main className="me-pag">
      <Cabecera palabra="citas" kicker="Guardadas en este navegador" titulo="Mis citas" />
      <AppointmentList services={SERVICIOS} places={SALONES} storageKey={CITAS} bookHref={melenaHref("reservar")} business="Melena" />
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "conocenos") return <Conocenos />;
  if (a === "precios") return <Precios />;
  if (a === "tienda") return b ? <Ficha id={b} /> : <Tienda />;
  if (a === "pedido") return <Pedido />;
  if (a === "academia") return b ? <Curso id={b} /> : <Academia />;
  if (a === "blog") return b ? <Post slug={b} /> : <Blog />;
  if (a === "reservar")
    return (
      <Suspense fallback={<main className="me-pag" role="status">Preparando…</main>}>
        <Reservar />
      </Suspense>
    );
  if (a === "mis-citas") return <MisCitas />;
  return null;
}
