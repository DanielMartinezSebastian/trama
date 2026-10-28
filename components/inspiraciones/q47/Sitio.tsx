"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import BriefFlow from "@/components/ui/BriefFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { BLOG, PETICIONES, PROYECTOS, SECTORES, SERVICIOS } from "./data";
import { q47Href } from "./enlaces";
import "./q47.css";
import Portada from "./Q47";

/*
 * Q47 con varias páginas (docs/56): la portada sin scroll (Q47.tsx) y el trabajo con filtro por sector y la barra que
 * dice qué proyecto estás viendo, la ficha de cada proyecto (reto, idea, resultado y cifras, con el siguiente), la agencia,
 * el contacto con la petición de presupuesto en pasos (BriefFlow) y el blog. El marco persiste: el logo y el menú en
 * escalera; entre páginas, la escalera de PageTransition. Trabajo y blog van en blanco, como en K72.
 */

const I = "/img/inspiraciones/q47/";
const LINKS = [
  { label: "TRABAJO", href: q47Href("trabajo"), marquee: "LO QUE HACEMOS", images: [`${I}menu-trabajo-1.webp`, `${I}menu-trabajo-2.webp`] },
  { label: "AGENCIA", href: q47Href("agencia"), marquee: "CONÓCENOS", images: [`${I}menu-agencia.webp`] },
  { label: "CONTACTO", href: q47Href("contacto"), marquee: "MÁNDANOS UN FAX", images: [`${I}menu-contacto.webp`] },
  { label: "BLOG", href: q47Href("blog"), marquee: "LEE ARTÍCULOS", images: [`${I}menu-blog.webp`] },
];
const RED = [
  { label: "FB", href: "https://www.facebook.com/" },
  { label: "IG", href: "https://www.instagram.com/" },
  { label: "IN", href: "https://www.linkedin.com/" },
  { label: "BE", href: "https://www.behance.net/" },
];

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  const tono = !ruta ? "inicio" : ruta === "trabajo" || ruta === "blog" ? "trabajo" : "pagina";
  return (
    <div className={`q47 q47--${tono}`} id="top">
      <header className="q47-head">
        <a href={q47Href()} className="q47-logo" aria-label="Q47, inicio">
          Q47
        </a>
        <FullscreenMenu brand="Q47" trigger="burger" triggerHover="fill" cover reveal="stairs" linkHover="marquee" rules align="center" note="MADRID" links={LINKS} footer={RED} className="q47-menu" />
      </header>
      {children}
      {tono !== "inicio" && (
        <footer className="q47-pie">
          <a href={q47Href("contacto")} className="q47-pildora q47-pildora--grande">
            HABLEMOS
          </a>
          <nav aria-label="Pie">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <p>
            Q47 · Calle de la Chispa 47, Madrid · <a href="mailto:hola@q47.example">hola@q47.example</a> · agencia de demostración de Trama
          </p>
        </footer>
      )}
    </div>
  );
}

function Trabajo() {
  const [sector, setSector] = useState("");
  const lista = PROYECTOS.filter((p) => !sector || p.sector === sector);
  const [vista, setVista] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    setVista(0);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setVista(Number((e.target as HTMLElement).dataset.i))), { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, [sector]);
  const p = lista[vista] ?? lista[0];
  return (
    <main className="q47-trabajo">
      <div className="q47-barra" aria-live="polite">
        <span>{p.cliente}</span>
        <span>{p.titulo}</span>
        <span>{p.ano}</span>
      </div>
      <h1>
        TRABAJO<sup>{lista.length}</sup>
      </h1>
      <div className="q47-filtros" role="group" aria-label="Sector">
        {["", ...SECTORES].map((s) => (
          <button key={s || "todo"} type="button" className="q47-pildora" aria-pressed={sector === s} onClick={() => setSector(s)}>
            {s || "TODO"}
          </button>
        ))}
      </div>
      <div className="q47-rejilla">
        {lista.map((x, k) => (
          <a key={x.id} href={q47Href(`trabajo/${x.id}`)} className="q47-proyecto" data-i={k} ref={(el) => { refs.current[k] = el; }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={x.img} alt={`${x.cliente}: ${x.titulo}`} loading="lazy" />
            <span className="q47-ver">VER PROYECTO</span>
          </a>
        ))}
      </div>
    </main>
  );
}

