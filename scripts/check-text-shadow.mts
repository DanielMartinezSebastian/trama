/**
 * Comprueba que ningún CSS del repo ponga una sombra de texto que estorbe con texto oscuro sobre fondo claro.
 *
 * Reglas (ver «Sombras de texto» en la guía §8.1):
 *   1. Nada de sombras negras fijas (`#000`, `black`, `rgba(0,0,0,…)`): con texto oscuro empastan las letras. Usa un halo
 *      del color del fondo del tema: `color-mix(in srgb, var(--bg) 90%, transparent)`, o `var(--legibility-ts)`.
 *   2. Un brillo con un color del tema (`var(--acc)`, `var(--fg)`, `var(--tone)`…) tiene que escalarse con `--glow`
 *      (0 con texto oscuro; lo fija `tokensToStyle`): `calc(8px * var(--glow, 1))`.
 * Excepción justificada: añade `shadow-ok` en un comentario de la misma regla (p. ej. un terminal que es oscuro por diseño).
 *
 *   npm run check:shadows
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components"];
const bad: string[] = [];

function walk(dir: string, out: string[] = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".css")) out.push(p);
  }
  return out;
}

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      if (!/text-shadow\s*:/.test(line) || /shadow-ok/.test(line)) return;
      const decls = [...line.matchAll(/text-shadow\s*:\s*([^;}]*)/g)].map((m) => m[1]);
      for (const raw of decls) {
        // el `#000` de reserva dentro de var(--bg, #000) no es una sombra negra fija
        // el halo de legibilidad con su reserva calculada con --bg (ui-kit.css) cuenta como var(--legibility-ts)
        const d = raw.replace(/var\(--legibility-ts, 0 0 transparent\)/g, "var(--legibility-ts)").replace(/var\(--bg\s*,\s*#000\)/g, "var(--bg)");
        if (/^\s*(none|var\(--(s-ts|s-pri-ts|legibility-ts)\)(\s*,\s*var\(--(s-ts|legibility-ts)\))?)\s*$/.test(d)) continue;
        if (/#000\b|#000000|\bblack\b|rgba?\(\s*0\s*,\s*0\s*,\s*0/.test(d)) bad.push(`${file}:${i + 1}  sombra negra fija → usa un halo del color de fondo (--bg) o var(--legibility-ts)`);
        else if (/var\(--(acc2?|fg|tone|pr-tone|mut)\b/.test(d) && !/--glow/.test(d)) bad.push(`${file}:${i + 1}  brillo con color del tema sin escalar por --glow → calc(Npx * var(--glow, 1))`);
      }
    });
  }
}

if (bad.length) {
  console.error(`✗ ${bad.length} sombra(s) de texto problemática(s):\n  - ${bad.join("\n  - ")}`);
  process.exit(1);
}
console.log("✓ sombras de texto: ninguna negra fija ni brillo sin --glow");
