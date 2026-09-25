import type { ReactNode } from "react";

/**
 * Markdown de línea → nodos React (sin `dangerouslySetInnerHTML`: el texto nunca se interpreta como HTML).
 *
 * `código` · **negrita** · *cursiva* / _cursiva_ · ~~tachado~~ · ==resaltado== · [[Ctrl]] (tecla) · [texto](url)
 *
 * Los enlaces solo admiten http(s), mailto, rutas (`/…`, `./…`) y anclas (`#…`); cualquier otro esquema (javascript:,
 * data:…) se convierte en `#`. Los externos se abren en otra pestaña con `rel="noopener noreferrer"`.
 */

const SAFE_HREF = /^(https?:\/\/|mailto:|\/|\.\/|\.\.\/|#)/i;
export const safeHref = (href: string) => (SAFE_HREF.test(href.trim()) ? href.trim() : "#");

type Rule = { re: RegExp; render: (m: RegExpExecArray, key: number) => ReactNode };

const RULES: Rule[] = [
  { re: /`([^`]+)`/, render: (m, k) => <code key={k}>{m[1]}</code> },
  { re: /\[\[([^\]]+)\]\]/, render: (m, k) => <kbd key={k}>{m[1]}</kbd> },
  {
    re: /\[([^\]]+)\]\(([^)\s]+)\)/,
    render: (m, k) => {
      const href = safeHref(m[2]);
      const external = /^https?:\/\//i.test(href);
      return (
        <a key={k} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {inline(m[1])}
        </a>
      );
    },
  },
  { re: /\*\*(.+?)\*\*/, render: (m, k) => <strong key={k}>{inline(m[1])}</strong> },
  { re: /~~(.+?)~~/, render: (m, k) => <del key={k}>{inline(m[1])}</del> },
  { re: /==(.+?)==/, render: (m, k) => <mark key={k}>{inline(m[1])}</mark> },
  { re: /(?<![*\w])\*(?![\s*])(.+?)(?<![\s*])\*(?!\*)/, render: (m, k) => <em key={k}>{inline(m[1])}</em> },
  { re: /(?<![\w])_(?!\s)(.+?)(?<!\s)_(?![\w])/, render: (m, k) => <em key={k}>{inline(m[1])}</em> },
];

/** Convierte una línea de Markdown en nodos. Gana la marca que empieza antes; a igualdad, la primera de `RULES`. */
export function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest) {
    let best: { m: RegExpExecArray; rule: Rule } | null = null;
    for (const rule of RULES) {
      const m = rule.re.exec(rest);
      if (m && (!best || m.index < best.m.index)) best = { m, rule };
    }
    if (!best) {
      out.push(rest);
      break;
    }
    if (best.m.index > 0) out.push(rest.slice(0, best.m.index));
    out.push(best.rule.render(best.m, key++));
    rest = rest.slice(best.m.index + best.m[0].length);
  }
  return out;
}

/** Texto plano de una línea de Markdown (para ids, índices y tiempo de lectura). */
export const plain = (text: string) =>
  text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|~~|==|\*|_)/g, "")
    .trim();

/** «Instalación rápida» → «instalacion-rapida». */
export const slugify = (s: string) =>
  plain(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Generador de ids únicos por documento: el segundo «Uso» es `uso-1`. Prose y TableOfContents usan el mismo. */
export function createSlugger() {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text) || "seccion";
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n}` : base;
  };
}
