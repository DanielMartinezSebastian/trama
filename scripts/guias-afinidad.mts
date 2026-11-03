/**
 * Afinidad de una página medida con las guías de estilo (docs/54): compara medidas con medidas. Las guías se miden igual
 * que el resto (su página de relato en /guias), así que no se compara lo declarado en `STYLE_GUIDES` con lo pintado en
 * una web, sino lo pintado con lo pintado. Lo usa `refs:probe --repo`.
 *
 * Rasgos y peso (la suma es la distancia; afinidad = 1 / (1 + distancia)):
 *   - luminancia del fondo base (claro u oscuro) ×3: el de la página o el de su primera pantalla, el más cercano a la
 *     guía (una portada oscura sobre una página clara también es de una guía oscura);
 *   - el acento: saturación ×1 y tono ×1 (ponderado por lo saturado que esté);
 *   - el titular: categoría de la letra (serifa, condensada, mono, pixel, redonda, grotesca) ×1,5, tamaño (razón
 *     logarítmica) ×1, peso ×1, tracking ×1, mayúsculas ×0,5 e interlineado ×0,5;
 *   - el texto: tamaño ×0,5;
 *   - superficie: píldoras ×0,5.
 *
 * El titular es lo mayor de la primera pantalla. Si mide menos de 2,5 vw (la primera pantalla es una foto o una escena y
 * lo mayor en ella es la navegación), se usa lo mayor de las tres primeras pantallas: las guías se miden con su titular a
 * la vista, y comparar su titular con el menú de una portada fotográfica separaba páginas de la misma familia (docs/60 §2).
 *
 * Una guía se mide en su relato, que puede abrir con la marca de borde a borde. Su titular es entonces el `h1` del relato,
 * y la marca queda como segundo tamaño: el de la página se compara con el más cercano de los dos (docs/60 §2).
 */

export type Medida = {
  palette: { fondos: [string, number][]; tintas: [string, number][]; fondosHero?: [string, number][] };
  biggest: Titular[];
  /** lo mayor de las tres primeras pantallas, sin el pie */
  biggestPage?: Titular[];
  /** solo en páginas con las clases de las guías: la marca (`.ui-g-brand`) y el titular (`h1`) por separado */
  guia?: { marca: Titular | null; titular: Titular | null } | null;
  body: { size: number; lh: number } | null;
  radii: string[];
  families: string[];
};

type Titular = { size: number; vw: number; weight: number; lh: number; ls: number; upper: boolean; family: string; generic?: string };

/** por debajo de este tamaño, lo mayor de la primera pantalla no es un titular */
export const TITULAR_MIN_VW = 2.5;

export type Rasgos = { lum: number; sat: number; hue: number; cat: string; vw: number; weight: number; ls: number; upper: boolean; lh: number; body: number; pill: boolean; vwMarca?: number; lumHero?: number };

const hexRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lum = (h: string) => {
  const [r, g, b] = hexRgb(h).map((c) => (c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const hsl = (h: string) => {
  const [r, g, b] = hexRgb(h);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let hue = 0;
  if (d) hue = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (hue * 60 + 360) % 360, s, l };
};

/** categoría de una letra por su nombre; si el nombre no la dice, por la familia genérica de su pila CSS */
export function categoria(familia: string, generica = ""): string {
  const f = familia.toLowerCase();
  if (/pixel|silkscreen|press start|vt323|jersey|dotgothic|bitcount|micro ?5|doto|tiny ?5|handjet|jacquard|workbench|sixtyfour|rubik (pixels|iso)/.test(f)) return "pixel";
  if (/mono|code|courier|typewriter|martian|share tech/.test(f)) return "mono";
  if (/anton|antonio|bebas|oswald|condensed|compressed|gothik|kenyan|league gothic|big shoulders/.test(f)) return "condensada";
  if (/(^|[^s-])serif|garamond|gloock|playfair|fraunces|newsreader|crimson|bodoni|minion|lora|cormorant|gt super|instrument serif|dm serif|literata|fragment|ivy ?mode|ivar|times|canora|noe|forvm|editorial ?new|juana|tiempos|saol|canela|ogg|reckless|recoleta|gambetta|freight|domaine|larken|migra|minion|caslon|baskerville|didot|ppeiko|eiko/.test(f) && !/sans|grotesk/.test(f)) return "serifa";
  if (/bricolage|nunito|onest|quicksand|fredoka|hauora|magic brush|marker/.test(f)) return "redonda";
  if (generica === "serif") return "serifa";
  if (generica === "monospace") return "mono";
  return "grotesca";
}

/** `guia`: la página es el relato de una guía (titular y marca por separado) */
export function rasgos(d: Medida, guia = false): Rasgos | null {
  const g = guia ? d.guia : null;
  const h = g?.titular ?? (d.biggest[0] && d.biggest[0].vw < TITULAR_MIN_VW && d.biggestPage?.[0] && d.biggestPage[0].vw > d.biggest[0].vw ? d.biggestPage[0] : d.biggest[0]);
  if (!h) return null;
  const base = d.palette.fondos[0]?.[0] ?? "#ffffff";
  // el acento: el color más saturado que pese al menos un 2 % en fondos o textos
  const candidatos = [...d.palette.fondos, ...d.palette.tintas].filter(([, p]) => p >= 2).map(([c]) => ({ c, ...hsl(c) })).filter((x) => x.l > 0.12 && x.l < 0.9);
  const acc = candidatos.sort((a, b) => b.s - a.s)[0];
  const hero = d.palette.fondosHero?.[0]?.[0];
  return { lum: lum(base), ...(hero ? { lumHero: lum(hero) } : null), sat: acc?.s ?? 0, hue: acc?.h ?? 0, cat: categoria(h.family, h.generic), vw: h.vw, weight: h.weight, ls: h.ls, upper: h.upper, lh: h.lh, body: d.body?.size ?? 16, pill: d.radii.includes("píldora"), ...(g?.marca && g.titular && g.marca.vw > g.titular.vw * 1.5 ? { vwMarca: g.marca.vw } : null) };
}

export function distancia(a: Rasgos, b: Rasgos) {
  const dh = Math.min(Math.abs(a.hue - b.hue), 360 - Math.abs(a.hue - b.hue)) / 180;
  return (
    3 * Math.min(...[a.lum, a.lumHero ?? a.lum].map((l) => Math.abs(Math.sqrt(l) - Math.sqrt(b.lum)))) +
    Math.abs(a.sat - b.sat) +
    dh * Math.min(a.sat, b.sat) +
    1.5 * (a.cat === b.cat ? 0 : 1) +
    Math.min(...[b.vw, b.vwMarca ?? b.vw].map((v) => Math.abs(Math.log(Math.max(1, a.vw) / Math.max(1, v))))) +
    Math.abs(a.weight - b.weight) / 400 +
    Math.abs(a.ls - b.ls) / 5 +
    0.5 * (a.upper === b.upper ? 0 : 1) +
    (0.5 * Math.abs(a.lh - b.lh)) / 0.3 +
    (0.5 * Math.abs(a.body - b.body)) / 6 +
    0.5 * (a.pill === b.pill ? 0 : 1)
  );
}

/** las guías más afines a una página, con su afinidad (0–1) */
export function afinidades(p: Rasgos, guias: { id: string; r: Rasgos }[], n = 3) {
  return guias.map((g) => ({ guia: g.id, afinidad: +(1 / (1 + distancia(p, g.r))).toFixed(3) })).sort((x, y) => y.afinidad - x.afinidad).slice(0, n);
}
