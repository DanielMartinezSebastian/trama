"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Albert_Sans, Crimson_Pro } from "next/font/google";
import AppointmentList from "@/components/ui/AppointmentList";
import BookingFlow from "@/components/ui/BookingFlow";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import MemberArea from "@/components/ui/MemberArea";
import MembershipFlow from "@/components/ui/MembershipFlow";
import OpeningHours from "@/components/ui/OpeningHours";
import { BONOS, CLASES, INSTRUCTORAS, PRIVADAS } from "./data";
import { nucleoHref } from "./enlaces";
import { Horario, SOCIO } from "./Horario";
import "./nucleo.css";
import Portada from "./Nucleo";

// Minion Pro (de pago) → Crimson Pro, su alternativa libre más cercana; Albert Sans, la del original, es libre. Se cargan
// en la réplica, no en el kit (docs/cuaderno/replica-nucleo.md)
const crimson = Crimson_Pro({ subsets: ["latin"], style: ["normal", "italic"], variable: "--nc-crimson", display: "swap" });
const albert = Albert_Sans({ subsets: ["latin"], variable: "--nc-albert", display: "swap" });

/*
 * Núcleo con varias páginas (docs/56): la portada (Nucleo.tsx) y el estudio, clases (horario con reserva: una de prueba
 * gratis y después con bono), bonos (alta con MembershipFlow), sesiones privadas (BookingFlow), mi cuenta (MemberArea y
 * las privadas) y contacto. El marco persiste: la cabecera (menú a pantalla completa en el móvil) y el pie.
 */

