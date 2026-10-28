"use client";

import dynamic from "next/dynamic";
import { IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import { Pastilla } from "./Cenit";
import { ETIQUETAS, PETICIONES, PROCESO, PROYECTOS } from "./data";
import { cenitHref } from "./enlaces";
import "./cenit.css";

// la de la referencia (Aeonik) es de pago: Inter Tight; la monoespaciada sí es la suya (IBM Plex Mono)
const sans = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-lw", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-lw-mono", display: "swap" });

/*
 * Cénit con varias páginas (docs/56): la portada (Cenit.tsx) y los proyectos con filtro por etiqueta y la ficha de cada
 * uno (con el siguiente), el estudio con el proceso, y contacto con la petición en pasos (BriefFlow). El marco persiste:
 * la cabecera con el sonido (se puede apagar), «Hablemos» y el «Menú» que despliega enlaces y el boletín (se cierra con
 * Escape, al pulsar fuera o al cambiar de página), y el pie «Trabajemos juntos».
 */

const Portada = dynamic(() => import("./Cenit"));
const NAV: [string, string][] = [
  ["", "Inicio"],
  ["estudio", "Estudio"],
  ["proyectos", "Proyectos"],
  ["contacto", "Contacto"],
];

function Boletin() {
  const [hecho, setHecho] = useState("");
  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHecho(String(new FormData(e.currentTarget).get("correo") ?? ""));
  };
  return (
    <div className="lw-news">
      <h3>
        Suscríbete
        <br />
        al boletín
      </h3>
      {hecho ? (
        <p role="status">Hecho: te escribimos a {hecho} (demostración: no se envía nada).</p>
      ) : (
        <form onSubmit={enviar}>
          <input name="correo" type="email" required placeholder="Tu correo" aria-label="Correo" />
          <button type="submit" aria-label="Suscribirse">
            →
          </button>
        </form>
      )}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [sonido, setSonido] = useState(true);
  const caja = useRef<HTMLDivElement>(null);
  const path = usePathname();
  useEffect(() => setMenu(false), [path]);
  useEffect(() => {
    if (!menu) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    const fuera = (e: PointerEvent) => caja.current && !caja.current.contains(e.target as Node) && setMenu(false);
    window.addEventListener("keydown", tecla);
    window.addEventListener("pointerdown", fuera);
    return () => {
      window.removeEventListener("keydown", tecla);
      window.removeEventListener("pointerdown", fuera);
    };
  }, [menu]);
  return (
    <div className={`lw ${sans.variable} ${mono.variable}`} id="top">
      <header className="lw-head">
        <a className="lw-logo" href={cenitHref()} aria-label="Cénit, inicio">
          CÉNIT
        </a>
        <div className="lw-head__right" ref={caja}>
          <button className={`lw-sound ${sonido ? "" : "is-off"}`} type="button" aria-label="Sonido" aria-pressed={sonido} onClick={() => setSonido(!sonido)}>
            {[0, 1, 2, 3].map((i) => (
              <i key={i} style={{ animationDelay: `${i * -0.2}s` }} />
            ))}
          </button>
          <a className="lw-talk" href={cenitHref("contacto")}>
            <span aria-hidden>→</span>
            Hablemos
            <i aria-hidden />
          </a>
          <button className="lw-menu" type="button" aria-expanded={menu} aria-controls="lw-desplegable" onClick={() => setMenu((m) => !m)}>
            {menu ? "Cerrar" : "Menú"}
            <span aria-hidden>
              <i />
              <i />
            </span>
          </button>
          <div id="lw-desplegable" className={`lw-dropdown ${menu ? "is-open" : ""}`} inert={!menu}>
            <nav aria-label="Principal">
              {NAV.map(([p, l]) => (
                <a key={l} href={cenitHref(p)} aria-current={path === cenitHref(p) ? "page" : undefined}>
                  {l}
                </a>
              ))}
            </nav>
            <Boletin />
          </div>
        </div>
      </header>
      {children}
      <footer className="lw-foot">
        <a href={cenitHref("contacto")} className="lw-foot__big">
          Trabajemos juntos →
        </a>
        <a href="mailto:hola@cenit.example">hola@cenit.example</a>
        <nav aria-label="Pie" className="lw-foot__nav">
          {NAV.slice(1).map(([p, l]) => (
            <a key={p} href={cenitHref(p)}>
              {l}
            </a>
          ))}
        </nav>
        <small>Estudio de demostración de Trama · © 2026 Cénit</small>
      </footer>
    </div>
  );
}

