import type { ReactNode } from "react";
import Callout from "@/components/ui/Callout";
import CodeBlock from "@/components/ui/CodeBlock";
import type { Intent } from "@/components/ui/intent";
import type { Variant } from "@/components/ui/variants";
import { resolveImage } from "./placeholder";
import { createSlugger, inline, plain } from "./markdownInline";

/**
 * Markdown de bloque → nodos React, para `Prose` y `Article`. Sin HTML crudo: todo se construye como elementos, así que un
 * texto que venga de un CMS o de un usuario no puede inyectar marcado. Soporta:
 *
 * - `#`–`####` títulos (con id; los mismos que devuelve `headingsOf`) · párrafos · `---` separador
 * - listas `-`/`*`/`1.` (anidadas con 2 espacios) y de tareas `- [ ]` / `- [x]`
 * - `> cita` (una última línea `— Autor` se muestra como firma) y avisos `> [!NOTE] Título` (NOTE, TIP, IMPORTANT, WARNING, CAUTION)
 * - bloques de código con ``` lenguaje nombre-de-archivo (se pintan con CodeBlock)
 * - tablas `| a | b |` con fila separadora (`|:--|--:|` alinea) · imágenes `![alt](url "pie")` (`gen:N` = imagen de ejemplo)
 * - de línea: ver `markdownInline.tsx`
 */

export type MarkdownOptions = {
  /** variante de los bloques de código */
  codeVariant?: Variant;
  /** variante de los avisos */
  calloutVariant?: Variant;
  /** añade un enlace «#» junto a cada título */
  anchors?: boolean;
};

export type Heading = { level: number; text: string; id: string };

const CALLOUTS: Record<string, Intent> = { NOTE: "info", TIP: "success", IMPORTANT: "accent", WARNING: "warning", CAUTION: "danger" };
const CALLOUT_TITLES: Record<string, string> = { NOTE: "Nota", TIP: "Consejo", IMPORTANT: "Importante", WARNING: "Cuidado", CAUTION: "Peligro" };

