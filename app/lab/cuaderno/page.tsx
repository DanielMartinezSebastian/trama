import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import SiteChrome from "@/components/site/SiteChrome";
import { ETIQUETAS, NOMBRE_ETIQUETA, leerCuaderno, relaciones, type Etiqueta } from "@/components/lab/cuaderno/datos";
import "@/components/lab/cuaderno/cuaderno.css";

/*
 * El cuaderno del laboratorio (docs/53): todos los ejercicios con sus etiquetas, las familias de estilo con lo que reúnen,
 * los patrones que van juntos y el vocabulario. Se filtra por una etiqueta (?f=campo:valor). Solo en local.
 */

export const metadata: Metadata = { title: "Cuaderno del laboratorio · Trama", robots: { index: false, follow: false } };

const filtro = (k: string, v: string) => `/lab/cuaderno?f=${encodeURIComponent(`${k}:${v}`)}`;

export default async function Cuaderno({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  await connection();
  const { f } = await searchParams;
  const todas = leerCuaderno();
  const r = relaciones(todas);
  const [fk, ...fv] = (f ?? "").split(":");
  const fval = fv.join(":");
  const campo = (ETIQUETAS as readonly string[]).includes(fk) ? (fk as Etiqueta) : fk === "tipo" ? "tipo" : null;
  const fichas = campo === "tipo" ? todas.filter((x) => x.tipo === fval) : campo ? todas.filter((x) => x.etiquetas[campo].includes(fval)) : todas;

  return (
    <SiteChrome>
      <main className="cdn">
        <header className="cdn-cab">
          <p className="tr-label">
            Laboratorio · solo en local · <Link href="/lab/estudios">réplicas</Link> · <Link href="/lab/cine">cine</Link>
          </p>
          <h1>Cuaderno del laboratorio</h1>
          <p>
            Cada ejercicio (estudio, réplica, demo, pieza, concepto o herramienta) deja una ficha en <code>docs/cuaderno/</code> con etiquetas comunes. De
            ellas salen las familias de estilo y los patrones que van juntos: la base de las guías de estilo. Método en{" "}
            <Link href="/lab/cine/docs/53-cuaderno-del-laboratorio">docs/53</Link>; nueva ficha con <code>npm run lab:cuaderno -- --nueva &lt;id&gt;</code>.
          </p>
          <p className="cdn-tipos">
            {["estudio", "réplica", "demo", "pieza", "concepto", "herramienta"].map((t) => (
              <Link key={t} href={filtro("tipo", t)} className={campo === "tipo" && fval === t ? "is-on" : ""}>
                {t} <span>{todas.filter((x) => x.tipo === t).length}</span>
              </Link>
            ))}
          </p>
          {campo && (
            <p className="cdn-filtro">
              {campo === "tipo" ? "Tipo" : NOMBRE_ETIQUETA[campo]}: <strong>{fval}</strong> · {fichas.length} fichas · <Link href="/lab/cuaderno">quitar filtro</Link>
            </p>
          )}
        </header>

        <section aria-labelledby="cdn-fichas">
          <h2 id="cdn-fichas">Fichas</h2>
          <ol className="cdn-fichas">
            {fichas.map((x) => (
              <li key={x.id} className="cdn-ficha">
                <p className="cdn-ficha__meta">
                  <span>{x.tipo}</span> · <span>{x.fecha}</span> · <span className={`cdn-estado cdn-estado--${x.estado.replace(" ", "-")}`}>{x.estado}</span>
                </p>
                <Link href={`/lab/cuaderno/${x.id}`} className="cdn-ficha__titulo">
                  {x.titulo}
                </Link>
                {x.colores.length > 0 && (
                  <span className="cdn-muestras" aria-label={`Colores: ${x.colores.join(", ")}`}>
                    {x.colores.map((c) => (
                      <i key={c} style={{ background: c }} title={c} />
                    ))}
                  </span>
                )}
                <p className="cdn-chips">
                  {(["sector", "guia", "tono", "tipografia"] as const).flatMap((k) =>
                    x.etiquetas[k].map((v) => (
                      <Link key={k + v} href={filtro(k, v)} data-campo={k}>
                        {v}
                      </Link>
                    )),
                  )}
                </p>
                {x.ruta && (
                  <Link href={x.ruta} className="cdn-ficha__ruta">
                    {x.ruta} →
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="cdn-familias">
          <h2 id="cdn-familias">Familias de estilo</h2>
          <p className="cdn-nota">Lo que reúnen las réplicas y demos de cada familia: la semilla de su guía (docs/16, E10).</p>
          <div className="cdn-familias">
            {r.familias.map((fa) => (
              <article key={fa.guia} className="cdn-familia">
                <h3>
                  <Link href={filtro("guia", fa.guia)}>{fa.guia}</Link> <span>{fa.ids.length}</span>
                </h3>
                <span className="cdn-muestras cdn-muestras--grande">
                  {fa.colores.map((c) => (
                    <i key={c} style={{ background: c }} title={c} />
                  ))}
                </span>
                <dl>
                  <dt>Letras</dt>
                  <dd>{fa.fuentes.join(", ")}</dd>
                  <dt>Tipografía</dt>
                  <dd>{fa.tipografia.slice(0, 6).map(([v, n]) => (n > 1 ? `${v} (${n})` : v)).join(", ")}</dd>
                  <dt>Paleta</dt>
                  <dd>{fa.paleta.slice(0, 5).map(([v, n]) => (n > 1 ? `${v} (${n})` : v)).join(", ")}</dd>
                  <dt>Tono</dt>
                  <dd>{fa.tono.slice(0, 6).map(([v, n]) => (n > 1 ? `${v} (${n})` : v)).join(", ")}</dd>
                  <dt>Patrones</dt>
                  <dd>{fa.patrones.slice(0, 10).map(([v, n]) => (n > 1 ? `${v} (${n})` : v)).join(", ")}</dd>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="cdn-parejas">
          <h2 id="cdn-parejas">Patrones que van juntos</h2>
          <table className="cdn-tabla">
            <thead>
              <tr>
                <th>Patrón</th>
                <th>Con</th>
                <th>Fichas</th>
              </tr>
            </thead>
            <tbody>
              {r.parejas.slice(0, 30).map((p) => (
                <tr key={p.a + p.b}>
                  <td>
                    <Link href={filtro("patrones", p.a)}>{p.a}</Link>
                  </td>
                  <td>
                    <Link href={filtro("patrones", p.b)}>{p.b}</Link>
                  </td>
                  <td>
                    {p.ids.map((id, i) => (
                      <span key={id}>
                        {i > 0 && ", "}
                        <Link href={`/lab/cuaderno/${id}`}>{id}</Link>
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-labelledby="cdn-vocabulario">
          <h2 id="cdn-vocabulario">Vocabulario</h2>
          <p className="cdn-nota">Antes de inventar una etiqueta, reutiliza la que ya existe.</p>
          {ETIQUETAS.map((k) => (
            <div key={k} className="cdn-vocab">
              <h3>{NOMBRE_ETIQUETA[k]}</h3>
              <p className="cdn-chips">
                {r.vocabulario[k].map(([v, ids]) => (
                  <Link key={v} href={filtro(k, v)} className={campo === k && fval === v ? "is-on" : ""}>
                    {v} <span>{ids.length}</span>
                  </Link>
                ))}
              </p>
            </div>
          ))}
        </section>
      </main>
    </SiteChrome>
  );
}
