import { vcls, type Variant } from "./variants";

export type TableProps = {
  /** CSV: la primera línea son las cabeceras; separa con «,» */
  csv?: string;
  striped?: boolean;
  /** full = ocupa todo el ancho disponible · auto = se ajusta al contenido */
  width?: "full" | "auto";
  variant?: Variant;
  className?: string;
};

/** Tabla de datos a partir de texto CSV. Ocupa el ancho disponible (o el de su contenido, con `width="auto"`) y, si no cabe, se desplaza en horizontal. Cabecera y filas se adaptan a la variante. */
export default function Table({ csv = "Plan, Clases, Precio\nIniciación, 1, 35 €\nBono 5, 5, 150 €\nSurf trip, 6, 240 €", striped = true, width = "full", variant = "solid", className = "" }: TableProps) {
  const rows = csv.split("\n").map((l) => l.split(",").map((c) => c.trim())).filter((r) => r.some(Boolean));
  const [head, ...body] = rows;
  return (
    <div className={`ui-table-wrap ui-table-wrap--${width} ui-surface ${vcls(variant)} ${className}`} style={{ padding: 4 }}>
      <table className={`ui-table ${striped ? "ui-table--striped" : ""}`}>
        {head && (
          <thead>
            <tr>
              {head.map((h, i) => (
                <th key={h + i}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {body.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
