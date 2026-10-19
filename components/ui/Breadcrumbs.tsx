import { splitList } from "@/lib/ui/list";
import { vcls, type Variant } from "./variants";

export type BreadcrumbsProps = {
  /** pasos separados por comas; con `Etiqueta=/ruta` el paso es un enlace real ("Inicio=/, Sectores=/sectores, Agua") */
  items?: string;
  separator?: string;
  variant?: Variant;
  className?: string;
};

/** Ruta de navegación. El último elemento es la página actual: texto, sin enlace. */
export default function Breadcrumbs({ items = "Inicio, Cursos, Iniciación al surf", separator = "/", variant = "minimal", className = "" }: BreadcrumbsProps) {
  const list = splitList(items).map((raw) => {
    const eq = raw.indexOf("=");
    return eq > 0 ? { label: raw.slice(0, eq).trim(), href: raw.slice(eq + 1).trim() } : { label: raw, href: "" };
  });
  return (
    <nav aria-label="Ruta de navegación" className={`ui-crumbs ${vcls(variant)} ${className}`}>
      {list.map((item, i) => (
        <span key={item.label + i} className="ui-crumbs__item">
          {i === list.length - 1 ? (
            <span aria-current="page">{item.label}</span>
          ) : item.href ? (
            <a className="ui-crumbs__link" href={item.href}>
              {item.label}
            </a>
          ) : (
            <button type="button" className="ui-crumbs__link">
              {item.label}
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
