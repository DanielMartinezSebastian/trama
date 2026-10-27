import Link from "next/link";
import { leerCuaderno } from "@/components/lab/cuaderno/datos";
import { STYLE_GUIDES } from "@/lib/ui/guides";
import { REPO } from "./fuentes";
import { nombreLetra } from "./GuideSheet";

/*
 * Índice de /guias (docs/54): de dónde salen las guías (webs premiadas, estudios por sector, el repo), una tarjeta por
 * guía con su hoja de estilo, y el repo entero clasificado por guía con la afinidad medida. Componente de servidor.
 */

const GRUPOS = [
  { id: "premiadas", titulo: "De las webs premiadas", nota: "Constantes medidas en webs de Awwwards (docs/16)." },
  { id: "sectores", titulo: "De los estudios por sector", nota: "Familias del cuaderno del laboratorio: réplicas medidas contra la web original (docs/50, docs/53)." },
  { id: "repo", titulo: "De la estética propia de Trama", nota: "Lo que el repo ya hace y no tenía guía: ASCII, terminal, pixel, puntos (docs/54)." },
] as const;

export default function GuideIndex() {
  const paginas = REPO.paginas.filter((p) => p.tipo !== "guia");
  const porGuia = (id: string) => paginas.filter((p) => p.afinidad[0]?.guia === id).length;
  const fichas = leerCuaderno().length;
  const cuenta = (t: string) => paginas.filter((p) => p.tipo === t).length;

  return (
    <div className="gi">
      <section className="gi-grupo" aria-labelledby="gi-fuentes">
        <h2 id="gi-fuentes" className="tr-label">De dónde salen</h2>
        <div className="gi-fuentes">
          <div><b>{STYLE_GUIDES.length}</b><p>guías, cada una con su hoja de estilo: color, letra, escala, espacio, movimiento, componentes y código</p></div>
          <div><b>{cuenta("web") + cuenta("landing")}</b><p>webs y landings del repo medidas con <code>refs:probe --repo</code> y asignadas a su guía más afín</p></div>
          <div><b>{cuenta("replica")}</b><p>réplicas de webs reales medidas contra su original (<code>--par</code>)</p></div>
          <div><b>{fichas}</b><p>fichas del cuaderno del laboratorio: patrones, tono y gestos de cada familia</p></div>
        </div>
      </section>

      {GRUPOS.map((gr) => {
        const gs = STYLE_GUIDES.filter((g) => (g.source ?? "premiadas") === gr.id);
        if (!gs.length) return null;
        return (
          <section key={gr.id} className="gi-grupo" aria-labelledby={`gi-${gr.id}`}>
            <h2 id={`gi-${gr.id}`}>{gr.titulo} · {gs.length}</h2>
            <p className="gs-nota">{gr.nota}</p>
            <div className="gi-rejilla">
              {gs.map((g) => (
                <Link key={g.id} href={`/guias/${g.id}`} className="gi-guia">
                  <div className="gi-guia__muestra" style={{ background: g.tokens.bg, color: g.tokens.fg, fontFamily: g.fonts.display, fontWeight: g.type.weight, textTransform: g.type.upper ? "uppercase" : "none", letterSpacing: `${g.type.tracking}em` }}>
                    <b>{g.label.split(" ")[0]}</b>
                    <span aria-hidden>{[g.tokens.bg, g.tokens.fg, g.tokens.acc, g.tokens.acc2, g.tokens.card].map((c, i) => <i key={i} style={{ background: c as string }} />)}</span>
                  </div>
                  <strong>{g.label}</strong>
                  <p>{g.note}</p>
                  <small>
                    {nombreLetra(g.fonts.display)} + {nombreLetra(g.fonts.body)} · {porGuia(g.id)} páginas del repo
                  </small>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className="gi-grupo" aria-labelledby="gi-repo">
        <h2 id="gi-repo">El repo por guías</h2>
        <p className="gs-nota">
          Cada web, landing y réplica del repo medida en el navegador y comparada con las guías medidas igual: fondo, acento,
          letra y escala del titular, texto y superficies (medida del {REPO.fecha || "—"}). Las réplicas solo existen en local.
        </p>
        <table className="gs-tabla gs-tabla--repo">
          <thead>
            <tr>
              <th>Página</th>
              <th>Tipo</th>
              <th>Guía más afín</th>
              <th>Después</th>
            </tr>
          </thead>
          <tbody>
            {paginas.map((p) => {
              const [a, ...resto] = p.afinidad;
              const g = STYLE_GUIDES.find((x) => x.id === a?.guia);
              return (
                <tr key={p.ruta}>
                  <td>{p.tipo === "replica" ? <code>{p.titulo ?? p.ruta}</code> : <Link href={p.ruta}>{p.titulo ?? p.ruta}</Link>}</td>
                  <td>{p.tipo}</td>
                  <td>{g ? <Link href={`/guias/${g.id}`}>{g.label}</Link> : "—"} {a ? <small>({a.afinidad.toFixed(2)})</small> : null}</td>
                  <td><small>{resto.map((x) => `${STYLE_GUIDES.find((y) => y.id === x.guia)?.label ?? x.guia} ${x.afinidad.toFixed(2)}`).join(" · ")}</small></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
