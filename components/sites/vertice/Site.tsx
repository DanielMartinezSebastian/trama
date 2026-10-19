"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ContactForm from "@/components/ui/ContactForm";
import CookieBanner from "@/components/ui/CookieBanner";
import DataTable from "@/components/ui/DataTable";
import FilterBar from "@/components/ui/FilterBar";
import Footer from "@/components/ui/Footer";
import KpiCard from "@/components/ui/KpiCard";
import LogoCloud from "@/components/ui/LogoCloud";
import NavBar from "@/components/ui/NavBar";
import { photo } from "@/lib/sites/photos";
import { tokensToStyle } from "@/lib/ui/tokens";
import { phosphor } from "@/lib/ui/icons-phosphor";
import { SiteFrame, siteHref, useActiveIndex, useSiteNavigate } from "../shared";
import { AGENDA, AREAS, AWARDS, CLIENTS, GOALS, GROUP_FIGURES, JOBS, KINDS, NEWS, QUOTE, REPORTS, SECTORS, SLUG, SOLUTIONS, STOCK, type SectorId } from "./data";
import "./vertice.css";

// «Corporativo claro»: blanco roto, tinta, un azul industrial apagado; par palo seco + serifa (Instrument Sans y Serif, docs/12 G2)
const TOKENS: CSSProperties = {
  ...tokensToStyle({
    bg: "#f6f6f3",
    fg: "#15181c",
    mut: "#5b6169",
    acc: "#2a4b8d",
    acc2: "#15181c",
    card: "#ecece7",
    ln: "rgba(21,24,28,0.14)",
    r: 4,
    font: 'var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif',
    display: 'var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif',
    accentFont: 'var(--font-instrument-serif), Georgia, serif',
  }),
  // selección en tinta: el azul queda para lo accionable
  "--sel-bg": "#15181c",
  "--sel-fg": "#f6f6f3",
} as CSSProperties;
const href = (p = "") => siteHref(SLUG, p);
const sectorHref = (id: SectorId) => href(`sectores/${id}`);
const sectorName = (id: SectorId) => SECTORS.find((s) => s.id === id)!.name;

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  const navigate = useSiteNavigate();
  const L = [href("sectores"), href("soluciones"), href("sostenibilidad"), href("inversores")];
  const active = useActiveIndex(L);
  // megamenú con una línea por enlace (docs/12 G4) y barra de utilidades
  const links = [
    `Sectores=${L[0]} > #Negocios; ${SECTORS.map((s) => `${s.name}=${sectorHref(s.id)}|${s.line}`).join("; ")}; #El grupo; Todos los sectores=${L[0]}|Cómo se organiza Vértice`,
    `Soluciones=${L[1]}`,
    `Sostenibilidad=${L[2]}`,
    `Compañía=${href()} > Inversores=${L[3]}|Cotización, informes y junta; Sala de prensa=${href("prensa")}|Noticias y contacto de prensa; Empleo=${href("empleo")}|Ofertas abiertas en 9 países; Contacto=${href("contacto")}|Un contacto por área`,
  ].join("\n");
  const searchItems = [
    ...SOLUTIONS.map((s) => `${s.name}=${href("soluciones")}?sector=${s.sector}`),
    ...NEWS.map((n) => `${n.title}=${href("prensa")}`),
    ...JOBS.map((j) => `${j.title}=${href("empleo")}`),
  ].join(", ");
  return (
    <SiteFrame tokens={TOKENS} className="vx" icons={{ set: phosphor, weight: "light" }}>
      <div className="st-header st-header--flat vx-head">
        <NavBar
          brand="Vértice"
          links={links}
          utility={`Inversores=${L[3]}, Prensa=${href("prensa")}, Empleo=${href("empleo")}, Proveedores=${href("contacto")} | ES, EN`}
          menuStyle="mega"
          search="command"
          searchPlaceholder="Buscar soluciones, noticias, empleo…"
          searchItems={searchItems}
          defaultActive={active}
          cta="Contacto"
          onCta={() => navigate({ href: href("contacto") })}
          layout="classic"
          linksAlign="start"
          shape="full"
          size="md"
          variant="minimal"
          onNavigate={navigate}
        />
      </div>
      <main id="contenido">{children}</main>
      <div className="vx-foot">
        <div className="st-wrap">
          <Footer
            brand="Vértice"
            tagline="Grupo industrial · Bilbao, 1962"
            columns={`Sectores: ${SECTORS.map((s) => `${s.name}=${sectorHref(s.id)}`).join(", ")}, Soluciones=${L[1]}; Compañía: Sostenibilidad=${L[2]}, Inversores=${L[3]}, Sala de prensa=${href("prensa")}, Empleo=${href("empleo")}; Contacto: Contacto por área=${href("contacto")}, Canal ético=${href("contacto")}, Proveedores=${href("contacto")}; Legal: Créditos de las imágenes=/creditos`}
            social="icon:linkedin, icon:youtube"
            copyright="© 2026 Vértice Grupo Industrial, S. A. Empresa ficticia: demo construida con Trama."
            variant="minimal"
          />
        </div>
      </div>
      <CookieBanner position="bottom-left" policyHref="/creditos" storageKey="vertice-cookies" />
    </SiteFrame>
  );
}

