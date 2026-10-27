"use client";

import dynamic from "next/dynamic";
import { Suspense, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import AppointmentList from "@/components/ui/AppointmentList";
import BookingFlow from "@/components/ui/BookingFlow";
import ContactForm from "@/components/ui/ContactForm";
import EnrollmentFlow from "@/components/ui/EnrollmentFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import MemberArea from "@/components/ui/MemberArea";
import MembershipFlow from "@/components/ui/MembershipFlow";
import OpeningHours from "@/components/ui/OpeningHours";
import PricingSection from "@/components/ui/PricingSection";
import RollLink from "@/components/ui/RollLink";
import { EQUIPO, PACKS, RETO, SERVICIOS, SESIONES } from "./data";
import { impulsoHref } from "./enlaces";
import "./impulso.css";

/*
 * Impulso con varias páginas (docs/56): la portada (Impulso.tsx) y el equipo, los servicios con su ficha, tarifas,
 * reservar (sesión de prueba o sesión, BookingFlow), packs de sesiones (MembershipFlow), el reto de 12 semanas por
 * convocatorias (EnrollmentFlow), mi cuenta y contacto. El marco persiste: la cabecera con los textos que ruedan (en el
 * móvil, el menú a pantalla completa) y el pie.
 */

const Portada = dynamic(() => import("./Impulso"));
const CITAS = "trama:impulso:citas";
const SOCIO = "trama:impulso:socio";
const NAV: [string, string][] = [["equipo", "Equipo"], ["servicios", "Servicios"], ["tarifas", "Tarifas"], ["reto", "Reto"], ["contacto", "Contacto"]];

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="im">
      <header className="im-head">
        <a href={impulsoHref()} className="im-logo">
          Impulso Fitness
        </a>
        <div className="im-head__nav">
          <b>Coach deportivo • Entrenador personal</b>
          <nav aria-label="Principal">
            {NAV.map(([p, l], i) => (
              <span key={p}>
                {i > 0 && " • "}
                <RollLink label={l} href={impulsoHref(p)} className={path.startsWith(impulsoHref(p)) ? "im-activo" : ""} />
              </span>
            ))}
          </nav>
        </div>
        <div className="im-head__datos">
          <b>
            <a href="tel:+34600000000">+34 600 000 000</a> • <a href="mailto:hola@impulso.example">hola@impulso.example</a>
          </b>
          <span>Calle de Ponzano 41 · 28003 Madrid</span>
        </div>
        <RollLink href={impulsoHref("reservar?servicio=prueba")} label="Empiezo" className="im-pildora" />
        <FullscreenMenu brand="Impulso" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Calle de Ponzano 41 · Madrid" links={[{ label: "Inicio", href: impulsoHref() }, ...NAV.map(([p, l]) => ({ label: l, href: impulsoHref(p) })), { label: "Reservar", href: impulsoHref("reservar") }, { label: "Mi cuenta", href: impulsoHref("mi-cuenta") }]} className="im-menu" />
      </header>
      {children}
      <footer className="im-pie">
        <a href="tel:+34600000000">+34 600 000 000</a>
        <RollLink href={impulsoHref("reto")} label="Me apunto al reto" className="im-pildora" />
        <a href={impulsoHref("mi-cuenta")}>Mi cuenta</a>
      </footer>
    </div>
  );
}

function Cab({ etiqueta, titulo, texto }: { etiqueta: string; titulo: string; texto?: string }) {
  return (
    <header className="im-pag__cab">
      <p className="im-etiqueta">{etiqueta}</p>
      <h1 className="im-gigante">{titulo}</h1>
      {texto && <p className="im-pag__texto">{texto}</p>}
    </header>
  );
}