const RE = {
  fence: /^```\s*([\w+-]*)\s*(.*)$/,
  heading: /^(#{1,4})\s+(.*?)\s*#*\s*$/,
  hr: /^\s*([-*_])(\s*\1){2,}\s*$/,
  quote: /^\s*>\s?/,
  list: /^(\s*)([-*+]|\d+[.)])\s+(.*)$/,
  image: /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/,
  tableSep: /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/,
};

const isBlockStart = (line: string, next = "") =>
  RE.fence.test(line) || RE.heading.test(line) || RE.hr.test(line) || RE.quote.test(line) || RE.list.test(line) || RE.image.test(line) || (line.trim().startsWith("|") && RE.tableSep.test(next));

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());

type ListItem = { text: string; checked?: boolean; children: ListNode | null };
type ListNode = { ordered: boolean; start: number; items: ListItem[] };

/** Agrupa líneas de lista por sangría: una sangría mayor que la del primer ítem abre una sublista. */
function parseList(lines: string[]): ListNode {
  const first = RE.list.exec(lines[0])!;
  const base = first[1].length;
  const ordered = /\d/.test(first[2]);
  const node: ListNode = { ordered, start: ordered ? parseInt(first[2], 10) : 1, items: [] };
  let i = 0;
  while (i < lines.length) {
    const m = RE.list.exec(lines[i]);
    if (!m || m[1].length !== base) {
      i++;
      continue;
    }
    let text = m[3];
    let checked: boolean | undefined;
    const task = /^\[([ xX])\]\s+(.*)$/.exec(text);
    if (task) {
      checked = task[1] !== " ";
      text = task[2];
    }
    const sub: string[] = [];
    i++;
    while (i < lines.length) {
      const n = RE.list.exec(lines[i]);
      const indent = (lines[i].match(/^\s*/) ?? [""])[0].length;
      if (n && n[1].length <= base) break;
      // continuación del mismo ítem: sin sangría extra o, si aún no hay sublista, con ella (`- texto\n  sigue`)
      if (!n && (indent <= base || !sub.length)) {
        text += " " + lines[i].trim();
        i++;
        continue;
      }
      sub.push(lines[i]);
      i++;
    }
    node.items.push({ text, checked, children: sub.length ? parseList(sub) : null });
  }
  return node;
}

function renderList(node: ListNode, key: number): ReactNode {
  const items = node.items.map((it, i) => (
    <li key={i} className={it.checked !== undefined ? "ui-prose__task" : undefined}>
      {it.checked !== undefined && <input type="checkbox" checked={it.checked} readOnly disabled aria-label={it.checked ? "hecho" : "pendiente"} />}
      {inline(it.text)}
      {it.children && renderList(it.children, 0)}
    </li>
  ));
  return node.ordered ? (
    <ol key={key} start={node.start !== 1 ? node.start : undefined}>
      {items}
    </ol>
  ) : (
    <ul key={key} className={node.items.some((it) => it.checked !== undefined) ? "ui-prose__tasks" : undefined}>
      {items}
    </ul>
  );
}

function renderBlocks(lines: string[], opts: MarkdownOptions, slug: (t: string) => string): ReactNode[] {
  const out: ReactNode[] = [];
  let k = 0;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    // ```lenguaje archivo
    const fence = RE.fence.exec(line);
    if (fence) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) body.push(lines[i++]);
      i++;
      out.push(
        <div key={k++} className="ui-prose__code">
          <CodeBlock code={body.join("\n")} language={fence[1] || "txt"} filename={fence[2]} showLineNumbers={body.length > 3} variant={opts.codeVariant ?? "terminal"} />
        </div>,
      );
      continue;
    }

    const h = RE.heading.exec(line);
    if (h) {
      const level = h[1].length;
      const id = slug(h[2]);
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
      out.push(
        <Tag key={k++} id={id}>
          {inline(h[2])}
          {opts.anchors && level > 1 && (
            <a className="ui-prose__anchor" href={`#${id}`} aria-label={`Enlace a «${plain(h[2])}»`}>
              #
            </a>
          )}
        </Tag>,
      );
      i++;
      continue;
    }

    if (RE.hr.test(line)) {
      out.push(<hr key={k++} />);
      i++;
      continue;
    }

    // > cita · > [!NOTE] aviso
    if (RE.quote.test(line)) {
      const body: string[] = [];
      while (i < lines.length && RE.quote.test(lines[i])) body.push(lines[i++].replace(RE.quote, ""));
      const c = /^\[!(\w+)\]\s*(.*)$/.exec(body[0] ?? "");
      if (c && CALLOUTS[c[1].toUpperCase()]) {
        const kind = c[1].toUpperCase();
        out.push(
          <Callout key={k++} intent={CALLOUTS[kind]} title={c[2] || CALLOUT_TITLES[kind]} variant={opts.calloutVariant ?? "minimal"} className="ui-prose__callout">
            {renderBlocks(body.slice(1), opts, slug)}
          </Callout>,
        );
      } else {
        const last = body.length > 1 ? body[body.length - 1] : "";
        const cite = /^\s*(—|--)\s*(.+)$/.exec(last);
        out.push(
          <blockquote key={k++}>
            {renderBlocks(cite ? body.slice(0, -1) : body, opts, slug)}
            {cite && <footer>— {inline(cite[2])}</footer>}
          </blockquote>,
        );
      }
      continue;
    }

    // | tabla |
    if (line.trim().startsWith("|") && RE.tableSep.test(lines[i + 1] ?? "")) {
      const head = cells(line);
      const align = cells(lines[i + 1]).map((c) => (c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "right" : undefined));
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      out.push(
        // con scroll horizontal en pantallas estrechas: la caja es enfocable para poder desplazarla con el teclado
        <div key={k++} className="ui-prose__table" role="group" tabIndex={0} aria-label={`Tabla: ${head.map(plain).filter(Boolean).join(", ")}`}>
          <table>
            <thead>
              <tr>
                {head.map((c, j) =>
                  c ? (
                    <th key={j} scope="col" style={{ textAlign: align[j] }}>
                      {inline(c)}
                    </th>
                  ) : (
                    // una cabecera vacía (la esquina de una tabla de doble entrada) no es un encabezado
                    <td key={j} />
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>
                  {head.map((_, j) => (
                    <td key={j} style={{ textAlign: align[j] }}>
                      {inline(r[j] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const img = RE.image.exec(line);
    if (img) {
      out.push(
        <figure key={k++}>
          {/* eslint-disable-next-line @next/next/no-img-element -- contenido de terceros: sin optimizador de imágenes */}
          <img src={resolveImage(img[2])} alt={img[1]} loading="lazy" />
          {(img[3] || img[1]) && <figcaption>{inline(img[3] || img[1])}</figcaption>}
        </figure>,
      );
      i++;
      continue;
    }

    if (RE.list.test(line)) {
      const block: string[] = [];
      while (i < lines.length && lines[i].trim() && (RE.list.test(lines[i]) || /^\s+/.test(lines[i]))) block.push(lines[i++]);
      out.push(renderList(parseList(block), k++));
      continue;
    }

    // párrafo: hasta una línea en blanco o el inicio de otro bloque
    const para: string[] = [line.trim()];
    i++;
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i], lines[i + 1])) para.push(lines[i++].trim());
    out.push(<p key={k++}>{inline(para.join(" "))}</p>);
  }
  return out;
}

const toLines = (md: string) => md.replace(/\r\n?/g, "\n").replace(/\t/g, "  ").split("\n");

/** Renderiza un documento Markdown completo. */
export function renderMarkdown(md: string, opts: MarkdownOptions = {}): ReactNode[] {
  return renderBlocks(toLines(md), opts, createSlugger());
}

/** Títulos del documento con los mismos ids que les pone `renderMarkdown` (para el índice). Ignora los de los bloques de código. */
export function headingsOf(md: string, minLevel = 2, maxLevel = 3): Heading[] {
  const slug = createSlugger();
  const out: Heading[] = [];
  let inFence = false;
  for (const raw of toLines(md)) {
    if (/^```/.test(raw)) inFence = !inFence;
    if (inFence) continue;
    // los títulos dentro de citas y avisos también consumen id, igual que al renderizar
    const h = RE.heading.exec(raw.replace(/^(\s*>\s?)+/, ""));
    if (!h) continue;
    const id = slug(h[2]);
    const level = h[1].length;
    if (level >= minLevel && level <= maxLevel) out.push({ level, text: plain(h[2]), id });
  }
  return out;
}

/** Minutos de lectura estimados (220 palabras por minuto; el código no cuenta). */
export function readingMinutes(md: string): number {
  const words = md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`|[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
