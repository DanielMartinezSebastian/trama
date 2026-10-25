import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import SiteChrome from "@/components/site/SiteChrome";
import { RONDAS, type Ronda } from "@/components/lab/cine/panel/rondas";
import { DOCS_CINE, datosVivos, type Viva } from "@/components/lab/cine/panel/datos";
import "@/components/lab/cine/panel/panel.css";

export const metadata: Metadata = { title: "Laboratorio de cine 3D · Trama", robots: { index: false, follow: false } };

const TIPO: Record<Ronda["tipo"], string> = { calibracion: "Calibración", estudio: "Estudio", herramientas: "Herramientas" };
const EJE: Record<string, string> = {
  camara: "cámara",
  luz: "luz",
  atmosfera: "atmósfera",
  post: "posprocesado",
  presupuesto: "presupuesto",
  imagen: "imagen",
  acabado: "acabado",
  dinamica: "dinámica",
  texto: "texto",
  piezas: "piezas",
  coreografia: "coreografía",
  conjunto: "conjunto",
  movimiento: "movimiento de imagen",
};

const HERRAMIENTAS: [string, string][] = [
  ["cine:explora <url>", "Primer vistazo: qué hay, qué avisos pasar, qué gesto mueve la escena y la orden de captura recomendada"],
  ["cine:sonda <url>", "Cámaras, luces, materiales con sus uniforms y las pasadas de un fotograma"],
  ["cine:capture <url>", "Captura a fotograma exacto: escena, shaders, API gráfica, DOM y vídeo"],
  ["cine:tramo", "Corta una captura por tiempo o desde que la cámara se mueve"],
  ["cine:analyze <captura>", "Tramos de cámara, imagen, relato escrito, cadena de render e informe interactivo"],
  ["cine:flujo <captura>", "Movimiento de la imagen en el vídeo: la cámara de las webs sin three"],
  ["cine:compare <ref> <banco>", "Alejamiento por eje, vídeo lado a lado y lo que conviene depurar primero"],
  ["cine:conjunto <url>", "Dinámica de un grupo de cuerpos (racimos, enjambres)"],
  ["cine:vuelta <estudio>", "Una vuelta completa con receta, historial y ruido (--ruido, --referencia, --lista)"],
];

function Barra({ eje, v, ruido }: { eje: string; v: number; ruido?: number }) {
  const enRuido = ruido !== undefined && v <= ruido * 1.1 + 0.02;
  return (
    <div className={`cpl-barra ${v <= 0.15 ? "is-bien" : v <= 0.4 ? "is-medio" : "is-lejos"}`}>
      <span className="cpl-barra__eje">{EJE[eje] ?? eje}</span>
      <span className="cpl-barra__pista">
        <span className="cpl-barra__valor" style={{ width: `${Math.min(100, v * 100)}%` }} />
        {ruido !== undefined && <span className="cpl-barra__ruido" style={{ left: `${Math.min(100, ruido * 100)}%` }} title={`ruido ${Math.round(ruido * 100)} %`} />}
      </span>
      <span className="cpl-barra__num">
        {Math.round(v * 100)} %{enRuido ? " · en el ruido" : ""}
      </span>
    </div>
  );
}

