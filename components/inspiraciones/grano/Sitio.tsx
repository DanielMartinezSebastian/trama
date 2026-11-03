"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Reveal from "@/components/ui/Reveal";
import { CLIENTES, ESTUDIO, PROYECTOS, SERVICIOS, type Proyecto } from "./data";
import { granoHref } from "./enlaces";
import "./grano.css";

/*
 * Grano (docs/60), a partir de Glitch&Grit: productora de contenidos. Negro, y la portada es el muro de proyectos fijado
 * al scroll: cada proyecto ocupa la pantalla partida en dos mitades con su imagen, y su nombre, en una grotesca de 900 en
 * mayúsculas y en su color pastel, salta con un pequeño glitch al cambiar. La navegación vive en las cuatro esquinas.
 * Flujos: el muro filtrable por tipo, la ficha de cada proyecto y la petición de presupuesto.
 */

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  const links = [{ label: "Inicio", href: granoHref() }, { label: "Trabajo", href: granoHref("trabajo") }, { label: "Info", href: granoHref("info") }, { label: "Contacto", href: granoHref("contacto") }];
  return (
    <div className={`gr ${ruta ? "" : "gr--inicio"}`} id="top">
      <nav className="gr-esquinas" aria-label="Principal">
        <a href={granoHref("trabajo")} className="gr-esquinas__a" aria-current={ruta === "trabajo" ? "page" : undefined}>
          Trabajo
        </a>
        <a href={granoHref("info")} className="gr-esquinas__b" aria-current={ruta === "info" ? "page" : undefined}>
          Info
        </a>
        <a href={granoHref("contacto")} className="gr-esquinas__c" aria-current={ruta === "contacto" ? "page" : undefined}>
          Contacto
        </a>
        <a href={granoHref()} className="gr-esquinas__d" aria-label="Grano, inicio">
          Grano
        </a>
        <span className="gr-esquinas__e" aria-hidden>
          &amp;
        </span>
        <span className="gr-esquinas__f" aria-hidden>
          Madrid
        </span>
      </nav>
      <div className="gr-movil">
        <a href={granoHref()} className="gr-movil__marca">
          Grano
        </a>
        <FullscreenMenu trigger="dots" layout="full" reveal="circle" tone="fg" size="lg" align="center" linkHover="dim" brand="Grano" openLabel="Menú" closeLabel="Cerrar" note="Productora · Madrid" footer={[{ label: "hola@grano.example", href: "mailto:hola@grano.example" }]} links={links} className="gr-menu" />
      </div>
      {children}
    </div>
  );
}

/** el nombre de un proyecto, con el glitch al aparecer (`k` cambia en cada proyecto) */
function Nombre({ p, k, as = "p" }: { p: Proyecto; k: number; as?: "p" | "h1" | "h2" }) {
  const T = as;
  return (
    <T key={k} className="gr-nombre" style={{ "--c": p.color } as CSSProperties} data-text={p.n}>
      {p.n}
    </T>
  );
}

