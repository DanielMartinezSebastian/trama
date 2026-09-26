"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type DemoItem = { href: string; title: string; blurb: string; meta: string; accent: string };
export type DemoGroup = { id: string; label: string; blurb: string; items: DemoItem[] };

const pad = (n: number) => String(n).padStart(2, "0");
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Índice de todas las demos: grupos con ancla, filtro por grupo y búsqueda. Cada fila abre la demo a pantalla completa. */
export default function DemosIndex({ groups }: { groups: DemoGroup[] }) {
  const [group, setGroup] = useState("all");
  const [q, setQ] = useState("");
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  // /demos#webs abre ya filtrado en ese grupo
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (groups.some((g) => g.id === h)) setGroup(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [groups]);

  const pick = (id: string) => {
    setGroup(id);
    window.history.replaceState(null, "", id === "all" ? window.location.pathname : `#${id}`);
  };

  const shown = useMemo(() => {
    const term = norm(q.trim());
    return groups
      .filter((g) => group === "all" || g.id === group)
      .map((g) => ({ ...g, items: term ? g.items.filter((d) => norm(`${d.title} ${d.blurb} ${d.meta}`).includes(term)) : g.items }))
      .filter((g) => g.items.length);
  }, [groups, group, q]);

  return (
    <main className="tr-page">
      <header className="tr-page__head">
        <p className="tr-label">Demos · {total}</p>
        <h1 className="tr-statement">Todo lo que se ha construido con Trama.</h1>
        <p className="tr-sec__lead">Landings y webs de referencia, fondos generativos, efectos de texto y páginas con scroll. Cada una se abre a pantalla completa, tal como se vería en producción.</p>
      </header>

      <div className="tr-filter">
        <div className="tr-chips" role="group" aria-label="Filtrar por grupo">
          <button type="button" aria-pressed={group === "all"} className={`tr-chip ${group === "all" ? "is-on" : ""}`} onClick={() => pick("all")}>
            Todas <small>{total}</small>
          </button>
          {groups.map((g) => (
            <button key={g.id} type="button" aria-pressed={group === g.id} className={`tr-chip ${group === g.id ? "is-on" : ""}`} onClick={() => pick(g.id)}>
              {g.label} <small>{g.items.length}</small>
            </button>
          ))}
        </div>
        <input className="tr-search" type="search" placeholder="Buscar demos…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar demos" />
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
                <Link href={d.href} className="tr-demo" style={{ ["--accent" as string]: d.accent }}>
                  <span className="tr-n">{pad(i + 1)}</span>
                  <span className="tr-demo__title">{d.title}</span>
                  <span className="tr-demo__blurb">{d.blurb}</span>
                  <span className="tr-demo__meta">{d.meta}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
      {shown.length === 0 && <p className="tr-empty">Ninguna demo coincide con la búsqueda.</p>}
    </main>
  );
}
