"use client";

import { createContext, Suspense, useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import CartDrawer from "@/components/ui/CartDrawer";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import ContactForm from "@/components/ui/ContactForm";
import EnrollmentFlow from "@/components/ui/EnrollmentFlow";
import MemberArea from "@/components/ui/MemberArea";
import MembershipFlow from "@/components/ui/MembershipFlow";
import OptionPicker from "@/components/ui/OptionPicker";
import ProductCard from "@/components/ui/ProductCard";
import RollLink from "@/components/ui/RollLink";
import { useCart } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/money";
import { CUOTAS, DISCIPLINAS, EVENTOS, HORARIO, TIENDA } from "./data";
import { loboHref } from "./enlaces";
import { HorarioLobo, SOCIO_LOBO } from "./HorarioLobo";
import "./lobo.css";
import Portada from "./Lobo";

/*
 * Lobo con varias páginas (docs/56): la portada (Lobo.tsx) y clases con la ficha de cada disciplina, la clase de prueba,
 * eventos (apuntarse con EnrollmentFlow), horario, cuotas (MembershipFlow), mi cuenta, la tienda con ficha (talla), bolsa
 * y pedido, y contacto. El marco persiste: la cabecera negra con el menú que cae desde «MENÚ ≡», la bolsa y el pie.
 */

const Bolsa = createContext<{ carrito: ReturnType<typeof useCart>; abrir: () => void } | null>(null);
const useBolsa = () => useContext(Bolsa)!;

export function Shell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [bolsa, setBolsa] = useState(false);
  const carrito = useCart("trama:lobo:bolsa");
  const path = usePathname();
  useEffect(() => setMenu(false), [path]);
  return (
    <Bolsa.Provider value={{ carrito, abrir: () => setBolsa(true) }}>
      <div className="lb">
        <header className="lb-head">
          <a href={loboHref()} className="lb-logo">
            LOBO
          </a>
          <button type="button" className="lb-bolsa" onClick={() => setBolsa(true)}>
            BOLSA ({carrito.count})
          </button>
          <button type="button" className="lb-menu-btn" aria-expanded={menu} onClick={() => setMenu(!menu)}>
            MENÚ <span aria-hidden>{menu ? "✕" : "≡"}</span>
          </button>
          <div className={`lb-menu ${menu ? "is-open" : ""}`} aria-hidden={!menu} inert={!menu}>
            <nav aria-label="Principal" onClick={() => setMenu(false)}>
              <a href={loboHref("clases")}>Clases</a>
              <a href={loboHref("eventos")}>Eventos</a>
              <a href={loboHref("cuotas")}>Cuotas</a>
              <a href={loboHref("horario")}>Horario</a>
              <a href={loboHref("contacto")}>Sobre nosotros</a>
            </nav>
            <div className="lb-menu__sec" onClick={() => setMenu(false)}>
              <a href={loboHref("mi-cuenta")}>Socios</a>
              <a href={loboHref("tienda")}>Tienda</a>
              <a href={loboHref("contacto")}>Ayuda</a>
            </div>
            <a href={loboHref("prueba")} className="lb-boton lb-boton--borde" onClick={() => setMenu(false)}>
              Clase de prueba
            </a>
          </div>
        </header>
        {children}
        <footer className="lb-pie">
          <i className="lb-franja" aria-hidden />
          <strong className="lb-logo">LOBO</strong>
          <div className="lb-pie__cols">
            <div>
              <b>DIRECCIÓN</b>
              <p>
                Lobo Gym
                <br />
                Plaza de Vallecas 5
                <br />
                28031 Madrid
              </p>
            </div>
            <div>
              <b>HORARIO</b>
              <p>
                L-V 07:00 – 23:00
                <br />
                Sábado 10:00 – 20:00
                <br />
                Domingo 10:00 – 17:00
              </p>
            </div>
            <div>
              <b>CONTACTO</b>
              <p>
                <a href="mailto:hola@lobo.example">hola@lobo.example</a>
                <br />
                <a href="tel:+34910000000">910 000 000</a>
              </p>
            </div>
          </div>
          <nav aria-label="Pie">
            <a href={loboHref("clases")}>Clases</a>
            <a href={loboHref("eventos")}>Eventos</a>
            <a href={loboHref("cuotas")}>Cuotas</a>
            <a href={loboHref("horario")}>Horario</a>
            <a href={loboHref("tienda")}>Tienda</a>
            <a href={loboHref("mi-cuenta")}>Mi cuenta</a>
          </nav>
          <small>Gimnasio de demostración de Trama · © 2026 Lobo Gym</small>
        </footer>
        <CartDrawer open={bolsa} onOpenChange={setBolsa} lines={carrito.lines} onQty={carrito.setQty} onRemove={carrito.remove} title="Tu bolsa" freeShippingFrom={60} checkoutHref={loboHref("pedido")} checkoutLabel="Finalizar pedido" continueHref={loboHref("tienda")} />
      </div>
    </Bolsa.Provider>
  );
}