function Muro() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => {
      const r = el.getBoundingClientRect();
      const t = Math.min(0.999, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      setI(Math.floor(t * PROYECTOS.length));
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
    };
  }, []);
  const p = PROYECTOS[i];
  return (
    <section ref={ref} className="gr-muro" style={{ height: `${PROYECTOS.length * 70 + 30}svh` }} aria-label="Proyectos">
      <div className="gr-muro__fijo">
        {/* las dos mitades: entran desde lados alternos */}
        <div key={`a${i}`} className={`gr-mitad gr-mitad--a ${i % 2 ? "gr-mitad--arriba" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.a} alt="" />
        </div>
        <div key={`b${i}`} className={`gr-mitad gr-mitad--b ${i % 2 ? "" : "gr-mitad--abajo"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.b} alt="" />
        </div>
        <a href={granoHref(`trabajo/${p.id}`)} className="gr-muro__enlace">
          <span className="gr-muro__tipo" style={{ color: p.color }}>
            {p.tipo} · {p.cliente}
          </span>
          <Nombre p={p} k={i} />
          <span className="gr-muro__ver" style={{ color: p.color }}>
            Ver proyecto ↗
          </span>
        </a>
        <ol className="gr-muro__indice" aria-label="Proyecto actual">
          {PROYECTOS.map((q, k) => (
            <li key={q.id} aria-current={k === i ? "true" : undefined} style={{ "--c": q.color } as CSSProperties}>
              <span className="gr-sr">{q.n}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Portada() {
  return (
    <main>
      <h1 className="gr-sr">Grano, productora de contenidos en Madrid</h1>
      <Muro />
      <section className="gr-cierre">
        <p className="gr-grande">Hacemos documentales, campañas y series para gente que tiene algo que contar.</p>
        <a href={granoHref("contacto")} className="gr-boton">
          Cuéntanos tu historia ↗
        </a>
      </section>
      <Pie />
    </main>
  );
}

function Pie() {
  return (
    <footer className="gr-pie">
      <p className="gr-pie__marca" aria-hidden>
        Grano<span>&amp;</span>Gresca
      </p>
      <div>
        <span>Calle de Embajadores 31, Madrid</span>
        <a href="mailto:hola@grano.example">hola@grano.example</a>
        <span>Grano · productora de demostración de Trama. Proyectos y clientes inventados.</span>
      </div>
    </footer>
  );
}

function Trabajo() {
  const tipos = ["Todo", ...new Set(PROYECTOS.map((p) => p.tipo))];
  const [tipo, setTipo] = useState("Todo");
  const lista = PROYECTOS.filter((p) => tipo === "Todo" || p.tipo === tipo);
  return (
    <main className="gr-pag">
      <header className="gr-cab">
        <h1 className="gr-titular">Trabajo</h1>
        <div className="gr-filtro" role="group" aria-label="Tipo de proyecto">
          {tipos.map((t) => (
            <button key={t} type="button" aria-pressed={tipo === t} onClick={() => setTipo(t)}>
              {t}
            </button>
          ))}
        </div>
      </header>
      <ul className="gr-lista" aria-live="polite">
        {lista.map((p, k) => (
          <Reveal key={p.id} as="li" kind="fade" delay={(k % 2) * 0.06}>
            <a href={granoHref(`trabajo/${p.id}`)} style={{ "--c": p.color } as CSSProperties}>
              <span className="gr-lista__fotos">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.a} alt="" loading="lazy" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.b} alt="" loading="lazy" />
              </span>
              <b>{p.n}</b>
              <small>
                {p.tipo} · {p.cliente} · {p.año}
              </small>
            </a>
          </Reveal>
        ))}
      </ul>
      <Pie />
    </main>
  );
}

function Ficha({ id }: { id: string }) {
  const k = PROYECTOS.findIndex((p) => p.id === id);
  if (k < 0) return <NoHay />;
  const p = PROYECTOS[k];
  const sig = PROYECTOS[(k + 1) % PROYECTOS.length];
  return (
    <main className="gr-pag gr-ficha" style={{ "--c": p.color } as CSSProperties}>
      <div className="gr-ficha__fotos">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.a} alt={`${p.n}: fotograma`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.b} alt={`${p.n}: otro fotograma`} />
        <Nombre p={p} k={k} as="h1" />
      </div>
      <div className="gr-ficha__txt">
        <p className="gr-grande">{p.texto}</p>
        <dl>
          <div>
            <dt>Cliente</dt>
            <dd>{p.cliente}</dd>
          </div>
          <div>
            <dt>Tipo</dt>
            <dd>{p.tipo}</dd>
          </div>
          <div>
            <dt>Año</dt>
            <dd>{p.año}</dd>
          </div>
          {p.creditos.map(([r, n]) => (
            <div key={r}>
              <dt>{r}</dt>
              <dd>{n}</dd>
            </div>
          ))}
        </dl>
      </div>
      <a href={granoHref(`trabajo/${sig.id}`)} className="gr-siguiente" style={{ "--c": sig.color } as CSSProperties}>
        <small>Siguiente</small>
        <span>{sig.n}</span>
      </a>
      <Pie />
    </main>
  );
}

function Info() {
  return (
    <main className="gr-pag">
      <header className="gr-cab">
        <h1 className="gr-titular">Info</h1>
      </header>
      <section className="gr-info">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ESTUDIO.foto} alt="El estudio de Grano, con la sala de montaje al fondo" loading="lazy" />
        <div>
          <p className="gr-grande">Somos doce personas entre rodaje, montaje, color y animación. Trabajamos desde Embajadores desde 2014, casi siempre con el mismo equipo de principio a fin.</p>
          <ul className="gr-servicios">
            {SERVICIOS.map(([t, d], k) => (
              <li key={t} style={{ "--c": PROYECTOS[k].color } as CSSProperties}>
                <b>{t}</b>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="gr-clientes" aria-labelledby="gr-clientes">
        <h2 id="gr-clientes">Han confiado en nosotros</h2>
        <ul>
          {CLIENTES.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="gr-equipo" src={ESTUDIO.equipo} alt="El equipo de Grano en el patio del estudio" loading="lazy" />
      <Pie />
    </main>
  );
}

function Contacto() {
  return (
    <main className="gr-pag">
      <header className="gr-cab">
        <h1 className="gr-titular">Contacto</h1>
        <p className="gr-grande">Escríbenos aunque solo tengas una idea. Respondemos en dos días con preguntas y, si encaja, con un presupuesto.</p>
      </header>
      <BriefFlow className="gr-flujo" title="Cuéntanos tu historia" services={SERVICIOS.map(([t, d]) => ({ label: t, hint: d }))} servicesLabel="¿Qué quieres hacer?" budgets="Menos de 15.000 €, 15.000–50.000 €, Más de 50.000 €" timelines="Este mes, Este trimestre, Sin fecha" question="¿Qué historia quieres contar y a quién?" fields="company" prefix="GR" variant="minimal" />
      <Pie />
    </main>
  );
}

function NoHay() {
  return (
    <main className="gr-pag">
      <header className="gr-cab">
        <h1 className="gr-titular">Fuera de plano</h1>
        <p className="gr-grande">
          Esta página no está en el montaje. <a href={granoHref("trabajo")}>Ver el trabajo ↗</a>
        </p>
      </header>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "trabajo" && b) return <Ficha id={b} />;
  const P = { trabajo: Trabajo, info: Info, contacto: Contacto }[a];
  return P ? <P /> : <NoHay />;
}
