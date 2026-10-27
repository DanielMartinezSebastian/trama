import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CodeBlock from "@/components/ui/CodeBlock";
import FAQSection from "@/components/ui/FAQSection";
import GuideFrame from "@/components/ui/GuideFrame";
import Marquee from "@/components/ui/Marquee";
import NavBar from "@/components/ui/NavBar";
import PricingSection from "@/components/ui/PricingSection";
import RollLink from "@/components/ui/RollLink";
import TestimonialSection from "@/components/ui/TestimonialSection";
import TextField from "@/components/ui/TextField";
import { GUIDE_RULES, guideToStyle } from "@/lib/ui/guides";
import { GESTOS_KIT, contraste, type DatosGuia } from "./fuentes";
import { HEROES, STORIES } from "./content";

/*
 * La hoja de estilo de una guía (docs/54): todo lo que el repo sabe de ella en una página. Identidad y origen, color con
 * contrastes, tipografía en vivo, espacio y superficies, movimiento y gestos del kit, componentes del kit con la guía
 * puesta, patrones de su familia en el cuaderno, receta de sector, páginas del repo que se le parecen (medidas), reglas y
 * excepciones medidas, y el código. Componente de servidor.
 */

const vw = (clamp: string) => /([\d.]+)vw/.exec(clamp)?.[1] ?? clamp;
const lista = (xs: [string, number][], n = 12) => xs.slice(0, n).map(([v, c]) => (c > 1 ? `${v} (${c})` : v));
/** «var(--font-cormorant-garamond), Georgia, serif» → «Cormorant Garamond»; «"Switzer", var(--font-inter)…» → «Switzer» */
export const nombreLetra = (pila: string) => {
  const m = /--font-([a-z0-9-]+)/.exec(pila) ?? /"([^"]+)"/.exec(pila);
  if (!m) return pila.split(",")[0];
  return m[1].includes("-") || /^[a-z]/.test(m[1]) ? m[1].split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") : m[1];
};
const AA = (r: number) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA grande" : "no llega");

function Seccion({ id, n, titulo, children }: { id: string; n: string; titulo: string; children: React.ReactNode }) {
  return (
    <section className="gs-sec" id={id} aria-labelledby={`${id}-t`}>
      <p className="tr-label">{n}</p>
      <h2 id={`${id}-t`}>{titulo}</h2>
      {children}
    </section>
  );
}

