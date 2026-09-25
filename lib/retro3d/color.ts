import { Color, SRGBColorSpace } from "three";

let ctx: CanvasRenderingContext2D | null = null;

/**
 * Convierte cualquier color CSS (hex, rgb(), oklch(), color-mix(), nombres…) en un `Color` de three. Se apoya en el propio
 * navegador —pintando un píxel— porque los tokens del tema pueden venir en formatos que `Color.set` no entiende.
 */
export function cssToColor(css: string, fallback: string): Color {
  ctx ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const out = new Color();
  if (!ctx) return out.set(fallback);
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = fallback;
  ctx.fillStyle = css; // un valor inválido deja el anterior (el fallback)
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return out.setRGB(r / 255, g / 255, b / 255, SRGBColorSpace);
}
