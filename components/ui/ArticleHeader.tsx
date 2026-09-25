import { resolveImage } from "@/lib/ui/placeholder";
import { vcls, type Variant } from "./variants";

export type ArticleHeaderProps = {
  /** categoría o sección, sobre el título ("" = sin ella) */
  kicker?: string;
  title?: string;
  /** entradilla bajo el título */
  subtitle?: string;
  author?: string;
  /** cargo o descripción del autor */
  authorRole?: string;
  date?: string;
  /** "6 min" (el texto que quieras; "" = sin él) */
  readTime?: string;
  /** etiquetas separadas por comas */
  tags?: string;
  /** imagen de portada: URL o `gen:N` (imagen de ejemplo) · "" = sin portada */
  cover?: string;
  /** pie de la portada */
  coverCaption?: string;
  align?: "left" | "center";
  variant?: Variant;
  className?: string;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/** Cabecera de una entrada de blog o de una página de documentación: categoría, título, entradilla, autor, fecha, tiempo de lectura, etiquetas y portada. */
export default function ArticleHeader({
  kicker = "Guías",
  title = "Tu primera clase de surf",
  subtitle = "Qué traer, cómo es la clase y qué hacer si algo sale mal. Todo en cinco minutos.",
  author = "Lucía Ferrán",
  authorRole = "Monitora jefe",
  date = "12 sep 2026",
  readTime = "5 min",
  tags = "Iniciación, Seguridad, Material",
  cover = "gen:1",
  coverCaption = "",
  align = "left",
  variant = "minimal",
  className = "",
}: ArticleHeaderProps) {
  const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
  const meta = [date, readTime && `${readTime} de lectura`].filter(Boolean);
  return (
    <header className={`ui-arthead ui-arthead--${align} ${vcls(variant)} ${className}`}>
      {kicker && <p className="ui-arthead__kicker">{kicker}</p>}
      <h1 className="ui-arthead__title">{title}</h1>
      {subtitle && <p className="ui-arthead__sub">{subtitle}</p>}
      {(author || meta.length > 0) && (
        <div className="ui-arthead__meta">
          {author && (
            <span className="ui-arthead__author">
              <span className="ui-arthead__avatar" aria-hidden>
                {initials(author)}
              </span>
              <span>
                <strong>{author}</strong>
                {authorRole && <span className="ui-arthead__role">{authorRole}</span>}
              </span>
            </span>
          )}
          {meta.length > 0 && (
            <span className="ui-arthead__facts">
              {meta.map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </span>
          )}
        </div>
      )}
      {tagList.length > 0 && (
        <ul className="ui-arthead__tags" aria-label="Etiquetas">
          {tagList.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      {cover && (
        <figure className="ui-arthead__cover">
          {/* eslint-disable-next-line @next/next/no-img-element -- portada de terceros: sin optimizador de imágenes */}
          <img src={resolveImage(cover)} alt={coverCaption || title} />
          {coverCaption && <figcaption>{coverCaption}</figcaption>}
        </figure>
      )}
    </header>
  );
}
