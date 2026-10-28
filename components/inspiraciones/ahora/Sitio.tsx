"use client";

import { Suspense, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import ContactForm from "@/components/ui/ContactForm";
import EnrollmentFlow from "@/components/ui/EnrollmentFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { money } from "@/lib/commerce/money";
import { CURSOS, DIARIO, PROFES, SERVICIOS_EMPRESA } from "./data";
import { ahoraHref } from "./enlaces";
import "./ahora.css";
import Portada from "./Ahora";

/*
 * Ahora con varias páginas (docs/56): la portada (Ahora.tsx) y los cursos con filtro por formato y su ficha (temario,
 * profesores y solicitud con EnrollmentFlow), los profesores, la formación a medida para empresas (BriefFlow), el diario
 * y contacto. El marco persiste: la cabecera con el logo en tres líneas (menú a pantalla completa en el móvil) y el pie
 * negro con el boletín.
 */

const NAV: [string, string][] = [
  ["cursos", "Cursos"],
  ["empresas", "A medida"],
  ["profesores", "Profesores"],
  ["diario", "Diario"],
  ["contacto", "Contacto"],
];
const profe = (id: string) => PROFES.find((p) => p.id === id)!;

function Boletin() {
  const [hecho, setHecho] = useState("");
  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHecho(String(new FormData(e.currentTarget).get("correo") ?? ""));
  };
  return (
    <form onSubmit={enviar}>
      <h3>
        APÚNTATE
        <br />
        AL BOLETÍN
      </h3>
      {hecho ? (
        <p role="status">Hecho: te escribiremos a {hecho} con el próximo número (demostración: no se envía nada).</p>
      ) : (
        <>
          <p>Ideas sobre liderazgo de diseño, estrategia y cultura, y novedades de los próximos programas.</p>
          <label>
            <input name="correo" type="email" required placeholder="Tu correo" aria-label="Tu correo" />
            <button type="submit" aria-label="Apuntarme">
              →
            </button>
          </label>
        </>
      )}
    </form>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="ah" id="top">
      <header className="ah-head">
        <a href={ahoraHref()} className="ah-logo">
          FUTURA
          <br />
          ESCUELA
          <br />
          AHORA
        </a>
        <nav aria-label="Principal">
          {NAV.map(([p, l]) => (
            <a key={p} href={ahoraHref(p)}>
              {l}
            </a>
          ))}
        </nav>
        <FullscreenMenu brand="AHORA" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Cursos en Madrid y en línea" links={[{ label: "Inicio", href: ahoraHref() }, ...NAV.map(([p, l]) => ({ label: l, href: ahoraHref(p) }))]} className="ah-menu" />
      </header>
      {children}
      <footer className="ah-pie" id="boletin">
        <h2>
          DESCUBRE NUESTRO INSTAGRAM <span>→</span>
        </h2>
        <div className="ah-insta">
          {["Imagina que esto es tu MBA", "Encuentra a los tuyos", "Antes / después", "Programa ejecutivo", "Conoce a Clara", "¿Eres director creativo?"].map((x, i) => (
            <span key={x} className={i === 3 ? "is-circulo" : ""}>
              {x}
            </span>
          ))}
        </div>
        <div className="ah-pie__fila">
          <div>
            <h3>
              SÍGUENOS
              <br />
              EN REDES
            </h3>
            <p className="ah-redes">
              {["f", "x", "ig", "yt", "in", "tt"].map((r) => (
                <span key={r}>{r}</span>
              ))}
            </p>
          </div>
          <Boletin />
          <nav aria-label="Pie" className="ah-pie__nav">
            {NAV.map(([p, l]) => (
              <a key={p} href={ahoraHref(p)}>
                {l}
              </a>
            ))}
          </nav>
        </div>
        <small>© 2026 Ahora · escuela de demostración de Trama · Condiciones · Privacidad</small>
      </footer>
    </div>
  );
}

function Cab({ titulo, texto }: { titulo: ReactNode; texto?: string }) {
  return (
    <header className="ah-pag__cab">
      <h1>{titulo}</h1>
      {texto && <p>{texto}</p>}
    </header>
  );
}

function Cursos() {
  const [formato, setFormato] = useState<"" | "en línea" | "presencial">("");
  const lista = CURSOS.filter((c) => !formato || c.formato === formato);
  return (
    <main className="ah-pag">
      <Cab titulo="CURSOS Y EXPERIENCIAS" texto="En línea a tu ritmo o presenciales en Madrid, con profesores que trabajan hoy en lo que enseñan." />
      <div className="ah-filtros" role="group" aria-label="Formato">
        {(["", "en línea", "presencial"] as const).map((f) => (
          <button key={f || "todos"} type="button" aria-pressed={formato === f} onClick={() => setFormato(f)}>
            {f || "Todos"}
          </button>
        ))}
      </div>
      <ul className="ah-lista">
        {lista.map((c) => (
          <li key={c.id}>
            <a href={ahoraHref(`cursos/${c.id}`)}>
              <b>{c.t}</b>
              <span>{c.f}</span>
              <i aria-hidden>→</i>
            </a>
          </li>
        ))}
        <li>
          <a href={ahoraHref("empresas")}>
            <b>Programas de formación a medida</b>
            <span>Para empresas · bajo pedido</span>
            <i aria-hidden>→</i>
          </a>
        </li>
      </ul>
    </main>
  );
}

