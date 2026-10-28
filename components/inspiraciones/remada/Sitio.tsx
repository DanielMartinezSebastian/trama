"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import ChatWidget from "@/components/ui/ChatWidget";
import CohortList from "@/components/ui/CohortList";
import ContactForm from "@/components/ui/ContactForm";
import EnrollmentFlow from "@/components/ui/EnrollmentFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { money } from "@/lib/commerce/money";
import { VIAJES, VLOGS } from "./data";
import { remadaHref } from "./enlaces";
import "./remada.css";

/*
 * Remada con varias páginas (docs/56): la portada (Remada.tsx) y el calendario de viajes con la ficha de cada viaje y su
 * solicitud (EnrollmentFlow con señal), las clases en línea (envío del vídeo para analizar y el curso), los vlogs y
 * contacto. El marco persiste: la cinta, el avatar fijo, la navegación con flechas (menú a pantalla completa en el
 * móvil), el pie y el chat de Lucía (ChatWidget por reglas).
 */

const Portada = dynamic(() => import("./Remada"));
const NIVELES = ["principiante", "intermedio", "avanzado"];
const NAV: [string, string][] = [
  ["viajes", "calendario de viajes"],
  ["#sobre-mi", "sobre mí"],
  ["online", "clases en línea"],
  ["#opiniones", "opiniones"],
  ["vlogs", "vlogs"],
  ["contacto", "contacto"],
];
const enlace = (p: string) => (p.startsWith("#") ? `${remadaHref()}${p}` : remadaHref(p));

const REGLAS = `viaje, viajes, fechas, calendario, cuando => hay cuatro destinos: mentawai (diciembre y enero), corea (mayo y septiembre), hainan (noviembre y febrero) y g-land (2027). [ver el calendario](${remadaHref("viajes")}) || precios, ¿soy principiante?
precio, precios, cuesta, cuanto, señal => desde ${money(2300)} (g-land) hasta ${money(2890)} (corea). reservas con una señal de 400–500 € y el resto lo pagas al llegar. || viajes, ¿qué incluye?
principiante, empezar, nivel, nunca => para empezar, los viajes de ola artificial (corea y hainan): olas iguales y por niveles. [corea](${remadaHref("viajes/corea")}) · [hainan](${remadaHref("viajes/hainan")}) || precios, clases en línea
incluye, alojamiento, comida, vuelo, vuelos => alojamiento, sesiones guiadas, vídeo y análisis, surfskate y traslados locales. los vuelos van aparte. || precios, viajes
online, linea, video, analisis, curso => en línea puedes mandarme un vídeo para analizarlo o hacer el curso a tu ritmo; la primera clase es un regalo. [clases en línea](${remadaHref("online")}) || precios, viajes
hola, buenas => ¡hola! ¿te ayudo con algún viaje o con las clases en línea? || viajes, clases en línea`;

