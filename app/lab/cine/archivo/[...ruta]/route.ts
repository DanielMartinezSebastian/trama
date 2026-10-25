import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { Readable } from "node:stream";
import { notFound } from "next/navigation";

/*
 * Archivos de las capturas (`.refs3d`, ignorado por git) para el panel /lab/cine. Un archivo se sirve tal cual (con
 * rangos, para que los vídeos se puedan adelantar); una carpeta se enseña como galería: vídeos que se reproducen,
 * imágenes en miniatura, informes, datos y subcarpetas. Solo en local: en producción no existe. No sale de `.refs3d`.
 */

const RAIZ = resolve(process.cwd(), ".refs3d");
const TIPOS: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
  // texto plano para que el navegador lo enseñe en vez de descargarlo
  ".jsonl": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".log": "text/plain; charset=utf-8",
  ".glsl": "text/plain; charset=utf-8",
  ".wgsl": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ass": "text/plain; charset=utf-8",
};
const IMAGEN = /\.(png|jpe?g|webp)$/i, VIDEO = /\.(mp4|webm)$/i, INFORME = /\.html$/i;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
// la raíz necesita un segmento (la ruta es [...ruta]): «.refs3d», que se descarta al resolver
const url = (partes: string[]) => "/lab/cine/archivo/" + (partes.length ? partes.map(encodeURIComponent).join("/") : ".refs3d");
const tam = (b: number) => (b > 1 << 20 ? `${(b / (1 << 20)).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} kB`);

