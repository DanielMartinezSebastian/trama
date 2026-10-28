"use client";

import { Montserrat, Permanent_Marker } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import CohortList from "@/components/ui/CohortList";
import EnrollmentFlow from "@/components/ui/EnrollmentFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { money } from "@/lib/commerce/money";
import { MENTORES, PROGRAMAS, SERVICIOS_COLABORA, SERVICIOS_MENTOR } from "./data";
import { oficioHref } from "./enlaces";
import "./oficio.css";
import Portada from "./Oficio";

// letras propias de esta réplica, no del kit: Magic Brush (de pago) → Permanent Marker, rotulador de trazo seco con el
// espaciado abierto de Honhar; Montserrat como el original (docs/cuaderno/replica-oficio.md)
const brocha = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--of-marker", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--of-montserrat", display: "swap" });

/*
 * Oficio con varias páginas (docs/56): la portada (Oficio.tsx) y los programas, talleres y cursos por lanzar con su ficha
 * (módulos, mentores y solicitud con EnrollmentFlow: plaza con señal, masterclass gratis o lista de espera), los mentores
 * con «sé mentor» (BriefFlow), colaboraciones para eventos, empresas y centros (BriefFlow) y la página legal. El marco
 * persiste: la cabecera amarilla con «Inscríbete» (menú a pantalla completa en el móvil) y el pie negro con el mapa.
 */

const NAV: [string, string][] = [
  ["programas", "Programas"],
  ["#historia", "Movimiento"],
  ["mentores", "Mentores"],
  ["#resultados", "Resultados"],
  ["colabora", "Colabora"],
];
const enlace = (p: string) => (p.startsWith("#") ? `${oficioHref()}${p}` : oficioHref(p));
const ESTADOS = { open: "Inscripción abierta", few: "Últimas plazas", soon: "Lanzamos pronto" };

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={`of ${brocha.variable} ${montserrat.variable}`} id="top">
      <header className="of-head">
        <a href={oficioHref()} className="of-logo">
          OFI<span>C</span>IO
        </a>
        <nav aria-label="Principal">
          {NAV.map(([p, l]) => (
            <a key={p} href={enlace(p)}>
              {l}
            </a>
          ))}
        </nav>
        <a href={oficioHref("programas")} className="of-boton">
          Inscríbete
        </a>
        <FullscreenMenu brand="OFICIO" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Formación práctica en Madrid" links={[{ label: "Inicio", href: oficioHref() }, ...NAV.map(([p, l]) => ({ label: l, href: enlace(p) }))]} className="of-menu" />
      </header>
      {children}
      <footer className="of-pie">
        <div className="of-pie__mapa" aria-label="Mapa: Calle del Oficio 12, Madrid">
          <i aria-hidden />
        </div>
        <div>
          <b>OFICIO</b>
          <a href={enlace("#historia")}>Nuestra historia</a>
          <a href={oficioHref("mentores#se-mentor")}>Sé mentor</a>
          <a href={oficioHref("programas")}>Inscríbete</a>
        </div>
        <div>
          <b>LEGAL</b>
          <a href={oficioHref("legal#condiciones")}>Condiciones</a>
          <a href={oficioHref("legal#privacidad")}>Privacidad</a>
          <a href={oficioHref("legal#amigo")}>Trae a un amigo</a>
        </div>
        <div>
          <b>CONTACTO</b>
          <span>
            Cursos e inscripciones: <a href="tel:+34910000000">910 000 000</a>
          </span>
          <span>
            Colaboraciones y eventos: <a href={oficioHref("colabora")}>escríbenos</a>
          </span>
          <span>
            Empresas y centros: <a href="mailto:hola@oficio.example">hola@oficio.example</a>
          </span>
        </div>
        <small>© 2026 Oficio · Calle del Oficio 12, Madrid · academia de demostración de Trama</small>
      </footer>
    </div>
  );
}

function Cab({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <header className="of-pag__cab">
      <h1>{titulo}</h1>
      {texto && <p>{texto}</p>}
    </header>
  );
}

function Programas() {
  return (
    <main className="of-pag">
      <Cab titulo="PROGRAMAS Y TALLERES" texto="Programas por promociones, masterclasses gratis antes de cada lanzamiento y cursos que aún están en pruebas." />
      <h2>PROGRAMAS</h2>
      <CohortList programs={PROGRAMAS.filter((x) => x.grupo === "programas")} layout="cards" variant="solid" className="of-cohorts" statusLabels={ESTADOS} />
      <h2>TALLERES Y MASTERCLASSES</h2>
      <CohortList programs={PROGRAMAS.filter((x) => x.grupo === "talleres")} layout="cards" variant="solid" className="of-cohorts of-cohorts--talleres" statusLabels={ESTADOS} />
      <h2>LANZAMOS PRONTO</h2>
      <CohortList programs={PROGRAMAS.filter((x) => x.grupo === "pronto")} layout="cards" variant="solid" className="of-cohorts" statusLabels={ESTADOS} />
    </main>
  );
}

