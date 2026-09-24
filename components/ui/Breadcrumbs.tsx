import { vcls, type Variant } from "./variants";

export type BreadcrumbsProps = {
  items?: string;
  separator?: string;
  variant?: Variant;
  className?: string;
};

/** Ruta de navegación. El último elemento es la página actual: texto, sin enlace. */
export default function Breadcrumbs({ items = "Inicio, Cursos, Iniciación al surf", separator = "/", variant = "minimal", className = "" }: BreadcrumbsProps) {
  const list = items.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <nav aria-label="Ruta de navegación" className={`ui-crumbs ${vcls(variant)} ${className}`}>
      {list.map((item, i) => (
        <span key={item + i} className="ui-crumbs__item">
          {i === list.length - 1 ? (
            <span aria-current="page">{item}</span>
          ) : (
            <button type="button" className="ui-crumbs__link">
              {item}
            </button>
          )}
          {i < list.length - 1 && (
            <span className="ui-crumbs__sep" aria-hidden>
              {separator}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
