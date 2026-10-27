"use client";

import dynamic from "next/dynamic";
import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import ActionBar from "@/components/ui/ActionBar";
import AppointmentList from "@/components/ui/AppointmentList";
import BookingFlow from "@/components/ui/BookingFlow";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import OpeningHours from "@/components/ui/OpeningHours";
import Reveal from "@/components/ui/Reveal";
import ShapeMosaic from "@/components/ui/ShapeMosaic";
import { CARTA, EQUIPO, NOTICIAS, SERVICIOS } from "./data";
import { matizHref } from "./enlaces";
import "./matiz.css";

/*
 * Matiz con varias páginas (docs/56): la portada (Matiz.tsx) y servicios con la carta, el método rostro a medida, noticias
 * y artículos, reservar (BookingFlow, con la consulta del método), mis citas y contacto. El marco persiste: la cabecera
 * con el menú oscuro a pantalla completa (su estética en todos los tamaños) y el pie.
 */

const Portada = dynamic(() => import("./Matiz"));
const CLAVE = "trama:matiz:citas";
const HORARIO = "L-D|08:30-18:30";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mz">
      <header className="mz-head">
        <a className="mz-logo" href={matizHref()}>
          Matiz
        </a>
        <nav aria-label="Redes" className="mz-social">
          <a href={matizHref("contacto#redes")}>fb</a>
          <a href={matizHref("contacto#redes")}>ig</a>
          <a href={matizHref("contacto#redes")}>wa</a>
        </nav>
        <a className="mz-cita" href={matizHref("reservar")}>
          pide cita
        </a>
        <FullscreenMenu
          brand="Matiz"
          openLabel="menú"
          closeLabel="cerrar"
          trigger="label"
          rules
          cover
          note="Calle de Sueca 18 · Valencia"
          links={[
            { label: "inicio", href: matizHref() },
            { label: "servicios", href: matizHref("servicios") },
            { label: "método rostro a medida", href: matizHref("metodo"), meta: "la consulta" },
            { label: "noticias", href: matizHref("noticias") },
            { label: "pide cita", href: matizHref("reservar") },
            { label: "mis citas", href: matizHref("mis-citas") },
            { label: "contacto", href: matizHref("contacto") },
          ]}
          footer={[
            { label: "Instagram", href: matizHref("contacto#redes") },
            { label: "WhatsApp", href: matizHref("contacto#redes") },
          ]}
          className="mz-menu"
        />
      </header>
      {children}
      <footer className="mz-foot">
        <div>
          <a href={matizHref("contacto#privacidad")}>Privacidad</a> — <a href={matizHref("contacto#privacidad")}>Cookies</a> — <a href={matizHref("mis-citas")}>Mis citas</a>
          <br />
          hola@matiz.example
          <br />
          T. 960 000 000
        </div>
        <div>
          Calle de Sueca 18
          <br />
          46006 Valencia
        </div>
        <div>
          Todos los días
          <br />
          8:30 – 18:30
        </div>
      </footer>
      <ActionBar
        variant="minimal"
        soft
        actions={[
          { label: "Llamar", href: "tel:+34960000000", icon: "phone" },
          { label: "Mis citas", href: matizHref("mis-citas"), icon: "calendar" },
          { label: "Pide cita", href: matizHref("reservar"), icon: "arrow-right", primary: true },
        ]}
      />
    </div>
  );
}

function Cabecera({ kicker, titulo, children }: { kicker: string; titulo: ReactNode; children?: ReactNode }) {
  return (
    <header className="mz-pag__cab">
      <p className="mz-kicker">{kicker}</p>
      <Reveal kind="slide" direction="up" distance={40} trigger="mount" duration={0.9}>
        <h1>{titulo}</h1>
      </Reveal>
      {children}
    </header>
  );
}