function Tarjeta({ r, viva }: { r: Ronda; viva: Viva }) {
  const todos = viva.capturas.flatMap((c) => c.archivos);
  const video = todos.find((a) => a.nombre === "vídeo lado a lado") ?? todos.find((a) => a.tipo === "video");
  // el póster: el par de fotogramas (referencia y banco) o la hoja de contacto
  const poster = todos.find((a) => a.nombre === "par de fotogramas") ?? todos.find((a) => a.nombre === "hoja de contacto");
  const ejes = viva.alejamiento ? Object.entries(viva.alejamiento).sort((a, b) => b[1] - a[1]) : [];
  return (
    <section className="cpl-ronda" id={`ronda-${r.n}`}>
      <header className="cpl-ronda__cab">
        <p className="tr-label">
          Ronda {r.n} · {r.fecha} · <span className={`cpl-tipo is-${r.tipo}`}>{TIPO[r.tipo]}</span>
        </p>
        <h2>{r.titulo}</h2>
        <p className="cpl-ronda__conclusion">{r.conclusion}</p>
      </header>

      <div className="cpl-ronda__rejilla">
        <div className="cpl-bloque">
          <h3>Origen</h3>
          {r.fuente ? (
            <>
              <a href={r.fuente.url} target="_blank" rel="noopener noreferrer" className="cpl-enlace">
                {r.fuente.nombre} ↗
              </a>
              <p className="cpl-mut">
                {r.fuente.motor} · gesto: {r.fuente.gesto}
              </p>
            </>
          ) : (
            <p className="cpl-mut">Sin web nueva: herramientas del método.</p>
          )}
        </div>

        <div className="cpl-bloque">
          <h3>Implementación en el laboratorio</h3>
          {r.lab ? (
            <Link href={r.lab} className="cpl-enlace" target="_blank">
              Abrir el banco {r.lab} ↗
            </Link>
          ) : (
            <p className="cpl-mut">Sin banco (solo referencia).</p>
          )}
          {viva.orden && <code className="cpl-orden">{viva.orden}</code>}
        </div>

        <div className="cpl-bloque">
          <h3>Componentes del kit</h3>
          {r.componentes.length ? (
            <ul className="cpl-lista">
              {r.componentes.map((c) => (
                <li key={c.nombre}>
                  {c.catalogo ? (
                    <Link href={`/componentes#${c.catalogo}`} className="cpl-enlace">
                      {c.nombre}
                    </Link>
                  ) : (
                    <span>{c.nombre}</span>
                  )}
                  <code className="cpl-ruta">{c.ruta}</code>
                </li>
              ))}
            </ul>
          ) : (
            <p className="cpl-mut">Ninguno.</p>
          )}
        </div>

        <div className="cpl-bloque">
          <h3>Herramientas</h3>
          <ul className="cpl-chips">
            {r.herramientas.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="cpl-ronda__medidas">
        <div className="cpl-bloque">
          <h3>Resultado al cerrar la ronda</h3>
          <table className="cpl-tabla">
            <tbody>
              {r.resultado.map((x) => (
                <tr key={x.eje}>
                  <td>{x.eje}</td>
                  <td className="cpl-num">{x.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="cpl-bloque">
          <h3>
            {ejes.length ? "Último medido" : viva.ruido ? "Ruido de la referencia" : "Último medido"} {viva.de && ejes.length > 0 && <code className="cpl-ruta">{viva.de}</code>}
          </h3>
          {ejes.length ? (
            ejes.map(([k, v]) => <Barra key={k} eje={k} v={v} ruido={viva.ruido?.[k]} />)
          ) : viva.ruido ? (
            // sin banco: lo que se separa la referencia de sí misma
            Object.entries(viva.ruido)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => <Barra key={k} eje={k} v={v} />)
          ) : (
            <p className="cpl-mut">Sin comparación en disco.</p>
          )}
          {viva.ruido && <p className="cpl-mut cpl-nota">La marca vertical es el ruido de la propia referencia (cine:vuelta --ruido).</p>}
        </div>
      </div>

      {(video || viva.capturas.some((c) => c.archivos.length)) && (
        <div className="cpl-ronda__medios">
          {video && (
            <figure className="cpl-video">
              <video src={video.href} poster={poster?.href} controls preload="none" playsInline />
              <figcaption>{video.nombre === "vídeo lado a lado" ? "Referencia | banco" : video.nombre}</figcaption>
            </figure>
          )}
          <div className="cpl-capturas">
            {viva.capturas.map((c) => (
              <div key={c.papel} className="cpl-captura">
                <p className="tr-label">{c.papel}</p>
                <code className="cpl-ruta">.refs3d/{c.ruta}</code>
                {!c.existe && <p className="cpl-mut">No está en este equipo.</p>}
                <ul className="cpl-lista">
                  {c.archivos.map((a) => (
                    <li key={a.href}>
                      <a href={a.href} target="_blank" rel="noopener" className="cpl-enlace">
                        {a.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
                {c.orden && <code className="cpl-orden" title="la orden exacta de la captura">{c.orden}</code>}
              </div>
            ))}
          </div>
        </div>
      )}

      {viva.vueltas.length > 0 && (
        <details className="cpl-vueltas">
          <summary>Historial de vueltas ({viva.vueltas.length})</summary>
          <table className="cpl-tabla">
            <thead>
              <tr>
                <th>Vuelta</th>
                <th>Fecha</th>
                <th>Nota</th>
                <th>Commit</th>
                <th>Ejes</th>
              </tr>
            </thead>
            <tbody>
              {[...viva.vueltas].reverse().map((v) => (
                <tr key={`${v.n}-${v.fecha}`}>
                  <td className="cpl-num">{v.n}</td>
                  <td>{v.fecha.slice(0, 16).replace("T", " ")}</td>
                  <td>{v.nota}</td>
                  <td>
                    <code>{v.commit}</code>
                  </td>
                  <td className="cpl-ejes">
                    {Object.entries(v.alejamiento)
                      .sort((a, b) => b[1] - a[1])
                      .map(([k, x]) => `${EJE[k] ?? k} ${Math.round(x * 100)} %`)
                      .join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}

      <footer className="cpl-ronda__pie">
        <Link href={`/lab/cine/docs/${r.doc.replace(/\.md$/, "")}`} className="cpl-enlace">
          Documento: docs/{r.doc}
        </Link>
        <span className="cpl-mut">Commits {r.commits.map((c) => <code key={c}>{c}</code>)}</span>
        {r.pendiente.length > 0 && <span className="cpl-mut">Pendiente: {r.pendiente.join(" · ")}</span>}
      </footer>
    </section>
  );
}

export default async function PanelCine() {
  await connection();
  const vivas = RONDAS.map((r) => ({ r, viva: datosVivos(r) }));
  const componentes = new Set(RONDAS.flatMap((r) => r.componentes.filter((c) => c.catalogo).map((c) => c.catalogo)));
  const estudios = RONDAS.filter((r) => r.tipo === "estudio").length;
  return (
    <SiteChrome app>
      <main className="cpl">
        <aside className="cpl__lado" aria-label="Rondas">
          <p className="tr-label">Rondas</p>
          <ul>
            {RONDAS.map((r) => (
              <li key={r.n}>
                <a href={`#ronda-${r.n}`}>
                  <span className="cpl-num">{r.n}</span> {r.fuente?.nombre.split(" (")[0] ?? r.titulo}
                </a>
              </li>
            ))}
          </ul>
          <p className="tr-label">Documentos</p>
          <ul>
            {DOCS_CINE.map((d) => (
              <li key={d}>
                <Link href={`/lab/cine/docs/${d.replace(/\.md$/, "")}`}>{d.replace(/\.md$/, "")}</Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="cpl__principal">
          <header className="cpl__cab">
            <p className="tr-label">Laboratorio · solo en local</p>
            <h1>Cine 3D: rondas, estudios y herramientas</h1>
            <p>
              Cada ronda con su web de origen, su implementación en el banco del laboratorio, los componentes que entraron en el kit, las capturas (informes y vídeos) y lo último medido. Los
              datos vivos se leen de <code>.refs3d</code> en cada visita.
            </p>
            <dl className="cpl-cifras">
              <div>
                <dt>Rondas</dt>
                <dd>{RONDAS.length}</dd>
              </div>
              <div>
                <dt>Estudios de webs</dt>
                <dd>{estudios}</dd>
              </div>
              <div>
                <dt>Componentes nuevos</dt>
                <dd>{componentes.size}</dd>
              </div>
              <div>
                <dt>Herramientas</dt>
                <dd>{HERRAMIENTAS.length}</dd>
              </div>
            </dl>
          </header>

          {vivas.map(({ r, viva }) => (
            <Tarjeta key={r.n} r={r} viva={viva} />
          ))}

          <section className="cpl-ronda" id="herramientas">
            <header className="cpl-ronda__cab">
              <p className="tr-label">Inspector</p>
              <h2>Herramientas del método</h2>
            </header>
            <table className="cpl-tabla">
              <tbody>
                {HERRAMIENTAS.map(([o, d]) => (
                  <tr key={o}>
                    <td>
                      <code>npm run {o.replace(/ .*/, "")} --{o.includes(" ") ? o.slice(o.indexOf(" ")) : ""}</code>
                    </td>
                    <td>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </SiteChrome>
  );
}
