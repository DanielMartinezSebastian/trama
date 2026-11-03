"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/ui/CartDrawer";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import OptionPicker from "@/components/ui/OptionPicker";
import Reveal from "@/components/ui/Reveal";
import { useCart } from "@/lib/commerce/cart";
import Coche from "./Coche";
import { BOUTIQUE, COLORES, EXTRAS, FOTOS, HISTORIA, INTERIORES, LLANTAS, MODELO, NOTICIAS } from "./data";
import { vencejoHref } from "./enlaces";
import "./vencejo.css";

/*
 * Vencejo (docs/59), a partir de Spyker: deportivos hechos a mano desde un taller de aviones. Portada en penumbra azulada con
 * el titular en una condensada en mayúsculas (Futura PT Condensed 500 → Antonio 600) y un botón rectangular blanco; después,
 * blanco con detalles del coche dispersos, un lema en latín, la herencia en blanco y negro y la boutique. Flujos: configurador
 * con precio al momento y petición de presupuesto, y tienda con bolsa y pedido.
 */

const NAV: [string, string][] = [
  ["cefiro", "Céfiro XXV"],
  ["configurador", "Configurador"],
  ["herencia", "Herencia"],
  ["boutique", "Boutique"],
  ["noticias", "Noticias"],
  ["contacto", "Contacto"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;

type BolsaCtx = { carrito: ReturnType<typeof useCart>; abrir: () => void };
const Bolsa = createContext<BolsaCtx | null>(null);
const useBolsa = () => useContext(Bolsa)!;

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  const carrito = useCart("trama:vencejo:bolsa");
  const [abierta, setAbierta] = useState(false);
  return (
    <Bolsa.Provider value={{ carrito, abrir: () => setAbierta(true) }}>
      <div className={`ve ${ruta ? "" : "ve--inicio"}`} id="top">
        <header className="ve-head">
          <FullscreenMenu
            trigger="burger"
            layout="full"
            reveal="slide"
            size="md"
            className="ve-menu"
            brand="Vencejo"
            openLabel="Menú"
            closeLabel="Cerrar"
            note="Valladolid · desde 1911"
            links={[{ label: "Inicio", href: vencejoHref() }, ...NAV.map(([p, l]) => ({ label: l, href: vencejoHref(p) }))]}
            footer={[
              { label: "info@vencejo.example", href: "#" },
              { label: "prensa@vencejo.example", href: "#" },
            ]}
          />
          <a href={vencejoHref()} className="ve-logo">
            Vencejo
          </a>
          <button type="button" className="ve-bolsa" onClick={() => setAbierta(true)} aria-label={`Bolsa, ${carrito.count} ${carrito.count === 1 ? "artículo" : "artículos"}`}>
            <svg viewBox="0 0 20 20" aria-hidden>
              <path d="M4 7h12l-1 11H5L4 7Z M7 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            {carrito.count > 0 && <span>{carrito.count}</span>}
          </button>
        </header>
        {children}
        <CartDrawer open={abierta} onOpenChange={setAbierta} lines={carrito.lines} onQty={carrito.setQty} onRemove={carrito.remove} title="Bolsa" checkoutHref={vencejoHref("pedido")} checkoutLabel="Tramitar el pedido" continueHref={vencejoHref("boutique")} emptyText="La bolsa está vacía." />
        <footer className="ve-pie">
          <div className="ve-pie__cols">
            <nav aria-label="Pie">
              {NAV.map(([p, l]) => (
                <a key={p} href={vencejoHref(p)}>
                  {l}
                </a>
              ))}
            </nav>
            <div>
              <b>Vencejo Automóviles</b>
              <span>Calle de la Hélice 4, 47012 Valladolid</span>
              <span>983 000 000</span>
            </div>
          </div>
          <p className="ve-pie__lema">Ni un tornillo de más</p>
          <small>Vencejo · fabricante de demostración de Trama. Modelo, historia y precios inventados.</small>
        </footer>
      </div>
    </Bolsa.Provider>
  );
}

function Portada() {
  return (
    <main>
      <section className="ve-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.portada} alt="El Céfiro XXV en el hangar" />
        <div>
          <p className="ve-sobre">El comienzo de la serie XXV</p>
          <h1>El nuevo capítulo de Vencejo</h1>
          <a href={vencejoHref("cefiro")} className="ve-boton ve-boton--blanco">
            Descubre el Céfiro XXV
          </a>
        </div>
      </section>

      <section className="ve-pasion">
        <h2>Hecho a mano</h2>
        <figure className="ve-pasion__a">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.tapon} alt="Tapón de combustible de aluminio" loading="lazy" />
          <figcaption>El tapón de combustible se tornea en una pieza de aluminio y lleva grabado el número de la unidad.</figcaption>
        </figure>
        <figure className="ve-pasion__b">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.rueda} alt="Llanta de radios" loading="lazy" />
        </figure>
        <figure className="ve-pasion__c">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.piloto} alt="Piloto trasero encendido" loading="lazy" />
          <figcaption>Los pilotos traseros repiten el anillo de las hélices de 1911.</figcaption>
        </figure>
      </section>

      <section className="ve-lema">
        <Reveal kind="slide" as="p">
          Ni un tornillo de más
        </Reveal>
        <span>El lema del taller desde 1922</span>
      </section>

      <section className="ve-herencia">
        <header>
          <h2>La herencia Vencejo</h2>
          <a href={vencejoHref("herencia")} className="ve-boton">
            Ver la historia
          </a>
        </header>
        <div>
          {HISTORIA.filter((h) => h.img).map((h) => (
            <figure key={h.anio}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={h.img} alt="" loading="lazy" />
              <figcaption>
                <b>{h.anio}</b> {h.t}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="ve-boutique">
        <div>
          <h2>Boutique Vencejo</h2>
          <p>Artesanía, atención al detalle y aprecio por la calidad. Los mismos valores del coche, en objetos para el día a día.</p>
          <a href={vencejoHref("boutique")} className="ve-boton ve-boton--negro">
            Visita la boutique
          </a>
        </div>
        <a href={vencejoHref(`boutique/${BOUTIQUE[0].id}`)} className="ve-producto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BOUTIQUE[0].img} alt="" loading="lazy" />
          <b>{BOUTIQUE[0].n}</b>
          <span>{eur(BOUTIQUE[0].precio)}</span>
        </a>
      </section>

      <section className="ve-noticias">
        <h2>Noticias</h2>
        <div>
          {NOTICIAS.map((n) => (
            <a key={n.id} href={vencejoHref(`noticias/${n.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.img} alt="" loading="lazy" />
              <small>{n.f}</small>
              <b>{n.t}</b>
            </a>
          ))}
        </div>
      </section>

      <section className="ve-registro">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.interior} alt="" loading="lazy" />
        <div>
          <h2>Novedades solo para quien se registra</h2>
          <p>Un círculo pequeño de aficionados recibe las novedades antes que nadie.</p>
          <ContactForm title="" subtitle="" fields="email" layout="inline" submitLabel="Suscribirme" successTitle="Dentro" successMessage="Te escribiremos pocas veces y con motivo." variant="minimal" />
        </div>
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto, sobre }: { titulo: string; texto?: string; sobre?: string }) => (
  <header className="ve-cab">
    {sobre && <p className="ve-sobre">{sobre}</p>}
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function Cefiro() {
  return (
    <main className="ve-pag">
      <Cab sobre="Serie XXV" titulo={MODELO.n} texto={MODELO.lema} />
      <Coche color={COLORES[0].hex!} interior={INTERIORES[0].hex!} llanta="radios" className="ve-coche" />
      <div className="ve-datos">
        {MODELO.datos.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </div>
      <div className="ve-galeria">
        {[FOTOS.interior, FOTOS.tapon, FOTOS.piloto].map((s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s} src={s} alt="" loading="lazy" />
        ))}
      </div>
      <div className="ve-centro">
        <p>Desde {eur(MODELO.base)}, impuestos aparte.</p>
        <a href={vencejoHref("configurador")} className="ve-boton ve-boton--negro">
          Configura el tuyo
        </a>
      </div>
    </main>
  );
}

function Configurador() {
  const [color, setColor] = useState(COLORES[0].id);
  const [interior, setInterior] = useState(INTERIORES[0].id);
  const [llanta, setLlanta] = useState(LLANTAS[0].id);
  const [extras, setExtras] = useState<string[]>([]);
  const [enviado, setEnviado] = useState("");
  const c = COLORES.find((x) => x.id === color)!;
  const it = INTERIORES.find((x) => x.id === interior)!;
  const ll = LLANTAS.find((x) => x.id === llanta)!;
  const total = MODELO.base + c.precio + it.precio + ll.precio + EXTRAS.filter((x) => extras.includes(x.id)).reduce((s, x) => s + x.precio, 0);
  const etiqueta = (o: { n: string; precio: number }) => `${o.n}${o.precio ? ` · +${eur(o.precio)}` : ""}`;
  return (
    <main className="ve-pag">
      <Cab sobre="Configurador" titulo="Tu Céfiro XXV" />
      <div className="ve-config">
        <div className="ve-config__vista">
          <Coche color={c.hex!} interior={it.hex!} llanta={llanta} className="ve-coche" />
          <p aria-live="polite">
            {c.n} · {it.n} · llantas {ll.n.toLowerCase()}
          </p>
        </div>
        <div className="ve-config__opciones">
          <OptionPicker label="Carrocería" kind="swatch" options={COLORES.map((o) => ({ value: o.id, label: etiqueta(o), color: o.hex }))} value={color} onChange={setColor} showValue />
          <OptionPicker label="Interior" kind="swatch" options={INTERIORES.map((o) => ({ value: o.id, label: etiqueta(o), color: o.hex }))} value={interior} onChange={setInterior} showValue />
          <OptionPicker label="Llantas" kind="chip" options={LLANTAS.map((o) => ({ value: o.id, label: etiqueta(o) }))} value={llanta} onChange={setLlanta} />
          <fieldset className="ve-extras">
            <legend>Extras</legend>
            {EXTRAS.map((x) => (
              <label key={x.id}>
                <input type="checkbox" checked={extras.includes(x.id)} onChange={() => setExtras(extras.includes(x.id) ? extras.filter((e) => e !== x.id) : [...extras, x.id])} />
                <span>{x.n}</span>
                <i>+{eur(x.precio)}</i>
              </label>
            ))}
          </fieldset>
          <div className="ve-total" aria-live="polite">
            <span>Total estimado</span>
            <b>{eur(total)}</b>
          </div>
          {enviado ? (
            <p className="ve-hecho">
              Recibido. Referencia <b>{enviado}</b>: el equipo comercial te llama en 48 horas.
            </p>
          ) : (
            <ContactForm title="" subtitle="" fields="name,email" submitLabel="Pedir presupuesto" variant="minimal" onSubmit={() => setEnviado(`VJ-${String(Date.now()).slice(-5)}`)} />
          )}
        </div>
      </div>
    </main>
  );
}

function Herencia() {
  return (
    <main className="ve-pag">
      <Cab sobre="1911–2026" titulo="La herencia Vencejo" texto="De las hélices de madera a un coupé de veinticinco unidades." />
      <ol className="ve-linea">
        {HISTORIA.map((h) => (
          <li key={h.anio}>
            <b>{h.anio}</b>
            <div>
              <h2>{h.t}</h2>
              <p>{h.d}</p>
            </div>
            {h.img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={h.img} alt="" loading="lazy" />
            )}
          </li>
        ))}
      </ol>
    </main>
  );
}

function Boutique() {
  return (
    <main className="ve-pag">
      <Cab sobre="Boutique" titulo="Objetos Vencejo" texto="Hechos en talleres de Castilla con los materiales del coche." />
      <div className="ve-tienda">
        {BOUTIQUE.map((a) => (
          <a key={a.id} href={vencejoHref(`boutique/${a.id}`)} className="ve-producto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.img} alt="" loading="lazy" />
            <b>{a.n}</b>
            <span>{eur(a.precio)}</span>
          </a>
        ))}
      </div>
    </main>
  );
}

function Articulo({ id }: { id: string }) {
  const a = BOUTIQUE.find((x) => x.id === id);
  const { carrito, abrir } = useBolsa();
  if (!a) return <NoHay />;
  return (
    <main className="ve-pag">
      <div className="ve-ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.img} alt={a.n} />
        <div>
          <p className="ve-sobre">Boutique</p>
          <h1>{a.n}</h1>
          <b>{eur(a.precio)}</b>
          <p>{a.d}</p>
          <button
            type="button"
            className="ve-boton ve-boton--negro"
            onClick={() => {
              carrito.add({ id: a.id, title: a.n, price: a.precio, image: a.img });
              abrir();
            }}
          >
            Añadir a la bolsa
          </button>
          <a href={vencejoHref("boutique")} className="ve-volver">
            ← Volver a la boutique
          </a>
        </div>
      </div>
    </main>
  );
}

function Pedido() {
  const { carrito } = useBolsa();
  return (
    <main className="ve-pag">
      <Cab sobre="Boutique" titulo="Tu pedido" />
      <CheckoutFlow lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} delivery="both" shippingCost={12} freeShippingFrom={300} orderPrefix="VJ" shopHref={vencejoHref("boutique")} pickups={[{ id: "valladolid", name: "Taller de Valladolid", address: "Calle de la Hélice 4" }]} note="Pedido de demostración: no se cobra ni se envía nada." variant="minimal" className="ve-margen" />
    </main>
  );
}

function Noticias() {
  return (
    <main className="ve-pag">
      <Cab sobre="Socios y noticias" titulo="Noticias" />
      <div className="ve-noticias ve-noticias--pag">
        <div>
          {NOTICIAS.map((n) => (
            <a key={n.id} href={vencejoHref(`noticias/${n.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.img} alt="" loading="lazy" />
              <small>{n.f}</small>
              <b>{n.t}</b>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

function Noticia({ id }: { id: string }) {
  const n = NOTICIAS.find((x) => x.id === id);
  if (!n) return <NoHay />;
  return (
    <main className="ve-pag ve-articulo">
      <Cab sobre={n.f} titulo={n.t} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={n.img} alt="" />
      <p>{n.texto}</p>
      <a href={vencejoHref("noticias")} className="ve-volver">
        ← Todas las noticias
      </a>
    </main>
  );
}

function Contacto() {
  return (
    <main className="ve-pag">
      <Cab sobre="Contacto" titulo="Visita el taller" texto="Con cita, de lunes a viernes. Te enseñamos un chasis desnudo y uno terminado." />
      <div className="ve-config">
        <dl className="ve-datos ve-datos--contacto">
          {[
            ["Taller", "Calle de la Hélice 4, 47012 Valladolid"],
            ["Teléfono", "983 000 000"],
            ["Ventas", "info@vencejo.example"],
            ["Prensa", "prensa@vencejo.example"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <ContactForm title="" subtitle="" messagePlaceholder="¿Qué te gustaría ver o preguntar?" submitLabel="Pedir cita" successTitle="Gracias" successMessage="Te proponemos día en 48 horas." variant="minimal" />
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="ve-pag">
      <Cab titulo="Fuera de la pista" texto="Esta página no existe." />
      <div className="ve-centro">
        <a href={vencejoHref()} className="ve-boton ve-boton--negro">
          Volver al inicio
        </a>
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "boutique" && b) return <Articulo id={b} />;
  if (a === "noticias" && b) return <Noticia id={b} />;
  const P = { cefiro: Cefiro, configurador: Configurador, herencia: Herencia, boutique: Boutique, pedido: Pedido, noticias: Noticias, contacto: Contacto }[a];
  return P ? <P /> : <NoHay />;
}
