import { readingMinutes } from "@/lib/ui/markdown";
import ArticleHeader, { type ArticleHeaderProps } from "./ArticleHeader";
import Prose, { DEMO_MARKDOWN, type ProseProps } from "./Prose";
import ScrollProgress from "./ScrollProgress";
import TableOfContents, { type TableOfContentsProps } from "./TableOfContents";
import type { Variant } from "./variants";

export type ArticleProps = Omit<ArticleHeaderProps, "className" | "variant" | "readTime"> & {
  /** el cuerpo en Markdown (ver Prose) */
  markdown?: string;
  /** "auto" = se calcula del texto · "" = sin tiempo de lectura · o el texto que quieras ("6 min") */
  readTime?: string;
  /** dónde va el índice · none = sin índice. En contenedores estrechos baja sobre el texto */
  toc?: "right" | "left" | "none";
  tocTitle?: string;
  tocKind?: TableOfContentsProps["kind"];
  tocDepth?: TableOfContentsProps["depth"];
  /** barra de progreso de lectura fija arriba de la ventana */
  progress?: boolean;
  size?: "sm" | "md" | "lg";
  measure?: ProseProps["measure"];
  dropCap?: boolean;
  codeVariant?: Variant;
  variant?: Variant;
  className?: string;
};

/**
 * Sección de artículo completa, lista para pegar en un blog o una documentación: cabecera (`ArticleHeader`), índice lateral
 * que sigue la lectura (`TableOfContents`), cuerpo con formato (`Prose`) y, opcional, barra de progreso de lectura.
 */
export default function Article({
  markdown = DEMO_MARKDOWN,
  readTime = "auto",
  toc = "right",
  tocTitle = "En esta página",
  tocKind = "rail",
  tocDepth = 3,
  progress = false,
  size = "md",
  measure = "normal",
  dropCap = false,
  codeVariant = "terminal",
  variant = "minimal",
  className = "",
  ...header
}: ArticleProps) {
  // el título del artículo ya lo pinta la cabecera: un «# Título» al principio del Markdown se quita para no repetirlo
  const body = markdown.replace(/^\s*#\s+[^\n]*\n/, "");
  const time = readTime === "auto" ? `${readingMinutes(body)} min` : readTime;
  return (
    <article className={`ui-article ui-article--toc-${toc} ${className}`}>
      {progress && <ScrollProgress placement="top" variant={variant} label="Progreso de lectura" />}
      <ArticleHeader {...header} readTime={time} variant={variant} className="ui-article__head" />
      <div className="ui-article__body">
        {toc !== "none" && (
          <aside className="ui-article__toc">
            <TableOfContents markdown={body} title={tocTitle} kind={tocKind} depth={tocDepth} sticky variant={variant} />
          </aside>
        )}
        <Prose markdown={body} size={size} measure={measure} dropCap={dropCap} codeVariant={codeVariant} variant={variant} className="ui-article__prose" />
      </div>
    </article>
  );
}
