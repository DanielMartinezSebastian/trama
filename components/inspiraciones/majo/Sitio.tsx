"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Reveal from "@/components/ui/Reveal";
import { ACCESORIOS, COLORES, FOTOS, NOTICIAS, PRECIO_BASE, PUBLICOS, RASGOS, SEÑAL, USOS } from "./data";
import { majoHref } from "./enlaces";
import "./majo.css";

/*
 * Majo (docs/60), a partir de Fauna Robotics: un robot doméstico amable. Crema cálido, una grotesca de 500 con los
 * titulares centrados, una píldora naranja como única llamada, fotos en tarjetas muy redondeadas y figuras hechas de
 * formas geométricas de colores (círculos, arcos, triángulos) que hacen de personas y robots. Flujos: configurar el robot
 * (color y accesorios) y reservarlo con una señal (pago digital).
 */

const NAV: [string, string][] = [
  ["producto", "Producto"],
  ["empresa", "Empresa"],
  ["noticias", "Noticias"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;

/** una figura hecha de formas: cabeza, cuerpo y brazos, en los colores dados */
function Figura({ c = ["#e8b33c", "#2f8f86", "#c4553f"], forma = 0 }: { c?: string[]; forma?: number }) {
  return (
    <svg className="mj-figura" viewBox="0 0 100 140" aria-hidden>
      {forma % 3 === 0 && <circle cx="50" cy="26" r="20" fill={c[0]} />}
      {forma % 3 === 1 && <rect x="30" y="6" width="40" height="40" fill={c[0]} />}
      {forma % 3 === 2 && <polygon points="50,4 72,44 28,44" fill={c[0]} />}
      <path d="M18 140 V86 A32 32 0 0 1 82 86 V140 Z" fill={c[1]} />
      <rect x="6" y="64" width="14" height="40" rx="7" fill={c[2]} />
      <rect x="80" y="64" width="14" height="40" rx="7" fill={c[2]} />
    </svg>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  const links = [{ label: "Inicio", href: majoHref() }, ...NAV.map(([p, l]) => ({ label: l, href: majoHref(p) })), { label: "Reservar un Majo", href: majoHref("reservar") }];
  return (
    <div className="mj" id="top">
      <header className="mj-head">
        <a href={majoHref()} className="mj-head__marca" aria-label="Majo, inicio">
          <svg viewBox="0 0 30 30" aria-hidden>
            <circle cx="9" cy="9" r="7" fill="#e8b33c" />
            <rect x="16" y="2" width="12" height="12" fill="#2f8f86" />
            <path d="M2 28 A13 13 0 0 1 28 28 Z" fill="#c4553f" />
          </svg>
          majo
          <br />
          robótica
        </a>
        <nav aria-label="Principal" className="mj-head__nav">
          {NAV.map(([p, l]) => (
            <a key={p} href={majoHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
          <a href={majoHref("reservar")} className="mj-pildora">
            Reservar un Majo
          </a>
        </nav>
        <FullscreenMenu trigger="ring" layout="sheet" reveal="slide" size="md" linkHover="slide" brand="Majo" openLabel="Menú" closeLabel="Cerrar" note="Diseñado en Barcelona, montado en Terrassa" links={links} className="mj-menu" />
      </header>
      {children}
      <Pie />
    </div>
  );
}

function Pie() {
  return (
    <footer className="mj-pie">
      <div className="mj-pie__figuras" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <Figura key={k} forma={k} c={[USOS[k % 4].c, USOS[(k + 1) % 4].c, USOS[(k + 2) % 4].c]} />
        ))}
      </div>
      <div className="mj-pie__caja">
        <p>Majo Robótica construye un mundo en el que los robots trabajan donde está la gente.</p>
        <div>
          <b>Producto</b>
          <a href={majoHref("producto")}>El robot</a>
          <a href={majoHref("producto#ficha")}>Ficha técnica</a>
        </div>
        <div>
          <b>Empresa</b>
          <a href={majoHref("empresa")}>Quiénes somos</a>
          <a href={majoHref("noticias")}>Noticias</a>
        </div>
        <small>Majo · robótica de demostración de Trama. Robot, precios y noticias inventados.</small>
      </div>
    </footer>
  );
}

function Portada() {
  const [pub, setPub] = useState(PUBLICOS[0].id);
  const p = PUBLICOS.find((x) => x.id === pub)!;
  return (
    <main>
      <section className="mj-hero">
        <h1 className="mj-t">
          Capaz, seguro y divertido.
          <br />
          Robots para todo el mundo.
        </h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.portada} alt="Un robot Majo junto a un programador en una oficina" className="mj-tarjeta mj-hero__foto" />
      </section>

      <section className="mj-sello">
        <p>Ya trabaja con</p>
        <ul>
          {["Universitat de Barcelona", "Cafès Gràcia", "Museu de la Ciència", "Escola Sant Martí"].map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>

      <section className="mj-bloque">
        <h2 className="mj-t">
          Crea experiencias nuevas.
          <br />
          Ya a la venta.
        </h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.cara} alt="La cara del robot Majo, dos ojos redondos en una pantalla" className="mj-tarjeta" loading="lazy" />
      </section>

      <section className="mj-publicos">
        <h2 className="mj-t">Una plataforma moderna para la robótica</h2>
        <div className="mj-pestanas" role="tablist" aria-label="Para quién">
          {PUBLICOS.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={pub === x.id} onClick={() => setPub(x.id)}>
              {x.n}
            </button>
          ))}
        </div>
        <div className="mj-publicos__panel" role="tabpanel" aria-label={p.n}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.img} alt="" className="mj-tarjeta" loading="lazy" />
          <p>{p.texto}</p>
        </div>
      </section>

      <section className="mj-rasgos">
        {RASGOS.map((r, k) => (
          <Reveal key={r.t} as="article" kind="slide" direction="up" delay={k * 0.08}>
            <Figura forma={k} c={[USOS[k].c, USOS[(k + 1) % 4].c, USOS[(k + 3) % 4].c]} />
            <h3>{r.t}</h3>
            <p>{r.texto}</p>
          </Reveal>
        ))}
      </section>

      <section className="mj-usos">
        {USOS.map((u, k) => (
          <article key={u.n} style={{ background: u.c }} className={`mj-arco mj-arco--${k}`}>
            <h3>{u.n}</h3>
          </article>
        ))}
      </section>

      <section className="mj-bloque mj-bloque--ciudad">
        <h2 className="mj-t">Un mundo en el que los robots trabajan donde está la gente</h2>
        <div className="mj-ciudad">
          <p className="mj-arcotxt">
            Diseñado en Barcelona
            <br />
            montado en Terrassa
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.ciudad} alt="El robot Majo asomado a una azotea con la ciudad detrás" className="mj-tarjeta" loading="lazy" />
        </div>
      </section>

      <section className="mj-bloque">
        <h2 className="mj-t">Robots de verdad, diversión de verdad</h2>
        <div className="mj-tira">
          {[FOTOS.casa, FOTOS.juego, FOTOS.tienda, FOTOS.aula].map((f) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={f} src={f} alt="" className="mj-tarjeta" loading="lazy" />
          ))}
        </div>
      </section>

      <section className="mj-tuyo">
        <h2 className="mj-t">Hazlo tuyo</h2>
        <p>Robot, accesorios y software, a tu manera.</p>
        <a href={majoHref("reservar")} className="mj-pildora">
          Reservar un Majo
        </a>
        <div className="mj-tuyo__figuras" aria-hidden>
          {[0, 1, 2, 3, 4].map((k) => (
            <Figura key={k} forma={k} c={[USOS[(k + 2) % 4].c, USOS[k % 4].c, USOS[(k + 1) % 4].c]} />
          ))}
        </div>
      </section>
    </main>
  );
}

