"use client";

export type FilterOption = { value: string; label: string; count?: number };
export type FilterGroup = { id: string; label: string; options: FilterOption[]; /** varias a la vez (por defecto) o solo una */ multiple?: boolean };

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
  className?: string;
};

/**
 * Barra de filtros y orden para listados: grupos de chips (`aria-pressed`) con contador por opción, selector de orden, número
 * de resultados anunciado con `aria-live` y botón «Quitar filtros». Es controlada: el estado vive en tu página.
 */
export default function FilterBar({ groups, values, onChange, sort, total, noun = "productos", className = "" }: FilterBarProps) {
  const active = Object.values(values).reduce((n, v) => n + v.length, 0);
  const toggle = (g: FilterGroup, v: string) => {
    const cur = values[g.id] ?? [];
    const next = cur.includes(v) ? cur.filter((x) => x !== v) : g.multiple === false ? [v] : [...cur, v];
    onChange({ ...values, [g.id]: next });
  };
  return (
    <div className={`ui-fbar ${className}`.trim()}>
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
