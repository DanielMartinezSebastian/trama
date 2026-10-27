"use client";

import dynamic from "next/dynamic";
import { Suspense, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ActionBar from "@/components/ui/ActionBar";
import AppointmentList from "@/components/ui/AppointmentList";
import BookingFlow from "@/components/ui/BookingFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import OpeningHours from "@/components/ui/OpeningHours";
import PricingSection from "@/components/ui/PricingSection";
import Reveal from "@/components/ui/Reveal";
import { ARTICULOS, BARBEROS, LOCALES, SERVICIOS } from "./data";
import { citaHref } from "./enlaces";
import "./cita.css";

/*
 * Cita Barbers con varias páginas (docs/56): la portada (Cita.tsx) y locales con su ficha, tarifas, reservar (BookingFlow,
 * eligiendo local), mis citas (AppointmentList) y la revista con sus artículos. El marco persiste al navegar: la cabecera
 * con la navegación (en el móvil, el menú a pantalla completa), la barra de reservar fija abajo en el móvil y el pie.
 */

const Portada = dynamic(() => import("./Cita"));
const CLAVE = "trama:cita:citas";
const NAV = [
  { label: "Locales", href: citaHref("locales") },
  { label: "Tarifas", href: citaHref("tarifas") },
  { label: "Revista", href: citaHref("revista") },
  { label: "Mis citas", href: citaHref("mis-citas") },
];

function Logo() {
  return (
    <a href={citaHref()} className="ci-logo" aria-label="Cita Barbers, inicio">
      <span>CITA</span>
      <svg viewBox="0 0 60 22" aria-hidden>
        <path d="M2 20 L30 6 M58 20 L30 6 M18 4 a4 4 0 1 0 0.1 0 M42 4 a4 4 0 1 0 0.1 0" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </a>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="ci">
      <header className="ci-head">
        <Logo />
        <nav className="ci-nav" aria-label="Principal">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} aria-current={path === n.href || path.startsWith(`${n.href}/`) ? "page" : undefined}>
              {n.label}
            </a>
          ))}
          <a href={citaHref("reservar")} className="ci-boton">
            Reservar
          </a>
        </nav>
        <FullscreenMenu
          className="ci-menu"
          brand="Cita Barbers"
          trigger="burger"
          openLabel="Menú"
          closeLabel="Cerrar"
          links={[{ label: "Inicio", href: citaHref() }, ...NAV, { label: "Reservar", href: citaHref("reservar") }]}
          footer={[{ label: "Descarga la app", href: `${citaHref()}#app` }]}
          note="Cinco barberías en Madrid"
        />
      </header>
      {children}
      <footer className="ci-pie">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/inspiraciones/cita/pie-sillon.webp" alt="" />
        <p>
          <em>Sé tu mejor versión</em>
          <br />
          <em>en Cita</em>
        </p>
        <nav aria-label="Pie">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
          <a href={citaHref("reservar")}>Reservar ↗</a>
          <a href={`${citaHref()}#app`}>Descarga la app ↗</a>
        </nav>
        <span className="ci-maquina">© Cita Barbers · Madrid · Barbería de demostración de Trama</span>
      </footer>
      <ActionBar
        className="ci-barra"
        variant="minimal"
        soft
        actions={[
          { label: "Locales", href: citaHref("locales"), icon: "map-pin" },
          { label: "Mis citas", href: citaHref("mis-citas"), icon: "calendar" },
          { label: "Reservar", href: citaHref("reservar"), icon: "arrow-right", primary: true },
        ]}
      />
    </div>
  );
}

function Cabecera({ kicker, titulo, children }: { kicker: string; titulo: ReactNode; children?: ReactNode }) {
  return (
    <header className="ci-pagina__cab">
      <p className="ci-maquina">{kicker}</p>
      <Reveal kind="slide" direction="up" distance={50} trigger="mount" duration={0.8}>
        <h1>{titulo}</h1>
      </Reveal>
      {children}
    </header>
  );
}