function Programa({ id }: { id: string }) {
  const p = PROGRAMAS.find((x) => x.id === id)!;
  const pronto = p.grupo === "pronto";
  return (
    <main className="of-pag">
      <a href={oficioHref("programas")} className="of-volver">
        ← Programas
      </a>
      <div className="of-ficha">
        <div>
          {p.kicker && <small>{p.kicker}</small>}
          <h1>{p.title}</h1>
          {p.summary && <p>{p.summary}</p>}
          {p.formats && (
            <p className="of-chips">
              {p.formats.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </p>
          )}
          <p className="of-precio">{pronto ? "Precio por anunciar" : p.precio ? `${money(p.precio)} · señal de ${money(p.senal)}` : "Gratis"}</p>
          {p.mentores.length > 0 && <p>Con {p.mentores.join(", ")}.</p>}
        </div>
        <div className="of-recuadro">
          <h2>{pronto ? "LO QUE PREPARAMOS" : "MÓDULOS"}</h2>
          <ol>
            {p.modulos.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ol>
          {p.includes && (
            <>
              <h3>INCLUYE</h3>
              <ul>
                {p.includes.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <h2>{pronto ? "APÚNTATE A LA LISTA" : p.precio ? "SOLICITA TU PLAZA" : "RESERVA TU SITIO"}</h2>
      <EnrollmentFlow className="of-flujo" program={p.title} cohorts={p.fechas} price={p.precio || undefined} deposit={p.senal} levels={["Empiezo de cero", "Ya trabajo en ello", "Tengo un negocio"]} question="¿Qué te gustaría conseguir?" storageKey="trama:oficio:solicitudes" variant="solid" />
    </main>
  );
}

function Mentores() {
  return (
    <main className="of-pag">
      <Cab titulo="MENTORES" texto="Gente del sector que trabaja en ello cada día y dedica unas horas a la semana a enseñar oficio." />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/inspiraciones/oficio/mentores.webp" alt="El equipo de mentores de Oficio" className="of-pag__foto" />
      <ul className="of-mentores">
        {MENTORES.map((m) => (
          <li key={m.n}>
            {m.foto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.foto} alt="" loading="lazy" />
            )}
            <b>{m.n}</b>
            <span>{m.r}</span>
          </li>
        ))}
      </ul>
      <section id="se-mentor" className="of-pag__bloque">
        <h2>SÉ MENTOR EN OFICIO</h2>
        <p>Si sabes hacerlo y quieres enseñarlo, cuéntanos qué te gustaría dar. Te ayudamos a montar el programa.</p>
        <BriefFlow className="of-flujo" title="Quiero ser mentor" services={SERVICIOS_MENTOR} servicesLabel="¿Qué te gustaría hacer?" timelines="Este trimestre, El año que viene, Cuando encaje" question="¿De qué trabajas y qué te gustaría enseñar?" fields="phone" responseTime="Te llamamos esta semana." prefix="MEN" storageKey="trama:oficio:mentores" variant="solid" />
      </section>
    </main>
  );
}

function Colabora() {
  const q = useSearchParams();
  return (
    <main className="of-pag">
      <Cab titulo="COLABORA CON OFICIO" texto="Charlas en eventos, talleres para empresas y alianzas con centros de formación." />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/inspiraciones/oficio/eventos.webp" alt="" className="of-pag__foto" />
      <BriefFlow className="of-flujo" title="Colaboración con Oficio" services={SERVICIOS_COLABORA} initialServices={q.get("tipo") ? [q.get("tipo")!] : []} budgets="" timelines="Este mes, Este trimestre, Más adelante" question="Cuéntanos el evento, la empresa o el centro: fecha, público y lo que tenéis en mente." fields="company,phone" responseTime="Te respondemos en dos días laborables." prefix="COL" storageKey="trama:oficio:colabora" variant="solid" />
    </main>
  );
}

function Legal() {
  return (
    <main className="of-pag of-legal">
      <Cab titulo="CONDICIONES Y PRIVACIDAD" />
      <section id="condiciones">
        <h2>CONDICIONES</h2>
        <p>La señal reserva tu plaza y se descuenta del precio. Si anulas con más de 14 días de antelación, te la devolvemos entera. Academia de demostración: no hay cobros reales.</p>
      </section>
      <section id="privacidad">
        <h2>PRIVACIDAD</h2>
        <p>Usamos tus datos solo para gestionar tu solicitud y avisarte de tu promoción. En esta demostración se guardan solo en tu navegador.</p>
      </section>
      <section id="amigo">
        <h2>TRAE A UN AMIGO</h2>
        <p>Si alguien se inscribe con tu nombre, los dos tenéis 100 € de descuento en el programa.</p>
        <a href={oficioHref("programas")} className="of-boton">
          Ver programas →
        </a>
      </section>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "programas") return b ? <Programa id={b} /> : <Programas />;
  if (a === "mentores") return <Mentores />;
  if (a === "colabora")
    return (
      <Suspense>
        <Colabora />
      </Suspense>
    );
  if (a === "legal") return <Legal />;
  return null;
}