export function Shell({ children }: { children: ReactNode }) {
  const links = [{ label: "inicio", href: remadaHref() }, ...NAV.map(([p, l]) => ({ label: l, href: enlace(p) }))];
  return (
    <div className="rm" id="top">
      <div className="rm-cinta-top">
        <span>
          <b>es</b> en
        </span>
      </div>
      <a href={remadaHref()} className="rm-avatar" aria-label="Remada, inicio">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/inspiraciones/remada/autora.webp" alt="" />
        <span>
          Lucía
          <br />
          Mar
        </span>
      </a>
      <nav className="rm-nav" aria-label="Principal">
        {NAV.map(([p, l]) => (
          <a key={p} href={enlace(p)}>
            → {l}
          </a>
        ))}
      </nav>
      <a href={remadaHref("contacto")} className="rm-escribeme">
        • escríbeme
      </a>
      <div className="rm-movil">
        <FullscreenMenu brand="remada" trigger="burger" openLabel="menú" closeLabel="cerrar" note="viajes de surf de autora" links={links} className="rm-menu" />
      </div>
      {children}
      <footer className="rm-pie">
        <nav aria-label="Pie">
          <b>navegación</b>
          {NAV.map(([p, l]) => (
            <a key={p} href={enlace(p)}>
              {l}
            </a>
          ))}
        </nav>
        <nav aria-label="Viajes">
          <b>viajes</b>
          {VIAJES.map((v) => (
            <a key={v.id} href={remadaHref(`viajes/${v.id}`)}>
              {v.title.toLowerCase()}
            </a>
          ))}
        </nav>
        <a href="#top" className="rm-pie__arriba">
          volver arriba ↑
        </a>
        <small>viajes de demostración de Trama · © 2026 remada</small>
      </footer>
      <ChatWidget title="lucía" subtitle="te contesto yo" greeting="¡hola! soy lucía. ¿buscas viaje o clases en línea?" quickReplies="viajes, precios, ¿soy principiante?, clases en línea" rules={REGLAS} fallback="eso prefiero contártelo yo: escríbeme desde contacto y te respondo hoy." placeholder="escribe aquí…" launcherLabel="escríbeme" avatar="/img/inspiraciones/remada/autora.webp" variant="minimal" className="rm-chat" />
    </div>
  );
}

function Cab({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <header className="rm-pag__cab">
      <h1>{titulo}</h1>
      {texto && <p>{texto}</p>}
    </header>
  );
}

function Viajes() {
  return (
    <main className="rm-pag">
      <Cab titulo="(calendario de viajes)" texto="cuatro destinos con olas constantes. elige fechas, mira qué incluye y reserva tu plaza con una señal." />
      <CohortList programs={VIAJES} layout="rows" cta="saber más" variant="minimal" className="rm-lista" statusLabels={{ open: "plazas abiertas", few: "últimas plazas", soon: "fechas en breve" }} />
      <p className="rm-pag__nota">
        ¿no sabes cuál? si empiezas, los de ola artificial; si ya giras, mentawai o g-land. <a href={remadaHref("contacto")}>pregúntame →</a>
      </p>
    </main>
  );
}

