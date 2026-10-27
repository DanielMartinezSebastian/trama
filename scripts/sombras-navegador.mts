import type { Page } from "playwright";

/**
 * Sombras de texto prohibidas, medidas en el navegador (guía §8.0): una sombra oscura sobre fondo claro o sobre texto
 * oscuro. `check:shadows` lee el código y no ve lo que resuelven las variables: un halo de `--legibility-ts` salía negro
 * sobre los temas claros hechos solo con CSS (las inspiraciones, docs/55). Devuelve un aviso por cada clase afectada.
 */
export async function sombrasOscuras(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const lum = (c: string) => {
      const m = c.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)/);
      const v = m ? [+m[1], +m[2], +m[3], m[4] ? +m[4] : 1] : (c.match(/[\d.]+/g) ?? []).map(Number).map((x, i) => (i < 3 ? x / 255 : x));
      return v.length < 3 ? null : { l: 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2], a: v[3] ?? 1 };
    };
    const vistos = new Map<string, number>();
    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      const cs = getComputedStyle(el);
      if (!cs.textShadow || cs.textShadow === "none") continue;
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim())) continue;
      // el color de la primera capa visible y desenfocada: una sombra dura (desenfoque 0) es un recurso de diseño elegido
      // (la sombra dura de las guías escuela y autor, el sello de NeonSign), no un halo que empasta
      const sombra = cs.textShadow
        .split(/,(?![^(]*\))/)
        .map((x) => x.trim())
        .filter((x) => parseFloat(x.match(/(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/)?.[3] ?? "0") > 0)
        .map((x) => lum(x.replace(/\s-?[\d.]+px.*$/, "")))
        .find((x) => x && x.a > 0.1);
      if (!sombra || sombra.l > 0.35) continue;
      let fondo: { l: number; a: number } | null = null;
      for (let e: HTMLElement | null = el; e && !fondo; e = e.parentElement) {
        const x = lum(getComputedStyle(e).backgroundColor);
        if (x && x.a > 0.5) fondo = x;
      }
      const texto = lum(cs.color);
      if (!((fondo && fondo.l > 0.5) || (texto && texto.l < 0.35))) continue;
      const k = `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/).join(".")}`;
      vistos.set(k, (vistos.get(k) ?? 0) + 1);
    }
    return [...vistos].map(([k, n]) => `sombra oscura sobre fondo claro o texto oscuro: ${k} (${n})`);
  });
}
