/**
 * Arte de texto de asciify-engine convertido en líneas de caracteres:
 * fuentes FIGlet (`createStudioText`) o la fuente bitmap 7×7 (`asciifyText`).
 * Se carga bajo demanda y se guarda en caché.
 */
const cache = new Map<string, Promise<string[]>>();

function trim(lines: string[]) {
  const out = [...lines];
  while (out.length && !out[out.length - 1].trim()) out.pop();
  while (out.length && !out[0].trim()) out.shift();
  return out.length ? out : [" "];
}

/** `char` y `scale` solo afectan a la fuente Bitmap; las FIGlet traen sus propios caracteres. */
export function bannerLines(text: string, font: string, opts: { char?: string; scale?: number } = {}): Promise<string[]> {
  const char = opts.char || "#";
  const scale = opts.scale || 1;
  const key = `${font}|${char}|${scale}|${text}`;
  let hit = cache.get(key);
  if (!hit) {
    hit =
      font === "Bitmap"
        ? import("asciify-engine/core").then((m) => trim(m.asciifyText(text, { char, scale }).split("\n")))
        : import("asciify-engine/studio").then(async (m) => {
            const r = await m.createStudioText(text, font as Parameters<typeof m.createStudioText>[1]);
            return trim(r.ascii.split("\n"));
          });
    hit = hit.catch(() => [text]);
    cache.set(key, hit);
    if (cache.size > 60) cache.delete(cache.keys().next().value as string);
  }
  return hit;
}
