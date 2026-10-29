/** Captura la referencia local de boutique en un consumidor ya construido; servidor y navegador propios. */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium, type Browser } from "playwright";
import { chromiumPath } from "./chromium-path.mts";

const consumer = resolve(process.argv[2] ?? ".cache/agent-pilot-boutique");
const out = resolve(".refs3d/agent-boutique");
const origin = "http://127.0.0.1:3433";
const install = JSON.parse(readFileSync(join(consumer, "pilot-install.json"), "utf8"));
assert.equal(install.suite, "boutique", "Preparar con agents:pilot -- <destino nuevo> --suite boutique");
try { await fetch(origin, { signal: AbortSignal.timeout(1000) }); throw new Error("Puerto 3433 ocupado"); }
catch (e) { if (String(e).includes("ocupado")) throw e; }
mkdirSync(out, { recursive: true });
const server = spawn(process.execPath, [join(consumer, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", "3433"], { cwd: consumer, windowsHide: true, stdio: "ignore" });
let browser: Browser | undefined;
try {
  let ready = false;
  for (let i = 0; i < 60 && !ready; i++) {
    assert.equal(server.exitCode, null, "El servidor terminó antes de estar disponible");
    try { ready = (await fetch(origin)).ok; } catch { /* arrancando */ }
    if (!ready) await new Promise((done) => setTimeout(done, 500));
  }
  assert(ready);
  browser = await chromium.launch({ executablePath: chromiumPath() });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: "es-ES", reducedMotion: "reduce" });
  await page.addInitScript("window.__name = f => f");
  assert.equal((await page.goto(origin, { waitUntil: "networkidle" }))?.status(), 200);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator("[data-guide]").getAttribute("data-guide"), "boutique");
  const title = await page.locator("h1").boundingBox(), image = await page.locator("main img").boundingBox();
  assert(title && image && title.x < image.x && image.x - title.x > 100);
  const measured = await page.evaluate(() => {
    const h = document.querySelector("h1")!, frame = document.querySelector("[data-guide]")!;
    return { title: h.textContent, display: getComputedStyle(h).fontFamily, body: getComputedStyle(frame).fontFamily,
      tokens: Object.fromEntries(["bg", "fg", "mut", "acc", "card"].map((t) => [t, getComputedStyle(frame).getPropertyValue(`--${t}`).trim()])) };
  });
  const desktop = join(out, "reference-hero.png");
  await page.screenshot({ path: desktop, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  const mobileTitle = await page.locator("h1").boundingBox(), mobileImage = await page.locator("main img").boundingBox();
  assert(mobileTitle && mobileImage && mobileImage.y >= mobileTitle.y + mobileTitle.height);
  await page.screenshot({ path: join(out, "reference-mobile.png"), fullPage: true });
  const evidence = { at: new Date().toISOString(), origin, install, measured, referenceSha256: createHash("sha256").update(readFileSync(desktop)).digest("hex"), authorship: "Compás es un estudio ficticio. Referencia e ilustración originales locales; no es una web externa ni una réplica." };
  writeFileSync(join(out, "reference-evidence.json"), JSON.stringify(evidence, null, 2) + "\n");
  console.log(JSON.stringify(evidence, null, 2));
} finally { await browser?.close(); server.kill(); }
