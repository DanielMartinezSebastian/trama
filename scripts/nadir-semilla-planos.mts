/** Rasterize generated construction SVGs with the installed browser. */
import { chromium } from "playwright";
import { chromiumPath } from "./chromium-path.mts";
const origin = process.argv[2] ?? "http://localhost:3020";
const browser = await chromium.launch({ executablePath: chromiumPath() });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1 });
  for (const name of ["01-ortograficas", "02-despiece", "03-apertura"]) {
    const response = await page.goto(`${origin}/models/nadir-semilla/${name}.svg`, { waitUntil: "networkidle" });
    if (response?.status() !== 200) throw new Error(`Missing drawing: ${name}`);
    await page.screenshot({ path: `public/models/nadir-semilla/${name}.png` });
  }
} finally { await browser.close(); }
