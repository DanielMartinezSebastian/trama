import type { CSSProperties } from "react";

type RGB = [number, number, number];

/** Colores sRGB opacos; las expresiones CSS dinámicas se dejan a su autor. */
function rgb(css: string): RGB | null {
  const value = css.trim().toLowerCase();
  if (value === "black") return [0, 0, 0];
  if (value === "white") return [255, 255, 255];
  const hex = /^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.exec(value);
  if (hex) {
    const full = hex[1].length <= 4 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    if (full.length === 8 && full.slice(6) !== "ff") return null;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as RGB;
  }
  const fn = /^rgba?\(([^)]+)\)$/.exec(value);
  if (!fn) return null;
  const parts = fn[1].trim().split(/[\s,/]+/);
  if (parts.length !== 3 && parts.length !== 4) return null;
  if (parts.length === 4 && !["1", "1.0", "100%"].includes(parts[3])) return null;
  const channels = parts.slice(0, 3).map((c) => c.endsWith("%") ? Number(c.slice(0, -1)) * 255 / 100 : Number(c));
  return channels.every((c) => Number.isFinite(c) && c >= 0 && c <= 255) ? channels as RGB : null;
}

function luminance(color: RGB): number {
  const linear = color.map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function ratio(a: RGB, b: RGB): number {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Ajusta lo mínimo hacia negro o blanco; comprueba el color sRGB redondeado que se va a emitir. */
export function textColorOn(color: string, background: string): string | null {
  const ink = rgb(color), paper = rgb(background);
  if (!ink || !paper) return null;
  if (ratio(ink, paper) >= 4.5) return color;
  const candidates = ([0, 255] as const).flatMap((end) => {
    if (ratio([end, end, end], paper) < 4.5) return [];
    const mix = (amount: number) => ink.map((c) => Math.round(c + (end - c) * amount)) as RGB;
    let lo = 0, hi = 1;
    for (let i = 0; i < 32; i++) {
      const mid = (lo + hi) / 2;
      if (ratio(mix(mid), paper) >= 4.5) hi = mid;
      else lo = mid;
    }
    const result = mix(hi);
    return [{ result, distance: result.reduce((sum, c, i) => sum + (c - ink[i]) ** 2, 0) }];
  });
  candidates.sort((a, b) => a.distance - b.distance);
  const result = candidates[0]?.result;
  return result ? `#${result.map((c) => c.toString(16).padStart(2, "0")).join("")}` : null;
}

/** Alias de texto: no sustituye los tokens medidos ni interpreta var(), transparencias o imágenes. */
export function textContrastStyle(style: CSSProperties): CSSProperties {
  const vars = style as Record<string, unknown>;
  const bg = vars["--bg"];
  if (typeof bg !== "string") return {};
  return Object.fromEntries(["mut", "acc"].flatMap((role) => {
    const value = vars[`--${role}`];
    const adjusted = typeof value === "string" ? textColorOn(value, bg) : null;
    return adjusted ? [[`--${role}-text`, adjusted]] : [];
  })) as CSSProperties;
}