export default function GuideSheet({ d }: { d: DatosGuia }) {
  const { g } = d;
  const t = g.tokens;
  const css = Object.entries(guideToStyle(g))
    .filter(([k]) => k.startsWith("--"))
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  const pares: [string, string, string][] = [
    ["texto sobre fondo", t.fg, t.bg],
    ["secundario sobre fondo", t.mut, t.bg],
    ["acento sobre fondo", t.acc, t.bg],
    ["texto sobre tarjeta", t.fg, t.card],
  ];
  const m = d.medida?.medidas;

  return (
    <div className="gs">
      <header className="tr-page__head">
        <p className="tr-label">
          <Link href="/guias">Guías de estilo</Link> · hoja de estilo · <code>{g.id}</code>
        </p>
        <h1 className="tr-statement">{g.label}</h1>
        <p className="tr-sec__lead">{g.note}</p>
        <p className="tr-sec__lead">
          Para: {g.sectors}. Sale de: {g.refs.join(", ")}.
        </p>
        <nav className="gs-indice" aria-label="Secciones de la hoja">
          {[["color", "Color"], ["tipo", "Tipografía"], ["espacio", "Espacio y superficie"], ["movimiento", "Movimiento"], ["kit", "Componentes"], ["familia", "Familia y patrones"], ["receta", "Receta"], ["repo", "En el repo"], ["reglas", "Reglas"], ["codigo", "Código"]].map(([id, l]) => (
            <a key={id} href={`#${id}`}>{l}</a>
          ))}
        </nav>
      </header>

      {/* portada de la guía: su escala real */}
      <GuideFrame guide={g.id} className="gs-portada">
        <div className="ui-g-wrap">
          <p className="ui-g-label">{g.sectors.split(",")[0]}</p>
          <p className="ui-g-brand">{g.label.split(" ")[0]}</p>
          <p className="ui-g-body" style={{ maxWidth: "var(--g-measure)" }}>{g.note}</p>
          <p style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="ui-g-btn" href="#codigo">Usar la guía</a>
            <a className="ui-g-btn ui-g-btn--ghost" href="#repo">Ver ejemplos</a>
          </p>
        </div>
      </GuideFrame>

      <Seccion id="color" n="01" titulo="Color">
        <div className="gs-colores">
          {(["bg", "fg", "mut", "acc", "acc2", "card"] as const).map((k) => (
            <figure key={k} className="gs-color">
              <i style={{ background: t[k] as string }} />
              <figcaption>
                <b>--{k}</b>
                <span>{t[k] as string}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <table className="gs-tabla">
          <caption>Contraste (WCAG)</caption>
          <tbody>
            {pares.map(([l, a, b]) => {
              const r = contraste(a, b);
              return (
                <tr key={l}>
                  <th scope="row">{l}</th>
                  <td>{r.toFixed(1)} : 1</td>
                  <td>{AA(r)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {d.colores.length > 0 && (
          <p className="gs-nota">
            Colores de las obras de su familia en el cuaderno:{" "}
            <span className="gs-muestras">{d.colores.slice(0, 24).map((c) => <i key={c} title={c} style={{ background: c }} />)}</span>
          </p>
        )}
      </Seccion>

      <Seccion id="tipo" n="02" titulo="Tipografía">
        <GuideFrame guide={g.id} className="gs-espec">
          <div className="ui-g-wrap">
            <p className="ui-g-label">marca · {vw(g.type.brand)} vw</p>
            <p className="ui-g-brand">Aa {g.label.split(" ")[0]}</p>
            <p className="ui-g-label">titular · {vw(g.type.h1)} vw · {g.type.weight} · {g.type.lineHeight} · {g.type.tracking}em{g.type.upper ? " · mayúsculas" : ""}</p>
            <p className="ui-g-h1">El oficio se nota</p>
            <p className="ui-g-label">sección · {vw(g.type.h2)} vw</p>
            <p className="ui-g-h2">Lo que hacemos y cómo</p>
            <p className="ui-g-label">texto · {g.type.body.replace(/clamp\((.+)\)/, "$1")} / {g.type.bodyLineHeight}</p>
            <p className="ui-g-body" style={{ maxWidth: "var(--g-measure)" }}>
              Cada guía fija su par tipográfico, la escala en dos escalones y el aire entre líneas con valores medidos. Este
              párrafo usa la medida de la guía ({g.space.measure}).
            </p>
          </div>
        </GuideFrame>
        <dl className="gs-dl">
          <dt>Titulares</dt>
          <dd><code>{nombreLetra(g.fonts.display)}</code></dd>
          <dt>Texto</dt>
          <dd><code>{nombreLetra(g.fonts.body)}</code></dd>
          <dt>Acento</dt>
          <dd><code>{nombreLetra(g.fonts.accent)}</code></dd>
          {m?.titular && (
            <>
              <dt>Medido en su página</dt>
              <dd>
                titular {m.titular.letra} a {m.titular.vw} vw, peso {m.titular.peso}, interlineado {m.titular.interlineado}, {m.titular.tracking} % · texto{" "}
                {m.texto ? `${m.texto.size} px / ${m.texto.lh}` : "—"}
              </dd>
            </>
          )}
          {d.tipografia.length > 0 && (
            <>
              <dt>En su familia</dt>
              <dd>{lista(d.tipografia).join(", ")}</dd>
            </>
          )}
        </dl>
      </Seccion>

      <Seccion id="espacio" n="03" titulo="Espacio y superficie">
        <dl className="gs-dl">
          <dt>Margen</dt>
          <dd><code>{g.space.margin}</code></dd>
          <dt>Rejilla</dt>
          <dd>{g.space.cols} columnas · separación <code>{g.space.gutter}</code></dd>
          <dt>Aire entre secciones</dt>
          <dd><code>{g.space.section}</code></dd>
          <dt>Cabecera</dt>
          <dd><code>{g.space.header}</code></dd>
          <dt>Radio</dt>
          <dd>{g.surface.radius} px{g.surface.pill ? " · botones en píldora" : ""}{g.surface.shadow ? " · sombra dura" : " · sin sombra"}</dd>
          {m && (
            <>
              <dt>Medido en su página</dt>
              <dd>margen {m.margen ?? "—"} px · radios {m.radios.join(", ") || "—"}</dd>
            </>
          )}
        </dl>
        <GuideFrame guide={g.id} className="gs-superficies">
          <div className="ui-g-wrap gs-fila">
            <div className="ui-g-card" style={{ padding: 20 }}>
              <p className="ui-g-label">tarjeta</p>
              <p className="ui-g-body">Fondo --card, línea --ln, radio de la guía.</p>
            </div>
            <a className="ui-g-btn" href="#espacio">Botón</a>
            <a className="ui-g-btn ui-g-btn--ghost" href="#espacio">Secundario</a>
          </div>
        </GuideFrame>
      </Seccion>

      <Seccion id="movimiento" n="04" titulo="Movimiento">
        <dl className="gs-dl">
          <dt>Duraciones</dt>
          <dd>rápido {g.motion.fast} s · revelado {g.motion.reveal} s · cambio de página {g.motion.page} s · escalonado {g.motion.stagger} s</dd>
          <dt>Curvas</dt>
          <dd><code>{g.motion.ease}</code> · revelado <code>{g.motion.easeReveal}</code></dd>
          {m && m.curvas.length > 0 && (
            <>
              <dt>Medido en su página</dt>
              <dd>{m.curvas.join(" · ")}</dd>
            </>
          )}
        </dl>
        {d.movimiento.length > 0 && (
          <>
            <h3>Gestos de su familia y su pieza en el kit</h3>
            <ul className="gs-gestos">
              {d.movimiento.map(([mov, n]) => (
                <li key={mov}>
                  <b>{mov}</b>
                  {n > 1 ? <span> en {n} obras</span> : null} → <code>{GESTOS_KIT[mov] ?? "—"}</code>
                </li>
              ))}
            </ul>
          </>
        )}
        <GuideFrame guide={g.id} className="gs-gestos-vivos">
          <div className="ui-g-wrap gs-fila">
            <span className="ui-g-body">Pasa el ratón:</span>
            <RollLink href="#movimiento" label="Texto que rueda" fade className="ui-g-btn ui-g-btn--ghost" />
            <Marquee variant="minimal" text={`${g.label} · `} separator="" rows={1} duration={22} className="gs-cinta" />
          </div>
        </GuideFrame>
      </Seccion>

      <Seccion id="kit" n="05" titulo="Componentes del kit con la guía">
        <p className="gs-nota">
          Cualquier pieza del kit lee los tokens de la guía. Variante sugerida: <code>variant=&quot;{g.variant}&quot;</code>.
        </p>
        <GuideFrame guide={g.id} className="gs-kit">
          <NavBar brand={g.label.split(" ")[0]} links="Servicios; Equipo; Precios; Contacto" cta="Reservar" search="none" shape="contained" linkHover="underline" variant={g.variant} />
          <div className="ui-g-wrap gs-kit__fila">
            <Button label="Reservar" variant={g.variant} />
            <Button label="Ver más" variant={g.variant} emphasis="outline" />
            <Badge text="Nuevo" variant={g.variant} />
            <Badge text="Últimas plazas" intent="warning" variant={g.variant} />
          </div>
          <div className="ui-g-wrap gs-kit__fila">
            <TextField label="Correo" placeholder="tu@correo.com" hint="" variant={g.variant} />
          </div>
          <PricingSection kicker="" title="Planes" subtitle="" layout="grid" cardLayout="compact" variant={g.variant} badge="" cta="Elegir" plans={"Básico|39 €|/ mes|no|Lo esencial;Sin permanencia\nCompleto|59 €|/ mes|si|Todo lo anterior;Sesión de prueba"} />
          <TestimonialSection kicker="" title="" layout="grid" perView={2} avatars={false} presentation="plain" variant={g.variant} items={"Me sentí en buenas manos desde el primer día.|Lucía Mar|Clienta\nLo recomiendo sin dudar: cercanos y serios.|Jon Ibarra|Cliente"} />
          <FAQSection kicker="" title="Preguntas" layout="split" presentation="lines" align="left" defaultOpen={-1} variant={g.variant} items={"¿Hay sesión de prueba?|Sí, la primera es gratis.\n¿Puedo cambiar de plan?|Cuando quieras, sin coste."} />
        </GuideFrame>
      </Seccion>

      <Seccion id="familia" n="06" titulo="Familia y patrones">
        {d.fichas.length ? (
          <>
            <p className="gs-nota">
              {d.fichas.length} obras del cuaderno del laboratorio son de esta familia. Lo que se repite entre ellas es la base de la guía:
            </p>
            <dl className="gs-dl">
              <dt>Patrones</dt>
              <dd>{lista(d.patrones, 18).join(", ")}</dd>
              <dt>Tono</dt>
              <dd>{lista(d.tono).join(", ")}</dd>
              <dt>Paleta</dt>
              <dd>{lista(d.paleta).join(", ")}</dd>
              <dt>Piezas más usadas</dt>
              <dd>{lista(d.piezas, 14).join(", ")}</dd>
            </dl>
            <ul className="gs-fichas">
              {d.fichas.map((f) => (
                <li key={f.id}>
                  <b>{f.titulo}</b> · {f.tipo}
                  {f.ruta && <> · <code>{f.ruta}</code></>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="gs-nota">
            Esta guía sale de las webs premiadas estudiadas en docs/16, no de una familia del cuaderno. Las páginas del repo
            que se le parecen están en «En el repo».
          </p>
        )}
        <p className="gs-nota">
          Composiciones de portada recomendadas: {g.heroes.map((h) => HEROES.find((x) => x.id === h)?.label ?? h).join(", ")} · relatos:{" "}
          {g.stories.map((s) => STORIES.find((x) => x.id === s)?.label ?? s).join(", ")}.{" "}
          <Link href={`/guias/relato/${g.id}/${g.stories[0]}`}>Ver una página entera con la guía ↗</Link>
        </p>
      </Seccion>

      <Seccion id="receta" n="07" titulo="Receta">
        {d.receta ? (
          <>
            <p className="gs-nota">
              <b>{d.receta.sector}.</b> {d.receta.cuando}
            </p>
            <ol className="gs-receta">
              {d.receta.secciones.map(([que, piezas]) => (
                <li key={que}>
                  {que}: {piezas.map((p) => <code key={p}>{p}</code>)}
                </li>
              ))}
            </ol>
            <p className="gs-nota"><b>Llamada fija:</b> {d.receta.llamada}.</p>
            <p className="gs-nota"><b>No olvidar:</b> {d.receta.noOlvidar.join("; ")}.</p>
          </>
        ) : (
          <p className="gs-nota">Sin receta de sector todavía: usa las composiciones y relatos recomendados de la guía.</p>
        )}
      </Seccion>

      <Seccion id="repo" n="08" titulo="En el repo">
        <p className="gs-nota">
          Páginas del repo cuya guía más afín es esta, medidas con <code>refs:probe --repo</code>: afinidad de 0 a 1 al comparar fondo,
          acento, letra y escala del titular, texto y superficies. Las réplicas del laboratorio solo existen en local.
        </p>
        {d.afines.length ? (
          <table className="gs-tabla gs-tabla--repo">
            <thead>
              <tr>
                <th>Página</th>
                <th>Tipo</th>
                <th>Afinidad</th>
                <th>Titular medido</th>
                <th>Paleta</th>
              </tr>
            </thead>
            <tbody>
              {d.afines.map(({ p, afinidad }) => (
                <tr key={p.ruta}>
                  <td>{p.tipo === "replica" ? <code>{p.ruta}</code> : <Link href={p.ruta}>{p.titulo ?? p.ruta}</Link>}</td>
                  <td>{p.tipo}</td>
                  <td>{afinidad.toFixed(2)}</td>
                  <td>{p.medidas.titular ? `${p.medidas.titular.letra} · ${p.medidas.titular.vw} vw · ${p.medidas.titular.peso}` : "—"}</td>
                  <td><span className="gs-muestras">{p.medidas.paleta.slice(0, 5).map(([c], i) => <i key={`${c}-${i}`} title={c} style={{ background: c }} />)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="gs-nota">Ninguna página del repo tiene esta guía como la más afín todavía.</p>
        )}
      </Seccion>

      <Seccion id="reglas" n="09" titulo="Reglas medidas">
        <p className="gs-nota">
          <code>npm run refs:probe -- --guides &lt;base&gt;</code> mide la guía en el navegador con las once reglas de las webs premiadas (docs/16 §2).
        </p>
        <ul className="gs-reglas">
          {GUIDE_RULES.map((r) => {
            const ex = d.excepciones.find((x) => x.rule === r);
            return (
              <li key={r} className={ex ? "is-ex" : ""}>
                {r}
                {ex && <span> · excepción medida: {ex.why}</span>}
              </li>
            );
          })}
        </ul>
      </Seccion>

      <Seccion id="codigo" n="10" titulo="Código">
        <CodeBlock
          language="tsx"
          variant="minimal"
          code={`import GuideFrame from "@/components/ui/GuideFrame";

export default function Page() {
  return (
    <GuideFrame guide="${g.id}" as="main">
      <h1 className="ui-g-h1">…</h1>
      <p className="ui-g-body">…</p>
      {/* cualquier pieza del kit con variant="${g.variant}" */}
    </GuideFrame>
  );
}`}
        />
        <CodeBlock language="css" variant="minimal" code={`/* la guía «${g.label}» como variables CSS (guideToStyle) */\n.mi-web {\n${css}\n}`} />
      </Seccion>
    </div>
  );
}