function Proyecto({ id }: { id: string }) {
  const i = PROYECTOS.findIndex((x) => x.id === id);
  const p = PROYECTOS[i];
  const sig = PROYECTOS[(i + 1) % PROYECTOS.length];
  return (
    <main className="q47-trabajo q47-caso">
      <div className="q47-barra">
        <span>{p.cliente}</span>
        <span>{p.titulo}</span>
        <span>{p.ano}</span>
      </div>
      <a href={q47Href("trabajo")} className="q47-pildora q47-caso__volver">
        ← TRABAJO
      </a>
      <h1>{p.titulo}</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.img} alt={`${p.cliente}: ${p.titulo}`} className="q47-caso__img" />
      <dl className="q47-caso__datos">
        <div>
          <dt>CLIENTE</dt>
          <dd>{p.cliente}</dd>
        </div>
        <div>
          <dt>SECTOR</dt>
          <dd>{p.sector}</dd>
        </div>
        <div>
          <dt>QUÉ HICIMOS</dt>
          <dd>{p.servicios.join(" · ")}</dd>
        </div>
        <div>
          <dt>AÑO</dt>
          <dd>{p.ano}</dd>
        </div>
      </dl>
      <div className="q47-caso__texto">
        {(
          [
            ["EL RETO", p.reto],
            ["LA IDEA", p.idea],
            ["EL RESULTADO", p.resultado],
          ] as const
        ).map(([t, d]) => (
          <section key={t}>
            <h2>{t}</h2>
            <p>{d}</p>
          </section>
        ))}
      </div>
      <div className="q47-caso__cifras">
        {p.cifras.map(([n, d]) => (
          <p key={d}>
            <b>{n}</b>
            <span>{d}</span>
          </p>
        ))}
      </div>
      <a href={q47Href(`trabajo/${sig.id}`)} className="q47-caso__sig">
        <small>SIGUIENTE PROYECTO</small>
        <b>
          {sig.cliente}: {sig.titulo} →
        </b>
      </a>
    </main>
  );
}

function Agencia() {
  return (
    <main className="q47-pag">
      <h1>AGENCIA</h1>
      <div className="q47-agencia">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${I}menu-agencia.webp`} alt="El equipo de Q47 en el estudio" />
        <div>
          <p className="q47-pag__lead">Somos 47 personas en un antiguo taller de Madrid. Estrategas, diseñadoras, redactores, programadoras y productores que prefieren discutir una idea a aplaudirla.</p>
          <p>Trabajamos con pocas marcas y durante mucho tiempo: la media de nuestros clientes lleva siete años con nosotros.</p>
        </div>
      </div>
      <h2>LO QUE HACEMOS</h2>
      <ul className="q47-servicios">
        {SERVICIOS.map((s) => (
          <li key={s.n}>
            <a href={q47Href(`contacto?servicio=${encodeURIComponent(s.n)}`)}>
              <b>{s.n}</b>
              <span>{s.d}</span>
              <i aria-hidden>→</i>
            </a>
          </li>
        ))}
      </ul>
      <div className="q47-caso__cifras">
        {(
          [
            ["47", "personas"],
            ["7 años", "de media con cada cliente"],
            ["120+", "premios, que tampoco contamos"],
          ] as const
        ).map(([n, d]) => (
          <p key={d}>
            <b>{n}</b>
            <span>{d}</span>
          </p>
        ))}
      </div>
    </main>
  );
}

function Contacto() {
  const q = useSearchParams();
  const s = q.get("servicio");
  return (
    <main className="q47-pag">
      <h1>CONTACTO</h1>
      <div className="q47-contacto">
        <div>
          <p className="q47-pag__lead">Cuéntanos qué necesitas y te mandamos una primera propuesta en una semana.</p>
          <p>
            Calle de la Chispa 47, 28012 Madrid
            <br />
            <a href="mailto:hola@q47.example">hola@q47.example</a> · <a href="tel:+34910000047">910 000 047</a>
            <br />
            Fax: sí, todavía. 910 000 048.
          </p>
        </div>
        <BriefFlow className="q47-flujo" title="Presupuesto para Q47" services={PETICIONES} initialServices={s ? [s] : []} budgets="Menos de 20.000 €, 20.000–60.000 €, 60.000–150.000 €, Más de 150.000 €" timelines="Este trimestre, Este año, Sin prisa" question="Cuéntanos la marca, el reto y qué tendría que pasar para que esto fuera un éxito." fields="company,phone" responseTime="Te respondemos en dos días y mandamos propuesta en una semana." prefix="Q47" storageKey="trama:q47:presupuestos" variant="outline" />
      </div>
    </main>
  );
}

function Blog() {
  return (
    <main className="q47-trabajo q47-blog">
      <h1>
        BLOG<sup>{BLOG.length}</sup>
      </h1>
      <ul>
        {BLOG.map((b) => (
          <li key={b.id}>
            <a href={q47Href(`blog/${b.id}`)}>
              <small>{b.f}</small>
              <b>{b.t}</b>
              <span>{b.texto}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Articulo({ id }: { id: string }) {
  const b = BLOG.find((x) => x.id === id)!;
  return (
    <main className="q47-trabajo q47-blog q47-articulo">
      <a href={q47Href("blog")} className="q47-pildora q47-caso__volver">
        ← BLOG
      </a>
      <small>{b.f}</small>
      <h1>{b.t}</h1>
      <p className="q47-pag__lead">{b.texto}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={b.img} alt="" className="q47-articulo__img" />
      {b.cuerpo.map((x) => (
        <p key={x}>{x}</p>
      ))}
      <a href={q47Href("contacto")} className="q47-pildora">
        ¿HABLAMOS? →
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "trabajo") return b ? <Proyecto id={b} /> : <Trabajo />;
  if (a === "agencia") return <Agencia />;
  if (a === "contacto")
    return (
      <Suspense>
        <Contacto />
      </Suspense>
    );
  if (a === "blog") return b ? <Articulo id={b} /> : <Blog />;
  return null;
}
