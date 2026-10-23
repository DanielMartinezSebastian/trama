import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

/**
 * Ruta de un Chromium utilizable por Playwright (la comparten `refs:probe` y `cine:capture`): el de Playwright si está
 * instalado, el de la variable PLAYWRIGHT_CHROMIUM, o el más reciente de la caché (%LOCALAPPDATA%\ms-playwright o
 * ~/.cache/ms-playwright). `undefined` = el que trae Playwright.
 */
export function chromiumPath(): string | undefined {
  if (process.env.PLAYWRIGHT_CHROMIUM) return process.env.PLAYWRIGHT_CHROMIUM;
  if (existsSync(chromium.executablePath())) return undefined;
  const cache = process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, "ms-playwright") : join(homedir(), ".cache", "ms-playwright");
  if (!existsSync(cache)) return undefined;
  const dirs = readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));
  for (const d of dirs) {
    for (const rel of ["chrome-win64/chrome.exe", "chrome-linux/chrome", "chrome-linux64/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium"]) {
      const p = join(cache, d, rel);
      if (existsSync(p)) return p;
    }
  }
  return undefined;
}
