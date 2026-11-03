"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Reveal from "@/components/ui/Reveal";
import { useCart } from "@/lib/commerce/cart";
import { ACENTOS, ATRACCIONES, EVOLUCION, FOTOS, IDIOMAS, LICENCIAS, PANGRAMA, PAQUETES, PESOS, USOS } from "./data";
import { turiaHref } from "./enlaces";
import "./turia.css";

/*
 * Turia Grotesk (docs/60), a partir de PP Neue Montreal: una tipografía presentada como la guía oficial de viaje de su
 * ciudad. Bloques de color pleno (rojo anaranjado, negro, crema) que se suceden, el nombre de la letra a toda la anchura,
 * postales y billetes sueltos, la carta de pesos en franjas de colores con el nombre girado, glifos gigantes recortados y
 * cintas diagonales con los acentos. Flujos: probador de la letra, licencias con carrito y pago digital, y prueba gratis.
 */

const NAV: [string, string][] = [
  ["probar", "Probar"],
  ["pesos", "Pesos"],
  ["en-uso", "En uso"],
  ["licencias", "Licencias"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;

/** el sello girado de la guía: el texto en círculo */
function Sello() {
  return (
    <svg className="tu-sello" viewBox="0 0 120 120" aria-hidden>
      <defs>
        <path id="tu-circulo" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <text>
        <textPath href="#tu-circulo">TURIA GROTESK · GUÍA OFICIAL · VALÈNCIA · </textPath>
      </text>
      <circle cx="60" cy="60" r="8" />
    </svg>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  const carrito = useCart("trama:turia:licencias");
  const links = [{ label: "Portada", href: turiaHref() }, ...NAV.map(([p, l]) => ({ label: l, href: turiaHref(p) }))];
  return (
    <div className={`tu ${ruta ? "" : "tu--inicio"}`} id="top">
      <header className="tu-head">
        <a href={turiaHref()} className="tu-head__marca" aria-label="Turia Grotesk, portada">
          TG
        </a>
        <nav aria-label="Principal" className="tu-head__nav">
          {NAV.map(([p, l]) => (
            <a key={p} href={turiaHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <a href={turiaHref("licencias/pedido")} className="tu-head__compra">
          Conseguir Turia{carrito.count ? ` · ${carrito.count}` : ""}
        </a>
        <FullscreenMenu trigger="pill" layout="island" reveal="slide" tone="acc" size="md" brand="Turia Grotesk" openLabel="Menú" closeLabel="Cerrar" note="Tipos Turia · València" links={links} className="tu-menu" />
      </header>
      {children}
      <Pie />
    </div>
  );
}

function Pie() {
  return (
    <footer className="tu-pie">
      <Sello />
      <p className="tu-pie__t">De un punto a otro, con la misma letra.</p>
      <div className="tu-pie__cols">
        <div>
          <b>Turia Grotesk</b>
          {NAV.map(([p, l]) => (
            <a key={p} href={turiaHref(p)}>
              {l}
            </a>
          ))}
        </div>
        <div>
          <b>Tipos Turia</b>
          <span>Calle de Baja 12, el Carmen</span>
          <span>46003 València</span>
          <a href="mailto:hola@tipos-turia.example">hola@tipos-turia.example</a>
        </div>
        <p>Tipos Turia · fundición de demostración de Trama. La letra que se ve es Inter Tight, de libre uso; precios y licencias inventados.</p>
      </div>
    </footer>
  );
}

function Portada() {
  return (
    <main>
      <section className="tu-hero">
        <div className="tu-hero__top">
          <p className="tu-hero__guia">
            Guía oficial
            <br />
            de viaje
          </p>
          <p className="tu-hero__lema">Todo lo que hay que saber para disfrutar Turia Grotesk a fondo.</p>
          <Sello />
        </div>
        <h1 className="tu-hero__t">Turia Grotesk</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tu-hero__foto" src={FOTOS.portada} alt="Una calle del Carmen con un tranvía amarillo" />
      </section>

      <section className="tu-nueva">
        <p className="tu-nueva__t">
          <span>Fuera</span> <em>lo viejo,</em>
          <br />
          entra <em>la nueva.</em>
        </p>
        <div className="tu-postales">
          {[FOTOS.postal1, FOTOS.postal2, FOTOS.postal3].map((f, k) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={f} src={f} alt="" loading="lazy" style={{ "--k": k } as CSSProperties} />
          ))}
          <p className="tu-billete">
            Billete
            <br />
            <b>VLC → TG</b>
            <small>Válido para diez pesos</small>
          </p>
        </div>
      </section>

      <section className="tu-historia">
        <div>
          <p className="tu-sobre">Historia</p>
          <p>
            Turia Grotesk es una grotesca neutra con carácter de ciudad: nació dibujando los letreros del mercado y la
            señalética del metro, y se ha rehecho tres veces. Funciona en diez pesos, del Hairline al Black, en textos
            largos y en carteles de ocho metros.
          </p>
        </div>
        <ol className="tu-evolucion">
          {EVOLUCION.map(([a, t]) => (
            <li key={a}>
              <b>{a}</b>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="tu-universal">
        <p className="tu-universal__t">
          La
          <br />
          letra
          <br />
          universal.
        </p>
        <div className="tu-efimera" aria-hidden>
          {["22", "14", "L3", "VLC", "Nº 7"].map((t, k) => (
            <span key={t} style={{ "--k": k } as CSSProperties}>
              {t}
            </span>
          ))}
        </div>
      </section>

      <CartaPesos />

      <section className="tu-glifos" aria-label="Glifos">
        {[
          ["a", "Display · Extrabold"],
          ["g", "Display · Black"],
          ["h", "Texto · Medium"],
        ].map(([g, l], k) => (
          <figure key={g} style={{ "--w": [800, 900, 500][k] } as CSSProperties}>
            <span aria-hidden>{g}</span>
            <figcaption>{l}</figcaption>
          </figure>
        ))}
      </section>

      <section className="tu-atracciones">
        <p className="tu-atracciones__t">
          Visitas
          <br />
          obligadas
        </p>
        <div>
          {ATRACCIONES.map((a, k) => (
            <Reveal key={a.t} as="article" kind="slide" direction="up" delay={k * 0.08}>
              <h2>{a.t}</h2>
              <p>{a.texto}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="tu-mundo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.banderas} alt="Banderas de muchos países en el puerto" loading="lazy" />
        <p className="tu-mundo__t">¡Ya se usa en medio mundo!</p>
        <ul aria-label="Idiomas">
          {IDIOMAS.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <section className="tu-cintas" aria-label="Acentos y diacríticos">
        <p className="tu-cintas__t">Cada tilde, en su sitio</p>
        {ACENTOS.map((a, k) => (
          <p key={a} className="tu-cinta" style={{ "--k": k, "--c": PESOS[(k * 3 + 2) % PESOS.length].c } as CSSProperties} aria-label={a}>
            <span aria-hidden>{a.repeat(4)}</span>
          </p>
        ))}
      </section>

      <section className="tu-cierre">
        <p className="tu-cierre__t">Una letra para todo.</p>
        <p>Pruébala gratis en tus maquetas durante treinta días, o compra la licencia que necesites.</p>
        <div>
          <a href={turiaHref("probar")} className="tu-boton tu-boton--oscuro">
            Probar
          </a>
          <a href={turiaHref("licencias")} className="tu-boton">
            Licencias
          </a>
        </div>
      </section>
    </main>
  );
}

/** la carta de pesos: una franja de color por peso, con su nombre girado y escrito en ese peso */
function CartaPesos() {
  return (
    <section className="tu-carta" aria-label="Carta de pesos">
      <p className="tu-carta__t">
        Diez
        <br />
        pesos
      </p>
      <ol>
        {PESOS.map((p, k) => (
          <li key={p.n} style={{ "--c": p.c, "--w": p.w, "--k": k } as CSSProperties}>
            <span>{p.n}</span>
            <small>{String(k + 1).padStart(2, "0")}</small>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Cab({ sobre, titulo, texto, children }: { sobre: string; titulo: string; texto?: string; children?: ReactNode }) {
  return (
    <header className="tu-cab">
      <p className="tu-sobre">{sobre}</p>
      <h1>{titulo}</h1>
      {texto && <p className="tu-cab__txt">{texto}</p>}
      {children}
    </header>
  );
}

function Probar() {
  const [texto, setTexto] = useState("Fuera lo viejo, entra la nueva");
  const [peso, setPeso] = useState(700);
  const [tam, setTam] = useState(96);
  const [cursiva, setCursiva] = useState(false);
  const [mayus, setMayus] = useState(false);
  const nombre = [...PESOS].reverse().find((p) => p.w <= peso)?.n ?? "Hairline";
  return (
    <main className="tu-pag">
      <Cab sobre="Probar" titulo="Escribe con ella" texto="Cambia el texto, el peso y el tamaño. Lo que escribes no sale de tu navegador." />
      <div className="tu-probador">
        <div className="tu-probador__mandos">
          <label>
            <span>Texto</span>
            <input value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={120} />
          </label>
          <label>
            <span>
              Peso <b>{nombre} · {peso}</b>
            </span>
            <input type="range" min={100} max={900} step={50} value={peso} onChange={(e) => setPeso(Number(e.target.value))} />
          </label>
          <label>
            <span>
              Tamaño <b>{tam} px</b>
            </span>
            <input type="range" min={16} max={200} step={4} value={tam} onChange={(e) => setTam(Number(e.target.value))} />
          </label>
          <div className="tu-probador__botones">
            <button type="button" aria-pressed={cursiva} onClick={() => setCursiva((v) => !v)}>
              Cursiva
            </button>
            <button type="button" aria-pressed={mayus} onClick={() => setMayus((v) => !v)}>
              Mayúsculas
            </button>
          </div>
        </div>
        <p className="tu-probador__muestra" style={{ fontWeight: peso, fontSize: tam, fontStyle: cursiva ? "italic" : "normal", textTransform: mayus ? "uppercase" : "none" }} aria-live="polite">
          {texto || " "}
        </p>
      </div>
      <section className="tu-muestras" aria-label="Muestras de texto">
        {[300, 500, 700].map((w) => (
          <p key={w} style={{ fontWeight: w }}>
            <small>{PESOS.find((p) => p.w === w)!.n}</small>
            {PANGRAMA}
          </p>
        ))}
      </section>
      <section className="tu-prueba">
        <ContactForm title="Prueba gratis treinta días" subtitle="Te mandamos la familia completa para maquetas y presentaciones, sin uso comercial." fields="email" layout="inline" submitLabel="Quiero la prueba" successMessage="Hecho: te llega el enlace de descarga en unos minutos." variant="minimal" />
      </section>
    </main>
  );
}

function Pesos() {
  return (
    <main className="tu-pag">
      <Cab sobre="Pesos" titulo="Del Hairline al Black" texto="Diez pesos con sus cursivas, y una versión variable que los recorre todos." />
      <ul className="tu-pesos">
        {PESOS.map((p) => (
          <li key={p.n} style={{ "--c": p.c, fontWeight: p.w } as CSSProperties}>
            <span className="tu-pesos__muestra">Turia Grotesk {p.n}</span>
            <small>{p.w}</small>
          </li>
        ))}
      </ul>
      <CartaPesos />
    </main>
  );
}

function EnUso() {
  return (
    <main className="tu-pag">
      <Cab sobre="En uso" titulo="Ya está en la calle" texto="Algunos sitios donde se lee Turia Grotesk cada día." />
      <ul className="tu-usos">
        {USOS.map((u, k) => (
          <Reveal key={u.t} as="li" kind="fade" delay={(k % 3) * 0.06}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u.img} alt="" loading="lazy" />
            <b>{u.t}</b>
            <small>{u.donde}</small>
          </Reveal>
        ))}
      </ul>
    </main>
  );
}

function Licencias() {
  const carrito = useCart("trama:turia:licencias");
  const [tipo, setTipo] = useState(LICENCIAS[0].id);
  const [tramo, setTramo] = useState(0);
  const [paquete, setPaquete] = useState(PAQUETES[0].id);
  const lic = LICENCIAS.find((l) => l.id === tipo)!;
  const paq = PAQUETES.find((p) => p.id === paquete)!;
  const t = Math.min(tramo, lic.precios.length - 1);
  const precio = Math.round(lic.precios[t][1] * paq.factor);
  const [añadida, setAñadida] = useState("");
  return (
    <main className="tu-pag">
      <Cab sobre="Licencias" titulo="La licencia que necesitas" texto="Paga por lo que usas: escritorio, web o app. Puedes ampliarla cuando crezcas." />
      <div className="tu-licencias">
        <fieldset>
          <legend>Uso</legend>
          {LICENCIAS.map((l) => (
            <button key={l.id} type="button" aria-pressed={tipo === l.id} onClick={() => { setTipo(l.id); setTramo(0); }}>
              <b>{l.n}</b>
              <small>{l.para}</small>
            </button>
          ))}
        </fieldset>
        <fieldset>
          <legend>Tamaño</legend>
          {lic.precios.map(([n], k) => (
            <button key={n} type="button" aria-pressed={t === k} onClick={() => setTramo(k)}>
              <b>{n}</b>
            </button>
          ))}
        </fieldset>
        <fieldset>
          <legend>Pesos</legend>
          {PAQUETES.map((p) => (
            <button key={p.id} type="button" aria-pressed={paquete === p.id} onClick={() => setPaquete(p.id)}>
              <b>{p.n}</b>
              <small>{p.texto}</small>
            </button>
          ))}
        </fieldset>
        <aside className="tu-licencias__total" aria-live="polite">
          <p className="tu-sobre">Tu licencia</p>
          <p>
            {lic.n} · {lic.precios[t][0]} · {paq.n}
          </p>
          <p className="tu-licencias__precio">{eur(precio)}</p>
          <button
            type="button"
            className="tu-boton tu-boton--oscuro"
            onClick={() => {
              carrito.add({ id: `${lic.id}-${t}-${paq.id}`, title: `Turia Grotesk · ${lic.n}`, price: precio, meta: `${lic.precios[t][0]} · ${paq.n}` });
              setAñadida(`${lic.n}, ${lic.precios[t][0]}`);
            }}
          >
            Añadir al pedido
          </button>
          {añadida && (
            <p role="status" className="tu-licencias__ok">
              Añadida: {añadida}. <a href={turiaHref("licencias/pedido")}>Ir al pedido ({carrito.count})</a>
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}

function Pedido() {
  const carrito = useCart("trama:turia:licencias");
  return (
    <main className="tu-pag">
      <Cab sobre="Pedido" titulo="Tu pedido" texto="Las licencias se entregan al momento por correo, con los archivos y la factura." />
      <CheckoutFlow lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} delivery="digital" orderPrefix="TG" shopHref={turiaHref("licencias")} note="Pedido de demostración: no se cobra ni se envía nada. Prueba con la tarjeta 4242 4242 4242 4242." variant="minimal" className="tu-checkout" />
    </main>
  );
}

function NoHay() {
  return (
    <main className="tu-pag">
      <Cab sobre="404" titulo="Esta calle no sale en la guía" texto="Vuelve a la portada o prueba la letra." />
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "licencias" && b === "pedido") return <Pedido />;
  const P = { probar: Probar, pesos: Pesos, "en-uso": EnUso, licencias: Licencias }[a];
  return P ? <P /> : <NoHay />;
}