function Producto() {
  return (
    <main className="mj-pag">
      <h1 className="mj-t">El robot</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FOTOS.taller} alt="Majo en el taller, de cuerpo entero" className="mj-tarjeta mj-pag__foto" />
      <section className="mj-rasgos">
        {RASGOS.map((r, k) => (
          <article key={r.t}>
            <Figura forma={k} c={[USOS[k].c, USOS[(k + 1) % 4].c, USOS[(k + 3) % 4].c]} />
            <h3>{r.t}</h3>
            <p>{r.texto}</p>
          </article>
        ))}
      </section>
      <section id="ficha" className="mj-ficha" aria-labelledby="mj-ficha">
        <h2 id="mj-ficha" className="mj-t">Ficha técnica</h2>
        <dl>
          {[
            ["Altura", "1,05 m"],
            ["Peso", "11 kg"],
            ["Batería", "6 horas de uso"],
            ["Carga", "3 kg en la bandeja"],
            ["Velocidad", "hasta 4 km/h"],
            ["Sensores", "dos cámaras de profundidad, lidar, tacto en brazos"],
            ["Conexión", "wifi 6, 5G opcional"],
            ["Software", "SDK abierto en Python"],
          ].map(([a, b]) => (
            <div key={a}>
              <dt>{a}</dt>
              <dd>{b}</dd>
            </div>
          ))}
        </dl>
        <a href={majoHref("reservar")} className="mj-pildora">
          Reservar un Majo
        </a>
      </section>
    </main>
  );
}