function Viaje({ id }: { id: string }) {
  const v = VIAJES.find((x) => x.id === id)!;
  return (
    <main className="rm-pag">
      <a href={remadaHref("viajes")} className="rm-volver">
        ← calendario de viajes
      </a>
      <div className="rm-ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={v.image} alt="" />
        <div>
          <h1>{v.title}</h1>
          <p className="rm-ficha__niveles">{v.levels?.join(" · ")}</p>
          <p>{v.summary}</p>
          <p className="rm-ficha__precio">
            {money(v.precio)} <small>· señal de {money(v.senal)}</small>
          </p>
          <h2>
            <span className="rm-naranja">*</span>incluye
          </h2>
          <ul>
            {v.incluye.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h2>
            <span className="rm-naranja">*</span>un día normal
          </h2>
          <ul>
            {v.dia.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <h2 className="rm-pag__sub">(reserva tu plaza)</h2>
      <EnrollmentFlow className="rm-flujo" program={v.title} cohorts={v.fechas} levels={NIVELES.filter((n) => !v.levels || v.levels.includes(n))} price={v.precio} deposit={v.senal} question="¿qué quieres mejorar en este viaje?" storageKey="trama:remada:viajes" variant="minimal" />
    </main>
  );
}

function Analisis() {
  const [video, setVideo] = useState<{ url: string; nombre: string } | null>(null);
  const [hecho, setHecho] = useState("");
  useEffect(() => () => { if (video) URL.revokeObjectURL(video.url); }, [video]);
  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!video) return;
    const correo = String(new FormData(e.currentTarget).get("correo") ?? "");
    setHecho(`AN-${1000 + (Date.now() % 9000)} · te mando el análisis a ${correo} en 72 horas.`);
  };
  if (hecho)
    return (
      <div className="rm-analisis rm-analisis--hecho" role="status">
        <h3>¡recibido!</h3>
        <p>{hecho} (demostración: no se envía nada.)</p>
        <button type="button" className="rm-leer" onClick={() => { setHecho(""); setVideo(null); }}>
          [mandar otro vídeo]
        </button>
      </div>
    );
  return (
    <form className="rm-analisis" onSubmit={enviar}>
      <label className="rm-subida">
        <input type="file" accept="video/*" required onChange={(e) => { const f = e.target.files?.[0]; setVideo(f ? { url: URL.createObjectURL(f), nombre: f.name } : null); }} />
        {video ? <video src={video.url} controls muted playsInline /> : <span>sube tu vídeo surfeando (hasta 2 minutos) →</span>}
        {video && <small>{video.nombre}</small>}
      </label>
      <div className="rm-analisis__datos">
        <label>
          nombre
          <input name="nombre" required autoComplete="name" />
        </label>
        <label>
          correo
          <input name="correo" type="email" required autoComplete="email" />
        </label>
        <label>
          nivel
          <select name="nivel" defaultValue="intermedio">
            {NIVELES.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          ¿qué te gustaría corregir?
          <textarea name="duda" rows={3} />
        </label>
        <p className="rm-pag__nota">primer análisis gratis; los siguientes, {money(35)}.</p>
        <button type="submit" className="rm-boton" disabled={!video}>
          enviar para analizar →
        </button>
      </div>
    </form>
  );
}

function Online() {
  return (
    <main className="rm-pag">
      <Cab titulo="(clases en línea)" texto="el método sin moverte de casa: mándame tu vídeo y te digo qué corregir, o haz el curso a tu ritmo." />
      <section id="analisis" className="rm-pag__bloque">
        <h2 className="rm-pag__sub">analicemos tus errores en línea</h2>
        <Analisis />
      </section>
      <section id="curso" className="rm-pag__bloque">
        <h2 className="rm-pag__sub">el curso: 12 lecciones de técnica y surfskate</h2>
        <p>vídeo, ejercicios en tierra y una revisión mía al terminar. la primera lección es gratis.</p>
        <EnrollmentFlow className="rm-flujo" program="curso en línea de remada" cohorts={[{ label: "acceso inmediato", dates: "a tu ritmo · 12 lecciones", status: "open" }, { label: "grupo de enero", dates: "con directos los jueves · desde el 14.01", status: "few", seats: 4 }]} levels={NIVELES} deposit={89} question="¿dónde surfeas normalmente?" storageKey="trama:remada:curso" variant="minimal" />
      </section>
    </main>
  );
}

function Vlogs() {
  return (
    <main className="rm-pag">
      <Cab titulo="(vlogs)" texto="cada viaje, contado desde dentro." />
      <div className="rm-vlogs rm-vlogs--pag">
        {VLOGS.map((v) => (
          <article key={v.slug} id={v.slug}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.img} alt="" loading="lazy" />
            <div>
              <b>{v.t}</b>
              <small>{v.f}</small>
              <p>{v.texto}</p>
              <a href={remadaHref(`viajes/${v.slug}`)} className="rm-leer">
                [ver el viaje →]
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function Contacto() {
  return (
    <main className="rm-pag">
      <section className="rm-contacto">
        <h2>contacto</h2>
        <div className="rm-contacto__cuerpo">
          <p>
            instagram <b>@luciamar.surf</b>
            <br />
            telegram <b>@luciamar</b>
            <br />
            te contesto en menos de un día.
          </p>
          <div className="rm-contacto__form">
            <ContactForm title="déjame tus datos y te escribo pronto" subtitle="" submitLabel="enviar →" successMessage="¡gracias! te escribo enseguida." variant="minimal" />
          </div>
        </div>
      </section>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "viajes") return b ? <Viaje id={b} /> : <Viajes />;
  if (a === "online") return <Online />;
  if (a === "vlogs") return <Vlogs />;
  if (a === "contacto") return <Contacto />;
  return null;
}