function Cab({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <header className="lb-pag__cab">
      <h1 className="lb-sub">{titulo}</h1>
      {texto && <p>{texto}</p>}
    </header>
  );
}

function Clases() {
  return (
    <main className="lb-pag">
      <Cab titulo="NUESTRAS CLASES" texto="Más de 1.500 m² y más de 140 clases a la semana. Elige disciplina para ver su horario." />
      <div className="lb-disciplinas">
        {DISCIPLINAS.map((d) => (
          <a key={d.id} href={loboHref(`clases/${d.id}`)} className="lb-disc">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.img} alt="" loading="lazy" />
            <span>{d.n}</span>
          </a>
        ))}
      </div>
    </main>
  );
}

function Disciplina({ id }: { id: string }) {
  const d = DISCIPLINAS.find((x) => x.id === id)!;
  return (
    <main className="lb-pag">
      <a href={loboHref("clases")} className="lb-volver">
        ← CLASES
      </a>
      <div className="lb-ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.img} alt="" />
        <div>
          <h1 className="lb-sub lb-sub--izq">{d.n.toUpperCase()}</h1>
          <p>{d.texto}</p>
          <p>
            <b>Para quién:</b> {d.para}
          </p>
          <RollLink fade href={loboHref("prueba")} label="Clase de prueba gratis" className="lb-boton" />
        </div>
      </div>
      <h2 className="lb-sub lb-sub--izq">HORARIO DE {d.n.toUpperCase()}</h2>
      <HorarioLobo disciplina={d.n} layout="list" />
    </main>
  );
}

function Prueba() {
  return (
    <main className="lb-pag">
      <Cab titulo="CLASE DE PRUEBA" texto="Gratis y sin compromiso. Elige una clase de inicio (o la que quieras) y reserva: los guantes te los dejamos." />
      <ol className="lb-pasos">
        <li>
          <b>1</b>Elige clase en el horario y pulsa «Reservar».
        </li>
        <li>
          <b>2</b>Ven diez minutos antes con ropa cómoda y agua.
        </li>
        <li>
          <b>3</b>Si te gusta, elige tu cuota en recepción o aquí mismo.
        </li>
      </ol>
      <HorarioLobo layout="list" />
    </main>
  );
}

function Eventos() {
  return (
    <main className="lb-pag">
      <Cab titulo="EVENTOS" texto="Sparring, open mat, seminarios y torneos. Apúntate para guardar tu sitio." />
      <div className="lb-carteles">
        {EVENTOS.map((e) => (
          <article key={e.id} style={{ "--tono": e.tono } as CSSProperties}>
            <div className="lb-cartel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.img} alt="" loading="lazy" />
              <b>{e.titulo}</b>
            </div>
            <small>{e.dia}</small>
            <p>{e.texto}</p>
            <RollLink fade href={loboHref(`eventos/${e.id}`)} label="Apúntate" className="lb-boton" />
          </article>
        ))}
      </div>
    </main>
  );
}

function Evento({ id }: { id: string }) {
  const e = EVENTOS.find((x) => x.id === id)!;
  return (
    <main className="lb-pag">
      <a href={loboHref("eventos")} className="lb-volver">
        ← EVENTOS
      </a>
      <Cab titulo={e.titulo.toUpperCase()} texto={`${e.dia}. ${e.texto}`} />
      <EnrollmentFlow className="lb-flujo" program={e.titulo} cohorts={e.fechas} levels={["Menos de un año", "De uno a tres años", "Más de tres años"]} storageKey="trama:lobo:eventos" note="Evento de demostración: no se envía nada." />
    </main>
  );
}

function Horario() {
  return (
    <main className="lb-pag">
      <Cab titulo="HORARIO" texto="Siete días a la semana. Reserva tu plaza; sin cuota, la primera clase es gratis." />
      <HorarioLobo />
    </main>
  );
}

