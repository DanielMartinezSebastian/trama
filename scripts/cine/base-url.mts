/** Cambia solo el origen del banco; conserva ruta, query y hash de la receta. */
export function bancoUrl(original: string, base?: string): string {
  if (base === undefined) return original;
  const target = new URL(base);
  if (!["http:", "https:"].includes(target.protocol) || target.username || target.password || target.pathname !== "/" || target.search || target.hash) {
    throw new Error("--base-url debe ser un origen HTTP(S), p. ej. http://localhost:3006");
  }
  const source = new URL(original);
  return new URL(`${source.pathname}${source.search}${source.hash}`, target.origin).href;
}
