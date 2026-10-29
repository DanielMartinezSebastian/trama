import assert from "node:assert/strict";
import type { CSSProperties } from "react";
import GuideFrame from "../components/ui/GuideFrame";
import { STYLE_GUIDES, guideToStyle } from "../lib/ui/guides";
import { textColorOn } from "../lib/ui/text-contrast";

// Fórmula independiente sobre los colores hex de las guías, sin redondear el ratio de aceptación.
function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
  };
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
const snapshot = JSON.stringify(STYLE_GUIDES);
for (const guide of STYLE_GUIDES) {
  const base = guideToStyle(guide);
  assert.deepEqual(GuideFrame({ guide, children: null }).props.style, base, "Sin opt-in conserva el style original");
  const actual = GuideFrame({ guide, textContrast: true, children: null }).props.style as Record<string, string>;
  for (const role of ["mut", "acc"] as const) {
    assert.equal(actual[`--${role}`], guide.tokens[role], "No cambia la decoración");
    assert(contrast(actual[`--${role}-text`], guide.tokens.bg) >= 4.5, `${guide.id}/${role}`);
    if (contrast(guide.tokens[role], guide.tokens.bg) >= 4.5) assert.equal(actual[`--${role}-text`], guide.tokens[role]);
  }
}
assert.equal(JSON.stringify(STYLE_GUIDES), snapshot, "Guías medidas intactas");
// Casos oscuros, claros y el umbral que redondeado parece 4,5 pero todavía no cumple.
for (const [ink, bg] of [["#777777", "#ffffff"], ["#666666", "#000000"], ["#888888", "#777777"], ["#f5a490", "#ffffff"]]) {
  assert(contrast(textColorOn(ink, bg)!, bg) >= 4.5);
}
assert.equal(textColorOn("#777", "white"), textColorOn("rgb(119 119 119)", "#ffffffff"));
assert.equal(textColorOn("rgba(119, 119, 119, 1)", "#fff"), textColorOn("#777777", "#ffffff"));
for (const css of ["var(--brand)", "transparent", "#fff8", "rgba(1,2,3,0.5)", "rgb(999,0,0)", "hsl(0 0% 50%)"]) {
  assert.equal(textColorOn(css, "#ffffff"), null);
  assert.equal(textColorOn("#777777", css), null);
}
const style = { "--bg": "#000000", "--mut": "#333333", "--acc": "#444444" } as CSSProperties;
const overridden = GuideFrame({ guide: "salon", textContrast: true, style, children: null }).props.style as Record<string, string>;
assert(contrast(overridden["--mut-text"], "#000000") >= 4.5, "Calcula después de style");
const explicit = GuideFrame({ textContrast: true, style: { "--acc-text": "rebeccapurple" } as CSSProperties, children: null }).props.style as Record<string, string>;
assert.equal(explicit["--acc-text"], "rebeccapurple", "style conserva la última palabra");
console.log("✓ textContrast: 19 guías, umbral sin redondear, fondos claros/oscuros, overrides, formatos y ausencia de mutaciones");
