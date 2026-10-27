import { splitEscaped } from "@/lib/ui/list";
import { vcls, type Variant } from "./variants";

export type CohortProgram = {
  title: string;
  /** quién lo da o lo organiza («Con la agencia Iota», «Mentawai, Indonesia») */
  kicker?: string;
  summary?: string;
  /** etiquetas de nivel (principiante, intermedio…) */
  levels?: string[];
  /** formato en chips: duración, módulos, modalidad («12 semanas», «En línea») */
  formats?: string[];
  /** lo que incluye, una línea cada cosa */
  includes?: string[];
  /** convocatorias: un nombre (mes, promoción) y sus fechas */
  cohorts?: { label: string; dates?: string[] }[];
  status?: "open" | "few" | "soon" | "closed";
  image?: string;
  href?: string;
  cta?: string;
};

export type CohortListProps = {
  /** los programas como datos o uno por línea: «título|resumen|niveles (a;b)|formato (a;b)|convocatorias (Mayo 2027: 20.05–30.05, 20.09–01.10 / Sept 2027: …)|estado|enlace» */
  programs?: CohortProgram[] | string;
  /** rows = una fila por programa con las convocatorias en columnas · cards = tarjetas con chips, lo que incluye y el botón */
  layout?: "rows" | "cards";
  /** texto del botón por defecto */
  cta?: string;
  /** textos de cada estado */
  statusLabels?: Partial<Record<NonNullable<CohortProgram["status"]>, string>>;
  variant?: Variant;
  className?: string;
};

const DEFAULT =
  "Iniciación en Somo|Una semana de olas suaves y técnica en la arena: tu primera ola verde.|Principiante;Intermedio|7 días;Grupos de 6|Junio 2027: 07.06–13.06, 21.06–27.06 / Septiembre 2027: 06.09–12.09|open|#\n" +
  "Ola artificial|Olas idénticas una tras otra y surfskate: el mejor sitio para corregir la técnica rápido.|Principiante;Intermedio;Avanzado|5 días;Vídeo análisis|Mayo 2027: 20.05–25.05|few|#\n" +
  "Viaje a Mentawai|Un archipiélago soñado: olas perfectas, barco y doce surfistas.|Avanzado|10 días;Barco|2028: fechas en breve|soon|#";

const STATUS: Record<NonNullable<CohortProgram["status"]>, string> = { open: "Plazas abiertas", few: "Últimas plazas", soon: "Próximamente", closed: "Completo" };

const parse = (s: string): CohortProgram[] =>
  s
    .split("\n")
    .map((l) => splitEscaped(l, "|").map((x) => x.trim()))
    .filter((r) => r[0])
    .map(([title, summary, levels, formats, cohorts, status, href]) => ({
      title,
      summary: summary || undefined,
      levels: levels ? levels.split(";").map((x) => x.trim()).filter(Boolean) : undefined,
      formats: formats ? formats.split(";").map((x) => x.trim()).filter(Boolean) : undefined,
      cohorts: cohorts
        ? cohorts.split("/").map((c) => {
            const [label, dates = ""] = c.split(":").map((x) => x.trim());
            return { label, dates: dates.split(",").map((d) => d.trim()).filter(Boolean) };
          })
        : undefined,
      status: (["open", "few", "soon", "closed"].includes(status) ? status : undefined) as CohortProgram["status"],
      href: href || undefined,
    }));

/**
 * Programas por convocatoria (academias, escuelas, viajes, cursos con promociones): nivel, formato, fechas de cada
 * convocatoria, estado y botón para solicitar plaza. En filas (como un calendario de viajes) o en tarjetas (como el
 * catálogo de un instituto). docs/50 §3.7.
 */
export default function CohortList({ programs = DEFAULT, layout = "rows", cta = "Ver el programa", statusLabels, variant = "minimal", className = "" }: CohortListProps) {
  const list = typeof programs === "string" ? parse(programs) : programs;
  const label = (s: NonNullable<CohortProgram["status"]>) => statusLabels?.[s] ?? STATUS[s];
  return (
    <div className={`ui-cohorts ui-cohorts--${layout} ${vcls(variant)} ${className}`.trim()}>
      {list.map((p) => (
        <article key={p.title} className={`ui-cohort ${layout === "cards" ? "ui-surface" : ""} ${p.status ? `is-${p.status}` : ""}`.trim()}>
          {p.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="ui-cohort__img" src={p.image} alt="" loading="lazy" />
          )}
          <div className="ui-cohort__main">
            {p.status && <span className={`ui-cohort__status ui-cohort__status--${p.status}`}>{label(p.status)}</span>}
            {p.kicker && <span className="ui-cohort__kicker">{p.kicker}</span>}
            <h3>{p.title}</h3>
            {!!p.levels?.length && (
              <ul className="ui-cohort__levels" aria-label="Nivel">
                {p.levels.map((l) => <li key={l}>{l}</li>)}
              </ul>
            )}
            {p.summary && <p>{p.summary}</p>}
            {!!p.formats?.length && (
              <ul className="ui-cohort__formats" aria-label="Formato">
                {p.formats.map((f) => <li key={f}>{f}</li>)}
              </ul>
            )}
            {!!p.includes?.length && (
              <ul className="ui-cohort__includes">
                {p.includes.map((f) => <li key={f}>{f}</li>)}
              </ul>
            )}
          </div>
          {!!p.cohorts?.length && (
            <dl className="ui-cohort__dates">
              {p.cohorts.map((c) => (
                <div key={c.label}>
                  <dt>{c.label}</dt>
                  {(c.dates?.length ? c.dates : ["fechas en breve"]).map((d) => <dd key={d}>{d}</dd>)}
                </div>
              ))}
            </dl>
          )}
          {p.href && p.status !== "closed" && (
            <a className="ui-cohort__cta" href={p.href}>
              {p.cta ?? cta} <span aria-hidden>→</span>
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