function Servicios() {
  return (
    <main className="mz-pag">
      <Cabecera kicker="carta otoño – invierno 2026" titulo="servicios">
        <p className="mz-entradilla">Cada servicio empieza por una consulta. Los rubios llevan nombre de ciudad porque cada uno tiene su luz.</p>
      </Cabecera>
      <div className="mz-servicios">
        {CARTA.map((sec) => (
          <section key={sec.title} className="mz-servicios__grupo">
            <h2>{sec.title}</h2>
            {sec.note && <p className="mz-nota">{sec.note}</p>}
            <ul>
              {sec.items.map((it) => {
                const s = SERVICIOS.find((x) => x.name === it.name)!;
                return (
                  <li key={it.name}>
                    <div>
                      <strong>{it.name}</strong>
                      <span>{it.description}</span>
                    </div>
                    <span className="mz-precio">
                      {it.price} € · {Math.round(s.minutes / 15) * 15} min
                    </span>
                    <a href={matizHref(`reservar?servicio=${s.id}`)} className="mz-enlace">
                      pide cita ↗
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <p className="mz-nota">Consulta inicial 29 € · gratuita si después pides el servicio. Precios con IVA.</p>
    </main>
  );
}

function Metodo() {
  return (
    <main className="mz-pag mz-pag--metodo">
      <Cabecera kicker="el método" titulo={<>rostro<br />a medida</>}>
        <p className="mz-entradilla">Antes de tocar el pelo, miramos la cara. Tu piel, tus ojos y tu color natural deciden el color que te va: no una foto.</p>
      </Cabecera>
      <ShapeMosaic className="mz-metodo__formas" columns={4} drift={60} dissolve={false} items={[{ shape: "circle", tone: 0 }, { shape: "square", tone: 2 }, { shape: "circle", tone: 3 }, { shape: "square", tone: 1 }]} />
      <ol className="mz-pasos">
        <li>
          <b>01</b>
          <h2>escucha</h2>
          <p>Qué quieres cambiar, cuánto tiempo le dedicas al pelo cada mañana y qué te gustó (o no) de tu último color.</p>
        </li>
        <li>
          <b>02</b>
          <h2>armocromía</h2>
          <p>Telas de colores junto a tu cara, con luz natural, para ver qué tonos te iluminan. Diez minutos que lo cambian todo.</p>
        </li>
        <li>
          <b>03</b>
          <h2>muestras</h2>
          <p>Mechones de muestra junto al rostro. Elegimos entre dos o tres y apuntamos la fórmula en tu ficha.</p>
        </li>
        <li>
          <b>04</b>
          <h2>tu color</h2>
          <p>El día del servicio, la fórmula ya está hecha. Y si en primavera quieres más luz, sabemos de dónde partimos.</p>
        </li>
      </ol>
      <div className="mz-cta">
        <p>Consulta de 45 minutos · 29 € · gratuita si después pides el servicio</p>
        <a href={matizHref("reservar?servicio=consulta")} className="mz-boton">
          reserva tu consulta
        </a>
      </div>
      <EquipoPequeno />
    </main>
  );
}

function EquipoPequeno() {
  return (
    <section className="mz-equipo">
      <h2>quién te atiende</h2>
      <ul>
        {EQUIPO.map((p) => (
          <li key={p.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.photo} alt={p.name} loading="lazy" />
            <strong>{p.name}</strong>
            <small>{p.role}</small>
            <p>{p.bio}</p>
            <a href={matizHref(`reservar?profesional=${p.name}`)} className="mz-enlace">
              pide cita con {p.name} ↗
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Noticias() {
  return (
    <main className="mz-pag">
      <Cabecera kicker="lo que pasa en el atelier" titulo="noticias" />
      <div className="mz-news mz-news--pag">
        {NOTICIAS.map((n) => (
          <a key={n.slug} href={matizHref(`noticias/${n.slug}`)} className="mz-news__card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={n.img} alt="" loading="lazy" />
            <small>{n.fecha}</small>
            <h3>{n.titulo}</h3>
            <p>{n.entradilla}</p>
            <span className="mz-leer">leer</span>
          </a>
        ))}
      </div>
    </main>
  );
}

function Noticia({ slug }: { slug: string }) {
  const i = NOTICIAS.findIndex((x) => x.slug === slug);
  const n = NOTICIAS[i];
  const sig = NOTICIAS[(i + 1) % NOTICIAS.length];
  return (
    <main className="mz-pag mz-noticia">
      <a href={matizHref("noticias")} className="mz-volver">
        ← noticias
      </a>
      <Cabecera kicker={n.fecha} titulo={n.titulo}>
        <p className="mz-entradilla">{n.entradilla}</p>
      </Cabecera>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={n.img} alt="" className="mz-noticia__foto" />
      <div className="mz-noticia__cuerpo">
        {n.cuerpo.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <a href={matizHref("reservar?servicio=consulta")} className="mz-boton">
          reserva tu consulta
        </a>
      </div>
      <a href={matizHref(`noticias/${sig.slug}`)} className="mz-siguiente">
        <small>siguiente</small>
        <span>{sig.titulo} →</span>
      </a>
    </main>
  );
}

function Reservar() {
  const q = useSearchParams();
  return (
    <main className="mz-pag">
      <Cabecera kicker="atelier de color · Ruzafa" titulo="pide cita" />
      <BookingFlow
        key={`${q.get("editar") ?? ""}${q.get("servicio") ?? ""}${q.get("profesional") ?? ""}`}
        className="mz-reserva"
        services={SERVICIOS}
        staff={EQUIPO}
        initialService={q.get("servicio") ?? undefined}
        initialStaff={q.get("profesional") ?? undefined}
        editId={q.get("editar") ?? undefined}
        times="08:30, 09:30, 10:30, 11:30, 12:30, 14:00, 15:00, 16:00"
        closedDays=""
        closesAt={{ 0: "18:30", 1: "18:30", 2: "18:30", 3: "18:30", 4: "18:30", 5: "18:30", 6: "18:30" }}
        storageKey={CLAVE}
        serviceLabel="¿qué te hacemos?"
        staffLabel="¿con quién?"
        anyStaffLabel="me da igual"
        business="Matiz"
        location="Calle de Sueca 18, Valencia"
        appointmentsHref={matizHref("mis-citas")}
        note="Atelier de demostración: no se envía nada y la cita solo se guarda en este navegador. Los servicios largos solo caben por la mañana."
      />
    </main>
  );
}

function MisCitas() {
  return (
    <main className="mz-pag">
      <Cabecera kicker="guardadas en este navegador" titulo="mis citas" />
      <AppointmentList services={SERVICIOS} storageKey={CLAVE} bookHref={matizHref("reservar")} business="Matiz" location="Calle de Sueca 18, Valencia" emptyTitle="aún no tienes cita" emptyText="Empieza por la consulta rostro a medida: 45 minutos para encontrar tu color." />
    </main>
  );
}

function Contacto() {
  return (
    <main className="mz-pag">
      <Cabecera kicker="Calle de Sueca 18 · 46006 Valencia" titulo="contacto" />
      <div className="mz-contacto">
        <div className="mz-contacto__datos">
          <OpeningHours hours={HORARIO} title="horario" variant="minimal" />
          <p>
            hola@matiz.example
            <br />
            T. 960 000 000
          </p>
          <p className="mz-nota">Metro Bailén y Xàtiva · aparcamiento en la calle de Cuba</p>
          <div id="redes" className="mz-redes">
            <h2>redes</h2>
            <p>Instagram @matiz.atelier · Facebook Matiz Atelier · WhatsApp 600 000 000</p>
            <p className="mz-nota">Perfiles de demostración: no existen.</p>
          </div>
        </div>
        <ContactForm title="escríbenos" subtitle="Dudas sobre el color, trabajo en el atelier o regalos. Te contestamos en un día." fields="name, email, message" submitLabel="enviar" successTitle="gracias" successMessage="Te contestamos en un día (demostración: no se envía nada)." variant="minimal" className="mz-form" />
      </div>
      <section id="privacidad" className="mz-legal">
        <h2>privacidad y cookies</h2>
        <p>Matiz es un atelier de demostración de Trama. Esta web no envía ni guarda tus datos en ningún servidor: las citas se quedan en tu navegador y puedes borrarlas desde «mis citas». No usamos cookies de seguimiento.</p>
      </section>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "servicios") return <Servicios />;
  if (a === "metodo") return <Metodo />;
  if (a === "noticias") return b ? <Noticia slug={b} /> : <Noticias />;
  if (a === "reservar")
    return (
      <Suspense fallback={<main className="mz-pag" role="status">preparando tu cita…</main>}>
        <Reservar />
      </Suspense>
    );
  if (a === "mis-citas") return <MisCitas />;
  if (a === "contacto") return <Contacto />;
  return null;
}