const Kicker = ({ children }: { children: ReactNode }) => <p className="vx-kicker">{children}</p>;

function Figures() {
  return (
    <ul className="vx-figs" aria-label="Vértice en cifras">
      {GROUP_FIGURES.map((f) => (
        <li key={f.k}>
          <b>{f.v}</b>
          <span>{f.k}</span>
          <small>Fuente: {f.src}</small>
        </li>
      ))}
    </ul>
  );
}

function SectorCards({ skip }: { skip?: SectorId }) {
  return (
    <ul className="vx-sectors">
      {SECTORS.filter((s) => s.id !== skip).map((s) => (
        <li key={s.id}>
          <a href={sectorHref(s.id)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo(s.photo.topic, s.photo.i).src} alt={s.photo.alt} loading="lazy" />
            <span className="vx-sectors__t">{s.name}</span>
            <span className="vx-sectors__p">{s.line}</span>
            <span className="vx-sectors__go" aria-hidden>→</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function NewsList({ items = NEWS }: { items?: typeof NEWS }) {
  return (
    <ul className="vx-news">
      {items.map((n) => (
        <li key={n.title}>
          <a href={href("prensa")}>
            <span className="vx-news__meta">{n.date} · {n.tag}</span>
            <span className="vx-news__t">{n.title}</span>
            <span className="vx-news__p">{n.text}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ---------- inicio ---------- */
function Home() {
  return (
    <>
      <section className="vx-hero st-wrap">
        <Kicker>Grupo industrial · Movilidad, Energía y Agua</Kicker>
        <h1>Fabricamos la infraestructura que <em>mueve, ilumina y limpia</em> las ciudades.</h1>
        <div className="vx-hero__row">
          <p>Componentes para vehículos eléctricos, equipos para conectar renovables a la red y plantas de agua. Desde Bilbao, para 40 países.</p>
          <div className="vx-actions">
            <a className="vx-btn vx-btn--solid" href={href("soluciones")}>Ver soluciones</a>
            <a className="vx-btn" href={href("contacto")}>Hablar con un especialista</a>
          </div>
        </div>
      </section>
      <figure className="vx-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo("arquitectura", 4).src} alt="Fachada de un edificio de oficinas con ventanas en retícula" />
      </figure>

      <section className="vx-sec st-wrap" aria-label="Cifras del grupo">
        <Figures />
      </section>

      <section className="vx-sec st-wrap" aria-labelledby="vx-neg">
        <div className="vx-row">
          <h2 id="vx-neg">Tres negocios, una forma de trabajar</h2>
          <a className="vx-link" href={href("sectores")}>Todos los sectores →</a>
        </div>
        <SectorCards />
      </section>

      <section className="vx-sec vx-proof st-wrap" aria-label="Clientes y premios">
        <LogoCloud label="Trabajamos con" brands={CLIENTS} awards={AWARDS} />
        <blockquote className="vx-quote">
          <p>«{QUOTE.text}»</p>
          <footer>{QUOTE.source} · {QUOTE.date}</footer>
        </blockquote>
      </section>

      <section className="vx-sec vx-band" aria-labelledby="vx-sost">
        <div className="st-wrap vx-band__in">
          <b className="vx-band__n">−41 %</b>
          <div>
            <h2 id="vx-sost">Emisiones propias desde 2019</h2>
            <p>Electricidad renovable en las nueve plantas y objetivos validados por SBTi para 2030.</p>
            <a className="vx-link" href={href("sostenibilidad")}>Sostenibilidad →</a>
          </div>
        </div>
      </section>

      <section className="vx-sec st-wrap" aria-labelledby="vx-act">
        <div className="vx-row">
          <h2 id="vx-act">Actualidad</h2>
          <a className="vx-link" href={href("prensa")}>Sala de prensa →</a>
        </div>
        <NewsList items={NEWS.slice(0, 3)} />
      </section>

      <section className="vx-sec vx-cta st-wrap" aria-labelledby="vx-cta">
        <h2 id="vx-cta">¿Tienes un proyecto de movilidad, energía o agua?</h2>
        <a className="vx-btn vx-btn--solid" href={href("contacto")}>Hablar con un especialista</a>
      </section>
    </>
  );
}

/* ---------- sectores ---------- */
function Sectors() {
  return (
    <section className="vx-page st-wrap">
      <Breadcrumbs items={`Inicio=${href()}, Sectores`} />
      <h1>Sectores</h1>
      <p className="vx-lead">Tres negocios con ingeniería, fábricas y servicio propios, y una sola central de compras, calidad y sostenibilidad.</p>
      <SectorCards />
    </section>
  );
}

function Sector({ id }: { id: string }) {
  const s = SECTORS.find((x) => x.id === id);
  if (!s) return null;
  const sols = SOLUTIONS.filter((x) => x.sector === s.id);
  return (
    <>
      <section className="vx-page st-wrap">
        <Breadcrumbs items={`Inicio=${href()}, Sectores=${href("sectores")}, ${s.name}`} />
        <Kicker>{s.line}</Kicker>
        <h1>{s.name}</h1>
        <p className="vx-lead">{s.lead}</p>
      </section>
      <figure className="vx-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(s.photo.topic, s.photo.i).src} alt={s.photo.alt} />
      </figure>
      <section className="vx-sec st-wrap vx-split">
        <p className="vx-body">{s.text}</p>
        <ul className="vx-figs vx-figs--3" aria-label={`${s.name} en cifras`}>
          {s.figures.map((f) => (
            <li key={f.k}><b>{f.v}</b><span>{f.k}</span></li>
          ))}
        </ul>
      </section>
      <section className="vx-sec st-wrap" aria-labelledby="vx-sols">
        <div className="vx-row">
          <h2 id="vx-sols">Soluciones de {s.name}</h2>
          <a className="vx-link" href={`${href("soluciones")}?sector=${s.id}`}>Ver en el catálogo →</a>
        </div>
        <ul className="vx-cards">
          {sols.map((x) => (
            <li key={x.id}><span className="vx-tag">{KINDS.find((k) => k.value === x.kind)!.label}</span><b>{x.name}</b><p>{x.text}</p></li>
          ))}
        </ul>
      </section>
      <section className="vx-sec st-wrap vx-person" aria-label="Contacto del sector">
        <div>
          <Kicker>Habla con el equipo de {s.name}</Kicker>
          <p className="vx-person__n">{s.contact.name}</p>
          <p className="vx-person__r">{s.contact.role}</p>
        </div>
        <a className="vx-btn vx-btn--solid" href={`mailto:${s.contact.email}`}>{s.contact.email}</a>
      </section>
      <section className="vx-sec st-wrap" aria-labelledby="vx-otros">
        <h2 id="vx-otros">Otros sectores</h2>
        <SectorCards skip={s.id} />
      </section>
    </>
  );
}

/* ---------- soluciones: filtro en forma de frase, con el estado en la URL (docs/11 I1, docs/12 G6) ---------- */
function Solutions() {
  const [values, setValues] = useState<Record<string, string[]>>({ kind: [], sector: [] });
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setValues({ kind: q.getAll("tipo"), sector: q.getAll("sector") });
  }, []);
  const change = (v: Record<string, string[]>) => {
    setValues(v);
    const q = new URLSearchParams();
    v.kind?.forEach((x) => q.append("tipo", x));
    v.sector?.forEach((x) => q.append("sector", x));
    history.replaceState(null, "", `${location.pathname}${q.size ? `?${q}` : ""}`);
  };
  const list = useMemo(
    () => SOLUTIONS.filter((x) => (!values.kind?.length || values.kind.includes(x.kind)) && (!values.sector?.length || values.sector.includes(x.sector))),
    [values],
  );
  return (
    <section className="vx-page st-wrap">
      <Breadcrumbs items={`Inicio=${href()}, Soluciones`} />
      <h1 className="ui-sr">Soluciones</h1>
      <FilterBar
        layout="sentence"
        sentence="Fabricamos {kind} para {sector}."
        groups={[
          { id: "kind", label: "Tipo de solución", any: "soluciones", options: KINDS.map((k) => ({ ...k, count: SOLUTIONS.filter((x) => x.kind === k.value).length })) },
          { id: "sector", label: "Sector", any: "cualquier sector", options: SECTORS.map((s) => ({ value: s.id, label: s.name.toLowerCase(), count: SOLUTIONS.filter((x) => x.sector === s.id).length })) },
        ]}
        values={values}
        onChange={change}
        total={list.length}
        noun="soluciones"
      />
      <ul className="vx-cards vx-cards--grid">
        {list.map((x) => (
          <li key={x.id}>
            <span className="vx-tag">{sectorName(x.sector)} · {KINDS.find((k) => k.value === x.kind)!.label}</span>
            <b>{x.name}</b>
            <p>{x.text}</p>
            <a className="vx-link" href={sectorHref(x.sector)}>Ver {sectorName(x.sector)} →</a>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="vx-empty">No hay soluciones con esa combinación. Prueba con «cualquier sector».</p>}
    </section>
  );
}

/* ---------- sostenibilidad ---------- */
function Sustainability() {
  return (
    <>
      <section className="vx-page st-wrap">
        <Breadcrumbs items={`Inicio=${href()}, Sostenibilidad`} />
        <h1>Sostenibilidad</h1>
        <p className="vx-lead">Medimos, publicamos y dejamos que alguien de fuera lo compruebe. Estos son los números y los plazos.</p>
      </section>
      <section className="vx-sec st-wrap">
        <ol className="vx-goals">
          {GOALS.map((g) => (
            <li key={g.year}><span className="vx-goals__y">{g.year}</span><b>{g.title}</b><p>{g.text}</p></li>
          ))}
        </ol>
      </section>
      <section className="vx-sec st-wrap vx-person">
        <div>
          <Kicker>Informe de sostenibilidad 2025</Kicker>
          <p className="vx-person__r">Estado de información no financiera, verificado por un tercero independiente. PDF, 6,7 MB.</p>
        </div>
        <a className="vx-btn vx-btn--solid" href={href("inversores")}>Ir a los informes</a>
      </section>
    </>
  );
}

/* ---------- inversores ---------- */
function Investors() {
  const rows = REPORTS.map((r) => ({ ...r, file: r.size }));
  return (
    <>
      <section className="vx-page st-wrap">
        <Breadcrumbs items={`Inicio=${href()}, Inversores`} />
        <h1>Inversores y accionistas</h1>
        <p className="vx-lead">Cotización, informes, calendario financiero y junta general.</p>
      </section>
      <section className="vx-sec st-wrap vx-inv">
        <KpiCard label={`${STOCK.ticker} · ${STOCK.market}`} value={STOCK.price} delta={STOCK.delta} trend="up" spark={STOCK.spark} note="Datos de ejemplo, no reales" variant="minimal" />
        <div>
          <h2>Calendario financiero</h2>
          <ul className="vx-agenda">
            {AGENDA.map((a) => (
              <li key={a.what}><span>{a.date}</span><b>{a.what}</b></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="vx-sec st-wrap" aria-labelledby="vx-inf">
        <h2 id="vx-inf">Informes y presentaciones</h2>
        <DataTable
          caption="Informes y presentaciones de Vértice"
          columns={[
            { key: "title", label: "Documento", sortable: true },
            { key: "kind", label: "Tipo", sortable: true },
            { key: "date", label: "Fecha", sortable: true, render: (r) => new Date(r.date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) },
            { key: "file", label: "PDF", align: "right", render: (r) => <a className="vx-link" href={href("inversores")}>Descargar · {r.size}</a> },
          ]}
          rows={rows}
          rowKey="title"
          searchLabel="Buscar un informe"
          pageSize={10}
          variant="minimal"
        />
      </section>
    </>
  );
}

/* ---------- prensa ---------- */
function Press() {
  const tags = [...new Set(NEWS.map((n) => n.tag))];
  const [values, setValues] = useState<Record<string, string[]>>({ tag: [] });
  const list = NEWS.filter((n) => !values.tag.length || values.tag.includes(n.tag));
  return (
    <section className="vx-page st-wrap">
      <Breadcrumbs items={`Inicio=${href()}, Sala de prensa`} />
      <h1>Sala de prensa</h1>
      <div className="vx-press">
        <div>
          <FilterBar groups={[{ id: "tag", label: "Tema", options: tags.map((t) => ({ value: t, label: t, count: NEWS.filter((n) => n.tag === t).length })) }]} values={values} onChange={setValues} total={list.length} noun="noticias" />
          <NewsList items={list} />
        </div>
        <aside className="vx-aside" aria-label="Contacto de prensa">
          <Kicker>Contacto de prensa</Kicker>
          <p><b>Gabinete de comunicación</b><br />prensa@vertice.example<br />+34 944 000 120</p>
          <p>Kit de prensa: logotipos, fotos de las plantas y biografías del comité de dirección.</p>
        </aside>
      </div>
    </section>
  );
}

/* ---------- empleo ---------- */
function Jobs() {
  const areas = [...new Set(JOBS.map((j) => j.area))];
  const [values, setValues] = useState<Record<string, string[]>>({ area: [] });
  const rows = JOBS.filter((j) => !values.area.length || values.area.includes(j.area));
  return (
    <section className="vx-page st-wrap">
      <Breadcrumbs items={`Inicio=${href()}, Empleo`} />
      <h1>Trabaja en Vértice</h1>
      <p className="vx-lead">4.800 personas en nueve países. Formación técnica propia, plan de carrera y teletrabajo donde el puesto lo permite.</p>
      <FilterBar groups={[{ id: "area", label: "Área", options: areas.map((a) => ({ value: a, label: a, count: JOBS.filter((j) => j.area === a).length })) }]} values={values} onChange={setValues} total={rows.length} noun="ofertas" />
      <DataTable
        caption="Ofertas de empleo abiertas"
        columns={[
          { key: "title", label: "Puesto", sortable: true },
          { key: "area", label: "Área", sortable: true },
          { key: "place", label: "Lugar", sortable: true },
          { key: "mode", label: "Modalidad" },
          { key: "type", label: "Contrato" },
        ]}
        rows={rows}
        rowKey="id"
        searchLabel="Buscar un puesto o una ciudad"
        emptyText="No hay ofertas con esa búsqueda. Déjanos tu candidatura en Contacto."
        variant="minimal"
      />
    </section>
  );
}

/* ---------- contacto por área ---------- */
function Contact() {
  return (
    <section className="vx-page st-wrap">
      <Breadcrumbs items={`Inicio=${href()}, Contacto`} />
      <h1>Contacto</h1>
      <p className="vx-lead">Elige con quién quieres hablar: cada área tiene su propio equipo.</p>
      <ul className="vx-cards vx-cards--grid">
        {AREAS.map((a) => (
          <li key={a.t}><b>{a.t}</b><p>{a.p}</p><span className="vx-tag">{a.c}</span></li>
        ))}
      </ul>
      <div className="vx-form">
        <ContactForm title="Escríbenos" subtitle="Te responde una persona del área que corresponda en dos días laborables." submitLabel="Enviar" variant="minimal" />
      </div>
    </section>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a, b] = path;
  if (!a) return <Home />;
  if (a === "sectores") return b ? <Sector id={b} /> : <Sectors />;
  if (a === "soluciones") return <Solutions />;
  if (a === "sostenibilidad") return <Sustainability />;
  if (a === "inversores") return <Investors />;
  if (a === "prensa") return <Press />;
  if (a === "empleo") return <Jobs />;
  if (a === "contacto") return <Contact />;
  return null;
}
