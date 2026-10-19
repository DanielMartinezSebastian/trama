"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import Button from "./Button";
import { vcls, type Variant } from "./variants";

export type DataColumn<T> = {
  key: keyof T & string;
  label: string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  /** pinta la celda a tu manera (insignias, avatares…); la ordenación y la búsqueda siguen usando el valor de `key` */
  render?: (row: T) => ReactNode;
};

export type DataTableProps<T extends Record<string, unknown>> = {
  columns: DataColumn<T>[];
  rows: T[];
  /** clave única de cada fila (por defecto, su posición) */
  rowKey?: keyof T & string;
  /** título de la tabla para el lector de pantalla */
  caption?: string;
  /** caja de búsqueda que filtra por cualquier columna */
  searchable?: boolean;
  searchLabel?: string;
  /** casillas de selección y «seleccionar todo» */
  selectable?: boolean;
  onSelectionChange?: (keys: string[]) => void;
  /** filas por página (0 = todas) */
  pageSize?: number;
  /** texto cuando no hay resultados */
  emptyText?: string;
  striped?: boolean;
  variant?: Variant;
  className?: string;
};

const collator = new Intl.Collator("es", { numeric: true, sensitivity: "base" });
const cmp = (a: unknown, b: unknown) => (typeof a === "number" && typeof b === "number" ? a - b : collator.compare(String(a ?? ""), String(b ?? "")));

/**
 * Tabla de datos interactiva: ordena al pulsar la cabecera (`aria-sort`), busca en todas las columnas, selecciona filas y
 * pagina. Los datos son un array de objetos (no CSV, como `Table`), así que se pueden pintar celdas con insignias o avatares
 * con `render`. Se desplaza en horizontal si no cabe. La búsqueda y el orden se anuncian con una región `aria-live`.
 */
export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  caption = "Tabla de datos",
  searchable = true,
  searchLabel = "Buscar en la tabla",
  selectable = false,
  onSelectionChange,
  pageSize = 8,
  emptyText = "No hay resultados para esa búsqueda.",
  striped = false,
  variant = "editorial",
  className = "",
}: DataTableProps<T>) {
  const id = useId();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState<Set<string>>(new Set());

  const keyOf = (r: T, i: number) => String(rowKey ? r[rowKey] : i);
  const indexed = useMemo(() => rows.map((r, i) => ({ r, k: keyOf(r, i) })), [rows, rowKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = needle ? indexed.filter(({ r }) => columns.some((c) => String(r[c.key] ?? "").toLowerCase().includes(needle))) : indexed;
    if (sort) out = [...out].sort((a, b) => sort.dir * cmp(a.r[sort.key], b.r[sort.key]));
    return out;
  }, [indexed, q, sort, columns]);

  const pages = pageSize > 0 ? Math.max(1, Math.ceil(visible.length / pageSize)) : 1;
  const cur = Math.min(page, pages - 1);
  const shown = pageSize > 0 ? visible.slice(cur * pageSize, cur * pageSize + pageSize) : visible;

  const setSelection = (next: Set<string>) => {
    setSel(next);
    onSelectionChange?.([...next]);
  };
  const allOnPage = shown.length > 0 && shown.every((x) => sel.has(x.k));
  const toggleAll = () => {
    const next = new Set(sel);
    for (const x of shown) allOnPage ? next.delete(x.k) : next.add(x.k);
    setSelection(next);
  };
  const toggle = (k: string) => {
    const next = new Set(sel);
    next.has(k) ? next.delete(k) : next.add(k);
    setSelection(next);
  };
  const order = (key: string) => setSort((s) => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }));

  const from = visible.length === 0 ? 0 : cur * (pageSize || visible.length) + 1;
  const to = pageSize > 0 ? Math.min(visible.length, (cur + 1) * pageSize) : visible.length;

  return (
    <div className={`ui-dtable ui-surface ${vcls(variant)} ${className}`.trim()}>
      {(searchable || selectable) && (
        <div className="ui-dtable__bar">
          {searchable && (
            <label className="ui-dtable__search">
              <span className="ui-sr">{searchLabel}</span>
              <input type="search" value={q} placeholder={searchLabel} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
            </label>
          )}
          {selectable && <span className="ui-dtable__sel">{sel.size > 0 ? `${sel.size} seleccionada${sel.size === 1 ? "" : "s"}` : ""}</span>}
        </div>
      )}
      <div className="ui-dtable__scroll">
        <table className={`ui-table ${striped ? "ui-table--striped" : ""}`}>
          <caption className="ui-sr">{caption}</caption>
          <thead>
            <tr>
              {selectable && (
                <th scope="col" className="ui-dtable__chk">
                  <input type="checkbox" aria-label="Seleccionar todas las filas de esta página" checked={allOnPage} onChange={toggleAll} />
                </th>
              )}
              {columns.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <th key={c.key} scope="col" className={c.align ? `ui-dtable--${c.align}` : ""} aria-sort={active ? (sort!.dir === 1 ? "ascending" : "descending") : c.sortable ? "none" : undefined}>
                    {c.sortable ? (
                      <button type="button" className="ui-dtable__th" onClick={() => order(c.key)}>
                        {c.label}
                        <span aria-hidden className="ui-dtable__arrow">{active ? (sort!.dir === 1 ? "↑" : "↓") : "↕"}</span>
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {shown.map(({ r, k }) => (
              <tr key={k} data-selected={sel.has(k) ? "" : undefined}>
                {selectable && (
                  <td className="ui-dtable__chk">
                    <input type="checkbox" aria-label={`Seleccionar fila ${k}`} checked={sel.has(k)} onChange={() => toggle(k)} />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} className={c.align ? `ui-dtable--${c.align}` : ""}>
                    {c.render ? c.render(r) : String(r[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="ui-dtable__empty">{emptyText}</p>}
      </div>
      <div className="ui-dtable__foot">
        <span id={`${id}-n`} aria-live="polite">
          {visible.length === 0 ? "0 resultados" : `${from}–${to} de ${visible.length}`}
        </span>
        {pageSize > 0 && pages > 1 && (
          <span className="ui-dtable__pager">
            <Button label="Anterior" size="sm" emphasis="ghost" variant="editorial" disabled={cur === 0} onClick={() => setPage(cur - 1)} />
            <span aria-hidden>{cur + 1} / {pages}</span>
            <Button label="Siguiente" size="sm" emphasis="ghost" variant="editorial" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)} />
          </span>
        )}
      </div>
    </div>
  );
}
