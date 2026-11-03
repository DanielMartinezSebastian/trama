"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { FOTOS, NOTICIAS, PROYECTOS, SECTORES, type Sector } from "./data";
import { soleraHref } from "./enlaces";
import "./solera.css";

/*
 * Solera Arquitectura (docs/59), a partir de LPAS: estudio de arquitectura e interiores. Blanco y negro con una grotesca
 * neutra (Aeonik → Geist) y una fila de cinco paneles por sector, foto arriba y bloque de color tierra abajo, que se
 * ensanchan al pasar. El botón del menú es una píldora oscura y el menú, un panel negro a la derecha. Flujos: filtrar
 * proyectos por sector y escribir al estudio.
 */

const NAV: [string, string][] = [
  ["proyectos", "Proyectos"],
  ["estudio", "Estudio"],
  ["noticias", "Noticias"],
  ["contacto", "Contacto"],
];
const sectorDe = (id: string) => SECTORES.find((s) => s.id === id)!;

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  return (
    <div className={`so ${ruta ? "" : "so--inicio"}`} id="top">
      <header className="so-head">
        <a href={soleraHref()} className="so-logo" aria-label="Solera, inicio">
          SOL<i>/</i>ERA
        </a>
        <FullscreenMenu
          trigger="pill"
          layout="sheet"
          tone="fg"
          reveal="slide"
          size="sm"
          className="so-menu"
          brand="Solera"
          openLabel="Menú"
          closeLabel="Cerrar"
          note="Sevilla · Bilbao"
          links={[
            ...SECTORES.map((s) => ({ label: s.n, href: soleraHref(`sectores/${s.id}`), meta: "Sector" })),
            { label: "Todos los proyectos", href: soleraHref("proyectos") },
            ...NAV.slice(1).map(([p, l]) => ({ label: l, href: soleraHref(p) })),
          ]}
          footer={[
            { label: "Instagram", href: "#" },
            { label: "LinkedIn", href: "#" },
          ]}
        />
      </header>
      {children}
      <footer className="so-pie">
        <div className="so-pie__ciudades">
          <div>
            <b>Sevilla</b>
            <span>Calle Feria 120, 41002</span>
            <span>954 000 000</span>
          </div>
          <div>
            <b>Bilbao</b>
            <span>Calle Iparraguirre 34, 48010</span>
            <span>944 000 000</span>
          </div>
        </div>
        <nav aria-label="Pie">
          {NAV.map(([p, l]) => (
            <a key={p} href={soleraHref(p)}>
              {l}
            </a>
          ))}
        </nav>
        <small>Solera Arquitectura · estudio de demostración de Trama. Proyectos, clientes y premios inventados.</small>
      </footer>
    </div>
  );
}

function Panel({ s, i }: { s: Sector; i: number }) {
  return (
    <a href={soleraHref(`sectores/${s.id}`)} className="so-panel" style={{ "--c": s.color, "--t": s.tinta } as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.img} alt="" loading="lazy" />
      <div>
        <span className="so-mas" aria-hidden>
          +
        </span>
        <b>{s.n}</b>
        <small>
          {i + 1}/{SECTORES.length}
        </small>
        <em>{s.lema}</em>
      </div>
    </a>
  );
}