function Locales() {
  return (
    <main className="ci-pagina">
      <Cabecera kicker="Cinco barberías · Madrid" titulo={<><em>Locales</em><sup>5</sup></>}>
        <p className="ci-entradilla">La misma carta y el mismo cuidado en los cinco. Elige el que te pille cerca: cada uno tiene su gente y su horario.</p>
      </Cabecera>
      <div className="ci-locales__lista">
        {LOCALES.map((l) => (
          <article key={l.id} className="ci-ficha-mini">
            <a href={citaHref(`locales/${l.id}`)} className="ci-ficha-mini__foto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.img} alt={`Cita ${l.name}`} loading="lazy" />
            </a>
            <div>
              <h2>
                <a href={citaHref(`locales/${l.id}`)}>
                  <em>{l.name}</em>
                </a>
              </h2>
              <p className="ci-maquina">{l.address}</p>
              <OpeningHours hours={l.horario} layout="badge" title="" variant="minimal" />
              <div className="ci-local__acciones">
                <a href={citaHref(`reservar?local=${l.id}`)} className="ci-boton">
                  Reservar aquí
                </a>
                <a href={citaHref(`locales/${l.id}`)} className="ci-enlace">
                  Ver el local →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function Local({ id }: { id: string }) {
  const l = LOCALES.find((x) => x.id === id)!;
  const equipo = BARBEROS.filter((b) => !b.places || b.places.includes(l.id));
  return (
    <main className="ci-pagina ci-local-pag">
      <a href={citaHref("locales")} className="ci-volver">
        ← Todos los locales
      </a>
      <div className="ci-local-pag__rejilla">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={l.img} alt={`Cita ${l.name}`} className="ci-local-pag__foto" />
        <div className="ci-local-pag__texto">
          <Cabecera kicker={`Cita · ${l.barrio}`} titulo={<em>{l.name}</em>} />
          <p className="ci-entradilla">{l.texto}</p>
          <p className="ci-maquina">
            {l.address}
            <br />
            Metro {l.metro}
          </p>
          <OpeningHours hours={l.horario} title="Horario" variant="minimal" />
          <h2 className="ci-sub">Quién te atiende aquí</h2>
          <ul className="ci-equipo">
            {equipo.map((b) => (
              <li key={b.name}>
                <em>{b.name}</em>
                <span className="ci-maquina">{b.role}</span>
                <a href={citaHref(`reservar?local=${l.id}&barbero=${encodeURIComponent(b.name)}`)}>Reservar con {b.name} →</a>
              </li>
            ))}
          </ul>
          <a href={citaHref(`reservar?local=${l.id}`)} className="ci-boton ci-boton--grande">
            Reservar en {l.name} ↗
          </a>
        </div>
      </div>
      <nav className="ci-otros" aria-label="Otros locales">
        {LOCALES.filter((x) => x.id !== l.id).map((x) => (
          <a key={x.id} href={citaHref(`locales/${x.id}`)}>
            <em>{x.name}</em> →
          </a>
        ))}
      </nav>
    </main>
  );
}

function Tarifas() {
  return (
    <main className="ci-pagina">
      <Cabecera kicker="La misma carta en los cinco locales" titulo={<em>Tarifas</em>}>
        <p className="ci-entradilla">Precios cerrados con IVA. El lavado va incluido en todos los cortes.</p>
      </Cabecera>
      <PricingSection
        className="ci-carta"
        kicker=""
        title=""
        subtitle=""
        layout="menu"
        variant="minimal"
        plans={SERVICIOS.map((s) => ({ id: s.id, name: s.name, description: s.description ?? "", price: `${s.price} €`, meta: `${s.minutes} min`, cta: "Reservar", href: citaHref(`reservar?servicio=${s.id}`) }))}
        footnote="Bono de diez cortes: 190 € (te regalamos el kit de Cita). Pregunta en cualquier local."
      />
    </main>
  );
}

function Reservar() {
  const q = useSearchParams();
  const local = q.get("local") ?? undefined;
  return (
    <main className="ci-pagina">
      <Cabecera kicker="En dos minutos y sin llamar" titulo={<>Reserva tu <em>cita</em></>} />
      <BookingFlow
        key={`${q.get("editar") ?? ""}${local ?? ""}${q.get("servicio") ?? ""}`}
        className="ci-reserva-flujo"
        services={SERVICIOS}
        staff={BARBEROS}
        places={LOCALES}
        initialPlace={local}
        initialService={q.get("servicio") ?? undefined}
        initialStaff={q.get("barbero") ?? undefined}
        editId={q.get("editar") ?? undefined}
        times="10:00, 10:30, 11:00, 11:30, 12:00, 12:30, 13:00, 16:00, 16:30, 17:00, 17:30, 18:00, 18:30, 19:00"
        closedDays="0"
        closesAt={{ 6: "15:00" }}
        storageKey={CLAVE}
        serviceLabel="¿Qué te hacemos?"
        staffLabel="¿Con quién?"
        placeLabel="¿En qué local?"
        business="Cita Barbers"
        appointmentsHref={citaHref("mis-citas")}
        note="Barbería de demostración: no se envía nada y la cita solo se guarda en este navegador. Puedes cambiarla o anularla hasta 24 horas antes."
      />
    </main>
  );
}

function MisCitas() {
  return (
    <main className="ci-pagina">
      <Cabecera kicker="Guardadas en este navegador" titulo={<>Mis <em>citas</em></>} />
      <AppointmentList services={SERVICIOS} places={LOCALES} storageKey={CLAVE} bookHref={citaHref("reservar")} business="Cita Barbers" emptyTitle="Tu sillón sigue libre" emptyText="Aún no tienes citas. Elige local, corte y hora en dos minutos." />
    </main>
  );
}

function Revista() {
  return (
    <main className="ci-pagina">
      <Cabecera kicker="Papel · consejos de barbero" titulo={<em>Revista</em>} />
      <div className="ci-papel__rejilla">
        {ARTICULOS.map((a) => (
          <a key={a.slug} href={citaHref(`revista/${a.slug}`)} className="ci-articulo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.img} alt="" loading="lazy" />
            <span className="ci-maquina">{a.fecha}</span>
            <h2>{a.titulo}</h2>
            <p>{a.entradilla}</p>
          </a>
        ))}
      </div>
    </main>
  );
}

function Articulo({ slug }: { slug: string }) {
  const a = ARTICULOS.find((x) => x.slug === slug)!;
  const resto = ARTICULOS.filter((x) => x.slug !== slug);
  return (
    <main className="ci-pagina ci-articulo-pag">
      <a href={citaHref("revista")} className="ci-volver">
        ← Revista
      </a>
      <Cabecera kicker={a.fecha} titulo={<em>{a.titulo}</em>}>
        <p className="ci-entradilla">{a.entradilla}</p>
      </Cabecera>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a.img} alt="" className="ci-articulo-pag__foto" />
      <div className="ci-articulo-pag__cuerpo">
        {a.cuerpo.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <a href={citaHref("reservar")} className="ci-boton">
          Reserva tu cita ↗
        </a>
      </div>
      <nav className="ci-otros" aria-label="Más artículos">
        {resto.map((x) => (
          <a key={x.slug} href={citaHref(`revista/${x.slug}`)}>
            <em>{x.titulo}</em> →
          </a>
        ))}
      </nav>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "locales") return b ? <Local id={b} /> : <Locales />;
  if (a === "tarifas") return <Tarifas />;
  if (a === "reservar")
    return (
      <Suspense fallback={<main className="ci-pagina" role="status">Preparando tu cita…</main>}>
        <Reservar />
      </Suspense>
    );
  if (a === "mis-citas") return <MisCitas />;
  if (a === "revista") return b ? <Articulo slug={b} /> : <Revista />;
  return null;
}
