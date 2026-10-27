import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/*
 * El cuaderno del laboratorio (docs/cuaderno, docs/53): cada ejercicio (estudio de una web, réplica, demo reformada, pieza
 * del kit, concepto o herramienta) es una ficha en Markdown con una cabecera de etiquetas comunes. De las etiquetas salen
 * las relaciones (qué patrones van juntos, qué paletas y letras comparte cada familia de estilo, qué piezas se usan más)
 * para escribir guías de estilo y patrones de diseño con lo que ya tenemos. Lo leen `npm run lab:cuaderno` y /lab/cuaderno;
 * sin alias de rutas, para que tsx lo cargue desde scripts/.
 */

export const DIR = "docs/cuaderno";

export const TIPOS = ["estudio", "réplica", "demo", "pieza", "concepto", "herramienta"] as const;
/** lo que se hace (réplica, demo, concepto): de ellas salen las relaciones; estudio, pieza y herramienta son el contexto */
export const OBRAS: readonly string[] = ["réplica", "demo", "concepto"];
export const ESTADOS = ["hecho", "en curso", "pendiente"] as const;

/** campos de lista que hacen de etiquetas: de ellos salen el vocabulario y las relaciones */
export const ETIQUETAS = ["sector", "guia", "tono", "paleta", "tipografia", "patrones", "movimiento", "piezas", "piezas-nuevas"] as const;
export type Etiqueta = (typeof ETIQUETAS)[number];

export const NOMBRE_ETIQUETA: Record<Etiqueta, string> = {
  sector: "Sector",
  guia: "Familia de estilo",
  tono: "Tono",
  paleta: "Paleta",
  tipografia: "Tipografía",
  patrones: "Patrones",
  movimiento: "Movimiento",
  piezas: "Piezas del kit",
  "piezas-nuevas": "Piezas nuevas o ampliadas",
};

export type Ficha = {
  id: string;
  titulo: string;
  fecha: string;
  tipo: (typeof TIPOS)[number];
  estado: (typeof ESTADOS)[number];
  /** webs de referencia */
  referencias: string[];
  /** dónde está el estudio largo (docs/50 §3.9…) */
  fichas: string[];
  /** ruta donde se ve (/inspiraciones/q47, /sitios/hebra…) */
  ruta: string;
  /** código del ejercicio */
  codigo: string[];
  /** colores en hex, del fondo al acento */
  colores: string[];
  /** letras usadas (en la réplica) y las de la referencia si cambian */
  fuentes: string[];
  /** otras fichas relacionadas por id */
  relacionados: string[];
  etiquetas: Record<Etiqueta, string[]>;
  cuerpo: string;
  archivo: string;
};

const lista = (v: string) =>
  v.startsWith("[")
    ? v.slice(1, -1).split(",").map((x) => x.trim()).filter(Boolean)
    : v ? [v] : [];

/** cabecera YAML mínima: `clave: valor` y `clave: [a, b, c]`, una por línea */
export function leerFicha(archivo: string, texto: string): Ficha {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(texto);
  const cab: Record<string, string> = {};
  if (m) for (const l of m[1].split(/\r?\n/)) {
    const i = l.indexOf(":");
    if (i > 0) cab[l.slice(0, i).trim()] = l.slice(i + 1).trim();
  }
  const etiquetas = Object.fromEntries(ETIQUETAS.map((k) => [k, lista(cab[k] ?? "")])) as Record<Etiqueta, string[]>;
  return {
    id: archivo.replace(/\.md$/, ""),
    titulo: cab.titulo ?? "",
    fecha: cab.fecha ?? "",
    tipo: (cab.tipo ?? "") as Ficha["tipo"],
    estado: (cab.estado ?? "") as Ficha["estado"],
    referencias: lista(cab.referencias ?? ""),
    fichas: lista(cab.fichas ?? ""),
    ruta: cab.ruta ?? "",
    codigo: lista(cab.codigo ?? ""),
    colores: lista(cab.colores ?? ""),
    fuentes: lista(cab.fuentes ?? ""),
    relacionados: lista(cab.relacionados ?? ""),
    etiquetas,
    cuerpo: m ? m[2] : texto,
    archivo,
  };
}

export function leerCuaderno(raiz = process.cwd()): Ficha[] {
  const dir = join(raiz, DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => leerFicha(f, readFileSync(join(dir, f), "utf8")))
    .sort((a, b) => (a.fecha === b.fecha ? a.id.localeCompare(b.id) : b.fecha.localeCompare(a.fecha)));
}

