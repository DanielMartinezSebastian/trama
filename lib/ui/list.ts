/**
 * Listas en texto plano de las props del kit («a, b, c», «título|texto», «Col: a, b; Col2: c»…).
 *
 * El separador se puede escribir dentro de un elemento escapándolo con una barra invertida: `\,` es una coma
 * literal en una lista separada por comas («+12 proyectos, 99\,5 % disponibilidad» → 2 elementos), `\|` una barra
 * en un campo separado por `|` y `\;` un punto y coma en una lista separada por `;`. Solo se quita el escape del
 * separador que se está partiendo: el resto (`\,` dentro de un campo `|`…) se conserva para el nivel siguiente,
 * así que en formatos anidados cada nivel escapa su propio separador. Una barra seguida de otra cosa se deja tal cual.
 */

/** Parte `s` por `sep` (un carácter) respetando `\sep`. No recorta ni filtra: devuelve los trozos crudos. */
export function splitEscaped(s: string, sep: string): string[] {
  if (!s.includes("\\")) return s.split(sep);
  const out: string[] = [];
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "\\" && s[i + 1] === sep) {
      cur += sep;
      i++;
    } else if (c === sep) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

/** Lista de elementos: parte por `sep` (coma por defecto) respetando `\sep`, recorta y quita los vacíos. */
export function splitList(s: string, sep = ","): string[] {
  return splitEscaped(s, sep)
    .map((x) => x.trim())
    .filter(Boolean);
}
