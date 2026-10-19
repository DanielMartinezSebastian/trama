export type MetaRow = { k: string; v: string };

export type MetaTableProps = {
  rows: MetaRow[];
  /** columnas: 1 = clave y valor en fila · 2 = dos pares por fila */
  columns?: 1 | 2;
  /** mono y mayúsculas en las claves */
  mono?: boolean;
  /** título accesible de la tabla */
  label?: string;
  className?: string;
};

/**
 * Datos clave-valor en una caja de línea fina (fechas, lugar, superficie, plazo): la «ficha técnica» de un evento, un proyecto o un
 * producto. Es una lista de definiciones (`<dl>`), así que los lectores de pantalla leen cada pareja. Sin JS.
 */
export default function MetaTable({ rows, columns = 1, mono = true, label = "Datos", className = "" }: MetaTableProps) {
  return (
    <dl className={`ui-meta ui-meta--${columns} ${mono ? "ui-meta--mono" : ""} ${className}`.trim()} aria-label={label}>
      {rows.map((r, i) => (
        <div key={r.k + i} className="ui-meta__r">
          <dt>{r.k}</dt>
          <dd>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