const CITAS = "trama:nucleo:privadas";
const NAV: [string, string][] = [["estudio", "Estudio"], ["clases", "Clases"], ["bonos", "Bonos"], ["privadas", "Privadas"], ["contacto", "Contacto"]];

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const portada = path === nucleoHref();
  return (
    <div className={`nc ${crimson.variable} ${albert.variable}`}>
      <header className={`nc-head ${portada ? "" : "nc-head--pag"}`}>
        <a href={nucleoHref()} className="nc-logo">
          núcleo
        </a>
        <nav aria-label="Principal" className="nc-nav">
          {NAV.map(([p, l]) => (
            <a key={p} href={nucleoHref(p)} aria-current={path.startsWith(nucleoHref(p)) ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <a href={nucleoHref("mi-cuenta")} className="nc-entrar">
          Mi cuenta
        </a>
        <FullscreenMenu brand="Núcleo" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Calle de Jorge Juan 18 · Madrid" links={[{ label: "Inicio", href: nucleoHref() }, ...NAV.map(([p, l]) => ({ label: l, href: nucleoHref(p) })), { label: "Mi cuenta", href: nucleoHref("mi-cuenta") }]} className="nc-menu" />
      </header>
      {children}
      <footer className="nc-pie">
        <strong>núcleo</strong>
        <p>
          Calle de Jorge Juan 18 · Madrid
          <br />
          <a href="mailto:hola@nucleo.example">hola@nucleo.example</a>
        </p>
        <p>
          <a href={nucleoHref("clases")}>Horario</a> · <a href={nucleoHref("bonos")}>Bonos</a> · <a href={nucleoHref("contacto")}>Trabaja con nosotras</a>
        </p>
      </footer>
    </div>
  );
}

function Cab({ titulo, cursiva, texto }: { titulo: string; cursiva: string; texto?: string }) {
  return (
    <header className="nc-pag__cab">
      <h1>
        {titulo} <em>{cursiva}</em>
      </h1>
      {texto && <p>{texto}</p>}
    </header>
  );
}

function Estudio() {
  return (
    <main className="nc-pag">
      <Cab titulo="el" cursiva="estudio" texto="Dos salas con luz natural en Jorge Juan, cinco reformers, una torre, sillas y barriles. Grupos de tres como máximo para que la instructora vea cada gesto." />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/inspiraciones/nucleo/estudio.webp" alt="El estudio de pilates con suelo de madera y luz natural" className="nc-pag__foto" />
      <ul className="nc-equipo">
        {INSTRUCTORAS.map((p) => (
          <li key={p.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.photo} alt="" loading="lazy" />
            <h2>{p.name}</h2>
            <p className="nc-nota">{p.role}</p>
            <p>{p.bio}</p>
            <a href={nucleoHref(`privadas?instructora=${p.name}`)} className="nc-entrar">
              Sesión privada con {p.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Clases() {
  return (
    <main className="nc-pag">
      <Cab titulo="tu clase" cursiva="te espera" texto="Grupos de hasta tres personas. La primera clase de prueba va por nuestra cuenta; para las siguientes necesitas un bono." />
      <Horario />
    </main>
  );
}

function Bonos() {
  const q = useSearchParams();
  return (
    <main className="nc-pag">
      <Cab titulo="elige tu" cursiva="bono" texto="Sin matrícula ni permanencia. Los bonos se renuevan cada mes y puedes cambiarlos cuando quieras." />
      <MembershipFlow className="nc-flujo" plans={BONOS} initialPlan={q.get("bono") ?? undefined} storageKey={SOCIO} club="Núcleo" scheduleHref={nucleoHref("clases")} accountHref={nucleoHref("mi-cuenta")} />
    </main>
  );
}

function Privadas() {
  const q = useSearchParams();
  return (
    <main className="nc-pag">
      <Cab titulo="sesiones" cursiva="privadas" texto="Para ti sola, en pareja o en trío. Empieza por la valoración inicial, gratis." />
      <BookingFlow
        key={`${q.get("editar") ?? ""}${q.get("sesion") ?? ""}${q.get("instructora") ?? ""}`}
        className="nc-flujo"
        services={PRIVADAS}
        staff={INSTRUCTORAS}
        initialService={q.get("sesion") ?? undefined}
        initialStaff={q.get("instructora") ?? undefined}
        editId={q.get("editar") ?? undefined}
        times="07:30, 09:00, 11:00, 13:00, 15:30, 17:00, 19:30"
        closedDays="0"
        closesAt={{ 6: "14:00" }}
        storageKey={CITAS}
        serviceLabel="¿Qué sesión?"
        staffLabel="¿Con quién?"
        business="Núcleo"
        location="Calle de Jorge Juan 18, Madrid"
        appointmentsHref={nucleoHref("mi-cuenta")}
      />
    </main>
  );
}

function MiCuenta() {
  return (
    <main className="nc-pag">
      <Cab titulo="mi" cursiva="cuenta" texto="Tu bono, tus clases y tus sesiones privadas, guardados en este navegador." />
      <MemberArea classes={CLASES} storageKey={SOCIO} club="Núcleo" plansHref={nucleoHref("bonos")} scheduleHref={nucleoHref("clases")} className="nc-cuenta" />
      <section className="nc-cuenta">
        <h2>
          sesiones <em>privadas</em>
        </h2>
        <AppointmentList services={PRIVADAS} storageKey={CITAS} bookHref={nucleoHref("privadas")} business="Núcleo" location="Calle de Jorge Juan 18, Madrid" emptyTitle="Sin sesiones privadas" emptyText="Empieza por la valoración inicial: es gratis." />
      </section>
    </main>
  );
}

function Contacto() {
  return (
    <main className="nc-pag">
      <Cab titulo="ven a" cursiva="vernos" />
      <div className="nc-contacto">
        <div>
          <OpeningHours hours={"L-V|07:30-21:00\nS|09:00-14:00\nD|10:00-12:00"} title="Horario" variant="minimal" />
          <p>
            Calle de Jorge Juan 18, 28001 Madrid
            <br />
            Metro Serrano y Velázquez
          </p>
        </div>
        <ContactForm title="Escríbenos" subtitle="Dudas, regalos, eventos de empresa o trabajar con nosotras." fields="name, email, message" submitLabel="Enviar" successTitle="Gracias" successMessage="Te contestamos hoy (demostración: no se envía nada)." variant="minimal" className="nc-form" />
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a] = ruta;
  const espera = <main className="nc-pag" role="status">Cargando…</main>;
  if (!a) return <Portada />;
  if (a === "estudio") return <Estudio />;
  if (a === "clases") return <Clases />;
  if (a === "bonos") return <Suspense fallback={espera}><Bonos /></Suspense>;
  if (a === "privadas") return <Suspense fallback={espera}><Privadas /></Suspense>;
  if (a === "mi-cuenta") return <MiCuenta />;
  if (a === "contacto") return <Contacto />;
  return null;
}