function Empresa() {
  return (
    <main className="mj-pag">
      <h1 className="mj-t">Gente que hace robots amables</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FOTOS.equipo} alt="El equipo de Majo en su taller de Barcelona" className="mj-tarjeta mj-pag__foto" loading="lazy" />
      <div className="mj-dos">
        <p>Empezamos en 2021 con una pregunta: ¿por qué los robots que conocemos asustan? Desde entonces, cuarenta personas entre mecánica, diseño, software y psicología trabajan en uno que no.</p>
        <p>Diseñamos en el Poblenou y fabricamos en Terrassa, con proveedores a menos de cien kilómetros. Cada robot sale probado en una casa de verdad.</p>
      </div>
    </main>
  );
}

function Noticias() {
  return (
    <main className="mj-pag">
      <h1 className="mj-t">Noticias</h1>
      <ul className="mj-noticias">
        {NOTICIAS.map((n) => (
          <li key={n.t}>
            <small>
              {n.tipo} · {n.fecha}
            </small>
            <b>{n.t}</b>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Reservar() {
  const [color, setColor] = useState(COLORES[0].id);
  const [acc, setAcc] = useState<string[]>(["base"]);
  const [reservado, setReservado] = useState(false);
  const c = COLORES.find((x) => x.id === color)!;
  const total = PRECIO_BASE + ACCESORIOS.filter((a) => acc.includes(a.id)).reduce((s, a) => s + a.precio, 0);
  const linea = [{ id: `majo-${color}-${acc.join("-")}`, title: "Señal de reserva · Majo", price: SEÑAL, qty: 1, meta: `${c.n}${acc.length ? ` · ${ACCESORIOS.filter((a) => acc.includes(a.id)).map((a) => a.n).join(", ")}` : ""}` }];
  return (
    <main className="mj-pag">
      <h1 className="mj-t">Reserva tu Majo</h1>
      {!reservado ? (
        <div className="mj-config">
          <div className="mj-config__vista" style={{ background: "#f9f4ec" }}>
            <Figura forma={0} c={[c.c, c.c, "#2a2622"]} />
            <p>{c.n}</p>
          </div>
          <div className="mj-config__opciones">
            <fieldset>
              <legend>Color de la carcasa</legend>
              <div className="mj-colores">
                {COLORES.map((x) => (
                  <button key={x.id} type="button" aria-pressed={color === x.id} onClick={() => setColor(x.id)} aria-label={x.n} title={x.n}>
                    <span style={{ background: x.c }} />
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Accesorios</legend>
              {ACCESORIOS.map((a) => (
                <label key={a.id} className="mj-acc">
                  <input type="checkbox" checked={acc.includes(a.id)} onChange={(e) => setAcc((cur) => (e.target.checked ? [...cur, a.id] : cur.filter((x) => x !== a.id)))} />
                  <span>
                    <b>{a.n}</b>
                    <small>{a.texto}</small>
                  </span>
                  <span>+{eur(a.precio)}</span>
                </label>
              ))}
            </fieldset>
            <div className="mj-config__total" aria-live="polite">
              <p>
                Precio final <b>{eur(total)}</b>
              </p>
              <p>
                Hoy pagas una señal de <b>{eur(SEÑAL)}</b>, que se descuenta del total. Entrega estimada: marzo de 2027.
              </p>
              <button type="button" className="mj-pildora" onClick={() => setReservado(true)}>
                Pagar la señal
              </button>
            </div>
          </div>
        </div>
      ) : (
        <CheckoutFlow lines={linea} onQty={() => setReservado(false)} onClear={() => undefined} delivery="digital" orderPrefix="MJ" shopHref={majoHref("reservar")} note="Reserva de demostración: no se cobra nada. Prueba con la tarjeta 4242 4242 4242 4242." variant="minimal" className="mj-checkout" />
      )}
    </main>
  );
}

function NoHay() {
  return (
    <main className="mj-pag">
      <h1 className="mj-t">Por aquí no pasa ningún robot</h1>
      <a href={majoHref()} className="mj-pildora">
        Volver al inicio
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a] = ruta;
  if (!a) return <Portada />;
  const P = { producto: Producto, empresa: Empresa, noticias: Noticias, reservar: Reservar }[a];
  return P ? <P /> : <NoHay />;
}
