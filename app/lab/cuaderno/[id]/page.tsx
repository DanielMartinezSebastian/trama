import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Prose from "@/components/ui/Prose";
import SiteChrome from "@/components/site/SiteChrome";
import { DOCS_CINE } from "@/components/lab/cine/panel/datos";
import { NOMBRE_ETIQUETA, ETIQUETAS, leerCuaderno, relaciones } from "@/components/lab/cuaderno/datos";
import "@/components/lab/cuaderno/cuaderno.css";

/* Una ficha del cuaderno del laboratorio (docs/53): sus etiquetas enlazadas al filtro, colores, referencias y vecinas. */

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** «docs/50 §3.9» → la página del lab si es un documento del método, o nada */
function docHref(s: string) {
  const n = /^docs\/(\d{2})\b/.exec(s)?.[1];
  const d = n && DOCS_CINE.find((x) => x.startsWith(`${n}-`));
  return d ? `/lab/cine/docs/${d.replace(/\.md$/, "")}` : null;
}

export default async function FichaCuaderno({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const todas = leerCuaderno();
  const x = todas.find((f) => f.id === id);
  if (!x) notFound();
  const vecinos = relaciones(todas).vecinos[x.id] ?? [];
  // enlaces a otras fichas (otra.md) → su página aquí
  const cuerpo = x.cuerpo.replace(/\]\(([a-z0-9-]+)\.md\)/g, "](/lab/cuaderno/$1)");
  const titulo = (i: string) => todas.find((f) => f.id === i)?.titulo ?? i;

  return (
    <SiteChrome>
      <main className="cdn cdn--ficha">
        <header className="cdn-cab">
          <p className="tr-label">
            <Link href="/lab/cuaderno">← Cuaderno</Link> · {x.tipo} · {x.fecha} · {x.estado} · docs/cuaderno/{x.archivo}
          </p>
          <h1>{x.titulo}</h1>
          {x.colores.length > 0 && (
            <span className="cdn-muestras cdn-muestras--grande">
              {x.colores.map((c) => (
                <i key={c} style={{ background: c }} title={c} />
              ))}
            </span>
          )}
          <p className="cdn-enlaces">
            {x.ruta && <Link href={x.ruta}>Abrir {x.ruta} →</Link>}
            {x.referencias.map((u) => (
              <a key={u} href={u} target="_blank" rel="noreferrer">
                {u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} ↗
              </a>
            ))}
            {x.fichas.map((s) => {
              const h = docHref(s);
              return h ? (
                <Link key={s} href={h}>
                  {s}
                </Link>
              ) : (
                <span key={s}>{s}</span>
              );
            })}
          </p>
        </header>
        <div className="cdn-cuerpo">
          <Prose markdown={cuerpo} variant="minimal" codeVariant="minimal" measure="full" className="tr-prose" />
          <aside className="cdn-lado">
            {x.fuentes.length > 0 && (
              <div>
                <h2>Letras</h2>
                <p>{x.fuentes.join(", ")}</p>
              </div>
            )}
            {ETIQUETAS.filter((k) => x.etiquetas[k].length).map((k) => (
              <div key={k}>
                <h2>{NOMBRE_ETIQUETA[k]}</h2>
                <p className="cdn-chips">
                  {x.etiquetas[k].map((v) => (
                    <Link key={v} href={`/lab/cuaderno?f=${encodeURIComponent(`${k}:${v}`)}`}>
                      {v}
                    </Link>
                  ))}
                </p>
              </div>
            ))}
            {x.relacionados.length > 0 && (
              <div>
                <h2>Relacionadas</h2>
                <ul>
                  {x.relacionados.map((i) => (
                    <li key={i}>
                      <Link href={`/lab/cuaderno/${i}`}>{titulo(i)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {vecinos.length > 0 && (
              <div>
                <h2>Parecidas</h2>
                <ul>
                  {vecinos.map((v) => (
                    <li key={v.id}>
                      <Link href={`/lab/cuaderno/${v.id}`}>{titulo(v.id)}</Link> <small>{v.comunes} en común</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {x.codigo.length > 0 && (
              <div>
                <h2>Código</h2>
                <ul>
                  {x.codigo.map((c) => (
                    <li key={c}>
                      <code>{c}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </main>
    </SiteChrome>
  );
}
