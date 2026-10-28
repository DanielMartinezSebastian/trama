"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { money } from "@/lib/commerce/money";
import { BLOG, I, PETICIONES, SERVICIOS, TRABAJOS, TRAYECTORIA } from "./data";
import { brasaHref } from "./enlaces";
import { ruthie, stack } from "./fuentes";
import "./brasa.css";
import Portada from "./Brasa";

/*
 * Brasa con varias páginas (docs/56): la portada (Brasa.tsx, la coreografía medida contra la original, intacta) y los
 * trabajos con su ficha (el reel de la portada abre cada una), servicios con precio de partida, sobre mí con la
 * trayectoria, blog y contacto con la petición en pasos (BriefFlow). La portada trae su propia navegación fija; las
 * demás páginas, una cabecera sobria en negro y rojo. En el móvil, en todas, el menú a pantalla completa.
 */

const NAV: [string, string][] = [
  ["sobre-mi", "SOBRE MÍ"],
  ["servicios", "SERVICIOS"],
  ["trabajos", "TRABAJOS"],
  ["blog", "BLOG"],
  ["contacto", "CONTACTO"],
];

export function Shell({ children }: { children: ReactNode }) {
  const portada = usePathname() === brasaHref();
  const menu = <FullscreenMenu brand="BRASA" trigger="burger" openLabel="MENÚ" closeLabel="CERRAR" note="DISEÑO Y DESARROLLO WEB 3D" links={[{ label: "INICIO", href: brasaHref() }, ...NAV.map(([p, l]) => ({ label: l, href: brasaHref(p) }))]} className="br-menu" />;
  if (portada)
    return (
      <div className={`br ${ruthie.variable} ${stack.variable}`} id="top">
        <div className="br-movil br-movil--portada">{menu}</div>
        {children}
      </div>
    );
  return (
    <div className={`br br--pagina ${ruthie.variable} ${stack.variable}`} id="top">
      <header className="br-head">
        <a href={brasaHref()} className="br-logo">
          BRASA
        </a>
        <nav aria-label="Principal">
          {NAV.map(([p, l]) => (
            <a key={p} href={brasaHref(p)}>
              {l}
              <span aria-hidden>+</span>
            </a>
          ))}
        </nav>
        <a className="br-cta" href={brasaHref("contacto")}>
          <small>
            EN LÍNEA <i aria-hidden />
          </small>
          Hablemos
        </a>
        <div className="br-movil">{menu}</div>
      </header>
      {children}
      <footer className="br-pie">
        <p className="br-pie__frase">La caída siempre fue parte del camino.</p>
        <nav aria-label="Pie">
          {NAV.map(([p, l]) => (
            <a key={p} href={brasaHref(p)}>
              {l}
            </a>
          ))}
        </nav>
        <small>
          <a href="mailto:hola@brasa.example">hola@brasa.example</a> · estudio de demostración de Trama · © 2026 Brasa
        </small>
      </footer>
    </div>
  );
}

function Cab({ palabra, texto }: { palabra: string; texto?: string }) {
  return (
    <header className="br-pag__cab">
      <h1>{palabra}</h1>
      {texto && <p>{texto}</p>}
    </header>
  );
}

function Trabajos() {
  return (
    <main className="br-pag">
      <Cab palabra="Trabajos" texto="Webs 3D y productos digitales hechos para sentirse y recordarse." />
      <div className="br-trabajos">
        {TRABAJOS.map((t, k) => (
          <a key={t.id} href={brasaHref(`trabajos/${t.id}`)} className="br-trabajo">
            <span className="br-trabajo__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.img} alt="" loading="lazy" />
            </span>
            <small>
              0{k + 1} · {t.tipo} · {t.ano}
            </small>
            <b>{t.titulo}</b>
          </a>
        ))}
      </div>
    </main>
  );
}

function Trabajo({ id }: { id: string }) {
  const k = TRABAJOS.findIndex((x) => x.id === id);
  const t = TRABAJOS[k];
  const sig = TRABAJOS[(k + 1) % TRABAJOS.length];
  return (
    <main className="br-pag">
      <a href={brasaHref("trabajos")} className="br-volver">
        ← TRABAJOS
      </a>
      <Cab palabra={t.titulo} texto={`${t.tipo} · ${t.ano} · ${t.rol}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={t.img} alt={t.titulo} className="br-ficha__img" />
      <div className="br-ficha">
        <p className="br-ficha__lead">{t.texto}</p>
        <ul>
          {t.claves.map((c) => (
            <li key={c}>
              <span aria-hidden>+</span> {c}
            </li>
          ))}
        </ul>
      </div>
      <a href={brasaHref(`trabajos/${sig.id}`)} className="br-sig">
        <small>SIGUIENTE</small>
        <b>{sig.titulo} →</b>
      </a>
    </main>
  );
}

function Servicios() {
  return (
    <main className="br-pag">
      <Cab palabra="Servicios" texto="El diseño atrae la mirada. El desarrollo le da vida." />
      <ol className="br-servicios">
        {SERVICIOS.map((s, k) => (
          <li key={s.id}>
            <small>0{k + 1}</small>
            <h2>{s.t}</h2>
            <p>{s.d}</p>
            <span>desde {money(s.desde)}</span>
            <a href={brasaHref("contacto")} className="br-boton">
              PEDIR PROPUESTA →
            </a>
          </li>
        ))}
      </ol>
    </main>
  );
}

function SobreMi() {
  return (
    <main className="br-pag">
      <Cab palabra="Sobre mí" />
      <div className="br-sobre">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${I}retrato.webp`} alt="Retrato del autor de Brasa" />
        <div>
          <p className="br-ficha__lead">Narrador visual, diseñador UI/UX y desarrollador web 3D. Hago experiencias digitales que no solo se ven: se sienten.</p>
          <ol className="br-linea">
            {TRAYECTORIA.map((h) => (
              <li key={h.a}>
                <b>{h.a}</b>
                <h2>{h.t}</h2>
                <p>{h.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}

function Blog() {
  return (
    <main className="br-pag">
      <Cab palabra="Blog" texto="Notas sobre diseño, código y lo que sale mal." />
      <ul className="br-blog">
        {BLOG.map((b) => (
          <li key={b.id} id={b.id}>
            <small>{b.f}</small>
            <h2>{b.t}</h2>
            <p>{b.texto}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Contacto() {
  return (
    <main className="br-pag">
      <Cab palabra="Hablemos" texto="Cuéntame el proyecto. Respondo en un día laborable, normalmente con preguntas." />
      <BriefFlow className="br-flujo" title="Proyecto con Brasa" services={PETICIONES} budgets="Menos de 5.000 €, 5.000–15.000 €, Más de 15.000 €" timelines="Este mes, Este trimestre, Sin prisa" question="¿Qué quieres que la gente sienta al entrar? Cuéntame la marca, el público y la fecha." fields="company" responseTime="Te respondo en un día laborable." prefix="BR" storageKey="trama:brasa:proyectos" variant="minimal" />
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "trabajos") return b ? <Trabajo id={b} /> : <Trabajos />;
  if (a === "servicios") return <Servicios />;
  if (a === "sobre-mi") return <SobreMi />;
  if (a === "blog") return <Blog />;
  if (a === "contacto") return <Contacto />;
  return null;
}
