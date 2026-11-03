"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import ContactForm from "@/components/ui/ContactForm";
import EventLineup from "@/components/ui/EventLineup";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Reveal from "@/components/ui/Reveal";
import { useCart } from "@/lib/commerce/cart";
import { CARTA, EVENTOS, FOTOS, HORARIO, PLACERES, TURNOS, ZONAS } from "./data";
import { bocadoHref } from "./enlaces";
import "./bocado.css";

/*
 * Bocado (docs/59), a partir de Délice: restaurante-pizzería de barrio con medio siglo. Bloques de color pleno que se suceden
 * (rojo, turquesa, verde botella, granate) sobre crema; una serifa blanda y grande para titulares (Fraunces, en el papel de
 * la redonda de Délice) con cursiva para los subtítulos, y una sans redondeada en mayúsculas para botones y etiquetas. Los
 * platos del día van recortados en círculos crema bajo un título en arco. Flujos: reservar mesa, pedir a domicilio con
 * carrito, programación de noches y tarjeta regalo.
 */

const NAV_I: [string, string][] = [
  ["carta", "La carta"],
  ["restaurante", "El restaurante"],
];
const NAV_D: [string, string][] = [
  ["programacion", "Programación"],
  ["salones", "Salones privados"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} €`;

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  const nav = (l: [string, string][]) =>
    l.map(([p, t]) => (
      <a key={p} href={bocadoHref(p)} aria-current={ruta === p ? "page" : undefined}>
        {t}
      </a>
    ));
  return (
    <div className="bo" id="top">
      <p className="bo-tira">
        <span>☀ Menú del mediodía · de lunes a viernes de 13 a 16 h</span>
        <a href={bocadoHref("pedir")}>Pedir a domicilio →</a>
      </p>
      <header className="bo-head">
        <nav className="bo-head__nav" aria-label="Principal">
          {nav(NAV_I)}
        </nav>
        <a href={bocadoHref()} className="bo-logo">
          Bocado
        </a>
        <nav className="bo-head__nav bo-head__nav--der" aria-label="Más">
          {nav(NAV_D)}
        </nav>
        <div className="bo-burger">
          <FullscreenMenu
            trigger="burger"
            layout="sheet"
            tone="acc"
            reveal="circle"
            size="md"
            className="bo-menu"
            brand="Bocado"
            openLabel="Menú"
            closeLabel="Cerrar"
            note="Calle del Coso 88 · Zaragoza"
            links={[{ label: "Inicio", href: bocadoHref() }, ...NAV_I, ...NAV_D, ["reservar", "Reservar mesa"], ["pedir", "Pedir a domicilio"]].map((x) => (Array.isArray(x) ? { label: x[1], href: bocadoHref(x[0]) } : x))}
            footer={[{ label: "976 000 000", href: "tel:976000000" }]}
          />
        </div>
      </header>
      {children}
      <footer className="bo-pie">
        <div className="bo-pie__cols">
          <div>
            <h3>Dónde</h3>
            <p>
              Calle del Coso 88
              <br />
              50001 Zaragoza
            </p>
            <p>
              976 000 000
              <br />
              hola@bocado.example
            </p>
          </div>
          <div>
            <h3>Horario</h3>
            <dl>
              {HORARIO.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3>Más Bocado</h3>
            {[...NAV_I, ...NAV_D, ["reservar", "Reservar mesa"], ["tarjeta-regalo", "Tarjeta regalo"]].map(([p, t]) => (
              <a key={p} href={bocadoHref(p)}>
                {t}
              </a>
            ))}
          </div>
        </div>
        <p className="bo-pie__logo" aria-hidden>
          Bocado
        </p>
        <small>Bocado · restaurante de demostración de Trama. Carta, precios y programación inventados.</small>
      </footer>
    </div>
  );
}

const Botones = () => (
  <div className="bo-botones">
    {[
      ["restaurante", "Venir a Bocado"],
      ["reservar", "Reservar"],
      ["pedir", "Pedir online"],
      ["tarjeta-regalo", "Tarjeta regalo"],
    ].map(([p, t]) => (
      <a key={p} href={bocadoHref(p)} className="bo-boton">
        {t}
      </a>
    ))}
  </div>
);

/** «Placeres del día» escrito sobre un arco, como el de Délice */
function Arco({ texto }: { texto: string }) {
  return (
    <svg viewBox="0 0 600 150" className="bo-arco" role="img" aria-label={texto}>
      <path id="bo-arco" d="M 40 140 Q 300 -40 560 140" fill="none" />
      <text>
        <textPath href="#bo-arco" startOffset="50%" textAnchor="middle">
          {texto}
        </textPath>
      </text>
    </svg>
  );
}

function Placeres() {
  const [i, setI] = useState(0);
  const n = PLACERES.length;
  const dos = [PLACERES[i % n], PLACERES[(i + 1) % n]];
  return (
    <section className="bo-placeres" style={{ "--fondo": dos[0].fondo } as CSSProperties} aria-roledescription="carrusel" aria-label="Placeres del día">
      <Arco texto="Placeres del día" />
      <div className="bo-placeres__fila" aria-live="polite">
        {dos.map((p, k) => (
          <article key={p.id + k}>
            <div className="bo-plato">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt="" />
            </div>
            <h3>{p.n}</h3>
            <p className="bo-cursiva">{p.sub}</p>
            <small>{p.cuando}</small>
          </article>
        ))}
      </div>
      <div className="bo-placeres__flechas">
        <button type="button" aria-label="Anterior" onClick={() => setI((i - 1 + n) % n)}>
          ←
        </button>
        <button type="button" aria-label="Siguiente" onClick={() => setI((i + 1) % n)}>
          →
        </button>
      </div>
    </section>
  );
}

function Portada() {
  return (
    <main>
      <section className="bo-hero">
        <div className="bo-hero__txt">
          <h1>
            <span>Todas</span>
            <span>las razones</span>
            <span>son buenas</span>
          </h1>
          <p className="bo-etiqueta">Pizzería Bocado desde 1972</p>
          <p>En pleno Coso, el sitio de toda la vida para comer bien, celebrar lo que sea y quedarse un rato más.</p>
        </div>
        <div className="bo-hero__img">
          <svg viewBox="0 0 400 400" aria-hidden className="bo-remolino">
            <path d="M330 -20 C 420 120 240 160 260 260 C 280 360 420 330 420 330 L 420 -20 Z" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.portada} alt="Entrecot con patatas fritas" />
        </div>
        <Botones />
      </section>

      <section className="bo-antojos">
        <h2>Un plato para cada antojo</h2>
        <div>
          {CARTA.map((s) => (
            <a key={s.id} href={bocadoHref(`carta#${s.id}`)}>
              <span className="bo-plato bo-plato--peq">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt="" loading="lazy" />
              </span>
              <b>{s.n}</b>
            </a>
          ))}
        </div>
      </section>

      <Placeres />

      <section className="bo-programa">
        <header>
          <h2>Noches con algo</h2>
          <p className="bo-cursiva">Conciertos, karaoke y juegos, casi siempre gratis.</p>
        </header>
        <EventLineup events={EVENTOS} layout="cards" limit={3} groupBy="none" cta="Reservar mesa" variant="minimal" className="bo-lineup" />
        <a href={bocadoHref("programacion")} className="bo-boton bo-boton--rojo">
          Toda la programación
        </a>
      </section>

      <section className="bo-salones">
        <div>
          <p className="bo-etiqueta">Salones privados</p>
          <h2>Celebra a lo grande en un rincón para vosotros</h2>
          <p>Tres salones de 12 a 60 personas, con menú cerrado, música propia y la tarta que traigáis.</p>
          <a href={bocadoHref("salones")} className="bo-boton">
            Ver los salones
          </a>
        </div>
        <div className="bo-salones__arco">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.salon} alt="Salón privado" loading="lazy" />
        </div>
      </section>

      <section className="bo-historia">
        <Reveal kind="slide" as="h2">
          Un clásico de Zaragoza desde 1972
        </Reveal>
        <p>Pilar y Ramón abrieron con un horno de leña y seis mesas. La lasaña es la misma; el horno, el tercero.</p>
        <a href={bocadoHref("restaurante")} className="bo-boton">
          Nuestra historia
        </a>
        <div className="bo-historia__fotos">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.cocina} alt="La cocina de Bocado" loading="lazy" />
          <span className="bo-plato bo-plato--horno">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FOTOS.horno} alt="Pizza saliendo del horno" loading="lazy" />
          </span>
        </div>
      </section>

      <section className="bo-empleo">
        <p>
          <b>Buscamos gente.</b> Sala, cocina y reparto, con contrato y propinas repartidas.
        </p>
        <a href={bocadoHref("restaurante#empleo")} className="bo-boton bo-boton--rojo">
          Trabaja con nosotros
        </a>
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto, etiqueta, color }: { titulo: string; texto?: string; etiqueta?: string; color?: string }) => (
  <header className="bo-cab" style={color ? ({ "--cab": color } as CSSProperties) : undefined}>
    {etiqueta && <p className="bo-etiqueta">{etiqueta}</p>}
    <h1>{titulo}</h1>
    {texto && <p className="bo-cursiva">{texto}</p>}
  </header>
);