function Equipo() {
  return (
    <main className="im-pag">
      <Cab etiqueta="Los expertos a tu servicio" titulo="El equipo" />
      <section id="estudio" className="im-bloque">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/inspiraciones/impulso/menu-estudio.webp" alt="El estudio privado" />
        <div>
          <h2>El estudio</h2>
          <p>70 m² en Chamberí solo para ti: material de musculación de alta gama, máquinas de cardio y una sala para el grupo pequeño. Nadie más entrena mientras estás tú.</p>
        </div>
      </section>
      {EQUIPO.map((p) => (
        <section key={p.name} id={p.name === "Tomás" ? "tomas" : "cristina"} className="im-bloque">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.photo} alt={p.name} />
          <div>
            <h2>{p.name === "Tomás" ? "Tomás Lluch" : "Cristina Bayo"}</h2>
            <p className="im-etiqueta">{p.role}</p>
            <p>{p.bio}</p>
            <RollLink href={impulsoHref(`reservar?profesional=${p.name}`)} label={`Reservar con ${p.name}`} className="im-pildora" />
          </div>
        </section>
      ))}
      <section id="mision" className="im-bloque">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/inspiraciones/impulso/menu-mision.webp" alt="" />
        <div>
          <h2>Nuestra misión</h2>
          <p>Que entrenar deje de ser una obligación. Medimos, explicamos el porqué de cada ejercicio y ajustamos el plan a tu vida, no al revés.</p>
        </div>
      </section>
    </main>
  );
}