function Proyectos() {
  const [tag, setTag] = useState("");
  const lista = PROYECTOS.filter((x) => !tag || x.tags.includes(tag));
  return (
    <main className="lw-pag">
      <div className="lw-work__head">
        <h1>Proyectos</h1>
        <p>
          {lista.length} experiencias digitales para marcas con ambición. Filtra por lo que hicimos.
        </p>
      </div>
      <div className="lw-filtros" role="group" aria-label="Etiqueta">
        {["", ...ETIQUETAS].map((t) => (
          <button key={t || "todos"} type="button" className="lw-pill" aria-pressed={tag === t} onClick={() => setTag(t)}>
            <i aria-hidden />
            {t || "Todos"}
          </button>
        ))}
      </div>
      <div className="lw-grid">
        {lista.map((x) => (
          <a key={x.id} className="lw-card" href={cenitHref(`proyectos/${x.id}`)}>
            <span className="lw-card__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.img} alt="" loading="lazy" />
            </span>
            <small>{x.tags.join(" · ")}</small>
            <strong>{x.titulo}</strong>
          </a>
        ))}
      </div>
    </main>
  );
}

function Proyecto({ id }: { id: string }) {
  const i = PROYECTOS.findIndex((x) => x.id === id);
  const x = PROYECTOS[i];
  const sig = PROYECTOS[(i + 1) % PROYECTOS.length];
  return (
    <main className="lw-pag">
      <Pastilla texto="Todos los proyectos" href={cenitHref("proyectos")} />
      <h1>{x.titulo}</h1>
      <span className="lw-card__img lw-ficha__img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={x.img} alt={x.titulo} />
      </span>
      <div className="lw-ficha">
        <dl>
          <div>
            <dt>Cliente</dt>
            <dd>{x.cliente}</dd>
          </div>
          <div>
            <dt>Año</dt>
            <dd>{x.ano}</dd>
          </div>
          <div>
            <dt>Disciplinas</dt>
            <dd>{x.tags.join(" · ")}</dd>
          </div>
        </dl>
        <div className="lw-ficha__texto">
          <p className="lw-ficha__lead">{x.texto}</p>
          <p>{x.hicimos}</p>
          <Pastilla texto="Quiero algo así" href={cenitHref("contacto")} />
        </div>
      </div>
      <a href={cenitHref(`proyectos/${sig.id}`)} className="lw-sig">
        <small>Siguiente proyecto</small>
        <span className="lw-card__img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sig.img} alt="" loading="lazy" />
        </span>
        <strong>{sig.titulo} →</strong>
      </a>
    </main>
  );
}

function Estudio() {
  return (
    <main className="lw-pag">
      <h1>
        Un estudio pequeño
        <br />
        para ideas grandes
      </h1>
      <div className="lw-bold__text lw-estudio__intro">
        <p>Somos dieciocho personas entre Madrid y Lisboa: dirección creativa, 3D, desarrollo y sonido en el mismo equipo. Hacemos pocas cosas al año para hacerlas muy bien.</p>
      </div>
      <ol className="lw-proceso">
        {PROCESO.map((p) => (
          <li key={p.n}>
            <small>{p.n}</small>
            <h2>{p.t}</h2>
            <p>{p.d}</p>
          </li>
        ))}
      </ol>
      <div className="lw-cifras">
        {(
          [
            ["18", "personas"],
            ["60+", "proyectos publicados"],
            ["3", "premios del año"],
          ] as const
        ).map(([n, d]) => (
          <p key={d}>
            <b>{n}</b>
            <span>{d}</span>
          </p>
        ))}
      </div>
      <Pastilla texto="Ver proyectos" href={cenitHref("proyectos")} />
    </main>
  );
}

function Contacto() {
  return (
    <main className="lw-pag">
      <h1>Hablemos</h1>
      <div className="lw-contacto">
        <div className="lw-bold__text">
          <p>Cuéntanos qué tienes en mente. Respondemos en dos días con preguntas, ideas o una primera propuesta.</p>
          <p>
            <a href="mailto:hola@cenit.example">hola@cenit.example</a>
            <br />
            Calle del Cénit 3, Madrid · Rua da Luz 12, Lisboa
          </p>
        </div>
        <BriefFlow className="lw-flujo" title="Proyecto con Cénit" services={PETICIONES} budgets="Menos de 30.000 €, 30.000–80.000 €, Más de 80.000 €" timelines="Antes de tres meses, Este año, Sin fecha" question="¿Qué quieres que la gente sienta o haga? Cuéntanos la marca, el público y la fecha si la hay." fields="company" responseTime="Te respondemos en dos días laborables." prefix="CEN" storageKey="trama:cenit:proyectos" variant="minimal" />
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "proyectos") return b ? <Proyecto id={b} /> : <Proyectos />;
  if (a === "estudio") return <Estudio />;
  if (a === "contacto") return <Contacto />;
  return null;
}
