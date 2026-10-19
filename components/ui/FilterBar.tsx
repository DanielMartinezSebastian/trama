"use client";

export type FilterOption = { value: string; label: string; count?: number };
export type FilterGroup = {
  id: string;
  label: string;
  options: FilterOption[];
  /** varias a la vez (por defecto) o solo una */
  multiple?: boolean;
  /** con `layout="sentence"`: texto de la opción «sin filtro» («cualquier sector») */
  any?: string;
};

export type FilterBarProps = {
  groups: FilterGroup[];
  /** seleccionado en cada grupo: `{ material: ["gres", "porcelana"] }` */
  values: Record<string, string[]>;
  onChange: (values: Record<string, string[]>) => void;
  /** orden: opciones y valor actual */
  sort?: { value: string; options: { value: string; label: string }[]; onChange: (value: string) => void };
  /** resultados que quedan con los filtros aplicados */
  total?: number;
  /** palabra para los resultados («productos», «artículos») */
  noun?: string;
  /** chips = grupos de botones (por defecto) · sentence = una frase con un desplegable por grupo, como «Diseñamos [disciplina]
   * para [sector]» (Pentagram): filtra un catálogo grande sin parecer un formulario. Cada grupo admite un valor */
  layout?: "chips" | "sentence";
  /** con `layout="sentence"`: la frase, con `{id}` donde va el desplegable de cada grupo ("Hacemos {servicio} para {sector}") */
  sentence?: string;
  className?: string;
};

/**
 * Barra de filtros y orden para listados: grupos de chips (`aria-pressed`) con contador por opción, selector de orden, número
 * de resultados anunciado con `aria-live` y botón «Quitar filtros». Es controlada: el estado vive en tu página (guárdalo en la
 * URL si el listado es largo, para poder compartirlo y volver atrás). Con `layout="sentence"` los grupos son desplegables
 * nativos dentro de una frase; cada uno lleva su etiqueta accesible.
 */
export default function FilterBar({ groups, values, onChange, sort, total, noun = "productos", layout = "chips", sentence, className = "" }: FilterBarProps) {
  const active = Object.values(values).reduce((n, v) => n + v.length, 0);
  const toggle = (g: FilterGroup, v: string) => {
    const cur = values[g.id] ?? [];
    const next = cur.includes(v) ? cur.filter((x) => x !== v) : g.multiple === false ? [v] : [...cur, v];
    onChange({ ...values, [g.id]: next });
  };
  // la frase: trozos de texto y, en cada `{id}`, el desplegable de ese grupo
  const phrase = (sentence ?? groups.map((g) => `{${g.id}}`).join(" · ")).split(/(\{[^}]+\})/).filter(Boolean);
  return (
    <div className={`ui-fbar ${layout === "sentence" ? "ui-fbar--sentence" : ""} ${className}`.trim()}>
      {layout === "sentence" ? (
        <p className="ui-fbar__sentence">
          {phrase.map((part, i) => {
            const g = part.startsWith("{") ? groups.find((x) => x.id === part.slice(1, -1)) : undefined;
            if (!g) return <span key={i}>{part}</span>;
            return (
              <select key={i} className="ui-fbar__pick" aria-label={g.label} value={values[g.id]?.[0] ?? ""} onChange={(e) => onChange({ ...values, [g.id]: e.target.value ? [e.target.value] : [] })}>
                <option value="">{g.any ?? g.label}</option>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            );
          })}
        </p>
      ) : (
      <div className="ui-fbar__groups">
        {groups.map((g) => (
          <fieldset key={g.id} className="ui-fbar__g">
            <legend>{g.label}</legend>
            <div className="ui-fbar__chips">
              {g.options.map((o) => {
                const on = (values[g.id] ?? []).includes(o.value);
                return (
                  <button key={o.value} type="button" className="ui-fbar__chip" aria-pressed={on} onClick={() => toggle(g, o.value)}>
                    {o.label}
                    {o.count !== undefined && <small>{o.count}</small>}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      )}
      <div className="ui-fbar__bar">
        <span className="ui-fbar__n" role="status" aria-live="polite">
          {total !== undefined ? `${total} ${total === 1 ? noun.replace(/s$/, "") : noun}` : ""}
        </span>
        {active > 0 && (
          <button type="button" className="ui-fbar__clear" onClick={() => onChange(Object.fromEntries(groups.map((g) => [g.id, []])))}>
            Quitar filtros ({active})
          </button>
        )}
        {sort && (
          <label className="ui-fbar__sort">
            <span>Ordenar por</span>
            <select value={sort.value} onChange={(e) => sort.onChange(e.target.value)}>
              {sort.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        )}
      </div>
    </div>
  );
}