function Portada() {
  return (
    <main>
      <section className="so-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.portada} alt="El estudio de Solera en Sevilla" />
        <p className="so-hero__a">Arquitectura + Interiores</p>
        <p className="so-hero__b">Un estudio que empieza por el proceso</p>
        <p className="so-hero__c">Sevilla</p>
        <p className="so-hero__d">Bilbao</p>
      </section>

      <section className="so-intro">
        <p className="so-chico">
          Escuchar. Planificar.
          <br />
          Analizar. Dar forma.
        </p>
        <div>
          <p>En Solera diseñamos con la gente en el centro de cada decisión. La buena arquitectura empieza por escuchar de verdad a los vecinos, estudiantes, familias y equipos que vivirán, aprenderán y crecerán en lo que construimos. El proceso es abierto, honesto y siempre compartido.</p>
          <a href={soleraHref("estudio")} className="so-flecha">
            Más sobre nosotros <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      <section className="so-paneles" aria-label="Sectores">
        {SECTORES.map((s, i) => (
          <Panel key={s.id} s={s} i={i} />
        ))}
      </section>

      <section className="so-lema">
        <p>
          Proceso claro. <span>Resultado creativo.</span> Centrado en las personas. <span>Abierto y colaborativo.</span>
        </p>
      </section>

      <Seleccion />

      <section className="so-noticias">
        <h2>Últimas noticias</h2>
        <ul>
          {NOTICIAS.slice(0, 3).map((n) => (
            <li key={n.t}>
              <span>{n.f}</span>
              <b>{n.t}</b>
            </li>
          ))}
        </ul>
        <a href={soleraHref("noticias")} className="so-flecha">
          Todas las noticias <span aria-hidden>→</span>
        </a>
      </section>
    </main>
  );
}

function Seleccion({ todo = false }: { todo?: boolean }) {
  const [sector, setSector] = useState("");
  const lista = PROYECTOS.filter((p) => !sector || p.sector === sector);
  const cuenta = (id: string) => PROYECTOS.filter((p) => p.sector === id).length;
  return (
    <section className="so-seleccion">
      {!todo && <h2>Una selección de nuestro trabajo</h2>}
      <div className="so-filtro" role="group" aria-label="Filtrar por sector">
        <button type="button" aria-pressed={!sector} onClick={() => setSector("")}>
          Todos <sup>{PROYECTOS.length}</sup>
        </button>
        {SECTORES.map((s) => (
          <button key={s.id} type="button" aria-pressed={sector === s.id} onClick={() => setSector(s.id)}>
            {s.n} <sup>{cuenta(s.id)}</sup>
          </button>
        ))}
      </div>
      <div className="so-rejilla" aria-live="polite">
        {lista.map((p, i) => (
          <a key={p.id} href={soleraHref(`proyectos/${p.id}`)} className={i === 0 ? "so-rejilla__grande" : ""}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt="" loading="lazy" />
            <b>{p.n}</b>
            <span>{p.lugar}</span>
          </a>
        ))}
        {!lista.length && <p>No hay proyectos en este sector todavía.</p>}
      </div>
    </section>
  );
}