function Curso({ id }: { id: string }) {
  const c = CURSOS.find((x) => x.id === id)!;
  return (
    <main className="ah-pag">
      <a href={ahoraHref("cursos")} className="ah-volver">
        ← CURSOS
      </a>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.img} alt="" className="ah-curso__img" />
      <div className="ah-curso">
        <div>
          <p className="ah-chips">
            <span>{c.formato}</span>
            <span>{c.duracion}</span>
          </p>
          <h1>{c.t}</h1>
          <p>{c.texto}</p>
          <p className="ah-precio">{money(c.precio)}</p>
          <a href="#solicitud" className="ah-apuntate">
            {c.formato === "presencial" ? "Reserva tu plaza" : "Apúntate"} ↓
          </a>
        </div>
        <div className="ah-temario">
          <h2>TEMARIO</h2>
          <ol>
            {c.temario.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ol>
        </div>
      </div>
      <section className="ah-profes-curso">
        <h2>QUIÉN LO DA</h2>
        <div>
          {c.profes.map((id) => {
            const p = profe(id);
            return (
              <a key={id} href={ahoraHref(`profesores#${id}`)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.photo} alt="" loading="lazy" />
                <b>{p.name}</b>
                <span>{p.role}</span>
              </a>
            );
          })}
        </div>
      </section>
      <section className="ah-pag__bloque" id="solicitud">
        <h2>{c.formato === "presencial" ? "RESERVA TU PLAZA" : "EMPIEZA HOY"}</h2>
        <EnrollmentFlow className="ah-flujo" program={c.t} cohorts={c.fechas} price={c.precio} deposit={c.senal} levels={["Diseño", "Producto", "Dirección", "Otro"]} question="¿Qué te gustaría llevarte del curso?" storageKey="trama:ahora:cursos" variant="minimal" />
      </section>
    </main>
  );
}

function Profesores() {
  return (
    <main className="ah-pag">
      <Cab titulo="PROFESORES Y MENTORES" texto="Más de 200 profesionales que trabajan hoy en lo que enseñan. Algunos de ellos:" />
      <div className="ah-profes">
        {PROFES.map((p) => (
          <article key={p.id} id={p.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.photo} alt="" loading="lazy" />
            <h2>{p.name}</h2>
            <small>{p.role}</small>
            <p>{p.bio}</p>
            <p className="ah-profes__cursos">
              {CURSOS.filter((c) => c.profes.includes(p.id)).map((c) => (
                <a key={c.id} href={ahoraHref(`cursos/${c.id}`)}>
                  {c.t} →
                </a>
              ))}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}

function Empresas() {
  const q = useSearchParams();
  const servicio = q.get("servicio");
  return (
    <main className="ah-pag">
      <Cab titulo="FORMACIÓN A MEDIDA" texto="Talleres, programas de liderazgo y viajes de estudio para equipos de diseño, producto y marketing. Cuéntanos qué necesitáis y te mandamos una propuesta." />
      <ol className="ah-pasos">
        <li>
          <b>01</b>Nos cuentas el reto.
        </li>
        <li>
          <b>02</b>Te proponemos programa, profesores y fechas.
        </li>
        <li>
          <b>03</b>Lo ajustamos juntos y empezamos.
        </li>
      </ol>
      <BriefFlow className="ah-flujo" title="Propuesta de formación" services={SERVICIOS_EMPRESA} initialServices={servicio ? [servicio] : []} budgets="Menos de 10.000 €, 10.000–30.000 €, Más de 30.000 €" timelines="Este trimestre, Antes de seis meses, Sin fecha" question="¿Qué reto tiene el equipo? Cuántas personas sois, qué perfiles y qué os gustaría cambiar." fields="company,phone" responseTime="Te mandamos una propuesta en tres días laborables." prefix="AH" storageKey="trama:ahora:empresas" variant="minimal" />
    </main>
  );
}

function Diario() {
  return (
    <main className="ah-pag">
      <Cab titulo="DIARIO" texto="Ideas sobre liderazgo de diseño, estrategia y cultura." />
      <div className="ah-diario">
        {DIARIO.map((d) => (
          <article key={d.id} id={d.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.img} alt="" loading="lazy" />
            <small>
              {d.f} · {profe(d.autor).name}
            </small>
            <h2>{d.t}</h2>
            <p>{d.texto}</p>
            <a href="#boletin">Recíbelo en el boletín →</a>
          </article>
        ))}
      </div>
    </main>
  );
}

function Contacto() {
  return (
    <main className="ah-pag">
      <Cab titulo="CONTACTO" texto="Calle del Pez 21, 28004 Madrid · hola@ahora.example · 910 000 000" />
      <div className="ah-contacto">
        <ContactForm title="Escríbenos" subtitle="Dudas sobre cursos, becas o facturación. Para empresas, mejor la formación a medida." submitLabel="Enviar" successTitle="Gracias" successMessage="Te contestamos en un día laborable (demostración: no se envía nada)." variant="minimal" />
        <p>
          ¿Empresa? <a href={ahoraHref("empresas")}>Pide una propuesta →</a>
        </p>
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "cursos") return b ? <Curso id={b} /> : <Cursos />;
  if (a === "profesores") return <Profesores />;
  if (a === "empresas")
    return (
      <Suspense>
        <Empresas />
      </Suspense>
    );
  if (a === "diario") return <Diario />;
  if (a === "contacto") return <Contacto />;
  return null;
}
