/**
 * Pegatinas vectoriales para `StickerCollage` y las demos: formas planas con contorno grueso y sombra desplazada (estética de
 * pegatina de vinilo). Devuelven un data URI SVG; no hay descargas ni derechos de autor.
 */
export type StickerKind = "burst" | "smile" | "bolt" | "heart" | "flower" | "arrow" | "eye" | "cloud" | "star" | "tv";

const INK = "#161616";

const shapes: Record<StickerKind, (a: string, b: string) => string> = {
  burst: (a, b) =>
    `<polygon points="100,8 121,52 168,30 160,80 192,100 160,120 168,170 121,148 100,192 79,148 32,170 40,120 8,100 40,80 32,30 79,52" fill="${a}"/><circle cx="100" cy="100" r="34" fill="${b}" stroke="${INK}" stroke-width="6"/>`,
  smile: (a) =>
    `<circle cx="100" cy="100" r="82" fill="${a}"/><circle cx="72" cy="82" r="9" fill="${INK}"/><circle cx="128" cy="82" r="9" fill="${INK}"/><path d="M58 118 Q100 164 142 118" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`,
  bolt: (a) => `<polygon points="116,6 40,112 92,112 76,194 164,80 108,80" fill="${a}"/>`,
  heart: (a) => `<path d="M100 178 C20 118 24 50 66 40 C86 36 98 50 100 62 C102 50 114 36 134 40 C176 50 180 118 100 178Z" fill="${a}"/>`,
  flower: (a, b) =>
    `<g fill="${a}">${[0, 60, 120, 180, 240, 300].map((r) => `<ellipse cx="100" cy="52" rx="26" ry="38" transform="rotate(${r} 100 100)"/>`).join("")}</g><circle cx="100" cy="100" r="26" fill="${b}" stroke="${INK}" stroke-width="6"/>`,
  arrow: (a) => `<path d="M16 84 H110 V40 L186 100 L110 160 V116 H16Z" fill="${a}"/>`,
  eye: (a, b) =>
    `<path d="M10 100 Q100 20 190 100 Q100 180 10 100Z" fill="#fff"/><circle cx="100" cy="100" r="38" fill="${a}" stroke="${INK}" stroke-width="6"/><circle cx="100" cy="100" r="16" fill="${INK}"/><circle cx="110" cy="90" r="6" fill="${b}"/>`,
  cloud: (a) => `<path d="M52 150 C16 150 14 100 50 96 C54 56 112 48 128 84 C168 74 192 120 160 150Z" fill="${a}"/>`,
  star: (a) => `<polygon points="100,10 124,72 190,76 138,118 156,184 100,148 44,184 62,118 10,76 76,72" fill="${a}"/>`,
  tv: (a, b) =>
    `<rect x="24" y="52" width="152" height="112" rx="22" fill="${a}"/><rect x="42" y="68" width="92" height="80" rx="12" fill="${b}" stroke="${INK}" stroke-width="6"/><circle cx="154" cy="92" r="8" fill="${INK}"/><circle cx="154" cy="124" r="8" fill="${INK}"/><path d="M80 52 L56 20 M120 52 L144 20" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`,
};

/** `sticker("burst", "#ff6a3d", "#fff3c4")` → data URI listo para `<img src>` */
export function sticker(kind: StickerKind, main = "#ff6a3d", second = "#fff3c4"): string {
  const body = shapes[kind](main, second);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g transform="translate(6 7)" fill="${INK}" stroke="${INK}" stroke-width="10" stroke-linejoin="round" opacity=".92">${body.replace(/fill="[^"]*"/g, 'fill="#161616"')}</g><g stroke="${INK}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