function galeria(dir: string, partes: string[]) {
  const nombres = readdirSync(dir).sort();
  const entradas = nombres.map((n) => {
    const st = statSync(join(dir, n));
    return { n, dir: st.isDirectory(), size: st.size, href: url([...partes, n]) };
  });
  const carpetas = entradas.filter((e) => e.dir);
  const videos = entradas.filter((e) => !e.dir && VIDEO.test(e.n));
  const imagenes = entradas.filter((e) => !e.dir && IMAGEN.test(e.n));
  const informes = entradas.filter((e) => !e.dir && INFORME.test(e.n));
  const resto = entradas.filter((e) => !e.dir && !VIDEO.test(e.n) && !IMAGEN.test(e.n) && !INFORME.test(e.n));
  // carpetas de fotogramas con cientos de imágenes: una de cada pocas (como mucho 48), enlazando a todas
  const paso = Math.max(1, Math.ceil(imagenes.length / 48));
  const muestra = imagenes.filter((_, i) => i % paso === 0);
  const poster = imagenes.find((e) => /^(par|hoja)\./.test(e.n))?.href;
  const migas = ['<a href="/lab/cine">Panel</a>', `<a href="${url([])}">.refs3d</a>`, ...partes.map((p, i) => `<a href="${url(partes.slice(0, i + 1))}">${esc(p)}</a>`)].join(" / ");
  const sec = (t: string, cuerpo: string) => (cuerpo ? `<section><h2>${t}</h2>${cuerpo}</section>` : "");
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(partes.join("/") || ".refs3d")} · Laboratorio</title>
<style>
:root{color-scheme:dark;--bg:#07080f;--fg:#e8ecf4;--mut:#9aa3b5;--ln:rgba(255,255,255,.12);--acc:#ff3b3b}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}
main{max-width:1320px;margin:0 auto;padding:24px 16px 80px;display:grid;gap:28px}
a{color:var(--fg);text-decoration-color:var(--acc);text-underline-offset:3px}a:hover{color:var(--acc)}
.migas{font:13px ui-monospace,monospace;color:var(--mut)}h1{margin:4px 0 0;font-size:26px}h2{margin:0 0 12px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--mut)}
.videos{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,520px),1fr));gap:14px}
figure{margin:0;display:grid;gap:6px}video,img{width:100%;border-radius:6px;background:#000;display:block}figcaption{font:12px ui-monospace,monospace;color:var(--mut)}
.imgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));gap:10px}
.lista{list-style:none;margin:0;padding:0;display:grid;gap:4px}.lista li{display:flex;gap:12px;justify-content:space-between;padding:6px 10px;border:1px solid var(--ln);border-radius:6px}
.lista span{color:var(--mut);font:12px ui-monospace,monospace;white-space:nowrap}
.carpetas{display:flex;flex-wrap:wrap;gap:8px}.carpetas a{padding:6px 12px;border:1px solid var(--ln);border-radius:999px;text-decoration:none}.carpetas a span{color:var(--mut)}
.nota{color:var(--mut);font-size:13px}
</style></head><body><main>
<header><p class="migas">${migas}</p><h1>${esc(partes[partes.length - 1] ?? ".refs3d")}</h1></header>
${sec("Carpetas", carpetas.length ? `<div class="carpetas">${carpetas.map((e) => `<a href="${e.href}">${esc(e.n)} <span>${readdirSync(join(dir, e.n)).length}</span></a>`).join("")}</div>` : "")}
${sec("Informes", informes.length ? `<ul class="lista">${informes.map((e) => `<li><a href="${e.href}" target="_blank">${esc(e.n)}</a><span>${tam(e.size)}</span></li>`).join("")}</ul>` : "")}
${sec("Vídeos", videos.length ? `<div class="videos">${videos.map((e) => `<figure><video src="${e.href}" controls preload="metadata" ${poster ? `poster="${poster}"` : ""}></video><figcaption><a href="${e.href}" target="_blank">${esc(e.n)}</a> · ${tam(e.size)}</figcaption></figure>`).join("")}</div>` : "")}
${sec(`Imágenes (${imagenes.length})`, muestra.length ? `${paso > 1 ? `<p class="nota">Una de cada ${paso}. Todas siguen en la carpeta con su nombre.</p>` : ""}<div class="imgs">${muestra.map((e) => `<figure><a href="${e.href}" target="_blank"><img src="${e.href}" loading="lazy" alt=""></a><figcaption>${esc(e.n)}</figcaption></figure>`).join("")}</div>` : "")}
${sec("Datos y textos", resto.length ? `<ul class="lista">${resto.map((e) => `<li><a href="${e.href}" target="_blank">${esc(e.n)}</a><span>${tam(e.size)}</span></li>`).join("")}</ul>` : "")}
${!entradas.length ? '<p class="nota">Carpeta vacía.</p>' : ""}
</main></body></html>`;
}

export async function GET(request: Request, ctx: RouteContext<"/lab/cine/archivo/[...ruta]">) {
  if (process.env.NODE_ENV === "production") notFound();
  const partes = (await ctx.params).ruta.map((x) => decodeURIComponent(x)).filter((x) => x && x !== ".refs3d");
  const p = resolve(join(RAIZ, ...partes));
  if ((p !== RAIZ && !p.startsWith(RAIZ + sep)) || !existsSync(p)) notFound();
  if (statSync(p).isDirectory()) return new Response(galeria(p, partes), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  const tipo = TIPOS[extname(p).toLowerCase()] ?? "text/plain; charset=utf-8";
  const total = statSync(p).size;
  const rango = request.headers.get("range");
  const comunes = { "content-type": tipo, "accept-ranges": "bytes", "cache-control": "no-store" };
  if (rango) {
    const m = /bytes=(\d*)-(\d*)/.exec(rango);
    const ini = m && m[1] ? Number(m[1]) : 0;
    const fin = m && m[2] ? Math.min(Number(m[2]), total - 1) : total - 1;
    if (ini >= total || ini > fin) return new Response(null, { status: 416, headers: { "content-range": `bytes */${total}` } });
    const cuerpo = Readable.toWeb(createReadStream(p, { start: ini, end: fin })) as ReadableStream;
    return new Response(cuerpo, { status: 206, headers: { ...comunes, "content-length": String(fin - ini + 1), "content-range": `bytes ${ini}-${fin}/${total}` } });
  }
  return new Response(Readable.toWeb(createReadStream(p)) as ReadableStream, { headers: { ...comunes, "content-length": String(total) } });
}
