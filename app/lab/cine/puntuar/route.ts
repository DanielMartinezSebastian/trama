import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { notFound } from "next/navigation";

/*
 * La puntuación del usuario de una demo (docs/36 A9): sensación y profundidad de 1 a 5, con una nota, frente a su
 * referencia. Las cifras de cine:vuelta no lo ven todo: esta es la medida que manda. Se apunta en
 * `<carpeta de la receta>/puntuaciones.jsonl` con la vuelta a la que se refiere. Solo en local.
 */

type Receta = { carpeta: string };

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") notFound();
  const cuerpo = (await req.json().catch(() => null)) as { receta?: string; sensacion?: number; profundidad?: number; nota?: string } | null;
  const recetas = JSON.parse(readFileSync(resolve("scripts/cine/recetas.json"), "utf8")) as Record<string, Receta | string>;
  const receta = cuerpo?.receta ? recetas[cuerpo.receta] : undefined;
  const nota1a5 = (x: unknown) => (typeof x === "number" && Number.isInteger(x) && x >= 1 && x <= 5 ? x : null);
  const sensacion = nota1a5(cuerpo?.sensacion), profundidad = nota1a5(cuerpo?.profundidad);
  // solo recetas que existen: la carpeta sale de recetas.json, nunca de la petición
  if (!receta || typeof receta === "string" || sensacion === null || profundidad === null) return Response.json({ ok: false, error: "receta o notas no válidas" }, { status: 400 });
  const carpeta = resolve(receta.carpeta);
  mkdirSync(carpeta, { recursive: true });
  const vueltas = existsSync(carpeta) ? readdirSync(carpeta).filter((d) => /^vuelta-\d+$/.test(d)).sort() : [];
  const vuelta = vueltas.length ? Number(vueltas[vueltas.length - 1].slice(7)) : null;
  const fila = { fecha: new Date().toISOString(), vuelta, sensacion, profundidad, nota: String(cuerpo?.nota ?? "").slice(0, 600) };
  appendFileSync(join(carpeta, "puntuaciones.jsonl"), JSON.stringify(fila) + "\n");
  return Response.json({ ok: true, fila });
}
