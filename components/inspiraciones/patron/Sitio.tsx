"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ActionBar from "@/components/ui/ActionBar";
import AppointmentList from "@/components/ui/AppointmentList";
import BookingFlow from "@/components/ui/BookingFlow";
import CartDrawer from "@/components/ui/CartDrawer";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import ContactForm from "@/components/ui/ContactForm";
import Marquee from "@/components/ui/Marquee";
import OpeningHours from "@/components/ui/OpeningHours";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useCart } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/money";
import { EQUIPO, NOTICIAS, PRODUCTOS, SALAS, SERVICIOS, type Producto } from "./data";
import { PatronCtx, patronHref, usePatron } from "./marco";
import "./patron.css";
import Portada from "./Patron";

/*
 * Patrón con varias páginas (docs/56): la portada (Patron.tsx) y servicios por sala, la familia, la tienda «shop in shop»
 * con su ficha, bolsa (CartDrawer) y pedido (CheckoutFlow), noticias, reservar, mis citas y contacto. El marco persiste:
 * el menú lateral que entra desde la derecha, la bolsa, la cinta y el pie; en las páginas interiores, una barra arriba.
 */

const CITAS = "trama:patron:citas";
const HORARIO = "L|cerrado\nM-V|10:00-21:00\nS|10:00-15:00\nD|cerrado";

