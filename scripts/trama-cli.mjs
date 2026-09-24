#!/usr/bin/env node
/**
 * CLI de Trama (se publica como `bin/trama.mjs`).
 *
 *   npx trama assets [carpeta-public]   copia los recursos pixel art (PixelFrame, Sprite) a public/pixel/…
 *   npx trama catalog                   imprime la ruta de CATALOG.md (referencia de props para agentes)
 */
import { cpSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const [cmd, arg] = process.argv.slice(2);

if (cmd === "assets") {
  const pub = resolve(arg ?? "public");
  const from = join(pkgRoot, "assets/pixel/kenney-pixel-ui");
  const to = join(pub, "pixel/kenney-pixel-ui");
  cpSync(from, to, { recursive: true });
  console.log(`✓ recursos pixel art copiados a ${to} (los usan PixelFrame y Sprite; licencia CC0)`);
} else if (cmd === "catalog") {
  const p = join(pkgRoot, "CATALOG.md");
  console.log(existsSync(p) ? p : "CATALOG.md no encontrado en el paquete");
} else {
  console.log("Uso:\n  npx trama assets [carpeta-public]   copia los recursos de PixelFrame/Sprite a public/pixel/\n  npx trama catalog                   ruta de CATALOG.md (props de todos los componentes)");
  process.exit(cmd ? 1 : 0);
}
