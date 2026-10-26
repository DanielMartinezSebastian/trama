import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { notFound } from "next/navigation";

/*
 * Visor de código del laboratorio (/lab/cine/codigo/<ruta>), solo en local: el código de los componentes y motores que
 * salieron de cada ronda, sin depender de que la rama esté en GitHub. Solo las carpetas del repo con código propio; una
 * carpeta se enseña como lista y un archivo con números de línea.
 */

const REPO = resolve(process.cwd());
const PERMITIDAS = ["app", "components", "lib", "scripts", "docs"];
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const url = (partes: string[]) => "/lab/cine/codigo/" + partes.map(encodeURIComponent).join("/");

const pagina = (titulo: string, partes: string[], cuerpo: string) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(titulo)} · Código · Laboratorio</title>
<style>
:root{color-scheme:dark}body{margin:0;background:#07080f;color:#e8ecf4;font:15px/1.5 system-ui,sans-serif}
main{max-width:1320px;margin:0 auto;padding:24px 16px 80px}a{color:#e8ecf4;text-decoration-color:#ff3b3b;text-underline-offset:3px}a:hover{color:#ff3b3b}
.migas{font:13px ui-monospace,monospace;color:#9aa3b5}h1{margin:4px 0 16px;font-size:22px;font-family:ui-monospace,monospace}
ul{list-style:none;margin:0;padding:0;display:grid;gap:4px}li a{display:block;padding:6px 10px;border:1px solid rgba(255,255,255,.12);border-radius:6px;font-family:ui-monospace,monospace;text-decoration:none}
pre{margin:0;padding:16px 0;overflow:auto;border:1px solid rgba(255,255,255,.12);border-radius:8px;background:rgba(255,255,255,.03);font:13px/1.55 ui-monospace,monospace;tab-size:2}
.l{display:grid;grid-template-columns:4.5em 1fr}.l i{color:#5b6475;font-style:normal;text-align:right;padding-right:1.2em;user-select:none}.l span{white-space:pre;padding-right:16px}
</style></head><body><main>
<p class="migas"><a href="/lab/cine">Panel</a> / ${partes.map((p, i) => `<a href="${url(partes.slice(0, i + 1))}">${esc(p)}</a>`).join(" / ")}</p>
<h1>${esc(titulo)}</h1>${cuerpo}</main></body></html>`;

export async function GET(_: Request, ctx: RouteContext<"/lab/cine/codigo/[...ruta]">) {
  if (process.env.NODE_ENV === "production") notFound();
  const partes = (await ctx.params).ruta.map((x) => decodeURIComponent(x)).filter(Boolean);
  if (!PERMITIDAS.includes(partes[0])) notFound();
  const p = resolve(join(REPO, ...partes));
  if (!p.startsWith(join(REPO, partes[0])) || !p.startsWith(REPO + sep) || !existsSync(p)) notFound();
  const html = { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" };
  if (statSync(p).isDirectory()) {
    const items = readdirSync(p)
      .sort((a, b) => Number(statSync(join(p, b)).isDirectory()) - Number(statSync(join(p, a)).isDirectory()) || a.localeCompare(b))
      .map((n) => `<li><a href="${url([...partes, n])}">${esc(n)}${statSync(join(p, n)).isDirectory() ? "/" : ""}</a></li>`);
    return new Response(pagina(partes.join("/") + "/", partes, `<ul>${items.join("")}</ul>`), { headers: html });
  }
  const lineas = readFileSync(p, "utf8").split("\n");
  const cuerpo = `<pre>${lineas.map((l, i) => `<div class="l" id="L${i + 1}"><i>${i + 1}</i><span>${esc(l)}</span></div>`).join("")}</pre>`;
  return new Response(pagina(partes.join("/"), partes, cuerpo), { headers: html });
}
