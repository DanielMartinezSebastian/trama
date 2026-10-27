/**
 * Afinidad de una página medida con las guías de estilo (docs/54): compara medidas con medidas. Las guías se miden igual
 * que el resto (su página de relato en /guias), así que no se compara lo declarado en `STYLE_GUIDES` con lo pintado en
 * una web, sino lo pintado con lo pintado. Lo usa `refs:probe --repo`.
 *
 * Rasgos y peso (la suma es la distancia; afinidad = 1 / (1 + distancia)):
 *   - luminancia del fondo base (claro u oscuro) ×3;
 *   - el acento: saturación ×1 y tono ×1 (ponderado por lo saturado que esté);
 *   - el titular: categoría de la letra (serifa, condensada, mono, pixel, redonda, grotesca) ×1,5, tamaño (razón
 *     logarítmica) ×1, peso ×1, tracking ×1, mayúsculas ×0,5 e interlineado ×0,5;
 *   - el texto: tamaño ×0,5;
 *   - superficie: píldoras ×0,5.
 */

export type Medida = {
  palette: { fondos: [string, number][]; tintas: [string, number][] };
  biggest: { size: number; vw: number; weight: number; lh: number; ls: number; upper: boolean; family: string }[];
  body: { size: number; lh: number } | null;
  radii: string[];
  families: string[];
};

export type Rasgos = { lum: number; sat: number; hue: number; cat: string; vw: number; weight: number; ls: number; upper: boolean; lh: number; body: number; pill: boolean };

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

/** categoría de una letra por su nombre */
export function categoria(familia: string): string {
  const f = familia.toLowerCase();
  if (/pixel|silkscreen|press start|vt323|jersey|dotgothic|bitcount|micro ?5|doto|tiny ?5|handjet|jacquard|workbench|sixtyfour|rubik (pixels|iso)/.test(f)) return "pixel";
  if (/mono|code|courier|typewriter|martian|share tech/.test(f)) return "mono";
  if (/anton|antonio|bebas|oswald|condensed|compressed|gothik|kenyan|league gothic|big shoulders/.test(f)) return "condensada";
  if (/(^|[^s-])serif|garamond|gloock|playfair|fraunces|newsreader|crimson|bodoni|minion|lora|cormorant|gt super|instrument serif|dm serif|literata/.test(f) && !/sans/.test(f)) return "serifa";
  if (/bricolage|nunito|onest|quicksand|fredoka|hauora|magic brush|marker/.test(f)) return "redonda";
  return "grotesca";
}

export function rasgos(d: Medida): Rasgos | null {
  const h = d.biggest[0];
  if (!h) return null;
  const base = d.palette.fondos[0]?.[0] ?? "#ffffff";
  // el acento: el color más saturado que pese al menos un 2 % en fondos o textos
  const candidatos = [...d.palette.fondos, ...d.palette.tintas].filter(([, p]) => p >= 2).map(([c]) => ({ c, ...hsl(c) })).filter((x) => x.l > 0.12 && x.l < 0.9);
  const acc = candidatos.sort((a, b) => b.s - a.s)[0];
  return { lum: lum(base), sat: acc?.s ?? 0, hue: acc?.h ?? 0, cat: categoria(h.family), vw: h.vw, weight: h.weight, ls: h.ls, upper: h.upper, lh: h.lh, body: d.body?.size ?? 16, pill: d.radii.includes("píldora") };
}

export function distancia(a: Rasgos, b: Rasgos) {
  const dh = Math.min(Math.abs(a.hue - b.hue), 360 - Math.abs(a.hue - b.hue)) / 180;
  return (
    3 * Math.abs(Math.sqrt(a.lum) - Math.sqrt(b.lum)) +
    Math.abs(a.sat - b.sat) +
    dh * Math.min(a.sat, b.sat) +
    1.5 * (a.cat === b.cat ? 0 : 1) +
    Math.abs(Math.log(Math.max(1, a.vw) / Math.max(1, b.vw))) +
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