function Menu({ abierto, cerrar }: { abierto: boolean; cerrar: () => void }) {
  const path = usePathname();
  const enlaces: [string, string][] = [["", "Inicio"], ["equipo", "La familia"], ["servicios", "Servicios"], ["tienda", "Shop in shop"], ["noticias", "Noticias"], ["reservar", "Reservar"], ["mis-citas", "Mis citas"], ["contacto", "Contacto"]];
  return (
    <div className={`pt-menu ${abierto ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menú" aria-hidden={!abierto} inert={!abierto}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/inspiraciones/patron/menu-foto.webp" alt="" className="pt-menu__foto" onClick={cerrar} />
      <div className="pt-menu__panel">
        <button type="button" className="pt-ovalo pt-cerrar" onClick={cerrar}>
          Salir
        </button>
        <nav aria-label="Principal" onClick={cerrar}>
          {enlaces.map(([p, l]) => (
            <a key={p} href={patronHref(p)} className={path === patronHref(p) ? "pt-menu__activo" : undefined} aria-current={path === patronHref(p) ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <figure className="pt-menu__tarjeta">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/inspiraciones/patron/menu-familia.webp" alt="" />
          <figcaption>
            <i>Mantente impecable</i>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [bolsaAbierta, setBolsaAbierta] = useState(false);
  const carrito = useCart("trama:patron:bolsa");
  const path = usePathname();
  const portada = path === patronHref();
  // el menú se cierra con Escape y al cambiar de página
  useEffect(() => {
    if (!menu) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [menu]);
  useEffect(() => setMenu(false), [path]);
  const [boletin, setBoletin] = useState<"" | "abierto" | "hecho">("");
  const [correo, setCorreo] = useState("");

  return (
    <PatronCtx.Provider value={{ menu, abrirMenu: () => setMenu(true), bolsa: carrito.count, abrirBolsa: () => setBolsaAbierta(true), carrito }}>
      <div className="pt">
        {!portada && (
          <header className="pt-barra">
            <a href={patronHref()} className="pt-barra__logo">
              PATRÓN<small>Barber &amp; Groom</small>
            </a>
            <nav aria-label="Accesos">
              <a href={patronHref("reservar")}>Reservar</a>
              <button type="button" className="pt-bolsa" onClick={() => setBolsaAbierta(true)}>
                Bolsa ({carrito.count})
              </button>
              <button type="button" className="pt-burger" aria-label="Abrir el menú" aria-expanded={menu} onClick={() => setMenu(true)}>
                <i />
                <i />
                <i />
              </button>
            </nav>
          </header>
        )}
        {children}
        <footer className="pt-pie" id="contacto">
          <div className="pt-pie__datos">
            <p>
              Calle de Almagro 23
              <br />
              28010 Madrid
            </p>
            <p>
              <a href={patronHref("noticias")}>Noticias</a>
              <br />
              <a href={patronHref("tienda")}>Tienda</a>
              <br />
              <a href={patronHref("contacto")}>Contacto</a>
            </p>
            <p>
              T. +34 910 000 000
              <br />
              E. hola@patron.example
            </p>
          </div>
          {boletin === "hecho" ? (
            <p className="pt-boletin" role="status">
              Gracias. Ya estás dentro.
            </p>
          ) : boletin === "abierto" ? (
            <form className="pt-boletin__form" noValidate onSubmit={(e) => { e.preventDefault(); if (/^\S+@\S+\.\S+$/.test(correo.trim())) setBoletin("hecho"); }}>
              <label>
                Tu correo
                <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="email" autoFocus />
              </label>
              <button type="submit" className="pt-ovalo">
                Apuntarme
              </button>
            </form>
          ) : (
            <button type="button" className="pt-boletin" onClick={() => setBoletin("abierto")}>
              BOLETÍN
            </button>
          )}
        </footer>
        <Marquee variant="minimal" text="BIENVENIDO AL MUNDO DE PATRÓN" separator="     " rows={1} duration={30} className="pt-cinta pt-cinta--pie" />
        <Menu abierto={menu} cerrar={() => setMenu(false)} />
        <CartDrawer open={bolsaAbierta} onOpenChange={setBolsaAbierta} lines={carrito.lines} onQty={carrito.setQty} onRemove={carrito.remove} title="Tu bolsa" freeShippingFrom={50} checkoutHref={patronHref("pedido")} checkoutLabel="Cerrar el pedido" continueHref={patronHref("tienda")} emptyText="Aún no has elegido nada de la tienda." />
        <ActionBar
          variant="minimal"
          soft
          actions={[
            { label: "Llamar", href: "tel:+34910000000", icon: "phone" },
            { label: "Tienda", href: patronHref("tienda"), icon: "shopping-cart", badge: carrito.count || undefined },
            { label: "Reservar", href: patronHref("reservar"), icon: "calendar", primary: true },
          ]}
        />
      </div>
    </PatronCtx.Provider>
  );
}

function Titulo({ chico, titulo, children }: { chico: ReactNode; titulo: string; children?: ReactNode }) {
  return (
    <header className="pt-pag__cab">
      <p className="pt-chico">{chico}</p>
      <h1>{titulo}</h1>
      {children}
    </header>
  );
}

function Servicios() {
  return (
    <main className="pt-pag">
      <Titulo chico={<>Tratamientos de la casa<br /><span>Precios con IVA. Productos de la tienda incluidos en cada servicio.</span></>} titulo="SERVICIOS" />
      {SALAS.map((sala) => (
        <section key={sala.id} id={sala.id} className="pt-sala">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sala.img} alt="" loading="lazy" />
          <div>
            <h2>{sala.nombre}</h2>
            <p className="pt-texto">{sala.texto}</p>
            <ul className="pt-precios">
              {SERVICIOS.filter((s) => s.sala === sala.id).map((s) => (
                <li key={s.id}>
                  <span>
                    <b>{s.name}</b>
                    <small>{s.description}</small>
                  </span>
                  <span>
                    {s.price} € · {s.minutes}′
                  </span>
                  <a href={patronHref(`reservar?servicio=${s.id}`)}>Reservar</a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </main>
  );
}

function Equipo() {
  return (
    <main className="pt-pag">
      <Titulo chico={<>Cuidado y bienestar<br /><b>La familia</b></>} titulo="LA FAMILIA" />
      <section className="pt-historia">
        <p className="pt-texto">Julián Aranda aprendió el oficio en la barbería de su padre, en Chamberí. En 2009 abrió Patrón en la calle de Almagro con una idea sencilla: que un hombre pudiera arreglarse de la cabeza a los pies en un solo sitio, con calma y con gente de confianza. Hoy su hijo Álvaro corta a su lado.</p>
      </section>
      <ul className="pt-equipo">
        {EQUIPO.map((p) => (
          <li key={p.name}>
            {p.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.photo} alt={p.name} loading="lazy" />
            ) : (
              <span className="pt-equipo__inicial" aria-hidden>
                {p.name[0]}
              </span>
            )}
            <h2>{p.name.toUpperCase()}</h2>
            <p className="pt-chico">{p.role}</p>
            <p className="pt-texto">{p.bio}</p>
            <a href={patronHref(`reservar?profesional=${p.name}`)} className="pt-ovalo">
              Reservar con {p.name}
            </a>
          </li>
        ))}
      </ul>
      <section className="pt-galeria" aria-label="Galería">
        {["local", "tienda", "servicio-afeitado", "servicio-manicura", "menu-foto", "servicio-barberia"].map((f) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={f} src={`/img/inspiraciones/patron/${f}.webp`} alt="" loading="lazy" />
        ))}
      </section>
    </main>
  );
}

function Etiqueta({ p }: { p: Producto }) {
  return (
    <span className="pt-etiqueta" style={{ ["--tono" as string]: p.tono }}>
      <b>{p.marca}</b>
      <small>{p.nombre}</small>
      <i>{p.formato}</i>
    </span>
  );
}

function Tienda() {
  const { carrito, abrirBolsa } = usePatron();
  return (
    <main className="pt-pag">
      <Titulo chico={<>Una selección de productos<br />solo para hombre</>} titulo="SHOP IN SHOP">
        <p className="pt-texto">Lo que usamos en el sillón, para llevar a casa. Envío gratis desde 50 € o recógelo en la barbería.</p>
      </Titulo>
      <ul className="pt-tienda">
        {PRODUCTOS.map((p) => (
          <li key={p.id}>
            <a href={patronHref(`tienda/${p.id}`)} className="pt-tienda__ficha">
              <Etiqueta p={p} />
              <b>{p.nombre}</b>
              <span>{money(p.precio)}</span>
            </a>
            <button type="button" className="pt-ovalo" onClick={() => { carrito.add({ id: p.id, title: `${p.marca} · ${p.nombre}`, price: p.precio, meta: p.formato }); abrirBolsa(); }}>
              Añadir
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Ficha({ id }: { id: string }) {
  const { carrito, abrirBolsa } = usePatron();
  const p = PRODUCTOS.find((x) => x.id === id)!;
  const [n, setN] = useState(1);
  return (
    <main className="pt-pag pt-ficha">
      <a href={patronHref("tienda")} className="pt-volver">
        ← Tienda
      </a>
      <div className="pt-ficha__rejilla">
        <Etiqueta p={p} />
        <div className="pt-ficha__texto">
          <p className="pt-chico">{p.marca}</p>
          <h1>{p.nombre.toUpperCase()}</h1>
          <p className="pt-texto">{p.texto}</p>
          <p className="pt-precio">
            {money(p.precio)} · {p.formato}
          </p>
          <QuantityStepper value={n} onChange={setN} min={1} max={10} label={p.nombre} />
          <button type="button" className="pt-ovalo pt-ovalo--lleno" onClick={() => { carrito.add({ id: p.id, title: `${p.marca} · ${p.nombre}`, price: p.precio, meta: p.formato }, n); abrirBolsa(); }}>
            Añadir a la bolsa
          </button>
          <p className="pt-chico">Envío gratis desde 50 € · recogida en la barbería</p>
        </div>
      </div>
      <nav className="pt-otros" aria-label="Más productos">
        {PRODUCTOS.filter((x) => x.id !== p.id).slice(0, 3).map((x) => (
          <a key={x.id} href={patronHref(`tienda/${x.id}`)}>
            {x.nombre} →
          </a>
        ))}
      </nav>
    </main>
  );
}

function Pedido() {
  const { carrito } = usePatron();
  return (
    <main className="pt-pag">
      <Titulo chico="Shop in shop" titulo="TU PEDIDO" />
      <CheckoutFlow className="pt-checkout" lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} pickups={[{ id: "almagro", name: "Patrón · Almagro", address: "Calle de Almagro 23, Madrid" }]} orderPrefix="PT" shopHref={patronHref("tienda")} />
    </main>
  );
}

function Noticias() {
  return (
    <main className="pt-pag">
      <Titulo chico={<>Infórmate<br /><span>Relaciones, moda, deporte, comida, viajes y cuidado personal.</span></>} titulo="NOTICIAS" />
      <div className="pt-noticias__fila">
        {NOTICIAS.map((n) => (
          <a key={n.slug} href={patronHref(`noticias/${n.slug}`)} className="pt-noticia">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={n.img} alt="" loading="lazy" />
            <small>{n.cat}</small>
            <p>{n.titulo}</p>
            <time>{n.fecha}</time>
          </a>
        ))}
      </div>
    </main>
  );
}

function Noticia({ slug }: { slug: string }) {
  const n = NOTICIAS.find((x) => x.slug === slug)!;
  return (
    <main className="pt-pag pt-articulo">
      <a href={patronHref("noticias")} className="pt-volver">
        ← Noticias
      </a>
      <p className="pt-chico">
        {n.cat} · {n.fecha}
      </p>
      <h1>{n.titulo.toUpperCase()}</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={n.img} alt="" />
      <div className="pt-texto">
        {n.cuerpo.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
      </div>
      <a href={patronHref("reservar")} className="pt-ovalo">
        Reservar
      </a>
    </main>
  );
}

function Reservar() {
  const q = useSearchParams();
  return (
    <main className="pt-pag">
      <Titulo chico="De la cabeza a los pies" titulo="RESERVAR" />
      <BookingFlow
        key={`${q.get("editar") ?? ""}${q.get("servicio") ?? ""}${q.get("profesional") ?? ""}`}
        className="pt-reserva"
        services={SERVICIOS}
        staff={EQUIPO}
        initialService={q.get("servicio") ?? undefined}
        initialStaff={q.get("profesional") ?? undefined}
        editId={q.get("editar") ?? undefined}
        times="10:00, 11:00, 12:00, 13:00, 16:00, 17:00, 18:00, 19:00, 20:00"
        closedDays="0,1"
        closesAt={{ 6: "15:00" }}
        storageKey={CITAS}
        serviceLabel="Servicio"
        staffLabel="Con quién"
        business="Patrón Barber & Groom"
        location="Calle de Almagro 23, Madrid"
        appointmentsHref={patronHref("mis-citas")}
        note="Barbería de demostración: no se envía nada y la cita solo se guarda en este navegador."
      />
    </main>
  );
}

function MisCitas() {
  return (
    <main className="pt-pag">
      <Titulo chico="Guardadas en este navegador" titulo="MIS CITAS" />
      <AppointmentList services={SERVICIOS} storageKey={CITAS} bookHref={patronHref("reservar")} business="Patrón Barber & Groom" location="Calle de Almagro 23, Madrid" emptyTitle="Sin citas todavía" emptyText="Corte, afeitado, facial o manicura: elige y te guardamos el sillón." />
    </main>
  );
}

function Contacto() {
  return (
    <main className="pt-pag">
      <Titulo chico="Calle de Almagro 23 · 28010 Madrid" titulo="CONTACTO" />
      <div className="pt-contacto">
        <div>
          <OpeningHours hours={HORARIO} title="Horario" variant="minimal" />
          <p className="pt-texto">
            T. +34 910 000 000 · E. hola@patron.example
            <br />
            Metro Alonso Martínez · Rubén Darío
          </p>
        </div>
        <ContactForm title="Escríbenos" subtitle="Regalos, eventos y bonos para empresas." fields="name, email, message" submitLabel="Enviar" successTitle="Gracias" successMessage="Te contestamos hoy mismo (demostración: no se envía nada)." variant="minimal" className="pt-form" />
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "servicios") return <Servicios />;
  if (a === "equipo") return <Equipo />;
  if (a === "tienda") return b ? <Ficha id={b} /> : <Tienda />;
  if (a === "pedido") return <Pedido />;
  if (a === "noticias") return b ? <Noticia slug={b} /> : <Noticias />;
  if (a === "reservar")
    return (
      <Suspense fallback={<main className="pt-pag" role="status">Preparando…</main>}>
        <Reservar />
      </Suspense>
    );
  if (a === "mis-citas") return <MisCitas />;
  if (a === "contacto") return <Contacto />;
  return null;
}
