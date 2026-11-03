"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import FAQSection from "@/components/ui/FAQSection";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { DIVISAS, FAQ, FOTOS, GALERIA, PLANES, RED } from "./data";
import { nacarHref } from "./enlaces";
import "./nacar.css";

/*
 * Nácar (docs/59), a partir de Moto: tarjeta privada. Piedra casi negra rgb(8,8,8) y gris claro rgb(225,229,229); una grotesca
 * en mayúsculas de peso 500 con interlineado 1 (Neue Montreal → Inter Tight). La portada pone una tarjeta de acero en 3D sobre
 * un pedestal que se inclina con el puntero; después, una galería oscura en profundidad que se recorre al bajar, una niebla de
 * cifras en varias monedas y la red de socios. Flujo: solicitar acceso en tres pasos con lista de espera.
 */

const NAV: [string, string][] = [
  ["membresia", "Membresía"],
  ["red", "La red"],
  ["socios", "Para socios"],
  ["preguntas", "Preguntas"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  return (
    <div className={`na ${ruta ? "" : "na--inicio"}`} id="top">
      <header className="na-head">
        <a href={nacarHref()} className="na-logo">
          <span aria-hidden>N</span>
          Nácar
        </a>
        <nav aria-label="Principal">
          {NAV.map(([p, l]) => (
            <a key={p} href={nacarHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <a href={nacarHref("acceso")} className="na-pildora">
          Solicitar acceso
        </a>
        <div className="na-burger">
          <FullscreenMenu
            trigger="plus"
            layout="island"
            tone="fg"
            reveal="slide"
            size="sm"
            className="na-menu"
            brand="Nácar"
            openLabel="Menú"
            closeLabel="Cerrar"
            note="Una forma más tranquila de moverse"
            links={[{ label: "Inicio", href: nacarHref() }, ...NAV.map(([p, l]) => ({ label: l, href: nacarHref(p) })), { label: "Solicitar acceso", href: nacarHref("acceso") }]}
          />
        </div>
      </header>
      {children}
      <footer className="na-pie">
        <p className="na-pie__lema">Una forma más tranquila de moverse por el mundo</p>
        <nav aria-label="Pie">
          {NAV.map(([p, l]) => (
            <a key={p} href={nacarHref(p)}>
              {l}
            </a>
          ))}
        </nav>
        <small>Nácar · servicio de demostración de Trama. No es una entidad financiera: cuotas, ventajas y socios inventados.</small>
      </footer>
    </div>
  );
}

/** la tarjeta de acero: se inclina hacia el puntero y un reflejo la recorre */
function Tarjeta({ fija = false }: { fija?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (fija || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const f = (e: PointerEvent) => setT({ x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 });
    addEventListener("pointermove", f);
    return () => removeEventListener("pointermove", f);
  }, [fija]);
  return (
    <div className="na-escena">
      <div ref={ref} className="na-tarjeta" style={{ "--rx": `${12 - t.y * 16}deg`, "--ry": `${t.x * 26}deg`, "--brillo": `${50 + t.x * 60}%` } as CSSProperties} aria-label="Tarjeta Nácar de acero cepillado" role="img">
        <span className="na-tarjeta__sello">N</span>
        <span className="na-tarjeta__chip" />
        <span className="na-tarjeta__num">•••• 2049</span>
        <span className="na-tarjeta__nombre">Socio desde 2026</span>
      </div>
      <div className="na-pedestal" aria-hidden />
    </div>
  );
}

/** galería oscura en profundidad: las fotos se acercan al bajar */
function Profundidad() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => {
      const r = ref.current?.getBoundingClientRect();
      if (r) setP(Math.max(0, Math.min(1, -r.top / (r.height - innerHeight))));
    };
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  return (
    <section className="na-prof" ref={ref} aria-label="Infraestructura para tu forma de moverte">
      <div className="na-prof__fija">
        <h2 style={{ opacity: 1 - p * 1.6 }}>Infraestructura para tu forma de moverte</h2>
        <div className="na-prof__espacio">
          {GALERIA.map((src, i) => {
            const z = -1800 + i * 230 + p * 2200;
            const x = (i % 2 ? 1 : -1) * (18 + (i % 3) * 9);
            const y = ((i % 4) - 1.5) * 14;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" loading="lazy" style={{ transform: `translate3d(${x}vw, ${y}vh, ${z}px)`, opacity: z > 420 ? 0 : 1 }} />
            );
          })}
          <span className="na-prof__linea" style={{ transform: `translateZ(${-600 + p * 900}px)` }} />
        </div>
        <p style={{ opacity: Math.max(0, p * 2 - 1) }}>La tarjeta es solo el principio</p>
      </div>
    </section>
  );
}

function Niebla() {
  return (
    <section className="na-niebla">
      {DIVISAS.map((d, i) => (
        <span key={i} style={{ "--x": `${(i * 37) % 90 + 4}%`, "--d": `${-(i * 1.7)}s`, "--b": `${(i % 4) * 1.6}px`, "--s": `${0.8 + (i % 3) * 0.35}` } as CSSProperties} aria-hidden>
          {d}
        </span>
      ))}
      <p>
        Sin fricción
        <br />
        Un sistema en todas partes
        <br />
        Gasto global
      </p>
    </section>
  );
}

function Red({ compacta = false }: { compacta?: boolean }) {
  const [sel, setSel] = useState(RED[0].id);
  const c = RED.find((x) => x.id === sel)!;
  return (
    <section className={`na-red ${compacta ? "na-red--compacta" : ""}`}>
      {!compacta && <h2>Hecho para los sitios por los que ya te mueves</h2>}
      <div className="na-red__tabs" role="tablist" aria-label="Categorías de la red">
        {RED.map((r) => (
          <button key={r.id} type="button" role="tab" aria-selected={sel === r.id} onClick={() => setSel(r.id)}>
            {r.n}
          </button>
        ))}
      </div>
      <div className="na-red__panel" role="tabpanel" aria-live="polite">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.img} alt="" loading="lazy" />
        <div>
          <p>{c.texto}</p>
          <ul>
            {c.lugares.map((l) => (
              <li key={l.n}>
                <b>{l.n}</b>
                <span>{l.ciudad}</span>
                <i>{l.ventaja}</i>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Portada() {
  return (
    <main>
      <section className="na-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.piedra} alt="" className="na-hero__fondo" />
        <Tarjeta />
        <h1>Hecha para la riqueza de hoy</h1>
      </section>
      <Profundidad />
      <Niebla />
      <section className="na-pilares">
        <div>
          <h2>Gasta en todo el mundo. 0 % de comisión de cambio.</h2>
          <p>Cada pago se cobra en la moneda local al cambio del día, sin recargos ni sorpresas en el extracto.</p>
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOTOS.conserje} alt="" loading="lazy" />
          <h2>Conserjería las 24 horas. Lo que sea. Cuando sea.</h2>
          <p>Una persona responde en minutos, en tu idioma, desde la aplicación o por teléfono.</p>
        </div>
      </section>
      <Red />
      <FAQSection kicker="" title="Preguntas frecuentes" subtitle="" items={FAQ} layout="split" presentation="lines" variant="minimal" className="na-faq" />
      <section className="na-final">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.luna} alt="" loading="lazy" />
        <div>
          <h2>Una forma más tranquila de moverse por el mundo</h2>
          <a href={nacarHref("acceso")} className="na-pildora na-pildora--clara">
            Solicitar acceso
          </a>
        </div>
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto }: { titulo: string; texto?: string }) => (
  <header className="na-cab">
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function Membresia() {
  return (
    <main className="na-pag">
      <Cab titulo="Membresía" texto="Dos niveles, cuota anual y ninguna comisión por uso." />
      <Tarjeta fija />
      <div className="na-planes">
        {PLANES.map((p) => (
          <article key={p.id}>
            <h2>{p.n}</h2>
            <b>
              {eur(p.cuota)} <small>al año</small>
            </b>
            <ul>
              {p.rasgos.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <a href={nacarHref(`acceso?plan=${p.id}`)} className="na-pildora">
              Solicitar {p.n}
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}

function RedPag() {
  return (
    <main className="na-pag">
      <Cab titulo="La red" texto="Lugares elegidos uno a uno. Las ventajas se aplican al pagar con la tarjeta." />
      <Red compacta />
    </main>
  );
}

function Socios() {
  return (
    <main className="na-pag">
      <Cab titulo="Para socios" texto="Hoteles, restaurantes y casas que quieren recibir a nuestros miembros." />
      <BriefFlow className="na-flujo" title="Hacerse socio de la red" services={RED.map((r) => ({ label: r.n, hint: r.texto.split(".")[0] }))} servicesLabel="¿Qué ofreces?" budgets="Una ubicación, De dos a cinco, Más de cinco" budgetLabel="¿Cuántas ubicaciones?" question="Cuéntanos qué te hace distinto" prefix="NA" variant="minimal" />
    </main>
  );
}

function Preguntas() {
  return (
    <main className="na-pag">
      <Cab titulo="Preguntas" />
      <FAQSection kicker="" title="" subtitle="" items={FAQ} presentation="lines" variant="minimal" className="na-faq na-faq--pag" />
    </main>
  );
}

const GASTOS = ["Menos de 50.000 €", "50.000–200.000 €", "Más de 200.000 €"];
const INTERESES = ["Hoteles", "Mesas", "Viajes", "Experiencias", "Bienestar"];

function Acceso() {
  const [paso, setPaso] = useState(0);
  const [d, setD] = useState({ nombre: "", correo: "", ciudad: "", gasto: "", plan: "nacar" });
  const [int, setInt] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [puesto, setPuesto] = useState(0);
  useEffect(() => {
    const p = new URLSearchParams(location.search).get("plan");
    if (p && PLANES.some((x) => x.id === p)) setD((x) => ({ ...x, plan: p }));
  }, []);
  const seguir = () => {
    setError("");
    if (paso === 0 && (d.nombre.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(d.correo))) return setError("Escribe tu nombre y un correo válido.");
    if (paso === 1 && (!d.ciudad.trim() || !d.gasto)) return setError("Indica tu ciudad y el gasto anual aproximado.");
    if (paso === 2) return setPuesto(140 + (d.nombre.length * 7) % 60);
    setPaso(paso + 1);
  };
  if (puesto)
    return (
      <main className="na-pag">
        <Cab titulo="Solicitud recibida" texto={`Estás en el puesto ${puesto} de la lista de ${PLANES.find((p) => p.id === d.plan)!.n}. Revisamos cada solicitud a mano; te escribimos a ${d.correo} en una semana.`} />
        <Tarjeta fija />
      </main>
    );
  return (
    <main className="na-pag">
      <Cab titulo="Solicitar acceso" texto={`Paso ${paso + 1} de 3. Tardas dos minutos.`} />
      <div className="na-form">
        <div className="na-pasos" aria-hidden>
          {[0, 1, 2].map((k) => (
            <i key={k} className={k <= paso ? "is-on" : ""} />
          ))}
        </div>
        {paso === 0 && (
          <>
            <label>
              <span>Nombre completo</span>
              <input value={d.nombre} onChange={(e) => setD({ ...d, nombre: e.target.value })} autoComplete="name" />
            </label>
            <label>
              <span>Correo</span>
              <input type="email" value={d.correo} onChange={(e) => setD({ ...d, correo: e.target.value })} autoComplete="email" />
            </label>
          </>
        )}
        {paso === 1 && (
          <>
            <label>
              <span>Ciudad de residencia</span>
              <input value={d.ciudad} onChange={(e) => setD({ ...d, ciudad: e.target.value })} autoComplete="address-level2" />
            </label>
            <fieldset>
              <legend>Gasto anual con tarjeta</legend>
              {GASTOS.map((g) => (
                <button key={g} type="button" aria-pressed={d.gasto === g} onClick={() => setD({ ...d, gasto: g })}>
                  {g}
                </button>
              ))}
            </fieldset>
          </>
        )}
        {paso === 2 && (
          <>
            <fieldset>
              <legend>Nivel</legend>
              {PLANES.map((p) => (
                <button key={p.id} type="button" aria-pressed={d.plan === p.id} onClick={() => setD({ ...d, plan: p.id })}>
                  {p.n} · {eur(p.cuota)}
                </button>
              ))}
            </fieldset>
            <fieldset>
              <legend>Lo que más usarías</legend>
              {INTERESES.map((i) => (
                <button key={i} type="button" aria-pressed={int.includes(i)} onClick={() => setInt(int.includes(i) ? int.filter((x) => x !== i) : [...int, i])}>
                  {i}
                </button>
              ))}
            </fieldset>
          </>
        )}
        {error && (
          <p className="na-error" role="alert">
            {error}
          </p>
        )}
        <div className="na-form__botones">
          {paso > 0 && (
            <button type="button" className="na-pildora" onClick={() => setPaso(paso - 1)}>
              Atrás
            </button>
          )}
          <button type="button" className="na-pildora na-pildora--clara" onClick={seguir}>
            {paso === 2 ? "Enviar solicitud" : "Continuar"}
          </button>
        </div>
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="na-pag">
      <Cab titulo="Fuera de la red" texto="Esta página no existe." />
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const P = { "": Portada, membresia: Membresia, red: RedPag, socios: Socios, preguntas: Preguntas, acceso: Acceso }[ruta[0] ?? ""];
  return P ? <P /> : <NoHay />;
}
