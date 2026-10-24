/**
 * Convierte una fuente TTF/OTF al formato «typeface» que leen FontLoader y TextGeometry de three (texto extruido en 3D),
 * solo con los caracteres que hagan falta.
 *
 *   npx tsx scripts/font-typeface.mts <fuente.ttf> <salida.json> [--chars "ABC…"] [--opentype <carpeta node_modules>]
 *
 * opentype.js no es dependencia del repo (solo hace falta para regenerar): instálalo en una carpeta aparte
 * (`npm i opentype.js@1.3.4`) y pásala con --opentype. Así se generó public/fonts/anton/anton.typeface.json desde Anton
 * (Google Fonts, licencia OFL: public/fonts/anton/OFL.txt) para `TypeField`.
 *
 * Formato de salida: { glyphs: { c: { ha, x_min, x_max, o } }, resolution, ascender, descender, boundingBox, … }, con
 * `o` en órdenes de three: «m x y», «l x y», «q x y cx cy» (fin y control) y «b x y c1x c1y c2x c2y».
 */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const opt = (n: string, d: string) => {
  const i = args.indexOf(n);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const [entrada, salida] = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
if (!entrada || !salida) {
  console.log('Uso: npx tsx scripts/font-typeface.mts <fuente.ttf> <salida.json> [--chars "…"] [--opentype <node_modules>]');
  process.exit(1);
}
const CHARS = opt("--chars", "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚÜáéíóúü0123456789 .,:;!?¡¿-–—&/@#+*()'\"·%€$");
const req = createRequire(join(resolve(opt("--opentype", "node_modules")), "noop.js"));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const opentype = req("opentype.js") as { parse(b: ArrayBuffer): any };

const buf = readFileSync(entrada);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const r = (n: number) => Math.round(n);
const glyphs: Record<string, { ha: number; x_min: number; x_max: number; o: string }> = {};
for (const ch of new Set(CHARS)) {
  const g = font.charToGlyph(ch);
  if (!g || (g.index === 0 && ch !== " ")) continue;
  const o: string[] = [];
  for (const c of g.path.commands as { type: string; x?: number; y?: number; x1?: number; y1?: number; x2?: number; y2?: number }[]) {
    if (c.type === "M") o.push(`m ${r(c.x!)} ${r(c.y!)}`);
    else if (c.type === "L") o.push(`l ${r(c.x!)} ${r(c.y!)}`);
    else if (c.type === "Q") o.push(`q ${r(c.x!)} ${r(c.y!)} ${r(c.x1!)} ${r(c.y1!)}`);
    else if (c.type === "C") o.push(`b ${r(c.x!)} ${r(c.y!)} ${r(c.x1!)} ${r(c.y1!)} ${r(c.x2!)} ${r(c.y2!)}`);
  }
  const bb = g.getBoundingBox();
  glyphs[ch] = { ha: r(g.advanceWidth), x_min: r(bb.x1), x_max: r(bb.x2), o: o.join(" ") };
}
const head = font.tables.head;
const out = {
  glyphs,
  familyName: font.names.fontFamily?.en ?? "",
  ascender: r(font.ascender),
  descender: r(font.descender),
  underlinePosition: r(font.tables.post?.underlinePosition ?? 0),
  underlineThickness: r(font.tables.post?.underlineThickness ?? 0),
  boundingBox: { xMin: r(head.xMin), yMin: r(head.yMin), xMax: r(head.xMax), yMax: r(head.yMax) },
  resolution: font.unitsPerEm,
  original_font_information: { format: 0, copyright: font.names.copyright?.en ?? "", license: font.names.license?.en ?? "" },
  cssFontWeight: "normal",
  cssFontStyle: "normal",
};
writeFileSync(salida, JSON.stringify(out));
console.log(`${Object.keys(glyphs).length} glifos → ${salida} (${(JSON.stringify(out).length / 1024).toFixed(1)} KB)`);
