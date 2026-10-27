"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Outfit } from "next/font/google";
import Accordion from "@/components/ui/Accordion";
import ActionBar from "@/components/ui/ActionBar";
import AppointmentList from "@/components/ui/AppointmentList";
import BookingFlow from "@/components/ui/BookingFlow";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import OpeningHours from "@/components/ui/OpeningHours";
import { EQUIPO, SERVICIOS, TECNICAS, TRABAJOS, WHATSAPP } from "./data";
import { raizHref } from "./enlaces";
import { Whatsapp } from "./Raiz";
import "./raiz.css";

// Outfit, la sans fina del original, es libre: se carga en la réplica (docs/cuaderno/replica-raiz.md)
const outfit = Outfit({ weight: ["300", "500"], subsets: ["latin"], variable: "--rz-outfit", display: "swap" });

/*
 * Raíz con varias páginas (docs/56): la portada (Raiz.tsx) y servicios con la ficha de cada técnica, trabajos filtrables,
 * la consulta (foto de tu pelo con vista previa local y hora en el salón con BookingFlow), mis citas y contacto. WhatsApp
 * abre un chat de verdad con el mensaje escrito. El marco persiste: la cabecera (menú a pantalla completa en el móvil) y
 * el pie con la consulta.
 */

const Portada = dynamic(() => import("./Raiz"));
const CITAS = "trama:raiz:citas";
const HORARIO = "L|cerrado\nM-S|09:30-19:30\nD|cerrado";
const NAV: [string, string][] = [["servicios", "Servicios"], ["trabajos", "Trabajos"], ["consulta", "Consulta"], ["mis-citas", "Mis citas"], ["contacto", "Contacto"]];

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className={`rz ${outfit.variable}`}>
      <header className="rz-head">
        <a href={raizHref()} className="rz-logo">
          <span aria-hidden>R</span>
          <b>
            Raíz<small>Concept Salon</small>
          </b>
        </a>
        <nav aria-label="Principal" className="rz-nav">
          {NAV.map(([p, l]) => (
            <a key={p} href={raizHref(p)} aria-current={path.startsWith(raizHref(p)) ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <Whatsapp />
        <FullscreenMenu brand="Raíz" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Calle del Doctor Sumsi 14 · Valencia" links={[{ label: "Inicio", href: raizHref() }, ...NAV.map(([p, l]) => ({ label: l, href: raizHref(p) }))]} footer={[{ label: "WhatsApp", href: WHATSAPP() }]} className="rz-menu" />
      </header>
      {children}
      <footer className="rz-pie" id="contacto">
        <div>
          <h2>Pide tu consulta</h2>
          <p className="rz-intro">Escríbenos por WhatsApp con una foto de tu pelo con luz natural, o reserva la consulta gratis en el salón.</p>
          <div className="rz-botones">
            <Whatsapp texto="Escribir por WhatsApp" />
            <a href={raizHref("consulta")} className="rz-borde">
              Reservar la consulta
            </a>
          </div>
        </div>
        <div className="rz-datos">
          <p>
            Calle del Doctor Sumsi 14
            <br />
            46005 Valencia
          </p>
          <p>
            Martes a sábado
            <br />
            9:30 – 19:30
          </p>
          <p>
            <a href="mailto:hola@raiz.example">hola@raiz.example</a>
          </p>
        </div>
      </footer>
      <ActionBar
        variant="minimal"
        soft
        actions={[
          { label: "WhatsApp", href: WHATSAPP(), icon: "message" },
          { label: "Trabajos", href: raizHref("trabajos"), icon: "image" },
          { label: "Consulta", href: raizHref("consulta"), icon: "calendar", primary: true },
        ]}
      />
    </div>
  );
}

function Cabecera({ kicker, titulo, intro }: { kicker: string; titulo: ReactNode; intro?: string }) {
  return (
    <header className="rz-pag__cab">
      <span className="rz-raya" aria-hidden />
      <p className="rz-kicker">{kicker}</p>
      <h1>{titulo}</h1>
      {intro && <p className="rz-intro">{intro}</p>}
    </header>
  );
}

function Servicios() {
  return (
    <main className="rz-pag">
      <Cabecera kicker="Tres técnicas de aplicación" titulo="Servicios" intro="Todo parte de una consulta en el salón: método, largo y color se deciden juntos frente al espejo." />
      <div className="rz-tarjetas">
        {TECNICAS.map((t, i) => (
          <a key={t.id} href={raizHref(`servicios/${t.id}`)} className="rz-tarjeta">
            <span className="rz-num">{String(i + 1).padStart(2, "0")}</span>
            <h3>{t.titulo}</h3>
            <p>{t.texto}</p>
            <div className="rz-desde">
              <small>Desde</small>
              <b>{t.desde} €</b>
            </div>
          </a>
        ))}
      </div>
      <section className="rz-otros">
        <h2>Otros servicios del salón</h2>
        <ul className="rz-lista">
          {SERVICIOS.map((s) => (
            <li key={s.id}>
              <span>
                <b>{s.name}</b>
                <small>{s.description}</small>
              </span>
              <span>{s.price ? `${s.from ? "desde " : ""}${s.price} €` : "gratis"}</span>
              <a href={raizHref(`consulta?servicio=${s.id}`)}>Reservar →</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Tecnica({ id }: { id: string }) {
  const t = TECNICAS.find((x) => x.id === id)!;
  const otras = TECNICAS.filter((x) => x.id !== id);
  return (
    <main className="rz-pag">
      <a href={raizHref("servicios")} className="rz-volver">
        ← Servicios
      </a>
      <div className="rz-ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.img} alt="" />
        <div>
          <Cabecera kicker={`Desde ${t.desde} € · dura ${t.dura}`} titulo={t.titulo} intro={t.texto} />
          <p className="rz-para">
            <b>Para quién:</b> {t.para}
          </p>
          <ol className="rz-pasos">
            {t.pasos.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
          <div className="rz-botones">
            <a href={raizHref(`consulta?tecnica=${t.id}`)} className="rz-wa">
              <span aria-hidden>✆</span>Pide tu consulta
            </a>
            <a href={raizHref(`trabajos?tecnica=${t.id}`)} className="rz-borde">
              Ver trabajos
            </a>
          </div>
        </div>
      </div>
      <Accordion
        className="rz-faq"
        presentation="lines"
        variant="minimal"
        items={[
          "¿Se notan las uniones?|Bien colocadas y con el color fundido, no: ni con el pelo recogido. Por eso empezamos siempre por la consulta.",
          "¿Estropean mi pelo?|Lo que lo estropea es el peso mal repartido y una mala retirada. Calculamos la cantidad para tu pelo y las quitamos nosotras.",
          "¿Cuánto cuesta el mantenimiento?|La revisión cuesta 70 € y se hace cada 6 a 8 semanas según el método.",
        ].join("\n")}
      />
      <nav className="rz-mas" aria-label="Otras técnicas">
        {otras.map((x) => (
          <a key={x.id} href={raizHref(`servicios/${x.id}`)}>
            {x.titulo} →
          </a>
        ))}
      </nav>
    </main>
  );
}

function Trabajos() {
  const q = useSearchParams();
  const [filtro, setFiltro] = useState(q.get("tecnica") ?? "todas");
  const lista = TRABAJOS.filter((t) => filtro === "todas" || t.tecnica === filtro);
  return (
    <main className="rz-pag">
      <Cabecera kicker="Fotos del salón" titulo="Los trabajos" intro="Cada cabeza es un trabajo distinto. Filtra por técnica." />
      <div className="rz-filtros" role="group" aria-label="Filtrar por técnica">
        {[["todas", "Todas"], ...TECNICAS.map((t) => [t.id, t.titulo.replace("Extensiones ", "")])].map(([id, l]) => (
          <button key={id} type="button" aria-pressed={filtro === id} onClick={() => setFiltro(id)}>
            {l}
          </button>
        ))}
      </div>
      <p className="rz-kicker" aria-live="polite">
        {lista.length} {lista.length === 1 ? "trabajo" : "trabajos"}
      </p>
      <div className="rz-rejilla rz-rejilla--filtrada" key={filtro}>
        {lista.map((t) => (
          <figure key={t.img}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.img} alt="" loading="lazy" />
            <figcaption>· {t.pie}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}

function Foto() {
  const [url, setUrl] = useState("");
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return (
    <div className="rz-foto">
      <label className="rz-borde">
        {url ? "Cambiar la foto" : "Añadir una foto de tu pelo"}
        <input type="file" accept="image/*" className="ui-sr" onChange={(e) => { const f = e.target.files?.[0]; if (f) setUrl(URL.createObjectURL(f)); }} />
      </label>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Tu foto" />
      )}
      <small>La foto se queda en tu navegador: no se sube a ningún sitio. En una web real llegaría al salón con la reserva.</small>
    </div>
  );
}

function Consulta() {
  const q = useSearchParams();
  const tecnica = TECNICAS.find((t) => t.id === q.get("tecnica"));
  return (
    <main className="rz-pag">
      <Cabecera kicker="Gratis y sin compromiso" titulo={<>Pide tu <em>consulta</em></>} intro={tecnica ? `Te interesa: ${tecnica.titulo.toLowerCase()}. En la consulta vemos si es el método para tu pelo.` : "Treinta minutos en el salón para valorar tu pelo y elegir método, largo y color."} />
      <Foto />
      <BookingFlow
        key={`${q.get("editar") ?? ""}${q.get("servicio") ?? ""}`}
        className="rz-flujo"
        services={SERVICIOS}
        staff={EQUIPO}
        initialService={q.get("servicio") ?? "consulta"}
        editId={q.get("editar") ?? undefined}
        times="09:30, 10:30, 11:30, 12:30, 16:00, 17:00, 18:00"
        closedDays="0,1"
        storageKey={CITAS}
        serviceLabel="¿Qué necesitas?"
        staffLabel="¿Con quién?"
        business="Raíz Concept Salon"
        location="Calle del Doctor Sumsi 14, Valencia"
        appointmentsHref={raizHref("mis-citas")}
        note="Salón de demostración: no se envía nada y la cita solo se guarda en este navegador."
      />
      <p className="rz-intro">
        ¿Prefieres escribir? <a href={WHATSAPP(tecnica ? `Hola, me interesan las ${tecnica.titulo.toLowerCase()}.` : undefined)} target="_blank" rel="noopener noreferrer" className="rz-enlace">Abrir WhatsApp ↗</a>
      </p>
    </main>
  );
}

function MisCitas() {
  return (
    <main className="rz-pag">
      <Cabecera kicker="Guardadas en este navegador" titulo="Mis citas" />
      <AppointmentList services={SERVICIOS} storageKey={CITAS} bookHref={raizHref("consulta")} business="Raíz Concept Salon" location="Calle del Doctor Sumsi 14, Valencia" emptyTitle="Aún no tienes cita" emptyText="Empieza por la consulta: es gratis y sales sabiendo qué método te va." />
    </main>
  );
}

function Contacto() {
  return (
    <main className="rz-pag">
      <Cabecera kicker="Valencia · barrio de Ruzafa" titulo="Contacto" />
      <div className="rz-contacto">
        <div>
          <OpeningHours hours={HORARIO} title="Horario" variant="minimal" />
          <p className="rz-intro">
            Calle del Doctor Sumsi 14, 46005 Valencia
            <br />
            hola@raiz.example
          </p>
          <Whatsapp texto="Escribir por WhatsApp" />
        </div>
        <ContactForm title="Escríbenos" subtitle="Dudas sobre un método, una retirada o un presupuesto." fields="name, email, message" submitLabel="Enviar" successTitle="Gracias" successMessage="Te contestamos hoy (demostración: no se envía nada)." variant="minimal" className="rz-form" />
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  const espera = <main className="rz-pag" role="status">Cargando…</main>;
  if (!a) return <Portada />;
  if (a === "servicios") return b ? <Tecnica id={b} /> : <Servicios />;
  if (a === "trabajos") return <Suspense fallback={espera}><Trabajos /></Suspense>;
  if (a === "consulta") return <Suspense fallback={espera}><Consulta /></Suspense>;
  if (a === "mis-citas") return <MisCitas />;
  if (a === "contacto") return <Contacto />;
  return null;
}
