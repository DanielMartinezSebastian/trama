import type { ReactNode } from "react";

export type Category = "fondos" | "texto" | "tarjetas" | "interaccion" | "transiciones" | "datos" | "navegacion" | "formularios" | "feedback" | "galerias" | "secciones" | "overlays" | "pixel" | "contenido";
export type StyleTag = "glass" | "solid" | "outline" | "neon" | "retro" | "terminal" | "minimal" | "dotmatrix";

export const CATEGORIES: { id: Category; label: string; blurb: string }[] = [
  { id: "fondos", label: "Fondos", blurb: "Escenas de caracteres que rellenan un contenedor." },
  { id: "texto", label: "Texto", blurb: "Titulares y cintas con efectos de texto." },
  { id: "tarjetas", label: "Tarjetas", blurb: "Superficies de contenido con capas ASCII." },
  { id: "interaccion", label: "Interacción", blurb: "Respuestas al puntero." },
  { id: "transiciones", label: "Transiciones", blurb: "Cambios de escena y de sección." },
  { id: "datos", label: "Datos", blurb: "Cifras, gráficos, terminales y tablas." },
  { id: "navegacion", label: "Navegación", blurb: "Barras, pestañas y acordeones." },
  { id: "formularios", label: "Formularios", blurb: "Campos, interruptores y deslizadores." },
  { id: "feedback", label: "Feedback", blurb: "Estados, avisos y carga." },
  { id: "galerias", label: "Galerías, vídeo y audio", blurb: "Galerías de imágenes y carruseles sobre Swiper (coverflow, baraja, cubo, mosaico, cintas continuas), reproductor de vídeo y reproductor de música." },
  { id: "secciones", label: "Secciones", blurb: "Bloques compuestos, listos para pegar en una landing: hero, contacto, precios, FAQ…" },
  { id: "contenido", label: "Contenido", blurb: "Texto largo con formato para documentación y blogs: prosa desde Markdown, avisos, índice de la página, cabecera de artículo y el artículo completo." },
  { id: "overlays", label: "Overlays", blurb: "Elementos que aparecen encima de la página: diálogos, notificaciones, ayuda." },
  { id: "pixel", label: "Pixel art", blurb: "Iconos SVG que se tiñen con el tema, marcos de 9 cortes y sprites: píxeles hechos a mano, no filtros." },
];

export const STYLES: { id: StyleTag; label: string }[] = [
  { id: "glass", label: "Glass" },
  { id: "solid", label: "Solid" },
  { id: "outline", label: "Outline" },
  { id: "neon", label: "Neón" },
  { id: "retro", label: "Retro" },
  { id: "terminal", label: "Terminal" },
  { id: "minimal", label: "Minimal" },
  { id: "dotmatrix", label: "Dot matrix" },
];

type Base = {
  key: string;
  label: string;
  hint?: string;
  when?: (p: Values) => boolean;
  /** solo existe en el visor (no es una prop del componente): no aparece en el código de ejemplo */
  noCode?: boolean;
};

export type PropSpec =
  | (Base & { type: "text"; default: string; multiline?: boolean })
  | (Base & { type: "number"; default: number; min: number; max: number; step?: number })
  | (Base & { type: "boolean"; default: boolean })
  | (Base & { type: "select"; default: string; options: readonly string[]; /** texto que se muestra por cada opción (por defecto, el propio valor) */ labels?: Record<string, string> });

export type Values = Record<string, string | number | boolean>;

export type CatalogEntry = {
  id: string;
  /** nombre del componente React */
  component: string;
  /** ruta de importación */
  path: string;
  name: string;
  category: Category;
  styles: StyleTag[];
  description: string;
  props: PropSpec[];
  /** altura mínima del escenario en px */
  stageHeight?: number;
  notes?: string[];
  /** el componente usa una prop que dispara animaciones (`playKey`) */
  replayable?: boolean;
  /** hijos de ejemplo para el código de uso (envoltorios: Reveal, Presence…); sin él se genera `<X />` */
  children?: string | ((p: Values) => string | undefined);
  render: (p: Values, ctx: { replay: number }) => ReactNode;
};

export const defaultsOf = (e: CatalogEntry): Values => Object.fromEntries(e.props.map((p) => [p.key, p.default]));

/** Genera el JSX de uso con solo las props que difieren del valor por defecto. */
export function snippet(e: CatalogEntry, values: Values, extra: string[] = []): string {
  const parts: string[] = [];
  for (const spec of e.props) {
    if (spec.when && !spec.when(values)) continue;
    if (spec.noCode) continue;
    const v = values[spec.key];
    if (v === spec.default || v === undefined) continue;
    if (typeof v === "string") parts.push(v.includes("\n") ? `${spec.key}={${JSON.stringify(v)}}` : `${spec.key}=${JSON.stringify(v)}`);
    else if (typeof v === "boolean") parts.push(v ? spec.key : `${spec.key}={false}`);
    else parts.push(`${spec.key}={${v}}`);
  }
  // Las props obligatorias (sin default útil) se muestran siempre
  const required = e.props.filter((s) => (!s.when || s.when(values)) && !s.noCode && (s.key === "title" || s.key === "text" || s.key === "label" || s.key === "lines" || s.key === "value" || s.key === "content") && !parts.some((x) => x.startsWith(`${s.key}=`)));
  for (const s of required) {
    const v = values[s.key];
    if (typeof v === "string") parts.unshift(v.includes("\n") ? `${s.key}={${JSON.stringify(v)}}` : `${s.key}=${JSON.stringify(v)}`);
    else if (typeof v === "number") parts.unshift(`${s.key}={${v}}`);
  }
  const all = [...parts, ...extra];
  const head = `import ${e.component} from "${e.path}";\n\n`;
  const children = typeof e.children === "function" ? e.children(values) : e.children;
  if (children) {
    const open = all.length ? `<${e.component}\n  ${all.join("\n  ")}\n>` : `<${e.component}>`;
    const body = children.split("\n").map((l) => `  ${l}`).join("\n");
    return `${head}${open}\n${body}\n</${e.component}>`;
  }
  const props = all.length ? `\n  ${all.join("\n  ")}\n` : " ";
  return `${head}<${e.component}${props}/>`;
}