function Servicios() {
  return (
    <main className="im-pag">
      <Cab etiqueta="Programa de entrenamiento a medida" titulo="Servicios" />
      <ul className="im-servlista">
        {SERVICIOS.map((s, i) => (
          <li key={s.id}>
            <a href={impulsoHref(`servicios/${s.id}`)}>
              <span>({String(i + 1).padStart(2, "0")})</span>
              <b>{s.titulo}</b>
              <span>{s.meta}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Servicio({ id }: { id: string }) {
  const s = SERVICIOS.find((x) => x.id === id)!;
  const sesion = SESIONES.find((x) => x.id === s.reserva);
  return (
    <main className="im-pag">
      <a href={impulsoHref("servicios")} className="im-volver">
        ← Servicios
      </a>
      <div className="im-bloque im-bloque--ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.img} alt="" />
        <div>
          <p className="im-etiqueta">{s.meta}</p>
          <h1>{s.titulo}</h1>
          <p>{s.texto}</p>
          <p>
            <b>Para quién:</b> {s.para}
          </p>
          <ul className="im-incluye">
            {s.incluye.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          {sesion && <p className="im-etiqueta">{sesion.price ? `${sesion.price} € · ${sesion.minutes} min` : "Gratis"}</p>}
          <div className="im-botones">
            <RollLink href={impulsoHref(`reservar?servicio=${s.reserva}`)} label="Reservar" className="im-pildora" />
            <RollLink href={impulsoHref("reservar?servicio=prueba")} label="Sesión de prueba gratis" className="im-pildora im-pildora--borde" />
          </div>
        </div>
      </div>
    </main>
  );
}

function Tarifas() {
  return (
    <main className="im-pag">
      <Cab etiqueta="Fórmulas de entrenamiento" titulo="Tarifas" texto="Sesión suelta, packs con descuento o el Pack Impulso de tres meses. La primera sesión de prueba es gratis." />
      <PricingSection
        kicker=""
        title=""
        subtitle=""
        layout="grid"
        cardLayout="compact"
        highlight="border"
        planCase="none"
        marker="check"
        badge=""
        variant="minimal"
        className="im-precios"
        plans={[
          { name: "Sesión suelta", price: "95 €", period: "/ sesión", features: ["60 minutos en el estudio", "Plan revisado cada mes"], cta: "Reservar", href: impulsoHref("reservar?servicio=sesion") },
          ...PACKS.map((p) => ({ name: p.name, price: `${p.price.toLocaleString("es-ES")} €`, period: "/ pack", features: p.features, highlighted: p.highlight, cta: "Contratar", href: impulsoHref(`packs?plan=${p.id}`) })),
          { name: "Nutrición", price: "90 €", period: "/ consulta", features: ["Análisis detallado", "Plan nutricional a medida"], cta: "Reservar", href: impulsoHref("reservar?servicio=nutricion") },
        ]}
      />
    </main>
  );
}

function Reservar() {
  const q = useSearchParams();
  return (
    <main className="im-pag">
      <Cab etiqueta="Estudio privado en Chamberí" titulo="Reservar" />
      <BookingFlow
        key={`${q.get("editar") ?? ""}${q.get("servicio") ?? ""}${q.get("profesional") ?? ""}`}
        className="im-flujo"
        services={SESIONES}
        staff={EQUIPO}
        initialService={q.get("servicio") ?? undefined}
        initialStaff={q.get("profesional") ?? undefined}
        editId={q.get("editar") ?? undefined}
        times="07:00, 08:00, 09:00, 10:00, 13:00, 14:00, 18:00, 19:00, 20:00"
        closedDays="0"
        closesAt={{ 6: "13:00" }}
        storageKey={CITAS}
        serviceLabel="¿Qué reservas?"
        staffLabel="¿Con quién?"
        business="Impulso Fitness"
        location="Calle de Ponzano 41, Madrid"
        appointmentsHref={impulsoHref("mi-cuenta")}
      />
    </main>
  );
}

function Packs() {
  const q = useSearchParams();
  return (
    <main className="im-pag">
      <Cab etiqueta="Más sesiones, mejor precio" titulo="Packs" />
      <MembershipFlow className="im-flujo" plans={PACKS} initialPlan={q.get("plan") ?? undefined} storageKey={SOCIO} club="Impulso" scheduleHref={impulsoHref("reservar?servicio=sesion")} accountHref={impulsoHref("mi-cuenta")} />
    </main>
  );
}

function Reto() {
  return (
    <main className="im-pag">
      <Cab etiqueta="Doce semanas, tres sesiones a la semana" titulo="El reto" texto="Un plan de entrenamiento y otro de comidas que puedas cumplir. Al principio y al final medimos juntos lo que ha cambiado. Plazas limitadas por convocatoria." />
      <EnrollmentFlow className="im-flujo" program="Reto Impulso de 12 semanas" cohorts={RETO} price={890} deposit={150} levels={["Empiezo de cero", "Entreno a veces", "Entreno a menudo"]} question="¿Qué quieres conseguir en estas 12 semanas?" storageKey="trama:impulso:reto" />
    </main>
  );
}

function MiCuenta() {
  return (
    <main className="im-pag">
      <Cab etiqueta="Guardado en este navegador" titulo="Mi cuenta" />
      <MemberArea classes={[]} storageKey={SOCIO} club="Impulso" plansHref={impulsoHref("packs")} scheduleHref={impulsoHref("reservar")} className="im-cuenta" />
      <h2 className="im-sub">Tus sesiones</h2>
      <AppointmentList services={SESIONES} storageKey={CITAS} bookHref={impulsoHref("reservar")} business="Impulso Fitness" location="Calle de Ponzano 41, Madrid" emptyTitle="Sin sesiones reservadas" emptyText="Empieza por la sesión de prueba: es gratis." />
    </main>
  );
}

function Contacto() {
  return (
    <main className="im-pag">
      <Cab etiqueta="Escríbenos para cualquier pregunta" titulo="Contacto" />
      <div className="im-contacto-pag">
        <div>
          <OpeningHours hours={"L-V|07:00-21:00\nS|08:00-13:00\nD|cerrado"} title="Horario del estudio" variant="minimal" />
          <p>
            Calle de Ponzano 41, 28003 Madrid
            <br />
            <a href="tel:+34600000000">+34 600 000 000</a> · <a href="mailto:hola@impulso.example">hola@impulso.example</a>
          </p>
        </div>
        <ContactForm title="" subtitle="" fields="name, email, message" submitLabel="Enviar" successTitle="Gracias" successMessage="Te contestamos hoy (demostración: no se envía nada)." variant="minimal" className="im-form" />
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  const espera = <main className="im-pag" role="status">Cargando…</main>;
  if (!a) return <Portada />;
  if (a === "equipo") return <Equipo />;
  if (a === "servicios") return b ? <Servicio id={b} /> : <Servicios />;
  if (a === "tarifas") return <Tarifas />;
  if (a === "reservar") return <Suspense fallback={espera}><Reservar /></Suspense>;
  if (a === "packs") return <Suspense fallback={espera}><Packs /></Suspense>;
  if (a === "reto") return <Reto />;
  if (a === "mi-cuenta") return <MiCuenta />;
  if (a === "contacto") return <Contacto />;
  return null;
}