function Cuotas() {
  const q = useSearchParams();
  return (
    <main className="lb-pag">
      <Cab titulo="CUOTAS" texto="Sin permanencia. Congela la cuota hasta dos meses al año por lesión o viaje." />
      <MembershipFlow className="lb-flujo" plans={CUOTAS} initialPlan={q.get("plan") ?? undefined} signupFee={20} storageKey={SOCIO_LOBO} club="Lobo Gym" scheduleHref={loboHref("horario")} accountHref={loboHref("mi-cuenta")} />
    </main>
  );
}

function MiCuenta() {
  return (
    <main className="lb-pag">
      <Cab titulo="MI CUENTA" />
      <MemberArea classes={HORARIO} storageKey={SOCIO_LOBO} club="Lobo Gym" plansHref={loboHref("cuotas")} scheduleHref={loboHref("horario")} />
    </main>
  );
}

function Tienda() {
  return (
    <main className="lb-pag">
      <Cab titulo="TIENDA" texto="Ropa y material del Lobo. Envío gratis desde 60 € o recógelo en recepción." />
      <div className="lb-tienda__rejilla">
        {TIENDA.map((t) => (
          <ProductCard key={t.id} title={t.title} price={t.price} image={t.image} meta="Lobo Gym" ratio="1 / 1" href={loboHref(`tienda/${t.id}`)} variant="minimal" />
        ))}
      </div>
    </main>
  );
}

function Producto({ id }: { id: string }) {
  const { carrito, abrir } = useBolsa();
  const t = TIENDA.find((x) => x.id === id)!;
  const conTalla = id === "camiseta" || id === "sudadera";
  const [talla, setTalla] = useState("M");
  return (
    <main className="lb-pag">
      <a href={loboHref("tienda")} className="lb-volver">
        ← TIENDA
      </a>
      <div className="lb-ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.image} alt={t.title} />
        <div>
          <h1 className="lb-sub lb-sub--izq">{t.title.toUpperCase()}</h1>
          <p className="lb-precio">{money(t.price)}</p>
          <p>{t.texto}</p>
          {conTalla && <OptionPicker kind="chip" label="Talla" options={["S", "M", "L", "XL"].map((v) => ({ value: v, label: v }))} value={talla} onChange={setTalla} />}
          <button type="button" className="lb-boton" onClick={() => { carrito.add({ id: conTalla ? `${t.id}-${talla}` : t.id, title: t.title, price: t.price, image: t.image, meta: conTalla ? `Talla ${talla}` : "Lobo Gym" }); abrir(); }}>
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
    <main className="lb-pag">
      <Cab titulo="TU PEDIDO" />
      <CheckoutFlow className="lb-flujo" lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} pickups={[{ id: "recepcion", name: "Recepción de Lobo Gym", address: "Plaza de Vallecas 5" }]} freeShippingFrom={60} orderPrefix="LB" shopHref={loboHref("tienda")} />
    </main>
  );
}

function Contacto() {
  const q = useSearchParams();
  return (
    <main className="lb-pag">
      <Cab titulo="SOBRE NOSOTROS" texto="Abrimos en 2010 en la plaza de Vallecas. Empezamos como gimnasio de MMA y hoy somos la casa de muchos deportes de combate." />
      <div className="lb-contacto">
        <div className="lb-mapa" aria-label="Mapa: Plaza de Vallecas 5">
          <i aria-hidden />
        </div>
        <ContactForm title={q.get("asunto") === "colaboracion" ? "Colaboraciones" : "Escríbenos"} subtitle="" fields="name, email, message" submitLabel="Enviar" successTitle="Gracias" successMessage="Te contestamos pronto (demostración: no se envía nada)." variant="minimal" className="lb-form" />
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  const espera = <main className="lb-pag" role="status">Cargando…</main>;
  if (!a) return <Portada />;
  if (a === "clases") return b ? <Disciplina id={b} /> : <Clases />;
  if (a === "prueba") return <Prueba />;
  if (a === "eventos") return b ? <Evento id={b} /> : <Eventos />;
  if (a === "horario") return <Horario />;
  if (a === "cuotas") return <Suspense fallback={espera}><Cuotas /></Suspense>;
  if (a === "mi-cuenta") return <MiCuenta />;
  if (a === "tienda") return b ? <Producto id={b} /> : <Tienda />;
  if (a === "pedido") return <Pedido />;
  if (a === "contacto") return <Suspense fallback={espera}><Contacto /></Suspense>;
  return null;
}
