import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import SiteChrome from "@/components/site/SiteChrome";
import { RONDAS, type Ronda } from "@/components/lab/cine/panel/rondas";
import { DOCS_CINE, datosVivos, hrefArchivo, hrefCodigo, type Archivo, type Carpeta, type Viva } from "@/components/lab/cine/panel/datos";
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

const buscar = (cs: Carpeta[], papel: RegExp, nombre: string) => cs.find((c) => papel.test(c.papel))?.archivos.find((a) => a.nombre === nombre);

/** los accesos de una ronda: lo que más se busca, en botones arriba de la ficha */
function Accesos({ r, viva }: { r: Ronda; viva: Viva }) {
  const informeRef = buscar(viva.capturas, /^Referencia/, "informe.html");
  const informeBanco = buscar(viva.capturas, /^Banco/, "informe.html");
  const lado = buscar(viva.capturas, /^Comparación/, "lado.mp4");
  const cmp = buscar(viva.capturas, /^Comparación/, "comparacion.md");
  const botones: { href: string; texto: string; fuera?: boolean; fuerte?: boolean }[] = [
    ...(r.fuente ? [{ href: r.fuente.url, texto: `Web original: ${r.fuente.nombre.split(" (")[0]} ↗`, fuera: true, fuerte: true }] : []),
    ...(r.lab ? [{ href: r.lab, texto: "Demo en el laboratorio ↗", fuera: true, fuerte: true }] : []),
    ...r.componentes.flatMap((c) => [...(c.catalogo ? [{ href: `/componentes#${c.catalogo}`, texto: `${c.nombre.split(" (")[0]} en el catálogo`, fuerte: true }] : []), { href: hrefCodigo(c.ruta.replace(/\/$/, "")), texto: `Código: ${c.ruta}` }]),
    ...(informeRef ? [{ href: informeRef.href, texto: "Informe de la referencia ↗", fuera: true }] : []),
    ...(informeBanco ? [{ href: informeBanco.href, texto: "Informe del banco ↗", fuera: true }] : []),
    ...(lado ? [{ href: lado.href, texto: "Vídeo lado a lado ↗", fuera: true }] : []),
    ...(cmp ? [{ href: cmp.href, texto: "Comparación por ejes ↗", fuera: true }] : []),
    { href: `/lab/cine/docs/${r.doc.replace(/\.md$/, "")}`, texto: `Documento docs/${r.doc.slice(0, 2)}` },
    { href: `#recursos-${r.n}`, texto: "Todos los archivos ↓" },
  ];
  return (
    <nav className="cpl-accesos" aria-label={`Enlaces de la ronda ${r.n}`}>
      {botones.map((b) =>
        b.href.startsWith("/") && !b.fuera ? (
          <Link key={b.href + b.texto} href={b.href} className={`cpl-boton ${b.fuerte ? "is-fuerte" : ""}`}>
            {b.texto}
          </Link>
        ) : (
          <a key={b.href + b.texto} href={b.href} className={`cpl-boton ${b.fuerte ? "is-fuerte" : ""}`} target={b.fuera ? "_blank" : undefined} rel={b.fuera ? "noopener noreferrer" : undefined}>
            {b.texto}
          </a>
        ),
      )}
    </nav>
  );
}

