"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Reveal from "@/components/ui/Reveal";
import { ANGULOS, BATERIAS, COLORES, DATOS, FOTOS, FUNCIONES, MODOS, SEÑAL, VERSIONES } from "./data";
import { trochaHref } from "./enlaces";
import "./trocha.css";

/*
 * Trocha (docs/60), a partir de Radian: moto eléctrica de enduro. Gris cálido claro, fotos de campo a sangre con texto en
 * blanco, una grotesca de 500 contenida y un amarillo de acento en la píldora de reserva y los puntos activos. La firma es
 * el visor de la moto: se gira entre cuatro ángulos (botones, flechas del teclado o arrastre) y cada ángulo tiene puntos
 * que abren su detalle. Flujos: el visor, y configurar la versión, la batería y el color y reservar con señal.
 */

const NAV: [string, string][] = [
  ["moto", "La moto"],
  ["historia", "Historia"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  const links = [{ label: "Inicio", href: trochaHref() }, ...NAV.map(([p, l]) => ({ label: l, href: trochaHref(p) })), { label: "Reservar", href: trochaHref("reservar") }];
  return (
    <div className={`tr ${ruta ? "" : "tr--inicio"}`} id="top">
      <header className="tr-head">
        <span className="tr-head__seccion">Trocha · {ruta ? (NAV.find(([p]) => p === ruta)?.[1] ?? "Reservar") : "Inicio"}</span>
        <a href={trochaHref()} className="tr-head__marca">
          TROCHA
        </a>
        <nav aria-label="Principal" className="tr-head__nav">
          {NAV.map(([p, l]) => (
            <a key={p} href={trochaHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
          <a href={trochaHref("reservar")} className="tr-pildora">
            Reservar <span aria-hidden>→</span>
          </a>
        </nav>
        <FullscreenMenu trigger="plus" layout="island" reveal="fade" size="sm" numbered brand="Trocha" openLabel="Menú" closeLabel="Cerrar" note="Diseñada en Bilbao" links={links} className="tr-menu" />
      </header>
      {children}
      <Pie />
    </div>
  );
}

function Pie() {
  return (
    <footer className="tr-pie">
      <p className="tr-pie__marca" aria-hidden>
        TROCHA
      </p>
      <div>
        <span>Diseñada en Bilbao · fabricada en Gipuzkoa</span>
        <a href="mailto:hola@trocha.example">hola@trocha.example</a>
        <span>Trocha · moto de demostración de Trama. Moto, datos y precios inventados.</span>
      </div>
    </footer>
  );
}

/** el visor: cuatro ángulos de la moto con sus puntos de detalle */
function Visor() {
  const [i, setI] = useState(0);
  const [punto, setPunto] = useState<number | null>(null);
  const x0 = useRef<number | null>(null);
  const ir = (d: number) => {
    setI((v) => (v + d + ANGULOS.length) % ANGULOS.length);
    setPunto(null);
  };
  const a = ANGULOS[i];
  return (
    <section className="tr-visor" aria-label="La moto en 360 grados" aria-roledescription="visor">
      <div
        className="tr-visor__escena"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") ir(1);
          if (e.key === "ArrowLeft") ir(-1);
        }}
        onPointerDown={(e) => (x0.current = e.clientX)}
        onPointerUp={(e) => {
          if (x0.current === null) return;
          const d = e.clientX - x0.current;
          if (Math.abs(d) > 40) ir(d < 0 ? 1 : -1);
          x0.current = null;
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={a.id} src={a.img} alt={`La Trocha, vista ${a.n.toLowerCase()}`} draggable={false} />
        {/* los puntos van en % de la foto: la capa tiene su proporción aunque la escena cambie en móvil */}
        <div className="tr-visor__capa">
          {a.puntos.map((p, k) => (
            <button key={p.t} type="button" className="tr-punto" style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-expanded={punto === k} aria-label={p.t} onClick={() => setPunto(punto === k ? null : k)}>
              <span aria-hidden>+</span>
            </button>
          ))}
          {punto !== null && (
            <div className="tr-detalle" role="status" style={{ left: `${Math.min(70, a.puntos[punto].x)}%`, top: `${a.puntos[punto].y + 6}%` }}>
              <b>{a.puntos[punto].t}</b>
              <span>{a.puntos[punto].texto}</span>
            </div>
          )}
        </div>
      </div>
      <div className="tr-visor__mandos">
        <div className="tr-puntos" role="tablist" aria-label="Ángulo">
          {ANGULOS.map((x, k) => (
            <button key={x.id} type="button" role="tab" aria-selected={k === i} onClick={() => { setI(k); setPunto(null); }}>
              <span className="tr-sr">{x.n}</span>
            </button>
          ))}
        </div>
        <span>{a.n}</span>
        <div className="tr-flechas">
          <button type="button" onClick={() => ir(-1)} aria-label="Ángulo anterior">
            ←
          </button>
          <button type="button" onClick={() => ir(1)} aria-label="Ángulo siguiente">
            →
          </button>
        </div>
      </div>
    </section>
  );
}

function Portada() {
  const [f, setF] = useState(0);
  return (
    <main>
      <section className="tr-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.portada} alt="La Trocha amarilla aparcada en un bosque de pinos" />
        <div className="tr-hero__txt">
          <h1>Trocha EXR</h1>
          <dl>
            {DATOS.map(([a, b]) => (
              <div key={a}>
                <dt>{a}</dt>
                <dd>{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="tr-oscura">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.motor} alt="El motor y el radiador de la Trocha en primer plano" loading="lazy" />
        <div className="tr-oscura__txt">
          <p className="tr-t">
            Par instantáneo.
            <br />
            Hecha para no parar.
          </p>
          <dl className="tr-cifras">
            <div>
              <dt>16 kW</dt>
              <dd>de potencia continua</dd>
            </div>
            <div>
              <dt>1.060 Nm</dt>
              <dd>de par en la rueda</dd>
            </div>
          </dl>
        </div>
      </section>

      <Visor />

      <section className="tr-eco">
        <h2 className="tr-t tr-t--oscuro">Ecosistema</h2>
        <div>
          {[
            { t: "Base de carga", texto: "Carga la batería fuera de la moto, en casa o en la furgoneta.", img: FOTOS.cargador },
            { t: "Batería 8,8 kWh", texto: "Para jornadas largas de enduro.", img: FOTOS.bateria },
            { t: "Batería 6,6 kWh", texto: "Más ligera, para circuito.", img: FOTOS.bateriaS },
          ].map((x, k) => (
            <Reveal key={x.t} as="article" kind="fade" delay={k * 0.06}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.img} alt="" loading="lazy" />
              <b>{x.t}</b>
              <small>{x.texto}</small>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="tr-funciones" aria-label="Funciones">
        <div className="tr-carrusel" style={{ translate: `calc(${-f} * (min(420px, 80vw) + 14px)) 0` }}>
          {FUNCIONES.map((x, k) => (
            <article key={x.t} aria-hidden={k !== f}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.img} alt="" loading="lazy" />
              <b>{x.t}</b>
              <small>{x.texto}</small>
            </article>
          ))}
        </div>
        <div className="tr-puntos tr-puntos--oscuros">
          {FUNCIONES.map((x, k) => (
            <button key={x.t} type="button" aria-pressed={k === f} onClick={() => setF(k)}>
              <span className="tr-sr">{x.t}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="tr-oscura tr-oscura--barro">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.barro} alt="Un piloto derrapa con la Trocha en una pista de tierra" loading="lazy" />
        <div className="tr-oscura__txt">
          <p className="tr-sobre">Ventajas de lo eléctrico</p>
          <p className="tr-t">
            Un 70 % menos de mantenimiento,
            <br />
            un 70 % menos de gasto.
            <br />
            Más tiempo rodando.
          </p>
        </div>
      </section>

      <section className="tr-modos">
        <h2 className="tr-t tr-t--oscuro">Una moto, varios caracteres</h2>
        <ul>
          {MODOS.map(([n, t]) => (
            <li key={n}>
              <b>{n}</b>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <a href={trochaHref("reservar")} className="tr-pildora">
          Reservar la tuya <span aria-hidden>→</span>
        </a>
      </section>
    </main>
  );
}

function Moto() {
  return (
    <main className="tr-pag">
      <h1 className="tr-t tr-t--oscuro">La moto</h1>
      <Visor />
      <section className="tr-ficha">
        {[
          ["Motor", "16 kW continuos, 42 kW de pico"],
          ["Par", "1.060 Nm en la rueda"],
          ["Batería", "6,6 o 8,8 kWh, extraíble"],
          ["Autonomía", "de 2 a 3 h de enduro"],
          ["Carga", "del 20 al 80 % en 50 min"],
          ["Peso", "desde 104 kg"],
          ["Asiento", "920 mm"],
          ["Suspensión", "300 mm, regulable"],
        ].map(([a, b]) => (
          <div key={a}>
            <dt>{a}</dt>
            <dd>{b}</dd>
          </div>
        ))}
      </section>
    </main>
  );
}

function Historia() {
  return (
    <main className="tr-pag">
      <h1 className="tr-t tr-t--oscuro">Hecha por pilotos</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FOTOS.piloto} alt="Una piloto con casco y la Trocha en el bosque" className="tr-pag__foto" loading="lazy" />
      <div className="tr-dos">
        <p>Empezamos en un garaje de Deusto en 2020: tres pilotos de enduro y una ingeniera que quería una moto que no hiciera ruido en el monte.</p>
        <p>Hoy somos treinta y cinco personas. Diseñamos en Bilbao y montamos en Gipuzkoa, con la batería y el motor hechos a menos de doscientos kilómetros.</p>
      </div>
    </main>
  );
}

function Reservar() {
  const [ver, setVer] = useState(VERSIONES[0].id);
  const [bat, setBat] = useState(BATERIAS[0].id);
  const [col, setCol] = useState(COLORES[0].id);
  const [pagar, setPagar] = useState(false);
  const v = VERSIONES.find((x) => x.id === ver)!, b = BATERIAS.find((x) => x.id === bat)!, c = COLORES.find((x) => x.id === col)!;
  const total = v.precio + b.precio;
  const linea = [{ id: `trocha-${ver}-${bat}-${col}`, title: "Señal de reserva · Trocha", price: SEÑAL, qty: 1, meta: `${v.n} · ${b.n} · ${c.n}` }];
  return (
    <main className="tr-pag">
      <h1 className="tr-t tr-t--oscuro">Reserva tu Trocha</h1>
      {!pagar ? (
        <div className="tr-config">
          <div className="tr-config__vista" style={{ "--moto": c.c } as CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ANGULOS[0].img} alt={`Trocha ${c.n}`} />
            <span className="tr-config__muestra" aria-hidden />
            <p>{c.n}</p>
          </div>
          <div className="tr-config__ops">
            {[
              { l: "Versión", lista: VERSIONES, val: ver, set: setVer },
              { l: "Batería", lista: BATERIAS, val: bat, set: setBat },
            ].map((g) => (
              <fieldset key={g.l}>
                <legend>{g.l}</legend>
                {g.lista.map((x) => (
                  <button key={x.id} type="button" aria-pressed={g.val === x.id} onClick={() => g.set(x.id)}>
                    <b>{x.n}</b>
                    <small>{x.texto}</small>
                    <span>{x.precio ? `+${eur(x.precio)}` : g.l === "Versión" ? eur(x.precio) : "incluida"}</span>
                  </button>
                ))}
              </fieldset>
            ))}
            <fieldset>
              <legend>Color</legend>
              <div className="tr-colores">
                {COLORES.map((x) => (
                  <button key={x.id} type="button" aria-pressed={col === x.id} onClick={() => setCol(x.id)} aria-label={x.n} title={x.n}>
                    <span style={{ background: x.c }} />
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="tr-config__total" aria-live="polite">
              <p>
                Total <b>{eur(total)}</b>
              </p>
              <p>Hoy, una señal de {eur(SEÑAL)} que se descuenta del total. Entregas en primavera de 2027.</p>
              <button type="button" className="tr-pildora" onClick={() => setPagar(true)}>
                Pagar la señal <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <CheckoutFlow lines={linea} onQty={() => setPagar(false)} onClear={() => undefined} delivery="digital" orderPrefix="TR" shopHref={trochaHref("reservar")} note="Reserva de demostración: no se cobra nada. Prueba con la tarjeta 4242 4242 4242 4242." variant="minimal" className="tr-checkout" />
      )}
    </main>
  );
}

function NoHay() {
  return (
    <main className="tr-pag">
      <h1 className="tr-t tr-t--oscuro">Fuera de pista</h1>
      <a href={trochaHref()} className="tr-pildora">
        Volver
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a] = ruta;
  if (!a) return <Portada />;
  const P = { moto: Moto, historia: Historia, reservar: Reservar }[a];
  return P ? <P /> : <NoHay />;
}