function Carta() {
  return (
    <main className="bo-pag">
      <Cab etiqueta="Todo el día" titulo="La carta" texto="Masa de 48 horas, brasa de encina y postres de la casa." />
      <nav className="bo-chips" aria-label="Secciones de la carta">
        {CARTA.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.n}
          </a>
        ))}
      </nav>
      {CARTA.map((s) => (
        <section key={s.id} id={s.id} className="bo-seccion">
          <span className="bo-plato bo-plato--peq">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt="" loading="lazy" />
          </span>
          <h2>{s.n}</h2>
          <ul>
            {s.platos.map((p) => (
              <li key={p.id}>
                <div>
                  <b>{p.n}</b>
                  {p.tag && <em>{p.tag}</em>}
                  <span>{p.d}</span>
                </div>
                <i>{eur(p.precio)}</i>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div className="bo-pag__fin">
        <a href={bocadoHref("pedir")} className="bo-boton bo-boton--rojo">
          Pedir a domicilio
        </a>
        <a href={bocadoHref("reservar")} className="bo-boton bo-boton--rojo">
          Reservar mesa
        </a>
      </div>
    </main>
  );
}

function Restaurante() {
  return (
    <main className="bo-pag">
      <Cab etiqueta="Desde 1972" titulo="El restaurante" texto="Seis mesas, un horno y una receta de lasaña. Medio siglo después, más o menos lo mismo." color="#6b1d24" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FOTOS.terraza} alt="La terraza de Bocado" className="bo-ancha" />
      <div className="bo-dos">
        <p className="bo-grande">Pilar cocinaba, Ramón atendía la barra y sus tres hijos hacían los deberes en la mesa del fondo. Hoy la llevan dos de los nietos.</p>
        <p>Seguimos haciendo la masa el día antes, comprando la verdura en el mercado de Lanuza y poniendo la música un poco más alta de lo que debería.</p>
      </div>
      <section id="empleo" className="bo-trabajo">
        <h2>Trabaja con nosotros</h2>
        <ul>
          <li>Camarero o camarera de sala · jornada completa</li>
          <li>Ayudante de cocina · fines de semana</li>
          <li>Reparto en bici · 20 horas</li>
        </ul>
        <ContactForm title="" subtitle="" messagePlaceholder="¿A qué puesto te presentas y qué experiencia tienes?" submitLabel="Enviar" successTitle="Recibido" successMessage="Te llamamos esta semana." variant="minimal" />
      </section>
    </main>
  );
}

function Programacion() {
  return (
    <main className="bo-pag">
      <Cab etiqueta="Programación" titulo="Noches con algo" texto="Reserva mesa para cenar; el espectáculo va incluido." color="#2d3e2b" />
      <div className="bo-margen">
        <EventLineup events={EVENTOS} layout="rows" filters groupBy="month" cta="Reservar mesa" variant="minimal" className="bo-lineup" />
      </div>
    </main>
  );
}

const SALONES = [
  { label: "El Rincón", hint: "Hasta 12 personas, con chimenea" },
  { label: "La Bodega", hint: "Hasta 30 personas, entre barricas" },
  { label: "El Altillo", hint: "Hasta 60 personas, con escenario" },
];

function Salones() {
  return (
    <main className="bo-pag">
      <Cab etiqueta="Salones privados" titulo="Para celebrarlo" texto="Cumpleaños, comidas de empresa o despedidas: dinos cuántos sois y qué celebráis." color="#2d3e2b" />
      <div className="bo-salas">
        {SALONES.map((s) => (
          <article key={s.label}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FOTOS.salon} alt="" loading="lazy" />
            <b>{s.label}</b>
            <span>{s.hint}</span>
          </article>
        ))}
      </div>
      <BriefFlow className="bo-margen" title="Pedir un salón" services={SALONES} servicesLabel="¿Qué salón os encaja?" budgets="Menos de 25 €/persona, 25–40 €/persona, Más de 40 €/persona" budgetLabel="Menú por persona" timelines="Este mes, El mes que viene, Más adelante" timelineLabel="¿Cuándo?" question="¿Qué celebráis y cuántos seréis?" prefix="BO" variant="minimal" />
    </main>
  );
}

function proximosDias(n: number) {
  const base = new Date(2026, 10, 4);
  return Array.from({ length: n }, (_, k) => {
    const x = new Date(base);
    x.setDate(base.getDate() + k);
    return x;
  });
}

function Reservar() {
  const dias = proximosDias(14);
  const [dia, setDia] = useState(0);
  const [turno, setTurno] = useState("");
  const [personas, setPersonas] = useState(2);
  const [zona, setZona] = useState(ZONAS[0]);
  const [datos, setDatos] = useState({ nombre: "", tel: "" });
  const [error, setError] = useState("");
  const [hecha, setHecha] = useState("");
  const lunes = dias[dia].getDay() === 1;
  const reservar = () => {
    setError("");
    if (lunes) return setError("Los lunes cerramos el comedor; elige otro día.");
    if (!turno) return setError("Elige la hora.");
    if (datos.nombre.trim().length < 2) return setError("Escribe un nombre para la reserva.");
    if (datos.tel.replace(/\D/g, "").length < 9) return setError("Revisa el teléfono (nueve cifras).");
    setHecha(`BO-${String(Date.now()).slice(-4)}`);
  };
  const fecha = dias[dia].toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  if (hecha)
    return (
      <main className="bo-pag">
        <Cab etiqueta={`Reserva ${hecha}`} titulo="¡Os esperamos!" texto={`${personas} ${personas === 1 ? "persona" : "personas"}, ${fecha} a las ${turno}, en ${zona.toLowerCase()}.`} />
        <div className="bo-pag__fin">
          <a href={bocadoHref("carta")} className="bo-boton bo-boton--rojo">
            Mirar la carta
          </a>
        </div>
      </main>
    );
  return (
    <main className="bo-pag">
      <Cab etiqueta="Reservar mesa" titulo="¿Cuándo venís?" texto="Para más de diez, mejor pide un salón." />
      <div className="bo-reserva">
        <fieldset>
          <legend className="bo-etiqueta">Día</legend>
          <div className="bo-dias">
            {dias.map((x, k) => (
              <button key={k} type="button" aria-pressed={dia === k} onClick={() => setDia(k)} disabled={x.getDay() === 1}>
                <small>{x.toLocaleDateString("es-ES", { weekday: "short" })}</small>
                <b>{x.getDate()}</b>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="bo-etiqueta">Hora</legend>
          <div className="bo-chips bo-chips--botones">
            {TURNOS.map((t) => (
              <button key={t} type="button" aria-pressed={turno === t} onClick={() => setTurno(t)}>
                {t}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="bo-etiqueta">Dónde</legend>
          <div className="bo-chips bo-chips--botones">
            {ZONAS.map((z) => (
              <button key={z} type="button" aria-pressed={zona === z} onClick={() => setZona(z)}>
                {z}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="bo-fila">
          <span className="bo-etiqueta">Personas</span>
          <QuantityStepper value={personas} onChange={setPersonas} min={1} max={10} label="Personas" />
        </div>
        <label className="bo-campo">
          <span className="bo-etiqueta">Nombre</span>
          <input value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} autoComplete="name" />
        </label>
        <label className="bo-campo">
          <span className="bo-etiqueta">Teléfono</span>
          <input type="tel" value={datos.tel} onChange={(e) => setDatos({ ...datos, tel: e.target.value })} autoComplete="tel" />
        </label>
        {error && (
          <p className="bo-error" role="alert">
            {error}
          </p>
        )}
        <button type="button" className="bo-boton bo-boton--rojo" onClick={reservar}>
          Reservar {personas} {personas === 1 ? "plaza" : "plazas"}
        </button>
      </div>
    </main>
  );
}

function Pedir() {
  const carrito = useCart("trama:bocado:pedido");
  const [pagar, setPagar] = useState(false);
  return (
    <main className="bo-pag">
      <Cab etiqueta="A domicilio y para llevar" titulo="Pedir online" texto="Reparto en bici por el centro; gratis desde 30 €." color="#2d3e2b" />
      {pagar ? (
        <CheckoutFlow lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} delivery="both" shippingCost={2.5} freeShippingFrom={30} orderPrefix="BO" shopHref={bocadoHref("pedir")} note="Pedido de demostración: no se cobra ni se reparte nada." variant="minimal" className="bo-margen" />
      ) : (
        <div className="bo-pedir">
          <div>
            {CARTA.map((s) => (
              <section key={s.id} className="bo-seccion bo-seccion--pedir">
                <h2>{s.n}</h2>
                <ul>
                  {s.platos.map((p) => {
                    const linea = carrito.lines.find((l) => l.id === p.id);
                    return (
                      <li key={p.id}>
                        <div>
                          <b>{p.n}</b>
                          <span>{p.d}</span>
                        </div>
                        <i>{eur(p.precio)}</i>
                        {linea ? (
                          <QuantityStepper value={linea.qty} onChange={(q) => carrito.setQty(p.id, q)} min={0} max={20} label={p.n} size="sm" />
                        ) : (
                          <button type="button" className="bo-anadir" onClick={() => carrito.add({ id: p.id, title: p.n, price: p.precio, image: s.img })}>
                            Añadir
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
          <aside className="bo-cesta" aria-live="polite">
            <p className="bo-etiqueta">Tu pedido</p>
            {carrito.lines.length ? (
              <ul>
                {carrito.lines.map((l) => (
                  <li key={l.id}>
                    <span>
                      {l.qty} × {l.title}
                    </span>
                    <i>{eur(l.qty * l.price)}</i>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aún vacío. La Bocado nunca falla.</p>
            )}
            <b>{eur(carrito.subtotal)}</b>
            <button type="button" className="bo-boton bo-boton--rojo" disabled={!carrito.lines.length} onClick={() => setPagar(true)}>
              Pagar el pedido
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}

const IMPORTES = [25, 50, 75, 100];

function TarjetaRegalo() {
  const [importe, setImporte] = useState(50);
  const [datos, setDatos] = useState({ para: "", de: "", correo: "", mensaje: "" });
  const [error, setError] = useState("");
  const [codigo, setCodigo] = useState("");
  const comprar = () => {
    setError("");
    if (datos.para.trim().length < 2) return setError("¿Para quién es?");
    if (!/^\S+@\S+\.\S+$/.test(datos.correo)) return setError("Revisa el correo al que la enviamos.");
    setCodigo(`REGALO-${String(Date.now()).slice(-6)}`);
  };
  return (
    <main className="bo-pag">
      <Cab etiqueta="Tarjeta regalo" titulo="Regala una cena" texto="Vale para todo: comedor, barra, programación y pedidos." color="#6b1d24" />
      <div className="bo-regalo">
        <div className="bo-regalo__tarjeta" aria-label="Vista previa de la tarjeta">
          <span className="bo-logo">Bocado</span>
          <b>{eur(importe)}</b>
          <p className="bo-cursiva">{datos.mensaje || "Todas las razones son buenas."}</p>
          <small>
            Para {datos.para || "…"}
            {datos.de ? ` · de ${datos.de}` : ""}
          </small>
        </div>
        {codigo ? (
          <div className="bo-regalo__hecho">
            <h2>Enviada</h2>
            <p>
              La tarjeta <b>{codigo}</b> llega a {datos.correo} en unos minutos.
            </p>
          </div>
        ) : (
          <div className="bo-regalo__form">
            <div className="bo-chips bo-chips--botones" role="group" aria-label="Importe">
              {IMPORTES.map((x) => (
                <button key={x} type="button" aria-pressed={importe === x} onClick={() => setImporte(x)}>
                  {eur(x)}
                </button>
              ))}
            </div>
            {(
              [
                ["para", "Para"],
                ["de", "De parte de"],
                ["correo", "Correo de quien la recibe"],
                ["mensaje", "Mensaje"],
              ] as const
            ).map(([k, t]) => (
              <label key={k} className="bo-campo">
                <span className="bo-etiqueta">{t}</span>
                <input value={datos[k]} type={k === "correo" ? "email" : "text"} maxLength={k === "mensaje" ? 80 : 60} onChange={(e) => setDatos({ ...datos, [k]: e.target.value })} />
              </label>
            ))}
            {error && (
              <p className="bo-error" role="alert">
                {error}
              </p>
            )}
            <button type="button" className="bo-boton bo-boton--rojo" onClick={comprar}>
              Comprar por {eur(importe)}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="bo-pag">
      <Cab titulo="Esta mesa no existe" texto="Pero hay otras libres." />
      <div className="bo-pag__fin">
        <a href={bocadoHref()} className="bo-boton bo-boton--rojo">
          Volver al inicio
        </a>
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const P = { "": Portada, carta: Carta, restaurante: Restaurante, programacion: Programacion, salones: Salones, reservar: Reservar, pedir: Pedir, "tarjeta-regalo": TarjetaRegalo }[ruta[0] ?? ""];
  return P ? <P /> : <NoHay />;
}