/** una carpeta de recursos: vídeos que se reproducen, imágenes en miniatura, informes, datos y subcarpetas */
function Recursos({ c }: { c: Carpeta }) {
  const por = (t: Archivo["tipo"]) => c.archivos.filter((a) => a.tipo === t);
  const imagenes = por("imagen");
  const poster = imagenes.find((a) => /^(par|hoja)\./.test(a.nombre))?.href;
  const otros = [...por("datos"), ...por("texto"), ...por("otro")];
  return (
    <div className="cpl-recurso">
      <div className="cpl-recurso__cab">
        <p className="tr-label">{c.papel}</p>
        <a href={c.href} target="_blank" rel="noopener" className="cpl-enlace cpl-ruta">
          .refs3d/{c.ruta} · abrir la carpeta ↗
        </a>
      </div>
      {!c.existe && <p className="cpl-mut">No está en este equipo.</p>}
      {por("informe").length > 0 && (
        <ul className="cpl-chips">
          {por("informe").map((a) => (
            <li key={a.href}>
              <a href={a.href} target="_blank" rel="noopener">
                {a.titulo} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
      {por("video").length > 0 && (
        <div className="cpl-recurso__videos">
          {por("video").map((a) => (
            <figure key={a.href} className="cpl-video">
              <video src={a.href} poster={poster} controls preload="none" playsInline />
              <figcaption>
                <a href={a.href} target="_blank" rel="noopener">
                  {a.titulo}
                </a>{" "}
                · {a.kb > 1024 ? `${(a.kb / 1024).toFixed(1)} MB` : `${a.kb} kB`}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {imagenes.length > 0 && (
        <div className="cpl-recurso__imgs">
          {imagenes.slice(0, 8).map((a) => (
            <a key={a.href} href={a.href} target="_blank" rel="noopener" title={a.titulo}>
              {/* eslint-disable-next-line @next/next/no-img-element -- archivos locales de .refs3d, sin optimizar */}
              <img src={a.href} alt={a.titulo} loading="lazy" />
              <span>{a.titulo}</span>
            </a>
          ))}
          {imagenes.length > 8 && (
            <a href={c.href} target="_blank" rel="noopener" className="cpl-recurso__mas">
              +{imagenes.length - 8} imágenes más ↗
            </a>
          )}
        </div>
      )}
      {(otros.length > 0 || c.subcarpetas.length > 0) && (
        <ul className="cpl-chips">
          {c.subcarpetas.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener">
                carpeta {s.nombre === "frames" ? "fotogramas" : s.nombre} ({s.n}) ↗
              </a>
            </li>
          ))}
          {otros.map((a) => (
            <li key={a.href}>
              <a href={a.href} target="_blank" rel="noopener" title={a.nombre}>
                {a.titulo}
              </a>
            </li>
          ))}
        </ul>
      )}
      {c.orden && (
        <code className="cpl-orden" title="la orden exacta de la captura">
          {c.orden}
        </code>
      )}
    </div>
  );
}

function Tarjeta({ r, viva }: { r: Ronda; viva: Viva }) {
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

      <Accesos r={r} viva={viva} />

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
          <h3>Demo en el laboratorio</h3>
          {r.lab ? (
            <a href={r.lab} target="_blank" rel="noopener" className="cpl-enlace">
              {r.lab} ↗
            </a>
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
                      {c.nombre} · catálogo
                    </Link>
                  ) : (
                    <span>{c.nombre}</span>
                  )}
                  <a href={hrefCodigo(c.ruta.replace(/\/$/, ""))} target="_blank" rel="noopener" className="cpl-ruta cpl-enlace">
                    {c.ruta} · código ↗
                  </a>
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
            Object.entries(viva.ruido)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => <Barra key={k} eje={k} v={v} />)
          ) : (
            <p className="cpl-mut">Sin comparación en disco.</p>
          )}
          {viva.ruido && <p className="cpl-mut cpl-nota">La marca vertical es el ruido de la propia referencia (cine:vuelta --ruido).</p>}
        </div>
      </div>

      <div className="cpl-recursos" id={`recursos-${r.n}`}>
        <h3 className="cpl-recursos__titulo">Recursos generados</h3>
        {viva.capturas.map((c) => (
          <Recursos key={c.papel + c.ruta} c={c} />
        ))}
        {viva.extras.length > 0 && (
          <details className="cpl-extras">
            <summary>Más capturas de la ronda ({viva.extras.length}): exploraciones, sondas, pruebas y ruido</summary>
            {viva.extras.map((c) => (
              <Recursos key={c.papel + c.ruta} c={c} />
            ))}
          </details>
        )}
      </div>

      {viva.vueltas.length > 0 && (
        <details className="cpl-vueltas">
          <summary>Historial de vueltas ({viva.vueltas.length})</summary>
          <table className="cpl-tabla">
            <thead>
              <tr>
                <th>Vuelta</th>
                <th>Fecha</th>
                <th>Nota</th>
                <th>Ejes</th>
                <th>Archivos</th>
              </tr>
            </thead>
            <tbody>
              {[...viva.vueltas].reverse().map((v) => (
                <tr key={`${v.n}-${v.fecha}`}>
                  <td className="cpl-num">{v.n}</td>
                  <td>
                    {v.fecha.slice(0, 16).replace("T", " ")}
                    <br />
                    <code>{v.commit}</code>
                  </td>
                  <td>{v.nota}</td>
                  <td className="cpl-ejes">
                    {Object.entries(v.alejamiento)
                      .sort((a, b) => b[1] - a[1])
                      .map(([k, x]) => `${EJE[k] ?? k} ${Math.round(x * 100)} %`)
                      .join(" · ")}
                  </td>
                  <td className="cpl-ejes">
                    {v.carpeta && (
                      <>
                        <a href={hrefArchivo(`${v.carpeta}/par.png`)} target="_blank" rel="noopener" className="cpl-enlace">
                          par
                        </a>{" "}
                        ·{" "}
                        <a href={hrefArchivo(`${v.carpeta}/cmp/lado.mp4`)} target="_blank" rel="noopener" className="cpl-enlace">
                          vídeo
                        </a>{" "}
                        ·{" "}
                        <a href={hrefArchivo(`${v.carpeta}/cmp/comparacion.md`)} target="_blank" rel="noopener" className="cpl-enlace">
                          comparación
                        </a>{" "}
                        ·{" "}
                        <a href={hrefArchivo(v.carpeta)} target="_blank" rel="noopener" className="cpl-enlace">
                          carpeta
                        </a>
                      </>
                    )}
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
  const componentes = RONDAS.flatMap((r) => r.componentes.filter((c) => c.catalogo).map((c) => ({ ...c, ronda: r.n })));
  const demos = RONDAS.filter((r) => r.lab);
  const estudios = RONDAS.filter((r) => r.tipo === "estudio").length;
  return (
    // sin `app`: el marco de aplicación fija la página (como el catálogo, con paneles propios) y aquí hay que desplazarse
    <SiteChrome>
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
          <p className="tr-label">Archivos</p>
          <ul>
            <li>
              <a href={hrefArchivo(".refs3d")} target="_blank" rel="noopener">
                Todas las capturas (.refs3d) ↗
              </a>
            </li>
            <li>
              <a href={hrefCodigo("scripts/cine")} target="_blank" rel="noopener">
                Código del inspector ↗
              </a>
            </li>
          </ul>
        </aside>

        <div className="cpl__principal">
          <header className="cpl__cab">
            <p className="tr-label">Laboratorio · solo en local</p>
            <h1>Cine 3D: rondas, estudios y herramientas</h1>
            <p>
              Cada ronda con su web de origen, su demo en el laboratorio, los componentes que entraron en el kit y todo lo que generó: informes, vídeos, imágenes, datos y capturas. Lo vivo se lee de{" "}
              <code>.refs3d</code> en cada visita.
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
                <dd>{new Set(componentes.map((c) => c.catalogo)).size}</dd>
              </div>
              <div>
                <dt>Herramientas</dt>
                <dd>{HERRAMIENTAS.length}</dd>
              </div>
            </dl>
          </header>

          <section className="cpl-ronda cpl-indice" aria-label="Accesos directos">
            <div className="cpl-indice__col">
              <h3>Demos del laboratorio</h3>
              <ul className="cpl-lista">
                {demos.map((r) => (
                  <li key={r.n}>
                    <a href={r.lab} target="_blank" rel="noopener" className="cpl-enlace">
                      {r.fuente?.nombre.split(" (")[0]} ↗
                    </a>
                    <span className="cpl-ruta">
                      {r.lab} · ronda {r.n}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cpl-indice__col">
              <h3>Componentes creados</h3>
              <ul className="cpl-lista">
                {componentes.map((c) => (
                  <li key={c.nombre}>
                    <Link href={`/componentes#${c.catalogo}`} className="cpl-enlace">
                      {c.nombre.split(" (")[0]}
                    </Link>
                    <a href={hrefCodigo(c.ruta)} target="_blank" rel="noopener" className="cpl-ruta cpl-enlace">
                      {c.ruta} · ronda {c.ronda}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cpl-indice__col">
              <h3>Webs estudiadas</h3>
              <ul className="cpl-lista">
                {RONDAS.filter((r) => r.fuente).map((r) => (
                  <li key={r.n}>
                    <a href={r.fuente!.url} target="_blank" rel="noopener noreferrer" className="cpl-enlace">
                      {r.fuente!.nombre} ↗
                    </a>
                    <span className="cpl-ruta">
                      {r.fuente!.motor} · ronda {r.n}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

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