const Cab = ({ titulo, texto, etiqueta }: { titulo: string; texto?: string; etiqueta?: string }) => (
  <header className="so-cab">
    {etiqueta && <p className="so-chico">{etiqueta}</p>}
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function Proyectos() {
  return (
    <main className="so-pag">
      <Cab etiqueta="Portfolio" titulo="Proyectos" texto="Vivienda, educación, equipamientos e interiores en Andalucía y el País Vasco." />
      <Seleccion todo />
    </main>
  );
}

function Proyecto({ id }: { id: string }) {
  const p = PROYECTOS.find((x) => x.id === id);
  if (!p) return <NoHay />;
  const s = sectorDe(p.sector);
  const otros = PROYECTOS.filter((x) => x.id !== p.id).slice(0, 3);
  return (
    <main className="so-pag">
      <Cab etiqueta={s.n} titulo={p.n} texto={p.lugar} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.img} alt="" className="so-ancha" />
      <div className="so-ficha">
        <dl>
          {[
            ["Cliente", p.cliente],
            ["Lugar", p.lugar],
            ["Superficie", p.m2],
            ["Año", String(p.anio)],
            ["Sector", s.n],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="so-grande">{p.texto}</p>
      </div>
      <section className="so-otros">
        <h2 className="so-chico">Otros proyectos</h2>
        <div className="so-rejilla">
          {otros.map((o) => (
            <a key={o.id} href={soleraHref(`proyectos/${o.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.img} alt="" loading="lazy" />
              <b>{o.n}</b>
              <span>{o.lugar}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function SectorPag({ id }: { id: string }) {
  const s = SECTORES.find((x) => x.id === id);
  if (!s) return <NoHay />;
  const lista = PROYECTOS.filter((p) => p.sector === id);
  return (
    <main className="so-pag">
      <section className="so-sector" style={{ "--c": s.color, "--t": s.tinta } as CSSProperties}>
        <p className="so-chico">Sector {SECTORES.indexOf(s) + 1}/{SECTORES.length}</p>
        <h1>{s.n}</h1>
        <p className="so-grande">{s.texto}</p>
      </section>
      <div className="so-rejilla so-rejilla--pag">
        {lista.map((p) => (
          <a key={p.id} href={soleraHref(`proyectos/${p.id}`)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt="" loading="lazy" />
            <b>{p.n}</b>
            <span>{p.lugar}</span>
          </a>
        ))}
      </div>
      <nav className="so-sectores" aria-label="Otros sectores">
        {SECTORES.filter((x) => x.id !== id).map((x) => (
          <a key={x.id} href={soleraHref(`sectores/${x.id}`)} style={{ background: x.color, color: x.tinta }}>
            {x.n}
          </a>
        ))}
      </nav>
    </main>
  );
}

function Estudio() {
  return (
    <main className="so-pag">
      <Cab etiqueta="Estudio" titulo="Treinta y dos personas, dos oficinas" texto="Fundado en Sevilla en 1998; en Bilbao desde 2014." />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FOTOS.equipo} alt="El equipo revisando maquetas" className="so-ancha" />
      <section className="so-valores">
        {[
          ["Escuchar", "Cada proyecto empieza con talleres con quien lo va a usar."],
          ["Planificar", "Calendario y presupuesto compartidos desde el primer día."],
          ["Analizar", "Medimos luz, energía y uso antes de dibujar la fachada."],
          ["Dar forma", "La forma es el resultado, no el punto de partida."],
        ].map(([t, d], i) => (
          <div key={t}>
            <small>0{i + 1}</small>
            <b>{t}</b>
            <p>{d}</p>
          </div>
        ))}
      </section>
      <div className="so-ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.maqueta} alt="Maqueta de trabajo" />
        <p className="so-grande">Somos una cooperativa de trabajo: las decisiones del estudio se toman entre todas las personas que lo forman.</p>
      </div>
    </main>
  );
}

function Noticias() {
  return (
    <main className="so-pag">
      <Cab etiqueta="Actualidad" titulo="Noticias" />
      <ul className="so-lista-noticias">
        {NOTICIAS.map((n) => (
          <li key={n.t}>
            <span>{n.f}</span>
            <b>{n.t}</b>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Contacto() {
  return (
    <main className="so-pag">
      <Cab etiqueta="Contacto" titulo="Hablemos de tu proyecto" texto="Contestamos en dos días laborables. Para empleo, escribe a equipo@solera.example." />
      <div className="so-ficha">
        <div className="so-pie__ciudades so-pie__ciudades--pag">
          <div>
            <b>Sevilla</b>
            <span>Calle Feria 120, 41002</span>
            <span>954 000 000</span>
          </div>
          <div>
            <b>Bilbao</b>
            <span>Calle Iparraguirre 34, 48010</span>
            <span>944 000 000</span>
          </div>
        </div>
        <ContactForm title="" subtitle="" messagePlaceholder="Cuéntanos qué quieres construir, dónde y para cuándo" submitLabel="Enviar" successTitle="Gracias" successMessage="Te contestamos en dos días laborables." variant="minimal" />
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="so-pag">
      <Cab titulo="Este plano no existe" texto="Vuelve al inicio o mira los proyectos." />
      <a href={soleraHref("proyectos")} className="so-flecha so-solo">
        Ver proyectos <span aria-hidden>→</span>
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "proyectos" && b) return <Proyecto id={b} />;
  if (a === "sectores" && b) return <SectorPag id={b} />;
  const P = { proyectos: Proyectos, estudio: Estudio, noticias: Noticias, contacto: Contacto }[a];
  return P ? <P /> : <NoHay />;
}
