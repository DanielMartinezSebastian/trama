"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ClassSchedule from "@/components/ui/ClassSchedule";
import ContactForm from "@/components/ui/ContactForm";
import MemberArea from "@/components/ui/MemberArea";
import MembershipFlow from "@/components/ui/MembershipFlow";
import OpeningHours from "@/components/ui/OpeningHours";
import { useMembership } from "@/lib/commerce/membership";
import { CLASES, CUOTAS, OFERTA } from "./data";
import { tallaHref } from "./enlaces";
import "./talla.css";

/*
 * Talla con varias páginas (docs/56): la portada (Talla.tsx) y la oferta con su ficha, el horario (clase de prueba gratis
 * y después con cuota; HYROX solo con cuota HYROX), hazte socio (MembershipFlow), mi cuenta y contacto. El marco persiste:
 * la cabecera con «clase de prueba gratis», el menú a pantalla completa en columnas con la palabra girada y el pie.
 */

const Portada = dynamic(() => import("./Talla"));
const SOCIO = "trama:talla:socio";

function Menu({ abierto, cerrar }: { abierto: boolean; cerrar: () => void }) {
  return (
    <div className={`tl-menu ${abierto ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menú" aria-hidden={!abierto} inert={!abierto}>
      <a href={tallaHref()} className="tl-logo">
        TALLA
      </a>
      <nav aria-label="Principal" onClick={cerrar}>
        <a href={tallaHref("oferta")}>
          <span>OFERTA</span>
        </a>
        <a href={tallaHref("horario")}>
          <span>HORARIO</span>
        </a>
        <a href={tallaHref("socio")}>
          <span>SOCIO</span>
        </a>
      </nav>
      <div className="tl-menu__datos">
        <p>
          <a href="mailto:hola@talla.example">hola@talla.example</a>
          <br />
          <a href="tel:+34910000000">910 000 000</a>
          <br />
          Calle de Oca 72
          <br />
          28025 Madrid
        </p>
        <p>
          <b>HORARIO</b>
          <br />
          Lunes a viernes: 06:00 – 23:00
          <br />
          Sábado y domingo: 08:00 – 21:00
        </p>
        <p onClick={cerrar}>
          <a href={tallaHref("mi-cuenta")}>Mi cuenta</a> · <a href={tallaHref("contacto")}>Contacto</a>
        </p>
      </div>
      <button type="button" className="tl-menu-btn tl-menu__cerrar" onClick={cerrar}>
        Cerrar
      </button>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const path = usePathname();
  useEffect(() => setMenu(false), [path]);
  useEffect(() => {
    if (!menu) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [menu]);
  return (
    <div className="tl">
      <header className="tl-head">
        <a href={tallaHref()} className="tl-logo">
          TALLA
        </a>
        <a href={tallaHref("horario")} className="tl-prueba">
          Clase de prueba gratis
        </a>
        <button type="button" className="tl-menu-btn" aria-expanded={menu} onClick={() => setMenu(!menu)}>
          {menu ? "Cerrar" : "Menú"}
        </button>
      </header>
      {children}
      <footer className="tl-pie">
        <OpeningHours title="Horario" hours={"L-V|06:00-23:00\nS-D|08:00-21:00"} variant="minimal" />
        <div>
          <p>
            <a href="mailto:hola@talla.example">hola@talla.example</a>
            <br />
            <a href="tel:+34910000000">910 000 000</a>
            <br />
            Calle de Oca 72
            <br />
            28025 Madrid
          </p>
          <p>
            <a href={tallaHref("socio")}>Hazte socio</a> · <a href={tallaHref("mi-cuenta")}>Mi cuenta</a>
          </p>
        </div>
      </footer>
      <Menu abierto={menu} cerrar={() => setMenu(false)} />
    </div>
  );
}

function Cab({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <header className="tl-pag__cab">
      <h1>{titulo}</h1>
      {texto && <p>{texto}</p>}
    </header>
  );
}

function Oferta() {
  return (
    <main className="tl-pag">
      <Cab titulo="LA OFERTA" texto="Cuatro formas de entrenar en Talla. Todas empiezan con una clase de prueba gratis." />
      <ul className="tl-oferta-lista">
        {OFERTA.map((o, i) => (
          <li key={o.id}>
            <a href={tallaHref(`oferta/${o.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.img} alt="" loading="lazy" />
              <small>0{i + 1}</small>
              <b>{o.t}</b>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Ficha({ id }: { id: string }) {
  const o = OFERTA.find((x) => x.id === id)!;
  return (
    <main className="tl-pag">
      <a href={tallaHref("oferta")} className="tl-volver">
        ← OFERTA
      </a>
      <div className="tl-ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={o.img} alt="" />
        <div>
          <h1>{o.t}</h1>
          <p>{o.texto}</p>
          <ul>
            {o.incluye.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <div className="tl-botones">
            <a href={tallaHref("horario")} className="tl-prueba">
              Clase de prueba gratis
            </a>
            <a href={tallaHref(id === "hyrox" ? "socio?plan=hyrox-basico" : "socio")} className="tl-boton">
              HAZTE SOCIO
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function Horario() {
  const q = useSearchParams();
  const socio = useMembership(SOCIO);
  const [aviso, setAviso] = useState("");
  const prueba = !socio.plan && socio.bookings.length === 0;
  const esHyrox = socio.plan?.id.startsWith("hyrox");
  return (
    <main className="tl-pag">
      <Cab titulo="HORARIO" texto={socio.plan ? `Con tu cuota ${socio.plan.name}.` : prueba ? "Tu primera clase es gratis: reserva sin ser socio." : "Ya usaste tu clase de prueba. Hazte socio para seguir."} />
      <ClassSchedule
        classes={CLASES}
        startOffset={0}
        defaultCategory={q.get("tipo") ?? ""}
        bookings={socio.bookings}
        onBook={(c, d, espera) => {
          if (!socio.plan && !prueba) return setAviso("Ya usaste tu clase de prueba.");
          if (socio.plan && c.category === "HYROX" && !esHyrox) return setAviso("Las clases HYROX van con la cuota HYROX.");
          setAviso("");
          socio.book(c.id, d, espera);
        }}
        freePlaces={(c, d) => Math.max(0, (c.capacity ?? 14) - (c.booked ?? 0) - (Number(d.slice(-1)) % 2) - (socio.bookings.some((b) => b.classId === c.id && b.date === d && !b.waitlist) ? 1 : 0))}
        filters="category"
        bookLabel="RESERVAR"
        waitlistLabel="LISTA DE ESPERA"
        bookedHref={tallaHref("mi-cuenta")}
        bookedCta="Mi cuenta"
        variant="outline"
        className="tl-horario"
      />
      {aviso && (
        <p className="tl-aviso" role="alert">
          {aviso} <a href={tallaHref("socio")}>Hazte socio →</a>
        </p>
      )}
    </main>
  );
}

function Socio() {
  const q = useSearchParams();
  const nombre = q.get("plan") ?? "";
  // la tabla de precios de la portada manda el nombre («Familia»); las fichas, el id
  const inicial = CUOTAS.find((c) => c.id === nombre || c.name === nombre)?.id;
  return (
    <main className="tl-pag">
      <Cab titulo="HAZTE SOCIO" texto="Sin matrícula. Cuota mensual sin permanencia; la anual sale más barata (pregúntanos)." />
      <MembershipFlow className="tl-flujo" plans={CUOTAS} initialPlan={inicial} storageKey={SOCIO} club="Talla" scheduleHref={tallaHref("horario")} accountHref={tallaHref("mi-cuenta")} variant="outline" />
    </main>
  );
}

function MiCuenta() {
  return (
    <main className="tl-pag">
      <Cab titulo="MI CUENTA" />
      <MemberArea classes={CLASES} storageKey={SOCIO} club="Talla" plansHref={tallaHref("socio")} scheduleHref={tallaHref("horario")} variant="outline" />
    </main>
  );
}

function Contacto() {
  return (
    <main className="tl-pag">
      <Cab titulo="¿QUIERES SABER MÁS?" texto="Pásate cuando quieras o escríbenos: te contamos todo sin compromiso." />
      <div className="tl-contacto-pag">
        <div>
          <p>
            Calle de Oca 72, 28025 Madrid · Metro Oporto
            <br />
            <a href="tel:+34910000000">910 000 000</a> · <a href="mailto:hola@talla.example">hola@talla.example</a>
          </p>
          <p>
            <b>HORARIO CON PERSONAL</b>
            <br />
            Lunes a viernes: 08:00 – 22:00 · Sábado y domingo: 09:00 – 13:00
          </p>
        </div>
        <ContactForm title="Escríbenos" subtitle="" submitLabel="Enviar" successMessage="Gracias, te escribimos pronto (demostración: no se envía nada)." variant="minimal" className="tl-form" />
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  const espera = <main className="tl-pag" role="status">Cargando…</main>;
  if (!a) return <Portada />;
  if (a === "oferta") return b ? <Ficha id={b} /> : <Oferta />;
  if (a === "horario") return <Suspense fallback={espera}><Horario /></Suspense>;
  if (a === "socio") return <Suspense fallback={espera}><Socio /></Suspense>;
  if (a === "mi-cuenta") return <MiCuenta />;
  if (a === "contacto") return <Contacto />;
  return null;
}
