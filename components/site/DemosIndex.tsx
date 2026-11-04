"use client";

import DemoPreviewLink from "./DemoPreviewLink";
import { useEffect, useMemo, useState } from "react";

export type DemoItem = { href: string; title: string; blurb: string; meta: string; accent: string };
export type DemoKind = "sector" | "tecnica";
export type DemoGroup = { id: string; kind: DemoKind; label: string; blurb: string; items: DemoItem[] };

const pad = (n: number) => String(n).padStart(2, "0");
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const VIEWS: { kind: DemoKind; hash: string; label: string; lead: string }[] = [
  { kind: "sector", hash: "sectores", label: "Por sector", lead: "Webs y landings de negocios reales por sector: elige el tuyo y mira cómo quedaría con Trama." },
  { kind: "tecnica", hash: "tecnicas", label: "Técnicas", lead: "Demos de la librería: landings de variante, relatos 3D, scroll, efectos de texto y fondos generativos." },
];

/**
 * Índice de todas las demos en dos vistas: por sector comercial (para quien busca una plantilla para su negocio) y
 * técnicas (lo que sabe hacer la librería). Grupos con ancla, filtro por grupo y búsqueda; la búsqueda recorre las dos
 * vistas. Cada fila abre la demo a pantalla completa.
 */
export default function DemosIndex({ groups }: { groups: DemoGroup[] }) {
  const [kind, setKind] = useState<DemoKind>("sector");
  const [group, setGroup] = useState("all");
  const [q, setQ] = useState("");
  const count = (k: DemoKind) => groups.filter((g) => g.kind === k).reduce((n, g) => n + g.items.length, 0);
  const total = count("sector") + count("tecnica");
  const view = VIEWS.find((v) => v.kind === kind)!;

  // /demos#tecnicas abre esa vista; /demos#belleza, ya filtrado en ese grupo
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      const v = VIEWS.find((x) => x.hash === h);
      const g = groups.find((x) => x.id === h);
      if (v) {
        setKind(v.kind);
        setGroup("all");
      } else if (g) {
        setKind(g.kind);
        setGroup(g.id);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [groups]);

  const pickView = (k: DemoKind) => {
    setKind(k);
    setGroup("all");
    window.history.replaceState(null, "", k === "sector" ? window.location.pathname : `#${VIEWS.find((v) => v.kind === k)!.hash}`);
  };
  const pick = (id: string) => {
    setGroup(id);
    window.history.replaceState(null, "", id === "all" ? (kind === "sector" ? window.location.pathname : `#${view.hash}`) : `#${id}`);
  };

  const term = norm(q.trim());
  const shown = useMemo(() => {
    // Con búsqueda se mira en las dos vistas: «peluquería» encuentra webs, inspiraciones y landings del sector
    if (term)
      return groups
        .map((g) => ({ ...g, items: g.items.filter((d) => norm(`${g.label} ${d.title} ${d.blurb} ${d.meta}`).includes(term)) }))
        .filter((g) => g.items.length);
    return groups.filter((g) => g.kind === kind && (group === "all" || g.id === group));
  }, [groups, kind, group, term]);

  return (
    <main className="tr-page">
      <header className="tr-page__head">
        <p className="tr-label">Demos · {total}</p>
        <h1 className="tr-statement">Todo lo que se ha construido con Trama.</h1>
        <p className="tr-sec__lead">
          Webs completas, landings y réplicas de webs premiadas, ordenadas por sector para ver cómo quedaría tu negocio; aparte, las demos técnicas de la librería. Cada una se abre a pantalla completa, tal como se vería en producción.
        </p>
      </header>

      <div className="tr-views" role="group" aria-label="Tipo de demo">
        {VIEWS.map((v) => (
          <button key={v.kind} type="button" aria-pressed={!term && kind === v.kind} className={`tr-view ${!term && kind === v.kind ? "is-on" : ""}`} onClick={() => { setQ(""); pickView(v.kind); }}>
            <span className="tr-view__label">
              {v.label} <small>{count(v.kind)}</small>
            </span>
            <span className="tr-view__lead">{v.lead}</span>
          </button>
        ))}
      </div>

      <div className="tr-filter">
        <div className="tr-chips" role="group" aria-label={kind === "sector" ? "Filtrar por sector" : "Filtrar por grupo"}>
          <button type="button" aria-pressed={group === "all"} className={`tr-chip ${group === "all" ? "is-on" : ""}`} onClick={() => pick("all")}>
            Todas <small>{count(kind)}</small>
          </button>
          {groups
            .filter((g) => g.kind === kind)
            .map((g) => (
              <button key={g.id} type="button" aria-pressed={group === g.id} className={`tr-chip ${group === g.id ? "is-on" : ""}`} onClick={() => pick(g.id)}>
                {g.label} <small>{g.items.length}</small>
              </button>
            ))}
        </div>
        <input className="tr-search" type="search" placeholder="Buscar: peluquería, tienda, 3D…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar demos" />
      </div>

      {shown.map((g) => (
        <section key={g.id} id={g.id} className="tr-group">
          <header className="tr-group__head">
            <h2>{g.label}</h2>
            <p>{g.blurb}</p>
          </header>
          <ol className="tr-demos">
            {g.items.map((d, i) => (
              <li key={d.href}>
                <DemoPreviewLink href={d.href} previewTitle={d.title} className="tr-demo" style={{ ["--accent" as string]: d.accent }}>
                  <span className="tr-n">{pad(i + 1)}</span>
                  <span className="tr-demo__title">{d.title}</span>
                  <span className="tr-demo__blurb">{d.blurb}</span>
                  <span className="tr-demo__meta">{d.meta}</span>
                </DemoPreviewLink>
              </li>
            ))}
          </ol>
        </section>
      ))}
      {shown.length === 0 && <p className="tr-empty">Ninguna demo coincide con la búsqueda.</p>}
    </main>
  );
}
