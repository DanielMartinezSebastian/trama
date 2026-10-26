/** un color CSS a [r, g, b, a] (hex de 3 o 6 cifras, rgb() o rgba()); null si no se entiende */
export function rgba(c: string): [number, number, number, number] | null {
  const h = c.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (h) {
    const x = h[1].length === 3 ? h[1].split("").map((d) => d + d).join("") : h[1];
    return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16), 1];
  }
  const m = c.match(/rgba?\(([^)]+)\)/i);
  if (!m) return null;
  const [r, g, b, a = "1"] = m[1].split(/[,\s/]+/).filter(Boolean);
  return [+r, +g, +b, +a];
}

/**
 * Un token translúcido (--card suele ser rgba sobre el fondo) compuesto sobre otro color, para las escenas de three, que
 * no entienden el alfa de un color CSS. Devuelve `fondo` si `color` no se entiende.
 */
export function sobreFondo(color: string | undefined, fondo: string | undefined) {
  const c = color ? rgba(color) : null;
  const f = fondo ? rgba(fondo) : null;
  if (!c) return fondo;
  if (c[3] >= 1 || !f) return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  const k = c[3];
  const mezcla = (i: number) => Math.round(f[i] + (c[i] - f[i]) * k);
  return `rgb(${mezcla(0)}, ${mezcla(1)}, ${mezcla(2)})`;
}