/** problemas de una ficha: campos que faltan, valores fuera de lista, relacionados o piezas que no existen */
export function revisar(f: Ficha, todas: Ficha[], raiz = process.cwd()): string[] {
  const p: string[] = [];
  if (!f.titulo) p.push("sin titulo");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.fecha)) p.push(`fecha «${f.fecha}» no es AAAA-MM-DD`);
  if (!TIPOS.includes(f.tipo)) p.push(`tipo «${f.tipo}» no es ${TIPOS.join(" | ")}`);
  if (!ESTADOS.includes(f.estado)) p.push(`estado «${f.estado}» no es ${ESTADOS.join(" | ")}`);
  for (const c of f.colores) if (!/^#[0-9a-f]{3,8}$/i.test(c)) p.push(`color «${c}» no es hex`);
  for (const r of f.relacionados) if (!todas.some((x) => x.id === r)) p.push(`relacionado «${r}» no existe`);
  for (const k of ["piezas", "piezas-nuevas"] as const)
    for (const n of f.etiquetas[k]) {
      const base = n.split(" ")[0];
      if (!existsSync(join(raiz, "components/ui", `${base}.tsx`)) && !existsSync(join(raiz, "lib/ui", `${base}.ts`))) p.push(`${k}: «${base}» no está en components/ui ni lib/ui`);
    }
  for (const c of f.codigo) if (!existsSync(join(raiz, c))) p.push(`código «${c}» no existe`);
  for (const s of ["## Concepto", "## Aprendido"]) if (!f.cuerpo.includes(s)) p.push(`falta la sección «${s}»`);
  return p;
}

export type Relaciones = {
  /** por campo: etiqueta → ids que la llevan */
  vocabulario: Record<Etiqueta, [string, string[]][]>;
  /** parejas de patrones que aparecen juntas en ≥ 2 fichas */
  parejas: { a: string; b: string; ids: string[] }[];
  /** por familia de estilo: colores, letras, tipografía, tono y patrones que reúne */
  familias: { guia: string; ids: string[]; colores: string[]; fuentes: string[]; tipografia: [string, number][]; tono: [string, number][]; paleta: [string, number][]; patrones: [string, number][] }[];
  /** fichas parecidas a cada una (etiquetas en común, sin contar piezas) */
  vecinos: Record<string, { id: string; comunes: number }[]>;
};

const cuenta = (xs: string[]) => {
  const m = new Map<string, number>();
  for (const x of xs) m.set(x, (m.get(x) ?? 0) + 1);
  return [...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};

export function relaciones(fs: Ficha[]): Relaciones {
  const vocabulario = Object.fromEntries(
    ETIQUETAS.map((k) => {
      const m = new Map<string, string[]>();
      for (const f of fs) for (const v of f.etiquetas[k]) m.set(v, [...(m.get(v) ?? []), f.id]);
      return [k, [...m].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))];
    }),
  ) as Relaciones["vocabulario"];

  // parejas, familias y vecinos solo entre obras: los estudios y las piezas agregan etiquetas de otras fichas y las inflarían
  const obras = fs.filter((f) => OBRAS.includes(f.tipo));
  const par = new Map<string, string[]>();
  for (const f of obras) {
    const ps = [...new Set(f.etiquetas.patrones)].sort();
    for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
      const k = `${ps[i]}\u0000${ps[j]}`;
      par.set(k, [...(par.get(k) ?? []), f.id]);
    }
  }
  const parejas = [...par].filter(([, ids]) => ids.length >= 2).map(([k, ids]) => ({ a: k.split("\u0000")[0], b: k.split("\u0000")[1], ids })).sort((x, y) => y.ids.length - x.ids.length);

  const familias = vocabulario.guia.map(([guia, ids]) => [guia, ids.filter((id) => obras.some((o) => o.id === id))] as const).filter(([, ids]) => ids.length).map(([guia, ids]) => {
    const de = obras.filter((f) => ids.includes(f.id));
    const todo = (k: Etiqueta) => cuenta(de.flatMap((f) => f.etiquetas[k]));
    return { guia, ids, colores: [...new Set(de.flatMap((f) => f.colores))], fuentes: [...new Set(de.flatMap((f) => f.fuentes))], tipografia: todo("tipografia"), tono: todo("tono"), paleta: todo("paleta"), patrones: todo("patrones") };
  });

  const clave = (f: Ficha) => new Set((["sector", "guia", "tono", "paleta", "tipografia", "patrones", "movimiento"] as const).flatMap((k) => f.etiquetas[k].map((v) => `${k}:${v}`)));
  const claves = new Map(obras.map((f) => [f.id, clave(f)]));
  const vecinos = Object.fromEntries(
    fs.map((f) => {
      const a = claves.get(f.id) ?? clave(f);
      const vs = obras.filter((g) => g.id !== f.id).map((g) => ({ id: g.id, comunes: [...claves.get(g.id)!].filter((x) => a.has(x)).length })).filter((v) => v.comunes >= 3).sort((x, y) => y.comunes - x.comunes).slice(0, 5);
      return [f.id, vs];
    }),
  );
  return { vocabulario, parejas, familias, vecinos };
}
