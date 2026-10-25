import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { Readable } from "node:stream";
import { notFound } from "next/navigation";

/*
 * Archivos de las capturas (`.refs3d`, ignorado por git) para el panel /lab/cine: informes, vídeos, imágenes y textos.
 * Solo en local: en producción no existe (y `.refs3d` no se despliega). No sale de `.refs3d` y atiende peticiones de
 * rango para que los vídeos se puedan adelantar.
 */

const RAIZ = resolve(process.cwd(), ".refs3d");
const TIPOS: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".jsonl": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".glsl": "text/plain; charset=utf-8",
  ".wgsl": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

export async function GET(request: Request, ctx: RouteContext<"/lab/cine/archivo/[...ruta]">) {
  if (process.env.NODE_ENV === "production") notFound();
  const { ruta } = await ctx.params;
  const archivo = resolve(join(RAIZ, ...ruta.map((x) => decodeURIComponent(x))));
  if (!archivo.startsWith(RAIZ + sep) || !existsSync(archivo) || !statSync(archivo).isFile()) notFound();
  const tipo = TIPOS[extname(archivo).toLowerCase()] ?? "application/octet-stream";
  const tam = statSync(archivo).size;
  const rango = request.headers.get("range");
  const comunes = { "content-type": tipo, "accept-ranges": "bytes", "cache-control": "no-store" };
  if (rango) {
    const m = /bytes=(\d*)-(\d*)/.exec(rango);
    const ini = m && m[1] ? Number(m[1]) : 0;
    const fin = m && m[2] ? Math.min(Number(m[2]), tam - 1) : tam - 1;
    if (ini >= tam || ini > fin) return new Response(null, { status: 416, headers: { "content-range": `bytes */${tam}` } });
    const cuerpo = Readable.toWeb(createReadStream(archivo, { start: ini, end: fin })) as ReadableStream;
    return new Response(cuerpo, { status: 206, headers: { ...comunes, "content-length": String(fin - ini + 1), "content-range": `bytes ${ini}-${fin}/${tam}` } });
  }
  return new Response(Readable.toWeb(createReadStream(archivo)) as ReadableStream, { headers: { ...comunes, "content-length": String(tam) } });
}
